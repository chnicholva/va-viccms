/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />

//DropDownListControlScriptLib.js
//Contains variables and functions used by the DropDownListControl.html page

//Static Variables
var ddlc_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var ddlc_context = GetGlobalContext();
var ddlc_serverUrl = ddlc_context.getClientUrl();
var ddlc_orgName = ddlc_context.getOrgUniqueName();

//var ddlc_ViaLocationsUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/dev/api/VIA/Locations/1.0/json';  //OLD MANUAL DEV URL
//var ddlc_ViaNotesTitleUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/dev/api/VIA/NotesTitle/1.0/json';  //OLD MANUAL DEV URL
var ddlc_ViaLocationsUrl = '';
var ddlc_ViaNotesTitleUrl = '';
var ddlc_PatientFacility = '';
var ddlc_PatientFacilityNo = '';
var ddlc_dropdownTypeName = '';
var ddlc_selectedTextAttribute = '';
var ddlc_duz = '';
var ddlc_providername = '';

function ddlc_getQueryVariable(ddlc_variable) {
    try {
        //Get a Query Variable
        var ddlc_query = window.location.search.substring(1);
        var ddlc_vars = ddlc_query.split("&");
        for (var i = 0; i < ddlc_vars.length; i++) {
            var ddlc_pair = ddlc_vars[i].split("=");
            if (ddlc_pair[0] == ddlc_variable) {
                return ddlc_pair[1];
            }
        }
        //alert('A required DropDownList Query Variable: ' + ddlc_variable + ' is missing!');
        //return "";
    }
    catch (err) {
        alert("DropDownList Control Web Resource Function Error(ddlc_getQueryVariable): " + err.message);
    }
}

function ddlc_formLoad() {
    //Temporary Disable Data Load for DropDown List Component
    //*******************************************************
    return false;
    //*******************************************************

    try {
        //Get the CRM QueryString content
        var ddlc_xrmdata = ddlc_getQueryVariable("data");
        //Split the data array, format is dropdowntypename~selectedtextattribute   (sample: HOSPITALLOCATION~ftp_hospitallocation)
        var ddlc_xrmarray = ddlc_xrmdata.split("~", 2);
        ddlc_dropdownTypeName = ddlc_xrmarray[0];
        ddlc_selectedTextAttribute = ddlc_xrmarray[1];

        //Add the current selection to the optionset if it has a value
        if (parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).getValue() != null) {
            $('<option>').val('0').text(parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).getValue()).appendTo('#dropdownlist');
        }

        //Determine the status of the parent record, if open, build a new dropdown list
        if (parent.Xrm.Page.ui.getFormType() > 2) {
            //The form is disabled, disable the control and exit
            document.getElementById('dropdownlist').disabled = true;
            return false;
        }

        //Get the Patient Facility (must exist to render hospital locations dropdown)
        ddlc_PatientFacility = parent.Xrm.Page.getAttribute('ftp_patientfacility').getValue();
        if (ddlc_PatientFacility != null && ddlc_PatientFacility != '') {
            //Lookup the Facility/Site #
            var ddlc_facilityData = ddlc_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', ddlc_PatientFacility[0].id);
            if (ddlc_facilityData != null) {
                if (ddlc_facilityData.d.ftp_facilitycode != null) { ddlc_PatientFacilityNo = ddlc_facilityData.d.ftp_facilitycode; }
            }
        }

        //If there is no facility number, exit
        if (ddlc_PatientFacilityNo == '') { return false; }

        //Check if VIA Login cookie exist (not expired)
        var ddlc_ViaLoginCookie = ddlc_getCookie("viasessionlink");

        if (ddlc_ViaLoginCookie != null && ddlc_ViaLoginCookie != '') {
            var ddlc_cookiearray = ddlc_ViaLoginCookie.split("~~~~", 2);
            ddlc_duz = ddlc_cookiearray[0];
            ddlc_providername = ddlc_cookiearray[1];
        }

        //Check Cookie return values if missing exit
        if (ddlc_duz == '' || ddlc_providername == '') { return false; }

        //GET CRM SETTINGS WEB SERVICE URLS
        var ddlc_conditionalFilter = "(mcs_name eq 'Active Settings')";
        ddlc_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_VIALocationsURL, ftp_VIANotesTitleURL', ddlc_conditionalFilter, 'mcs_name', 'asc', 0, ddlc_SettingsWebServiceURL_response);

    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_formLoad): ' + err.message);
    }
}

function ddlc_SettingsWebServiceURL_response(ddlc_settingData, ddlc_lastSkip) {
    try {
        //ddlc_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var ddlc_DacUrl = null;
        var ddlc_ViaLocationsApiUrl = null;
        var ddlc_ViaNotesTitleApiUrl = null;
        for (var i = 0; i <= ddlc_settingData.d.results.length - 1; i++) {
            //Get info
            if (ddlc_settingData.d.results[i].ftp_DACURL != null) { ddlc_DacUrl = ddlc_settingData.d.results[i].ftp_DACURL; }
            if (ddlc_settingData.d.results[i].ftp_VIALocationsURL != null) { ddlc_ViaLocationsApiUrl = ddlc_settingData.d.results[i].ftp_VIALocationsURL; }
            if (ddlc_settingData.d.results[i].ftp_VIANotesTitleURL != null) { ddlc_ViaNotesTitleApiUrl = ddlc_settingData.d.results[i].ftp_VIANotesTitleURL; }
            break;
        }
        if (ddlc_DacUrl != null && ddlc_ViaLocationsApiUrl != null) {
            //Construct full Locations web service URL
            ddlc_ViaLocationsUrl = ddlc_DacUrl + ddlc_ViaLocationsApiUrl;
        }
        else {
            parent.Xrm.Page.ui.setFormNotification("ERROR: THE VIA LOCATIONS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VIASERVICE");
        }

        if (ddlc_DacUrl != null && ddlc_ViaNotesTitleApiUrl != null) {
            //Construct full Notes Title web service URL
            ddlc_ViaNotesTitleUrl = ddlc_DacUrl + ddlc_ViaNotesTitleApiUrl;
        }
        else {
            parent.Xrm.Page.ui.setFormNotification("ERROR: THE VIA NOTES TITLE SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VIASERVICE");
        }

        //Proceed to VIA web service to populate the control
        if (ddlc_dropdownTypeName == "HOSPITALLOCATION") {
            //Populate control with VIA Locations
            ddlc_retrieveViaLocations();
            return false;
        }

        //Proceed to VIA web service to populate the control
        if (ddlc_dropdownTypeName == "LOCALNOTESTITLE") {
            //Populate control with VIA Notes Title
            ddlc_retrieveViaNotesTitle();
            return false;
        }

    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_SettingsWebServiceURL_response): ' + err.message);
    }
}

function ddlc_retrieveViaLocations() {
    try {
        //Retrieve VIA Locations by Site
        var ddlc_viaLocation = new Object();
        ddlc_viaLocation.ProviderName = ddlc_providername;
        ddlc_viaLocation.Duz = ddlc_duz;
        ddlc_viaLocation.LoginSiteCode = ddlc_PatientFacilityNo;
        ddlc_viaLocation.Target = "";
        ddlc_viaLocation.Direction = "1";

        var ddlc_locationsResponse = "";

        $.ajax({
            type: "POST",
            url: ddlc_ViaLocationsUrl,
            data: JSON.stringify(ddlc_viaLocation),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                ddlc_locationsResponse = data;
                ddlc_retrieveViaLocations_response(null, ddlc_locationsResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                ddlc_retrieveViaLocations_response(errorThrown, null);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_retrieveViaLocations): ' + err.message);
    }
}

function ddlc_retrieveViaLocations_response(ddlc_errorThrown, ddlc_locationsResponse) {
    try {
        //Add a blank row
        $('<option>').val('00').text('').appendTo('#dropdownlist');

        if (ddlc_errorThrown != null) {
            //General Web Service Error
            alert("Error: The VISTA Locations Web Service Failed with error(" + ddlc_errorThrown + ")");
            return false;
        }
        if (ddlc_locationsResponse.ErrorOccurred == true) {
            alert("Error: The VISTA Locations Web Service Failed with error(" + ddlc_locationsResponse.ErrorMessage + ")");
        }
        else {
            //Analyse results and build control
            if (ddlc_locationsResponse.Data != null) {
                for (var i = 0; i <= ddlc_locationsResponse.Data[0].Location.length - 1; i++) {
                    var ddlc_locationId = null;
                    var ddlc_locationName = null;

                    //Get Info
                    if (ddlc_locationsResponse.Data[0].Location[i].Id != null) { ddlc_locationId = ddlc_locationsResponse.Data[0].Location[i].Id; }
                    if (ddlc_locationsResponse.Data[0].Location[i].Name != null) { ddlc_locationName = ddlc_locationsResponse.Data[0].Location[i].Name; }

                    //Add the location to the dropdown control
                    if (ddlc_locationId != null && ddlc_locationName != null) {
                        //Add only if not already included due to previous selection
                        if (parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).getValue() != ddlc_locationName) {
                            $('<option>').val(ddlc_locationId).text(ddlc_locationName).appendTo('#dropdownlist');
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_retrieveViaLocations_response): ' + err.message);
    }
}

function ddlc_retrieveViaNotesTitle() {
    try {
        //Retrieve VIA Notes Title by Site
        var ddlc_viaNotesTitle = new Object();
        ddlc_viaNotesTitle.ProviderName = ddlc_providername;
        ddlc_viaNotesTitle.Duz = ddlc_duz;
        ddlc_viaNotesTitle.LoginSiteCode = ddlc_PatientFacilityNo;
        ddlc_viaNotesTitle.Target = "";
        ddlc_viaNotesTitle.Direction = "1";

        var ddlc_notestitleResponse = "";

        $.ajax({
            type: "POST",
            url: ddlc_ViaNotesTitleUrl,
            data: JSON.stringify(ddlc_viaNotesTitle),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                ddlc_notestitleResponse = data;
                ddlc_retrieveViaNotesTitle_response(null, ddlc_notestitleResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                ddlc_retrieveViaNotesTitle_response(errorThrown, null);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_retrieveViaNotesTitle): ' + err.message);
    }
}

function ddlc_retrieveViaNotesTitle_response(ddlc_errorThrown, ddlc_notestitleResponse) {
    //Add a blank row
    $('<option>').val('00').text('').appendTo('#dropdownlist');

    try {
        if (ddlc_errorThrown != null) {
            //General Web Service Error
            alert("Error: The VISTA Notes Title Web Service Failed with error(" + ddlc_errorThrown + ")");
            return false;
        }
        if (ddlc_notestitleResponse.ErrorOccurred == true) {
            alert("Error: The VISTA Notes Title Web Service Failed with error(" + ddlc_notestitleResponse.ErrorMessage + ")");
        }
        else {
            //Analyze results and build control
            if (ddlc_notestitleResponse.Data != null) {
                if (ddlc_notestitleResponse.Data[0].Title != null) {
                    for (var i = 0; i <= ddlc_notestitleResponse.Data[0].Title.length - 1; i++) {
                        var ddlc_notestitleId = null;
                        var ddlc_notestitleDescription = null;

                        //Get Info
                        if (ddlc_notestitleResponse.Data[0].Title[i].Id != null) { ddlc_notestitleId = ddlc_notestitleResponse.Data[0].Title[i].Id; }
                        if (ddlc_notestitleResponse.Data[0].Title[i].Description != null) {
                            for (var i2 = 0; i2 <= ddlc_notestitleResponse.Data[0].Title[i].Description.length - 1; i2++) {
                                ddlc_notestitleDescription = ddlc_notestitleResponse.Data[0].Title[i].Description[i2].Title;
                                //Add the notes titlee to the dropdown control
                                if (ddlc_notestitleId != null && ddlc_notestitleDescription != null) {
                                    //Add only if not already included due to previous selection
                                    if (parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).getValue() != ddlc_notestitleDescription) {
                                        $('<option>').val(ddlc_notestitleId + i2).text(ddlc_notestitleDescription).appendTo('#dropdownlist');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        alert('DropDownList Control Web Resource Function Error(ddlc_retrieveViaNotesTitle_response): ' + err.message);
    }
}

function ddlc_dropdownSelected() {
    //***Write back to CRM the selected value***
    var ddlc_selectedDropDownText = $("#dropdownlist").find(":selected").text();
    parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).setValue(ddlc_selectedDropDownText);
    parent.Xrm.Page.getAttribute(ddlc_selectedTextAttribute).setSubmitMode('always');
}

function ddlc_getCookie(cname) {
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
        alert('DropDownList Control Web Resource Function Error(ddlc_getCookie): ' + err.message);
    }
}


function ddlc_executeCrmOdataGetRequest(ddlc_jsonQuery, ddlc_aSync, ddlc_aSyncCallback, ddlc_skipCount, ddlc_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*ddlc_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*ddlc_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*ddlc_aSyncCallback* - specify the name of the return function to call upon completion (required if ddlc_aSync = true.  Otherwise '')
    //*ddlc_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*ddlc_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var ddlc_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: ddlc_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                ddlc_entityData = data;
                if (ddlc_aSync == true) {
                    ddlc_aSyncCallback(ddlc_entityData, ddlc_skipCount, ddlc_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in ddlc_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + ddlc_jsonQuery);
            },
            async: ddlc_aSync,
            cache: false
        });
        return ddlc_entityData;
    }
    catch (err) {
        alert('An error occured in the ddlc_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function ddlc_getMultipleEntityDataAsync(ddlc_entitySetName, ddlc_attributeSet, ddlc_conditionalFilter, ddlc_sortAttribute, ddlc_sortDirection, ddlc_skipCount, ddlc_aSyncCallback, ddlc_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*ddlc_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*ddlc_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*ddlc_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*ddlc_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*ddlc_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*ddlc_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*ddlc_aSyncCallback* - is the name of the function to call when returning the result
    //*ddlc_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var ddlc_jsonQuery = ddlc_serverUrl + ddlc_crmOdataEndPoint + '/' + ddlc_entitySetName + '?$select=' + ddlc_attributeSet + '&$filter=' + ddlc_conditionalFilter + '&$orderby=' + ddlc_sortAttribute + ' ' + ddlc_sortDirection + '&$skip=' + ddlc_skipCount;
        ddlc_executeCrmOdataGetRequest(ddlc_jsonQuery, true, ddlc_aSyncCallback, ddlc_skipCount, ddlc_optionArray);
    }
    catch (err) {
        alert('An error occured in the ddlc_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function ddlc_getSingleEntityDataSync(ddlc_entitySetName, ddlc_attributeSet, ddlc_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*ddlc_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*ddlc_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*ddlc_entityId* - is the Guid for the entity record

    try {
        var ddlc_entityIdNoBracket = ddlc_entityId.replace(/({|})/g, '');
        var ddlc_selectString = '(guid' + "'" + ddlc_entityIdNoBracket + "'" + ')?$select=' + ddlc_attributeSet;
        var ddlc_jsonQuery = ddlc_serverUrl + ddlc_crmOdataEndPoint + '/' + ddlc_entitySetName + ddlc_selectString;
        var ddlc_entityData = ddlc_executeCrmOdataGetRequest(ddlc_jsonQuery, false, '', 0, null);
        return ddlc_entityData;
    }
    catch (err) {
        alert('An error occured in the ddlc_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}