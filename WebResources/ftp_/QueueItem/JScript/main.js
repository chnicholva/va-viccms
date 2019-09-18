///// <reference path="XrmPage-vsdoc.js" />
///// <reference path="XrmPageTemplate.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />

//global form variables
var currentUserDetails = {
    SystemUserId: "",
    Name: "",
    ConfigurationName: "",
    roles: [],
    teams: []
};

var owningUserDetails = {
    SystemUserId: "",
    Name: "",
    ConfigurationName: "",
    roles: [],
    teams: []
};

var multipleReasonsForRequestGUID = "156db634-ee0d-e511-8108-00155d14711e";
var otherReasonForRequestGUID = "136db634-ee0d-e511-8108-00155d14711e";
var narcoticRFRName = "Medication - Renewal Narcotic";
var nonNarcoticRFRName = "Medication - Renewal Non-Narcotic";
var _retrievedSettings = null,
	_ICN = null,
	_nationalId = null,
	_notProd = true,
    _veteranPACTTeam = null,
    _veteranFacilityId = null,
    _veteranFacilityIdName = null,
    _MHVID = null;

function enableDisableAdvancedFindButton() {
    var VEFTBU = false;
    try {
        var user = Xrm.Page.context.getUserId();
        var SetName = "TeamMembershipSet";
        var filter = "SystemUserId";
        var tArray = [];
        var data = {};
        var d = {};
        data = RetrieveMultipleEntitySync(SetName, filter, user);
        for (i = 0; i < data.d.results.length; i++) {
            tArray.push(data.d.results[i].TeamId);
        }
        for (i = 0; i < tArray.length; i++) {
            d = RetrieveMultipleEntitySync("TeamSet", "", tArray[i]);
            // d = RetrieveAllAttributesByEntitySync("TeamSet", tArray[i]);
            if (d.d.Name === "VEFT") {
                VEFTBU = true;
            }
        }
    }
    catch (e) {
    }
    return VEFTBU;
}

function retrieveCurrentUserAndOwnerTeamsAndRoles(pCallbackFunction) {
    //populates the global currentUserDetails and owningUserDetails objects and then performs pCallbackFunction();
    if (typeof pCallbackFunction == "function") {
        //clear out original objects first
        currentUserDetails = {
            SystemUserId: "",
            Name: "",
            ConfigurationName: "",
            roles: [],
            teams: []
        };

        owningUserDetails = {
            SystemUserId: "",
            Name: "",
            ConfigurationName: "",
            roles: [],
            teams: []
        };

        var retrievedUsers = [];
        var queryOptions = "$expand=teammembership_association,systemuserroles_association";
        queryOptions += "&$select=SystemUserId,FullName,msdyusd_USDConfigurationId,teammembership_association/Name,teammembership_association/TeamId,systemuserroles_association/RoleId,systemuserroles_association/Name";
        queryOptions += "&$filter=SystemUserId eq guid'" + Xrm.Page.context.getUserId() + "'";
        var ownerValue = Xrm.Page.getAttribute("ownerid").getValue();
        if (!!ownerValue && ownerValue[0].entityType == "systemuser") {
            queryOptions += " or SystemUserId eq guid'" + ownerValue[0].id + "'";
        }
        SDK.REST.retrieveMultipleRecords(
			"SystemUser",
			queryOptions,
			function (retrievedRecords) {
			    if (!!retrievedRecords && retrievedRecords.length > 0) retrievedUsers = retrievedUsers.concat(retrievedRecords);
			},
			errorHandler,
			function () {
			    for (var i = 0, l = retrievedUsers.length; i < l; i++) {
			        var thisUser = retrievedUsers[i];

			        //populate currentUserDetails object
			        if (cleanGUID(thisUser.SystemUserId) == cleanGUID(Xrm.Page.context.getUserId())) {
			            currentUserDetails.SystemUserId = thisUser.SystemUserId;
			            currentUserDetails.Name = thisUser.FullName;
			            currentUserDetails.ConfigurationName = (!!thisUser.msdyusd_USDConfigurationId) ? thisUser.msdyusd_USDConfigurationId.Name : "";
			            //roles
			            for (var j = 0, m = thisUser.systemuserroles_association.results.length; j < m; j++) {
			                var thisRole = thisUser.systemuserroles_association.results[j];
			                currentUserDetails.roles.push({ RoleId: thisRole.RoleId, Name: thisRole.Name });
			            }
			            //teams
			            for (var j = 0, m = thisUser.teammembership_association.results.length; j < m; j++) {
			                var thisTeam = thisUser.teammembership_association.results[j];
			                currentUserDetails.teams.push({ TeamId: thisTeam.TeamId, Name: thisTeam.Name });
			            }
			        }

			        //populate owningUserDetails object
			        if (!!ownerValue && ownerValue[0].entityType == "systemuser" && cleanGUID(thisUser.SystemUserId) == cleanGUID(ownerValue[0].id)) {
			            owningUserDetails.SystemUserId = thisUser.SystemUserId;
			            owningUserDetails.Name = thisUser.FullName;
			            owningUserDetails.ConfigurationName = (!!thisUser.msdyusd_USDConfigurationId) ? thisUser.msdyusd_USDConfigurationId.Name : "";
			            //roles
			            for (var j = 0, m = thisUser.systemuserroles_association.results.length; j < m; j++) {
			                var thisRole = thisUser.systemuserroles_association.results[j];
			                owningUserDetails.roles.push({ RoleId: thisRole.RoleId, Name: thisRole.Name });
			            }
			            //teams
			            for (var j = 0, m = thisUser.teammembership_association.results.length; j < m; j++) {
			                var thisTeam = thisUser.teammembership_association.results[j];
			                owningUserDetails.teams.push({ TeamId: thisTeam.TeamId, Name: thisTeam.Name });
			            }
			        }
			    }

			    //perform whatever callback we wanted
			    pCallbackFunction();
			}//end retrieveMultipleRecords(users) OnComplete function
		);
    }
    else {
        alert("Your callback parameter must be a function");
    }
}

function errorHandler(error) {
    alert(error.message);
}

function userHasRole(pRoleName, pRoleArray) {
    var result = false;
    for (var i = 0, l = pRoleArray.length; i < l; i++) {
        if (pRoleArray[i].Name.toLowerCase() == pRoleName.toLowerCase()) {
            result = true;
            break;
        }
    }
    return result;
}

function userIsOnTeam(pTeamName, pTeamArray) {
    var result = false;
    for (var i = 0, l = pTeamArray.length; i < l; i++) {
        if (pTeamArray[i].Name.toLowerCase() == pTeamName.toLowerCase()) {
            result = true;
            break;
        }
    }
    return result;
}


RetrieveMultipleEntitySync = function (EntitySetName, filter, Guid) {

    //This function will return a json object with every attribute from an entity for a single record synchronously 
    try {
        //Perform REST call
        var context = Xrm.Page.context;
        var serverUrl = context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Format Entity Guid
        var EntityIdnobracket = Guid.replace(/({|})/g, '');
        //Construct the JSON Query
        var selectString = "";
        if (filter !== "") { selectString = "?$filter=" + filter + " eq guid'" + EntityIdnobracket + "'"; }
        else { selectString = "(guid'" + EntityIdnobracket + "')?$select=*"; }

        var jsonQuery = serverUrl + ODATA_ENDPOINT + "/" + EntitySetName + selectString;

        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in RetrieveMultipleEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        //Return the data result
        return EntityData;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the RetrieveMultipleEntitySyncEntitySync function.  Error Detail Message: " + err);
    }
};

function enableTriageButton() {
    var TANTeam = false;
    try {
        var user = Xrm.Page.context.getUserId();
        var SetName = "TeamMembershipSet";
        var filter = "SystemUserId";
        var tArray = [];
        var data = {};
        var d = {};
        data = RetrieveMultipleEntitySync(SetName, filter, user);
        for (i = 0; i < data.d.results.length; i++) {
            tArray.push(data.d.results[i].TeamId);
        }
        for (i = 0; i < tArray.length; i++) {
            d = RetrieveMultipleEntitySync("TeamSet", "", tArray[i]);
            // d = RetrieveAllAttributesByEntitySync("TeamSet", tArray[i]);
            if (d.d.Name === "TAN") {
                TANTeam = true;
            }
        }
    }
    catch (e) {
    }
    return TANTeam;
}

function ftp_assigneetype_onChange() {
    return;
    //not yet implemented
    try {
        var assigneeTypeAttr = Xrm.Page.getAttribute("ftp_assigneetype");
        if (!!assigneeTypeAttr) {
            pcmm_Enabled = !!_retrievedSettings ? _retrievedSettings.ftp_IsPCMMEnabled : true; //global variable defined in pcmm.js library
            var assigneeTypeText = assigneeTypeAttr.getText();
            var formType = Xrm.Page.ui.getFormType();
            var teamLookupControl = Xrm.Page.getControl("ftp_teamselected");
            if (!!teamLookupControl) {
                var require = formType == 2 && assigneeTypeText == "Team" && pcmmEnabled == false;
                var visible = formType == 2 && (assigneeTypeText == "Team" || (assigneeTypeText == "User" && pcmmEnabled == true));
                teamLookupControl.setRequiredLevel(require ? "required" : "none");
                teamLookupControl.setVisible(visible);

                //set custom FetchXML
            }

            var userLookupControl = Xrm.Page.getControl("ftp_userselected");
            if (!!userLookupControl) {
                var require = formType == 2 && assigneeTypeText == "User";
                var visible = require;
                userLookupControl.setRequiredLevel(require ? "required" : "none");
                userLookupControl.setVisible(visible);

                //set custom FetchXML
            }

            if (formType == 2) {
                

                




                var vetId = Xrm.Page.getAttribute("customerid").getValue()[0].id;
                var veteran = retrieveSingleVeteran(vetId);
                var vetFacility = veteran.d.ftp_FacilityId;
                var Pact = veteran.d.hasOwnProperty("ftp_PACTId") && !!veteran.d.ftp_PACTId ? veteran.d.ftp_PACTId.Name : "";
                var teams = retrieveTeams(Pact);

                for (i = 0; i < teams.d.results.length; i++) {
                    if (teams.d.results[i].Name === Pact) {
                        var vetPact = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Pharmacy") {
                        var pharm = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "TAN") {
                        var tan = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Speciality") {
                        var specialty = teams.d.results[i];
                    }
                }
                if (assigneeTypeText == "User") {
                    setUserTeamFetch(vetFacility, vetPact, specialty, pharm);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(true);
                    Xrm.Page.getAttribute("ftp_userselected").setRequiredLevel("required");
                    //****************************
                    if (pcmmEnabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("none");
                        Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(false);
                    }
                    //****************************
                }
                if (assigneeTypeText == "Team") {
                    setTeamFetch(vetFacility, vetPact, pharm, tan);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(false);
                    //****************************
                    if (pcmmEnabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("required");
                    }
                    //****************************
                }
            }
            if (Xrm.Page.ui.getFormType() == 1) {
                /*
                these fields' business rule logic is handled elsewhere
                */
                //Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel("none");
                //Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel("none");
                //Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel("none");
            }
            else {
                
            }
        }
    }
    catch (e) {
        alert("Error in Request Assignment - dynamicAssignment function. Error" + e);
    }
}

function ftp_teamselected_onChange() {

}

function ftp_userselected_onChange() {

}

function retrieveTeamsForUser(CallBackParameter) {
    if (typeof CallBackParameter == "function") {
        var currentUserId = Xrm.Page.context.getUserId();
        var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        var query = "SystemUserSet(guid'" + currentUserId + "')/teammembership_association?$select=Name,TeamId";

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
                if (!!data) CallBackParameter(data.d.results);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error retrieving teams for current user: " + errorThrown);
            },
            async: true,
            cache: false
        });
    }
    else {
        alert("Did not retrieve teams for current user.  CallBackParameter must be a function.");
        //CallBackParameter must be a function
    }
}

function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function checkDirtyFields() {
    var msg = "Dirty fields since last save:";
    if (Xrm.Page.ui.getFormType() == 1) {
        msg += "\nIt's a new record...they're all dirty!";
    }
    else {
        var attributes = Xrm.Page.data.entity.attributes.get();
        for (var i in attributes) {
            if (attributes[i].getIsDirty()) msg += ("\n" + attributes[i].getName());
        }
    }
    alert(msg);
}
function getAge(pString) {
    var today = new Date();
    var birthDate = new Date(pString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
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
function SortObjectArray(pSortProperty) {
    var sortOrder = 1;
    if (pSortProperty[0] === "-") {
        sortOrder = -1;
        pSortProperty = pSortProperty.substr(1);
    }
    return function (a, b) {
        var result = (a[pSortProperty] < b[pSortProperty]) ? -1 : (a[pSortProperty] > b[pSortProperty]) ? 1 : 0;
        return result * sortOrder;
    };
}
function filterLookupByParentLookupFields(pTargetFieldName, pFieldMappings, pFilterType) {
    if (!!pTargetFieldName && !!pFieldMappings && Array.isArray(pFieldMappings) && pFieldMappings.length > 0) {
        var targetAttr = Xrm.Page.getAttribute(pTargetFieldName);
        if (!!targetAttr && targetAttr.getAttributeType() == "lookup") {
            if (pFieldMappings.length == 1) {
                var thisMapping = pFieldMappings[0];
                if (!!thisMapping.sourceField && !!thisMapping.targetAttribute) {
                    var sourceAttr = Xrm.Page.getAttribute(thisMapping.sourceField);
                    var functionName = "filter_" + pTargetFieldName + "_by_" + thisMapping.sourceField;
                    var filterName = "filter_" + pTargetFieldName + "_by_" + thisMapping.sourceField + "_FetchXML";
                    /*remove the previous reference to the filter_target_by_source function from the PreSearch event, before adding it back with the newer filter_target_by_source_FetchXML value.*/
                    targetAttr.controls.forEach(function (con, i) {
                        con.removePreSearch(window[functionName]);
                        console.log("removed preSearch event handler (" + functionName + ") from " + con.getName());
                    });
                    window[functionName] = function (pContext) { return; };
                    window[filterName] = null;
                    if (!!sourceAttr && sourceAttr.getAttributeType() == "lookup") {
                        var sourceAttrValue = sourceAttr.getValue();
                        if (!!sourceAttrValue) {
                            window[functionName] = function (pContext) {
                                console.log("inside " + functionName);
                                var thisFilter = window[filterName];
                                if (!!thisFilter) {
                                    console.log("found filter " + filterName + ": " + thisFilter);
                                    if (!!pContext && typeof pContext.getEventSource == "function" && typeof pContext.getEventSource().get_view == "function") {
                                        var con = pContext.getEventSource().get_view();
                                        con.addCustomFilter(thisFilter);
                                        console.log("added filter to " + con.getName());
                                    }
                                    else {
                                        //var attr = Xrm.Page.getAttribute(pTargetFieldName);
                                        //if (!!attr && attr.getAttributeType() == "lookup") {
                                        //    attr.controls.forEach(function (con, l) {
                                        //        con.addCustomFilter(thisFilter);
                                        //        console.log("added filter to " + con.getName());
                                        //    });
                                        //}
                                    }
                                }
                            };
                            var thisFilterXML = "<filter type='and'><condition attribute='" + thisMapping.targetAttribute + "' operator='eq' value='" + sourceAttrValue[0].id + "' uiname='" + sourceAttrValue[0].name + "' uitype='" + sourceAttrValue[0].entityType + "' /></filter>";
                            window[filterName] = thisFilterXML;
                            targetAttr.controls.forEach(function (con, k) {
                                con.addPreSearch(window[functionName]);
                                console.log("added preSearch event handler (" + functionName + ") to " + con.getName());
                            });
                        }
                    }
                    else {
                        /*source is not a lookup field*/
                    }
                }
            }
            else {
                var filterType = !!pFilterType ? pFilterType : "and";
                var concatenatedNames = "";
                pFieldMappings.forEach(function (thisMapping, i) { concatenatedNames += !!thisMapping.sourceField ? (thisMapping.sourceField + (i == pFieldMappings.length - 1 ? "" : filterType.toUpperCase())) : ""; });
                var functionName = "filter_" + pTargetFieldName + "_by_" + concatenatedNames;
                var filterName = "filter_" + pTargetFieldName + "_by_" + concatenatedNames + "_FetchXML";
                /*remove the previous reference to the filter_target_by_source function from the PreSearch event, before adding it back with the newer filter_target_by_source_FetchXML value.*/
                targetAttr.controls.forEach(function (con, i) {
                    con.removePreSearch(window[functionName]);
                    console.log("removed preSearch event handler (" + functionName + ") from " + con.getName());
                });
                window[functionName] = function (pContext) { return; };
                window[filterName] = null;

                //build the filter
                var conditions = [];
                pFieldMappings.forEach(function (thisMapping, k) {
                    if (!!thisMapping.sourceField && !!thisMapping.targetAttribute) {
                        var sourceAttr = Xrm.Page.getAttribute(thisMapping.sourceField);
                        if (!!sourceAttr && sourceAttr.getAttributeType() == "lookup") {
                            var sourceAttrValue = sourceAttr.getValue();
                            if (!!sourceAttrValue) {
                                var thisCondition = "<condition attribute='" + thisMapping.targetAttribute + "' operator='eq' value='" + sourceAttrValue[0].id + "' uiname='" + sourceAttrValue[0].name + "' uitype='" + sourceAttrValue[0].entityType + "' />";
                                conditions.push(thisCondition);
                            }
                        }
                        else {
                            /*source is not a lookup field*/
                        }
                    }
                });
                var thisFilterXML = "<filter type='" + (conditions.length == 1 ? "and" : filterType) + "'>";
                conditions.forEach(function (thisCondition, c) { thisFilterXML += thisCondition; });
                thisFilterXML += "</filter>";

                //if we built a filter with 1 or more conditions, add the customFilter to the preSearch event of the target attribute
                if (thisFilterXML != "<filter type='" + filterType + "'></filter>") {
                    window[functionName] = function (pContext) {
                        console.log("inside " + functionName);
                        var thisFilter = window[filterName];
                        if (!!thisFilter) {
                            console.log("found filter " + filterName + ": " + thisFilter);
                            if (!!pContext && typeof pContext.getEventSource == "function" && typeof pContext.getEventSource().get_view == "function") {
                                var con = pContext.getEventSource().get_view();
                                con.addCustomFilter(thisFilter);
                                console.log("added filter to " + con.getName());
                            }
                            else {
                                //var attr = Xrm.Page.getAttribute(pTargetFieldName);
                                //if (!!attr && attr.getAttributeType() == "lookup") {
                                //    attr.controls.forEach(function (con, l) {
                                //        con.addCustomFilter(thisFilter);
                                //        console.log("added filter to " + con.getName());
                                //    });
                                //}
                            }
                        }
                    };
                    window[filterName] = thisFilterXML;
                    targetAttr.controls.forEach(function (con, m) {
                        con.addPreSearch(window[functionName]);
                        console.log("added preSearch event handler (" + functionName + ") to " + con.getName());
                    });
                }
            }
        }
        else {
            /*target is missing or is not a lookup field */
        }
    }
}