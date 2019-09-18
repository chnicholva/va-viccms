/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />
/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/kendo.all.min.js' />

//ProgressNoteSignerSearchScriptLib.js
//Contains variables and functions used by the ProgressNoteSignerSearch.html page

//Static Variables
var pnss_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var pnss_context = GetGlobalContext();
var pnss_serverUrl = pnss_context.getClientUrl();

var pnss_orgName = pnss_context.getOrgUniqueName();
var pnss_userId = pnss_context.getUserId();
var pnss_userSiteId = '';
var pnss_UserSiteNo = '';
var pnss_duz = '';
var pnss_providername = '';
var pnss_baseServiceEndpointUrl = null;
var pnss_requestingApp = null;
var pnss_consumingAppToken = null;
var pnss_consumingAppPassword = null;

var pnss_incidentEntity = false;
var pnss_signerPrefix = "PN";

//var pnss_VistaUsersURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VistaUsers/1.0/json/ftpCRM/john/smith/1234?noFilter=true';  //OLD MANUAL DEV URL
var pnss_VistaUsersURLbase = '';

function pnss_SettingsWebServiceURL_response(pnss_settingData, pnss_lastSkip, pnss_Blank_NA) {
    try {
        //pnss_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var pnss_DacUrl = null;
        var pnss_VistaUserApiUrl = null;

        for (var i = 0; i <= pnss_settingData.d.results.length - 1; i++) {
            //Get info
            if (pnss_settingData.d.results[i].ftp_DACURL != null) { pnss_DacUrl = pnss_settingData.d.results[i].ftp_DACURL; }
            if (pnss_settingData.d.results[i].ftp_VistaUsersAPIURL != null) { pnss_VistaUserApiUrl = pnss_settingData.d.results[i].ftp_VistaUsersAPIURL; }
            if (pnss_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { pnss_baseServiceEndpointUrl = pnss_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (pnss_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { pnss_requestingApp = pnss_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (pnss_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { pnss_consumingAppToken = pnss_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (pnss_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { pnss_consumingAppPassword = pnss_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            break;
        }
        if (pnss_DacUrl != null && pnss_VistaUserApiUrl != null) {
            //Construct full web service URL
            pnss_VistaUsersURLbase = pnss_DacUrl + pnss_VistaUserApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VISTA USERS SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }

        if (pnss_baseServiceEndpointUrl == null || pnss_requestingApp == null || pnss_consumingAppToken == null || pnss_consumingAppPassword == null) {
            parent.Xrm.Page.ui.setFormNotification("ERROR: THE 'VIA Service Connector' CONFIGURATION IS MISSING DATA IN THE 'Settings Entity', PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
        //Decrypt VIA Service Connector Items
        pnss_requestingApp = pnss_decryptServiceConnector(pnss_requestingApp, 4);
        pnss_consumingAppToken = pnss_decryptServiceConnector(pnss_consumingAppToken, 6);
        pnss_consumingAppPassword = pnss_decryptServiceConnector(pnss_consumingAppPassword, 8);
    }
    catch (err) {
        alert('Progress Note Signer Search Web Resource Function Error(pnss_SettingsWebServiceURL_response): ' + err.message);
    }
}

function pnss_decryptServiceConnector(pnss_connectorArray, pnss_connectorValue) {
    var pnss_decryptedString = "";
    if (pnss_connectorArray != null && pnss_connectorArray != "") {
        var pnss_newArray = pnss_connectorArray.toString().split(',');
        pnss_newArray.reverse();
        for (i = 0; i < pnss_newArray.length; i++) {
            var pnss_curChar = "";
            if (i == 0) {
                pnss_curChar = pnss_newArray[i] - pnss_connectorValue;
            }
            else {
                pnss_curChar = pnss_newArray[i] - (i + pnss_connectorValue);
            }
            pnss_decryptedString = pnss_decryptedString + String.fromCharCode(pnss_curChar);
        }
    }
    return pnss_decryptedString;
}

function pnss_formLoad() {
    //debugger;
    try {
        //Check if parent entity is of type 'incident'
        if (parent.Xrm.Page.data.entity.getEntityName() == 'incident') {
            pnss_incidentEntity = true;
            pnss_signerPrefix = "RN"
        }

        //Proceed to grid data load....
        pnss_createLookupControl();
        pnss_createSelectedControl();

        //Set focus to cancel button if Tab_AdditionalSigners is Visible
        if (pnss_incidentEntity == false) {
            if (parent.Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').getVisible() == true) {
                document.getElementById('btnCancel').focus();
            }
        }

        var siteData = setUserSite();

        //Check if VIA Login cookie exist (not expired)
        var pnss_ViaLoginCookie = pnss_getCookie("viasessionlink");

        var pnss_ViaLoginData = null;

        if (pnss_ViaLoginCookie != "")
            pnss_ViaLoginData = JSON.parse(pnss_ViaLoginCookie);

        if (pnss_ViaLoginCookie != null && pnss_ViaLoginCookie != '') {
            if (pnss_ViaLoginData.length > 1) {
                if (siteData != null) {
                    for (var j = 0; j < pnss_ViaLoginData.length; j++) {
                        if (pnss_ViaLoginData[j].siteCode == siteData.SiteNo) {
                            pnss_duz = pnss_ViaLoginData[j].duz;
                            pnss_providername = pnss_ViaLoginData[j].providerName;
                            break;
                        }
                    }
                } else {
                    pnss_duz = pnss_ViaLoginData[0].duz;
                    pnss_providername = pnss_ViaLoginData[0].providerName;
                }
            } else if (pnss_ViaLoginData.length == 1) {
                pnss_duz = pnss_ViaLoginData[0].duz;
                pnss_providername = pnss_ViaLoginData[0].providerName;
            }
        }

        //if (pnss_ViaLoginCookie != null && pnss_ViaLoginCookie != '') {
        //    var pnss_cookiearray = pnss_ViaLoginCookie.split("~~~~", 2);
        //    pnss_duz = pnss_cookiearray[0];
        //    pnss_providername = pnss_cookiearray[1];
        //}

        //Check Cookie return values if missing exit
        // if (pnss_duz == '' || pnss_providername == '') { return false; } Why would I ever want to do this?

        //GET CRM SETTINGS WEB SERVICE URLS
        var pnss_conditionalFilter = "(mcs_name eq 'Active Settings')";
        pnss_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_VIAServiceBaseURL, ftp_VIARequestingApplicationCode, ftp_VIAConsumingApplicationToken, ftp_VIAConsumingApplicationPassword, ftp_DACURL, ftp_VistaUsersAPIURL', pnss_conditionalFilter, 'mcs_name', 'asc', 0, pnss_SettingsWebServiceURL_response, '');

        //Get the current CRM User's assigned site/facility
        //var pnss_userData = pnss_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', pnss_userId);
        //if (pnss_userData != null) {
        //    if (pnss_userData.d.ftp_FacilitySiteId != null) {
        //        pnss_userSiteId = pnss_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}

        //Lookup the Facility/Site #
        //if (pnss_userSiteId != null && pnss_userSiteId != '') {
        //    var pnss_facilityData = pnss_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', pnss_userSiteId);
        //    if (pnss_facilityData != null) {
        //        if (pnss_facilityData.d.ftp_facilitycode != null) { pnss_UserSiteNo = pnss_facilityData.d.ftp_facilitycode; }
        //    }
        //}	
        //alert("Load1: " + pnss_UserSiteNo);
        //setUserSite();
        //alert("Load2: " + pnss_UserSiteNo);
    }
    catch (err) {
        alert('Progress Note Signer Search Web Resource Function Error(pnss_formLoad): ' + err.message);
    }
}

function setUserSite() {
    var retVal = null;
    var progressNoteFacility = parent.Xrm.Page.data.entity.attributes.get("ftp_progressnotefacility");

    if (progressNoteFacility != null) {
        var progressNoteFacilityLookup = progressNoteFacility.getValue();
        if (progressNoteFacilityLookup != null) {
            if (progressNoteFacilityLookup.length != null) {
                if (progressNoteFacilityLookup.length > 0) {
                    var facilityId = progressNoteFacilityLookup[0].id;
                    if (facilityId[0] == '{')
                        facilityId = facilityId.substring(1, facilityId.length - 1);
                    $.ajax({
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilities(" + facilityId + ")?$select=_ftp_facility_id_value,ftp_facilitycode_text",
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                            XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                            XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                        },
                        async: false,
                        success: function (data, textStatus, xhr) {
                            var result = data;
                            var ftp_facility_id = result["ftp_facilityid"];
                            var ftp_facilitycode_text = result["ftp_facilitycode_text"];
                            pnss_userSiteId = ftp_facility_id;
                            pnss_UserSiteNo = ftp_facilitycode_text;
                            retVal = { SiteId: pnss_userSiteId, SiteNo: pnss_UserSiteNo };
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
                        }
                    });
                }
            }
        }
    }

    return retVal;
}

function pnss_selectAddGridRow(arg) {
    try {
        var pnss_selectedRows = this.select();
        var pnss_selectedDataItems = [];
        var pnss_recordID = null;
        var pnss_recordType = null;
        var pnss_recordIconURL = null;
        var pnss_recordName = null;
        var pnss_recordIEN = null;
        for (var i = 0; i < pnss_selectedRows.length; i++) {
            pnss_gridDataItem = this.dataItem(pnss_selectedRows[i]);
            pnss_recordID = pnss_gridDataItem.ID
            pnss_recordType = pnss_gridDataItem.Type;
            pnss_recordIconURL = pnss_gridDataItem.IconURL;
            pnss_recordName = pnss_gridDataItem.Name;
            pnss_recordIEN = pnss_gridDataItem.IEN;
        }

        var pnss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (pnss_recordID != null) {
            //Add to selected grid
            //Determine if it already exist, if so cancel add...
            if (pnss_entitySelectedGrid.dataSource.get(pnss_recordID) == null) {
                pnss_entitySelectedGrid.dataSource.pushCreate({
                    ID: pnss_recordID,
                    Type: pnss_recordType,
                    IconURL: pnss_recordIconURL,
                    Name: pnss_recordName,
                    IEN: pnss_recordIEN
                });
            }
            //Remove row from lookup grid
            pnss_entitySearchGrid.dataSource.remove(pnss_gridDataItem);
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_selectAddGridRow): ' + err.message);
    }
}

function pnss_selectRemoveGridRow(arg) {
    try {
        //Disable select if disabled
        if (document.getElementById('btnSelect').disabled == true) { return false; }

        var pnss_selectedRows = this.select();
        var pnss_selectedDataItems = [];
        var pnss_recordID = null;
        var pnss_recordType = null;
        var pnss_recordIconURL = null;
        var pnss_recordName = null;
        for (var i = 0; i < pnss_selectedRows.length; i++) {
            pnss_gridDataItem = this.dataItem(pnss_selectedRows[i]);
            pnss_recordID = pnss_gridDataItem.ID
            pnss_recordType = pnss_gridDataItem.Type;
            pnss_recordIconURL = pnss_gridDataItem.IconURL;
            pnss_recordName = pnss_gridDataItem.Name;
        }

        var pnss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (pnss_recordID != null) {
            //Remove row from selected grid
            pnss_entitySelectedGrid.dataSource.remove(pnss_gridDataItem);
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_selectRemoveGridRow): ' + err.message);
    }
}

function pnss_clickAddGridRow(e) {
    try {
        var pnss_gridDataItem = this.dataItem($(e.currentTarget).closest('tr'));
        var pnss_recordID = pnss_gridDataItem.ID;
        var pnss_recordType = pnss_gridDataItem.Type;
        var pnss_recordIconURL = pnss_gridDataItem.IconURL;
        var pnss_recordName = pnss_gridDataItem.Name;
        var pnss_recordIEN = pnss_gridDataItem.IEN;

        var pnss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (pnss_recordID != null) {
            //Add to selected grid
            //Determine if it already exist, if so cancel add...
            if (pnss_entitySelectedGrid.dataSource.get(pnss_recordID) == null) {
                pnss_entitySelectedGrid.dataSource.pushCreate({
                    ID: pnss_recordID,
                    Type: pnss_recordType,
                    IconURL: pnss_recordIconURL,
                    Name: pnss_recordName,
                    IEN: pnss_recordIEN
                });
            }
            //Remove row from lookup grid
            pnss_entitySearchGrid.dataSource.remove(pnss_gridDataItem);
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_clickAddGridRow): ' + err.message);
    }
}

function pnss_clickRemoveGridRow(e) {
    try {
        //Disable select if disabled
        if (document.getElementById('btnSelect').disabled == true) { return false; }

        var pnss_gridDataItem = this.dataItem($(e.currentTarget).closest('tr'));
        var pnss_recordID = pnss_gridDataItem.ID;
        var pnss_recordType = pnss_gridDataItem.Type;
        var pnss_recordIconURL = pnss_gridDataItem.IconURL;
        var pnss_recordName = pnss_gridDataItem.Name;

        var pnss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        if (pnss_recordID != null) {
            //Remove row from selected grid
            pnss_entitySelectedGrid.dataSource.remove(pnss_gridDataItem);
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_clickRemoveGridRow): ' + err.message);
    }
}

function pnss_createLookupControl() {
    try {
        var pnss_addButtonText = " Add ";
        $('#ku_lookupgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'Type', type: 'string', hidden: true },
                { field: 'IconURL', type: 'string', hidden: true },
                {
                    template: "<div class='entity-icon'" +
                        "style='background-image: url(#:data.IconURL#);' title='#: Type # - #: Name #'></div>" +
                        "<div title='#: Type # - #: Name #' class='entity-label'>#: Name #</div>",
                    field: 'Name', title: 'Name', type: 'string'
                },
                { field: 'IEN', type: 'string', hidden: true },
                { command: { text: pnss_addButtonText, click: pnss_clickAddGridRow }, title: ' ', width: '110px' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },
            groupable: false,
            sortable: false,
            editable: false,
            height: 300,
            resizable: true,
            navigatable: true,
            selectable: "row",
            noRecords: true,
            change: pnss_selectAddGridRow
        });
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_createLookupControl) Error Detail: ' + err.message);
        return null;
    }
}

function pnss_createSelectedControl() {
    try {
        var pnss_removeButtonText = " Remove ";
        $('#ku_selectedgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'Type', type: 'string', hidden: true },
                { field: 'IconURL', type: 'string', hidden: true },
                {
                    template: "<div class='entity-icon'" +
                        "style='background-image: url(#:data.IconURL#);' title='#: Type # - #: Name #'></div>" +
                        "<div title='#: Type # - #: Name #' class='entity-label'>#: Name #</div>",
                    field: 'Name', title: 'Name', type: 'string'
                },
                { field: 'IEN', type: 'string', hidden: true },
                { command: { text: pnss_removeButtonText, click: pnss_clickRemoveGridRow }, title: ' ', width: '110px' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },
            groupable: false,
            sortable: false,
            editable: false,
            height: 300,
            resizable: true,
            navigatable: true,
            selectable: "row",
            noRecords: true,
            change: pnss_selectRemoveGridRow
        });

        //Initalize the selected control with values from CRM if they exist
        var pnss_selectedSigners = parent.Xrm.Page.getAttribute('ftp_selectedsigners').getValue();
        if (pnss_selectedSigners != null && pnss_selectedSigners != '') {
            pnss_populateSelectedGrid(pnss_selectedSigners);
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_createSelectedControl) Error Detail: ' + err.message);
        return null;
    }
}

function pnss_populateSelectedGrid(pnss_selectedSigners) {
    try {
        var pnss_selectedArray = pnss_selectedSigners.split('~~~');
        var pnss_selectedArrayRecordCount = pnss_selectedArray.length;
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');

        var pnss_selectedIENArray = '';
        var pnss_selectedIENArrayRecordCount = 0;
        var pnss_progressNoteId = parent.Xrm.Page.data.entity.getId();

        var pnss_arrayMismatch = false;

        //Determine if NEW or INT status of array. (NEW - not processed, INT - INT is integrated note)
        if (pnss_selectedArray[0] == 'INT') {
            //Disable controls when not NEW
            document.getElementById('searchtext').disabled = true;
            document.getElementById('searchbuttonid').disabled = true;
            document.getElementById('btnSelect').disabled = true;
            //Change title of the cancel button
            document.getElementById('btnCancel').value = 'Close Search';
            document.getElementById('btnCancel').title = 'Click here to close the search form.';
            //Hide the grid's remove button column
            pnss_entitySelectedGrid.hideColumn(4);
        }

        //Get Note's Browser Local Storage Values
        if (pnss_progressNoteId != null && pnss_progressNoteId != '') {
            var pnss_localStorageVarName = pnss_signerPrefix + pnss_progressNoteId;
            var pnss_localStorageStringValue = localStorage.getItem(pnss_localStorageVarName);
            if (pnss_localStorageStringValue != null && pnss_localStorageStringValue != '') {
                //alert("local storage value: " + pnss_localStorageStringValue);
                pnss_selectedIENArray = pnss_localStorageStringValue.split('~~~');
                pnss_selectedIENArrayRecordCount = pnss_selectedIENArray.length;
                //alert("LocalStorageArrayLength: " + pnss_selectedIENArrayRecordCount);
            }
        }

        //Compare CRM signer array length with LocalStorage array length
        if (pnss_selectedArrayRecordCount != pnss_selectedIENArrayRecordCount) { pnss_arrayMismatch = true; }

        //*****TESTING****
        if (pnss_arrayMismatch == true) {
            //alert("TEST MESSAGE: IEN/CRM, selected signers mismatch");
        }
        else {
            //alert("TEST MESSAGE: IEN/CRM, selected signers MATCH!");
        }
        //****************


        //Add previously selected users
        for (var i = 1; i < pnss_selectedArrayRecordCount; i++) {
            //***SPLIT ID & NAME***
            var pnss_recordIdName = (pnss_selectedArray[i]).split('___');
            //var pnss_recordID = (pnss_selectedArray[i]).substring(4);
            var pnss_recordID = (pnss_recordIdName[0]).substring(4);
            //var pnss_recordType = (pnss_selectedArray[i]).substring(0, 4);
            var pnss_recordType = (pnss_recordIdName[0]).substring(0, 4);

            var pnss_recordName = pnss_recordIdName[1];
            //alert(pnss_recordName);

            if (pnss_arrayMismatch != true) {
                var pnss_recordIEN = pnss_selectedIENArray[i];
            }
            else {
                var pnss_recordIEN = '0';
            }

            var pnss_recordIconURL = '';
            if (pnss_recordType == 'USER') { pnss_recordIconURL = 'img/ico_user.gif'; }
            //Insert in selected grid
            pnss_entitySelectedGrid.dataSource.pushCreate({
                ID: pnss_recordIEN,
                Type: pnss_recordType,
                IconURL: pnss_recordIconURL,
                Name: pnss_recordName,
                IEN: pnss_recordIEN
            });
        }

    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_populateSelectedGrid) Error Detail: ' + err.message);
        return null;
    }
}

function pnss_searchLookupEntity() {
    try {
        //Populate SystemUser Lookup Grid
        var pnss_entitySearchGrid = $('#ku_lookupgrid').data('kendoGrid');
        pnss_getViaUsersData(pnss_entitySearchGrid);
    }
    catch (err) {
        //Display Error
        alert('Progress Note Signer Search Script Failure Function(pnss_searchLookupEntity) Error Detail: ' + err);
    }
}

function pnss_getViaUsersData(pnss_cprsUserGridControl) {
    try {
        var pLogicalName = "";
        var pFacilityCode = "";
        var pnss_searchString = document.getElementById('searchtext').value;
        //Clear existing grid
        pnss_cprsUserGridControl.dataSource.data([]);
        //Make sure there is a text value
        if (pnss_searchString == null || pnss_searchString == '') { return false; }

        try {
            pLogicalName = parent.Xrm.Page.data.entity.getEntityName();
        }
        catch (ex) {

        }

        if (pLogicalName === "ftp_additionalsigner"
            || pLogicalName === "ftp_addendum") {
            pFacilityCode = parent.Xrm.Page.getAttribute('ftp_facilityid');
            if (!pFacilityCode) {
                alert("Facility not located. Facility must be provided.")
                return false;
            }
        }
        else {
            //Verify the user is logged in to VIA
            if (pnss_duz == '' || pnss_providername == '') {
                alert("Please login to VistA, before you begin a search!")
                return false;
            }
        }

        var siteData;
        if (!pFacilityCode) {
            siteData = setUserSite();
        }
        else {
            siteData = {
                SiteNo: pFacilityCode.getValue()
            };
            pnss_UserSiteNo = pFacilityCode.getValue();
        }
        //Check if VIA Login cookie exist (not expired)
        var pnss_ViaLoginCookie = pnss_getCookie("viasessionlink");

        var pnss_ViaLoginData = null;

        if (pnss_ViaLoginCookie != "")
            pnss_ViaLoginData = JSON.parse(pnss_ViaLoginCookie);

        if (pnss_ViaLoginCookie != null && pnss_ViaLoginCookie != '') {
            if (pnss_ViaLoginData.length > 1) {
                if (siteData != null) {
                    for (var j = 0; j < pnss_ViaLoginData.length; j++) {
                        if (pnss_ViaLoginData[j].siteCode == siteData.SiteNo) {
                            pnss_duz = pnss_ViaLoginData[j].duz;
                            pnss_providername = pnss_ViaLoginData[j].providerName;
                            break;
                        }
                    }
                } else {
                    pnss_duz = pnss_ViaLoginData[0].duz;
                    pnss_providername = pnss_ViaLoginData[0].providerName;
                }
            } else if (pnss_ViaLoginData.length == 1) {
                pnss_duz = pnss_ViaLoginData[0].duz;
                pnss_providername = pnss_ViaLoginData[0].providerName;
            }
        }


        //Execute cprsUserLookup Service
        vialib_cprsUserLookup(pnss_requestingApp, pnss_consumingAppToken, pnss_consumingAppPassword, pnss_baseServiceEndpointUrl, pnss_providername, pnss_duz, pnss_UserSiteNo, pnss_searchString, pnss_getViaUsersData_response, pnss_cprsUserGridControl);
    }
    catch (err) {
        //Display Error
        alert('Progress Note Signer Search Script Failure Function(pnss_getViaUsersData) Error Detail: ' + err);
    }
}

function pnss_getViaUsersData_response(pnss_error, pnss_cprsuserlookupresponse, pnss_externalObject) {
    //debugger;
    try {
        //Check for non VIA service error
        if (pnss_error != null) {
            alert("The VIA cprsUserLookup service failed with error: " + pnss_cprsuserlookupresponse);
            return false;
        }
        //Test for VIA Service Error
        if (pnss_cprsuserlookupresponse.userArray.fault != null) {
            alert("VIA cprsUserLookup Service Error: " + pnss_cprsuserlookupresponse.userArray.fault.message);
            return false;
        }
        //Get VIA service Response
        if (pnss_cprsuserlookupresponse.userArray.users != null) {
            if (pnss_cprsuserlookupresponse.userArray.users.length > 0) {
                var pnss_userlookupArray = pnss_cprsuserlookupresponse.userArray.users;
                //Add users in result to grid
                for (var i = 0; i <= pnss_userlookupArray.length - 1; i++) {
                    //childNodes[0] holds the name, childnodes[1] holds the IEN, childNodes[2] holds the title
                    var pnss_ViaIEN = '';
                    var pnss_ViaFullName = '';
                    var pnss_ViaTitle = '';
                    if (pnss_userlookupArray[i].DUZ) { pnss_ViaIEN = pnss_userlookupArray[i].DUZ; }
                    if (pnss_userlookupArray[i].name) { pnss_ViaFullName = pnss_userlookupArray[i].name; }
                    if (pnss_userlookupArray[i].title) { pnss_ViaTitle = pnss_userlookupArray[i].title; }
                    if (pnss_ViaIEN != '' && pnss_ViaFullName != '') {
                        //Add to the Grid
                        if (pnss_ViaTitle != '') { pnss_ViaFullName = pnss_ViaFullName + " " + pnss_ViaTitle; }
                        pnss_externalObject.dataSource.pushCreate({
                            ID: pnss_ViaIEN,
                            Type: 'USER',
                            IconURL: 'img/ico_user.gif',
                            Name: pnss_ViaFullName,
                            IEN: pnss_ViaIEN
                        });
                    }
                }
                return false;
            }
            else {
                alert("**No Via User Data Returned**");
                return false;
            }
        }
        else {
            alert("**No Via User Data Returned**");
            return false;
        }
    }
    catch (err) {
        //Display Error
        alert('Progress Note Signer Search Script Failure Function(pnss_getViaUsersData_response) Error Detail: ' + err);
    }
}

function pnss_searchKeyPress(event) {
    try {
        //Determine if 'enter' key was pressed if so initiate search
        var pnss_keypressed = event.which || event.keyCode;
        if (pnss_keypressed == 13) { pnss_searchLookupEntity(); }
    }
    catch (err) {
        //Display Error
        alert('Progress Note Signer Search Script Failure Function(pnss_searchKeyPress) Error Detail: ' + err);
    }
}

function pnss_applyProgressNoteSigners() {
    //debugger;
    try {
        //Write the selected user string...
        var pnss_selectedSigners = '';
        var pnss_selectedIEN = '';
        var pnss_entitySelectedGrid = $('#ku_selectedgrid').data('kendoGrid');
        //Determine if records have been selected
        var pnss_totalSelectedRecords = pnss_entitySelectedGrid.dataSource.total();
        if (pnss_totalSelectedRecords > 0) {
            //Add each record to the selected record string to be stored in CRM (NEW indicates that it is an unprocessed array)
            pnss_selectedSigners = 'NEW';
            pnss_selectedIEN = 'NEW';
            var pnss_gridData = pnss_entitySelectedGrid.dataSource.data();
            var pnss_totalNumGridRows = pnss_gridData.length;

            for (var i = 0; i < pnss_totalNumGridRows; i++) {
                var pnss_currentGridDataRow = pnss_gridData[i];
                var pnss_gridRowID = (1000 + i).toString();
                pnss_selectedSigners = pnss_selectedSigners + '~~~' + pnss_currentGridDataRow.Type + pnss_gridRowID + '___' + pnss_currentGridDataRow.Name;
                pnss_selectedIEN = pnss_selectedIEN + '~~~' + pnss_currentGridDataRow.IEN;
            }
        }

        //Write to CRM field
        parent.Xrm.Page.getAttribute('ftp_selectedsigners').setValue(pnss_selectedSigners);
        //Enforce save of values in read only field
        parent.Xrm.Page.getAttribute('ftp_selectedsigners').setSubmitMode('always');

        //Write to Browser LocalStorage
        var pnss_progressNoteId = parent.Xrm.Page.data.entity.getId();
        if (pnss_progressNoteId != null) {
            var pnss_localStorageVarName = pnss_signerPrefix + pnss_progressNoteId;
            if (pnss_selectedSigners != '') {
                localStorage.setItem(pnss_localStorageVarName, pnss_selectedIEN);
            }
            else {
                //If Selected Signers is blank, then remove LocalStorage values
                localStorage.removeItem(pnss_localStorageVarName);
            }
        }

        if (pnss_incidentEntity == false) {
            //Set focus to the main top tab and hide current tab
            parent.Xrm.Page.ui.tabs.get('Tab_General').setFocus();
            parent.Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setVisible(false);

            //Save the current CRM data
            parent.Xrm.Page.data.entity.save();
        }
        else {
            //parent.vcmn_collapseSignerSelection();
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_applyProgressNoteSigners) Error Detail: ' + err.message);
        return null;
    }
}

function pnss_cancelProgressNoteSigners() {
    try {
        if (pnss_incidentEntity == false) {
            //Set focus to the main top tab and hide current tab
            parent.Xrm.Page.ui.tabs.get('Tab_General').setFocus();
            parent.Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setVisible(false);
        }
        else {
            //parent.vcmn_collapseSignerSelection();
        }
    }
    catch (err) {
        alert('Progress Note Signer Search Script Failure: Function(pnss_cancelProgressNoteSigners) Error Detail: ' + err.message);
        return null;
    }
}

function pnss_getCookie(cname) {
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }
}

function pnss_executeCrmOdataGetRequest(pnss_jsonQuery, pnss_aSync, pnss_aSyncCallback, pnss_skipCount, pnss_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*pnss_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*pnss_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*pnss_aSyncCallback* - specify the name of the return function to call upon completion (required if pnss_aSync = true.  Otherwise '')
    //*pnss_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*pnss_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var pnss_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: pnss_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                pnss_entityData = data;
                if (pnss_aSync == true) {
                    pnss_aSyncCallback(pnss_entityData, pnss_skipCount, pnss_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in pnss_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + pnss_jsonQuery);
            },
            async: pnss_aSync,
            cache: false
        });
        return pnss_entityData;
    }
    catch (err) {
        alert('An error occured in the pnss_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function pnss_executeCrmOdataPostRequest(pnss_jsonQuery, pnss_aSync, pnss_jsonEntityData, pnss_recordAction, pnss_crmGuidFieldName) {
    //This function executes a CRM Odata web service call to create/update a Crm Record
    //*pnss_jsonQuery* - the complete query (url) to be executed
    //*pnss_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*pnss_jsonEntityData* - the crm entity data record to be created/updated
    //*pnss_recordAction* - the action to be performed in CAPS 'CREATE', 'UPDATE, 'DELETE'
    //*pnss_crmGuidFieldName* - the name of the unique identifier field that has the Guid/Id for the crm record created

    try {
        var pnss_crmEntityId = 'FAIL';

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: pnss_jsonQuery,
            data: pnss_jsonEntityData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                if (pnss_recordAction == 'UPDATE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'MERGE'); }
                if (pnss_recordAction == 'DELETE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'DELETE'); }
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (pnss_recordAction == 'CREATE') { pnss_crmEntityId = data.d[pnss_crmGuidFieldName].toString(); }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('Ajax Error in pnss_executeCrmOdataPostRequest: ' + errorThrown);
                pnss_crmEntityId = 'FAIL';
            },
            async: pnss_aSync
        });
        if (pnss_recordAction == 'CREATE') { return pnss_crmEntityId; }
    }
    catch (err) {
        alert('An error occured in the pnss_executeCrmOdataPostRequest function.  Error Detail Message: ' + err);
    }
}

function pnss_getMultipleEntityDataAsync(pnss_entitySetName, pnss_attributeSet, pnss_conditionalFilter, pnss_sortAttribute, pnss_sortDirection, pnss_skipCount, pnss_aSyncCallback, pnss_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*pnss_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*pnss_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*pnss_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*pnss_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*pnss_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*pnss_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*pnss_aSyncCallback* - is the name of the function to call when returning the result
    //*pnss_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var pnss_jsonQuery = pnss_serverUrl + pnss_crmOdataEndPoint + '/' + pnss_entitySetName + '?$select=' + pnss_attributeSet + '&$filter=' + pnss_conditionalFilter + '&$orderby=' + pnss_sortAttribute + ' ' + pnss_sortDirection + '&$skip=' + pnss_skipCount;
        pnss_executeCrmOdataGetRequest(pnss_jsonQuery, true, pnss_aSyncCallback, pnss_skipCount, pnss_optionArray);
    }
    catch (err) {
        alert('An error occured in the pnss_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function pnss_getSingleEntityDataSync(pnss_entitySetName, pnss_attributeSet, pnss_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*pnss_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*pnss_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*pnss_entityId* - is the Guid for the entity record

    try {
        var pnss_entityIdNoBracket = pnss_entityId.replace(/({|})/g, '');
        var pnss_selectString = '(guid' + "'" + pnss_entityIdNoBracket + "'" + ')?$select=' + pnss_attributeSet;
        var pnss_jsonQuery = pnss_serverUrl + pnss_crmOdataEndPoint + '/' + pnss_entitySetName + pnss_selectString;
        var pnss_entityData = pnss_executeCrmOdataGetRequest(pnss_jsonQuery, false, '', 0, null);
        return pnss_entityData;
    }
    catch (err) {
        alert('An error occured in the pnss_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}