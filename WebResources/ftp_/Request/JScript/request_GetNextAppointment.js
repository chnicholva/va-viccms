//request_GetNextAppointment.js
//Contains functions used on the request form to retrieve the next appointment via HDR proxy web service
//Requires jQuery loaded on the CRM Form

//Static Variables
var reqgna_serverUrl = Xrm.Page.context.getClientUrl();
var reqgna_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";

//var reqgna_AppointmentsUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/Appointments/1.0/json/FtPCRM/';  //OLD MANUAL DEV URL
var reqgna_AppointmentsUrl = '';
var reqgna_veteranNationalID = '';

function reqgna_GetNextAppointment() {
    try {
        //Determine if the status of the form and if there is enough information to retrieve appointments
        if (Xrm.Page.ui.getFormType() > 2) { return false; }
        var reqgna_veteranId = Xrm.Page.getAttribute('customerid').getValue();
        if (reqgna_veteranId == null) { return false; }

        //Get the Veteran's National ID
        var reqgna_contactData = reqgna_getSingleEntityDataSync('ContactSet', 'FullName, tri_VeteranID', reqgna_veteranId[0].id);
        if (reqgna_contactData != null) {
            var reqgna_veteranName = '';
            if (reqgna_contactData.d.FullName != null) { reqgna_veteranName = reqgna_contactData.d.FullName; }
            if (reqgna_contactData.d.tri_VeteranID != null) { reqgna_veteranNationalID = reqgna_contactData.d.tri_VeteranID; }
        }

        //Exit if Veteran's national ID is missing
        if (reqgna_veteranNationalID == '') { return false; }

        //GET CRM SETTINGS WEB SERVICE URLS
        var reqgna_conditionalFilter = "(mcs_name eq 'Active Settings')";
        reqgna_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_AppointmentAPIURL', reqgna_conditionalFilter, 'mcs_name', 'asc', 0, reqgna_SettingsWebServiceURL_response, reqgna_AppointmentsUrl);

    }
    catch (err) {
        //Display Error
        alert("An error occured in the reqgna_GetNextAppointment function.  Error Detail Message: " + err);
    }
}

function reqgna_SettingsWebServiceURL_response(reqgna_settingData, reqgna_lastSkip, reqgna_AppointmentsUrl_NA) {
    try {
        //reqgna__lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var reqgna_DacUrl = null;
        var reqgna_AppointmentApiUrl = null;
        for (var i = 0; i <= reqgna_settingData.d.results.length - 1; i++) {
            //Get info
            if (reqgna_settingData.d.results[i].ftp_DACURL != null) { reqgna_DacUrl = reqgna_settingData.d.results[i].ftp_DACURL; }
            if (reqgna_settingData.d.results[i].ftp_AppointmentAPIURL != null) { reqgna_AppointmentApiUrl = reqgna_settingData.d.results[i].ftp_AppointmentAPIURL; }
            break;
        }
        if (reqgna_DacUrl != null && reqgna_AppointmentApiUrl != null) {
            //Construct full web service URL
            reqgna_AppointmentsUrl = reqgna_DacUrl + reqgna_AppointmentApiUrl;
            //Set filter to true for testing, otherwise false
            reqgna_executeGetAppointmentRequest(false);
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE APPOINTMENT API WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "APPSERVICE");
        }
    }
    catch (err) {
        alert('Get Next Appointment Web Resource Function Error(reqgna_SettingsWebServiceURL_response): ' + err.message);
    }
}

function reqgna_executeGetAppointmentRequest(reqgna_noFilter) {
    try {
        var reqgna_requestResponse = "";

        $.ajax({
            type: "GET",
            url: reqgna_AppointmentsUrl + reqgna_veteranNationalID + "?noFilter=" + reqgna_noFilter,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var reqgna_newdata = data;
                reqgna_requestResponse = reqgna_newdata;
                reqgna_executeGetAppointmentRequest_response(null, reqgna_requestResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                reqgna_executeGetAppointmentRequest_response(errorThrown, null);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('Request Function Error(reqgna_executeGetAppointmentRequest): ' + err.message);
    }
}

function reqgna_executeGetAppointmentRequest_response(reqgna_errorThrown, reqgna_requestResponse) {
    try {
        //Process Request Response
        if (reqgna_errorThrown != null) {
            //Error
            alert("reqgna_executeGetAppointmentRequest_response Error:" + reqgna_errorThrown);
            return false;
        }
        else {
            //Analyze data
            if (reqgna_requestResponse.ErrorOccurred == false) {
                //Success entry
                var reqgna_currentDateTime = new Date();
                var reqgna_nextAppointment = null;

                if (reqgna_requestResponse.Data != null) {
                    for (var i = 0; i <= reqgna_requestResponse.Data.length - 1; i++) {
                        var reqgna_jsonDateTimeDate = null;
                        if (reqgna_requestResponse.Data[i].DateTimeDate != null) { reqgna_jsonDateTimeDate = reqgna_requestResponse.Data[i].DateTimeDate; }
                        if (reqgna_currentDateTime > new Date(reqgna_jsonDateTimeDate)) {
                            //Do Nothing, skip over record
                        }
                        else
                        {
                            if (reqgna_nextAppointment == null) {
                                reqgna_nextAppointment = new Date(reqgna_jsonDateTimeDate);
                            }
                            else {
                                if ((new Date(reqgna_jsonDateTimeDate) < reqgna_nextAppointment) && (new Date(reqgna_jsonDateTimeDate) > reqgna_currentDateTime)) {
                                    reqgna_nextAppointment = new Date(reqgna_jsonDateTimeDate);
                                }
                            }
                        }
                    }
                }
                Xrm.Page.getAttribute("ftp_nextapptdatetime").setValue(reqgna_nextAppointment);
                Xrm.Page.getAttribute('ftp_nextapptdatetime').setSubmitMode('always');
            }
            else {
                //Failure entry
                alert("reqgna_executeGetAppointmentRequest_response Failure: " + reqgna_requestResponse.Status + " " + vcmn_requestResponse.ErrorMessage);
                return false;
            }
        }
    }
    catch (err) {
        alert('Request Function Error(reqgna_executeGetAppointmentRequest_response): ' + err.message);
    }
}

function reqgna_executeCrmOdataGetRequest(reqgna_jsonQuery, reqgna_aSync, reqgna_aSyncCallback, reqgna_skipCount, reqgna_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*reqgna_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*reqgna_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*reqgna_aSyncCallback* - specify the name of the return function to call upon completion (required if reqgna_aSync = true.  Otherwise '')
    //*reqgna_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*reqgna_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var reqgna_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: reqgna_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                reqgna_entityData = data;
                if (reqgna_aSync == true) {
                    reqgna_aSyncCallback(reqgna_entityData, reqgna_skipCount, reqgna_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in reqgna_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + reqgna_jsonQuery);
            },
            async: reqgna_aSync,
            cache: false
        });
        return reqgna_entityData;
    }
    catch (err) {
        alert('An error occured in the reqgna_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function reqgna_getMultipleEntityDataAsync(reqgna_entitySetName, reqgna_attributeSet, reqgna_conditionalFilter, reqgna_sortAttribute, reqgna_sortDirection, reqgna_skipCount, reqgna_aSyncCallback, reqgna_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*reqgna_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqgna_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqgna_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*reqgna_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*reqgna_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*reqgna_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*reqgna_aSyncCallback* - is the name of the function to call when returning the result
    //*reqgna_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var reqgna_jsonQuery = reqgna_serverUrl + reqgna_crmOdataEndPoint + '/' + reqgna_entitySetName + '?$select=' + reqgna_attributeSet + '&$filter=' + reqgna_conditionalFilter + '&$orderby=' + reqgna_sortAttribute + ' ' + reqgna_sortDirection + '&$skip=' + reqgna_skipCount;
        reqgna_executeCrmOdataGetRequest(reqgna_jsonQuery, true, reqgna_aSyncCallback, reqgna_skipCount, reqgna_optionArray);
    }
    catch (err) {
        alert('An error occured in the reqgna_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function reqgna_getSingleEntityDataSync(reqgna_entitySetName, reqgna_attributeSet, reqgna_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*reqgna_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqgna_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqgna_entityId* - is the Guid for the entity record

    try {
        var reqgna_entityIdNoBracket = reqgna_entityId.replace(/({|})/g, '');
        var reqgna_selectString = '(guid' + "'" + reqgna_entityIdNoBracket + "'" + ')?$select=' + reqgna_attributeSet;
        var reqgna_jsonQuery = reqgna_serverUrl + reqgna_crmOdataEndPoint + '/' + reqgna_entitySetName + reqgna_selectString;
        var reqgna_entityData = reqgna_executeCrmOdataGetRequest(reqgna_jsonQuery, false, '', 0, null);
        return reqgna_entityData;
    }
    catch (err) {
        alert('An error occured in the reqgna_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}