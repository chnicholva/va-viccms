/// <reference path="../../JScript/SDK.REST.js" />

var currentUserId = Xrm.Page.context.getUserId();
var StatusReason = Xrm.Page.getAttribute("statuscode").getValue();
var recordOwnerId = Xrm.Page.getAttribute("ownerid").getValue()[0].id;
var reqrib_serverUrl = Xrm.Page.context.getClientUrl();
var reqrib_crmOdataEndPoint = "/XRMServices/2011/OrganizationData.svc";

var _currentUserRoleNames = [];

function form_onLoad() {
    GetRoleNames(adjustControlsForUserRoles);
	if(Xrm.Page.getAttribute("ftp_patsmigrated_bool").getValue())
    {
        Xrm.Page.ui.tabs.get("RequestDetail").sections.get("RequestDetail_migrated_section").setVisible(true);
    }
    else
    {
        Xrm.Page.ui.tabs.get("RequestDetail").sections.get("RequestDetail_migrated_section").setVisible(false);
    }
}

function adjustControlsForUserRoles() {
    var slRole = false;
    var slaRole = false;
    var PARole = false;
    var SysAdmRole = false;
    var PASRole = false;
    var VPACRole = false;
    var FOIARole = false;
    var userIsOwner = currentUserId == recordOwnerId;
debugger;
    slRole = _currentUserRoleNames.indexOf("VEFT Service Line User") > -1 || _currentUserRoleNames.indexOf("VEFT Service Line Supervisor") > -1;
    slaRole = _currentUserRoleNames.indexOf("VEFT Service Level Advocate") > -1;
    PARole = _currentUserRoleNames.indexOf("VEFT Patient Advocate") > -1;
    PASRole = _currentUserRoleNames.indexOf("VEFT Patient Advocate Supervisor") > -1;
    VPACRole = _currentUserRoleNames.indexOf("VEFT VPAC") > -1;
    SysAdmRole = _currentUserRoleNames.indexOf("System Administrator") > -1 || _currentUserRoleNames.indexOf("System Customizer") > -1;
    FOIARole = _currentUserRoleNames.indexOf("VEFT Privacy Officer/FOIA User") > -1;

    if (SysAdmRole || PARole || PASRole || VPACRole || FOIARole) {
        showAttachmentsTab();
    }
    else if (slRole || slaRole) {

        // if this is an SLA/SL, then they can see the attachments tab if they're a member of the team that owns the service line for this request

        retrieveServiceLineWithOwningTeamAndMembers(
            function (pData) {
                if (!!pData && !!pData.teammembership_association && !!pData.teammembership_association.results) {
                    var userIsTeamMember = ArrayIndexOfObjectByAttribute(pData.teammembership_association.results, "SystemUserId", Xrm.Page.context.getUserId().toLowerCase().replace("{", "").replace("}", "")) > -1;
                    if (userIsTeamMember) {
                        showAttachmentsTab();
                    }
                }
            }
        );
    }

    // if this is the update form, then show the Add Attachments section.
    // This section may still not be visible to users based on role (see above code for logic on whether the tab this section is displayed in will be visible)
    if (Xrm.Page.ui.getFormType() == 2) {
        showAddAttachmentsSection();
    }

    if (Xrm.Page.ui.getFormType() == 4 || Xrm.Page.ui.getFormType() == 3) {
        Xrm.Page.ui.tabs.get("Tab_NotesAndResolutions").sections.get("AddActivityButton_section").setVisible(false);
        Xrm.Page.ui.tabs.get("Tab_NotesAndResolutions").sections.get("ResolveRequestButton_section").setVisible(false);
        Xrm.Page.ui.tabs.get("RequestDetail").sections.get("AddEmployeeButton_section").setVisible(false);
        Xrm.Page.ui.tabs.get("tab_Attachments").sections.get("section_AddAttachment").setVisible(false);
    }
    else {
        if (StatusReason != 100000011 && StatusReason != 100000010) {
            Xrm.Page.ui.tabs.get("Tab_NotesAndResolutions").sections.get("ResolveRequestButton_section").setVisible(false);
        }
        else if (VPACRole && !userIsOwner) {
            Xrm.Page.ui.tabs.get("Tab_NotesAndResolutions").sections.get("ResolveRequestButton_section").setVisible(false);
        }
    }

    //if user is SL (granted by teams) and not SLA or PA/PA Sup, lock Request Details
    if ((slRole == true && !slaRole && !PARole ) || (VPACRole && !userIsOwner)) {
        //lock Request Detail fields and hide Add Employees button
        Xrm.Page.ui.controls.get("ftp_requestdescription_text").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_requestfacilityid").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_veftpriority_code").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_subfacility_id").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_requestdate_date").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_duedate_date").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_codeid").setDisabled(true);
        Xrm.Page.ui.tabs.get("RequestDetail").sections.get("AddEmployeeButton_section").setVisible(false);
        Xrm.Page.ui.tabs.get("RequestDetail").sections.get("Notifications_Employees_section_3").setVisible(false);
    }
	else{
       if (slaRole){
            Xrm.Page.getAttribute("ftp_assignedservicelineid").setSubmitMode("dirty");
       }
	Xrm.Page.getAttribute("ftp_assigntovpac_bool").setSubmitMode("always");
	Xrm.Page.getAttribute("ftp_impactedservicelineid").setSubmitMode("always");
        Xrm.Page.getAttribute("ftp_requestfacilityid").setSubmitMode("always");
        Xrm.Page.getAttribute("ftp_subfacility_id").setSubmitMode("always");
}
    //if user is SLA lock Assign to VPAC and Impacted Service Line fields.  If user is SLA and not the user that created the request, lock request details
    if (slaRole == true) {
        var Createdby = Xrm.Page.getAttribute("createdby").getValue();
        Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(true);
        if (currentUserId != Createdby[0].id) {
            Xrm.Page.ui.controls.get("ftp_requestdescription_text").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_requestfacilityid").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_veftpriority_code").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_subfacility_id").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_requestdate_date").setDisabled(true);
            //Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(true); //Commented out per story 751750
            Xrm.Page.ui.controls.get("ftp_duedate_date").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_codeid").setDisabled(true);
            Xrm.Page.ui.tabs.get("RequestDetail").sections.get("AddEmployeeButton_section").setVisible(false);
            Xrm.Page.ui.tabs.get("RequestDetail").sections.get("Notifications_Employees_section_3").setVisible(false);
        }

    }
    if (VPACRole) {
        Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(true);
        Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(true);
    }

    if (PARole || PASRole) {
        var AssignedServiceLineValue = Xrm.Page.getAttribute("ftp_assignedservicelineid").getValue();
        var ImpactedServiceLineValue = Xrm.Page.getAttribute("ftp_impactedservicelineid").getValue();
        var AssigntoVPACValue = Xrm.Page.getAttribute("ftp_assigntovpac_bool").getValue();

        if (StatusReason != 100000007){
            Xrm.Page.getAttribute("ftp_assignedservicelineid").setSubmitMode("always");
        }
       else{
           Xrm.Page.getAttribute("ftp_assignedservicelineid").setSubmitMode("dirty");
       }

        if (AssignedServiceLineValue) {
            Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(false);
            Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(true);
        }
        if (ImpactedServiceLineValue) {
            Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(false);
        }
        if (AssigntoVPACValue) {
            Xrm.Page.ui.controls.get("ftp_assignedservicelineid").setDisabled(true);
            Xrm.Page.ui.controls.get("ftp_assigntovpac_bool").setDisabled(false);
            Xrm.Page.ui.controls.get("ftp_impactedservicelineid").setDisabled(true);
        }
    }
}

function ActivityDescription_onChange(context) {
    var ActivityDescriptionValue = Xrm.Page.getAttribute("ftp_activitydescription_memo").getValue();
    Xrm.Page.getAttribute("ftp_isactivitydescriptionpopulated_bool").setValue(!!ActivityDescriptionValue);
}

function reqrib_AcceptResolution() {
    //This function is triggered by the Accept Resolution ribbon button
    var r = confirm("Click OK to Accept the Resolution for this Request.");
    if (r == true) {
        N52QuickRibbon.ExecuteFormulaOnForm('Kxi');
    }
}

function enableAcceptResolutionButton() {
//debugger;
if(!_currentUserRoleNames){
var _currentUserRoleNames = [];  
GetRoleNames();
}
      var enableButton = false;
	var currentUserId = Xrm.Page.context.getUserId();
	var recordOwnerId = Xrm.Page.getAttribute("ownerid").getValue()[0].id;
	var userIsOwner = currentUserId == recordOwnerId;

	//enableButton = _currentUserRoleNames.indexOf("VEFT Patient Advocate Supervisor") > -1 && !userIsOwner;
       enableButton = (_currentUserRoleNames.indexOf("VEFT Patient Advocate") > -1 || _currentUserRoleNames.indexOf("VEFT Patient Advocate Supervisor") > -1);
    return enableButton;
}
function enableRejectResolutionButton() {
//debugger;
if(!_currentUserRoleNames){
 var_currentUserRoleNames = []; 
 GetRoleNames();
}
    var enableButton = false;
    var currentUserId = Xrm.Page.context.getUserId();
    var recordOwnerId = Xrm.Page.getAttribute("ownerid").getValue()[0].id;
    var userIsOwner = currentUserId == recordOwnerId;

  //  enableButton = (_currentUserRoleNames.indexOf("VEFT Patient Advocate") > -1 || _currentUserRoleNames.indexOf("VEFT Patient Advocate Supervisor") > -1) && !userIsOwner;
  enableButton = (_currentUserRoleNames.indexOf("VEFT Patient Advocate") > -1 || _currentUserRoleNames.indexOf("VEFT Patient Advocate Supervisor") > -1);

    return enableButton;
}
function reqrib_RejectResolution() {
    //This function is triggered by the Reject
    var r = confirm("Click OK to Reject the Resolution for this Request.");
    if (r == true) {
        N52QuickRibbon.ExecuteFormulaOnForm('NqN');
       //window.location.reload(true);
    } 
}

function GetRoleNames(pCallbackFunction) {
    _currentUserRoleNames = [];
    var queryString = "$select=Name&$filter=";
    Xrm.Page.context.getUserRoles().forEach(
        function (thisRoleID, i) {
            queryString += ((i > 0 ? " or " : "") + "RoleId eq guid'" + thisRoleID + "'");
        }
    );
    var retrievedRoles = [];
    SDK.REST.retrieveMultipleRecords(
        "Role",
        queryString,
        function (retrievedRecords) {
            if (!!retrievedRecords && retrievedRecords.length > 0) retrievedRoles = retrievedRoles.concat(retrievedRecords);
        },
        function (e) {
            alert(e.message);
        },
        function () {
            retrievedRoles.forEach(
                function (thisRole, i) {
                    _currentUserRoleNames.push(thisRole.Name);
                }
            );

            if (typeof pCallbackFunction == "function") {
                pCallbackFunction();
            }
        }
    );    
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

function retrieveServiceLineWithOwningTeamAndMembers(pCallbackFunction) {
    //ftp_servicelineintersectionSet(guid'%7BC6B06E33-9306-E811-812D-1289A8FDD3DA%7D')/team_ftp_servicelineintersection?$select=TeamId,teammembership_association/SystemUserId,teammembership_association/FullName&$expand=teammembership_association
    var assignedServiceLineValue = Xrm.Page.getAttribute("ftp_assignedservicelineid").getValue();
    if (!!assignedServiceLineValue) {
        var currentUserId = Xrm.Page.context.getUserId();
        var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        var query = "ftp_servicelineintersectionSet(guid'" + assignedServiceLineValue[0].id + "')/team_ftp_servicelineintersection?$select=TeamId,teammembership_association/SystemUserId,teammembership_association/FullName&$expand=teammembership_association";

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: oDataPath + query,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (!!data && typeof pCallbackFunction == "function") pCallbackFunction(data.d);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error retrieving teams for current user: " + errorThrown);
            },
            async: true,
            cache: false
        });
    }
}

function showAttachmentsTab() {
    Xrm.Page.ui.tabs.get("tab_Attachments").setVisible(true);
}

function showAddAttachmentsSection() {
    Xrm.Page.ui.tabs.get("tab_Attachments").sections.get("section_AddAttachment").setVisible(true);
}

function GetRequestObject() {
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest;
    } else {
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        } catch (ex) {
            return null;
        }
    }
}

function errorHandler(error) {
    alert(error.message);
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    if (!!pArray && Object.prototype.toString.call(pArray) == "[object Array]" && !!pAttr && !!pValue) {
        for (var i = 0; i < pArray.length; i += 1) {
            if (pArray[i][pAttr] === pValue) {
                return i;
            }
        }
    }
    return -1;
}
function cleanGUID(guid) {
    return guid.replace(/[{}]/g, "").toLowerCase();
}