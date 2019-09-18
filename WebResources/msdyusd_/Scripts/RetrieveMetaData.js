SDK = window.SDK || {
    __namespace: true
};
SDK.Metadata = SDK.Metadata || {
    __namespace: true
};

(function () {
    //to retrieve the metadata of the given entity.
    this.RetrieveEntity = function (EntityFilters, LogicalName, MetadataId, RetrieveAsIfPublished, successCallBack, errorCallBack, passThroughObject) {
        var entityFiltersValue = EntityFilters;
        if (MetadataId == null) {
            MetadataId = "00000000-0000-0000-0000-000000000000";
        }
        var entityLogicalNameValueNode = "";
        if (LogicalName == null) {
            entityLogicalNameValueNode = "<b:value i:nil=\"true\" />";
        } else {
            entityLogicalNameValueNode = "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + CrmEncodeDecode.CrmXmlEncode(LogicalName.toLowerCase()) + "</b:value>";
        }
        var request = [
            "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">",
            //Allows retrieval if ImageAttributeMetadata objects
            "<soapenv:Header><a:SdkClientVersion xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">6.0</a:SdkClientVersion></soapenv:Header>",
            "<soapenv:Body>",
            "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">",
            "<request i:type=\"a:RetrieveEntityRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>EntityFilters</b:key>",
            "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + CrmEncodeDecode.CrmXmlEncode(entityFiltersValue) + "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>MetadataId</b:key>",
            "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + CrmEncodeDecode.CrmXmlEncode(MetadataId) + "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RetrieveAsIfPublished</b:key>",
            "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + CrmEncodeDecode.CrmXmlEncode(RetrieveAsIfPublished.toString()) + "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>LogicalName</b:key>",
            entityLogicalNameValueNode,
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil=\"true\" />",
            "<a:RequestName>RetrieveEntity</a:RequestName>",
            "</request>",
            "</Execute>",
            "</soapenv:Body>",
            "</soapenv:Envelope>"
        ].join("");
        var req = new XMLHttpRequest();
        req.open("POST", Context().getClientUrl() + "/XRMServices/2011/Organization.svc/web", true);
        try {
            req.responseType = 'msxml-document'
        } catch (e) { }
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        req.onreadystatechange = function () {
            if (req.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (req.status == 200) {
                    var doc = req.responseXML;
                    try { setSelectionNamespaces(doc); } catch (e) { }
                    var a = objectifyNode(SelectSingleNode(doc, "//b:value"));
                    a._type = "EntityMetadata";
                    successCallBack(a, passThroughObject);
                } else {
                    //Failure
                    errorCallBack(req);
                }
            }

        };
        req.send(request);
    };

    var arrayElements = ["Attributes", "LocalizedLabels"];

    function Context() {
        var errorMessage = "Context is not available.";
        if (typeof GetGlobalContext != "undefined") {
            return GetGlobalContext();
        } else {
            if (typeof Xrm != "undefined") {
                return Xrm.Page.context;
            } else {
                return new Error(errorMessage);
            }
        }
    };

    function isMetadataArray(elementName) {
        for (var i = 0; i < arrayElements.length; i++) {
            if (elementName == arrayElements[i]) {
                return true;
            }
        }
        return false;
    };

    function SelectSingleNode(node, xpathExpr) {
        if (typeof (node.selectSingleNode) != "undefined") {
            return node.selectSingleNode(xpathExpr);
        }
        else {
            var xpe = new XPathEvaluator();
            var xPathNode = xpe.evaluate(xpathExpr, node, NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return (xPathNode != null) ? xPathNode.singleNodeValue : null;
        }
    };

    function objectifyNode(node) {
        //Check for null
        if (node.attributes != null && node.attributes.length == 1) {
            if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue == "true") {
                return null;
            }
        }

        //Check if it is a value
        if ((node.firstChild != null) && (node.firstChild.nodeType == 3)) {
            var nodeName = getNodeName(node);
            return node.firstChild.nodeValue;
        }

        //Check if it is a known array
        if (isMetadataArray(getNodeName(node))) {
            var arrayValue = [];

            for (var i = 0; i < node.childNodes.length; i++) {
                var objectTypeName;
                if ((node.childNodes[i].attributes != null) && (node.childNodes[i].attributes.getNamedItem("i:type") != null)) {
                    objectTypeName = node.childNodes[i].attributes.getNamedItem("i:type").nodeValue.split(":")[1];
                } else {

                    objectTypeName = getNodeName(node.childNodes[i]);
                }

                var b = objectifyNode(node.childNodes[i]);
                b._type = objectTypeName;
                arrayValue.push(b);

            }
            return arrayValue;
        }

        //Null entity description labels are returned as <label/> - not using i:nil = true;
        if (node.childNodes.length == 0) {
            return null;
        }

        //Otherwise return an object
        var c = {};
        if (node.attributes.getNamedItem("i:type") != null) {
            c._type = node.attributes.getNamedItem("i:type").nodeValue.split(":")[1];
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType == 3) {
                c[getNodeName(node.childNodes[i])] = node.childNodes[i].nodeValue;
            } else {
                c[getNodeName(node.childNodes[i])] = objectifyNode(node.childNodes[i]);
            }

        }
        return c;
    };

    function getNodeName(node) {
        if (typeof (node.baseName) != "undefined") {
            return node.baseName;
        } else {
            return node.localName;
        }
    };

    function setSelectionNamespaces(doc) {
        var namespaces = [
            "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
            "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
            "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
            "xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'",
            "xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'"
        ];
        doc.setProperty("SelectionNamespaces", namespaces.join(" "));
    };

    function NSResolver(prefix) {
        var ns = {
            "s": "http://schemas.xmlsoap.org/soap/envelope/",
            "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
            "i": "http://www.w3.org/2001/XMLSchema-instance",
            "b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
            "c": "http://schemas.microsoft.com/xrm/2011/Metadata"
        };
        return ns[prefix] || null;
    };

}).call(SDK.Metadata);