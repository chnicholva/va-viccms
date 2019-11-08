/// <reference path="../../JScript/VCCM.USDHelper.js" />
var configData = null;

function doLoad() {
    //put onLoad logic here
    configData = null;
    configData = parseDataParametersFromUrl(location.search);
    //example config object: {sourceEntityLogicalName: "Incident", sourceEntityId: "8315a3cd-bced-e411-9402-00155d14e625", sourceEntityLookupFieldName: "CustomerId", targetEntityName: "Contact" }
    if (!!configData.routingType) {
        var routingtypestring = configData.routingType.toString().toLowerCase();
        switch (routingtypestring) {
            case "dashboard":
                routeDashboardRecordToTargetEntity(configData);
                break;
            case "cti":
                //routeCTIURL(configData);
                //this piece of onLoad logic has been deprecated in favor going directly to the routeCTIurl() function via 'RunScript' action calls for CTI scenarios, instead of 'Navigate' action calls
                break;
            default:
                //for now (2/21/2018) just use default behavior:
                routeDashboardRecordToTargetEntity(configData);
                break;
        }
    }
    else {
        //do nothing.
    }
}

function parseDataParametersFromUrl(pQueryString) {
    var configObject = {};
    try {
        var fullParameterArray = pQueryString.substr(1).split("&");

        //clean up the URL query string and split each member into a key/value pair
        for (var i in fullParameterArray) {
            fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
        }

        var customDataString = "";
        for (var i in fullParameterArray) {
            if (fullParameterArray[i][0].toLowerCase() == "data") {
                customDataString = fullParameterArray[i][1];
                break;
            }
        }

        var customDataArray = decodeURIComponent(customDataString).split("&");
        for (var i in customDataArray) {
            customDataArray[i] = customDataArray[i].replace(/\+/g, " ").split("=");
        }

        for (var i in customDataArray) {
            var thisValue = customDataArray[i][1];
            if (thisValue === "null") {
                thisValue = null;
            }
            configObject[customDataArray[i][0]] = thisValue;
        }
    }
    catch (e) {
        alert(e.message);
    }
    return configObject;
}

function routeDashboardRecordToTargetEntity(pConfigData) {
    if (!!pConfigData &&
        pConfigData.hasOwnProperty("sourceEntityLogicalName") && !!pConfigData.sourceEntityLogicalName &&
        pConfigData.hasOwnProperty("sourceEntityId") && !!pConfigData.sourceEntityId &&
        pConfigData.hasOwnProperty("sourceEntityLookupFieldName") && !!pConfigData.sourceEntityLookupFieldName &&
        pConfigData.hasOwnProperty("targetEntityName") && !!pConfigData.targetEntityName
    ) {
        var selectString = pConfigData.hasOwnProperty("ODataSelect") && !!pConfigData.ODataSelect ? pConfigData.ODataSelect : "";
        selectString += (selectString.indexOf(pConfigData.sourceEntityLookupFieldName) > -1) ? "" : (selectString == "" ? pConfigData.sourceEntityLookupFieldName : "," + pConfigData.sourceEntityLookupFieldName);
        var expandString = pConfigData.hasOwnProperty("ODataExpand") && !!pConfigData.ODataExpand ? pConfigData.ODataExpand : null;
        SDK.REST.retrieveRecord(
            pConfigData.sourceEntityId, /*record id*/
            pConfigData.sourceEntityLogicalName, /*entity*/
            selectString, /*select*/
            expandString, /*expand*/
            function (retrievedRecord) {
                if (!!retrievedRecord && !!retrievedRecord[pConfigData.sourceEntityLookupFieldName]) {
                    var entityReference = retrievedRecord[pConfigData.sourceEntityLookupFieldName];
                    var clientUrl = SDK.REST.hasOwnProperty("_getClientUrl") ? SDK.REST._getClientUrl() : SDK.REST._getServerUrl(); //account for older versions of SDK.REST.js library
                    if (pConfigData.targetEntityName.toLowerCase() == "contact") {
                        var parameters = [];
                        parameters.push("originatedFromMVISearch=false", "contactid=" + entityReference.Id);
                        if (getDeepProperty(pConfigData.ODataExpand + ".ftp_ManuallyCreatedFromMVICode.Value", retrievedRecord) == 100000001/*true*/) {
                            //handle routing to a Veteran who was manually created after a zero-result MVI search
                            parameters.push(
                                "ICN=MISSING",
                                "nationalid=MISSING",
                                "DFN=MISSING"
                            );
                        }
                        else {
                            //grab data from CRM to lessen requirements for unattended MVI search on Veteran Alerts page
                            parameters.push(
                                "ICN=" + getDeepProperty("ftp_CachedICNId.Name", retrievedRecord),
                                "CachedICNId=" + getDeepProperty("ftp_CachedICNId.Id", retrievedRecord),
                                "isSensitive=" + getDeepProperty(pConfigData.ODataExpand + ".ftp_SensitiveVeteran", retrievedRecord),
                                "deceasedDate=" + getDeepProperty(pConfigData.ODataExpand + ".ftp_DeceasedDate", retrievedRecord)
                            );
                        }

                        //grab contact name
                        if (getDeepProperty(pConfigData.ODataExpand + ".FullName", retrievedRecord) != undefined) {
                            parameters.push(
                                "fullname=" + getDeepProperty(pConfigData.ODataExpand + ".FullName", retrievedRecord),
                                "firstName=" + getDeepProperty(pConfigData.ODataExpand + ".FirstName", retrievedRecord),
                                "lastName=" + getDeepProperty(pConfigData.ODataExpand + ".LastName", retrievedRecord)
                            );
                        }

                        var wrURL = clientUrl + "/WebResources/ftp_/VeteranAlerts/VeteranAlerts.html?appid=955cda1c-27f0-e911-a994-001dd800951b&Data=" + encodeURIComponent(parameters.join("&"));
                        VCCM.USDHelper.CopyToUSDContext(["RoutedRecordCachedICNId=" + (convertNullToEmptyString(getDeepProperty("ftp_CachedICNId.Id", retrievedRecord)))]);
                        VCCM.USDHelper.OpenUSDURL(wrURL);
                    }
                    else {
                        var recordUrl = clientUrl + "/apps/vicccms/main.aspx?etn=" + pConfigData.targetEntityName.toLowerCase() + "&pagetype=entityrecord&id=%7b" + entityReference.Id + "%7d";
                        VCCM.USDHelper.OpenUSDURL(recordUrl);
                    }
                }
            },
            function (error) {
                //alert(error);
            }
        );
    }
    else {
        //don't have enough information; could throw alert or raise a USD event
    }
}

//functions for CTI logic
function parseCTIURLIntoObject(pURL) {
    if (!!pURL) {
        try {
            var urlObject = {};
            var urlAsArray = pURL.split("?");
            var basestring = urlAsArray[0],
                paramstring = urlAsArray[1];
            var params = paramstring.split("&");
            params.forEach(function (x, i) { params[i] = urlObject[x.split("=")[0]] = x.split("=")[1] });
            urlObject.base = basestring;

            //do some data massaging
            urlObject.ANI = !!urlObject.ANI ? urlObject.ANI : !!urlObject.CALLERID ? urlObject.CALLERID : "";
            delete urlObject.DIRECTION;

            return urlObject;
        }
        catch (e) {
            return {};
        }
    }
    else {
        return {};
    }
}
function routeCTIURL(pConfigData) {
    try {
        if (!!pConfigData.routedurl) {
            if (pConfigData.routedurl.toUpperCase() != (!!pConfigData.previousurl ? pConfigData.previousurl.toUpperCase() : "")) {
                pConfigData.routedCTIObject = parseCTIURLIntoObject(decodeURIComponent(pConfigData.routedurl.toUpperCase()));
                //var previousCTIObject = !!pConfigData.previousurl ? parseCTIURLIntoObject(decodeURIComponent(pConfigData.previousurl.toUpperCase())) : { SESSION: "", DIALOG: "", DIALOGSTATE: "", AGENTSTATE: "" };
                if (!!pConfigData.routedCTIObject.SESSION && !!pConfigData.routedCTIObject.DIALOG) {
                    if (pConfigData.routedCTIObject.hasOwnProperty("WRAPUPCODE") && !!pConfigData.routedCTIObject.WRAPUPCODE) {
                        handleWrapUpCode(pConfigData.routedCTIObject);
                    }
                    else {

                        //check what kind of CTI url has been routed...
                        var switchValue = (!!pConfigData.routedCTIObject.DIALOGSTATE ? pConfigData.routedCTIObject.DIALOGSTATE : "") + "," + (!!pConfigData.routedCTIObject.AGENTSTATE ? pConfigData.routedCTIObject.AGENTSTATE : "");
                        switch (switchValue) {
                            case "ALERTING,RESERVED":
                                //a call is 'ringing' on the user's Cisco Finesse interface
                                break;
                            case "ACTIVE,RESERVED":
                            /* //sometimes when picking up a call in the Finesse UI, this combination of DIALOGSTATE & AGENTSTATE gets passed
                            if(pConfigData.routedCTIObject.SESSION != pConfigData.LASTSESSIONPASSEDTOMVI && pConfigData.routedCTIObject.DIALOG != pConfigData.LASTDIALOGPASSEDTOMVI){
                                //pop an automatic MVI search
                                sendToMVISearch(pConfigData.routedCTIObject);
                            }
                            else{
                                //we've already routed this CTI popup to MVI search
                            }
                            break; */
                            case "ACTIVE,TALKING":
                                //user has has picked up a new call
                                if (pConfigData.routedCTIObject.SESSION != pConfigData.lastSessionPassedToMVI && pConfigData.routedCTIObject.DIALOG != pConfigData.lastDialogPassedToMVI) {
                                    //pop an automatic MVI search
                                    sendToMVISearch(pConfigData.routedCTIObject);
                                }
                                else {
                                    //we've already routed this CTI popup to MVI search
                                }
                                break;
                            case "ACTIVE,WORK":
                                //user has hung up w/ caller and is selecting a wrap up code
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            else {
                //we've already seen this exact CTI url and determined (previously) whether or not to route it
            }
        }
        else {
            //no url passed to page
            alert("Message from CTI Helper: CTI routing configuration error... missing pConfigData.routedurl value!");
            console.error("missing pConfigData.routedurl value!");
        }
    }
    catch (e) {
        alert(e.message);
    }
}
function sendToMVISearch(pCTIObject) {
    //Navigate to the routed CTI url using the CTI Helper 2 hosted control, which will in turn be routed by a CTI window navigation rule, which starts a USD session and opens MVI Search.
    //rebuild the CTI url using only select components of the original routedurl
    try {
        var possibleCTIObjectAttributes = [
            { part: "AGENTID", required: false },
            { part: "AGENTSTATE", required: false },
            { part: "ANI", required: false },
            { part: "CALLERID", required: false },
            { part: "CSQNAME", required: false },
            { part: "CSQNUMBER", required: false },
            { part: "DIALOG", required: false },
            { part: "DIALOGSTATE", required: false },
            { part: "DOB", required: true },
            { part: "SESSION", required: false },
            { part: "SSN", required: true },
            { part: "TYPE", required: false },
            { part: "LASTDIALOGPASSEDTOMVI", required: false },
            { part: "LASTSESSIONPASSEDTOMVI", required: false }
        ];
        var newURL = pCTIObject.base + "?";
        possibleCTIObjectAttributes.forEach(function (p, i) {
            if (p.required) {
                if (!!pCTIObject[p.part]) {
                    newURL += (i > 0 ? "&" : "") + p.part + "=" + pCTIObject[p.part];
                }
                else {
                    alert("Missing CTI parameter required for MVI Search: " + p.part);
                    console.error("Missing CTI parameter required for MVI Search: " + p.part);
                    return;
                }
            }
            else {
                newURL += !!pCTIObject[p.part] ? ((i > 0 ? "&" : "") + p.part + "=" + pCTIObject[p.part]) : "";
            }
        });
        VCCM.USDHelper.CopyDataToReplacementParameters(
            "Cisco",
            ["lastDialogPassedToMVI=" + pCTIObject.DIALOG, "lastSessionPassedToMVI=" + pCTIObject.SESSION],
            true,
            function () {
                VCCM.USDHelper.CallUSDAction("CTI Helper 2", "Navigate", "url=" + newURL);
            }
        );
    }
    catch (e) {
        alert(e.message);
    }
}
function handleWrapUpCode(pCTIObject) {
    if (pCTIObject.WRAPUPCODE != "UNDEFINED") {
        //user has "applied" a wrapup code and left the 'Working' state by selecting the 'Ready' or some other 'Not Ready' state in their Cisco Finesse interface
        VCCM.USDHelper.OpenUSDURL("http://event/?eventname=WrapUpCodeSelected"
            + "&session=" + pCTIObject.SESSION
            + "&dialog=" + pCTIObject.DIALOG
            + "&wrapupcode=" + pCTIObject.WRAPUPCODE
        );
    }
}

//helper functions
function convertNullToEmptyString(pInput) {
    return pInput == null ? "" : pInput;
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function log(pMessage) {
    var logdiv = document.getElementById("log");
    if (!!logdiv) {
        var currentText = logdiv.innerHTML;
        logdiv.innerHTML = currentText + "<br/>" + pMessage;
        window.scrollTo(0, document.body.scrollHeight);
    }
}