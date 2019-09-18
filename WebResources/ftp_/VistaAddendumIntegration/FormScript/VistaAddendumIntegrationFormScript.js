//VistaAddendumIntegrationFormScript.js
//Contains variables and functions used by the CRM Form and Ribbon
//Requires jQuery loaded on the CRM Form

//Static Variables
var vadi_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vadi_serverUrl = Xrm.Page.context.getClientUrl();

//var vadi_VistaUsersURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VistaUsers/1.0/json/ftpCRM/john/smith/1234?noFilter=true';  //OLD MANUAL DEV URL
var vadi_VistaUsersURLbase = '';
//var vadi_AddSignersUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VIA/AddSigners/1.0/json';  //OLD MANUAL DEV URL
var vadi_AddSignersUrl = '';
//var vadi_CreateAddendumUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VIA/CreateAddendum/1.0/json';  //OLD MANUAL DEV URL
var vadi_CreateAddendumUrl = '';
//var vadi_SignNoteUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VIA/SignNote/1.0/json';  //OLD MANUAL DEV URL
var vadi_SignNoteUrl = '';

//Production Environment Indicator
var vadi_IsProductionEnvironment = false;

//Word Wrap Line Limit
var vadi_WordWrapLimit = 75;

//Additional Signers Data
var vadi_AddlSignersNameArray = null;
var vadi_AddlSignersIenArray = null;
var vadi_localStorageVarName = "";

//Intialize LoginControl Dependecies if they exist
function vcmn_initViaDropdownControls() {
    //Initialize VIA DropDown Controls
    //Function is triggered by The VistA Login Control
    try {
        Xrm.Page.getControl("WebResource_AddendumSignerSearch").setSrc(Xrm.Page.getControl("WebResource_AddendumSignerSearch").getSrc());
    }
    catch (err) {
        alert('Addendum VIA Login Function Error(vcmn_initViaDropdownControls): ' + err.message);
    }
}

function vadi_launchAddendumSignerSearch() {
    try {
        //Refresh the web resource URL
        var vadi_AddendumSignerSearchURL = Xrm.Page.getControl('WebResource_AddendumSignerSearch').getSrc();
        Xrm.Page.getControl('WebResource_AddendumSignerSearch').setSrc(vadi_AddendumSignerSearchURL);
        //Prep the tab
        if (Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').getVisible() == false) {
            Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').getDisplayState() != 'expanded') {
            Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setDisplayState('expanded');
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setFocus();
    }
    catch (err) {
        alert('Addendum Signer Search Ribbon Function Error(vadi_launchAddendumSignerSearch): ' + err.message);
    }
}

function vadi_newAddendumLoad() {
    try {
        //GET CRM SETTINGS WEB SERVICE URLS
        var vadi_conditionalFilter = "(mcs_name eq 'Active Settings')";
        vadi_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_VistaUsersAPIURL, ftp_IsProductionEnvironment, ftp_VIAAdditionalSignersURL, ftp_VIACreateAddendumURL, ftp_VIASignNoteURL', vadi_conditionalFilter, 'mcs_name', 'asc', 0, vadi_newAddendumLoad_response);
    }
    catch (err) {
        //Display Error
        alert('Addendum Form Load Script Function Error(vadi_newAddendumLoad): ' + err.message);
    }
}

function vadi_newAddendumLoad_response(vadi_settingData, vadi_lastSkip) {
    try {
        //vadi_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var vadi_DacUrl = null;
        var vadi_VistaUserApiUrl = null;
        var vadi_ViaAddlSignersApiUrl = null;
        var vadi_ViaCreateAddendumApiUrl = null;
        var vadi_ViaSignNoteApiUrl = null;

        for (var i = 0; i <= vadi_settingData.d.results.length - 1; i++) {
            //Get info
            if (vadi_settingData.d.results[i].ftp_DACURL != null) { vadi_DacUrl = vadi_settingData.d.results[i].ftp_DACURL; }
            if (vadi_settingData.d.results[i].ftp_VistaUsersAPIURL != null) { vadi_VistaUserApiUrl = vadi_settingData.d.results[i].ftp_VistaUsersAPIURL; }
            if (vadi_settingData.d.results[i].ftp_IsProductionEnvironment != null) { vadi_IsProductionEnvironment = vadi_settingData.d.results[i].ftp_IsProductionEnvironment; }
            if (vadi_settingData.d.results[i].ftp_VIAAdditionalSignersURL != null) { vadi_ViaAddlSignersApiUrl = vadi_settingData.d.results[i].ftp_VIAAdditionalSignersURL; }
            if (vadi_settingData.d.results[i].ftp_VIACreateAddendumURL != null) { vadi_ViaCreateAddendumApiUrl = vadi_settingData.d.results[i].ftp_VIACreateAddendumURL; }
            if (vadi_settingData.d.results[i].ftp_VIASignNoteURL != null) { vadi_ViaSignNoteApiUrl = vadi_settingData.d.results[i].ftp_VIASignNoteURL; }
            break;
        }

        if (vadi_DacUrl != null && vadi_VistaUserApiUrl != null) {
            //Construct full web service URL
            vadi_VistaUsersURLbase = vadi_DacUrl + vadi_VistaUserApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VISTA USERS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
        if (vadi_DacUrl != null && vadi_ViaAddlSignersApiUrl != null) {
            //Construct full web service URL
            vadi_AddSignersUrl = vadi_DacUrl + vadi_ViaAddlSignersApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VIA ADDITIONAL SIGNERS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }

        if (vadi_DacUrl != null && vadi_ViaCreateAddendumApiUrl != null) {
            //Construct full web service URL
            vadi_CreateAddendumUrl = vadi_DacUrl + vadi_ViaCreateAddendumApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VIA CREATE ADDENDUM SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }

        if (vadi_DacUrl != null && vadi_ViaSignNoteApiUrl != null) {
            //Construct full web service URL
            vadi_SignNoteUrl = vadi_DacUrl + vadi_ViaSignNoteApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VIA SIGN NOTE SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
    }
    catch (err) {
        alert('Addendum Form Load Script Function Error(vadi_newAddendumLoad_response): ' + err.message);
    }
}

function vadi_ribbonButtonSaveToVistA() {
    try {
        debugger
        //Check the value of the Integration Status Field, if = 'OK', stop and exit this script
        var vadi_integrationStatus = Xrm.Page.getAttribute('ftp_integrationstatus').getValue();
        if (vadi_integrationStatus == 'OK') { return false; }

        //Check for additional signers, if they exist, the signers must be in sync with matching Session variables
        vadi_AddlSignersNameArray = null;
        vadi_AddlSignersIenArray = null;

        var vadi_selectedSigners = Xrm.Page.getAttribute('ftp_selectedsigners').getValue();
        if (vadi_selectedSigners != null && vadi_selectedSigners != '') {
            //Additional Signers exist in CRM, verify session variables
            var vadi_selectedArray = vadi_selectedSigners.split('~~~');
            var vadi_selectedArrayRecordCount = vadi_selectedArray.length;
            if (vadi_selectedArrayRecordCount > 1) {
                vadi_AddlSignersNameArray = vadi_selectedArray;
            }

            var vadi_selectedIENArray = '';
            var vadi_selectedIENArrayRecordCount = 0;
            var vadi_addendumId = Xrm.Page.data.entity.getId();  //Used to be progressNoteId

            var vadi_arrayMismatch = false;

            //Get Note's Browser Local Storage Values
            if (vadi_addendumId != null && vadi_addendumId != '') {
                vadi_localStorageVarName = "PN" + vadi_addendumId;
                var vadi_localStorageStringValue = localStorage.getItem(vadi_localStorageVarName);
                if (vadi_localStorageStringValue != null && vadi_localStorageStringValue != '') {
                    vadi_selectedIENArray = vadi_localStorageStringValue.split('~~~');
                    vadi_selectedIENArrayRecordCount = vadi_selectedIENArray.length;
                    if (vadi_selectedIENArrayRecordCount > 1) {
                        vadi_AddlSignersIenArray = vadi_selectedIENArray;
                    }
                }
            }
            //Compare CRM signer array length with LocalStorage array length
            if (vadi_selectedArrayRecordCount != vadi_selectedIENArrayRecordCount) { vadi_arrayMismatch = true; }

            if (vadi_arrayMismatch == true) {
                alert("The count of Additional Signers selected in CRM, does not match the count of Additional Signers in VISTA!\n\nPlease remove all the additional signers on this Addemdum and perform the selection process again!\n\nThis addendum cannot be integrated with VISTA/CPRS until this has been resolved.");
                return false;
            }
        }

        var pFacilityCode = Xrm.Page.getAttribute('ftp_facilityid');
        if (!pFacilityCode ||
            !pFacilityCode.getValue()) {
            alert("Did not find facility associated with additional signers. Facility must be provided");
            return false;
        }
        var creds = tryGetCreds(pFacilityCode.getValue());

        ////Check if VIA Login cookie exist (not expired)
        //var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
        //if (vadi_ViaLoginCookie == "") {
        //    alert("Your VISTA session has expired. In order to integrate an addendum, you must be logged into VISTA!");
        //    Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
        //    Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
        //    return false;
        //}

        //Save the current CRM data
        Xrm.Page.data.entity.save();
        //Display YELLOW Progress....
        Xrm.Page.ui.setFormNotification("Verifying addendum data, please wait..", "INFO", "SAVEVISTA");

        var vadi_confirmSaveToVista = confirm('Are you sure you want to save this addendum to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the addendum will automatically be marked as completed and you will be prompted to exit the record!');
        if (vadi_confirmSaveToVista == false) {
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Get VistA Note Id to relate addedndum to existing note in VistA
        var vadi_vistaNoteId = Xrm.Page.getAttribute('ftp_vistanoteid').getValue();
        if (vadi_vistaNoteId == null || vadi_vistaNoteId == '') {
            alert('The VistA Note Id field does not have a value, the addendum cannot be created in VistA/CPRS!');
            Xrm.Page.getControl('ftp_vistanoteid').setFocus();
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Get Addendum Note Text
        var vadi_addendumText = Xrm.Page.getAttribute('description').getValue();
        if (vadi_addendumText == null || vadi_addendumText == '') {
            alert('The Note field does not have text, the addendum cannot be created in VistA/CPRS!');
            Xrm.Page.getControl('description').setFocus();
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Get user data
        var vadi_crmUserId = Xrm.Page.getAttribute('ownerid').getValue();
        var vadi_userDomainId = '';
        var vadi_userFirstName = '';
        var vadi_userLastName = '';
        var vadi_userMiddleName = '';
        var vadi_userSiteId = '';

        if (vadi_crmUserId != null) {
            //Verify the owner type
            if (vadi_crmUserId[0].entityType != 'systemuser') {
                alert('The addendum owner must be an individual user and not a team, the addendum cannot be created in VistA/CPRS!');
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                return false;
            }

            var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'DomainName, FirstName, LastName, MiddleName, ftp_FacilitySiteId', vadi_crmUserId[0].id);
            if (vadi_userData != null) {
                if (vadi_userData.d.DomainName != null) { vadi_userDomainId = vadi_userData.d.DomainName; }
                if (vadi_userData.d.FirstName != null) { vadi_userFirstName = vadi_userData.d.FirstName; }
                if (vadi_userData.d.LastName != null) { vadi_userLastName = vadi_userData.d.LastName; }
                if (vadi_userData.d.MiddleName != null) { vadi_userMiddleName = vadi_userData.d.MiddleName; }
                if (vadi_userData.d.ftp_FacilitySiteId != null) { vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id; }
            }
        }
        else {
            alert('Unable to verify the user account for the current author/owner assigned to this addendum, the addendum cannot be created in VistA/CPRS!');
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Verify that the current owner and the current user is the same person, if not do not proceed
        if ((vadi_crmUserId[0].id).toUpperCase() != (Xrm.Page.context.getUserId()).toUpperCase()) {
            alert('The current author/owner does not match the current CRM user, the addendum cannot be created in VistA/CPRS!');
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        var vadi_NoteUserTeam = "NONE";
        //Check Team membership
        if (vadi_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "PHARMACY"; }
        if (vadi_UserHasTeam("CCA Team", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "CCA"; }
        if (vadi_UserHasTeam("RN", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "TAN"; }
        //**TEMP, verify these team values that they are correct **FUTURE NEED**
        if (vadi_UserHasTeam("PACT User", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "PACT"; }
        if (vadi_UserHasTeam("MSA", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "MSA"; }
        if (vadi_UserHasTeam("Advanced MSA", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "MSA"; }
        if (vadi_UserHasTeam("LIP", Xrm.Page.context.getUserId())) { vadi_NoteUserTeam = "MSA"; }

        //Verify Team Value, that one has been assigned
        if (vadi_NoteUserTeam == "NONE") {
            alert('The current author/owner does not belong to a CRM team that can integrate addendums, the addendum cannot be created in VistA/CPRS!');
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }

        //Execute Integration
        vadi_executeVistaAddendumIntegration(vadi_vistaNoteId, vadi_addendumText, creds.eSig);
    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_ribbonButtonSaveToVistA): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_executeVistaAddendumIntegration(vadi_originalNoteId, vadi_noteDescription, vadi_eSignatureCode) {
    try {
        //Reformat Note Description as needed to handle long lines of text (WordWrap)
        var vadi_NoteText = vadi_noteDescription;
        var vadi_RevisedNoteText = "";

        //Do Breakdown of lines
        var vadi_TextLines = vadi_NoteText.split('\n');
        if (vadi_TextLines.length > 0) {
            //Reformat text
            for (var i = 0; i < vadi_TextLines.length; i++) {
                //Test for a long line
                if (vadi_TextLines[i].length > vadi_WordWrapLimit) {
                    //Break down line
                    var vadi_NewString = vadi_wordWrap(vadi_TextLines[i], vadi_WordWrapLimit, '\n');
                    //Add revised text back
                    vadi_RevisedNoteText = vadi_RevisedNoteText + vadi_NewString + "\n";  //Add back the CR/LF used to split on
                }
                else {
                    //Add text to new note
                    vadi_RevisedNoteText = vadi_RevisedNoteText + vadi_TextLines[i] + "\n"; //Add back the CR/LF used to split on
                }
            }
        }
        if (vadi_RevisedNoteText != "" && vadi_RevisedNoteText != null) {
            vadi_noteDescription = vadi_RevisedNoteText;
        }

        //Add list of additional signer names to Note Text if they exists
        if (vadi_AddlSignersNameArray != null && vadi_AddlSignersIenArray != null) {
            //Create text strings from additional signers array
            var vadi_SignerNames = "\nAdditional Note Signers\n" + "-----------------------------\n";
            for (var i = 0; i <= vadi_AddlSignersNameArray.length - 1; i++) {
                if (i >= 1) {
                    var vadi_singleSignerName = vadi_AddlSignersNameArray[i].split("___");
                    vadi_SignerNames = vadi_SignerNames + vadi_singleSignerName[1] + "\n";
                }
            }
            //Add to Note Description
            vadi_noteDescription = vadi_noteDescription + vadi_SignerNames;
        }

        var pFacilityCode = Xrm.Page.getAttribute('ftp_facilityid');
        var creds = tryGetCreds(pFacilityCode.getValue());

        //var vadi_userSiteId = "";
        //var vadi_UserSiteNo = "";
        //var vadi_duz = "";
        //var vadi_providername = "";

        //var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
        //if (vadi_userData != null) {
        //    if (vadi_userData.d.ftp_FacilitySiteId != null) {
        //        vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}

        ////Lookup the Facility/Site #
        //if (vadi_userSiteId != null && vadi_userSiteId != '') {
        //    var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode, ftp_FacilityCode_text', vadi_userSiteId);
        //    if (vadi_facilityData != null) {
        //        //if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
        //        if (vadi_facilityData.d.ftp_FacilityCode_text != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_FacilityCode_text; }
        //    }
        //}

        ////Check if VIA Login cookie exist (not expired)
        //var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
        //if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
        //    var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
        //    vadi_duz = vadi_cookiearray[0];
        //    vadi_providername = vadi_cookiearray[1];
        //}

        //Reformat Note Description for VIA addendum web service to handle line feed and carriage return
        //Replace all \n and \r occurrences with |
        vadi_noteDescriptionRevised = vadi_noteDescription.replace(/\n/g, "|");
        vadi_noteDescriptionRevised = vadi_noteDescriptionRevised.replace(/\r/g, "|");

        //Create the VIA Addendum Record
        var vadi_viaAddendum = new Object();
        vadi_viaAddendum.ProviderName = creds.providerName;
        vadi_viaAddendum.Duz = creds.duz;
        vadi_viaAddendum.LoginSiteCode = creds.siteCode;
        vadi_viaAddendum.Target = vadi_originalNoteId;
        vadi_viaAddendum.AddendumNote = vadi_noteDescriptionRevised;
        //vadi_viaAddendum.Criteria = "Criteria - Test of new attribute.";
        vadi_viaAddendum.Criteria = vadi_noteDescriptionRevised;

        var postData = {
            "Request": JSON.stringify(vadi_viaAddendum),
            "Api": "ftp_viacreateaddendumurl"
        };

        vialib_callAction("ftp_VEISCallout", postData,
            function (data) {

                var vadi_newdata = JSON.parse(data.Response);
                vadi_requestResponse = vadi_newdata.Data;
                vadi_executeVistaAddendumIntegration_response(null, vadi_requestResponse, vadi_noteDescription, vadi_eSignatureCode);
            },
            function (error) {
                vadi_executeVistaAddendumIntegration_response(errorThrown, null, vadi_noteDescription, vadi_eSignatureCode);
            }
        );
        //$.ajax({
        //    type: "POST",
        //    url: vadi_CreateAddendumUrl,
        //    data: JSON.stringify(vadi_viaAddendum),
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    success: function (data) {
        //        var vadi_newdata = data.Data;
        //        vadi_requestResponse = vadi_newdata;
        //        vadi_executeVistaAddendumIntegration_response(null, vadi_requestResponse, vadi_noteDescription, vadi_eSignatureCode);
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        //System Error
        //        vadi_executeVistaAddendumIntegration_response(errorThrown, null, vadi_noteDescription, vadi_eSignatureCode);
        //    },
        //    async: false,
        //    cache: false
        //});

    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_executeVistaAddendumIntegration): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_executeVistaAddendumIntegration_response(vadi_errorThrown, vadi_requestResponse, vadi_noteDescription, vadi_eSignatureCode) {
    try {
        //Process Integration Request Response
        if (vadi_errorThrown != null) {
            //Write Error
            Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
            Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vadi_errorThrown));
            Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
            Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
            alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            Xrm.Page.getControl('ftp_integrationerror').setFocus();
            Xrm.Page.data.entity.save();
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vadi_requestResponse[0].Fault == null) {
                //Verify that a Note Id was created for the addendum and that it is a number (not error message)
                if (isNaN(vadi_requestResponse[0].Text) == false) {
                    //Call Additional Signers & Finalize Addendum function
                    vadi_finalizeAddendumCreation("OK", vadi_requestResponse[0].Text, vadi_noteDescription, vadi_eSignatureCode)
                }
                else {
                    //Write Failure entry since the NoteId is not a number
                    Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                    Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationerror').setValue(vadi_requestResponse[0].Text);
                    Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                    Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                    Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
                    Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
                    alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                    Xrm.Page.getControl('ftp_integrationerror').setFocus();
                    Xrm.Page.data.entity.save();
                    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                    return false;
                }
            }
            else {
                //Write Failure entry
                Xrm.Page.getAttribute('ftp_integrationstatus').setValue('ERROR');
                Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationerror').setValue(vadi_requestResponse[0].Fault.Message);
                Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                Xrm.Page.getAttribute('ftp_addendumnoteid').setValue('');
                Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
                alert('The addendum creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                Xrm.Page.getControl('ftp_integrationerror').setFocus();
                Xrm.Page.data.entity.save();
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                return false;
            }
        }
    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_executeVistaAddendumIntegration_response): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_finalizeAddendumCreation(vadi_integrationStatus, vadi_integrationNoteId, vadi_noteDescription, vadi_eSignatureCode) {
    //The Addendum was sucessfully created in Vista/CPRS, add additional signers if needed
    try {
        //Determine if additional signers exists
        if (vadi_AddlSignersNameArray != null && vadi_AddlSignersIenArray != null) {
            //Get the current CRM User's assigned site/facility
            var vadi_userSiteId = "";
            var vadi_UserSiteNo = "";
            var vadi_duz = "";
            var vadi_providername = "";

            //var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            //if (vadi_userData != null) {
            //    if (vadi_userData.d.ftp_FacilitySiteId != null) {
            //        vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
            //    }
            //}

            ////Lookup the Facility/Site #
            //if (vadi_userSiteId != null && vadi_userSiteId != '') {
            //    var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vadi_userSiteId);
            //    if (vadi_facilityData != null) {
            //        if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
            //    }
            //}

            ////Check if VIA Login cookie exist (not expired)
            //var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
            //if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
            //    var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
            //    vadi_duz = vadi_cookiearray[0];
            //    vadi_providername = vadi_cookiearray[1];
            //}
            var pFacilityCode = Xrm.Page.getAttribute('ftp_facilityid');
            var creds = tryGetCreds(pFacilityCode.getValue());

            //Create text strings from additional signers array
            var vadi_SignerIEN = "";
            for (var i = 0; i <= vadi_AddlSignersIenArray.length - 1; i++) {
                if (i == 1) { vadi_SignerIEN = vadi_AddlSignersIenArray[i]; }
                if (i > 1) { vadi_SignerIEN = vadi_SignerIEN + " " + vadi_AddlSignersIenArray[i]; }
            }

            //Create the Additional Signers
            var vadi_viaSigners = new Object();
            vadi_viaSigners.ProviderName = creds.providerName;
            vadi_viaSigners.Duz = creds.duz;
            vadi_viaSigners.LoginSiteCode = creds.siteCode;
            vadi_viaSigners.Target = vadi_integrationNoteId;
            vadi_viaSigners.SupplementalParameters = vadi_SignerIEN;

            var postData = {
                "Request": JSON.stringify(vadi_viaSigners)
            };

            vialib_callAction("vccm_VIAAddSigner", postData,
                function (data) {
                    vadi_viaSignersResponse = JSON.parse(data.Response);

                    if (vadi_localStorageVarName != "" && vadi_localStorageVarName != null) {
                        //Clear existing session storage variable.
                        localStorage.removeItem(vadi_localStorageVarName);
                    }

                    addPrimarySignerESig(vadi_integrationStatus, vadi_integrationNoteId, vadi_noteDescription, vadi_eSignatureCode);
                },
                function (error) {
                    alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                }
            );
            //$.ajax({
            //    type: "POST",
            //    url: vadi_AddSignersUrl,
            //    data: JSON.stringify(vadi_viaSigners),
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    success: function (data) {
            //        vadi_viaSignersResponse = JSON.stringify(data.Data);
            //        //Test for Failure
            //        if (vadi_viaSignersResponse.ErrorOccurred == true) {
            //            alert("Error: Unable to add the additional signers selected to this addendum.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
            //        }
            //    },
            //    error: function (jqXHR, textStatus, errorThrown) {
            //        //System Error
            //        alert("Error: Unable to add the additional signers selected to this addendum.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
            //    },
            //    async: false,
            //    cache: false
            //});
        }
        else {
            addPrimarySignerESig(vadi_integrationStatus, vadi_integrationNoteId, vadi_noteDescription, vadi_eSignatureCode);
        }
    }

    catch (e) {

    }
}

function addPrimarySignerESig(vadi_integrationStatus, vadi_integrationNoteId, vadi_noteDescription, vadi_eSignatureCode) {
    try {
        //Add primary signer's e-signature
        if (vadi_eSignatureCode != null && vadi_eSignatureCode != '') {
            //Get the current CRM User's assigned site/facility
            var vadi_userSiteId = "";
            var vadi_UserSiteNo = "";
            var vadi_duz = "";
            var vadi_providername = "";

            //var vadi_userData = vadi_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
            //if (vadi_userData != null) {
            //    if (vadi_userData.d.ftp_FacilitySiteId != null) {
            //        vadi_userSiteId = vadi_userData.d.ftp_FacilitySiteId.Id;
            //    }
            //}

            ////Lookup the Facility/Site #
            //if (vadi_userSiteId != null && vadi_userSiteId != '') {
            //    var vadi_facilityData = vadi_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vadi_userSiteId);
            //    if (vadi_facilityData != null) {
            //        if (vadi_facilityData.d.ftp_facilitycode != null) { vadi_UserSiteNo = vadi_facilityData.d.ftp_facilitycode; }
            //    }
            //}

            ////Check if VIA Login cookie exist (not expired)
            //var vadi_ViaLoginCookie = vadi_getCookie("viasessionlink");
            //if (vadi_ViaLoginCookie != null && vadi_ViaLoginCookie != '') {
            //    var vadi_cookiearray = vadi_ViaLoginCookie.split("~~~~", 2);
            //    vadi_duz = vadi_cookiearray[0];
            //    vadi_providername = vadi_cookiearray[1];
            //}

            var pFacilityCode = Xrm.Page.getAttribute('ftp_facilityid');
            var creds = tryGetCreds(pFacilityCode.getValue());

            var vadi_viaSigners = new Object();
            vadi_viaSigners.ProviderName = creds.providerName;
            vadi_viaSigners.Duz = creds.duz;
            vadi_viaSigners.LoginSiteCode = creds.siteCode;
            vadi_viaSigners.NoteIEN = vadi_integrationNoteId;
            vadi_viaSigners.ESig = vadi_eSignatureCode;

            var postData = {
                "Request": JSON.stringify(vadi_viaSigners),
                "Api": "ftp_viasignnoteurl"
            };

            vialib_callAction("ftp_VEISCallout", postData,
                function (data) {

                    var vadi_newdata = JSON.parse(data.Response);
                    vadi_viaSignAddendumResponse = vadi_newdata.Data;

                    //Test for Failure
                    if (vadi_viaSignAddendumResponse.ErrorOccurred == true) {
                        alert("Error: Unable to sign the addendum using the e-Signature provided.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
                    }
                    else {
                        //Sucessful sign of note
                        Xrm.Page.getAttribute('ftp_issigned').setValue(true);
                        Xrm.Page.getAttribute('ftp_issigned').setSubmitMode('always');
                        Xrm.Page.getAttribute('ftp_signeddate').setValue(new Date());
                        Xrm.Page.getAttribute('ftp_signeddate').setSubmitMode('always');

                        //Perform standard form updates to signify completion
                        //Write Success entry
                        Xrm.Page.getAttribute('description').setValue(vadi_noteDescription);
                        Xrm.Page.getAttribute('description').setSubmitMode('always');
                        Xrm.Page.getAttribute('ftp_integrationstatus').setValue(vadi_integrationStatus);
                        Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
                        Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
                        Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                        Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                        Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                        Xrm.Page.getAttribute('ftp_addendumnoteid').setValue(vadi_integrationNoteId);
                        Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
                        Xrm.Page.getControl('ftp_integrationstatus').setFocus();
                        alert('The addendum creation in VistA/CPRS was successful, this addendum will now be marked as completed. \n\nPlease exit this addendum record after clicking OK to this prompt!');
                        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                        Xrm.Page.data.entity.save();
                    }
                },
                function (error) {
                    vadi_executeVistaAddendumIntegration_response(errorThrown, null, vadi_noteDescription, vadi_eSignatureCode);
                }
            );

            //$.ajax({
            //    type: "POST",
            //    url: vadi_SignNoteUrl,
            //    data: JSON.stringify(vadi_viaSignAddendum),
            //    contentType: "application/json; charset=utf-8",
            //    dataType: "json",
            //    success: function (data) {
            //        vadi_viaSignAddendumResponse = JSON.stringify(data.Data);
            //        //Test for Failure
            //        if (vadi_viaSignAddendumResponse.ErrorOccurred == true) {
            //            alert("Error: Unable to sign the addendum using the e-Signature provided.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
            //        }
            //        else {
            //            //Sucessful sign of note
            //            Xrm.Page.getAttribute('ftp_issigned').setValue(true);
            //            Xrm.Page.getAttribute('ftp_issigned').setSubmitMode('always');
            //            Xrm.Page.getAttribute('ftp_signeddate').setValue(new Date());
            //            Xrm.Page.getAttribute('ftp_signeddate').setSubmitMode('always');
            //        }
            //    },
            //    error: function (jqXHR, textStatus, errorThrown) {
            //        //System Error
            //        alert("Error: Unable to sign the addendum using the e-Signature provided.\n\nPlease review the addendum and signers in your Vista/CPRS application!");
            //    },
            //    async: false,
            //    cache: false
            //});
        }

        ////Perform standard form updates to signify completion
        ////Write Success entry
        //Xrm.Page.getAttribute('description').setValue(vadi_noteDescription);
        //Xrm.Page.getAttribute('description').setSubmitMode('always');
        //Xrm.Page.getAttribute('ftp_integrationstatus').setValue(vadi_integrationStatus);
        //Xrm.Page.getAttribute('ftp_integrationstatus').setSubmitMode('always');
        //Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
        //Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
        //Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
        //Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
        //Xrm.Page.getAttribute('ftp_addendumnoteid').setValue(vadi_integrationNoteId);
        //Xrm.Page.getAttribute('ftp_addendumnoteid').setSubmitMode('always');
        //Xrm.Page.getControl('ftp_integrationstatus').setFocus();
        //alert('The addendum creation in VistA/CPRS was successful, this addendum will now be marked as completed. \n\nPlease exit this addendum record after clicking OK to this prompt!');
        //Xrm.Page.ui.clearFormNotification("SAVEVISTA");
        //Xrm.Page.data.entity.save();
    }
    catch (err) {
        alert('Addendum Ribbon Function Error(vadi_finalizeAddendumCreation): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
    }
}

function vadi_UserHasTeam(teamName, userGuid) {
    try {
        var vadi_teamid = null;
        var vadi_currentUserId = userGuid;
        var vadi_conditionalFilter = "(Name eq '" + teamName + "')";
        var vadi_teamData = vadi_getMultipleEntityDataSync('TeamSet', 'TeamId', vadi_conditionalFilter, 'Name', 'asc', 0);
        if (vadi_teamData != null) {
            for (var i = 0; i <= vadi_teamData.d.results.length - 1; i++) {
                //Get Info
                if (vadi_teamData.d.results[i].TeamId != null) { vadi_teamid = vadi_teamData.d.results[i].TeamId; }
                break;
            }
        }
        //If Team exists, check if the current user is part of that team
        var vadi_teamMembershipId = null;
        if (vadi_teamid != null && vadi_currentUserId != null) {
            var vadi_conditionalFilter = "(TeamId eq (guid'" + vadi_teamid + "') and SystemUserId eq (guid'" + vadi_currentUserId + "'))";
            var vadi_teamMembershipData = vadi_getMultipleEntityDataSync('TeamMembershipSet', 'TeamId, SystemUserId,TeamMembershipId', vadi_conditionalFilter, 'TeamId', 'asc', 0);
            if (vadi_teamMembershipData != null) {
                for (var i = 0; i <= vadi_teamMembershipData.d.results.length - 1; i++) {
                    //Get Info
                    if (vadi_teamMembershipData.d.results[i].TeamMembershipId != null) { vadi_teamMembershipId = vadi_teamMembershipData.d.results[i].TeamMembershipId; }
                    break;
                }
            }
        }
        if (vadi_teamMembershipId != null) { return true; }

        //otherwise return false		
        return false;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the vadi_UserHasTeam function.  Error Detail Message: " + err);
    }
}

function vadi_getCookie(cname) {
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
        alert('Addendum Ribbon Function Error(vadi_getCookie): ' + err.message);
    }
}

function vadi_wordWrap(str, intWidth, strBreak, cut) {
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
        alert('Addendum Ribbon Function Error(vadi_wordWrap): ' + err.message);
    }
}


function vadi_executeCrmOdataGetRequest(vadi_jsonQuery, vadi_aSync, vadi_aSyncCallback, vadi_skipCount, vadi_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vadi_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vadi_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vadi_aSyncCallback* - specify the name of the return function to call upon completion (required if vadi_aSync = true.  Otherwise '')
    //*vadi_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vadi_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vadi_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vadi_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vadi_entityData = data;
                if (vadi_aSync == true) {
                    vadi_aSyncCallback(vadi_entityData, vadi_skipCount, vadi_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vadi_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + vadi_jsonQuery);
            },
            async: vadi_aSync,
            cache: false
        });
        return vadi_entityData;
    }
    catch (err) {
        alert('An error occured in the vadi_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vadi_getMultipleEntityDataAsync(vadi_entitySetName, vadi_attributeSet, vadi_conditionalFilter, vadi_sortAttribute, vadi_sortDirection, vadi_skipCount, vadi_aSyncCallback, vadi_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vadi_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vadi_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vadi_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vadi_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vadi_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vadi_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vadi_aSyncCallback* - is the name of the function to call when returning the result
    //*vadi_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vadi_jsonQuery = vadi_serverUrl + vadi_crmOdataEndPoint + '/' + vadi_entitySetName + '?$select=' + vadi_attributeSet + '&$filter=' + vadi_conditionalFilter + '&$orderby=' + vadi_sortAttribute + ' ' + vadi_sortDirection + '&$skip=' + vadi_skipCount;
        vadi_executeCrmOdataGetRequest(vadi_jsonQuery, true, vadi_aSyncCallback, vadi_skipCount, vadi_optionArray);
    }
    catch (err) {
        alert('An error occured in the vadi_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function vadi_getSingleEntityDataSync(vadi_entitySetName, vadi_attributeSet, vadi_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vadi_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vadi_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vadi_entityId* - is the Guid for the entity record

    try {
        var vadi_entityIdNoBracket = vadi_entityId.replace(/({|})/g, '');
        var vadi_selectString = '(guid' + "'" + vadi_entityIdNoBracket + "'" + ')?$select=' + vadi_attributeSet;
        var vadi_jsonQuery = vadi_serverUrl + vadi_crmOdataEndPoint + '/' + vadi_entitySetName + vadi_selectString;
        var vadi_entityData = vadi_executeCrmOdataGetRequest(vadi_jsonQuery, false, '', 0, null);
        return vadi_entityData;
    }
    catch (err) {
        alert('An error occured in the vadi_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function vadi_getMultipleEntityDataSync(vadi_entitySetName, vadi_attributeSet, vadi_conditionalFilter, vadi_sortAttribute, vadi_sortDirection, vadi_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*vadi_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vadi_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vadi_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vadi_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vadi_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vadi_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var vadi_jsonQuery = vadi_serverUrl + vadi_crmOdataEndPoint + '/' + vadi_entitySetName + '?$select=' + vadi_attributeSet + '&$filter=' + vadi_conditionalFilter + '&$orderby=' + vadi_sortAttribute + ' ' + vadi_sortDirection + '&$skip=' + vadi_skipCount;
        var vadi_entityData = vadi_executeCrmOdataGetRequest(vadi_jsonQuery, false, '', vadi_skipCount, null);
        return vadi_entityData;
    }
    catch (err) {
        alert('An error occured in the vadi_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function tryGetCreds(siteNo) {
    var creds;
    //Check if VIA Login cookie exist (not expired)
    var pnss_ViaLoginCookie = pnss_getCookie("viasessionlink");

    var pnss_ViaLoginData = null;

    if (pnss_ViaLoginCookie != "") {
        pnss_ViaLoginData = JSON.parse(pnss_ViaLoginCookie);

        for (var j = 0; j < pnss_ViaLoginData.length; j++) {
            if (pnss_ViaLoginData[j].siteCode == siteNo) {
                creds = pnss_ViaLoginData[j];
                break;
            }
        }
    }

    return creds;
}

function pnss_getCookie(cname) {
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
}