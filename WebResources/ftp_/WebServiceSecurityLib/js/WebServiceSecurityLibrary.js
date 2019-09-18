//WebServiceSecurityLibrary.js
var wss_crmServerUrl = null;

function CrmSecurityTokenEncryption(_serviceEndpoint, _serviceParams, _crmServerUrl, _responseCallback) {
    //This function is used to encrypt and obtain a security token prior to calling secure web services
    //_serviceEndpoint: This is the URL used to call the secure web service  (excludes parameters)
    //_serviceParams: This is the properly formatted parameters required by the secure web service
    //_crmServerUrl: This is the CRM user's current URL of their calling application
    //_responseCallback: This is the name of the function to return the query result to
    
    //Return Values:
    //1. error text (null when no error)
    //2. the secure Service data object returned (null when error occured)

    try {
        wss_crmServerUrl = _crmServerUrl;
        if (_serviceEndpoint != "" && _serviceParams.length > 0) {
            CrmSecurityCallAction("bah_requestserviceticketaction",
                _serviceParams,
                function (params) {
                    // Success
                    for (var i = 0; i < params.length; i++) {
                        //alert(params[i].key + "=" + params[i].value);
                        if (params[i].key == 'serviceticket') {
                            var postdata = {};
                            postdata.token = params[i].value;
                            $.ajax({
                                type: 'POST',
                                data: postdata,
                                url: _serviceEndpoint,
                                timeout: 20000,
                                error: function (jqXHR, textStatus, errorThrown) {
                                    _esrObj = null;
                                    _responseCallback(textStatus, errorThrown);
                                },
                                success: function (result) {
                                    _esrObj = result;
                                    _responseCallback(null, result);
                                }
                            });
                        }
                    }
                },
                function (e) {
                    // Error
                    _responseCallback("Token Failure", e);
                }
            );
        }
    }
    catch (err) {
        alert("WebSecurityLibrary Web Resource Function Error(CrmSecurityTokenEncryption): " + err.message);
    }
}

var CrmSecurityCallAction = function (actionName, inputParams, successCallback, errorCallback, url) {
    try {
        if (url == null) {
            url = wss_crmServerUrl;
        }

        var requestXml = "<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>" +
              "<s:Body>" +
                "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>" +
                  "<request xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>" +
                    "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>";

        if (inputParams) {
            // Add each input param
            for (var i = 0; i < inputParams.length; i++) {
                var param = inputParams[i];

                var value = "";
                var displayXmlns = false;

                // Check the param type to determine how the value is formed
                switch (param.type) {
                    case "c:boolean":
                    case "c:int":
                    case "c:string":
                        value = param.value;
                        displayXmlns = true;
                        break;
                    case "c:dateTime":
                        value = param.value.toISOString();
                        displayXmlns = true;
                        break;
                    case "a:EntityReference":
                        value = "<a:Id>" + param.value.id + "</a:Id>" +
                          "<a:LogicalName>" + param.value.entityType + "</a:LogicalName>" +
                          "<a:Name i:nil='true' />";
                        break;
                    case "a:OptionSetValue":
                    case "a:Money":
                        value = "<a:Value>" + param.value + "</a:Value>";
                        break;
                    default:
                        if (errorCallback) {
                            errorCallback("Type of input parameter " + (i + 1) + " '" + param.type + "' is invalid or unsupported");
                        }
                        return;
                        break;
                }

                requestXml += "<a:KeyValuePairOfstringanyType>" +
                        "<b:key>" + param.key + "</b:key>" +
                        "<b:value i:type='" + param.type + "' " + (displayXmlns ? "xmlns:c='http://www.w3.org/2001/XMLSchema'" : "") + ">" + value + "</b:value>" +
                      "</a:KeyValuePairOfstringanyType>";
            }
        }

        requestXml += "</a:Parameters>" +
                    "<a:RequestId i:nil='true' />" +
                    "<a:RequestName>" + actionName + "</a:RequestName>" +
                  "</request>" +
                "</Execute>" +
              "</s:Body>" +
            "</s:Envelope>";

        var req = new XMLHttpRequest();
        req.open("POST", url + "/XRMServices/2011/Organization.svc/web", true);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");

        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    // Action completed successfully - get output params
                    var responseParams = req.responseXML.getElementsByTagName("a:KeyValuePairOfstringanyType"); // IE
                    if (responseParams.length == 0) {
                        responseParams = req.responseXML.getElementsByTagName("KeyValuePairOfstringanyType"); // FireFox and Chrome
                    }

                    var outputParams = [];
                    for (i = 0; i < responseParams.length; i++) {

                        var attrNameNode = responseParams[i].childNodes[0].firstChild;
                        var attributeName = attrNameNode.textContent || attrNameNode.nodeValue || attrNameNode.data || attrNameNode.text;

                        var attributeValue = "";
                        if (responseParams[i].childNodes[1].firstChild != null) {
                            var attrValueNode = responseParams[i].childNodes[1].firstChild;
                            attributeValue = attrValueNode.textContent || attrValueNode.nodeValue || attrValueNode.data || attrValueNode.text;
                        }

                        // Values will be string, figure out the types yourself
                        outputParams.push({ key: attributeName, value: attributeValue });

                        /*
                        DateTime = "2015-06-23T21:00:00Z" (AS UTC STRING)
                        bool = "true" (AS STRING)
                        OptionSet, int, etc = "1" (AS STRING)
                        */
                    }

                    if (successCallback) {
                        // Make sure the callback accepts exactly 1 argument - use dynamic function if you want more
                        successCallback(outputParams);
                    }
                }
                else {
                    // Error has occured, action failed
                    if (errorCallback) {
                        var error = null;
                        try { error = req.responseXML.getElementsByTagName("Message")[0].firstChild.nodeValue; } catch (e) { }
                        errorCallback(error);
                    }
                }
            }
        };
        req.send(requestXml);
    }
    catch (err) {
        alert("WebSecurityLibrary Web Resource Function Error(CrmSecurityCallAction): " + err.message);
    }
}