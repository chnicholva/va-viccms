/// <reference path="XrmServiceToolkit.js" />


if (typeof Tribridge == "undefined")
    Tribridge = {};
if (typeof Tribridge.OData == "undefined")
    Tribridge.OData = {};

// Namespaces
if (typeof Tribridge.OData.Private == "undefined")
    Tribridge.OData.Private = {}; // Namespace for private methods
if (typeof Tribridge.OData.CB == "undefined")
    Tribridge.OData.CB = {}; // Namespace for CallBack methods

//On save of the entity data
Tribridge.OData.SaveBatch = function (arg, index, pageCookiesPrevious, _entityName, _isSubGrid, _associatedEntityId, _primaryentityattribute, _associatedEntity) {
    var functionName = "Tribridge.OData.SaveBatch";
    var continueSave = true;

    try {
        showLoader(true);
        Tribridge.ViewEditor.RecordsProcessed_Count = Tribridge.ViewEditor.RecordsProcessed_Count + 1;
        // var kGrid = $("#grid").data("kendoGrid");
        //kGrid.select($(arg.currentTarget).closest("tr"));
        //var row = kGrid.dataItem(kGrid.select());
        var row = arg;
        var columns = Tribridge.ViewEditor.CustomViews[0].Columns;
        var viewInfo = Tribridge.ViewEditor.CustomViews[index];

        var record = new Object();
        var isNew = true;
        var col = "";
        var primaryAttribute = Tribridge.ViewEditor.CustomViews[0].PrimaryAttribute;

        // Build the record structure from the row passed in
        for (i = 0; i < columns.length; i++) {
            col = columns[i].Name;
            switch (columns[i].Type) {
                case "Picklist":
                    var optnSet = viewInfo.OptionSets[columns[i].Name.toLowerCase()];
                    var ogZero = false;
                    for (var j = 0; j < optnSet.length; j++) {
                        if (optnSet[j].Value == 0) {
                            ogZero = true;
                            break;
                        }
                    }

                    // Validate for Readonly fields (If readonly dont save that column)
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] != null && row[col].Value != null && row[col].Value != "undefined" && row[col].Value != undefined) {
                            if (row[col].Value != 0) {
                                record[col] = { Value: row[col].Value };
                            }
                            else {
                                // check if optionset conatins zero when value is zero
                                if (ogZero) {
                                    record[col] = { Value: row[col].Value };
                                }
                                else {
                                    // validate for required field
                                    var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                                    if (isRequired >= 0) {
                                        continueSave = false;
                                    }
                                    record[col] = null;
                                }
                            }
                        }
                        else if (row[col] != null && row[col] != "undefined" && row[col] != undefined && row[col] != 0) {
                            var optVal = parseInt(row[col]);
                            if (optVal.toString() != "NaN") {
                                record[col] = { Value: row[col] };
                            }
                            else {
                                // validate for required field
                                var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                                if (isRequired >= 0) {
                                    continueSave = false;
                                }
                                record[col] = null;
                            }
                        }
                        else {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            record[col] = null;
                        }
                    }
                    break;
                case "Lookup":
                case "Customer":
                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] != null && row[col].Id != null && row[col].Id != undefined && row[col].Id != "") {
                            record[col] = { Id: row[col].Id, LogicalName: row[col].LogicalName, Name: row[col].Name };
                        }
                        else {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            record[col] = null
                        }
                    }
                    break;
                case "Money":
                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] != null && row[col].Value != 0 && row[col].Value != undefined && row[col].Value != "") {
                            record[col] = { Value: parseFloat(row[col].Value.toString().replace(/[^0-9\.]+/g, "")).toFixed(2) };
                        }
                        else {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            record[col] = { Value: "0.0" };
                        }
                    }
                    break;
                case "Double":
                case "Decimal":
                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] != null && row[col] != undefined && row[col] != "undefined" && row[col] != 0) { //Kadambari
                            record[col] = row[col];
                        }
                        else {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            record[col] = "0.0";
                        }
                    }
                    break;
                case "BigInt":
                case "Integer":
                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] != null && row[col] != undefined && row[col] != "undefined" && row[col] != 0) { //Kadambari
                            record[col] = row[col];
                        }
                        else {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            record[col] = 0;
                        }
                    }
                    break;
                case "Boolean":
                    if (row[col] == "") {
                        row[col] = false;
                    }

                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        record[col] = row[col];
                    }
                    break;
                case "Uniqueidentifier":
                case "Owner":
                case "Status":
                case "State":
                    // To do in case of unique identifier/Owner field case
                    break;
                case "DateTime":
                    //record[col] = row[col].format("yyyy-MM-dd") + "T" + row[col].format("H:MM") + ":00.000Z";
                    if (row[col] != null && row[col] != undefined && row[col] != "undefined" && row[col] != "") {
                        if (col.toLowerCase() != "CreatedOn".toLowerCase() && col.toLowerCase() != "ModifiedOn".toLowerCase()) {
                            //record[col] = new Date(row[col]);
                            record[col] = getDateFormatted(row[col]);
                        }
                    }
                    else {
                        record[col] = null;
                    }
                    break;
                case "Image": // do nothing
                    break;
                default:
                    // Validate for Readonly fields
                    var isReadOnly = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Readonly);
                    if (isReadOnly < 0) {
                        if (row[col] == null || row[col] == undefined || row[col] == "undefined" || row[col] == "") {
                            // validate for required field
                            var isRequired = $.inArray(columns[i].Name.toLowerCase(), viewInfo.Required);
                            if (isRequired >= 0) {
                                continueSave = false;
                            }
                            else {
                                record[col] = row[col];
                            }
                        }
                        else {
                            record[col] = row[col];
                        }
                    }
                    break;
            }
            if (!continueSave) {
                alert(columns[i].DisplayName + " is required");
                showLoader(false);
                break;
            }
        }

        if (_isSubGrid) {
            // If subgrid then add the associated field
            if (record[_primaryentityattribute] == null || record[_primaryentityattribute] == undefined || record[_primaryentityattribute] == "undefined") {
                record[_primaryentityattribute] = { Id: _associatedEntityId, LogicalName: _associatedEntity };
            }
        }

        if (continueSave) {
            // Determine if this is an Update or an Insert
            if (row[primaryAttribute] != undefined) {
                isNew = false;
            }

            if (isNew) {
                Tribridge.OData.CreateRecord(record, Tribridge.OData.GetEntitySet(_entityName), index, pageCookiesPrevious);
            }
            else {
                record[primaryAttribute] = row[primaryAttribute];
                Tribridge.OData.UpdateRecord(record, Tribridge.OData.GetEntitySet(_entityName), index, pageCookiesPrevious, arg.uid);
            }
        }
        return continueSave;
    } catch (e) {
        throwError(e, functionName);
    }
};

// get CRM date formatted 0810
function getDateFormatted(inputDate) {
    if (inputDate != null && inputDate != undefined && inputDate != "undefined" && inputDate != "") {
        var month = inputDate.getMonth() + 1;
        var clientUrl = null;

        //get client url to check CRM type
        clientUrl = Xrm.Page.context.getClientUrl();

        if (clientUrl != null && clientUrl != undefined && clientUrl != "undefined" && clientUrl != "") {
            if (clientUrl.search("dynamics.com") == -1) {
                return inputDate;
            }
            else {
                return inputDate.getFullYear() + "-" + String("00" + month).slice(-2) + "-" + String("00" + inputDate.getDate()).slice(-2) + "T" + String("00" + inputDate.getHours()).slice(-2) + ":" + String("00" + inputDate.getMinutes()).slice(-2) + ":00.000Z";
            }
        }
        else {
            return inputDate.getFullYear() + "-" + String("00" + month).slice(-2) + "-" + String("00" + inputDate.getDate()).slice(-2) + "T" + String("00" + inputDate.getHours()).slice(-2) + ":" + String("00" + inputDate.getMinutes()).slice(-2) + ":00.000Z";
        }
    }
}

// Formats the date to CRM format
function dateToCRMFormat(date) {
    return dateFormat(date, "yyyy-mm-ddThh:MM:ss+" + (-date.getTimezoneOffset() / 60) + ":00");
}


// Formats the date into a certain format
function dateFormat(date, format) {
    var f = "";

    try {
        f = f + format.replace(/dd|mm|yyyy|MM|hh|ss|ms|APM|\s|\/|\-|,|\./ig,
        function match() {
            switch (arguments[0]) {
                case "dd":
                    var dd = date.getDate();
                    return (dd < 10) ? "0" + dd : dd;
                case "mm":
                    var mm = date.getMonth() + 1;
                    return (mm < 10) ? "0" + mm : mm;
                case "yyyy": return date.getFullYear();
                case "hh":
                    var hh = date.getHours();
                    return (hh < 10) ? "0" + hh : hh;
                case "MM":
                    var MM = date.getMinutes();
                    return (MM < 10) ? "0" + MM : MM;
                case "ss":
                    var ss = date.getSeconds();
                    return (ss < 10) ? "0" + ss : ss;
                case "ms": return date.getMilliseconds();
                case "APM":
                    var apm = date.getHours();
                    return (apm < 12) ? "AM" : "PM";
                default: return arguments[0];
            }
        });
    }
    catch (err) {
    }

    return f;
}


//Get all entities
Tribridge.OData.GetEntitySet = function (_entityName) {
    var functionName = "Tribridge.OData.GetEntitySet";

    try {
        var entitySet = "";
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            //url: parent.Tribridge.ViewEditor.GetServerUrl() + "/XRMServices/2011/OrganizationData.svc/",
            url: GetServerUrl() + "/XRMServices/2011/OrganizationData.svc/",
            async: false,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                var entitySets = data.d.EntitySets;
                var setLength = entitySets.length;
                for (var i = 0; i < setLength; i++) {
                    //if (entitySets[i].toLowerCase() == parent.Tribridge.ViewEditor.Command.Entity + "set") {
                    if (entitySets[i].toLowerCase() == _entityName + "set") {
                        entitySet = entitySets[i];
                        i = setLength;
                    }
                }
            }
        });
        return entitySet;
    } catch (e) {
        throwError(e, functionName);
    }
};

/// Get server URL
function GetServerUrl() {
    var functionName = "Tribridge.ViewEditor.GetServerUrl";

    try {
        var pathArray = window.location.pathname.split('/');
        //var serverUrl = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
        var serverUrl = window.location.protocol + "//" + window.location.host;

        if (typeof Xrm != 'undefined') {
            if (typeof Xrm.Page.context == "object") {
                if (typeof Xrm.Page.context.getClientUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getClientUrl();
                } else if (typeof Xrm.Page.context.getServerUrl != 'undefined') {
                    serverUrl = Xrm.Page.context.getServerUrl();
                } else {
                    serverUrl = document.location.protocol + "//" + document.location.host + "/" + Xrm.Page.context.getOrgUniqueName();
                }
            }
            else { throw new Error("Unable to access the server URL"); }
        }

        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl;
    } catch (e) {
        throwError(e, functionName);
    }
}


////Get Entity set
//Tribridge.OData.GetEntitySet = function () {
//    var entitySet = "";
//    XrmServiceToolkit.Soap.RetrieveAllEntitiesMetadata(["Entity"], true, Tribridge.OData.CB.RetrieveAllEntities);

//};

////Retrieve Entities Success Callback
//Tribridge.OData.CB.RetrieveAllEntities = function (data) {
//    var functionName = "Tribridge.OData.CB.RetrieveAllEntities:";

//    try {
//        debugger;
//        var entitySets = data.d.EntitySets;
//        var setLength = entitySets.length;
//        for (var i = 0; i < setLength; i++) {
//            if (entitySets[i].toLowerCase() == parent.Tribridge.ViewEditor.Command.Entity + "set") {
//                entitySet = entitySets[i];
//                i = setLength;
//            }
//        }
//    } catch (e) {
//        throwError(functionName + (e.message || e.description));
//    }
//    return entitySet;
//};


//Change Monitor to monitor the changes
Tribridge.OData.ChangeMonitor = function (arg) {
    var functionName = "Tribridge.OData.ChangeMonitor";
    try {
        var kGrid = $("#grid").data("kendoGrid");
        if (arg.action == "itemchange") {
            kGrid.showColumn(0);
        }

        // Commented by Kadambari

        //if (arg.action == undefined) {
        //    kGrid.hideColumn(0);
        //}
    } catch (e) {
        throwError(e, functionName);
    }
};

//Delete the entity record
Tribridge.OData.Delete = function (arg) {
    var functionName = "Tribridge.OData.Delete:";
    try {
        var kGrid = $("#grid").data("kendoGrid");
        var row = kGrid.dataItem(kGrid.select());
        var contact = new Object();
        var primaryAttribute = Tribridge.ViewEditor.CustomViews[0].PrimaryAttribute;

        contact[primaryAttribute] = row[primaryAttribute];

        Tribridge.OData.DeleteRecord(contact, Tribridge.ViewEditor.CustomViews[0].Schema + "Set");

    } catch (e) {
        throwError(e, functionName);
    }
}

//delete the entity record
Tribridge.OData.DeleteRecord = function (entityObject, odataSetName) {
    var functionName = "Tribridge.OData.DeleteRecord:";
    var primaryAttribute = Tribridge.ViewEditor.CustomViews[0].PrimaryAttribute;

    try {
        XrmServiceToolkit.Rest.Delete(entityObject[primaryAttribute], odataSetName, onDeleteRecordSuccess,
            function (error) { return showAlert("Error on the creation of record; Error – " + error); },
            true);
    } catch (e) {
        throwError(e, functionName);
    }
};

//success of delete record
function onDeleteRecordSuccess(data) {
    var functionName = "onDeleteRecordSuccess";
    try {
        $("#grid").data("kendoGrid").dataSource.read();
        alert("Record Deleted");
    } catch (e) {
        throwError(e, functionName);
    }
}

// This function creates record by making OData call
Tribridge.OData.CreateRecord = function (entityObject, odataSetName, index, pagecookie) {
    var functionName = "Tribridge.OData.CreateRecord";

    try {
        XrmServiceToolkit.Rest.Create(entityObject, odataSetName, function (result) { onRecordSuccess(result, index, pagecookie); },
            function (error) { onRecordError(error, entityObject, index, pagecookie, true); },
            true);
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.OData.RetrieveMultiple = function (entity) {
    var functionName = "Tribridge.OData.RetrieveMultipl";
    var resEntities;
    try {
        XrmServiceToolkit.Rest.RetrieveMultiple(entity, null, function (result) { resEntities = result; }, function (error) { throwError(error, functionName); }, function () { }, false);
        return resEntities;
    } catch (e) {
        throwError(e, functionName);
    }
}

////on success of create record
//function onCreateRecordError(error) {
//    var functionName = "onCreateRecordError";
//    try {
//        showLoader(false);
//        showAlert("Error on the creation of record; Error – " + error);
//    } catch (e) {
//        throwError(e, functionName);
//    }
//}

////on success of create record
//function onCreateRecordSuccess(data, index, pagecookie) {
//    var functionName = "onCreateRecordSuccess";
//    try {
//        Tribridge.ViewEditor.BindData(index, pagecookie);
//        //var kGrid = $("#grid").data("kendoGrid");
//        //kGrid.dataSource.read();
//        //showAlert("Record created successfully.");
//    } catch (e) {
//        throwError(e, functionName);
//    }
//}

Tribridge.OData.UpdateRecord = function (entityObject, odataSetName, index, pagecookie, uid) {
    var functionName = "Tribridge.OData.UpdateRecord";

    try {
        var primaryAttribute = Tribridge.ViewEditor.CustomViews[0].PrimaryAttribute;

        XrmServiceToolkit.Rest.Update(entityObject[primaryAttribute], entityObject, odataSetName, function (result) { onRecordSuccess(result, index, pagecookie); },
            function (error) { onRecordError(error, entityObject, index, pagecookie, false); },
            false);

    } catch (e) {
        throwError(e, functionName);
    }
};

function onRecordError(error, entityObject, index, pagecookie, isNewRec) {
    var functionName = "onRecordError";
    try {
        if (Tribridge.ViewEditor.RecordsProcessed_Count == Tribridge.ViewEditor.RecordsToSave_Count) {
            // Go on adding the failed records list 
            var errorRec = { record: entityObject, error: error, isNewRecord: isNewRec };
            Tribridge.ViewEditor.ErrorRecords.push(errorRec);

            Tribridge.ViewEditor.BindData(index, pagecookie);
        }
        //showLoader(false);
        //Tribridge.ViewEditor.BindData(index, pagecookie);
        //showAlert("Error on the updation of record; Error – " + error);
    } catch (e) {
        throwError(e, functionName);
    }
}

//on Updation of the record success
function onRecordSuccess(data, index, pagecookie) {
    var functionName = "onRecordSuccess";
    try {
        if (Tribridge.ViewEditor.RecordsProcessed_Count == Tribridge.ViewEditor.RecordsToSave_Count) {
            Tribridge.ViewEditor.BindData(index, pagecookie);
        }
        //HideLoading();

        // $("#grid").data("kendoGrid").dataSource.read();
        //showAlert("Record updated successfully.");
    } catch (e) {
        throwError(e, functionName);
    }
}

// ################################################### CALLBACK

// This callback method executes on succesful record creation
Tribridge.OData.CB.createRecordCompleted = function (data) {
    var functionName = "Tribridge.OData.CB.createRecordCompleted";

    try {
        var contact = data;
        showAlert("Record created");
    } catch (e) {
        throwError(e, functionName);
    }
};

// This callback method executes on succesful record update
Tribridge.OData.CB.updateRecordCompleted = function (data) {

    var functionName = "Tribridge.OData.CB.updateRecordCompleted";
    try {
        var contact = data;
        //showAlert("Record updated successfully");
    } catch (e) {
        throwError(e, functionName);
    }
};

//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        showLoader(false);
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
    } catch (e) {
        alert(functionName + "Error: " + (error.message || error.description));
    }
}

//shows alert
function showAlert(message) {
    try {
        Xrm.Utility.alertDialog(message, null)

    } catch (e) {
        alert(message);
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

        $("#updateStatus").fadeIn();
        $("#preloader").delay(350).fadeIn("fast");

    }
    else {

        $("#updateStatus").hide();
        $(document.body).find('#updateStatus').remove();

        $('body').removeAttr('disabled');
        $('body').find('input,textarea,select,button').removeAttr('disabled');

        $("#updateStatus").fadeOut(); // will first fade out the loading animation
        $("#preloader").delay(350).fadeOut("fast"); // will fade out the white DIV that covers the website.
    }
}