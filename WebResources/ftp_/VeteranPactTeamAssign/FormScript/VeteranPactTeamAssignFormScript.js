//VeteranPactTeamAssignFormScript.js
//Contains variables and functions used to allocate a pact team to a veteran
//Requires jQuery loaded on the form
//Used in conjunction with the Veteran (contact) entity form load event.

//Static Global Variables
vpta_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
vpta_serverUrl = Xrm.Page.context.getClientUrl();
//vpta_patientsummaryUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/INT/api/PCMM/PatientSummary/1.0/json/ftpCRM/';  //OLD MANUAL DEV URL
vpta_patientsummaryUrl = '';
//GET CRM SETTINGS WEB SERVICE URLS
vpta_conditionalFilter = "(mcs_name eq 'Active Settings')";

// main function
function vpta_getPatientSummaryData(vpta_crmfacilitycode, vpta_crmpatienticn, pcmmUrl) {
    try {
        $.get(pcmmUrl, function (data, status) {

            // Notification booleans
            var primaryHomeBoundCareNotification = true;
            var pmentalHealthNotification = true;
            var ptcmNotification = true;

            if (data != null && typeof data != undefined) {
                var vpta_objmodel = data['Data'];
                if (vpta_objmodel != null && typeof vpta_objmodel != undefined) {

                    if (vpta_objmodel.patientAssignments[0] != null && typeof vpta_objmodel.patientAssignments[0] != undefined && typeof (vpta_objmodel.patientAssignments[0].length) !== 0) {
                        var patientAssignments = vpta_objmodel.patientAssignments[0];
                        primaryHomeBoundCareNotification = PrimaryCareorHomeBoundProviderProcessing(patientAssignments);
                        pmentalHealthNotification = MentalHealthProviderProcessing(patientAssignments);
                        // ptcmNotification = TCMAssignmentsProviderProcessing(patientAssignments);
                    }

                    //   UserNotifications(primaryHomeBoundCareNotification, pmentalHealthNotification, ptcmNotification);
                }
            }
        });
    }
    catch (err) {
        alert('Veteran form load, PCMM Integration Service Function Error (vpta_getPatientSummaryData): ' + err.message);
    }
}

// Payload section processing functions
function PrimaryCareorHomeBoundProviderProcessing(patientAssignments) {
    try {
        var primaryHomeBoundCareNotification = false;
        var vpta_teamname = null;
        var vpta_teammembers = null;
        var HBProcessing = false;
        var PriProcessing = false;

        // Primary Care data handling
        if (typeof (patientAssignments.primaryCareAssignments[0]) !== 'undefined'
            && patientAssignments.primaryCareAssignments[0] !== null) {
            if (typeof (patientAssignments.primaryCareAssignments[0].length) !== 0) {
                PriProcessing = true;
                vpta_teamname = patientAssignments.primaryCareAssignments[0].teamName;
                if (typeof (patientAssignments.primaryCareAssignments[0].teamletMembers.length) !== 0 && typeof patientAssignments.primaryCareAssignments[0].teamletMembers !== undefined) {
                    vpta_teammembers = patientAssignments.primaryCareAssignments[0].teamletMembers;
                    //var vpta_teammembers = [{"TeamRole":{"Description":"PRIMARY CARE PROVIDER","ExpirationDate":null,"Name":"PRIMARY CARE PROVIDER","Code":"43","Ien":"67","PrimaryCare":"true","SupportStaff":"false"},"StaffContact":{"TeamRoleName":"Primary Care Provider","TeamRoleCode":"43","Name":"Potter,Harry","Phone":"","Pager":"","Ien":"520642422"}}];
                }
            }
        }
            // Home Bound data handling
        else if (typeof (patientAssignments.primaryCareHBPCAssignments[0]) !== 'undefined'
            && patientAssignments.primaryCareHBPCAssignments[0] !== null) {
            if (typeof (patientAssignments.primaryCareHBPCAssignments.length) !== 0) {
                HBProcessing = true;
                vpta_teamname = patientAssignments.primaryCareHBPCAssignments[0].teamName;
                if (typeof (patientAssignments.primaryCareHBPCAssignments[0].teamMembers.length) != 0 && typeof (patientAssignments.primaryCareHBPCAssignments[0].teamMembers) != undefined) {
                    vpta_teammembers = patientAssignments.primaryCareHBPCAssignments[0].teamMembers;
                }
            }
        }

        //Continue processing if primaryCareAssignments OR primaryCareHBPCAssignments team name has a value
        if (vpta_teamname !== null && typeof (vpta_teamname) !== 'undefined') {
            // process team name always
            vpta_processTeamName(vpta_teamname);

            
        }
        else { primaryHomeBoundCareNotification = true; }
		
		// Home Bound or Primary Care processing check
            if (vpta_teammembers.length > 0) {
                if (HBProcessing) {
				setTimeout(vpta_processHBTeamMembers(vpta_teammembers, vpta_teamname), 500);
                }
                else if (PriProcessing) {
                    setTimeout(vpta_processPrimaryTeamMembers(vpta_teammembers, vpta_teamname), 500);
                }
            }
        return primaryHomeBoundCareNotification;
    }
    catch (e) {
        alert(e.message);
        return primaryHomeBoundCareNotification;
    }
}

function MentalHealthProviderProcessing(patientAssignments) {
    try {
        var pmentalHealthNotification = false;
        var vmta_teamname = null;
        var vmta_corrdinatorName = null;
        var vmta_corrdinatorRoleName = null;
        var vmta_corrdinatorRoleCode = null;
        var vmta_corrdinatorRolePhone = null;
        var vmta_corrdinatorRolePager = null;
        var vmta_corrdinatorRoleIen = null;

        if (patientAssignments.mentalHealthAssignments[0] !== null && typeof patientAssignments.mentalHealthAssignments[0].teamName !== undefined) {
            vmta_teamname = patientAssignments.mentalHealthAssignments[0].teamName;

            if (vmta_teamname !== null && typeof (vmta_teamname) !== 'undefined') {
                if (typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.length) !== 0 && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord) !== undefined) {
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Name !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Name) !== 'undefined') { vmta_corrdinatorName = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Name; }
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleName !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleName) !== 'undefined') { vmta_corrdinatorRoleName = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleName; }
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleCode !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleCode) !== 'undefined') { vmta_corrdinatorRoleCode = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.TeamRoleCode; }
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Phone !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Phone) !== 'undefined') { vmta_corrdinatorRolePhone = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Phone; }
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Pager !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Pager) !== 'undefined') { vmta_corrdinatorRolePager = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Pager; }
                    if (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Ien !== null && typeof (patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Ien) !== 'undefined') { vmta_corrdinatorRoleIen = patientAssignments.mentalHealthAssignments[0].mentalHealthTreatmentCoord.Ien; }
                }

                // vpta_processTeamName(vmta_teamname);

                // ftp_ftp_pact_contact_MentalHealthTeam
                if (vmta_corrdinatorName !== null && typeof (vmta_corrdinatorName) !== 'undefined') {
                    vmta_processMentalHealthCorridinator(vmta_teamname,
                                            vmta_corrdinatorName,
                                            vmta_corrdinatorRoleName,
                                            vmta_corrdinatorRoleCode,
                                            vmta_corrdinatorRolePhone,
                                            vmta_corrdinatorRolePager,
                                            vmta_corrdinatorRoleIen);
                }
            }
        }
        else { pmentalHealthNotification = true; }

        return pmentalHealthNotification;
    }
    catch (e) {
        alert(e.message);
        return pmentalHealthNotification;
    }
}

function TCMAssignmentsProviderProcessing() {
    //    tcmAssignments":[
    //    {
    //        "teamName":"OEF*987*1",
    //        "leadCoordinator":
    //        {
    //            "TeamRoleName":"Lead Coordinator",
    //            "TeamRoleCode":"29",
    //            "Name":"Smith,Cindy L",
    //            "Phone":"972-605-3000",
    //            "Pager":"972-605-3001",
    //            "Ien":"520629207"
    //        }
    //    }
    //],

    try {
        var ptcmNotification = false;

    }
    catch (e) {
        alert(e.message);
    }


}

function vpta_processHBTeamMembers(vpta_teammembers, vpta_teamname) {
    try {
        var tm = vpta_teammembers;
        var pactUserTeamId = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/TeamSet?$filter=Name eq 'PACT User'");
        var usersOnTeam = [];
        var teamId = vpta_retrieveTeamId(vpta_teamname);
        for (i = 0; i < vpta_teammembers.length; i++) {
            var name = tm[i].Name;
            var splitname = name.split(",");
            var last = splitname[0];
            var firstmiddle = splitname[1];
            var first = firstmiddle.split(" ");
            first = first[0];
            var vpta_entitySetName = 'SystemUserSet';
            var vpta_attributeSet = 'FirstName, LastName, SystemUserId';
            var vpta_conditionalFilter = "FirstName eq '" + first + "'& LastName eq '" + last + "'";
            var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName + '?$select=' + vpta_attributeSet + '&$filter=' + vpta_conditionalFilter;
            var provider = vpta_retrieveProvider(vpta_jsonQuery);

            // getting current users system user record to get the current business unit ID
            var currentUser = Xrm.Page.context.getUserId();
            currentUser = currentUser.replace(/({|})/g, '');
            currentUser = currentUser.toLowerCase();
            var user = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/SystemUserSet(guid'" + currentUser + "')?$select=*");

            if (provider.d.results.length == 0) { // only process if current looped record not found
                var vpta_provider = new Object();
                vpta_provider.FirstName = first;
                vpta_provider.LastName = last;
                vpta_provider.ftp_PACTId = {
                    Id: teamId,
                    LogicalName: 'ftp_pact',
                    Name: vpta_teamname
                };
                vpta_provider.ftp_PACTTeamRole = tm[i].TeamRoleName;
                vpta_provider.IsIntegrationUser = false;
                vpta_provider.UserLicenseType = 3;
                vpta_provider.AccessMode = {
                    Value: 0
                };
                vpta_provider.DomainName = first + "." + last + "@nodomainaccount.va.gov";
                vpta_provider.BusinessUnitId = {
                    Id: user.d.BusinessUnitId.Id,
                    LogicalName: user.d.BusinessUnitId.LogicalName,
                    Name: user.d.BusinessUnitId.Name
                };
                var vpta_jsonEntityData = JSON.stringify(vpta_provider);
                var vpta_entitySetName = 'SystemUserSet';
                var vpta_createQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName;
                var vpta_newProviderId = vpta_executeCrmOdataPostRequest(vpta_createQuery, false, vpta_jsonEntityData, 'CREATE', 'SystemUserId');
				debugger;
                // assign to CRM OOB Teamset for security roles
                vpta_assignTeam(vpta_newProviderId, pactUserTeamId.d.results[0].TeamId);
                usersOnTeam.push(vpta_newProviderId);
                if (vpta_newProviderId !== null && vpta_newProviderId === 'FAIL') {
                    vpta_pactid = vpta_pactTeamId;  // this is only set in vpta_processTeamName_response and has a local scope there
                    vpta_pactname = vpta_teamname;
                    //Notify User that new record was created
                    Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team Provider (' + last + ',' + first + ') was not found.  As a result, you will only be able to assign Requests to the PACT Team or to other providers from this PACT, but not to (' + last + ',' + first + ').', 'WARNING', 'PACT_CREATE');
                }
            }

            var role = tm[i].TeamRoleName;
            if (provider.d.results.length > 0) {
                var providerRole = new Object();
                providerRole.ftp_PACTTeamRole = role;
                providerRole.ftp_PACTId = {
                    Id: teamId,
                    LogicalName: 'ftp_pact',
                    Name: vpta_teamname
                };
                var vpta_jsonEntityData = JSON.stringify(providerRole);
                usersOnTeam.push(provider.d.results[0].SystemUserId);
				vpta_confirmMembership(provider.d.results[0].SystemUserId, pactUserTeamId.d.results[0].TeamId);
                var vpta_entitySetName = 'SystemUserSet';
                var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/" + vpta_entitySetName + "(guid'" + provider.d.results[0].SystemUserId + "')";
                vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'UPDATE', 'SystemUserId');
            }
        }

        removeNonMembers(usersOnTeam, teamId);
    }
    catch (e) { alert("Error occured while processing Home Bound Providers. ERROR:" + e); }
}

// vpta_processPrimaryTeamMembers and vmta_processMentalHealthCorridinator functions should be broken out into 
// smaller reusable functions when time
// Processes Primary Care and Home Bound provider members into CRM
function vpta_processPrimaryTeamMembers(vpta_teammembers, vpta_teamname) {
    try {
        var tm = vpta_teammembers;  // see if this is necessary
        var pactUserTeamId = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/TeamSet?$filter=Name eq 'PACT User'");
        var usersOnTeam = [];
        var teamId = vpta_retrieveTeamId(vpta_teamname);
        for (i = 0; i < tm.length; i++) {
            if (tm[i].StaffContact != null && tm[i].StaffContact != undefined) {
                // if provider indicated by StaffContact then check to see if in System User
                var name = tm[i].StaffContact.Name;
                var splitname = name.split(",");
                var last = splitname[0];
                var firstmiddle = splitname[1];
                var first = firstmiddle.split(" ");
                first = first[0];
                var vpta_entitySetName = 'SystemUserSet';
                var vpta_attributeSet = 'FirstName, LastName, SystemUserId';
                var vpta_conditionalFilter = "FirstName eq '" + first + "'& LastName eq '" + last + "'";
                var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName + '?$select=' + vpta_attributeSet + '&$filter=' + vpta_conditionalFilter;
                var provider = vpta_retrieveProvider(vpta_jsonQuery);

                // getting current users system user record to get the current business unit ID
                var currentUser = Xrm.Page.context.getUserId();
                currentUser = currentUser.replace(/({|})/g, '');
                currentUser = currentUser.toLowerCase();
                var user = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/SystemUserSet(guid'" + currentUser + "')?$select=*");

                if (provider.d.results.length == 0) {
                    // provider indicated by StaffContact was not found so creating the system user record
                    var vpta_provider = new Object();
                    vpta_provider.FirstName = first;
                    vpta_provider.LastName = last;
                    vpta_provider.ftp_PACTId = {
                        Id: teamId,
                        LogicalName: 'ftp_pact',
                        Name: vpta_teamname
                    };
                    vpta_provider.ftp_PACTTeamRole = tm[i].StaffContact.TeamRoleName;
                    vpta_provider.IsIntegrationUser = false;
                    vpta_provider.UserLicenseType = 3;
                    vpta_provider.AccessMode = {
                        Value: 0
                    };
                    vpta_provider.DomainName = first + "." + last + "@nodomainaccount.va.gov";
                    vpta_provider.BusinessUnitId = {
                        Id: user.d.BusinessUnitId.Id,
                        LogicalName: user.d.BusinessUnitId.LogicalName,
                        Name: user.d.BusinessUnitId.Name
                    };
                    var vpta_jsonEntityData = JSON.stringify(vpta_provider);
                    var vpta_entitySetName = 'SystemUserSet';
                    var vpta_createQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName;
                    var vpta_newProviderId = vpta_executeCrmOdataPostRequest(vpta_createQuery, false, vpta_jsonEntityData, 'CREATE', 'SystemUserId');
					debugger;
                    // assign to CRM OOB Teamset for security roles
                    vpta_assignTeam(vpta_newProviderId, pactUserTeamId.d.results[0].TeamId);
                    usersOnTeam.push(vpta_newProviderId);
                    if (vpta_newProviderId !== null && vpta_newProviderId === 'FAIL') {
                        vpta_pactid = vpta_pactTeamId;  // this is only set in vpta_processTeamName_response and has a local scope there
                       vpta_pactname = vpta_teamname;
                        //Notify User that new record was created
                        Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team Provider (' + last + ',' + first + ') was not found.  As a result, you will only be able to assign Requests to the PACT Team or to other providers from this PACT, but not to (' + last + ',' + first + ').', 'WARNING', 'PACT_CREATE');
                    }
                }

                var role = tm[i].StaffContact.TeamRoleName;
                if (provider.d.results.length > 0) {
                    var providerRole = new Object();
                    providerRole.ftp_PACTTeamRole = role;
                    providerRole.ftp_PACTId = {
                        Id: teamId,
                        LogicalName: 'ftp_pact',
                        Name: vpta_teamname
                    };
                    var vpta_jsonEntityData = JSON.stringify(providerRole);
                    usersOnTeam.push(provider.d.results[0].SystemUserId);
					vpta_confirmMembership(provider.d.results[0].SystemUserId, pactUserTeamId.d.results[0].TeamId);
                    var vpta_entitySetName = 'SystemUserSet';
                    var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/" + vpta_entitySetName + "(guid'" + provider.d.results[0].SystemUserId + "')";
                    vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'UPDATE', 'SystemUserId');
                }
            }
        }

        removeNonMembers(usersOnTeam, teamId);
    }
    catch (e) {
        alert("Error occured while processing Primary Care Providers. ERROR:" + e);
    }
}

// Processes Team into CRM
function vpta_processTeamName(vpta_teamname) {
    try {
        //Check if Team Name from PCMM integration service already exist in CRM
        var vpta_conditionalFilter = "(ftp_name eq '" + vpta_teamname + "')";
        vpta_getMultipleEntityDataAsync('ftp_pactSet', 'ftp_pactId, ftp_name', vpta_conditionalFilter, 'ftp_name', 'asc', 0, vpta_processTeamName_response, vpta_teamname);
    }
    catch (err) {
        alert('Veteran form load, PCMM Integration Service Function Error (vpta_processTeamName): ' + err.message);
    }
}

function vpta_processTeamName_response(vpta_pactData, vpta_lastSkip, vpta_teamname) {
    try {
        //vpta__lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var vpta_pactid = null;
        var vpta_pactname = null;
        for (var i = 0; i <= vpta_pactData.d.results.length - 1; i++) {
            //Get info
            if (vpta_pactData.d.results[i].ftp_pactId != null) { vpta_pactid = vpta_pactData.d.results[i].ftp_pactId; }
            if (vpta_pactData.d.results[i].ftp_name != null) { vpta_pactname = vpta_pactData.d.results[i].ftp_name; }
            break;
        }

        //Check if the pact team was found, if not add it.
        if (vpta_pactname == null) {
            var vpta_pactTeam = new Object();
            vpta_pactTeam.ftp_name = vpta_teamname;
            var vpta_jsonEntityData = JSON.stringify(vpta_pactTeam);
            var vpta_entitySetName = 'ftp_pactSet';
            var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName;
            var vpta_pactTeamId = vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'CREATE', 'ftp_pactId');
            if (vpta_pactTeamId != null && vpta_pactTeamId != 'FAIL') {
                vpta_pactid = vpta_pactTeamId; // this is only set in vpta_processTeamName_response and has a local scope there
                vpta_pactname = vpta_teamname;
                //Notify User that new record was created
                //Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team (' + vpta_teamname + ') was not found.  As a result, you will only be able to assign Requests to the PACT Team, not to individuals on the team.', 'WARNING', 'PACT_CREATE');
            }
        }

        //Populate CRM Veteran form with PACT Team data and update contact/veteran record directly
        if (vpta_pactid != null) {
            var vpta_lookupReference = [];
            vpta_lookupReference[0] = {};
            vpta_lookupReference[0].id = vpta_pactid;
            vpta_lookupReference[0].entityType = 'ftp_pact';
            vpta_lookupReference[0].name = vpta_pactname;
            Xrm.Page.getAttribute('ftp_pactid').setValue(vpta_lookupReference);

            //Update CRM
            var vpta_contactVeteran = new Object();
            vpta_contactVeteran.ftp_PACTId = {
                Id: vpta_pactid,
                LogicalName: 'ftp_pact',
                Name: vpta_teamname
            };

            var vpta_jsonEntityData = JSON.stringify(vpta_contactVeteran);
            var vpta_entitySetName = 'ContactSet';
            var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/" + vpta_entitySetName + "(guid'" + Xrm.Page.data.entity.getId() + "')";
            vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'UPDATE', 'ContactId');
			
			
        }
    }
    catch (err) {
        alert('Veteran form load, PCMM Integration Service Function Error(vpta_processTeamName_response) Error Detail: ' + err.message);
    }
}

// Processes mental health provider corrdinator into CRM
function vmta_processMentalHealthCorridinator(vmta_teamname,
                                    vmta_corrdinatorName,
                                    vmta_corrdinatorRoleName,
                                    vmta_corrdinatorRoleCode,
                                    vmta_corrdinatorRolePhone,
                                    vmta_corrdinatorRolePager,
                                    vmta_corrdinatorRoleIen) {

    // retrieve PACT Team ID pointer from CRM OOB Team
    var pactUserTeamId = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/TeamSet?$filter=Name eq 'PACT User'");
    // var usersOnTeam = [];
    // retrieve PACT Team ID from PACT Team entity
    //var teamId = vpta_retrieveTeamId(vmta_teamname);

    // parse out name for system user record query
    var splitname = vmta_corrdinatorName.split(",");
    var last = splitname[0];
    var firstmiddle = splitname[1];
    var first = firstmiddle.split(" ");
    first = first[0];


    // *** returns nothing
    // query the system User's record
    var vmta_entitySetName = 'SystemUserSet';
    var vmta_attributeSet = 'FirstName, LastName, SystemUserId';
    var vmta_conditionalFilter = "FirstName eq '" + first + "'& LastName eq '" + last + "'";
    var vmta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vmta_entitySetName + '?$select=' + vmta_attributeSet + '&$filter=' + vmta_conditionalFilter;
    var provider = vpta_retrieveProvider(vmta_jsonQuery);

    // getting the current CRM users system user record to get the current business unit.
    // var orgName = Xrm.Page.context.getOrgUniqueName();
    var currentUser = Xrm.Page.context.getUserId();
    currentUser = currentUser.replace(/({|})/g, '');
    currentUser = currentUser.toLowerCase();
    var user = vpta_retrieveProvider(vpta_serverUrl + vpta_crmOdataEndPoint + "/SystemUserSet(guid'" + currentUser + "')?$select=*");

    // if provider was not found create the system user record
    if (provider.d.results.length == 0) {
        var vmta_provider = new Object();
        vmta_provider.FirstName = first;
        vmta_provider.LastName = last;

        //vmta_provider.ftp_PACTId = {
        //    Id: teamId,
        //    LogicalName: 'ftp_pact',
        //    Name: vmta_teamname
        //};

        vmta_provider.ftp_PACTTeamRole = vmta_corrdinatorRoleName;
        vmta_provider.IsIntegrationUser = false;
        vmta_provider.UserLicenseType = 3;
        vmta_provider.AccessMode = {
            Value: 0
        };

        vmta_provider.DomainName = first + "." + last + "@nodomainaccount.va.gov";
        vmta_provider.BusinessUnitId = {
            Id: user.d.BusinessUnitId.Id,
            LogicalName: user.d.BusinessUnitId.LogicalName,
            Name: user.d.BusinessUnitId.Name
        };

        var vmta_jsonEntityData = JSON.stringify(vmta_provider);
        var vmta_entitySetName = 'SystemUserSet';
        var vmta_createQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vmta_entitySetName;
        var vmta_newProviderId = vpta_executeCrmOdataPostRequest(vmta_createQuery, false, vmta_jsonEntityData, 'CREATE', 'SystemUserId');

        // assign to CRM OOB Teamset for security roles
        vpta_assignTeam(vmta_newProviderId, pactUserTeamId.d.results[0].TeamId);
        usersOnTeam.push(vmta_newProviderId);
        if (vmta_newProviderId != null && vmta_newProviderId == 'FAIL') {
            vmta_pactid = vpta_pactTeamId; // this is only set in vpta_processTeamName_response and has a local scope there
            vmta_pactname = vmta_teamname;
            //Notify User that new record was created
            Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team Provider (' + last + ',' + first + ') was not found.  As a result, you will only be able to assign Requests to the PACT Team or to other providers from this PACT, but not to (' + last + ',' + first + ').', 'WARNING', 'PACT_CREATE');
        }

        // give the user roles
        if (provider.d.results.length > 0) {
            var providerRole = new Object();
            providerRole.ftp_PACTTeamRole = vmta_corrdinatorRoleName;
            /*providerRole.ftp_PACTId = {
                Id: teamId,
                LogicalName: 'ftp_pact',
                Name: vmta_teamname
            };*/
            var vpta_jsonEntityData = JSON.stringify(providerRole);
            var vpta_entitySetName = 'SystemUserSet';
            var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/" + vmta_entitySetName + "(guid'" + provider.d.results[0].SystemUserId + "')";
            vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'UPDATE', 'SystemUserId');
        }
    }
}

// HDR service operation
function vpta_getPactTeamViaPCMM(id) {
    //Performs web service call to the PCMM Intergation Service via the patientSummary method
	var ftype = Xrm.Page.ui.getFormType();
	if(ftype == 1){
		return;
	}
    try {
        settings = retrieveSettings();
        //var site = Xrm.Page.getAttribute("ftp_facilityid").getValue();
        //var icn = Xrm.Page.getAttribute("bah_mvipatientidentitifier").getValue();

		//Jeff testing new user
		//var site = '987';
		//var icn ='1012871347V662728';
		
        // This has no primary care assignment data
        var site = '987';
        var icn = id;

        // this has no mental health assignment data
        // var site = '991';
        // var icn = '1012667110V216290';

        var pcmmUrl = settings.d.results[0].ftp_DACURL + settings.d.results[0].ftp_PatientSummaryAPIURL + site + '/' + icn + '?idType=ICN';
        //Determine Form State
        if (Xrm.Page.ui.getFormType() == 1) { return false; } //Form in Create Mode abort
        //Get contact guid
        var vpta_contactGuid = Xrm.Page.data.entity.getId();

        //Get veteran/contact data
        var vpta_crmfacilityid = null; //Home Facility
        var vpta_crmpatienticn = null; //Patient ICN

        if (Xrm.Page.getAttribute("ftp_facilityid") != null) {
            if (Xrm.Page.getAttribute("ftp_facilityid").getValue() != null) {
                vpta_crmfacilityid = Xrm.Page.getAttribute("ftp_facilityid").getValue()[0].id;
            }
        }

        if (Xrm.Page.getAttribute("tri_veteranid") != null) {
            if (Xrm.Page.getAttribute("tri_veteranid").getValue() != null) {
                vpta_crmpatienticn = Xrm.Page.getAttribute("tri_veteranid").getValue()[0].id;
            }
        }

        //Get facility data
        var vpta_crmfacilitycode = null; //Facility Numeric code (int32)
        var vpta_facilityData = vpta_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode', vpta_crmfacilityid);
        if (vpta_facilityData != null) {
            if (vpta_facilityData.d.ftp_facilitycode != null) { vpta_crmfacilitycode = vpta_facilityData.d.ftp_facilitycode; }
        }

        if (vpta_crmfacilitycode == null) {
            //Insufficient data to perform MCMM Integration Service call
            return false;
        }

        //Call PCMM Integration Service (patient summary)
        vpta_getPatientSummaryData(vpta_crmfacilitycode, vpta_crmpatienticn, pcmmUrl);
    }
    catch (err) {
        alert('Veteran form load, PCMM Integration Service Function Error (vpta_getPactTeamViaPCMM): ' + err.message);
    }
}

// database operation functions
function vpta_executeCrmOdataGetRequest(vpta_jsonQuery, vpta_aSync, vpta_aSyncCallback, vpta_skipCount, vpta_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vpta_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vpta_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vpta_aSyncCallback* - specify the name of the return function to call upon completion (required if vpta_aSync = true.  Otherwise '')
    //*vpta_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vpta_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vpta_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vpta_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vpta_entityData = data;
                if (vpta_aSync == true) {
                    vpta_aSyncCallback(vpta_entityData, vpta_skipCount, vpta_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vpta_executeCrmOdataGetRequest: ' + errorThrown);
            },
            async: vpta_aSync,
            cache: false
        });
        return vpta_entityData;
    }
    catch (err) {
        alert('An error occured in the vpta_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vpta_getSingleEntityDataSync(vpta_entitySetName, vpta_attributeSet, vpta_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vpta_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vpta_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vpta_entityId* - is the Guid for the entity record

    try {
        var vpta_entityIdNoBracket = vpta_entityId.replace(/({|})/g, '');
        var vpta_selectString = '(guid' + "'" + vpta_entityIdNoBracket + "'" + ')?$select=' + vpta_attributeSet;
        var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName + vpta_selectString;
        var vpta_entityData = vpta_executeCrmOdataGetRequest(vpta_jsonQuery, false, '', 0, null);
        return vpta_entityData;
    }
    catch (err) {
        alert('An error occured in the vpta_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function vpta_getMultipleEntityDataAsync(vpta_entitySetName, vpta_attributeSet, vpta_conditionalFilter, vpta_sortAttribute, vpta_sortDirection, vpta_skipCount, vpta_aSyncCallback, vpta_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vpta_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vpta_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vpta_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vpta_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vpta_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vpta_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vpta_aSyncCallback* - is the name of the function to call when returning the result
    //*vpta_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + '/' + vpta_entitySetName + '?$select=' + vpta_attributeSet + '&$filter=' + vpta_conditionalFilter + '&$orderby=' + vpta_sortAttribute + ' ' + vpta_sortDirection + '&$skip=' + vpta_skipCount;
        vpta_executeCrmOdataGetRequest(vpta_jsonQuery, true, vpta_aSyncCallback, vpta_skipCount, vpta_optionArray);
    }
    catch (err) {
        alert('An error occured in the vpta_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function vpta_executeCrmOdataPostRequest(vpta_jsonQuery, vpta_aSync, vpta_jsonEntityData, vpta_recordAction, vpta_crmGuidFieldName) {
    //This function executes a CRM Odata web service call to create/update a Crm Record
    //*vpta_jsonQuery* - the complete query (url) to be executed
    //*vpta_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vpta_jsonEntityData* - the crm entity data record to be created/updated
    //*vpta_recordAction* - the action to be performed in CAPS 'CREATE', 'UPDATE, 'DELETE'
    //*vpta_crmGuidFieldName* - the name of the unique identifier field that has the Guid/Id for the crm record created

    try {
        var vpta_crmEntityId = 'FAIL';

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vpta_jsonQuery,
            data: vpta_jsonEntityData,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                if (vpta_recordAction == 'UPDATE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'MERGE'); }
                if (vpta_recordAction == 'DELETE') { XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'DELETE'); }
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (vpta_recordAction == 'CREATE') { vpta_crmEntityId = data.d[vpta_crmGuidFieldName].toString(); }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('Ajax Error in vpta_executeCrmOdataPostRequest: ' + errorThrown);
                vpta_crmEntityId = 'FAIL';
            },
            async: vpta_aSync
        });
        if (vpta_recordAction == 'CREATE') { return vpta_crmEntityId; }
    }
    catch (err) {
        alert('An error occured in the vpta_executeCrmOdataPostRequest function.  Error Detail Message: ' + err);
    }
}

function vpta_retrieveVeteran(query) {
    try {
        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: query,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in TRIBRIDGE.RetrieveAllAttributesByEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });

    }
    catch (e) {
        alert("Error occurred while retrieving settings in PCMM integration. Error data:" + e);
    }

}

function vpta_retrieveProvider(query) {
    try {

        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: query,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vpta_retrieveVeteran: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred while retrieving settings in PCMM integration. Error data:" + e);
    }
}

function vpta_confirmMembership(vpta_ProviderId, vpta_TeamId){
	try {
		debugger;
		var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "TeamMembershipSet";
        var selectString = "?$select=*&$filter=TeamId eq (guid'" + vpta_TeamId + "') and SystemUserId eq (guid'"+vpta_ProviderId+"')";
        var jsonQuery = context + ODATA_ENDPOINT + "/" + EntitySetName + selectString;
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
                alert('Fail: Ajax Error in vpta_retrieveVeteran: ' + errorThrown);
            },
            async: false,
            cache: false
        });
		if(EntityData.d.results.length > 0){
			return;
		}
		else{
			vpta_assignTeam(vpta_ProviderId, vpta_TeamId);
		}
        
    }
    catch (e) {
        alert("Error occurred while confirming Team Membership in PCMM integration. Error data:" + e);
    }
	
}
function vpta_retrieveTeamId(teamname) {
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "ftp_pactSet";
        var selectString = "?$select=*&$filter=ftp_name eq '" + teamname + "'";
        var jsonQuery = context + ODATA_ENDPOINT + "/" + EntitySetName + selectString;
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
                alert('Fail: Ajax Error in TRIBRIDGE.RetrieveAllAttributesByEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData.d.results[0].ftp_pactId;
    }
    catch (e) {
        alert("Error occurred while retrieving settings in PCMM integration. Error data:" + e);
    }
}

function vpta_assignTeam(userId, teamId) {
    var serviceURL = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
    var requestMain = "";
    requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
    requestMain += "  <s:Body>";
    requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
    requestMain += "      <request i:type=\"b:AddMembersTeamRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
    requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
    requestMain += "          <a:KeyValuePairOfstringanyType>";
    requestMain += "            <c:key>TeamId</c:key>";
    requestMain += "            <c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + teamId + "</c:value>";
    requestMain += "          </a:KeyValuePairOfstringanyType>";
    requestMain += "          <a:KeyValuePairOfstringanyType>";
    requestMain += "            <c:key>MemberIds</c:key>";
    requestMain += "            <c:value i:type=\"d:ArrayOfguid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">";
    requestMain += "              <d:guid>" + userId + "</d:guid>";
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
}

function removeNonMembers(usersOnTeam, team) {
    var providerQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/SystemUserSet?$select=SystemUserId&$filter=ftp_PACTId/Id eq (guid'" + team + "')";
    var allTeamUsers = vpta_retrieveProvider(providerQuery);
    var allUsersIds = [];
    for (i = 0; i < allTeamUsers.d.results.length; i++) {
        allUsersIds.push(allTeamUsers.d.results[i].SystemUserId);
    }

    for (v = 0; v < usersOnTeam.length; v++) {
        removeByValue(allUsersIds, usersOnTeam[v]);
    }
    for (i = 0; i < allUsersIds.length; i++) {
        var providerRole = new Object();
        providerRole.ftp_PACTTeamRole = null;
        providerRole.ftp_PACTId = {
            Id: null,
            LogicalName: null,
            Name: null
        };
        var vpta_jsonEntityData = JSON.stringify(providerRole);

        var vpta_entitySetName = 'SystemUserSet';
        var vpta_jsonQuery = vpta_serverUrl + vpta_crmOdataEndPoint + "/" + vpta_entitySetName + "(guid'" + allUsersIds[i] + "')";
        vpta_executeCrmOdataPostRequest(vpta_jsonQuery, false, vpta_jsonEntityData, 'UPDATE', 'SystemUserId');
    }
}

// support functions
function inArray(value, array) {
    var count = array.length;
    for (var i = 0; i < count; i++) {
        if (array[i] === value) { return true; }
    }
    return false;
}

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

function retrieveSettings() {
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "mcs_settingSet";
        var selectString = "?$select=*&$filter=mcs_name eq 'Active Settings'";
        var jsonQuery = context + ODATA_ENDPOINT + "/" + EntitySetName + selectString;
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
                alert('Fail: Ajax Error in TRIBRIDGE.RetrieveAllAttributesByEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred while retrieving settings in PCMM integration. Error data:" + e);
    }
}

function UserNotifications(primaryHomeBoundCareNotification, pmentalHealthNotification, ptcmNotification) {
    if (primaryHomeBoundCareNotification && !pmentalHealthNotification) {
        Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team (' + vpta_teamname + ') contains no listed providers.  As a result, you will only be able to assign Requests to the PACT Team, not to individuals on the team.', 'WARNING', 'PACT_CREATE');
    }
    else if (!primaryHomeBoundCareNotification && pmentalHealthNotification) {
        Xrm.Page.ui.setFormNotification('This Veteran’s Mental Health Team (' + vmta_teamname + ') contains no listed providers.  As a result, you will only be able to assign Requests to the PACT Team, not to individuals on the team.', 'WARNING', 'PACT_CREATE');
    }
    else if (primaryHomeBoundCareNotification && pmentalHealthNotification) {
        Xrm.Page.ui.setFormNotification('This Veteran’s PACT Team (' + vpta_teamname + ') and and Mental Health Team (' + vmta_teamname + ') contains no listed providers.  As a result, you will only be able to assign Requests to the PACT or Mental Health Team(s), not to individuals on the team.', 'WARNING', 'PACT_CREATE');
    }
}

function DefaultTeam() {
    // default team of PACT Team 12
}

// this is not used right now
function specialtyAssignmentsProviderProcessing() {

}

function veteranMVISearch() {
	debugger;
	var filter = "";
	var filterPrefix = "$select=*&$filter=";
	var edipi = "";
	//var edipi = Xrm.Page.getAttribute("bah_edipi_text").getValue();
	if (edipi != null) {
		if(edipi.length>11) {
			edipi = "";
		}
	}
	else {
		edipi = "";
	}
	var firstname = Xrm.Page.getAttribute("firstname").getValue();
	var lastname = Xrm.Page.getAttribute("lastname").getValue();

	var dobdate = Xrm.Page.getAttribute("ftp_dateofbirth").getValue();
	var dobstring = "";
	if(dobdate != null) {
		dobstring =dobdate;
	}


	var ssn = Xrm.Page.getAttribute("governmentid").getValue();
	if (ssn != "" && ssn != null) {
		ssn = ssn.replace(/-/g, "");
	}

	//if we have edipi, search using just it
	if (edipi != "") {
		filter = buildQueryFilter("crme_EDIPI", edipi, false);
		filter += buildQueryFilter("crme_ClassCode", 'MIL', true);
		filter += buildQueryFilter("crme_SearchType", 'SearchByIdentifier', true);

		//set search type as unattended
		filter += " and crme_IsAttended eq false";
	}
	else {
		//otherwise search using lastname, firstname, ssn, dob
		filter = buildQueryFilter("crme_LastName", lastname, false); //assuming lastname will never be blank

		if (firstname != "" && firstname != null) {
			filter += buildQueryFilter("crme_FirstName", firstname, true);
		}

		if (ssn != "" && ssn != null) {
			filter += buildQueryFilter("crme_SSN", ssn, true);
		}

		if (dobstring != "") {
			filter += " and crme_DOBString eq '" + dobstring + "'";
		}
		filter += buildQueryFilter("crme_SearchType", 'SearchByFilter', true);

		//set search type as attended (for now)
		filter += " and crme_IsAttended eq true";
	}


	filter = encodeURIComponent(filter);
	filter = filterPrefix + filter;
	//debugger;
	SDK.REST.retrieveMultipleRecords("crme_person", filter, unattendedSearchCallback, function (error) { alert(error.message); }, unattendedSearchComplete);
}

function unattendedSearchCallback(returnData) {
	debugger;
	if (returnData != null && returnData.length==1) {
		// check for exceptions 1st
		if (returnData[0].crme_ExceptionOccured || (returnData[0].crme_ReturnMessage != null && returnData[0].crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
			//do nothing
		}
		else {
			var patientMviIdentifier = returnData[0].crme_PatientMviIdentifier == null ? "" : returnData[0].crme_PatientMviIdentifier;
			if(patientMviIdentifier!=""){
				var idparts = patientMviIdentifier.split("^");
				
				if(idparts.length>0) {
					var nationalId = idparts[0];
					_icn = nationalId;
					
					//DO WHATEVER YOU ARE GOING TO DO WITH THE ICN HERE
					vpta_getPactTeamViaPCMM(_icn);
				}
			}
		}
	}
}
function buildQueryFilter(field, value, and) {
	if (value == '') {
		if (and) {
			return " and " + field + " eq null";
		} else {
			return field + " eq null";
		}
	}
	else {
		if (and) {
			return " and " + field + " eq '" + value + "'";
		} else {
			return field + " eq '" + value + "'";
		}
	}
}

function unattendedSearchComplete() {
	//do nothing
}