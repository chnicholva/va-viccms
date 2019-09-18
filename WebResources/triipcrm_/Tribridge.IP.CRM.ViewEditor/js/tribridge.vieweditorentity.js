/// <reference path="XrmServiceToolkit.js" />
/// <reference path="XrmPageTemplate.js" />
/// <reference path="jquery1.10.2.min.js" />


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Main Code
////////////////////////////////////////////////////////////////////////////////////////////////////

//Global variables
var _primaryEntityFlag = 0;
var _relatedEntityFlag = 0;
var _relatedentityprimaryId = "";
var _entityMetadataCollection = [];
var primaryentitydropdown;
var relatedentitydropdwon;

onLoad = function () {
    var functionName = "onLoad";
    HideLoading();
    try {
        //ShowBusyIndicator();
        // create DropDownList from select HTML element
       
        $("#ddlGridType").kendoDropDownList();

        var data = [{ text: "--Select Entity--", value: 0 }];

        $('#ddlPrimaryEntity').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            template:
  "<span class='k-state-default' title=\'${data['text']}\'>#: ((data.text.length>20)?data.text.substring(0, 20)+'...':data.text) #</span>",
            dataSource: data,
            index: 0
        });

        $('#ddlRelatedEntity').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: 0
            // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
        });

        $("#ddlRelatedEntity").data("kendoDropDownList").enable(false);

        var dataview = [{ text: "--Select View--", value: 0 }];
        $('#ddlPrimaryEntityView').kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: dataview,
            index: 0
        });

        $("#ddlPrimaryEntityView").data("kendoDropDownList").enable(false);

        //Get all the entity list
        GetEntityList();

        //Bind the related entity dropdown on grid type change
        $("#ddlGridType").on('change', function () {
            if ($("#ddlGridType").data("kendoDropDownList").value() == "399300001") {
                //fetch related entity with N:1 relationship
                _relatedEntityFlag = 1;

                //enabled the related entity dropdown
                $("#ddlRelatedEntity").data("kendoDropDownList").enable(true);
                if ($("#ddlPrimaryEntity").val() != 0) {
                    //get primary entity attributes
                    GetEntityAttributeList();
                }
                else {
                    showAlert("Please select primary entity");
                }
            }
            else {
                //Disable the related entity dropdown
                var datanew = [{ text: "--Select Entity--", value: 0 }];
                $('#ddlRelatedEntity').kendoDropDownList({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: datanew,
                    index: 0
                    // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
                });
                $("#ddlRelatedEntity").data("kendoDropDownList").enable(false);
            }
        });

        //Get all the primary entity views
        $("#ddlPrimaryEntity").on('change', function () {
            if ($("#ddlPrimaryEntity").val() != 0) {
                var selectedValue = $("#ddlPrimaryEntity").data("kendoDropDownList").value();
                if (selectedValue != 0) {
                    $("#ddlPrimaryEntityView").data("kendoDropDownList").enable(false);
                    ReadSavedViews($("#ddlPrimaryEntity").data("kendoDropDownList").value());
                }
                else {
                    //data.clear();
                    var datanew = [{ text: "--Select Entity--", value: 0 }];
                    $('#ddlRelatedEntity').kendoDropDownList({
                        dataTextField: "text",
                        dataValueField: "value",
                        dataSource: datanew,
                        index: 0
                        // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
                    });
                }
                //get primary entity attributes
                GetEntityAttributeList();
            }
            else {
                //clear the related view picklist
                //data.clear();
                var datanew = [{ text: "--Select Entity--", value: 0 }];
                $('#ddlPrimaryEntityView').kendoDropDownList({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: datanew,
                    index: 0
                    // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
                });

                //clear the related entity picklist
                $('#ddlRelatedEntity').kendoDropDownList({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: datanew,
                    index: 0
                    // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
                });

                $("#ddlPrimaryEntityView").data("kendoDropDownList").enable(false);
                $("#ddlRelatedEntity").data("kendoDropDownList").enable(false);
            }

        });

        //Create View editor entity on click of Save 
        $("#btnSave").click(function () {
            // disable the save button so as to prevent further clicks
            document.getElementById("btnSave").disabled = true;

            var primaryentAttri = "";
            var relatedentAttri = "";
            var viewId = "";
            var cols = ["firstname"];

            //show loader
            ShowLoading();

            if ($("#ddlGridType").data("kendoDropDownList").value() == "399300001" && $("#ddlRelatedEntity").val() == 0) {
                showAlert("Please select related entity");
                document.getElementById("btnSave").disabled = false ;
                HideLoading();
                return;
            }

            if ($("#ddlPrimaryEntity").val() == 0 && $("#ddlPrimaryEntityView").val() == 0) {
                showAlert("Please provide the necessary configuration");
                document.getElementById("btnSave").disabled = false;
                HideLoading();
                return;
            }

            if ($("#ddlPrimaryEntity").val() != 0 && $("#ddlPrimaryEntityView").val() == 0) {
                showAlert("Please select primary entity view");
                document.getElementById("btnSave").disabled = false;
                HideLoading();
                return;
            }

            var viewsplit = $("#ddlPrimaryEntityView").val().split("_");
            viewId = viewsplit[0];

            var viewname;

            if ($("#ddlRelatedEntity").val() != 0) {
                //viewname = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text() + "_" + $("#ddlRelatedEntity").val().split("-")[0];
                viewname = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text() + "_" + $("#ddlRelatedEntity").val();
            }
            else {
                viewname = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text();
            }

            //check view id exists
            var fetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
                        "<entity name='triipcrm_viewconfiguration'>" +
                        "<attribute name='triipcrm_name' />" +
                        "<order attribute='triipcrm_name' descending='false' />" +
                        "<filter type='and'>" +
                        //"<condition attribute='triipcrm_primaryentityviewid' operator='eq' value='" + viewId + "' />" +
                        "<condition attribute='triipcrm_name' operator='eq' value='" + viewname + "' />" +
                        "</filter>" +
                        "</entity>" +
                        "</fetch>";

            var retrieveView = XrmServiceToolkit.Soap.Fetch(fetch);
            if (retrieveView.length > 0) {
                showAlert("View configuration already exists for this view");
                HideLoading();
            }
            else {
                //Retrieve entity attributes for primary Entity
                SDK.Metadata.RetrieveEntity(SDK.Metadata.EntityFilters.Attributes,
                     $("#ddlPrimaryEntity").val(), null, true,
                     function (result) { successRetrieveAttributes(result, 2); },
                     function (error) { errorRetrieveEntityList(error); });
            }
        });

        //Cancel the changes on Cancel button
        $("#btnCancel").click(function () {
            ShowLoading();
            //Close window
            closeWindow();

        });

        // Enable save button
        document.getElementById("btnSave").disabled = false;

    } catch (e) {
        throwError(e, functionName);
    }
}

//Get all the entity list
GetEntityList = function () {

    SDK.Metadata.RetrieveAllEntities(SDK.Metadata.EntityFilters.Entity,
     false,
     successRetrieveEntityList,
     errorRetrieveEntityList);
}

GetEntityAttributeList = function () {

    $("#ddlRelatedEntity").data("kendoDropDownList").enable(false);
    //Retrieve entity attributes for primary Entity
    SDK.Metadata.RetrieveEntity(SDK.Metadata.EntityFilters.Attributes,
         $("#ddlPrimaryEntity").val(), null, true,
         function (result) { successRetrieveAttributes(result, 1); },
         function (error) { errorRetrieveEntityList(error); });
}

//Get the all system views
ReadSavedViews = function (entityName) {
    var odataSelect = Tribridge.Helper.GetODataServiceUrl() + "/SavedQuerySet?$select=Name,SavedQueryId&$filter=ReturnedTypeCode eq '" + entityName + "' and QueryType eq 0";
    var passthrough = [];
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: odataSelect,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {
            ReadUserViews(data.d.results, entityName);
        },
        error: errorRetrieveEntityList
    });
}

//Get the all personal/User views
ReadUserViews = function (saved, entityName) {
    //var kGrid = $(Tribridge.ViewEditor.Config.GridCSSId).data("kendoGrid");
    //var row = kGrid.dataItem(kGrid.select());

    var odataSelect = Tribridge.Helper.GetODataServiceUrl() + "/UserQuerySet?$select=Name,UserQueryId&$filter=ReturnedTypeCode eq '" + entityName + "' and QueryType eq 0";
    // var odataSelect = Tribridge.Helper.GetODataServiceUrl() + "/UserQuerySet?$select=Name&$filter=ReturnedTypeCode eq '" + entityName + "' and QueryType eq 0";
    var passthrough = [];
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: odataSelect,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {
            successRetrieveViews(saved, data.d.results);
        },
        error: errorRetrieveEntityList
    });
}

// success of retrieve entity list
successRetrieveEntityList = function (entityMetadataCollection) {
    var functionName = "successRetrieveEntityList:>>";
    try {
        var data = [{ text: "--Select Entity--", value: 0 }];
        var entityname = null;

        //_entityMetadataCollection = entityMetadataCollection;

        //entityMetadataCollection.sort(function (a, b) {
        //    if (a.SchemaName.toLowerCase() < b.SchemaName.toLowerCase())
        //    { return -1 }
        //    if (a.SchemaName.toLowerCase() > b.SchemaName.toLowerCase())
        //    { return 1 }
        //    return 0;
        //});

        //// Final one
        //entityMetadataCollection.sort(function (a, b) {
        //    if (a.DisplayName.UserLocalizedLabel != null && b.DisplayName.UserLocalizedLabel != null) {
        //        if (a.DisplayName.UserLocalizedLabel.Label.toLowerCase() < b.DisplayName.UserLocalizedLabel.Label.toLowerCase())
        //        { return -1 }
        //        if (a.DisplayName.UserLocalizedLabel.Label.toLowerCase() > b.DisplayName.UserLocalizedLabel.Label.toLowerCase())
        //        { return 1 }
        //        return 0;
        //    }
        //    else {
        //        return -1;
        //    }
        //});

        //entityMetadataCollection.sort(function (a, b) {
        //    // functionName = functionName + a.DisplayName.UserLocalizedLabel + "and" + a.DisplayName.UserLocalizedLabel.Label + "and" + a.SchemaName;
        //    if (a.DisplayName.UserLocalizedLabel != null && a.DisplayName.UserLocalizedLabel.Label != null && a.DisplayName.UserLocalizedLabel.Label.toLowerCase() < b.DisplayName.UserLocalizedLabel.Label.toLowerCase())
        //    { return -1 }
        //    else if (a.DisplayName.UserLocalizedLabel == null && a.SchemaName.toLowerCase() < b.SchemaName.toLowerCase()) {
        //        return -1
        //    }

        //    if (a.DisplayName.UserLocalizedLabel != null && a.DisplayName.UserLocalizedLabel.Label != null && a.DisplayName.UserLocalizedLabel.Label.toLowerCase() > b.DisplayName.UserLocalizedLabel.Label.toLowerCase())
        //    { return 1 }
        //    else if (a.DisplayName.UserLocalizedLabel == null && a.SchemaName.toLowerCase() > b.SchemaName.toLowerCase()) {
        //        return 1
        //    }
        //    return 0;
        //});

        //$.each(entityMetadataCollection, function (index, items) {
        //    if(entityMetadataCollection
        //});

        // var entityList = [];
        if (entityMetadataCollection.length > 0) {
            for (var x = 0; x < entityMetadataCollection.length; x++) {
                var entity = entityMetadataCollection[x];
                if (entity.IsCustomizable.Value == true) {
                    _entityMetadataCollection.push(entity);
                    //data.push({ Label: entity.SchemaName, Value: entity.LogicalName });
                    if (entity.DisplayName.UserLocalizedLabel != null)
                        entityname = entity.DisplayName.UserLocalizedLabel.Label;
                    else
                        entityname = entity.SchemaName;                    

                    // First check if the entity is not view editor configuration entities 
                    if (entity.SchemaName != "triipcrm_viewcolumn" && entity.SchemaName != "triipcrm_viewconfiguration") {
                        if (((entity.OwnershipType == "UserOwned" && entity.IsActivity == false) || (entity.IsCustomEntity && entity.IsActivity == false)) && entity.CanBePrimaryEntityInRelationship.Value && entity.CanCreateViews.Value && entity.IsValidForAdvancedFind && entity.IsCustomizable.Value && entity.IsImportable && entity.CanCreateCharts.Value) {
                            data.push({
                                text: entityname,
                                value: entity.LogicalName,
                                dir: "asc"
                            });
                        }
                    }
                }
            }
            //  $("#ddlPrimaryEntity").kendoDropDownList().sort(data);
        }

        // sort the entity list and then bind 

        data.sort(function (a, b) {
            if (a.text != null && b.text != null) {
                if (a.text.toLowerCase() < b.text.toLowerCase())
                { return -1 }
                if (a.text.toLowerCase() > b.text.toLowerCase())
                { return 1 }
                return 0;
            }
            else {
                return -1;
            }
        });

        // Bind DropDownList from input HTML element
        if (_relatedEntityFlag == 1) {
            $('#ddlRelatedEntity').kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: data,
                index: 0
                // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
            });
        }
        else {
            //  $('#ddlPrimaryEntity').kendoDropDownList({
            primaryentitydropdown = $("#ddlPrimaryEntity").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: data,
                index: 0
            });
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

// Displays the error returned from  SDK.Metadata.RetrieveAllEntities if it fails.
errorRetrieveEntityList = function (error) {
    var functionName = "errorRetrieveEntityList:>>";
    try {
        HideLoading();
        showAlert("An Error occurred: " + error);
    } catch (e) {
        throwError(e, functionName);
    }
}

//success of get all primary entity views
successRetrieveViews = function (saved, user) {
    var data = [{ text: "--Select View--", value: 0 }];


    saved.sort(function (a, b) {
        if (a.Name.toLowerCase() < b.Name.toLowerCase())
        { return -1 }
        if (a.Name.toLowerCase() > b.Name.toLowerCase())
        { return 1 }
        return 0;
    });

    user.sort(function (a, b) {
        if (a.Name < b.Name)
        { return -1 }
        if (a.Name > b.Name)
        { return 1 }
        return 0;
    });

    if (saved.length > 0) {
        for (var i = 0; i < saved.length; i++) {
            var save = saved[i];

            data.push({
                text: save.Name,
                value: save.SavedQueryId + "_" + "SavedQuery"
            });
        }
    }

    if (user.length > 0) {
        for (var i = 0; i < user.length; i++) {
            var users = user[i];

            data.push({
                text: users.Name,
                value: users.UserQueryId + "_" + "UserQuery"
            });
        }
    }

    // bind view dropdown from input HTML element
    $('#ddlPrimaryEntityView').kendoDropDownList({
        cascadeFrom: "primaryentitydropdown",
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0
    });
    $("#ddlPrimaryEntityView").data("kendoDropDownList").enable(true);
}

successRetrieveAttributes = function (EntityMetadata, primrelFlag) {
    var attributes = EntityMetadata.Attributes;
    var lookupRecords = new Array();
    var primlogicalName = null;
    var entityAttri = _entityMetadataCollection;
    var entityDisplayName = null;
    var primlogical = null;

    var data = [{ text: "--Select Entity--", value: 0 }];

    if (primrelFlag == 1) {
        if ($("#ddlGridType").data("kendoDropDownList").value() == "399300001") {
            var attri = EntityMetadata.Attributes;
            $.each(attri, function (index, item) {
                if (attri[index].AttributeType == "Lookup" || attri[index].AttributeType == "Customer" || attri[index].AttributeType == "Owner" || attri[index].AttributeType == "Uniqueidentifier") {
                    lookupRecords.push(attri[index]);
                }
            });
            if (lookupRecords.length > 0) {
                // $.each(lookupRecords, function (i, items) {
                for (var x = 0; x < lookupRecords.length; x++) {
                    var entity = lookupRecords[x];
                    if (lookupRecords[x].Targets != null) {
                        if (lookupRecords[x].Targets.length > 0) {
                            for (var i = 0; i < lookupRecords[x].Targets.length; i++) {
                                $.each(entityAttri, function (index, item) {
                                    if (entityAttri[index].DisplayName.UserLocalizedLabel != null) {
                                        //if (entityAttri[index].DisplayName.UserLocalizedLabel.Label.toLowerCase() == lookupRecords[x].Targets[i].toLowerCase()) {
                                        if (entityAttri[index].LogicalName == lookupRecords[x].Targets[i].toLowerCase()) {
                                            entityDisplayName = entityAttri[index].DisplayName.UserLocalizedLabel.Label;
                                            data.push({
                                                text: entityDisplayName + " (" + lookupRecords[x].SchemaName + ")", //entity.SchemaName,
                                                value: lookupRecords[x].Targets[i] + "-" + lookupRecords[x].SchemaName// entity.LogicalName
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                //  });
            }

            // Bind DropDownList from input HTML element
            $('#ddlRelatedEntity').kendoDropDownList({
                cascadeFrom: "primaryentitydropdown",
                dataTextField: "text",
                dataValueField: "value",
                dataSource: data,
                index: 0
                // change: Tribridge.ViewEditor.Events.ChangeLookupEntity
            });
            $("#ddlRelatedEntity").data("kendoDropDownList").enable(true);
        }
    }
    else {
        if ($("#ddlRelatedEntity").val() != 0) {
            primlogical = $("#ddlRelatedEntity").val().split("-");
            primlogicalName = primlogical[0];
        }
        successRetrieveRelatedAttributes(primlogicalName);
    }
    //HideLoading();
}

successRetrieveRelatedAttributes = function (logicalName) {
    var entityName = null;
    var metadata = null;

    if ($("#ddlRelatedEntity").val() != 0) {
        entityName = $("#ddlRelatedEntity").val().split("-");
        entityName = entityName[0];

        //Retrieve entity attributes for primary Entity
        SDK.Metadata.RetrieveEntity(SDK.Metadata.EntityFilters.Attributes,
             entityName, null, true,
             function (result) { CreateEntityRecordSuccess(result, logicalName); },
             function (error) { errorRetrieveEntityList(error); });
    }
    else {
        CreateEntityRecordSuccess(metadata, logicalName)
    }
}

function CreateEntityRecordSuccess(EntityMetadata, logicalName) {
    var functionName = "CreateEntityRecordSuccess";
    var lookupRecords = new Array();
    var rellogicalName = null;
    var viewtype = null;
    var viewsplit = null;

    try {
        if (EntityMetadata != null) {
            rellogicalName = EntityMetadata.PrimaryIdAttribute;
        }

        viewsplit = $("#ddlPrimaryEntityView").val().split("_");
        viewId = viewsplit[0];
        viewtype = viewsplit[1];

        // Create view editor entity
        var entityObj = new XrmServiceToolkit.Soap.BusinessEntity("triipcrm_viewconfiguration")

        entityObj.attributes["triipcrm_primaryentity"] = $("#ddlPrimaryEntity").val();
        entityObj.attributes["triipcrm_gridtype"] = { value: ($("#ddlGridType").val()), type: "OptionSetValue" };
        if ($("#ddlRelatedEntity").val() != 0) {
            //entityObj.attributes["triipcrm_name"] = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text() + "_" + $("#ddlRelatedEntity").val().split("-")[0];
            entityObj.attributes["triipcrm_name"] = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text() + "_" + $("#ddlRelatedEntity").val();
            entityObj.attributes["triipcrm_relatedentity"] = $("#ddlRelatedEntity").val().split("-")[0];
            entityObj.attributes["triipcrm_primaryentityattribute"] = $("#ddlRelatedEntity").val().split("-")[1];
        }
        else {
            entityObj.attributes["triipcrm_name"] = $("#ddlPrimaryEntity").val() + "_" + $("#ddlPrimaryEntityView").data("kendoDropDownList").text();
            entityObj.attributes["triipcrm_relatedentity"] = null;
            entityObj.attributes["triipcrm_primaryentityattribute"] = null;
        }

        entityObj.attributes["triipcrm_relatedentityattribute"] = rellogicalName;
        entityObj.attributes["triipcrm_primaryentityviewid"] = viewId;
        entityObj.attributes["triipcrm_primaryentityviewname"] = $("#ddlPrimaryEntityView").data("kendoDropDownList").text();
        entityObj.attributes["triipcrm_viewtype"] = viewtype.toLowerCase();


        //Create record
        var viewEdiId = XrmServiceToolkit.Soap.Create(entityObj);

        //Open View editor entity
        Xrm.Utility.openEntityForm("triipcrm_viewconfiguration", viewEdiId);
        HideLoading();
        closeWindow();
    } catch (e) {

    }
}


//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        HideLoading();
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
    } catch (e) {
        alert(functionName + "Error: " + (error.message || error.description));
    }
}

//shows alert
function showAlert(message) {
    try {
        HideLoading();
        Xrm.Utility.alertDialog(message, null)

    } catch (e) {
        alert(message);
    }
}

////closes the window
//function CloseWindow() {

//    window.close();
//}

//close window
//function closeWindow() {
//    var functionName = "closeWindow";
//    try {
//        //check is crm version is not 2011
//        if (isValid(Xrm.Utility.alertDialog) && isValid(parent.top) && isValid(parent.top.$("#ms-crm-InlineDialogCloseImage"))) {
//            parent.top.$("#ms-crm-InlineDialogCloseImage").click();
//        }
//        else { window.close(); }

//        //closeWindow();
//    } catch (e) {
//        throwError(e, functionName);
//    }
//}

//close window
function closeWindow() {
    var functionName = "closeClickToExport";
    try {
        if (isValid(Xrm.Utility.alertDialog)) {
            if (isValid(parent.top.$("#InlineDialog_Background"))) {
                parent.top.$("#InlineDialog_Background").remove();
            }
            if (isValid(parent.top.$("#InlineDialog"))) {
                parent.top.$("#InlineDialog").remove();
            }
        }
        else { window.close(); }

        //closeWindow();
    } catch (e) {
        throwError(functionName, e);
    }
}

// Region View Editor Edit
function viewConfigurationLoad() {
    var functionName = "viewConfigurationLoad";
    try {
        var gridType = Xrm.Page.getAttribute("triipcrm_gridtype").getValue();

        if (gridType == "399300001") { // associated grid
            Xrm.Page.getAttribute("triipcrm_isdefault").setValue(0);
            Xrm.Page.getControl("triipcrm_isdefault").setDisabled(true);
        }
        else {//home grid
            Xrm.Page.getControl("triipcrm_isdefault").setDisabled(false);
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

//on change of the is default field check already default view 
function viewConfigurationDefaultchange() {
    var functionName = "viewConfigurationDefaultchange";
    try {

        var primEntity = Xrm.Page.getAttribute("triipcrm_primaryentity").getValue();

        if (Xrm.Page.getAttribute("triipcrm_isdefault").getValue() == "1") {
            //check the any entity exists with default view
            var defaultFetch = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
            "<entity name='triipcrm_viewconfiguration'>" +
              "<attribute name='triipcrm_name' />" +
              "<attribute name='triipcrm_primaryentity' />" +
              "<attribute name='triipcrm_isdefault' />" +
              "<attribute name='triipcrm_gridtype' />" +
              "<attribute name='triipcrm_viewconfigurationid' />" +
              "<order attribute='triipcrm_name' descending='false' />" +
              "<filter type='and'>" +
                "<condition attribute='triipcrm_isdefault' operator='eq' value='1' />" +
                "<condition attribute='triipcrm_primaryentity' operator='eq' value='" + primEntity + "' />" +
              "</filter>" +
            "</entity>" +
          "</fetch>";

            var defaultRecords = XrmServiceToolkit.Soap.Fetch(defaultFetch);
            if (defaultRecords != null && defaultRecords.length > 0) {
                Xrm.Page.getAttribute("triipcrm_isdefault").setValue(0);
                showAlert("You have already configured view for this entity as default view.");
            }
        }
    } catch (e) {
        throwError(e, functionName);
    }
}

// End Region View Editor Edit
