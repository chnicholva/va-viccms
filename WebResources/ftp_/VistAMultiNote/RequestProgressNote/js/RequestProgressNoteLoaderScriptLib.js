//RequestProgressNoteLoaderScriptLib.js

//Static Variables
var vcmn_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vcmn_serverUrl = Xrm.Page.context.getClientUrl();

var vcmn_EnrollmentEligibilitySummaryURLbase = '';
var vcmn_AppointmentsUrl = '';
var vcmn_AppointmentsSecureUrl = '';
var vcmn_useSecureAppointmentAPI = true;

var vcmn_EnrollmentEligibilitySummaryData = null;
var vcmn_SecurePatientICN = null;

var vcmn_localStorageVarName = "";

var vcmn_ProgressNoteSubject = 'Progress Note: ';

var vcmn_baseServiceEndpointUrl = null;
var vcmn_requestingApp = null;
var vcmn_consumingAppToken = null;
var vcmn_consumingAppPassword = null;

var vcmn_facilityGroupDefaultId = null;

var vcmn_nonNarcoticTemplate = false;
var vcmn_nonNarcoticRenewalRequestName = "Medication - Renewal Non-Narcotic";
var vcmn_nonNarcoticRefillRequestName = "Medication - Refill Non-Narcotic";
var vcmn_narcoticRenewalRequestName = "Medication - Renewal Narcotic";
var vcmn_narcoticRefillRequestName = "Medication - Refill Narcotic";

Xrm.Utility.getDefaultGroupId = function () {
    return vcmn_facilityGroupDefaultId;
}

Xrm.Utility.setDefaultGroupId = function (groupId) {
    vcmn_facilityGroupDefaultId = groupId;
}

function vcmn_setSimpleLookupValue(vcmn_LookupId, vcmn_Type, vcmn_Id, vcmn_Name) {
    try {
        //Sets the value for lookup attributes that accept only a single entity reference.
        var vcmn_lookupReference = [];
        vcmn_lookupReference[0] = {};
        vcmn_lookupReference[0].id = vcmn_Id;
        vcmn_lookupReference[0].entityType = vcmn_Type;
        vcmn_lookupReference[0].name = vcmn_Name;
        Xrm.Page.getAttribute(vcmn_LookupId).setValue(vcmn_lookupReference);
    }
    catch (err) {
        alert('Request Progress Note Loader Script Function Error(vcmn_setSimpleLookupValue): ' + err.message);
    }
}

function vcmn_decryptServiceConnector(vcmn_connectorArray, vcmn_connectorValue) {
    var vcmn_decryptedString = "";
    if (vcmn_connectorArray != null && vcmn_connectorArray != "") {
        var vcmn_newArray = vcmn_connectorArray.toString().split(',');
        vcmn_newArray.reverse();
        for (i = 0; i < vcmn_newArray.length; i++) {
            var vcmn_curChar = "";
            if (i == 0) {
                vcmn_curChar = vcmn_newArray[i] - vcmn_connectorValue;
            }
            else {
                vcmn_curChar = vcmn_newArray[i] - (i + vcmn_connectorValue);
            }
            vcmn_decryptedString = vcmn_decryptedString + String.fromCharCode(vcmn_curChar);
        }
    }
    return vcmn_decryptedString;
}

function vcmn_SettingsWebServiceURL_response(vcmn_settingData, vcmn_lastSkip, vcmn_NA) {
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var vcmn_DacUrl = null;
        var vcmn_EnrollmentEligibilitySummaryApiUrl = null;
        var vcmn_AppointmentApiUrl = null;
        var vcmn_AppointmentApiSecureUrl = null;

        for (var i = 0; i <= vcmn_settingData.d.results.length - 1; i++) {
            //Get info
            if (vcmn_settingData.d.results[i].ftp_DACURL != null) { vcmn_DacUrl = vcmn_settingData.d.results[i].ftp_DACURL; }
            if (vcmn_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL != null) { vcmn_EnrollmentEligibilitySummaryApiUrl = vcmn_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { vcmn_baseServiceEndpointUrl = vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (vcmn_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { vcmn_requestingApp = vcmn_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { vcmn_consumingAppToken = vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { vcmn_consumingAppPassword = vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            if (vcmn_settingData.d.results[i].ftp_AppointmentAPIURL != null) { vcmn_AppointmentApiUrl = vcmn_settingData.d.results[i].ftp_AppointmentAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_AppointmentAPISecureURL != null) { vcmn_AppointmentApiSecureUrl = vcmn_settingData.d.results[i].ftp_AppointmentAPISecureURL; }
            break;
        }

        if (vcmn_DacUrl != null && vcmn_EnrollmentEligibilitySummaryApiUrl != null) {
            //Construct full web service URL
            vcmn_EnrollmentEligibilitySummaryURLbase = vcmn_DacUrl + vcmn_EnrollmentEligibilitySummaryApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE ENROLLMENT ELIGIBILITY SUMMARY WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APISERVICE");
        }

        if (vcmn_useSecureAppointmentAPI) {
            if (vcmn_DacUrl != null && vcmn_AppointmentApiSecureUrl != null) {
                vcmn_AppointmentsSecureUrl = vcmn_DacUrl + vcmn_AppointmentApiSecureUrl;
            }
            else {
                Xrm.Page.ui.setFormNotification("ERROR: THE SECURE APPOINTMENT API WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APISERVICE");
            }
        }
        else {
            if (vcmn_DacUrl != null && vcmn_AppointmentApiUrl != null) {
                //Construct full web service URL
                vcmn_AppointmentsUrl = vcmn_DacUrl + vcmn_AppointmentApiUrl;
            }
            else {
                Xrm.Page.ui.setFormNotification("ERROR: THE APPOINTMENT API WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APISERVICE");
            }
        }
        if (vcmn_baseServiceEndpointUrl == null || vcmn_requestingApp == null || vcmn_consumingAppToken == null || vcmn_consumingAppPassword == null) {
            Xrm.Page.ui.setFormNotification("ERROR: THE 'VIA Service Connector' CONFIGURATION IS MISSING DATA IN THE 'Settings Entity', PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
        //Decrypt VIA Service Connector Items
        vcmn_requestingApp = vcmn_decryptServiceConnector(vcmn_requestingApp, 4);
        vcmn_consumingAppToken = vcmn_decryptServiceConnector(vcmn_consumingAppToken, 6);
        vcmn_consumingAppPassword = vcmn_decryptServiceConnector(vcmn_consumingAppPassword, 8);

    }
    catch (err) {
        alert('Request Progress Note Loader Script Function Error(vcmn_SettingsWebServiceURL_response): ' + err.message);
    }
}

function vcmn_ProgressNoteLoader() {
    //debugger;
    try {
        //GET CRM SETTINGS WEB SERVICE URLS
        var vcmn_conditionalFilter = "(mcs_name eq 'Active Settings')";
        vcmn_getMultipleEntityDataAsync('mcs_settingSet', '*', vcmn_conditionalFilter, 'mcs_name', 'asc', 0, vcmn_SettingsWebServiceURL_response, '');

        //Set default values based on the current user's USD Config and Facility
        var vcmn_currentUserId = Xrm.Page.context.getUserId();
        var vcmn_currentUserData = vcmn_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', vcmn_currentUserId);
        if (vcmn_currentUserData != null) {
            if (vcmn_currentUserData.d.msdyusd_USDConfigurationId != null) {
                if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Id != null) {
                    if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name != null && vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name != '') {
                        if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name == "Pharmacy Configuration") {
                            //Do configuration step if needed
                        }
                    }
                    //Retrieve Facillity Group Default info
                    var pNote = Xrm.Page.getAttribute('ftp_progressnotefacility');
                    if (pNote && pNote.getValue()) {
                        //Data Required to lookup Facility Group Defaults are present
                        var vcmn_conditionalFilter = "(ftp_facilitysiteid/Id eq guid'" + pNote.getValue()[0].id + "') and (ftp_usdgroupid/Id eq guid'" + vcmn_currentUserData.d.msdyusd_USDConfigurationId.Id + "')";
                        vcmn_getMultipleEntityDataAsync('ftp_facilitygroupdefaultSet', 'ftp_facilitygroupdefaultId, ftp_viaworkloadencounterlocationdefault, ftp_viaworkloadencounternotetitledefault', vcmn_conditionalFilter, 'ftp_name', 'asc', 0, vcmn_facilityGroupDefault_response, vcmn_currentUserData.d.ftp_FacilitySiteId.Id);
                    }
                }
            }
        }
        //Handle unselected note type (default to workload encounter note)
        var vcmn_noteTypeValue = Xrm.Page.getAttribute("ftp_notetype_code").getValue();
        if (vcmn_noteTypeValue == null || vcmn_noteTypeValue == "" || vcmn_noteTypeValue == undefined) {
            Xrm.Page.getAttribute("ftp_notetype_code").setValue(100000001);
            Xrm.Page.getAttribute("ftp_notetype_code").setSubmitMode('always');
        }
        //Render Progress Note content based on note type selected
        vcmn_noteTypeChange();
    }
    catch (err) {
        //Display Error
        alert('Request Progress Note Loader Script Function Error(vcmn_ProgressNoteLoader): ' + err.message);
    }
}

function vcmn_facilityGroupDefault_response(vcmn_facilityGroupData, vcmn_lastSkip, vcmn_facilitySiteId) {
    //debugger;
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        for (var i = 0; i <= vcmn_facilityGroupData.d.results.length - 1; i++) {
            //Get default values and populate if active request and defaults are currently empty
            if (Xrm.Page.ui.getFormType() < 3) {
                if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault != null) {
                    //Verify that the text contains the double tilde ~~
                    if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault.indexOf("~~") >= 0) {
                        //Split on ~~
                        var vcmn_encounterLocationArray = vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault.split("~~", 2);
                        if (vcmn_encounterLocationArray.length > 1) {
                            if (vcmn_encounterLocationArray[0] != null && vcmn_encounterLocationArray[0] != '' && vcmn_encounterLocationArray[1] != null && vcmn_encounterLocationArray[1] != '') {
                                if (Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").getValue() == null) {
                                    Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(vcmn_encounterLocationArray[0]);
                                    Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
                                    Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(vcmn_encounterLocationArray[1]);
                                    Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
                                }
                            }
                        }
                    }
                }
                if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounternotetitledefault != null) {
                    //Verify that the text contains the double tilde ~~
                    if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounternotetitledefault.indexOf("~~") >= 0) {
                        //Split on ~~
                        var vcmn_encounterNoteTitleArray = vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounternotetitledefault.split("~~", 2);
                        if (vcmn_encounterNoteTitleArray.length > 1) {
                            if (vcmn_encounterNoteTitleArray[0] != null && vcmn_encounterNoteTitleArray[0] != '' && vcmn_encounterNoteTitleArray[1] != null && vcmn_encounterNoteTitleArray[1] != '') {
                                if (Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").getValue() == null) {
                                    Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(vcmn_encounterNoteTitleArray[0]);
                                    Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
                                    Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(vcmn_encounterNoteTitleArray[1]);
                                    Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
                                }
                            }
                        }
                    }
                }
            }
            //Store the Id for the matching Facility Group Default, used later to update frequently used values.
            if (vcmn_facilityGroupData.d.results[i].ftp_facilitygroupdefaultId != null) {
                vcmn_facilityGroupDefaultId = vcmn_facilityGroupData.d.results[i].ftp_facilitygroupdefaultId;
            }
            break;
        }
    }
    catch (err) {
        alert('Request Progress Note Loader Script Function Error(vcmn_facilityGroupDefault_response): ' + err.message);
    }
}

Xrm.Utility.freq_buttonAction = function (freq_buttonName) {
    try {
        if (freq_buttonName == "FreqUsedNoteTitleButton" || freq_buttonName == "FreqUsedLocationButton") {
            debugger;
            //Frequently Used button pressed, validate Facility Group Defaults
            if (vcmn_facilityGroupDefaultId == null) {
                alert("Crm Facility Group Default has not been configured. Please define for your Group and Facility to utilize this functionality!");
                return false;
            }
        }
        if (freq_buttonName != null && freq_buttonName != undefined && freq_buttonName != "") {
            //Verify button name and take action accordingly
            if (freq_buttonName == "FreqUsedNoteTitleButton") {
                debugger
                //Note Title button clicked
                var freq_ViaNoteTitleIEN = Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").getValue();
                var freq_ViaNoteTitleDescription = Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").getValue();
                if (freq_ViaNoteTitleIEN == null || freq_ViaNoteTitleIEN == "" || freq_ViaNoteTitleDescription == null || freq_ViaNoteTitleDescription == "") {
                    alert("The selected Note Title is not valid, it can not be added to the Frequently Used List!");
                    return false;
                }
                //Prompt User to add Note Title
                var freq_AddConfirm = false;
                Xrm.Utility.confirmDialog("Are you sure you want to add " + freq_ViaNoteTitleDescription + "  (" + freq_ViaNoteTitleIEN + ")  to the Frequently Used Note Title List?",
                    function () { freq_AddConfirm = true; },
                    function () { freq_AddConfirm = false; }
                );
                if (freq_AddConfirm == false) { return false; }

                //Get Existing Frequently Used Note Title List
                var freq_frequentlyUsedNoteTitles = null;
                var freq_facilityGroupDefaultData = vcmn_getSingleEntityDataSync('ftp_facilitygroupdefaultSet', 'ftp_frequentlyusednotetitles', vcmn_facilityGroupDefaultId);
                if (freq_facilityGroupDefaultData != null) {
                    if (freq_facilityGroupDefaultData.d.ftp_frequentlyusednotetitles != null) {
                        freq_frequentlyUsedNoteTitles = freq_facilityGroupDefaultData.d.ftp_frequentlyusednotetitles;
                    }
                }
                var freq_newNoteTitle = freq_ViaNoteTitleIEN + "~~" + freq_ViaNoteTitleDescription;
                if (freq_frequentlyUsedNoteTitles != null && freq_frequentlyUsedNoteTitles != "") {
                    //Test for duplicates
                    var freq_noteTitleExist = freq_frequentlyUsedNoteTitles.indexOf(freq_newNoteTitle);
                    if (freq_noteTitleExist != -1) {
                        alert("The selected Note Title already exist on the Frequently Used List");
                        return false;
                    }
                }

                //Update existing CRM Facility Group Default entity record
                //Create the Facility Group Default object
                var freq_facilityGroupDefaultItem = new Object();
                if (freq_frequentlyUsedNoteTitles == null || freq_frequentlyUsedNoteTitles == "") {
                    //Add as first item
                    freq_facilityGroupDefaultItem.ftp_frequentlyusednotetitles = freq_newNoteTitle;
                }
                else {
                    //Combine with existing item
                    freq_facilityGroupDefaultItem.ftp_frequentlyusednotetitles = freq_frequentlyUsedNoteTitles + "^^" + freq_newNoteTitle;
                }
                //make it a json object
                var jsonEntity = JSON.stringify(freq_facilityGroupDefaultItem);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: vcmn_serverUrl + vcmn_crmOdataEndPoint + "/" + 'ftp_facilitygroupdefaultSet' + "(guid'" + vcmn_facilityGroupDefaultId + "')",
                    data: jsonEntity,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                    },
                    success: function (textStatus, XmlHttpRequest) {
                        alert("The Selected Note Title was added successfully to the Frequently Used List.");
                    },
                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                        alert('Ajax Error in Update of Crm Facility Group Default entity: ' + errorThrown);
                    }
                });
            }
            else if (freq_buttonName == "FreqUsedLocationButton") {
                //Location button clicked
                var freq_ViaLocationIEN = Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").getValue();
                var freq_ViaLocationDescription = Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").getValue();
                if (freq_ViaLocationIEN == null || freq_ViaLocationIEN == "" || freq_ViaLocationDescription == null || freq_ViaLocationDescription == "") {
                    alert("The selected Location is not valid, it can not be added to the Frequently Used List!");
                    return false;
                }
                //Prompt User to add Location
                var freq_AddConfirm = false;
                Xrm.Utility.confirmDialog("Are you sure you want to add " + freq_ViaLocationDescription + "  (" + freq_ViaLocationIEN + ")  to the Frequently Used Location List?",
                    function () { freq_AddConfirm = true; },
                    function () { freq_AddConfirm = false; }
                );
                if (freq_AddConfirm == false) { return false; }

                //Get Existing Frequently Used Location List
                var freq_frequentlyUsedLocations = null;
                var freq_facilityGroupDefaultData = vcmn_getSingleEntityDataSync('ftp_facilitygroupdefaultSet', 'ftp_frequentlyusedlocations', vcmn_facilityGroupDefaultId);
                if (freq_facilityGroupDefaultData != null) {
                    if (freq_facilityGroupDefaultData.d.ftp_frequentlyusedlocations != null) {
                        freq_frequentlyUsedLocations = freq_facilityGroupDefaultData.d.ftp_frequentlyusedlocations;
                    }
                }
                var freq_newLocation = freq_ViaLocationIEN + "~~" + freq_ViaLocationDescription;
                if (freq_frequentlyUsedLocations != null && freq_frequentlyUsedLocations != "") {
                    //Test for duplicates
                    var freq_locationExist = freq_frequentlyUsedLocations.indexOf(freq_newLocation);
                    if (freq_locationExist != -1) {
                        alert("The selected Location already exist on the Frequently Used List");
                        return false;
                    }
                }

                //Update existing CRM Facility Group Default entity record
                //Create the Facility Group Default object
                var freq_facilityGroupDefaultItem = new Object();
                if (freq_frequentlyUsedLocations == null || freq_frequentlyUsedLocations == "") {
                    //Add as first item
                    freq_facilityGroupDefaultItem.ftp_frequentlyusedlocations = freq_newLocation;
                }
                else {
                    //Combine with existing item
                    freq_facilityGroupDefaultItem.ftp_frequentlyusedlocations = freq_frequentlyUsedLocations + "^^" + freq_newLocation;
                }
                //make it a json object
                var jsonEntity = JSON.stringify(freq_facilityGroupDefaultItem);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: vcmn_serverUrl + vcmn_crmOdataEndPoint + "/" + 'ftp_facilitygroupdefaultSet' + "(guid'" + vcmn_facilityGroupDefaultId + "')",
                    data: jsonEntity,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                    },
                    success: function (textStatus, XmlHttpRequest) {
                        alert("The Selected Location was added successfully to the Frequently Used List.");
                    },
                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                        alert('Ajax Error in Update of Crm Facility Group Default entity: ' + errorThrown);
                    }
                });
            }
            else if (freq_buttonName == "ApplyNoteTemplateButton") {
                //Apply Note Template
                vcmn_createTemplateNote();
            }
            else if (freq_buttonName == "SaveNoteButton") {
                //Save a CRM Note
                vcmn_saveCrmNote();
            }
            else if (freq_buttonName == "SaveToVistaButton") {
                //Save to Vista
                vcmn_saveToVista();
            }
            else if (freq_buttonName == "CancelNoteButton") {
                //Save a CRM Note
                vcmn_cancelNote();
            }
            else if (freq_buttonName == "SelectSignersButton") {
                //Save a CRM Note
                vcmn_selectNoteSigners();
            }
            else {
                alert("The Frequently Used button named '" + freq_buttonName + "' has not been defined in this application, please contact your system administrator!");
                return false;
            }
        }
        else {
            alert("The Frequently Used button in use has been defined incorrectly, please contact your system administrator!");
            return false;
        }
    }
    catch (err) {
        alert('Progress Note Frequently Used Button Script Function Error(freq_buttonAction): ' + err.message);
    }
}

function vcmn_saveCrmNote() {
    try {
        //Verify that there is text in the note text attribute
        var vcmn_noteText = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        if (vcmn_noteText == null || vcmn_noteText == "") {
            alert("The note text has not been entered. Please enter a note and then retry this action!");
            return false;
        }

        //Create Annotation object
        var vcmn_annotationObject = new Object();
        vcmn_annotationObject.Subject = "Request Crm Note";
        vcmn_annotationObject.NoteText = vcmn_noteText;
        vcmn_annotationObject.ObjectId = { Id: Xrm.Page.data.entity.getId(), LogicalName: 'incident', Name: '' }

        //Create the CRM Progress Note Record
        var vcmn_jsonEntityData = JSON.stringify(vcmn_annotationObject);
        var vcmn_entitySetName = 'AnnotationSet'
        var vcmn_jsonQuery = vcmn_serverUrl + vcmn_crmOdataEndPoint + '/' + vcmn_entitySetName;
        var vcmn_AnnotationId = vcmn_executeCrmOdataPostRequest(vcmn_jsonQuery, false, vcmn_jsonEntityData, 'CREATE', 'AnnotationId');

        //Check for Failure 'FAIL'
        if (vcmn_AnnotationId == 'FAIL' || vcmn_AnnotationId == null) {
            //The integration failed
            alert("Error: Unable to create a Crm Annotation entity record, Save Crm Note Failed!");
            return false;
        }

        alert("The Crm Only Note, was created successfully!");

        //Wipe request progress note data attribute fields
        vcmn_deleteNoteData();
    }
    catch (err) {
        alert('Request Progress Note Script Function Error(vcmn_saveCrmNote): ' + err.message);
    }
}

function vcmn_cancelNote() {
    try {
        var vcmn_confirmDeleteNote = confirm('Are you sure you want to delete this note?\nThis action cannot be undone!');
        if (vcmn_confirmDeleteNote == false) {
            return false;
        }
        vcmn_deleteNoteData();
    }
    catch (err) {
        alert('Request Progress Note Script Function Error(vcmn_cancelNote): ' + err.message);
    }
}

function vcmn_deleteNoteData() {
    try {
        //clear note data
        Xrm.Page.getAttribute("ftp_notedetail").setValue(null);
        Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedworkloadlocationtext').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedworkloadnotetitletext').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_userentrydate').setValue(null);
        Xrm.Page.getAttribute("ftp_userentrydate").setSubmitMode('always');
        Xrm.Page.getAttribute("ftp_notetype_code").setValue(null);
        Xrm.Page.getAttribute("ftp_notetype_code").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_cptcode').setValue(null);
        Xrm.Page.getAttribute("ftp_cptcode").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_diagnosiscode').setValue(null);
        Xrm.Page.getAttribute("ftp_diagnosiscode").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedsecondarydiagnosiscodes').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosiscodes").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_selectedsecondarydiagnosisids').setValue(null);
        Xrm.Page.getAttribute("ftp_selectedsecondarydiagnosisids").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_serviceconnectedcondition').setValue(null);
        Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_southwestasiaconditions').setValue(null);
        Xrm.Page.getAttribute("ftp_southwestasiaconditions").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_ionizingradiationexposure').setValue(null);
        Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_agentorangeexposure').setValue(null);
        Xrm.Page.getAttribute("ftp_agentorangeexposure").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_headandorneckcancer').setValue(null);
        Xrm.Page.getAttribute("ftp_headandorneckcancer").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_militarysexualtrauma').setValue(null);
        Xrm.Page.getAttribute("ftp_militarysexualtrauma").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_combatveteran').setValue(null);
        Xrm.Page.getAttribute("ftp_combatveteran").setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_shipboardhazardanddefense').setValue(null);
        Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setSubmitMode('always');

        //clear additional signers related data
        Xrm.Page.getAttribute('ftp_selectedsigners').setValue(null);
        vcmn_localStorageVarName = "RN" + Xrm.Page.data.entity.getId();
        localStorage.removeItem(vcmn_localStorageVarName);

        //refresh progress note
        vcmn_ProgressNoteLoader();
    }
    catch (err) {
        alert('Request Progress Note Script Function Error(vcmn_deleteNoteData): ' + err.message);
    }
}

function vcmn_selectNoteSigners() {
    try {
        Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(true);
        var vcmn_signerSearchObject = Xrm.Page.ui.controls.get('WebResource_RequestNoteSignerSearch').getObject();
        //Set Focus to the Cancel button in the web resource HTML page
        vcmn_signerSearchObject.contentWindow.document.getElementById('btnCancel').focus();
    }
    catch (err) {
        alert('Request Progress Note Script Function Error(vcmn_selectNoteSigners): ' + err.message);
    }
}

function vcmn_collapseSignerSelection() {
    try {
        //Set focus to the top of the progress note
        Xrm.Page.ui.tabs.get('tab_progressnote').setFocus();
        //Hide the signersection
        Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(false);
    }
    catch (err) {
        alert('Request Progress Note Script Function Error(vcmn_collapseSignerSelection): ' + err.message);
    }
}

function vcmn_createTemplateNote() {
    try {
        var vcmn_currentNote = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        if (vcmn_currentNote != null && vcmn_currentNote != "") {
            var vcmn_confirmTemplate = confirm('Are you sure you want to replace your current note text with a template?\nThis action cannot be undone!');
            if (vcmn_confirmTemplate == false) {
                return false;
            }
        }

        //Clear any existing note text
        Xrm.Page.getAttribute("ftp_notedetail").setValue("");
        Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode("always");

        //Create the note text using progress note template logic
        var vcmn_veteranId = null;  //From request customerid

        //Populate form with related CRM data
        var vcmn_subReasonId = null; //Reference to the Reason for Request Sub Reason
        var vcmn_minorReasonId = null;  //Reference to the Reason for Request Minor Reason
        var vcmn_subReasonTemplateText = null;
        var vcmn_minorReasonTemplateText = null;
        var vcmn_minorReasonNoteSubText = null;

        //Get the data from the request form
        var vcmn_rq_ReasonforRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
        if (vcmn_rq_ReasonforRequest == null || vcmn_rq_ReasonforRequest == undefined) { alert("A Reason for Request has not been entered, a note template cannot be applied!"); return false; }
        var vcmn_rq_Title = Xrm.Page.getAttribute('title').getValue();
        if (vcmn_rq_Title == null || vcmn_rq_Title == "" || vcmn_rq_Title == undefined) { alert("A Request Title has not been entered, a note template cannot be applied!"); return false; }
        var vcmn_rq_CustomerId = Xrm.Page.getAttribute('customerid').getValue();
        if (vcmn_rq_CustomerId == null || vcmn_rq_CustomerId == undefined) { alert("A Veteran has not been entered, a note template cannot be applied!"); return false; }

        if (vcmn_rq_ReasonforRequest[0].name == "Pharmacy Outbound Call") {
            if (typeof outboundTemplate_buildNoteText == "function") {
                outboundTemplate_buildNoteText();
            }
        }
        //*****NON NARCOTIC*****
        else if (vcmn_rq_ReasonforRequest[0].name == vcmn_nonNarcoticRenewalRequestName || vcmn_rq_Title.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_rq_ReasonforRequest[0].name == vcmn_nonNarcoticRefillRequestName || vcmn_rq_Title.indexOf(vcmn_nonNarcoticRefillRequestName) > -1) {
            //Define as Non Narcotic Template
            vcmn_nonNarcoticTemplate = true;

            //Construct Non-Narcotic Template Text
            var vcmn_nonNarcoticTemplateText = ""; // '---------------Medications Selected-------------------\n\n\n---------------------------------------------------------';
            //Do Middle Section
            if (Xrm.Page.getAttribute('ftp_rxtype').getValue() != null) {
                var vcmn_rxType = ""
                if (Xrm.Page.getAttribute('ftp_rxtype').getValue() == 100000000) { vcmn_rxType = "Refill"; }
                if (Xrm.Page.getAttribute('ftp_rxtype').getValue() == 100000001) { vcmn_rxType = "Renewal"; }
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nVeteran is requesting a " + vcmn_rxType;
            }
            if (Xrm.Page.getAttribute('ftp_subreasonid').getValue() != null) {
                vcmn_subReasonId = Xrm.Page.getAttribute('ftp_subreasonid').getValue()[0].id;
                if (vcmn_subReasonId != null) {
                    //Get Template Text
                    var vcmn_subreasonData = vcmn_getSingleEntityDataSync('ftp_subreasonSet', 'ftp_notetext', vcmn_subReasonId);
                    if (vcmn_subreasonData.d.ftp_notetext != null) {
                        vcmn_subReasonTemplateText = vcmn_subreasonData.d.ftp_notetext;
                    }
                }
            }
            if (Xrm.Page.getAttribute('ftp_minorreasonid').getValue() != null) {
                vcmn_minorReasonId = Xrm.Page.getAttribute('ftp_minorreasonid').getValue()[0].id;
                if (vcmn_minorReasonId != null) {
                    //Get Template Text
                    var vcmn_minorreasonData = vcmn_getSingleEntityDataSync('ftp_minorreasonSet', 'ftp_name, ftp_notetext', vcmn_minorReasonId);
                    if (vcmn_minorreasonData.d.ftp_name != null) {
                        vcmn_minorReasonTemplateText = vcmn_minorreasonData.d.ftp_name;
                    }
                    if (vcmn_minorreasonData.d.ftp_notetext != null) {
                        vcmn_minorReasonNoteSubText = vcmn_minorreasonData.d.ftp_notetext;
                    }
                }
            }
            if (vcmn_rq_CustomerId != null) {
                //Set as veteran id
                vcmn_veteranId = vcmn_rq_CustomerId[0].id;
            }

            //Display sub-reason note text
            if (vcmn_subReasonTemplateText != null && vcmn_subReasonTemplateText != "") {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n" + vcmn_subReasonTemplateText;
                if (vcmn_minorReasonNoteSubText != null && vcmn_minorReasonNoteSubText != "") {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n" + vcmn_minorReasonNoteSubText;
                    if (vcmn_minorReasonNoteSubText == "Medication used to treat service connected conditions") {
                        //Add Service Connected Disabilities TAG for later update from function
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n" +
                            "~~~~SCDTAG~~~~";
                    }
                }
            }

            //Included required fields in template based on sub and minor reasons
            if ((vcmn_subReasonTemplateText == "Veteran is requesting a renewal of a medication no longer on their medication profile" &&
                vcmn_minorReasonNoteSubText == "Medication dose change or was taking differently than prescribed. Patient stated they have been taking regularly")
                || (vcmn_subReasonTemplateText == "Medication dose change or taken differently than prescribed")) {

                if (Xrm.Page.getAttribute('ftp_lastdirectionsonfile').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLast Directions On File: " + Xrm.Page.getAttribute('ftp_lastdirectionsonfile').getValue();
                }
                if (Xrm.Page.getAttribute('ftp_patientstatesdirections').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPatient States Directions: " + Xrm.Page.getAttribute('ftp_patientstatesdirections').getValue();
                }
                if (Xrm.Page.getAttribute('ftp_directionsby').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nDirections by: " + Xrm.Page.getAttribute('ftp_directionsby').getValue();
                }
                if (Xrm.Page.getAttribute('ftp_veteranchangeddose').getValue() != null) {
                    var vcmn_veteranChangedDose = null;
                    if (Xrm.Page.getAttribute('ftp_veteranchangeddose').getValue() == false) { vcmn_veteranChangedDose = "No"; }
                    if (Xrm.Page.getAttribute('ftp_veteranchangeddose').getValue() == true) { vcmn_veteranChangedDose = "Yes"; }
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nVeteran Changed Dose: " + vcmn_veteranChangedDose;
                }
            }
            if (vcmn_subReasonTemplateText == "Other:") {
                if (Xrm.Page.getAttribute('ftp_othertext').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nOther Text: " + Xrm.Page.getAttribute('ftp_othertext').getValue();
                }
            }
            if (vcmn_subReasonTemplateText == "Veteran is requesting medication replacement" && vcmn_minorReasonNoteSubText == "Medication lost or stolen") {
                if (Xrm.Page.getAttribute('ftp_lostorstolen').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLost or Stolen: " + Xrm.Page.getAttribute('ftp_lostorstolen').getValue();
                }
            }
            if (vcmn_subReasonTemplateText == "Veteran is requesting medication replacement" && vcmn_minorReasonNoteSubText == "Medication never arrived in mail. Tracking #:") {
                if (Xrm.Page.getAttribute('ftp_trackingnumber').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nTracking Number: " + Xrm.Page.getAttribute('ftp_trackingnumber').getValue();
                }
            }
            if (vcmn_subReasonTemplateText == "Veteran requesting refill quantity to be changed to a _____ day supply") {
                //if (Xrm.Page.getAttribute('ftp_rxrefillquantity').getValue() != null) {
                //    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nRx Refill Quantity: " + Xrm.Page.getAttribute('ftp_rxrefillquantity').getValue();
                //}

                //adjusted 5/7/18 kknab
                if (Xrm.Page.getAttribute('ftp_dayssupply_text').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText.replace(vcmn_subReasonTemplateText, vcmn_subReasonTemplateText.replace("_____", Xrm.Page.getAttribute('ftp_dayssupply_text').getValue()));
                }
            }
            if (vcmn_subReasonTemplateText == "Veteran requests medication copay reversal" && vcmn_minorReasonNoteSubText == "Other:") {
                if (Xrm.Page.getAttribute('ftp_othercopayreversal').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nOther (copay reversal): " + Xrm.Page.getAttribute('ftp_othercopayreversal').getValue();
                }
            }
            if (vcmn_subReasonTemplateText == "Veteran has stopped taking the medication") {
                if (Xrm.Page.getAttribute('ftp_reasonforstopping').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nReason for Stopping: " + Xrm.Page.getAttribute('ftp_reasonforstopping').getValue();
                }
            }
            if ((vcmn_subReasonTemplateText == "Medication requesting early refill:" &&
                vcmn_minorReasonNoteSubText == "Veteran has been requiring extra medication and is taking more than prescribed (reports taking ________ tablets / capsules per day):")
                || (vcmn_subReasonTemplateText == "Veteran is requesting a partial fill" &&
                    vcmn_minorReasonNoteSubText == "Veteran has been requiring extra medication and is taking more than prescribed (reports taking ________ tablets / capsules per day):")) {
                //if (Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue() != null) {
                //    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nQuantity Reports Taking: " + Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue();
                //}

                if (Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue() != null) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText.replace(vcmn_minorReasonNoteSubText, vcmn_minorReasonNoteSubText.replace("________", Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue()));
                }
            }

            //Always include last filled
            if (Xrm.Page.getAttribute('ftp_lastfilled').getValue() != null) {
                var vcmn_fillDate = Xrm.Page.getAttribute('ftp_lastfilled').getValue();
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLast Filled: " +
                    (vcmn_fillDate.getMonth() + 1).toString() + "/" + vcmn_fillDate.getDate().toString() + "/" + vcmn_fillDate.getFullYear().toString();
            }

            //Do Bottom Section
            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n";
            if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() != null) {
                var vcmn_methodOfRequest = "";
                if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000000) { vcmn_methodOfRequest = "Phone"; }
                if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000001) { vcmn_methodOfRequest = "In Person"; }
                if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000002) { vcmn_methodOfRequest = "Mail"; }
                if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000003) { vcmn_methodOfRequest = "Internet"; }
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nMethod of Request: " + vcmn_methodOfRequest;
            }
            if (Xrm.Page.getAttribute('ftp_pickupmethod').getValue() != null) {
                var vcmn_pickupmethod = Xrm.Page.getAttribute('ftp_pickupmethod').getValue();
                if (vcmn_pickupmethod == 100000000) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPick-Up Method: " + "Mail ";
                }
                if (vcmn_pickupmethod == 100000001) {
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPick-Up Method: " + "Window ***** ";
                }
            }
            //Get veteran's current address
            if (vcmn_veteranId != null) {
                var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'Address1_Composite', vcmn_veteranId);
                if (vcmn_contactData != null) {
                    if (vcmn_contactData.d.Address1_Composite != null && vcmn_contactData.d.Address1_Composite != '') {
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n\nAddress confirmed:";
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n" + vcmn_contactData.d.Address1_Composite;
                    }
                }
            }
            if (Xrm.Page.getAttribute('ftp_callbacknumber').getValue() != null) {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nCallback Number: " + Xrm.Page.getAttribute('ftp_callbacknumber').getValue() + "\n";
            }
            if (Xrm.Page.getAttribute('ftp_age').getValue() != null) {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nAge: " + Xrm.Page.getAttribute('ftp_age').getValue();
            }
            if (Xrm.Page.getAttribute('ftp_pcp').getValue() != null) {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPCP: " + Xrm.Page.getAttribute('ftp_pcp').getValue();
            }
            if (Xrm.Page.getAttribute('ftp_calccrcl').getValue() != null) {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nCalc CrCl: " + Xrm.Page.getAttribute('ftp_calccrcl').getValue();
            }
            if (Xrm.Page.getAttribute('ftp_latestegfrresult').getValue() != null) {
                vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLatest eGFR: " + Xrm.Page.getAttribute('ftp_latestegfrresult').getValue();
            }

            //Write Non Narcotic Template Text
            Xrm.Page.getAttribute("ftp_notedetail").setValue(vcmn_nonNarcoticTemplateText);
            Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode("always");
        }
        //*****NON NARCOTIC END*****

        //*****STANDARD TEMPLATE START*****
        else {
            if (Xrm.Page.getAttribute('ftp_subreasonid').getValue() != null) {
                vcmn_subReasonId = Xrm.Page.getAttribute('ftp_subreasonid').getValue()[0].id;
                if (vcmn_subReasonId != null) {
                    //Get Template Text
                    var vcmn_subreasonData = vcmn_getSingleEntityDataSync('ftp_subreasonSet', 'ftp_notetext', vcmn_subReasonId);
                    if (vcmn_subreasonData.d.ftp_notetext != null) {
                        vcmn_subReasonTemplateText = vcmn_subreasonData.d.ftp_notetext;
                    }
                }
            }
            if (Xrm.Page.getAttribute('ftp_minorreasonid').getValue() != null) {
                vcmn_minorReasonId = Xrm.Page.getAttribute('ftp_minorreasonid').getValue()[0].id;
                if (vcmn_minorReasonId != null) {
                    //Get Template Text
                    var vcmn_minorreasonData = vcmn_getSingleEntityDataSync('ftp_minorreasonSet', 'ftp_name, ftp_notetext', vcmn_minorReasonId);
                    if (vcmn_minorreasonData.d.ftp_name != null) {
                        vcmn_minorReasonTemplateText = vcmn_minorreasonData.d.ftp_name;
                    }
                    if (vcmn_minorreasonData.d.ftp_notetext != null) {
                        vcmn_minorReasonNoteSubText = vcmn_minorreasonData.d.ftp_notetext;
                    }
                }
            }

            if (vcmn_rq_CustomerId != null) {
                //Set as veteran id
                vcmn_veteranId = vcmn_rq_CustomerId[0].id;
            }

            //Construct Template Note
            var vcmn_subReasonName = null;
            var vcmn_templateNote = "";
            var vcmn_lastFilled = "";
            var vcmn_quantityReportsTaking = null;
            var vcmn_rxNumber = null;
            var vcmn_rxRefillQuantity = null;
            var vcmn_trackingNumber = null;
            var vcmn_opioidAgreementOnfile = null;
            var vcmn_UDSonfile = null;
            var vcmn_stateDrugMonitoringReport = null;
            var vcmn_spdmpstateonfile = null;
            var vcmn_sPDMPState2 = null;
            var vcmn_pickupmethod = null;

            var vcmn_earlyRefillComment = null;
            var vcmn_quantityTaking = null;
            var vcmn_vacationStart = null;
            var vcmn_vacationEnd = null;

            if (Xrm.Page.getAttribute('ftp_lastfilled').getValue() != null) {
                var vcmn_fillDate = Xrm.Page.getAttribute('ftp_lastfilled').getValue();
                vcmn_lastFilled = (vcmn_fillDate.getMonth() + 1).toString() + "/" + vcmn_fillDate.getDate().toString() + "/" + vcmn_fillDate.getFullYear().toString();
            }
            if (Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue() != null) { vcmn_quantityReportsTaking = Xrm.Page.getAttribute('ftp_quantityreportstaking').getValue(); }
            if (Xrm.Page.getAttribute('ftp_rxnumber').getValue() != null) { vcmn_rxNumber = Xrm.Page.getAttribute('ftp_rxnumber').getValue(); }
            if (Xrm.Page.getAttribute('ftp_rxrefillquantity').getValue() != null) { vcmn_rxRefillQuantity = Xrm.Page.getAttribute('ftp_rxrefillquantity').getValue(); }
            if (Xrm.Page.getAttribute('ftp_trackingnumber').getValue() != null) { vcmn_trackingNumber = Xrm.Page.getAttribute('ftp_trackingnumber').getValue(); }
            if (Xrm.Page.getAttribute('ftp_opiodagreementonfile').getValue() != null) { vcmn_opioidAgreementOnfile = Xrm.Page.getAttribute('ftp_opiodagreementonfile').getValue(); }
            if (Xrm.Page.getAttribute('ftp_udsonfile').getValue() != null) { vcmn_UDSonfile = Xrm.Page.getAttribute('ftp_udsonfile').getValue(); }
            if (Xrm.Page.getAttribute('ftp_statedrugmonitoringreport').getValue() != null) { vcmn_stateDrugMonitoringReport = Xrm.Page.getAttribute('ftp_statedrugmonitoringreport').getValue(); }
            if (Xrm.Page.getAttribute('ftp_spdmpstateonfile').getValue() != null) { vcmn_spdmpstateonfile = Xrm.Page.getAttribute('ftp_spdmpstateonfile').getValue(); }
            if (Xrm.Page.getAttribute('ftp_spdmpstate2').getValue() != null) { vcmn_sPDMPState2 = Xrm.Page.getAttribute('ftp_spdmpstate2').getValue(); }
            if (Xrm.Page.getAttribute('ftp_pickupmethod').getValue() != null) { vcmn_pickupmethod = Xrm.Page.getAttribute('ftp_pickupmethod').getValue(); }

            if (Xrm.Page.getAttribute('ftp_earlyrefillcomment').getValue() != null) { vcmn_earlyRefillComment = Xrm.Page.getAttribute('ftp_earlyrefillcomment').getValue(); }
            if (Xrm.Page.getAttribute('ftp_quantitytaking').getValue() != null) { vcmn_quantityTaking = Xrm.Page.getAttribute('ftp_quantitytaking').getValue(); }
            if (Xrm.Page.getAttribute('ftp_vacationstart').getValue() != null) { vcmn_vacationStart = new Date(parseInt(Xrm.Page.getAttribute('ftp_vacationstart').getValue().toString().replace("/Date(", "").replace(")/", ""), 10)); }
            if (Xrm.Page.getAttribute('ftp_vacationend').getValue() != null) { vcmn_vacationEnd = new Date(parseInt(Xrm.Page.getAttribute('ftp_vacationend').getValue().toString().replace("/Date(", "").replace(")/", ""), 10)); }

            if (Xrm.Page.getAttribute('ftp_subreasonid').getValue() != null) {
                vcmn_subReasonId = Xrm.Page.getAttribute('ftp_subreasonid').getValue()[0].id;;
                vcmn_subReasonName = Xrm.Page.getAttribute('ftp_subreasonid').getValue()[0].name;

                if (vcmn_subReasonName == 'Regular') {
                    vcmn_templateNote = vcmn_templateNote + "Veteran is requesting a RENEWAL." + "\n\n";
                    vcmn_templateNote = vcmn_templateNote + "Last Filled: " + vcmn_lastFilled + "\n\n";
                    if (vcmn_pickupmethod != null) {
                        if (vcmn_pickupmethod == 100000000) {
                            vcmn_templateNote = vcmn_templateNote + "\nPick-Up Method: " + "Mail ";
                        }
                        if (vcmn_pickupmethod == 100000001) {
                            vcmn_templateNote = vcmn_templateNote + "\nPick-Up Method: " + "Window ***** ";
                        }
                    }
                    if (vcmn_minorReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonTemplateText + "\n\n";
                    }
                    if (vcmn_minorReasonNoteSubText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonNoteSubText + "\n\n";
                    }
                    if (vcmn_subReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_subReasonTemplateText + "\n\n";
                    }
                }

                if (vcmn_subReasonName == 'Early') {
                    vcmn_templateNote = vcmn_templateNote + "Veteran is requesting EARLY FILL." + "\n\n";
                    vcmn_templateNote = vcmn_templateNote + "Last Filled: " + vcmn_lastFilled + "\n\n";
                    if (vcmn_minorReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonTemplateText + "\n\n";
                    }

                    if (vcmn_quantityTaking != null) {
                        vcmn_templateNote = vcmn_templateNote + "Quantity Taking: " + vcmn_quantityTaking + "\n\n";
                    }

                    if (vcmn_vacationStart != null && vcmn_vacationEnd != null) {
                        vcmn_templateNote = vcmn_templateNote + "Veteran Leaving Town: " + vcmn_vacationStart + ' - ' + vcmn_vacationEnd + "\n\n";
                    }

                    if (vcmn_minorReasonNoteSubText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonNoteSubText + "\n\n";
                    }
                    if (vcmn_subReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_subReasonTemplateText + "\n\n";
                    }
                }

                if (vcmn_subReasonName == 'Lost') {
                    vcmn_templateNote = vcmn_templateNote + "Veteran claims prescriptions(s) were LOST and is requesting a new prescription/early fill." + "\n\n";
                    if (vcmn_rxNumber != null) {
                        vcmn_templateNote = vcmn_templateNote + "RX#: " + vcmn_rxNumber + "\n\n";
                    }
                    if (vcmn_rxRefillQuantity != null) {
                        vcmn_templateNote = vcmn_templateNote + "Rx Refill Quantity: " + vcmn_rxRefillQuantity + "\n\n";
                    }
                    vcmn_templateNote = vcmn_templateNote + "Last Filled: " + vcmn_lastFilled + "\n\n";
                    if (vcmn_minorReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonTemplateText + "\n\n";
                    }
                    if (vcmn_trackingNumber != null) {
                        vcmn_templateNote = vcmn_templateNote + "Tracking Number: " + vcmn_trackingNumber + "\n\n";
                    }
                    if (vcmn_minorReasonNoteSubText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonNoteSubText + "\n\n";
                    }
                    if (vcmn_subReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_subReasonTemplateText + "\n\n";
                    }
                }

                if (vcmn_subReasonName == 'Stolen') {
                    vcmn_templateNote = vcmn_templateNote + "Veteran claims prescriptions(s) were STOLEN and is requesting a new prescription/early fill." + "\n\n";
                    vcmn_templateNote = vcmn_templateNote + "Last Filled: " + vcmn_lastFilled + "\n\n";
                    if (vcmn_minorReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonTemplateText + "\n\n";
                    }
                    if (vcmn_minorReasonNoteSubText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonNoteSubText + "\n\n";
                    }
                    if (vcmn_subReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_subReasonTemplateText + "\n\n";
                    }
                }

                if (vcmn_subReasonName == 'Requesting Hold / Unhold') {
                    if (vcmn_subReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_subReasonTemplateText + "\n\n";
                    }
                    if (vcmn_minorReasonTemplateText != null) {
                        vcmn_templateNote = vcmn_templateNote + vcmn_minorReasonTemplateText + "\n\n";
                    }
                    if (vcmn_requestData.d.ftp_rxtype != null) {
                        var vcmn_rxType = ""
                        if (vcmn_requestData.d.ftp_rxtype.Value == 100000000) { vcmn_rxType = "Refill"; }
                        if (vcmn_requestData.d.ftp_rxtype.Value == 100000001) { vcmn_rxType = "Renewal"; }
                        vcmn_templateNote = vcmn_templateNote + "\nRx Type: " + vcmn_rxType;
                    }
                    vcmn_templateNote = vcmn_templateNote + "\nLast Filled: " + vcmn_lastFilled + "\n\n";
                    if (vcmn_pickupmethod != null) {
                        if (vcmn_pickupmethod == 100000000) {
                            vcmn_templateNote = vcmn_templateNote + "\nPick-Up Method: " + "Mail ";
                        }
                        if (vcmn_pickupmethod == 100000001) {
                            vcmn_templateNote = vcmn_templateNote + "\nPick-Up Method: " + "Window ***** ";
                        }
                    }
                    if (Xrm.Page.getAttribute('ftp_othertext').getValue() != null) {
                        vcmn_templateNote = vcmn_templateNote + "\nOther Text: " + Xrm.Page.getAttribute('ftp_othertext').getValue();
                    }
                    if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() != null) {
                        var vcmn_methodOfRequest = "";
                        if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000000) { vcmn_methodOfRequest = "Phone"; }
                        if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000001) { vcmn_methodOfRequest = "In Person"; }
                        if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000002) { vcmn_methodOfRequest = "Mail"; }
                        if (Xrm.Page.getAttribute('ftp_methodofrequest').getValue() == 100000003) { vcmn_methodOfRequest = "Internet"; }
                        vcmn_templateNote = vcmn_templateNote + "\nMethod of Request: " + vcmn_methodOfRequest;
                    }
                    if (Xrm.Page.getAttribute('ftp_age').getValue() != null) {
                        vcmn_templateNote = vcmn_templateNote + "\nAge: " + Xrm.Page.getAttribute('ftp_age').getValue();
                    }
                    if (Xrm.Page.getAttribute('ftp_pcp').getValue() != null) {
                        vcmn_templateNote = vcmn_templateNote + "\nPCP: " + Xrm.Page.getAttribute('ftp_pcp').getValue();
                    }
                    if (Xrm.Page.getAttribute('ftp_calccrcl').getValue() != null) {
                        vcmn_templateNote = vcmn_templateNote + "\nCalc CrCl: " + Xrm.Page.getAttribute('ftp_calccrcl').getValue();
                    }
                    if (Xrm.Page.getAttribute('ftp_latestegfrresult').getValue() != null) {
                        vcmn_templateNote = vcmn_templateNote + "\nLatest eGFR: " + Xrm.Page.getAttribute('ftp_latestegfrresult').getValue();
                    }
                }

                //If Template Text was populated, fill in additional info...
                if (vcmn_templateNote != '') {
                    vcmn_templateNote = vcmn_templateNote + "\n______________________________________________________________________________________________________________________\n\n";
                    //Is an Opioid Agreement current and onfile?
                    if (vcmn_opioidAgreementOnfile != null) {
                        vcmn_templateNote = vcmn_templateNote + "Consent for Long-Term Opioid Therapy for Pain:\n";
                        if (vcmn_opioidAgreementOnfile == 100000000) {
                            //Yes Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Yes - See Postings\n\n";
                        }
                        if (vcmn_opioidAgreementOnfile == 100000001) {
                            //No Option
                            vcmn_templateNote = vcmn_templateNote + "[X] No - Veteran does not have a signed Consent for Long-Term Opioid Therapy for pain (in Postings).\nConsent MUST be reviewed and signed as soon as possible.\n\n";
                        }
                    }
                    //Is valid Urine Drug Screen on-file?
                    if (vcmn_UDSonfile != null) {
                        vcmn_templateNote = vcmn_templateNote + "Is valid Urine Drug Screen on-file?\n";
                        if (vcmn_UDSonfile == 100000000) {
                            //Yes Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Yes - See Postings\n\n";
                        }
                        if (vcmn_UDSonfile == 100000001) {
                            //No Option
                            vcmn_templateNote = vcmn_templateNote + "[X] No - Veteran does not have a valid Urine Drug Screen on-file.\n\n";
                        }
                    }
                    //State Drug Monitoring Report?
                    if (vcmn_stateDrugMonitoringReport != null) {
                        vcmn_templateNote = vcmn_templateNote + "State Prescription Drug Monitoring Program (SPDMP) report completed in last year:\n";
                        if (vcmn_stateDrugMonitoringReport == 100000000) {
                            //Positive Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Positive - see SPDMP note.\n\n";
                        }
                        if (vcmn_stateDrugMonitoringReport == 100000001) {
                            //Negative Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Negative.\n\n";
                        }
                        if (vcmn_stateDrugMonitoringReport == 100000002) {
                            //Not on File Option
                            vcmn_templateNote = vcmn_templateNote + "[X] None on file, Pharmacy to request.\n\n";
                        }
                        //Add in States (2), convert integers to state names from form's hidden state options
                        var vcmn_usStatesOptions = Xrm.Page.getAttribute("ftp_usstatesoption").getOptions();
                        var vcmn_stateList = "";
                        if (vcmn_spdmpstateonfile != null) {
                            //find text value for option
                            $(vcmn_usStatesOptions).each(function (i, e) {
                                var vcmn_optionText = $(this)[0].text;
                                var vcmn_optionValue = $(this)[0].value;
                                if (vcmn_spdmpstateonfile == vcmn_optionValue) { vcmn_stateList = vcmn_optionText; }
                            });
                        }
                        if (vcmn_sPDMPState2 != null) {
                            //find text value for option
                            $(vcmn_usStatesOptions).each(function (i, e) {
                                var vcmn_optionText = $(this)[0].text;
                                var vcmn_optionValue = $(this)[0].value;
                                if (vcmn_sPDMPState2 == vcmn_optionValue) { vcmn_stateList = vcmn_stateList + ", " + vcmn_optionText; }
                            });
                        }
                        if (vcmn_stateList != "") {
                            //Add states list to note
                            vcmn_templateNote = vcmn_templateNote + "State Prescription Drug Monitoring Program for the following state(s): " + vcmn_stateList;
                        }
                    }

                    //If ftp_pickupmethod has a value
                    if (vcmn_pickupmethod != null && vcmn_subReasonName != 'Regular' && vcmn_subReasonName != 'Requesting Hold / Unhold') {
                        vcmn_templateNote = vcmn_templateNote + "\n______________________________________________________________________________________________________________________\n\n";
                        vcmn_templateNote = vcmn_templateNote + "Veteran requested Method of Pick Up:  ";
                        if (vcmn_pickupmethod == 100000000) {
                            //Mail Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Mail. \n\n";
                        }
                        if (vcmn_pickupmethod == 100000001) {
                            //Window Option
                            vcmn_templateNote = vcmn_templateNote + "[X] Window. \n\n";
                        }
                        //Get veteran's current address
                        if (vcmn_veteranId != null) {
                            var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'Address1_Composite', vcmn_veteranId);
                            if (vcmn_contactData != null) {
                                if (vcmn_contactData.d.Address1_Composite != null && vcmn_contactData.d.Address1_Composite != '') {
                                    vcmn_templateNote = vcmn_templateNote + "Address confirmed with caller: \n";
                                    vcmn_templateNote = vcmn_templateNote + vcmn_contactData.d.Address1_Composite + "\n";
                                    if (Xrm.Page.getAttribute('ftp_callbacknumber').getValue() != null) {
                                        vcmn_templateNote = vcmn_templateNote + Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
                                    }
                                }
                            }
                        }
                    }
                }

                //Write note text
                Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_templateNote);
                Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
                vcmn_noteTextChange();
            }
        }
        //*****STANDARD TEMPLATE END*****

        //Default Diagnosis code if TAN or PHARMACY user, based on systemuser lookup
        var vcmn_currentUserId = Xrm.Page.context.getUserId();
        var vcmn_currentUserData = vcmn_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', vcmn_currentUserId);
        if (vcmn_currentUserData != null) {
            if (vcmn_currentUserData.d.msdyusd_USDConfigurationId != null) {
                if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name != null) {
                    //TAN logic
                    if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name == 'TAN Configuration') {
                        //Get Default Tan Configuration from User's Facility
                        if (vcmn_currentUserData.d.ftp_FacilitySiteId != null) {
                            if (vcmn_currentUserData.d.ftp_FacilitySiteId.Id != null) {
                                var vcmn_currentUserFacilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_defaulttandiagnosiscode', vcmn_currentUserData.d.ftp_FacilitySiteId.Id);
                                if (vcmn_currentUserFacilityData != null) {
                                    if (vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode != null) {
                                        if (vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.Id != null) {
                                            //Write Diagnosis code 
                                            vcmn_setSimpleLookupValue('ftp_diagnosiscode', vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.LogicalName, vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.Id, vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.Name);
                                            Xrm.Page.getAttribute('ftp_diagnosiscode').setSubmitMode('always');
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //Pharmacy logic
                    if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name == 'Pharmacy Configuration') {
                        //Get Default Pharmacy Configuration from User's Facility
                        if (vcmn_currentUserData.d.ftp_FacilitySiteId != null) {
                            if (vcmn_currentUserData.d.ftp_FacilitySiteId.Id != null) {
                                var vcmn_currentUserFacilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_defaultpharmacyprimarydiagnosiscode', vcmn_currentUserData.d.ftp_FacilitySiteId.Id);
                                if (vcmn_currentUserFacilityData != null) {
                                    if (vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode != null) {
                                        if (vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.Id != null) {
                                            //Write Diagnosis code
                                            vcmn_setSimpleLookupValue('ftp_diagnosiscode', vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.LogicalName, vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.Id, vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.Name);
                                            Xrm.Page.getAttribute('ftp_diagnosiscode').setSubmitMode('always');
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //Get Current Facility based on veteran/contact Use Current Facility (ftp_currentfacilityid) Text, if empty use Home Facility (ftp_FacilityId)
        if (vcmn_veteranId != null) {
            var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'ftp_currentfacilityid, ftp_FacilityId', vcmn_veteranId);
            if (vcmn_contactData != null) {
                if (vcmn_contactData.d.ftp_currentfacilityid != null) {
                    if (vcmn_contactData.d.ftp_currentfacilityid.Id != null) {
                        //May not be needed, but leave code to insert as determined when writing integration code
                        //*vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_currentfacilityid.LogicalName, vcmn_contactData.d.ftp_currentfacilityid.Id, vcmn_contactData.d.ftp_currentfacilityid.Name);
                        //*Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                    }
                    else {
                        //Get Facility from Home Facility
                        if (vcmn_contactData.d.ftp_FacilityId != null) {
                            //May not be needed, but leave code to insert as determined when writing integration code
                            //*vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_FacilityId.LogicalName, vcmn_contactData.d.ftp_FacilityId.Id, vcmn_contactData.d.ftp_FacilityId.Name);
                            //*Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                        }
                    }
                }
                else {
                    //Get Facility from Home Facility
                    if (vcmn_contactData.d.ftp_FacilityId != null) {
                        //May not be needed, but leave code to insert as determined when writing integration code
                        //*vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_FacilityId.LogicalName, vcmn_contactData.d.ftp_FacilityId.Id, vcmn_contactData.d.ftp_FacilityId.Name);
                        //*Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                    }
                }
            }
        }

        //Append Generic Template Data to top of existing note
        var vcmn_genericTemplateData = "Callback Number: ";
        if (Xrm.Page.getAttribute('ftp_callbacknumber').getValue() != null && Xrm.Page.getAttribute('ftp_callbacknumber').getValue() != "") {
            vcmn_genericTemplateData = vcmn_genericTemplateData + Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        }
        //Construct new note with existing note data
        var vcmn_existingNoteData = "";
        if (Xrm.Page.getAttribute("ftp_notedetail").getValue() != null && Xrm.Page.getAttribute("ftp_notedetail").getValue() != "") {
            vcmn_existingNoteData = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        }
        vcmn_genericTemplateData = vcmn_genericTemplateData + "\n\n" + vcmn_existingNoteData;
        //Replace existing note if it is not a Non-Narcotic Note
        if (vcmn_nonNarcoticTemplate == false) {
            Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_genericTemplateData);
            Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
            vcmn_noteTextChange();
        }


        //Get ICN via web service and get Service Connected disabilities, Appointments and Medications thereafter
        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_SSN = '';
        var vcmn_DOB = '';

        vcmn_veteranId = vcmn_rq_CustomerId[0].id;

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, GovernmentId', vcmn_veteranId);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.ftp_DateofBirth != null) { vcmn_DOB = vcmn_contactData.d.ftp_DateofBirth; }
            if (vcmn_contactData.d.GovernmentId != null) { vcmn_SSN = vcmn_contactData.d.GovernmentId; }
        }

        //Perform MVI Search for Service Connected Disabilities
        vcmn_unattendedMviSearchSCD(vcmn_veteranFirstName, vcmn_veteranLastName, vcmn_DOB, vcmn_SSN);
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_createTemplateNote): ' + err.message);
    }
}

function vcmn_getServiceConnectedDisabilities(vcmn_patientICN) {
    try {
        //******Developer Bypass for missing ICN******
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}") {
                alert("Developer ICN bypass applied!");
                vcmn_patientICN = "123456V123456";
            }
        }

        //Verify Patient ICN
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            //No ICN, do not proceed
            return false;
        }

        //Keep ICN in memory for reuse
        vcmn_SecurePatientICN = vcmn_patientICN;

        ////Construct Service Parameters
        //var vcmn_idobject = {};
        //vcmn_idobject.NationalId = '000000' + vcmn_SecurePatientICN + '000000';
        //var vcmn_serviceParams = [{
        //    key: "identifier",
        //    type: "c:string",
        //    value: JSON.stringify(vcmn_idobject)
        //}];
        ////Call the web service security function
        //CrmSecurityTokenEncryption(vcmn_EnrollmentEligibilitySummaryURLbase, vcmn_serviceParams, vcmn_serverUrl, vcmn_getEsrEnrollmentJSON_response)

        vialib_callAction('ftp_VeteranEnrollment',
            {
                "Request": vcmn_SecurePatientICN
            },
            function (data) {
                debugger;
                esrResponseObject = JSON.parse(data.Response);
                vcmn_getEsrEnrollmentJSON_response(null, esrResponseObject); //finishes with finishESROperations();
            },
            function (err) {
                console.log(err);
            }
        );

    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_getServiceConnectedDisabilities): ' + err.message);
    }
}

function vcmn_getEsrEnrollmentJSON_response(vcmn_error, vcmn_getesrresponse) {
    try {
        //NOTE:Expecting JSON result, if changed to XML modify code accordingly.

        //Set JSON Data to Null;
        vcmn_EnrollmentEligibilitySummaryData = null;

        //Check for non ESR service error
        if (vcmn_error != null) {
            alert("An ESR Secure Service error occured:\n " + vcmn_error + " \nDebugInfo: " + vcmn_getesrresponse);
        }
        else {
            //Test for ESR service error
            if (vcmn_getesrresponse.ErrorOccurred == true) {
                alert("An ESR Secure Service error occurred:\n " + vcmn_getesrresponse.ErrorMessage + " \nDebugInfo: " + vcmn_getesrresponse.DebugInfo);
            }
            else {
                //Set Data Returned
                vcmn_EnrollmentEligibilitySummaryData = vcmn_getesrresponse;
            }
        }

        var vcmn_SCDnoteString = '';
        if (vcmn_EnrollmentEligibilitySummaryData == null) {
            vcmn_SCDnoteString = "\nNo Service Connected Disabilities Found";
        }
        else {
            //Create base Note String
            vcmn_SCDnoteString = vcmn_SCDnoteString + "\n-------------------------------------------------------------------------\n";
            vcmn_SCDnoteString = vcmn_SCDnoteString + "Special Treatment Authority and Service Connected Disabilities";
            vcmn_SCDnoteString = vcmn_SCDnoteString + "\n-------------------------------------------------------------------------\n";

            //Data from parentnode 'enrollmentDeterminationInfo' 
            var $vcmn_enrollmentDeterminationInfo = null;
            var $vcmn_primaryEligibility = null;
            var $vcmn_type = null;
            var vcmn_typeText = null;
            var $vcmn_enrollmentCategoryName = null;
            var vcmn_enrollmentCategoryNameText = null;
            var $vcmn_specialFactors = null;
            var $vcmn_envContaminantsInd = null;
            var vcmn_envContaminantsIndText = null;
            var $vcmn_radiationExposureInd = null;
            var vcmn_radiationExposureIndText = null;
            var $vcmn_agentOrangeInd = null;
            var vcmn_agentOrangeIndText = null;
            var $vcmn_campLejeuneInd = null;
            var vcmn_campLejeuneIndText = null;
            var $vcmn_serviceConnectionAward = null;
            var $vcmn_serviceConnectedPercentage = null;
            var vcmn_serviceConnectedPercentageText = null;
            var $vcmn_ratedDisabilities = null;

            var $vcmn_agentOrangeLocation = null;
            var vcmn_agentOrangeLocationText = null;
            var $vcmn_radiationExposureMethod = null;
            var vcmn_radiationExposureMethodText = null;

            var $vcmn_noseThroatRadiumInfo = null;
            var $vcmn_diagnosedWithCancer = null;
            var vcmn_diagnosedWithCancerText = null;

            var $vcmn_militarySexualTraumaInfo = null;
            var $vcmn_milSexTraumaStatus = null;
            var vcmn_milSexTraumaStatusText = null;

            //Data from parentnode 'militaryServiceInfo' 
            var $vcmn_militaryServiceInfo = null;
            var $vcmn_combatVeteranEligibilityEndDate = null;
            var vcmn_combatVeteranEligibilityEndDateText = null;
            var $vcmn_shadIndicator = null;
            var vcmn_shadIndicatorText = null;

            var vcmn_ratedDisabilityPercentageTotal = 0;

            var vcmn_detailrowcount = 0;

            if (vcmn_EnrollmentEligibilitySummaryData != null) {
                $vcmn_enrollmentDeterminationInfo = vcmn_EnrollmentEligibilitySummaryData.Data.EnrollmentDeterminationInfo;
            }

            if ($vcmn_enrollmentDeterminationInfo != null) {
                $vcmn_primaryEligibility = $vcmn_enrollmentDeterminationInfo.PrimaryEligibility;

                if ($vcmn_primaryEligibility != null) {
                    $vcmn_type = $vcmn_primaryEligibility.Type;
                    if ($vcmn_type != null) { vcmn_typeText = $vcmn_type; }
                }

                $vcmn_enrollmentCategoryName = $vcmn_enrollmentDeterminationInfo.EnrollmentCategoryName;
                if ($vcmn_enrollmentCategoryName != null) { vcmn_enrollmentCategoryNameText = $vcmn_enrollmentCategoryName; }

                $vcmn_specialFactors = $vcmn_enrollmentDeterminationInfo.SpecialFactors;
                if ($vcmn_specialFactors != null) {
                    $vcmn_envContaminantsInd = $vcmn_specialFactors.EnvContaminantsInd;
                    if ($vcmn_envContaminantsInd != null) { vcmn_envContaminantsIndText = $vcmn_envContaminantsInd; }
                    $vcmn_radiationExposureInd = $vcmn_specialFactors.RadiationExposureInd;
                    if ($vcmn_radiationExposureInd != null) { vcmn_radiationExposureIndText = $vcmn_radiationExposureInd; }
                    $vcmn_agentOrangeInd = $vcmn_specialFactors.AgentOrangeInd;
                    if ($vcmn_agentOrangeInd != null) { vcmn_agentOrangeIndText = $vcmn_agentOrangeInd; }
                    $vcmn_campLejeuneInd = $vcmn_specialFactors.CampLejeuneInd;
                    if ($vcmn_campLejeuneInd != null) { vcmn_campLejeuneIndText = $vcmn_campLejeuneInd; }
                    $vcmn_agentOrangeLocation = $vcmn_specialFactors.AgentOrangeLocation;
                    if ($vcmn_agentOrangeLocation != null) { vcmn_agentOrangeLocationText = $vcmn_agentOrangeLocation; }
                    $vcmn_radiationExposureMethod = $vcmn_specialFactors.RadiationExposureMethod;
                    if ($vcmn_radiationExposureMethod != null) { vcmn_radiationExposureMethodText = $vcmn_radiationExposureMethod; }
                }

                $vcmn_serviceConnectionAward = $vcmn_enrollmentDeterminationInfo.ServiceConnectionAward;

                if ($vcmn_serviceConnectionAward != null) {
                    $vcmn_serviceConnectedPercentage = $vcmn_serviceConnectionAward.ServiceConnectedPercentage;
                    if ($vcmn_serviceConnectedPercentage != null) { vcmn_serviceConnectedPercentageText = $vcmn_serviceConnectedPercentage; }
                    $vcmn_ratedDisabilities = $vcmn_serviceConnectionAward.RatedDisabilities;

                    //Get each disability listed and add to note string
                    vcmn_SCDnoteString = vcmn_SCDnoteString + "SC Disability: ";

                    for (var i = 0; !!$vcmn_ratedDisabilities && Array.isArray($vcmn_ratedDisabilities.RatedDisability) && i <= $vcmn_ratedDisabilities.RatedDisability.length - 1; i++) {
                        var vcmn_ratedDisabilityPercent = 0;
                        var vcmn_disability = null;
                        if (Number($vcmn_ratedDisabilities.RatedDisability[i].Percentage) > 0) {
                            vcmn_ratedDisabilityPercentageTotal = vcmn_ratedDisabilityPercentageTotal + Number($vcmn_ratedDisabilities.RatedDisability[i].Percentage);
                            vcmn_ratedDisabilityPercent = Number($vcmn_ratedDisabilities.RatedDisability[i].Percentage);
                        }
                        //Add Rated Disabilities to the Note String if Disability Percent > 0
                        if (vcmn_ratedDisabilityPercent > 0) {
                            vcmn_SCDnoteString = vcmn_SCDnoteString + $vcmn_ratedDisabilities.RatedDisability[i].Disability + "\n";
                        }
                    };
                    vcmn_SCDnoteString = vcmn_SCDnoteString + "\n";
                }

                $vcmn_noseThroatRadiumInfo = $vcmn_enrollmentDeterminationInfo.NoseThroatRadiumInfo;
                if ($vcmn_noseThroatRadiumInfo != null) {
                    $vcmn_diagnosedWithCancer = $vcmn_noseThroatRadiumInfo.DiagnosedWithCancer;
                    if ($vcmn_diagnosedWithCancer != null) { vcmn_diagnosedWithCancerText = $vcmn_diagnosedWithCancer; }
                }

                $vcmn_militarySexualTraumaInfo = $vcmn_enrollmentDeterminationInfo.MilitarySexualTraumaInfo;
                if ($vcmn_militarySexualTraumaInfo != null) {
                    $vcmn_milSexTraumaStatus = $vcmn_militarySexualTraumaInfo.Status;
                    if ($vcmn_milSexTraumaStatus != null) { vcmn_milSexTraumaStatusText = $vcmn_milSexTraumaStatus; }
                }
            }

            if (vcmn_EnrollmentEligibilitySummaryData != null) {
                $vcmn_militaryServiceInfo = vcmn_EnrollmentEligibilitySummaryData.Data.MilitaryServiceInfo;
            }
            if ($vcmn_militaryServiceInfo != null) {
                $vcmn_combatVeteranEligibilityEndDate = $vcmn_militaryServiceInfo.CombatVeteranEligibilityEndDate;
                if ($vcmn_combatVeteranEligibilityEndDate != null) {
                    vcmn_combatVeteranEligibilityEndDateText = vcmn_combatVeteranEligibilityEndDateText = $vcmn_combatVeteranEligibilityEndDate;
                }
                $vcmn_shadIndicator = $vcmn_militaryServiceInfo.ShadIndicator;
                if ($vcmn_shadIndicator != null) { vcmn_shadIndicatorText = $vcmn_shadIndicator; }
            }

            //If no eligibility specified, set to false
            if (vcmn_typeText == null || vcmn_typeText == '') { vcmn_typeText = false; }

            //Change boolean values to false if not marked true
            if (vcmn_envContaminantsIndText != 'true') { vcmn_envContaminantsIndText = false; }
            if (vcmn_radiationExposureIndText != 'true') { vcmn_radiationExposureIndText = false; }
            if (vcmn_agentOrangeIndText != 'true') { vcmn_agentOrangeIndText = false; }
            if (vcmn_campLejeuneIndText != 'true') { vcmn_campLejeuneIndText = false; }

            if (vcmn_diagnosedWithCancerText != 'true') { vcmn_diagnosedWithCancerText = false; }
            if (vcmn_shadIndicatorText != 'true') { vcmn_shadIndicatorText = false; }

            //Change all True/False to Yes/No
            if (vcmn_typeText == false) { vcmn_typeText = 'No'; }

            if (vcmn_envContaminantsIndText == "true") { vcmn_envContaminantsIndText = "Yes"; } else { vcmn_envContaminantsIndText = "No"; }
            if (vcmn_radiationExposureIndText == "true") {
                vcmn_radiationExposureIndText = "Yes";
                if (vcmn_radiationExposureMethodText != null) { vcmn_radiationExposureIndText = vcmn_radiationExposureIndText + " - " + vcmn_radiationExposureMethodText; }
            } else {
                vcmn_radiationExposureIndText = "No";
            }
            if (vcmn_agentOrangeIndText == "true") {
                vcmn_agentOrangeIndText = "Yes";
                if (vcmn_agentOrangeLocationText != null) { vcmn_agentOrangeIndText = vcmn_agentOrangeIndText + " - " + vcmn_agentOrangeLocationText; }
            }
            else {
                vcmn_agentOrangeIndText = "No";
            }
            if (vcmn_campLejeuneIndText == "true") { vcmn_campLejeuneIndText = "Yes"; } else { vcmn_campLejeuneIndText = "No"; }

            if (vcmn_diagnosedWithCancerText == "true") { vcmn_diagnosedWithCancerText = "Yes"; } else { vcmn_diagnosedWithCancerText = "No"; }

            if (vcmn_combatVeteranEligibilityEndDateText != null && vcmn_combatVeteranEligibilityEndDateText != '') { vcmn_combatVeteranEligibilityEndDateText = 'Yes'; }

            if (vcmn_shadIndicatorText == "true") { vcmn_shadIndicatorText = "Yes"; } else { vcmn_shadIndicatorText = "No"; }

            //Construct summary note part
            if (vcmn_envContaminantsIndText != null && vcmn_envContaminantsIndText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Environmental Contaminant: " + vcmn_envContaminantsIndText + "\n"; }
            if (vcmn_combatVeteranEligibilityEndDateText != null && vcmn_combatVeteranEligibilityEndDateText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Combat Veteran: " + vcmn_combatVeteranEligibilityEndDateText + "\n"; }
            if (vcmn_radiationExposureIndText != null && vcmn_radiationExposureIndText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Radiation Exposure: " + vcmn_radiationExposureIndText + "\n"; }
            if (vcmn_agentOrangeIndText != null && vcmn_agentOrangeIndText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Agent Orange: " + vcmn_agentOrangeIndText + "\n"; }
            if (vcmn_shadIndicatorText != null && vcmn_shadIndicatorText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Shipboard Hazard & Defense: " + vcmn_shadIndicatorText + "\n"; }
            if (vcmn_diagnosedWithCancerText != null && vcmn_diagnosedWithCancerText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Head/Neck Cancer: " + vcmn_diagnosedWithCancerText + "\n"; }
            if (vcmn_milSexTraumaStatusText != null && vcmn_milSexTraumaStatusText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Military Sexual Trauma: " + vcmn_milSexTraumaStatusText + "\n"; }
            if (vcmn_campLejeuneIndText != null && vcmn_campLejeuneIndText != '') { vcmn_SCDnoteString = vcmn_SCDnoteString + "Camp Lejeune: " + vcmn_campLejeuneIndText + "\n"; }
        }

        //Update note with new SCD note data
        var vcmn_existingNoteData = "";
        if (Xrm.Page.getAttribute("ftp_notedetail").getValue() != null && Xrm.Page.getAttribute("ftp_notedetail").getValue() != "") {
            vcmn_existingNoteData = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        }

        if (vcmn_existingNoteData.indexOf("~~~~SCDTAG~~~~") > -1) {
            var vcmn_extendedTemplateData = vcmn_existingNoteData.replace("~~~~SCDTAG~~~~", vcmn_SCDnoteString);
            //Replace existing note
            Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_extendedTemplateData);
            Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
            vcmn_noteTextChange();
        }

        //Move on to Appointments
        vcmn_getPatientAppointments(vcmn_SecurePatientICN);
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_getEsrEnrollmentJSON_response): ' + err.message);
    }
}

function vcmn_getPatientAppointments(vcmn_patientICN) {
    try {
        //******Developer Bypass for missing ICN******
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}") {
                alert("Developer ICN bypass applied!");
                vcmn_patientICN = "123456V123456";
            }
        }

        //Verify Patient ICN
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            //No ICN, do not proceed
            return false;
        }

        //Get appointment data from the web service
        vcmn_getAppointmentData(vcmn_patientICN);
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_getPatientAppointments): ' + err.message);
    }
}

function vcmn_getAppointmentData(vcmn_nationalId) {
    try {
        vialib_callAction('ftp_VEISGetCallout',
            {
                "Request": vcmn_nationalId,
                "Api":"ftp_appointmentapiurl"
            },
            function (data) {
                debugger;
                esrResponseObject = JSON.parse(data.Response);
                vcmn_processAppointmentsResponse(esrResponseObject); //finishes with finishESROperations();
            },
            function (err) {
                console.log(err);
            }
        );
        //if (vcmn_useSecureAppointmentAPI) {
        //    try {
        
        //        var vcmn_secureAppointmentParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: vcmn_nationalId }) }];
        //        CrmSecurityTokenEncryption(
        //            vcmn_AppointmentsSecureUrl,
        //            vcmn_secureAppointmentParams,
        //            vcmn_serverUrl,
        //            function (pError, pResponse) {
        //                if (!!pError) {
        //                    vcmn_processAppointmentsResponse(null);
        //                }
        //                else if (pResponse.ErrorOccurred) {
        //                    vcmn_processAppointmentsResponse(null);
        //                }
        //                else {
        //                    vcmn_processAppointmentsResponse(pResponse);
        //                }
        //            }
        //        );
        //    }
        //    catch (err) {
        //        alert("Request Progress Note Template Script Function Error(vcmn_getAppointmentData [secure]): " + err.message);
        //        return null;
        //    }
        //}
        //else {
        //    var vcmn_appointmentURL = vcmn_AppointmentsUrl + '000000' + vcmn_nationalId + '000000';
        //    $.ajax({
        //        type: "GET",
        //        url: vcmn_appointmentURL,
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: function (data) {
        //            vcmn_processAppointmentsResponse(data);
        //        },
        //        error: function (jqXHR, textStatus, errorThrown) {
        //            //System Error
        //            vcmn_processAppointmentsResponse(null);
        //        },
        //        async: true,
        //        cache: false
        //    });
        //}
    }
    catch (err) {
        alert("Request Progress Note Template Script Function Error(vcmn_getAppointmentData): " + err.message);
        return null;
    }
}

function vcmn_processAppointmentsResponse(vcmn_appointmentData) {
    try {
        var vcmn_APPnoteString = '';
        if (vcmn_appointmentData == null || vcmn_appointmentData == '') {
            vcmn_APPnoteString = "\nNo Appointments Found";
        }
        else {
            //Got data, check for errors
            if (vcmn_appointmentData.ErrorOccurred == false) {
                var vcmn_currentDateTime = new Date();
                if (vcmn_appointmentData.Data != null) {
                    for (var i = 0; i <= vcmn_appointmentData.Data.length - 1; i++) {
                        var vcmn_jsonDateTimeDate = null;
                        if (vcmn_appointmentData.Data[i].DateTimeDate != null) { vcmn_jsonDateTimeDate = vcmn_appointmentData.Data[i].DateTimeDate; }
                        if (vcmn_currentDateTime > new Date(vcmn_jsonDateTimeDate)) {
                            //Do Nothing, skip over the record
                        }
                        else {
                            //Include appointment in appointment list:
                            vcmn_APPnoteString = vcmn_APPnoteString + "\n" + (new Date(vcmn_jsonDateTimeDate)).toString()
                            if (vcmn_appointmentData.Data[i].ClinicName != null) { vcmn_APPnoteString = vcmn_APPnoteString + " - " + vcmn_appointmentData.Data[i].ClinicName; }
                            if (vcmn_appointmentData.Data[i].FacilityName != null) { vcmn_APPnoteString = vcmn_APPnoteString + " - " + vcmn_appointmentData.Data[i].FacilityName; }
                            if (vcmn_appointmentData.Data[i].StatusName != null) { vcmn_APPnoteString = vcmn_APPnoteString + " - " + vcmn_appointmentData.Data[i].StatusName; }
                        }
                    }
                }
                if (vcmn_APPnoteString == '') { vcmn_APPnoteString = "\nNo Appointments Found"; }
            }
            else {
                vcmn_APPnoteString = "\nNo Appointments Found";
            }
        }
        //If there are appointments then add to the note if a Non-Narcotic Template Note
        if (vcmn_APPnoteString != '' && vcmn_nonNarcoticTemplate == true) {
            vcmn_APPnoteString = "\n\nNext Appointment(s) Scheduled: " + vcmn_APPnoteString;
            //Add to bottom of existing Note text
            vcmn_existingNoteData = Xrm.Page.getAttribute("ftp_notedetail").getValue();
            Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_existingNoteData + vcmn_APPnoteString);
            Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
            vcmn_noteTextChange();
        }

        //Move on to Medications
        var vcmn_reasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();

        var vcmn_reasonForRequestName = '';
        var vcmn_requestIdName = '';
        if (vcmn_reasonForRequest != null) { vcmn_reasonForRequestName = vcmn_reasonForRequest[0].name; }
        if (Xrm.Page.getAttribute('title').getValue() != null) { vcmn_requestIdName = Xrm.Page.getAttribute('title').getValue(); }

        var vcmn_isNonNarcoticRefillOrRenewal = (vcmn_reasonForRequestName == vcmn_nonNarcoticRenewalRequestName || vcmn_requestIdName.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_reasonForRequestName == vcmn_nonNarcoticRefillRequestName || vcmn_requestIdName.indexOf(vcmn_nonNarcoticRefillRequestName) > -1);
        var vcmn_isNarcoticRefillOrRenewal = (vcmn_reasonForRequestName == vcmn_narcoticRenewalRequestName || vcmn_requestIdName.indexOf(vcmn_narcoticRenewalRequestName) > -1 || vcmn_reasonForRequestName == vcmn_narcoticRefillRequestName || vcmn_requestIdName.indexOf(vcmn_narcoticRefillRequestName) > -1);
        if (vcmn_isNonNarcoticRefillOrRenewal || vcmn_isNarcoticRefillOrRenewal) {
            vcmn_getPickedMedications(0, '');
        }
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_processAppointmentsResponse): ' + err.message);
    }
}

function vcmn_getPickedMedications(vcmn_skipCount, vcmn_MEDnoteString) {
    try {
        //Stop Processing if more than 1000 Records have beeen retrieved
        if (vcmn_skipCount >= 1000) { return false; }

        //Retrieve Picked Medications based on parent request/incident
        var vcmn_requestId = Xrm.Page.data.entity.getId();

        if (vcmn_requestId == null || vcmn_requestId == "") { return false; }
        var vcmn_conditionalFilter = "(ftp_RequestId/Id eq guid'" + vcmn_requestId + "')";
        vcmn_getMultipleEntityDataAsync('ftp_pickedmedicationSet', 'ftp_name, ftp_VAStatus, ftp_RefillsRemaining_number, ftp_IssueDate_text, ftp_LastRefill_text, ftp_ExpirationDate_text', vcmn_conditionalFilter, 'ftp_name', 'asc', vcmn_skipCount, vcmn_getPickedMedications_response, vcmn_MEDnoteString);
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_getPickedMedications): ' + err.message);
    }
}

function vcmn_getPickedMedications_response(vcmn_pickedMedicationData, vcmn_lastSkip, vcmn_MEDnoteString) {
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records)
        for (var i = 0; i <= vcmn_pickedMedicationData.d.results.length - 1; i++) {
            if (vcmn_pickedMedicationData.d.results[i].ftp_name != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + "\n" + vcmn_pickedMedicationData.d.results[i].ftp_name; }
            if (vcmn_pickedMedicationData.d.results[i].ftp_VAStatus != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + " - " + vcmn_pickedMedicationData.d.results[i].ftp_VAStatus; }
            if (vcmn_pickedMedicationData.d.results[i].ftp_RefillsRemaining_number != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + " - " + vcmn_pickedMedicationData.d.results[i].ftp_RefillsRemaining_number; }
            if (vcmn_pickedMedicationData.d.results[i].ftp_IssueDate_text != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + " - " + vcmn_pickedMedicationData.d.results[i].ftp_IssueDate_text; }
            if (vcmn_pickedMedicationData.d.results[i].ftp_LastRefill_text != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + " - " + vcmn_pickedMedicationData.d.results[i].ftp_LastRefill_text; }
            if (vcmn_pickedMedicationData.d.results[i].ftp_ExpirationDate_text != null) { vcmn_MEDnoteString = vcmn_MEDnoteString + " - " + vcmn_pickedMedicationData.d.results[i].ftp_ExpirationDate_text; }
        }
        if (vcmn_pickedMedicationData.d.__next != null) {
            vcmn_getPickedMedications(vcmn_lastSkip + 50, vcmn_MEDnoteString);
        }

        if (vcmn_MEDnoteString == '') { vcmn_MEDnoteString = "\nNo Medications Selected"; }
        //If there are medications selected on the request, then add them to the note
        vcmn_MEDnoteString = "---------------Medications Selected-------------------\nMedications: (Name, Status, Refills Remaining, Issue Date, Last Refill, Expiration) " + vcmn_MEDnoteString + "\n---------------------------------------------------------\n";
        //Add to top of existing Note text
        vcmn_existingNoteData = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_MEDnoteString + vcmn_existingNoteData);
        Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
        vcmn_noteTextChange();
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_getPickedMedications_response): ' + err.message);
    }
}


function vcmn_buildQueryFilterSCD(field, value, and) {
    try {
        if (value == '') {
            if (and) {
                return " and " + field + " eq null";
            } else {
                return field + " eq null";
            }
        }
        else {
            if (and) {
                return " and " + field + " eq '" + value + "'";
            } else {
                return field + " eq '" + value + "'";
            }
        }
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_buildQueryFilterSCD): ' + err.message);
    }
}

function vcmn_unattendedMviSearchSCD(firstname, lastname, dobdate, ssn) {
    try {
        var filter = "";
        var filterPrefix = "$select=*&$filter=";
        var edipi = "";
        var dobstring = "";
        if (dobdate != null) {
            dobstring = dobdate;
        }

        if (ssn != "" && ssn != null) {
            ssn = ssn.replace(/-/g, "");
        }

        //if we have edipi, search using just it
        if (edipi != "") {
            //filter = vcmn_buildQueryFilterSCD("crme_EDIPI", edipi, false);
            //filter += vcmn_buildQueryFilterSCD("crme_ClassCode", 'MIL', true);
            //filter += vcmn_buildQueryFilterSCD("crme_SearchType", 'SearchByIdentifier', true);


            filter = vcmn_buildQueryFilterSCD("crme_edipi", edipi, false);
            filter += vcmn_buildQueryFilterSCD("crme_classcode", 'MIL', true);
            filter += vcmn_buildQueryFilterSCD("crme_searchtype", 'SearchByIdentifier', true);

            //set search type as unattended
            filter += " and crme_IsAttended eq false";
        }
        else {
            //otherwise search using lastname, firstname, ssn, dob
            //filter = vcmn_buildQueryFilterSCD("crme_LastName", lastname, false); //assuming lastname will never be blank
            filter = vcmn_buildQueryFilterSCD("crme_lastname", lastname, false); //assuming lastname will never be blank

            if (firstname != "" && firstname != null) {
                //filter += vcmn_buildQueryFilterSCD("crme_FirstName", firstname, true);
                filter += vcmn_buildQueryFilterSCD("crme_firstname", firstname, true);
            }

            if (ssn != "" && ssn != null) {
                //filter += vcmn_buildQueryFilterSCD("crme_SSN", ssn, true);
                filter += vcmn_buildQueryFilterSCD("crme_ssn", ssn, true);
            }

            if (dobstring != "") {
                //filter += " and crme_DOBString eq '" + dobstring + "'";
                filter += " and crme_dobstring eq '" + dobstring + "'";
            }
            //filter += vcmn_buildQueryFilterSCD("crme_SearchType", 'SearchByFilter', true);
            filter += vcmn_buildQueryFilterSCD("crme_searchtype", 'SearchByFilter', true);

            //set search type as attended (for now)
            //filter += " and crme_IsAttended eq true";
            filter += " and crme_isattended eq true";
        }

        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        //SDK.REST.retrieveMultipleRecords("crme_person", filter, vcmn_unattendedMviSearchCallbackSCD, function (error) { alert(error.message); vcmn_getServiceConnectedDisabilities(""); }, vcmn_unattendedMviSearchComplete);
        retrieveMultipleRecords("crme_person", filter, vcmn_unattendedMviSearchCallbackSCD, function (error) { alert(error.message); vcmn_getServiceConnectedDisabilities(""); });
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_unattendedMviSearchSCD): ' + err.message);
    }
}


function retrieveMultipleRecords(entityName, filter, successCallback, errorCallback) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", serverURL + "/api/data/v8.2/" + entityName + "s?" + filter, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200) {
                var data = JSON.parse(this.response);
                successCallback(data.value);
            } else {
                errorCallback(JSON.parse(this.response).error);
            }
        }
    };
    req.send();
}

function vcmn_unattendedMviSearchCallbackSCD(returnData) {
    try {
        if (returnData != null && returnData.length >= 1) {
            // check for exceptions 1st
            if (returnData[0].crme_exceptionoccured || (returnData[0].crme_returnmessage != null && returnData[0].crme_returnmessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
                //do nothing, pass empty ICN
                vcmn_getServiceConnectedDisabilities("");
            }
            else {
                var patientMviIdentifier = returnData[0].crme_patientmviidentifier == null ? "" : returnData[0].crme_patientmviidentifier;
                if (patientMviIdentifier != "") {
                    var idparts = patientMviIdentifier.split("^");

                    if (idparts.length > 0) {
                        var nationalId = idparts[0];
                        _icn = nationalId;
                        //Pass on the ICN and continue with SCD
                        vcmn_getServiceConnectedDisabilities(_icn);
                    }
                }
            }
        }
        else {
            //Return empty ICN
            vcmn_getServiceConnectedDisabilities("");
        }
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_unattendedMviSearchCallbackSCD): ' + err.message);
    }
}

function vcmn_unattendedMviSearchComplete() {
    //do nothing
}

function vcmn_noteTypeChange() {
    try {
        //Determine if the parent tab is collapsed or open (used to remain at that state at end of this function)
        var vcmn_noteTabStatus = Xrm.Page.ui.tabs.get("tab_progressnote").getDisplayState();

        //Hide all custom note buttons
        Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').setVisible(true);
        Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').setSrc(Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').getSrc());
        Xrm.Page.getControl('WebResource_CancelNoteButton').setVisible(true);
        Xrm.Page.getControl('WebResource_CancelNoteButton').setSrc(Xrm.Page.getControl('WebResource_CancelNoteButton').getSrc());
        Xrm.Page.getControl('WebResource_SelectSignersButton').setVisible(true);
        Xrm.Page.getControl('WebResource_SelectSignersButton').setSrc(Xrm.Page.getControl('WebResource_SelectSignersButton').getSrc());
        Xrm.Page.getControl('WebResource_SaveNoteButton').setVisible(true);
        Xrm.Page.getControl('WebResource_SaveNoteButton').setSrc(Xrm.Page.getControl('WebResource_SaveNoteButton').getSrc());
        Xrm.Page.getControl('WebResource_SaveToVistaButton').setVisible(true);
        Xrm.Page.getControl('WebResource_SaveToVistaButton').setSrc(Xrm.Page.getControl('WebResource_SaveToVistaButton').getSrc());

        //Show non-crm note type specific fields
        Xrm.Page.getControl("ftp_userentrydate").setVisible(true);

        //Undo Required Fields that was coded as Read-Only based on conditions
        Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("none");

        Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("none");

        //Get the note Type
        var vcmn_noteTypeValue = Xrm.Page.getAttribute("ftp_notetype_code").getValue();
        if (vcmn_noteTypeValue != null) {
            if (vcmn_noteTypeValue == 100000000) {
                //Historical Note
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_main').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_notetext').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_lookup').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_specialtreatment').setVisible(false);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_diagnosis').setVisible(false);
                //*Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_intreqnotes').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(false);

                //Hide unused custom note buttons
                Xrm.Page.getControl('WebResource_SaveNoteButton').setVisible(false);
                Xrm.Page.getControl('WebResource_SaveNoteButton').setSrc(Xrm.Page.getControl('WebResource_SaveNoteButton').getSrc());
            }
            else if (vcmn_noteTypeValue == 100000001) {
                //Workload Note
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_main').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_notetext').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_lookup').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_specialtreatment').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_diagnosis').setVisible(true);
                //*Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_intreqnotes').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(false);

                //Hide unused custom note buttons
                Xrm.Page.getControl('WebResource_SaveNoteButton').setVisible(false);
                Xrm.Page.getControl('WebResource_SaveNoteButton').setSrc(Xrm.Page.getControl('WebResource_SaveNoteButton').getSrc());

                //Set Required Fields and correct missing data issues if there is note text present
                vcmn_noteTextChange();
            }
            else if (vcmn_noteTypeValue == 100000002) {
                //CRM Only Note
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_main').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_notetext').setVisible(true);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_lookup').setVisible(false);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_specialtreatment').setVisible(false);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_diagnosis').setVisible(false);
                //*Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_intreqnotes').setVisible(false);
                Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(false);

                //Hide unused custom note buttons
                //*Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').setVisible(false);
                //*Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').setSrc(Xrm.Page.getControl('WebResource_ApplyNoteTemplateButton').getSrc());
                Xrm.Page.getControl('WebResource_SelectSignersButton').setVisible(false);
                Xrm.Page.getControl('WebResource_SelectSignersButton').setSrc(Xrm.Page.getControl('WebResource_SelectSignersButton').getSrc());
                Xrm.Page.getControl('WebResource_SaveToVistaButton').setVisible(false);
                Xrm.Page.getControl('WebResource_SaveToVistaButton').setSrc(Xrm.Page.getControl('WebResource_SaveToVistaButton').getSrc());

                //Hide non-crm note type specific fields
                Xrm.Page.getControl("ftp_userentrydate").setVisible(false);
            }
            //Refresh web resources
            var vcmn_locationNoteURL = Xrm.Page.getControl('WebResource_ViaWorkloadLookup').getSrc();
            Xrm.Page.getControl('WebResource_ViaWorkloadLookup').setSrc(vcmn_locationNoteURL);
            var vcmn_specialTreatmentURL = Xrm.Page.getControl('WebResource_SpecialTreatmentControl').getSrc();
            Xrm.Page.getControl('WebResource_SpecialTreatmentControl').setSrc(vcmn_specialTreatmentURL);
            var vcmn_diagnosisURL = Xrm.Page.getControl('WebResource_SecondaryDiagnosisGrid').getSrc();
            Xrm.Page.getControl('WebResource_SecondaryDiagnosisGrid').setSrc(vcmn_diagnosisURL);
            //*var vcmn_interactionRequestURL = Xrm.Page.getControl('WebResource_RequestNotesControl').getSrc();
            //*Xrm.Page.getControl('WebResource_RequestNotesControl').setSrc(vcmn_interactionRequestURL);
            var vcmn_signersRequestURL = Xrm.Page.getControl('WebResource_RequestNoteSignerSearch').getSrc();
            Xrm.Page.getControl('WebResource_RequestNoteSignerSearch').setSrc(vcmn_signersRequestURL);
        }
        else {
            //Hide all sections...
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_main').setVisible(true);
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_notetext').setVisible(false);
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_lookup').setVisible(false);
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_specialtreatment').setVisible(false);
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_diagnosis').setVisible(false);
            //*Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_intreqnotes').setVisible(false);
            Xrm.Page.ui.tabs.get('tab_progressnote').sections.get('tab_progressnote_section_signers').setVisible(false);
        }

        //Return to state of tab as previous
        Xrm.Page.ui.tabs.get("tab_progressnote").setDisplayState(vcmn_noteTabStatus);
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_noteTypeChange): ' + err.message);
    }
}

function vcmn_noteTextChange() {
    try {
        var vcmn_noteTypeValue = Xrm.Page.getAttribute("ftp_notetype_code").getValue();
        if (vcmn_noteTypeValue == 100000001) {
            //Workload Encounter
            //Set Required Fields and correct missing data issues if there is note text present
            var vcmn_noteText = Xrm.Page.getAttribute("ftp_notedetail").getValue();
            if (vcmn_noteText != null && vcmn_noteText != "") {
                Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("required");
                if (Xrm.Page.getAttribute("ftp_workloadinpatient").getValue() == null) {
                    Xrm.Page.getAttribute("ftp_workloadinpatient").setValue(false);
                    Xrm.Page.getAttribute("ftp_workloadinpatient").setSubmitMode('always');
                }
                Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("required");
                Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("required");

                if (Xrm.Page.getControl("ftp_serviceconnectedcondition").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_southwestasiaconditions").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_ionizingradiationexposure").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_agentorangeexposure").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_headandorneckcancer").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_militarysexualtrauma").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_combatveteran").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("required");
                }

                if (Xrm.Page.getControl("ftp_shipboardhazardanddefense").getDisabled() == true) {
                    Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("none");
                }
                else {
                    Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("required");
                }
            }
            else {
                Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("none");

                Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("none");
            }
        }
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_noteTextChange): ' + err.message);
    }
}

function vcmn_saveToVista() {
    try {
        //Verify that there is a request guid
        var vcmn_requestId = Xrm.Page.data.entity.getId();
        if (vcmn_requestId == null || vcmn_requestId == "") {
            alert("The current request has not been saved. Please save the request and then retry this action!");
            return false;
        }
        //Verify that there is text in the note text attribute
        var vcmn_noteText = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        if (vcmn_noteText == null || vcmn_noteText == "") {
            alert("The note text has not been entered. Please enter a note and then retry this action!");
            return false;
        }

        //Enforce VIA Login
        //Check if VIA Login cookie exist (not expired)
        var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
        if (vcmn_ViaLoginCookie == "") {
            alert("Your VISTA session has expired. In order to process a note, you must be logged into VISTA!");
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}" || (Xrm.Page.context.getUserId()).toUpperCase() == "{EB21BC63-81BF-E511-942C-0050568D743D}") {
                alert("Developer VISTA authentication bypass applied!");
            }
            else {
                return false;
            }
        }

        //Get the type of note and validate data accordingly
        vcmn_noteTypeValue = Xrm.Page.getAttribute("ftp_notetype_code").getValue();
        if (vcmn_noteTypeValue == 100000000) {
            //Historical Note
            vcmn_integrateVistaNote('H');
        }
        else if (vcmn_noteTypeValue == 100000001) {
            //Workload Note
            vcmn_integrateVistaNote('W');
        }
        else {
            return false;
        }
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_saveToVista): ' + err.message);
    }
}

function vcmn_integrateVistaNote(vcmn_noteType) {
    try {
        //vcmn_NoteType   (H - Historical, W - Workload Encounter)
        //Display YELLOW Progress....
        Xrm.Page.ui.setFormNotification("Verifying progress note data, please wait..", "INFO", "SAVEVISTA");

        var vcmn_confirmSaveToVista = confirm('Are you sure you want to save this note to VistA/CPRS?\nThis action cannot be cancelled!');
        if (vcmn_confirmSaveToVista == false) {
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Validate attributes needed as we collect data....
        var vcmn_rq_noteText = Xrm.Page.getAttribute("ftp_notedetail").getValue();
        var vcmn_rq_Title = Xrm.Page.getAttribute('title').getValue();
        if (vcmn_rq_Title == null || vcmn_rq_Title == "" || vcmn_rq_Title == undefined) {
            alert("A Request Title has not been entered, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_CallbackNumber = Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        if (vcmn_rq_CallbackNumber == null || vcmn_rq_CallbackNumber == "" || vcmn_rq_CallbackNumber == undefined) {
            alert("A Callback Number has not been entered, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_ReasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
        if (vcmn_rq_ReasonForRequest == null || vcmn_rq_ReasonForRequest == "" || vcmn_rq_ReasonForRequest == undefined) {
            alert("A Reason for Request has not been entered, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_Veteran = Xrm.Page.getAttribute('customerid').getValue();
        if (vcmn_rq_Veteran == null || vcmn_rq_Veteran == "" || vcmn_rq_Veteran == undefined) {
            alert("A Veteran has not been entered, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Get Current Facility based on veteran/contact Use Current Facility (ftp_currentfacilityid) Text, if empty use Home Facility (ftp_FacilityId)
        var vcmn_rq_VeteranFacility = null;
        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'ftp_currentfacilityid, ftp_FacilityId', vcmn_rq_Veteran[0].id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.ftp_currentfacilityid != null) {
                if (vcmn_contactData.d.ftp_currentfacilityid.Id != null) {
                    vcmn_rq_VeteranFacility = vcmn_contactData.d.ftp_currentfacilityid;
                }
                else {
                    //Get Facility from Home Facility
                    if (vcmn_contactData.d.ftp_FacilityId != null) {
                        vcmn_rq_VeteranFacility = vcmn_contactData.d.ftp_FacilityId;
                    }
                }
            }
            else {
                //Get Facility from Home Facility
                if (vcmn_contactData.d.ftp_FacilityId != null) {
                    vcmn_rq_VeteranFacility = vcmn_contactData.d.ftp_FacilityId;
                }
            }
        }
        if (vcmn_rq_VeteranFacility == null || vcmn_rq_VeteranFacility == "" || vcmn_rq_VeteranFacility == undefined) {
            alert("The Veteran does not have a Facility defined, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_SelectedLocationId = Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').getValue();
        if (vcmn_rq_SelectedLocationId == null || vcmn_rq_SelectedLocationId == "" || vcmn_rq_SelectedLocationId == undefined) {
            alert("A Location has not been selected, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_SelectedLocationText = Xrm.Page.getAttribute('ftp_selectedworkloadlocationtext').getValue();
        if (vcmn_rq_SelectedLocationText == null || vcmn_rq_SelectedLocationText == "" || vcmn_rq_SelectedLocationText == undefined) {
            alert("A Location has not been selected, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_SelectedNoteTitleId = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').getValue();
        if (vcmn_rq_SelectedNoteTitleId == null || vcmn_rq_SelectedNoteTitleId == "" || vcmn_rq_SelectedNoteTitleId == undefined) {
            alert("A Note Title has not been selected, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_SelectedNoteTitleText = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitletext').getValue();
        if (vcmn_rq_SelectedNoteTitleText == null || vcmn_rq_SelectedNoteTitleText == "" || vcmn_rq_SelectedNoteTitleText == undefined) {
            alert("A Note Title has not been selected, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vcmn_rq_ProgressNoteFacility = Xrm.Page.getAttribute('ftp_progressnotefacility').getValue();
        if (vcmn_rq_ProgressNoteFacility == null || !vcmn_rq_ProgressNoteFacility.length) {
            alert("A Site has to be selected, the note cannot be integrated to VistA!");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        var vcmn_rq_VisitDateTime = Xrm.Page.getAttribute('ftp_userentrydate').getValue();

        //Get Workload encounter specific data
        var vcmn_rq_WorkloadInpatient = Xrm.Page.getAttribute('ftp_workloadinpatient').getValue();
        var vcmn_rq_WorkloadCptCode = Xrm.Page.getAttribute('ftp_cptcode').getValue();
        var vcmn_rq_WorkloadDiagnosisCode = Xrm.Page.getAttribute('ftp_diagnosiscode').getValue();
        var vcmn_rq_WorkloadSecondaryDiagnosis = Xrm.Page.getAttribute('ftp_selectedsecondarydiagnosiscodes').getValue();
        var vcmn_rq_WorkloadSecondaryDiagnosisIds = Xrm.Page.getAttribute('ftp_selectedsecondarydiagnosisids').getValue();

        if (vcmn_noteType == 'W') {
            if (vcmn_rq_WorkloadCptCode == null || vcmn_rq_WorkloadCptCode == undefined) {
                alert("A CPT Code has not been selected, the note cannot be integrated to VistA!");
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                return false;
            }
            if (vcmn_rq_WorkloadDiagnosisCode == null || vcmn_rq_WorkloadDiagnosisCode == undefined) {
                alert("A Primary Diagnosis Code has not been selected, the note cannot be integrated to VistA!");
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                return false;
            }
        }

        //Create Progress Note object
        var vcmn_progressNoteObject = new Object();
        vcmn_progressNoteObject.RegardingObjectId = { Id: Xrm.Page.data.entity.getId(), LogicalName: 'incident', Name: '' };
        vcmn_progressNoteObject.Subject = vcmn_ProgressNoteSubject + vcmn_rq_Title;
        vcmn_progressNoteObject.ftp_progressnotefacility = { Id: vcmn_rq_ProgressNoteFacility[0].id, LogicalName: vcmn_rq_ProgressNoteFacility.entityType, Name: '' };
        vcmn_progressNoteObject.ftp_notedetail = vcmn_rq_noteText;
        vcmn_progressNoteObject.ftp_savetovista = { Value: 100000001 }; //Save to CPRS = Yes default..
        vcmn_progressNoteObject.ftp_callbacknumber = vcmn_rq_CallbackNumber;
        vcmn_progressNoteObject.ftp_reasonforrequest = { Id: vcmn_rq_ReasonForRequest[0].id, LogicalName: vcmn_rq_ReasonForRequest[0].entityType, Name: vcmn_rq_ReasonForRequest[0].name };
        vcmn_progressNoteObject.ftp_signthisnote = { Value: 100000001 }; //Sign the note = Yes default..
        vcmn_progressNoteObject.ftp_patient = { Id: vcmn_rq_Veteran[0].id, LogicalName: vcmn_rq_Veteran[0].entityType, Name: vcmn_rq_Veteran[0].name };
        vcmn_progressNoteObject.ScheduledEnd = new Date();
        vcmn_progressNoteObject.ftp_patientfacility = { Id: vcmn_rq_VeteranFacility.Id, LogicalName: vcmn_rq_VeteranFacility.LogicalName, Name: vcmn_rq_VeteranFacility.Name };
        vcmn_progressNoteObject.ftp_SelectedWorkloadLocationId = vcmn_rq_SelectedLocationId;
        vcmn_progressNoteObject.ftp_SelectedWorkloadLocationText = vcmn_rq_SelectedLocationText;
        vcmn_progressNoteObject.ftp_SelectedWorkloadNoteTitleId = vcmn_rq_SelectedNoteTitleId;
        vcmn_progressNoteObject.ftp_SelectedWorkloadNoteTitleText = vcmn_rq_SelectedNoteTitleText;
        if (vcmn_rq_VisitDateTime != null || vcmn_rq_VisitDateTime != undefined) {
            //Write Visit Date/User Entry Date
            vcmn_progressNoteObject.ftp_UserEntryDate = vcmn_rq_VisitDateTime;
        }
        if (vcmn_noteType == 'W') {
            //Workload Encounter
            vcmn_progressNoteObject.ftp_IsWorkloadEncounter = true;
        }
        else {
            //Historical Note
            vcmn_progressNoteObject.ftp_IsWorkloadEncounter = false;
        }
        //Mark Progress Note for automatic VIA integration
        vcmn_progressNoteObject.ftp_automaticviaintegration = true;

        //Add workload specific values
        vcmn_progressNoteObject.ftp_WorkloadInpatient = vcmn_rq_WorkloadInpatient;
        if (vcmn_rq_WorkloadCptCode != null && vcmn_rq_WorkloadCptCode != undefined) {
            vcmn_progressNoteObject.ftp_cptcode = { Id: vcmn_rq_WorkloadCptCode[0].id, LogicalName: vcmn_rq_WorkloadCptCode[0].entityType, Name: vcmn_rq_WorkloadCptCode[0].name }
        }
        if (vcmn_rq_WorkloadDiagnosisCode != null && vcmn_rq_WorkloadDiagnosisCode != undefined) {
            vcmn_progressNoteObject.ftp_diagnosiscode = { Id: vcmn_rq_WorkloadDiagnosisCode[0].id, LogicalName: vcmn_rq_WorkloadDiagnosisCode[0].entityType, Name: vcmn_rq_WorkloadDiagnosisCode[0].name }
        }
        vcmn_progressNoteObject.ftp_selectedsecondarydiagnosiscodes = vcmn_rq_WorkloadSecondaryDiagnosis;
        vcmn_progressNoteObject.ftp_selectedsecondarydiagnosisIds = vcmn_rq_WorkloadSecondaryDiagnosisIds;

        //Add service connected disabilities data
        vcmn_progressNoteObject.ftp_ServiceConnectedCondition = { Value: Xrm.Page.getAttribute('ftp_serviceconnectedcondition').getValue() };
        vcmn_progressNoteObject.ftp_SouthwestAsiaConditions = { Value: Xrm.Page.getAttribute('ftp_southwestasiaconditions').getValue() };
        vcmn_progressNoteObject.ftp_IonizingRadiationExposure = { Value: Xrm.Page.getAttribute('ftp_ionizingradiationexposure').getValue() };
        vcmn_progressNoteObject.ftp_AgentOrangeExposure = { Value: Xrm.Page.getAttribute('ftp_agentorangeexposure').getValue() };
        vcmn_progressNoteObject.ftp_HeadandorNeckCancer = { Value: Xrm.Page.getAttribute('ftp_headandorneckcancer').getValue() };
        vcmn_progressNoteObject.ftp_MilitarySexualTrauma = { Value: Xrm.Page.getAttribute('ftp_militarysexualtrauma').getValue() };
        vcmn_progressNoteObject.ftp_CombatVeteran = { Value: Xrm.Page.getAttribute('ftp_combatveteran').getValue() };
        vcmn_progressNoteObject.ftp_ShipboardHazardandDefense = { Value: Xrm.Page.getAttribute('ftp_shipboardhazardanddefense').getValue() };

        //Add selected signers data
        vcmn_progressNoteObject.ftp_selectedsigners = Xrm.Page.getAttribute('ftp_selectedsigners').getValue();

        //Create the CRM Progress Note Record
        var vcmn_jsonEntityData = JSON.stringify(vcmn_progressNoteObject);
        var vcmn_entitySetName = 'ftp_progressnoteSet'
        var vcmn_jsonQuery = vcmn_serverUrl + vcmn_crmOdataEndPoint + '/' + vcmn_entitySetName;
        var vcmn_ProgressNoteId = vcmn_executeCrmOdataPostRequest(vcmn_jsonQuery, false, vcmn_jsonEntityData, 'CREATE', 'ActivityId');

        //Clear the progress bar
        //Xrm.Page.ui.clearFormNotification("SAVEVISTA"); //kknab 4/23/18, this form notification will be cleared when integration code finishes or errors out, on the progress note tab

        //Check for Failure 'FAIL'
        if (vcmn_ProgressNoteId == 'FAIL' || vcmn_ProgressNoteId == null) {
            //The integration failed
            alert("Error: Unable to create a progress note entity record, Save to VistA/CPRS Failed!");
            return false;
        }

        //Transfer additional signers localstorage value to newly created progress note
        vcmn_localStorageVarName = "RN" + Xrm.Page.data.entity.getId();
        var vcmn_localStorageStringValue = localStorage.getItem(vcmn_localStorageVarName);
        if (vcmn_localStorageStringValue != null && vcmn_localStorageStringValue != '') {
            var vcmn_localStorageVarName = "PN{" + vcmn_ProgressNoteId.toUpperCase() + "}";
            localStorage.setItem(vcmn_localStorageVarName, vcmn_localStorageStringValue);
        }

        //Wipe request progress note data attribute fields
        vcmn_deleteNoteData();

        //Open the request form
        var vcmn_progressNoteUrl = vcmn_serverUrl + "/main.aspx?etn=" + "ftp_progressnote" + "&pagetype=entityrecord&id=" + vcmn_ProgressNoteId;
        //kknab 4/23, removed window sizing options, since USD handles this w/ Window Navigation rules
        VCCM.USDHelper.FireUSDEvent("ProgressNoteReadyForAutoIntegration", "id=" + vcmn_ProgressNoteId);
        //var vcmn_progressNoteWindow = window.open(vcmn_progressNoteUrl, "_blank", null/*"toolbar=no, scrollbars=yes, status=no, resizable=yes, top=1, left=1, width=1000, height=800"*/, false);     
    }
    catch (err) {
        alert('Request Progress Note Template Script Function Error(vcmn_vistaHistoricalNote): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
        return false;
    }
}

function vcmn_getCookie(cname) {
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    catch (err) {
        alert('Request Progress Note Function Error(vcmn_getCookie): ' + err.message);
    }
}

function vcmn_executeCrmOdataGetRequest(vcmn_jsonQuery, vcmn_aSync, vcmn_aSyncCallback, vcmn_skipCount, vcmn_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vcmn_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vcmn_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vcmn_aSyncCallback* - specify the name of the return function to call upon completion (required if vcmn_aSync = true.  Otherwise '')
    //*vcmn_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vcmn_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vcmn_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vcmn_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vcmn_entityData = data;
                if (vcmn_aSync == true) {
                    vcmn_aSyncCallback(vcmn_entityData, vcmn_skipCount, vcmn_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vcmn_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + vcmn_jsonQuery);
            },
            async: vcmn_aSync,
            cache: false
        });
        return vcmn_entityData;
    }
    catch (err) {
        alert('An error occured in the vcmn_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vcmn_executeCrmOdataPostRequest(vcmn_jsonQuery, vcmn_aSync, vcmn_jsonEntityData, vcmn_recordAction, vcmn_crmGuidFieldName) {
    //This function executes a CRM Odata web service call to create/update a Crm Record
    //*vcmn_jsonQuery* - the complete query (url) to be executed
    //*vcmn_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vcmn_jsonEntityData* - the crm entity data record to be created/updated
    //*vcmn_recordAction* - the action to be performed in CAPS 'CREATE', 'UPDATE, 'DELETE'
    //*vcmn_crmGuidFieldName* - the name of the unique identifier field that has the Guid/Id for the crm record created

    try {
        var vcmn_crmEntityId = 'FAIL';

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vcmn_jsonQuery,
            data: vcmn_jsonEntityData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                if (vcmn_recordAction == 'UPDATE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'MERGE'); }
                if (vcmn_recordAction == 'DELETE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'DELETE'); }
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (vcmn_recordAction == 'CREATE') { vcmn_crmEntityId = data.d[vcmn_crmGuidFieldName].toString(); }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('Ajax Error in vcmn_executeCrmOdataPostRequest: ' + errorThrown);
                vcmn_crmEntityId = 'FAIL';
            },
            async: vcmn_aSync
        });
        if (vcmn_recordAction == 'CREATE') { return vcmn_crmEntityId; }
    }
    catch (err) {
        alert('An error occured in the vcmn_executeCrmOdataPostRequest function.  Error Detail Message: ' + err);
    }
}

function vcmn_getMultipleEntityDataAsync(vcmn_entitySetName, vcmn_attributeSet, vcmn_conditionalFilter, vcmn_sortAttribute, vcmn_sortDirection, vcmn_skipCount, vcmn_aSyncCallback, vcmn_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vcmn_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcmn_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcmn_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vcmn_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vcmn_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vcmn_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vcmn_aSyncCallback* - is the name of the function to call when returning the result
    //*vcmn_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vcmn_jsonQuery = vcmn_serverUrl + vcmn_crmOdataEndPoint + '/' + vcmn_entitySetName + '?$select=' + vcmn_attributeSet + '&$filter=' + vcmn_conditionalFilter + '&$orderby=' + vcmn_sortAttribute + ' ' + vcmn_sortDirection + '&$skip=' + vcmn_skipCount;
        vcmn_executeCrmOdataGetRequest(vcmn_jsonQuery, true, vcmn_aSyncCallback, vcmn_skipCount, vcmn_optionArray);
    }
    catch (err) {
        alert('An error occured in the vcmn_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function vcmn_getSingleEntityDataSync(vcmn_entitySetName, vcmn_attributeSet, vcmn_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vcmn_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcmn_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcmn_entityId* - is the Guid for the entity record

    try {
        var vcmn_entityIdNoBracket = vcmn_entityId.replace(/({|})/g, '');
        var vcmn_selectString = '(guid' + "'" + vcmn_entityIdNoBracket + "'" + ')?$select=' + vcmn_attributeSet;
        var vcmn_jsonQuery = vcmn_serverUrl + vcmn_crmOdataEndPoint + '/' + vcmn_entitySetName + vcmn_selectString;
        var vcmn_entityData = vcmn_executeCrmOdataGetRequest(vcmn_jsonQuery, false, '', 0, null);
        return vcmn_entityData;
    }
    catch (err) {
        alert('An error occured in the vcmn_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function vcmn_getMultipleEntityDataSync(vcmn_entitySetName, vcmn_attributeSet, vcmn_conditionalFilter, vcmn_sortAttribute, vcmn_sortDirection, vcmn_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*vcmn_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcmn_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcmn_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vcmn_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vcmn_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vcmn_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var vcmn_jsonQuery = vcmn_serverUrl + vcmn_crmOdataEndPoint + '/' + vcmn_entitySetName + '?$select=' + vcmn_attributeSet + '&$filter=' + vcmn_conditionalFilter + '&$orderby=' + vcmn_sortAttribute + ' ' + vcmn_sortDirection + '&$skip=' + vcmn_skipCount;
        var vcmn_entityData = vcmn_executeCrmOdataGetRequest(vcmn_jsonQuery, false, '', vcmn_skipCount, null);
        return vcmn_entityData;
    }
    catch (err) {
        alert('An error occured in the vcmn_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}
