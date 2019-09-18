/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />

//RequestNotesControlScriptLib.js
//Contains variables and functions used by the RequestNotesControl.html page

//Static Variables
var rnco_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var rnco_context = GetGlobalContext();
var rnco_serverUrl = rnco_context.getClientUrl();
var rnco_orgName = rnco_context.getOrgUniqueName();

function rnco_formLoad() {
    try {
        //Create Kendo Request Notes Grid
        rnco_createRequestNotesGrid();
    }
    catch (err) {
        alert('Request Comments Control Web Resource Function Error(rnco_formLoad): ' + err.message);
    }
}

function rnco_createRequestNotesGrid() {
    try {
        $('#ku_requestnotesgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: "Selected", title: " ", type: "boolean", template: "<input type='checkbox' class='checkbox' />", groupable: false, sortable: false, filterable: false, width: 40 },
                { field: 'CreatedOn', type: 'date', hidden: false, width: 100, title: "Created On" },
                { field: 'CreatedBy', type: 'string', hidden: false, width: 100, title: "Created By" },
                { field: 'NoteTitle', type: 'string', hidden: false, width: 180, title: "Comment Title" },
                { field: 'NoteText', type: 'string', hidden: false, width: 340, title: "Comment Text" }
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
            height: 220,
            resizable: true,
            navigatable: true,
            batch: true,
            noRecords: true,
            scrollable: true
        });

        var rnco_requestNotesGrid = $('#ku_requestnotesgrid').data('kendoGrid');
        //Bind click event to the checkbox
        rnco_requestNotesGrid.table.on("click", ".checkbox", rnco_selectCheckboxRow);

        //Populate Grid
        rnco_getCrmAnnotationData(0, rnco_requestNotesGrid);
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_createRequestNotesGrid): ' + err.message);
        return null;
    }
}

function rnco_selectCheckboxRow() {
    try {
        var rnco_checked = this.checked;
        var rnco_row = $(this).closest("tr");
        var rnco_requestNotesGrid = $('#ku_requestnotesgrid').data('kendoGrid');
        var rnco_dataItem = rnco_requestNotesGrid.dataItem(rnco_row);

        if (rnco_checked) {
            //-select the row
            rnco_row.addClass("k-state-selected");
        } else {
            //-remove selection
            rnco_row.removeClass("k-state-selected");
        }
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_selectCheckboxRow): ' + err.message);
        return null;
    }
}

function rnco_getCrmAnnotationData(rnco_skipCount, rnco_requestNotesGridControl) {
    try {
        //Stop Processing if more than 1000 Records have beeen retrieved
        if (rnco_skipCount >= 1000) { return false; }
        //Clear grid content if rnco_skipCount is zero
        if (rnco_skipCount == 0) { rnco_requestNotesGridControl.dataSource.data([]); }

        //Get the Related Request Id (Support control for progress note entity and request/incident entity only)
        var rnco_entityName = parent.Xrm.Page.data.entity.getEntityName();
        if (rnco_entityName == 'incident') {
            //Process incident record and get the current id
            var rnco_requestId = parent.Xrm.Page.data.entity.getId();
            if (rnco_requestId != null && rnco_requestId != "") {
                //Add conditions to query
                var rnco_conditionalFilter = "(ObjectId/Id eq guid'" + rnco_requestId + "' and ObjectTypeCode eq 'incident')";
                rnco_getMultipleEntityDataAsync('AnnotationSet', 'AnnotationId, ObjectTypeCode, FileName, NoteText, Subject, OwnerId, ObjectId, CreatedBy, CreatedOn', rnco_conditionalFilter, 'CreatedOn', 'asc', rnco_skipCount, rnco_getCrmAnnotationData_response, rnco_requestNotesGridControl);
            }
        }
        else {
            //Process request entity
            var rnco_requestId = parent.Xrm.Page.getAttribute('regardingobjectid').getValue();
            if (rnco_requestId != null) {
                //Add conditions to query
                var rnco_conditionalFilter = "(ObjectId/Id eq guid'" + rnco_requestId[0].id + "' and ObjectTypeCode eq 'incident')";
                rnco_getMultipleEntityDataAsync('AnnotationSet', 'AnnotationId, ObjectTypeCode, FileName, NoteText, Subject, OwnerId, ObjectId, CreatedBy, CreatedOn', rnco_conditionalFilter, 'CreatedOn', 'asc', rnco_skipCount, rnco_getCrmAnnotationData_response, rnco_requestNotesGridControl);
            }
        }
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_getCrmAnnotationData): ' + err.message);
        return null;
    }
}

function rnco_getCrmAnnotationData_response(rnco_AnnotationData, rnco_lastSkip, rnco_requestNotesGridControl) {
    try {
        //rnco_lastSkip is the starting point in the result (use if more than 50 records)
        for (var i = 0; i <= rnco_AnnotationData.d.results.length - 1; i++) {
            var rnco_annotationid = null;
            var rnco_createdon = null;
            var rnco_createdby = null
            var rnco_subject = null;
            var rnco_notetext = null;

            //Get info
            if (rnco_AnnotationData.d.results[i].AnnotationId != null) { rnco_annotationid = rnco_AnnotationData.d.results[i].AnnotationId; }
            if (rnco_AnnotationData.d.results[i].CreatedOn != null) { rnco_createdon = rnco_AnnotationData.d.results[i].CreatedOn; }
            if (rnco_AnnotationData.d.results[i].CreatedBy != null) { rnco_createdby = rnco_AnnotationData.d.results[i].CreatedBy.Name; }
            if (rnco_AnnotationData.d.results[i].Subject != null) { rnco_subject = rnco_AnnotationData.d.results[i].Subject; }
            if (rnco_AnnotationData.d.results[i].NoteText != null) { rnco_notetext = rnco_AnnotationData.d.results[i].NoteText; }

            //Add to the grid
            rnco_requestNotesGridControl.dataSource.pushCreate({
                ID: rnco_annotationid,
                CreatedOn: new Date(parseInt(rnco_createdon.substr(6))),
                CreatedBy: rnco_createdby,
                NoteTitle: rnco_subject,
                NoteText: rnco_notetext
            });
        }
        if (rnco_AnnotationData.d.__next != null) {
            rnco_getCrmAnnotationData(rnco_lastSkip + 50, rnco_requestNotesGridControl);
        }
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_getCrmAnnotationData_response): ' + err.message);
        return null;
    }
}

function rnco_buttonRefreshNotes() {
    try {
        var rnco_requestNotesGrid = $('#ku_requestnotesgrid').data('kendoGrid');
        //Populate Grid
        rnco_getCrmAnnotationData(0, rnco_requestNotesGrid);
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_buttonRefreshNotes): ' + err.message);
        return null;
    }
}

function rnco_buttonApplyNotes() {
    try {
        //Ignore button click if entity form is read only
        if (parent.Xrm.Page.ui.getFormType() >= 3) {
            return false;
        }

        var rnco_requestNotesGrid = $('#ku_requestnotesgrid').data('kendoGrid');
        var rnco_selectedNotesString = "";
        var rnco_items = rnco_requestNotesGrid.items();
        rnco_items.each(function (idx, row) {
            var rnco_dataItem = rnco_requestNotesGrid.dataItem(row);
            if (row.className === "k-state-selected" || row.className == "k-alt k-state-selected") {
                if (rnco_dataItem.CreatedOn != null && rnco_dataItem.CreatedOn != undefined && rnco_dataItem.CreatedOn != '') {
                    if (rnco_selectedNotesString != "") { rnco_selectedNotesString = rnco_selectedNotesString + "\n"; }
                    rnco_selectedNotesString = rnco_selectedNotesString + rnco_dataItem.CreatedOn.toString() + "\n";
                }
                if (rnco_dataItem.CreatedBy != null && rnco_dataItem.CreatedBy != undefined && rnco_dataItem.CreatedBy != '') {
                    rnco_selectedNotesString = rnco_selectedNotesString + "Created By: " + rnco_dataItem.CreatedBy.toString() + "\n";
                }
                if (rnco_dataItem.NoteTitle != null && rnco_dataItem.NoteTitle != undefined && rnco_dataItem.NoteTitle != '') {
                    rnco_selectedNotesString = rnco_selectedNotesString + "Comments Title: " + rnco_dataItem.NoteTitle.toString() + "\n";
                }
                if (rnco_dataItem.NoteText != null && rnco_dataItem.NoteText != undefined && rnco_dataItem.NoteText != '') {
                    rnco_selectedNotesString = rnco_selectedNotesString + rnco_dataItem.NoteText.toString() + "\n";
                }
            }
        });

        if (rnco_selectedNotesString != "") {
            parent.Xrm.Page.getAttribute('ftp_notedetail').setValue(rnco_selectedNotesString + "\n" + parent.Xrm.Page.getAttribute('ftp_notedetail').getValue());
            parent.Xrm.Page.getAttribute('ftp_notedetail').setSubmitMode('always');
        }
    }
    catch (err) {
        alert('Request Comments Grid Web Resource Function Error(rnco_buttonApplyNotes): ' + err.message);
        return null;
    }
}

function rnco_executeCrmOdataGetRequest(rnco_jsonQuery, rnco_aSync, rnco_aSyncCallback, rnco_skipCount, rnco_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*rnco_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*rnco_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*rnco_aSyncCallback* - specify the name of the return function to call upon completion (required if rnco_aSync = true.  Otherwise '')
    //*rnco_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*rnco_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var rnco_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: rnco_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                rnco_entityData = data;
                if (rnco_aSync == true) {
                    rnco_aSyncCallback(rnco_entityData, rnco_skipCount, rnco_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in rnco_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + rnco_jsonQuery);
            },
            async: rnco_aSync,
            cache: false
        });
        return rnco_entityData;
    }
    catch (err) {
        alert('An error occured in the rnco_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function rnco_getMultipleEntityDataAsync(rnco_entitySetName, rnco_attributeSet, rnco_conditionalFilter, rnco_sortAttribute, rnco_sortDirection, rnco_skipCount, rnco_aSyncCallback, rnco_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*rnco_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rnco_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rnco_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*rnco_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*rnco_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*rnco_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*rnco_aSyncCallback* - is the name of the function to call when returning the result
    //*rnco_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var rnco_jsonQuery = rnco_serverUrl + rnco_crmOdataEndPoint + '/' + rnco_entitySetName + '?$select=' + rnco_attributeSet + '&$filter=' + rnco_conditionalFilter + '&$orderby=' + rnco_sortAttribute + ' ' + rnco_sortDirection + '&$skip=' + rnco_skipCount;
        rnco_executeCrmOdataGetRequest(rnco_jsonQuery, true, rnco_aSyncCallback, rnco_skipCount, rnco_optionArray);
    }
    catch (err) {
        alert('An error occured in the rnco_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}
