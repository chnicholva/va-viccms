//VistACPRSMultiProgressNoteFormScript.js
//
//Contains variables and functions used by the CRM Form and Ribbon
//Requires jQuery loaded on the CRM Form
//The form where this script library is applied must have the following form parameters defined
/*
parameter_regardingobjectid  -  Type:UniqueId
parameter_regardingobjectidname  -  Type:SafeString
parameter_regardingobjectidtype  -  Type:SafeString
parameter_triageexpert  -  Type:SafeString
parameter_triageminutes  -  Type:Integer
*/

//Static Variables
var vcmn_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vcmn_serverUrl = Xrm.Page.context.getClientUrl();

//var vcmn_NoteWriteUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/noteswrite';  //OLD MANUAL DEV URL
var vcmn_NoteWriteUrl = '';
//var vcmn_EnrollmentEligibilitySummaryURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/esr/EnrollmentEligibilitySummary/2.0/json/';  //OLD MANUAL DEV URL
var vcmn_eesummaryURLbase = '';
var vcmn_EnrollmentEligibilitySummaryURLbase = '';
//var vcmn_VistaUsersURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VistaUsers/1.0/json/ftpCRM/john/smith/1234?noFilter=true';  //OLD MANUAL DEV URL
var vcmn_VistaUsersURLbase = '';
//var vcmn_AddSignersUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VIA/AddSigners/1.0/json';  //OLD MANUAL DEV URL
var vcmn_AddSignersUrl = '';
//var vcmn_AppointmentsUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/Appointments/1.0/json/FtPCRM/';  //OLD MANUAL DEV URL
var vcmn_AppointmentsUrl = '';
var vcmn_AppointmentApiSecureUrl = '';

var vcmn_EnrollmentEligibilitySummaryData = null;
var vcmn_SecurePatientICN = null;

//Production Environment Indicator
var vcmn_IsProductionEnvironment = false;

//Word Wrap Line Limit
var vcmn_WordWrapLimit = 75;

//Additional Signers Data
var vcmn_AddlSignersNameArray = null;
var vcmn_AddlSignersIenArray = null;
var vcmn_localStorageVarName = "";

//Workload Encounter data
var vcmn_ProgressNoteSubject = 'Progress Note: ';
var vcmn_TriageNoteSubject = 'Triage Note: ';
var vcmn_WorkloadEncounterSubject = 'Workload Encounter Note: ';
var vcmn_isWorkloadEncounter = false;
var vcmn_matchLookupId = '';

var vcmn_ViaLoginName = null;
var vcmn_ViaLoginToken = null;
var vcmn_esignatureCode = null;
var vcmn_ViaLoginFacility = null;
var vcmn_ViaPatientId = null;
var vcmn_ViaInPatient = null;
var vcmn_ViaCptCode = null;
var vcmn_ViaCptDescription = null;
var vcmn_ViaDiagnosisCode = null;
var vcmn_ViaDiagnosisDescription = null;

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

var vcmn_automaticViaIntegration = false;
var vcmn_automaticViaIntegrationString = vcmn_automaticViaIntegration.toString();

var vcmn_useSecureAppointmentAPI = true;

Xrm.Utility.getDefaultGroupId = function () {
    return vcmn_facilityGroupDefaultId;
}

Xrm.Utility.setDefaultGroupId = function (groupId) {
    vcmn_facilityGroupDefaultId = groupId;
}

function vcmn_getQueryVariable(vcmn_variable) {
    try {
        //Get a Query Variable
        var vcmn_query = decodeURIComponent(window.top.location.search.substring(1));
        var vcmn_vars = vcmn_query.split("&");
        for (var i = 0; i < vcmn_vars.length; i++) {
            var vcmn_pair = vcmn_vars[i].split("=");
            if (vcmn_pair[0] == vcmn_variable) {
                return decodeURIComponent(vcmn_pair[1]);
            }
        }
        return "";
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_getQueryVariable): ' + err.message);
    }
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
        alert('Progress Note Form Load Script Function Error(vcmn_setSimpleLookupValue): ' + err.message);
    }
}

function vcmn_convertCrmDateToVistADate(vcmn_crmDate) {
    try {
        var vcmn_VistADate = null;
        if (vcmn_crmDate != null) {
            var vcmn_crmYear = (vcmn_crmDate.getFullYear()).toString();
            var vcmn_crmMonth = '00';
            if ((vcmn_crmDate.getMonth() + 1) < 10) {
                vcmn_crmMonth = '0' + (vcmn_crmDate.getMonth() + 1).toString();
            }
            else {
                vcmn_crmMonth = (vcmn_crmDate.getMonth() + 1).toString();
            }
            var vcmn_crmDay = '00';
            if ((vcmn_crmDate.getDate()) < 10) {
                vcmn_crmDay = '0' + (vcmn_crmDate.getDate()).toString();
            }
            else {
                vcmn_crmDay = (vcmn_crmDate.getDate()).toString();
            }
            var vcmn_crmHours = '00';
            if ((vcmn_crmDate.getHours()) < 10) {
                vcmn_crmHours = '0' + (vcmn_crmDate.getHours()).toString();
            }
            else {
                vcmn_crmHours = (vcmn_crmDate.getHours()).toString();
            }
            var vcmn_crmMinutes = '00';
            if ((vcmn_crmDate.getMinutes()) < 10) {
                vcmn_crmMinutes = '0' + (vcmn_crmDate.getMinutes()).toString();
            }
            else {
                vcmn_crmMinutes = (vcmn_crmDate.getMinutes()).toString();
            }
            var vcmn_crmSeconds = '00';
            if ((vcmn_crmDate.getSeconds()) < 10) {
                vcmn_crmSeconds = '0' + (vcmn_crmDate.getSeconds()).toString();
            }
            else {
                vcmn_crmSeconds = (vcmn_crmDate.getSeconds()).toString();
            }

            //Create VistA Date
            vcmn_VistADate = vcmn_crmYear + vcmn_crmMonth + vcmn_crmDay + vcmn_crmHours + vcmn_crmMinutes + vcmn_crmSeconds;
        }
        return vcmn_VistADate;
    }
    catch (err) {
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DateConversionError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        return null;
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

function vcmn_UserHasTeam(teamName, userGuid) {
    try {
        var vcmn_teamid = null;
        var vcmn_currentUserId = userGuid;
        var vcmn_conditionalFilter = "(Name eq '" + teamName + "')";
        var vcmn_teamData = vcmn_getMultipleEntityDataSync('TeamSet', 'TeamId', vcmn_conditionalFilter, 'Name', 'asc', 0);
        if (vcmn_teamData != null) {
            for (var i = 0; i <= vcmn_teamData.d.results.length - 1; i++) {
                //Get Info
                if (vcmn_teamData.d.results[i].TeamId != null) { vcmn_teamid = vcmn_teamData.d.results[i].TeamId; }
                break;
            }
        }
        //If Team exists, check if the current user is part of that team
        var vcmn_teamMembershipId = null;
        if (vcmn_teamid != null && vcmn_currentUserId != null) {
            var vcmn_conditionalFilter = "(TeamId eq (guid'" + vcmn_teamid + "') and SystemUserId eq (guid'" + vcmn_currentUserId + "'))";
            var vcmn_teamMembershipData = vcmn_getMultipleEntityDataSync('TeamMembershipSet', 'TeamId, SystemUserId,TeamMembershipId', vcmn_conditionalFilter, 'TeamId', 'asc', 0);
            if (vcmn_teamMembershipData != null) {
                for (var i = 0; i <= vcmn_teamMembershipData.d.results.length - 1; i++) {
                    //Get Info
                    if (vcmn_teamMembershipData.d.results[i].TeamMembershipId != null) { vcmn_teamMembershipId = vcmn_teamMembershipData.d.results[i].TeamMembershipId; }
                    break;
                }
            }
        }
        if (vcmn_teamMembershipId != null) { return true; }

        //otherwise return false		
        return false;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the vcmn_UserHasTeam function.  Error Detail Message: " + err);
    }
}

function vcmn_callAction(action, data, callback, errHandler) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    // specify name of the entity, record id and name of the action in the Wen API Url
    req.open("POST", serverURL + "/api/data/v9.0/" + action, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200 && this.response != null) {
                var data = JSON.parse(this.response);
                callback(data);
            }
            else {
                if (this.response != null && this.response != "") {
                    var error = JSON.parse(this.response).error;
                    errHandler(error.message);
                }
            }
        }
    };
    // send the request with the data for the input parameter
    req.send(window.JSON.stringify(data));
}

function vcmn_SettingsWebServiceURL_response(vcmn_settingData, vcmn_lastSkip, vcmn_NoteWriteUrl_NA) {
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var vcmn_DacUrl = null;
        var vcmn_ViaServiceBaseUrl = null;
        var vcmn_NotesWriteApiUrl = null;
        var vcmn_EnrollmentEligibilitySummaryApiUrl = null;
        var vcmn_VistaUserApiUrl = null;
        var vcmn_ViaAddlSignersApiUrl = null;
        var vcmn_AppointmentApiUrl = null;
        var vcmn_AppointmentApiSecureUrl = null;

        for (var i = 0; i <= vcmn_settingData.d.results.length - 1; i++) {
            //Get info
            if (vcmn_settingData.d.results[i].ftp_DACURL != null) { vcmn_DacUrl = vcmn_settingData.d.results[i].ftp_DACURL; }
            if (vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { vcmn_ViaServiceBaseUrl = vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (vcmn_settingData.d.results[i].ftp_NotesWriteAPIURL != null) { vcmn_NotesWriteApiUrl = vcmn_settingData.d.results[i].ftp_NotesWriteAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL != null) { vcmn_EnrollmentEligibilitySummaryApiUrl = vcmn_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_VistaUsersAPIURL != null) { vcmn_VistaUserApiUrl = vcmn_settingData.d.results[i].ftp_VistaUsersAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_IsProductionEnvironment != null) { vcmn_IsProductionEnvironment = vcmn_settingData.d.results[i].ftp_IsProductionEnvironment; }
            if (vcmn_settingData.d.results[i].ftp_VIAAdditionalSignersURL != null) { vcmn_ViaAddlSignersApiUrl = vcmn_settingData.d.results[i].ftp_VIAAdditionalSignersURL; }
            if (vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { vcmn_baseServiceEndpointUrl = vcmn_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (vcmn_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { vcmn_requestingApp = vcmn_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { vcmn_consumingAppToken = vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { vcmn_consumingAppPassword = vcmn_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            if (vcmn_settingData.d.results[i].ftp_AppointmentAPIURL != null) { vcmn_AppointmentApiUrl = vcmn_settingData.d.results[i].ftp_AppointmentAPIURL; }
            if (vcmn_settingData.d.results[i].ftp_AppointmentAPISecureURL != null) { vcmn_AppointmentApiSecureUrl = vcmn_settingData.d.results[i].ftp_AppointmentAPISecureURL; }
            break;
        }

        if (vcmn_DacUrl != null && vcmn_NotesWriteApiUrl != null) {
            //Construct full web service URL
            vcmn_NoteWriteUrl = vcmn_DacUrl + vcmn_NotesWriteApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VISTA NOTES WRITE SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APISERVICE");
        }

        if (vcmn_DacUrl != null && vcmn_EnrollmentEligibilitySummaryApiUrl != null) {
            //Construct full web service URL
            vcmn_EnrollmentEligibilitySummaryURLbase = vcmn_DacUrl + vcmn_EnrollmentEligibilitySummaryApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE ENROLLMENT ELIGIBILITY SUMMARY WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APISERVICE");
        }

        if (vcmn_DacUrl != null && vcmn_VistaUserApiUrl != null) {
            //Construct full web service URL
            vcmn_VistaUsersURLbase = vcmn_DacUrl + vcmn_VistaUserApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VISTA USERS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
        if (vcmn_DacUrl != null && vcmn_ViaAddlSignersApiUrl != null) {
            //Construct full web service URL
            vcmn_AddSignersUrl = vcmn_DacUrl + vcmn_ViaAddlSignersApiUrl;
            //vcmn_AddSignersUrl = vcmn_ViaServiceBaseUrl + vcmn_ViaAddlSignersApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VIA ADDITIONAL SIGNERS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
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

        //Proceed with Form Load logic with URL
        vcmn_newProgressNoteLoad_WebURL();
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_SettingsWebServiceURL_response): ' + err.message);
    }
}

function vcmn_newProgressNoteLoad() {
    try {
        vcmn_automaticViaIntegration = Xrm.Page.getAttribute('ftp_automaticviaintegration').getValue();
        vcmn_automaticViaIntegrationString = vcmn_automaticViaIntegration.toString();
        VCCM.USDHelper.FireUSDEvent(
            "ProgressNoteFormLoaded",
            [
                "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString,
                "formType=" + Xrm.Page.ui.getFormType().toString(),
                "onLoadIntegrationStatus=" + Xrm.Page.getAttribute("ftp_integrationstatus").getValue()
            ]
        );

        //GET CRM SETTINGS WEB SERVICE URLS
        var vcmn_conditionalFilter = "(mcs_name eq 'Active Settings')";
        vcmn_getMultipleEntityDataAsync('mcs_settingSet', '*', vcmn_conditionalFilter, 'mcs_name', 'asc', 0, vcmn_SettingsWebServiceURL_response, vcmn_NoteWriteUrl);
    }
    catch (err) {
        //Display Error
        alert('Progress Note Form Load Script Function Error(vcmn_newProgressNoteLoad): ' + err.message);
    }
}

function vcmn_newProgressNoteLoad_WebURL() {
    debugger
    try {
        //Check if marked as a workload encounter
        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() == true) {
            vcmn_isWorkloadEncounter = true;
            Xrm.Page.ui.tabs.get('Tab_WorkloadDetails').setVisible(true);

            Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("required");
            //Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("required");
            //Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("required");
            //Set Sign this note to Yes
            Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
            Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
            Xrm.Page.ui.tabs.get('Tab_ProgressNoteType').setLabel("Workload Encounter");

            Xrm.Page.getAttribute("ftp_notehospitallocation").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_localnotetitle").setRequiredLevel("none");
        }
        else {
            vcmn_isWorkloadEncounter = false;
            Xrm.Page.ui.tabs.get('Tab_WorkloadDetails').setVisible(false);
            Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setRequiredLevel("required");

            Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("none");

            Xrm.Page.getAttribute("ftp_notehospitallocation").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_localnotetitle").setRequiredLevel("none");
        }

        //Set default values based on the current user's USD Config and Facility
        var vcmn_currentUserId = Xrm.Page.context.getUserId();
        var vcmn_currentUserData = vcmn_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', vcmn_currentUserId);
        if (vcmn_currentUserData != null) {
            if (vcmn_currentUserData.d.msdyusd_USDConfigurationId != null) {
                if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Id != null) {
                    if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name != null && vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name != '') {
                        if (vcmn_currentUserData.d.msdyusd_USDConfigurationId.Name == "Pharmacy Configuration") {
                            //Set Local Title View to Pharmacy
                            //**Xrm.Page.getControl("ftp_localnotetitle").setDefaultView("{AF5A2EBB-A22A-E711-944E-0050568D743D}");

                            //Dev Test
                            //Xrm.Page.getControl("ftp_localnotetitle").setDefaultView("{DCEC6C83-B534-E711-8243-000C29FF8C5B}");
                        }
                    }
                    //Retrieve Facillity Group Default info
                    var pNote = Xrm.Page.getAttribute('ftp_progressnotefacility');
                    if (pNote && pNote.getValue()) {
                        //Data Required to lookup Facility Group Defaults are present
                        var vcmn_conditionalFilter = "(ftp_facilitysiteid/Id eq guid'" + vcmn_currentUserData.d.ftp_FacilitySiteId.Id + "') and (ftp_usdgroupid/Id eq guid'" + vcmn_currentUserData.d.msdyusd_USDConfigurationId.Id + "')";
                        //**vcmn_getMultipleEntityDataAsync('ftp_facilitygroupdefaultSet', 'ftp_localnotestitle, ftp_hospitallocation, ftp_facilitygroupdefaultId, ftp_viaworkloadencounterlocationdefault, ftp_viaworkloadencounternotetitledefault, ftp_historicallocationdefault, ftp_historicalnotetitledefault', vcmn_conditionalFilter, 'ftp_name', 'asc', 0, vcmn_facilityGroupDefault_response, vcmn_currentUserData.d.ftp_FacilitySiteId.Id);
                        vcmn_getMultipleEntityDataAsync('ftp_facilitygroupdefaultSet', 'ftp_facilitygroupdefaultId, ftp_viaworkloadencounterlocationdefault, ftp_viaworkloadencounternotetitledefault', vcmn_conditionalFilter, 'ftp_name', 'asc', 0, vcmn_facilityGroupDefault_response, vcmn_currentUserData.d.ftp_FacilitySiteId.Id);
                    }
                }
            }
        }

        //Check if the progress note is marked for automatic via integration (Note generated from Request form)
        if (Xrm.Page.ui.getFormType() == 2 && vcmn_automaticViaIntegration == true) {

            var siteData = setUserSite();

            //Check if VIA Login cookie exist (not expired)
            var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

            //TODO: how to know which site??
            var vcmn_ViaLoginData = null;

            if (vcmn_ViaLoginCookie != "")
                vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);

            var vcmn_CookieData = new Object();

            if (vcmn_ViaLoginData != null) {

                if (vcmn_ViaLoginData.length > 1) {
                    if (siteData != null) {
                        for (var j = 0; j < vcmn_ViaLoginData.length; j++) {
                            if (vcmn_ViaLoginData[j].siteCode == siteData.SiteNo) {
                                vcmn_CookieData = [{ duz: vcmn_ViaLoginData[j].duz, providerName: vcmn_ViaLoginData[j].providerName, vistaduz: vcmn_ViaLoginData[j].vistaduz, eSig: vcmn_ViaLoginData[j].eSig, siteCode: vcmn_ViaLoginData[j].siteCode, siteName: vcmn_ViaLoginData[j].siteName }];
                                break;
                            }
                        }
                    } else {
                        vcmn_CookieData = [{ duz: vcmn_ViaLoginData[0].duz, providerName: vcmn_ViaLoginData[0].providerName, vistaduz: vcmn_ViaLoginData[0].vistaduz, eSig: vcmn_ViaLoginData[0].eSig, siteCode: vcmn_ViaLoginData[0].siteCode, siteName: vcmn_ViaLoginData[0].siteName }];
                    }
                } else if (vcmn_ViaLoginData.length == 1) {
                    vcmn_CookieData = [{ duz: vcmn_ViaLoginData[0].duz, providerName: vcmn_ViaLoginData[0].providerName, vistaduz: vcmn_ViaLoginData[0].vistaduz, eSig: vcmn_ViaLoginData[0].eSig, siteCode: vcmn_ViaLoginData[0].siteCode, siteName: vcmn_ViaLoginData[0].siteName }];
                }
            }

            vcmn_ribbonButtonSaveToVistA(vcmn_CookieData);
            return false;
        }

        //Only handle forms in create state
        if (Xrm.Page.ui.getFormType() != 1) { return false; }

        //Determine if regarding field is prefilled (added by subgrid+)
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        var vcmn_triageexpert = null;
        var vcmn_triageminutes = null;
        if (vcmn_requestId == null) {
            //Get custom parameters passed to the form
            var vcmn_regardingobjectid = vcmn_getQueryVariable("parameter_regardingobjectid");
            var vcmn_regardingobjectidname = vcmn_getQueryVariable("parameter_regardingobjectidname");
            var vcmn_regardingobjectidtype = vcmn_getQueryVariable("parameter_regardingobjectidtype");
            vcmn_triageexpert = vcmn_getQueryVariable("parameter_triageexpert");
            vcmn_triageminutes = vcmn_getQueryVariable("parameter_triageminutes");

            if (vcmn_regardingobjectid == '' || vcmn_regardingobjectid == null || vcmn_regardingobjectidname == '' || vcmn_regardingobjectidname == null ||
                vcmn_regardingobjectidtype == '' || vcmn_regardingobjectidtype == null) { return false; }
        }
        else {
            var vcmn_regardingobjectid = vcmn_requestId[0].id;
            var vcmn_regardingobjectidname = vcmn_requestId[0].name;
            var vcmn_regardingobjectidtype = vcmn_requestId[0].entityType;
        }
        if (vcmn_triageexpert == null) { vcmn_triageexpert = 'NO'; }
        if (vcmn_triageminutes == null) { vcmn_triageminutes = 0; }

        //Populate regarding object
        vcmn_setSimpleLookupValue('regardingobjectid', vcmn_regardingobjectidtype, vcmn_regardingobjectid, vcmn_regardingobjectidname);
        Xrm.Page.getAttribute('regardingobjectid').setSubmitMode('always');

        //Refresh the Request Notes Control, since it's possible that the regardingobjectid was missing during initial load
        Xrm.Page.getControl("WebResource_RequestNotesControl").setSrc(Xrm.Page.getControl("WebResource_RequestNotesControl").getSrc());

        //Prompt user if progress note is a workload encounter except when a Triage Note
        if (vcmn_triageexpert == 'NO') {
            Xrm.Utility.confirmDialog(
                "Select 'OK' for Workload Encounter or 'Cancel' for Historical Note",
                function () {
                    Xrm.Page.getAttribute('ftp_isworkloadencounter').setValue(true);
                    Xrm.Page.getAttribute('ftp_isworkloadencounter').setSubmitMode('always');
                    Xrm.Page.ui.tabs.get('Tab_WorkloadDetails').setVisible(true);

                    vcmn_isWorkloadEncounter = true;
                    Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setRequiredLevel("required");
                    Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setRequiredLevel("required");
                    Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("required");
                    //Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("required");
                    //Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("required");
                    Xrm.Page.ui.tabs.get('Tab_ProgressNoteType').setLabel("Workload Encounter");

                    Xrm.Page.getAttribute("ftp_notehospitallocation").setRequiredLevel("none");
                    Xrm.Page.getAttribute("ftp_localnotetitle").setRequiredLevel("none");
                }
            );
        }
        else {
            Xrm.Page.getAttribute('ftp_isworkloadencounter').setValue(true);
            Xrm.Page.getAttribute('ftp_isworkloadencounter').setSubmitMode('always');
            Xrm.Page.ui.tabs.get('Tab_WorkloadDetails').setVisible(true);

            vcmn_isWorkloadEncounter = true;
            Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_workloadinpatient").setRequiredLevel("required");
            //Xrm.Page.getAttribute("ftp_cptcode").setRequiredLevel("required");
            //Xrm.Page.getAttribute("ftp_diagnosiscode").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get('Tab_ProgressNoteType').setLabel("Workload Encounter");

            Xrm.Page.getAttribute("ftp_notehospitallocation").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_localnotetitle").setRequiredLevel("none");
        }

        //If Historical Encounter
        if (vcmn_isWorkloadEncounter == false) {
            Xrm.Page.ui.tabs.get('Tab_WorkloadDetails').setVisible(false);

            Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_notehospitallocation").setRequiredLevel("none");

            Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setRequiredLevel("required");
            Xrm.Page.getAttribute("ftp_localnotetitle").setRequiredLevel("none");
        }

        //If Workload encounter, refresh special treatment control
        if (vcmn_isWorkloadEncounter == true) {
            Xrm.Page.getControl("WebResource_SpecialTreatmentControl").setSrc(Xrm.Page.getControl("WebResource_SpecialTreatmentControl").getSrc());
        }

        //Populate subject with regarding objects title
        Xrm.Page.getAttribute('subject').setValue(vcmn_ProgressNoteSubject + vcmn_regardingobjectidname);
        if (vcmn_triageexpert == 'YES') {
            Xrm.Page.getAttribute('subject').setValue(vcmn_TriageNoteSubject + vcmn_regardingobjectidname);

            //Update Note Text with localStorage text
            var vcmn_uniqueTriageId = Xrm.Page.getAttribute("ftp_notedetail").getValue();
            if (vcmn_uniqueTriageId != null && vcmn_uniqueTriageId != '') {
                var vcmn_lsTriageNoteText = localStorage.getItem(vcmn_uniqueTriageId);
                if (vcmn_lsTriageNoteText != null) {
                    Xrm.Page.getAttribute("ftp_notedetail").setValue(vcmn_lsTriageNoteText);
                    localStorage.removeItem(vcmn_uniqueTriageId);
                }
            }
        }
        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() == true) { Xrm.Page.getAttribute('subject').setValue(vcmn_WorkloadEncounterSubject + vcmn_regardingobjectidname); }
        Xrm.Page.getAttribute('subject').setSubmitMode('always');
        //Default Save to CPRS
        Xrm.Page.getAttribute('ftp_savetovista').setValue(100000001); //Yes
        Xrm.Page.getAttribute('ftp_savetovista').setSubmitMode('always');

        var vcmn_veteranId = null;  //From request customerid

        //Populate form with related CRM data
        var vcmn_subReasonId = null; //Reference to the Reason for Request Sub Reason
        var vcmn_minorReasonId = null;  //Reference to the Reason for Request Minor Reason
        var vcmn_subReasonTemplateText = null;
        var vcmn_minorReasonTemplateText = null;
        var vcmn_minorReasonNoteSubText = null;

        if (vcmn_regardingobjectidtype == "ftp_interaction") {
            var vcmn_interactionData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_CallbackNumber,tri_reasonforrequest,ftp_Veteran,ftp_requestfacilityid', vcmn_regardingobjectid);
            if (vcmn_interactionData != null) {

                if (vcmn_interactionData.d.ftp_CallbackNumber != null) {
                    Xrm.Page.getAttribute('ftp_callbacknumber').setValue(vcmn_interactionData.d.ftp_CallbackNumber);
                    Xrm.Page.getAttribute('ftp_callbacknumber').setSubmitMode('always');
                }

                if (vcmn_interactionData.d.tri_reasonforrequest != null) {
                    vcmn_setSimpleLookupValue('ftp_reasonforrequest', vcmn_interactionData.d.tri_reasonforrequest.LogicalName, vcmn_interactionData.d.tri_reasonforrequest.Id, vcmn_interactionData.d.tri_reasonforrequest.Name);
                    Xrm.Page.getAttribute('ftp_reasonforrequest').setSubmitMode('always');

                    //Check if Non-Narcotic request, if so default note signing to yes so that it will not prompt the user
                    if (vcmn_interactionData.d.tri_reasonforrequest.Name == vcmn_nonNarcoticRenewalRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_interactionData.d.tri_reasonforrequest.Name == vcmn_nonNarcoticRefillRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRefillRequestName) > -1) {
                        //Set Sign this note to Yes
                        Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                        Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
                    }
                }

                if (vcmn_interactionData.d.ftp_Veteran != null) {
                    vcmn_setSimpleLookupValue('ftp_patient', vcmn_interactionData.d.ftp_Veteran.LogicalName, vcmn_interactionData.d.ftp_Veteran.Id, vcmn_interactionData.d.ftp_Veteran.Name);
                    Xrm.Page.getAttribute('ftp_patient').setSubmitMode('always');
                    //Set as veteran id
                    vcmn_veteranId = vcmn_interactionData.d.ftp_Veteran.Id
                }

                //ftp_progressnotefacility
                if (vcmn_interactionData.d.ftp_requestfacilityid != null) {
                    vcmn_setSimpleLookupValue('ftp_progressnotefacility', vcmn_interactionData.d.ftp_requestfacilityid.LogicalName, vcmn_interactionData.d.ftp_requestfacilityid.Id, vcmn_interactionData.d.ftp_requestfacilityid.Name);
                    //Xrm.Page.getAttribute('ftp_progressnotefacility').setSubmitMode('always');
                }
            }
        } else if (vcmn_regardingobjectidtype == "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'ftp_CallbackNumber, ftp_ReasonforRequest, ftp_SubReasonId, ftp_MinorReasonId, Description, CustomerId, ftp_LastFilled, ftp_QuantityReportsTaking, ftp_RxNumber, ftp_RxRefillQuantity, ftp_TrackingNumber, ftp_OpiodAgreementOnfile, ftp_UDSonfile, ftp_StateDrugMonitoringReport, ftp_spdmpstateonfile, ftp_SPDMPState2, ftp_pickupmethod, ftp_earlyrefillcomment, ftp_quantitytaking, ftp_vacationstart, ftp_vacationend, ftp_rxtype, ftp_methodofrequest, ftp_age, ftp_pcp, ftp_calccrcl, ftp_LatesteGFRResult, ftp_lastdirectionsonfile, ftp_patientstatesdirections, ftp_directionsby, ftp_veteranchangeddose, ftp_othertext, ftp_lostorstolen, ftp_TrackingNumber, ftp_RxRefillQuantity, ftp_othercopayreversal, ftp_reasonforstopping, ftp_QuantityReportsTaking', vcmn_regardingobjectid);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_CallbackNumber != null) {
                    Xrm.Page.getAttribute('ftp_callbacknumber').setValue(vcmn_requestData.d.ftp_CallbackNumber);
                    Xrm.Page.getAttribute('ftp_callbacknumber').setSubmitMode('always');
                }
                if (vcmn_requestData.d.ftp_ReasonforRequest != null) {
                    vcmn_setSimpleLookupValue('ftp_reasonforrequest', vcmn_requestData.d.ftp_ReasonforRequest.LogicalName, vcmn_requestData.d.ftp_ReasonforRequest.Id, vcmn_requestData.d.ftp_ReasonforRequest.Name);
                    Xrm.Page.getAttribute('ftp_reasonforrequest').setSubmitMode('always');

                    //Check if Non-Narcotic request, if so default note signing to yes so that it will not prompt the user
                    if (vcmn_requestData.d.ftp_ReasonforRequest.Name == vcmn_nonNarcoticRenewalRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_requestData.d.ftp_ReasonforRequest.Name == vcmn_nonNarcoticRefillRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRefillRequestName) > -1) {
                        //Set Sign this note to Yes
                        Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                        Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
                    }
                }

                if (vcmn_requestData.d.ftp_ReasonforRequest.Name == "Pharmacy Outbound Call") {
                    if (typeof outboundTemplate_buildNoteText == "function") {
                        outboundTemplate_buildNoteText();
                    }
                }
                //*****NON NARCOTIC*****
                else if (vcmn_requestData.d.ftp_ReasonforRequest.Name == vcmn_nonNarcoticRenewalRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_requestData.d.ftp_ReasonforRequest.Name == vcmn_nonNarcoticRefillRequestName || vcmn_regardingobjectidname.indexOf(vcmn_nonNarcoticRefillRequestName) > -1) {
                    //Define as Non Narcotic Template
                    vcmn_nonNarcoticTemplate = true;
                    //Construct Non-Narcotic Template Text
                    var vcmn_nonNarcoticTemplateText = ""; // '---------------Medications Selected-------------------\n\n\n---------------------------------------------------------';
                    //Do Middle Section
                    if (vcmn_requestData.d.ftp_rxtype != null) {
                        var vcmn_rxType = ""
                        if (vcmn_requestData.d.ftp_rxtype.Value == 100000000) { vcmn_rxType = "Refill"; }
                        if (vcmn_requestData.d.ftp_rxtype.Value == 100000001) { vcmn_rxType = "Renewal"; }
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nVeteran is requesting a " + vcmn_rxType;
                    }
                    if (vcmn_requestData.d.ftp_SubReasonId != null) {
                        vcmn_subReasonId = vcmn_requestData.d.ftp_SubReasonId.Id;
                        if (vcmn_subReasonId != null) {
                            //Get Template Text
                            var vcmn_subreasonData = vcmn_getSingleEntityDataSync('ftp_subreasonSet', 'ftp_notetext', vcmn_subReasonId);
                            if (vcmn_subreasonData.d.ftp_notetext != null) {
                                vcmn_subReasonTemplateText = vcmn_subreasonData.d.ftp_notetext;
                            }
                        }
                    }
                    if (vcmn_requestData.d.ftp_MinorReasonId != null) {
                        vcmn_minorReasonId = vcmn_requestData.d.ftp_MinorReasonId.Id;
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
                    if (vcmn_requestData.d.CustomerId != null) {
                        vcmn_setSimpleLookupValue('ftp_patient', vcmn_requestData.d.CustomerId.LogicalName, vcmn_requestData.d.CustomerId.Id, vcmn_requestData.d.CustomerId.Name);
                        Xrm.Page.getAttribute('ftp_patient').setSubmitMode('always');
                        //Set as veteran id
                        vcmn_veteranId = vcmn_requestData.d.CustomerId.Id
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

                        if (vcmn_requestData.d.ftp_lastdirectionsonfile != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLast Directions On File: " + vcmn_requestData.d.ftp_lastdirectionsonfile;
                        }
                        if (vcmn_requestData.d.ftp_patientstatesdirections != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPatient States Directions: " + vcmn_requestData.d.ftp_patientstatesdirections;
                        }
                        if (vcmn_requestData.d.ftp_directionsby != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nDirections by: " + vcmn_requestData.d.ftp_directionsby;
                        }
                        if (vcmn_requestData.d.ftp_veteranchangeddose != null) {
                            var vcmn_veteranChangedDose = null;
                            if (vcmn_requestData.d.ftp_veteranchangeddose == false) { vcmn_veteranChangedDose = "No"; }
                            if (vcmn_requestData.d.ftp_veteranchangeddose == true) { vcmn_veteranChangedDose = "Yes"; }
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nVeteran Changed Dose: " + vcmn_veteranChangedDose;
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Other:") {
                        if (vcmn_requestData.d.ftp_othertext != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nOther Text: " + vcmn_requestData.d.ftp_othertext;
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Veteran is requesting medication replacement" && vcmn_minorReasonNoteSubText == "Medication lost or stolen") {
                        if (vcmn_requestData.d.ftp_lostorstolen != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLost or Stolen: " + vcmn_requestData.d.ftp_lostorstolen;
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Veteran is requesting medication replacement" && vcmn_minorReasonNoteSubText == "Medication never arrived in mail. Tracking #:") {
                        if (vcmn_requestData.d.ftp_TrackingNumber != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nTracking Number: " + vcmn_requestData.d.ftp_TrackingNumber;
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Veteran requesting refill quantity to be changed to a _____ day supply") {
                        //if (vcmn_requestData.d.ftp_RxRefillQuantity != null) {
                        //    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nRx Refill Quantity: " + vcmn_requestData.d.ftp_RxRefillQuantity;
                        //}

                        //adjusted 5/7/18 kknab
                        if (vcmn_requestData.d.ftp_dayssupply_text != null) {
                            //vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nRx Refill Quantity: " + vcmn_requestData.d.ftp_dayssupply_text;
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText.replace(vcmn_subReasonTemplateText, vcmn_subReasonTemplateText.replace("_____", vcmn_requestData.d.ftp_dayssupply_text));
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Veteran requests medication copay reversal" && vcmn_minorReasonNoteSubText == "Other:") {
                        if (vcmn_requestData.d.ftp_othercopayreversal != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nOther (copay reversal): " + vcmn_requestData.d.ftp_othercopayreversal;
                        }
                    }
                    if (vcmn_subReasonTemplateText == "Veteran has stopped taking the medication") {
                        if (vcmn_requestData.d.ftp_reasonforstopping != null) {
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nReason for Stopping: " + vcmn_requestData.d.ftp_reasonforstopping;
                        }
                    }
                    if ((vcmn_subReasonTemplateText == "Medication requesting early refill:" &&
                        vcmn_minorReasonNoteSubText == "Veteran has been requiring extra medication and is taking more than prescribed (reports taking ________ tablets / capsules per day):")
                        || (vcmn_subReasonTemplateText == "Veteran is requesting a partial fill" &&
                            vcmn_minorReasonNoteSubText == "Veteran has been requiring extra medication and is taking more than prescribed (reports taking ________ tablets / capsules per day):")) {
                        if (vcmn_requestData.d.ftp_QuantityReportsTaking != null) {
                            //vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nQuantity Reports Taking: " + vcmn_requestData.d.ftp_QuantityReportsTaking;
                            vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText.replace(vcmn_minorReasonNoteSubText, vcmn_minorReasonNoteSubText.replace("________", vcmn_requestData.d.ftp_QuantityReportsTaking));
                        }
                    }

                    //Always include last filled
                    if (vcmn_requestData.d.ftp_LastFilled != null) {
                        //vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLast Filled: " + new Date(parseInt(vcmn_requestData.d.ftp_LastFilled.toString().replace("/Date(", "").replace(")/", ""), 10));
                        var vcmn_fillDate = new Date(parseInt(vcmn_requestData.d.ftp_LastFilled.toString().replace("/Date(", "").replace(")/", ""), 10));
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLast Filled: " +
                            (vcmn_fillDate.getMonth() + 1).toString() + "/" + vcmn_fillDate.getDate().toString() + "/" + vcmn_fillDate.getFullYear().toString();
                    }

                    //Do Bottom Section
                    vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\n";
                    if (vcmn_requestData.d.ftp_methodofrequest != null) {
                        var vcmn_methodOfRequest = "";
                        if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000000) { vcmn_methodOfRequest = "Phone"; }
                        if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000001) { vcmn_methodOfRequest = "In Person"; }
                        if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000002) { vcmn_methodOfRequest = "Mail"; }
                        if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000003) { vcmn_methodOfRequest = "Internet"; }
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nMethod of Request: " + vcmn_methodOfRequest;
                    }
                    if (vcmn_requestData.d.ftp_pickupmethod != null) {
                        var vcmn_pickupmethod = vcmn_requestData.d.ftp_pickupmethod.Value;
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
                    if (vcmn_requestData.d.ftp_age != null) {
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nAge: " + vcmn_requestData.d.ftp_age;
                    }
                    if (vcmn_requestData.d.ftp_pcp != null) {
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nPCP: " + vcmn_requestData.d.ftp_pcp;
                    }
                    if (vcmn_requestData.d.ftp_calccrcl != null) {
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nCalc CrCl: " + vcmn_requestData.d.ftp_calccrcl;
                    }
                    if (vcmn_requestData.d.ftp_LatesteGFRResult != null) {
                        vcmn_nonNarcoticTemplateText = vcmn_nonNarcoticTemplateText + "\nLatest eGFR: " + vcmn_requestData.d.ftp_LatesteGFRResult;
                    }

                    //Write Non Narcotic Template Text as long as it is not a Triage
                    if (vcmn_triageexpert == 'NO' || vcmn_triageexpert == null) {
                        Xrm.Page.getAttribute("ftp_notedetail").setValue(vcmn_nonNarcoticTemplateText);
                        Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode("always");
                    }
                }
                //*****NON NARCOTIC END*****

                //*****STANDARD TEMPLATE START*****
                else {
                    if (vcmn_requestData.d.ftp_SubReasonId != null) {
                        vcmn_subReasonId = vcmn_requestData.d.ftp_SubReasonId.Id;
                        if (vcmn_subReasonId != null) {
                            //Get Template Text
                            var vcmn_subreasonData = vcmn_getSingleEntityDataSync('ftp_subreasonSet', 'ftp_notetext', vcmn_subReasonId);
                            if (vcmn_subreasonData.d.ftp_notetext != null) {
                                vcmn_subReasonTemplateText = vcmn_subreasonData.d.ftp_notetext;
                            }
                        }
                    }
                    if (vcmn_requestData.d.ftp_MinorReasonId != null) {
                        vcmn_minorReasonId = vcmn_requestData.d.ftp_MinorReasonId.Id;
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

                    if (vcmn_requestData.d.CustomerId != null) {
                        vcmn_setSimpleLookupValue('ftp_patient', vcmn_requestData.d.CustomerId.LogicalName, vcmn_requestData.d.CustomerId.Id, vcmn_requestData.d.CustomerId.Name);
                        Xrm.Page.getAttribute('ftp_patient').setSubmitMode('always');
                        //Set as veteran id
                        vcmn_veteranId = vcmn_requestData.d.CustomerId.Id
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

                    if (vcmn_requestData.d.ftp_LastFilled != null) {
                        //vcmn_lastFilled = new Date(parseInt(vcmn_requestData.d.ftp_LastFilled.toString().replace("/Date(", "").replace(")/", ""), 10));
                        var vcmn_fillDate = new Date(parseInt(vcmn_requestData.d.ftp_LastFilled.toString().replace("/Date(", "").replace(")/", ""), 10));
                        vcmn_lastFilled = (vcmn_fillDate.getMonth() + 1).toString() + "/" + vcmn_fillDate.getDate().toString() + "/" + vcmn_fillDate.getFullYear().toString();
                    }
                    if (vcmn_requestData.d.ftp_QuantityReportsTaking != null) { vcmn_quantityReportsTaking = vcmn_requestData.d.ftp_QuantityReportsTaking; }
                    if (vcmn_requestData.d.ftp_RxNumber != null) { vcmn_rxNumber = vcmn_requestData.d.ftp_RxNumber; }
                    if (vcmn_requestData.d.ftp_RxRefillQuantity != null) { vcmn_rxRefillQuantity = vcmn_requestData.d.ftp_RxRefillQuantity; }
                    if (vcmn_requestData.d.ftp_TrackingNumber != null) { vcmn_trackingNumber = vcmn_requestData.d.ftp_TrackingNumber; }
                    if (vcmn_requestData.d.ftp_OpiodAgreementOnfile != null) { vcmn_opioidAgreementOnfile = vcmn_requestData.d.ftp_OpiodAgreementOnfile.Value; }
                    if (vcmn_requestData.d.ftp_UDSonfile != null) { vcmn_UDSonfile = vcmn_requestData.d.ftp_UDSonfile.Value; }
                    if (vcmn_requestData.d.ftp_StateDrugMonitoringReport != null) { vcmn_stateDrugMonitoringReport = vcmn_requestData.d.ftp_StateDrugMonitoringReport.Value; }
                    if (vcmn_requestData.d.ftp_spdmpstateonfile != null) { vcmn_spdmpstateonfile = vcmn_requestData.d.ftp_spdmpstateonfile.Value; }
                    if (vcmn_requestData.d.ftp_SPDMPState2 != null) { vcmn_sPDMPState2 = vcmn_requestData.d.ftp_SPDMPState2.Value; }
                    if (vcmn_requestData.d.ftp_pickupmethod != null) { vcmn_pickupmethod = vcmn_requestData.d.ftp_pickupmethod.Value; }

                    if (vcmn_requestData.d.ftp_earlyrefillcomment != null) { vcmn_earlyRefillComment = vcmn_requestData.d.ftp_earlyrefillcomment; }
                    if (vcmn_requestData.d.ftp_quantitytaking != null) { vcmn_quantityTaking = vcmn_requestData.d.ftp_quantitytaking; }
                    if (vcmn_requestData.d.ftp_vacationstart != null) { vcmn_vacationStart = new Date(parseInt(vcmn_requestData.d.ftp_vacationstart.toString().replace("/Date(", "").replace(")/", ""), 10)); }
                    if (vcmn_requestData.d.ftp_vacationend != null) { vcmn_vacationEnd = new Date(parseInt(vcmn_requestData.d.ftp_vacationend.toString().replace("/Date(", "").replace(")/", ""), 10)); }

                    if (vcmn_requestData.d.ftp_SubReasonId != null) {
                        vcmn_subReasonId = vcmn_requestData.d.ftp_SubReasonId.Id;
                        vcmn_subReasonName = vcmn_requestData.d.ftp_SubReasonId.Name;

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
                            if (vcmn_requestData.d.ftp_othertext != null) {
                                vcmn_templateNote = vcmn_templateNote + "\nOther Text: " + vcmn_requestData.d.ftp_othertext;
                            }
                            if (vcmn_requestData.d.ftp_methodofrequest != null) {
                                var vcmn_methodOfRequest = "";
                                if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000000) { vcmn_methodOfRequest = "Phone"; }
                                if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000001) { vcmn_methodOfRequest = "In Person"; }
                                if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000002) { vcmn_methodOfRequest = "Mail"; }
                                if (vcmn_requestData.d.ftp_methodofrequest.Value == 100000003) { vcmn_methodOfRequest = "Internet"; }
                                vcmn_templateNote = vcmn_templateNote + "\nMethod of Request: " + vcmn_methodOfRequest;
                            }
                            if (vcmn_requestData.d.ftp_age != null) {
                                vcmn_templateNote = vcmn_templateNote + "\nAge: " + vcmn_requestData.d.ftp_age;
                            }
                            if (vcmn_requestData.d.ftp_pcp != null) {
                                vcmn_templateNote = vcmn_templateNote + "\nPCP: " + vcmn_requestData.d.ftp_pcp;
                            }
                            if (vcmn_requestData.d.ftp_calccrcl != null) {
                                vcmn_templateNote = vcmn_templateNote + "\nCalc CrCl: " + vcmn_requestData.d.ftp_calccrcl;
                            }
                            if (vcmn_requestData.d.ftp_LatesteGFRResult != null) {
                                vcmn_templateNote = vcmn_templateNote + "\nLatest eGFR: " + vcmn_requestData.d.ftp_LatesteGFRResult;
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

                        //Write note text if not Triage:
                        if (vcmn_triageexpert == 'NO' || vcmn_triageexpert == null) {
                            Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_templateNote);
                            Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
                        }
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
                                                    //Write Diagnosis code to Progress Note Form if a Triage Note (revised 5/9-17 for workload encounter also)
                                                    //*if (vcmn_triageexpert == 'YES') {
                                                    vcmn_setSimpleLookupValue('ftp_diagnosiscode', vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.LogicalName, vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.Id, vcmn_currentUserFacilityData.d.ftp_defaulttandiagnosiscode.Name);
                                                    //Xrm.Page.getAttribute('ftp_diagnosiscode').setSubmitMode('always');
                                                    //*}
                                                }
                                            }
                                        }

                                        //Match up the VHG Triage minute configuration with CPT Code
                                        if (vcmn_triageminutes > 0) {
                                            var vcmn_conditionalFilter = "(ftp_usertype/Id eq guid'" + vcmn_currentUserData.d.msdyusd_USDConfigurationId.Id + "') and (ftp_startminutes le " + vcmn_triageminutes + " ) and (ftp_endminutes ge " + vcmn_triageminutes + " )";
                                            vcmn_getMultipleEntityDataAsync('ftp_cptcodeSet', 'ftp_cptcodeId, ftp_name, ftp_startminutes, ftp_endminutes', vcmn_conditionalFilter, 'ftp_startminutes', 'asc', 0, vcmn_cptCode_response, vcmn_triageminutes);
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
                                                    //Write Diagnosis code to Progress Note Form if a Triage Note (revised 5/9-17 for workload encounter also)
                                                    //*if (vcmn_triageexpert == 'YES') {
                                                    vcmn_setSimpleLookupValue('ftp_diagnosiscode', vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.LogicalName, vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.Id, vcmn_currentUserFacilityData.d.ftp_defaultpharmacyprimarydiagnosiscode.Name);
                                                    //Xrm.Page.getAttribute('ftp_diagnosiscode').setSubmitMode('always');
                                                    //*}
                                                }
                                            }
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
                //7/12/18 removed fallback to veteran Home Facility
                if (vcmn_contactData.d.ftp_currentfacilityid != null) {
                    if (vcmn_contactData.d.ftp_currentfacilityid.Id != null) {
                        vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_currentfacilityid.LogicalName, vcmn_contactData.d.ftp_currentfacilityid.Id, vcmn_contactData.d.ftp_currentfacilityid.Name);
                        Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                    }
                    //else {
                    //    //Get Facility from Home Facility
                    //    if (vcmn_contactData.d.ftp_FacilityId != null) {
                    //        vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_FacilityId.LogicalName, vcmn_contactData.d.ftp_FacilityId.Id, vcmn_contactData.d.ftp_FacilityId.Name);
                    //        Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                    //    }
                    //}
                }
                //else {
                //    //Get Facility from Home Facility
                //    if (vcmn_contactData.d.ftp_FacilityId != null) {
                //        vcmn_setSimpleLookupValue('ftp_patientfacility', vcmn_contactData.d.ftp_FacilityId.LogicalName, vcmn_contactData.d.ftp_FacilityId.Id, vcmn_contactData.d.ftp_FacilityId.Name);
                //        Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
                //    }
                //}
            }
        }

        //Set other default form values
        Xrm.Page.getAttribute('scheduledend').setValue(new Date());
        Xrm.Page.getAttribute('scheduledend').setSubmitMode('always');

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
        }

        //Change Focus to the Notes field
        //Xrm.Page.getControl("ftp_notedetail").setFocus();

        //Get ICN via web service and get Service Connected disabilities, Appointments and Medications thereafter
        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_SSN = '';
        var vcmn_DOB = '';

        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        if (vcmn_requestId == null) { return false; }

        if (vcmn_requestId[0].entityType === "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);

            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        return false;
                    }
                }
            }
        }
        else if (vcmn_requestId[0].entityType === "ftp_interaction") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);

            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        return false;
                    }
                }
            }
        }
        if (vcmn_veteranId == null) {
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, GovernmentId', vcmn_veteranId.Id);
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
        alert('Progress Note Form Load Script Function Error(vcmn_newProgressNoteLoad_WebURL): ' + err.message);
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

        //Construct Service Parameters
        var vcmn_idobject = {};
        vcmn_idobject.NationalId = '000000' + vcmn_SecurePatientICN + '000000';
        var vcmn_serviceParams = [{
            key: "identifier",
            type: "c:string",
            value: JSON.stringify(vcmn_idobject)
        }];
        //Call the web service security function
        CrmSecurityTokenEncryption(vcmn_EnrollmentEligibilitySummaryURLbase, vcmn_serviceParams, vcmn_serverUrl, vcmn_getEsrEnrollmentJSON_response)

    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_getServiceConnectedDisabilities): ' + err.message);
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
        }

        //Move on to Appointments
        //*vcmn_getPatientAppointments(vcmn_patientICN);
        vcmn_getPatientAppointments(vcmn_SecurePatientICN);
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_getEsrEnrollmentJSON_response): ' + err.message);
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
        alert('Progress Note Form Load Script Function Error(vcmn_getPatientAppointments): ' + err.message);
    }
}

function vcmn_getAppointmentData(vcmn_nationalId) {
    try {
        if (vcmn_useSecureAppointmentAPI) {
            try {
                var vcmn_secureAppointmentParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: vcmn_nationalId }) }];
                CrmSecurityTokenEncryption(
                    vcmn_AppointmentsSecureUrl,
                    vcmn_secureAppointmentParams,
                    vcmn_serverUrl,
                    function (pError, pResponse) {
                        if (!!pError) {
                            vcmn_processAppointmentsResponse(null);
                        }
                        else if (pResponse.ErrorOccurred) {
                            vcmn_processAppointmentsResponse(null);
                        }
                        else {
                            vcmn_processAppointmentsResponse(pResponse);
                        }
                    }
                );
            }
            catch (err) {
                alert("Request Progress Note Template Script Function Error(vcmn_getAppointmentData [secure]): " + err.message);
                return null;
            }
        }
        else {
            var vcmn_appointmentURL = vcmn_AppointmentsUrl + '000000' + vcmn_nationalId + '000000';
            $.ajax({
                type: "GET",
                url: vcmn_appointmentURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    vcmn_processAppointmentsResponse(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //System Error
                    vcmn_processAppointmentsResponse(null);
                },
                async: true,
                cache: false
            });
        }
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
        }

        //Move on to Medications

        //Check Team membership & reason for request name
        //KKNAB 3/23/18: per an older enhancement from VCCM Release 5.0 Sprint 19, have to remove Team membership check for inclusion of picked medications on the progress note
        //if (vcmn_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId())) {
        var vcmn_reasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue(); /*this value has been copied fro the request itself*/
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        var vcmn_reasonForRequestName = '';
        var vcmn_requestIdName = '';
        if (vcmn_reasonForRequest != null) { vcmn_reasonForRequestName = vcmn_reasonForRequest[0].name; }
        if (vcmn_requestId != null) { vcmn_requestIdName = vcmn_requestId[0].name; }
        var vcmn_isNonNarcoticRefillOrRenewal = (vcmn_reasonForRequestName == vcmn_nonNarcoticRenewalRequestName || vcmn_requestIdName.indexOf(vcmn_nonNarcoticRenewalRequestName) > -1 || vcmn_reasonForRequestName == vcmn_nonNarcoticRefillRequestName || vcmn_requestIdName.indexOf(vcmn_nonNarcoticRefillRequestName) > -1);
        var vcmn_isNarcoticRefillOrRenewal = (vcmn_reasonForRequestName == vcmn_narcoticRenewalRequestName || vcmn_requestIdName.indexOf(vcmn_narcoticRenewalRequestName) > -1 || vcmn_reasonForRequestName == vcmn_narcoticRefillRequestName || vcmn_requestIdName.indexOf(vcmn_narcoticRefillRequestName) > -1);
        if (vcmn_isNonNarcoticRefillOrRenewal || vcmn_isNarcoticRefillOrRenewal) {
            vcmn_getPickedMedications(0, '');
        }
        //}
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
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        if (vcmn_requestId == null) { return false; }
        var vcmn_conditionalFilter = "(ftp_RequestId/Id eq guid'" + vcmn_requestId[0].id + "')";
        vcmn_getMultipleEntityDataAsync('ftp_pickedmedicationSet', 'ftp_name, ftp_VAStatus, ftp_RefillsRemaining_number, ftp_IssueDate_text, ftp_LastRefill_text, ftp_ExpirationDate_text', vcmn_conditionalFilter, 'ftp_name', 'asc', vcmn_skipCount, vcmn_getPickedMedications_response, vcmn_MEDnoteString);
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_getPickedMedications): ' + err.message);
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
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_getPickedMedications_response): ' + err.message);
    }
}

function vcmn_facilityByCode_response(vcmn_facilityData, vcmn_lastSkip, vcmn_facilityCode) {
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        //***REVISED NOT USED, KEEP FOR FUTURE UPDATE***
        /*
        var vcmn_facilityid = null;
        var vcmn_facilityname = null;
        for (var i = 0; i <= vcmn_facilityData.d.results.length - 1; i++) {
            //Get info
            if (vcmn_facilityData.d.results[i].ftp_facilityId != null) { vcmn_facilityid = vcmn_facilityData.d.results[i].ftp_facilityId; }
            if (vcmn_facilityData.d.results[i].ftp_name != null) { vcmn_facilityname = vcmn_facilityData.d.results[i].ftp_name; }
            break;
        }
        if (vcmn_facilityid != null) {
            vcmn_setSimpleLookupValue('ftp_patientfacility', 'ftp_facility', vcmn_facilityid, vcmn_facilityname);
            Xrm.Page.getAttribute('ftp_patientfacility').setSubmitMode('always');
        }
        */
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_facilityByCode_response): ' + err.message);
    }
}

function vcmn_cptCode_response(vcmn_cptCodeData, vcmn_lastSkip, vcmn_triageminutes) {
    //debugger;
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        for (var i = 0; i <= vcmn_cptCodeData.d.results.length - 1; i++) {
            //Write to CRM progress note form
            vcmn_setSimpleLookupValue('ftp_cptcode', 'ftp_cptcode', vcmn_cptCodeData.d.results[i].ftp_cptcodeId, vcmn_cptCodeData.d.results[i].ftp_name);
            //Xrm.Page.getAttribute('ftp_cptcode').setSubmitMode('always');
            break;
        }
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_cptCode_response): ' + err.message);
    }
}

function vcmn_ribbonButtonSave() {
    try {
        //Save the current CRM data
        Xrm.Page.data.entity.save();
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_ribbonButtonSave): ' + err.message);
    }
}

function vcmn_wordWrap(str, intWidth, strBreak, cut) {
    try {
        //Takes a string that exceeds a set length and inserts word wrap
        var m = ((arguments.length >= 2) ? arguments[1] : 75)
        var b = ((arguments.length >= 3) ? arguments[2] : '\n')
        var c = ((arguments.length >= 4) ? arguments[3] : false)

        var i, j, l, s, r

        str += ''

        if (m < 1) {
            return str
        }

        for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
            for (s = r[i], r[i] = '';
                s.length > m;
                r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : '')) {
                j = c === 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1]
                    ? m
                    : j.input.length - j[0].length || c === true && m ||
                    j.input.length + (j = s.slice(m).match(/^\S*/))[0].length
            }
        }

        return r.join('\n')
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_wordWrap): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
}

function vcmn_ribbonButtonSaveToVistA(cookieData) {
    debugger;
    //if cookieData is null - reacquire it
    try {
        //action calls beneath this event will make sure Progress Note Tab is hidden during automatic integration and shown during manual use
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=Start", "level=Information", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);

        //Check the value of the Integration Status Field, if = 'OK', stop and exit this script
        var vcmn_integrationStatus = Xrm.Page.getAttribute('ftp_integrationstatus').getValue();
        if (vcmn_integrationStatus == 'OK') { return false; }

        //**************************************************************************
        //New story 650998 - Always assume user want to sign the note, do not prompt
        //Set Sign this note to Yes
        Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
        Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
        //**************************************************************************

        //Prompt user to sign the note
        var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        var vcmn_signThisNoteFailure = false;
        if (vcmn_signThisNote == null) {
            Xrm.Utility.confirmDialog(
                "Do you need to sign this note?, Select OK if Yes, otherwise CANCEL.",
                function () {
                    //Check if VIA Login cookie exist (not expired)
                    var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
                    //Prompt user to login to VIA
                    if (vcmn_ViaLoginCookie == "") {
                        alert("Your VISTA session has expired. In order to sign this note, you must be logged into VISTA!");
                        Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
                        Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
                        vcmn_signThisNoteFailure = true;
                        return;
                    }
                    Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                },
                function () {
                    Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000000);
                }
            );
            Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
        }

        if (vcmn_signThisNoteFailure == true) {
            return false;
        }

        //Check for additional signers, if they exist, the user must be logged into VIA to continue process.
        //Additional Signatures must also be in sync with matching Session variables

        vcmn_AddlSignersNameArray = null;
        vcmn_AddlSignersIenArray = null;

        var vcmn_selectedSigners = Xrm.Page.getAttribute('ftp_selectedsigners').getValue();
        if (vcmn_selectedSigners != null && vcmn_selectedSigners != '') {
            //Additional Signers exist in CRM, verify session variables
            var vcmn_selectedArray = vcmn_selectedSigners.split('~~~');
            var vcmn_selectedArrayRecordCount = vcmn_selectedArray.length;
            if (vcmn_selectedArrayRecordCount > 1) {
                vcmn_AddlSignersNameArray = vcmn_selectedArray;
            }

            var vcmn_selectedIENArray = '';
            var vcmn_selectedIENArrayRecordCount = 0;
            var vcmn_progressNoteId = Xrm.Page.data.entity.getId();

            var vcmn_arrayMismatch = false;

            //Get Note's Browser Local Storage Values
            if (vcmn_progressNoteId != null && vcmn_progressNoteId != '') {
                vcmn_localStorageVarName = "PN" + vcmn_progressNoteId;
                var vcmn_localStorageStringValue = localStorage.getItem(vcmn_localStorageVarName);
                if (vcmn_localStorageStringValue != null && vcmn_localStorageStringValue != '') {
                    vcmn_selectedIENArray = vcmn_localStorageStringValue.split('~~~');
                    vcmn_selectedIENArrayRecordCount = vcmn_selectedIENArray.length;
                    if (vcmn_selectedIENArrayRecordCount > 1) {
                        vcmn_AddlSignersIenArray = vcmn_selectedIENArray;
                    }
                }
            }
            //Compare CRM signer array length with LocalStorage array length
            if (vcmn_selectedArrayRecordCount != vcmn_selectedIENArrayRecordCount) { vcmn_arrayMismatch = true; }

            if (vcmn_arrayMismatch == true) {
                alert("The count of Additional Signers selected in CRM, does not match the count of Additional Signers in VISTA!\n\nPlease remove all the additional signers on this Progress Note and perform the selection process again!\n\nThis note cannot be integrated with VISTA/CPRS until this has been resolved.");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=AdditionalSignerError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_signThisNoteFailure = true;
            }
            else {
                //Check if VIA Login cookie exist (not expired)
                var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
                if (vcmn_ViaLoginCookie == "") {
                    alert("Your VISTA session has expired. In order to process a note with additional signers, you must be logged into VISTA!");
                    VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=VIALoginExpired", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
                    vcmn_signThisNoteFailure = true;
                    return;
                }
            }
        }

        //Enforce VIA Login
        //Check if VIA Login cookie exist (not expired)
        var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
        if (vcmn_ViaLoginCookie == "") {
            alert("Your VISTA session has expired. In order to process a note, you must be logged into VISTA!");
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=VIALoginExpired", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            vcmn_signThisNoteFailure = true;
            //return false;
        }

        if (vcmn_signThisNoteFailure == true) {
            //******Developer Bypass for no VISTA authentication******
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}" || (Xrm.Page.context.getUserId()).toUpperCase() == "{EB21BC63-81BF-E511-942C-0050568D743D}") {
                alert("Developer VISTA authentication bypass applied!");
                Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
            }
            else {
                return false;
            }
        }

        //Save the current CRM data
        Xrm.Page.data.entity.save();
        //Display YELLOW Progress....
        Xrm.Page.ui.setFormNotification("Verifying progress note data, please wait..", "INFO", "SAVEVISTA");

        if (vcmn_automaticViaIntegration != true) {
            var vcmn_confirmSaveToVista = confirm('Are you sure you want to save this note to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the progress note will automatically be marked as completed and you will be prompted to exit the record!');
            if (vcmn_confirmSaveToVista == false) {
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }
        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        if (vcmn_requestId == null) {
            alert('The current progress note does not have a related request assigned in the Regarding field, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.getControl('regardingobjectid').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify that the regardingid is of type 'incident' or 'ftp_interaction'
        if (vcmn_requestId[0].entityType != 'incident'
            && vcmn_requestId[0].entityType != 'ftp_interaction') {
            alert('The current progress note has an invalid regarding type, it must be of the type request/incident, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.getControl('regardingobjectid').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_SSN = '';
        var vcmn_DOB = '';

        if (vcmn_requestId[0].entityType === 'incident') {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        else {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_Veteran != null) {
                    vcmn_veteranId = vcmn_requestData.d.ftp_Veteran;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        if (vcmn_veteranId == null) {
            alert('The related request does not have a veteran/contact assigned, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, GovernmentId', vcmn_veteranId.Id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.ftp_DateofBirth != null) { vcmn_DOB = vcmn_contactData.d.ftp_DateofBirth; }
            if (vcmn_contactData.d.GovernmentId != null) { vcmn_SSN = vcmn_contactData.d.GovernmentId; }
        }

        //**WORKLOAD ENCOUNTER**
        vcmn_matchLookupId = vcmn_SSN;
        //***********************

        //Perform MVI Search
        //**vcmn_unattendedMviSearch(vcmn_veteranFirstName, vcmn_veteranLastName, vcmn_DOB, vcmn_SSN);

        //Skipping Unattended MVI**************

        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();

        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranName = '';
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_veteranMiddleName = '';
        
        if (vcmn_requestId[0].entityType === "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        else if (vcmn_requestId[0].entityType === "ftp_interaction") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_Veteran != null) {
                    vcmn_veteranId = vcmn_requestData.d.ftp_Veteran;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }

        if (vcmn_veteranId == null) {
            alert('The related request does not have a veteran/contact assigned, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FullName, FirstName, LastName, MiddleName', vcmn_veteranId.Id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FullName != null) { vcmn_veteranName = vcmn_contactData.d.FullName; }
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.MiddleName != null) { vcmn_veteranMiddleName = vcmn_contactData.d.MiddleName; }
        }

        //Get user data
        var vcmn_crmUserId = Xrm.Page.getAttribute('ownerid').getValue();
        var vcmn_userDomainId = '';
        var vcmn_userFirstName = '';
        var vcmn_userLastName = '';
        var vcmn_userMiddleName = '';
        var vcmn_userSiteId = '';

        if (vcmn_crmUserId != null) {
            //Verify the owner type
            if (vcmn_crmUserId[0].entityType != 'systemuser') {
                alert('The progress note owner must be an individual user and not a team, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=OwnerIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'DomainName, FirstName, LastName, MiddleName, ftp_FacilitySiteId', vcmn_crmUserId[0].id);
            if (vcmn_userData != null) {
                if (vcmn_userData.d.DomainName != null) { vcmn_userDomainId = vcmn_userData.d.DomainName; }
                if (vcmn_userData.d.FirstName != null) { vcmn_userFirstName = vcmn_userData.d.FirstName; }
                if (vcmn_userData.d.LastName != null) { vcmn_userLastName = vcmn_userData.d.LastName; }
                if (vcmn_userData.d.MiddleName != null) { vcmn_userMiddleName = vcmn_userData.d.MiddleName; }
                if (vcmn_userData.d.ftp_FacilitySiteId != null) { vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id; }
            }
        }
        else {
            alert('Unable to verify the user account for the current author/owner assigned to this note, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=OwnerIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Verify that the current owner and the current user is the same person, if not do not proceed
        if ((vcmn_crmUserId[0].id).toUpperCase() != (Xrm.Page.context.getUserId()).toUpperCase()) {
            alert('The current author/owner does not match the current CRM user, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=OwnerIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_NoteUserTeam = "NONE";
        //Check Team membership
        if (vcmn_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PHARMACY"; }
        if (vcmn_UserHasTeam("CCA Team", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "CCA"; }
        if (vcmn_UserHasTeam("RN", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "TAN"; }
        //**TEMP, verify these team values that they are correct **FUTURE NEED**
        if (vcmn_UserHasTeam("PACT User", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PACT"; }
        if (vcmn_UserHasTeam("MSA", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "MSA"; }
        if (vcmn_UserHasTeam("Advanced MSA", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "MSA"; }
        if (vcmn_UserHasTeam("LIP", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "MSA"; }

        //Verify Team Value, that one has been assigned
        if (vcmn_NoteUserTeam == "NONE") {
            alert('The current author/owner does not belong to a CRM team that can integrate notes, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=OwnerIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get request form content
        var vcmn_noteDescription = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        if (vcmn_noteDescription == null || vcmn_noteDescription == '') {
            alert('The note description field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_callbackNumber = Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        if (vcmn_callbackNumber == null || vcmn_callbackNumber == '') {
            alert('The callback number field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_reasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
        if (vcmn_reasonForRequest == null) {
            alert('The reason for request field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_encounterCode = 'NEW';
        var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        if (vcmn_signThisNote == 100000001) { vcmn_signThisNote = true; } else { vcmn_signThisNote = false; }

        //Get Progress Note Guid/Id
        var vcmn_noteId = Xrm.Page.data.entity.getId();

        //Get Created On Date & Convert format
        var vcmn_createdOnDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('createdon').getValue());
        if (vcmn_createdOnDate == null) {
            alert('The CRM createdon field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get User Entry Date
        var vcmn_userEntryDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('ftp_userentrydate').getValue());
        if (vcmn_userEntryDate == null) { vcmn_userEntryDate = vcmn_createdOnDate; }

        //Get Facility and lookup facility number and HL7 URL
        var vcmn_facilityCode = '';
        var vcmn_siteHL7ListenerAddress = '';
        var vcmn_patientFacility = Xrm.Page.getAttribute('ftp_patientfacility').getValue();
        if (vcmn_patientFacility == null) {
            alert('The CRM patient facility field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //**var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text, ftp_hl7listener', vcmn_patientFacility[0].id);
            var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_patientFacility[0].id);
            if (vcmn_facilityData.d.ftp_FacilityCode_text != null) {
                vcmn_facilityCode = vcmn_facilityData.d.ftp_FacilityCode_text;
            }
            else {
                alert('The CRM patient facility code is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }

        var vcmn_originatorID = '';
        var vcmn_userSiteNo = '';

        var selectedSite = Xrm.Page.getAttribute('ftp_progressnotefacility');
        if (!selectedSite || !selectedSite.getValue()) {
            alert('The CRM Note Site code is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Lookup the Facility/Site #
        var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', selectedSite.getValue()[0].id);
        if (vcmn_facilityData != null) {
            if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_userSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
        }

        //if (cookieData[0] == null)
        //    vcmn_userSiteNo = cookieData.siteCode;
        //else
        //    vcmn_userSiteNo = cookieData[0].siteCode;

        //Validate required Vista Lookup info
        if (vcmn_userSiteNo == '' || vcmn_userSiteNo == null || vcmn_userFirstName == '' || vcmn_userFirstName == null || vcmn_userLastName == '' || vcmn_userLastName == null) {
            //Abort process, missing info
            alert('One of the following required CRM user data fields are missing: Facilty No, First Name or Last Name, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {
            vcmn_prepHistoricalIntegrationStep01(cookieData);

        }
        else {
            //Execute workload encounter note integration steps
            vcmn_prepWorkloadEncounterIntegrationStep01(cookieData);
        }

    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_ribbonButtonSaveToVistA): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_ribbonButtonSaveToVistA_with_ICN(vcmn_patientICN) {
    try {

        //** NO LONGER NEEDED WITH VIA SAVE********

        //******Developer Bypass for missing ICN******
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}") {
                alert("Developer ICN bypass applied!");
                vcmn_patientICN = "123456V123456";
            }
        }

        //Verify Patient ICN
        if (vcmn_patientICN == '' || vcmn_patientICN == null) {
            alert('The assigned veteran does not have a patient ICN, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();

        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranName = '';
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_veteranMiddleName = '';

        
        if (vcmn_requestId[0].entityType === "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        else if (vcmn_requestId[0].entityType === "ftp_interaction") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_Veteran != null) {
                    vcmn_veteranId = vcmn_requestData.d.ftp_Veteran;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }

        if (vcmn_veteranId == null) {
            alert('The related request does not have a veteran/contact assigned, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FullName, FirstName, LastName, MiddleName', vcmn_veteranId.Id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FullName != null) { vcmn_veteranName = vcmn_contactData.d.FullName; }
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.MiddleName != null) { vcmn_veteranMiddleName = vcmn_contactData.d.MiddleName; }
        }

        //Get user data
        var vcmn_crmUserId = Xrm.Page.getAttribute('ownerid').getValue();
        var vcmn_userDomainId = '';
        var vcmn_userFirstName = '';
        var vcmn_userLastName = '';
        var vcmn_userMiddleName = '';
        var vcmn_userSiteId = '';

        if (vcmn_crmUserId != null) {
            //Verify the owner type
            if (vcmn_crmUserId[0].entityType != 'systemuser') {
                alert('The progress note owner must be an individual user and not a team, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'DomainName, FirstName, LastName, MiddleName, ftp_FacilitySiteId', vcmn_crmUserId[0].id);
            if (vcmn_userData != null) {
                if (vcmn_userData.d.DomainName != null) { vcmn_userDomainId = vcmn_userData.d.DomainName; }
                if (vcmn_userData.d.FirstName != null) { vcmn_userFirstName = vcmn_userData.d.FirstName; }
                if (vcmn_userData.d.LastName != null) { vcmn_userLastName = vcmn_userData.d.LastName; }
                if (vcmn_userData.d.MiddleName != null) { vcmn_userMiddleName = vcmn_userData.d.MiddleName; }
                if (vcmn_userData.d.ftp_FacilitySiteId != null) { vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id; }
            }
        }
        else {
            alert('Unable to verify the user account for the current author/owner assigned to this note, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Verify that the current owner and the current user is the same person, if not do not proceed
        if ((vcmn_crmUserId[0].id).toUpperCase() != (Xrm.Page.context.getUserId()).toUpperCase()) {
            alert('The current author/owner does not match the current CRM user, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_NoteUserTeam = "NONE";
        //Check Team membership
        if (vcmn_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PHARMACY"; }
        if (vcmn_UserHasTeam("CCA Team", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "CCA"; }
        if (vcmn_UserHasTeam("RN", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "TAN"; }
        //**TEMP, verify these team values that they are correct **FUTURE NEED**
        if (vcmn_UserHasTeam("LIP User", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PACT"; }
        if (vcmn_UserHasTeam("MSA User", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "MSA"; }

        //Verify Team Value, that one has been assigned
        if (vcmn_NoteUserTeam == "NONE") {
            alert('The current author/owner does not belong to a CRM team that can integrate notes, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get request form content
        var vcmn_noteDescription = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        if (vcmn_noteDescription == null || vcmn_noteDescription == '') {
            alert('The note description field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {
            //Using new hospital location and local notes lookup fields
            var vcmn_localTitle = Xrm.Page.getAttribute('ftp_localnotetitle').getValue();
            if (vcmn_localTitle == null) {
                alert('The local note title field is empty, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else { vcmn_localTitle = vcmn_localTitle[0].name; }

            vcmn_patientAssignedLocation = Xrm.Page.getAttribute('ftp_notehospitallocation').getValue();
            if (vcmn_patientAssignedLocation == null) {
                alert('The hospital location field is empty, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else { vcmn_patientAssignedLocation = vcmn_patientAssignedLocation[0].name; }
        }

        var vcmn_callbackNumber = Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        if (vcmn_callbackNumber == null || vcmn_callbackNumber == '') {
            alert('The callback number field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_reasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
        if (vcmn_reasonForRequest == null) {
            alert('The reason for request field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_encounterCode = 'NEW';
        var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        if (vcmn_signThisNote == 100000001) { vcmn_signThisNote = true; } else { vcmn_signThisNote = false; }

        //Get Progress Note Guid/Id
        var vcmn_noteId = Xrm.Page.data.entity.getId();

        //Get Created On Date & Convert format
        var vcmn_createdOnDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('createdon').getValue());
        if (vcmn_createdOnDate == null) {
            alert('The CRM createdon field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get User Entry Date
        var vcmn_userEntryDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('ftp_userentrydate').getValue());
        if (vcmn_userEntryDate == null) { vcmn_userEntryDate = vcmn_createdOnDate; }

        //Get Facility and lookup facility number and HL7 URL
        var vcmn_facilityCode = '';
        var vcmn_siteHL7ListenerAddress = '';
        var vcmn_patientFacility = Xrm.Page.getAttribute('ftp_patientfacility').getValue();
        if (vcmn_patientFacility == null) {
            alert('The CRM patient facility field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text, ftp_hl7listener', vcmn_patientFacility[0].id);
            if (vcmn_facilityData.d.ftp_FacilityCode_text != null) {
                vcmn_facilityCode = vcmn_facilityData.d.ftp_FacilityCode_text;
            }
            else {
                alert('The CRM patient facility code is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            if (vcmn_facilityData.d.ftp_hl7listener != null) {
                var vcmn_siteHL7ListenerAddress = vcmn_facilityData.d.ftp_hl7listener;
            }
            else {
                alert('The CRM HL7 listener address is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }

        var vcmn_originatorID = '';
        var vcmn_userSiteNo = '';

        //Lookup the Facility/Site #
        if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
            var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
            if (vcmn_facilityData != null) {
                if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_userSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
            }
        }

        //Validate required Vista Lookup info
        if (vcmn_userSiteNo == '' || vcmn_userSiteNo == null || vcmn_userFirstName == '' || vcmn_userFirstName == null || vcmn_userLastName == '' || vcmn_userLastName == null) {
            //Abort process, missing info
            alert('One of the following required CRM user data fields are missing: Facilty No, First Name or Last Name, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {
            //Obtain the VistaDuz from the cross reference table if available
            if (vcmn_crmUserId != null) {
                var vcmn_conditionalFilter = "ftp_crmuser/Id eq (guid'" + vcmn_crmUserId[0].id + "')";
                var vcmn_crossReferenceData = vcmn_getMultipleEntityDataSync('ftp_useridSet', 'ftp_useridId, ftp_vistaduz', vcmn_conditionalFilter, 'ftp_name', 'asc', 0);
                if (vcmn_crossReferenceData != null) {
                    for (var i = 0; i <= vcmn_crossReferenceData.d.results.length - 1; i++) {
                        //Get Info
                        if (vcmn_crossReferenceData.d.results[i].ftp_vistaduz != null) { vcmn_originatorID = vcmn_crossReferenceData.d.results[i].ftp_vistaduz; }
                        break;
                    }
                }
            }

            //**NOTE: The code below to impersonate Lori Nicholls has been disabled per task 562307
            /*
            if (vcmn_IsProductionEnvironment == false) {
                //Provide the option to search for Lori Nicholls, site# 613
                var vcmn_impersonatePromptString = "**THIS IS A VISTA USER SEARCH TEST PROMPT** \n" +
                    "If you would like to impersonate the user: \n" +
                    "Lori Nicholls (613) \n" +
                    "Select OK.  Otherwise, select CANCEL.";
                var vcmn_confirmImpersonateVistaUser = confirm(vcmn_impersonatePromptString);
                if (vcmn_confirmImpersonateVistaUser == true) {
                    vcmn_userFirstName = "Lori";
                    vcmn_userLastName = "Nicholls";
                    vcmn_userSiteNo = "613";
                }
            }
            */

            var vcmn_vistausersData = vcmn_getVistaUsersData(vcmn_userFirstName, vcmn_userLastName, vcmn_userSiteNo, false);

            //Check vista users data content
            if (vcmn_vistausersData == null || vcmn_vistausersData.Data == null || vcmn_vistausersData.Data.length == null || vcmn_vistausersData.Data.length == 0) {
                //Abort process, missing info
                alert('Unable to obtain Vista User Data, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            var vcmn_selectedUserFirstName = '';
            var vcmn_selectedUserMiddleName = '';
            var vcmn_selectedUserLastName = '';
            var vcmn_selectedUserSuffix = '';
            var vcmn_selectedUserDisplayName = '';
            var vcmn_selectedUserTitle = '';
            var vcmn_userIsSelected = false;

            if (vcmn_vistausersData.Data.length > 1) {
                alert("The Vista User list, contains more than one user, please select the Vista User you want to use from the next prompt(s), a total of " + vcmn_vistausersData.Data.length + " users!");
                for (var i = 0; i <= vcmn_vistausersData.Data.length - 1; i++) {
                    var vcmn_currentUserFirstName = '';
                    var vcmn_currentUserMiddleName = '';
                    var vcmn_currentUserLastName = '';
                    var vcmn_currentUserSuffix = '';
                    var vcmn_currentUserDisplayName = '';
                    var vcmn_currentUserTitle = '';
                    if (vcmn_vistausersData.Data[i].FirstName != null) { vcmn_currentUserFirstName = vcmn_vistausersData.Data[i].FirstName; }
                    if (vcmn_vistausersData.Data[i].MiddleName != null) { vcmn_currentUserMiddleName = vcmn_vistausersData.Data[i].MiddleName; }
                    if (vcmn_vistausersData.Data[i].LastName != null) { vcmn_currentUserLastName = vcmn_vistausersData.Data[i].LastName; }
                    if (vcmn_vistausersData.Data[i].Suffix != null) { vcmn_currentUserSuffix = vcmn_vistausersData.Data[i].Suffix; }
                    if (vcmn_vistausersData.Data[i].DisplayName != null) { vcmn_currentUserDisplayName = vcmn_vistausersData.Data[i].DisplayName; }
                    if (vcmn_vistausersData.Data[i].Title != null) { vcmn_currentUserTitle = vcmn_vistausersData.Data[i].Title; }
                    //Prompt user about this vista user record
                    var vcmn_userPromptString = "Click OK, to select this user.  Otherwise CANCEL \n" +
                        "\n First Name: " + vcmn_currentUserFirstName +
                        "\n Middle Name: " + vcmn_currentUserMiddleName +
                        "\n Last Name: " + vcmn_currentUserLastName +
                        "\n Suffix: " + vcmn_currentUserSuffix +
                        "\n Display Name: " + vcmn_currentUserDisplayName +
                        "\n Title: " + vcmn_currentUserTitle;

                    var vcmn_confirmSelectVistaUser = confirm(vcmn_userPromptString);
                    if (vcmn_confirmSelectVistaUser == true) {
                        vcmn_userIsSelected = true;
                        vcmn_selectedUserFirstName = vcmn_currentUserFirstName;
                        vcmn_selectedUserMiddleName = vcmn_currentUserMiddleName;
                        vcmn_selectedUserLastName = vcmn_currentUserLastName;
                        vcmn_selectedUserSuffix = vcmn_currentUserSuffix;
                        vcmn_selectedUserDisplayName = vcmn_currentUserDisplayName;
                        vcmn_selectedUserTitle = vcmn_currentUserTitle;
                        break;
                    }
                }
            }
            else {
                //Select data from the first record
                vcmn_userIsSelected = true;
                if (vcmn_vistausersData.Data[0].FirstName != null) { vcmn_selectedUserFirstName = vcmn_vistausersData.Data[0].FirstName; }
                if (vcmn_vistausersData.Data[0].MiddleName != null) { vcmn_selectedUserMiddleName = vcmn_vistausersData.Data[0].MiddleName; }
                if (vcmn_vistausersData.Data[0].LastName != null) { vcmn_selectedUserLastName = vcmn_vistausersData.Data[0].LastName; }
                if (vcmn_vistausersData.Data[0].Suffix != null) { vcmn_selectedUserSuffix = vcmn_vistausersData.Data[0].Suffix; }
                if (vcmn_vistausersData.Data[0].DisplayName != null) { vcmn_selectedUserDisplayName = vcmn_vistausersData.Data[0].DisplayName; }
                if (vcmn_vistausersData.Data[0].Title != null) { vcmn_selectedUserTitle = vcmn_vistausersData.Data[0].Title; }
            }

            //Check if a user was selected
            if (vcmn_userIsSelected == false) {
                alert('A user was not selected from the previous prompts, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=DataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            //Execute Integration
            vcmn_executeVistAIntegrationRequest(vcmn_noteId, vcmn_noteDescription, vcmn_patientICN, vcmn_userDomainId, vcmn_localTitle, vcmn_callbackNumber, vcmn_reasonForRequest[0].name, vcmn_encounterCode, vcmn_signThisNote, vcmn_veteranFirstName, vcmn_veteranLastName, vcmn_createdOnDate, vcmn_userEntryDate, vcmn_selectedUserFirstName, vcmn_selectedUserMiddleName, vcmn_selectedUserLastName, vcmn_selectedUserSuffix, vcmn_facilityCode, vcmn_originatorID, vcmn_siteHL7ListenerAddress, vcmn_patientAssignedLocation);

        }
        else {
            //Execute workload encounter note integration steps
            vcmn_prepWorkloadEncounterIntegrationStep01();
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_ribbonButtonSaveToVistA_with_ICN): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_prepWorkloadEncounterIntegrationStep01(cookieData) {
    try {
        //Verify Note Title
        var vcmn_NoteTitleIEN = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').getValue();
        if (vcmn_NoteTitleIEN == null || vcmn_NoteTitleIEN == '') {
            alert('The selected note title field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify Location
        var vcmn_LocationIEN = Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').getValue();
        if (vcmn_LocationIEN == null || vcmn_LocationIEN == '') {
            alert('The selected location field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify Site
        var vcmn_facility = Xrm.Page.getAttribute('ftp_progressnotefacility').getValue();
        if (vcmn_facility == null) {
            alert('The selected site field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify patient id
        if (vcmn_matchLookupId == null || vcmn_matchLookupId == '') {
            alert('The veteran/patient does not have a SSN, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get the current CRM User's assigned site/facility
        var vcmn_userSiteId = "";

        //var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
        //if (vcmn_userData != null) {
        //    if (vcmn_userData.d.ftp_FacilitySiteId != null) {
        //        vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}

        //Lookup the Facility/Site #
        var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_facility[0].id);
        if (vcmn_facilityData != null) {
            if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_ViaLoginFacility = vcmn_facilityData.d.ftp_FacilityCode_text; }
        }

        //Check if VIA Login cookie exist (not expired)
        var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

        //TODO: how to know which site??
        var vcmn_ViaLoginData = null;

        if (vcmn_ViaLoginCookie != "")
            vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);


        if (vcmn_ViaLoginCookie != null && vcmn_ViaLoginCookie != '') {
            debugger
            for (var i = 0; i < vcmn_ViaLoginData.length; i++) {
                if (vcmn_ViaLoginData[i].siteCode == vcmn_facilityData.d.ftp_FacilityCode_text) {
                    vcmn_ViaLoginToken = vcmn_ViaLoginData[i].duz;
                    vcmn_ViaLoginName = vcmn_ViaLoginData[i].providerName;
                    vcmn_esignatureCode = vcmn_ViaLoginData[i].eSig;
                    vcmn_ViaLoginFacility = vcmn_ViaLoginData[i].siteCode;
                }
            }
        }
        else {
            alert("Your VISTA session has expired. In order to process a workload encounter note, you must be logged into VISTA!");
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=VIALoginExpired", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return;
        }

        //Lookup Patient Id using VIA 'match' service

        //vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility

        //if (cookieData[0] == null) {
        //    vcmn_ViaLoginName = cookieData.providerName;
        //    vcmn_ViaLoginToken = cookieData.duz;
        //    vcmn_ViaLoginFacility = cookieData.siteCode;
        //} else {
        //    vcmn_ViaLoginName = cookieData[0].providerName;
        //    vcmn_ViaLoginToken = cookieData[0].duz;
        //    vcmn_ViaLoginFacility = cookieData[0].siteCode;
        //}

        //if (vcmn_ViaLoginFacility == null){
        setUserSite();
        //}

        vialib_match(vcmn_requestingApp, vcmn_consumingAppToken, vcmn_consumingAppPassword, vcmn_baseServiceEndpointUrl, vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility, vcmn_matchLookupId, vcmn_prepWorkloadEncounterIntegrationStep01_response);
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_prepWorkloadEncounterIntegrationStep01): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_prepWorkloadEncounterIntegrationStep01_response(vcmn_error, vcmn_matchresponse) {
    debugger;
    try {
        //Check for non VIA service error
        if (vcmn_error != null) {
            alert("Unable to match the CRM Veteran/Patient with a record in VistA/CPRS. The process failed with error: " + vcmn_matchresponse + ", the note cannot be created in VistA/CPRS!");
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {

            //Test for VIA Service Error
            if (vcmn_matchresponse.taggedPatientArray.fault != null) {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. Service Error: " + vcmn_matchresponse.taggedPatientArray.fault.message + ", the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            if (vcmn_matchresponse.taggedPatientArray.patients == null) {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. No data returned, the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            //Get VIA service Response
            if (vcmn_matchresponse.taggedPatientArray.patients.length > 0) {
                //var vcmn_matchArray = vcmn_matchresponse.getElementsByTagName("patients")[0].childNodes;
                //childNodes[4] holds the localPid/IEN value
                vcmn_ViaPatientId = vcmn_matchresponse.taggedPatientArray.patients[0].localPid; // vcmn_matchArray[0].childNodes[4].textContent;
            }
            else {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. No data returned, the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

        }

        //Verify Inpatient
        if (Xrm.Page.getAttribute('ftp_workloadinpatient').getValue() == true) {
            vcmn_ViaInPatient = "1";
        }
        else {
            vcmn_ViaInPatient = "0";
        }

        //Verify CPT Code & Description
        var vcmn_CrmCptCode = Xrm.Page.getAttribute('ftp_cptcode').getValue();
        if (vcmn_CrmCptCode == null) {
            alert('The CPT Code field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            var vcmn_cptData = vcmn_getSingleEntityDataSync('ftp_cptcodeSet', 'ftp_amadescription', vcmn_CrmCptCode[0].id);
            if (vcmn_cptData.d.ftp_amadescription != null) {
                vcmn_ViaCptDescription = (vcmn_cptData.d.ftp_amadescription).replace(";", "\;");
                vcmn_ViaCptCode = vcmn_CrmCptCode[0].name;
            }
            else {
                alert('The CPT Code is missing the AMA Description, the note cannot be created in VistA/CPRS!');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }

        //Combine CPT Code and Description
        var vcmn_CptCombined = '';
        if (vcmn_ViaCptCode.length > 0 && vcmn_ViaCptDescription.length > 0) {
            vcmn_CptCombined = vcmn_ViaCptCode + "^" + vcmn_ViaCptDescription;
        }

        //Verify Diagnosis Code & Description
        var vcmn_CrmDiagnosisCode = Xrm.Page.getAttribute('ftp_diagnosiscode').getValue();
        //if (vcmn_CrmDiagnosisCode == null) {
        //    alert('The Primary Diagnosis Code field is empty, the note cannot be created in VistA/CPRS!');
        //    VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        //    vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
        //    return false;
        //}

        if (vcmn_CrmDiagnosisCode != null && vcmn_CrmDiagnosisCode != '') {
            var vcmn_diagnosisData = vcmn_getSingleEntityDataSync('ftp_diagnosiscodeSet', 'ftp_description', vcmn_CrmDiagnosisCode[0].id);
            if (vcmn_diagnosisData.d.ftp_description != null) {
                vcmn_ViaDiagnosisDescription = (vcmn_diagnosisData.d.ftp_description).replace(";", "\;");
                vcmn_ViaDiagnosisCode = vcmn_CrmDiagnosisCode[0].name;
            }
        }

        //Combine Diagnosis Code and Description and mark as PRIMARY (^1)
        var vcmn_DiagnosisCombined = '';
        if (vcmn_ViaDiagnosisCode != null && vcmn_ViaDiagnosisDescription != null) {
            if (vcmn_ViaDiagnosisCode.length > 0 && vcmn_ViaDiagnosisDescription.length > 0) {
                vcmn_DiagnosisCombined = vcmn_ViaDiagnosisCode + "^" + vcmn_ViaDiagnosisDescription + "^1";
            }
        }

        //Get Secondary Diagnosis Codes
        var vcmn_CrmSecondaryDiagnosis = Xrm.Page.getAttribute('ftp_selectedsecondarydiagnosiscodes').getValue();
        if (vcmn_CrmSecondaryDiagnosis != null && vcmn_CrmSecondaryDiagnosis != '') {
            if (vcmn_DiagnosisCombined != '') {
                vcmn_DiagnosisCombined = vcmn_DiagnosisCombined + ";" + vcmn_CrmSecondaryDiagnosis;
            }
            else { vcmn_DiagnosisCombined = vcmn_CrmSecondaryDiagnosis; }
        }

        //Get User Entry Date
        var vcmn_createdOnDate = vialib_convertToStringDateTime(Xrm.Page.getAttribute('createdon').getValue());
        var vcmn_userEntryDate = null;
        if (Xrm.Page.getAttribute('ftp_userentrydate').getValue() != null) {
            vcmn_userEntryDate = vialib_convertToStringDateTime(Xrm.Page.getAttribute('ftp_userentrydate').getValue());
        }

        //Per Defect 714678, do not use created date for workload encounter with time, pass blank instead
        if (vcmn_userEntryDate == null) {
            //vcmn_userEntryDate = vcmn_createdOnDate;  //Old code prior to Defect 714678
            //*vcmn_userEntryDate = vcmn_createdOnDate.substring(0, 9) + "000001";
            vcmn_userEntryDate = "";
        }

        //Reformat Note Description as needed to handle long lines of text (WordWrap)
        var vcmn_noteDescription = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        var vcmn_NoteText = vcmn_noteDescription;
        var vcmn_RevisedNoteText = "";
        //Do Breakdown of lines
        var vcmn_TextLines = vcmn_NoteText.split('\n');
        if (vcmn_TextLines.length > 0) {
            //Reformat text
            for (var i = 0; i < vcmn_TextLines.length; i++) {
                //Test for a long line
                if (vcmn_TextLines[i].length > vcmn_WordWrapLimit) {
                    //Break down line
                    var vcmn_NewString = vcmn_wordWrap(vcmn_TextLines[i], vcmn_WordWrapLimit, '\n');
                    //Add revised text back
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_NewString + "\n";  //Add back the CR/LF used to split on
                }
                else {
                    //Add text to new note
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_TextLines[i] + "\n"; //Add back the CR/LF used to split on
                }
            }
        }
        if (vcmn_RevisedNoteText != "" && vcmn_RevisedNoteText != null) {
            vcmn_noteDescription = vcmn_RevisedNoteText;
        }

        //Add list of additional signer names to Note Text if they exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vcmn_SignerNames = "\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vcmn_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vcmn_singleSignerName = vcmn_AddlSignersNameArray[i].split("___");
                    vcmn_SignerNames = vcmn_SignerNames + vcmn_singleSignerName[1] + "\n";
                }
            }
            //Add to Note Description
            vcmn_noteDescription = vcmn_noteDescription + vcmn_SignerNames;
        }
        var vcmn_NoteTitleIEN = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').getValue();
        var vcmn_LocationIEN = Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').getValue();

        //Create text strings from additional signers array
        var vcmn_SignerIEN = "";

        //Construct the Visit Related list based on the Special Treatment Control  ('100000001' = Yes, '100000000' = No)
        var vcmn_visitRelatedList = "";
        if (Xrm.Page.getAttribute('ftp_serviceconnectedcondition').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "SC^1,";
        }
        if (Xrm.Page.getAttribute('ftp_serviceconnectedcondition').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "SC^0,";
        }
        if (Xrm.Page.getAttribute('ftp_combatveteran').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "CV^1,";
        }
        if (Xrm.Page.getAttribute('ftp_combatveteran').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "CV^0,";
        }
        if (Xrm.Page.getAttribute('ftp_agentorangeexposure').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "AO^1,";
        }
        if (Xrm.Page.getAttribute('ftp_agentorangeexposure').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "AO^0,";
        }
        if (Xrm.Page.getAttribute('ftp_ionizingradiationexposure').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "IR^1,";
        }
        if (Xrm.Page.getAttribute('ftp_ionizingradiationexposure').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "IR^0,";
        }
        if (Xrm.Page.getAttribute('ftp_southwestasiaconditions').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "EC^1,";
        }
        if (Xrm.Page.getAttribute('ftp_southwestasiaconditions').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "EC^0,";
        }
        if (Xrm.Page.getAttribute('ftp_shipboardhazardanddefense').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "SHD^1,";
        }
        if (Xrm.Page.getAttribute('ftp_shipboardhazardanddefense').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "SHD^0,";
        }
        if (Xrm.Page.getAttribute('ftp_militarysexualtrauma').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "MST^1,";
        }
        if (Xrm.Page.getAttribute('ftp_militarysexualtrauma').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "MST^0,";
        }
        if (Xrm.Page.getAttribute('ftp_headandorneckcancer').getValue() == '100000001') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "HNC^1,";
        }
        if (Xrm.Page.getAttribute('ftp_headandorneckcancer').getValue() == '100000000') {
            vcmn_visitRelatedList = vcmn_visitRelatedList + "HNC^0,";
        }


        //If there is no checked special treatment items, then default to SC
        if (vcmn_visitRelatedList == "") {
            //vcmn_visitRelatedList = "SC";  //deprecated when passing T instead of E as Service Category
        } else {
            //Remove the last comma in the string
            vcmn_visitRelatedList = vcmn_visitRelatedList.slice(0, -1);
        }

        //if (vcmn_ViaLoginFacility == null){
        setUserSite();
        //}

        //****Remove Node Identifier from Note Title Id if it exists
        if (vcmn_NoteTitleIEN != null && vcmn_NoteTitleIEN != "") {
            var vcmn_splitNoteTitleIdArray = vcmn_NoteTitleIEN.split("__");
            vcmn_NoteTitleIEN = vcmn_splitNoteTitleIdArray[0];
        }
        //**********************************************************

        //Execute VIA saveNoteAndEncounter Service
        vialib_saveNoteAndEncounter(vcmn_requestingApp, vcmn_consumingAppToken, vcmn_consumingAppPassword, vcmn_baseServiceEndpointUrl, vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility, vcmn_NoteTitleIEN, vcmn_LocationIEN, vcmn_ViaPatientId, vcmn_noteDescription, vcmn_userEntryDate, vcmn_ViaLoginFacility, vcmn_ViaInPatient, vcmn_CptCombined, vcmn_DiagnosisCombined, vcmn_esignatureCode, vcmn_SignerIEN, 'T', vcmn_visitRelatedList, vcmn_saveNoteAndEncounter_response)
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_prepWorkloadEncounterIntegrationStep01_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_saveNoteAndEncounter_response(vcmn_errorThrown, vcmn_requestResponse, vcmn_noteText) {
    //Process Note and Encounter Response
    debugger;
    try {
        if (vcmn_errorThrown != null) {
            //Write Error
            Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
            Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vcmn_errorThrown));
            Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
            alert('The workload encounter note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.getControl('ftp_integrationerror').setFocus();
            Xrm.Page.data.entity.save();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vcmn_requestResponse.text.fault != null) {
                //Write Failure entry
                Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationerror').setValue("Service Error: " + vcmn_requestResponse.text.fault.message);
                Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                alert('The workload encounter note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                Xrm.Page.getControl('ftp_integrationerror').setFocus();
                Xrm.Page.data.entity.save();
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else {
                //Test for data
                if (vcmn_requestResponse.text != null) {
                    //Sucessfull creation of workload encounter note
                    //*Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteText);
                    //*Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('OK');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');

                    //Get integration result text
                    var vcmn_workloadResultText = vcmn_requestResponse.text.text;
                    var vcmn_workloadNoteId = vcmn_workloadResultText.replace("Success. Note IEN = ", "");
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setValue(vcmn_workloadNoteId);
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                    //****UPDATE e-Sign attributes
                    //Xrm.Page.getAttribute('ftp_issigned').setValue(true);
                    //Xrm.Page.getAttribute('ftp_issigned').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_signeddate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_signeddate').setSubmitMode('always');
                    //****************************

                    //Complete workload encounter
                    vcmn_completeViaWorkloadNote();
                }
                else {
                    //Write No Data Failure
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue("Service Error: NO DATA RETURNED FROM VIA/VISTA REGARDING WORKLOAD WITH ENCOUNTER NOTE CREATION!");
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                    alert('The workload encounter note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                    VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=WorkloadEncounterError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                    Xrm.Page.getControl('ftp_integrationerror').setFocus();
                    Xrm.Page.data.entity.save();
                    vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                    return false;
                }
            }
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_saveNoteAndEncounter_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_getVistaUsersData(vcmn_userFirstName, vcmn_userLastName, vcmn_userSiteNo, vcmn_noFilter) {
    try {
        var vcmn_jsonData = null;
        $.ajax({
            type: "GET",
            url: vcmn_VistaUsersURLbase + vcmn_userFirstName + "/" + vcmn_userLastName + "/" + vcmn_userSiteNo + "?noFilter=" + vcmn_noFilter,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                vcmn_jsonData = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vcmn_jsonData = null;
            },
            async: false,
            cache: false
        });
        return vcmn_jsonData;
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_getVistaUsersData): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        return null;
    }
}

function vcmn_executeVistAIntegrationRequest(vcmn_noteId, vcmn_noteDescription, vcmn_patientICN, vcmn_userDomainId, vcmn_localTitle, vcmn_callbackNumber, vcmn_reasonForRequest, vcmn_encounterCode, vcmn_signThisNote, vcmn_patientFirstName, vcmn_patientLastName, vcmn_activityDate, vcmn_patientAdmitDate, vcmn_originatorFirstName, vcmn_originatorMiddleName, vcmn_originatorLastName, vcmn_originatorSuffix, vcmn_facilitySiteId, vcmn_originatorID, vcmn_siteHL7ListenerAddress, vcmn_patientAssignedLocation) {
    try {
        //Reformat Note Description as needed to handle long lines of text (WordWrap)
        var vcmn_NoteText = vcmn_noteDescription;
        var vcmn_RevisedNoteText = "";
        //Do Breakdown of lines
        var vcmn_TextLines = vcmn_NoteText.split('\n');
        if (vcmn_TextLines.length > 0) {
            //Reformat text
            for (var i = 0; i < vcmn_TextLines.length; i++) {
                //Test for a long line
                if (vcmn_TextLines[i].length > vcmn_WordWrapLimit) {
                    //Break down line
                    var vcmn_NewString = vcmn_wordWrap(vcmn_TextLines[i], vcmn_WordWrapLimit, '\n');
                    //Add revised text back
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_NewString + "\n";  //Add back the CR/LF used to split on
                }
                else {
                    //Add text to new note
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_TextLines[i] + "\n"; //Add back the CR/LF used to split on
                }
            }
        }
        if (vcmn_RevisedNoteText != "" && vcmn_RevisedNoteText != null) {
            vcmn_noteDescription = vcmn_RevisedNoteText;
        }

        //Add list of additional signer names to Note Text if they exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vcmn_SignerNames = "\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vcmn_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vcmn_singleSignerName = vcmn_AddlSignersNameArray[i].split("___");
                    vcmn_SignerNames = vcmn_SignerNames + vcmn_singleSignerName[1] + "\n";
                }
            }
            //Add to Note Description
            vcmn_noteDescription = vcmn_noteDescription + vcmn_SignerNames;
        }

        var vcmn_visitNumber = 'NEW';
        var vcmn_clientName = "FTPCRM";
        var vcmn_Format = "JSON";
        var vcmn_patientIdentifierType = "ICN";
        var vcmn_documentAvailabilityStatus = "AV";  //Historical Note only at this time
        var vcmn_originatorCombinedMiddle = "";
        if (vcmn_originatorMiddleName != '' && vcmn_originatorMiddleName != null) { vcmn_originatorCombinedMiddle = vcmn_originatorMiddleName; }
        if (vcmn_originatorSuffix != '' && vcmn_originatorSuffix != null) {
            if (vcmn_originatorCombinedMiddle != '') {
                vcmn_originatorCombinedMiddle = vcmn_originatorCombinedMiddle + " " + vcmn_originatorSuffix;
            }
            else {
                vcmn_originatorCombinedMiddle = vcmn_originatorSuffix;
            }
        }

        var vcmn_requestJSON = {
            "ClientName": vcmn_clientName,
            "Format": vcmn_Format,
            "FacilitySiteID": vcmn_facilitySiteId,
            "SiteHL7ListenerAddress": vcmn_siteHL7ListenerAddress,
            "VisitNumber": vcmn_visitNumber,
            "IsSignedNote": vcmn_signThisNote,
            "PatientAdmitDate": vcmn_patientAdmitDate,
            "PatientLastName": vcmn_patientLastName,
            "PatientFirstName": vcmn_patientFirstName,
            "PatientIdentifier": vcmn_patientICN,
            "PatientIdentifierType": vcmn_patientIdentifierType,
            "PatientAssignedLocation": vcmn_patientAssignedLocation,
            "NoteText": vcmn_noteDescription,
            "OriginatorID": vcmn_originatorID,
            "OriginatorFirstName": vcmn_originatorFirstName,
            "OriginatorMiddleName": vcmn_originatorCombinedMiddle,
            "OriginatorLastName": vcmn_originatorLastName,
            "DocumentFileName": vcmn_localTitle,
            "DocumentAvailabilityStatus": vcmn_documentAvailabilityStatus,
            "ActivityDate": vcmn_activityDate
        };

        var vcmn_requestResponse = "";

        $.ajax({
            type: "POST",
            url: vcmn_NoteWriteUrl,
            data: JSON.stringify(vcmn_requestJSON),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var vcmn_newdata = data;
                vcmn_requestResponse = vcmn_newdata;
                vcmn_vistAIntegrationRequest_response(null, vcmn_requestResponse, vcmn_noteDescription);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vcmn_vistAIntegrationRequest_response(errorThrown, null, vcmn_noteDescription);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_executeVistAIntegrationRequest): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_vistAIntegrationRequest_response(vcmn_errorThrown, vcmn_requestResponse, vcmn_noteDescription) {
    try {
        //Process Integration Request Response
        if (vcmn_errorThrown != null) {
            //Write Error
            Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
            Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vcmn_errorThrown));
            Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
            alert('The note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=IntegrationError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.getControl('ftp_integrationerror').setFocus();
            Xrm.Page.data.entity.save();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vcmn_requestResponse.ErrorOccurred == false) {
                //Call Additional Signers & Finalize Note function
                vcmn_finalizeNoteCreation(vcmn_requestResponse.Status, vcmn_requestResponse.Data, vcmn_noteDescription)
            }
            else {
                //Write Failure entry
                Xrm.Page.getAttribute('ftp_integrationstatus').setValue(vcmn_requestResponse.Status);
                Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationerror').setValue(vcmn_requestResponse.ErrorMessage + "  DebugInfo:" + vcmn_requestResponse.DebugInfo);
                Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                alert('The note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=IntegrationError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                Xrm.Page.getControl('ftp_integrationerror').setFocus();
                Xrm.Page.data.entity.save();
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_vistAIntegrationRequest_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_finalizeNoteCreation(vcmn_integrationStatus, vcmn_integrationNoteId, vcmn_noteDescription) {
    //The Note was sucessfully created in Vista/CPRS, add additional signers if needed
    try {
        //Determine if additional signers exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Get the current CRM User's assigned site/facility
            var vcmn_userSiteId = "";
            var vcmn_UserSiteNo = "";
            var vcmn_duz = "";
            var vcmn_providername = "";

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            if (vcmn_userData != null) {
                if (vcmn_userData.d.ftp_FacilitySiteId != null) {
                    vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id;
                }
            }

            //Lookup the Facility/Site #
            if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
                var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
                if (vcmn_facilityData != null) {
                    if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_UserSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
                }
            }

            var siteData = setUserSite();

            //Check if VIA Login cookie exist (not expired)
            var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

            //TODO: how to know which site??
            var vcmn_ViaLoginData = null;

            if (vcmn_ViaLoginCookie != "")
                vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);

            if (vcmn_ViaLoginCookie != null && vcmn_ViaLoginCookie != '') {
                if (vcmn_ViaLoginData.length > 1) {
                    if (siteData != null) {
                        for (var j = 0; j < vcmn_ViaLoginData.length; j++) {
                            if (vcmn_ViaLoginData[j].siteCode == siteData.SiteNo) {
                                vcmn_duz = vcmn_ViaLoginData[j].duz;
                                vcmn_providername = vcmn_ViaLoginData[j].providerName;
                                vcmn_esignatureCode = vcmn_ViaLoginData[j].eSig;
                                break;
                            }
                        }
                    } else {
                        vcmn_duz = vcmn_ViaLoginData[0].duz;
                        vcmn_providername = vcmn_ViaLoginData[0].providerName;
                        vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                    }
                } else if (vcmn_ViaLoginData.length == 1) {
                    vcmn_duz = vcmn_ViaLoginData[0].duz;
                    vcmn_providername = vcmn_ViaLoginData[0].providerName;
                    vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                }
            }

            //Create text strings from additional signers array
            var vcmn_SignerIEN = "";
            for (var i = 0; i <= vcmn_AddlSignersIenArray.length - 1; i++) {
                if (i == 1) { vcmn_SignerIEN = vcmn_AddlSignersIenArray[i]; }
                if (i > 1) { vcmn_SignerIEN = vcmn_SignerIEN + " " + vcmn_AddlSignersIenArray[i]; }
            }

            //Create the Additional Signers
            var vcmn_viaSigners = new Object();
            vcmn_viaSigners.ProviderName = vcmn_providername;
            vcmn_viaSigners.Duz = vcmn_duz;
            vcmn_viaSigners.LoginSiteCode = vcmn_UserSiteNo;
            vcmn_viaSigners.Target = vcmn_integrationNoteId;
            vcmn_viaSigners.SupplementalParameters = vcmn_SignerIEN;

            var postData = { "Request": JSON.stringify(vcmn_viaSigners) };

            vcmn_callAction("vccm_VIAAddSigner", postData,
                function (data) {
                    vcmn_viaSignersResponse = JSON.parse(data.Response);
                    //Test for Failure
                    if (vcmn_viaSignersResponse.ErrorOccurred == true) {
                        alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                    }
                },
                function (error) {
                    alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                    VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                }
            );

            // $.ajax({
            // type: "POST",
            // url: vcmn_AddSignersUrl,
            // data: JSON.stringify(vcmn_viaSigners),
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            // success: function (data) {
            // vcmn_viaSignersResponse = JSON.stringify(data.Data);
            // //Test for Failure
            // if (vcmn_viaSignersResponse.ErrorOccurred == true) {
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            // }
            // },
            // error: function (jqXHR, textStatus, errorThrown) {
            // //System Error
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            // },
            // async: false,
            // cache: false
            // });

            if (vcmn_localStorageVarName != "" && vcmn_localStorageVarName != null) {
                //Clear existing session storage variable.
                localStorage.removeItem(vcmn_localStorageVarName);
            }
        }

        //Perform standard form updates to signify completion
        //Write Success entry
        Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteDescription);
        Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationstatus').setValue(vcmn_integrationStatus);
        Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
        Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
        Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
        Xrm.Page.getAttribute('ftp_integrationnoteid').setValue(vcmn_integrationNoteId);
        Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
        Xrm.Page.getControl('ftp_integrationstatus').setFocus();
        if (vcmn_automaticViaIntegration == false) {
            alert('The note creation in VistA/CPRS was successful, this note will now be marked as completed. \n\nPlease exit this note record after clicking OK to this prompt!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            Xrm.Page.data.entity.save();
        }
        else {
            alert('The note creation in VistA/CPRS was successful, this note will now be marked as completed.');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=IntegrationSuccess", "level=Info", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            //USD action calls beneath the ProgressNoteIntegrationEvent will save and close the still-hidden Progress Note tab
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_finalizeNoteCreation): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
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
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }
	/*
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
        alert('Progress Note Ribbon Function Error(vcmn_getCookie): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
	*/
}

function vcmn_initViaDropdownControls() {
    //Initialize VIA DropDown Controls
    //Function is triggered by The VistA Login Control and onchange of Facility attribute
    try {
        Xrm.Page.getControl("WebResource_ViaWorkloadLookup").setSrc(Xrm.Page.getControl("WebResource_ViaWorkloadLookup").getSrc());
        Xrm.Page.getControl("WebResource_ProgressNoteSignerSearch").setSrc(Xrm.Page.getControl("WebResource_ProgressNoteSignerSearch").getSrc());
    }
    catch (err) {
        alert('Progress Note VIA Login Function Error(vcmn_initViaDropdownControls): ' + err.message);
    }
}

function vcmn_facilityGroupDefault_response(vcmn_facilityGroupData, vcmn_lastSkip, vcmn_facilitySiteId) {
    //debugger;
    try {
        //vcmn_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        for (var i = 0; i <= vcmn_facilityGroupData.d.results.length - 1; i++) {
            //Get Values and Write to Progress Note if a new Note
            if (Xrm.Page.ui.getFormType() == 1) {
                if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault != null) {
                    //Verify that the text contains the double tilde ~~
                    if (vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault.indexOf("~~") >= 0) {
                        //Split on ~~
                        var vcmn_encounterLocationArray = vcmn_facilityGroupData.d.results[i].ftp_viaworkloadencounterlocationdefault.split("~~", 2);
                        if (vcmn_encounterLocationArray.length > 1) {
                            if (vcmn_encounterLocationArray[0] != null && vcmn_encounterLocationArray[0] != '' && vcmn_encounterLocationArray[1] != null && vcmn_encounterLocationArray[1] != '') {
                                Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(vcmn_encounterLocationArray[0]);
                                Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
                                Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(vcmn_encounterLocationArray[1]);
                                Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
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
                                Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(vcmn_encounterNoteTitleArray[0]);
                                Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
                                Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(vcmn_encounterNoteTitleArray[1]);
                                Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
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
        alert('Progress Note Form Load Script Function Error(vcmn_facilityGroupDefault_response): ' + err.message);
    }
}

function vcmn_buildQueryFilter(field, value, and) {
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
        alert('Progress Note Ribbon Function Error(vcmn_buildQueryFilter): ' + err.message);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_unattendedMviSearch(firstname, lastname, dobdate, ssn) {
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
            filter = vcmn_buildQueryFilter("crme_EDIPI", edipi, false);
            filter += vcmn_buildQueryFilter("crme_ClassCode", 'MIL', true);
            filter += vcmn_buildQueryFilter("crme_SearchType", 'SearchByIdentifier', true);

            //set search type as unattended
            filter += " and crme_IsAttended eq false";
        }
        else {
            //otherwise search using lastname, firstname, ssn, dob
            filter = vcmn_buildQueryFilter("crme_LastName", lastname, false); //assuming lastname will never be blank

            if (firstname != "" && firstname != null) {
                filter += vcmn_buildQueryFilter("crme_FirstName", firstname, true);
            }

            if (ssn != "" && ssn != null) {
                filter += vcmn_buildQueryFilter("crme_SSN", ssn, true);
            }

            if (dobstring != "") {
                filter += " and crme_DOBString eq '" + dobstring + "'";
            }
            filter += vcmn_buildQueryFilter("crme_SearchType", 'SearchByFilter', true);

            //set search type as attended (for now)
            filter += " and crme_IsAttended eq true";
        }

        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        SDK.REST.retrieveMultipleRecords(
            "crme_person",
            filter,
            vcmn_unattendedMviSearchCallback,
            function (error) {
                alert(error.message);
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_ribbonButtonSaveToVistA_with_ICN("");
            },
            vcmn_unattendedMviSearchComplete
        );
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_unattendedMviSearch): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_unattendedMviSearchCallback(returnData) {
    try {
        if (returnData != null && returnData.length >= 1) {
            // check for exceptions 1st
            if (returnData[0].crme_ExceptionOccured || (returnData[0].crme_ReturnMessage != null && returnData[0].crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
                //do nothing, pass empty ICN
                vcmn_ribbonButtonSaveToVistA_with_ICN("");
            }
            else {
                var patientMviIdentifier = returnData[0].crme_PatientMviIdentifier == null ? "" : returnData[0].crme_PatientMviIdentifier;
                if (patientMviIdentifier != "") {
                    var idparts = patientMviIdentifier.split("^");

                    if (idparts.length > 0) {
                        var nationalId = idparts[0];
                        _icn = nationalId;
                        //Pass on the ICN and continue validation
                        vcmn_ribbonButtonSaveToVistA_with_ICN(_icn);
                    }
                }
            }
        }
        else {
            //Return empty ICN
            vcmn_ribbonButtonSaveToVistA_with_ICN("");
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_unattendedMviSearchCallback): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_unattendedMviSearchComplete() {
    //do nothing
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
        alert('Progress Note Form Load Script Function Error(vcmn_buildQueryFilterSCD): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
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
            filter = vcmn_buildQueryFilterSCD("crme_EDIPI", edipi, false);
            filter += vcmn_buildQueryFilterSCD("crme_ClassCode", 'MIL', true);
            filter += vcmn_buildQueryFilterSCD("crme_SearchType", 'SearchByIdentifier', true);

            //set search type as unattended
            filter += " and crme_IsAttended eq false";
        }
        else {
            //otherwise search using lastname, firstname, ssn, dob
            filter = vcmn_buildQueryFilterSCD("crme_LastName", lastname, false); //assuming lastname will never be blank

            if (firstname != "" && firstname != null) {
                filter += vcmn_buildQueryFilterSCD("crme_FirstName", firstname, true);
            }

            if (ssn != "" && ssn != null) {
                filter += vcmn_buildQueryFilterSCD("crme_SSN", ssn, true);
            }

            if (dobstring != "") {
                filter += " and crme_DOBString eq '" + dobstring + "'";
            }
            filter += vcmn_buildQueryFilterSCD("crme_SearchType", 'SearchByFilter', true);

            //set search type as attended (for now)
            filter += " and crme_IsAttended eq true";
        }

        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        SDK.REST.retrieveMultipleRecords(
            "crme_person",
            filter,
            vcmn_unattendedMviSearchCallbackSCD,
            function (error) {
                alert(error.message);
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_getServiceConnectedDisabilities("");
            },
            vcmn_unattendedMviSearchComplete
        );
    }
    catch (err) {
        alert('Progress Note Form Load Script Function Error(vcmn_unattendedMviSearchSCD): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
}

function vcmn_unattendedMviSearchCallbackSCD(returnData) {
    try {
        if (returnData != null && returnData.length >= 1) {
            // check for exceptions 1st
            if (returnData[0].crme_ExceptionOccured || (returnData[0].crme_ReturnMessage != null && returnData[0].crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
                //do nothing, pass empty ICN
                vcmn_getServiceConnectedDisabilities("");
            }
            else {
                var patientMviIdentifier = returnData[0].crme_PatientMviIdentifier == null ? "" : returnData[0].crme_PatientMviIdentifier;
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
        alert('Progress Note Form Load Script Function Error(vcmn_unattendedMviSearchCallbackSCD): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
}

//Standalone form load functions
function vcmn_secureProgressNote() {
    try {
        //Disable all form attributes if form is opened by a user who does not own the progress note
        //Only handle forms in create state
        if (Xrm.Page.ui.getFormType() != 2) { return false; } //2 = CRM Update Status
        //Get the current owner of the record and compare to the current user
        var vcmn_recordOwnerId = Xrm.Page.getAttribute('ownerid').getValue();
        //Verify that the current owner and the current user is the same person, if not lock down the form
        if ((vcmn_recordOwnerId[0].id).toUpperCase() != (Xrm.Page.context.getUserId()).toUpperCase()) {
            Xrm.Page.data.entity.attributes.forEach(function (attribute, index) {
                var control = Xrm.Page.getControl(attribute.getName());
                if (control) {
                    control.setDisabled(true)
                }
            });
        }
    }
    catch (err) {
        alert('Progress Note Form Load Function Error(vcmn_secureProgressNote): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
}

function vcmn_initFinancialDisclaimer() {
    //This function is used to initialze the Financial Disclaimer tab on the progress note form
    try {
        var vcmn_isReadDisclaimer = Xrm.Page.getAttribute("ftp_isreaddisclaimer").getValue();
        var vcmn_responseToDisclaimer = Xrm.Page.getAttribute("ftp_isdisclaimerread").getValue();
        Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setSubmitMode("always");
        if (vcmn_isReadDisclaimer == true && vcmn_responseToDisclaimer == true) {
            Xrm.Page.ui.tabs.get("Tab_FinancialDisclaimer").setVisible(true);
            Xrm.Page.getAttribute("ftp_ispatientagree").setRequiredLevel("required");
            var vcmn_isPatientAgree = Xrm.Page.getAttribute("ftp_ispatientagree").getValue();
            if (vcmn_isPatientAgree == false) {
                Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("required");
                Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(true);
            }
            else { Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(false); }
        }
    }
    catch (err) {
        alert('Progress Note Financial Disclaimer Function Error(vcmn_initFinancialDisclaimer): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
    }
}

//Standalone form attribute on change event functions
function vcmn_needToReadDisclaimer_OnChange() {
    //This function is used to display the Financial Disclaimer prompt
    try {
        var vcmn_isReadDisclaimer = Xrm.Page.getAttribute("ftp_isreaddisclaimer").getValue();
        if (vcmn_isReadDisclaimer == true) {
            //Financial Disclaimer is needed
            var vcmn_responseToDisclaimer = confirm("FINANCIAL DISCLAIMER\n\n'This is not an authorization for VA Payment'\nand also\n'To have hospital contact the nearest VA\nFacility for transfer upon stabilization.'\n\nSelect OK if you read the disclaimer to the patient / veteran and Cancel if you did not read it.");
            if (vcmn_responseToDisclaimer == true) {
                Xrm.Page.ui.tabs.get("Tab_FinancialDisclaimer").setVisible(true);
                Xrm.Page.getAttribute("ftp_isdisclaimerread").setValue(true);
                Xrm.Page.getAttribute("ftp_isdisclaimerread").setSubmitMode("always");
                Xrm.Page.getAttribute("ftp_ispatientagree").setRequiredLevel("required");
                //Set Default Value to Not Agreeing and Require Reason for disagreeing
                Xrm.Page.getAttribute("ftp_ispatientagree").setValue(false);
                Xrm.Page.getAttribute("ftp_ispatientagree").setSubmitMode("always");
                Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("required");
                Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(true);
                Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setFocus();
            }
            else {
                Xrm.Page.ui.tabs.get("Tab_FinancialDisclaimer").setVisible(false);
                Xrm.Page.getAttribute("ftp_isdisclaimerread").setValue(false);
                Xrm.Page.getAttribute("ftp_isdisclaimerread").setSubmitMode("always");
                Xrm.Page.getAttribute("ftp_ispatientagree").setRequiredLevel("none");
                Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("none");
                Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(false);
            }
        }
        else {
            //No Financial Disclaimer needed  (Hide Financial Disclaimer section)
            Xrm.Page.ui.tabs.get("Tab_FinancialDisclaimer").setVisible(false);
            Xrm.Page.getAttribute("ftp_ispatientagree").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("none");
            Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(false);
        }
    }
    catch (err) {
        alert('Progress Note Financial Disclaimer Function Error(vcmn_needToReadDisclaimer_OnChange): ' + err.message);
    }
}

function vcmn_isPatientInAgreement_OnChange() {
    try {
        var vcmn_isPatientAgree = Xrm.Page.getAttribute("ftp_ispatientagree").getValue();
        if (vcmn_isPatientAgree == false) {
            Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("required");
            Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(true);
        }
        else {
            Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").setValue(null);
            Xrm.Page.getControl("ftp_patientcallersreasonfordisagreeing").setVisible(false);
            //Update Note
            vcmn_appendNoteFinancialDisclaimer_OnChange();
        }
    }
    catch (err) {
        alert('Progress Note Financial Disclaimer Function Error(vcmn_isPatientInAgreement_OnChange): ' + err.message);
    }
}

function vcmn_appendNoteFinancialDisclaimer_OnChange() {
    //This function adds Financial Disclaimer text to the end of the Note
    try {
        //Get Current Note Text
        var vcmn_currentNoteText = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        if (vcmn_currentNoteText == null) { vcmn_currentNoteText = ""; }
        //Create new Financial Disclaimer Text
        var vcmn_financialDisclaimerText = "";

        var vcmn_standardText = "\n\nFINANCIAL DISCLAIMER\n" +
            "----------------------------------------------------------------------\n" +
            "The following disclaimer was read to the caller:\n" +
            "Patient was instructed, 'This is not an authorization for VA\n" +
            "Payment and also 'To have hospital contact the nearest VA\n" +
            "Facility for transfer upon stabilization.\n";
        var vcmn_terminationText = "\n----------------------------------------------------------------------\n";

        var vcmn_isReadDisclaimer = Xrm.Page.getAttribute("ftp_isreaddisclaimer").getValue();
        var vcmn_responseToDisclaimer = Xrm.Page.getAttribute("ftp_isdisclaimerread").getValue();
        if (vcmn_isReadDisclaimer == true && vcmn_responseToDisclaimer == true) {
            var vcmn_isPatientAgree = Xrm.Page.getAttribute("ftp_ispatientagree").getValue();
            if (vcmn_isPatientAgree == true) {
                vcmn_financialDisclaimerText = vcmn_standardText +
                    "\nPatient/Caller agrees with plan." + vcmn_terminationText;
            }
            else {
                var vcmn_reasonForDisagreeing = Xrm.Page.getAttribute("ftp_patientcallersreasonfordisagreeing").getValue();
                if (vcmn_reasonForDisagreeing == null) { vcmn_reasonForDisagreeing = ""; }
                vcmn_financialDisclaimerText = vcmn_standardText +
                    "\nPatient/Caller does not agree with the plan because:\n" +
                    vcmn_reasonForDisagreeing + vcmn_terminationText;
            }
        }

        //Append to existing Note
        Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_currentNoteText + vcmn_financialDisclaimerText);
        Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
    }
    catch (err) {
        alert('Progress Note Financial Disclaimer Function Error(vcmn_appendNoteFinancialDisclaimer_OnChange): ' + err.message);
    }
}

function freq_buttonAction(freq_buttonName) {
    try {
        //Frequently Used button pressed, validate Facility Group Defaults
        if (vcmn_facilityGroupDefaultId == null) {
            alert("Crm Facility Group Default has not been configured. Please define for your Group and Facility to utilize this functionality!");
            return false;
        }
        if (freq_buttonName != null && freq_buttonName != undefined && freq_buttonName != "") {
            //Verify button name and take action accordingly
            if (freq_buttonName == "FreqUsedNoteTitleButton") {
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

            //*****************************
            else if (freq_buttonName == "TestHistoricalNoteButton") {
                //TestHistoricalNoteButton clicked
                vcmn_ribbonButtonSaveToVistA_HistoricalTest();
            }
            //*****************************
            else if (freq_buttonName == "SaveToVistaButton") {
                //	save to vista button clicked

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

function vcmn_ribbonButtonSaveToVistA_HistoricalTest() {
    try {
        //Check the value of the Integration Status Field, if = 'OK', stop and exit this script
        var vcmn_integrationStatus = Xrm.Page.getAttribute('ftp_integrationstatus').getValue();
        if (vcmn_integrationStatus == 'OK') { return false; }

        //**************************************************************************
        //New story 650998 - Always assume user want to sign the note, do not prompt
        //Set Sign this note to Yes
        Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
        Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
        //**************************************************************************

        //Prompt user to sign the note
        var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        var vcmn_signThisNoteFailure = false;
        if (vcmn_signThisNote == null) {
            Xrm.Utility.confirmDialog(
                "Do you need to sign this note?, Select OK if Yes, otherwise CANCEL.",
                function () {
                    //Check if VIA Login cookie exist (not expired)
                    var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
                    //Prompt user to login to VIA
                    if (vcmn_ViaLoginCookie == "") {
                        alert("Your VISTA session has expired. In order to sign this note, you must be logged into VISTA!");
                        Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
                        Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
                        vcmn_signThisNoteFailure = true;
                        return;
                    }
                    Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                },
                function () {
                    Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000000);
                }
            );
            Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
        }

        if (vcmn_signThisNoteFailure == true) { return false; }

        //Check for additional signers, if they exist, the user must be logged into VIA to continue process.
        //Additional Signatures must also be in sync with matching Session variables

        vcmn_AddlSignersNameArray = null;
        vcmn_AddlSignersIenArray = null;

        var vcmn_selectedSigners = Xrm.Page.getAttribute('ftp_selectedsigners').getValue();
        if (vcmn_selectedSigners != null && vcmn_selectedSigners != '') {
            //Additional Signers exist in CRM, verify session variables
            var vcmn_selectedArray = vcmn_selectedSigners.split('~~~');
            var vcmn_selectedArrayRecordCount = vcmn_selectedArray.length;
            if (vcmn_selectedArrayRecordCount > 1) {
                vcmn_AddlSignersNameArray = vcmn_selectedArray;
            }

            var vcmn_selectedIENArray = '';
            var vcmn_selectedIENArrayRecordCount = 0;
            var vcmn_progressNoteId = Xrm.Page.data.entity.getId();

            var vcmn_arrayMismatch = false;

            //Get Note's Browser Local Storage Values
            if (vcmn_progressNoteId != null && vcmn_progressNoteId != '') {
                vcmn_localStorageVarName = "PN" + vcmn_progressNoteId;
                var vcmn_localStorageStringValue = localStorage.getItem(vcmn_localStorageVarName);
                if (vcmn_localStorageStringValue != null && vcmn_localStorageStringValue != '') {
                    vcmn_selectedIENArray = vcmn_localStorageStringValue.split('~~~');
                    vcmn_selectedIENArrayRecordCount = vcmn_selectedIENArray.length;
                    if (vcmn_selectedIENArrayRecordCount > 1) {
                        vcmn_AddlSignersIenArray = vcmn_selectedIENArray;
                    }
                }
            }
            //Compare CRM signer array length with LocalStorage array length
            if (vcmn_selectedArrayRecordCount != vcmn_selectedIENArrayRecordCount) { vcmn_arrayMismatch = true; }

            if (vcmn_arrayMismatch == true) {
                alert("The count of Additional Signers selected in CRM, does not match the count of Additional Signers in VISTA!\n\nPlease remove all the additional signers on this Progress Note and perform the selection process again!\n\nThis note cannot be integrated with VISTA/CPRS until this has been resolved.");
                vcmn_signThisNoteFailure = true;
            }
            else {
                //Check if VIA Login cookie exist (not expired)
                var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
                if (vcmn_ViaLoginCookie == "") {
                    alert("Your VISTA session has expired. In order to process a note with additional signers, you must be logged into VISTA!");
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
                    vcmn_signThisNoteFailure = true;
                    return;
                }
            }
        }

        //Enforce VIA Login
        //Check if VIA Login cookie exist (not expired)
        var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");
        if (vcmn_ViaLoginCookie == "") {
            alert("Your VISTA session has expired. In order to process a note, you must be logged into VISTA!");
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            vcmn_signThisNoteFailure = true;
            return false;
        }

        if (vcmn_signThisNoteFailure == true) {
            //******Developer Bypass for no VISTA authentication******
            if ((Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}" || (Xrm.Page.context.getUserId()).toUpperCase() == "{EB21BC63-81BF-E511-942C-0050568D743D}") {
                alert("Developer VISTA authentication bypass applied!");
                Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
                Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
            }
            else {
                return false;
            }
        }

        //Save the current CRM data
        Xrm.Page.data.entity.save();
        //Display YELLOW Progress....
        Xrm.Page.ui.setFormNotification("Verifying progress note data, please wait..", "INFO", "SAVEVISTA");

        var vcmn_confirmSaveToVista = confirm('Are you sure you want to save this note to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the progress note will automatically be marked as completed and you will be prompted to exit the record!');
        if (vcmn_confirmSaveToVista == false) {
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();
        if (vcmn_requestId == null) {
            alert('The current progress note does not have a related request assigned in the Regarding field, the note cannot be created in VistA/CPRS!');
            Xrm.Page.getControl('regardingobjectid').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify that the regardingid is of type 'incident'
        if (vcmn_requestId[0].entityType != 'incident') {
            alert('The current progress note has an invalid regarding type, it must be of the type request/incident, the note cannot be created in VistA/CPRS!');
            Xrm.Page.getControl('regardingobjectid').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_SSN = '';
        var vcmn_DOB = '';

        if (vcmn_requestId[0].entityType === "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        else if (vcmn_requestId[0].entityType === "ftp_interaction") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_Veteran != null) {
                    vcmn_veteranId = vcmn_requestData.d.ftp_Veteran;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        if (vcmn_veteranId == null) {
            alert('The related request does not have a veteran/contact assigned, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, GovernmentId', vcmn_veteranId.Id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.ftp_DateofBirth != null) { vcmn_DOB = vcmn_contactData.d.ftp_DateofBirth; }
            if (vcmn_contactData.d.GovernmentId != null) { vcmn_SSN = vcmn_contactData.d.GovernmentId; }
        }

        //**WORKLOAD ENCOUNTER**
        vcmn_matchLookupId = vcmn_SSN;
        //***********************

        //Perform MVI Search
        //*vcmn_unattendedMviSearch(vcmn_veteranFirstName, vcmn_veteranLastName, vcmn_DOB, vcmn_SSN);

        //Skipping Unattended MVI**************
        //******Developer Bypass for missing ICN******

        //Get regarding data
        var vcmn_requestId = Xrm.Page.getAttribute('regardingobjectid').getValue();

        //Preserved Variables
        var vcmn_veteranId = null;  //From request customerid
        var vcmn_veteranName = '';
        var vcmn_veteranFirstName = '';
        var vcmn_veteranLastName = '';
        var vcmn_veteranMiddleName = '';

        if (vcmn_requestId[0].entityType === "incident") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('IncidentSet', 'CustomerId', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.CustomerId != null) {
                    vcmn_veteranId = vcmn_requestData.d.CustomerId;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        else if (vcmn_requestId[0].entityType === "ftp_interaction") {
            var vcmn_requestData = vcmn_getSingleEntityDataSync('ftp_interactionSet', 'ftp_Veteran', vcmn_requestId[0].id);
            if (vcmn_requestData != null) {
                if (vcmn_requestData.d.ftp_Veteran != null) {
                    vcmn_veteranId = vcmn_requestData.d.ftp_Veteran;
                    //Verify that the customerid is of type contact
                    if (vcmn_veteranId.LogicalName != 'contact') {
                        alert('The related request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
                        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                        return false;
                    }
                }
            }
        }
        if (vcmn_veteranId == null) {
            alert('The related request does not have a veteran/contact assigned, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_contactData = vcmn_getSingleEntityDataSync('ContactSet', 'FullName, FirstName, LastName, MiddleName', vcmn_veteranId.Id);
        if (vcmn_contactData != null) {
            if (vcmn_contactData.d.FullName != null) { vcmn_veteranName = vcmn_contactData.d.FullName; }
            if (vcmn_contactData.d.FirstName != null) { vcmn_veteranFirstName = vcmn_contactData.d.FirstName; }
            if (vcmn_contactData.d.LastName != null) { vcmn_veteranLastName = vcmn_contactData.d.LastName; }
            if (vcmn_contactData.d.MiddleName != null) { vcmn_veteranMiddleName = vcmn_contactData.d.MiddleName; }
        }

        //Get user data
        var vcmn_crmUserId = Xrm.Page.getAttribute('ownerid').getValue();
        var vcmn_userDomainId = '';
        var vcmn_userFirstName = '';
        var vcmn_userLastName = '';
        var vcmn_userMiddleName = '';
        var vcmn_userSiteId = '';

        if (vcmn_crmUserId != null) {
            //Verify the owner type
            if (vcmn_crmUserId[0].entityType != 'systemuser') {
                alert('The progress note owner must be an individual user and not a team, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'DomainName, FirstName, LastName, MiddleName, ftp_FacilitySiteId', vcmn_crmUserId[0].id);
            if (vcmn_userData != null) {
                if (vcmn_userData.d.DomainName != null) { vcmn_userDomainId = vcmn_userData.d.DomainName; }
                if (vcmn_userData.d.FirstName != null) { vcmn_userFirstName = vcmn_userData.d.FirstName; }
                if (vcmn_userData.d.LastName != null) { vcmn_userLastName = vcmn_userData.d.LastName; }
                if (vcmn_userData.d.MiddleName != null) { vcmn_userMiddleName = vcmn_userData.d.MiddleName; }
                if (vcmn_userData.d.ftp_FacilitySiteId != null) { vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id; }
            }
        }
        else {
            alert('Unable to verify the user account for the current author/owner assigned to this note, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Verify that the current owner and the current user is the same person, if not do not proceed
        if ((vcmn_crmUserId[0].id).toUpperCase() != (Xrm.Page.context.getUserId()).toUpperCase()) {
            alert('The current author/owner does not match the current CRM user, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_NoteUserTeam = "NONE";
        //Check Team membership
        if (vcmn_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PHARMACY"; }
        if (vcmn_UserHasTeam("CCA Team", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "CCA"; }
        if (vcmn_UserHasTeam("RN", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "TAN"; }
        //**TEMP, verify these team values that they are correct **FUTURE NEED**
        if (vcmn_UserHasTeam("LIP User", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "PACT"; }
        if (vcmn_UserHasTeam("MSA User", Xrm.Page.context.getUserId())) { vcmn_NoteUserTeam = "MSA"; }

        //Verify Team Value, that one has been assigned
        if (vcmn_NoteUserTeam == "NONE") {
            alert('The current author/owner does not belong to a CRM team that can integrate notes, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get request form content
        var vcmn_noteDescription = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        if (vcmn_noteDescription == null || vcmn_noteDescription == '') {
            alert('The note description field is empty, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {
            //Using new hospital location and local notes lookup fields
            var vcmn_localTitle = Xrm.Page.getAttribute('ftp_localnotetitle').getValue();
            if (vcmn_localTitle == null) {
                alert('The local note title field is empty, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else { vcmn_localTitle = vcmn_localTitle[0].name; }

            vcmn_patientAssignedLocation = Xrm.Page.getAttribute('ftp_notehospitallocation').getValue();
            if (vcmn_patientAssignedLocation == null) {
                alert('The hospital location field is empty, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else { vcmn_patientAssignedLocation = vcmn_patientAssignedLocation[0].name; }
        }

        var vcmn_callbackNumber = Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        if (vcmn_callbackNumber == null || vcmn_callbackNumber == '') {
            alert('The callback number field is empty, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        var vcmn_reasonForRequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
        if (vcmn_reasonForRequest == null) {
            alert('The reason for request field is empty, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        var vcmn_encounterCode = 'NEW';
        var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        if (vcmn_signThisNote == 100000001) { vcmn_signThisNote = true; } else { vcmn_signThisNote = false; }

        //Get Progress Note Guid/Id
        var vcmn_noteId = Xrm.Page.data.entity.getId();

        //Get Created On Date & Convert format
        var vcmn_createdOnDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('createdon').getValue());
        if (vcmn_createdOnDate == null) {
            alert('The CRM createdon field is empty, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get User Entry Date
        var vcmn_userEntryDate = vcmn_convertCrmDateToVistADate(Xrm.Page.getAttribute('ftp_userentrydate').getValue());
        if (vcmn_userEntryDate == null) { vcmn_userEntryDate = vcmn_createdOnDate; }

        //Get Facility and lookup facility number and HL7 URL
        var vcmn_facilityCode = '';
        var vcmn_siteHL7ListenerAddress = '';
        var vcmn_patientFacility = Xrm.Page.getAttribute('ftp_patientfacility').getValue();
        if (vcmn_patientFacility == null) {
            alert('The CRM patient facility field is empty, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text, ftp_hl7listener', vcmn_patientFacility[0].id);
            if (vcmn_facilityData.d.ftp_FacilityCode_text != null) {
                vcmn_facilityCode = vcmn_facilityData.d.ftp_FacilityCode_text;
            }
            else {
                alert('The CRM patient facility code is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            if (vcmn_facilityData.d.ftp_hl7listener != null) {
                var vcmn_siteHL7ListenerAddress = vcmn_facilityData.d.ftp_hl7listener;
            }
            else {
                alert('The CRM HL7 listener address is missing in the Facility setup, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }

        var vcmn_originatorID = '';
        var vcmn_userSiteNo = '';

        //Lookup the Facility/Site #
        if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
            var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
            if (vcmn_facilityData != null) {
                if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_userSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
            }
        }

        //Validate required Vista Lookup info
        if (vcmn_userSiteNo == '' || vcmn_userSiteNo == null || vcmn_userFirstName == '' || vcmn_userFirstName == null || vcmn_userLastName == '' || vcmn_userLastName == null) {
            //Abort process, missing info
            alert('One of the following required CRM user data fields are missing: Facilty No, First Name or Last Name, the note cannot be created in VistA/CPRS!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        if (Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {

            //**TEMP DISABLED
            /*
            //Obtain the VistaDuz from the cross reference table if available
            if (vcmn_crmUserId != null) {
                var vcmn_conditionalFilter = "ftp_crmuser/Id eq (guid'" + vcmn_crmUserId[0].id + "')";
                var vcmn_crossReferenceData = vcmn_getMultipleEntityDataSync('ftp_useridSet', 'ftp_useridId, ftp_vistaduz', vcmn_conditionalFilter, 'ftp_name', 'asc', 0);
                if (vcmn_crossReferenceData != null) {
                    for (var i = 0; i <= vcmn_crossReferenceData.d.results.length - 1; i++) {
                        //Get Info
                        if (vcmn_crossReferenceData.d.results[i].ftp_vistaduz != null) { vcmn_originatorID = vcmn_crossReferenceData.d.results[i].ftp_vistaduz; }
                        break;
                    }
                }
            }
            */
            //**END TEMP DISABLED

            //**NOTE: The code below to impersonate Lori Nicholls has been disabled per task 562307
            /*
            if (vcmn_IsProductionEnvironment == false) {
                //Provide the option to search for Lori Nicholls, site# 613
                var vcmn_impersonatePromptString = "**THIS IS A VISTA USER SEARCH TEST PROMPT** \n" +
                    "If you would like to impersonate the user: \n" +
                    "Lori Nicholls (613) \n" +
                    "Select OK.  Otherwise, select CANCEL.";
                var vcmn_confirmImpersonateVistaUser = confirm(vcmn_impersonatePromptString);
                if (vcmn_confirmImpersonateVistaUser == true) {
                    vcmn_userFirstName = "Lori";
                    vcmn_userLastName = "Nicholls";
                    vcmn_userSiteNo = "613";
                }
            }
            */

            //**TEMP DISABLED
            /*
            var vcmn_vistausersData = vcmn_getVistaUsersData(vcmn_userFirstName, vcmn_userLastName, vcmn_userSiteNo, false);

            //Check vista users data content
            if (vcmn_vistausersData == null || vcmn_vistausersData.Data == null || vcmn_vistausersData.Data.length == null || vcmn_vistausersData.Data.length == 0) {
                //Abort process, missing info
                alert('Unable to obtain Vista User Data, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            var vcmn_selectedUserFirstName = '';
            var vcmn_selectedUserMiddleName = '';
            var vcmn_selectedUserLastName = '';
            var vcmn_selectedUserSuffix = '';
            var vcmn_selectedUserDisplayName = '';
            var vcmn_selectedUserTitle = '';
            var vcmn_userIsSelected = false;

            if (vcmn_vistausersData.Data.length > 1) {
                alert("The Vista User list, contains more than one user, please select the Vista User you want to use from the next prompt(s), a total of " + vcmn_vistausersData.Data.length + " users!");
                for (var i = 0; i <= vcmn_vistausersData.Data.length - 1; i++) {
                    var vcmn_currentUserFirstName = '';
                    var vcmn_currentUserMiddleName = '';
                    var vcmn_currentUserLastName = '';
                    var vcmn_currentUserSuffix = '';
                    var vcmn_currentUserDisplayName = '';
                    var vcmn_currentUserTitle = '';
                    if (vcmn_vistausersData.Data[i].FirstName != null) { vcmn_currentUserFirstName = vcmn_vistausersData.Data[i].FirstName; }
                    if (vcmn_vistausersData.Data[i].MiddleName != null) { vcmn_currentUserMiddleName = vcmn_vistausersData.Data[i].MiddleName; }
                    if (vcmn_vistausersData.Data[i].LastName != null) { vcmn_currentUserLastName = vcmn_vistausersData.Data[i].LastName; }
                    if (vcmn_vistausersData.Data[i].Suffix != null) { vcmn_currentUserSuffix = vcmn_vistausersData.Data[i].Suffix; }
                    if (vcmn_vistausersData.Data[i].DisplayName != null) { vcmn_currentUserDisplayName = vcmn_vistausersData.Data[i].DisplayName; }
                    if (vcmn_vistausersData.Data[i].Title != null) { vcmn_currentUserTitle = vcmn_vistausersData.Data[i].Title; }
                    //Prompt user about this vista user record
                    var vcmn_userPromptString = "Click OK, to select this user.  Otherwise CANCEL \n" +
                        "\n First Name: " + vcmn_currentUserFirstName +
                        "\n Middle Name: " + vcmn_currentUserMiddleName +
                        "\n Last Name: " + vcmn_currentUserLastName +
                        "\n Suffix: " + vcmn_currentUserSuffix +
                        "\n Display Name: " + vcmn_currentUserDisplayName +
                        "\n Title: " + vcmn_currentUserTitle;

                    var vcmn_confirmSelectVistaUser = confirm(vcmn_userPromptString);
                    if (vcmn_confirmSelectVistaUser == true) {
                        vcmn_userIsSelected = true;
                        vcmn_selectedUserFirstName = vcmn_currentUserFirstName;
                        vcmn_selectedUserMiddleName = vcmn_currentUserMiddleName;
                        vcmn_selectedUserLastName = vcmn_currentUserLastName;
                        vcmn_selectedUserSuffix = vcmn_currentUserSuffix;
                        vcmn_selectedUserDisplayName = vcmn_currentUserDisplayName;
                        vcmn_selectedUserTitle = vcmn_currentUserTitle;
                        break;
                    }
                }
            }
            else {
                //Select data from the first record
                vcmn_userIsSelected = true;
                if (vcmn_vistausersData.Data[0].FirstName != null) { vcmn_selectedUserFirstName = vcmn_vistausersData.Data[0].FirstName; }
                if (vcmn_vistausersData.Data[0].MiddleName != null) { vcmn_selectedUserMiddleName = vcmn_vistausersData.Data[0].MiddleName; }
                if (vcmn_vistausersData.Data[0].LastName != null) { vcmn_selectedUserLastName = vcmn_vistausersData.Data[0].LastName; }
                if (vcmn_vistausersData.Data[0].Suffix != null) { vcmn_selectedUserSuffix = vcmn_vistausersData.Data[0].Suffix; }
                if (vcmn_vistausersData.Data[0].DisplayName != null) { vcmn_selectedUserDisplayName = vcmn_vistausersData.Data[0].DisplayName; }
                if (vcmn_vistausersData.Data[0].Title != null) { vcmn_selectedUserTitle = vcmn_vistausersData.Data[0].Title; }
            }

            //Check if a user was selected
            if (vcmn_userIsSelected == false) {
                alert('A user was not selected from the previous prompts, the note cannot be created in VistA/CPRS!');
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            //Execute Integration
            vcmn_executeVistAIntegrationRequest(vcmn_noteId, vcmn_noteDescription, vcmn_patientICN, vcmn_userDomainId, vcmn_localTitle, vcmn_callbackNumber, vcmn_reasonForRequest[0].name, vcmn_encounterCode, vcmn_signThisNote, vcmn_veteranFirstName, vcmn_veteranLastName, vcmn_createdOnDate, vcmn_userEntryDate, vcmn_selectedUserFirstName, vcmn_selectedUserMiddleName, vcmn_selectedUserLastName, vcmn_selectedUserSuffix, vcmn_facilityCode, vcmn_originatorID, vcmn_siteHL7ListenerAddress, vcmn_patientAssignedLocation);

            */
            //**END TEMP DISABLED

        }
        else {
            //Execute workload encounter note integration steps
            //*vcmn_prepWorkloadEncounterIntegrationStep01();

            //Changed to handle Historical Note instead
            vcmn_prepHistoricalIntegrationStep01();
        }

        //*************************************


    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_ribbonButtonSaveToVistA_HistoricalTest): ' + err.message);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_prepHistoricalIntegrationStep01(cookieData) {
    try {
        //Verify Note Title
        var vcmn_NoteTitleIEN = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').getValue();
        if (vcmn_NoteTitleIEN == null || vcmn_NoteTitleIEN == '') {
            alert('The selected note title field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify Location
        var vcmn_LocationIEN = Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').getValue();
        if (vcmn_LocationIEN == null || vcmn_LocationIEN == '') {
            alert('The selected location field is empty, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Verify patient id
        if (vcmn_matchLookupId == null || vcmn_matchLookupId == '') {
            alert('The veteran/patient does not have a SSN, the note cannot be created in VistA/CPRS!');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=CRMDataIssue", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }

        //Get the current CRM User's assigned site/facility
        var vcmn_userSiteId = "";

        //var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
        //if (vcmn_userData != null) {
        //    if (vcmn_userData.d.ftp_FacilitySiteId != null) {
        //        vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}

        //Lookup the Facility/Site #
        //if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
        //    var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
        //    if (vcmn_facilityData != null) {
        //        if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_ViaLoginFacility = vcmn_facilityData.d.ftp_FacilityCode_text; }
        //    }
        //}

        //if (vcmn_ViaLoginFacility == null){
        var siteData = setUserSite();
        //}

        //Check if VIA Login cookie exist (not expired)
        var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

        //TODO: how to know which site??
        var vcmn_ViaLoginData = null;

        if (vcmn_ViaLoginCookie != "")
            vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);

        if (vcmn_ViaLoginCookie != null && vcmn_ViaLoginCookie != '') {

            if (vcmn_ViaLoginData.length > 1) {
                if (siteData != null) {
                    for (var j = 0; j < vcmn_ViaLoginData.length; j++) {
                        if (vcmn_ViaLoginData[j].siteCode == siteData.SiteNo) {
                            vcmn_ViaLoginToken = vcmn_ViaLoginData[j].duz;
                            vcmn_ViaLoginName = vcmn_ViaLoginData[j].providerName;
                            vcmn_esignatureCode = vcmn_ViaLoginData[j].eSig;
                            break;
                        }
                    }
                } else {
                    vcmn_ViaLoginToken = vcmn_ViaLoginData[0].duz;
                    vcmn_ViaLoginName = vcmn_ViaLoginData[0].providerName;
                    vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                }
            } else if (vcmn_ViaLoginData.length == 1) {
                vcmn_ViaLoginToken = vcmn_ViaLoginData[0].duz;
                vcmn_ViaLoginName = vcmn_ViaLoginData[0].providerName;
                vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
            }
        }
        else {
            alert("Your VISTA session has expired. In order to process a note, you must be logged into VISTA!");
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=VIALoginExpired", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            return;
        }

        //Lookup Patient Id using VIA 'match' service
        vialib_match(vcmn_requestingApp, vcmn_consumingAppToken, vcmn_consumingAppPassword, vcmn_baseServiceEndpointUrl, vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility, vcmn_matchLookupId, vcmn_prepHistoricalIntegrationStep01_response);
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_prepHistoricalIntegrationStep01): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function setUserSite() {
    var retVal = null;
    var progressNoteFacility = parent.Xrm.Page.data.entity.attributes.get("ftp_progressnotefacility");

    if (progressNoteFacility != null) {
        var progressNoteFacilityLookup = progressNoteFacility.getValue();
        if (progressNoteFacilityLookup != null) {
            if (progressNoteFacilityLookup.length != null) {
                if (progressNoteFacilityLookup.length > 0) {
                    var facilityId = progressNoteFacilityLookup[0].id;
                    if (facilityId[0] == '{')
                        facilityId = facilityId.substring(1, facilityId.length - 1);
                    $.ajax({
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilities(" + facilityId + ")?$select=_ftp_facility_id_value,ftp_facilitycode_text",
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                            XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                            XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                        },
                        async: false,
                        success: function (data, textStatus, xhr) {
                            var result = data;
                            var _ftp_facility_id = result["_ftp_facilityid"];
                            var ftp_facilitycode = result["ftp_facilitycode_text"];
                            vcmn_ViaLoginFacility = ftp_facilitycode;
                            retVal = { SiteId: _ftp_facility_id, SiteNo: vcmn_ViaLoginFacility };
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
                        }
                    });
                }
            }
        }
    }

    return retVal;
}

function vcmn_prepHistoricalIntegrationStep01_response(vcmn_error, vcmn_matchresponse) {
    try {
        //Check for non VIA service error
        if (vcmn_error != null) {
            alert("Unable to match the CRM Veteran/Patient with a record in VistA/CPRS. The process failed with error: " + vcmn_matchresponse + ", the note cannot be created in VistA/CPRS!");
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //Test for VIA Service Error
            if (vcmn_matchresponse.taggedPatientArray.fault != null) {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. Service Error: " + vcmn_matchresponse.taggedPatientArray.fault.message + ", the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            //Get VIA service Response
            if (vcmn_matchresponse.taggedPatientArray.patients == null) {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. No data returned, the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }

            //Get VIA service Response
            if (vcmn_matchresponse.taggedPatientArray.patients.length > 0) {
                //var vcmn_matchArray = vcmn_matchresponse.getElementsByTagName("patients")[0].childNodes;
                //childNodes[4] holds the localPid/IEN value
                vcmn_ViaPatientId = vcmn_matchresponse.taggedPatientArray.patients[0].localPid;
            }
            else {
                alert("Unable to match the CRM Veteran/Patient with a record in Vista/CPRS. No data returned, the note cannot be created in VistA/CPRS!");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }

        //Get User Entry Date
        var vcmn_createdOnDate = vialib_convertToVistaDateTime(Xrm.Page.getAttribute('createdon').getValue());
        var vcmn_userEntryDate = null;
        if (Xrm.Page.getAttribute('ftp_userentrydate').getValue() != null) {
            vcmn_userEntryDate = vialib_convertToVistaDateTime(Xrm.Page.getAttribute('ftp_userentrydate').getValue());
        }
        if (vcmn_userEntryDate == null) { vcmn_userEntryDate = vcmn_createdOnDate; }

        //Reformat Note Description as needed to handle long lines of text (WordWrap)
        var vcmn_noteDescription = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        var vcmn_NoteText = vcmn_noteDescription;
        var vcmn_RevisedNoteText = "";
        //Do Breakdown of lines
        var vcmn_TextLines = vcmn_NoteText.split('\n');
        if (vcmn_TextLines.length > 0) {
            //Reformat text
            for (var i = 0; i < vcmn_TextLines.length; i++) {
                //Test for a long line
                if (vcmn_TextLines[i].length > vcmn_WordWrapLimit) {
                    //Break down line
                    var vcmn_NewString = vcmn_wordWrap(vcmn_TextLines[i], vcmn_WordWrapLimit, '\n');
                    //Add revised text back
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_NewString + "\n";  //Add back the CR/LF used to split on
                }
                else {
                    //Add text to new note
                    vcmn_RevisedNoteText = vcmn_RevisedNoteText + vcmn_TextLines[i] + "\n"; //Add back the CR/LF used to split on
                }
            }
        }
        if (vcmn_RevisedNoteText != "" && vcmn_RevisedNoteText != null) {
            vcmn_noteDescription = vcmn_RevisedNoteText;
        }

        //Add list of additional signer names to Note Text if they exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vcmn_SignerNames = "\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vcmn_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vcmn_singleSignerName = vcmn_AddlSignersNameArray[i].split("___");
                    vcmn_SignerNames = vcmn_SignerNames + vcmn_singleSignerName[1] + "\n";
                }
            }
            //Add to Note Description
            vcmn_noteDescription = vcmn_noteDescription + vcmn_SignerNames;
        }
        var vcmn_NoteTitleIEN = Xrm.Page.getAttribute('ftp_selectedworkloadnotetitleid').getValue();
        var vcmn_LocationIEN = Xrm.Page.getAttribute('ftp_selectedworkloadlocationid').getValue();

        //Reformat Note Description for VIA write Note web service to handle line feed and carriage return
        //Replace all \n and \r occurrences with |
        vcmn_noteDescription = vcmn_noteDescription.replace(/\n/g, "|");
        vcmn_noteDescription = vcmn_noteDescription.replace(/\r/g, "|");

        //****Remove Node Identifier from Note Title Id if it exists
        if (vcmn_NoteTitleIEN != null && vcmn_NoteTitleIEN != "") {
            var vcmn_splitNoteTitleIdArray = vcmn_NoteTitleIEN.split("__");
            vcmn_NoteTitleIEN = vcmn_splitNoteTitleIdArray[0];
        }
        //**********************************************************

        //if (vcmn_ViaLoginFacility == null){
        setUserSite();
        //}

        //Execute VIA writeNote Service
        vialib_writeNote(vcmn_requestingApp, vcmn_consumingAppToken, vcmn_consumingAppPassword, vcmn_baseServiceEndpointUrl, vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility, vcmn_NoteTitleIEN, vcmn_LocationIEN, vcmn_userEntryDate, 'E', vcmn_ViaPatientId, vcmn_noteDescription, vcmn_writeNote_response)
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_prepHistoricalIntegrationStep01_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_writeNote_response(vcmn_errorThrown, vcmn_requestResponse) {
    //Process Note Response
    try {
        if (vcmn_errorThrown != null) {
            //Write Error
            Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
            Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vcmn_errorThrown));
            Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
            Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
            alert('The historical note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            Xrm.Page.getControl('ftp_integrationerror').setFocus();
            Xrm.Page.data.entity.save();
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vcmn_requestResponse.noteResult.fault != null) {
                //Write Failure entry
                Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationerror').setValue("Service Error: " + vcmn_requestResponse.noteResult.fault.message);
                Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
                Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                alert('The historical note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                Xrm.Page.getControl('ftp_integrationerror').setFocus();
                Xrm.Page.data.entity.save();
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
            else {
                //Test for data
                if (vcmn_requestResponse.noteResult.id != null) {
                    //Sucessfull creation of historical note
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('OK');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setValue(vcmn_requestResponse.noteResult.id);
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');

                    var vcmn_signThisNote = Xrm.Page.getAttribute('ftp_signthisnote').getValue();
                    if (vcmn_signThisNote == 100000001) { vcmn_signThisNote = true; } else { vcmn_signThisNote = false; }

                    if (vcmn_signThisNote == true) {
                        //Execute signNote Service
                        vialib_signNote(vcmn_requestingApp, vcmn_consumingAppToken, vcmn_consumingAppPassword, vcmn_baseServiceEndpointUrl, vcmn_ViaLoginName, vcmn_ViaLoginToken, vcmn_ViaLoginFacility, Xrm.Page.getAttribute('ftp_integrationnoteid').getValue(), vcmn_esignatureCode, vcmn_signNote_response);
                    }
                    else {
                        //Complete Note 
                        vcmn_completeViaHistoricalNote();
                    }
                }
                else {
                    //Write No Data Failure
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue("Service Error: NO DATA RETURNED FROM VIA/VISTA REGARDING HISTORICAL NOTE CREATION!");
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setValue('');
                    Xrm.Page.getAttribute('ftp_integrationnoteid').setSubmitMode('always');
                    alert('The historical note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                    VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=HistoricalNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                    Xrm.Page.getControl('ftp_integrationerror').setFocus();
                    Xrm.Page.data.entity.save();
                    vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                    return false;
                }
            }
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_writeNote_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_signNote_response(vcmn_errorThrown, vcmn_requestResponse) {
    //Process Sign Note Response
    try {
        if (vcmn_errorThrown != null) {
            //Write Error
            alert("The VIA signNote failed with error: " + vcmn_requestResponse);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=SignNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        //Write web service response Success or Failure
        if (vcmn_requestResponse.text.fault != null) {
            //Write Failure entry
            alert("VIA signNote Service Error: " + vcmn_requestResponse.text.fault.message);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=SignNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            return false;
        }
        else {
            //Test for data
            if (vcmn_requestResponse.text != null) {
                //Sucessful sign of note 
                //Xrm.Page.getAttribute('ftp_issigned').setValue(true);
                //Xrm.Page.getAttribute('ftp_issigned').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_signeddate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_signeddate').setSubmitMode('always');
            }
            else {
                //Write No Data Failure
                alert("Service Error: NO RESPONSE RETURNED FROM VIA signNote service");
                VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=SignNoteError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
                vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
                return false;
            }
        }
        //Proceed to Add Additional Signers
        vcmn_completeViaHistoricalNote();
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_signNote_response): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_completeViaHistoricalNote() {
    //The VistA Historical Note has been created, add additional signers if needed
    try {
        var vcmn_noteText = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        var vcmn_noteIntegrationId = Xrm.Page.getAttribute('ftp_integrationnoteid').getValue();
        //Add list of additional signer names to Note Text if they exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vcmn_SignerNames = "\n\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vcmn_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vcmn_singleSignerName = vcmn_AddlSignersNameArray[i].split("___");
                    vcmn_SignerNames = vcmn_SignerNames + vcmn_singleSignerName[1] + "\n";
                }
            }
            //Add Signers to note text, use later to update form upon completion
            vcmn_noteText = vcmn_noteText + vcmn_SignerNames;

            //Get the current CRM User's assigned site/facility
            var vcmn_userSiteId = "";
            var vcmn_UserSiteNo = "";
            var vcmn_duz = "";
            var vcmn_providername = "";

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            if (vcmn_userData != null) {
                if (vcmn_userData.d.ftp_FacilitySiteId != null) {
                    vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id;
                }
            }

            //Lookup the Facility/Site #
            if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
                var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
                if (vcmn_facilityData != null) {
                    if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_UserSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
                }
            }

            //if (vcmn_UserSiteNo == ""){
            var siteData = setUserSite();
            vcmn_UserSiteNo = vcmn_ViaLoginFacility;
            //}

            //Check if VIA Login cookie exist (not expired)
            var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

            //TODO: how to know which site??
            var vcmn_ViaLoginData = null;

            if (vcmn_ViaLoginCookie != "")
                vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);

            if (vcmn_ViaLoginCookie != null && vcmn_ViaLoginCookie != '') {

                if (vcmn_ViaLoginData.length > 1) {
                    if (siteData != null) {
                        for (var j = 0; j < vcmn_ViaLoginData.length; j++) {
                            if (vcmn_ViaLoginData[j].siteCode == siteData.SiteNo) {
                                vcmn_duz = vcmn_ViaLoginData[j].duz;
                                vcmn_providername = vcmn_ViaLoginData[j].providerName;
                                vcmn_esignatureCode = vcmn_ViaLoginData[j].eSig;
                                break;
                            }
                        }
                    } else {
                        vcmn_duz = vcmn_ViaLoginData[0].duz;
                        vcmn_providername = vcmn_ViaLoginData[0].providerName;
                        vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                    }
                } else if (vcmn_ViaLoginData.length == 1) {
                    vcmn_duz = vcmn_ViaLoginData[0].duz;
                    vcmn_providername = vcmn_ViaLoginData[0].providerName;
                    vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                }
            }

            //Create text strings from additional signers array
            var vcmn_SignerIEN = "";
            for (var i = 0; i <= vcmn_AddlSignersIenArray.length - 1; i++) {
                if (i == 1) { vcmn_SignerIEN = vcmn_AddlSignersIenArray[i]; }
                if (i > 1) { vcmn_SignerIEN = vcmn_SignerIEN + " " + vcmn_AddlSignersIenArray[i]; }
            }

            //Create the Additional Signers
            var vcmn_viaSigners = new Object();
            vcmn_viaSigners.ProviderName = vcmn_providername;
            vcmn_viaSigners.Duz = vcmn_duz;
            vcmn_viaSigners.LoginSiteCode = vcmn_UserSiteNo;
            vcmn_viaSigners.Target = vcmn_noteIntegrationId;
            vcmn_viaSigners.SupplementalParameters = vcmn_SignerIEN;

            var postData = { "Request": JSON.stringify(vcmn_viaSigners) };

            vcmn_callAction("vccm_VIAAddSigner", postData,
                function (data) {
                    vcmn_viaSignersResponse = JSON.parse(data.Response);
                    //Test for Failure
                    if (vcmn_viaSignersResponse.ErrorOccurred == true) {
                        alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                    }
                    else {
                        //Additional Signers Sucessfully added
                        //Update CRM note description with Additional Signers
                        Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteText);
                        Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');

                        if (vcmn_localStorageVarName != "" && vcmn_localStorageVarName != null) {
                            //Clear existing session storage variable.
                            localStorage.removeItem(vcmn_localStorageVarName);
                        }
                    }
                },
                function (error) {
                    alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                }
            );

            // $.ajax({
            // type: "POST",
            // url: vcmn_AddSignersUrl,
            // data: JSON.stringify(vcmn_viaSigners),
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            // success: function (data) {
            // vcmn_viaSignersResponse = JSON.stringify(data.Data);
            // //Test for Failure
            // if (vcmn_viaSignersResponse.ErrorOccurred == true) {
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // }
            // else {
            // //Additional Signers Sucessfully added
            // //Update CRM note description with Additional Signers
            // Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteText);
            // Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');

            // if (vcmn_localStorageVarName != "" && vcmn_localStorageVarName != null) {
            // //Clear existing session storage variable.
            // localStorage.removeItem(vcmn_localStorageVarName);
            // }
            // }
            // },
            // error: function (jqXHR, textStatus, errorThrown) {
            // //System Error
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // },
            // async: false,
            // cache: false
            // });
        }
        if (vcmn_automaticViaIntegration == false) {
            alert('The note creation in VistA/CPRS was successful, this note will now be marked as completed. \n\nPlease exit this note record after clicking OK to this prompt!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            Xrm.Page.data.entity.save();
        }
        else {
            alert('The note creation in VistA/CPRS was successful, this note will now be marked as completed.');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=IntegrationSuccess", "level=Info", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            //USD action calls beneath the ProgressNoteIntegrationEvent will save and close the still-hidden Progress Note tab
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_completeViaHistoricalNote): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
    }
}

function vcmn_completeViaWorkloadNote() {
    //The VistA Workload Encounter Note has been created, add additional signers if needed
    try {
        var vcmn_noteText = Xrm.Page.getAttribute('ftp_notedetail').getValue();
        var vcmn_noteIntegrationId = Xrm.Page.getAttribute('ftp_integrationnoteid').getValue();
        //Add list of additional signer names to Note Text if they exists
        if (vcmn_AddlSignersNameArray != null && vcmn_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vcmn_SignerNames = "\n\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vcmn_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vcmn_singleSignerName = vcmn_AddlSignersNameArray[i].split("___");
                    vcmn_SignerNames = vcmn_SignerNames + vcmn_singleSignerName[1] + "\n";
                }
            }
            //Add Signers to note text, use later to update form upon completion
            vcmn_noteText = vcmn_noteText + vcmn_SignerNames;

            //Get the current CRM User's assigned site/facility
            var vcmn_userSiteId = "";
            var vcmn_UserSiteNo = "";
            var vcmn_duz = "";
            var vcmn_providername = "";

            var vcmn_userData = vcmn_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            if (vcmn_userData != null) {
                if (vcmn_userData.d.ftp_FacilitySiteId != null) {
                    vcmn_userSiteId = vcmn_userData.d.ftp_FacilitySiteId.Id;
                }
            }

            //Lookup the Facility/Site #
            if (vcmn_userSiteId != null && vcmn_userSiteId != '') {
                var vcmn_facilityData = vcmn_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', vcmn_userSiteId);
                if (vcmn_facilityData != null) {
                    if (vcmn_facilityData.d.ftp_FacilityCode_text != null) { vcmn_UserSiteNo = vcmn_facilityData.d.ftp_FacilityCode_text; }
                }
            }

            var siteData = setUserSite();

            //Check if VIA Login cookie exist (not expired)
            var vcmn_ViaLoginCookie = vcmn_getCookie("viasessionlink");

            //TODO: how to know which site??
            var vcmn_ViaLoginData = null;

            if (vcmn_ViaLoginCookie != "")
                vcmn_ViaLoginData = JSON.parse(vcmn_ViaLoginCookie);

            if (vcmn_ViaLoginCookie != null && vcmn_ViaLoginCookie != '') {

                if (vcmn_ViaLoginData.length > 1) {
                    if (siteData != null) {
                        for (var j = 0; j < vcmn_ViaLoginData.length; j++) {
                            if (vcmn_ViaLoginData[j].siteCode == siteData.SiteNo) {
                                vcmn_duz = vcmn_ViaLoginData[j].duz;
                                vcmn_providername = vcmn_ViaLoginData[j].providerName;
                                vcmn_esignatureCode = vcmn_ViaLoginData[j].eSig;
                                break;
                            }
                        }
                    } else {
                        vcmn_duz = vcmn_ViaLoginData[0].duz;
                        vcmn_providername = vcmn_ViaLoginData[0].providerName;
                        vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                    }
                } else if (vcmn_ViaLoginData.length == 1) {
                    vcmn_duz = vcmn_ViaLoginData[0].duz;
                    vcmn_providername = vcmn_ViaLoginData[0].providerName;
                    vcmn_esignatureCode = vcmn_ViaLoginData[0].eSig;
                }
            }

            //Create text strings from additional signers array
            var vcmn_SignerIEN = "";
            for (var i = 0; i <= vcmn_AddlSignersIenArray.length - 1; i++) {
                if (i == 1) { vcmn_SignerIEN = vcmn_AddlSignersIenArray[i]; }
                if (i > 1) { vcmn_SignerIEN = vcmn_SignerIEN + " " + vcmn_AddlSignersIenArray[i]; }
            }

            //if (vcmn_UserSiteNo == ""){

            vcmn_UserSiteNo = vcmn_ViaLoginFacility;
            //}

            //Create the Additional Signers
            var vcmn_viaSigners = new Object();
            vcmn_viaSigners.ProviderName = vcmn_providername;
            vcmn_viaSigners.Duz = vcmn_duz;
            vcmn_viaSigners.LoginSiteCode = vcmn_UserSiteNo;
            vcmn_viaSigners.Target = vcmn_noteIntegrationId;
            vcmn_viaSigners.SupplementalParameters = vcmn_SignerIEN;

            var postData = { "Request": JSON.stringify(vcmn_viaSigners) };

            vcmn_callAction("vccm_VIAAddSigner", postData,
                function (data) {
                    vcmn_viaSignersResponse = JSON.parse(data.Response);
                    //Test for Failure
                    if (vcmn_viaSignersResponse.ErrorOccurred == true) {
                        alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                    }
                    else {
                        //Additional Signers Sucessfully added
                        //Update CRM note description with Additional Signers
                        Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteText);
                        Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');

                        if (vcmn_localStorageVarName != "" && vcmn_localStorageVarName != null) {
                            //Clear existing session storage variable.
                            localStorage.removeItem(vcmn_localStorageVarName);
                        }
                    }
                },
                function (error) {
                    alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                }
            );

            // $.ajax({
            // type: "POST",
            // url: vcmn_AddSignersUrl,
            // data: JSON.stringify(vcmn_viaSigners),
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            // success: function (data) {
            // vcmn_viaSignersResponse = JSON.stringify(data.Data);
            // //Test for Failure
            // if (vcmn_viaSignersResponse.ErrorOccurred == true) {
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // }
            // else {
            // //Additional Signers Sucessfully added
            // //Update CRM note description with Additional Signers
            // Xrm.Page.getAttribute('ftp_notedetail').setValue(vcmn_noteText);
            // Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');

            // if (vcmn_localStorageVarName != "" && vcmn_localStorageVarName != null) {
            // //Clear existing session storage variable.
            // localStorage.removeItem(vcmn_localStorageVarName);
            // }
            // }
            // },
            // error: function (jqXHR, textStatus, errorThrown) {
            // //System Error
            // alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
            // },
            // async: false,
            // cache: false
            // });
        }

        //Clear all required fields set by the special treatment control
        Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("none");

        if (vcmn_automaticViaIntegration == false) {
            alert('The workload encounter note creation in VistA/CPRS was successful, this workload encounter note will now be marked as completed. \n\nPlease exit this note record after clicking OK to this prompt!');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            Xrm.Page.data.entity.save();
        }
        else {
            alert('The workload encounter note creation in VistA/CPRS was successful, this workload encounter note will now be marked as completed.');
            vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
            VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=IntegrationSuccess", "level=Info", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
            //USD action calls beneath the ProgressNoteIntegrationEvent will save and close the still-hidden Progress Note tab
        }
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_completeViaWorkloadNote): ' + err.message);
        VCCM.USDHelper.FireUSDEvent("ProgressNoteIntegrationEvent", ["name=GeneralError", "level=Error", "automaticVIAIntegration=" + vcmn_automaticViaIntegrationString], vcmn_resetAutoIntegrationFlag);
        vcmn_clearVistaFormNotification(vcmn_automaticViaIntegration);
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

function vcmn_resetAutoIntegrationFlag() {
    Xrm.Page.getAttribute('ftp_automaticviaintegration').setValue(false);
    Xrm.Page.getAttribute('ftp_automaticviaintegration').setSubmitMode('always');
}
function vcmn_clearVistaFormNotification(vcmn_alsoClearFromRequestForm) {
    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    if (vcmn_alsoClearFromRequestForm == true) {
        VCCM.USDHelper.CallUSDAction("Shared New Request", "RunXrmCommand", "function go(){Xrm.Page.ui.clearFormNotification('SAVEVISTA');} go();");
    }
}