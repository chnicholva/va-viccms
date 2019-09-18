/// <reference path="../../WebServiceSecurityLib/js/WebServiceSecurityLibrary.js" />

var configData = null,
    context = null,
    _settings = null,
    _medsFromCRM = [],
    _useSecureMedicationAPI = true;
	
var _nationalId = null;

var fieldMappings = [
    {
        field: "Selected",
        VAPath: null,
        title: " ",
        type: "boolean",
        template: function (pDataItem) {
            return "<img class='checkmark' src='" + (pDataItem.PreviouslySelectedInCRM == true ? "/_imgs/grid/checkbox.png" : "/_imgs/grid/checkbox_light.png") + "' onclick='checkmark_click(this);' title='Select this medication for renewal and inclusion in a progress note' />";
        },
        headerTemplate: "<img src='/_imgs/grid/checkbox.png' onclick='headerCheckmark_click();' id='headerCheckmark' title='Select all/no medications for renewal and inclusion in a progress note' />",
        groupable: false,
        sortable: false,
        filterable: false,
        width: 25
    },
    {
        field: "PreviouslySelectedInCRM",
        type: "boolean",
        hidden: true,
        //width: 1
    },
    {
        field: "LocalId",
        VA: "LocalId",
        VAPath: ["LocalId"],
        CRM: "ftp_PickedMedicationVALocalId",
        hidden: true,
        //width: 1
    },
    {
        field: "CRMId",
        VA: "CRMId",
        CRM: "ftp_pickedmedicationId",
        hidden: true,
        //width: 1
    },
    {
        field: "RxNumber",
        title: "Rx Number",
        VA: "RxNumber",
        VAPath: ["Orders[0].PrescriptionId"],
        CRM: "ftp_RxNumber",
        filterable: false,
        headerAttributes: {
            title: "Rx Number"
        },
        width: 60
    },
    {
        field: "Name",
        title: "Med Name",
        VA: "Name",
        VAPath: ["Products[0].SuppliedName", "QualifiedName", "Name"],
        CRM: "ftp_name",
        filterable: {
            multi: true
        },
        headerAttributes: {
            title: "Name"
        },
        width: 80
    },
    {
        field: "Instructions",
        title: "Instructions",
        VA: "Sig",
        VAPath: ["Sig"],
        CRM: "ftp_Instructions",
        filterable: false,
        headerAttributes: {
            title: "Instructions"
        },
        width: 180
    },
    {
        field: "PatientInstructions",
        title: "Patient Instructions",
        VA: "PatientInstruction",
        VAPath: ["PatientInstruction"],
        CRM: "ftp_PatientInstructions",
        filterable: false,
        headerAttributes: {
            title: "Patient Instructions"
        },
        width: 180
    },
    {
        field: "VaStatus",
        title: "Status",
        VA: "VaStatus",
        VAPath: ["VaStatus"],
        CRM: "ftp_VAStatus",
        filterable: {
            multi: true
        },
        headerAttributes: {
            title: "Status"
        },
        width: 60
    },
    {
        field: "FillsRemaining",
        title: "Refills Left",
        type: "number",
        VA: "FillsRemaining",
        VAPath: ["Orders[0].FillsRemaining"],
        CRM: "ftp_RefillsRemaining_number",
        headerAttributes: {
            title: "Refills Left"
        },
        width: 60
    },
    {
        field: "Quantity",
        title: "Quantity",
        type: "number",
        VA: "",
        VAPath: ["Orders[0].QuantityOrdered"],
        CRM: "",
        headerAttributes: {
            title: "Quantity"
        },
        width: 50
    },
    {
        field: "OverallStart",
        title: "Issue Date",
        type: "date",
        VA: "OverallStart",
        VAPath: ["OverallStart"],
        CRM: "ftp_IssueDate_text",
        template: function (pDataItem) {
            return !!pDataItem.OverallStart ? kendo.toString(pDataItem.OverallStart, "M/dd/yyyy") : "";
        },
        filterable: false,
        headerAttributes: {
            title: "Issue Date"
        },
        width: 70
    },
    {
        field: "LastFilled",
        title: "Last Refill",
        type: "date",
        VA: "LastFilled",
        VAPath: ["LastFilled"],
        CRM: "ftp_LastRefill_text",
        template: function (pDataItem) {
            return !!pDataItem.LastFilled ? kendo.toString(pDataItem.LastFilled, "M/dd/yyyy") : "";
        },
        filterable: false,
        headerAttributes: {
            title: "Last Refill"
        },
        width: 70
    },
    {
        field: "OverallStop",
        title: "Expiration",
        type: "date",
        VA: "OverallStop",
        VAPath: ["OverallStop"],
        CRM: "ftp_ExpirationDate_text",
        template: function (pDataItem) {
            return !!pDataItem.OverallStop ? kendo.toString(pDataItem.OverallStop, "M/dd/yyyy") : "";
        },
        filterable: false,
        headerAttributes: {
            title: "Expiration"
        },
        width: 70
    }
];


$(document).ready(function () {
    doPageLoad();
});

function doPageLoad() {
    try {
        //debugger
        configData = parseDataParametersFromUrl(location.search);
        context = getContext();
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var fifteenMonthsPrior = new Date();
        fifteenMonthsPrior.setMonth(today.getMonth() - 15);
        if (!!!$("#headerStartDate").data("kendoDatePicker")) {
            $("#headerStartDate").kendoDatePicker({
                value: fifteenMonthsPrior,
                dateInput: true,
                change: headerStartDate_onChange
            });
        }

        if (!!!$("#headerEndDate").data("kendoDatePicker")) {
            $("#headerEndDate").kendoDatePicker({
                value: today,
                dateInput: true,
                footer: "Today - #: kendo.toString(data, 'd') #",
                change: headerEndDate_onChange
            });
        }

        //load test data in AWS environment
        if (location.href.indexOf("https://internalcrmhec.crmdevcloud.com/VCCMDEV") > -1) {
            setTimeout(
                function () {
                    processDataFromMedicationAPI(testData);
                },
                500
            );
        }
        else {
            loadPreviouslySelectedMedicationsFromCRM(configData.id);
        }
    }
    catch (err) {
        console.error(err.message);
        alert("Document ready error: " + err.message);
    }
}
function headerStartDate_onChange() {
    if (!!this.value()) {
        applyHeaderDateFilter();
    }
    else {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var fifteenMonthsPrior = new Date();
        fifteenMonthsPrior.setMonth(today.getMonth() - 15);
        this.value(fifteenMonthsPrior);
        applyHeaderDateFilter();
    }
}
function headerEndDate_onChange() {
    if (!!this.value()) {
        applyHeaderDateFilter();
    }
    else {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        this.value(today);
        applyHeaderDateFilter();
    }
}

function loadPreviouslySelectedMedicationsFromCRM(pRequestId) {
    try {
        showLoadingMessage("Loading medications...");
        var requestId = !!pRequestId ? pRequestId : !!configData.id ? configData.id : !!parent.Xrm && !!parent.Xrm.Page && !!parent.Xrm.Page.data && !!parent.Xrm.Page.data.entity ? parent.Xrm.Page.data.entity.getId() : "";
        _medsFromCRM = [];
        if (!!requestId) {
            var queryColumns = [];
            fieldMappings.forEach(function (c, i) { if (!!c.CRM) { queryColumns.push(c.CRM); } });
            var queryString = "$select=ftp_RequestId," + queryColumns.join() + "&$filter=ftp_RequestId/Id eq guid'" + requestId + "'";
            try {
                SDK.REST.retrieveMultipleRecords(
                    "ftp_pickedmedication",
                    queryString,
                    function (retrievedRecords) {
                        if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length > 0) _medsFromCRM = _medsFromCRM.concat(retrievedRecords);
                    },
                    errorHandler,
                    function () {
                        findActiveSettings(queryMedicationAPI);
                    }
                );
            }
            catch (e) {
                showErrorMessage("Error retrieving previously picked medications from CRM: " + e.message);
            }
        }
        else {
            showDiv("#newRecordMessageContainer");
        }
    }
    catch (err) {
        throw err;
    }
}
function findActiveSettings(pCallbackFunction) {
    //get the Active Settings record from either the parent request form or directly from CRM
    if (!!_settings) {
        if (typeof pCallbackFunction == "function") { pCallbackFunction(); }
    }
    else {
        if (!!parent._retrievedSettings) {
            _settings = parent._retrievedSettings;
            if (typeof pCallbackFunction == "function") { pCallbackFunction(); }
        }
        else {
            var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
            try {
                SDK.REST.retrieveMultipleRecords(
                    "mcs_setting",
                    queryString,
                    function (retrievedRecords) {
                        if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) _settings = retrievedRecords[0];
                    },
                    errorHandler,
                    function () {
                        if (!!_settings) {
                            if (typeof pCallbackFunction == "function") { pCallbackFunction(); }
                        }
                    }
                );
            }
            catch (e) {
                showErrorMessage("Error retrieving Active Settings: " + e.message);
            }
        }
    }
}
function queryMedicationAPI() {
    try {		
		_nationalId = parent.Xrm.Utility.getNationalId();
        if (!!_nationalId) {
            if (!!_settings && !!_settings.ftp_DACURL) {
                if (false) { // do not do
                    if (!!_settings.ftp_MedicationAPISecureURL) {
                        try {
                            var secureMedAPIURL = _settings.ftp_DACURL + _settings.ftp_MedicationAPISecureURL;
                            var secureMedAPIParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: _nationalId }) }];
                            CrmSecurityTokenEncryption(
                                secureMedAPIURL,
                                secureMedAPIParams,
                                context.getClientUrl(),
                                function (pError, pResponse) {
                                    if (!!pError) {
                                        throw new Error(pError);
                                    }
                                    else if (pResponse.ErrorOccurred) {
                                        throw new Error(pResponse.ErrorMessage);
                                    }
                                    else {
                                        processDataFromMedicationAPI(pResponse.Data);
                                    }
                                }
                            );
                        }
                        catch (e) {
                            throw new Error("Error querying Secure Medications API: " + e.message);
                        }
                    }
                    else {
                        throw new Error("Configuration error... Missing Medication API Secure URL. Check Active Settings.");
                    }
                }
                else {
                    if (!!_settings.ftp_MedicationAPIURL) {
                        var subKeys = _settings.ftp_MVISubscriptionKey;
                        var medQueryUrl = _settings.ftp_DACURL + _settings.ftp_MedicationAPIURL + _nationalId + (!!_settings.ftp_Filter ? _settings.ftp_Filter : "");
                        try {
                            $.ajax({
                                type: "GET",
                                url: medQueryUrl,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                beforeSend: function (xhr) {
                                    var keys = subKeys.split("|");
                                    for (var i = 0; i < keys.length; i = i + 2) {
                                        xhr.setRequestHeader(keys[i], keys[i + 1]);
                                    }
                                },
                                success: function (response) {
                                    if (response.ErrorOccurred == false) {
                                        processDataFromMedicationAPI(response.Data);
                                    }
                                    else {
                                        showErrorMessage("Error querying Medications API: " + response.ErrorMessage);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    showErrorMessage("Error querying Medications API: " + errorThrown);
                                },
                                async: true,
                                cache: false
                            });
                        }
                        catch (e) {
                            throw new Error("Error querying Medications API: " + e.message);
                        }
                    }
                    else {
                        throw new Error("Configuration error... Missing Medication API URL. Check Active Settings.");
                    }
                }
            }
            else {
                throw new Error("Configuration error... Missing DAC URL. Check Active Settings.");
            }

        }
        else {
            throw new Error("Configuration error: missing Veteran NationalId");
        }
    }
    catch (e) {
        showErrorMessage(e.message);
    }
}
function processDataFromMedicationAPI(pData) {
    var medsFromHDR = [];
    if (!!pData && Array.isArray(pData) && pData.length > 0) {
        for (var i = 0; i < pData.length; i++) {
            var thisMedicationFromAPI = pData[i];
            var newMedObj = {};
            for (var j = 0; j < fieldMappings.length; j++) {
                var thisFieldMapping = fieldMappings[j];
                //parse fields from medication API data, using thisFieldMapping's VAPath(s) to find data in the payload
                if (!!thisFieldMapping.VAPath && thisFieldMapping.VAPath.length > 0) {
                    var thisValueString = "";
                    for (var k = 0; k < thisFieldMapping.VAPath.length && !!!thisValueString; k++) {
                        thisValueString = getDeepProperty(thisFieldMapping.VAPath[k], thisMedicationFromAPI);
                    }

                    if (thisFieldMapping.type == "date") {
                        newMedObj[thisFieldMapping.field] = !!thisValueString ? new Date(thisValueString.substr(0, 4), thisValueString.substr(4, 2) - 1, thisValueString.substr(6, 2)) : "";
                    }
                    else if (thisFieldMapping.type == "number") {
                        var thisValueNumber = !!thisValueString ? parseInt(thisValueString) : thisValueString;
                        newMedObj[thisFieldMapping.field] = thisValueNumber;
                        //save highest and lowest number, to inform slider filters.
                        var minVarName = thisFieldMapping.field + "_slidermin";
                        var maxVarName = thisFieldMapping.field + "_slidermax";
                        window[minVarName] = 0;
                        window[maxVarName] =
                            !!!window[maxVarName] && !!!thisValueNumber ? 0 :
                                !!!window[maxVarName] && !!thisValueNumber ? thisValueNumber :
                                    !!window[maxVarName] && !!!thisValueNumber && window[maxVarName] > 0 ? window[maxVarName] :
                                        !!window[maxVarName] && !!thisValueNumber && thisValueNumber > window[maxVarName] ? thisValueNumber :
                                            window[maxVarName] > 0 ? window[maxVarName] :
                                                0;
                    }
                    else {
                        newMedObj[thisFieldMapping.field] = thisValueString;
                    }
                }
            }
            //var matchingCRMRowIndex = _medsFromCRM.length > 0 ? ArrayIndexOfObjectByAttribute(_medsFromCRM, getDeepProperty("fieldMappings[" + ArrayIndexOfObjectByAttribute(fieldMappings, "VA", "LocalId") + "].CRM", window), newMedObj.LocalId) : -1;
            var matchingCRMRowIndex = _medsFromCRM.length > 0 ? ArrayIndexOfObjectByAttribute(_medsFromCRM, "ftp_PickedMedicationVALocalId", newMedObj.LocalId) : -1;
            newMedObj.PreviouslySelectedInCRM = matchingCRMRowIndex > -1;
            newMedObj.Selected = newMedObj.PreviouslySelectedInCRM == true;
            //newMedObj.CRMId = newMedObj.PreviouslySelectedInCRM ? _medsFromCRM[matchingCRMRowIndex][getDeepProperty("fieldMappings[" + ArrayIndexOfObjectByAttribute(fieldMappings, "VA", "CRMId") + "].CRM", window)] : null;
            newMedObj.CRMId = newMedObj.PreviouslySelectedInCRM ? _medsFromCRM[matchingCRMRowIndex].ftp_pickedmedicationId : null;
            medsFromHDR.push(newMedObj);
        }
    }
    renderMedications(medsFromHDR);
}
function renderMedications(pDataForKendoGrid) {
    try {
        if (!!pDataForKendoGrid && Array.isArray(pDataForKendoGrid)) {
            destroyMedicationGrid();
            var noteGridDiv = $("<div id='medicationGridDiv'></div>").appendTo("#medicationGridDivParentDiv");
            var medicationGrid = $("#medicationGridDiv").kendoGrid({
                columns: fieldMappings,
                sortable: true,
                editable: false,
                resizable: true,
                scrollable: true,
                height: 300,
                navigatable: true,
                noRecords: {
                    template: "No medication records found from last 15 months."
                },
                pageable: {
                    pageSize: 5//,
                    //pageSizes: [5, 10, 20, 40, "all"]
                },
                filterable: true,//{ mode: "row"},
                //selectable: "multiple",
                //persistSelection: true,
                dataSource: pDataForKendoGrid,
                dataBound: function (e) {
                    var view = this.dataSource.view();
                    for (var i = 0; i < view.length; i++) {
                        if (view[i].Selected == true) {
                            var thisRow = this.tbody.find("tr[data-uid='" + view[i].uid + "']");
                            thisRow.addClass("k-state-selected");
                            $(thisRow).find("img").attr("src", "/_imgs/grid/checkbox.png")
                            //checkmark_click($(thisRow).find("img")[0]);
                        }
                    }

                    //attach to single-click event of rows to mimic clicking the row's 'Checkmark' selector
                    this.element.on('click', 'tbody tr[data-uid]', function (ce) {
                        ce.stopImmediatePropagation();

                        //ce.currentTarget should be the <tr> element that is the parent of the clicked <td> or <img> element
                        //console.log(ce.target);
                        //console.log(ce.currentTarget);

                        var clickedElement = ce.target;
                        var checkmarkForRow = $(ce.currentTarget).find(".checkmark")[0];

                        if (!!clickedElement && !!checkmarkForRow) {
                            if (clickedElement.outerHTML.indexOf("<button") == 0 && clickedElement.innerHTML == "EDIT") {
                                //don't select row when user clicks the EDIT button
                                return;
                            }
                            if (clickedElement == checkmarkForRow) {
                                //user clicked checkmark
                                //the checkmark_click function will have already fired, so end this function.
                                return;
                            }
                            checkmark_click(checkmarkForRow);
                        }

                        //checkmark for row
                        //$(ce.currentTarget).find(".checkmark");

                        //data item for row
                        //$('#notesGridDiv').data('kendoGrid').dataItem($(ce.currentTarget))
                        //console.log($('#notesGridDiv').data('kendoGrid').dataItem($(ce.currentTarget)));
                    });
                    setHelperText();
                },
                change: function (e) {
                },
                filterMenuInit: function (e) {
                    var fieldName = e.field;
                    var thisColumn = e.sender.columns[ArrayIndexOfObjectByAttribute(e.sender.columns, "field", fieldName)];
                    /*
                    if (thisColumn.type == "number") {
                        var elementId = "rangeslider_" + fieldName;
                        $(e.container[0]).html("<div id='" + elementId + "'><input/><input/></div>")

                        var sliderMinValue = window[fieldName + "_slidermin"] > 0 ? window[fieldName + "_slidermin"] - 1 : 0;
                        var sliderMaxValue = window[fieldName + "_slidermax"] + 1;
                        $("#" + elementId).kendoRangeSlider({
                            change: function (s) {
                                if (s.values[0] == s.sender.options.min && s.values[1] == s.sender.options.max) {
                                    //clear this filter
                                    removeFilterFromGrid("filter_" + fieldName);
                                }
                                else {
                                    //add this filter
                                    var grid = $("#medicationGridDiv").data("kendoGrid");
                                    addFilterToGrid({
                                        logic: "and",
                                        filters: [
                                            { field: fieldName, operator: "neq", value: null },
                                            { field: fieldName, operator: "gte", value: s.values[0] },
                                            { field: fieldName, operator: "lte", value: s.values[1] }
                                        ],
                                        id: "filter_" + fieldName
                                    });
                                }

                                //grid.dataSource.filter(filterObject)
                            },
                            min: sliderMinValue,
                            max: sliderMaxValue,
                            smallStep: 1,
                            largeStep: 3,
                            tickPlacement: "both"
                        });
                    }
                    */
                },
                filter: function (e) {
                }
            });
            applyHeaderDateFilter();

            var gridButtonsDiv = $(
                "<div id='ActionButtons'>" +
                "<input id='btnRefreshGrid' type='button' class='CrmButton' value='Refresh Medication Grid' title='Refresh the medications listed in the grid.' onclick='doPageLoad();' />" +
                "<input id='btnSaveSelection' type='button' class='CrmButton' value='Save Selection' title='Save your new selection(s) to CRM, for later use in a Progress Note.' onclick='btnSaveSelection_click();' disabled='disabled'/>" +
                "</div>").appendTo(".k-pager-wrap");
            toggleSaveSelectionButton();
            showDiv("#MedicationPickerContainer");
        }
    }
    catch (e) {
        showErrorMessage("Error rendering medications on grid: " + e.message);
    }
}

function headerCheckmark_click() {
    var totalSelected = 0;
    var view = $("#medicationGridDiv").data("kendoGrid").dataSource.view()
    for (var i = 0; i < view.length; i++) {
        if (view[i].Selected == true) {
            totalSelected++;
        }
    }
    var clearAll = totalSelected == view.length;
    $(".checkmark").each(function (i, thisCheckmark) { captureMedicationSelection(thisCheckmark, !clearAll); }); //select/unselect all checkmarks on current page of grid
}
function checkmark_click(pCheckmark) {
    try {
        var wasCheckedWhenClicked = $('#medicationGridDiv').data('kendoGrid').dataItem($(pCheckmark).closest("tr")).Selected == true;
        captureMedicationSelection(pCheckmark, !wasCheckedWhenClicked);
    }
    catch (err) {
        alert('Medication Grid Web Resource Function Error(checkmark_click): ' + err.message);
        return null;
    }
}
function captureMedicationSelection(pCheckmark, pSelect) {
    var thisRow = $(pCheckmark).closest("tr");
    var medicationGrid = $('#medicationGridDiv').data('kendoGrid');
    var medDataItem = medicationGrid.dataItem(thisRow);
    medDataItem.Selected = pSelect;

    if (pSelect) {
        //add the appropriate kendo class to highlight the row
        thisRow.addClass("k-state-selected");
        pCheckmark.setAttribute("src", "/_imgs/grid/checkbox.png");
    }
    else {
        //remove the appropriate kendo class that highlights the row
        thisRow.removeClass("k-state-selected");
        pCheckmark.setAttribute("src", "/_imgs/grid/checkbox_light.png");
    }
    toggleSaveSelectionButton();
}
function toggleSaveSelectionButton() {
    var medicationGrid = $('#medicationGridDiv').data('kendoGrid');
    //enable/disable btnApplySelectedNotes button
    var rows = medicationGrid.dataSource.data();
    var atLeastOneRowIsDirty = false;
    for (var i = 0; i < rows.length && atLeastOneRowIsDirty == false; i++) {
        atLeastOneRowIsDirty = rows[i].PreviouslySelectedInCRM != rows[i].Selected;
    }
    if (atLeastOneRowIsDirty) {
        $("#btnSaveSelection").removeAttr("disabled");
    }
    else {
        $("#btnSaveSelection").attr("disabled", "disabled");
    }
}

function btnSaveSelection_click(pButton) {
    saveSelectedMedicationsToCRM();
}
function saveSelectedMedicationsToCRM(pIndex) {
    try {
        var medGridData = $("#medicationGridDiv").data("kendoGrid").dataSource.data();
        var index = !!pIndex ? pIndex : 0;
        if (!!medGridData && index < medGridData.length) {
            showLoadingMessage("Saving selection(s)...");
            var thisRow = medGridData[index];
            index++;

            if (thisRow.Selected == true && thisRow.PreviouslySelectedInCRM == false && thisRow.CRMId == null) {
                //create this row in CRM
                var newRecord = {
                    ftp_RequestId: {
                        Id: parent.Xrm.Page.data.entity.getId(),
                        LogicalName: parent.Xrm.Page.data.entity.getEntityName(),
                        Name: parent.Xrm.Page.data.entity.getPrimaryAttributeValue()
                    }
                };
                fieldMappings.forEach(function (thisFieldMapping, i) {
                    if (!!thisFieldMapping.CRM && thisFieldMapping.CRM != "ftp_pickedmedicationId" && !!thisFieldMapping.field && !!thisRow[thisFieldMapping.field]) {
                        newRecord[thisFieldMapping.CRM] = thisRow[thisFieldMapping.field];
                        if (thisFieldMapping.type == "date" && !!thisRow[thisFieldMapping.field]) {
                            //set crm field with string representation of date, YYYYMMDD
                            newRecord[thisFieldMapping.CRM] = zeroPadDatePartAsString(thisRow[thisFieldMapping.field].getFullYear().toString(), 4) + zeroPadDatePartAsString((thisRow[thisFieldMapping.field].getMonth() + 1).toString(), 2) + zeroPadDatePartAsString(thisRow[thisFieldMapping.field].getDate().toString(), 2)
                        }
                    }
                });

                SDK.REST.createRecord(
                    newRecord,
                    "ftp_pickedmedication",
                    function (createdRecord) {
                        saveSelectedMedicationsToCRM(index);
                    },
                    function (e) {
                        console.error(e.message);
                        saveSelectedMedicationsToCRM(index);
                    }
                );
            }
            else if (thisRow.Selected == false && thisRow.PreviouslySelectedInCRM == true) {
                //delete this row from CRM
                if (thisRow.CRMId != null) {
                    SDK.REST.deleteRecord(
                        thisRow.CRMId,
                        "ftp_pickedmedication",
                        function () {
                            saveSelectedMedicationsToCRM(index);
                        },
                        function (e) {
                            console.error(e.message);
                            saveSelectedMedicationsToCRM(index);
                        }
                    );
                }
                else {
                    //don't know ID of CRM record we want to delete...
                    //this should never happen
                }
            }
            else if (thisRow.Selected == true && thisRow.PreviouslySelectedInCRM == true && thisRow.CRMId != null) {
                //make sure column data is up to date in CRM
                var updateObj = {};
                fieldMappings.forEach(function (thisFieldMapping, i) {
                    if (!!thisFieldMapping.CRM && thisFieldMapping.CRM != "ftp_pickedmedicationId" && !!thisFieldMapping.field && !!thisRow[thisFieldMapping.field]) {
                        updateObj[thisFieldMapping.CRM] = thisRow[thisFieldMapping.field];
                        if (thisFieldMapping.type == "date" && !!thisRow[thisFieldMapping.field]) {
                            //set crm field with string representation of date, YYYYMMDD
                            updateObj[thisFieldMapping.CRM] = zeroPadDatePartAsString(thisRow[thisFieldMapping.field].getFullYear().toString(), 4) + zeroPadDatePartAsString((thisRow[thisFieldMapping.field].getMonth() + 1).toString(), 2) + zeroPadDatePartAsString(thisRow[thisFieldMapping.field].getDate().toString(), 2)
                        }
                    }
                });
                if (thisRow.CRMId != null) {
                    SDK.REST.updateRecord(
                        thisRow.CRMId,
                        updateObj,
                        "ftp_pickedmedication",
                        function () {
                            saveSelectedMedicationsToCRM(index);
                        },
                        function (e) {
                            console.error(e.message);
                            saveSelectedMedicationsToCRM(index);
                        }
                    );
                }
                else {
                    //don't know ID of CRM record we want to update...(this should never happen)
                }
            }
            else {
                saveSelectedMedicationsToCRM(index);
            }
        }
        else {
            doPageLoad();
            //loadPreviouslySelectedMedicationsFromCRM(configData.id);
        }
    }
    catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}

function applyHeaderDateFilter() {
    var grid = $("#medicationGridDiv").data("kendoGrid");
    var headerStartDatePicker = $("#headerStartDate").data("kendoDatePicker");
    var headerEndDatePicker = $("#headerEndDate").data("kendoDatePicker");
    if (!!grid && !!headerStartDatePicker && !!headerEndDatePicker) {
        var newStartDateValue = headerStartDatePicker.value();
        newStartDateValue.setHours(0, 0, 0, 0);
        console.log("newStartDateValue: " + newStartDateValue);
        var newEndDateValue = headerEndDatePicker.value();
        newEndDateValue.setHours(0, 0, 0, 0);
        console.log("newEndDateValue: " + newEndDateValue);
        addFilterToGrid({
            logic: "and",
            filters: [
                { field: "LastFilled", operator: "neq", value: null },
                { field: "LastFilled", operator: "gte", value: newStartDateValue },
                { field: "LastFilled", operator: "lte", value: newEndDateValue }
            ],
            id: "filter_LastFilled_header"
        });
    }
}
function addFilterToGrid(pNewFilterObject) {
    var grid = $("#medicationGridDiv").data("kendoGrid");
    if (!!grid) {
        var currentFilter = grid.dataSource.filter();
        if (!!currentFilter) {
            var existingIndexOfThisFilter = ArrayIndexOfObjectByAttribute(currentFilter.filters, "id", pNewFilterObject.id);
            if (existingIndexOfThisFilter > -1) {
                //remove and re-add
                removeFilterFromGrid(pNewFilterObject.id);
                currentFilter = $("#medicationGridDiv").data("kendoGrid").dataSource.filter();
                currentFilter.filters.push(pNewFilterObject);
                grid.dataSource.filter(currentFilter);
            }
            else {
                currentFilter.filters.push(pNewFilterObject);
                grid.dataSource.filter(currentFilter);
            }
        }
        else {
            grid.dataSource.filter({
                logic: "and",
                filters: [pNewFilterObject]
            });
        }
        setHelperText();
    }
}
function removeFilterFromGrid(pFilterId) {
    if (!!pFilterId) {
        var grid = $("#medicationGridDiv").data("kendoGrid");
        if (!!grid) {
            var currentFilter = grid.dataSource.filter();
            if (!!currentFilter) {
                var filterIndex = ArrayIndexOfObjectByAttribute(currentFilter.filters, "id", pFilterId);
                currentFilter.filters.splice(filterIndex, 1);
                grid.dataSource.filter(currentFilter);
                if (ArrayIndexOfObjectByAttribute(currentFilter.filters, "id", pFilterId) > -1) {
                    removeFilterFromGrid(pFilterId);
                }
            }
        }
    }
}
function setHelperText() {
    var headerStartDatePicker = $("#headerStartDate").data("kendoDatePicker");
    var headerEndDatePicker = $("#headerEndDate").data("kendoDatePicker");
    var startDate = headerStartDatePicker.value();
    var endDate = headerEndDatePicker.value();

    var lastXMonthsValue = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24 / 365 * 12);
    var monthsString = lastXMonthsValue == 1 ? "month" : "months";
    $("#lastXMonthsText").html("(within the last " + lastXMonthsValue.toString() + " " + monthsString + ")");
    $(".k-grid-norecords").first().text("No medication records found from last " + lastXMonthsValue.toString() + " " + monthsString + ".")
}

function destroyMedicationGrid() {
    var medicationGridDiv = $("#medicationGridDiv");
    if (!!medicationGridDiv && medicationGridDiv.length == 1) {
        if (!!medicationGridDiv.data("kendoGrid")) {
            $("#medicationGridDiv").data("kendoGrid").destroy();
        }
        $("#medicationGridDiv").empty();
        $("#medicationGridDiv").remove();
    }
    kendo.destroy("#medicationGridDivParentDiv");
}

/*helper functions*/
function zeroPadDatePartAsString(pValue, pPlaces) {
    return pValue.toString().length < pPlaces ? zeroPadDatePartAsString("0" + pValue, pPlaces) : pValue.toString();
}
function parseDataParametersFromUrl(pQueryString) {
    //example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
    var fullParameterArray = pQueryString.substr(1).split("&");

    //clean up the URL query string and split each member into a key/value pair
    for (var i in fullParameterArray) {
        fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
    }

    var fullObject = {};
    for (var i in fullParameterArray) {
        var thisParameterName = fullParameterArray[i][0];
        var thisParameterValue = fullParameterArray[i][1];
        fullObject[thisParameterName] = thisParameterValue;
        if (thisParameterName.toLowerCase() == "data") {
            var dataObject = {};
            var customDataArray = decodeURIComponent(thisParameterValue).split("&");
            for (var j in customDataArray) {
                customDataArray[j] = customDataArray[j].replace(/\+/g, " ").split("=");
                dataObject[customDataArray[j][0]] = customDataArray[j][1];
            }
            fullObject[thisParameterName] = dataObject;
        }
    }
    return fullObject;
}
function errorHandler(err) {
    console.error(err.message);
    alert(err.message);
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function showLoadingMessage(pMessage) {
    $("#progressText").html(pMessage);
    showDiv("#loadingGifDiv");
}
function showErrorMessage(pMessage) {
    $("#errorText").html(pMessage);
    showDiv("#errorContainer");
}
function showDiv(pDivToShow) {
    var knownDivs = [
        "#loadingGifDiv",
        "#errorContainer",
        "#MedicationPickerContainer",
        "#newRecordMessageContainer"
    ];
    for (var d = 0; d < knownDivs.length; d++) {
        if (knownDivs[d] == pDivToShow) {
            $(knownDivs[d]).show();
        }
        else {
            $(knownDivs[d]).hide();
        }
    }
}
function getContext() {
    return (typeof GetGlobalContext != "undefined") ? GetGlobalContext() : null;
}