/// <reference path="XrmServiceToolkit.js" />

if (typeof Tribridge == "undefined")
    Tribridge = {};
if (typeof Tribridge.OData == "undefined")
    Tribridge.OData = {};

/**
 * KENDO UI VIEW EDITOR ODATA
 * FOR CRM 2011 & CRM 2013
 * 
 * @author: Angelo Ortega 
 * @version: 
 * - 1.0 (25/08/2014, Angelo Ortega)
 *  + GetSavedQuery
 *  + GetUserQuery
 * - 1.1 (11/12/2014, Leopoldo Moranchel)
 *  Updated Tribridge.OData.Private.ParseView to improve loading time
 */

// Namespaces
Tribridge.OData = {}; // Namespace, default
Tribridge.OData.Private = {}; // Namespace for private methods

/**
 * @desc Gets the view metadata (SavedQuery, UserQuery)
 *
 * @param entity - The entity type code.
 * @param viewname - The view name.
 * 
 * @required entityname, viewname
 */
Tribridge.OData.GetQueryView = function (entity, viewname, successCallback, errorCallback, passthrough) {
    var functionName = "Tribridge.OData.GetQueryView";
    try {
        Tribridge.OData.Private.GetSavedQuery(entity, viewname, successCallback, errorCallback, passthrough);
    } catch (e) {
        throwError(e, functionName);
    }
};


//Generic function for throwing an error
function throwError(error, functionName) {
    try {
        HideLoading();
        HideBusyIndicator();
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.description || error.message));
    } catch (e) {
        HideBusyIndicator();
        alert(functionName + "Error: " + (error.message || error.description));
    }
}

//Hide Loader
function HideBusyIndicator() {
    try {
        $("#status").fadeOut(); // will first fade out the loading animation
        $("#preloader").delay(350).fadeOut("fast"); // will fade out the white DIV that covers the website.
    } catch (e) {
        //hideLoading();
    }
}

// ################################################ PRIVATE METHODS

/**
 * @desc Gets the view metadata (SavedQuery, UserQuery)
 *
 * @param entity - The entity type code.
 * @param viewname - The view name.
 * 
 * @required entityname, viewname
 */
Tribridge.OData.Private.GetSavedQuery = function (entity, viewname, successCallback, errorCallback, passthrough) {
    var functionName = "Tribridge.OData.Private.GetSavedQuery";

    try {
        var request = Tribridge.OData.Private.GetServerUrl() + "SavedQuerySet?$select=SavedQueryId,FetchXml,LayoutXml&$top=1&$filter=Name eq '" + viewname + "' and ReturnedTypeCode eq '" + entity + "' and LayoutXml ne null";
        Tribridge.OData.Private.Call(request, Tribridge.OData.Private.GetUserQuery, errorCallback, { entity: entity, viewname: viewname, successCallback: successCallback, errorCallback: errorCallback, passthrough: passthrough });
    } catch (e) {
        throwError(e, functionName);
    }
};
Tribridge.OData.Private.GetUserQuery = function (data, passthrough) {
    var functionName = "Tribridge.OData.Private.GetUserQuery";

    try {
        var request = Tribridge.OData.Private.GetServerUrl() + "UserQuerySet?$select=UserQueryId,FetchXml,LayoutXml&$top=1&$filter=Name eq '" + passthrough.viewname + "' and ReturnedTypeCode eq '" + passthrough.entity + "' and LayoutXml ne null";
        var newPassthrough = {};
        newPassthrough['passthrough1'] = passthrough;
        newPassthrough['passthrough2'] = data; // Add data
        Tribridge.OData.Private.Call(request, Tribridge.OData.Private.ParseView, passthrough.errorCallback, newPassthrough);
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.OData.Private.ParseView = function (viewConfig, viewColumns) {
    var functionName = "Tribridge.OData.Private.ParseView";
    // Check first if a standard view is present.
    try {
        //var userQueryViews = data;
        //var savedQueryViews = passthrough.passthrough2;
        //var pass = passthrough.passthrough1;

        var results = [];
        var entityInfo = null;
        var stateCodeExists = false;
        var obj = { Id: viewConfig.triipcrm_primaryentityviewid };

        // Get all the attributes of the entity of the View
        results = Tribridge.CRMSDK.METADATA.RetrieveEntity(viewConfig["triipcrm_primaryentity"], Tribridge.CRMSDK.METADATA.EntityFilters.Attributes, null, true, null, null, null)
                
        //check state code exists
        if (results.Attributes["statecode"] != undefined)
            stateCodeExists = true;

        // Get the columns from ViewColumns entity
        var columns = [];
        $.each(viewColumns, function (index, value) {
            columns.push(value["triipcrm_columnlogicalname"]);
            //columns.push(attrib.substring(n+1, l));
        });

        // Add primarykey too
        columns.push(results.PrimaryIdAttribute);

        // Add dummy column for saving if record is active/inactive)
        // columns.push("_IsActiveRecord");
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        // Parse the metadata results
        var types = [];
        var schemas = [];
        var optionsets = [];
        var lookupsets = [];
        var displaynames = [];
        var datetimeSets = [];
        var arrColumn = new Array()
        var entityArray = new Array();
        if (results.Attributes != null) {

            //Get Array of columns of the grid
            $.each(columns, function (index, item) {
                if (results.Attributes[item] != undefined) {
                    arrColumn.push(results.Attributes[item]);
                }
            });


            for (var prop in arrColumn) {
                types[arrColumn[prop].AttributeLogicalName] = arrColumn[prop].AttributeType;
                schemas[arrColumn[prop].AttributeLogicalName] = arrColumn[prop].SchemaName;
                displaynames[arrColumn[prop].AttributeLogicalName] = arrColumn[prop].AttributeName;
                schemas[results.Name] = results.SchemaName;

                if (arrColumn[prop].hasOwnProperty("Options")) {
                    if (arrColumn[prop].Options != null && arrColumn[prop].Options.length > 0) {
                        optionsets[arrColumn[prop].AttributeLogicalName] = arrColumn[prop].Options;
                    }
                }

                // if (arrColumn[prop].hasOwnProperty("Targets")) {
                //  || arrColumn[prop].AttributeType == "Uniqueidentifier"
                if (arrColumn[prop].AttributeType == "Lookup" || arrColumn[prop].AttributeType == "Owner" || arrColumn[prop].AttributeType == "Customer") {
                    if (arrColumn[prop].Targets != null && arrColumn[prop].Targets.length > 0) {
                        var objTargets = [];
                        for (var y = 0; y < arrColumn[prop].Targets.length; y++) {
                            // push entity names in array
                            entityArray.push(arrColumn[prop].Targets[y].Entity);

                            objTargets.push({ Entity: arrColumn[prop].Targets[y].Entity });//, EntityName: entityName, EntityObjectCode: objectCode, SchemaName: entityTargetAttributes.SchemaName, PrimaryAttributeSchema: primaryAtt, PrimaryIdAttributeSchema: primaryIdAtt });
                        }
                        lookupsets[arrColumn[prop].AttributeLogicalName] = objTargets;
                        //lookupsets[arrColumn[prop].SchemaName] = objTargets;
                    }
                }

                // datetime format
                if (arrColumn[prop].AttributeType == "DateTime")
                {
                    var attributeReq = "<request i:type='a:RetrieveAttributeRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>"+
                                        "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>"+
                                            "<a:KeyValuePairOfstringanyType>"+
                                            "<b:key>MetadataId</b:key>"+
                                            "<b:value i:type='c:guid' xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/'>00000000-0000-0000-0000-000000000000</b:value>"+
                                            "</a:KeyValuePairOfstringanyType>"+
                                            "<a:KeyValuePairOfstringanyType>"+
                                            "<b:key>RetrieveAsIfPublished</b:key>"+
                                            "<b:value i:type='c:boolean' xmlns:c='http://www.w3.org/2001/XMLSchema'>false</b:value>"+
                                            "</a:KeyValuePairOfstringanyType>"+
                                            "<a:KeyValuePairOfstringanyType>"+
                                            "<b:key>EntityLogicalName</b:key>"+
                                            "<b:value i:type='c:string' xmlns:c='http://www.w3.org/2001/XMLSchema'>" + viewConfig.triipcrm_primaryentity + "</b:value>" +
                                            "</a:KeyValuePairOfstringanyType>"+
                                            "<a:KeyValuePairOfstringanyType>"+
                                            "<b:key>LogicalName</b:key>"+
                                            "<b:value i:type='c:string' xmlns:c='http://www.w3.org/2001/XMLSchema'>" + arrColumn[prop].AttributeLogicalName + "</b:value>" +
                                            "</a:KeyValuePairOfstringanyType>"+
                                        "</a:Parameters>"+
                                        "<a:RequestId i:nil='true' />"+
                                        "<a:RequestName>RetrieveAttribute</a:RequestName>"+
                                        "</request>"

                    var attriResp = XrmServiceToolkit.Soap.Execute(attributeReq);

                    // get the datetime format and store in array of datetimesets
                    if (attriResp != null && attriResp != undefined)
                    {
                        // For browsers other than IE
                        var dateFormat;
                        if ($($(attriResp).find("Format")).text() != null && $($(attriResp).find("Format")).text() != undefined && $($(attriResp).find("Format")).text() != "") {
                            dateFormat = $($(attriResp).find("Format")).text();
                        }
                        else {
                            // For IE browser
                            var reqXml = $.parseXML(attriResp.xml);
                            dateFormat = $($(reqXml).find("c\\:Format")).text();
                        }
                        datetimeSets.push({ AttributeName: arrColumn[prop].AttributeLogicalName, format: dateFormat });
                    }
                }
            }
        }

        // Add dummy column for saving if record is (active/inactive)
        schemas["_IsActiveRecord"] = "_IsActiveRecord";

        obj.PrimaryIdAttributeSchema = results.PrimaryAttribute;
        obj.PrimaryAttributeSchema = results.PrimaryIdAttribute;
        obj.Schema = results.SchemaName;
        //obj.Odata = Tribridge.OData.Private.RetrieveViewUrl(xmlDoc, types, schemas);
        obj.AttributeNames = schemas;
        obj.DisplayNames = displaynames;
        obj.AttributeTypes = types;
        obj.OptionSets = optionsets;
        obj.EntityTypeCode = results.ObjectCode;
        obj.Targets = lookupsets;
        obj.ViewType = viewConfig.triipcrm_viewtype;
        obj.stateCodeExists = stateCodeExists;
        obj.EntityNames = entityArray;
        obj.DateTimeFormats = datetimeSets;

        //pass.successCallback(obj, pass.passthrough);
        Tribridge.ViewEditor.CB.ParseViewMetadata(obj, 0);
        //HideBusyIndicator();
    } catch (e) {
        throwError(e, functionName);
    }
};

Tribridge.OData.Private.RetrieveViewUrl = function (xmlDoc, arr, arrSchemas) {
    var functionName = "Tribridge.OData.Private.RetrieveViewUrl";

    try {
        var odataString = Tribridge.Helper.FetchXmlHeaderToOdata(xmlDoc, arr, arrSchemas);
        var filter = Tribridge.Helper.FetchXmlConditionsToOdata(xmlDoc, arr, arrSchemas);
        var select = Tribridge.Helper.FetchXmlColumnSetToOdata(xmlDoc, arr, arrSchemas);
        var order = Tribridge.Helper.FetchXmlOrderToOdata(xmlDoc, arr, arrSchemas);

        return { ODataUrl: odataString, Select: select, Filter: filter, Order: order };
    } catch (e) {
        throwError(e, functionName);
    }
}

/**
 * @desc Ajax ODATA Service Call.
 *
 * @param request - The request odata url.
 * @param successCallback - The success callback method.
 * @param errorCallback - The error callback method. 
 *
 * @required request, successCallback
 */
Tribridge.OData.Private.Call = function (request, successCallback, errorCallback, passthrough) {
    var functionName = "Tribridge.OData.Private.Call";
    try {
        // Make Ajax Call
        var req = $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: request,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                successCallback(data, passthrough);
            },
            error: errorCallback != null ? errorCallback : Tribridge.OData.Private.Error
        });
    } catch (e) {
        throwError(e, functionName);
    }
};

/**
 * @desc The error default callback method.
 *
 * @param XmlHttpRequest - The request data.
 * @param textStatus - The status.
 * @param errorThrown - The error thrown. 
 *
 */
Tribridge.OData.Private.Error = function (XmlHttpRequest, textStatus, errorThrown) {

}

/**
 * @desc Returns the crm service url.
 */
Tribridge.OData.Private.GetServerUrl = function () {
    var functionName = "Tribridge.OData.Private.GetServerUrl";

    try {
        //return "http://devserver:5555/TribridgeDev/XRMServices/2011/OrganizationData.svc/";

        var OrgServicePath = "/XRMServices/2011/OrganizationData.svc/";
        var serverUrl = "";
        // Check if form call
        if (typeof Xrm != 'undefined') {
            if (typeof Xrm.Page.context == "object") {
                if (typeof Xrm.Page.context.getClientUrl == 'function') {
                    serverUrl = Xrm.Page.context.getClientUrl();
                } else if (typeof Xrm.Page.context.getServerUrl == 'function') {
                    serverUrl = Xrm.Page.context.getServerUrl();
                } else {
                    var pathArray = window.location.pathname.split('/');
                    //serverUrl = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
                    serverUrl = window.location.protocol + "//" + window.location.host;
                }
            }
            else { throw new Error("Unable to access the server URL"); }
        } else {
            // Get orga
            var pathArray = window.location.pathname.split('/');
            //serverUrl = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
            serverUrl = window.location.protocol + "//" + window.location.host;
        }

        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl + OrgServicePath;
    } catch (e) {
        throwError(e, functionName);
    }
};