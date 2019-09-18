//SecureFacilityGroupDefault.js

//Static Variables
var sfgd_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var sfgd_serverUrl = Xrm.Page.context.getClientUrl();
var sfgd_crmUserId = Xrm.Page.context.getUserId();
var sfgd_crmFacilityId = null;
var sfgd_crmUSDConfigurationId = null;
var sfgd_crmUserInAdminTeam = false;


function sfgd_formLoad() {
    try {
        //Lock down primary attributes
        Xrm.Page.getControl('ftp_facilitysiteid').setDisabled(true);
        Xrm.Page.getControl('ftp_usdgroupid').setDisabled(true);
        Xrm.Page.getControl('ftp_savetocprs').setDisabled(true);
        Xrm.Page.getControl('ftp_canuseroverride_cprs_yes').setDisabled(true);
        Xrm.Page.getControl('ftp_canuseroverride_cprs_no').setDisabled(true);

        //Lock down remaining attributes on form
        Xrm.Page.getControl('ftp_name').setDisabled(true);
        //Xrm.Page.getControl('ftp_historicalnotetitledefault').setDisabled(true);
        //Xrm.Page.getControl('ftp_historicallocationdefault').setDisabled(true);
        Xrm.Page.getControl('ftp_viaworkloadencounternotetitledefault').setDisabled(true);
        Xrm.Page.getControl('ftp_viaworkloadencounterlocationdefault').setDisabled(true);
        Xrm.Page.getControl('ftp_frequentlyusednotetitles').setDisabled(true);
        Xrm.Page.getControl('ftp_frequentlyusedlocations').setDisabled(true);

        //Get the Facility for the current user
        var sfgd_userData = sfgd_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', sfgd_crmUserId);
        if (sfgd_userData != null) {
            if (sfgd_userData.d.ftp_FacilitySiteId != null) { sfgd_crmFacilityId = sfgd_userData.d.ftp_FacilitySiteId; }
            if (sfgd_userData.d.msdyusd_USDConfigurationId != null) { sfgd_crmUSDConfigurationId = sfgd_userData.d.msdyusd_USDConfigurationId; }
        }

        //Determine if the current user belongs to an admin security group with access
        if (sfgd_UserHasRole("System Administrator") || sfgd_UserHasRole("FTP Facility Admin")) {
            //User has one or more of the Required Security Roles
            sfgd_crmUserInAdminTeam = true;
        }

        if (sfgd_crmUserInAdminTeam == true) {
            //If new record set defaults
            if (Xrm.Page.ui.getFormType() == 1) {
                if (sfgd_crmFacilityId != null) {
                    sfgd_setSimpleLookupValue('ftp_facilitysiteid', 'ftp_facility', sfgd_crmFacilityId.Id, sfgd_crmFacilityId.Name)
                    Xrm.Page.getAttribute('ftp_facilitysiteid').setSubmitMode('always');
                }
                if (sfgd_crmUSDConfigurationId != null) {
                    sfgd_setSimpleLookupValue('ftp_usdgroupid', 'msdyusd_configuration', sfgd_crmUSDConfigurationId.Id, sfgd_crmUSDConfigurationId.Name)
                    Xrm.Page.getAttribute('ftp_usdgroupid').setSubmitMode('always');
                }
            }
            //Enable locked attributes if user belongs to the same facility
            var sfgd_recordFacility = Xrm.Page.getAttribute('ftp_facilitysiteid').getValue();
            if (sfgd_recordFacility != null) {
                if (((sfgd_recordFacility[0].id).toUpperCase()).replace(/[{}]/g,'') == ((sfgd_crmFacilityId.Id).toUpperCase()).replace(/[{}]/g,'')) {
                    Xrm.Page.getControl('ftp_usdgroupid').setDisabled(false);
                    Xrm.Page.getControl('ftp_savetocprs').setDisabled(false);
                    Xrm.Page.getControl('ftp_canuseroverride_cprs_yes').setDisabled(false);
                    Xrm.Page.getControl('ftp_canuseroverride_cprs_no').setDisabled(false);

                    Xrm.Page.getControl('ftp_name').setDisabled(false);
                    //Xrm.Page.getControl('ftp_historicalnotetitledefault').setDisabled(false);
                    //Xrm.Page.getControl('ftp_historicallocationdefault').setDisabled(false);
                    Xrm.Page.getControl('ftp_viaworkloadencounternotetitledefault').setDisabled(false);
                    Xrm.Page.getControl('ftp_viaworkloadencounterlocationdefault').setDisabled(false);
                    Xrm.Page.getControl('ftp_frequentlyusednotetitles').setDisabled(false);
                    Xrm.Page.getControl('ftp_frequentlyusedlocations').setDisabled(false);
                }
            }
        }
    }
    catch (err) {
        alert('Facility Group Default Function Error(sfgd_formLoad): ' + err.message);
    }
}

function sfgd_formOnSave(pContext) {
    try {
        var sfgd_saveMode = pContext.getEventArgs().getSaveMode();
        if (sfgd_saveMode == 1 || sfgd_saveMode == 2 || sfgd_saveMode == 59 || sfgd_saveMode == 70) {
            //Get required variable values, prevent save if null values exist
            if (Xrm.Page.getAttribute('ftp_facilitysiteid').getValue() == null || Xrm.Page.getAttribute('ftp_usdgroupid').getValue() == null) {
                var sfgd_eventArgs = pContext.getEventArgs();
                sfgd_eventArgs.preventDefault();
                alert("This record cannot be saved, please complete all required attributes!");
            }
        }
    }
    catch (err) {
        alert('Facility Group Default Function Error(sfgd_formOnSave): ' + err.message);
    }
}

function sfgd_UserHasRole(roleName) {
    try {
        //Get CRM Context provided guid's for all user roles for this user
        var AllUserRoles = Xrm.Page.context.getUserRoles();
        for (var i = 0; i < AllUserRoles.length; i++) {
            var RoleId = AllUserRoles[i];
            //Get the Name of the Role
            var RoleNameData = sfgd_getSingleEntityDataSync("RoleSet", "Name", RoleId);

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
        alert("An error occured in the sfgd_UserHasRole function.  Error Detail Message: " + err);
    }
}

function sfgd_setSimpleLookupValue(sfgd_LookupId, sfgd_Type, sfgd_Id, sfgd_Name) {
    try {
        //Sets the value for lookup attributes that accept only a single entity reference.
        var sfgd_lookupReference = [];
        sfgd_lookupReference[0] = {};
        sfgd_lookupReference[0].id = sfgd_Id;
        sfgd_lookupReference[0].entityType = sfgd_Type;
        sfgd_lookupReference[0].name = sfgd_Name;
        Xrm.Page.getAttribute(sfgd_LookupId).setValue(sfgd_lookupReference);
    }
    catch (err) {
        alert("An error occured in the sfgd_setSimpleLookupValue function.  Error Detail Message: " + err);
    }
}

function sfgd_executeCrmOdataGetRequest(sfgd_jsonQuery, sfgd_aSync, sfgd_aSyncCallback, sfgd_skipCount, sfgd_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*sfgd_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*sfgd_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*sfgd_aSyncCallback* - specify the name of the return function to call upon completion (required if sfgd_aSync = true.  Otherwise '')
    //*sfgd_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*sfgd_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var sfgd_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: sfgd_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                sfgd_entityData = data;
                if (sfgd_aSync == true) {
                    sfgd_aSyncCallback(sfgd_entityData, sfgd_skipCount, sfgd_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in sfgd_executeCrmOdataGetRequest: ' + errorThrown);
            },
            async: sfgd_aSync,
            cache: false
        });
        return sfgd_entityData;
    }
    catch (err) {
        alert('An error occured in the sfgd_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function sfgd_getSingleEntityDataSync(sfgd_entitySetName, sfgd_attributeSet, sfgd_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*sfgd_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sfgd_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sfgd_entityId* - is the Guid for the entity record

    try {
        var sfgd_entityIdNoBracket = sfgd_entityId.replace(/({|})/g, '');
        var sfgd_selectString = '(guid' + "'" + sfgd_entityIdNoBracket + "'" + ')?$select=' + sfgd_attributeSet;
        var sfgd_jsonQuery = sfgd_serverUrl + sfgd_crmOdataEndPoint + '/' + sfgd_entitySetName + sfgd_selectString;
        var sfgd_entityData = sfgd_executeCrmOdataGetRequest(sfgd_jsonQuery, false, '', 0, null);
        return sfgd_entityData;
    }
    catch (err) {
        alert('An error occured in the sfgd_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function sfgd_getMultipleEntityDataSync(sfgd_entitySetName, sfgd_attributeSet, sfgd_conditionalFilter, sfgd_sortAttribute, sfgd_sortDirection, sfgd_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*sfgd_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sfgd_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sfgd_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*sfgd_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*sfgd_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*sfgd_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var sfgd_jsonQuery = sfgd_serverUrl + sfgd_crmOdataEndPoint + '/' + sfgd_entitySetName + '?$select=' + sfgd_attributeSet + '&$filter=' + sfgd_conditionalFilter + '&$orderby=' + sfgd_sortAttribute + ' ' + sfgd_sortDirection + '&$skip=' + sfgd_skipCount;
        var sfgd_entityData = sfgd_executeCrmOdataGetRequest(sfgd_jsonQuery, false, '', sfgd_skipCount, null);
        return sfgd_entityData;
    }
    catch (err) {
        alert('An error occured in the sfgd_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}
