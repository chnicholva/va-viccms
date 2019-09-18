//VistACPRSNoteButtonsScriptLib.js
//Contains variables and functions used by the VistACPRSNoteButtons.html page

//Static Variables
var vcnb_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vcnb_context = GetGlobalContext();
var vcnb_serverUrl = vcnb_context.getClientUrl();


 var xrm = window.location.host;
                var subURL = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
                                var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
	var EntitySetName = "mcs_settingSet";
        var selectString = "?$select=*&$filter=mcs_name eq 'Active Settings'";
        var jsonQuery = "https://" +xrm +"/"+ subURL + ODATA_ENDPOINT + "/" + EntitySetName + selectString;
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
                alert('Fail: Ajax Error in TRIBRIDGE.RetrieveAllAttributesByEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        	
    
    


                var baseUrl = EntityData.d.results[0].ftp_DACURL;
debugger;
var vcnb_NoteWriteUrl = baseUrl + EntityData.d.results[0].ftp_NotesWriteAPIURL;


function vcnb_formLoad() {
    try {
        //Initialize content based on Request/Note Status

        //Disable buttons if case is no longer open
        if (parent.Xrm.Page.getAttribute('statuscode').getValue() == 5 || parent.Xrm.Page.ui.getFormType() == 3 || parent.Xrm.Page.getAttribute('ftp_integrationresult').getValue() == 'OK') {
            document.getElementById('btnSaveOnly').disabled = true;
            document.getElementById('btnSaveToVistA').disabled = true;
        }

        //Set focus to cancel button if PROGRESS NOTE SECTION is Visible
        if (parent.Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').getVisible() == true) {
            document.getElementById('btnCancel').focus();
        }
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_formLoad): ' + err.message);
    }
}

function vcnb_buttonCancel() {
    try {
        //Set focus to the main top tab and hide current tab
        parent.Xrm.Page.ui.tabs.get('Tab_Summary').setFocus();
        parent.Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setVisible(false);
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_buttonCancel): ' + err.message);
    }
}

function vcnb_buttonSave() {
    try {
        //Save the current CRM data
        parent.Xrm.Page.data.entity.save();
        //Set focus to the main top tab and hide current tab
        parent.Xrm.Page.ui.tabs.get('Tab_Summary').setFocus();
        parent.Xrm.Page.ui.tabs.get('Tab_ProgressNotesInfo').setVisible(false);
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_buttonSave): ' + err.message);
    }
}

function vcnb_buttonSaveToVistA() {
    try {
        //Save the current CRM data
        parent.Xrm.Page.data.entity.save();

        //Get veteran data
        var vcnb_veteranId = parent.Xrm.Page.getAttribute('customerid').getValue();
        if (vcnb_veteranId == null) {
            alert('The current request does not have a veteran assigned, the note cannot be created in VistA/CPRS without a veteran assigned!');
            document.getElementById('btnCancel').focus();
            return false;
        }

        //Verify that the customerid is of type contact
        if (vcnb_veteranId[0].entityType != 'contact') {
            alert('The current request has an invalid customer type, it must be of the type veteran/contact, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }

        //Get veteran data
        //var vcnb_memberId = '';  //No longer used per Carol Smock 2/23/16 (ftp_EDIPI) use field below instead
        var vcnb_patientICN = '';  //From the crm contact entity field 'tri_VeteranID'
        var vcnb_veteranName = '';

        var vcnb_contactData = vcnb_getSingleEntityDataSync('ContactSet', 'FullName, tri_VeteranID', vcnb_veteranId[0].id);
        if (vcnb_contactData != null) {
            if (vcnb_contactData.d.FullName != null) { vcnb_veteranName = vcnb_contactData.d.FullName; }
            if (vcnb_contactData.d.tri_VeteranID != null) { vcnb_patientICN = vcnb_contactData.d.tri_VeteranID; }
        }

        //Verify Patient ICN
        if (vcnb_patientICN == '' || vcnb_patientICN == null) {
            alert('The assigned veteran does not have a patient ICN, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }

        //Get user data
        var vcnb_crmUserId = vcnb_context.getUserId();
        var vcnb_userDomainId = '';
        var vcnb_userData = vcnb_getSingleEntityDataSync('SystemUserSet', 'DomainName', vcnb_crmUserId);
        if (vcnb_userData != null) {
            if (vcnb_userData.d.DomainName != null) { vcnb_userDomainId = vcnb_userData.d.DomainName; }
        }

        //Get request form content
        var vcnb_noteDescription = parent.Xrm.Page.getAttribute('description').getValue();
        if (vcnb_noteDescription == null || vcnb_noteDescription == '') {
            alert('The note description field is empty, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }
        var vcnb_localTitle = parent.Xrm.Page.getAttribute('ftp_localtitle').getValue();  //Lookup
        if (vcnb_localTitle == null) {
            alert('The note local title field is empty, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }
        var vcnb_callbackNumber = parent.Xrm.Page.getAttribute('ftp_callbacknumber').getValue();
        if (vcnb_callbackNumber == null || vcnb_callbackNumber == '') {
            alert('The callback number field is empty, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }
        var vcnb_reasonForRequest = parent.Xrm.Page.getAttribute('ftp_reasonforrequest').getValue();  //Lookup
        if (vcnb_reasonForRequest == null) {
            alert('The reason for request field is empty, the note cannot be created in VistA/CPRS!');
            document.getElementById('btnCancel').focus();
            return false;
        }

        //Prompt user to confirm save  (Note: changed prompt below, to reflect USD, where form cannot be automatically closed)
        //var vcnb_confirmSaveToVista = confirm('Are you sure you want to save this note to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the request record will automatically close!');
        var vcnb_confirmSaveToVista = confirm('Are you sure you want to save this note to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the request record will automatically be marked as resolved and you will be prompted to exit the record!');

        if (vcnb_confirmSaveToVista == false) {
            document.getElementById('btnCancel').focus();
            return false;
        }

        var vcnb_encounterCode = parent.Xrm.Page.getAttribute('ftp_encountercode').getValue();
        if (vcnb_encounterCode == null) { vcnb_encounterCode = 'NEW'; }
        var vcnb_signThisNote = parent.Xrm.Page.getAttribute('ftp_signthisnote').getValue();
        if (vcnb_signThisNote == 100000001) { vcnb_signThisNote = true; } else { vcnb_signThisNote = false; }
        var vcnb_createdDateTime = parent.Xrm.Page.getAttribute('ftp_start').getValue();

        //Get Request/Note Guid/Id
        var vcnb_noteId = parent.Xrm.Page.data.entity.getId();

        //Execute Integration
        vcnb_executeVistAIntegrationRequest(vcnb_noteId, vcnb_noteDescription, vcnb_patientICN, vcnb_userDomainId, vcnb_localTitle[0].name, vcnb_callbackNumber, vcnb_reasonForRequest[0].name, vcnb_encounterCode, vcnb_signThisNote);
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_buttonSaveToVistA): ' + err.message);
    }
}

function vcnb_executeVistAIntegrationRequest(vcnb_noteId, vcnb_noteDescription, vcnb_patientICN, vcnb_userDomainId, vcnb_localTitle, vcnb_callbackNumber, vcnb_reasonForRequest, vcnb_encounterCode, vcnb_signThisNote) {
    try {
        var vcnb_requestJSON = {
            "NoteID": vcnb_noteId,
            "NoteText": vcnb_noteDescription,
            "PatientICN": vcnb_patientICN
        };
debugger;
        var vcnb_requestResponse = "";

        $.ajax({
            type: "POST",
            url: vcnb_NoteWriteUrl,
            data: JSON.stringify(vcnb_requestJSON),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var vcnb_newdata = JSON.parse(data);
                vcnb_requestResponse = vcnb_newdata;
                vcnb_vistAIntegrationRequest_response(null, vcnb_requestResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vcnb_vistAIntegrationRequest_response(errorThrown, null);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_executeVistAIntegrationRequest): ' + err.message);
    }
}

function vcnb_vistAIntegrationRequest_response(vcnb_errorThrown, vcnb_requestResponse) {
    try{
        //Process Integration Request Response
        if (vcnb_errorThrown != null) {
            //Write Error
            parent.Xrm.Page.getAttribute('ftp_integrationresult').setValue('ERROR');
            parent.Xrm.Page.getAttribute('ftp_integrationresult').setSubmitMode('always');
            parent.Xrm.Page.getAttribute('ftp_integrationerror').setValue(String(vcnb_errorThrown));
            parent.Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
            parent.Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
            parent.Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
            alert('The note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
            parent.Xrm.Page.getControl('ftp_integrationerror').setFocus();
            parent.Xrm.Page.data.entity.save();
            return false;
        }
        else {
            //Write web service response Success or Failure
            if (vcnb_requestResponse.ErrorOccurred == false) {
                //Write Success entry
                parent.Xrm.Page.getAttribute('ftp_integrationresult').setValue(vcnb_requestResponse.Status);
                parent.Xrm.Page.getAttribute('ftp_integrationresult').setSubmitMode('always');
                parent.Xrm.Page.getAttribute('ftp_integrationerror').setValue(null);
                parent.Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                parent.Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                parent.Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                parent.Xrm.Page.getControl('ftp_integrationresult').setFocus();
                //alert('The note creation in VistA/CPRS was successful, this request will now be closed and marked resolved.');
                alert('The note creation in VistA/CPRS was successful, this request will now be marked as resolved. \n\nPlease exit this request record after clicking OK to this prompt!');
                //parent.Xrm.Page.data.entity.save('saveandclose');  //This cannot be used with USD as the USD Tab remmains open
                vcnb_buttonSave();
            }
            else {
                //Write Failure entry
                parent.Xrm.Page.getAttribute('ftp_integrationresult').setValue(vcnb_requestResponse.Status);
                parent.Xrm.Page.getAttribute('ftp_integrationresult').setSubmitMode('always');
                parent.Xrm.Page.getAttribute('ftp_integrationerror').setValue(vcnb_requestResponse.ErrorMessage);
                parent.Xrm.Page.getAttribute('ftp_integrationerror').setSubmitMode('always');
                parent.Xrm.Page.getAttribute('ftp_integrationdate').setValue(new Date());
                parent.Xrm.Page.getAttribute('ftp_integrationdate').setSubmitMode('always');
                alert('The note creation in VistA/CPRS failed!\nPlease see the integration error field for details.');
                parent.Xrm.Page.getControl('ftp_integrationerror').setFocus();
                parent.Xrm.Page.data.entity.save();
                return false;
            }
        }
    }
    catch (err) {
        alert('Vista CPRS Note Buttons Function Error(vcnb_vistAIntegrationRequest_response): ' + err.message);
    }
}


function vcnb_executeCrmOdataGetRequest(vcnb_jsonQuery, vcnb_aSync, vcnb_aSyncCallback, vcnb_skipCount, vcnb_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vcnb_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vcnb_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vcnb_aSyncCallback* - specify the name of the return function to call upon completion (required if vcnb_aSync = true.  Otherwise '')
    //*vcnb_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vcnb_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vcnb_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vcnb_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vcnb_entityData = data;
                if (vcnb_aSync == true) {
                    vcnb_aSyncCallback(vcnb_entityData, vcnb_skipCount, vcnb_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vcnb_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + vcnb_jsonQuery);
            },
            async: vcnb_aSync,
            cache: false
        });
        return vcnb_entityData;
    }
    catch (err) {
        alert('An error occured in the vcnb_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vcnb_getMultipleEntityDataAsync(vcnb_entitySetName, vcnb_attributeSet, vcnb_conditionalFilter, vcnb_sortAttribute, vcnb_sortDirection, vcnb_skipCount, vcnb_aSyncCallback, vcnb_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vcnb_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcnb_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcnb_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vcnb_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vcnb_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vcnb_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vcnb_aSyncCallback* - is the name of the function to call when returning the result
    //*vcnb_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vcnb_jsonQuery = vcnb_serverUrl + vcnb_crmOdataEndPoint + '/' + vcnb_entitySetName + '?$select=' + vcnb_attributeSet + '&$filter=' + vcnb_conditionalFilter + '&$orderby=' + vcnb_sortAttribute + ' ' + vcnb_sortDirection + '&$skip=' + vcnb_skipCount;
        vcnb_executeCrmOdataGetRequest(vcnb_jsonQuery, true, vcnb_aSyncCallback, vcnb_skipCount, vcnb_optionArray);
    }
    catch (err) {
        alert('An error occured in the vcnb_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function vcnb_getSingleEntityDataSync(vcnb_entitySetName, vcnb_attributeSet, vcnb_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vcnb_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vcnb_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vcnb_entityId* - is the Guid for the entity record

    try {
        var vcnb_entityIdNoBracket = vcnb_entityId.replace(/({|})/g, '');
        var vcnb_selectString = '(guid' + "'" + vcnb_entityIdNoBracket + "'" + ')?$select=' + vcnb_attributeSet;
        var vcnb_jsonQuery = vcnb_serverUrl + vcnb_crmOdataEndPoint + '/' + vcnb_entitySetName + vcnb_selectString;
        var vcnb_entityData = vcnb_executeCrmOdataGetRequest(vcnb_jsonQuery, false, '', 0, null);
        return vcnb_entityData;
    }
    catch (err) {
        alert('An error occured in the vcnb_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}