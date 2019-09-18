//reqrib_ButtonResolveRequest.js
//Contains functions used by the ribbon button for Resolve Request
//Requires jQuery loaded on the CRM Form

//Static Variables
var reqrib_serverUrl = Xrm.Page.context.getClientUrl();
var reqrib_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";

function reqrib_ResolveRequest() {
    debugger;
    //This function is triggered by the Resolve Request ribbon button
    try {
        //Check status of request
        if (Xrm.Page.getAttribute('statuscode').getValue() == 5 || Xrm.Page.ui.getFormType() == 3 || Xrm.Page.ui.getFormType() == 4 || Xrm.Page.getAttribute('ftp_isresolved').getValue() == true) {
            if (Xrm.Page.getAttribute('statuscode').getValue() == 5 || Xrm.Page.getAttribute('ftp_isresolved').getValue() == true) {
                alert("The current request is already Resolved!");
            }
            else {
                alert("You are not allowed to resolve this request because you do not own it. Please click OK, Refresh the form and Assign to Self before attempting to resolve again.");
            }
            return false;
        }

        //Get current request GUID
        var reqrib_requestId = Xrm.Page.data.entity.getId();
        if (reqrib_requestId == null || reqrib_requestId == "") {
            alert("The current request must be saved, before it can be resolved!");
            return false;
        }

        var reqrib_confirmResolveRequest = confirm('Are you sure you want to resolve this request.\nThis action cannot be cancelled!');
        if (reqrib_confirmResolveRequest == false) {
            return false;
        }

        //Get Request Statistics Id
        var reqrib_reqstatId = null;
        var reqrib_currentRequestData = reqrib_getSingleEntityDataSync('IncidentSet', 'ftp_RequestStatisticId', reqrib_requestId);
        if (reqrib_currentRequestData.d.ftp_RequestStatisticId != null) {
            reqrib_reqstatId = reqrib_currentRequestData.d.ftp_RequestStatisticId;
        }
        if (reqrib_reqstatId != null) { reqrib_reqstatId = reqrib_reqstatId.Id; }

        //Get count of actions taken and progress notes for the current request record
        var reqrib_actionCount = 0;
        var reqrib_progressNoteCount = 0;

        //Old Method below disabled
        /*
        var reqrib_currentRequestData = reqrib_getSingleEntityDataSync('IncidentSet', 'ftp_countofactionstaken_number, ftp_countofprogressnotes_number', reqrib_requestId);
        if (reqrib_currentRequestData.d.ftp_countofactionstaken_number != null) {
            reqrib_actionCount = reqrib_currentRequestData.d.ftp_countofactionstaken_number;
        }
        if (reqrib_currentRequestData.d.ftp_countofprogressnotes_number != null) {
            reqrib_progressNoteCount = reqrib_currentRequestData.d.ftp_countofprogressnotes_number;
        }
        */

        if (reqrib_reqstatId != null) {
            var reqrib_currentRequestData = reqrib_getSingleEntityDataSync('ftp_requeststatisticsSet', 'ftp_actiontakencount, ftp_progressnotecount', reqrib_reqstatId);
            if (reqrib_currentRequestData.d.ftp_actiontakencount != null) {
                reqrib_actionCount = reqrib_currentRequestData.d.ftp_actiontakencount;
            }
            if (reqrib_currentRequestData.d.ftp_progressnotecount != null) {
                reqrib_progressNoteCount = reqrib_currentRequestData.d.ftp_progressnotecount;
            }
        }

        var reqrib_userGuid = Xrm.Page.context.getUserId();

        //adjust ability to resolve request based on current user's team memberhips and the presence of progress notes and actions taken (count fields)
        if (reqrib_UserHasTeam("Pharmacy", reqrib_userGuid) || reqrib_UserHasTeam("RN", reqrib_userGuid) || reqrib_UserHasTeam("LIP User", reqrib_userGuid) || reqrib_UserHasTeam("CCA Team", reqrib_userGuid) || reqrib_UserHasTeam("LIP", reqrib_userGuid) || reqrib_UserHasTeam("MSA", reqrib_userGuid) || reqrib_UserHasTeam("Advanced MSA", reqrib_userGuid)) {
            var actionsTakenValue = reqrib_actionCount;
            var actionsTakenCount = !!actionsTakenValue ? parseInt(actionsTakenValue) : 0;

            var progressNotesValue = reqrib_progressNoteCount;
            var progressNotesCount = !!progressNotesValue ? parseInt(progressNotesValue) : 0;

            if (actionsTakenCount + progressNotesCount > 0) {
                //Requirements met to resolve request

                ////Get current user info and set - commented out and moved setting these fields to workflow called by ftp_isresolved = TRUE
                //var reqrib_UserId = Xrm.Page.context.getUserId();
                //var reqrib_UserName = Xrm.Page.context.getUserName();
                //reqrib_setSimpleLookupValue('ftp_resolvedby', 'systemuser', reqrib_UserId, reqrib_UserName);
                //Xrm.Page.getAttribute('ftp_resolvedby').setSubmitMode('always');
                ////Set resolved on date  - commented out and moved setting these fields to workflow called by ftp_isresolved = TRUE
                //var reqrib_nowdate = new Date();
                //Xrm.Page.getAttribute("ftp_resolvedon").setValue(reqrib_nowdate);
                //Xrm.Page.getAttribute('ftp_resolvedon').setSubmitMode('always');

                //Xrm.Page.data.entity.save();
                //Set Is Resolved
                Xrm.Page.getAttribute("ftp_isresolved").setValue(true);
                Xrm.Page.getAttribute("ftp_isresolved").setSubmitMode("always");
            }
            else {
                //Requirements not met to resolve request
                alert("The request cannot be resolved, there is no associated action taken or progress note for this request!");
            }
        }
        else {
            alert("The request user does not belong to a team that require the use of the 'Resolve Request' function, action cancelled!");
            return false;
        }
        Xrm.Page.data.entity.save();
        //Xrm.Page.data.entity.refresh();
    }
    catch (err) {
        //Display Error
        alert("An error occured in the reqrib_ResolveRequest function.  Error Detail Message: " + err);
    }
}

function reqrib_UserHasTeam(teamName, userGuid) {
    try {
        var reqrib_teamid = null;
        var reqrib_currentUserId = userGuid;
        var reqrib_conditionalFilter = "(Name eq '" + teamName + "')";
        var reqrib_teamData = reqrib_getMultipleEntityDataSync('TeamSet', 'TeamId', reqrib_conditionalFilter, 'Name', 'asc', 0);
        if (reqrib_teamData != null) {
            for (var i = 0; i <= reqrib_teamData.d.results.length - 1; i++) {
                //Get Info
                if (reqrib_teamData.d.results[i].TeamId != null) { reqrib_teamid = reqrib_teamData.d.results[i].TeamId; }
                break;
            }
        }
        //If Team exists, check if the current user is part of that team
        var reqrib_teamMembershipId = null;
        if (reqrib_teamid != null && reqrib_currentUserId != null) {
            var reqrib_conditionalFilter = "(TeamId eq (guid'" + reqrib_teamid + "') and SystemUserId eq (guid'" + reqrib_currentUserId + "'))";
            var reqrib_teamMembershipData = reqrib_getMultipleEntityDataSync('TeamMembershipSet', 'TeamId, SystemUserId,TeamMembershipId', reqrib_conditionalFilter, 'TeamId', 'asc', 0);
            if (reqrib_teamMembershipData != null) {
                for (var i = 0; i <= reqrib_teamMembershipData.d.results.length - 1; i++) {
                    //Get Info
                    if (reqrib_teamMembershipData.d.results[i].TeamMembershipId != null) { reqrib_teamMembershipId = reqrib_teamMembershipData.d.results[i].TeamMembershipId; }
                    break;
                }
            }
        }
        if (reqrib_teamMembershipId != null) { return true; }

        //otherwise return false		
        return false;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the reqrib_UserHasTeam function.  Error Detail Message: " + err);
    }
}
function reqrib_enableResolveRequestButton() {
    var enableButton = true;

    var reqrib_userGuid = Xrm.Page.context.getUserId();
    var businessUnitId = GetBusinessUnitIDFortheUser(reqrib_userGuid);
    //enable the button if Business Unit = VEFT
    if (businessUnitId.toUpperCase() == "B1901871-91FB-E711-812D-1289A8FDD3DA") {
        enableButton = false;
    }

    return enableButton;
}

function GetBusinessUnitIDFortheUser(reqrib_userGuid) {
    var reqrib_BusinessUnitId = null;
    var reqrib_currentBusinessUnit = reqrib_getSingleEntityDataSync('SystemUserSet', 'BusinessUnitId', reqrib_userGuid);
    if (reqrib_currentBusinessUnit.d.BusinessUnitId != null) {
        reqrib_BusinessUnitId = reqrib_currentBusinessUnit.d.BusinessUnitId;
    }
    if (reqrib_BusinessUnitId != null) { reqrib_BusinessUnitId = reqrib_BusinessUnitId.Id; }
    return reqrib_BusinessUnitId;
}

function reqrib_setSimpleLookupValue(reqrib_LookupId, reqrib_Type, reqrib_Id, reqrib_Name) {
    try {
        //Sets the value for lookup attributes that accept only a single entity reference.
        var reqrib_lookupReference = [];
        reqrib_lookupReference[0] = {};
        reqrib_lookupReference[0].id = reqrib_Id;
        reqrib_lookupReference[0].entityType = reqrib_Type;
        reqrib_lookupReference[0].name = reqrib_Name;
        Xrm.Page.getAttribute(reqrib_LookupId).setValue(reqrib_lookupReference);
    }
    catch (err) {
        alert("An error occured in the reqrib_setSimpleLookupValue function.  Error Detail Message: " + err);
    }
}

function reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, reqrib_aSync, reqrib_aSyncCallback, reqrib_skipCount, reqrib_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*reqrib_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*reqrib_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*reqrib_aSyncCallback* - specify the name of the return function to call upon completion (required if reqrib_aSync = true.  Otherwise '')
    //*reqrib_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*reqrib_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var reqrib_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: reqrib_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                reqrib_entityData = data;
                if (reqrib_aSync == true) {
                    reqrib_aSyncCallback(reqrib_entityData, reqrib_skipCount, reqrib_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in reqrib_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + reqrib_jsonQuery);
            },
            async: reqrib_aSync,
            cache: false
        });
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function reqrib_getSingleEntityDataSync(reqrib_entitySetName, reqrib_attributeSet, reqrib_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*reqrib_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqrib_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqrib_entityId* - is the Guid for the entity record

    try {
        var reqrib_entityIdNoBracket = reqrib_entityId.replace(/({|})/g, '');
        var reqrib_selectString = '(guid' + "'" + reqrib_entityIdNoBracket + "'" + ')?$select=' + reqrib_attributeSet;
        var reqrib_jsonQuery = reqrib_serverUrl + reqrib_crmOdataEndPoint + '/' + reqrib_entitySetName + reqrib_selectString;
        var reqrib_entityData = reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, false, '', 0, null);
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function reqrib_getMultipleEntityDataSync(reqrib_entitySetName, reqrib_attributeSet, reqrib_conditionalFilter, reqrib_sortAttribute, reqrib_sortDirection, reqrib_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*reqrib_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqrib_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqrib_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*reqrib_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*reqrib_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*reqrib_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var reqrib_jsonQuery = reqrib_serverUrl + reqrib_crmOdataEndPoint + '/' + reqrib_entitySetName + '?$select=' + reqrib_attributeSet + '&$filter=' + reqrib_conditionalFilter + '&$orderby=' + reqrib_sortAttribute + ' ' + reqrib_sortDirection + '&$skip=' + reqrib_skipCount;
        var reqrib_entityData = reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, false, '', reqrib_skipCount, null);
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}
