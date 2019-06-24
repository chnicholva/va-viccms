var configData = null,
    context = null,
    retrievedSettings = null,
    secureWebPartRenderMethod = "HTMLFORM";
var addedHandler = false;

var secureChartCounter = 0;

var buttonConfigurations = {};

var lastButtonConfig = null;

$(document).ready(function () {

    $("#displayframe").load(
        function () {
            console.log("displayframe loaded");
            showDiv("#framediv");
        }
    );

    //setup global objects...
    context = getContext();
    configData = null;
    parseDataParametersFromUrl(location.search);

});

function loadButtons() {
    buttonConfigurations = {
        btnSCD: {
            id: "btnSCD",
            title: "SC Disabilities",
            secure: false,
            unsecureURLFieldName: "",
            secureURLFieldName: "",
            url: context.getClientUrl() + "/WebResources/ftp_/ServConnDisabilitiesGrid/ServConnDisabilitiesGrid.html?data=" + configData.ICN
        },
        btnProblems: {
            id: "btnProblems",
            title: "Problems",
            unsecureURLFieldName: "patsr_ProblemChartURL",
            secureURLFieldName: "patsr_ProblemChartSecureURL",
            secure: false,
            url: ""
        },
        btnNotes: {
            id: "btnNotes",
            title: "Notes",
            unsecureURLFieldName: "patsr_NoteChartURL",
            secureURLFieldName: "patsr_NoteChartSecureURL",
            secure: false,
            url: ""
        },
        btnOrders: {
            id: "btnOrders",
            title: "Orders",
            unsecureURLFieldName: "patsr_OrderChartURL",
            secureURLFieldName: "patsr_OrderChartSecureURL",
            secure: false,
            url: ""
        },
        btnAppointments: {
            id: "btnAppointments",
            title: "Appointments",
            unsecureURLFieldName: "patsr_AppointmentChartURL",
            secureURLFieldName: "patsr_AppointmentChartSecureURL",
            secure: false,
            url: ""
        },
        btnMedications: {
            id: "btnMedications",
            title: "Medications",
            unsecureURLFieldName: "patsr_MedicationsChartURL",
            secureURLFieldName: "patsr_MedicationsChartSecureURL",
            secure: false,
            url: ""
        },
        btnPostings: {
            id: "btnPostings",
            title: "Postings",
            unsecureURLFieldName: "patsr_PostingChartURL",
            secureURLFieldName: "patsr_PostingChartSecureURL",
            secure: false,
            url: ""
        },
        btnAllergies: {
            id: "btnAllergies",
            title: "Allergies",
            unsecureURLFieldName: "patsr_AllergyChartURL",
            secureURLFieldName: "patsr_AllergyChartSecureURL",
            secure: false,
            url: ""
        },
        btnLabs: {
            id: "btnLabs",
            title: "Labs",
            unsecureURLFieldName: "patsr_LabChartURL",
            secureURLFieldName: "patsr_LabChartSecureURL",
            secure: false,
            url: ""
        },
        btnConsults: {
            id: "btnConsults",
            title: "Consults",
            unsecureURLFieldName: "patsr_ConsultChartURL",
            secureURLFieldName: "patsr_ConsultChartSecureURL",
            secure: false,
            url: ""
        },
        btnNonVAMeds: {
            id: "btnNonVAMeds",
            title: "Non-VA Meds",
            unsecureURLFieldName: "patsr_NonVAChartURL",
            secureURLFieldName: "patsr_NonVAChartSecureURL",
            secure: false,
            url: ""
        },
        btnVitals: {
            id: "btnVitals",
            title: "Vitals",
            unsecureURLFieldName: "patsr_VitalsChartURL",
            secureURLFieldName: "patsr_VitalsChartSecureURL",
            secure: false,
            url: ""
        },
        btnRadiology: {
            id: "btnRadiology",
            title: "Imaging",
            unsecureURLFieldName: "patsr_RadiologyChartURL",
            secureURLFieldName: "patsr_RadiologyChartSecureURL",
            secure: false,
            url: ""
        },
        btnDischarges: {
            id: "btnDischarges",
            title: "Discharges",
            unsecureURLFieldName: "patsr_DischargeURL",
            secureURLFieldName: "patsr_DischargeChartSecureURL",
            secure: false,
            url: ""
        }
    };

    retrievedSettings = null;
    var queryString = "$select=*&$filter=patsr_name eq 'Active Settings'";
    if (!!configData && configData.hasOwnProperty("ICN") && !!configData.ICN) {
        SDK.REST.retrieveMultipleRecords(
            "patsr_setting",
            queryString,
            function (retrievedRecords) {
                if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
            },
            errorHandler,
            function () {
                initializeButtons();
            }
        );
    }
    else {
        alert("Invalid URL parameters.");
    }

}
function initializeButtons() {
    if (!!retrievedSettings) {
        if (retrievedSettings.hasOwnProperty("patsr_VEISPresentationUrl") && !!retrievedSettings.patsr_VEISPresentationUrl) {
            $("#sidebar").html("");
            var filter = retrievedSettings.hasOwnProperty("patsr_Filter") && !!retrievedSettings.patsr_Filter ? retrievedSettings.patsr_Filter : "";
            //initialize buttons
            for (var thisButtonConfigId in buttonConfigurations) {
                if (buttonConfigurations.hasOwnProperty(thisButtonConfigId)) {
                    var thisButtonConfig = buttonConfigurations[thisButtonConfigId];
                    if (thisButtonConfig.secure == true) {
                        if (!!thisButtonConfig.secureURLFieldName) {
                            if (!!retrievedSettings[thisButtonConfig.secureURLFieldName]) {
                                thisButtonConfig.url = retrievedSettings.patsr_VEISPresentationUrl + retrievedSettings[thisButtonConfig.secureURLFieldName];
                            }
                            else {
                                thisButtonConfig.url = "";
                            }
                        }
                    }
                    else {
                        if (!!thisButtonConfig.unsecureURLFieldName) {
                            if (!!retrievedSettings[thisButtonConfig.unsecureURLFieldName]) {
                                thisButtonConfig.url = retrievedSettings.patsr_VEISPresentationUrl + retrievedSettings[thisButtonConfig.unsecureURLFieldName] + configData.ICN + filter;
                            }
                            else {
                                thisButtonConfig.url = "";
                            }
                        }
                    }

                    //create html button w/ corresponding ID
                    $("#sidebar").append("<button class='button' id='" + thisButtonConfigId + "' onclick='setChartSource(this);'>" + thisButtonConfig.title + "</button>");
                }
            }
            $("#loadingGifDiv").hide(100);
        }
    }
}
function reloadChartSource(additionalParams) {
    setChartSourceFromButtonConfig(lastButtonConfig, additionalParams);
}
function setChartSource(pElement) {
    if (!!pElement.id) {
        var thisButtonConfig = buttonConfigurations[pElement.id];
        setChartSourceFromButtonConfig(thisButtonConfig, "");
    }
}
function setChartSourceFromButtonConfig(thisButtonConfig, additionalParams) {
    if (!!thisButtonConfig) {
        if (!!thisButtonConfig.url) {
            lastButtonConfig = thisButtonConfig;
            $("#framediv").hide(100);
            showLoadingMessage("Loading " + thisButtonConfig.title + "...");
            console.log("loading unsecure chart in displayframe: " + thisButtonConfig.url + additionalParams);
            //for unsecure web parts, set iFrame src directly

            $('#displayframe').attr({
                title: thisButtonConfig.title
            });
            if (thisButtonConfig.unsecureURLFieldName == "" && thisButtonConfig.secureURLFieldName == "") {

                var iFrame = $('#thechart');
                if (iFrame != null && iFrame !== undefined) {
                    iFrame.remove();
                }
                iFrame = $('<iframe id="thechart" style="width:100%;height:100%; border: 0;" src="' + thisButtonConfig.url + '"></iframe>');
                $('#framediv').append(iFrame);
                iFrame.load(function () {
                    showDiv("#framediv");
                    $("#loadingGifDiv").hide(100);
                });

            }
            else {
                $.ajax({
                    url: thisButtonConfig.url + additionalParams,
                    type: "GET",
                    dataType: "text",
                    beforeSend: function (xhr) { 
						var subKeys = retrievedSettings.patsr_MVISubscriptionKey;
						var keys = subKeys.split("|");
						for(var i =0; i<keys.length;i = i+2) {
							xhr.setRequestHeader(keys[i], keys[i+1]); 
						}
					},
                    success: function (data) {
                        data = data.replace(new RegExp('/Content/', 'g'), retrievedSettings.patsr_VEISContentSiteURL + 'Content/');
                        data = data.replace(new RegExp('/Scripts/', 'g'), retrievedSettings.patsr_VEISContentSiteURL + 'Scripts/');
                        data = data.replace(new RegExp('window.location.href', 'g'), "'" + thisButtonConfig.url + additionalParams + "'");
                        data = data.replace("url: url,", "url: url,  beforeSend: function (xhr) { "+
							"var subKeys = '"+ retrievedSettings.patsr_MVISubscriptionKey + "';"+
							"var keys = subKeys.split(\"|\");"+
							"for(var i =0; i<keys.length;i = i+2) { xhr.setRequestHeader(keys[i], keys[i+1]); }"+
							"},"
						);
                        data = data.replace("\"btnCreateAddend\"", "\"btnCreateAddend\" style=\"display:none\"");
                        data = data.replace("\"btnNotesSigner\"", "\"btnNotesSigner\" style=\"display:none\"");
                        data = data.replace("\"btnAddSigner\"", "\"btnAddSigner\" style=\"display:none\"");
                        //inject our js into this doc
                        data = data.replace(retrievedSettings.patsr_VEISContentSiteURL + "Scripts/Views/WidgetDateFilter.js", context.getClientUrl() + "/WebResources/patsr_/Veteran/JScript/datefilter.js");
                        var iFrame = $('#thechart');
                        if (iFrame != null && iFrame !== undefined) {
                            iFrame.remove();
                        }
                        iFrame = $('<iframe id="thechart" style="width:100%;height:100%; border: 0;"></iframe>');
                        $('#framediv').append(iFrame);
                        iFrameDoc = iFrame[0].contentDocument || iFrame[0].contentWindow.document;
                        iFrameDoc.write(data);
                        iFrameDoc.close();
                        iFrame.load(function () {
                            showDiv("#framediv");
                            $("#loadingGifDiv").hide(100);
                        });
                    },
                    error: function (e) {
                        $("#loadingGifDiv").hide(100);
                    }
                });

            }

        }
        else {
            var fieldName = thisButtonConfig.secure == true ? thisButtonConfig.secureURLFieldName : thisButtonConfig.unsecureURLFieldName;
            showErrorMessage("Could not find a URL in the " + fieldName + " field of the Active Settings record.", "Have your CRM administrator check Active Settings.", "Configuration Error");
        }
    }

}
function openNewAddendumForm(pNoteVistAId) {
    //open patsr_addendum form to create new addendum attached to note in VistA
    if (typeof pNoteVistAId == "string") {
        var newAddendumUrl = context.getClientUrl() + "/main.aspx?etn=patsr_addendum&pagetype=entityrecord";
        var extraQs = "&extraqs=";
        extraQs += encodeURIComponent("patsr_vistanoteid=" + pNoteVistAId);
        if (!!configData && configData.hasOwnProperty("contactid") && !!configData.contactid && configData.hasOwnProperty("fullname") && !!configData.fullname) {
            extraQs += encodeURIComponent("&patsr_veteran=" + configData.contactid + "&patsr_veteranname=" + configData.fullname);
        }
        window.open(newAddendumUrl + extraQs);
    }
}

function openCRMRecordForAdditionalSigners(pVistaRecordId, pEntitySchemaName, pVistaIdFieldName, pContactLookupFieldName) {
    //deprecated
    return;
    if (!!pVistaRecordId && !!pEntitySchemaName && !!pVistaIdFieldName) {
        showLoadingMessage("Searching for " + (pEntitySchemaName == "patsr_progressnote" ? "note" : "addendum") + " in CRM...");
        var retrievedRecord = null;
        var queryString = "$select=ActivityId&$filter=" + pVistaIdFieldName + " eq '" + pVistaRecordId + "'";
        SDK.REST.retrieveMultipleRecords(
            pEntitySchemaName,
            queryString,
            function (retrievedRecords) {
                if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedRecord = retrievedRecords[0];
            },
            errorHandler,
            function () {
                if (!!retrievedRecord) {
                    var existingRecordUrl = context.getClientUrl() + "/main.aspx?etn=" + pEntitySchemaName.toLowerCase() + "&pagetype=entityrecord&id=%7b" + retrievedRecord.ActivityId + "%7d";
                    window.open(existingRecordUrl);
                    $("#loadingGifDiv").hide(100);
                }
                else {
                    showLoadingMessage("Did not find record in CRM; creating placeholder record...");
                    //create the record first in CRM, then open it so we can integrate some signers
                    //specify a special form that just has Signers assets on it? Not today!
                    //connect it to the veteran of the current USD session.

                    var newRecord = {
                        Subject: "Placeholder CRM record for existing VistA note"
                    };
                    newRecord[pVistaIdFieldName] = pVistaRecordId; //string
                    if (!!configData && configData.hasOwnProperty("contactid") && !!configData.contactid && configData.hasOwnProperty("fullname") && !!configData.fullname && !!pContactLookupFieldName) {
                        newRecord[pContactLookupFieldName] = {
                            Id: configData.contactid,
                            Name: configData.fullname,
                            LogicalName: "contact"
                        };
                    }

                    SDK.REST.createRecord(
                        newRecord,
                        pEntitySchemaName,
                        function (createdRecord) {
                            var newRecordUrl = context.getClientUrl() + "/main.aspx?etn=" + pEntitySchemaName.toLowerCase() + "&pagetype=entityrecord&id=%7b" + createdRecord.ActivityId + "%7d";
                            window.open(newRecordUrl);
                            showDiv("#framediv");
                        },
                        errorHandler
                    );
                }
            }
        );
    }
}

function openNewAdditionalSignerForm(pVistaRecordId, pVistaRecordType) {
    //create placeholder patsr_additionalsigner record, then open it to give user an interface for selecting usrs and adding them to the current note/addendum
    if (typeof pVistaRecordId == "string" && typeof pVistaRecordType == "string") {
        var newRecord = {
            Subject: ("Additional Signers for existing VistA " + pVistaRecordType + ": " + pVistaRecordId.toString()),
            ftp_VistARecordID: pVistaRecordId,
            ftp_VistARecordType: { Value: (pVistaRecordType == "note" ? 100000000 : 100000001) }
        };
        if (!!configData && configData.hasOwnProperty("contactid") && !!configData.contactid && configData.hasOwnProperty("fullname") && !!configData.fullname) {
            newRecord.ftp_VeteranId = {
                Id: configData.contactid,
                //Name: configData.fullname,
                LogicalName: "contact"
            };
        }

        SDK.REST.createRecord(
            newRecord,
            "ftp_additionalsigner",
            function (createdRecord) {
                var newRecordUrl = context.getClientUrl() + "/main.aspx?etn=ftp_additionalsigner&pagetype=entityrecord&id=%7b" + createdRecord.ActivityId + "%7d";
                window.open(newRecordUrl);
                showDiv("#framediv");
            },
            errorHandler
        );

        // var newAdditionalSignerUrl = context.getClientUrl() + "/main.aspx?etn=ftp_additionalsigner&pagetype=entityrecord";
        // var extraQs = "&extraqs=";
        // extraQs += encodeURIComponent("subject=Additional Signers for existing VistA note or addendum");
        // extraQs += encodeURIComponent("&ftp_vistarecordid=" + pVistaRecordId);
        // extraQs += encodeURIComponent("&ftp_vistarecordtype=" + (pVistaRecordType == "note" ? 100000000 : 100000001));
        // if(!!configData && configData.hasOwnProperty("contactid") && !!configData.contactid && configData.hasOwnProperty("fullname") && !!configData.fullname){
        // extraQs += encodeURIComponent("&ftp_veteranid=" + configData.contactid + "&ftp_veteranidname=" + configData.fullname);
        // }
        // window.open(newAdditionalSignerUrl + extraQs);
    }
}

function loadMedsWithTracking() {
    //to load the medication chart that shows MHV tracking info, POST to the Medications API:
    // {Token (get from cookie), NationalId (ICN), Version ('2.0'), ClientName ('FtPCRM') }
    showLoadingMessage("Loading Medications with tracking...");
    $("#displayframe").attr({ src: "", title: "" }); //reset iFrame first
    try {
        /*as of 3/26/18, all MHV functionality has been deprecated.  configData.MHVID will always be empty.*/
        if (!!configData.MHVID) {
            if (!!configData.ICN) {
                //if (!!retrievedSettings.patsr_VEISPresentationUrl && !!retrievedSettings.ftp_MHVSessionAPIURL && !!retrievedSettings.ftp_MedicationsChartURL) {
                if (!!retrievedSettings.patsr_VEISPresentationUrl && !!retrievedSettings.ftp_MHVSessionAPIURL && !!retrievedSettings.ftp_MedicationsChartPOSTURL && !!retrievedSettings.ftp_POSTAPIClientName) {
                    VCCM.MHVHelper.GetSessionToken(
                        retrievedSettings.patsr_VEISPresentationUrl + retrievedSettings.ftp_MHVSessionAPIURL,
                        [configData.MHVID],
                        function (pMHVObject) {
                            if (!!pMHVObject && !!pMHVObject.Token) {
                                $("#framediv").hide(100);
                                showLoadingMessage("Loading Medications with tracking...");
                                //var medcharturlForPost = retrievedSettings.ftp_MedicationsChartURL.toLowerCase().replace("/1.0/ftpcrm/", "");
                                var postData = {
                                    Token: pMHVObject.Token,
                                    NationalID: configData.ICN,
                                    Version: "2.0",
                                    ClientName: retrievedSettings.ftp_POSTAPIClientName
                                };
                                $.ajax({
                                    type: "POST",
                                    data: postData,
                                    //url: retrievedSettings.patsr_VEISPresentationUrl + medcharturlForPost,
                                    url: retrievedSettings.patsr_VEISPresentationUrl + retrievedSettings.ftp_MedicationsChartPOSTURL,
                                    error: function (jqXHR, textStatus, pError) {
                                        showErrorMessage(pError.message, "", "Error getting medication tracking data.");
                                    },
                                    success: function (pResponse) {
                                        console.log("got POST response from med chart url.");
                                        var escapedDACURL = retrievedSettings.patsr_VEISPresentationUrl.replace(/\//g, "\/");
                                        //var newResponse = pResponse.replace(/\/Webparts\//g, escapedDACURL);
                                        var newResponse = pResponse.replace(/link href=\"\/WebParts\//g, "link href=\"" + escapedDACURL);
                                        var newResponse2 = newResponse.replace(/script src=\"\/WebParts\//g, "script src=\"" + escapedDACURL);

                                        var onClickFunctionAsString = "<script type=\"text/javascript\">function trackingLinkOnClick(pUrl){ parent.VCCM.USDHelper.CallUSDAction(\"Shared Global Manager\", \"LaunchURL\", pUrl);  return false;}</script>";
                                        var docBodyTag = newResponse2.substring(newResponse2.indexOf("<body"), newResponse2.indexOf(">", newResponse2.indexOf("<body")) + 1);
                                        newResponse2 = newResponse2.replace(docBodyTag, docBodyTag + "\r\n" + onClickFunctionAsString + "\r\n");
                                        var responseWithUSDAnchors = fixTrackingURLs(newResponse2);


                                        var displayFrame = $("#displayframe").get(0);
                                        var displayFrameDoc = displayFrame.document;
                                        if (!!displayFrame.contentDocument) {
                                            displayFrameDoc = displayFrame.contentDocument;
                                        }
                                        else {
                                            displayFrameDoc = displayFrame.contentWindow.document;
                                        }

                                        if (!!displayFrameDoc) {
                                            displayFrameDoc.open();
                                            displayFrameDoc.write(responseWithUSDAnchors);
                                            displayFrameDoc.close();
                                            console.log("set displayFrame content directly.");
                                            //showDiv("#framediv"); //needed?
                                        }
                                    }
                                });
                            }
                            else {
                                alert("Cannot load medications with tracking. Could not find MHV session cookie.");
                            }
                        },
                        {},
                        function (pError) {
                            alert("Cannot load medications with tracking. Could not find MHV session cookie.");
                        }
                    );
                }
                else {
                    alert("Cannot load medications with tracking. Configuration error: missing API info on Active Settings record. Check with your system administrator.");
                }
            }
            else {
                alert("Cannot load medications with tracking. Vet is missing ICN.");
            }
        }
        else {
            alert("Cannot load medications with tracking. Vet does not have an MHV ID.");
            $("#medTrackingButtonsContainer").hide();
        }
    }
    catch (e) {
        alert("Cannot load medications with tracking. Error:\n" + e.message);
        throw e;
    }
}

function fixTrackingURLs(pString) {
    if (pString.indexOf("<a class=\"trackinglink\"") > 0) {
        var thisAnchor = pString.substring(pString.indexOf("<a class=\"trackinglink\""), pString.indexOf(">", pString.indexOf("<a class=\"trackinglink\"")) + 1);
        if (thisAnchor.indexOf("<a" == 0)) {
            //got a valid tracklink <a> element.
            var newAnchorString = "<a href=\"\" target=\"_blank\" ";
            var trackingURL = "";
            var anchorAttributesArray = thisAnchor.replace(/<a /g, "").replace(/>/g, "").replace(/"/g, "").split(" ");
            for (var i = 0; i < anchorAttributesArray.length; i++) {
                var thisPair = anchorAttributesArray[i];
                var name = thisPair.split("=")[0];
                if (!!name && name == "trackingurl") {
                    trackingURL = thisPair.substring(thisPair.indexOf("=") + 1);
                    newAnchorString += "onclick=\"return trackingLinkOnClick('" + trackingURL + "');\"";
                }
            }
            newAnchorString += ">";
            pString = pString.replace(thisAnchor, newAnchorString);
            return fixTrackingURLs(pString);
        }
        else {
            //out of anchors...finally return the altered pString
            return pString;
        }
    }
    else {
        return pString;
    }
}

function getContext() {
    return (typeof GetGlobalContext != "undefined") ? GetGlobalContext() : null;
}
function parseDataParametersFromUrl(pQueryString) {
    //example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
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

    var configObject = {};
    for (var i in customDataArray) {
        configObject[customDataArray[i][0]] = customDataArray[i][1];
    }

    var typename = getQueryVariable("typename");
    var id = getQueryVariable("id");
    if (typename !== undefined && typename != null && typename != "") {
        if (typename == "incident") {
            var customerid = window.parent.Xrm.Page.getAttribute("customerid").getValue()[0].id;

            if (customerid !== undefined && customerid != null && customerid != '') {
                Xrm.WebApi.retrieveRecord("contact", customerid.replace('{', '').replace('}', ''), "?$select=veo_edipi,patsr_icn").then(
                    function success(result) {
                        configObject["ICN"] = result.patsr_icn;
                        configObject["EDIPI"] = result.veo_edipi;
                        configData = configObject;
                        loadButtons("");
                    },
                    errorHandler
                );
            }

        }
        else if (typename == "contact") {
            var contactId = window.parent.Xrm.Page.data.entity.getId();
            Xrm.WebApi.retrieveRecord("contact", contactId.replace('{', '').replace('}', ''), "?$select=veo_edipi,patsr_icn").then(
                function success(result) {
                    configObject["ICN"] = result.patsr_icn;
                    configObject["EDIPI"] = result.veo_edipi;
                    configData = configObject;
                    loadButtons("");
                },
                errorHandler
            );
        }
        else {
            configData = configObject;
            loadButtons("");
        }
    }
    else {
        configData = configObject;
        loadButtons("");
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
function showLoadingMessage(pMessage) {
    if (!!pMessage) {
        $("#progressText").html(pMessage);
        $("#progressImg").prop("alt", pMessage);
        $("#progressImg").prop("title", pMessage);
    }
    showDiv("#loadingGifDiv");
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function showDiv(pDivToShow) {
    var knownDivs = [
        "#loadingGifDiv",
        "#framediv",
        "#errorContainer"
    ];
    for (var d = 0; d < knownDivs.length; d++) {
        if (knownDivs[d] == pDivToShow) {
            $(knownDivs[d]).show();
            console.log("showing " + pDivToShow);
        }
        else {
            $(knownDivs[d]).hide();
        }
    }
}
function errorHandler(error) {
    writeToConsole(error.message);
    showErrorMessage("Error", error.message, "Error");
}
function showErrorMessage(pErrorMessage, pDebugMessage, pAlternateHeaderTitle) {
    writeToConsole("inside showErrorMessage()");
    writeToConsole(pDebugMessage);
    if ($("#errorContainer").is(":hidden")) {
        if (!!pAlternateHeaderTitle) $("#errorHeaderTitle").text(pAlternateHeaderTitle);
        $("#errorHeaderDescription").html("<p>" + pErrorMessage + "<br/><br/>");
        showDiv("#errorContainer");
    }
}
