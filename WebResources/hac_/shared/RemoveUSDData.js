function getSOAPServiceUrl() {
    try {
        var ServicePath = "/XRMServices/2011/Organization.svc/web";
        var clientUrl = "";
        if (typeof GetGlobalContext == "function") {
            var context = GetGlobalContext();
            clientUrl = context.getClientUrl();
        }
        else {
            if (typeof Xrm.Page.context == "object") {
                clientUrl = Xrm.Page.context.getClientUrl();
            }
            else {
                throw new Error("Unable to access the client URL");
            }
        }
        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        } 
        return clientUrl + ServicePath;
    }
    catch (e) { }
}

function RemoveUSDData() {
    var goAhead = confirm("Are you sure you want to delete all USD configuration data from the database?  You cannot undo this action.");
    if (!goAhead) return;
    var now = new Date();
    var dateAndTime = (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    //var deleteDocGen = confirm("Also delete DocGen config records?  Do so if you are about to run the PackageDeployer against this org, because it will create duplicate ones.");
	var deleteDocGen = false; //default to false for any org besides ECC
    try {
        writeToConsole("begin RemoveUSDData()");
        var requestMain = ""
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:BulkDeleteRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>QuerySet</c:key>";
        requestMain += "            <c:value i:type=\"a:ArrayOfQueryExpression\">";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_agentscriptaction</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_task</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_agentscripttaskcategory</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_search</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        // requestMain += "              <a:QueryExpression>";
        // requestMain += "                <a:EntityName>msdyusd_configuration</a:EntityName>";
        // requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_entitysearch</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_scripttasktrigger</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_answer</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_uiievent</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>uii_hostedapplication</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_windowroute</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_scriptlet</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_sessioninformation</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_toolbarstrip</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>uii_action</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_toolbarbutton</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_languagemodule</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        // requestMain += "              <a:QueryExpression>";
        // requestMain += "                <a:EntityName>msdyusd_customizationfiles</a:EntityName>";
        // requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>msdyusd_entityassignment</a:EntityName>";
        requestMain += "              </a:QueryExpression>";
        requestMain += "              <a:QueryExpression>";
        requestMain += "                <a:EntityName>uii_option</a:EntityName>";
        requestMain += "              </a:QueryExpression>";

        if (deleteDocGen) {
            //delete doc gen records, too
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgenmasterdocument</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgendocument</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgendocumentfield</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgenfieldformat</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgenstringconcentation</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgentablefields</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
            requestMain += "              <a:QueryExpression>";
            requestMain += "                <a:EntityName>crme_docgentablemapping</a:EntityName>";
            requestMain += "              </a:QueryExpression>";
        }

        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>JobName</c:key>";
        requestMain += "            <c:value i:type=\"d:string\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">USD Data Bulk Deletion " + dateAndTime + "</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>SendEmailNotification</c:key>";
        requestMain += "            <c:value i:type=\"d:boolean\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">false</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>ToRecipients</c:key>";
        requestMain += "            <c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" />";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>CCRecipients</c:key>";
        requestMain += "            <c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" />";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>RecurrencePattern</c:key>";
        requestMain += "            <c:value i:type=\"d:string\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\" />";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>StartDateTime</c:key>";
        requestMain += "            <c:value i:type=\"d:dateTime\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">0001-01-01T00:00:00</c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>BulkDelete</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";
        writeToConsole("requestMain:"); writeToConsole(requestMain);
        var req = new XMLHttpRequest();
        req.open("POST", getSOAPServiceUrl(), true)
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        //req.onreadystatechange(function () { bulkDeleteCallback(this); });
        writeToConsole("req:"); writeToConsole(req);
        req.send(requestMain);
        writeToConsole("request sent.");
        debugger;
        writeToConsole(req.response);
        alert("CRM will take a minute or two to delete USD data in the background.");
    }
    catch (e) { }
}
function bulkDeleteCallback(pReq) {
    writeToConsole("inside bulkDeleteCallback()");
    writeToConsole("pReq.readyState: " + pReq.readyState);
    if (pReq.readyState == 4 /* complete */) {
        writeToConsole("pReq.status: " + pReq.status);
        if (pReq.status == 200) {
            writeToConsole("pReq.responseText:");
            writeToConsole(pReq.responseText);
        }
    }
}

// Used to create an oData call.
function GetRequestObject() {
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
}

// Used to increment the cache by 1 so that USD data is refreshed on the client machines
function IncrementCacheVersionNumber() {
    var clientUrl = Xrm.Page.context.getClientUrl();
    var oDataEndpointUrl = clientUrl + "/XRMServices/2011/OrganizationData.svc/";
    oDataEndpointUrl += "uii_optionSet?$filter=uii_name eq 'ClientCacheVersionNumber'";

    var service = GetRequestObject();

    if (service != null)
    {
        service.open("GET", oDataEndpointUrl, false);
        service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
        service.setRequestHeader("Accept", "application/json, text/javascript, */*");
        service.send(null);

        var requestResults = eval('(' + service.responseText + ')').d;
        if (requestResults.results.length > 0)
        {
            var optionValue = (parseInt(requestResults.results[0].uii_value) + 1).toString();
            var optionId = requestResults.results[0].uii_optionId;
            var objOption = new Object();
            objOption.uii_value = optionValue;
            if (optionValue == "NaN")
            {
                alert("Cache not updated, make sure the 'ClientCacheVersionNumber' record contains an integer value.");
                return false;
            }
            // Parse the entity object into JSON 
            var jsonEntity = window.JSON.stringify(objOption);

            oDataEndpointUrl = clientUrl + "/XRMServices/2011/OrganizationData.svc/uii_optionSet(guid'" + optionId + "')";

            var service = GetRequestObject();
            service.open("POST", oDataEndpointUrl, false);
            service.setRequestHeader("X-HTTP-Method", "MERGE");
            service.setRequestHeader("Accept", "application/json");
            service.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            service.send(jsonEntity);

            if (service.responseText != "")
                alert("Error updating cache version: " + service.responseText);
            else
            {
                alert("Cache version successfully updated to " + optionValue + ".");
                return true;
            }
        }
        else
            alert("Cache version not found.  Make sure an Option record exists named 'ClientCacheVersionNumber'.");
    }
    return false;
}

function writeToConsole(message) {
    if (typeof console != "undefined") {
        console.log(message);
    }
}