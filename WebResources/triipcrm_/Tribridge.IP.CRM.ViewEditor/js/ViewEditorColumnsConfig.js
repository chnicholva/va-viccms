/// <reference path="XrmServiceToolkit.js" />

//Global variables
var viewEditorConfigID = null;

$(document).ready(function () {
    var functionName = "documentReady";
    try {
        showLoading(true);

        if (isValid(parent.Xrm.Page.data.entity.getId())) {
            // Get vieweditoconfigId from which we can fetch its related records
            viewEditorConfigID = parent.Xrm.Page.data.entity.getId();
            // Bind Grid
            createViewConfigColumnsGrid();

            // Save button functionality
            $("#saveButton").click(function () {
                OnSave();
            });

            //Refresh Button
            $("#refreshButton").click(function () {
                var functionName = "refreshButton";
                try {
                    //Show Loader
                    // showLoading(true);
                    //Refresh Grid
                    //searchRecords();

                    //Kadambari
                    //Refresh grid and update columns
                    fetchGridLayout();

                } catch (e) {
                    throwError(e, functionName);
                }
            });
        }
        else {
            showLoading(false);
            return;
        }
    } catch (e) {
        throwError(e, functionName);
    }
});

//This function validates the fields and their attributes 
function isValid(attributes) {
    var functionName = "isValid";
    try {
        if (attributes === 0) {
            return true;
        }
        if (attributes != null && attributes != undefined && attributes != "") {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

//This function initialized the Grid creation process
function createViewConfigColumnsGrid() {
    var functionName = "createViewConfigColumnsGrid";
    try {
        // initialize grid
        initGrid();
        // bind data
        searchRecords();
    }
    catch (e) {
        throwError(e, functionName);
    }
}

//Function to intialize the grid to show on the page
function initGrid() {
    var functionName = "initGrid";
    try {
        $("#ViewEditorColumnGrid").kendoGrid({
            dataSource: {
                schema: getSchema(),
                batch: true
            },
            autoBind: false,
            pageable: false,
            sortable: false,
            height: 300,
            width: 500,
            editable: true,
            columns: getGridColumns(),
            toolbar: kendo.template($("#ViewEditorColumnButtons").html()),
        });
    } catch (e) {
        throwError(e, functionName);
    }
}

//This function returns schema for the grid
function getSchema() {
    var functionName = "getSchema";
    var schema = null;
    try {
        schema = {
            model: {
                id: "triipcrm_viewcolumnid",
                fields: {
                    triipcrm_viewcolumnid: { editable: false, nullable: true }, //vieweditorconfigcolumns Id
                    triipcrm_columnlogicalname: { editable: false, nullable: true }, //Column Logical name
                    triipcrm_columndisplayname: { nullable: false }, //column displayname
                    triipcrm_width: { type: "number", nullable: false, validation: { min: 100, max: 500 }, format: "{0:n0}" }, // With
                    triipcrm_isreadonly: { type: "Boolean", nullable: false, editable: false }, //Is read only 
                    triipcrm_isrequired: { type: "Boolean", nullable: false, editable: false }, //Is Required                     
                    triipcrm_allowfilter: { type: "Boolean", nullable: false, editable: false } //allow filter
                }//fields
            }//model
        };    //schema

    } catch (e) {
        throwError(e, functionName);
    }
    return schema;
}

//This function will return columns to be bind to Grid
function getGridColumns() {
    var funtionName = "getGridColumns";
    var columns = [];
    try {
        columns = [
                           { field: "triipcrm_viewcolumnid", hidden: true, template: '<span id="recordId">#: triipcrm_viewcolumnid #</span>' },
                           { field: "triipcrm_columnlogicalname", width: "25px", hidden: false, title: "Logical Name" },
                           { field: "triipcrm_columndisplayname", width: "25px", hidden: false, title: "Display Name" },
                           { field: "triipcrm_width", width: "25px", hidden: false, title: "Width" },
                           { field: "triipcrm_isreadonly", width: "25px", hidden: false, title: "Read Only", template: "<span id='isReadOnly'>#var check=displayCheckBox('triipcrm_isreadonly',triipcrm_isreadonly);##=check#</span>" },
                           { field: "triipcrm_isrequired", width: "15px", hidden: false, title: "Is Required", template: "<span id='isRequired'>#var check=displayCheckBox('triipcrm_isrequired',triipcrm_isrequired);##=check#</span>" },
                           { field: "triipcrm_allowfilter", width: "15px", hidden: false, title: "Allow Filter", template: "<span id='isAllowFilter'>#var check=displayCheckBox('triipcrm_allowfilter',triipcrm_allowfilter);##=check#</span>" }
        ];

    } catch (e) {
        throwError(e, funtionName);
    }
    return columns;
}

//function to display check box
function displayCheckBox(name, value) {
    var functionName = "displayCheckBox :";
    var check = null;
    var onClicked = "changeState(this);";
    try {
        if (value == true) {
            check = "<input type='checkbox' name='" + name + "' checked='true' onClick='" + onClicked + "'>";
        }
        else {
            check = "<input type='checkbox' name='" + name + "' onClick='" + onClicked + "'>";
        }

    } catch (e) {
        throwError(e, functionName)
    }
    return check;
}

//Function to change the state of the checkbox & field
function changeState(control) {
    var functionName = "changeState";
    try {
        try {
            var newValue = null;

            entityGrid = $("#ViewEditorColumnGrid").data("kendoGrid");

            var selectedRow = $(control).closest("tr");
            var selectedRecord = entityGrid.dataItem(selectedRow);

            selectedRecord[control.name] = control.checked;
            selectedRecord.dirty = true;

            // Set the red update triangle
            if (!$(control).closest("td").hasClass("k-dirty-cell")) {
                $(control).closest("td").append('<span id=' + "span" + control.id + ' class="k-dirty"></span>');
                $(control).closest("td").addClass('k-dirty-cell');
            }
            else {
                $('#span' + control.id).remove();
                $(control).closest("td").removeClass("k-dirty-cell")
            }
        }
        catch (e) {
            Xrm.Utility.alertDialog("Please insert correct value for " + numberField);
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

//function to search Records
function searchRecords() {
    var functionName = "searchRecords";
    try {

        //Empty the Grid
        $("#ViewEditorColumnGrid").data("kendoGrid").dataSource.data([]);

        //Mapping elements
        var mapping = getGridColumns();

        //Get column set
        var columnSet = getColumnCollection(mapping);

        //get schema collection
        var schemaCollection = getSchemaCollection(mapping);

        //Bind with entered search criteria
        filterRecords("triipcrm_viewcolumn", columnSet, schemaCollection, OnQueryAllComplete);


    } catch (e) {
        throwError(e, functionName);
    }
}

//This function is used for retrieving the filtered data from the CRM for PO Detail
function filterRecords(entity, columnSet, schemaCollection, callback) {
    var functionName = "filterRecords";
    try {
        //this attribute is used for retrieveing selected fileds only
        var queryAttribute = '';

        //Add the selected attribute 
        for (var i = 0; i < columnSet.length; i++) {
            queryAttribute += "<attribute name='" + columnSet[i] + "' />";
        }
        var query = "" + "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>"
                    + "<entity name='" + entity.toLowerCase() + "'>"
                    + queryAttribute
                    + "<filter type='and'>"
                    + "<condition attribute='triipcrm_viewconfiguration' operator='eq' value='" + viewEditorConfigID + "' />"
                    + "</filter>"
                    + "</entity>"
                    + "</fetch>";

        //Retrieve the records from CRM
        XrmServiceToolkit.Soap.Fetch(query, true, function (result) { callback(result, schemaCollection); });

    } catch (e) {
        throwError(e, functionName);
    }

}

/* Bind data*/
function OnQueryAllComplete(result, schemaCollection) {
    var functionName = "OnQueryAllComplete";
    var collection = [];
    try {
        //get converted data in odata format
        collection = getDataInODATAFormat(result, schemaCollection);

        //check where collection has data
        if (collection.length > 0) {
            //bind the grid
            bindGrid(collection);
        }
        else {
            showLoading(false);
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

// bind the data to grid
function bindGrid(dataCollection) {
    var functionName = "bindGrid";
    try {
        $("#ViewEditorColumnGrid").data("kendoGrid").dataSource.data(dataCollection);

        var grid = $("#ViewEditorColumnGrid").data("kendoGrid");
        //Hide the loading
        showLoading(false);

    } catch (e) {
        throwError(e, functionName);
    }
}

//function to convert results into odata format
function getDataInODATAFormat(result, schemaCollection) {
    var functionName = "getDataInODATAFormat";
    try {
        var entityCollection = [];
        //Check if result is null
        if (result != null && result != 'undefined') {
            for (var i = 0; i < result.length; i++) {
                entityCollection[i] = {};
                //Check for attributes
                if (result[i].attributes != null && result[i].attributes != 'undefined') {
                    //Check if schemaCollection have atrribute
                    for (var j = 0; j < schemaCollection.length; j++) {

                        entityCollection[i][schemaCollection[j]] = null;

                        var field = result[i].attributes[schemaCollection[j].toLowerCase()];
                        if (field != 'undefined' && field != undefined) {
                            //Check for type and then add it according to format
                            if (field.type != 'undefined' && field.type != undefined) {
                                switch (field.type) {

                                    case "OptionSetValue":
                                        entityCollection[i][schemaCollection[j]] = { Value: field.value };
                                        break;
                                    case "EntityReference":
                                        entityCollection[i][schemaCollection[j]] = { Id: field.id, Name: field.name, LogicalName: field.logicalName };
                                        if (schemaCollection[j] == "ProductId") {
                                            entityCollection[i]["product_id"] = field.name;
                                        }
                                        else if (schemaCollection[j] == "UoMId") {
                                            entityCollection[i]["uom_id"] = field.name;
                                        }
                                        break;

                                    case "EntityCollection":
                                        /*
                                        Do Nothing
                                        */

                                    case "Money":
                                        entityCollection[i][schemaCollection[j]] = { Value: field.value };
                                        break;

                                    default:
                                        entityCollection[i][schemaCollection[j]] = field.value;
                                        break;
                                }
                            }
                        }

                    }

                }
            }
        }

        return entityCollection;
    } catch (e) {
        onError(functionName, e);
    }
}

//This function will return collection of schema name
function getSchemaCollection(mapping) {
    var functionName = "getSchemaCollection";
    var columnSet = [];
    try {
        for (var i = 0; i < mapping.length; i++) {
            if (mapping[i].field != 'undefined' && mapping[i].field != null && mapping[i].field != undefined && mapping[i].field != "product_id" && mapping[i].field != "uom_id") {
                columnSet.push(mapping[i].field);
            }
        }
        return columnSet;

    } catch (e) {
        throwError(e, functionName);
    }
}

//This function will return collection of Columns to be retrived
function getColumnCollection(mapping) {
    var functionName = "getColumnCollection";
    var columnSet = [];
    try {
        for (var i = 0; i < mapping.length; i++) {
            if (mapping[i].field != 'undefined' && mapping[i].field != undefined && mapping[i].field != null) {
                columnSet.push(mapping[i].field.toLowerCase());
            }
        }
        return columnSet;

    } catch (e) {
        throwError(e, functionName);
    }
}

//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
        //Hide Loading
        showLoading(false);
    } catch (e) {
        alert(functionName + "Error: " + (error.message || error.description));
        //Hide Loading
        showLoading(false);
    }
}

// Function to show Alert message
function showAlertMessage(message) {
    var functionName = "showAlertMessage";
    try {
        Xrm.Utility.alertDialog(message);
    }
    catch (e) {
        alert(message);
    }
}


//Generic function to show loading
function showLoading(status) {
    if (status == true) {
        if ($('#status').length == 0) {
            $(document.body).append("<div id='status'></div>").find('#status').addClass('#status');
        }
        else {
            $(document.body).find('#status').remove();
            $(document.body).append("<div id='status'></div>").find('#status').addClass('#status');
        }
        $("#status").show();
        $('body').attr('disabled', 'disabled');
        $('body').find('input,textarea,select,button').attr('disabled', 'disabled');

    }
    else {

        $("#status").hide();
        $(document.body).find('#status').remove();

        $('body').removeAttr('disabled');
        $('body').find('input,textarea,select,button').removeAttr('disabled');
    }
}

// Save ViewEditorConfigColumns records
function OnSave() {
    var functionName = "OnSave";
    var recordsToUpdate = new Array();

    try {
        //Validate
        if (isValid($("#ViewEditorColumnGrid").data("kendoGrid").dataSource.data())) {
            //Get the datasource
            var records = $("#ViewEditorColumnGrid").data("kendoGrid").dataSource.data();
            //Check the records
            if (isValid(records)) {
                //Loop through records
                recordsToUpdate = jQuery.grep(records, function (n, i) {
                    return (n.dirty == true);
                });
                //Validate whether recordsToUpdate has some value
                if (isValid(recordsToUpdate) && recordsToUpdate.length > 0) {
                    //Show Loading
                    showLoading(true);
                    //Loop through records for which Records will be Updated
                    for (var i in recordsToUpdate) {

                        if (validateRecordToUpdate(recordsToUpdate[i])) {
                            // Upate each changed record
                            updateRecord(recordsToUpdate[i]);
                        }
                        else {
                            showAlertMessage("You cannot configure an attribute with property Read only and Required");
                            showLoading(false);
                            return;
                        }
                    }
                    //Refresh Grid
                    searchRecords();
                }
            }
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

//Update the record
function updateRecord(recordToUpdate) {
    var functionName = "updateRecord";
    var ViewEditorConfigColumns = new Object();
    try {
        //Set Column Display Name
        ViewEditorConfigColumns.triipcrm_ColumnDisplayName = isValid(recordToUpdate.triipcrm_columndisplayname) ? recordToUpdate.triipcrm_columndisplayname : null;
        //Set IsReadOnly
        ViewEditorConfigColumns.triipcrm_IsReadOnly = isValid(recordToUpdate.triipcrm_isreadonly) ? recordToUpdate.triipcrm_isreadonly : false;
        //Set IsRequired
        ViewEditorConfigColumns.triipcrm_IsRequired = isValid(recordToUpdate.triipcrm_isrequired) ? recordToUpdate.triipcrm_isrequired : false;
        //Set Width
        ViewEditorConfigColumns.triipcrm_Width = isValid(recordToUpdate.triipcrm_width) ? Math.floor(recordToUpdate.triipcrm_width) : 100;
        //Set AllowFilter
        ViewEditorConfigColumns.triipcrm_AllowFilter = isValid(recordToUpdate.triipcrm_allowfilter) ? recordToUpdate.triipcrm_allowfilter : false;

        //Update the Record
        XrmServiceToolkit.Rest.Update(recordToUpdate.triipcrm_viewcolumnid,
                                      ViewEditorConfigColumns,
                                      "triipcrm_viewcolumnSet",
                                      function (result) { },
                                      function (error) {
                                          throwError(error, functionName);
                                      }, false);

    } catch (e) {
        throwError(e, functionName);
    }
}

//Validate if the record has Read only and required both properties enabled
function validateRecordToUpdate(record) {
    var functionName = "validateRecordToUpdate";
    var isValid = true;
    try {

        //check if both the fields are set to true
        if (record.triipcrm_isrequired && record.triipcrm_isreadonly) {
            isValid = false;
        }

    } catch (e) {
        throwError(e, functionName);
    }

    return isValid;
}

//Validate if the record has Read only and required both properties enabled
function validateRecordToUpdate(record) {
    var functionName = "validateRecordToUpdate";
    var isValid = true;
    try {

        //check if both the fields are set to true
        if (record.triipcrm_isrequired && record.triipcrm_isreadonly) {
            isValid = false;
        }

    } catch (e) {
        throwError(e, functionName);
    }

    return isValid;
}

//Retrieve view layout
function fetchGridLayout() {
    var functionName = "fetchGridLayout";
    var viewName = "";
    var viewId = "";
    var viewType = "";
    var layoutXml = "";
    var ViewconfigId = "";
    var existColumnArr = [];
    var arrColumn = [];
    var results = "";
    var extraColumnArr = [];
    var recordsToUpdate = new Array();
    var primaryEntity = "";
    var difference = []
    var seen = [];
    var newextcolumns = [];

    try {

        //viewType = parent.Xrm.Page.getAttribute("triipcrm_viewtype").getValue();
        //viewId = parent.Xrm.Page.getAttribute("triipcrm_primaryentityviewid").getValue();
        //primaryEntity = parent.Xrm.Page.getAttribute("triipcrm_primaryentity").getValue();

        showLoading(true);

        //get view configuraion entity Id
        ViewconfigId = parent.Xrm.Page.data.entity.getId();

        //fetch view configuration attributes
        var viewConfig = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                        "<entity name='triipcrm_viewconfiguration'>" +
                        "<attribute name='triipcrm_name' />" +
                        "<attribute name='triipcrm_savemode' />" +
                        "<attribute name='triipcrm_relatedentity' />" +
                        "<attribute name='triipcrm_primaryentityviewid' />" +
                        "<attribute name='triipcrm_primaryentity' />" +
                        "<attribute name='triipcrm_isdefault' />" +
                        "<attribute name='triipcrm_gridtype' />" +
                        //"<attribute name='triipcrm_disableinactiverecords' />" +
                        "<attribute name='triipcrm_viewconfigurationid' />" +
                        "<attribute name='triipcrm_viewtype' />" +
                        "<order attribute='triipcrm_name' descending='false' />" +
                        "<filter type='and'>" +
                        "<condition attribute='triipcrm_viewconfigurationid' operator='eq' uitype='triipcrm_viewconfiguration' value='" + ViewconfigId + "' />" +
                        "</filter>" +
                        "</entity>" +
                        "</fetch>";

        var viewConfigResult = XrmServiceToolkit.Soap.Fetch(viewConfig);

        if (viewConfigResult != null && viewConfigResult.length > 0) {
            for (var i = 0; i < viewConfigResult.length; i++) {
                viewType = viewConfigResult[i].attributes["triipcrm_viewtype"].value;
                viewId = viewConfigResult[i].attributes["triipcrm_primaryentityviewid"].value;
                primaryEntity = viewConfigResult[i].attributes["triipcrm_primaryentity"].value;
            }
        }

        var fetchView = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                          "<entity name='" + viewType + "'>" +
                            "<attribute name='name' />" +
                            "<attribute name='layoutxml' />" +
                            "<attribute name='fetchxml' />" +
                            "<attribute name='" + viewType + "id' />" +
                            "<order attribute='name' descending='false' />" +
                            "<filter type='and'>" +
                                "<condition attribute='" + viewType + "id' operator='eq' uitype='" + viewType + "' value='" + viewId + "' />" +
                            "</filter>" +
                          "</entity>" +
                        "</fetch>";

        var fetchViewResult = XrmServiceToolkit.Soap.Fetch(fetchView);

        if (fetchViewResult != null && fetchViewResult.length > 0) {
            for (var i = 0; i < fetchViewResult.length; i++) {
                layoutXml = fetchViewResult[i].attributes["layoutxml"].value;
            }
        }

        var xml = $.parseXML(layoutXml);
        var cellEle = xml.getElementsByTagName('cell');

        var newcolumns = [];
        var differArray = [];
        $.each(cellEle, function (index, value) {
            var col = {};
            col.Attribute = value.getAttribute('name');
            col.Width = value.getAttribute('width');

            if (!(col.Width == 0 || value.getAttribute('ishidden'))) {
                //push in array
                newcolumns.push(col);
                differArray.push(value.getAttribute('name'));
            }
        });


        //fetch existing columns
        var existingFetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                            "<entity name='triipcrm_viewcolumn'>" +
                            "<attribute name='triipcrm_viewcolumnid' />" +
                            "<attribute name='triipcrm_name' />" +
                            "<attribute name='createdon' />" +
                            "<attribute name='triipcrm_columnlogicalname' />" +
                            "<order attribute='triipcrm_name' descending='false' />" +
                            "<filter type='and'>" +
                            "<condition attribute='triipcrm_viewconfiguration' operator='eq' uitype='triipcrm_viewconfiguration' value='" + ViewconfigId + "' />" +
                            "</filter>" +
                            "</entity>" +
                            "</fetch>";

        var existingFetchResult = XrmServiceToolkit.Soap.Fetch(existingFetch);

        if (existingFetchResult != null && existingFetchResult.length > 0) {
            for (var i = 0; i < existingFetchResult.length; i++) {
                var col = {};
                col.Name = existingFetchResult[i].attributes["triipcrm_columnlogicalname"].value;
                col.Id = existingFetchResult[i].attributes["triipcrm_viewcolumnid"].value;

                //push in array
                newextcolumns.push(col);

                existColumnArr.push(existingFetchResult[i].attributes["triipcrm_columnlogicalname"].value);
            }
        }

        // delete extra columns 
        difference = []
        seen = [];
        for (var i = 0; i < differArray.length; i++)
            seen[differArray[i]] = true;
        for (var i = 0; i < existColumnArr.length; i++)
            if (!seen[existColumnArr[i]])
                difference.push(existColumnArr[i]);

        if (difference.length > 0) {
            results = Tribridge.CRMSDK.METADATA.RetrieveEntity(primaryEntity, Tribridge.CRMSDK.METADATA.EntityFilters.Attributes, null, true, null, null, null)

            if (results != null && results.Attributes != null) {
                $.each(difference, function (index, item) {
                    if (results.Attributes[item] != undefined) {
                        extraColumnArr.push(results.Attributes[item]);
                    }
                });
            }

            //delete column entity
            DeleteColumns(extraColumnArr, newextcolumns);
        }


        //get only new columns
        difference = []
        seen = [];
        for (var i = 0; i < existColumnArr.length; i++)
            seen[existColumnArr[i]] = true;
        for (var i = 0; i < differArray.length; i++)
            if (!seen[differArray[i]])
                difference.push(differArray[i]);

        if (difference.length > 0) {
            results = Tribridge.CRMSDK.METADATA.RetrieveEntity(primaryEntity, Tribridge.CRMSDK.METADATA.EntityFilters.Attributes, null, true, null, null, null)

            if (results != null && results.Attributes != null) {
                //Get Array of columns of the grid
                $.each(difference, function (index, item) {
                    if (results.Attributes[item] != undefined) {
                        extraColumnArr.push(results.Attributes[item]);
                    }
                });
            }
            //Create Column entity
            CreateColumns(extraColumnArr, newcolumns);
        }

        ReOrderColumns(layoutXml, ViewconfigId);

        //Create and initialize column config grid
        createViewConfigColumnsGrid();

        //hide lodaing
        showLoading(false);
    }
    catch (e) {
        //hide lodaing
        showLoading(false);
        throwError(e, functionName);
    }
}

//The function read the layout XML of a view and order the columns in existing view column records

function ReOrderColumns(layoutXML, ViewconfigId) {
    var functionName = "ReOrderColumns";

    try {

        //fetch existing columns
        var existingFetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                            "<entity name='triipcrm_viewcolumn'>" +
                            "<attribute name='triipcrm_viewcolumnid' />" +
                            "<attribute name='triipcrm_name' />" +
                            "<attribute name='triipcrm_columnorder' />" +
                            "<attribute name='triipcrm_columnlogicalname' />" +
                            "<order attribute='triipcrm_name' descending='false' />" +
                            "<filter type='and'>" +
                            "<condition attribute='triipcrm_viewconfiguration' operator='eq' uitype='triipcrm_viewconfiguration' value='" + ViewconfigId + "' />" +
                            "</filter>" +
                            "</entity>" +
                            "</fetch>";

        //Get the view columns records
        var existingFetchResult = XrmServiceToolkit.Soap.Fetch(existingFetch);

        //parse the layout xml
        var xml = $.parseXML(layoutXML);

        //get the cell element from the layout
        var cellEle = xml.getElementsByTagName('cell');

        var counter = 0;

        //loop through cell elements
        $.each(cellEle, function (index, value) {
            var col = {};

            //get the column name from layout
            col.Attribute = value.getAttribute('name');

            //loop through view columns records
            $.each(existingFetchResult, function (index, item) {

                //view column attribute name and layout column name are same
                if (item.attributes["triipcrm_columnlogicalname"].value == col.Attribute) {

                    //increase the counter
                    counter = counter + 1;

                    //check if column order is already provided
                    if (item.attributes["triipcrm_columnorder"] != undefined) {

                        //check if the view column order and record column order do not match
                        if (item.attributes["triipcrm_columnorder"].value != counter) {
                            //update config column record with the new column order
                            updateConfigColumn(item.attributes["triipcrm_viewcolumnid"].value, counter);
                        }
                    }
                    else {
                        //update config column record with the new column order
                        updateConfigColumn(item.attributes["triipcrm_viewcolumnid"].value, counter);
                    }
                }
            });

        });

    } catch (e) {
        throwError(e, functionName);
    }
}

//Update the record
function updateConfigColumn(recordId, order) {
    var functionName = "updateConfigColumn";
    var ViewEditorConfigColumns = new Object();
    try {

        //Set column order
        ViewEditorConfigColumns.triipcrm_ColumnOrder = order;

        //Update the Record
        XrmServiceToolkit.Rest.Update(recordId,
                                      ViewEditorConfigColumns,
                                      "triipcrm_viewcolumnSet",
                                      function (result) { },
                                      function (error) {
                                          throwError(error, functionName);
                                      }, false);

    } catch (e) {
        throwError(e, functionName);
    }
}

//Create column configuration entity
function CreateColumns(extraColumnArr, newcolumns) {
    var functionName = "CreateColumns";
    var array = [];
    var ViewconfigId = "";
    var viewConfigName = "";
    var width = 0.0;

    try {

        ViewconfigId = parent.Xrm.Page.data.entity.getId();
        viewConfigName = parent.Xrm.Page.getAttribute("triipcrm_name").getValue();

        if (extraColumnArr != null && extraColumnArr.length > 0) {

            for (var i = 0; i < extraColumnArr.length; i++) {
                var array = [];
                var extraColumn = "";
                extraColumn = extraColumnArr[i].AttributeLogicalName;

                $.each(newcolumns, function (index, item) {
                    if (newcolumns[index].Attribute == extraColumn) {
                        array.push(newcolumns[index]);
                    }
                });

                if (array[0] != undefined) {
                    width = array[0].Width;
                    var configColumns = new XrmServiceToolkit.Soap.BusinessEntity("triipcrm_viewcolumn");
                    configColumns.attributes["triipcrm_columndisplayname"] = extraColumnArr[i].DisplayName;
                    configColumns.attributes["triipcrm_columnlogicalname"] = extraColumnArr[i].AttributeLogicalName;
                    configColumns.attributes["triipcrm_width"] = { value: parseInt(width), type: "int" };
                    //parseInt(width);
                    configColumns.attributes["triipcrm_viewconfiguration"] = { id: ViewconfigId, logicalName: "triipcrm_viewconfiguration", type: "EntityReference" };
                    configColumns.attributes["triipcrm_name"] = viewConfigName + "-" + extraColumnArr[i].AttributeLogicalName + "-" + "Column";

                    //Create
                    XrmServiceToolkit.Soap.Create(configColumns);
                }
            }
        }
    } catch (e) {
        //hide lodaing
        showLoading(false);
        throwError(e, functionName);
    }
}

//delete columns configuration records
function DeleteColumns(extraColumnArr, newextcolumns) {
    try {
        if (extraColumnArr != null && extraColumnArr.length > 0) {

            for (var i = 0; i < extraColumnArr.length; i++) {
                var array = [];
                var extraColumn = "";
                extraColumn = extraColumnArr[i].AttributeLogicalName;

                $.each(newextcolumns, function (index, item) {
                    if (newextcolumns[index].Name == extraColumn) {
                        array.push(newextcolumns[index]);
                    }
                });

                //delete columns
                XrmServiceToolkit.Soap.Delete("triipcrm_viewcolumn", array[0].Id);
            }
        }
    } catch (e) {
        //hide lodaing
        showLoading(false);
        throwError(e, functionName);
    }
}