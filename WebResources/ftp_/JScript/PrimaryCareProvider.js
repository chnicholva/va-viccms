///// <reference path="CrmAjaxFunctions.js" />
///// <reference path="XrmPageTemplate.js" />
///// <reference path="XrmPage-vsdoc.js" />
///// <reference path="jquery-1.7.2.min.js" />

if (typeof (CrmAjaxFunctions) === "undefined") {
    CrmAjaxFunctions = { __namespace: true };
}

CrmAjaxFunctions =
{
    CreateNewRecord: function (entitySetName, attributeUpdateString) {
        //This function creates a basic CRM entity record with new data values
        //*entitySetName* - is the name of the CRM entity set (Case Sensitive)
        //*attributeUpdateString* - is the atributes and values to update, format CrmAttributeName + __ + AttributeTextValue + ~~ + CrmAttributeName + __ + AttributeTextValue

        var crmEntityRecord = new Object;
        for (var i = 0; i < attributeString.length; i++) {
            var pair = attributeString[i].split("__");
            crmEntityRecord[pair[0]] = pair[1];
        }

        var jsonEntityData = JSON.stringify(crmEntityRecord);
        var jsonQuery = CrmAjaxFunctions.GetServerUrl() + "/XRMServices/2011/OrganizationData.svc" + "/" + entitySetName;
        this.PostRequest(jsonQuery, true, jsonEntityData, "CREATE", "");

        return;
    },
    UpdateSingleEntity: function (entitySetName, attributeUpdateString, entityId) {
        //This function updates a basic CRM entity record with new data values
        //*entitySetName* - is the name of the CRM entity set (Case Sensitive)
        //*attributeUpdateString* - is the atributes and values to update, format CrmAttributeName + __ + AttributeTextValue + ~~ + CrmAttributeName + __ + AttributeTextValue
        //*entityId* - is the Guid for the entity record

        var crmEntityRecord = new Object;
        var entityIdNoBracket = CommonScript.ReformatCRMGuid(entityId);
        var attributeString = attributeUpdateString.split("~~");
        for (var i = 0; i < attributeString.length; i++) {
            var pair = attributeString[i].split("__");
            crmEntityRecord[pair[0]] = pair[1];
        }

        var jsonEntityData = JSON.stringify(crmEntityRecord);
        var jsonQuery = CrmAjaxFunctions.GetServerUrl() + "/XRMServices/2011/OrganizationData.svc" + "/" + entitySetName + "(guid" + "'" + entityIdNoBracket + "'" + ")";
        this.PostRequest(jsonQuery, true, jsonEntityData, "UPDATE", "");

        return;
    },
    PostRequest: function (jsonQuery, aSync, jsonEntityData, recordAction, crmGuidFieldName) {
        var crmEntityId = "FAIL";
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: jsonQuery,
            data: jsonEntityData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
                if (recordAction === "UPDATE") {
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                }
                if (recordAction === "DELETE") {
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
                }
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (recordAction === "CREATE") {
                    crmEntityId = data.d[crmGuidFieldName].toString();
                } else {
                    crmEntityId = "SUCCESS";
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert("Ajax Error in CrmAjaxFunctions.PostRequest: " + errorThrown + "\n" + textStatus);
                crmEntityId = "FAIL";
            },
            async: aSync
        });

        return crmEntityId;
    },
    GetServerUrl: function () {
        /// <summary>Returns the URL for the SOAP endpoint using the context information available in the form or HTML Web resource.</summary>
        var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
        var serverUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            serverUrl = context.getClientUrl();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                serverUrl = Xrm.Page.context.getClientUrl();
            }
            else {
                throw new Error("Unable to access the server URL");
            }
        }
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl + OrgServicePath;
    },
    GetRequestObject: function () {
        if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest;
        }
        else {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0");
            }
            catch (ex) {
                return null;
            }
        }
    },
    GetXMLHttpRequest: function () {
        /// <summary>
        ///     Gets the XmlHttpRequest Object.
        ///     Certain browsers and versions of Windows have to be handled differently
        /// </summary>

        var xmlHttp = null;

        try {
            // Opera 8.0+, Firefox, Safari.
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            try {
                // Internet Explorer Browser.
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    // Internet Explorer Browser.
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    // Something went very wrong                    
                    return null;
                }
            }
        }

        return xmlHttp;
    },
    GetEntityASyncJSON: function (entitySet, id, Columns) {
        // call example
        // var entitySet = "AccountSet";
        // var columns = "AccountId eq (guid'" + id + "')&$select=mhi_acounttype";
        // var result = GetEntityASyncJSON(entitySet, id, columns);

        var serverUrl = CrmAjaxFunctions.GetServerUrl();
        var oDataEndpointUrl = serverUrl + "/XRMServices/2011/OrganizationData.svc/";
        oDataEndpointUrl += entitySet + "?$filter=" + Columns;
        var service = CrmAjaxFunctions.GetRequestObject();
        if (service != null) {
            service.open("GET", oDataEndpointUrl, false);
            service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
            service.setRequestHeader("Accept", "application/json, text/javascript, */*");
            service.onreadystatechange = function () {
                CrmAjaxFunctions.GetEntityASyncJSONCallBack(this);
            };
            service.send();  //service.send(null);
        }
    },
    GetEntityASyncJSONCallBack: function (RetrieveEntityReq) {
        if (retrieveProjectReq.status == 200) {
            // set entityContains
            // var requestResults = eval('(' + service.responseText + ')').d;
            requestResults = RetrieveEntityReq.responseText;
            // return requestResults;
        }
        else {
            alert("Error fetching data in GetEntitySyncJSON function");
        }
    },
    ExecuteFetchXmlRequest: function (fetchXml, onSuccess, onError, async) {
        /// <summary>
        ///     Executes the Fetch XML Request, executing the onSuccess and onError functions as appropriate.  
        ///     If onSuccess is null or reutrns null, a Javascript Object representation of the response will 
        ///     be returned, else the result of onSuccess will be returned.
        /// </summary>
        /// <param name="fetchXml" type="String">
        ///     The Fetch XML to be Exectued.
        ///     This will be XML Encoded.
        /// </param>
        /// <param name="onSuccess" type="function">
        ///     Function that will be called if no errors occur.  
        ///     The Javascript Object representation of the response will be passed in.
        /// </param>
        /// <param name="onError" type="function">Function that will be called if an eror occurs.</param>
        /// <param name="async" type="Boolean"> 
        ///     Controls if the request is performed asynchronously.
        ///     Defaults to false
        /// </param>

        if (async == null) {
            async = false;
        }

        var request = "<request i:type='b:RetrieveMultipleRequest' xmlns:b='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>"
            + "    <b:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>"
            + "        <b:KeyValuePairOfstringanyType>"
            + "            <c:key>Query</c:key>"
            + "            <c:value i:type='b:FetchExpression'>"
            + "                <b:Query>" + CrmEncodeDecode.CrmXmlEncode(fetchXml)     // parent.CrmEncodeDecode.CrmXmlEncode(sFetchXml);
            + "                </b:Query>"
            + "            </c:value>"
            + "        </b:KeyValuePairOfstringanyType>"
            + "    </b:Parameters>"
            + "    <b:RequestId i:nil='true'/>"
            + "    <b:RequestName>RetrieveMultiple</b:RequestName>"
            + "</request>";

        var response = null;
        var internalOnSuccess;
        if (onSuccess == null) {
            internalOnSuccess = function (r) { response = CrmAjaxFunctions.OnFetchXmlSuccess(r); };
        } else {
            internalOnSuccess = function (r) {
                var temp = CrmAjaxFunctions.OnFetchXmlSuccess(r);
                response = onSuccess(temp);
                if (response == null) {
                    response = temp;
                }
            };
        }

        CrmAjaxFunctions.ExecuteRequest(request, internalOnSuccess, onError, async);
        return response;
    },
    OnFetchXmlSuccess: function (response) {
        /// <summary>Parses the response text, and returns a Javascript Object representation of the it. </summary>
        /// <param name="response" type="String">Response XML from SOAP Request</param>

        // Remove name spaces so XML2jsobj returns valid property names
        // http://stackoverflow.com/questions/3704466/easy-way-to-drop-xml-namespaces-with-javascript
        // RegEx Expects every node to have a namespace prefix, add the two missing prefixes
        response = CrmAjaxFunctions.ReplaceAll(response, "<ExecuteResponse ", "<a:ExecuteResponse ");
        response = CrmAjaxFunctions.ReplaceAll(response, "<ExecuteResult ", "<a:ExecuteResult ");
        if (null != response) response = response.replace(/<(\/?)([^:>]*:)?([^>]+)>/g, "<$1$3>");
        var doc = CrmAjaxFunctions.ParseXmlString(response);

        if (CrmAjaxFunctions.GetElementText(doc.getElementsByTagName("ResponseName")[0]) == "RetrieveMultiple") {
            var elements = doc.getElementsByTagName("Entity");
            var entities = new Array();
            for (var i = 0; i < elements.length; i++) {
                entities[i] = CrmAjaxFunctions.XML2jsobj(elements[i]);
            }
            return entities;
        } else {
            return doc.getElementsByTagName("Results")[0];
        }
    },
    ExecuteRequest: function (requestXml, onSuccess, onError, async) {
        /// <summary>Wraps the requestXML in a SOAP Envelope and executes the request, calling the appropriate result functions</summary>
        /// <param name="requestXml" type="String">CRM Request Xml</param>
        /// <param name="onSuccess" type="function">function to handle the response XML.</param>
        /// <param name="onError" type="function">
        ///     function to handle an error.  
        ///     Defaults to alerting the error message.
        /// </param>
        /// <param name="async" type="Boolean">
        ///     Controls if the request is performed asynchronously.
        ///     Defaults to false
        /// </param>

        if (async == null) {
            async = false;
        }
        var soapEnvelope = ""
            + "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">"
            + "<s:Body>"
            + "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">"
            + requestXml
            + "    </Execute>"
            + "  </s:Body>"
            + "</s:Envelope>";
        var req = CrmAjaxFunctions.GetXMLHttpRequest();
        req.open("POST", CrmAjaxFunctions.GetServerUrl(), async)
        try { req.responseType = "msxml-document"; } catch (e) { } // IE10 support
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () { CrmAjaxFunctions.ExecuteSOAPResponse(req, onSuccess, onError); };
        req.send(soapEnvelope);
    },
    GetElementText: function (element) {
        /// <summary>Handles issues between IE9 and IE10.  IE9 doesn't support text, IE10 doesn't support textContent </summary>
        /// <param name="element" type="XmlElement">Element to return the textContent or text of</param>
        return element.textContent || element.text;
    },
    ReplaceAll: function (str, find, replace) {
        if (null != str) return str.replace(new RegExp(find, "g"), replace);
        else return str;
    },
    ParseXmlString: function (txt) {
        var xmlDoc;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(txt);
        }
        return xmlDoc;
    },
    XML2jsobj: function (node) {
        var data = {};
        var isNull = true;

        // append a value
        function Add(name, value) {
            isNull = false;
            if (data[name]) {
                if (data[name].constructor != Array) {
                    data[name] = [data[name]];
                }
                data[name][data[name].length] = value;
            }
            else {
                data[name] = value;
            }
        };

        function AddAttributes(entity, node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                isNull = false;
                //KeyValuePairOfstringanyType
                var valuePair = node.childNodes[i];
                var key = CrmAjaxFunctions.GetElementText(valuePair.firstChild);
                var value = valuePair.childNodes[1].childNodes;
                if (value.length == 1 && value[0].tagName == "Value") {
                    data[key] = CrmAjaxFunctions.GetElementText(value[0]);
                } else if (value.length == 1 && value[0].nodeType == 3) {
                    data[key] = value[0].nodeValue;
                } else {
                    data[key] = CrmAjaxFunctions.XML2jsobj(valuePair.childNodes[1]);
                }
            }
        };

        // element attributes
        var c, cn;
        // skip type and namespace values
        //for (c = 0; cn = node.attributes[c]; c++) {
        //    Add(cn.name, cn.value);
        //}

        // child elements
        for (c = 0; cn = node.childNodes[c]; c++) {
            if (cn.nodeType == 1) {
                if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
                    // text value
                    Add(cn.nodeName, cn.firstChild.nodeValue);
               }
                else if (cn.nodeName == "Attributes") {
                    AddAttributes(data, cn)
                } else {
                    // sub-object
                    Add(cn.nodeName, CrmAjaxFunctions.XML2jsobj(cn));
                }
            }
        }

        if (isNull) {
            data = null;
        }
        return data;
    },
    GetServerUrl: function () {
        /// <summary>Returns the URL for the SOAP endpoint using the context information available in the form or HTML Web resource.</summary>
        var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
        var serverUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            serverUrl = context.getClientUrl();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                serverUrl = Xrm.Page.context.getClientUrl();
            }
            else {
                throw new Error("Unable to access the server URL");
            }
        }
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }

        return serverUrl + OrgServicePath;
    },
    GetError: function (faultXml) {
        ///<summary>
        /// Parses the WCF fault returned in the event of an error.
        ///</summary>
        ///<param name="faultXml" Type="XML">
        /// The responseXML property of the XMLHttpRequest response.
        ///</param>
        var errorMessage = "Unknown Error (Unable to parse the fault)";
        if (typeof faultXml == "object") {
            try {
                var bodyNode = faultXml.firstChild.firstChild;
                //Retrieve the fault node
                for (var i = 0; i < bodyNode.childNodes.length; i++) {
                    var node = bodyNode.childNodes[i];
                    //NOTE: This comparison does not handle the case where the XML namespace changes
                    if (node.nodeName == "s:Fault" || node.nodeName == "Fault") {
                        for (var j = 0; j < node.childNodes.length; j++) {
                            var faultStringNode = node.childNodes[j];
                            if ("faultstring" == faultStringNode.nodeName) {
                                errorMessage = CrmAjaxFunctions.GetElementText(faultStringNode);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (e) { };
        }
        return new Error(errorMessage);
    },
    ExecuteSOAPResponse: function (req, successCallback, errorCallback) {
        /// <summary>Receives the assign Response</summary>
        /// <param name="req" Type="XMLHttpRequest">
        ///     The XMLHttpRequest response
        /// </param>
        /// <param name="successCallback" Type="Function">
        ///     The function to perform when an successfult response is returned.
        ///     For this message no data is returned so a success callback is not really necessary.
        /// </param>
        /// <param name="errorCallback" Type="Function">
        ///     The function to perform when an error is returned.
        ///     This function accepts a JScript error returned by the GetError function
        /// </param>

        if (req.readyState == 2 || req.readyState == 4 /* complete */) {
            if (req.status == 200 && req.responseXML != null && req.responseXML.documentElement != null) {
                if (successCallback != null) {
                    var response = null;
                    if (req.responseXML != null) {
                        successCallback(req.responseXML.xml || new XMLSerializer().serializeToString(req.responseXML));
                    }
                }
            }
            else {
                if (errorCallback == null) {
                    alert(CrmAjaxFunctions.GetError(req.responseXML));
                } else {
                    errorCallback(CrmAjaxFunctions.GetError(req.responseXML));
                }
            }
        }
    }
};

function GetPACTTeam(srcValue) {
    var fetchXml = "<?xml version='1.0'?>" +
    "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0'>" +
    "<entity name='ftp_pact'>" +
    "<attribute name='ftp_name'/>" +
    "<attribute ID='ftp_pactId'/>" +
    "<order descending='false' attribute='ftp_name'/>" +
    "<filter type='and'>" +
    "<condition attribute='statecode' value='0' operator='eq'/>" +
    "<condition attribute='ftp_pactId' value='" + srcValue + "' operator='eq'/>" +
    "</filter>" +
    "</entity>" +
    "</fetch>";

    return CrmAjaxFunctions.ExecuteFetchXmlRequest(fetchXml);
}

function GetPACTTeamMembers(srcValue) {
    var fetchXml = "<?xml version='1.0'?>" +
    "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0'>" +
    "<entity name='ftp_pactteammember'>" +
    "<attribute name='ftp_name'/>" +
    "<attribute ID='ftp_pactteammemberId'/>" +
    "<order descending='false' attribute='ftp_name'/>" +
    "<filter type='and'>" +
    "<condition attribute='statecode' value='0' operator='eq'/>" +
    "<condition attribute='ftp_pactteammemberId' value='" + srcValue + "' operator='eq'/>" +
    "</filter>" +
    "</entity>" +
    "</fetch>";

    return CrmAjaxFunctions.ExecuteFetchXmlRequest(fetchXml);
}

function GetPACTTeamMembersUserRecords(pactteamid) {
    var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
      "<entity name='systemuser'>" +
        "<attribute name='fullname' />" +
        "<attribute name='firstname' />" +
        "<attribute name='lastname' />" +
        "<attribute name='systemuserid' />" +
        "<attribute name='ftp_pactteamrole' />" +
        "<attribute name='ftp_pactid' />" +
        "<order attribute='fullname' descending='false' />" +
        "<filter type='and'>" +
          "<condition attribute='isdisabled' operator='eq' value='0' />" +
          "<condition attribute='ftp_pactid' operator='eq' value='" + pactteamid + "' />" +
          "<filter type = 'or'>" +
            "<condition attribute='ftp_pactteamrole' operator='eq' value='Primary Care Provider' />" +
            "<condition attribute='ftp_pactteamrole' operator='eq' value='Associate Provider' />" +
          "</filter>" +
        "</filter>" +
      "</entity>" +
      "</fetch>";

    return CrmAjaxFunctions.ExecuteFetchXmlRequest(fetchXml);
}

function retrievePACTTeamGUIDfromLookup() {
    try {
        // check to see if has a Primary Care Provider already there
        var careProvider = Xrm.Page.getAttribute("ftp_primarycareprovider");

        if (careProvider !== null) {
            if (typeof careProvider !== 'undefined') {
                // needs a Primary Care Provider
                var PACTTeamLookup = Xrm.Page.getAttribute("ftp_pactid");
                if (PACTTeamLookup !== null && PACTTeamLookup !== 'undefined') {
                    return PACTTeamLookup.getValue()[0].id;
                }
                else {
                    alert("Veteran has no PACT Team.");
                    return null;
                }
            }
        }
    }
    catch (e) { alert(e.errorMessage); }
}

// fires with PACT Team change
function PACTTeamChangeEvent() {
    try {
        var PACTTeamGUID = retrievePACTTeamGUIDfromLookup();

        if (typeof PACTTeamGUID !== 'undefined') {
            if (PACTTeamGUID !== null) {
                var PACTTeamMembers = GetPACTTeamMembersUserRecords(PACTTeamGUID);
                if (typeof PACTTeamMembers !== 'undefined') {
                    if (PACTTeamMembers !== null && PACTTeamMembers.length > 0) {

                        for (var j = 0; j < PACTTeamMembers.length; j++) {
                            var PACTTeamRole = PACTTeamMembers[0].ftp_pactteamrole;

                            switch (PACTTeamRole) {
                                case 'Primary Care Provider':
                                    Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");
                                    Xrm.Page.getAttribute("ftp_primarycareprovider").setValue(PACTTeamMembers[0].fullname);
                                    break;
                                case 'Associate Provider':
                                    Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");
                                    Xrm.Page.getAttribute("ftp_primarycareprovider").setValue(PACTTeamMembers[0].fullname);
                                    break;
                                case '(mhtc) Addiction Therapist':
                                    Xrm.Page.getAttribute("ftp_mentalhealthteam").setSubmitMode("always");
                                    Xrm.Page.getAttribute("ftp_mentalhealthteam").setValue(PACTTeamMembers[0].fullname);
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (Xrm.Page.data.entity.getIsDirty()) { Xrm.Page.data.entity.save(); }
                    }
                }
                else { alert('no PACT Team Members found'); }
            }
        }
        else { alert('Veteran has no PACT Team'); }
    }
    catch (e) { alert(e.errorMessage); }
}

// fires on form load
function ProcessPrimaryCareProvider() {
var ftype = Xrm.Page.ui.getFormType();
if(ftype == 1){
return;
}
    try {
        // check to see if there's already a Primary Care Provider
        var priCareProvider = Xrm.Page.getAttribute("ftp_primarycareprovider");
        var mentalProvider = Xrm.Page.getAttribute("ftp_mentalhealthteam");

        if (typeof priCareProvider !== 'undefined') {
            if (priCareProvider !== null || priCareProvider === "") {

                var PACTTeamGUID = retrievePACTTeamGUIDfromLookup();

                if (typeof PACTTeamGUID !== 'undefined') {
                    if (PACTTeamGUID !== null) {
                        var PACTTeamMembers = GetPACTTeamMembersUserRecords(PACTTeamGUID);

                        if (typeof PACTTeamMembers !== 'undefined') {
                            if (PACTTeamMembers !== null && PACTTeamMembers.length > 0) {

                                for (var j = 0; j < PACTTeamMembers.length; j++) {
                                    var PACTTeamRole = PACTTeamMembers[0].ftp_pactteamrole;

                                    switch (PACTTeamRole) {
                                        case 'Primary Care Provider':
                                            Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");
                                            Xrm.Page.getAttribute("ftp_primarycareprovider").setValue(PACTTeamMembers[0].fullname);
                                            break;
                                        case 'Associate Provider':
                                            Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");
                                            Xrm.Page.getAttribute("ftp_primarycareprovider").setValue(PACTTeamMembers[0].fullname);
                                            break;
                                        case '(mhtc) Addiction Therapist':
                                            Xrm.Page.getAttribute("ftp_mentalhealthteam").setSubmitMode("always");
                                            Xrm.Page.getAttribute("ftp_mentalhealthteam").setValue(PACTTeamMembers[0].fullname);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                if (Xrm.Page.data.entity.getIsDirty()) { Xrm.Page.data.entity.save(); }
                            }
                        }
                        else { alert('no PACT Team Members found'); }
                    }
                }
                else { alert('Veteran has no PACT Team'); }
            }
        }
    }
    catch (e) { alert(e.errorMessage); }
}
