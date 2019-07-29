var _ICN = this.parent._ICN;
var _notProd = this.parent._notProd;

var _serviceObj = null;
var Xrm = this.parent.Xrm;
var _PactTeamRolesInOrder = parent._PactTeamRolesInOrder; //this array is defined on the Request form, in the ftp_/Request/JScript/pcmm.js library

//page on load funtion.
$(document).ready(function ($) {
	renderPCMMReponseAsTable();
});

function renderPCMMReponseAsTable(pPCMMResponse){
	if (!this.parent || !this.parent.Xrm || !this.parent._pcmmResponse/* || !this.parent.finishedGettingPrimaryCareProviders || !this.parent.finishedGettingMHTC*/) {
	    //console.log("waiting for this.parent._pcmmResponse");
	    setTimeout("renderPCMMReponseAsTable(this.parent._pcmmResponse);", 500);
		return;
	}
	
	console.log("Got pPCMMResponse parameter; ready to build PCMM table.");
	if (!!pPCMMResponse) {
	    var pcmmTable = document.createElement("table");
	    pcmmTable.setAttribute("class", "teamCell");
	    var emptyWhiteRow = pcmmTable.insertRow(pcmmTable.rows.length);
	    var rowForChildTables = pcmmTable.insertRow(pcmmTable.rows.length);
	    var patientAssignmentArray = getDeepProperty("Data.patientAssignments", pPCMMResponse);
	    if (!!patientAssignmentArray && Array.isArray(patientAssignmentArray) && patientAssignmentArray.length > 0) {
	        var patientAssignments = patientAssignmentArray[0];
	        var primaryCareAssignments = patientAssignments["primaryCareAssignments"] != undefined && Array.isArray(patientAssignments.primaryCareAssignments) ? patientAssignments.primaryCareAssignments : [];
	        var homeboundAssignments = patientAssignments["primaryCareHBPCAssignments"] != undefined && Array.isArray(patientAssignments.primaryCareHBPCAssignments) ? patientAssignments.primaryCareHBPCAssignments : [];
	        var mentalHealthAssignments = patientAssignments["mentalHealthAssignments"] != undefined && Array.isArray(patientAssignments.mentalHealthAssignments) ? patientAssignments.mentalHealthAssignments : [];

	        if (primaryCareAssignments.length > 0) {
	            /*sort primaryCareAssignments by assignmentStatus first, so that Active is before Pending or Inactive*/
	            primaryCareAssignments.sort(SortObjectArray("assignmentStatus"));
	            console.log("sorted primaryCareAssignments by assignmentStatus");

	            /*cycle through teamletMembers in each primaryCareAssignment and add them to the grid*/
	            for (var i = 0; i < primaryCareAssignments.length; i++) {
	                var thisAssignment = primaryCareAssignments[i];
	                var teamletMembers = !!thisAssignment.teamletMembers && Array.isArray(thisAssignment.teamletMembers) ? thisAssignment.teamletMembers : [];
	                if (teamletMembers.length > 0) {
	                    /*Push teamlet members into sortedMembersArray, sorted against the _PactTeamRolesInOrder array*/
	                    var sortedMembersArray = [];
	                    for (var j = 0; j < teamletMembers.length; j++) {
	                        var thisMember = teamletMembers[j];
	                        sortedMembersArray[_PactTeamRolesInOrder.indexOf(getDeepProperty("TeamRole.Name", thisMember).toUpperCase())] = thisMember;
	                    }
	                    console.log("placed teamlet members into sortedMembersArray, sorted by thisMember.TeamRole.Name");

	                    /*build out HTML table for this team*/
	                    var thisTeamsCell = rowForChildTables.insertCell(rowForChildTables.cells.length);
	                    thisTeamsCell.setAttribute("class", "teamCell");
	                    var thisTeamsTable = document.createElement("table");
	                    thisTeamsCell.appendChild(thisTeamsTable);
	                    var teamHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamHeaderRow.setAttribute("id", "teamHeaderRow_" + i.toString());
	                    var teamHeader = document.createElement("th");
	                    teamHeader.setAttribute("colspan", 2);
	                    teamHeader.innerHTML = thisAssignment.teamName + " (" + thisAssignment.assignmentStatus + ")";
	                    teamHeaderRow.appendChild(teamHeader);

	                    var teamSubHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamSubHeaderRow.setAttribute("class", "th2");
	                    teamSubHeaderRow.setAttribute("id", "teamSubHeaderRow_" + i.toString());
	                    var nameCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    nameCell.innerHTML = "Name";
	                    var roleCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    roleCell.innerHTML = "Role";

	                    for (var j = 0; j < sortedMembersArray.length; j++) {
	                        var thisSortedMember = sortedMembersArray[j];
	                        if (!!thisSortedMember && !!getDeepProperty("StaffContact.Name", thisSortedMember)) {
	                            var memberRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                            memberRow.setAttribute("id", "teamMemberRow_" + i.toString() + "_" + j.toString());

	                            var memberNameCell = memberRow.insertCell(memberRow.cells.length);
	                            memberNameCell.innerHTML = getDeepProperty("StaffContact.Name", thisSortedMember);

	                            var memberRoleCell = memberRow.insertCell(memberRow.cells.length);
	                            memberRoleCell.innerHTML = getDeepProperty("StaffContact.TeamRoleName", thisSortedMember);
	                        }
	                    }
	                }
	            }
	        }
	        else if (homeboundAssignments.length > 0) {
	            /*cycle through teamMembers in each homeboundAssignment and add them to the grid*/
	            /*there can only be a single member of the primaryCareHBPCAssignments array, but use a for() loop anyway...*/
	            for (var i = 0; i < homeboundAssignments.length; i++) {
	                var thisAssignment = homeboundAssignments[i];
	                var teamMembers = !!thisAssignment.teamMembers && Array.isArray(thisAssignment.teamMembers) ? thisAssignment.teamMembers : [];
	                if (teamMembers.length > 0) {
	                    /*Push team members into sortedMembersArray, sorted against the _PactTeamRolesInOrder array*/
	                    var sortedMembersArray = [];
	                    for (var j = 0; j < teamMembers.length; j++) {
	                        var thisMember = teamMembers[j];
	                        sortedMembersArray[_PactTeamRolesInOrder.indexOf(getDeepProperty("TeamRoleName", thisMember).toUpperCase())] = thisMember;
	                    }
	                    console.log("placed HBPC team members into sortedMembersArray, sorted by thisMember.TeamRoleName");

	                    /*build out HTML for this team*/
	                    var thisTeamsCell = rowForChildTables.insertCell(rowForChildTables.cells.length);
	                    thisTeamsCell.setAttribute("class", "teamCell");
	                    var thisTeamsTable = document.createElement("table");
	                    thisTeamsCell.appendChild(thisTeamsTable);
	                    var teamHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamHeaderRow.setAttribute("id", "teamHeaderRow_" + i.toString());
	                    var teamHeader = document.createElement("th");
	                    teamHeader.setAttribute("colspan", 2);
	                    teamHeader.innerHTML = thisAssignment.teamName;
	                    teamHeaderRow.appendChild(teamHeader);

	                    var teamSubHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamSubHeaderRow.setAttribute("class", "th2");
	                    teamSubHeaderRow.setAttribute("id", "teamSubHeaderRow_" + i.toString());
	                    var nameCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    nameCell.innerHTML = "Name";
	                    var roleCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    roleCell.innerHTML = "Role";

	                    for (var j = 0; j < sortedMembersArray.length; j++) {
	                        var thisSortedMember = sortedMembersArray[j];
	                        if (!!thisSortedMember && !!getDeepProperty("Name", thisSortedMember)) {
	                            var memberRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                            memberRow.setAttribute("id", "teamMemberRow_" + i.toString() + "_" + j.toString());

	                            var memberNameCell = memberRow.insertCell(memberRow.cells.length);
	                            memberNameCell.innerHTML = getDeepProperty("Name", thisSortedMember);

	                            var memberRoleCell = memberRow.insertCell(memberRow.cells.length);
	                            memberRoleCell.innerHTML = getDeepProperty("TeamRoleName", thisSortedMember);
	                        }
	                    }
	                }
	            }
	        }
	        else {
	            /*can handle other assignment types once they are scoped in the future*/
	        }

	        if (mentalHealthAssignments.length > 0) {
	            /*add the mentalHealthAssignment(s?) to the bottom of the grid*/
	            for (var i = 0; i < mentalHealthAssignments.length; i++) {
	                var thisAssignment = mentalHealthAssignments[i];
	                var mhtc = !!thisAssignment.mentalHealthTreatmentCoord ? thisAssignment.mentalHealthTreatmentCoord : {};
	                if (!!mhtc && !!mhtc.Name && !!mhtc.TeamRoleName) {
	                    var thisTeamsCell = rowForChildTables.insertCell(rowForChildTables.cells.length);
	                    thisTeamsCell.setAttribute("class", "teamCell");
	                    var thisTeamsTable = document.createElement("table");
	                    thisTeamsCell.appendChild(thisTeamsTable);
	                    var teamHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamHeaderRow.setAttribute("id", "teamHeaderRow_mhtc");

	                    /*build out HTML for this team*/
	                    var teamHeader = document.createElement("th");
	                    teamHeader.setAttribute("colspan", 2);
	                    teamHeader.innerHTML = thisAssignment.teamName;
	                    teamHeaderRow.appendChild(teamHeader);

	                    var teamSubHeaderRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    teamSubHeaderRow.setAttribute("class", "th2");
	                    teamSubHeaderRow.setAttribute("id", "teamSubHeaderRow_" + i.toString());
	                    var nameCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    nameCell.innerHTML = "Name";
	                    var roleCell = teamSubHeaderRow.insertCell(teamSubHeaderRow.cells.length);
	                    roleCell.innerHTML = "Role";

	                    var memberRow = thisTeamsTable.insertRow(thisTeamsTable.rows.length);
	                    memberRow.setAttribute("id", "teamMemberRow_mhtc");

	                    var memberNameCell = memberRow.insertCell(memberRow.cells.length);
	                    memberNameCell.innerHTML = mhtc.Name

	                    var memberRoleCell = memberRow.insertCell(memberRow.cells.length);
	                    memberRoleCell.innerHTML = getDeepProperty("TeamRoleName", mhtc);
	                }
	            }
	        }
	    }
	    else {
	        /*Display PatientSummaryText as a filler row in pcmmTable*/
	        var fillerCell = rowForChildTables.insertCell(rowForChildTables.cells.length);
	        fillerCell.setAttribute("class", "teamCell");
	        var fillerTable = document.createElement("table");
	        fillerCell.appendChild(fillerTable);

	        var fillerHeaderRow = fillerTable.insertRow(fillerTable.rows.length);
	        fillerHeaderRow.setAttribute("id", "fillerHeaderRow");
	        var fillerHeader = document.createElement("th");
	        fillerHeader.innerHTML = "No assignments in PCMM for facility";
	        fillerHeaderRow.appendChild(fillerHeader);

	        var fillerContentRow = fillerTable.insertRow(fillerTable.rows.length);
	        fillerContentRow.setAttribute("id", "fillerContentRow");
	        var fillerHeaderCell = fillerContentRow.insertCell(fillerContentRow.cells.length);
	        fillerHeaderCell.innerHTML = !!getDeepProperty("Data.PatientSummaryText", pPCMMResponse) ? getDeepProperty("Data.PatientSummaryText", pPCMMResponse) : "No data from PCMM";
	    }
	    document.getElementById("GridTableWrapper").appendChild(pcmmTable);
	}
}

/*Helper functions*/
function getDeepProperty(pPath, pObject){
	if(!!pPath){
		var pathAsArray = pPath.split(".");
		var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
		if(typeof returnObj != "undefined"){
			while(!!returnObj && pathAsArray.length > 0){
				returnObj = returnObj[pathAsArray.shift()];
			}
			return returnObj;
		}
		else{
			return undefined;
		}
	}
	else{
		return undefined;
	}
}
function SortObjectArray(pSortProperty){
	var sortOrder = 1;
	if(pSortProperty[0] === "-"){
		sortOrder = -1;
		pSortProperty = pSortProperty.substr(1);
	}
	return function (a,b){
		var result = getDeepProperty(pSortProperty, a) < getDeepProperty(pSortProperty, b) ? -1 : getDeepProperty(pSortProperty, a) > getDeepProperty(pSortProperty, b) ? 1 : 0;
		return result * sortOrder;
	};
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}