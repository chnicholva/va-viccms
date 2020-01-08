//TriageExpertNotesScriptLib.js
//Contains variables and functions used by the TriageExpertNotes.html page

//Static Variables
var tena_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var tena_context = GetGlobalContext();
var tena_serverUrl = tena_context.getClientUrl();

var tena_regardingobjectid = null;
var tena_regardingobjectidtype = null;
var tena_regardingobjectidname = null;
var tena_veteranId = null;
var tena_VeteranName = '';

var tena_SessionStartDateTime = new Date();
var tena_SessionDurationMinutes = 0;

try {
    $(document).ready(function () {
        $('#expertWidget').on('complete', tena_doComplete);
        tena_doStart();
    });
}
catch (err) {
    alert('The Triage Note application or required components is currently unavailable.   Error(expertWidget): ' + err.message);
}

function tena_getQueryVariable(tena_variable) {
    try {
        //Get a Query Variable
        var tena_query = window.location.search.substring(1);
        var tena_vars = tena_query.split("&");
        for (var i = 0; i < tena_vars.length; i++) {
            var tena_pair = tena_vars[i].split("=");
            if (tena_pair[0] == tena_variable) {
                return decodeURIComponent(tena_pair[1]);
            }
        }
        return "";
    }
    catch (err) {
        alert('Triage Expert Notes Form Load Script Function Error(tena_getQueryVariable): ' + err.message);
    }
}

function tena_formatTwoDigits(tena_numberToFormat) {
    //This function takes an integer and reformats it with a '0' prefix if the value is less than 10
    //tena_numberToFormat is the integer value
    try {
        var tena_prefixValue = "0";
        if (tena_numberToFormat < 10) { return (tena_prefixValue + tena_numberToFormat.toString()); }
        else { return tena_numberToFormat.toString(); }
    }
    catch (err) {
        //Display error
        alert("Triage Expert Notes Form Load Script Function Error(tena_formatTwoDigits): " + err.message);
        return null;
    }
}

function tena_doComplete(event, eData) {
    debugger;
    try {
        //window.close(); //moved lower in script
        //alert('window should have closed');
        // Clean the wonky new line character
        var newNote = '';
        for (var i = 0; i < eData.triagenote.length; i++) {
            //newNote += eData.triagenote.charCodeAt(i).toString() + '\r\n';
            if (eData.triagenote.charCodeAt(i) === 10)
                newNote += '\r\n';
            else
                newNote += eData.triagenote.charAt(i);
        }

        //Write Triage Note Text to local storage
        var tena_currentDateTime = new Date();
        var tena_uniqueTriageId = "TRIAGE" + tena_currentDateTime.getFullYear().toString() + tena_formatTwoDigits(tena_currentDateTime.getMonth() + 1) +
            tena_formatTwoDigits(tena_currentDateTime.getDate()) + tena_formatTwoDigits(tena_currentDateTime.getHours()) +
            tena_formatTwoDigits(tena_currentDateTime.getMinutes()) + tena_formatTwoDigits(tena_currentDateTime.getSeconds());

        if (tena_uniqueTriageId != null) { localStorage.setItem(tena_uniqueTriageId, newNote); }

        $.ajax({
            method: "PATCH", url: "/api/data/v9.0/" + tena_regardingobjectidtype + "s(" + tena_regardingobjectid.replace(/\{|\}/gi, '') + ")", data: JSON.stringify({
                "ftp_chiefcomplaint": eData["Chief Complaint"]
            }), contentType: "application/json",
            success: function (result) {
                VCCM.USDHelper.FireUSDEvent('TriageComplete', ["ChiefComplaint=" + eData["Chief Complaint"], "TriageNote=" + tena_uniqueTriageId], function () {
                    var tena_sessionTimeDiff = (new Date().getTime()) - tena_SessionStartDateTime.getTime();
                    var tena_sessionMinutes = (Math.floor(tena_sessionTimeDiff / 1000 / 60)) + 1; //Add by default 1 minute to account for partial minute

                    //Populate values of the crm attributes to be included on the form
                    var tena_extraqs = "";
                    tena_extraqs += "subject=" + "Triage Note" + "&ftp_notedetail=" + tena_uniqueTriageId;

                    tena_extraqs += "&parameter_regardingobjectid=" + tena_regardingobjectid + "&parameter_regardingobjectidname=" + tena_regardingobjectidname + "&parameter_regardingobjectidtype=" + tena_regardingobjectidtype + "&parameter_triageexpert=YES" + "&parameter_triageminutes=" + tena_sessionMinutes;
                    var tena_progressNoteUrl = tena_serverUrl + "/main.aspx?etn=" + "ftp_progressnote" + "&pagetype=entityrecord" + "&extraqs=" +
                        encodeURIComponent(tena_extraqs);  //+ "&newWindow=true";
                    //var tena_progressNoteWindow = window.open(tena_progressNoteUrl, "_blank", "toolbar=no, scrollbars=yes, status=no, resizable=yes, top=1, left=1, width=1000, height=800", false);

                    //closing this window is not handled via an action call beneath a VHG window routing rule.  window.close() was interfering with user experience in USD
                    /* if (location.href.indexOf("Outlook15White") != -1) {
                        window.open("http://event?eventname=DoneButtonClicked");
                    }
                    else{
                        window.close();
                    } */
                });
            }
        });
    }
    catch (err) {
        alert('Triage Expert Completion Script Function Error(tena_doComplete): ' + err.message);
    }
}

function tena_doStart() {
    debugger;
    try {
        //Get request/incident values passed from CRM to the form
        var tena_requestObject = tena_getQueryVariable("Data");
        vals = decodeURIComponent(tena_requestObject).split("&");
        for (var i in vals) {
            vals[i] = vals[i].replace(/\+/g, " ").split("=");
            if (i == 0) { tena_regardingobjectid = vals[i][1]; }
            if (i == 1) { tena_regardingobjectidtype = vals[i][1]; }
            if (i == 2) { tena_regardingobjectidname = vals[i][1]; }
        }

        //Verify request key data was transferred from CRM request form
        if (tena_regardingobjectid == '' || tena_regardingobjectid == null || tena_regardingobjectidtype == '' || tena_regardingobjectidtype == null ||
            tena_regardingobjectidname == '' || tena_regardingobjectidname == null) {
            alert('The related request and/or veteran has insufficient data (regardingobject) to execute the Triage Expert application!, please close this application window or tab.');
            return false;
        }

        //Get Request/Incident data
        var tena_requestData = tena_getSingleEntityDataSync('IncidentSet', 'CustomerId', tena_regardingobjectid);
        if (tena_requestData != null) {
            if (tena_requestData.d.CustomerId != null) {
                //Set as veteran id
                tena_veteranId = tena_requestData.d.CustomerId.Id;
                tena_VeteranName = tena_requestData.d.CustomerId.Name;
            }
        }

        //Verify veteran has value
        if (tena_veteranId == null || tena_veteranId == '') {
            alert('The related request and/or veteran has insufficient data (customerid) to execute the Triage Expert application!, please close this application window or tab.');
            return false;
        }

        //Get veteran/contact data
        var tena_facilityId = '';
        var tena_facilityName = '';
        var tena_dateofBirth = '';
        var tena_genderCode = '';
        var tena_genderName = '';
        var tena_addressState = '';

        var tena_contactData = tena_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, ftp_currentfacilityid, ftp_FacilityId, GenderCode, Address1_StateOrProvince, Address2_StateOrProvince, ftp_Gender', tena_veteranId);
        if (tena_contactData != null) {
            //7/12/18 removed fallback to veteran Home Facility
            if (tena_contactData.d.ftp_currentfacilityid != null) {
                if (tena_contactData.d.ftp_currentfacilityid.Id != null) {
                    tena_facilityId = tena_contactData.d.ftp_currentfacilityid.Id;
                    tena_facilityName = tena_contactData.d.ftp_currentfacilityid.Name;
                }
                //else {
                //    //Get Facility from Home Facility
                //    if (tena_contactData.d.ftp_FacilityId != null) {
                //        tena_facilityId = tena_contactData.d.ftp_FacilityId.Id;
                //        tena_facilityName = tena_contactData.d.ftp_FacilityId.Name;
                //    }
                //}
            }
            //else {
            //    //Get Facility from Home Facility
            //    if (tena_contactData.d.ftp_FacilityId != null) {
            //        tena_facilityId = tena_contactData.d.ftp_FacilityId.Id;
            //        tena_facilityName = tena_contactData.d.ftp_FacilityId.Name;
            //    }
            //}

            if (tena_contactData.d.ftp_DateofBirth != null) {
                tena_dateofBirth = tena_contactData.d.ftp_DateofBirth;
            }
            /*
            if (tena_contactData.d.GenderCode != null) {
                tena_genderCode = tena_contactData.d.GenderCode.Value;
                if (tena_genderCode == 1) { tena_genderName = 'Male'; }
                if (tena_genderCode == 2) { tena_genderName = 'Female'; }
            }
            */
            if (tena_contactData.d.Address1_StateOrProvince != null) {
                tena_addressState = tena_contactData.d.Address1_StateOrProvince;
            }
            if (tena_addressState == '') {
                if (tena_contactData.d.Address2_StateOrProvince != null) {
                    tena_addressState = tena_contactData.d.Address2_StateOrProvince;
                }
            }
            if (tena_contactData.d.ftp_Gender != null) {
                tena_genderName = tena_contactData.d.ftp_Gender;
            }
        }

        //Get Facility and lookup facility number
        var tena_facilityCode = '';
        if (tena_facilityId != null && tena_facilityId != '') {
            var tena_facilityData = tena_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode, ftp_FacilityCode_text', tena_facilityId);
            if (tena_facilityData.d.ftp_facilitycode != null) {
                //tena_facilityCode = tena_facilityData.d.ftp_facilitycode.toString();
                tena_facilityCode = tena_facilityData.d.ftp_FacilityCode_text.toString();
            }
        }

        //Display search content
        document.getElementById('lblSummary').innerHTML = "&nbsp;&nbsp;&nbsp;Veteran: " + tena_VeteranName + "&nbsp;&nbsp;&nbsp;DOB: " + tena_dateofBirth + "&nbsp;&nbsp;&nbsp;Gender: " + tena_genderName + "&nbsp;&nbsp;&nbsp;Facility: " + tena_facilityCode + "&nbsp;&nbsp;&nbsp;State: " + tena_addressState;

        //Validate that minimum data exists, if not display warning and use default data
        if (tena_dateofBirth == '') {
            tena_dateofBirth = '1/1/1950';
            alert('WARNING: The associated veteran record does not have a date of birth value, a default of 1/1/1950 will be used!');
        }
        if (tena_genderName == '') {
            tena_genderName = 'Male';
            alert('WARNING: The associated veteran record does not have a gender specified, a default of Male will be used!');
        }

        var tena_startObject = new Object();
        tena_startObject['dob'] = tena_dateofBirth;
        tena_startObject['gender'] = tena_genderName;
        tena_startObject['facilityid'] = tena_facilityCode;
        tena_startObject['residencestate'] = tena_addressState;

        $('#expertWidget').expertui('start', tena_startObject);

    }
    catch (err) {
        alert('Triage Expert Notes Form Load Script Function Error(tena_doStart): ' + err.message);
    }
}


function tena_executeCrmOdataGetRequest(tena_jsonQuery, tena_aSync, tena_aSyncCallback, tena_skipCount, tena_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*tena_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*tena_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*tena_aSyncCallback* - specify the name of the return function to call upon completion (required if tena_aSync = true.  Otherwise '')
    //*tena_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*tena_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var tena_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: tena_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                tena_entityData = data;
                if (tena_aSync == true) {
                    tena_aSyncCallback(tena_entityData, tena_skipCount, tena_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in tena_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + tena_jsonQuery);
            },
            async: tena_aSync,
            cache: false
        });
        return tena_entityData;
    }
    catch (err) {
        alert('An error occured in the tena_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function tena_getSingleEntityDataSync(tena_entitySetName, tena_attributeSet, tena_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*tena_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*tena_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*tena_entityId* - is the Guid for the entity record

    try {
        var tena_entityIdNoBracket = tena_entityId.replace(/({|})/g, '');
        var tena_selectString = '(guid' + "'" + tena_entityIdNoBracket + "'" + ')?$select=' + tena_attributeSet;
        var tena_jsonQuery = tena_serverUrl + tena_crmOdataEndPoint + '/' + tena_entitySetName + tena_selectString;
        var tena_entityData = tena_executeCrmOdataGetRequest(tena_jsonQuery, false, '', 0, null);
        return tena_entityData;
    }
    catch (err) {
        alert('An error occured in the tena_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}