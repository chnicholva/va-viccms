//VistACPRSNoteFormScript.js
//Contains variables and functions used by the CRM Form and Ribbon
//Requires jQuery loaded on the CRM Form

//Static Variables
var vcni_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vcni_serverUrl = Xrm.Page.context.getClientUrl();

function vcni_setUserFacilityDefault() {
    try {
        //Determine Form State
        var vcni_qualifyDefaultSetting = false;
        if (Xrm.Page.ui.getFormType() == 1) vcni_qualifyDefaultSetting = true; //Create
        if (Xrm.Page.ui.getFormType() == 2) {
            //Update
            if (Xrm.Page.getAttribute('statuscode').getValue() == null || Xrm.Page.getAttribute('statuscode').getValue() == 1) {
                if (Xrm.Page.getAttribute('ftp_savetovista').getValue() == null) {
                    //Save to VistA/CPRS Setting is currently blank, so populate it.
                    vcni_qualifyDefaultSetting = true;
                }
            }
        }

        //Get current user id
        var vcni_crmUserId = Xrm.Page.context.getUserId();
        var vcni_crmFacilityId = null;
        var vcni_crmUSDConfigurationId = null;

        //Get the Facility for the current user
        var vcni_userData = vcni_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', vcni_crmUserId);
        if (vcni_userData != null) {
            if (vcni_userData.d.ftp_FacilitySiteId != null) { vcni_crmFacilityId = vcni_userData.d.ftp_FacilitySiteId.Id; }
            if (vcni_userData.d.msdyusd_USDConfigurationId != null) { vcni_crmUSDConfigurationId = vcni_userData.d.msdyusd_USDConfigurationId.Id; }
        }

        //Exit if the user has no facility/site defined or USD Configuration defined
        if (vcni_crmFacilityId == null || vcni_crmUSDConfigurationId == null) { return false; }

        //Get the corresponding Facility Group Default record
        var vcni_conditionalFilter = "(ftp_facilitysiteid/Id eq guid'" + vcni_crmFacilityId + "') and (ftp_usdgroupid/Id eq guid'" + vcni_crmUSDConfigurationId + "')";
        vcni_getMultipleEntityDataAsync('ftp_facilitygroupdefaultSet', 'ftp_savetocprs, ftp_canuseroverride_cprs_yes, ftp_canuseroverride_cprs_no', vcni_conditionalFilter, 'ftp_name', 'asc', 0, vcni_setUserFacilityDefault_response, vcni_qualifyDefaultSetting);
    }
    catch (err) {
        alert('Vista CPRS Note Integration Function Error(vcni_setUserFacilityDefault): ' + err.message);
    }
}

function vcni_setUserFacilityDefault_response(vcni_facilityGroupData, vcni_lastSkip, vcni_optionArray) {
    try {
        //vcni_lastSkip is the starting point in the result (use if more than 50 records)
        var vcni_savetocprs = null;
        var vcni_overrideyes = null;
        var vcni_overrideno = null;
        for (var i = 0; i <= vcni_facilityGroupData.d.results.length - 1; i++) {
            //Get info
            if (vcni_facilityGroupData.d.results[i].ftp_savetocprs != null) {
                vcni_savetocprs = vcni_facilityGroupData.d.results[i].ftp_savetocprs;
            }
            if (vcni_facilityGroupData.d.results[i].ftp_canuseroverride_cprs_yes != null) {
                vcni_overrideyes = vcni_facilityGroupData.d.results[i].ftp_canuseroverride_cprs_yes;
            }
            if (vcni_facilityGroupData.d.results[i].ftp_canuseroverride_cprs_no != null) {
                vcni_overrideno = vcni_facilityGroupData.d.results[i].ftp_canuseroverride_cprs_no;
            }
        }

        if (vcni_optionArray == true) {
            if (vcni_savetocprs != null) {
                //Update VistA/CPRS Integrate form field
                if (vcni_savetocprs == true) {
                    Xrm.Page.getAttribute('ftp_savetovista').setValue(100000001); //Yes
                }
                if (vcni_savetocprs == false) {
                    Xrm.Page.getAttribute('ftp_savetovista').setValue(100000000); //No
                }
                //Enforce save of values in read only field
                Xrm.Page.getAttribute('ftp_savetovista').setSubmitMode('always');
                //Refresh Ribbon
                vcni_refreshRibbonOnChange()
            }
        }

        //deprecated 5/11/18, kknab
        ////Set CPRS Field lock/read-only, based on settings in Facility Group Default for CPRS
        //if (vcni_savetocprs == true && vcni_overrideyes != true) {
        //    //Lock down CPRS attribute in header of form
        //    Xrm.Page.getControl("header_ftp_savetovista").setDisabled(true);
        //}
        //if (vcni_savetocprs == false && vcni_overrideno != true) {
        //    //Lock down CPRS attribute in header of form
        //    Xrm.Page.getControl("header_ftp_savetovista").setDisabled(true);
        //}
    }
    catch (err) {
        alert('Vista CPRS Note Integration Function Error(vcni_setUserFacilityDefault_response): ' + err.message);
    }
}

function vcni_launchViewProgressNotes() {
    try {
        //Verify that Vista/CPRS Integration flag is set to yes
        var vcni_saveToVista = Xrm.Page.getAttribute('ftp_savetovista').getValue();
        if (vcni_saveToVista != 100000001) {
            //Save To Vista is not set to 'Yes', hide section and exit
            Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setVisible(false);
            return false;
        }

        //Check if sign this note field is populated, if not prompt user (unless case is resolved)
        if (Xrm.Page.getAttribute('ftp_signthisnote').getValue() == null && Xrm.Page.getAttribute('statuscode').getValue() != 5) {
            //Prompt user
            var vcnb_signNote = confirm('Do you need to sign this note?, Select OK if Yes, otherwise CANCEL.');
            if (vcnb_signNote == true) {
                Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000001);
            }
            else {
                Xrm.Page.getAttribute('ftp_signthisnote').setValue(100000000);
            }
            Xrm.Page.getAttribute('ftp_signthisnote').setSubmitMode('always');
        }

        //Prep the tab
        if (Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').getVisible() == false) {;
            Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').getDisplayState() != 'expanded') {
            Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setDisplayState('expanded');
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setFocus();

        //Refresh the web resource URL
        var vcni_VistACPRSNoteButtonsURL = Xrm.Page.getControl('WebResource_VistACPRSNoteButtons').getSrc();
        Xrm.Page.getControl('WebResource_VistACPRSNoteButtons').setSrc(vcni_VistACPRSNoteButtonsURL);
    }
    catch (err) {
        alert('View Progress Notes Ribbon Function Error(vcni_launchViewProgressNotes): ' + err.message);
    }
}

function vcni_refreshRibbonOnChange() {
    Xrm.Page.data.entity.save();
    Xrm.Page.ui.refreshRibbon();
}



function vcni_executeCrmOdataGetRequest(vcni_jsonQuery, vcni_aSync, vcni_aSyncCallback, vcni_skipCount, vcni_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vcni_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vcni_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vcni_aSyncCallback* - specify the name of the return function to call upon completion (required if vcni_aSync = true.  Otherwise '')
    //*vcni_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vcni_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vcni_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vcni_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vcni_entityData = data;
                if (vcni_aSync == true) {
                    vcni_aSyncCallback(vcni_entityData, vcni_skipCount, vcni_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vcni_executeCrmOdataGetRequest: ' + errorThrown);
            },
            async: vcni_aSync,
            cache: false
        });
        return vcni_entityData;
    }
    catch (err) {
        alert('An error occured in the vcni_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vcni_getSingleEntityDataSync(vcni_entitySetName, vcni_attributeSet, vcni_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vcni_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcni_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcni_entityId* - is the Guid for the entity record

    try {
        var vcni_entityIdNoBracket = vcni_entityId.replace(/({|})/g, '');
        var vcni_selectString = '(guid' + "'" + vcni_entityIdNoBracket + "'" + ')?$select=' + vcni_attributeSet;
        var vcni_jsonQuery = vcni_serverUrl + vcni_crmOdataEndPoint + '/' + vcni_entitySetName + vcni_selectString;
        var vcni_entityData = vcni_executeCrmOdataGetRequest(vcni_jsonQuery, false, '', 0, null);
        return vcni_entityData;
    }
    catch (err) {
        alert('An error occured in the vcni_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function vcni_getMultipleEntityDataAsync(vcni_entitySetName, vcni_attributeSet, vcni_conditionalFilter, vcni_sortAttribute, vcni_sortDirection, vcni_skipCount, vcni_aSyncCallback, vcni_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vcni_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcni_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcni_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vcni_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vcni_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vcni_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vcni_aSyncCallback* - is the name of the function to call when returning the result
    //*vcni_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vcni_jsonQuery = vcni_serverUrl + vcni_crmOdataEndPoint + '/' + vcni_entitySetName + '?$select=' + vcni_attributeSet + '&$filter=' + vcni_conditionalFilter + '&$orderby=' + vcni_sortAttribute + ' ' + vcni_sortDirection + '&$skip=' + vcni_skipCount;
        vcni_executeCrmOdataGetRequest(vcni_jsonQuery, true, vcni_aSyncCallback, vcni_skipCount, vcni_optionArray);
    }
    catch (err) {
        alert('An error occured in the vcni_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}