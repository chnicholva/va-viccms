/// <reference path="XrmServiceToolkit.js" />

if (typeof Tribridge == "undefined")
    Tribridge = {};
if (typeof Tribridge.ViewEditor == "undefined")
    Tribridge.ViewEditor = {};

/**
 * KENDO UI VIEW EDITOR
 * FOR CRM 2011 & CRM 2013

 * 
 * @author: Angelo Ortega 
 * @version: 
 * - 1.0 (25/08/2014, Angelo Ortega)
 *  + Build Function
 */

// Namespaces
Tribridge.ViewEditor = {}; // Namespace, default
Tribridge.ViewEditor.Private = {}; // Namespace for private methods
Tribridge.ViewEditor.Events = {}; // Namespace for event methods
Tribridge.ViewEditor.CB = {}; // Namespace for callback methods


// Global Variables
Tribridge.ViewEditor.ErrorRecords = [];
Tribridge.ViewEditor.CustomViews = [];
Tribridge.ViewEditor.PagingSize = 250;
Tribridge.ViewEditor.RecordsToSave_Count = 0;
Tribridge.ViewEditor.RecordsProcessed_Count = 0;
var index;
var moneyField;
var numberField;
var optionSetField;
var optionIndex;
var addNew = false;
var entityLogicalName;
var templateFieldValues;
var lookupContainer;

var pageNo = 1;
var fRecord = 0;
var lRecord = 0;
var count = 0;
var isSaveFlag = 0;
var moreRecords;
var pageCookiesNext = "";
var pageCookiesPrevious = "";
var currentPageCookie = "";
var arrPreviousPages = [];

var _viewName;
var _configName;
var _associatedEntity;
var _entityName;
var _ViewConfigRecord;
var _ViewColumnsRecords;
var _batchSave = 399300001;
var _isSubGrid = false;
var _isWebResource = false;
var _associatedEntityId;
var _primaryentityattribute;
var _disableInactiveRecords;
var _filterQuery;
var _sortingQuery;
var _dir;
var _flag = 0;
var _prevDir;
var _nextDir;
var descdir;
var _sortField;
var _filter;
var _lookupOptions;
var objectTypeCodes = [];
var _enablePrompt = false;

/**
* Called from the web page

 * @desc This function builds a grid dynamically.
 *
 * @param cssId - The css id.
 * @param entity - The crm entity name.
 * @param views - The view to be replaced.
 * @param readonlyCols - The readonly columns in the grid (array).
 * @param requiredCols - The required columns in the grid (array).
 * @param autoSave - Defines if the record is auto-saved after changing a cell.
 *
 * @required entity, view
 */

// Original - Commented by deepashri
//Tribridge.ViewEditor.Build = function (cssId, entity, view, readonlyCols, requiredCols, autoSave) {
//    var functionName = "Tribridge.ViewEditor.Build";
//    try {
//        var viewInfo = { CssId: cssId, Entity: entity, Query: view, Readonly: readonlyCols, Required: requiredCols, AutoSave: autoSave, Columns: null, FetchXml: null };
//        index = Tribridge.ViewEditor.CustomViews.push(viewInfo) - 1;

//        // First, find the view
//        Tribridge.ViewEditor.Private.FindView(index);
//    } catch (e) {
//        throwError(e, functionName);
//    }
//};


Tribridge.ViewEditor.Build = function (cssId, entity, view, readonlyCols, requiredCols, autoSave) {
    var functionName = "Tribridge.ViewEditor.Build";
    try {
        var viewInfo = { CssId: cssId, Entity: entity, Query: view, Readonly: readonlyCols, Required: requiredCols, AutoSave: autoSave, Columns: null, FetchXml: null };
        index = Tribridge.ViewEditor.CustomViews.push(viewInfo) - 1;

        // First, find the view
        Tribridge.ViewEditor.Private.FindView(index);
    } catch (e) {
        throwError(e, functionName);
    }
};

// Method for Subgrid functionality implementation
Tribridge.ViewEditor.SubGrid = function (entity, configName, Id) {
    var functionName = "Tribridge.ViewEditor.SubGrid";
    try {
        _isSubGrid = true;
        // set the entity name to be used overall
        _associatedEntity = entity;

        // set the configuration name
        _configName = configName;

        // associated entity Id
        _associatedEntityId = Id;

        // hide the view's dropdown
        $('#divViewSelector').hide();

        //// hide the add button
        //$('#addButton').hide();

        // Show grid
        Tribridge.ViewEditor.ViewGrid();
    } catch (e) {
        throwError(e, functionName);
    }
}


// Get Views for the main grid 
Tribridge.ViewEditor.MainGrid = function (entity) {
    var functionName = "Tribridge.ViewEditor.MainGrid";
    try {
        // show loader
        ShowBusyIndicator();

        // Make the grid content area visible false;
        $("#gridContent").hide();
        _isSubGrid = false;
        // set the entity name to be used overall
        _entityName = entity;
        // Get the views 
        var fetchQuery = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                          "<entity name='triipcrm_viewconfiguration'>" +
                            "<attribute name='triipcrm_name' />" +
                            "<attribute name='triipcrm_primaryentityviewname' />" +
                            "<attribute name='triipcrm_isdefault' />" +
                             "<attribute name='triipcrm_enablesaveprompt' />" +
                            "<order attribute='triipcrm_primaryentityviewname' descending='false' />" +
                            "<filter type='and'>" +
                              "<condition attribute='triipcrm_primaryentity' operator='eq' value='" + entity + "' />" +
                              "<condition attribute='triipcrm_gridtype' operator='eq' value='399300000' />" +
                              "<condition attribute='statecode' operator='eq' value='0' />" +
                            "</filter>" +
                          "</entity>" +
                        "</fetch>";

        XrmServiceToolkit.Soap.Fetch(fetchQuery, true, function (result) { onFetchViewQueryComplete(result); });

    } catch (e) {
        throwError(e, functionName);
    }
}

// Get the views for webresource
Tribridge.ViewEditor.Webresource = function (viewConfigname) {
    var functionName = "Tribridge.ViewEditor.Webresource";
    try {
        _configName = viewConfigname;
        _isWebResource = true;

        // hide the view's dropdown
        $('#divViewSelector').hide();

        Tribridge.ViewEditor.ViewGrid();
    } catch (e) {
        throwError(e, functionName);
    }
}

// 

// Function for on success of fetch query view
function onFetchViewQueryComplete(result) {
    var functionName = "onFetchViewQueryComplete";
    var optionsList = [{ Name: "Please select ...", Value: -1 }];
    var selectedIndex = 0;

    try {
        // Get the fetch view query result and create a optionlist having View display name and unique name
        if (result != null && result != undefined && result != "undefined") {
            for (var i = 0; i < result.length; i++) {
                optionsList.push({ Name: result[i].attributes["triipcrm_primaryentityviewname"].value, Value: result[i].attributes["triipcrm_name"].value });
                if (result[i].attributes["triipcrm_isdefault"].value) {
                    selectedIndex = i + 1;
                }
            }
        }

        // Bind the view names to dropdown kendo list.
        $('#ddlViews').kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "Value",
            dataSource: optionsList,
            index: selectedIndex
        });

        // register the dropdown change event
        $("#ddlViews").change(function () {
            Tribridge.ViewEditor.ddlViewsChangeEvent();
        });

        // If default view is provided then bind the default view
        if (selectedIndex > 0) {
            // Show the default view grid binded on load
            Tribridge.ViewEditor.ddlViewsChangeEvent();
        }

        //HideBusyIndicator();
    } catch (e) {
        throwError(e, functionName);
    }
}

// Views dropdown change event
// In this event the ViewEditor grid will get binded with the respective View's columns and data to edit.
Tribridge.ViewEditor.ddlViewsChangeEvent = function () {
    var functionName = "Tribridge.ViewEditor.ddlViewsChangeEvent";
    try {

        // show loader
        ShowBusyIndicator();

        // Hide the grid content area
        $("#gridContent").hide();

        pageNo = 1;
        currentPageCookie = "";
        fRecord = 0;
        descdir = undefined;
        _sortField = null;
        objectTypeCodes = [];

        Tribridge.ViewEditor.ErrorRecords = [];
        Tribridge.ViewEditor.RecordsToSave_Count = 0;
        Tribridge.ViewEditor.RecordsProcessed_Count = 0;

        // Get the View's unique name and set it to the viewName global variable
        _configName = $("#ddlViews").data("kendoDropDownList").value();
        _viewName = $("#ddlViews").data("kendoDropDownList").text();

        var CHANGE = 'change',
               $grid = $('#grid');

        // Unbind existing refreshHandler in order to re-create with different column set
        if ($grid.length > 0 && $grid.data().kendoGrid) {
            var thisKendoGrid = $grid.data().kendoGrid;

            if (thisKendoGrid.dataSource && thisKendoGrid._refreshHandler) {
                thisKendoGrid.dataSource.unbind(CHANGE, thisKendoGrid._refreshHandler);
                $grid.removeData('kendoGrid');
                $grid.empty();
            }
        }

        if (_configName == -1) {
            if ($("#grid").data("kendoGrid") != undefined) {
                // empty grid
                bindGrid([]);
                $("#grid").data("kendoGrid").dataSource.sort({});
                $("#grid").data("kendoGrid").dataSource.page(1);
                $("#grid").data("kendoGrid").refresh();
                $("#lblTotalPage").text("0" + " - " + "0" + " of " + "0");

            }

            $("#dvPaging").css('display', 'none');

            HideBusyIndicator();
        }
        else {
            $("#dvPaging").css('display', 'none');
            Tribridge.ViewEditor.ViewGrid();
        }
        // End Functionality of Tribridge.ViewEditor.Build function
    } catch (e) {
        throwError(e, functionName);
    }
}

// Function for creating editable view grid
Tribridge.ViewEditor.ViewGrid = function () {
    var functionName = "Tribridge.ViewEditor.ViewGrid";
    try {
        // Retrieve ViewConfig and ViewColumns records for the selected view
        RetrieveViewConfigurationRecords();
    } catch (e) {
        throwError(e, functionName);
    }
}

// ################################################### PRIVATE

Tribridge.ViewEditor.Private.Grid = function (index) {
    var functionName = "Tribridge.ViewEditor.Private.Grid";
    try {
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];

        //var grid = $('#' + viewInfo.CssId).kendoGrid({
        var grid = $('#' + viewInfo.CssId).kendoGrid({
            dataSource: { schema: getSchema(index) },
            //pageable: false,
            //ignoreCase: false,
            filterable: { extra: false },
            selectable: false,
            //groupable: false,
            navigatable: true,
            // height: $(document).height() - 100,
            sortable: true,
            toolbar: kendo.template($("#toolButtons").html()),
            dataBinding: Tribridge.ViewEditor.Private.OnDataBinding_Grid,
            columns: getGridColumns(index),
            //serverSorting: true,
            //resizable: true,
            editable: true,
            edit: function (e) {
                // Check if the record is not active and requested for disable inactive record  
                if (e.model._IsActiveRecord > 0 && _disableInactiveRecords == 1) {
                    //revert edited cell back to `read` mode
                    this.closeCell();
                }
            },
            change: function (e) {
                //this will fire after filtered.
                if (e.action == "add") {
                    var newItem = e.items[0];

                    if (this.filter() != undefined) {
                        var filter = this.filter().filters;
                        var i = filter.length;
                        while (i--) {
                            filterValue = filter[i].value;
                            filterField = filter[i].field;
                            newItem[filterField] = filterValue;
                        }
                    }
                }
                //set the coresponding value of the newItem according to the applied filters


                dataView = this.dataSource.view();
            },
            dataBound: function () {
                dataView = this.dataSource.view();
                for (var i = 0; i < dataView.length; i++) {
                    if (dataView[i]._IsActiveRecord > 0) {
                        var uid = dataView[i].uid;
                        $("#grid tbody").find("tr[data-uid=" + uid + "]").addClass("InActiveRow");
                    }
                    else {
                        var uid = dataView[i].uid;
                        $("#grid tbody").find("tr[data-uid=" + uid + "]").addClass("ActiveRow");
                    }
                }
            }
        });

        //filtering
        var fetchXML;
        $("#grid").data("kendoGrid").dataSource.originalFilter = $("#grid").data("kendoGrid").dataSource.filter;

        $("#grid").data("kendoGrid").dataSource.filter = function () {
            var result = $("#grid").data("kendoGrid").dataSource.originalFilter.apply(this, arguments);
            if (arguments.length > 0) {
                this.trigger("filter", arguments);
            }
            return result;
        }

        $("#grid").data("kendoGrid").dataSource.bind("filter", function () {

            ShowBusyIndicator();

            var currentFilter = this.filter();
            _filter = currentFilter;

            if (currentFilter == null) {
                // empty SortFetch if any
                viewInfo.SortFetch = null;
            }

            //check sorting is applied
            if (viewInfo.SortFetch != null) {
                fetchXML = viewInfo.SortFetch;
            }
            else {
                fetchXML = viewInfo.FetchXml;
            }

            //create fetch for filter
            addFilterCondition(fetchXML, viewInfo, currentFilter);

            //show sorting icon
            //remove span tags before adding
            // $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").remove();
            if (_sortField != null) {
                if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                    $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                }

                if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                    $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                }


                if (descdir == false) {
                    if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                        var newdiv2 = document.createElement("span")
                        if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                            var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                        }
                        newHtml.find("span").addClass("k-icon k-i-arrow-n");
                        $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                    }
                }
                else {
                    if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                        var newdiv2 = document.createElement("span")
                        if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                            var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                        }
                        newHtml.find("span").addClass("k-icon k-i-arrow-s");
                        $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                    }
                }
            }
            //HideBusyIndicator();
        });

        currentPageCookie = "";
        Tribridge.ViewEditor.BindData(index, currentPageCookie);
        $('#grid').data().kendoGrid.dataSource.bind('change', Tribridge.OData.ChangeMonitor);

        //Sorting the view editor column
        $('#grid').data('kendoGrid').dataSource.sort = function (e) {
            var fetchXML;

            if (e == undefined) {
                return;
            }
            ShowBusyIndicator();
            pageNo = 1;
            currentPageCookie = "";
            fRecord = 0;

            if (viewInfo.SortFetch != null) {
                fetchXML = viewInfo.SortFetch;
            }
            else {
                fetchXML = viewInfo.FetchXml;
            }

            var oSerializer = new XMLSerializer();
            if (e[0] != null) {
                _sortField = e[0].field;

                if ($("#grid thead").find("th[data-field=" + _sortField + "]").attr('data-dir') == undefined) {
                    descdir = false;
                }
                else {
                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").attr('data-dir') == "asc") {
                        descdir = true;
                    }
                    else if ($("#grid thead").find("th[data-field=" + _sortField + "]").attr('data-dir') == "desc") {
                        descdir = undefined;
                        //show sorting icon
                        //remove span tags before adding
                        // $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").remove();
                        if (_sortField != null) {
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                                //    $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                                //}
                                //$("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span")[1].remove()
                                $("#grid thead").find("th[data-field=" + _sortField + "]").find("a.k-link span").remove();
                            }

                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                                // $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                                //$("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span")[1].remove()
                                $("#grid thead").find("th[data-field=" + _sortField + "]").find("a.k-link span").remove();
                            }

                        }

                        if (_filter != null) {
                            //remove order tag from fetch
                            // Parse the fetchquery as xml
                            var parsedFetch = Tribridge.Helper.ParseXml(fetchXML);

                            // Fetch node
                            var fetchNode = parsedFetch.getElementsByTagName("fetch")[0];

                            // Entity node
                            var entityNode = fetchNode.getElementsByTagName("entity")[0];

                            //order node
                            var orderNode = entityNode.getElementsByTagName("order");
                            var ordLength = orderNode.length;
                            if (orderNode != null && orderNode.length > 0) {
                                //for (var i = 0; i < ordLength; i++) {
                                //    entityNode.removeChild(orderNode[0]);
                                //}
                                // bug fix on July-07-2016
                                Array.prototype.slice.call(entityNode.getElementsByTagName('order')).forEach(
                                  function (item) {
                                      //item.remove(); // or
                                      item.parentNode.removeChild(item); //for older browsers (Edge-)
                                  });
                            }
                            // convert xml to string
                            if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
                                // For IE browser
                                fetchXML = fetchNode.xml.replace(/"/g, "'");
                                viewInfo.SortFetch = fetchXML;
                            }
                            else {
                                // for other browsers
                                fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
                                viewInfo.SortFetch = fetchXML;
                            }
                        }
                        else {
                            viewInfo.SortFetch = null;
                        }

                        _sortField = null;
                        viewInfo._sortingQuery = null;

                        Tribridge.ViewEditor.BindData(index, currentPageCookie);
                    }
                }


                if (descdir != undefined) {
                    // Parse the fetchquery as xml
                    var parsedFetch = Tribridge.Helper.ParseXml(fetchXML);

                    // Fetch node
                    var fetchNode = parsedFetch.getElementsByTagName("fetch")[0];

                    // Entity node
                    var entityNode = fetchNode.getElementsByTagName("entity")[0];

                    //order node
                    var orderNode = entityNode.getElementsByTagName("order");
                    var ordLength = orderNode.length;
                    if (orderNode != null && orderNode.length > 0) {
                        //for (var i = 0; i < ordLength; i++) {
                        //    entityNode.removeChild(orderNode[0]);
                        //}
                        // bug fix on July-07-2016
                        Array.prototype.slice.call(entityNode.getElementsByTagName('order')).forEach(
                                function (item) {
                                    //item.remove(); // or
                                    item.parentNode.removeChild(item); //for older browsers (Edge-)
                                });
                    }
                    var newel = parsedFetch.createElement("order");

                    var nameAtt = parsedFetch.createAttribute("attribute");
                    nameAtt.nodeValue = e[0].field.toLowerCase();

                    var descAtt = parsedFetch.createAttribute("descending");
                    descAtt.nodeValue = descdir;

                    //for IE
                    if (descAtt.nodeValue == "-1") {
                        descAtt.text = "true";
                    }

                    newel.setAttributeNode(nameAtt);
                    newel.setAttributeNode(descAtt);
                    entityNode.appendChild(newel);

                    _sortingQuery = newel;

                    // convert xml to string
                    if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
                        // For IE browser
                        fetchXML = fetchNode.xml.replace(/"/g, "'");
                        viewInfo.SortFetch = fetchXML;
                    }
                    else {
                        // for other browsers
                        fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
                        viewInfo.SortFetch = fetchXML;
                    }

                    //bind the data
                    Tribridge.ViewEditor.BindData(index, currentPageCookie);

                    //remove span tags before adding
                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                    }

                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                    }


                    if (descdir == false) {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-n");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                        }
                    }
                    else {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-s");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                        }
                    }
                }
            }
            //HideBusyIndicator();;
        }

        //Open record in right click
        //Start
        var menu = $("#rightClickOptions"),
               original = menu.clone(true);

        original.find(".k-state-active").removeClass("k-state-active");

        //show options
        $("#rightClickOptions").css("display", "block");

        $("#rightClickOptions").kendoContextMenu({
            orientation: "vertical",
            target: "#grid",
            //rightButton: true,
            filter: ".k-grid-content tr",
            animation: {
                open: { effects: "fadeIn" },
                duration: 500
            },
            select: function (e) {
                // Do something on select
                var id = $(e.target).find('td:last').text();
                var selectedOption = $(e.item).children(".k-link").text();

                if (selectedOption == "Open") {
                    //Open record in current window
                    Xrm.Utility.openEntityForm(_entityName, id)

                }
                else if (selectedOption == "Open in a New Window") {
                    //open record in new window
                    var options = {
                        openInNewWindow: true
                    };
                    Xrm.Utility.openEntityForm(_entityName, id, null, options)
                }
            }
        });

        // If the document is clicked somewhere
        $(document).bind("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents("#rightClickOptions").length > 0) {

                // Hide it
                $("#rightClickOptions").hide(100);
            }
        });

        //End

        //Add Button
        $("#addButton").click(function () {
            var functionName = "addButton";
            var isConfirm;
            try {
                if (_sortField != null || _filter != null) {
                    var viewInfo = Tribridge.ViewEditor.CustomViews[index];
                    displayMessage = "Adding a new record will clear all filters and sorting, Please confirm!";
                    isConfirm = confirm(displayMessage);

                    if (isConfirm != true && isConfirm != undefined) {
                        HideLoading();
                        return;
                    }
                    else {
                        _sortField = null;
                        _filter = null;
                        //Add Row
                        viewInfo.SortFetch = null;
                        pageNo = 1;
                        currentPageCookie = "";
                        pageCookiesPrevious = "";
                        fRecord = 0;
                        _sortField;
                        descdir = undefined;
                        var grid = $("#grid").data("kendoGrid");
                        grid.dataSource.filter({});
                        grid.dataSource.sort({});
                        addNew = true;
                        $('#grid').data('kendoGrid').addRow();
                    }
                }
                else {
                    addNew = true;
                    $('#grid').data('kendoGrid').addRow();
                }
                HideBusyIndicator();
            } catch (e) {
                throwError(e, functionName);
            }
        });

        //Save Button
        $("#saveChangesButton").click(function () {
            var functionName = "saveChangesButton";
            try {
                //Save data               
                Tribridge.ViewEditor.Private.SaveData(index);
                //HideLoading();
            } catch (e) {
                throwError(e, functionName);
            }
        });

        //Cancel Button
        $("#cancelButton").click(function () {
            var functionName = "cancelButton";
            try {
                //Rebind the grid data  
                ShowBusyIndicator();
                Tribridge.ViewEditor.ErrorRecords = [];
                Tribridge.ViewEditor.RecordsToSave_Count = 0;
                Tribridge.ViewEditor.RecordsProcessed_Count = 0;
                Tribridge.ViewEditor.BindData(index, currentPageCookie);
                HideBusyIndicator();
            } catch (e) {
                throwError(e, functionName);
            }
        });

        // Previous button
        /// $("#btnPrevious").click(function (e) {
        $("#btnPrevious").unbind("click").click(function (e) {
            var displayMessage = "";
            var recordsToSave = new Array();
            var isConfirm;

            //show loading
            ShowBusyIndicator();
            _flag = 0;
            if ($("#btnPrevious").attr('disabled') == 'disabled') {
                $("#btnPrevious").addClass("btnPreviousCss");
                $("#btnPrevious").removeClass("btnEnabledPreviousCss");
                HideBusyIndicator();
                e.preventDefault();
                return;
            }
            //check record is dirty
            var records = $("#grid").data("kendoGrid").dataSource.data();
            //Check the records
            if (isValid(records)) {
                //Loop through records
                recordsToSave = jQuery.grep(records, function (n, i) {
                    return (n.dirty == true);
                });
            }

            //validate loader
            if (recordsToSave != null && recordsToSave != undefined && recordsToSave[0] != undefined && recordsToSave.length > 0) {
                displayMessage = "There is some data still unsaved,Changing the page will cause loss of data!";

                isConfirm = confirm(displayMessage);
            }

            if (isConfirm != true && isConfirm != undefined) {
                HideBusyIndicator();
                return;
            }
            else {
                pageNo -= 1;
                var resultLength = 0;

                $("#btnNext").removeAttr('disabled');
                $("#btnPrevious").removeAttr('disabled');
                $("#btnFirst").removeAttr('disabled');

                $("#btnPrevious").addClass("btnEnabledPreviousCss");
                //$("#btnPrevious").css('display', 'none');

                if (arrPreviousPages[pageNo - 1] == 0) {
                    arrPreviousPages = [];
                    currentPageCookie = "";
                    resultLength = Tribridge.ViewEditor.BindData(index, currentPageCookie);
                }
                else {
                    pageCookiesPrevious = arrPreviousPages[pageNo - 1];
                    currentPageCookie = pageCookiesPrevious;
                    resultLength = Tribridge.ViewEditor.BindData(index, currentPageCookie);
                }

                // resultLength = Tribridge.ViewEditor.BindData(index, pageCookiesPrevious);

                //Kadambari - 03-07-2015
                $("#lblPageNumber").text("Page" + " " + pageNo + " ");

                //Fetch total count of records
                // count = FetchCount(viewInfo);

                fRecord = fRecord > Tribridge.ViewEditor.PagingSize ? fRecord - Tribridge.ViewEditor.PagingSize : 1;
                lRecord = (fRecord - 1) + Tribridge.ViewEditor.PagingSize;

                $("#lblTotalPage").text(fRecord + " - " + lRecord + " of " + count);

                $("#btnFirst").addClass("btnEnabledFirstCss");
                $("#btnPrevious").addClass("btnEnabledPreviousCss");

                if (fRecord <= 1) {
                    $("#btnFirst").attr('disabled', 'disabled');
                    $("#btnPrevious").attr('disabled', 'disabled');

                    //Remove css
                    $("#btnNext").removeClass("btnNextCss");
                    $("#btnFirst").removeClass("btnEnabledFirstCss");
                    $("#btnPrevious").removeClass("btnEnabledPreviousCss");

                    $("#btnNext").addClass("btnEnabledNextCss");
                    $("#btnFirst").addClass("btnFirstCss");
                    $("#btnPrevious").addClass("btnPreviousCss");
                    e.preventDefault();
                }
                else {
                    $("#btnFirst").removeAttr('disabled');
                    $("#btnPrevious").removeAttr('disabled');

                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");
                }

                // if (lRecord >= count) {
                if (moreRecords == false) {
                    $("#btnNext").attr('disabled', 'disabled');
                    $("#btnNext").removeClass("btnEnabledNextCss");
                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnNext").addClass("btnNextCss");
                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");

                    e.preventDefault();
                }
                //show sorting icon
                //remove span tags before adding
                if (_sortField != null) {
                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                    }

                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                    }


                    if (descdir == false) {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-n");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                        }
                    }
                    else {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-s");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                        }
                    }
                }
            }

        });

        // Next button
        ///  $("#btnNext").click(function (e) {
        $("#btnNext").unbind("click").click(function (e) {
            var displayMessage = "";
            var recordsToSave = new Array();
            var isConfirm;

            ShowBusyIndicator();
            _flag = 0;
            if ($("#btnNext").attr('disabled') == 'disabled') {
                $("#btnNext").removeClass("btnEnabledNextCss");
                $("#btnNext").addClass("btnNextCss");
                HideBusyIndicator();
                e.preventDefault();
                return;
            }

            //check record is dirty
            var records = $("#grid").data("kendoGrid").dataSource.data();
            //Check the records
            if (isValid(records)) {
                //Loop through records
                recordsToSave = jQuery.grep(records, function (n, i) {
                    return (n.dirty == true);
                });
            }

            //validate loader
            if (recordsToSave != null && recordsToSave != undefined && recordsToSave[0] != undefined && recordsToSave.length > 0) {
                displayMessage = "There is some data still unsaved,Changing the page will cause loss of data!";

                isConfirm = confirm(displayMessage);
            }

            if (isConfirm != true && isConfirm != undefined) {
                HideBusyIndicator();
                return;
            }
            else {
                var resultLength = 0;

                $("#btnNext").removeAttr('disabled');
                $("#btnPrevious").removeAttr('disabled');
                $("#btnFirst").removeAttr('disabled');

                $("#btnNext").addClass("btnEnabledNextCss");

                pageNo += 1;

                pageCookiesPrevious = pageCookiesNext;
                if (pageCookiesPrevious != null && pageCookiesPrevious != undefined && pageCookiesPrevious != "") {
                    arrPreviousPages.push(pageCookiesPrevious);
                }

                currentPageCookie = pageCookiesNext;
                resultLength = Tribridge.ViewEditor.BindData(index, currentPageCookie);

                //Kadambari - 03-07-2015
                $("#lblPageNumber").text("Page" + " " + pageNo + " ");

                //if (lRecord < count) { //Kad
                fRecord = lRecord + 1;
                lRecord = resultLength < Tribridge.ViewEditor.PagingSize ? lRecord + resultLength : Tribridge.ViewEditor.PagingSize * pageNo;
                // }

                $("#lblTotalPage").text(fRecord + " - " + lRecord + " of " + count);

                $("#btnFirst").addClass("btnEnabledFirstCss");
                $("#btnPrevious").addClass("btnEnabledPreviousCss");

                if (fRecord <= 1) {
                    $("#btnFirst").attr('disabled', 'disabled');
                    $("#btnPrevious").attr('disabled', 'disabled');

                    $("#btnNext").removeClass("btnNextCss");
                    $("#btnFirst").removeClass("btnEnabledFirstCss");
                    $("#btnPrevious").removeClass("btnEnabledPreviousCss");

                    $("#btnNext").addClass("btnEnabledNextCss");
                    $("#btnFirst").addClass("btnFirstCss");
                    $("#btnPrevious").addClass("btnPreviousCss");
                    e.preventDefault();
                }
                else {
                    $("#btnFirst").removeAttr('disabled');
                    $("#btnPrevious").removeAttr('disabled');

                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");
                }

                // if (lRecord >= count) {
                if (moreRecords == false) {
                    $("#btnNext").attr('disabled', 'disabled');

                    $("#btnNext").removeClass("btnEnabledNextCss");
                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnNext").addClass("btnNextCss");
                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");
                }

                //show sorting icon
                //remove span tags before adding
                if (_sortField != null) {
                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                    }

                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                    }


                    if (descdir == false) {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-n");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                        }
                    }
                    else {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-s");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                        }
                    }
                }
            }
            //HideBusyIndicator();
        });

        //First previous button
        //  $("#btnFirst").click(function (e) {
        $("#btnFirst").unbind("click").click(function (e) {
            var displayMessage = "";
            var recordsToSave = new Array();
            var isConfirm;
            //show loading
            ShowBusyIndicator();
            _flag = 0;
            if ($("#btnFirst").attr('disabled') == 'disabled') {
                $("#btnFirst").addClass("btnFirstCss");
                $("#btnFirst").removeClass("btnEnabledFirstCss");
                HideBusyIndicator();
                e.preventDefault();
                return;
            }
            //check record is dirty
            var records = $("#grid").data("kendoGrid").dataSource.data();
            //Check the records
            if (isValid(records)) {
                //Loop through records
                recordsToSave = jQuery.grep(records, function (n, i) {
                    return (n.dirty == true);
                });
            }

            //validate loader
            if (recordsToSave != null && recordsToSave != undefined && recordsToSave[0] != undefined && recordsToSave.length > 0) {
                displayMessage = "There is some data still unsaved,Changing the page will cause loss of data!";

                isConfirm = confirm(displayMessage);
            }

            if (isConfirm != true && isConfirm != undefined) {
                HideBusyIndicator();
                return;
            }
            else {
                pageNo = 1;
                lRecord = 0;
                fRecord = 0;
                var resultLength = 0;

                $("#btnNext").removeAttr('disabled');
                $("#btnPrevious").removeAttr('disabled');
                $("#btnFirst").removeAttr('disabled');
                $("#btnFirst").addClass("btnEnabledFirstCss");

                currentPageCookie = "";
                resultLength = Tribridge.ViewEditor.BindData(index, currentPageCookie);

                //Kadambari - 03-07-2015
                $("#lblPageNumber").text("Page" + " " + pageNo + " ");

                //Fetch total count of records
                // count = FetchCount(viewInfo);

                //if (lRecord < count) { //Kad
                fRecord = lRecord + 1;
                lRecord = resultLength < Tribridge.ViewEditor.PagingSize ? lRecord + resultLength : Tribridge.ViewEditor.PagingSize * pageNo;
                // }

                if (pageNo = 1) {
                    fRecord = 1;
                    lRecord = 0;
                    lRecord = resultLength < Tribridge.ViewEditor.PagingSize ? lRecord + resultLength : Tribridge.ViewEditor.PagingSize * pageNo;
                }

                $("#lblTotalPage").text(fRecord + " - " + lRecord + " of " + count);

                $("#btnFirst").addClass("btnEnabledFirstCss");
                $("#btnPrevious").addClass("btnEnabledPreviousCss");

                if (fRecord <= 1) {
                    $("#btnFirst").attr('disabled', 'disabled');
                    $("#btnPrevious").attr('disabled', 'disabled');
                    $("#btnNext").removeClass("btnNextCss");
                    $("#btnFirst").removeClass("btnEnabledFirstCss");
                    $("#btnPrevious").removeClass("btnEnabledPreviousCss");

                    $("#btnNext").addClass("btnEnabledNextCss");
                    $("#btnFirst").addClass("btnFirstCss");
                    $("#btnPrevious").addClass("btnPreviousCss");
                    e.preventDefault();
                }
                else {
                    $("#btnFirst").removeAttr('disabled');
                    $("#btnPrevious").removeAttr('disabled');
                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");
                }

                //if (lRecord >= count) {
                if (moreRecords == false) {
                    $("#btnNext").attr('disabled', 'disabled');

                    $("#btnNext").removeClass("btnEnabledNextCss");
                    $("#btnFirst").removeClass("btnFirstCss");
                    $("#btnPrevious").removeClass("btnPreviousCss");

                    $("#btnNext").addClass("btnNextCss");
                    $("#btnFirst").addClass("btnEnabledFirstCss");
                    $("#btnPrevious").addClass("btnEnabledPreviousCss");

                    e.preventDefault();
                }

                //show sorting icon
                //remove span tags before adding
                // $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").remove();
                if (_sortField != null) {
                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                    }

                    if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                        $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                    }


                    if (descdir == false) {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-n");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                        }
                    }
                    else {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-s");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                        }
                    }
                }
            }
            //HideBusyIndicator();
        });

        $(".k-grid-exitgrid").click(function (e) {
            $("#homepageTableCell div", window.parent.document).first().show();
            //Refresh main grid
            refreshWindow();
            $("#homepageTableCell", window.parent.document).find("#ViewEditor").first().remove();
        });

    } catch (e) {
        throwError(e, functionName);
    }
};

//Kadambari
function refreshWindow() {
    if (parent.window.location.href.indexOf("#") == -1) {
        parent.window.location.href = parent.window.location.href + "#";
    }
    parent.window.location.href = parent.window.location.href.replace("#", "");
}

function getSchema(index) {
    var functionName = "getSchema";
    var schema = null;

    try {
        //Validate Created
        //Schema
        schema = {
            model: {
                id: index,
                fields: Tribridge.ViewEditor.Private.Model(index)//fields
            }//model
        }; //schema
    } catch (e) {
        throwError(e, functionName);
    }
    return schema;
}

//This function will return columns to be bind to PO Details Grid
function getGridColumns(index) {
    var functionName = "getGridColumns";
    var columns = [];
    try {
        //Switch through different statuses
        columns = Tribridge.ViewEditor.Private.Columns(index)
    }
    catch (e) {
        throwError(e, functionName);
    }
    return columns;
}


Tribridge.ViewEditor.BindData = function (index, pageCookies) {
    var functionName = "Tribridge.ViewEditor.BindData";
    var viewInfo = Tribridge.ViewEditor.CustomViews[index];
    var hasStatecode = false;
    var fetchXML;

    try {

        ShowBusyIndicator();

        if (viewInfo != null) {
            if (viewInfo.SortFetch != null) {
                fetchXML = viewInfo.SortFetch;
                _flag = 1;
            }
            else {
                fetchXML = viewInfo.FetchXml; //viewInfo.FetchXml.replace("mapping='logical'", "mapping='logical' distinct='false' count='" + Tribridge.ViewEditor.PagingSize + "' page='" + pageNo + "' paging-cookie='" + pagingCookie + "'");
            }

            // Parse the fetchquery as xml
            var parsedFetch = Tribridge.Helper.ParseXml(fetchXML);

            // Fetch node
            var fetchNode = parsedFetch.getElementsByTagName("fetch")[0];

            // Entity node
            var entityNode = fetchNode.getElementsByTagName("entity")[0];

            // Attributes node
            var x = entityNode.getElementsByTagName("attribute");

            var oSerializer = new XMLSerializer();

            if (viewInfo.stateCodeExists == true) {
                // Check in attibutes if already "statecode" field exists
                for (i = 0; i < x.length; i++) {
                    var xmlString;
                    if (x[i].xml != undefined && x[i].xml != "undefined") {
                        // For IE browser
                        xmlString = x[i].xml;
                    }
                    else {
                        // For browsers other than IE
                        xmlString = oSerializer.serializeToString(x[i]);
                    }
                    var ind = xmlString.indexOf("statecode");
                    if (ind > -1) {
                        hasStatecode = true;
                        break;
                    }
                }

                // If "statecode" field doesnot exist then add the "statecode" field to get it in fetch result
                if (!hasStatecode) {
                    var newel = parsedFetch.createElement("attribute");

                    var nameAtt = parsedFetch.createAttribute("name");
                    nameAtt.nodeValue = "statecode";

                    newel.setAttributeNode(nameAtt);
                    entityNode.appendChild(newel);

                    // Add the statecode attribute to fetchquery
                    if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
                        // For IE browser
                        fetchXML = fetchNode.xml.replace(/"/g, "'");
                    }
                    else {
                        // for other browsers
                        fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
                    }
                }
            }
            if (_isSubGrid) {
                // add the associated entity filter
                var filterElement;
                var filterAtt
                // Filter node
                if (parsedFetch.getElementsByTagName("filter") != null && parsedFetch.getElementsByTagName("filter") != undefined && parsedFetch.getElementsByTagName("filter")[0] != undefined) {
                    filterElement = parsedFetch.getElementsByTagName("filter")[0];
                }
                else {
                    var filterElement = parsedFetch.createElement("filter");
                    var filterAtt = parsedFetch.createAttribute("type");
                    filterAtt.nodeValue = "and";
                    filterElement.setAttributeNode(filterAtt);
                }


                // Condition node
                var condnElement = parsedFetch.createElement("condition");
                var condnAtt1 = parsedFetch.createAttribute("attribute");
                condnAtt1.nodeValue = _primaryentityattribute.toLowerCase();
                condnElement.setAttributeNode(condnAtt1);

                var condnAtt2 = parsedFetch.createAttribute("operator");
                condnAtt2.nodeValue = "eq";
                condnElement.setAttributeNode(condnAtt2);

                var condnAtt3 = parsedFetch.createAttribute("value");
                condnAtt3.nodeValue = _associatedEntityId;
                condnElement.setAttributeNode(condnAtt3);

                // Add condition to filter node
                filterElement.appendChild(condnElement);

                // add filter to entity
                entityNode.appendChild(filterElement);

                // Add the statecode attribute to fetchquery
                if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
                    // For IE browser
                    fetchXML = fetchNode.xml.replace(/"/g, "'");
                }
                else {
                    // for other browsers
                    fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
                }
            }

            // Excute the fetch query and get the xml result.     fetchXml, pageNumber,pageCount, pageCookie, async, callback       
            var resultData = XrmServiceToolkit.Soap.FetchNext(fetchXML, pageNo, Tribridge.ViewEditor.PagingSize, pageCookies);

            if (resultData != null && resultData != undefined) {
                if (resultData.fetchMoreRecords != null && resultData.fetchMoreRecords != undefined) {
                    moreRecords = resultData.fetchMoreRecords;
                    pageCookiesNext = resultData.fetchPageCookie;
                }
                if (resultData.fetchResult != null && resultData.fetchResult != undefined && resultData.fetchResult.length > 0) {
                    populateGrid(resultData.fetchResult, index);
                }
                else {

                    // empty grid
                    if ($("#grid").data("kendoGrid") != undefined) {
                        bindGrid([]);
                        $("#grid").data("kendoGrid").dataSource.sort({});
                        $("#grid").data("kendoGrid").dataSource.page(1);
                        $("#grid").data("kendoGrid").refresh();
                    }
                }
            }

            //Kadambari
            count = FetchCount(viewInfo, fetchXML);

            SetPagingCount(count);
        }
        HideLoading();
        showLoader(false);
        HideBusyIndicator();
    } catch (e) {
        throwError(e, functionName);
    }
    return resultData.fetchResult.length;
};

// Populate Grid with data
function populateGrid(resultData, index) {
    var functionName = "populateGrid";
    try {
        // get grid columns
        var mapping = getGridColumns(index);

        //bind grid with data
        OnQueryAllComplete(resultData, mapping);
    } catch (e) {
        throwError(e, functionName);
    }
}

// parse data and bind it to grid
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
    } catch (e) {
        throwError(e, functionName);
    }
}

/*function to convert results into odata format*/
function getDataInODATAFormat(result, schemaCollection) {
    var functName = "getDataInODATAFormat";
    var field;
    try {
        var entityCollection = [];
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];
        //Check if result is null
        if (result != null && result != 'undefined') {
            for (var i = 0; i < result.length; i++) {
                entityCollection[i] = {};
                //Check for attributes
                if (result[i].attributes != null && result[i].attributes != 'undefined') {

                    // Add the value of statecode to the dummy IsActiveRecord column
                    if (result[i].attributes["statecode"] != null && result[i].attributes["statecode"] != undefined && result[i].attributes["statecode"] != 'undefined') {
                        entityCollection[i]["_IsActiveRecord"] = result[i].attributes["statecode"].value;
                    }

                    //Check if schemaCollection have atrribute
                    for (var j = 0; j < schemaCollection.length; j++) {

                        var attri = "";

                        attri = schemaCollection[j].field;

                        if (attri != null && attri != undefined && attri != "undefined") {
                            if (result[i].attributes[attri.toLowerCase()] != undefined && attri != "undefined") {
                                field = result[i].attributes[attri.toLowerCase()];
                            }
                            else {
                                field = schemaCollection[j];
                            }
                        }

                        if (field != 'undefined' && field != undefined) {
                            //Check for type and then add it according to format
                            if (field.type != 'undefined' && field.type != undefined) {
                                switch (field.type.toLowerCase()) {

                                    case "OptionSetValue".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = { Value: field.value, FormattedValue: field.formattedValue };
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = { Value: null, FormattedValue: null };
                                        }
                                        break;
                                    case "EntityReference".toLowerCase():
                                        if (field.id != undefined && field.id != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = { Id: field.id, Name: field.name, LogicalName: field.logicalName };
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = { Id: null, Name: null, LogicalName: null };
                                        }
                                        break;
                                    case "EntityCollection".toLowerCase():
                                        //Do nothing
                                        break;

                                    case "Money".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = { Value: (field.value) };
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = { Value: (0) };
                                        }
                                        break;
                                    case "decimal".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = parseFloat(field.value).toFixed(2).toString();
                                            // entityCollection[i][schemaCollection[j].field] = parseFloat(field.value).toFixed(2);
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = parseFloat(0).toFixed(2).toString();
                                        }
                                        break;
                                    case "int".toLowerCase():
                                    case "integer".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = field.value.toString();
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = null;
                                        }
                                        break;
                                    case "double".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = field.value.toString();
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = null;
                                        }
                                        break;
                                    case "datetime".toLowerCase():
                                        if (field.value != undefined && field.value != "undefined") {
                                            var isFilterApplied = false;
                                            for (p = 0; p < viewInfo["Columns"].length; p++) {
                                                if (viewInfo["Columns"][p]["Name"] == schemaCollection[j].field) {
                                                    isFilterApplied = viewInfo["Columns"][p]["Filterable"];
                                                    break;
                                                }
                                            }

                                            if (isFilterApplied) { // 0810
                                                // then bind HH:MM:SS = 0 else filtering wont work
                                                var arr = field.formattedValue.split(' ');
                                                var dd = new Date(arr[0]);

                                                entityCollection[i][schemaCollection[j].field] = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), 0, 0, 0);
                                            }
                                            else {
                                                // then bind the actual time part of datetime
                                                var arr = field.formattedValue.split('T');
                                                if (arr.length > 1) {
                                                    var time = arr[1].split(':');
                                                    entityCollection[i][schemaCollection[j].field] = new Date(arr[0] + ", " + time[0] + ":" + time[1] + ":" + "00");
                                                }
                                                else {
                                                    entityCollection[i][schemaCollection[j].field] = new Date(arr[0]);
                                                }
                                            }
                                        }
                                        break;
                                    case "image".toLowerCase():
                                        entityCollection[i][schemaCollection[j].field] = { isValid: true, errorMsg: "", isNewRecord: false };
                                        break;
                                    default:
                                        if (field.value != undefined && field.value != "undefined") {
                                            entityCollection[i][schemaCollection[j].field] = field.value;
                                        }
                                        else {
                                            entityCollection[i][schemaCollection[j].field] = null;
                                        }
                                        break;

                                }
                            }
                        }
                    }
                }
            }
        }

        // check if any unsaved new records are present
        if (Tribridge.ViewEditor.ErrorRecords != null && Tribridge.ViewEditor.ErrorRecords.length > 0) {
            // Add the unsaved new records to the entity collection
            for (var i = 0; i < Tribridge.ViewEditor.ErrorRecords.length; i++) {
                //Check for new records
                if (Tribridge.ViewEditor.ErrorRecords[i].isNewRecord) {
                    //Check if schemaCollection have atrribute
                    var obj = {};
                    for (var j = 0; j < schemaCollection.length; j++) {
                        var attri = "";
                        attri = schemaCollection[j].field;
                        if (Tribridge.ViewEditor.ErrorRecords[i].record[attri] != null && Tribridge.ViewEditor.ErrorRecords[i].record[attri] != undefined) {
                            obj[attri] = Tribridge.ViewEditor.ErrorRecords[i].record[attri];
                        }
                    }
                    // Also add the colSaveVal field to bind the err
                    obj["colSaveVal"] = { isValid: false, errorMsg: Tribridge.ViewEditor.ErrorRecords[i].error, isNewRecord: true };
                    entityCollection.splice(0, 0, obj);
                }
            }
        }
        return entityCollection;
    } catch (e) {
        throwError(functName, e);
    }
}

// bind the data to grid
function bindGrid(dataCollection) {
    var functionName = "bindData";
    try {
        if ($("#grid").data("kendoGrid") != undefined) {
            $("#grid").data("kendoGrid").dataSource.data([]);
            $("#grid").data("kendoGrid").dataSource.page(1);

            $("#grid").data("kendoGrid").dataSource.data(dataCollection);

            // set the grid height as per screen
            var windowHeight = screen.height;
            $("#grid").css("height", (windowHeight - 220) + "px");
            $(".k-grid-content").css("height", (windowHeight - 280) + "px");

            // make the grid content area visible
            $("#gridContent").show();
        }
    } catch (e) {
        //filtering is not working for the template fields, it gives toLowerCase is not a function error so we will ignore this erro
        if (e.message.search("toLowerCase is not a function") == -1) {
            throwError(e, functionName);
        }
    }
}

function parseQueryString(qstr) {
    var functionName = "parseQueryString";
    try {
        var query = {};
        var qString = qstr.split('&');
        for (var i in qString) {
            var keyValPair = qString[i].split('=');
            query[decodeURIComponent(keyValPair[0])] = decodeURIComponent(keyValPair[1]);
        }
    }
    catch (e) {
        // throw error
        throwError(e, functionName);
    }
    return query;
}

Tribridge.ViewEditor.Private.SaveData = function (index) {
    var functionName = "Tribridge.ViewEditor.Private.SaveData";
    var recordsToSave = new Array();
    var continueSave = true;
    try {
        debugger;
        // Initialize the records to save and number of records processed count
        Tribridge.ViewEditor.RecordsToSave_Count = 0;
        Tribridge.ViewEditor.RecordsProcessed_Count = 0;
        // Empty the error records
        Tribridge.ViewEditor.ErrorRecords = [];

        //Validate
        if (isValid($("#grid").data("kendoGrid")) && isValid($("#grid").data("kendoGrid").dataSource) && isValid($("#grid").data("kendoGrid").dataSource.data())) {
            //Get the datasource
            var records = $("#grid").data("kendoGrid").dataSource.data();
            //Check the records
            if (isValid(records)) {
                //Loop through records
                recordsToSave = jQuery.grep(records, function (n, i) {
                    return (n.dirty == true);
                });

                Tribridge.ViewEditor.RecordsToSave_Count = recordsToSave.length;

                //Loop through records for which Records will be Updated
                for (var i in recordsToSave) {
                    if (continueSave) {
                        continueSave = Tribridge.OData.SaveBatch(recordsToSave[i], index, pageCookiesPrevious, _entityName, _isSubGrid, _associatedEntityId, _primaryentityattribute, _associatedEntity);
                    }
                    else {
                        break;
                    }//Kadambari 08-07-2015
                }
                isSaveFlag = 1;
            }

            //show sorting icon
            if (_sortField != null) {
                if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-s") == true) {
                    // $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-s]").remove();
                    $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find(".k-i-arrow-s").remove();
                }

                if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span").hasClass("k-icon k-i-arrow-n") == true) {
                    //$("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span[class=k-icon k-i-arrow-n]").remove();
                    $("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find(".k-i-arrow-n").remove();
                }

                if (descdir != undefined) {
                    if (descdir == false) {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-n");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "asc");
                        }
                    }
                    else {
                        if (isValid($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").find("span"))) {
                            var newdiv2 = document.createElement("span")
                            if ($("#grid thead").find("th[data-field=" + _sortField + "]").find("a").hasClass("k-link") == true) {
                                var newHtml = $("#grid thead").find("th[data-field=" + _sortField + "]").find("a[class=k-link]").append(newdiv2);
                            }
                            newHtml.find("span").addClass("k-icon k-i-arrow-s");
                            $("#grid thead").find("th[data-field=" + _sortField + "]").attr("data-dir", "desc");
                        }
                    }
                }
            }
        }

    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.FindView = function (index) {
    var functionName = "Tribridge.ViewEditor.Private.FindView";
    try {
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];
        Tribridge.OData.GetQueryView(viewInfo.Entity, viewInfo.Query, Tribridge.ViewEditor.CB.ParseViewMetadata, null, index);
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.ViewEditor.Private.Columns = function (index) {
    var functionName = "Tribridge.ViewEditor.Private.Columns";
    var viewInfo = Tribridge.ViewEditor.CustomViews[index];

    var retArr = [];
    var obj = {};

    try {
        for (var x = 0; x < viewInfo.Columns.length; x++) {
            var obj = {};
            obj["field"] = viewInfo.Columns[x].Name;//Tribridge.ViewEditor.Private.GetColumnField(viewInfo.Columns[x].Name, viewInfo.Columns[x].Type);
            obj["type"] = viewInfo.Columns[x].Type;
            // obj["filterable"] = true;
            //obj["sortable"] = true;
            //obj["title"] = viewInfo.Columns[x].Name;
            obj["title"] = viewInfo.Columns[x].DisplayName;
            obj["width"] = parseInt(viewInfo.Columns[x].Width);

            // If filtering is enabled then give filter
            if (viewInfo.Columns[x].Filterable) {
                //obj["filterable"] = {
                //    cell: {
                //        showOperators: true
                //    }
                //}
                filterable: true
            }
            else {
                obj["filterable"] = false;
            }

            // Check if editor needed
            var editor = Tribridge.ViewEditor.Private.GetEditor(obj["field"], viewInfo.Columns[x].Type);
            if (editor != null) {
                obj["editor"] = editor;

                switch (viewInfo.Columns[x].Type) {
                    case "Picklist":
                    case "Status":
                    case "State":
                        obj["template"] = '#=getLabelOfOptionSet(' + index + ',"' + viewInfo.Columns[x].Attribute + '", (typeof ' + viewInfo.Columns[x].Name + '  ===  "undefined") ? "" : ' + obj["field"] + ' )#';
                        //obj["filterable"] = {    // here is your specific filter!
                        //    extra: false,
                        //    field: viewInfo.Columns[x].Name,
                        //    type: viewInfo.Columns[x].Type
                        //}
                        //obj["sortable"] = false;
                        obj["filterable"] = false;
                        break;

                    case "Lookup":
                    case "Customer":
                    case "Owner":
                        obj["template"] = '#=getLookupName((typeof ' + viewInfo.Columns[x].Name + '  ===  "undefined") ? "" : ' + obj["field"] + ' )#';
                        //obj["sortable"] = false;
                        obj["filterable"] = false;
                        break;

                    case "Money":
                        obj["template"] = '#= moneyValue(' + obj["field"] + ') #';
                        //obj["sortable"] = false;
                        obj["filterable"] = false;
                        //obj["filterable"] = {    // here is your specific filter!
                        //    extra: false,
                        //    field: viewInfo.Columns[x].Name,
                        //    type: viewInfo.Columns[x].Type
                        //}
                        break;

                    case "Double":
                    case "Decimal":
                        //case "Integer":
                        obj["template"] = '#= decimalValue(' + obj["field"] + ') #';

                        if (viewInfo.Columns[x].Filterable) {

                            obj["filterable"] = {    // here is your specific filter!
                                extra: false,
                                field: viewInfo.Columns[x].Name,
                                type: viewInfo.Columns[x].Type,
                                operators: {
                                    string: {
                                        eq: "Is equal to",
                                        gt: "Is greater",
                                        gte: "Is greater or equal to",
                                        lt: "Is less",
                                        lte: "Is less or equal to"
                                    }
                                }
                            }
                        }
                        else {
                            //obj["sortable"] = true;
                            obj["filterable"] = false;
                        }
                        break;

                    case "Integer":
                        obj["template"] = '#= integerValue(' + obj["field"] + ') #';

                        if (viewInfo.Columns[x].Filterable) {

                            obj["filterable"] = {    // here is your specific filter!
                                extra: false,
                                field: viewInfo.Columns[x].Name,
                                type: viewInfo.Columns[x].Type,
                                operators: {
                                    string: {
                                        eq: "Is equal to",
                                        gt: "Is greater",
                                        gte: "Is greater or equal to",
                                        lt: "Is less",
                                        lte: "Is less or equal to"
                                    }
                                }
                            }
                        }
                        else {
                            //obj["sortable"] = true;
                            obj["filterable"] = false;
                        }
                        break;
                }
            }

            //need to handle date display as mm/dd/yyyy
            if (viewInfo.Columns[x].Type.toLowerCase() == "DateTime".toLowerCase()) {
                var isDateTime = false;
                for (var i = 0; i < viewInfo.DateTimeFormats.length; i++) {
                    if (viewInfo.DateTimeFormats[i]["AttributeName"] == viewInfo.Columns[x]["Attribute"]) {
                        if (viewInfo.DateTimeFormats[i]["format"] == "DateOnly")
                            isDateTime = false;
                        else
                            isDateTime = true;
                        break;
                    }
                }

                if (!isDateTime) {
                    //obj["template"] = '#= (typeof ' + viewInfo.Columns[x].Name + '  ===  "undefined" || ' + viewInfo.Columns[x].Name + ' == null) ? " " : kendo.format("{0:MM/dd/yyyy}",kendo.parseDate(' + obj["field"] + '))#';
                    obj["format"] = "{0:MM/dd/yyyy}";
                    obj["editor"] = dateEditor;
                }
                else {
                    //obj["format"] = "{0:dd-MMM-yyyy hh:mm:ss tt}";
                    //obj["parseFormats"] = ["MM/dd/yyyy h:mm:ss"];
                    obj["format"] = "{0:MM/dd/yyyy hh:mm:ss tt}";
                    obj["editor"] = dateTimeEditor;
                }

                if (viewInfo.Columns[x].Filterable) {
                    obj["filterable"] = {    // here is your specific filter!
                        ui: "datepicker",
                        operators: {
                            string: {
                                eq: "Is equal to",
                                gte: "Is greater or equal to",
                                lte: "Is less or equal to"
                            }
                        }
                    }
                }
                else {
                    //obj["sortable"] = true;
                    obj["filterable"] = false;
                }
            }

            if (viewInfo.Columns[x].Type == "Boolean") {
                obj["filterable"] = false;
                //If readonly then set it as disabled
                var editable = true;
                if ($.inArray(viewInfo.Columns[x].Name.toLowerCase(), viewInfo.Readonly) > -1) {
                    editable = false;
                }
                obj["template"] = '# var html = createCheckBox(' + obj["field"] + ',\'' + viewInfo.Columns[x].Name + '\',' + editable + '); ##= html#';
                //obj["sortable"] = true;
                // obj["filterable"] = false;
            }

            if (viewInfo.Columns[x].Type == "Image") {
                obj["title"] = viewInfo.Columns[x].DisplayName;

                obj["template"] = '#=IsValidRecord(' + obj["field"] + ')#';
                obj["sortable"] = false;
            }

            retArr.push(obj);
        }

        // include dummy column for saving if record is active/inactive)
        retArr.push({ field: "_IsActiveRecord", filterable: false, title: "_IsActiveRecord", width: 0, hidden: true });

        // include the ID (guid) column too.
        retArr.push({ field: viewInfo.PrimaryAttribute, filterable: false, title: viewInfo.PrimaryAttribute, width: 0, hidden: true });

        return retArr;
    } catch (e) {
        throwError(e, functionName);
    }
};

// set the valid/invalid row image
function IsValidRecord(imageField) {
    var functionName = "IsValidRecord";
    try {
        if (imageField.isValid) {
            return "<img src='TransparentImage.png' title='' />";
        }
        else
            return "<img src='ErrorIcon.png' title='" + imageField.errorMsg.replace(/'/g, '') + "'/>";
        //return "<img src='ErrorIcon.png'/> <div id='errorMessage'>" + imageField.errorMsg + "</div>";
    } catch (e) {
        throwError(e, functionName);
    }
}

//get the money field value
function moneyValue(moneyField) {
    var functionName = "moneyValue";
    var money = null;
    try {
        if (isValid(moneyField) && isValid(moneyField.Value)) {
            //money = kendo.format("{0:c2}", parseFloat(moneyField.Value));
            money = moneyField.Value;
        } else {
            money = kendo.format("{0:c2}", parseFloat("0.00"));
        }
    } catch (e) {
        throwError(e, functionName);
    }
    return money;
}

//get decimal field value
function decimalValue(decimalField) {
    var functionName = "decimalValue";
    var deci = null;
    try {
        if (isValid(decimalField)) {
            //deci = kendo.format("{0:0.00}", parseFloat(decimalField));
            deci = decimalField;
        } else {
            deci = kendo.format("{0:0.00}", parseFloat("0.00"));
        }
    } catch (e) {
        throwError(e, functionName);
    }
    return deci;
}

//get decimal field value
function integerValue(intField) {
    var functionName = "integerValue";
    var intgr = null;
    try {
        if (isValid(intField)) {
            //deci = kendo.format("{0:0.00}", parseFloat(integerValue));
            intgr = intField;
        } else {
            intgr = "";//kendo.format("{0:0.00}", parseFloat("0.00"));
        }
    } catch (e) {
        throwError(e, functionName);
    }
    return intgr;
}

//function to get the lookup name
function getLookupName(value) {
    var lookupName = "";
    var functionName = "getLookupName";
    try {
        if (isValid(value) && isValid(value.Name)) {
            lookupName = value.Name;
        }
    } catch (e) {
        throwError(e, functionName);
    }
    return lookupName;
}

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

//This function will return label of option set
function getLabelOfOptionSet(index, attribute, value) {
    var functionName = "getLabelOfOptionSet";
    var label = "";
    try {
        if (typeof value === "undefined")
            alert('undefined');
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];
        var label = "";

        if (value != null && !(value === undefined)) {
            var optionSetVal;
            if (value.Value != null && !(value.Value === undefined)) {
                optionSetVal = value.Value;
            }
            else {
                optionSetVal = value;
            }

            // Search for the label
            for (var z = 0; z < viewInfo.OptionSets[attribute].length; z++) {
                if (viewInfo.OptionSets[attribute][z].Value == optionSetVal) {
                    return viewInfo.OptionSets[attribute][z].Label;
                }
            }
        }

        return label;
    }
    catch (e) {
        throwError(e, functionName);
    }
}

//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        HideLoading();
        HideBusyIndicator();
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
    } catch (e) {
        alert(functionName + "Error: " + (error.message || error.description));
    }
}

Tribridge.ViewEditor.Private.Model = function (index) {
    var functionName = "Tribridge.ViewEditor.Private.Model";

    var viewInfo = Tribridge.ViewEditor.CustomViews[index];
    entityLogicalName = viewInfo.Entity;
    var maxValue;
    var minValue;
    var precision;
    var requiredLevel;

    try {
        var retObj = {};
        for (var x = 0; x < viewInfo.Columns.length; x++) {

            // Readonly?
            var editable = true;
            if ($.inArray(viewInfo.Columns[x].Name.toLowerCase(), viewInfo.Readonly) > -1) {
                editable = false;
            }

            //make all the following fields readonly
            // Owner,Uniqueidentifier,Status,State,Image,modifiedon,createdon
            if (viewInfo.Columns[x].Type == 'Owner' || viewInfo.Columns[x].Type == 'Uniqueidentifier' || viewInfo.Columns[x].Type == 'Status' || viewInfo.Columns[x].Type == 'State' || viewInfo.Columns[x].Type == 'Image' || viewInfo.Columns[x].Attribute == 'modifiedon' || viewInfo.Columns[x].Attribute == 'createdon') {
                editable = false;
            }

            // make editable false for datetime which have filtering on
            if (viewInfo.Columns[x].Type == "DateTime" && viewInfo.Columns[x].Filterable) {
                editable = false;
            }

            // Required?
            var required = false;
            if ($.inArray(viewInfo.Columns[x].Name.toLowerCase(), viewInfo.Required) > -1) {
                required = true;
            }

            var options = null;
            if (viewInfo.OptionSets != null && viewInfo.OptionSets.hasOwnProperty(viewInfo.Columns[x].Attribute)) {
                options = viewInfo.OptionSets[viewInfo.Columns[x].Attribute];
            }

            var name = viewInfo.Columns[x].Name;//Tribridge.ViewEditor.Private.GetColumnField(viewInfo.Columns[x].Name, viewInfo.Columns[x].Type);

            // Retrieve attributes meta data
            if (viewInfo.Columns[x].Attribute != "colSaveVal")
                var attriMetadata = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(viewInfo.Entity, viewInfo.Columns[x].Attribute, true);


            if (attriMetadata != null && attriMetadata != undefined && attriMetadata != "undefined") {
                if (attriMetadata[0].MinValue != undefined) {
                    minValue = attriMetadata[0].MinValue;
                }
                if (attriMetadata[0].MaxValue != undefined) {
                    maxValue = attriMetadata[0].MaxValue;
                }
                if (attriMetadata[0].Precision != undefined) {
                    precision = attriMetadata[0].Precision;
                }
                //if (attriMetadata[0].RequiredLevel != undefined) {                
                //    if (attriMetadata[0].RequiredLevel.Value == "ApplicationRequired") {
                //        required = true;
                //    }
                //    else {
                //        required = requiredLevel;
                //    }
                //}
            }

            switch (viewInfo.Columns[x].Type) {
                case "Boolean":
                    retObj[name] = { editable: false, options: options }; //validation: { required: required },
                    break;

                case "DateTime":
                    retObj[name] = { editable: editable, type: Tribridge.ViewEditor.Private.GetModelType(viewInfo.Columns[x].Type), options: options }; // validation: { required: required },
                    break;

                case 'BigInt':
                case 'Integer':
                    retObj[name] = { editable: editable, validation: { min: minValue, max: maxValue }, options: options }; // required: required
                    break;

                case 'Double':
                case 'Decimal':
                case 'Money':
                    retObj[name] = { editable: editable, validation: { min: minValue, max: maxValue, decimals: precision }, options: options }; // required: required,
                    break;
                default:
                    retObj[name] = { editable: editable, options: options }; // validation: { required: required },
                    break;

            }
        }
        return retObj;
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.ViewEditor.Private.GetColumnField = function (field, crmtype) {
    var functionName = "Tribridge.ViewEditor.Private.GetColumnField";
    try {
        switch (crmtype) {
            case 'Status':
            case 'Picklist':
            case 'Money':
            case 'Owner':
            case 'Lookup':
            case 'Customer':
            case 'Uniqueidentifier':
            case 'Double':
            case 'BigInt':
            case 'Decimal':
            case 'Integer':
            case 'DateTime':
            case 'Boolean':
            case 'EntityName':
            case 'Memo':
            case 'String':
            case 'Virtual':
            case 'State':
            default:
                return field;
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.GetModelType = function (crmtype) {
    var functionName = "Tribridge.ViewEditor.Private.GetModelType";

    try {
        switch (crmtype) {
            case 'Double':
            case 'BigInt':
            case 'Integer':
            case 'Decimal':
                return 'number';

            case 'DateTime':
                return 'date';

            case 'Boolean':
                return 'boolean';

            case 'Customer':
            case 'Uniqueidentifier':
            case 'EntityName':
            case 'Memo':
            case 'String':
            case 'Virtual':
                return 'string';

            default:
                return 'string';
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.GetEditor = function (crmfield, crmtype) {
    var functionName = "Tribridge.ViewEditor.Private.GetEditor";
    try {
        switch (crmtype) {
            case 'Lookup':
            case 'Owner':
            case 'Customer':
                return Tribridge.ViewEditor.Private.LookupEditor;
            case 'Picklist':
            case 'Status':
            case 'State':
                return Tribridge.ViewEditor.Private.DropDownEditor;
            case 'Money':
                return Tribridge.ViewEditor.Private.moneyEditor;
            case 'Double':
            case 'Decimal':
                return Tribridge.ViewEditor.Private.decimalEditor;
            case 'BigInt':
            case 'Integer':
                return Tribridge.ViewEditor.Private.numberEditor;
            case 'Boolean':
                //return Tribridge.ViewEditor.Private.twoOptionEditor;
            case 'DateTime':
                return dateTimeEditor;
            case 'Uniqueidentifier':
            case 'EntityName':
            case 'Memo':
            case 'String':
            case 'Virtual':
            default:
                return null;
        }
    } catch (e) {
        throwError(e, functionName);
    }
};

function dateTimeEditor(container, options) {
    $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
            .appendTo(container)
            .kendoDateTimePicker({});
}

function dateEditor(container, options) {
    $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
            .appendTo(container)
            .kendoDatePicker({});
}


//Function to Create checkbox
function createCheckBox(fieldValue, fieldName, editable) {
    var functionName = "createCheckBox";
    var clas = "";
    var id = "";
    var html = "";
    var onClicked = "";
    try {
        //Set the Class and Id
        clas = fieldName;
        id = fieldName;

        onClicked = "changeState(this);";

        if (fieldValue) {
            if (editable) {
                html = "<input type='checkbox' class='" + clas + "' id='" + id + "' checked='checked' onClick='" + onClicked + "'/>";
            }
            else {
                html = "<input type='checkbox' disabled = 'disabled' class='" + clas + "' id='" + id + "' checked='checked' onClick='" + onClicked + "'/>";
            }
        }
        else {
            if (editable) {
                html = "<input type='checkbox' class='" + clas + "' id='" + id + "' onClick='" + onClicked + "'/>";
            }
            else {
                html = "<input type='checkbox' disabled = 'disabled' class='" + clas + "' id='" + id + "' onClick='" + onClicked + "'/>";
            }
        }

    } catch (e) {
        throwError(e, functionName);
    }

    return html;
}

//Function to change the state of the checkbox & field
function changeState(control) {
    var functionName = "changeState";
    try {
        try {
            var newValue = null;

            entityGrid = $("#grid").data("kendoGrid");

            var selectedRow = $(control).closest("tr");
            var selectedRecord = entityGrid.dataItem(selectedRow);

            if (!(selectedRow.hasClass("InActiveRow") && _disableInactiveRecords)) {
                // can edit
                selectedRecord[control.id] = control.checked;
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
            else {
                // set the check box to its original state
                control.checked = !control.checked;
            }
        }
        catch (e) {
            Xrm.Utility.alertDialog("Please insert correct value for " + numberField);
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

// Template for the DropDownEditor
// receives the int value for the picklist item just selected (the new value)
Tribridge.ViewEditor.Private.DropDownLabel = function (index, attribute, value) {
    var functionName = "Tribridge.ViewEditor.Private.DropDownLabel";
    try {

        if (typeof value === "undefined")
            alert('undefined');
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];
        var label = "";

        if (value != null && value > 0 && !(value === undefined)) {
            // Search for the label
            for (var z = 0; z < viewInfo.OptionSets[attribute].length; z++) {
                if (viewInfo.OptionSets[attribute][z].Value == value) {
                    return viewInfo.OptionSets[attribute][z].Label;
                }
            }
        }

        return label;
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.ViewEditor.Private.DropDownEditor = function (container, options) {
    var functionName = "Tribridge.ViewEditor.Private.DropDownEditor";
    try {
        optionSetField = options.field;
        optionIndex = options.model.id;

        //var optionsList = [];// = [{ Label: "Please select ...", Value: 0 }];
        var optionsList = [{ Name: "Please select ...", Value: -1 }];
        if (options.model.fields[options.field].options != 'undefined' && options.model.fields[options.field].options != null) {
            //optionsList = optionsList.concat(options.model.fields[options.field].options);
            for (var i = 0; i < options.model.fields[options.field].options.length; i++) {
                optionsList.push({ Name: options.model.fields[options.field].options[i].Label, Value: options.model.fields[options.field].options[i].Value });
            }
        }

        //$('<input id="pickListField" required data-text-field="Name" data-value-field="Value" data-bind="value:' + options.field + '"/>')
        //     .appendTo(container)
        //     .kendoDropDownList({
        //         autoBind: false,
        //         dataSource: optionsList,
        //         dataTextField: "Name",
        //         //optionLabel: {
        //         //    Name: "Select ...",
        //         //    Value: ""
        //         //}
        //     });

        $('<input id="pickListField" required data-text-field="Name" data-value-field="Value" data-bind="value:' + options.field + '"/>')
   .appendTo(container)
   .kendoDropDownList({
       dataTextField: "Name",
       dataValueField: "Value",
       dataSource: optionsList
       //valuePrimitive: true //needs to be set or else changes to initially null values won't stick - lpa - 2015-03-19
   });

        $("#pickListField").change(function () {
            var newValue = null;
            var formattedValue = $(this).val();
            var viewInfo = Tribridge.ViewEditor.CustomViews[optionIndex];


            if (formattedValue != null && !(formattedValue === undefined)) {


                // Search for the label
                for (var z = 0; z < viewInfo.OptionSets[optionSetField.toLowerCase()].length; z++) {
                    if (viewInfo.OptionSets[optionSetField.toLowerCase()][z].Value == formattedValue) {
                        newValue = viewInfo.OptionSets[optionSetField.toLowerCase()][z].Label;
                        break;
                    }
                }

                entityGrid = $("#grid").data("kendoGrid");

                //var selectedRow = entityGrid.select();
                var selectedRow = $(this).closest("tr");
                var selectedRecord = entityGrid.dataItem(selectedRow);

                //selectedRecord[optionSetField].Value = { Value: formattedValue };
                selectedRecord[optionSetField] = { Value: formattedValue };
                selectedRecord.dirty = true;

                options.model.set(optionSetField, { Value: formattedValue });
                options.model.dirty = true;

                // Set the red update triangle
                if (!$(this).closest("td").hasClass("k-dirty-cell")) {
                    $(this).closest("td").append('<span class="k-dirty"></span>');
                    $(this).closest("td").addClass('k-dirty-cell');
                }
            }
        });

    } catch (e) {
        throwError(e, functionName);
    }
};

//function is used to work with money editor
Tribridge.ViewEditor.Private.moneyEditor = function (container, options) {
    var functionName = "Tribridge.ViewEditor.Private.moneyEditor";
    var entityGrid = "";
    var maxValue;
    var minValue;
    var precision = 2;

    try {
        templateFieldValues = "";
        try {
            moneyField = options.field;
            templateFieldValues = options.model[moneyField].Value;
        }
        catch (e) {
            templateFieldValues = 0;
        }

        //removes $ and ,
        var attriMetadata = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(entityLogicalName, moneyField.toLowerCase(), true);
        if (attriMetadata != null && attriMetadata != undefined && attriMetadata != "undefined") {
            if (attriMetadata[0].MinValue != undefined) {
                minValue = attriMetadata[0].MinValue;
            }
            if (attriMetadata[0].MaxValue != undefined) {
                maxValue = attriMetadata[0].MaxValue;
            }
            if (attriMetadata[0].Precision != undefined) {
                precision = attriMetadata[0].Precision;
            }
        }

        if (templateFieldValues != null && templateFieldValues != undefined && templateFieldValues != "undefined") {
            templateFieldValues = kendo.format("{0:c2}", parseFloat(templateFieldValues.toString().replace(/[^0-9\.]+/g, "")).toFixed(precision));
        }
        else {
            templateFieldValues == "NaN";
        }

        if (templateFieldValues == "NaN") {
            templateFieldValues = 0;
        }

        //$("<input class='k-input k-textbox' id='" + options.model.QuoteDetailId + "_currency' style='width:80%;' type='text' value='" + amount + "'>").appendTo(container);



        $("<input id='moneyField' value='" + templateFieldValues + "'/>")
                 .appendTo(container)
                 .kendoNumericTextBox({
                     decimals: precision,
                     min: minValue,
                     max: maxValue,
                     format: 'c'
                 });

        $("#moneyField").focusout(function () {
            var maxValue;
            var minValue;
            var precision = 2;
            var formattedValue = $(this).val();

            try {

                if (formattedValue != "" && formattedValue != null && formattedValue != undefined) {
                    var newValue = null;

                    entityGrid = $("#grid").data("kendoGrid");

                    //var selectedRow = entityGrid.select();
                    var selectedRow = $(this).closest("tr");
                    var selectedRecord = entityGrid.dataItem(selectedRow);

                    var attriMetadata = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(entityLogicalName, moneyField.toLowerCase(), true);
                    if (attriMetadata != null && attriMetadata != undefined && attriMetadata != "undefined") {
                        if (attriMetadata[0].MinValue != undefined) {
                            minValue = attriMetadata[0].MinValue;
                        }
                        if (attriMetadata[0].MaxValue != undefined) {
                            maxValue = attriMetadata[0].MaxValue;
                        }
                        //if (attriMetadata[0].Precision != undefined) {
                        //    precision = attriMetadata[0].Precision;
                        //}
                    }

                    newValue = kendo.format("{0:c2}", parseFloat(formattedValue.toString().replace(/[^0-9\.]+/g, "")).toFixed(precision));

                    selectedRecord[moneyField] = { Value: newValue };
                    selectedRecord.dirty = true;

                    // Set the red update triangle
                    if (templateFieldValues != newValue) {
                        if (!$(this).closest("td").hasClass("k-dirty-cell")) {
                            $(this).closest("td").append('<span class="k-dirty"></span>');
                            $(this).closest("td").addClass('k-dirty-cell');
                        }
                    }
                }
            }
            catch (e) {
                Xrm.Utility.alertDialog("Please insert correct currency value");
            }

        });

    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.numberEditor = function (container, options) {
    var functionName = "Tribridge.ViewEditor.Private.numberEditor";
    var entityGrid = "";
    var maxValue;
    var minValue;
    var precision = 2;

    try {
        templateFieldValues = "";
        try {
            numberField = options.field;
            templateFieldValues = options.model[numberField];
        }
        catch (e) {
            templateFieldValues = 0;
        }

        if (templateFieldValues != null && templateFieldValues != undefined && templateFieldValues != "undefined") {
            templateFieldValues = parseInt(templateFieldValues.toString());
        }
        else {
            templateFieldValues == "NaN";
        }

        if (templateFieldValues == "NaN") {
            templateFieldValues = 0;
        }

        //$("<input class='k-input k-textbox' id='" + options.model.QuoteDetailId + "_currency' style='width:80%;' type='text' value='" + amount + "'>").appendTo(container);

        var attriMetadata = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(entityLogicalName, numberField.toLowerCase(), true);
        if (attriMetadata != null && attriMetadata != undefined && attriMetadata != "undefined") {
            if (attriMetadata[0].MinValue != undefined) {
                minValue = attriMetadata[0].MinValue;
            }
            if (attriMetadata[0].MaxValue != undefined) {
                maxValue = attriMetadata[0].MaxValue;
            }
        }

        $("<input id='numberField' value='" + templateFieldValues + "'/>")
                 .appendTo(container)
                 .kendoNumericTextBox({
                     min: minValue,
                     max: maxValue
                 });

        $("#numberField").focusout(function () {

            var formattedValue = $(this).val();

            try {

                if (formattedValue != "" && formattedValue != null && formattedValue != undefined) {
                    var newValue = null;

                    entityGrid = $("#grid").data("kendoGrid");

                    //var selectedRow = entityGrid.select();
                    var selectedRow = $(this).closest("tr");
                    var selectedRecord = entityGrid.dataItem(selectedRow);

                    newValue = parseInt(formattedValue.toString());
                    selectedRecord[numberField] = newValue;
                    selectedRecord.dirty = true;

                    // Set the red update triangle
                    if (templateFieldValues != newValue) {
                        if (!$(this).closest("td").hasClass("k-dirty-cell")) {
                            $(this).closest("td").append('<span class="k-dirty"></span>');
                            $(this).closest("td").addClass('k-dirty-cell');
                        }
                    }
                }
            }
            catch (e) {
                Xrm.Utility.alertDialog("Please insert correct value for " + numberField);
            }

        });

    } catch (e) {
        throwError(e, functionName);
    }
}


Tribridge.ViewEditor.Private.decimalEditor = function (container, options) {
    var functionName = "Tribridge.ViewEditor.Private.decimalEditor";
    var entityGrid = "";
    var maxValue;
    var minValue;
    var precision = 2;

    try {
        templateFieldValues = "";
        try {
            numberField = options.field;
            templateFieldValues = options.model[numberField];
        }
        catch (e) {
            templateFieldValues = 0;
        }

        var attriMetadata = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(entityLogicalName, numberField.toLowerCase(), true);
        if (attriMetadata != null && attriMetadata != undefined && attriMetadata != "undefined") {
            if (attriMetadata[0].MinValue != undefined) {
                minValue = attriMetadata[0].MinValue;
            }
            if (attriMetadata[0].MaxValue != undefined) {
                maxValue = attriMetadata[0].MaxValue;
            }
            if (attriMetadata[0].Precision != undefined) {
                precision = attriMetadata[0].Precision;
            }
        }

        if (templateFieldValues != null && templateFieldValues != undefined && templateFieldValues != "undefined") {
            templateFieldValues = kendo.format("{0:0.00000}", parseFloat(templateFieldValues.toString()).toFixed(precision));
        }
        else {
            templateFieldValues == "NaN";
        }

        if (templateFieldValues == "NaN") {
            templateFieldValues = 0;
        }

        //$("<input class='k-input k-textbox' id='" + options.model.QuoteDetailId + "_currency' style='width:80%;' type='text' value='" + templateFieldValues + "'>").appendTo(container);



        $("<input id='decimalField' value='" + templateFieldValues + "'/>")
                 .appendTo(container)
                 .kendoNumericTextBox({
                     decimals: precision,
                     min: minValue,
                     max: maxValue
                 });

        $("#decimalField").focusout(function () {

            var formattedValue = $(this).val();
            var precision = 2;
            try {

                if (formattedValue != "" && formattedValue != null && formattedValue != undefined) {
                    var newValue = null;

                    if (attriMetadata[0].Precision != undefined) {
                        precision = attriMetadata[0].Precision;
                    }

                    entityGrid = $("#grid").data("kendoGrid");

                    //var selectedRow = entityGrid.select();
                    var selectedRow = $(this).closest("tr");
                    var selectedRecord = entityGrid.dataItem(selectedRow);

                    newValue = kendo.format("{0:0.00000}", parseFloat(formattedValue.toString()).toFixed(precision));
                    selectedRecord[numberField] = newValue;
                    selectedRecord.dirty = true;

                    // Set the red update triangle
                    if (templateFieldValues != newValue) {
                        if (!$(this).closest("td").hasClass("k-dirty-cell")) {
                            $(this).closest("td").append('<span class="k-dirty"></span>');
                            $(this).closest("td").addClass('k-dirty-cell');
                        }
                    }
                }
            }
            catch (e) {
                Xrm.Utility.alertDialog("Please insert correct value for " + numberField);
            }

        });

    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.LookupEditor = function (container, options) {
    var functionName = "Tribridge.ViewEditor.Private.LookupEditor";
    var window = $('#lookupWindow');
    var viewInfo = Tribridge.ViewEditor.CustomViews[options.model.id];
    var originField = options.field.replace(".Id", "");
    var entities = viewInfo.Targets[originField.toLowerCase()];
    // var entities = viewInfo.EntityNames;
    var currentObjectTypeCode = viewInfo.EntityTypeCode;
    lookupContainer = container;

    _lookupOptions = options;

    try {
        if (options.model._IsActiveRecord > 0 && _disableInactiveRecords) {
            // disable lookup
            var viewInfo = Tribridge.ViewEditor.CustomViews[options.model.id];

            var entityGrid = $("#grid").data("kendoGrid");

            var grid = $('#' + viewInfo.CssId);
            var selectedRow = grid.data("kendoGrid").tbody.find("tr[data-uid='" + options.model.uid + "']");
            var cellHeader = grid.find("th[data-field='" + originField + "']");
            var cell = selectedRow.find("td:eq(" + cellHeader[0].cellIndex + ")");

            var selectedRecord = entityGrid.dataItem(selectedRow);

            if (selectedRecord == null || selectedRecord[options.field] == null) {
                return;
            }

            var lookupObj = { Id: selectedRecord[options.field].Id, Name: selectedRecord[options.field].Name, LogicalName: selectedRecord[options.field].LogicalName };

            //newValue = kendo.format("{0:0.00}", parseFloat(formattedValue.toString()).toFixed(precision));
            selectedRecord[originField] = lookupObj;
            options.model.set(options.field, lookupObj);
            cell.text(selectedRecord[options.field].Name);
        }
        else {
            // show loader
            ShowBusyIndicator();
            objectTypeCodes = [];
            if (objectTypeCodes.length <= 0) {
                //create an array of lookup object type codes
                if (entities.length > 0) {
                    for (var i = 0; i < entities.length; i++) {
                        // Get entity metadata
                        var entityTargetAttributes = Tribridge.CRMSDK.METADATA.RetrieveEntity(entities[i].Entity, Tribridge.CRMSDK.METADATA.EntityFilters.Attributes, null, true, null, null, null);
                        //get object type code
                        var objectCode = entityTargetAttributes.ObjectCode;

                        objectTypeCodes.push(objectCode);
                    }
                }
            }
            openLookup(objectTypeCodes, currentObjectTypeCode, options.model.uid);
            HideBusyIndicator();
        }
    } catch (e) {
        throwError(e, functionName);
    }
};

/**
 * @desc OnDataBound is triggerd while binding data to the grid.
 */
Tribridge.ViewEditor.Private.OnDataBinding_Grid = function (arg) {
    var functionName = "Tribridge.ViewEditor.Private.OnDataBinding_Grid";
    try {
        if (addNew) {
            if (arg != null && arg.items != null && arg.items.length > 0) {
                for (var x = 0; x < arg.items.length; x++) {
                    var viewInfo = Tribridge.ViewEditor.CustomViews[arg.items[x].id];
                    if (viewInfo != null && viewInfo != undefined) {
                        for (var y = 0; y < viewInfo.Columns.length; y++) {
                            switch (viewInfo.Columns[y].Type) {
                                case "Money":
                                    arg.items[x][viewInfo.Columns[y].Name] = { Value: 0 };
                                    break;
                                case "Picklist":
                                    arg.items[x][viewInfo.Columns[y].Name] = { Value: -1 };
                                    break;
                                case "Status":
                                case "State":
                                    arg.items[x][viewInfo.Columns[y].Name] = { Value: 0 };
                                    break;
                                case "Owner":
                                    var userId = Tribridge.Helper.GetUserId();
                                    var userName = Tribridge.Helper.GetUserName();

                                    arg.items[x][viewInfo.Columns[y].Name] = { Id: userId, Name: userName, LogicalName: "SystemUser" };
                                    break;
                                case "Image":
                                    arg.items[x][viewInfo.Columns[y].Name] = { isValid: true, errorMsg: "", isNewRecord: true };
                                    break;
                                case "DateTime":
                                    arg.items[x][viewInfo.Columns[y].Name] = new Date();
                                    break;
                            }
                        }
                    }
                }
                addNew = false;
            }
        }
        else {
            // If records saved has errors then bind those records with 
            if (Tribridge.ViewEditor.ErrorRecords != null && Tribridge.ViewEditor.ErrorRecords.length > 0) {
                if (arg != null && arg.items != null && arg.items.length > 0) {
                    var viewInfo = Tribridge.ViewEditor.CustomViews[0];
                    for (var x = 0; x < arg.items.length; x++) {
                        var currRec = null;
                        $.each(Tribridge.ViewEditor.ErrorRecords, function (index, value) {
                            if (value.record[viewInfo["PrimaryAttribute"]] == arg.items[x][viewInfo["PrimaryAttribute"]])
                                currRec = value;
                        });

                        if (currRec != null && currRec != undefined) {
                            // bind error and if is valid                            
                            for (var y = 0; y < viewInfo.Columns.length; y++) {
                                if (viewInfo.Columns[y].Name == "colSaveVal") {
                                    arg.items[x]["colSaveVal"] = { isValid: false, errorMsg: currRec.error, isNewRecord: false };
                                }
                                else {
                                    if (viewInfo.Columns[y].Type.toLowerCase() == "DateTime".toLowerCase()) {
                                        // For datetime fields
                                        if (viewInfo.Columns[y].Name != "CreatedOn" && viewInfo.Columns[y].Name != "ModifiedOn") {
                                            //// bug fix on July-07-2016
                                            if (currRec.record[viewInfo.Columns[y].Name] != null && currRec.record[viewInfo.Columns[y].Name] != undefined) {
                                                var arr = currRec.record[viewInfo.Columns[y].Name].toISOString().split('T');
                                                if (arr.length > 1) {
                                                    var time = arr[1].split(':');
                                                    var hour;
                                                    if (time[0] == "00")
                                                        hour = "12";
                                                    else
                                                        hour = time[0];
                                                    arg.items[x][viewInfo.Columns[y].Name] = new Date(arr[0].replace("-", "/") + ", " + hour + ":" + time[1] + ":" + "00");
                                                }
                                                else {
                                                    arg.items[x][viewInfo.Columns[y].Name] = new Date(arr[0]);
                                                }
                                            }
                                            // end for datetime fields
                                        }
                                    }
                                    else {
                                        arg.items[x][viewInfo.Columns[y].Name] = currRec.record[viewInfo.Columns[y].Name];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

Tribridge.ViewEditor.Private.AddDirtyTriangle = function (index, uid, cellName) {
    var functionName = "Tribridge.ViewEditor.Private.AddDirtyTriangle";
    //alert(cellName);
    try {
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];

        var entityGrid = $("#grid").data("kendoGrid");

        var grid = $('#' + viewInfo.CssId);
        var selectedRow = grid.data("kendoGrid").tbody.find("tr[data-uid='" + uid + "']");
        var cellHeader = grid.find("th[data-field='" + cellName + "']");
        var cell = selectedRow.find("td:eq(" + cellHeader[0].cellIndex + ")");

        var selectedRecord = entityGrid.dataItem(selectedRow);

        //newValue = kendo.format("{0:0.00}", parseFloat(formattedValue.toString()).toFixed(precision));
        selectedRecord[numberField] = newValue;
        selectedRecord.dirty = true;

        if (!cell.hasClass("k-dirty-cell")) {
            cell.addClass("k-dirty-cell");
            cell.prepend("<span class='k-dirty'></span>");
        }
    } catch (e) {
        throwError(e, functionName);
    }
}


Tribridge.ViewEditor.Events.ChangeLookupEntity = function (e) {
    var functionName = "Tribridge.ViewEditor.Events.ChangeLookupEntity";
    var selectedValue = JSON.parse($("#entityList").val());

    try {
        // Reset Value
        $('#lookupList').val("");

        $('#lookupList').kendoComboBox({
            dataTextField: selectedValue.PrimaryAttributeSchema,
            dataValueField: selectedValue.PrimaryIdAttributeSchema,
            filter: "startswith",
            minLength: 2,
            placeholder: "Search ...",
            dataSource: {
                type: "odata",
                serverFiltering: true,
                pageSize: 20,
                transport: {
                    read: {
                        url: Tribridge.Helper.GetODataServiceUrl() + '/' + selectedValue.SchemaName + 'Set?select=' + selectedValue.PrimaryAttributeSchema + ',' + selectedValue.PrimaryIdAttributeSchema,
                        dataType: 'json'
                    },
                    parameterMap: function (options, operation) {
                        if (options.filter && options.filter.filters) {
                            for (var i = 0; i < options.filter.filters.length; i++) {
                                // CRM odata doesn't support 'tolower'
                                options.filter.filters[i].ignoreCase = false;
                            }
                        }

                        // CRM odata doesn't support $inlinecount or $format
                        var paramMap = kendo.data.transports.odata.parameterMap(options);
                        delete paramMap.$inlinecount;
                        delete paramMap.$format;

                        return paramMap;
                    }
                }
            }
        });
    } catch (e) {
        throwError(e, functionName);
    }
}


//function to open filtered entity lookup to select record
function openLookup(objectTypeCode, currentType, currentId) {

    var functionName = "openLookup";
    var url = "";
    try {

        if (isValid(objectTypeCode)) {

            //check if lookup has more than one entity object
            if (objectTypeCode.length > 1) {

                var code = "";

                //loop through object codes
                for (var i = 0; i < objectTypeCode.length; i++) {

                    if (code == "") {
                        code = objectTypeCode[i];
                    }
                    else {
                        code += "%2c" + objectTypeCode[i];
                    }
                }

                //prepare a lookup URL
                url = "/_controls/lookup/lookupinfo.aspx?AllowFilterOff=0&DefaultType=" + objectTypeCode[0] + "&DisableQuickFind=0&DisableViewPicker=0&LookupStyle=single&ShowNewButton=1&browse=0&currentObjectType=" + currentType + "&currentid=%7b" + currentId + "%7d&dType=1&mrsh=false&objecttypes=" + code;
            }
            else {
                //prepare a lookup URL
                url = "/_controls/lookup/lookupinfo.aspx?AllowFilterOff=0&DefaultType=" + objectTypeCode[0] + "&DisableQuickFind=0&DisableViewPicker=0&LookupStyle=single&ShowNewButton=1&browse=0&currentObjectType=" + currentType + "&currentid=%7b" + currentId + "%7d&dType=1&mrsh=false&objecttypes=" + objectTypeCode[0];
            }
        }

        //Set the Dialog Width and Height
        var DialogOptions = new Xrm.DialogOptions();

        //Set the Width

        DialogOptions.width = 500;

        //Set the Height

        DialogOptions.height = 550;

        //open dialog
        Xrm.Internal.openDialog(Mscrm.CrmUri.create(url).toString(), DialogOptions, null, null, CallbackFunction);

        //Set the variable to false
        isOnLoad = false;

    } catch (e) {

        throwError(e, functionName);

    }

}

//Call back function for the Lookup
function CallbackFunction(returnValue) {

    if (isValid(returnValue) && isValid(returnValue.items) && isValid(returnValue.items[0].id) && isValid(returnValue.items[0].name)) {

        var originField = _lookupOptions.field.replace(".Id", "");

        var viewInfo = Tribridge.ViewEditor.CustomViews[_lookupOptions.model.id];

        // Read current lookupId
        templateFieldValues = "";
        if (_lookupOptions.field != null && _lookupOptions.field != undefined && _lookupOptions.field != "undefined" && _lookupOptions.model[_lookupOptions.field] != null && _lookupOptions.model[_lookupOptions.field].Id != null && _lookupOptions.model[_lookupOptions.field].Id != undefined) {
            templateFieldValues = _lookupOptions.model[_lookupOptions.field].Id;
        }
        else {
            templateFieldValues = null;
        }

        var entityGrid = $("#grid").data("kendoGrid");

        var grid = $('#' + viewInfo.CssId);
        var selectedRow = grid.data("kendoGrid").tbody.find("tr[data-uid='" + _lookupOptions.model.uid + "']");
        var cellHeader = grid.find("th[data-field='" + originField + "']");
        var cell = selectedRow.find("td:eq(" + cellHeader[0].cellIndex + ")");

        var selectedRecord = entityGrid.dataItem(selectedRow);

        //newValue = kendo.format("{0:0.00}", parseFloat(formattedValue.toString()).toFixed(precision));
        selectedRecord[originField] = { Id: returnValue.items[0].id, Name: returnValue.items[0].name, LogicalName: returnValue.items[0].typename };
        selectedRecord.dirty = true;

        var lookupObj = { Id: returnValue.items[0].id, Name: returnValue.items[0].name, LogicalName: returnValue.items[0].typename };

        _lookupOptions.model.set(_lookupOptions.field, lookupObj);
        _lookupOptions.model.dirty = true;
        cell.text(returnValue.items[0].name);


        //if (!cell.hasClass("k-dirty-cell")) {
        if (templateFieldValues != returnValue.items[0].id) {

            cell.addClass("k-dirty-cell");
            cell.prepend("<span class='k-dirty'></span>");
        }
    }
}

Tribridge.ViewEditor.CB.ParseViewMetadata = function (data, passthrough) {
    var functionName = "Tribridge.ViewEditor.CB.ParseViewMetadata";
    var fetchxmlQuery;
    var readOnlyCol = [];
    var reqCol = [];
    var autoSave = true;

    try {

        if (data != null) {
            Tribridge.ViewEditor.CustomViews = [];
            //var xml = $.parseXML(data.LayoutXml);
            //var cellEle = xml.getElementsByTagName('cell');

            // Use data.Id to get the view Id            
            var result = XrmServiceToolkit.Soap.Retrieve(data.ViewType, data.Id, ["fetchxml"]);

            if (result != null && result != undefined) {
                if (result.attributes["fetchxml"] == undefined || result.attributes["fetchxml"] == "undefined" || result.attributes["fetchxml"] == null) {
                    alert("No fetchxml found for this view");
                    HideLoading();
                    showLoader(false);
                    HideBusyIndicator();
                    return;
                }
                else {
                    fetchxmlQuery = result.attributes["fetchxml"].value;
                }
            }

            // Functionality of Tribridge.ViewEditor.Build function    

            // Check for Auto save
            if (data.triipcrm_savemode == _batchSave) {
                autoSave = false;
            }

            var viewInfo = { CssId: 'grid', Entity: _entityName, Query: _viewName, AutoSave: autoSave, FetchXml: fetchxmlQuery };

            var columns = [];
            $.each(_ViewColumnsRecords, function (index, value) {
                var col = {};
                //col.Attribute = value.getAttribute('name');
                col.Attribute = value.triipcrm_columnlogicalname;
                //col.Width = value.getAttribute('width');
                col.Width = value.triipcrm_width;
                col.Type = 'string'; // Has to be set after getting metadata 
                //col.Name = 'N/A'; // Has to be set after getting metadata 
                col.Name = data.AttributeNames[value.triipcrm_columnlogicalname]
                col.DisplayName = value.triipcrm_columndisplayname;

                // Set type if attribute schema found
                if (data.AttributeTypes.hasOwnProperty(col.Attribute))
                    col.Type = data.AttributeTypes[col.Attribute];

                //// Set name if attribute schema found
                //if (data.AttributeNames.hasOwnProperty(col.Attribute)) {bind
                //    col.Name = data.AttributeNames[col.Attribute];
                //    col.DisplayName = data.DisplayNames[col.Attribute];
                //}

                // Check for filtering
                col.Filterable = value.triipcrm_allowfilter;

                if (col.Name != 'N/A')
                    columns.push(col);

                // Check if readonly and create array of readonly columns
                if (value.triipcrm_isreadonly) {
                    readOnlyCol.push(value.triipcrm_columnlogicalname);
                }

                // Check if requied and create array of required columns
                if (value.triipcrm_isrequired) {
                    reqCol.push(value.triipcrm_columnlogicalname);
                }

                //// Check for filtering
                //col.Filterable = value.triipcrm_allowfilter;
            });

            // add one column for showing unsaved row
            var col = {};
            col.Attribute = "colSaveVal";
            col.Width = "20";
            col.Type = 'Image';
            col.Name = "colSaveVal";
            col.DisplayName = " ";
            col.Filterable = false;

            if (col.Name != 'N/A')
                columns.splice(0, 0, col);

            viewInfo.FetchXml = fetchxmlQuery;
            viewInfo.FilterFetch = null;
            viewInfo.SortFetch = null;
            viewInfo.IsFilterApplied = false;
            viewInfo.Columns = columns;
            viewInfo.Readonly = readOnlyCol;
            viewInfo.Required = reqCol;
            //viewInfo.Odata = data.Odata;
            viewInfo.Schema = data.Schema;
            viewInfo.DisplayNames = data.DisplayNames;
            viewInfo.OptionSets = data.OptionSets;
            viewInfo.Targets = data.Targets;
            viewInfo.PrimaryIdAttribute = data.PrimaryIdAttributeSchema;
            viewInfo.PrimaryAttribute = data.AttributeNames[data.PrimaryAttributeSchema];
            viewInfo.EntityTypeCode = data.EntityTypeCode;
            viewInfo.stateCodeExists = data.stateCodeExists;
            viewInfo.EntityNames = data.EntityNames;
            viewInfo.DateTimeFormats = data.DateTimeFormats;

            index = Tribridge.ViewEditor.CustomViews.push(viewInfo) - 1;
        } else {
            // do nothing 
            return;
        }

        //Tribridge.ViewEditor.Private.Grid(passthrough);

        // Destroy the existing grid if exists and bind grid again with new data
        var grid = $("#grid").data("kendoGrid");
        if (grid != null && grid != undefined && grid != "undefined") {
            grid.destroy();
        }
        Tribridge.ViewEditor.Private.Grid(0);
    } catch (e) {
        throwError(e, functionName);
    }
};

function FetchCount(viewInfo, fetchXML) {
    //COUNT
    var moreRec;
    var resultData = XrmServiceToolkit.Soap.FetchNext(fetchXML, 1, 5000, "");

    if (resultData != null && resultData != undefined && resultData != "undefined") {
        count = resultData.fetchResult.length;
        moreRec = resultData.fetchMoreRecords;

        if (resultData.fetchMoreRecords == true) {
            count = resultData.fetchResult.length + "+";
        }
        else {
            count = resultData.fetchResult.length;
        }
    }
    return count;
}

//Kadambari Main Grid Start


function RetrieveViewConfigurationRecords() {
    var functionName = "RetrieveViewConfigurationRecords";
    try {
        var fetchviewconfig = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                        "<entity name='triipcrm_viewconfiguration'>" +
                        "<attribute name='triipcrm_name' />" +
                        "<attribute name='triipcrm_savemode' />" +
                        "<attribute name='triipcrm_relatedentity' />" +
                        "<attribute name='triipcrm_primaryentityviewname' />" +
                        "<attribute name='triipcrm_primaryentity' />" +
                        "<attribute name='triipcrm_isdefault' />" +
                        "<attribute name='triipcrm_gridtype' />" +
                        "<attribute name='triipcrm_enablesaveprompt' />" +
                        "<attribute name='triipcrm_primaryentityattribute' />" +
                        "<attribute name='triipcrm_primaryentityviewid' />" +
                        "<attribute name='triipcrm_viewconfigurationid' />" +
                        "<attribute name='triipcrm_viewtype' />" +
                        "<order attribute='triipcrm_name' descending='false' />" +
                        "<filter type='and'>" +
                        "<condition attribute='triipcrm_name' operator='eq' value='" + _configName + "' />" +
                        "<condition attribute='statecode' operator='eq' value='0' />" +
                        "</filter>" +
                        "</entity>" +
                        "</fetch>";

        XrmServiceToolkit.Soap.Fetch(fetchviewconfig, true, function (result) { onFetchViewConfigAllComplete(result); });
    } catch (e) {
        throwError(e, functionName);
    }

}

// function called on success call back of fetch view config 
function onFetchViewConfigAllComplete(viewConfig) {
    var functionName = "onFetchViewConfigAllComplete";
    var viewJsonobj = new Object();
    try {
        if (viewConfig.length > 0) {
            for (var record = 0; record < viewConfig.length; record++) {
                if (_isSubGrid || _isWebResource) {
                    // set the entity
                    _entityName = viewConfig[record].attributes["triipcrm_primaryentity"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentity"].value : null;
                    // set the view name incase of subgrid not set.
                    _viewName = viewConfig[record].attributes["triipcrm_primaryentityviewname"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentityviewname"].value : null;
                    // Set _primaryentityattribute
                    _primaryentityattribute = viewConfig[record].attributes["triipcrm_primaryentityattribute"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentityattribute"].value : null;
                }

                viewJsonobj = {
                    "triipcrm_name": viewConfig[record].attributes["triipcrm_name"] != undefined ? viewConfig[record].attributes["triipcrm_name"].value : null,
                    "triipcrm_savemode": viewConfig[record].attributes["triipcrm_savemode"] != undefined ? viewConfig[record].attributes["triipcrm_savemode"].value : null,
                    "triipcrm_relatedentity": viewConfig[record].attributes["triipcrm_relatedentity"] != undefined ? viewConfig[record].attributes["triipcrm_relatedentity"].value : null,
                    "triipcrm_primaryentityviewname": viewConfig[record].attributes["triipcrm_primaryentityviewname"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentityviewname"].value : null,
                    "triipcrm_primaryentity": viewConfig[record].attributes["triipcrm_primaryentity"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentity"].value : null,
                    "triipcrm_isdefault": viewConfig[record].attributes["triipcrm_isdefault"] != undefined ? viewConfig[record].attributes["triipcrm_isdefault"].value : null,
                    "triipcrm_gridtype": viewConfig[record].attributes["triipcrm_gridtype"] != undefined ? viewConfig[record].attributes["triipcrm_gridtype"].value : null,
                    //"triipcrm_disableinactiverecords": viewConfig[record].attributes["triipcrm_disableinactiverecords"] != undefined ? viewConfig[record].attributes["triipcrm_disableinactiverecords"].value : null,
                    "triipcrm_disableinactiverecords": true,
                    "triipcrm_primaryentityviewid": viewConfig[record].attributes["triipcrm_primaryentityviewid"] != undefined ? viewConfig[record].attributes["triipcrm_primaryentityviewid"].value : null,
                    "triipcrm_viewtype": viewConfig[record].attributes["triipcrm_viewtype"] != undefined ? viewConfig[record].attributes["triipcrm_viewtype"].value : null,
                    "triipcrm_viewconfigurationid": viewConfig[record].attributes["triipcrm_viewconfigurationid"] != undefined ? viewConfig[record].attributes["triipcrm_viewconfigurationid"].value : null
                };
                //_disableInactiveRecords = viewConfig[record].attributes["triipcrm_disableinactiverecords"] != undefined ? viewConfig[record].attributes["triipcrm_disableinactiverecords"].value : 0;
                _disableInactiveRecords = 1;

                if (viewConfig[record].attributes["triipcrm_enablesaveprompt"] != undefined) {
                    _enablePrompt = viewConfig[record].attributes["triipcrm_enablesaveprompt"].value;
                }
                else {
                    _enablePrompt = false;
                }
            }
            _ViewConfigRecord = viewJsonobj;

            //fetch all the respective view columns
            var viewId = _ViewConfigRecord.triipcrm_viewconfigurationid;

            var viewColumnsFetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                                    "<entity name='triipcrm_viewcolumn'>" +
                                    "<attribute name='triipcrm_viewcolumnid' />" +
                                    "<attribute name='triipcrm_name' />" +
                                    "<attribute name='triipcrm_width' />" +
                                    "<attribute name='triipcrm_viewconfiguration' />" +
                                    "<attribute name='statuscode' />" +
                                    "<attribute name='statecode' />" +
                                    "<attribute name='triipcrm_isrequired' />" +
                                    "<attribute name='triipcrm_isreadonly' />" +
                                    "<attribute name='triipcrm_columnlogicalname' />" +
                                    "<attribute name='triipcrm_columndisplayname' />" +
                                    "<attribute name='triipcrm_allowfilter' />" +
                                    "<order attribute='triipcrm_columnorder' descending='false' />" +
                                    "<filter type='and'>" +
                                    "<condition attribute='triipcrm_viewconfiguration' operator='eq' uitype='triipcrm_viewconfiguration' value='" + viewId + "' />" +
                                    "</filter>" +
                                    "</entity>" +
                                    "</fetch>";

            XrmServiceToolkit.Soap.Fetch(viewColumnsFetch, true, function (result) { onViewColumnsFetchAllComplete(result); });
        }
        else {
            return;
        }

    } catch (e) {
        throwError(e, functionName);
    }
}

// function called on success of view columns fetch
function onViewColumnsFetchAllComplete(viewColumns) {
    var functionName = "onViewColumnsFetchAllComplete";
    var columnJson = [];
    var columnArr;
    try {
        if (viewColumns.length > 0) {
            for (var i = 0; i < viewColumns.length; i++) {
                columnArr = {};
                columnArr["triipcrm_viewcolumnid"] = viewColumns[i].attributes["triipcrm_viewcolumnid"] != undefined ? viewColumns[i].attributes["triipcrm_viewcolumnid"].value : null;
                columnArr["triipcrm_name"] = viewColumns[i].attributes["triipcrm_name"] != undefined ? viewColumns[i].attributes["triipcrm_name"].value : null;
                columnArr["triipcrm_width"] = viewColumns[i].attributes["triipcrm_width"] != undefined ? viewColumns[i].attributes["triipcrm_width"].value : 100;
                columnArr["triipcrm_viewconfiguration"] = viewColumns[i].attributes["triipcrm_viewconfiguration"] != undefined ? { id: viewColumns[i].attributes["triipcrm_viewconfiguration"].id, logicalName: viewColumns[i].attributes["triipcrm_viewconfiguration"].logicalName, name: viewColumns[i].attributes["triipcrm_viewconfiguration"].name } : null;
                columnArr["triipcrm_isrequired"] = viewColumns[i].attributes["triipcrm_isrequired"] != undefined ? viewColumns[i].attributes["triipcrm_isrequired"].value : false;
                columnArr["triipcrm_isreadonly"] = viewColumns[i].attributes["triipcrm_isreadonly"] != undefined ? viewColumns[i].attributes["triipcrm_isreadonly"].value : false;
                columnArr["triipcrm_columnlogicalname"] = viewColumns[i].attributes["triipcrm_columnlogicalname"] != undefined ? viewColumns[i].attributes["triipcrm_columnlogicalname"].value : "";
                columnArr["triipcrm_columndisplayname"] = viewColumns[i].attributes["triipcrm_columndisplayname"] != undefined ? viewColumns[i].attributes["triipcrm_columndisplayname"].value : "";
                columnArr["triipcrm_allowfilter"] = viewColumns[i].attributes["triipcrm_allowfilter"] != undefined ? viewColumns[i].attributes["triipcrm_allowfilter"].value : false;

                columnJson.push(columnArr);
            }
            _ViewColumnsRecords = columnJson;

            // call Tribridge.OData.Private.ParseView function
            Tribridge.OData.Private.ParseView(_ViewConfigRecord, _ViewColumnsRecords);
        }
    } catch (e) {
        throwError(e, functionName);
    }
}
//Kadambari Main grid End

function SetPagingCount(count) {
    var functionName = "SetPagingCount";
    try {
        $("#dvPaging").css('display', 'block');
        $("#tblPaging").show();

        $("#lblPageNumber").text("Page" + pageNo + " ");

        if (count <= 0) {
            $("#lblTotalPage").text("0" + " - " + "0" + " of " + "0");
        }
        else {

            //Kadambari- 07-07-2015
            if (count < Tribridge.ViewEditor.PagingSize) {
                pageSize = count;
            }
            else {
                pageSize = Tribridge.ViewEditor.PagingSize;
            }

            //Kadambari 08-07-2015
            if (isSaveFlag == 1) {
                if (count < Tribridge.ViewEditor.PagingSize) {
                    pageSize = count;
                }
                else {
                    pageSize = lRecord;
                }
                if (fRecord == 0) {
                    fRecord = 1;
                }
                $("#lblTotalPage").text(fRecord + " - " + pageSize + " of " + count);
            }
            else {
                if (pageNo == 1 || pageNo == 2) {
                    lRecord = pageSize;
                }
                $("#lblTotalPage").text(fRecord + 1 + " - " + pageSize + " of " + count);
            }
        }

        //Kad-13-07
        if (pageNo == 1) {
            $("#btnFirst").removeClass("btnEnabledFirstCss");
            $("#btnPrevious").removeClass("btnEnabledPreviousCss");
            //$("#btnFirst").removeAttr('disabled');
            //$("#btnPrevious").removeAttr('disabled');
            $("#btnFirst").attr('disabled', 'disabled');
            $("#btnPrevious").attr('disabled', 'disabled');
            $("#btnFirst").addClass("btnFirstCss");
            $("#btnPrevious").addClass("btnPreviousCss");
        }

        $("#btnNext").removeAttr('disabled');
        $("#btnNext").removeClass("btnNextCss");
        $("#btnNext").addClass("btnEnabledNextCss");

        //Kadambari- 07-07-2015
        if (moreRecords == false) {
            if (count < Tribridge.ViewEditor.PagingSize) {
                $("#btnNext").removeClass("btnEnabledNextCss");
                $("#btnNext").addClass("btnNextCss");
                $("#btnNext").attr('disabled', 'disabled');
            }
        }
        if (count <= 0) {
            $("#btnFirst").attr('disabled', 'disabled');
            $("#btnPrevious").attr('disabled', 'disabled');
            $("#btnFirst").removeClass("btnEnabledFirstCss");
            $("#btnPrevious").removeClass("btnEnabledPreviousCss");
            $("#btnFirst").addClass("btnFirstCss");
            $("#btnPrevious").addClass("btnPreviousCss");
        }
    } catch (e) {
        throwError(e, functionName);
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

//add filter condition for filtering
function addFilterCondition(fetchXML, viewInfo, currentFilter) {
    var functionName = "addFilterCondition";
    try {
        var oSerializer = new XMLSerializer();
        currentPageCookie = "";
        pageNo = 1;
        fRecord = 0;

        // Parse the fetchquery as xml
        var parsedFetch = Tribridge.Helper.ParseXml(fetchXML);

        // Fetch node
        var fetchNode = parsedFetch.getElementsByTagName("fetch")[0];

        // Entity node
        var entityNode = fetchNode.getElementsByTagName("entity")[0];

        //filter node
        var filterNode = entityNode.getElementsByTagName("filter")[0];

        if (currentFilter != null && currentFilter != undefined && currentFilter.filters.length > 0) {
            if (parsedFetch.getElementsByTagName("filter") != null && parsedFetch.getElementsByTagName("filter") != undefined && parsedFetch.getElementsByTagName("filter")[0] != undefined) {
                //read all the filter condition
                var filterCondtion = parsedFetch.getElementsByTagName("condition");
                var filterLength = filterCondtion.length;
                // remove all filter condition
                for (var i = 0; i < filterLength; i++) {
                    if (filterCondtion[0].xml != undefined) {
                        //filterNode.removeChild(Tribridge.Helper.ParseXml(filterCondtion[0].xml));
                        var cond = fetchNode.getElementsByTagName("condition")[0];
                        filterNode.removeChild(cond);
                    }
                    else {
                        filterNode.removeChild(filterCondtion[0]);
                    }
                }
            }
            else {
                //create filter node
                var filterNode = parsedFetch.createElement("filter");
                var filterAtt = parsedFetch.createAttribute("type");
                filterAtt.nodeValue = "and";
                filterNode.setAttributeNode(filterAtt);
            }
            //Add current filters
            entityNode = AddCurrentFilters(currentFilter, filterNode, parsedFetch, entityNode, fetchNode, viewInfo);

            // add original filter condition
            // Parse the fetchquery as xml
            var orgparsedFetch = Tribridge.Helper.ParseXml(viewInfo.FetchXml);

            // Fetch node
            var orgfetchNode = orgparsedFetch.getElementsByTagName("fetch")[0];

            // Entity node
            var orgentityNode = orgfetchNode.getElementsByTagName("entity")[0];

            //filter node
            var orgfilterNode = orgentityNode.getElementsByTagName("filter")[0];

            // add new filters
            if (orgfilterNode != null && orgfilterNode != undefined) {
                //read all the filter condition
                var filterCondtion = orgparsedFetch.getElementsByTagName("condition");
                for (var i = 0; i < filterCondtion.length; i++) {

                    // Add condition to filter node
                    filterNode.appendChild(filterCondtion[i]);
                }
                // add filter to entity
                entityNode.appendChild(filterNode);
            }

            // convert xml to string
            if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
                // For IE browser
                fetchXML = fetchNode.xml.replace(/"/g, "'");
                viewInfo.SortFetch = fetchXML;
            }
            else {
                // for other browsers
                fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
                viewInfo.SortFetch = fetchXML;
            }
        }
        else {
            if (_sortingQuery != undefined || _sortingQuery != null) {
                var fetchXML = viewInfo.FetchXml;
                // Parse the fetchquery as xml
                var parsedFetch = Tribridge.Helper.ParseXml(fetchXML);

                // Fetch node
                var fetchNode = parsedFetch.getElementsByTagName("fetch")[0];

                // Entity node
                var entityNode = fetchNode.getElementsByTagName("entity")[0];

                //order node
                var orderNode = entityNode.getElementsByTagName("order");
                var ordLength = orderNode.length;
                if (orderNode != null && orderNode.length > 0) {
                    for (var i = 0; i < ordLength; i++) {
                        entityNode.removeChild(orderNode[0]);
                    }
                }

                entityNode.appendChild(_sortingQuery);
            }
            else {
                viewInfo.SortFetch = viewInfo.FetchXml;
            }
            //// convert xml to string
            //if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
            //    // For IE browser
            //    fetchXML = fetchNode.xml.replace(/"/g, "'");
            //    viewInfo.SortFetch = fetchXML;
            //}
            //else {
            //    // for other browsers
            //    fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
            //    viewInfo.SortFetch = fetchXML;
            //}

            ////read all the filter condition
            //var filterCondtion = parsedFetch.getElementsByTagName("condition");

            //// remove all filter condition
            //for (var i = 0; i < filterCondtion.length; i++) {
            //    filterNode.removeChild(filterCondtion[i]);
            //}

            //var filterNode = parsedFetch.createElement("filter");
            //var filterAtt = parsedFetch.createAttribute("type");
            //filterAtt.nodeValue = "and";
            //filterNode.setAttributeNode(filterAtt);

            ////add current filters
            //entityNode = AddCurrentFilters(currentFilter, filterNode, parsedFetch, entityNode, fetchNode, viewInfo);
        }


        //call bind function here
        Tribridge.ViewEditor.BindData(index, currentPageCookie);
    }
    catch (e) {
        throwError(e, functionName);
    }
}

function AddCurrentFilters(currentFilter, filterNode, parsedFetch, entityNode, viewInfo) {
    // add new filters
    var viewInfo = Tribridge.ViewEditor.CustomViews[index];
    if (currentFilter != null && currentFilter != undefined && currentFilter.filters.length > 0) {
        currentFilter.filters.forEach(function (filter, index) {
            // filterHtml += "Field: " + filter.field + "<br/>";
            // Condition node
            var condnElement = parsedFetch.createElement("condition");
            var condnAtt1 = parsedFetch.createAttribute("attribute");
            condnAtt1.nodeValue = filter.field.toLowerCase();
            condnElement.setAttributeNode(condnAtt1);

            var columns = viewInfo.Columns;
            var attriType;

            $.each(columns, function (index, item) {
                if (columns[index].Attribute == filter.field.toLowerCase()) {
                    return attriType = columns[index].Type;
                }
            });


            //eq: "Is equal to",
            //neq: "Is not equal to",
            //gt: "Is greater",
            //gte: "Is greater or equal to",
            //lt: "Is less",
            //lte: "Is less or equal to"
            //      <condition attribute="numberofemployees" operator="eq" value="12" />
            //<condition attribute="numberofemployees" operator="ne" value="12" />
            //<condition attribute="numberofemployees" operator="gt" value="23" />
            //<condition attribute="numberofemployees" operator="ge" value="233" />
            //<condition attribute="numberofemployees" operator="lt" value="23" />
            //<condition attribute="numberofemployees" operator="le" value="34" />


            //check and convert the operator
            switch (filter.operator.toLowerCase()) {
                case "startswith":
                    var operator = "like";
                    var value = filter.value + "%";
                    break;

                case "eq":
                    var operator = "eq";
                    var value;
                    // var parseValue = Date.parse(filter.value)
                    // if (parseValue.toString() != "NaN") {
                    if (attriType == "DateTime" || attriType == "Date") {
                        var fullDate;
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on";
                        value = fullDate;
                    }
                    else {
                        value = filter.value;
                    }
                    break;

                case "neq":
                    var operator = "ne";
                    var value;
                    // var parseValue = Date.parse(filter.value)
                    // if (parseValue.toString() != "NaN") {
                    if (attriType == "DateTime" || attriType == "Date") {
                        var fullDate;
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on-or-after";
                        value = fullDate;
                    }
                    else {
                        operator = "ne";
                        value = filter.value;
                    }
                    break;

                case "contains":
                    var operator = "like";
                    var value = "%" + filter.value + "%";
                    break;

                case "doesnotcontain":
                    var operator = "not-like";
                    var value = "%" + filter.value + "%";;

                    break;

                case "endswith":
                    var operator = "like";
                    var value = "%" + filter.value;
                    break;

                case "gte":
                    var fullDate;
                    var value;
                    var operator;
                    if (attriType == "DateTime" || attriType == "Date") {
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on-or-after";
                        value = fullDate;
                    }
                    else if (attriType == "Integer" || attriType == "Int" || attriType == "Double") {
                        //for integer column
                        operator = "ge";
                        var value = filter.value;
                    }
                    break;

                case "gt":
                    var fullDate;
                    var value;
                    var operator;
                    if (attriType == "DateTime" || attriType == "Date") {
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on-or-after";
                        value = fullDate;
                    }
                    else if (attriType == "Integer" || attriType == "Int" || attriType == "Double") {
                        //for integer column
                        operator = "gt";
                        value = filter.value;
                    }
                    break;

                case "lte":
                    var fullDate;
                    var value;
                    var operator;

                    if (attriType == "DateTime" || attriType == "Date") {
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on-or-before";
                        value = fullDate;
                    }
                    else if (attriType == "Integer" || attriType == "Int" || attriType == "Double") {
                        //for integer column
                        operator = "le";
                        value = filter.value;
                    }
                    break;

                case "lt":
                    var fullDate;
                    var value;
                    var operator;

                    if (attriType == "DateTime" || attriType == "Date") {
                        var date = filter.value;
                        var month = date.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        fullDate = date.getFullYear() + "-" + month + "-" + date.getDate();
                        operator = "on-or-before";
                        value = fullDate;
                    }
                    else if (attriType == "Integer" || attriType == "Int" || attriType == "Double") {
                        //for integer column
                        operator = "lt";
                        value = filter.value;
                    }
                    break;
            }
            if (operator != null) {
                var condnAtt2 = parsedFetch.createAttribute("operator");
                condnAtt2.nodeValue = operator;
                condnElement.setAttributeNode(condnAtt2);
            }

            var condnAtt3 = parsedFetch.createAttribute("value");
            condnAtt3.nodeValue = value;
            condnElement.setAttributeNode(condnAtt3);

            // Add condition to filter node
            filterNode.appendChild(condnElement);
        });
        //// add filter to entity
        entityNode.appendChild(filterNode);

        //// convert xml to string
        //if (fetchNode.xml != undefined && fetchNode.xml != "undefined") {
        //    // For IE browser
        //    fetchXML = fetchNode.xml.replace(/"/g, "'");
        //    viewInfo.SortFetch = fetchXML;
        //}
        //else {
        //    // for other browsers
        //    fetchXML = oSerializer.serializeToString(fetchNode).replace(/"/g, "'");
        //    viewInfo.SortFetch = fetchXML;
        //}
        return entityNode;
    }
}

//Generic function to show loading
function showLoader(status) {
    if (status == true) {
        if ($('#updateStatus').length == 0) {
            $(document.body).append("<div id='updateStatus'></div>").find('#updateStatus').addClass('#updateStatus');
        }
        else {
            $(document.body).find('#updateStatus').remove();
            $(document.body).append("<div id='updateStatus'></div>").find('#updateStatus').addClass('#updateStatus');
        }
        $("#updateStatus").show();
        //$('#updateStatus').css('background-image', 'url(../../UpdatingLoader.gif)');
        $('body').attr('disabled', 'disabled');
        $('body').find('input,textarea,select,button').attr('disabled', 'disabled');

        $("#preloader").fadeIn();
        $("#preloader").delay(350).fadeIn("fast");

    }
    else {

        $("#updateStatus").hide();
        $(document.body).find('#updateStatus').remove();

        $('body').removeAttr('disabled');
        $('body').find('input,textarea,select,button').removeAttr('disabled');

        $("#preloader").fadeOut(); // will first fade out the loading animation
        $("#preloader").delay(350).fadeOut("fast"); // will fade out the white DIV that covers the website.
    }
}