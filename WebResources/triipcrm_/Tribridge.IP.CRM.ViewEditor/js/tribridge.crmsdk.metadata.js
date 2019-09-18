/// <reference path="XrmServiceToolkit.js" />

if (typeof Tribridge == "undefined")
    Tribridge = {};
if (typeof Tribridge.CRMSDK == "undefined")
    Tribridge.CRMSDK = {};


/**
 * MS CRM CONNECTOR JS <> SOAP 
 * CRM 2011 & CRM 2013
 * 
 * @author: Angelo Ortega 
 * @version: 
 * - 1.0 (06/12/2014, Angelo Ortega)
 * RetrieveAttribute added
  * - 1.0 (07/05/2014, Angelo Ortega)
 * RetrieveEntity added
 * - 2.0 (09/04/2014, Angelo Ortega)
 * Bugfixes etc.
 */

Tribridge.CRMSDK.METADATA = {};
Tribridge.CRMSDK.METADATA.Private = {};
Tribridge.CRMSDK.METADATA.EntityFilters = {};


/**
 * @desc Retrieves the metadata for an attribute
 *
 * @param entityName - The unique key.
 * @param attributeName - The value.
 * @param metadataId - The metadata id (If no attributename/entityname provided)
 * @param asIfPublished - Defines if the attribute metadata should be published.
 * @param successCallBack - The success callback function.
 * @param errorCallBack - The error callback function.
 * @param passthrough - The passthrough object.
 *
 * @required entityName,attributeName,asIfPublished,successCallBack
 */
Tribridge.CRMSDK.METADATA.RetrieveAttribute = function (entityName, attributeName, metadataId, asIfPublished, successCallBack, errorCallBack, passthrough) {

    var entityLogicalNameValueNode;

    if (Tribridge.CRMSDK.METADATA.IsNullOrEmpty(entityName))
        entityLogicalNameValueNode = '<b:value i:nil="true" />';
    else
        entityLogicalNameValueNode = '<b:value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">' + entityName.toLowerCase() + '</b:value>';

    var logicalNameValueNode;
    if (Tribridge.CRMSDK.METADATA.IsNullOrEmpty(attributeName))
        logicalNameValueNode = '<b:value i:nil="true" />';
    else
        logicalNameValueNode = '<b:value i:type="c:string"   xmlns:c="http://www.w3.org/2001/XMLSchema">' + attributeName.toLowerCase() + '</b:value>';

    if (Tribridge.CRMSDK.METADATA.IsNullOrEmpty(metadataId))
        metadataId = "00000000-0000-0000-0000-000000000000";

    var request = [
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">',
         '<soapenv:Body>',
          '<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">',
           '<request i:type="a:RetrieveAttributeRequest" xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts">',
            '<a:Parameters xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">',
             '<a:KeyValuePairOfstringanyType>',
              '<b:key>EntityLogicalName</b:key>',
               entityLogicalNameValueNode,
             '</a:KeyValuePairOfstringanyType>',
             '<a:KeyValuePairOfstringanyType>',
              '<b:key>MetadataId</b:key>',
              '<b:value i:type="ser:guid"  xmlns:ser="http://schemas.microsoft.com/2003/10/Serialization/">' + metadataId + '</b:value>',
             '</a:KeyValuePairOfstringanyType>',
              '<a:KeyValuePairOfstringanyType>',
              '<b:key>RetrieveAsIfPublished</b:key>',
            '<b:value i:type="c:boolean" xmlns:c="http://www.w3.org/2001/XMLSchema">' + asIfPublished.toString() + '</b:value>',
             '</a:KeyValuePairOfstringanyType>',
             '<a:KeyValuePairOfstringanyType>',
              '<b:key>LogicalName</b:key>',
               logicalNameValueNode,
             '</a:KeyValuePairOfstringanyType>',
            '</a:Parameters>',
            '<a:RequestId i:nil="true" />',
            '<a:RequestName>RetrieveAttribute</a:RequestName>',
           '</request>',
          '</Execute>',
         '</soapenv:Body>',
        '</soapenv:Envelope>'].join('');


    var req = new XMLHttpRequest();
    req.open("POST", Tribridge.CRMSDK.METADATA.GetServerUrl(), (successCallBack != null));
    try { req.responseType = 'msxml-document' } catch (e) { }
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    if (successCallBack != null) {
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                req.onreadystatechange = null; //Addresses potential memory leak issue with IE
                if (req.status == 200) {
                    //Success
                    var docText = req.responseText;
                    var docXml = req.responseXML;
                    // Set namespaces
                    try {
                        docXml.setProperty("SelectionNamespaces", Tribridge.CRMSDK.METADATA.Private.GetSelectionNamespaces().join(" "));
                    } catch (e) {
                        // DO NOTHING 
                    }

                    successCallBack(Tribridge.CRMSDK.METADATA.SoapParseAttributeResponse(docXml), passthrough);
                }
                else {
                    if (!Tribridge.CRMSDK.METADATA.IsNullOrEmpty(errorCallBack))
                        errorCallBack(req, passthrough);
                }
            }
        };
        req.send(request);
    } else {
        req.send(request);
        //Success
        var docText = req.responseText;
        var docXml = req.responseXML;
        return Tribridge.CRMSDK.METADATA.SoapParseAttributeResponse(docXml);
    }

};

Tribridge.CRMSDK.METADATA.RetrieveEntity = function (entityName, entityFilter, metadataId, asIfPublished, successCallBack, errorCallBack, passthrough) {

    if (entityName == null || entityName == "" && metadataId == null) {
        throw new Error("SDK.Metadata.RetrieveEntity requires either the LogicalName or MetadataId parameter not be null.");
    }

    if (entityName != null || entityName != "") {
        if (typeof entityName != "string") {
            throw new Error("SDK.Metadata.RetrieveEntity LogicalName must be a string value.");
        }
        metadataId = "00000000-0000-0000-0000-000000000000";
    }

    if (metadataId != null && entityName == null || entityName == "") {
        if (typeof metadataId != "string") {
            throw new Error("SDK.Metadata.RetrieveEntity MetadataId must be a string value.");
        }
    }

    var entityLogicalNameValueNode = "";
    if (entityName == null || entityName == "") {
        entityLogicalNameValueNode = "<b:value i:nil=\"true\" />";
    }
    else {
        entityLogicalNameValueNode = "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + entityName.toLowerCase() + "</b:value>";
    }

    //Kadambari- Start
    //Added by Kadambari
    //var data = XrmServiceToolkit.Soap.RetrieveEntityMetadata(entityFilter, entityName, asIfPublished, Tribridge.CRMSDK.METADATA.SoapParseAttributeResponse);

    var data = XrmServiceToolkit.Soap.RetrieveEntityMetadata(entityFilter, entityName, asIfPublished);

    if (data != null && data[0] != null) {
        var schemaname = null;
        var objectcode = null;
        var logical = null;
        var primaryIdAttribute = null;
        var primaryNameAttribute = null;
        var attType = null;
        var attLabel = null;
        var entity = null;
        var att = null;
        var schema = null;
        var options = null;
        var attOf = null;
        var display = null;
        var link = null;
        var targets = null;

        if (data[0].SchemaName != null)
            schemaname = data[0].SchemaName;
        if (data[0].ObjectTypeCode != null)
            objectcode = data[0].ObjectTypeCode;
        if (data[0].LogicalName != null)
            logical = data[0].LogicalName;
        if (data[0].PrimaryIdAttribute != null)
            primaryIdAttribute = data[0].PrimaryIdAttribute;
        if (data[0].PrimaryNameAttribute != null)
            primaryNameAttribute = data[0].PrimaryNameAttribute;

        var retCollection = [];

        if (data[0].Attributes != null) {
            $.each(data[0].Attributes, function (index, attribute) {
                if (attribute.AttributeType != null)
                    attType = attribute.AttributeType;
                if (attribute.DisplayName.UserLocalizedLabel != null)
                    attLabel = attribute.DisplayName.UserLocalizedLabel.Label;
                if (attribute.EntityLogicalName != null)
                    entity = attribute.EntityLogicalName;
                if (attribute.LogicalName != null)
                    att = attribute.LogicalName;
                if (attribute.SchemaName != null)
                    schema = attribute.SchemaName;
                if (attribute.OptionSet != null)
                    options = attribute.OptionSet;
                if (attribute.AttributeOf != null)
                    attOf = attribute.AttributeOf;
                if (attribute.DisplayName.UserLocalizedLabel != null) {
                    display = attribute.DisplayName.UserLocalizedLabel.Label;
                }
                if (attribute.LinkedAttributeId != null)
                    link = attribute.LinkedAttributeId;

                if (attribute.Targets != null)
                    targets = attribute.Targets;

                var retObj = {
                    AttributeType: attType,
                    AttributeName: attLabel,
                    AttributeOf: attOf,
                    DisplayName: display,
                    LinkedAttributeId: link,
                    AttributeLogicalName: att,
                    EntityLogicalName: entity,
                    SchemaName: schema
                };

                if (targets != null) {
                    var targetList = [];
                    for (var i = 0; i < targets.length; i++) {
                        var targetEntities = targets[i];
                        if (targetEntities != null) {
                            var target = targetEntities;

                            targetList.push({
                                Entity: Tribridge.CRMSDK.METADATA.GetTextPropertyXML(target)
                            });
                        }
                    }
                    retObj['Targets'] = targetList;
                }

                if (options != null && options.Options != null) {
                    var optionList = [];
                    for (var i = 0; i < options.Options.length; i++) {
                        var option = options.Options[i];

                        optionList.push({
                            Label: options.Options[i].Label.UserLocalizedLabel.Label,
                            Value: options.Options[i].Value
                        });
                    }
                    retObj['Options'] = optionList;
                }

                if (data[0].length == 1) {
                    return { Name: logical, SchemaName: schemaname, ObjectCode: objectcode, PrimaryAttribute: primaryNameAttribute, PrimaryIdAttribute: primaryIdAttribute, Attributes: [retObj] };
                }
                retCollection[retObj.AttributeLogicalName] = retObj;
            });
        }
    }
    return { Name: logical, SchemaName: schemaname, ObjectCode: objectcode, PrimaryAttribute: primaryNameAttribute, PrimaryIdAttribute: primaryIdAttribute, Attributes: retCollection };
}
//Kadambari- End

//Kadambari- Start
Tribridge.CRMSDK.METADATA.SoapParseAttributeResponse = function (data) {
    var schemaname = null;
    var objectcode = null;
    var logical = null;
    var primaryIdAttribute = null;
    var primaryNameAttribute = null;
    var attType = null;
    var attLabel = null;
    var entity = null;
    var att = null;
    var schema = null;
    var options = null;
    var attOf = null;
    var display = null;
    var link = null;
    var targets = null;

    if (data[0] != null) {

        if (data[0].SchemaName != null)
            schemaname = data[0].SchemaName;
        if (data[0].ObjectTypeCode != null)
            objectcode = data[0].ObjectTypeCode;
        if (data[0].LogicalName != null)
            logical = data[0].LogicalName;
        if (data[0].PrimaryIdAttribute != null)
            primaryIdAttribute = data[0].PrimaryIdAttribute;
        if (data[0].PrimaryNameAttribute != null)
            primaryNameAttribute = data[0].PrimaryNameAttribute;

        var retCollection = [];

        if (data[0].Attributes != null) {
            $.each(data[0].Attributes, function (index, attribute) {
                if (attribute.AttributeType != null)
                    attType = attribute.AttributeType;
                if (attribute.DisplayName.UserLocalizedLabel != null)
                    attLabel = attribute.DisplayName.UserLocalizedLabel.Label;
                if (attribute.EntityLogicalName != null)
                    entity = attribute.EntityLogicalName;
                if (attribute.LogicalName != null)
                    att = attribute.LogicalName;
                if (attribute.SchemaName != null)
                    schema = attribute.SchemaName;
                if (attribute.OptionSet != null)
                    options = attribute.OptionSet;
                if (attribute.AttributeOf != null)
                    attOf = attribute.AttributeOf;
                if (attribute.DisplayName.UserLocalizedLabel != null) {
                    display = attribute.DisplayName.UserLocalizedLabel.Label;
                }
                if (attribute.LinkedAttributeId != null)
                    link = attribute.LinkedAttributeId;

                if (attribute.Targets != null)
                    targets = attribute.Targets;

                var retObj = {
                    AttributeType: attType,
                    AttributeName: attLabel,
                    AttributeOf: attOf,
                    DisplayName: display,
                    LinkedAttributeId: link,
                    AttributeLogicalName: att,
                    EntityLogicalName: entity,
                    SchemaName: schema
                };

                if (targets != null) {
                    var targetList = [];
                    for (var i = 0; i < targets.length; i++) {
                        var targetEntities = targets[i];
                        if (targetEntities != null) {
                            var target = targetEntities;

                            targetList.push({
                                Entity: Tribridge.CRMSDK.METADATA.GetTextPropertyXML(target)
                            });
                        }
                    }
                    retObj['Targets'] = targetList;
                }

                if (options != null && options.Options != null) {
                    var optionList = [];
                    for (var i = 0; i < options.Options.length; i++) {
                        var option = options.Options[i];

                        optionList.push({
                            Label: options.Options[i].Label.UserLocalizedLabel.Label,
                            Value: options.Options[i].Value
                        });
                    }
                    retObj['Options'] = optionList;
                }

                if (data[0].length == 1) {
                    return { Name: logical, SchemaName: schemaname, ObjectCode: objectcode, PrimaryAttribute: primaryNameAttribute, PrimaryIdAttribute: primaryIdAttribute, Attributes: [retObj] };
                }
                retCollection[retObj.AttributeLogicalName] = retObj;
            });
        }
    }

    return { Name: logical, SchemaName: schemaname, ObjectCode: objectcode, PrimaryAttribute: primaryNameAttribute, PrimaryIdAttribute: primaryIdAttribute, Attributes: retCollection };
}
//Kadambari- End

Tribridge.CRMSDK.METADATA.SoapParseResponse = function (responseXML) {

}

// #################################### Helpers #####################################

/**
 * @desc Get the text content from a xml node.
 *
 * @param node - The xml node.
 *
 * @required node
 * @return The string.
 */
Tribridge.CRMSDK.METADATA.GetTextPropertyXML = function (node) {
    if (typeof node == 'undefined' || node == null)
        return '';
    //Kadambari Start
    if (typeof node != 'undefined')
        return node;
    if (typeof node.textContent != 'undefined')
        return node.textContent;

    return '';
}

/**
 * @desc Checks if the object is filled or not.
 *
 * @param obj - The object to check if is null or empty.
 *
 * @required obj
 */
Tribridge.CRMSDK.METADATA.IsNullOrEmpty = function (obj) {
    if (typeof obj == 'undefined' || obj == null)
        return true;

    if (typeof obj == 'object' && obj.length < 1)
        return true;

    return false;
}


/**
 * @desc Returns the crm meta url.
 *
 */
Tribridge.CRMSDK.METADATA.GetServerUrl = function () {

    var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
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

    return serverUrl + OrgServicePath;
}

// #################################### Private Methods #####################################

Tribridge.CRMSDK.METADATA.Private.GetSelectionNamespaces = function () {
    var namespaces = [
    "xmlns:s='http://schemas.xmlsoap.o}rg/soap/envelope/'",
    "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
    "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
    "xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'",
    "xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'"];
    return namespaces;
}

Tribridge.CRMSDK.METADATA.EntityFilters.prototype = {
    Default: 'Entity',
    Entity: 'Entity',
    Attributes: 'Attributes',
    Privileges: 'Privileges',
    Relationships: 'Relationships',
    All: 'All'
};

Tribridge.CRMSDK.METADATA.EntityFilters.Default = 'Entity';
Tribridge.CRMSDK.METADATA.EntityFilters.Entity = 'Entity';
Tribridge.CRMSDK.METADATA.EntityFilters.Attributes = 'Attributes';
Tribridge.CRMSDK.METADATA.EntityFilters.Privileges = 'Privileges';
Tribridge.CRMSDK.METADATA.EntityFilters.Relationships = 'Relationships';
Tribridge.CRMSDK.METADATA.EntityFilters.All = 'All';
Tribridge.CRMSDK.METADATA.EntityFilters.__enum = true;
Tribridge.CRMSDK.METADATA.EntityFilters.__flags = true;