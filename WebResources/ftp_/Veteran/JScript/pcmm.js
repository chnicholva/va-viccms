var PCMMGridMembers = []; /*used by old PCMMTeamDisplay.html web resource*/
var _pcmmResponse = null;
var finishedGettingPrimaryCareProviders = false;
var finishedGettingMHTC = false;
//****************************************
//Set new PCMM Enabled flag to True as default, then read from 'Active Settings'
var pcmm_Enabled = true;
//****************************************

var _PactTeamRolesInOrder = [
	"PRIMARY CARE PROVIDER",
	"PCP",
	"ASSOCIATE PROVIDER",
	"REGISTERED NURSE",
	"RN",
	"CARE MANAGER",
	"LICENSED PRACTICAL NURSE",
	"LPN",
	"LVN",
	"LPN/LVN",
	"CLINICAL ASSOCIATE",
	"ADMINISTRATIVE ASSOCIATE",
	"MSA",
	"ADMINISTRATIVE POC",
	"PACT CLINICAL PHARMACIST",
	"PHARMACIST",
	"SOCIAL WORKER"
];

function setupPCMMWebServiceCall(pFacilityCode, pICN) {
    //this function is fired after retrieving the veteran's Preferred Facility from ESR
    writeToConsole("begin setupPCMMWebServiceCall()");
    Xrm.Page.ui.clearFormNotification("noPACTFromPCMM");
    Xrm.Page.ui.clearFormNotification("onlyPendingPACTFromPCMM");
    if (!!_retrievedSettings) {
        pcmm_Enabled = (_retrievedSettings.hasOwnProperty("ftp_IsPCMMEnabled") && _retrievedSettings.ftp_IsPCMMEnabled != null) ? _retrievedSettings.ftp_IsPCMMEnabled : true;
        writeToConsole("pcmm_Enabled: " + pcmm_Enabled);
        if (pcmm_Enabled && _retrievedSettings.hasOwnProperty("ftp_PatientSummaryAPIURL") && !!_retrievedSettings.ftp_PatientSummaryAPIURL) {
            var facilityCode = _notProd ? "991" : pFacilityCode;
            writeToConsole("_notProd: " + _notProd);
            writeToConsole("facilityCode used in PCMM query: " + facilityCode);
            var ICN = !!pICN ? pICN : !!_ICN ? _ICN : null;
            if (!!facilityCode && !!ICN) {
                PCMMGridMembers = []; /*clear the PCMMGridMembers array before collecting new data from PCMM*/
                _pcmmResponse = null;
                var wsVersion = _retrievedSettings.ftp_PatientSummaryAPIURL.substr(_retrievedSettings.ftp_PatientSummaryAPIURL.toLowerCase().indexOf("patientsummary/") + ("PatientSummary/").length, 1);
                if (wsVersion == 1) {
                    performPCMMWebServiceCall_unsecure(facilityCode, ICN);
                }
                else if (wsVersion == 2) {
                    performPCMMWebServiceCall_secure(facilityCode, ICN);
                }
                else {
                    //unknown web service version!!
                }
            }
            else {
                console.error("error in setupPCMMWebServiceCall: missing facility code or ICN");
            }
        }
        else {
            writeToConsole("PCMM is disabled or we are missing ftp_PatientSummaryAPIURL from Active Settings.");

            Xrm.Page.getControl("WebResource_VeteranPACTTeam").setVisible(false);
            Xrm.Page.getControl("ftp_pactid").setVisible(false);
            Xrm.Page.getAttribute("ftp_pactid").setSubmitMode("always");
            Xrm.Page.getControl("ftp_primarycareprovider").setVisible(false);
            Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");

            fillFtp_pactIdWithPlaceholderPactTeam("PCMM web service calls are disabled, or we are missing the Patient Summary API from Active Settings. Contact your administrator.");
        }
    }
}

function performPCMMWebServiceCall_unsecure(pFacilityCode, pICN) {
    if (!!pFacilityCode && !!pICN) {
        var pcmmUrl = _retrievedSettings.ftp_DACURL + _retrievedSettings.ftp_PatientSummaryAPIURL + pFacilityCode + "/" + pICN + "?idType=ICN";
        writeToConsole("firing GET against PCMM url: " + pcmmUrl);
        try {
            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: pcmmUrl,
                beforeSend: function (XMLHttpRequest) {
                    //Specifying this header ensures that the results will be returned as JSON.
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    var subKeys = _retrievedSettings.ftp_MVISubscriptionKey;
                    var keys = subKeys.split("|");
                    for (var i = 0; i < keys.length; i = i + 2) {
                        XMLHttpRequest.setRequestHeader(keys[i], keys[i + 1]);
                    }
                },
                success: function (response, textStatus, XmlHttpRequest) {
                    processPCMMResponse(response, pFacilityCode);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    fillFtp_pactIdWithPlaceholderPactTeam("Error querying PCMM: " + errorThrown);
                },
                async: true,
                cache: false
            });
        }
        catch (e) {
            alert(e);
        }
    }
    else {
        console.error("error in performPCMMWebServiceCall_unsecure: missing facility code or ICN");
    }
}

function performPCMMWebServiceCall_secure(pFacilityCode, pICN) {
    writeToConsole("begin performPCMMWebServiceCall_secure()");
    if (!!pFacilityCode && !!pICN) {
        var pcmmUrl = _retrievedSettings.ftp_DACURL + _retrievedSettings.ftp_PatientSummaryAPIURL;
        pcmmUrl = pcmmUrl.toLowerCase().replace("/ftpcrm/", "");
        var integrationParameters = {
            stationNumber: pFacilityCode,
            dfnNum: pICN,
            idType: "ICN"
        };
        var actionParameters = [{ key: "identifier", type: "c:string", value: JSON.stringify(integrationParameters) }];
        writeToConsole("querying secure PCMM url: " + pcmmUrl);

        CrmSecurityTokenEncryption(
            pcmmUrl,
            actionParameters,
            Xrm.Page.context.getClientUrl(),
            function (pError, pResponse) {
                if (!!pError) {
                    writeToConsole("inside performPCMMWebServiceCall_secure error callback: " + pError);
                    fillFtp_pactIdWithPlaceholderPactTeam("Error querying PCMM: " + pError);
                }
                else {
                    processPCMMResponse(pResponse, pFacilityCode);
                }
            }
        );
    }
    else {
        console.error("error in performPCMMWebServiceCall_secure: missing facility code or ICN");
    }
}

function processPCMMResponse(pResponse, pFacilityCode) {
    _pcmmResponse = pResponse;
    var returnObject = pResponse;
    //parse the returnObject JSON object for data from PCMM.
    if (typeof returnObject != "undefined" && $.isPlainObject(returnObject) && !$.isEmptyObject(returnObject)) {
        if (!$.isXMLDoc(returnObject)) {
            if (returnObject.ErrorOccurred == true || returnObject.ErrorMessage != null || returnObject.DebugInfo != null) {
                fillFtp_pactIdWithPlaceholderPactTeam("Error occurred retrieving PCMM data for facility: " + pFacilityCode + (_notProd ? " (Non-Prod)" : ""));
            }
            else {
                if (returnObject.hasOwnProperty("Data")) {
                    var data = returnObject.Data;
                    writeToConsole(data);
                    var summaryText = data.PatientSummaryText;
                    if (data.hasOwnProperty("patientAssignments") && $.isArray(data.patientAssignments) && data.patientAssignments.length > 0) {
                        //this is the happy path
                        var patientAssignment = data.patientAssignments[0];
                        writeToConsole("got patientAssignment from data.");
                        processAssignments(patientAssignment);
                        processMentalHealthProvider(patientAssignment);
                    }
                    else if (summaryText.trim() == "No PACT assigned at any VA location.") {
                        PCMMGridMembers.push({ Name: summaryText.trim(), TeamRoleName: "" });
                        fillFtp_pactIdWithPlaceholderPactTeam("This veteran does not have a PACT assigned at any VA locations" + (_notProd ? " (Non-Prod)" : ""));
                        return;
                    }
                    else if (summaryText.trim() == "Patient was not found for local site!") {
                        PCMMGridMembers.push({ Name: summaryText.trim(), TeamRoleName: "" });
                        fillFtp_pactIdWithPlaceholderPactTeam("PCMM did not find veteran at facility: " + pFacilityCode + (_notProd ? " (Non-Prod)" : ""));
                        return;
                    }
                    else {
                        //if we don't find ANY patientAssignments and also don't have a "no results message", just assign the placeholder PACT team
                        fillFtp_pactIdWithPlaceholderPactTeam("PCMM did not return any data for veteran at facility: " + pFacilityCode + (_notProd ? " (Non-Prod)" : ""));
                    }
                }
            }
        }
        else {
            fillFtp_pactIdWithPlaceholderPactTeam("PCMM returned data for veteran at facility " + pFacilityCode + ", but it is in the wrong format.\nCheck your CRM organization's Active Settings.");
        }
    }
    else {
        fillFtp_pactIdWithPlaceholderPactTeam("PCMM did not return any data for veteran at facility: " + pFacilityCode + (_notProd ? "(Non-Prod)" : ""));
    }
}

function processAssignments(pPatientAssignment) {
    writeToConsole("begin processAssignments()");
    if (!!pPatientAssignment) {
        /* Summary
			pPatientAssignment will have either 'primaryCareAssignments' or 'primaryCareHBPCAssignments' (home bound assignments).
			The primaryCareAssignments array can have multiple teams, with statuses of 'Active' or 'Pending'.
			Not sure if a primaryCareHBPCAssignments array can also have multiple teams with varying statuses.  Not enough test data. -kknab 9/28/17
			Cycle through the one with data and store them in the teamMembersFromPCMM array and the PCMMGridMembers array.
		*/

        var teamName = "";
        var teamMembersFromPCMM = []; //empty array intended to hold objects of schema { Name, TeamRoleName }

        if (pPatientAssignment.hasOwnProperty("primaryCareAssignments") && Array.isArray(pPatientAssignment.primaryCareAssignments) && pPatientAssignment.primaryCareAssignments.length > 0) {
            //primaryCareAssignments array
            writeToConsole("found primaryCareAssignments");
            var foundActiveAssignment = false;
            var foundPendingAssignment = false;
            for (var x in pPatientAssignment.primaryCareAssignments) {
                var thisPCAssignment = pPatientAssignment.primaryCareAssignments[x];
                var pcAssignmentStatus = thisPCAssignment.assignmentStatus != undefined ? thisPCAssignment.assignmentStatus : "Pending";
                if (pcAssignmentStatus.toLowerCase() == "active") {
                    teamName = !!thisPCAssignment.teamName ? thisPCAssignment.teamName : "";
                    foundActiveAssignment = true;
                    writeToConsole("found the active primaryCareAssignment: " + teamName);
                    if (thisPCAssignment.hasOwnProperty("teamletMembers") && $.isArray(thisPCAssignment.teamletMembers) && thisPCAssignment.teamletMembers.length > 0) {
                        for (var i = 0, l = thisPCAssignment.teamletMembers.length; i < l; i++) {
                            var thisTeamletMember = thisPCAssignment.teamletMembers[i];
                            if (thisTeamletMember.hasOwnProperty("StaffContact") && !!thisTeamletMember.StaffContact) {
                                var sc = thisTeamletMember.StaffContact;
                                if (sc.hasOwnProperty("Name") && !!sc.Name && sc.hasOwnProperty("TeamRoleName") && !!sc.TeamRoleName) {
                                    var person = { Name: sc.Name, TeamRoleName: sc.TeamRoleName };
                                    teamMembersFromPCMM.push(person);
                                    PCMMGridMembers.push(person);
                                }
                            }
                        }
                        finishedGettingPrimaryCareProviders = true;
                    }
                    else {
                        finishedGettingPrimaryCareProviders = true;
                    }
                }
                else if (pcAssignmentStatus.toLowerCase() == "pending") {
                    foundPendingAssignment = true;
                }
            }

            if (foundPendingAssignment && !foundActiveAssignment) {
                var alertText = "This veteran has a pending Care Team Assignment but does not have an active Care Team Assignment.";
                Xrm.Page.ui.setFormNotification(alertText, "WARNING", "onlyPendingPACTFromPCMM");
            }
        }
        else if (pPatientAssignment.hasOwnProperty("primaryCareHBPCAssignments") && Array.isArray(pPatientAssignment.primaryCareHBPCAssignments) && pPatientAssignment.primaryCareHBPCAssignments.length > 0) {
            //primaryCareHBPCAssignments array
            writeToConsole("found primaryCareHBPCAssignments");
            var homeboundPCAssignment = pPatientAssignment.primaryCareHBPCAssignments[0];
            teamName = !!homeboundPCAssignment.teamName ? homeboundPCAssignment.teamName : "";
            if (homeboundPCAssignment.hasOwnProperty("teamMembers") && homeboundPCAssignment.teamMembers.length > 0) {
                for (var i = 0, l = homeboundPCAssignment.teamMembers.length; i < l; i++) {
                    var thisTeamMember = homeboundPCAssignment.teamMembers[i];
                    if (thisTeamMember.hasOwnProperty("Name") && !!thisTeamMember.Name && thisTeamMember.hasOwnProperty("TeamRoleName") && !!thisTeamMember.TeamRoleName) {
                        var person = { Name: thisTeamMember.Name, TeamRoleName: thisTeamMember.TeamRoleName };
                        teamMembersFromPCMM.push(person);
                        PCMMGridMembers.push(person);
                    }
                }
                finishedGettingPrimaryCareProviders = true;
            }
            else {
                finishedGettingPrimaryCareProviders = true;
            }
        }
        else {
            //all care assignment arrays are empty
            finishedGettingPrimaryCareProviders = true;
        }

        if (!!teamName) {
            /*
			Now that we have the active PACT team and its members from PCMM, find or create that ftp_pact record in CRM.
			Then, cycle through the PACT team's teamletMembers and find or create them in the systemuser table, linking them to the ftp_pact record as you go.
				- this is done in the matchPCMMTeamMembersToCRMPACTTeam() method, which recursively calls itself for every teamletMember
			While cycling through the teamletMembers, throw each one into the trySetPrimaryCareProviderField() function, which will only work for the 'Primary Care Provider' or 'Associate Provider'
			After linking all appropriate systemuser records to this ftp_pact record, remove any systemuser records that should no longer be linked to it, by virtue of not being in this PACT team's teamletMembers array
				- this is done in the unlinkUsersFromPACTTeam() method
			*/
            writeToConsole("retrieving ftp_pact record: " + teamName);
            //find or create a PACT team record called named <teamName>
            var retrievedPACTTeams = [];
            var queryString = "$select=ftp_name,ftp_pactId,ftp_ftp_pact_systemuser/FirstName,ftp_ftp_pact_systemuser/LastName,ftp_ftp_pact_systemuser/SystemUserId,ftp_ftp_pact_systemuser/FullName,ftp_ftp_pact_systemuser/DomainName";
            queryString += "&$filter=ftp_name eq '" + teamName + "'"
            queryString += "&$expand=ftp_ftp_pact_systemuser";
            SDK.REST.retrieveMultipleRecords(
				"ftp_pact",
				queryString,
				function (retrievedRecords) {
				    if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedPACTTeams = retrievedPACTTeams.concat(retrievedRecords);
				},
				errorHandler,
				function () {
				    if (retrievedPACTTeams.length > 0) {
				        writeToConsole("found " + teamName + " PACT team record in CRM");
				        setftp_pactid(retrievedPACTTeams[0]);
				        matchPCMMTeamMembersToCRMPACTTeam(retrievedPACTTeams[0], teamMembersFromPCMM, false, null); //after calling it here, this method calls itself for the rest of the PACT team members from PCMM
				    }
				    else {
				        writeToConsole("did not find " + teamName + " PACT team record in CRM, creating.");
				        var newPact = {
				            ftp_name: teamName
				        };
				        SDK.REST.createRecord(
							newPact,
							"ftp_pact",
							function (createdPACTTeam) {
							    setftp_pactid(createdPACTTeam);
							    matchPCMMTeamMembersToCRMPACTTeam(createdPACTTeam, teamMembersFromPCMM, false, null); //after calling it here, this method calls itself for the rest of the PACT team members from PCMM
							},
							errorHandler
						);
				    }
				});
        }
        else {
            /*If we didn't find a teamName from the primaryCareAssignments or primaryCareHBPCAssignments nodes, set ftp_pactId on the veteran to the designated placeholder ftp_pact record*/
            fillFtp_pactIdWithPlaceholderPactTeam();
        }
    }
    else {
        writeToConsole("patient assingnment object is empty.");
        finishedGettingPrimaryCareProviders = true;
        return;
    }
}

function processMentalHealthProvider(pPatientAssignment) {
    /* Summary
		pPatientAssignment will have a mentalHealthAssignments property that is an array.
		Cycle through the array and store its members in the teamMembersFromPCMM array and the PCMMGridMembers array.
	*/
    writeToConsole("begin processMentalHealthProvider()");
    if (!!pPatientAssignment) {
        if (pPatientAssignment.hasOwnProperty("mentalHealthAssignments") && !!pPatientAssignment.mentalHealthAssignments && Array.isArray(pPatientAssignment.mentalHealthAssignments) && pPatientAssignment.mentalHealthAssignments.length > 0) {
            var mentalHealthAssignment = pPatientAssignment.mentalHealthAssignments[0];
            if (mentalHealthAssignment.hasOwnProperty("teamName") && !!mentalHealthAssignment.teamName) {
                var teamName = mentalHealthAssignment.teamName;
                if (mentalHealthAssignment.hasOwnProperty("mentalHealthTreatmentCoord") && !!mentalHealthAssignment.mentalHealthTreatmentCoord) {
                    var MHTC = mentalHealthAssignment.mentalHealthTreatmentCoord;
                    writeToConsole("got mentalHealthAssignment.mentalHealthTreatmentCoord object.");
                    PCMMGridMembers.push(MHTC);
                    finishedGettingMHTC = true;

                    //find or create the PACT Team record matching teamName
                    if (!!teamName) {
                        //find or create a PACT team record called named <teamName>
                        var retrievedPACTTeams = [];
                        var queryString = "$filter=ftp_name eq '" + teamName + "' and statecode/Value eq 0&$expand=ftp_ftp_pact_systemuser&$select=ftp_name,ftp_pactId,ftp_ftp_pact_systemuser/FirstName,ftp_ftp_pact_systemuser/LastName,ftp_pactId,ftp_ftp_pact_systemuser/FullName,ftp_ftp_pact_systemuser/SystemUserId";
                        SDK.REST.retrieveMultipleRecords(
							"ftp_pact",
							queryString,
							function (retrievedRecords) {
							    if (typeof retrievedRecords != "undefined") retrievedPACTTeams = retrievedPACTTeams.concat(retrievedRecords);
							},
							errorHandler,
							function () {
							    if (retrievedPACTTeams.length > 0) {
							        matchMHTCToPACTTeam(retrievedPACTTeams[0], MHTC);
							    }
							    else {
							        var newPact = {
							            ftp_name: teamName
							        };
							        SDK.REST.createRecord(
										newPact,
										"ftp_pact",
										function (createdPACTTeam) {
										    matchMHTCToPACTTeam(createdPACTTeam, MHTC);
										},
										errorHandler
									);
							    }
							}
						);
                    }
                }
                else {
                    finishedGettingMHTC = true;
                }
            }
            else {
                finishedGettingMHTC = true;
            }
        }
        else {
            finishedGettingMHTC = true;
        }
    }
    else {
        writeToConsole("patient assingment object is empty.");
        finishedGettingMHTC = true;
        return;
    }
}

function setftp_pactid(pPACTTeamFromCRM) {
    writeToConsole("begin setftp_pactid()");
    var attr = Xrm.Page.getAttribute("ftp_pactid");
    if (!!pPACTTeamFromCRM && !!attr) {
        VCCM.USDHelper.CopyDataToReplacementParameters("PCMM", ["PACTTeam=" + pPACTTeamFromCRM.ftp_name], false);
        attr.setValue([{
            id: pPACTTeamFromCRM.ftp_pactId,
            name: pPACTTeamFromCRM.ftp_name,
            entityType: "ftp_pact"
        }]);
        attr.setSubmitMode("always");
        Xrm.Page.getAttribute("ftp_pactid").addOnChange(ftp_pactid_onChange);
    }
}

function matchPCMMTeamMembersToCRMPACTTeam(pPACTTeamFromCRM, pPACTTeamMembersFromPCMM, pAlreadySetPrimaryCareProviderField, pUsersToUnlinkFromPACTTeam) {
    writeToConsole("");
    writeToConsole("begin matchPCMMTeamMembersToCRMPACTTeam()... pPACTTeamMembersFromPCMM.length = " + pPACTTeamMembersFromPCMM.length);

    //usersToUnlink is an array that will end up holding a list of users to update, setting their ftp_PACTid field null
    var usersToUnlink = pUsersToUnlinkFromPACTTeam;
    //populate usersToUnlink from pPACTTeamFromCRM only if we haven't already passed in an array of systemuser records (pUsersToUnlinkFromPACTTeam)
    if (usersToUnlink == null) {
        usersToUnlink = [];
        var initialUserList = getDeepProperty("ftp_ftp_pact_systemuser.results", pPACTTeamFromCRM);
        if (Array.isArray(initialUserList) && initialUserList.length > 0) {
            writeToConsole(initialUserList.length + " CRM users already connected to the " + pPACTTeamFromCRM.ftp_name + " PACT team, before we add/remove anybody");
            for (var i = 0, l = initialUserList.length; i < l; i++) {
                usersToUnlink.push(initialUserList[i]);
            }
        }
        else {
            writeToConsole("no CRM users are currently connected to the " + pPACTTeamFromCRM.ftp_name + " PACT team, before we add/remove anybody");
        }
    }

    if (pPACTTeamMembersFromPCMM.length > 0) {
        var alreadySetPrimaryCareProviderField = pAlreadySetPrimaryCareProviderField != null ? pAlreadySetPrimaryCareProviderField : false;
        var thisTeamMember = pPACTTeamMembersFromPCMM.shift(); //cut the length of pPACTTeamMembersFromPCMM down one at a time
        var teamRoleIndexValue = _PactTeamRolesInOrder.indexOf(thisTeamMember.TeamRoleName.toUpperCase());
        var desiredSortOrderValue = (teamRoleIndexValue > -1 ? pad(teamRoleIndexValue, 2).toString() : "") + thisTeamMember.TeamRoleName.toUpperCase();
        var splitName = thisTeamMember.Name.split(",");
        var lastName = splitName[0].trim();
        var splitFirstMiddleNames = splitName.length > 1 ? splitName[1].trim().split(" ") : "";
        var firstName = !!splitFirstMiddleNames ? splitFirstMiddleNames[0] : "";
        var middleName = !!splitFirstMiddleNames && splitFirstMiddleNames.length > 1 ? splitFirstMiddleNames[1] : "";
        var fakeFullName = lastName + ", " + firstName + " " + middleName;
        var domainName = firstName + "." + lastName + "@nodomainaccount.va.gov";/*see if we can get PCMM to return email addresses*/
        var userQueryString = "$select=FirstName,LastName,SystemUserId,ftp_PACTId,ftp_PACTTeamRole,ftp_PACTSortOrder,IsDisabled,DomainName,FullName"
        userQueryString += "&$filter=DomainName eq '" + domainName + "'";
        writeToConsole("thisTeamMember: " + fakeFullName + " (" + domainName + ")");
        var retrievedUsers = [];
        SDK.REST.retrieveMultipleRecords(
			"SystemUser",
			userQueryString,
			function (retrievedRecords) {
			    if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedUsers = retrievedUsers.concat(retrievedRecords);
			},
			errorHandler,
			function () {
			    if (retrievedUsers.length > 0) {
			        var foundUser = retrievedUsers[0];
			        if (!foundUser.IsDisabled) {
			            writeToConsole("found systemuser " + foundUser.DomainName + " in CRM");
			            if (foundUser.hasOwnProperty("ftp_PACTId") && !!foundUser.ftp_PACTId && foundUser.ftp_PACTId.Id == pPACTTeamFromCRM.ftp_pactId &&
							foundUser.hasOwnProperty("ftp_PACTTeamRole") && foundUser.ftp_PACTTeamRole == thisTeamMember.TeamRoleName &&
                            foundUser.hasOwnProperty("ftp_PACTSortOrder") && foundUser.ftp_PACTSortOrder == desiredSortOrderValue) {
			                writeToConsole(foundUser.FullName + " is already linked to the " + pPACTTeamFromCRM.ftp_name + " and has the correct PACT Team Role and PACT Sort Order; skipping update.");
			                usersToUnlink = removeUserFromUsersToUnlink(foundUser, usersToUnlink);
			                if (!alreadySetPrimaryCareProviderField) alreadySetPrimaryCareProviderField = trySetPrimaryCareProviderField(foundUser);
			                matchPCMMTeamMembersToCRMPACTTeam(pPACTTeamFromCRM, pPACTTeamMembersFromPCMM, alreadySetPrimaryCareProviderField, usersToUnlink);//run this method again
			            }
			            else {
			                foundUser.ftp_PACTId = {
			                    Id: pPACTTeamFromCRM.ftp_pactId,
			                    LogicalName: "ftp_pact",
			                    Name: pPACTTeamFromCRM.ftp_name
			                };
			                foundUser.ftp_PACTTeamRole = thisTeamMember.TeamRoleName;
			                foundUser.ftp_PACTSortOrder = desiredSortOrderValue;
			                SDK.REST.updateRecord(
								foundUser.SystemUserId,
								foundUser,
								"SystemUser",
								function () {
								    writeToConsole("updated " + foundUser.DomainName + " with PACT team (" + pPACTTeamFromCRM.ftp_name + "),  PACT team role (" + thisTeamMember.TeamRoleName + "), and PACT team sort order (" + desiredSortOrderValue + ")");
								    usersToUnlink = removeUserFromUsersToUnlink(foundUser, usersToUnlink);
								    if (!alreadySetPrimaryCareProviderField) alreadySetPrimaryCareProviderField = trySetPrimaryCareProviderField(foundUser);
								    matchPCMMTeamMembersToCRMPACTTeam(pPACTTeamFromCRM, pPACTTeamMembersFromPCMM, alreadySetPrimaryCareProviderField, usersToUnlink);//run this method again
								},
								errorHandler
							);
			            }
			        }
			        else {
			            writeToConsole("found systemuser " + foundUser.DomainName + " in CRM, but this user is disabled.  Skipping user update.");
			        }
			    }
			    //If we didn't find thisTeamMember in CRM as a user, then retrieve the 'PACT User' CRM team, and create the new user, and make the user a member of the team
			    else {
			        writeToConsole("did not find " + domainName + " in CRM, creating systemuser.");
			        var PACTUserCRMTeam = null;
			        var teamQuery = "$select=Name,TeamId,BusinessUnitId&$filter=Name eq 'PACT User' and TeamType/Value eq 0";
			        var retrievedCRMTeams = [];
			        SDK.REST.retrieveMultipleRecords(
						"Team",
						teamQuery,
						function (retrievedRecords) {
						    if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedCRMTeams = retrievedCRMTeams.concat(retrievedRecords);
						},
						errorHandler,
						function () {
						    if (retrievedCRMTeams.length > 0) {
						        PACTUserCRMTeam = retrievedCRMTeams[0];

						        //build newUser object
						        var newUser = {
						            FirstName: firstName,
						            LastName: lastName,
						            MiddleName: middleName,
						            ftp_PACTTeamRole: thisTeamMember.TeamRoleName,
						            ftp_PACTSortOrder: desiredSortOrderValue,
						            IsIntegrationUser: false,
						            UserLicenseType: 3,
						            AccessMode: {
						                Value: 0
						            },
						            DomainName: domainName,
						            BusinessUnitId: {
						                Id: PACTUserCRMTeam.BusinessUnitId.Id,
						                LogicalName: PACTUserCRMTeam.BusinessUnitId.LogicalName,
						                Name: PACTUserCRMTeam.BusinessUnitId.Name
						            },
						            ftp_PACTId: {
						                Id: pPACTTeamFromCRM.ftp_pactId,
						                LogicalName: "ftp_pact",
						                Name: pPACTTeamFromCRM.ftp_name
						            }
						        };
						        SDK.REST.createRecord(
									newUser,
									"SystemUser",
									function (createdUser) {
									    writeToConsole("created systemuser: " + fakeFullName + " (" + domainName + "). GUID: " + createdUser.SystemUserId);
									    addUsersToTeam(createdUser.SystemUserId, PACTUserCRMTeam.TeamId);
									    if (!alreadySetPrimaryCareProviderField) alreadySetPrimaryCareProviderField = trySetPrimaryCareProviderField(createdUser);
									    matchPCMMTeamMembersToCRMPACTTeam(pPACTTeamFromCRM, pPACTTeamMembersFromPCMM, alreadySetPrimaryCareProviderField, usersToUnlink); //run this method again
									},
									errorHandler
								);
						    }
						}
					);
			    }
			}
		);
    }
    else {
        //if all primary care team members PCMM are now in CRM as systemusers, linked to the PACT team, we can now update any remaining systemusers that should be be linked to this PACT team
        unlinkUsersFromPACTTeam(usersToUnlink);
    }
}

function removeUserFromUsersToUnlink(pUser, pUsersToUnlink) {
    for (var i = 0, l = pUsersToUnlink.length; i < l; i++) {
        if (pUsersToUnlink[i].SystemUserId == pUser.SystemUserId) {
            pUsersToUnlink.splice(i, 1);
            break;
        }
    }
    return pUsersToUnlink;
}

function unlinkUsersFromPACTTeam(pUsers) {
    writeToConsole("begin unlinkUsersFromPACTTeam()");
    if (!!pUsers && Array.isArray(pUsers) && pUsers.length > 0) {
        writeToConsole("pUsers.length: " + pUsers.length);
        var thisUser = pUsers.shift();
        if (thisUser.hasOwnProperty("SystemUserId") && !!thisUser.SystemUserId) {
            thisUser.ftp_PACTId = {
                Id: null,
                LogicalName: null,
                Name: null
            };
            SDK.REST.updateRecord(
				thisUser.SystemUserId,
				thisUser,
				"SystemUser",
				function () {
				    //do nothing else with this user
				    writeToConsole("cleared ftp_PACTId field on systemuser:" + thisUser.FullName + " {" + thisUser.SystemUserId + "}");

				    //re-enter this function until pUsers is empty
				    unlinkUsersFromPACTTeam(pUsers);
				},
				errorHandler
			);
        }
    }
    else {
        writeToConsole("no users to unlink.");
    }
}

function trySetPrimaryCareProviderField(pUser) {
    if (!pUser || !pUser.ftp_PACTTeamRole || !pUser.FullName) return false;
    if (!(pUser.ftp_PACTTeamRole == "Primary Care Provider" || pUser.ftp_PACTTeamRole == "Associate Provider")) return false;

    Xrm.Page.getAttribute("ftp_primarycareprovider").setValue(pUser.FullName);
    Xrm.Page.getAttribute("ftp_primarycareprovider").setSubmitMode("always");
    writeToConsole("set Veteran's ftp_primarycareprovider with systemuser.FullName: " + pUser.FullName);
    VCCM.USDHelper.CopyDataToReplacementParameters("PCMM", ["PCP=" + pUser.FullName], false);
    Xrm.Page.getAttribute("ftp_primarycareprovider").fireOnChange();
    return true;
}

function matchMHTCToPACTTeam(pPACTTeamFromCRM, pMHTC) {
    writeToConsole("begin matchMHTCToPACTTeam()");
    if (!pPACTTeamFromCRM) return;
    //don't set the ftp_pactid lookup field on the vet form

    //save to an array the current list of users who currently reference pPACTTeamFromCRM, so that we can remove that reference if they NO LONGER are a member of pPACTTeamFromCRM according to PCMM
    //for a mental health PACT team...it should just be one user
    //for a newly-created ftp_pact record, this list of users will be empty
    var usersToUnlink = [];
    var initialUserList = getDeepProperty("ftp_ftp_pact_systemuser.results", pPACTTeamFromCRM);
    if (Array.isArray(initialUserList) && initialUserList.length > 0) {
        writeToConsole(initialUserList.length + " CRM users currently connected to the " + pPACTTeamFromCRM.ftp_name + " Mental Health PACT team, before we add/remove anybody");
        for (var i = 0, l = initialUserList; i < l; i++) {
            usersToUnlink.push(initialUserList[i]);
        }
    }

    if (!!pMHTC) {
        var teamQuery = "$select=Name,TeamId,BusinessUnitId&$filter=Name eq 'PACT User' and TeamType/Value eq 0";
        var retrievedCRMTeams = [];
        SDK.REST.retrieveMultipleRecords(
			"Team",
			teamQuery,
			function (retrievedRecords) {
			    if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedCRMTeams = retrievedCRMTeams.concat(retrievedRecords);
			},
			errorHandler,
			function () {
			    if (retrievedCRMTeams.length > 0) {
			        var PACTUserCRMTeam = retrievedCRMTeams[0];

			        //find or create a systemuser for the Mental Health Treatment Coordinator (pMHTC)
			        //set their ftp_PACTId lookup field to pPACTTeamFromCRM
			        //add the user to the 'PACT User' CRM team, so it will inherit the team's security roles
			        //if their ftp_PACTId and ftp_PACTTeamRole are fine, remove that person from usersToUnlink array

			        //pMHTC schema: { Name, TeamRoleName, TeamRoleCode, Phone, Pager, Ien }
			        writeToConsole("searching for " + pMHTC.Name + " to connect their CRM user record to the " + pPACTTeamFromCRM.ftp_name + " PACT team in CRM");
			        var splitName = pMHTC.Name.split(",");
			        var lastName = splitName[0];
			        var splitFirstMiddleNames = splitName.length > 1 ? splitName[1].trim().split(" ") : "";
			        var firstName = !!splitFirstMiddleNames ? splitFirstMiddleNames[0] : "";
			        var middleName = !!splitFirstMiddleNames && splitFirstMiddleNames.length > 1 ? splitFirstMiddleNames[1] : "";
			        var fakeFullName = lastName + ", " + firstName + " " + middleName;
			        var domainName = firstName + "." + lastName + "@nodomainaccount.va.gov";
			        var userQuery = "$select=FirstName,LastName,SystemUserId,ftp_PACTId,ftp_PACTTeamRole,IsDisabled,DomainName,FullName&$filter=DomainName eq '" + domainName + "'";
			        var retrievedUsers = [];
			        SDK.REST.retrieveMultipleRecords(
						"SystemUser",
						userQuery,
						function (retrievedRecords) {
						    if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedUsers = retrievedUsers.concat(retrievedRecords);
						},
						errorHandler,
						function () {
						    if (retrievedUsers.length > 0) {
						        writeToConsole("found systemuser: " + domainName + ", updating systemuser.");
						        var foundUser = retrievedUsers[0];
						        if (!foundUser.IsDisabled) {
						            if (foundUser.hasOwnProperty("ftp_PACTId") && !!foundUser.ftp_PACTId && foundUser.ftp_PACTId.Id == pPACTTeamFromCRM.ftp_pactId &&
										foundUser.hasOwnProperty("ftp_PACTTeamRole") && foundUser.ftp_PACTTeamRole == pMHTC.TeamRoleName) {
						                writeToConsole(foundUser.FullName + " is already linked to the " + pPACTTeamFromCRM.ftp_name + " and has the correct PACT Team Role; skipping update.");
						                //remove this person from the usersToUnlink array, because their ftp_PACTId and ftp_PACTTeamRole are already fine
						                usersToUnlink.splice(i, 1);
						                setMentalHealthTeamField(foundUser);
						            }
						            else {
						                foundUser.ftp_PACTId = {
						                    Id: pPACTTeamFromCRM.ftp_pactId,
						                    LogicalName: "ftp_pact",
						                    Name: pPACTTeamFromCRM.ftp_name
						                };
						                foundUser.ftp_PACTTeamRole = pMHTC.TeamRoleName;
						                SDK.REST.updateRecord(
											foundUser.SystemUserId,
											foundUser,
											"SystemUser",
											function () {
											    writeToConsole("updated " + foundUser.DomainName + " with PACT team (" + pPACTTeamFromCRM.ftp_name + ") and PACT team role (" + pMHTC.TeamRoleName + ")");
											    setMentalHealthTeamField(foundUser);
											},
											errorHandler
										);
						            }
						        }
						        else {
						            writeToConsole("found systemuser" + foundUser.DomainName + ", but this user is disabled.  Skipping user update.");
						        }
						    }
						    else {
						        writeToConsole("did not find systemuser: " + domainName + ", creating systemuser.");
						        //build user object
						        var newUser = {
						            FirstName: firstName,
						            LastName: lastName,
						            MiddleName: middleName,
						            ftp_PACTTeamRole: pMHTC.TeamRoleName,
						            IsIntegrationUser: false,
						            UserLicenseType: 3,
						            AccessMode: {
						                Value: 0
						            },
						            DomainName: domainName,
						            BusinessUnitId: {
						                Id: PACTUserCRMTeam.BusinessUnitId.Id,
						                LogicalName: PACTUserCRMTeam.BusinessUnitId.LogicalName,
						                Name: PACTUserCRMTeam.BusinessUnitId.Name
						            },
						            ftp_PACTId: {
						                Id: pPACTTeamFromCRM.ftp_pactId,
						                LogicalName: "ftp_pact",
						                Name: pPACTTeamFromCRM.ftp_name
						            }
						        };
						        //create it
						        SDK.REST.createRecord(
									newUser,
									"SystemUser",
									function (createdUser) {
									    writeToConsole("created systemuser: " + fakeFullName + " (" + domainName + "). GUID: " + createdUser.SystemUserId);
									    setMentalHealthTeamField(createdUser);
									    addUsersToTeam(createdUser.SystemUserId, PACTUserCRMTeam.TeamId);
									},
									errorHandler
								);
						    }
						}
					);
			    }
			}
		);
    }
    else {
        //even if we don't link a new MHTC user to pPACTTeamFromCRM for the first time, still need to unlink "old" members of pPACTTeamFromCRM
        unlinkUsersFromPACTTeam(usersToUnlink);
    }
}

function setMentalHealthTeamField(pUser) {
    writeToConsole("begin setMentalHealthTeamField()");
    if (!!pUser && !!pUser.ftp_PACTTeamRole && !!pUser.FullName) {
        if (pUser.ftp_PACTTeamRole == "(mhtc) Addiction Therapist") {
            var MHTCAttr = Xrm.Page.getAttribute("ftp_mentalhealthteam");
            if (!!MHTCAttr) {
                MHTCAttr.setValue(pUser.FullName);
                MHTCAttr.setSubmitMode("always");
                writeToConsole("set ftp_mentalhealthteam to " + pUser.FullName);
            }
            else {
                writeToConsole("did not set ftp_mentalhealthteam to because attribute is not on form.");
            }
        }
    }
}

function addUsersToTeam(pUserIds, pTeamId) {
    writeToConsole("begin addUsersToTeam.  pTeamId: " + pTeamId);
    var serviceURL = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
    var requestMain = "";
    requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
    requestMain += "  <s:Body>";
    requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
    requestMain += "      <request i:type=\"b:AddMembersTeamRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
    requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
    requestMain += "          <a:KeyValuePairOfstringanyType>";
    requestMain += "            <c:key>TeamId</c:key>";
    requestMain += "            <c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + pTeamId + "</c:value>";
    requestMain += "          </a:KeyValuePairOfstringanyType>";
    requestMain += "          <a:KeyValuePairOfstringanyType>";
    requestMain += "            <c:key>MemberIds</c:key>";
    requestMain += "            <c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">";
    if (Array.isArray(pUserIds)) {
        for (var i = 0, l = pUserIds.length; i < l; i++) {
            writeToConsole("adding systemuser {" + pUserIds[i] + "} to team {" + pTeamId + "}");
            requestMain += "              <d:guid>" + pUserIds[i] + "</d:guid>";
        }
    } else {
        writeToConsole("adding systemuser {" + pUserIds + "} to team {" + pTeamId + "}");
        requestMain += "              <d:guid>" + pUserIds + "</d:guid>";
    }
    requestMain += "            </c:value>";
    requestMain += "          </a:KeyValuePairOfstringanyType>";
    requestMain += "        </a:Parameters>";
    requestMain += "        <a:RequestId i:nil=\"true\" />";
    requestMain += "        <a:RequestName>AddMembersTeam</a:RequestName>";
    requestMain += "      </request>";
    requestMain += "    </Execute>";
    requestMain += "  </s:Body>";
    requestMain += "</s:Envelope>";
    var req = new XMLHttpRequest();
    req.open("POST", serviceURL, true);
    // Responses will return XML. It isn't possible to return JSON.
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    var successCallback = null;
    var errorCallback = null;
    req.onreadystatechange = function () { };
    req.send(requestMain);
    writeToConsole("sent request to add user to team.");
}

function ftp_primarycareprovider_onChange() {
    VCCM.USDHelper.CopyDataToReplacementParameters("PCMM", ["PCP=" + Xrm.Page.getAttribute("ftp_primarycareprovider").getValue()], false);
}

function ftp_pactid_onChange() {
    writeToConsole("begin ftp_pactid_onChange()");
    //cycle through users under selected PACT who have a role, and update some fields on the form with their names
    var pactTeamValue = Xrm.Page.getAttribute("ftp_pactid").getValue();
    if (!pactTeamValue) return;
    VCCM.USDHelper.CopyDataToReplacementParameters("PCMM", ["PACTTeam=" + pactTeamValue[0].name], false);
    writeToConsole("PACT team: " + pactTeamValue[0].name);
    var queryString = "$select=FullName,ftp_PACTId&$filter=ftp_PACTId/Id eq guid'" + pactTeamValue[0].id + "' and ftp_PACTTeamRole ne null";
    var retrievedUsers = [];
    SDK.REST.retrieveMultipleRecords(
        "SystemUser",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedUsers = retrievedUsers.concat(retrievedRecords);
        },
        errorHandler,
        function () {
            if (retrievedUsers.length > 0) {
                writeToConsole("found " + retrievedUsers.length + " users on this PACT team.");
                var alreadySetPrimaryCareProviderField = false;
                var alreadySetMentalHealthTeamField = false;
                writeToConsole("cycling through users to find Primary Care Provider (or Associate Provider), and (mhtc) Addiction Therapist.");
                for (var i = 0, l = retrievedUsers.length; i < l && (!alreadySetPrimaryCareProviderField || !alreadySetMentalHealthTeamField) ; i++) {
                    var thisUser = retrievedUsers[i];
                    if (!alreadySetPrimaryCareProviderField && (thisUser.ftp_PACTTeamRole == "Primary Care Provider" || thisUser.ftp_PACTTeamRole == "Associate Provider")) {
                        alreadySetPrimaryCareProviderField = trySetPrimaryCareProviderField(thisUser);
                    }
                    if (!alreadySetMentalHealthTeamField && thisUser.ftp_PACTTeamRole == "(mhtc) Addiction Therapist") {
                        alreadySetMentalHealthTeamField = setMentalHealthTeamField(thisUser);
                    }
                }
            }
        }
    );
}

function fillFtp_pactIdWithPlaceholderPactTeam(pPCMMErrorText) {
    writeToConsole("begin fillFtp_pactIdWithPlaceholderPactTeam()");
    var retrievedPACTTeams = [];
    var placeholderPACTTeamName = "PACT team not assigned";
    var queryString = "$select=ftp_name,ftp_pactId&$filter=ftp_name eq '" + placeholderPACTTeamName + "'";
    SDK.REST.retrieveMultipleRecords(
        "ftp_pact",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedPACTTeams = retrievedPACTTeams.concat(retrievedRecords);
        },
        errorHandler,
        function () {
            if (retrievedPACTTeams.length > 0) {
                var placeholderPACTRecord = retrievedPACTTeams[0];
                writeToConsole("got placeholder ftp_pact record :" + placeholderPACTTeamName);
                Xrm.Page.getAttribute("ftp_pactid").setValue([{
                    id: placeholderPACTRecord.ftp_pactId,
                    name: placeholderPACTRecord.ftp_name,
                    entityType: "ftp_pact"
                }
                ]);
                Xrm.Page.getAttribute("ftp_pactid").setSubmitMode("always");
                writeToConsole("set Veteran's ftp_pactid field");
                var alertText = !!pPCMMErrorText ? pPCMMErrorText : "Notify your PCMM Administrator to set up this veteran's Care Team Assignment in PCMM. You cannot assign Requests until this is complete.";
                Xrm.Page.ui.setFormNotification(alertText, "INFO", "noPACTFromPCMM");

                finishedGettingPrimaryCareProviders = true;
                finishedGettingMHTC = true;
            }
        }
    );
}

function pad(pNum, pSize) {
    var s = pNum + "";
    while (s.length < pSize) s = "0" + s;
    return s;
}