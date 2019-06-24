/// <reference path="../../JScript/VCCM.MHVHelper.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />
/// <reference path="../../WebServiceSecurityLib/js/WebServiceSecurityScriptLib.js" />
var configData = null,
    context = null,
    retrievedSettings = null,
    secureWebPartRenderMethod = "HTMLFORM";
var addedHandler = false;

var secureChartCounter = 0;

var buttonConfigurations = {};


$(document).ready(function () {
    //add some event handlers...
    window.addEventListener(
        "message",
        function (pMessageContent) {
            if (!!pMessageContent && !!pMessageContent.data && (typeof pMessageContent.data == "object") && !!pMessageContent.data.buttonClicked && !!pMessageContent.data.data) {
                if (!!retrievedSettings && !!context && !!configData) {
                    if (!!pMessageContent.data.data.noteUId) {
                        switch (pMessageContent.data.buttonClicked) {
                            case "btnCreateAddend":
                                openNewAddendumForm(pMessageContent.data.data.noteUId);
                                break;
                            case "btnNotesSigner":
                                //openCRMRecordForAdditionalSigners(pMessageContent.data.data.noteUId, "ftp_progressnote", "ftp_integrationnoteid", "ftp_patient");
                                openNewAdditionalSignerForm(pMessageContent.data.data.noteUId, "note");
                                break;
                            case "btnAddSigner":
                                //openCRMRecordForAdditionalSigners(pMessageContent.data.data.noteUId, "ftp_addendum", "ftp_AddendumNoteID", "ftp_Veteran");
                                openNewAdditionalSignerForm(pMessageContent.data.data.noteUId, "addendum");
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        alert("Cannot " + (pMessageContent.data.buttonClicked == "btnCreateAddend" ? " add addendum" : " add signers") + ". VistA note ID not provided.");
                    }
                }
                else {
                    //missing config information on page
                }
            }
            else {
                alert("Message from iFrame is missing required information.");
            }
        }

    );
    $("#displayframe").load(
        function () {
            console.log("displayframe loaded");
            showDiv("#framediv");
            //if($("#displayframe").attr("src").indexOf(retrievedSettings.ftp_MedicationsChartURL) > -1){
            //	if (!!configData.MHVID) {
            //		$("#medTrackingButtonsContainer").show();
            //		$("#displayframe").css("top", "4%");
            //	}
            //	else {
            //		$("#medTrackingButtonsContainer").hide();
            //		$("#displayframe").css("top", "1%");
            //	}
            //}
            //else {
            //	$("#medTrackingButtonsContainer").hide();
            //	$("#displayframe").css("top", "1%");
            //}
        }
    );

    //setup global objects...
    context = getContext();
    configData = null;
    configData = parseDataParametersFromUrl(location.search);

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
            unsecureURLFieldName: "ftp_ProblemChartURL",
            secureURLFieldName: "ftp_ProblemChartSecureURL",
            secure: false,
            url: ""
        },
        btnNotes: {
            id: "btnNotes",
            title: "Notes",
            unsecureURLFieldName: "ftp_NoteChartURL",
            secureURLFieldName: "ftp_NoteChartSecureURL",
            secure: false,
            url: ""
        },
        btnOrders: {
            id: "btnOrders",
            title: "Orders",
            unsecureURLFieldName: "ftp_OrderChartURL",
            secureURLFieldName: "ftp_OrderChartSecureURL",
            secure: false,
            url: ""
        },
        btnAppointments: {
            id: "btnAppointments",
            title: "Appointments",
            unsecureURLFieldName: "ftp_AppointmentChartURL",
            secureURLFieldName: "ftp_AppointmentChartSecureURL",
            secure: true,
            url: ""
        },
        btnMedications: {
            id: "btnMedications",
            title: "Medications",
            unsecureURLFieldName: "ftp_MedicationsChartURL",
            secureURLFieldName: "ftp_MedicationsChartSecureURL",
            secure: false,
            url: ""
        },
        btnPostings: {
            id: "btnPostings",
            title: "Postings",
            unsecureURLFieldName: "ftp_PostingChartURL",
            secureURLFieldName: "ftp_PostingChartSecureURL",
            secure: false,
            url: ""
        },
        btnAllergies: {
            id: "btnAllergies",
            title: "Allergies",
            unsecureURLFieldName: "ftp_AllergyChartURL",
            secureURLFieldName: "ftp_AllergyChartSecureURL",
            secure: true,
            url: ""
        },
        btnLabs: {
            id: "btnLabs",
            title: "Labs",
            unsecureURLFieldName: "ftp_LabChartURL",
            secureURLFieldName: "ftp_LabChartSecureURL",
            secure: false,
            url: ""
        },
        btnConsults: {
            id: "btnConsults",
            title: "Consults",
            unsecureURLFieldName: "ftp_ConsultChartURL",
            secureURLFieldName: "ftp_ConsultChartSecureURL",
            secure: false,
            url: ""
        },
        btnNonVAMeds: {
            id: "btnNonVAMeds",
            title: "Non-VA Meds",
            unsecureURLFieldName: "ftp_NonVAChartURL",
            secureURLFieldName: "ftp_NonVAChartSecureURL",
            secure: false,
            url: ""
        },
        btnVitals: {
            id: "btnVitals",
            title: "Vitals",
            unsecureURLFieldName: "ftp_VitalsChartURL",
            secureURLFieldName: "ftp_VitalsChartSecureURL",
            secure: false,
            url: ""
        },
        btnRadiology: {
            id: "btnRadiology",
            title: "Imaging",
            unsecureURLFieldName: "ftp_RadiologyChartURL",
            secureURLFieldName: "ftp_RadiologyChartSecureURL",
            secure: false,
            url: ""
        },
        btnDischarges: {
            id: "btnDischarges",
            title: "Discharges",
            unsecureURLFieldName: "ftp_DischargeURL",
            secureURLFieldName: "ftp_DischargeChartSecureURL",
            secure: false,
            url: ""
        }
    };

    retrievedSettings = null;
    var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
    if (!!configData && configData.hasOwnProperty("ICN") && !!configData.ICN) {
        SDK.REST.retrieveMultipleRecords(
            "mcs_setting",
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
});

function initializeButtons() {
    if (!!retrievedSettings) {
        if (retrievedSettings.hasOwnProperty("ftp_DACURL") && !!retrievedSettings.ftp_DACURL) {
            $("#sidebar").html("");
            var filter = retrievedSettings.hasOwnProperty("ftp_Filter") && !!retrievedSettings.ftp_Filter ? retrievedSettings.ftp_Filter : "";
            //initialize buttons
            for (var thisButtonConfigId in buttonConfigurations) {
                if (buttonConfigurations.hasOwnProperty(thisButtonConfigId)) {
                    var thisButtonConfig = buttonConfigurations[thisButtonConfigId];
                    if (thisButtonConfig.secure == true) {
                        if (!!thisButtonConfig.secureURLFieldName) {
                            if (!!retrievedSettings[thisButtonConfig.secureURLFieldName]) {
                                thisButtonConfig.url = retrievedSettings.ftp_DACURL + retrievedSettings[thisButtonConfig.secureURLFieldName];
                            }
                            else {
                                thisButtonConfig.url = "";
                            }
                        }
                    }
                    else {
                        if (!!thisButtonConfig.unsecureURLFieldName) {
                            if (!!retrievedSettings[thisButtonConfig.unsecureURLFieldName]) {
                                thisButtonConfig.url = retrievedSettings.ftp_DACURL + retrievedSettings[thisButtonConfig.unsecureURLFieldName] + configData.ICN + filter;
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

function setChartSource(pElement) {
    if (!!pElement.id) {
        var thisButtonConfig = buttonConfigurations[pElement.id];
        if (!!thisButtonConfig) {
            if (!!thisButtonConfig.url) {
                $("#framediv").hide(100);
                showLoadingMessage("Loading " + thisButtonConfig.title + "...");
                if (thisButtonConfig.secure == false || thisButtonConfig.id == "btnSCD") {
                    console.log("loading unsecure chart in displayframe: " + thisButtonConfig.url);
                    //for unsecure web parts, set iFrame src directly
                    $('#displayframe').attr({
                        src: thisButtonConfig.url,
                        title: thisButtonConfig.title
                    });
                }
                else {
                    //for secure web parts, use an either ajax POST or submit a hidden HTML form w/ action being the secure URL, and target being the iFrame
                    switch (secureWebPartRenderMethod) {
                        case "HTMLFORM":
                            $("#token").val("");
                            //Construct Service Parameters
                            var tokenObject = [{
                                key: "identifier",
                                type: "c:string",
                                value: JSON.stringify({ NationalId: '000000' + configData.ICN + '000000' })
                            }];
                            CrmSecurityCallAction(
                                "bah_requestserviceticketaction",
                                tokenObject,
                                function (outputParams) {
                                    // Success
                                    for (var i = 0; i < outputParams.length; i++) {
                                        if (outputParams[i].key == 'serviceticket') {
                                            console.log("posting form to load secure chart in displayframe: " + thisButtonConfig.url);
                                            $('#webpartform').attr('action', thisButtonConfig.url);
                                            $('#token').attr('value', outputParams[i].value);
                                            //submit the form
                                            $('#webpartform').submit();
                                        }
                                    }
                                },
                                function (e) { console.log("error"); console.log(e); },
                                context.getClientUrl()
                            );
                            break;
                        case "AJAXPOST":
                        default:
                            var dataParam = "ICN=" + configData.ICN + "&SecureWebPartURL=" + thisButtonConfig.url;
                            var thisSecureHostUrl = context.getClientUrl() + "/WebResources/ftp_/WebServiceSecurityLib/SecureWebPartHost.html?data=" + encodeURIComponent(dataParam);
                            $('#displayframe').attr({
                                src: thisSecureHostUrl,
                                title: thisButtonConfig.title
                            });
                            break;
                    }
                }
            }
            else {
                var fieldName = thisButtonConfig.secure == true ? thisButtonConfig.secureURLFieldName : thisButtonConfig.unsecureURLFieldName;
                showErrorMessage("Could not find a URL in the " + fieldName + " field of the Active Settings record.", "Have your CRM administrator check Active Settings.", "Configuration Error");
            }
        }
    }
}

function openNewAddendumForm(pNoteVistAId) {
    //open ftp_addendum form to create new addendum attached to note in VistA
    if (typeof pNoteVistAId == "string") {
        var newAddendumUrl = context.getClientUrl() + "/main.aspx?etn=ftp_addendum&pagetype=entityrecord";
        var extraQs = "&extraqs=";
        extraQs += encodeURIComponent("ftp_vistanoteid=" + pNoteVistAId);
        if (!!configData && configData.hasOwnProperty("contactid") && !!configData.contactid && configData.hasOwnProperty("fullname") && !!configData.fullname) {
            extraQs += encodeURIComponent("&ftp_veteran=" + configData.contactid + "&ftp_veteranname=" + configData.fullname);
        }
        window.open(newAddendumUrl + extraQs);
    }
}

function openCRMRecordForAdditionalSigners(pVistaRecordId, pEntitySchemaName, pVistaIdFieldName, pContactLookupFieldName) {
    //deprecated
    return;
    if (!!pVistaRecordId && !!pEntitySchemaName && !!pVistaIdFieldName) {
        showLoadingMessage("Searching for " + (pEntitySchemaName == "ftp_progressnote" ? "note" : "addendum") + " in CRM...");
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
    //create placeholder ftp_additionalsigner record, then open it to give user an interface for selecting usrs and adding them to the current note/addendum
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
                //if (!!retrievedSettings.ftp_DACURL && !!retrievedSettings.ftp_MHVSessionAPIURL && !!retrievedSettings.ftp_MedicationsChartURL) {
                if (!!retrievedSettings.ftp_DACURL && !!retrievedSettings.ftp_MHVSessionAPIURL && !!retrievedSettings.ftp_MedicationsChartPOSTURL && !!retrievedSettings.ftp_POSTAPIClientName) {
                    VCCM.MHVHelper.GetSessionToken(
                        retrievedSettings.ftp_DACURL + retrievedSettings.ftp_MHVSessionAPIURL,
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
                                    //url: retrievedSettings.ftp_DACURL + medcharturlForPost,
                                    url: retrievedSettings.ftp_DACURL + retrievedSettings.ftp_MedicationsChartPOSTURL,
                                    error: function (jqXHR, textStatus, pError) {
                                        showErrorMessage(pError.message, "", "Error getting medication tracking data.");
                                    },
                                    success: function (pResponse) {
                                        console.log("got POST response from med chart url.");
                                        var escapedDACURL = retrievedSettings.ftp_DACURL.replace(/\//g, "\/");
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

    //optionally, put code here to show body once we have the config object, if it's taking too long
    return configObject;
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
    if ($("#errorContainer").is(":hidden")) {
        if (!!pAlternateHeaderTitle) $("#errorHeaderTitle").text(pAlternateHeaderTitle);
        $("#errorHeaderDescription").html("<p>" + pErrorMessage + "<br/><br/>" + pDebugMessage + "</p>");
        showDiv("#errorContainer");
    }
}
