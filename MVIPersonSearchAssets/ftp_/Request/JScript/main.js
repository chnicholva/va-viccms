///// <reference path="XrmPage-vsdoc.js" />
///// <reference path="XrmPageTemplate.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />

//global form variables
var currentUserDetails = {
    SystemUserId: "",
    Name: "",
    ConfigurationName: "",
    roles: [],
    teams: []
};

var owningUserDetails = {
    SystemUserId: "",
    Name: "",
    ConfigurationName: "",
    roles: [],
    teams: []
};

var multipleReasonsForRequestGUID = "156db634-ee0d-e511-8108-00155d14711e";
var otherReasonForRequestGUID = "136db634-ee0d-e511-8108-00155d14711e";
var narcoticRenewalRFRName = "Medication - Renewal Narcotic";
var narcoticRefillRFRName = "Medication - Refill Narcotic";
var nonNarcoticRenewalRFRName = "Medication - Renewal Non-Narcotic";
var nonNarcoticRefillRFRName = "Medication - Refill Non-Narcotic";
var _retrievedSettings = null,
    _ICN = null,
    _nationalId = null,
    _notProd = true,
    _veteranPACTTeam = null,
    _veteranFacilityId = null,
    _veteranFacilityIdName = null,
    _MHVID = null,
    _loadedOn = new Date(),
    _labsUseSecureAPI = true;

function formResolved() {
    debugger;
    Xrm.Page.data.refresh(save);
}

function error_handler(message, source, lineno, colno, error) {
    this.console.log('Error caught: ' + message + ' ' + error + ' ' + source);
    return false;
}
function recurseChildWindows(w) {
    if (w !== undefined && w != null && w.frames != null) {
        for (var i = 0; i < w.frames.length; i++) {
            w.onerror = error_handler;
            recurseChildWindows(w.frames[i]);
        }
    }
}
function form_onLoad() {
    debugger;
    window.top.onerror = error_handler;
    recurseChildWindows(window.top);
    var formType = Xrm.Page.ui.getFormType();
    var reasonData = getCurrentReasonForRequest();
    if (reasonData != null) {
        var reasonForRequestValue = reasonData.reason;
        var otherReasonControl = Xrm.Page.getControl("ftp_otherreason");
        if (otherReasonControl != null) {
            var require = reasonForRequestValue.toLowerCase() == "other" || reasonForRequestValue.toLowerCase() == "multiple reasons for request";
            otherReasonControl.setVisible(require);
            otherReasonControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
        }
    }

    //fire USD event to fire form_onLoadWithParameters with parameters from USD $Context
    window.open("http://event?eventname=RequestFormReady");
}

function getCurrentReasonForRequest() {
    var reasonData = null;

    var reasonForRequest = Xrm.Page.getAttribute("ftp_reasonforrequest");
    if (reasonForRequest != null) {
        var reasonForRequestValue = reasonForRequest.getValue();
        if (reasonForRequestValue != null) {
            reasonData = { reason: reasonForRequestValue[0].name, id: reasonForRequestValue[0].id };
        }
    }

    return reasonData;
}

function form_onLoadWithParameters(pICN, pVeteranPACTTeamName, pVeteranFacilityId, pVeteranFacilityIdName, pMHVID) {
    var thisOrgUrl = Xrm.Page.context.getClientUrl();
    _notProd = thisOrgUrl.indexOf("ftp.dev") > 1 || thisOrgUrl.indexOf("INTFTP") > 1 || thisOrgUrl.indexOf("QAFTP") > 1 || thisOrgUrl.indexOf("PREFTP") > 1;

    _ICN = !!pICN ? pICN : null;
    _nationalId = !!_ICN ? _ICN.substring(0, 10) : null;
    retrieveActiveSettings();

    //always save ftp_hungupinqueue value
    var hungUpInQueueAttr = Xrm.Page.getAttribute("ftp_ishungupinqueue_bool");
    if (!!hungUpInQueueAttr) hungUpInQueueAttr.setSubmitMode("always");

    //populate currentUser & Owner role/team arrays, then run ProcessRequest()
    retrieveCurrentUserAndOwnerTeamsAndRoles(ProcessRequest);

    _veteranPACTTeam = !!pVeteranPACTTeamName ? pVeteranPACTTeamName : null;
    _veteranFacilityId = !!pVeteranFacilityId ? pVeteranFacilityId : null;
    _veteranFacilityIdName = !!pVeteranFacilityIdName ? pVeteranFacilityIdName : null;
    /*as of 3/26/18, all MHV functionality has been deprecated.  pMHVID (and therefore _MHVID) will always be empty.*/
    _MHVID = !!pMHVID ? pMHVID : null;
    ftp_assigneetype_onChange();
}

function retrieveCurrentUserAndOwnerTeamsAndRoles(pCallbackFunction) {
    //populates the global currentUserDetails and owningUserDetails objects and then performs pCallbackFunction();
    if (typeof pCallbackFunction == "function") {
        //clear out original objects first
        currentUserDetails = {
            SystemUserId: "",
            Name: "",
            ConfigurationName: "",
            roles: [],
            teams: []
        };

        owningUserDetails = {
            SystemUserId: "",
            Name: "",
            ConfigurationName: "",
            roles: [],
            teams: []
        };

        var retrievedUsers = [];
        var queryOptions = "$expand=teammembership_association,systemuserroles_association";
        queryOptions += "&$select=SystemUserId,FullName,msdyusd_USDConfigurationId,teammembership_association/Name,teammembership_association/TeamId,systemuserroles_association/RoleId,systemuserroles_association/Name";
        queryOptions += "&$filter=SystemUserId eq guid'" + Xrm.Page.context.getUserId() + "'";
        var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
        if (!!ownerValue && ownerValue[0].entityType == "systemuser") {
            queryOptions += " or SystemUserId eq guid'" + ownerValue[0].id + "'";
        }
        SDK.REST.retrieveMultipleRecords(
            "SystemUser",
            queryOptions,
            function (retrievedRecords) {
                if (!!retrievedRecords && retrievedRecords.length > 0) retrievedUsers = retrievedUsers.concat(retrievedRecords);
            },
            errorHandler,
            function () {
                for (var i = 0, l = retrievedUsers.length; i < l; i++) {
                    var thisUser = retrievedUsers[i];

                    //populate currentUserDetails object
                    if (cleanGUID(thisUser.SystemUserId) == cleanGUID(Xrm.Page.context.getUserId())) {
                        currentUserDetails.SystemUserId = thisUser.SystemUserId;
                        currentUserDetails.Name = thisUser.FullName;
                        currentUserDetails.ConfigurationName = (!!thisUser.msdyusd_USDConfigurationId) ? thisUser.msdyusd_USDConfigurationId.Name : "";
                        //roles
                        for (var j = 0, m = thisUser.systemuserroles_association.results.length; j < m; j++) {
                            var thisRole = thisUser.systemuserroles_association.results[j];
                            currentUserDetails.roles.push({ RoleId: thisRole.RoleId, Name: thisRole.Name });
                        }
                        //teams
                        for (var j = 0, m = thisUser.teammembership_association.results.length; j < m; j++) {
                            var thisTeam = thisUser.teammembership_association.results[j];
                            currentUserDetails.teams.push({ TeamId: thisTeam.TeamId, Name: thisTeam.Name });
                        }
                    }

                    //populate owningUserDetails object
                    if (!!ownerValue && ownerValue[0].entityType == "systemuser" && cleanGUID(thisUser.SystemUserId) == cleanGUID(ownerValue[0].id)) {
                        owningUserDetails.SystemUserId = thisUser.SystemUserId;
                        owningUserDetails.Name = thisUser.FullName;
                        owningUserDetails.ConfigurationName = (!!thisUser.msdyusd_USDConfigurationId) ? thisUser.msdyusd_USDConfigurationId.Name : "";
                        //roles
                        for (var j = 0, m = thisUser.systemuserroles_association.results.length; j < m; j++) {
                            var thisRole = thisUser.systemuserroles_association.results[j];
                            owningUserDetails.roles.push({ RoleId: thisRole.RoleId, Name: thisRole.Name });
                        }
                        //teams
                        for (var j = 0, m = thisUser.teammembership_association.results.length; j < m; j++) {
                            var thisTeam = thisUser.teammembership_association.results[j];
                            owningUserDetails.teams.push({ TeamId: thisTeam.TeamId, Name: thisTeam.Name });
                        }
                    }
                }

                //perform whatever callback we wanted
                pCallbackFunction();
            }//end retrieveMultipleRecords(users) OnComplete function
        );
    }
    else {
        alert("Your callback parameter must be a function");
    }
}

function errorHandler(error) {
    alert(error.message);
}

function ProcessRequest() {
    try {
        ShowHideTabByUserRoleName();
        ExecuteBusinessRules();
        ShowHideResolveCheckbox();

        populateStartDate();
        Xrm.Page.getAttribute("ftp_callbacknumber").fireOnChange();
        parentChild();
        setOriginalPriority();
        saveID();
    }
    catch (e) { alert(e.message); }
}

function ShowHideTabByUserRoleName() {
    writeToConsole("begin ShowHideTabByUserRoleName()");
    //debugger;
    var showPharmacyValidationAndActionTakenTabs =
        userHasRole("FtP Pharmacy", currentUserDetails.roles) ||
        userHasRole("FtP Manager", currentUserDetails.roles) ||
        userHasRole("FtP Supervisor", currentUserDetails.roles) ||
        userHasRole("FTP Facility Admin", currentUserDetails.roles) ||
        userHasRole("FtP LIP", currentUserDetails.roles);

    //NOTE: other code in ftp_reasonforrequest_onChange may hide this tab
    Xrm.Page.ui.tabs.get("Tab_PharmacyValidation").setVisible(showPharmacyValidationAndActionTakenTabs);
    writeToConsole("Pharmacy Validation Tab visible? " + Xrm.Page.ui.tabs.get("Tab_PharmacyValidation").getVisible());

    //Refresh Tabbed Control
    Xrm.Page.getControl('WebResource_HorizontalTabs').setSrc(Xrm.Page.getControl('WebResource_HorizontalTabs').getSrc());

    //Xrm.Page.ui.tabs.get("Tab_ActionTaken").setVisible(showPharmacyValidationAndActionTakenTabs);

    var disableFieldDueToPactRole = userHasRole("FtP LIP", currentUserDetails.roles);
    var fieldsToDisableForPactUsers = [
        "ftp_opiodagreementonfile",
        "ftp_udsonfile",
        "ftp_statedrugmonitoringreport",
        "ftp_spdmpstateonfile",
        "ftp_spdmpstate2",
        "ftp_subreasonid",
        "ftp_minorreasonid",
        "ftp_lastfilled",
        "ftp_quantitytaking",
        "ftp_pickupmethod",
        "ftp_rxnumber",
        "ftp_rxrefillquantity",
        "ftp_earlyrefillcomment",
        "ftp_trackingnumber",
        "ftp_ishungupinqueue_bool",
        "ftp_reassignmentreason_text",
        "ftp_downgradeexplanation_memo"
    ];
    for (var i = 0, l = fieldsToDisableForPactUsers.length; i < l; i++) {
        var control = Xrm.Page.getControl(fieldsToDisableForPactUsers[i]);
        if (!!control) {
            control.setDisabled(disableFieldDueToPactRole);
        }
    }
}

function ExecuteBusinessRules() {
    var formType = Xrm.Page.ui.getFormType();

    //Initialize
    var fieldList = [
        "ftp_minorreasonid",
        "ftp_lastfilled",
        "ftp_quantitytaking",
        "ftp_pickupmethod",
        "ftp_rxnumber",
        "ftp_rxrefillquantity",
        "ftp_earlyrefillcomment",
        "ftp_vacationstart",
        "ftp_vacationend",
        "ftp_trackingnumber"
    ];
    for (var i = 0, l = fieldList.length; i < l; i++) {
        var control = Xrm.Page.getControl(fieldList[i]);
        var value = control.getAttribute().getValue();
        control.getAttribute().setRequiredLevel("none");
        control.setVisible(!!value);
    }

    ftp_priority_onChange(); //see note in function

    //now address business rules, via onchange functions
    var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
    if (!!ownerValue) {
        var pharmacyBoolean = userIsOnTeam("Pharmacy", currentUserDetails.teams);
        var pactBoolean = userHasRole("FtP LIP", currentUserDetails.roles); //add check for PACT User team??

        ftp_reasonforrequest_onChange(pharmacyBoolean, pactBoolean, true);

        //Warm Transfer is visible to anyone if the owner is the Pharmacy team or a user on the Pharmacy team
        var showWarmTransfer = userIsOnTeam("Pharmacy", owningUserDetails.teams) || ownerIsTeam("Pharmacy", ownerValue);
        Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(showWarmTransfer);
    }
}

function ShowHideResolveCheckbox() {
    //deprecated
    return false;
}

function populateStartDate() {
    if (!(Xrm.Page.getAttribute("ftp_start").getValue()) || !(Xrm.Page.getAttribute("ftp_target").getValue())) {
        var today = new Date();
        var target = new Date();
        target = new Date(target.setDate(target.getDate() + 3));
        Xrm.Page.getAttribute("ftp_start").setValue(today);
        Xrm.Page.getAttribute("ftp_target").setValue(target);
    }
}

function formatTelephoneNumber(pContext) {
    //pass to new formatTelephoneNumberNANP function, for formatting according to North American Numbering Plan
    if (!!pContext) {
        var changedAttribute = pContext.getEventSource();
        if (!!changedAttribute) {
            var notificationName = changedAttribute.getName() + "_FORMATTINGERROR";
            Xrm.Page.ui.clearFormNotification(notificationName); //use form-level INFO notifications, so as not to block the save of the record
            var value = changedAttribute.getValue();
            if (!!value) {
                var formattedValue = value;
                try {
                    formattedValue = formatTelephoneNumberNANP(value);
                    changedAttribute.setValue(formattedValue);
                }
                catch (e) {
                    changedAttribute.setValue(formattedValue);
                    var message = "Error formatting value of " + Xrm.Page.getControl(changedAttribute.getName()).getLabel() + ": " + e.message;
                    Xrm.Page.ui.setFormNotification(message, "INFO", notificationName);
                }
            }
        }
    }
}

function formatTelephoneNumberNANP(pValue) {
    var formattedValue = pValue;
    if (!!pValue) {
        try {
            var tempValue = pValue.toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
            var leadingZerosWarning = "";
            while (tempValue[0] == "0") {
                tempValue = tempValue.substr(1, 99);
                leadingZerosWarning = ", or leading-zeros";
            }
            if (tempValue.length >= 10) {
                var NAOffset = tempValue.length > 10 && tempValue[0] == "1" ? 1 : 0;
                var countryCode = tempValue.substr(0, NAOffset);
                var countryCodeString = countryCode != "" ? countryCode + "-" : "";
                var areaCode = tempValue.substr(0 + NAOffset, 3);
                if (areaCode[0] == "0" || areaCode[0] == "1") { throw new Error("Area code (first 3-digit segment of a 10-digit number) cannot start with '0' or '1'"); }
                if (areaCode.length == 3) {
                    var centralOfficeCode = tempValue.substr(3 + NAOffset, 3);
                    if (centralOfficeCode[0] == "0" || centralOfficeCode[0] == "1") { throw new Error("Central office code (second 3-digit segment of a 10-digit number) cannot start with '0' or '1'"); }
                    if (centralOfficeCode[1] == "1" && centralOfficeCode[2] == "1") { throw new Error("Central office code (second 3-digit segment of a 10-digit number) cannot be in the format 'N11'"); }
                    if (centralOfficeCode.length == 3) {
                        var lineNumber = tempValue.substr(6 + NAOffset, 4);
                        if (lineNumber.length == 4) {
                            formattedValue = countryCodeString + [areaCode, centralOfficeCode, lineNumber].join("-");
                        }
                        else {
                            throw new Error(pValue + " is not a valid phone number");
                            //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                        }
                    }
                    else {
                        throw new Error(pValue + " is not a valid phone number");
                        //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                    }
                }
                else {
                    throw new Error(pValue + " is not a valid phone number");
                    //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                }
            }
            else {
                throw new Error(pValue + " is not a valid phone number");
                //throw new Error(pValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
            }
        }
        catch (e) {
            console.error(e.message);
            throw e;
        }
    }
    return formattedValue;
}

function parentChild() {
    var parentCaseControl = Xrm.Page.getControl("parentcaseid");
    if (!!parentCaseControl) {
        var parentCaseHasValue = !!parentCaseControl.getAttribute().getValue();
        parentCaseControl.setVisible(parentCaseHasValue);
        var parentNoteControl = Xrm.Page.getControl("tri_parentnote");
        if (!!parentNoteControl) parentNoteControl.setVisible(parentCaseHasValue);
    }
}

function setOriginalPriority() {
    try {
        var ftype = Xrm.Page.ui.getFormType();
        if (ftype > 1) {
            var initialPriority = Xrm.Page.getAttribute("ftp_priority").getInitialValue();
            if (!!initialPriority) Xrm.Page.getAttribute("ftp_originalpriority").setValue(initialPriority.toString());
        }
    }
    catch (e) {
        alert("There was an issue setting Original Priority. Error:" + e);
    }
}

function saveID() {
    //partially deprecated	
    var ftype = Xrm.Page.ui.getFormType();
    if (ftype !== 1) {
        //deprecated.  this Logic is already covered in ExecuteBusinessRules
        return;
        retrieveTeamsForUser(
            function (retrievedRecords) {
                for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                    if (retrievedRecords[i].Name == "Pharmacy") {
                        Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(false);
                        break;
                    }
                }
            }
        );

        /* if (location.href.indexOf("Outlook15White") != -1) {
            //USD Session
            window.open("http://event/?EventName=Saved Request&id=" + Xrm.Page.data.entity.getId() + "");
        } */
    }
    else {
        Xrm.Page.data.entity.save();
    }
}

function ftp_reasonforrequest_onChange(pPharmacyBoolean, pPactBoolean, pFiredOnLoadOrOnSave) {
    debugger;
    writeToConsole("begin ftp_reasonforrequest_onChange()");
    var formType = Xrm.Page.ui.getFormType();
    var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
    var pharmacyBoolean = (pPharmacyBoolean != null) ? pPharmacyBoolean : userIsOnTeam("Pharmacy", currentUserDetails.teams);
    var pactBoolean = (pPactBoolean != null) ? pPactBoolean : userHasRole("FtP LIP", currentUserDetails.roles);
    var firedOnLoadOrOnSave = (pFiredOnLoadOrOnSave != null) ? pFiredOnLoadOrOnSave : false;
    var reasonForRequestValue = Xrm.Page.getAttribute("ftp_reasonforrequest").getValue();
    var requestTitle = setTitleField();
    var reasonForRequestName = !!reasonForRequestValue ? reasonForRequestValue[0].name : "";
    var isNarcoticRefillOrRenewal = (reasonForRequestName == narcoticRenewalRFRName || reasonForRequestName == narcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(narcoticRenewalRFRName) > -1 || requestTitle.indexOf(narcoticRefillRFRName) > -1));
    var isNonNarcoticRefillOrRenewal = (reasonForRequestName == nonNarcoticRenewalRFRName || reasonForRequestName == nonNarcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(nonNarcoticRenewalRFRName) > -1 || requestTitle.indexOf(nonNarcoticRefillRFRName) > -1));

    //Check if Non-Narcotic request, if so disable age attribute
    if (isNonNarcoticRefillOrRenewal == true) {
        Xrm.Page.getControl("ftp_age").setDisabled(true);
    }

    /*adjust visibility of Pharmacy Validation tab and sections within it*/
    var pharmacyValidationTab = Xrm.Page.ui.tabs.get("Tab_PharmacyValidation");
    if (!!pharmacyValidationTab) {
        var showPharmacyValidationTab = (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && (pharmacyBoolean || pactBoolean);
        pharmacyValidationTab.setVisible(showPharmacyValidationTab);

        //sections
        /*
		"Section_NarcoticRenewalValidations"
		hide this section manually for non-narcotic renewals
		*/
        var narcoticRenewalValidationsSection = pharmacyValidationTab.sections.get("Section_NarcoticRenewalValidations");
        if (!!narcoticRenewalValidationsSection) {
            var visible = isNarcoticRefillOrRenewal && (pharmacyBoolean || pactBoolean);
            narcoticRenewalValidationsSection.setVisible(visible);
        }

        /*
		"Section_MedicationRenewalDetails", "Section_PharmacyRefillNarcoticEarly", "Section_PharmacyRefillNarcoticLost"
		These three sections' visiblity is handled automatically when we hide/show fields within them
		*/

    }

    //Refresh Tabbed Control	
    //Xrm.Page.getControl('WebResource_HorizontalTabs').setSrc(Xrm.Page.getControl('WebResource_HorizontalTabs').getSrc());
    var tabs = document.getElementById("header_WebResource_HorizontalTabs");
    if (tabs != null)
        tabs.src = tabs.src;

    var subReasonControl = Xrm.Page.getControl("ftp_subreasonid");
    if (!!subReasonControl) {
        var visible = (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && (pharmacyBoolean || pactBoolean);
        var require = (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && (pharmacyBoolean);
        subReasonControl.setVisible(visible);
        subReasonControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
        if (!firedOnLoadOrOnSave) subReasonControl.getAttribute().setValue(); //clear minor reason value if we reach this code from actually changing ftp_reasonforrequest
        ftp_subreasonid_onChange(pharmacyBoolean, pactBoolean, firedOnLoadOrOnSave);
    }

    //require fields in the "Required Validation for Narcotic Renewal" section if this is a narcotic renewal
    var narcoticRenewalFieldSet = [
        "ftp_opiodagreementonfile",
        "ftp_udsonfile",
        "ftp_statedrugmonitoringreport"
    ];
    for (var i = 0, l = narcoticRenewalFieldSet.length; i < l; i++) {
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal;
        Xrm.Page.getAttribute(narcoticRenewalFieldSet[i]).setRequiredLevel(require && formType > 1 ? "required" : "none");
    }
    Xrm.Page.getAttribute("ftp_statedrugmonitoringreport").fireOnChange();

	/*
	//GLM - 07/17/2019 - Commented out - using a hard-coded guid
    //require ftp_otherreason field if select reason for request is "Other"
    var otherReasonControl = Xrm.Page.getControl("ftp_otherreason");
    if (!!otherReasonControl) {
        var require = !!reasonForRequestValue && cleanGUID(reasonForRequestValue[0].id) == cleanGUID(otherReasonForRequestGUID);
        otherReasonControl.setVisible(require);
        otherReasonControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
    }
	*/

    var reasonData = getCurrentReasonForRequest();
    if (reasonData != null) {
        var reasonForRequestName = reasonData.reason;
        var otherReasonControl = Xrm.Page.getControl("ftp_otherreason");
        if (otherReasonControl != null) {
            var require = reasonForRequestName.toLowerCase() == "other" || reasonData.reason.toLowerCase() == "multiple reasons for request";
            otherReasonControl.setVisible(require);
            otherReasonControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
        }
    }

    //update this request's priority based on the priority value of the selected reason for request (if it's not "Multiple Reasons for Request")
    //only do this onChange of ftp_reasonforrequest, not onLoad or onSave
    //if (!firedOnLoadOrOnSave && !!reasonForRequestValue && cleanGUID(reasonForRequestValue[0].id) != cleanGUID(multipleReasonsForRequestGUID)) {
    if (!firedOnLoadOrOnSave && !!reasonForRequestValue && reasonData.reason.toLowerCase() != "multiple reasons for request") {
        var columnSet = "ftp_reasonforrequestId,ftp_reason,ftp_Priority,ftp_AutoResolve";
        SDK.REST.retrieveRecord(
            reasonForRequestValue[0].id,
            "ftp_reasonforrequest",
            columnSet,
            null,
            function (retrievedRecord) {
                if (!!retrievedRecord) {
                    if (!!retrievedRecord.ftp_Priority && !!retrievedRecord.ftp_Priority.Value) {
                        var priorityAttr = Xrm.Page.getAttribute("ftp_priority");
                        priorityAttr.setValue(retrievedRecord.ftp_Priority.Value);
                        priorityAttr.fireOnChange();
                    }

                    var canAutoResolve = retrievedRecord.ftp_AutoResolve == true;
                    /*fire a USD event under the Shared New Request hosted control to indicate if this Request record can be auto-resolved when the USD session closes.*/
                    var eventUrl = "http://event/?eventname=SetCanAutoResolveRequest&value=" + canAutoResolve.toString();
                    window.open(eventUrl);
                }
            },
            errorHandler
        );
    }

    /*begin non-narcotic fields logic*/
    Xrm.Page.ui.clearFormNotification("EGFR");
    var nonNarcoticDetailsTab = Xrm.Page.ui.tabs.get("Tab_NonNarcoticDetails");
    if (!!nonNarcoticDetailsTab) {
        var showNonNarcoticDetailsTab = (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && pharmacyBoolean;
        nonNarcoticDetailsTab.setVisible(showNonNarcoticDetailsTab);
    }

    //Refresh Tabbed Control	
    //Xrm.Page.getControl('WebResource_HorizontalTabs').setSrc(Xrm.Page.getControl('WebResource_HorizontalTabs').getSrc());
    var tabs = document.getElementById("header_WebResource_HorizontalTabs");
    if (tabs != null)
        tabs.src = tabs.src;

    var nonNarcoticRenewalDetailsFieldSet = [
        "ftp_rxtype",
        "ftp_methodofrequest",
        "ftp_age",
        "ftp_pcp",
        "ftp_calccrcl",
        "ftp_latestegfrresult"
    ];
    for (var i = 0; i < nonNarcoticRenewalDetailsFieldSet.length; i++) {
        var thisControl = Xrm.Page.getControl(nonNarcoticRenewalDetailsFieldSet[i]);
        if (!!thisControl) {
            var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal;
            var visible = require;
            thisControl.getAttribute().setRequiredLevel(require ? "required" : "none");
            thisControl.setVisible(visible);

            if (nonNarcoticRenewalDetailsFieldSet[i] == "ftp_latestegfrresult" && isNonNarcoticRefillOrRenewal && pharmacyBoolean) {
                queryLabsAPI();
            }
        }
    }
    /*temporary: don't require ftp_calccrcl yet, until a new web service is ready. kknab 5/2/17*/
    Xrm.Page.getControl("ftp_calccrcl").getAttribute().setRequiredLevel("none");

    Xrm.Page.getControl("ftp_latestegfrresult").getAttribute().setRequiredLevel("none"); //don't ever require ftp_latestegfrresult since its value is set via API.

    // Changed PCP to not required on 1/15/18 per story 581009
    Xrm.Page.getControl("ftp_pcp").getAttribute().setRequiredLevel("none");

    /*retrieve data from veteran and put into some fields on Request*/
    var customerValue = Xrm.Page.getAttribute("customerid").getValue();
    if (!!customerValue && customerValue[0].entityType == "contact") {
        var columnSet = "ftp_PrimaryCareProvider,ftp_DateofBirth";
        SDK.REST.retrieveRecord(
            customerValue[0].id,
            "Contact",
            columnSet,
            null,
            function (retrievedRecord) {
                if (!!retrievedRecord) {
			        /* 
					//removed on 5/5/17 per SME request
					if(!!retrievedRecord.ftp_PrimaryCareProvider){
						var pcpAttr = Xrm.Page.getAttribute("ftp_pcp");
						if(!!pcpAttr){
							pcpAttr.setValue(retrievedRecord.ftp_PrimaryCareProvider);
						}
					}
					*/
                    if (!!retrievedRecord.ftp_DateofBirth) {
                        var ageAttr = Xrm.Page.getAttribute("ftp_age");
                        if (!!ageAttr) {
                            ageAttr.setValue(getAge(retrievedRecord.ftp_DateofBirth).toString());
                        }
                    }
                }
            },
            errorHandler
        );
    }
    /*end non-narcotic fields logic*/

    var medicationPickerTab = Xrm.Page.ui.tabs.get("Tab_MedicationSelection");
    if (!!medicationPickerTab) {
        /*VCCM Release 5.0 Sprint 19, remove pharmacyBoolean condition from medicationPickerTab logic, to make the tab available to all users when appropriate Medication RFR is selected*/
        var visible = /*pharmacyBoolean &&*/ (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal);
        var tabState = visible ? "expanded" : "collapsed";
        medicationPickerTab.setDisplayState(tabState);
        medicationPickerTab.setVisible(visible);
        if (visible) {
            var medPickerWR = Xrm.Page.getControl("WebResource_MedicationPicker");
            if (!!medPickerWR) {
                medPickerWR.setSrc(medPickerWR.getSrc());
            }
        }
    }
    //Refresh Tabbed Control	
    //Xrm.Page.getControl('WebResource_HorizontalTabs').setSrc(Xrm.Page.getControl('WebResource_HorizontalTabs').getSrc());
    var tabs = document.getElementById("header_WebResource_HorizontalTabs");
    if (tabs != null)
        tabs.src = tabs.src;
}

function queryLabsAPI() {
    /*for non-narcotic refill/renewal scenarios, query the HDR Labs API for the latest eGFR lab result*/
    if (!!_ICN) {
        if (!!_retrievedSettings) {
            if (!!_retrievedSettings.ftp_DACURL) {
                Xrm.Page.ui.clearFormNotification("EGFR");
                Xrm.Page.ui.setFormNotification("Checking for latest eGFR lab result...", "INFO", "EGFR");
                var labsSecureURL = _retrievedSettings.ftp_DACURL + _retrievedSettings.ftp_LabsAPISecureURL;
                var labsSecureParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: _ICN }) }];
                if (_labsUseSecureAPI == true) {
                    if (!!_retrievedSettings.ftp_LabsAPISecureURL) {
                        CrmSecurityTokenEncryption(
                            labsSecureURL,
                            labsSecureParams,
                            Xrm.Page.context.getClientUrl(),
                            function (pError, pResponse) {
                                writeToConsole("inside flags secure API query success callback");
                                if (!!pError) {
                                    Xrm.Page.ui.setFormNotification("Error retrieving eGFR lab results.", "ERROR", "EGFR");
                                    setTimeout(function () { Xrm.Page.ui.clearFormNotification("EGFR"); }, 5000);
                                }
                                else if (pResponse.ErrorOccurred) {
                                    Xrm.Page.ui.setFormNotification("Error retrieving eGFR lab results.", "ERROR", "EGFR");
                                    setTimeout(function () { Xrm.Page.ui.clearFormNotification("EGFR"); }, 5000);
                                }
                                else {
                                    writeToConsole("inside Labs Secure API success callback");
                                    processLabsResponse(pResponse);
                                }
                            }
                        );
                    }
                }
                else {
                    if (!!_retrievedSettings.ftp_LabAPIURL) {
                        var apiUsingJson = _retrievedSettings.ftp_LabAPIURL.replace("xml", "json");
                        var fullUrl = _retrievedSettings.ftp_DACURL + apiUsingJson + _ICN + (!!_retrievedSettings.ftp_Filter ? _retrievedSettings.ftp_Filter : "");
                        writeToConsole("querying Labs API: " + fullUrl);
                        $.ajax({
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            datatype: "json",
                            url: fullUrl,
                            beforeSend: function (XMLHttpRequest) {
                                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                            },
                            success: function (response, textStatus, XmlHttpRequest) {
                                writeToConsole("inside Labs API ajax success callback");
                                processLabsResponse(response);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                Xrm.Page.ui.setFormNotification("Error retrieving eGFR lab results.", "ERROR", "EGFR");
                                setTimeout(function () { Xrm.Page.ui.clearFormNotification("EGFR"); }, 5000);
                            },
                            async: true,
                            cache: false
                        });
                    }
                }
            }
        }
        else {
            retrieveActiveSettings(queryLabsAPI);
        }
    }
    else {
        //cannot query HDR APIs without the ICN
    }
}
function processLabsResponse(pResponse) {
    if (!!pResponse && !!pResponse.Data && Array.isArray(pResponse.Data) && pResponse.Data.length > 0) {
        //strip out labs except eGFR types
        for (var i = pResponse.Data.length - 1; i > -1; i--) {
            var thisLab = pResponse.Data[i];
            if (thisLab.typeName.toLowerCase() != "egfr" && thisLab.typeName.toLowerCase() != "zzegfr" && thisLab.typeName.toLowerCase() != "egfr and creatinine" && thisLab.typeName.toLowerCase() != "creatinine and egfr") {
                pResponse.Data.splice(i, 1);
            }
        }

        if (pResponse.Data.length > 0) {
            //the results from the API are supposedly sorted by date already..., but sort by date again just in case.
            pResponse.Data.sort(SortObjectArray("-observed"));
            var latestResultString = pResponse.Data[0].result;
            var attr = Xrm.Page.getAttribute("ftp_latestegfrresult");
            if (!!attr) {
                attr.setValue(latestResultString);
                attr.setSubmitMode("always");
                Xrm.Page.ui.clearFormNotification("EGFR");
            }
        }
        else {
            Xrm.Page.ui.setFormNotification("Did not find any eGFR lab results.", "INFO", "EGFR");
            setTimeout(function () { Xrm.Page.ui.clearFormNotification("EGFR"); }, 5000);
        }
    }
    else {
        Xrm.Page.ui.setFormNotification("Did not find any eGFR lab results.", "INFO", "EGFR");
        setTimeout(function () { Xrm.Page.ui.clearFormNotification("EGFR"); }, 5000);
    }
}

function ftp_subreasonid_onChange(pPharmacyBoolean, pPactBoolean, pFiredOnLoadOrOnSave) {
    writeToConsole("begin ftp_subreasonid_onChange()");
    var formType = Xrm.Page.ui.getFormType();
    var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
    var pharmacyBoolean = (pPharmacyBoolean != null) ? pPharmacyBoolean : userIsOnTeam("Pharmacy", currentUserDetails.teams);
    var pactBoolean = (pPactBoolean != null) ? pPactBoolean : userHasRole("FtP LIP", currentUserDetails.roles);
    var firedOnLoadOrOnSave = (pFiredOnLoadOrOnSave != null) ? pFiredOnLoadOrOnSave : false;

    var reasonForRequestValue = Xrm.Page.getAttribute("ftp_reasonforrequest").getValue();
    var reasonForRequestName = !!reasonForRequestValue ? reasonForRequestValue[0].name : "";
    var requestTitle = Xrm.Page.getAttribute("title").getValue();
    var isNarcoticRefillOrRenewal = (reasonForRequestName == narcoticRenewalRFRName || reasonForRequestName == narcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(narcoticRenewalRFRName) > -1 || requestTitle.indexOf(narcoticRefillRFRName) > -1));
    var isNonNarcoticRefillOrRenewal = (reasonForRequestName == nonNarcoticRenewalRFRName || reasonForRequestName == nonNarcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(nonNarcoticRenewalRFRName) > -1 || requestTitle.indexOf(nonNarcoticRefillRFRName) > -1));
    var subReasonValue = Xrm.Page.getAttribute("ftp_subreasonid").getValue();
    var subReasonName = !!subReasonValue ? subReasonValue[0].name : "";
    var minorReasonValue = Xrm.Page.getAttribute("ftp_minorreasonid").getValue();
    var minorReasonName = !!minorReasonValue ? minorReasonValue[0].name : "";

    //check against pharmacyBoolean and subReasonName to decide whether to show each controls (and require if formType > 1)
    var minorReasonControl = Xrm.Page.getControl("ftp_minorreasonid");
    if (!!minorReasonControl) {
        if (!!subReasonValue) {
            var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
            var query = "ftp_subreasonSet(guid'" + subReasonValue[0].id + "')/ftp_ftp_subreason_ftp_minorreason?$select=ftp_name";

            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/" + query,
                beforeSend: function (XMLHttpRequest) {
                    //Specifying this header ensures that the results will be returned as JSON.
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data, textStatus, XmlHttpRequest) {
                    if (!!data) {
                        var visible = (pharmacyBoolean || pactBoolean) && (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && (data.d.results.length > 0);
                        var require = (pharmacyBoolean) && (isNarcoticRefillOrRenewal || isNonNarcoticRefillOrRenewal) && (data.d.results.length > 0);
                        minorReasonControl.setVisible(visible);
                        minorReasonControl.getAttribute().setRequiredLevel(require/* && formType > 1 */ ? "required" : "none");
                        if (!firedOnLoadOrOnSave) minorReasonControl.getAttribute().setValue(); //clear minor reason value if we reach this code from actually changing ftp_subreasonid
                        ftp_minorreasonid_onChange(pharmacyBoolean);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error retrieving minor reasons for selected sub reason: " + errorThrown);
                },
                async: true,
                cache: false
            });
        }
        else {
            minorReasonControl.setVisible(false);
            minorReasonControl.getAttribute().setRequiredLevel("none");
        }
    }

    var pickupMethodControl = Xrm.Page.getControl("ftp_pickupmethod");
    if (!!pickupMethodControl) {
        var visible = (pharmacyBoolean || pactBoolean) && ((isNarcoticRefillOrRenewal && (subReasonName == "Lost" || subReasonName == "Early" || subReasonName == "Stolen" || subReasonName == "Regular")) || isNonNarcoticRefillOrRenewal);
        var require = pharmacyBoolean && ((isNarcoticRefillOrRenewal && (subReasonName == "Lost" || subReasonName == "Early" || subReasonName == "Stolen" || subReasonName == "Regular")) || isNonNarcoticRefillOrRenewal);
        pickupMethodControl.setVisible(visible);
        pickupMethodControl.getAttribute().setRequiredLevel(require/* && formType > 1 //removed, kknab 5/2/17*/ ? "required" : "none");
    }

    var rxNumberControl = Xrm.Page.getControl("ftp_rxnumber");
    if (!!rxNumberControl) {
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && (subReasonName == "Lost");
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && (subReasonName == "Lost");
        rxNumberControl.setVisible(visible);
        rxNumberControl.getAttribute().setRequiredLevel(require ? "required" : "none");
    }

    var narcoticRefillQuantityControlArray = Xrm.Page.getAttribute("ftp_rxrefillquantity").controls.get(function (con) { return con.getParent().getName() == "Section_PharmacyRefillNarcoticLost"; });
    if (narcoticRefillQuantityControlArray.length == 1) {
        var narcoticRefillQuantityControl = narcoticRefillQuantityControlArray[0];
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && (subReasonName == "Lost");
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && (subReasonName == "Lost");
        narcoticRefillQuantityControl.setVisible(visible);
        narcoticRefillQuantityControl.getAttribute().setRequiredLevel(require ? "required" : "none");
    }

    var lastFilledControl = Xrm.Page.getControl("ftp_lastfilled");
    if (!!lastFilledControl) {
        var visible = (pharmacyBoolean || pactBoolean) && ((isNarcoticRefillOrRenewal && (subReasonName == "Lost" || subReasonName == "Early" || subReasonName == "Stolen" || subReasonName == "Regular")) || isNonNarcoticRefillOrRenewal);
        var require = pharmacyBoolean && ((isNarcoticRefillOrRenewal && (subReasonName == "Lost" || subReasonName == "Early" || subReasonName == "Stolen" || subReasonName == "Regular")) || isNonNarcoticRefillOrRenewal);
        lastFilledControl.setVisible(visible);
        lastFilledControl.getAttribute().setRequiredLevel(require ? "required" : "none");
    }

    var earlyNarcoticRefillCommentControl = Xrm.Page.getControl("ftp_earlyrefillcomment");
    if (!!earlyNarcoticRefillCommentControl) {
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && subReasonName == "Early";
        earlyNarcoticRefillCommentControl.setVisible(visible);
    }

    var nonNarcoticRenewalFieldSet1 = [
        "ftp_lastdirectionsonfile",
        "ftp_patientstatesdirections",
        "ftp_veteranchangeddose",
        "ftp_discusswithprovider_bool"
    ];
    for (var i = 0; i < nonNarcoticRenewalFieldSet1.length; i++) {
        var thisControl = Xrm.Page.getControl(nonNarcoticRenewalFieldSet1[i]);
        if (!!thisControl) {
            var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Requesting Renewal, Not on Profile" && minorReasonName == "Dose Change, Taking Regularly" || subReasonName == "Dose Changed / Taking Differently than Prescribed" || minorReasonName == "Directions changed from what is on file");
            var visible = require;
            thisControl.getAttribute().setRequiredLevel(require ? "required" : "none");
            thisControl.setVisible(visible);
        }
    }

    var discussWithProviderControl = Xrm.Page.getControl("ftp_discusswithprovider_bool");
    if (discussWithProviderControl && pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Requesting Renewal, Not on Profile" && minorReasonName == "Dose Change, Taking Regularly" || subReasonName == "Dose Changed / Taking Differently than Prescribed" || minorReasonName == "Directions changed from what is on file")) {
        Xrm.Page.getAttribute("ftp_discusswithprovider_bool").fireOnChange();
    }

    var otherTextControl = Xrm.Page.getControl("ftp_othertext");
    if (!!otherTextControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Other" || subReasonName == "Requesting Hold / Unhold");
        var visible = require;
        otherTextControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        otherTextControl.setVisible(visible);
    }

    var nonNarcoticLostOrStolenControl = Xrm.Page.getControl("ftp_lostorstolen");
    if (!!nonNarcoticLostOrStolenControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Replacement" && minorReasonName == "Medication Lost or Stolen";
        var visible = require;
        nonNarcoticLostOrStolenControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticLostOrStolenControl.setVisible(visible);
    }

    var nonNarcoticTrackingNumberControl = Xrm.Page.getControl("ftp_trackingnumber");
    if (!!nonNarcoticTrackingNumberControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Replacement" && minorReasonName == "Medication never arrived";
        var visible = require;
        nonNarcoticTrackingNumberControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticTrackingNumberControl.setVisible(visible);
    }

    var nonNarcoticDaysSupplyControl = Xrm.Page.getControl("ftp_dayssupply_text");
    if (nonNarcoticDaysSupplyControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Change in Refill Quantity";
        var visible = require;
        nonNarcoticDaysSupplyControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticDaysSupplyControl.setVisible(visible);
    }

    var nonNarcoticCopayReversalControl = Xrm.Page.getControl("ftp_othercopayreversal");
    if (!!nonNarcoticCopayReversalControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Medication Copay Reversal" && minorReasonName == "Other Reason for Reversal";
        var visible = require;
        nonNarcoticCopayReversalControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticCopayReversalControl.setVisible(visible);
    }

    var nonNarcoticReasonForStoppingControl = Xrm.Page.getControl("ftp_reasonforstopping");
    if (!!nonNarcoticReasonForStoppingControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Has Stopped Taking Medication";
        var visible = require;
        nonNarcoticReasonForStoppingControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticReasonForStoppingControl.setVisible(visible);
    }

    var nonNarcoticQuantityReportsTakingControl = Xrm.Page.getControl("ftp_quantityreportstaking");
    if (!!nonNarcoticQuantityReportsTakingControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal &&
            ((subReasonName == "Veteran Requesting Early Refill" && minorReasonName == "Requires Extra Medication") ||
                (subReasonName == "Requesting Partial Refill" && minorReasonName == "Requiring extra medication"));
        var visible = require;
        nonNarcoticQuantityReportsTakingControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticQuantityReportsTakingControl.setVisible(visible);
    }

    var methodOfRequestControl = Xrm.Page.getControl("ftp_methodofrequest");
    if (!!methodOfRequestControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal;
        var visible = require;
        require = subReasonName == "Requesting Hold / Unhold" ? false : true;
        methodOfRequestControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        methodOfRequestControl.setVisible(visible);
    }

    var ageControl = Xrm.Page.getControl("ftp_age");
    if (!!ageControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal;
        var visible = require;
        require = subReasonName == "Requesting Hold / Unhold" ? false : true;
        ageControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        ageControl.setVisible(visible);
    }

    var pcpControl = Xrm.Page.getControl("ftp_pcp");
    if (!!pcpControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal;
        var visible = require;
        require = subReasonName == "Requesting Hold / Unhold" ? false : true;
        //pcpControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        // Changed PCP to not required on 2/5/18 per story 581009
        pcpControl.getAttribute().setRequiredLevel("none");
        pcpControl.setVisible(visible);
    }
}

function ftp_minorreasonid_onChange(pPharmacyBoolean, pPactBoolean) {
    writeToConsole("begin ftp_minorreasonid_onChange()");
    var formType = Xrm.Page.ui.getFormType();
    var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
    var pharmacyBoolean = (pPharmacyBoolean != null) ? pPharmacyBoolean : userIsOnTeam("Pharmacy", currentUserDetails.teams);
    var pactBoolean = (pPactBoolean != null) ? pPactBoolean : userHasRole("FtP LIP", currentUserDetails.roles);
    var takingExtra = "Veteran has been requiring extra medication and is taking more than prescribed (Qty reported below)";
    var vacation = "Veteran leaving out of town for vacation, has no secure address to mail to";
    var notDelivered = "Not delivered by postal service. Lost in delivery stream (tracking # below)";
    var notLasting = "Veteran is taking within directions prescribed, but does not get quantity to last 28 or 30 days.";

    var reasonForRequestValue = Xrm.Page.getAttribute("ftp_reasonforrequest").getValue();
    var reasonForRequestName = !!reasonForRequestValue ? reasonForRequestValue[0].name : "";
    var requestTitle = Xrm.Page.getAttribute("title").getValue();
    var isNarcoticRefillOrRenewal = (reasonForRequestName == narcoticRenewalRFRName || reasonForRequestName == narcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(narcoticRenewalRFRName) > -1 || requestTitle.indexOf(narcoticRefillRFRName) > -1));
    var isNonNarcoticRefillOrRenewal = (reasonForRequestName == nonNarcoticRenewalRFRName || reasonForRequestName == nonNarcoticRefillRFRName) || (!!requestTitle && (requestTitle.indexOf(nonNarcoticRenewalRFRName) > -1 || requestTitle.indexOf(nonNarcoticRefillRFRName) > -1));
    var subReasonValue = Xrm.Page.getAttribute("ftp_subreasonid").getValue();
    var subReasonName = !!subReasonValue ? subReasonValue[0].name : "";
    var minorReasonValue = Xrm.Page.getAttribute("ftp_minorreasonid").getValue();
    var minorReasonName = !!minorReasonValue ? minorReasonValue[0].name : "";

    //check against pharmacyBoolean minorReasonName to decide whether to show each controls (and require if formType > 1)
    var quantityTakingControl = Xrm.Page.getControl("ftp_quantitytaking");
    if (!!quantityTakingControl) {
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && (minorReasonName == takingExtra || minorReasonName == vacation || minorReasonName == notLasting);
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && (minorReasonName == takingExtra || minorReasonName == vacation || minorReasonName == notLasting);
        quantityTakingControl.setVisible(visible);
        quantityTakingControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
    }

    var vacationStartControl = Xrm.Page.getControl("ftp_vacationstart");
    if (!!vacationStartControl) {
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && minorReasonName == vacation;
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && minorReasonName == vacation;
        vacationStartControl.setVisible(visible);
        vacationStartControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
    }

    var vacationEndControl = Xrm.Page.getControl("ftp_vacationend");
    if (!!vacationEndControl) {
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && minorReasonName == vacation;
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && minorReasonName == vacation;
        vacationEndControl.setVisible(visible);
        vacationEndControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
    }

    var narcoticTrackingNumberControlArray = Xrm.Page.getAttribute("ftp_trackingnumber").controls.get(function (con) { return con.getParent().getName() == "Section_PharmacyRefillNarcoticLost"; });
    if (narcoticTrackingNumberControlArray.length == 1) {
        var narcoticTrackingNumberControl = narcoticTrackingNumberControlArray[0];
        var visible = (pharmacyBoolean || pactBoolean) && isNarcoticRefillOrRenewal && minorReasonName == notDelivered;
        var require = pharmacyBoolean && isNarcoticRefillOrRenewal && minorReasonName == notDelivered;
        narcoticTrackingNumberControl.setVisible(visible);
        narcoticTrackingNumberControl.getAttribute().setRequiredLevel(require && formType > 1 ? "required" : "none");
    }

    /*begin non-narcotic fields logic*/
    var nonNarcoticRenewalFieldSet1 = [
        "ftp_lastdirectionsonfile",
        "ftp_patientstatesdirections",
        "ftp_veteranchangeddose",
        "ftp_discusswithprovider_bool"
    ];
    for (var i = 0; i < nonNarcoticRenewalFieldSet1.length; i++) {
        var thisControl = Xrm.Page.getControl(nonNarcoticRenewalFieldSet1[i]);
        if (!!thisControl) {
            var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Requesting Renewal, Not on Profile" && minorReasonName == "Dose Change, Taking Regularly" || subReasonName == "Dose Changed / Taking Differently than Prescribed" || minorReasonName == "Directions changed from what is on file");
            var visible = require;
            thisControl.getAttribute().setRequiredLevel(require ? "required" : "none");
            thisControl.setVisible(visible);
        }
    }

    var discussWithProviderControl = Xrm.Page.getControl("ftp_discusswithprovider_bool");
    if (discussWithProviderControl && pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Requesting Renewal, Not on Profile" && minorReasonName == "Dose Change, Taking Regularly" || subReasonName == "Dose Changed / Taking Differently than Prescribed" || minorReasonName == "Directions changed from what is on file")) {
        Xrm.Page.getAttribute("ftp_discusswithprovider_bool").fireOnChange();
    }

    var otherTextControl = Xrm.Page.getControl("ftp_othertext");
    if (!!otherTextControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && (subReasonName == "Other" || subReasonName == "Requesting Hold / Unhold");
        var visible = require;
        otherTextControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        otherTextControl.setVisible(visible);
    }
    var nonNarcoticLostOrStolenControl = Xrm.Page.getControl("ftp_lostorstolen");
    if (!!nonNarcoticLostOrStolenControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Replacement" && minorReasonName == "Medication Lost or Stolen";
        var visible = require;
        nonNarcoticLostOrStolenControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticLostOrStolenControl.setVisible(visible);
    }

    var nonNarcoticTrackingNumberControlArray = Xrm.Page.getAttribute("ftp_trackingnumber").controls.get(function (con) { return con.getParent().getName() == "Section_NonNarcoticReplacement"; });
    if (nonNarcoticTrackingNumberControlArray.length == 1) {
        var nonNarcoticTrackingNumberControl = nonNarcoticTrackingNumberControlArray[0];
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Replacement" && minorReasonName == "Medication never arrived";
        var visible = require;
        nonNarcoticTrackingNumberControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticTrackingNumberControl.setVisible(visible);
    }

    var nonNarcoticCopayReversalControl = Xrm.Page.getControl("ftp_othercopayreversal");
    if (!!nonNarcoticCopayReversalControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal && subReasonName == "Requesting Medication Copay Reversal" && minorReasonName == "Other Reason for Reversal";
        var visible = require;
        nonNarcoticCopayReversalControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticCopayReversalControl.setVisible(visible);
    }

    var nonNarcoticQuantityReportsTakingControl = Xrm.Page.getControl("ftp_quantityreportstaking");
    if (!!nonNarcoticQuantityReportsTakingControl) {
        var require = pharmacyBoolean && isNonNarcoticRefillOrRenewal &&
            ((subReasonName == "Veteran Requesting Early Refill" && minorReasonName == "Requires Extra Medication") ||
                (subReasonName == "Requesting Partial Refill" && minorReasonName == "Requiring extra medication"));
        var visible = require;
        nonNarcoticQuantityReportsTakingControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        nonNarcoticQuantityReportsTakingControl.setVisible(visible);
    }
    /*end non-narcotic fields logic*/
}

function ownerid_onChange(pContext) {
    var attr = Xrm.Page.getAttribute("ownerid");
    if (!!attr) {
        attr.setSubmitMode("always");
        var ownerValue = attr.getValue();
        if (!!ownerValue && cleanGUID(ownerValue[0].id) == cleanGUID(Xrm.Page.context.getUserId())) {
            Xrm.Page.ui.setFormNotification("You own this request. Should you assign the request to someone else?", "WARNING", "assignedToSelf");
        }
        else {
            Xrm.Page.ui.clearFormNotification("assignedToSelf");
        }

        retrieveCurrentUserAndOwnerTeamsAndRoles(ExecuteBusinessRules);
    }
}

function ftp_statedrugmonitoringreport_onChange() {
    //100000000 positive
    //100000001 negative

    var reportValue = Xrm.Page.getAttribute("ftp_statedrugmonitoringreport").getValue();
    var requireState = userIsOnTeam("Pharmacy", currentUserDetails.teams) && !!reportValue && (reportValue == 100000000 || reportValue == 100000001);
    Xrm.Page.getAttribute("ftp_spdmpstateonfile").setRequiredLevel(requireState && Xrm.Page.ui.getFormType() > 1 ? "required" : "none");
}

function userHasRole(pRoleName, pRoleArray) {
    var result = false;
    for (var i = 0, l = pRoleArray.length; i < l; i++) {
        if (pRoleArray[i].Name.toLowerCase() == pRoleName.toLowerCase()) {
            result = true;
            break;
        }
    }
    return result;
}

function userIsOnTeam(pTeamName, pTeamArray) {
    var result = false;
    for (var i = 0, l = pTeamArray.length; i < l; i++) {
        if (pTeamArray[i].Name.toLowerCase() == pTeamName.toLowerCase()) {
            result = true;
            break;
        }
    }
    return result;
}

function ownerIsTeam(pTeamName, pOwnerValue) {
    var result = false;
    if (!!pTeamName && !!pOwnerValue) {
        result = pOwnerValue[0].entityType == "team" && pOwnerValue[0].name == pTeamName;
    }
    return result;
}

function form_onSave(pContext) {
    var saveMode = pContext.getEventArgs().getSaveMode();
    if (saveMode == 1 || saveMode == 70) {
        var recordId = Xrm.Page.data.entity.getId();
        if (!!recordId) {
            //check user/team assignment selection and then evaluate business rules AGAIN.
            retrieveCurrentUserAndOwnerTeamsAndRoles(ExecuteBusinessRules);
        }
    }

    //set title to match reason for request
    var newTitle = setTitleField();
}

function setTitleField(pReasonForRequestValue) {
    debugger;
    var reasonData = getCurrentReasonForRequest();
    if (reasonData != null) {
        var reasonForRequestValue = reasonData.reason;
        var otherReasonControl = Xrm.Page.getControl("ftp_otherreason");
        if (otherReasonControl != null) {
            if (reasonForRequestValue.toLowerCase() == "other" || reasonForRequestValue.toLowerCase() == "multiple reasons for request") {
                Xrm.Page.getAttribute("title").setValue(Xrm.Page.getAttribute("ftp_otherreason").getValue());
                return Xrm.Page.getAttribute("ftp_otherreason").getValue();
            } else {
                if (!(Xrm.Page.getAttribute("ftp_grouped").getValue())) { //not sure what ftp_grouped is, but left it in there anyway
                    Xrm.Page.getAttribute("title").setValue(reasonForRequestValue);
                    return reasonForRequestValue;
                }
            }
        }
    } else {
        return "";
    }
    /*
        var reasonForRequestValue = pReasonForRequestValue != undefined ? pReasonForRequestValue : Xrm.Page.getAttribute("ftp_reasonforrequest").getValue();
        if (!!reasonForRequestValue) {
            var cleanRFRId = cleanGUID(reasonForRequestValue[0].id);
            if (cleanRFRId == otherReasonForRequestGUID || cleanRFRId == multipleReasonsForRequestGUID) {
                Xrm.Page.getAttribute("title").setValue(Xrm.Page.getAttribute("ftp_otherreason").getValue());
                return Xrm.Page.getAttribute("ftp_otherreason").getValue();
            }
            else {
                if (!(Xrm.Page.getAttribute("ftp_grouped").getValue())) { //not sure what ftp_grouped is, but left it in there anyway
                    Xrm.Page.getAttribute("title").setValue(reasonForRequestValue[0].name);
                    return reasonForRequestValue[0].name;
                }
            }
        }
        else {
            return "";
        }
        */
}

function updateTitleOnSaveWithOtherText() {
    //deprecated
    return;
    var reasonForRequest = Xrm.Page.getAttribute("ftp_reasonforrequest").getValue();
    var grouped = Xrm.Page.getAttribute("ftp_grouped").getValue();
    var reasonForRequestGuid;
    if (reasonForRequest != null) {
        reasonForRequestGuid = cleanGUID(reasonForRequest[0].id);
    }
    if (reasonForRequestGuid != null) {
        if (reasonForRequestGuid == "136db634-ee0d-e511-8108-00155d14711e" || reasonForRequest[0].name == "Multiple Reasons for Request") {
            Xrm.Page.getAttribute("title").setValue(Xrm.Page.getAttribute("ftp_otherreason").getValue());
        } else if (!grouped) {
            Xrm.Page.getAttribute("title").setValue(reasonForRequest[0].name);
        }
    }
}

function cleanGUID(guid) {
    if (guid != null)
        return guid.replace(/[{}]/g, "").toLowerCase();
    else
        return null;
}

function collapseBusinessProcessBanner() {
    if (Xrm.Page.ui.process != null) {
        //Xrm.Page.ui.process.setDisplayState("collapsed");
        Xrm.Page.ui.process.setVisible(false);
    } else {
        setTimeout(collapseBusinessProcessBanner, 500);
    }
}

function hideRules() {
    //deprecated
    return false;
    try {
        var fType = Xrm.Page.ui.getFormType();
        var currentUser = Xrm.Page.context.getUserId();
        var SetName = "TeamMembershipSet";
        var filter = "SystemUserId";
        var cca = null;
        var pact = null;
        var tArray = [];
        var data = {};
        var d = {};

        var actionsTakenAtt = Xrm.Page.getAttribute("ftp_countofactionstaken_number");
        var aTaken = !!actionsTakenAtt ? Xrm.Page.getAttribute("ftp_countofactionstaken_number").getValue() : 0;

        var owner = Xrm.Page.getAttribute("ownerid").getValue();

        retrieveTeamsForUser(
            function (retrievedRecords) {
                for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                    var thisTeam = retrievedRecords[i];
                    if (thisTeam.Name == "LIP User" && !!aTaken && aTaken > 0 && (owner[0].name == "LIP User" || owner[0].id == currentUser)) Xrm.Page.getControl("ftp_resolved").setDisabled(false);
                    if (thisTeam.Name == "Pharmacy") {
                        Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(true);
                        if (!!aTaken && aTaken > 2 && owner[0].id == currentUser) Xrm.Page.getControl("ftp_isresolved").setDisabled(false);
                    }
                }
            }
        );
    }
    catch (e) {
        alert("Error in hideRules(): " + e);
    }
}

function hideActionTaken() {
    try {
        retrieveTeamsForUser(
            function (retrievedRecords) {
                for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                    var thisTeam = retrievedRecords[i];
                    if (thisTeam.Name == "CCA Team" || thisTeam.Name == "Pharmacy" || thisTeam.Name == "RN") {
                        Xrm.Page.ui.tabs.get("tab_8").setVisible(false);
                    }
                    else if (thisTeam.Name == "LIP Team") {
                        Xrm.Page.ui.tabs.get("tab_8").setVisible(true);
                    }
                }
            }
        );
    }
    catch (e) {
        alert("Error in hideActionTaken(): " + e);
    }
}

function ftp_priority_onChange() {
    //the ftp_downgradeexplanation_memo control is visible by default, and then hidden when not needed.
    //so fire this script onLoad and onChange of the ftp_priority attribute value
    //Do it this way because this multi-line text field acts weird if we hide it by default and then use script to show it
    var priorityAttr = Xrm.Page.getAttribute("ftp_priority");
    var downgradeMemoControl = Xrm.Page.getControl("ftp_downgradeexplanation_memo");
    if (!!downgradeMemoControl && !!priorityAttr) {
        var downgraded = priorityAttr.getValue() < priorityAttr.getInitialValue();
        var memoValue = downgradeMemoControl.getAttribute().getValue();

        //show the downgradeMemoControl to everyone if priority has been downgraded or if the memo already has a value
        downgradeMemoControl.setVisible(downgraded || !!memoValue);

        //require it if the user doing the downgrading is on the Pharmacy team
        downgradeMemoControl.getAttribute().setRequiredLevel(downgraded && userIsOnTeam("Pharmacy", currentUserDetails.teams) ? "required" : "none");
    }
}

function ftp_discusswithprovider_onChange() {
    var directionsByControl = Xrm.Page.getControl("ftp_directionsby");
    if (!!directionsByControl) {
        var require = Xrm.Page.getAttribute("ftp_discusswithprovider_bool").getValue() == true;
        var visible = require;
        directionsByControl.getAttribute().setRequiredLevel(require ? "required" : "none");
        directionsByControl.setVisible(visible);
    }
}

function saveHungUpInQueue() {
    //deprecated. merged into onLoad function
    return;
    try {
        Xrm.Page.getAttribute("ftp_ishungupinqueue_bool").setSubmitMode("always");
    }
    catch (e) {
        alert("There was an error saving the Hung Up In Queue status. Error:" + e);
    }
}

RetrieveMultipleEntitySync = function (EntitySetName, filter, Guid) {

    //This function will return a json object with every attribute from an entity for a single record synchronously 
    try {
        //Perform REST call
        var context = Xrm.Page.context;
        var serverUrl = context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Format Entity Guid
        var EntityIdnobracket = Guid.replace(/({|})/g, '');
        //Construct the JSON Query
        var selectString = "";
        if (filter !== "") { selectString = "?$filter=" + filter + " eq guid'" + EntityIdnobracket + "'"; }
        else { selectString = "(guid'" + EntityIdnobracket + "')?$select=*"; }

        var jsonQuery = serverUrl + ODATA_ENDPOINT + "/" + EntitySetName + selectString;

        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in RetrieveMultipleEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        //Return the data result
        return EntityData;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the RetrieveMultipleEntitySyncEntitySync function.  Error Detail Message: " + err);
    }
};

function retrieveActiveSettings(pCallbackFunction) {
    Xrm.Page.ui.clearFormNotification("WebServiceError");
    var retrievedRecords = [];
    var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
    var retrievedSettings = null;
    SDK.REST.retrieveMultipleRecords(
        "mcs_setting",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
        },
        errorHandler,
        function () {
            if (!!retrievedSettings) {
                _retrievedSettings = retrievedSettings;
                if (typeof pCallbackFunction == "function") {
                    pCallbackFunction();
                }
                if (!(retrievedSettings.hasOwnProperty("ftp_DACURL")) || !retrievedSettings.ftp_DACURL) {
                    var msg = "Configuration error: Active Settings record is missing some URLs; contact your system administrator.";
                    Xrm.Utility.alertDialog(
                        msg,
                        function () {
                            Xrm.Page.ui.setFormNotification(msg, "ERROR", "WebServiceError");
                        }
                    );
                    return;
                }
            }
            else {
                Xrm.Utility.alertDialog(
                    "Could not find Active Settings for this org; contact your system administrator.",
                    function () {
                        Xrm.Page.ui.setFormNotification("Could not find Active Settings for this org; contact your system administrator", "ERROR", "WebServiceError");
                    }
                );
            }
        }
    );
}

function enableTriageButton() {
    var TANTeam = false;
    try {
        var user = Xrm.Page.context.getUserId();
        var SetName = "TeamMembershipSet";
        var filter = "SystemUserId";
        var tArray = [];
        var data = {};
        var d = {};
        data = RetrieveMultipleEntitySync(SetName, filter, user);
        for (i = 0; i < data.d.results.length; i++) {
            tArray.push(data.d.results[i].TeamId);
        }
        for (i = 0; i < tArray.length; i++) {
            d = RetrieveMultipleEntitySync("TeamSet", "", tArray[i]);
            // d = RetrieveAllAttributesByEntitySync("TeamSet", tArray[i]);
            if (d.d.Name === "RN") {
                TANTeam = true;
            }
        }
    }
    catch (e) {
    }
    return TANTeam;
}

function ftp_assigneetype_onChange() {
    return;
    //not yet implemented
    try {
        var assigneeTypeAttr = Xrm.Page.getAttribute("ftp_assigneetype");
        if (!!assigneeTypeAttr) {
            pcmm_Enabled = !!_retrievedSettings ? _retrievedSettings.ftp_IsPCMMEnabled : true; //global variable defined in pcmm.js library
            var assigneeTypeText = assigneeTypeAttr.getText();
            var formType = Xrm.Page.ui.getFormType();
            var teamLookupControl = Xrm.Page.getControl("ftp_teamselected");
            if (!!teamLookupControl) {
                var require = formType == 2 && assigneeTypeText == "Team" && pcmmEnabled == false;
                var visible = formType == 2 && (assigneeTypeText == "Team" || (assigneeTypeText == "User" && pcmmEnabled == true));
                teamLookupControl.setRequiredLevel(require ? "required" : "none");
                teamLookupControl.setVisible(visible);

                //set custom FetchXML
            }

            var userLookupControl = Xrm.Page.getControl("ftp_userselected");
            if (!!userLookupControl) {
                var require = formType == 2 && assigneeTypeText == "User";
                var visible = require;
                userLookupControl.setRequiredLevel(require ? "required" : "none");
                userLookupControl.setVisible(visible);

                //set custom FetchXML
            }

            if (formType == 2) {







                var vetId = Xrm.Page.getAttribute("customerid").getValue()[0].id;
                var veteran = retrieveSingleVeteran(vetId);
                var vetFacility = veteran.d.ftp_FacilityId;
                var Pact = veteran.d.hasOwnProperty("ftp_PACTId") && !!veteran.d.ftp_PACTId ? veteran.d.ftp_PACTId.Name : "";
                var teams = retrieveTeams(Pact);

                for (i = 0; i < teams.d.results.length; i++) {
                    if (teams.d.results[i].Name === Pact) {
                        var vetPact = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Pharmacy") {
                        var pharm = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "RN") {
                        var tan = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Speciality") {
                        var specialty = teams.d.results[i];
                    }
                }
                if (assigneeTypeText == "User") {
                    setUserTeamFetch(vetFacility, vetPact, specialty, pharm);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(true);
                    Xrm.Page.getAttribute("ftp_userselected").setRequiredLevel("required");
                    //****************************
                    if (pcmmEnabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("none");
                        Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(false);
                    }
                    //****************************
                }
                if (assigneeTypeText == "Team") {
                    setTeamFetch(vetFacility, vetPact, pharm, tan);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(false);
                    //****************************
                    if (pcmmEnabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("required");
                    }
                    //****************************
                }
            }
            if (Xrm.Page.ui.getFormType() == 1) {
                /*
                these fields' business rule logic is handled elsewhere
                */
                //Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel("none");
                //Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel("none");
                //Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel("none");
            }
            else {

            }
        }
    }
    catch (e) {
        alert("Error in Request Assignment - dynamicAssignment function. Error" + e);
    }
}

function ftp_teamselected_onChange() {

}

function ftp_userselected_onChange() {

}

function retrieveTeamsForUser(CallBackParameter) {
    if (typeof CallBackParameter == "function") {
        var currentUserId = Xrm.Page.context.getUserId();
        var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        var query = "SystemUserSet(guid'" + currentUserId + "')/teammembership_association?$select=Name,TeamId";

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: oDataPath + query,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (!!data) CallBackParameter(data.d.results);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error retrieving teams for current user: " + errorThrown);
            },
            async: true,
            cache: false
        });
    }
    else {
        alert("Did not retrieve teams for current user.  CallBackParameter must be a function.");
        //CallBackParameter must be a function
    }
}

function tabComments_onTabStateChange(pContext) {
    //every time tabComments is expanded (and visible), refresh the CustomNotesWall web resource.
    if (!!pContext) {
        if (pContext.getEventSource().getVisible() == true && pContext.getEventSource().getDisplayState() == "expanded") {
            var wrControl = Xrm.Page.getControl("WebResource_CustomNotesWall");
            if (!!wrControl) {
                //wrControl.setSrc(wrControl.getSrc());
            }
        }
    }
}

function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function checkDirtyFields() {
    var msg = "Dirty fields since last save:";
    if (Xrm.Page.ui.getFormType() == 1) {
        msg += "\nIt's a new record...they're all dirty!";
    }
    else {
        var attributes = Xrm.Page.data.entity.attributes.get();
        for (var i in attributes) {
            if (attributes[i].getIsDirty()) msg += ("\n" + attributes[i].getName());
        }
    }
    alert(msg);
}
function getAge(pString) {
    var today = new Date();
    var birthDate = new Date(pString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
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
function SortObjectArray(pSortProperty) {
    var sortOrder = 1;
    if (pSortProperty[0] === "-") {
        sortOrder = -1;
        pSortProperty = pSortProperty.substr(1);
    }
    return function (a, b) {
        var result = (a[pSortProperty] < b[pSortProperty]) ? -1 : (a[pSortProperty] > b[pSortProperty]) ? 1 : 0;
        return result * sortOrder;
    };
}
function filterLookupByParentLookupFields(pTargetFieldName, pFieldMappings, pFilterType) {
    if (!!pTargetFieldName && !!pFieldMappings && Array.isArray(pFieldMappings) && pFieldMappings.length > 0) {
        var targetAttr = Xrm.Page.getAttribute(pTargetFieldName);
        if (!!targetAttr && targetAttr.getAttributeType() == "lookup") {
            if (pFieldMappings.length == 1) {
                var thisMapping = pFieldMappings[0];
                if (!!thisMapping.sourceField && !!thisMapping.targetAttribute) {
                    var sourceAttr = Xrm.Page.getAttribute(thisMapping.sourceField);
                    var functionName = "filter_" + pTargetFieldName + "_by_" + thisMapping.sourceField;
                    var filterName = "filter_" + pTargetFieldName + "_by_" + thisMapping.sourceField + "_FetchXML";
                    /*remove the previous reference to the filter_target_by_source function from the PreSearch event, before adding it back with the newer filter_target_by_source_FetchXML value.*/
                    targetAttr.controls.forEach(function (con, i) {
                        con.removePreSearch(window[functionName]);
                        console.log("removed preSearch event handler (" + functionName + ") from " + con.getName());
                    });
                    window[functionName] = function (pContext) { return; };
                    window[filterName] = null;
                    if (!!sourceAttr && sourceAttr.getAttributeType() == "lookup") {
                        var sourceAttrValue = sourceAttr.getValue();
                        if (!!sourceAttrValue) {
                            window[functionName] = function (pContext) {
                                console.log("inside " + functionName);
                                var thisFilter = window[filterName];
                                if (!!thisFilter) {
                                    console.log("found filter " + filterName + ": " + thisFilter);
                                    if (!!pContext && typeof pContext.getEventSource == "function" && typeof pContext.getEventSource().get_view == "function") {
                                        var con = pContext.getEventSource().get_view();
                                        con.addCustomFilter(thisFilter);
                                        console.log("added filter to " + con.getName());
                                    }
                                    else {
                                        //var attr = Xrm.Page.getAttribute(pTargetFieldName);
                                        //if (!!attr && attr.getAttributeType() == "lookup") {
                                        //    attr.controls.forEach(function (con, l) {
                                        //        con.addCustomFilter(thisFilter);
                                        //        console.log("added filter to " + con.getName());
                                        //    });
                                        //}
                                    }
                                }
                            };
                            var thisFilterXML = "<filter type='and'><condition attribute='" + thisMapping.targetAttribute + "' operator='eq' value='" + sourceAttrValue[0].id + "' uiname='" + sourceAttrValue[0].name + "' uitype='" + sourceAttrValue[0].entityType + "' /></filter>";
                            window[filterName] = thisFilterXML;
                            targetAttr.controls.forEach(function (con, k) {
                                con.addPreSearch(window[functionName]);
                                console.log("added preSearch event handler (" + functionName + ") to " + con.getName());
                            });
                        }
                    }
                    else {
                        /*source is not a lookup field*/
                    }
                }
            }
            else {
                var filterType = !!pFilterType ? pFilterType : "and";
                var concatenatedNames = "";
                pFieldMappings.forEach(function (thisMapping, i) { concatenatedNames += !!thisMapping.sourceField ? (thisMapping.sourceField + (i == pFieldMappings.length - 1 ? "" : filterType.toUpperCase())) : ""; });
                var functionName = "filter_" + pTargetFieldName + "_by_" + concatenatedNames;
                var filterName = "filter_" + pTargetFieldName + "_by_" + concatenatedNames + "_FetchXML";
                /*remove the previous reference to the filter_target_by_source function from the PreSearch event, before adding it back with the newer filter_target_by_source_FetchXML value.*/
                targetAttr.controls.forEach(function (con, i) {
                    con.removePreSearch(window[functionName]);
                    console.log("removed preSearch event handler (" + functionName + ") from " + con.getName());
                });
                window[functionName] = function (pContext) { return; };
                window[filterName] = null;

                //build the filter
                var conditions = [];
                pFieldMappings.forEach(function (thisMapping, k) {
                    if (!!thisMapping.sourceField && !!thisMapping.targetAttribute) {
                        var sourceAttr = Xrm.Page.getAttribute(thisMapping.sourceField);
                        if (!!sourceAttr && sourceAttr.getAttributeType() == "lookup") {
                            var sourceAttrValue = sourceAttr.getValue();
                            if (!!sourceAttrValue) {
                                var thisCondition = "<condition attribute='" + thisMapping.targetAttribute + "' operator='eq' value='" + sourceAttrValue[0].id + "' uiname='" + sourceAttrValue[0].name + "' uitype='" + sourceAttrValue[0].entityType + "' />";
                                conditions.push(thisCondition);
                            }
                        }
                        else {
                            /*source is not a lookup field*/
                        }
                    }
                });
                var thisFilterXML = "<filter type='" + (conditions.length == 1 ? "and" : filterType) + "'>";
                conditions.forEach(function (thisCondition, c) { thisFilterXML += thisCondition; });
                thisFilterXML += "</filter>";

                //if we built a filter with 1 or more conditions, add the customFilter to the preSearch event of the target attribute
                if (thisFilterXML != "<filter type='" + filterType + "'></filter>") {
                    window[functionName] = function (pContext) {
                        console.log("inside " + functionName);
                        var thisFilter = window[filterName];
                        if (!!thisFilter) {
                            console.log("found filter " + filterName + ": " + thisFilter);
                            if (!!pContext && typeof pContext.getEventSource == "function" && typeof pContext.getEventSource().get_view == "function") {
                                var con = pContext.getEventSource().get_view();
                                con.addCustomFilter(thisFilter);
                                console.log("added filter to " + con.getName());
                            }
                            else {
                                //var attr = Xrm.Page.getAttribute(pTargetFieldName);
                                //if (!!attr && attr.getAttributeType() == "lookup") {
                                //    attr.controls.forEach(function (con, l) {
                                //        con.addCustomFilter(thisFilter);
                                //        console.log("added filter to " + con.getName());
                                //    });
                                //}
                            }
                        }
                    };
                    window[filterName] = thisFilterXML;
                    targetAttr.controls.forEach(function (con, m) {
                        con.addPreSearch(window[functionName]);
                        console.log("added preSearch event handler (" + functionName + ") to " + con.getName());
                    });
                }
            }
        }
        else {
            /*target is missing or is not a lookup field */
        }
    }
}