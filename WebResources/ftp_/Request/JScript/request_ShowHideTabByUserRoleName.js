//request_ShowHideTabByUserRoleName.js
//Contains functions used on the request form to show or hide tabs based on a user role
//Requires jQuery loaded on the CRM Form

//Static Variables
var request_serverUrl = Xrm.Page.context.getClientUrl();
var request_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";

function request_ShowHideTabByUserRoleName() {
    //This function is triggered on the form OnLoad Event on the Request Form
    //The tabs listed will be displayed only to those user who has at least one of the roles listed
    try {
        if (request_UserHasRole("FtP Pharmacy") || request_UserHasRole("FtP Manager") || request_UserHasRole("FtP Supervisor") || request_UserHasRole("FTP Facility Admin")) {
            //**Removed:  || request_UserHasRole("System Administrator")
            //Show the tabs
            Xrm.Page.ui.tabs.get("Tab_PharmacyValidation").setVisible(true);
            Xrm.Page.ui.tabs.get("Tab_ActionTaken").setVisible(true);
        }
        else {
            //Hide the tabs
            Xrm.Page.ui.tabs.get("Tab_PharmacyValidation").setVisible(false);
            Xrm.Page.ui.tabs.get("Tab_ActionTaken").setVisible(false);
        }
        if (request_UserHasRole("FtP PACT")) {
            //Show the tab
            Xrm.Page.ui.tabs.get("Tab_PharmacyValidation").setVisible(true);
            Xrm.Page.ui.tabs.get("Tab_ActionTaken").setVisible(true);

            //Disable Attributes
            Xrm.Page.getControl("ftp_opiodagreementonfile").setDisabled(true);
            Xrm.Page.getControl("ftp_udsonfile").setDisabled(true);
            Xrm.Page.getControl("ftp_statedrugmonitoringreport").setDisabled(true);
            Xrm.Page.getControl("ftp_spdmpstateonfile").setDisabled(true);
            Xrm.Page.getControl("ftp_spdmpstate2").setDisabled(true);
            Xrm.Page.getControl("ftp_subreasonid").setDisabled(true);
            Xrm.Page.getControl("ftp_minorreasonid").setDisabled(true);
            Xrm.Page.getControl("ftp_lastfilled").setDisabled(true);
            Xrm.Page.getControl("ftp_quantitytaking").setDisabled(true);
            Xrm.Page.getControl("ftp_pickupmethod").setDisabled(true);
            Xrm.Page.getControl("ftp_rxnumber").setDisabled(true);
            Xrm.Page.getControl("ftp_rxrefillquantity").setDisabled(true);
            Xrm.Page.getControl("ftp_earlyrefillcomment").setDisabled(true);
            Xrm.Page.getControl("ftp_trackingnumber").setDisabled(true);
            Xrm.Page.getControl("ftp_ishungupinqueue_bool").setDisabled(true);
            Xrm.Page.getControl("ftp_reassignmentreason_text").setDisabled(true);
            Xrm.Page.getControl("ftp_downgradeexplanation_memo").setDisabled(true);
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_ShowHideTabByUserRoleName function.  Error Detail Message: " + err);
    }
}

function request_ExecuteRequestBusinessRules() {
    //This function is triggered on the form OnLoad Event on the Request Form or by selected on_change attribute events
    //Change events to fire on attributes: ftp_subreasonid, ftp_minorreasonid, ftp_reasonforrequest
	var formType = Xrm.Page.ui.getFormType();
    try {
        //Get Current Attribute Values
        var request_ftp_subreasonid = Xrm.Page.getAttribute('ftp_subreasonid').getValue();
        var request_ftp_minorreasonid = Xrm.Page.getAttribute('ftp_minorreasonid').getValue();
        var request_ownerid = Xrm.Page.getAttribute('ownerid').getValue();
        var request_pharmacyTeam = request_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId());
        var request_pharmacyOwnerTeam = request_UserHasTeam("Pharmacy", request_ownerid[0].id);

        //Initializing: Hide fields used in logic below and set required to false
        Xrm.Page.getControl("ftp_minorreasonid").setVisible(false);
        Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_pickupmethod").setVisible(false);
        Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_rxnumber").setVisible(false);
        Xrm.Page.getAttribute("ftp_rxnumber").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_rxrefillquantity").setVisible(false);
        Xrm.Page.getAttribute("ftp_rxrefillquantity").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_earlyrefillcomment").setVisible(false);
        Xrm.Page.getControl("ftp_lastfilled").setVisible(false);
        Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_quantitytaking").setVisible(false);
        Xrm.Page.getAttribute("ftp_quantitytaking").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_vacationstart").setVisible(false);
        Xrm.Page.getAttribute("ftp_vacationstart").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_vacationend").setVisible(false);
        Xrm.Page.getAttribute("ftp_vacationend").setRequiredLevel("none");
        Xrm.Page.getControl("ftp_trackingnumber").setVisible(false);
        Xrm.Page.getAttribute("ftp_trackingnumber").setRequiredLevel("none");

        //If any of the listed fields has a value, then display it
        if (Xrm.Page.getAttribute("ftp_minorreasonid").getValue() != null) { Xrm.Page.getControl("ftp_minorreasonid").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_pickupmethod").getValue() != null) { Xrm.Page.getControl("ftp_pickupmethod").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_rxnumber").getValue() != null) { Xrm.Page.getControl("ftp_rxnumber").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_rxrefillquantity").getValue() != null) { Xrm.Page.getControl("ftp_rxrefillquantity").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_earlyrefillcomment").getValue() != null) { Xrm.Page.getControl("ftp_earlyrefillcomment").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_lastfilled").getValue() != null) { Xrm.Page.getControl("ftp_lastfilled").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_quantitytaking").getValue() != null) { Xrm.Page.getControl("ftp_quantitytaking").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_vacationstart").getValue() != null) { Xrm.Page.getControl("ftp_vacationstart").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_vacationend").getValue() != null) { Xrm.Page.getControl("ftp_vacationend").setVisible(true); }
        if (Xrm.Page.getAttribute("ftp_trackingnumber").getValue() != null) { Xrm.Page.getControl("ftp_trackingnumber").setVisible(true); }


        //***RULE 5-Set Required & Visibility by Reason
        if (request_ftp_subreasonid != null && request_ownerid != null) {
            if (request_ftp_subreasonid[0].name == "Lost" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                //current user isd member of team or owner=team and the owner is named pharmacy, 3-one owner is a user and the owner/user is member of pharamacy team.
                Xrm.Page.getControl("ftp_minorreasonid").setVisible(true);
                Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_pickupmethod").setVisible(true);
                Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_rxnumber").setVisible(true);
                Xrm.Page.getAttribute("ftp_rxnumber").setRequiredLevel("required");
                Xrm.Page.getControl("ftp_rxrefillquantity").setVisible(true);
                Xrm.Page.getAttribute("ftp_rxrefillquantity").setRequiredLevel("required");
                Xrm.Page.getControl("ftp_lastfilled").setVisible(true);
                Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel(formType > 1 ? "required" : "none");
            }
            else if (request_ftp_subreasonid[0].name == "Early" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                Xrm.Page.getControl("ftp_minorreasonid").setVisible(true);
                Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_pickupmethod").setVisible(true);
                Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_earlyrefillcomment").setVisible(true);
                Xrm.Page.getControl("ftp_lastfilled").setVisible(true);
                Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel(formType > 1 ? "required" : "none");
            }
            else if (request_ftp_subreasonid[0].name == "Stolen" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                Xrm.Page.getControl("ftp_minorreasonid").setVisible(true);
                Xrm.Page.getControl("ftp_lastfilled").setVisible(true);
                Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_pickupmethod").setVisible(true);
                Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel(formType > 1 ? "required" : "none");
            }
        }
        //***RULE 6-Required by Minor Reasons - Extra Meds
        if (request_ftp_minorreasonid != null && request_ownerid != null) {
            if (request_ftp_minorreasonid[0].name == "Veteran has been requiring extra medication and is taking more than prescribed (Qty reported below)" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                Xrm.Page.getControl("ftp_quantitytaking").setVisible(true);
                Xrm.Page.getAttribute("ftp_quantitytaking").setRequiredLevel(formType > 1 ? "required" : "none");
            }
        }
        //***RULE 7-Required for Minor Reasons - Vacation
        if (request_ftp_minorreasonid != null && request_ownerid != null) {
            if (request_ftp_minorreasonid[0].name == "Veteran leaving out of town for vacation, has no secure address to mail to" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                Xrm.Page.getControl("ftp_vacationstart").setVisible(true);
                Xrm.Page.getAttribute("ftp_vacationstart").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_vacationend").setVisible(true);
                Xrm.Page.getAttribute("ftp_vacationend").setRequiredLevel(formType > 1 ? "required" : "none");
                Xrm.Page.getControl("ftp_quantitytaking").setVisible(true);
                Xrm.Page.getAttribute("ftp_quantitytaking").setRequiredLevel(formType > 1 ? "required" : "none");
            }
        }
        //***RULE 8-Required Minor Reasons - LOST in mail
        if (request_ftp_minorreasonid != null && request_ownerid != null) {
            if (request_ftp_minorreasonid[0].name == "Not delivered by postal service. Lost in delivery stream (tracking # below)" && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
                Xrm.Page.getControl("ftp_trackingnumber").setVisible(true);
                Xrm.Page.getAttribute("ftp_trackingnumber").setRequiredLevel(formType > 1 ? "required" : "none");
            }
        }

        //*** NEW RULE - Make Downgrade required if owned by Pharmacy or user is member of Pharmacy team
        if (request_ownerid != null) {
            if (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true) {
                //*Disabled per Carols revision request 7/25/16 (Using existing function 'downgradeExplanation()')
                //Xrm.Page.getAttribute("ftp_downgradeexplanation_memo").setRequiredLevel("required");
            }
        }

        //*** NEW RULE - Warm Transfer is visible to anyone if the owner is Pharmacy
        if (request_ownerid != null) {
            if (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true) {
                Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(false);
            }
        }
        //*** NEW RULE - Veteran is taking
        if (request_ftp_minorreasonid != null && (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true)) {
            if (request_ftp_minorreasonid[0].name == "Veteran is taking within directions prescribed, but does not get quantity to last 28 or 30 days." && request_ownerid[0].name == "Pharmacy") {
                Xrm.Page.getControl("ftp_quantitytaking").setVisible(true);
                Xrm.Page.getAttribute("ftp_quantitytaking").setRequiredLevel(formType > 1 ? "required" : "none");
            }
        }

        //*** NEW RULE - Show Reason for renewal when reason for request is 'Medication - Refill Narcotic' (if owned by Pharmacy or user owner or curent user is member of Pharmacy team)
		//*** Added check for narcotic text in title for combo requests ***/
        if (request_ownerid != null) {
            if (/*request_ownerid[0].name == "Pharmacy" || */request_pharmacyTeam == true || request_pharmacyOwnerTeam == true) {
                var request_ftp_reasonforrequest = Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();
                var request_ftp_title = Xrm.Page.getAttribute('title').getValue();
                if (request_ftp_reasonforrequest != null) {
                    if (request_ftp_reasonforrequest[0].name == "Medication - Refill Narcotic" || (request_ftp_title != null && request_ftp_title.indexOf("Medication - Refill Narcotic") > -1)) {
                        Xrm.Page.getControl("ftp_subreasonid").setVisible(true);
						Xrm.Page.getAttribute("ftp_subreasonid").setRequiredLevel(formType > 1 ? "required" : "none");
					}
                }
            }
        }

    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_ExecuteRequestBusinessRules function.  Error Detail Message: " + err);
    }
}

function request_UserHasRole(roleName) {
    try {
        //Get CRM Context provided guid's for all user roles for this user
        var AllUserRoles = Xrm.Page.context.getUserRoles();
        for (var i = 0; i < AllUserRoles.length; i++) {
            var RoleId = AllUserRoles[i];
            //Get the Name of the Role
            var RoleNameData = request_getSingleEntityDataSync("RoleSet", "Name", RoleId);

            //Check Role Names returned if data -- Check using upper case
            if (RoleNameData != null) {
                //alert("Role Name is: " + RoleNameData.d.Name);
                if (RoleNameData.d.Name.toUpperCase() == roleName.toUpperCase()) {
                    //return true if user has this role			
                    return true;
                }
            }
        }
        //otherwise return false		
        return false;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_UserHasRole function.  Error Detail Message: " + err);
    }
}

function request_UserHasTeam(teamName, userGuid) {
    try {
        var request_teamid = null;
        var request_currentUserId = userGuid;
        var request_conditionalFilter = "(Name eq '" + teamName + "')";
        var request_teamData = request_getMultipleEntityDataSync('TeamSet', 'TeamId', request_conditionalFilter, 'Name', 'asc', 0);
        if (request_teamData != null) {
            for (var i = 0; i <= request_teamData.d.results.length - 1; i++) {
                //Get Info
                if (request_teamData.d.results[i].TeamId != null) { request_teamid = request_teamData.d.results[i].TeamId; }
                break;
            }
        }
        //If Team exists, check if the current user is part of that team
        var request_teamMembershipId = null;
        if (request_teamid != null && request_currentUserId != null) {
            var request_conditionalFilter = "(TeamId eq (guid'" + request_teamid + "') and SystemUserId eq (guid'" + request_currentUserId + "'))";
            var request_teamMembershipData = request_getMultipleEntityDataSync('TeamMembershipSet', 'TeamId, SystemUserId,TeamMembershipId', request_conditionalFilter, 'TeamId', 'asc', 0);
            if (request_teamMembershipData != null) {
                for (var i = 0; i <= request_teamMembershipData.d.results.length - 1; i++) {
                    //Get Info
                    if (request_teamMembershipData.d.results[i].TeamMembershipId != null) { request_teamMembershipId = request_teamMembershipData.d.results[i].TeamMembershipId; }
                    break;
                }
            }
        }
        if (request_teamMembershipId != null) { return true; }

        //otherwise return false		
        return false;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_UserHasTeam function.  Error Detail Message: " + err);
    }
}

function request_CheckAssignmentSave(econtext) {
    try {
        var request_eventArgs = econtext.getEventArgs();
        var request_saveMode = request_eventArgs.getSaveMode();
        if (request_saveMode == 1 || request_saveMode == 70) {
            //Fire on standard 'Save' and 'AutoSave' only

            //Determine previous ownerid
            var request_recordId = Xrm.Page.data.entity.getId();
            if (request_recordId.length > 10) {
                //Get the owner of the incident/request record
                var request_incidentData = request_getSingleEntityDataSync("IncidentSet", "OwnerId", request_recordId);
                if (request_incidentData != null) {
                    if (request_incidentData.d.OwnerId != null) {
                        var request_incidentOwnerId = request_incidentData.d.OwnerId.Id;
                        var request_formOwnerid = Xrm.Page.getAttribute('ownerid').getValue();
                        request_incidentOwnerId = request_incidentOwnerId.toUpperCase();
                        request_incidentOwnerId = request_incidentOwnerId.replace(/({|})/g, '');
                        request_formOwnerid = request_formOwnerid[0].id.toUpperCase();
                        request_formOwnerid = request_formOwnerid.replace(/({|})/g, '');
                        if (request_incidentOwnerId != request_formOwnerid) {
                            //The owner id has changed, proceed with executing Business Rules
                            request_ExecuteRequestBusinessRules();
                            adjustDowngradeExplanationControl();
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_CheckAssignmentSave function.  Error Detail Message: " + err);
    }
}

function request_EnableResolveButton() {
    //This is used to determine if the 'Resolve' button should be enabled on the request Ribbon based on the rules below
    try {
        var request_resolveOk = false;
        var request_countActionsTaken = 0;
        var request_countProgressNotes = 0;
        //Get Count values from current form
        if (Xrm.Page.getAttribute('ftp_countofactionstaken_number').getValue() != null) {
            if (Xrm.Page.getAttribute('ftp_countofactionstaken_number').getValue() != '') { request_countActionsTaken = Xrm.Page.getAttribute('ftp_countofactionstaken_number').getValue(); }
        }
        if (Xrm.Page.getAttribute('ftp_countofprogressnotes_number').getValue() != null) {
            if (Xrm.Page.getAttribute('ftp_countofprogressnotes_number').getValue() != '') { request_countProgressNotes = Xrm.Page.getAttribute('ftp_countofprogressnotes_number').getValue(); }
        }
        request_countActionsTaken = parseInt(request_countActionsTaken);
        request_countProgressNotes = parseInt(request_countProgressNotes);
        if (request_countActionsTaken >= 1 || request_countProgressNotes >= 1) {
            //Check User Roles
            if (request_UserHasTeam("Pharmacy", Xrm.Page.context.getUserId()) || request_UserHasTeam("TAN", Xrm.Page.context.getUserId()) || request_UserHasTeam("PACT User", Xrm.Page.context.getUserId())) {
                request_resolveOk = true;
            }
        }
        return request_resolveOk;
    }
    catch (err) {
        //Display Error
        //alert("An error occured in the request_EnableResolveButton function.  Error Detail Message: " + err);
        return request_resolveOk;
    }
}

function request_HideResolveCheckBox() {
    try {
        if (request_EnableResolveButton() == true) {
            Xrm.Page.getControl('ftp_isresolved').setDisabled(false);
        }
        else {
            Xrm.Page.getControl('ftp_isresolved').setDisabled(true);
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_HideResolveCheckBox function.  Error Detail Message: " + err);
    }
}


function request_executeCrmOdataGetRequest(request_jsonQuery, request_aSync, request_aSyncCallback, request_skipCount, request_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*request_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*request_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*request_aSyncCallback* - specify the name of the return function to call upon completion (required if request_aSync = true.  Otherwise '')
    //*request_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*request_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var request_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: request_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                request_entityData = data;
                if (request_aSync == true) {
                    request_aSyncCallback(request_entityData, request_skipCount, request_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in request_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + request_jsonQuery);
            },
            async: request_aSync,
            cache: false
        });
        return request_entityData;
    }
    catch (err) {
        alert('An error occured in the request_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function request_getSingleEntityDataSync(request_entitySetName, request_attributeSet, request_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*request_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*request_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*request_entityId* - is the Guid for the entity record

    try {
        var request_entityIdNoBracket = request_entityId.replace(/({|})/g, '');
        var request_selectString = '(guid' + "'" + request_entityIdNoBracket + "'" + ')?$select=' + request_attributeSet;
        var request_jsonQuery = request_serverUrl + request_crmOdataEndPoint + '/' + request_entitySetName + request_selectString;
        var request_entityData = request_executeCrmOdataGetRequest(request_jsonQuery, false, '', 0, null);
        return request_entityData;
    }
    catch (err) {
        alert('An error occured in the request_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function request_getMultipleEntityDataSync(request_entitySetName, request_attributeSet, request_conditionalFilter, request_sortAttribute, request_sortDirection, request_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*request_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*request_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*request_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*request_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*request_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*request_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var request_jsonQuery = request_serverUrl + request_crmOdataEndPoint + '/' + request_entitySetName + '?$select=' + request_attributeSet + '&$filter=' + request_conditionalFilter + '&$orderby=' + request_sortAttribute + ' ' + request_sortDirection + '&$skip=' + request_skipCount;
        var request_entityData = request_executeCrmOdataGetRequest(request_jsonQuery, false, '', request_skipCount, null);
        return request_entityData;
    }
    catch (err) {
        alert('An error occured in the request_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}