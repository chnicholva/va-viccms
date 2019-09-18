//reqrib_ButtonAcceptResolution.js
//Contains functions used by the ribbon button for Accept Resolution
//Requires jQuery loaded on the CRM Form

//Static Variables
var reqrib_serverUrl = Xrm.Page.context.getClientUrl();
var reqrib_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";
var userid = Xrm.Page.context.getUserId();

function reqrib_AcceptResolution() {
    //This function is triggered by the Accept Resolution ribbon button
    var txt;
    var r = confirm("Click OK to Accept the Resolution for this Request.");
    if (r == true) {
        var slaRole = false;
        var currentUserRoles = Xrm.Page.context.getUserRoles();
        for (var i = 0; i < currentUserRoles.length; i++) {
            var userRoleId = currentUserRoles[i];
            var userRoleName = GetRoleName(userRoleId);
            if (userRoleName == "VEFT Service Level Advocate") {
               slaRole = true;
            }
        }
        //var PA = Xrm.Page.getAttribute("ftp_patientadvocate_id").getValue();
        //if (slaRole == true){
        //    Xrm.Page.ui.setFormNotification("User is not the assigned Patient Advocate and cannot Accept Resolution.", "ERROR", "sla");
        //    var userNotPA = true;
       // }
        //else{
        //    var userNotPA = false;
       // }
       // if(userNotPA == false){
            RunWorkflow(Xrm.Page.data.entity.getId(), "308ddc73-308a-4653-b2b8-325b1a24554f");
            //window.location.reload(true);
        //}
    } 
}

function enableAcceptResolutionButton() {
    //debugger;
    var enableButton = false;
    var currentUserRoles = Xrm.Page.context.getUserRoles();
    for (var i = 0; i < currentUserRoles.length; i++) {
        var userRoleId = currentUserRoles[i];
        var userRoleName = GetRoleName(userRoleId);
        if (userRoleName == "VEFT Patient Advocate" || userRoleName == "VEFT Patient Advocate Supervisor" || userRoleName == "VEFT Service Level Advocate") {
            enableButton = true;
        }
    }
    return enableButton;
}
function enableRejectResolutionButton() {
    //debugger;
    var enableButton = false;
    var currentUserRoles = Xrm.Page.context.getUserRoles();
    for (var i = 0; i < currentUserRoles.length; i++) {
        var userRoleId = currentUserRoles[i];
        var userRoleName = GetRoleName(userRoleId);
        if (userRoleName == "VEFT Patient Advocate" || userRoleName == "VEFT Patient Advocate Supervisor" || userRoleName == "VEFT Service Level Advocate") {
            enableButton = true;
        }
    }
    return enableButton;
}
function reqrib_RejectResolution() {
    //This function is triggered by the Reject
    var r = confirm("Click OK to Reject the Resolution for this Request.");
    if (r == true) {
        RunWorkflow(Xrm.Page.data.entity.getId(), "11549CEA-6F3F-436A-9EA3-2533C3D77CC3");
        window.location.reload(true);
    } 
}



//Get Rolename based on RoleId
function GetRoleName(roleId) {
    //var serverUrl = Xrm.Page.context.getServerUrl();
    var serverUrl = location.protocol + "//" + location.host + "/" + Xrm.Page.context.getOrgUniqueName();
    var odataSelect = serverUrl + "/XRMServices/2011/OrganizationData.svc" + "/" + "RoleSet?$filter=RoleId eq guid'" + roleId + "'";
    var roleName = null;
    $.ajax(
        {
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: odataSelect,
            beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
            success: function (data, textStatus, XmlHttpRequest) {
                roleName = data.d.results[0].Name;
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) { alert('OData Select Failed: ' + textStatus + errorThrown + odataSelect); }
        }
    );
    return roleName;
}

function reqrib_setSimpleLookupValue(reqrib_LookupId, reqrib_Type, reqrib_Id, reqrib_Name) {
    try {
        //Sets the value for lookup attributes that accept only a single entity reference.
        var reqrib_lookupReference = [];
        reqrib_lookupReference[0] = {};
        reqrib_lookupReference[0].id = reqrib_Id;
        reqrib_lookupReference[0].entityType = reqrib_Type;
        reqrib_lookupReference[0].name = reqrib_Name;
        Xrm.Page.getAttribute(reqrib_LookupId).setValue(reqrib_lookupReference);
    }
    catch (err) {
        alert("An error occured in the reqrib_setSimpleLookupValue function.  Error Detail Message: " + err);
    }
}

function reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, reqrib_aSync, reqrib_aSyncCallback, reqrib_skipCount, reqrib_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*reqrib_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*reqrib_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*reqrib_aSyncCallback* - specify the name of the return function to call upon completion (required if reqrib_aSync = true.  Otherwise '')
    //*reqrib_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*reqrib_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var reqrib_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: reqrib_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                reqrib_entityData = data;
                if (reqrib_aSync == true) {
                    reqrib_aSyncCallback(reqrib_entityData, reqrib_skipCount, reqrib_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in reqrib_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + reqrib_jsonQuery);
            },
            async: reqrib_aSync,
            cache: false
        });
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function reqrib_getSingleEntityDataSync(reqrib_entitySetName, reqrib_attributeSet, reqrib_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*reqrib_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqrib_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqrib_entityId* - is the Guid for the entity record

    try {
        var reqrib_entityIdNoBracket = reqrib_entityId.replace(/({|})/g, '');
        var reqrib_selectString = '(guid' + "'" + reqrib_entityIdNoBracket + "'" + ')?$select=' + reqrib_attributeSet;
        var reqrib_jsonQuery = reqrib_serverUrl + reqrib_crmOdataEndPoint + '/' + reqrib_entitySetName + reqrib_selectString;
        var reqrib_entityData = reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, false, '', 0, null);
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function reqrib_getMultipleEntityDataSync(reqrib_entitySetName, reqrib_attributeSet, reqrib_conditionalFilter, reqrib_sortAttribute, reqrib_sortDirection, reqrib_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*reqrib_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*reqrib_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*reqrib_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*reqrib_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*reqrib_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*reqrib_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var reqrib_jsonQuery = reqrib_serverUrl + reqrib_crmOdataEndPoint + '/' + reqrib_entitySetName + '?$select=' + reqrib_attributeSet + '&$filter=' + reqrib_conditionalFilter + '&$orderby=' + reqrib_sortAttribute + ' ' + reqrib_sortDirection + '&$skip=' + reqrib_skipCount;
        var reqrib_entityData = reqrib_executeCrmOdataGetRequest(reqrib_jsonQuery, false, '', reqrib_skipCount, null);
        return reqrib_entityData;
    }
    catch (err) {
        alert('An error occured in the reqrib_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}
function RunWorkflow(entityId, workflowId) {

    var request = [];
    request.push("<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>");
    request.push("<s:Body>");
    request.push("<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>");
    request.push("  <request i:type='b:ExecuteWorkflowRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>");
    request.push("        <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>");
    request.push("      <a:KeyValuePairOfstringanyType>");
    request.push("        <c:key>EntityId</c:key>");
    request.push("        <c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + entityId + "</c:value>");
    request.push("      </a:KeyValuePairOfstringanyType>");
    request.push("      <a:KeyValuePairOfstringanyType>");
    request.push("        <c:key>WorkflowId</c:key>");
    request.push("        <c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + workflowId + "</c:value>");
    request.push("      </a:KeyValuePairOfstringanyType>");
    request.push("    </a:Parameters>");
    request.push("    <a:RequestId i:nil='true' />");
    request.push("    <a:RequestName>ExecuteWorkflow</a:RequestName>");
    request.push("  </request>");
    request.push("</Execute>");
    request.push("</s:Body>");
    request.push("</s:Envelope>");

    var req = new XMLHttpRequest();
    var URL = getClientUrl();

    req.open("POST", URL, false);
    req.responseType = 'msxml-document';
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    var requestText = request.join("");
    req.send(requestText);
}

function getClientUrl() {
    ///<summary>
    /// Returns the URL for the SOAP endpoint using the context information available in the form
    /// or HTML Web resource.
    ///</summary
    var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
    var clientUrl = "";
    if (typeof GetGlobalContext == "function") {
        var context = GetGlobalContext();
        clientUrl = context.getClientUrl();
    }
    else {
        if (typeof Xrm.Page.context == "object") {
            clientUrl = Xrm.Page.context.getClientUrl();
        }
        else { throw new Error("Unable to access the server URL"); }
    }

    return clientUrl + OrgServicePath;
}
