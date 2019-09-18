//reqvet_VeteranDataFunctions.js
//Contains functions used on the request form to default data from the veteran
//Requires jQuery loaded on the CRM Form

//Static Variables
var reqvet_serverUrl = Xrm.Page.context.getClientUrl();
var reqvet_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";

function reqvet_getVeteranFacility() {
    try {
        //Get the Veteran and Current facility on Form Load
        reqvet_veteranId = Xrm.Page.getAttribute('customerid').getValue();
        reqvet_facilityId = Xrm.Page.getAttribute('ftp_facility').getValue();
        if (reqvet_facilityId == null && reqvet_veteranId != null) {
            //Get Current Facility based on veteran/contact Use Current Facility (ftp_currentfacilityid), if empty use Home Facility (ftp_FacilityId)
            var reqvet_contactData = reqvet_getSingleEntityDataSync('ContactSet', 'ftp_currentfacilityid, ftp_FacilityId', reqvet_veteranId[0].id);
            if (reqvet_contactData != null) {
                //7/12/18 removed fallback to Home Facility lookup value
                if (reqvet_contactData.d.ftp_currentfacilityid != null) {
                    if (reqvet_contactData.d.ftp_currentfacilityid.Id != null) {
                        reqvet_setSimpleLookupValue('ftp_facility', reqvet_contactData.d.ftp_currentfacilityid.LogicalName, reqvet_contactData.d.ftp_currentfacilityid.Id, reqvet_contactData.d.ftp_currentfacilityid.Name);
                        Xrm.Page.getAttribute('ftp_facility').setSubmitMode('always');
                    }
                    //else {
                    //    //Get Facility from Home Facility
                    //    if (reqvet_contactData.d.ftp_FacilityId != null) {
                    //        reqvet_setSimpleLookupValue('ftp_facility', reqvet_contactData.d.ftp_FacilityId.LogicalName, reqvet_contactData.d.ftp_FacilityId.Id, reqvet_contactData.d.ftp_FacilityId.Name);
                    //        Xrm.Page.getAttribute('ftp_facility').setSubmitMode('always');
                    //    }
                    //}
                }
                //else {
                //    //Get Facility from Home Facility
                //    if (reqvet_contactData.d.ftp_FacilityId != null) {
                //        reqvet_setSimpleLookupValue('ftp_facility', reqvet_contactData.d.ftp_FacilityId.LogicalName, reqvet_contactData.d.ftp_FacilityId.Id, reqvet_contactData.d.ftp_FacilityId.Name);
                //        Xrm.Page.getAttribute('ftp_facility').setSubmitMode('always');
                //    }
                //}
            }
        }
    }
    catch (err) {
        //Display Error
        alert('Request Form Load Script Function Error(reqvet_getVeteranFacility): ' + err.message);
    }
}

function reqvet_setSimpleLookupValue(reqvet_LookupId, reqvet_Type, reqvet_Id, reqvet_Name) {
    try {
        //Sets the value for lookup attributes that accept only a single entity reference.
        var reqvet_lookupReference = [];
        reqvet_lookupReference[0] = {};
        reqvet_lookupReference[0].id = reqvet_Id;
        reqvet_lookupReference[0].entityType = reqvet_Type;
        reqvet_lookupReference[0].name = reqvet_Name;
        Xrm.Page.getAttribute(reqvet_LookupId).setValue(reqvet_lookupReference);
    }
    catch (err) {
        alert('Request Form Load Script Function Error(reqvet_setSimpleLookupValue): ' + err.message);
    }
}

function reqvet_executeCrmOdataGetRequest(reqvet_jsonQuery, reqvet_aSync, reqvet_aSyncCallback, reqvet_skipCount, reqvet_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*reqvet_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*reqvet_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*reqvet_aSyncCallback* - specify the name of the return function to call upon completion (required if reqvet_aSync = true.  Otherwise '')
    //*reqvet_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*reqvet_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var reqvet_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: reqvet_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                reqvet_entityData = data;
                if (reqvet_aSync == true) {
                    reqvet_aSyncCallback(reqvet_entityData, reqvet_skipCount, reqvet_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in reqvet_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + reqvet_jsonQuery);
            },
            async: reqvet_aSync,
            cache: false
        });
        return reqvet_entityData;
    }
    catch (err) {
        alert('An error occured in the reqvet_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function reqvet_getSingleEntityDataSync(reqvet_entitySetName, reqvet_attributeSet, reqvet_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*reqvet_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqvet_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqvet_entityId* - is the Guid for the entity record

    try {
        var reqvet_entityIdNoBracket = reqvet_entityId.replace(/({|})/g, '');
        var reqvet_selectString = '(guid' + "'" + reqvet_entityIdNoBracket + "'" + ')?$select=' + reqvet_attributeSet;
        var reqvet_jsonQuery = reqvet_serverUrl + reqvet_crmOdataEndPoint + '/' + reqvet_entitySetName + reqvet_selectString;
        var reqvet_entityData = reqvet_executeCrmOdataGetRequest(reqvet_jsonQuery, false, '', 0, null);
        return reqvet_entityData;
    }
    catch (err) {
        alert('An error occured in the reqvet_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}