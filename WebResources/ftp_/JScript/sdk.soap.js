if (typeof (SDK) == "undefined")
{ SDK = { __namespace: true }; }
//This will establish a more unique namespace for functions in this library. This will reduce the 
// potential for functions to be overwritten due to a duplicate name when the library is loaded.
SDK.SOAP = {
    _getServerUrl: function () {
        ///<summary>
        /// Returns the URL for the SOAP endpoint using the context information available in the form
        /// or HTML Web resource.
        ///</summary
        var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
        var serverUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            //serverUrl = context.getServerUrl();
			serverUrl = context.getClientUrl(); //updated for 'the future'
			
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                //serverUrl = Xrm.Page.context.getServerUrl();
				serverUrl = Xrm.Page.context.getClientUrl(); //updated for 'the future'
            }
            else
            { throw new Error("Unable to access the server URL"); }
        }
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }
        return serverUrl + OrgServicePath;
    },
    setState: function (recordId, logicalName, stateCode, statusCode, successCallback, errorCallback) {
        var requestxml = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestxml += "<s:Body>";
        requestxml += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestxml += "<request i:type=\"b:SetStateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestxml += "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<c:key>EntityMoniker</c:key>";
        requestxml += "<c:value i:type=\"a:EntityReference\">";
        requestxml += "<a:Id>" + recordId + "</a:Id>";
        requestxml += "<a:LogicalName>" + logicalName + "</a:LogicalName>";
        requestxml += "<a:Name i:nil=\"true\" />";
        requestxml += "</c:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<c:key>State</c:key>";
        requestxml += "<c:value i:type=\"a:OptionSetValue\">";
        requestxml += "<a:Value>" + stateCode + "</a:Value>";
        requestxml += "</c:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<c:key>Status</c:key>";
        requestxml += "<c:value i:type=\"a:OptionSetValue\">";
        requestxml += "<a:Value>" + statusCode + "</a:Value>";
        requestxml += "</c:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "</a:Parameters>";
        requestxml += "<a:RequestId i:nil=\"true\" />";
        requestxml += "<a:RequestName>SetState</a:RequestName>";
        requestxml += "</request>";
        requestxml += "</Execute>";
        requestxml += "</s:Body>"
        requestxml += "</s:Envelope>"

        var req = new XMLHttpRequest();
        req.open("POST", SDK.SOAP._getServerUrl(), true)
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () { SDK.SOAP.setStateResponse(req, successCallback, errorCallback); };
        req.send(requestxml);
    },
    setStateResponse: function (req, successCallback, errorCallback) {
        ///<summary>
        /// Recieves the setState response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null)
                { successCallback(); }
            }
            else {
                errorCallback(SDK.SOAP._getError(req.responseXML));
            }
        }
    },
    disassociate: function (parentId, parentType, relationshipName, childId, childType, successCallback, errorCallback) {
        var requestxml = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestxml += "<s:Body>";
        requestxml += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestxml += "<request i:type=\"a:DisassociateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
        requestxml += "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<b:key>Target</b:key>";
        requestxml += "<b:value i:type=\"a:EntityReference\">";
        requestxml += "<a:Id>" + parentId + "</a:Id>";
        requestxml += "<a:LogicalName>" + parentType + "</a:LogicalName>";
        requestxml += "<a:Name i:nil=\"true\" />";
        requestxml += "</b:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<b:key>Relationship</b:key>";
        requestxml += "<b:value i:type=\"a:Relationship\">";
        requestxml += "<a:PrimaryEntityRole>Referenced</a:PrimaryEntityRole>";
        requestxml += "<a:SchemaName>" + relationshipName + "</a:SchemaName>";
        requestxml += "</b:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "<a:KeyValuePairOfstringanyType>";
        requestxml += "<b:key>RelatedEntities</b:key>>";
        requestxml += "<b:value i:type=\"a:EntityReferenceCollection\">";
        requestxml += "<a:EntityReference>";
        requestxml += "<a:Id>" + childId + "</a:Id>";
        requestxml += "<a:LogicalName>" + childType + "</a:LogicalName>";
        requestxml += "<a:Name i:nil=\"true\" />";
        requestxml += "</a:EntityReference>";
        requestxml += "</b:value>";
        requestxml += "</a:KeyValuePairOfstringanyType>";
        requestxml += "</a:Parameters>";
        requestxml += "<a:RequestId i:nil=\"true\" />";
        requestxml += "<a:RequestName>Disassociate</a:RequestName>";
        requestxml += "</request>";
        requestxml += "</Execute>";
        requestxml += "</s:Body>"
        requestxml += "</s:Envelope>"

        var req = new XMLHttpRequest();
        req.open("POST", SDK.SOAP._getServerUrl(), true)
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () {
            SDK.SOAP.setStateResponse(req, successCallback, errorCallback);
        };
        req.send(requestxml);
    },
    disassociateResponse: function (req, successCallback, errorCallback) {
        // Not currently using async
        ///<summary>
        /// Recieves the setState response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null)
                { successCallback(); }
            }
            else {
                errorCallback(SDK.SOAP._getError(req.responseXML));
            }
        }
    },
    assign: function (Assignee, AssigneeType, Target, Type, successCallback, errorCallback) {
        ///<summary>
        /// Sends the Assign Request
        ///</summary>
        this._parameterCheck(Assignee, "GUID", "The SDK.SOAP.assign method Assignee parameter must be a string Representing a GUID value.");
        ///<param name="Assignee" Type="String">
        /// The GUID representing the  System user that the record will be assigned to.
        ///</param>
		this._parameterCheck(AssigneeType, "String", "The SDK.SOAPSamples.assignRequest method Assignee parameter must be a string Representing a GUID value.");
		  ///<param name="AssigneeType" Type="String">
		  /// The Logical name of the securitiy principal. For example, 'systemuser' or 'team'.
		  ///</param>
        this._parameterCheck(Target, "GUID", "The SDK.SOAP.assign method Target parameter must be a string Representing a GUID value.");
        ///<param name="Target" Type="String">
        /// The GUID representing the user-owned entity record that will be assigne to the Assignee.
        ///</param>
        this._parameterCheck(Type, "String", "The SDK.SOAP.assign method Type parameter must be a string value.");
        Type = Type.toLowerCase();
        ///<param name="Type" Type="String">
        /// The Logical name of the user-owned entity. For example, 'account'.
        ///</param>
        if (successCallback != null)
            this._parameterCheck(successCallback, "Function", "The SDK.SOAP.assign method successCallback parameter must be a function.");
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        ///</param>
        this._parameterCheck(errorCallback, "Function", "The SDK.SOAP.assign method errorCallback parameter must be a function.");
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        ///</param>
        //The request is simply the soap envelope captured by the SOAPLogger with variables added for the 
        // values passed. All quotations must be escaped to create valid JScript strings.
        var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        request += "<s:Body>";
        request += "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\"";
        request += " xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        request += "<request i:type=\"b:AssignRequest\"";
        request += " xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"";
        request += " xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        request += "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<c:key>Target</c:key>";
        request += "<c:value i:type=\"a:EntityReference\">";
        request += "<a:Id>" + this._xmlEncode(Target) + "</a:Id>";
        request += "<a:LogicalName>" + this._xmlEncode(Type) + "</a:LogicalName>";
        request += "<a:Name i:nil=\"true\" />";
        request += "</c:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "<a:KeyValuePairOfstringanyType>";
        request += "<c:key>Assignee</c:key>";
        request += "<c:value i:type=\"a:EntityReference\">";
        request += "<a:Id>" + this._xmlEncode(Assignee) + "</a:Id>";
        request += "<a:LogicalName>" + this._xmlEncode(AssigneeType) + "</a:LogicalName>";
        request += "<a:Name i:nil=\"true\" />";
        request += "</c:value>";
        request += "</a:KeyValuePairOfstringanyType>";
        request += "</a:Parameters>";
        request += "<a:RequestId i:nil=\"true\" />";
        request += "<a:RequestName>Assign</a:RequestName>";
        request += "</request>";
        request += "</Execute>";
        request += "</s:Body>";
        request += "</s:Envelope>";

        var req = new XMLHttpRequest();
        req.open("POST", SDK.SOAP._getServerUrl(), true)
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () { SDK.SOAP.assignResponse(req, successCallback, errorCallback); };
        req.send(request);
    },
    assignResponse: function (req, successCallback, errorCallback) {
        ///<summary>
        /// Recieves the assign response
        ///</summary>
        ///<param name="req" Type="XMLHttpRequest">
        /// The XMLHttpRequest response
        ///</param>
        ///<param name="successCallback" Type="Function">
        /// The function to perform when an successfult response is returned.
        /// For this message no data is returned so a success callback is not really necessary.
        ///</param>
        ///<param name="errorCallback" Type="Function">
        /// The function to perform when an error is returned.
        /// This function accepts a JScript error returned by the _getError function
        ///</param>
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null)
                { successCallback(); }
            }
            else {
                errorCallback(SDK.SOAP._getError(req.responseXML));
            }
        }
    },
    _getError: function (faultXml) {
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
                    if ("s:Fault" == node.nodeName) {
                        for (var j = 0; j < node.childNodes.length; j++) {
                            var faultStringNode = node.childNodes[j];
                            if ("faultstring" == faultStringNode.nodeName) {
                                errorMessage = faultStringNode.text;
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
    _xmlEncode: function (strInput) {
        var c;
        var XmlEncode = '';

        if (strInput == null) {
            return null;
        }
        if (strInput == '') {
            return '';
        }

        for (var cnt = 0; cnt < strInput.length; cnt++) {
            c = strInput.charCodeAt(cnt);

            if (((c > 96) && (c < 123)) ||
                    ((c > 64) && (c < 91)) ||
                    (c == 32) ||
                    ((c > 47) && (c < 58)) ||
                    (c == 46) ||
                    (c == 44) ||
                    (c == 45) ||
                    (c == 95)) {
                XmlEncode = XmlEncode + String.fromCharCode(c);
            }
            else {
                XmlEncode = XmlEncode + '&#' + c + ';';
            }
        }

        return XmlEncode;
    },
    _parameterCheck: function (parameter, type, errorMessage) {
        switch (type) {
            case "String":
                if (typeof parameter != "string") {
                    throw new Error(errorMessage);
                }
                break;
            case "Function":
                if (typeof parameter != "function") {
                    throw new Error(errorMessage);
                }
                break;
            case "EntityFilters":
                var found = false;
                for (x in this.EntityFilters) {
                    if (this.EntityFilters[x] == parameter) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(errorMessage);
                }
                break;
            case "Boolean":
                if (typeof parameter != "boolean") {
                    throw new Error(errorMessage);
                }
                break;
            case "GUID":
                var re = new RegExp("[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}");
                if (!(typeof parameter == "string" && re.test(parameter))) {
                    throw new Error(errorMessage);
                }

                break;
            default:
                throw new Error("An invalid type parameter value was passed to the SDK.SOAP._parameterCheck function.");
                break;
        }
    },
    __namespace: true
};