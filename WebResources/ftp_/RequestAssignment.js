//****************************************
//Set new PCMM Enabled flag to True as default, then read from 'Active Settings'
var pcmm_Enabled = true;
//****************************************

function dynamicAssignment() {
    //debugger;
    try {

        //****************************************
        //Get PCMM Setting value from Active Settings
        var pcmm_activesettings = pcmm_retrievePCMMSetting();
        for (i = 0; i < pcmm_activesettings.d.results.length; i++) {
            if (pcmm_activesettings.d.results[i].ftp_IsPCMMEnabled != null) { pcmm_Enabled = pcmm_activesettings.d.results[i].ftp_IsPCMMEnabled; }
            break;
        }
        //****************************************

        //***************
        if (pcmm_Enabled == false) {
            var pcmm_alertText = "The Patient Care Management Module (PCMM) is down at this time so PACT Team data is not available.";
            Xrm.Page.ui.setFormNotification(pcmm_alertText, "INFO", "noPCMM");
        }
        //***************

        var fType = Xrm.Page.ui.getFormType();
        if (fType == 1) {
            Xrm.Page.getAttribute("ftp_minorreasonid").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_lastfilled").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_pickupmethod").setRequiredLevel("none");
        }
        else {
            /*Xrm.Page.getAttribute("ftp_assigneetype").setRequiredLevel("required");*//*removed field requirement per RTC task 466711 - kknab 3/2/17*/
            //Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("required");
            Xrm.Page.ui.controls.get("ftp_userselected").setVisible(false);
            Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(false);
            Xrm.Page.getAttribute("ftp_userselected").setRequiredLevel("none");
            Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("none"); /*added line per RTC defect 714618*/
            if (Xrm.Page.getAttribute("ftp_assigneetype").getValue() != null) {
                var aType = Xrm.Page.getAttribute("ftp_assigneetype").getText();
                var vetId = Xrm.Page.getAttribute("customerid").getValue()[0].id;
                var veteran = retrieveSingleVeteran(vetId);
                //7/12/18 changed vetFacility to use veteran.d.ftp_currentfacilityid
                //var vetFacility = veteran.d.ftp_FacilityId;
                var vetFacility = veteran.d.ftp_currentfacilityid;
                var Pact = veteran.d.hasOwnProperty("ftp_PACTId") && !!veteran.d.ftp_PACTId ? veteran.d.ftp_PACTId.Name : "";
                var teams = retrieveTeams(Pact);

                for (i = 0; i < teams.d.results.length; i++) {
                    if (teams.d.results[i].Name === Pact) {
                        var vetPact = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Pharmacy") {
                        var pharm = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "RN") {
                        var tan = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Speciality") {
                        var specialty = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "MSA") {
                        var msa = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "Advanced MSA") {
                        var adv = teams.d.results[i];
                    }
                    if (teams.d.results[i].Name === "LIP") {
                        var lip = teams.d.results[i];
                    }
                }
                if (aType == "User") {
                    setUserTeamFetch(vetFacility, vetPact, specialty, pharm);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(true);
                    Xrm.Page.getAttribute("ftp_userselected").setRequiredLevel("required");
                    //****************************
                    if (pcmm_Enabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("none");
                        Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(false);
                    }
                    //****************************
                }
                if (aType == "Team") {
                    setTeamFetch(vetFacility, vetPact, pharm, tan, msa, adv, lip);
                    Xrm.Page.ui.controls.get("ftp_teamselected").setVisible(true);
                    Xrm.Page.ui.controls.get("ftp_userselected").setVisible(false);
                    //****************************
                    if (pcmm_Enabled == false) {
                        Xrm.Page.getAttribute("ftp_teamselected").setRequiredLevel("required");
                    }
                    //****************************
                }
            }
        }
    }
    catch (e) {
        alert("Error in Request Assignment - dynamicAssignment function. Error" + e);
    }

}

function typeChange() {
    //debugger;
    Xrm.Page.getAttribute("ftp_teamselected").setValue(null);
    Xrm.Page.getAttribute("ftp_userselected").setValue(null);
    //Xrm.Page.data.refresh();
    dynamicAssignment();
}

function ownerChange() {
    //debugger;
    Xrm.Page.getAttribute("ownerid").fireOnChange(); //the ownerid_onChange function is in the ftp_/Request/JScript/main.js library
}

function teamSelect() {
    //debugger;
    var teamValue = Xrm.Page.getAttribute("ftp_teamselected").getValue();
    if (!!teamValue) {
        var vetId = Xrm.Page.getAttribute("customerid").getValue()[0].id;
        var teamId = teamValue[0].id;
        var teamName = teamValue[0].name;
        var aType = Xrm.Page.getAttribute("ftp_assigneetype").getText();
        var veteran = retrieveSingleVeteran(vetId);
        //7/12/18 changed vetFacility to use veteran.d.ftp_currentfacilityid
        //var vetFacility = veteran.d.ftp_FacilityId;
        var vetFacility = veteran.d.ftp_currentfacilityid;
        var Pact = veteran.d.hasOwnProperty("ftp_PACTId") && !!veteran.d.ftp_PACTId ? veteran.d.ftp_PACTId.Name : "";
        var teams = retrieveTeams(Pact);

        for (i = 0; i < teams.d.results.length; i++) {
            if (teams.d.results[i].Name === "Pharmacy") {
                var pharm = teams.d.results[i];
            }
            if (teams.d.results[i].Name === "Speciality") {
                var specialty = teams.d.results[i];
            }
        }
        if (aType == "User") {
            //*************************************
            if (pcmm_Enabled == true) {
                if (teamName === "Pharmacy") {
                    setPharmOwnerFetch(vetFacility, pharm);
                    //Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(true);
                }
                else if (teamName === "Speciality") {
                    setSpecialtyOwnerFetch(vetFacility, specialty);
                    //Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(false);

                }
                else if (teamName === Pact) {
                    setPactOwnerFetch(Pact);
                    //Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(false);
                }
                else {
                    //Render active user list 
                    setAllOwnerFetch();
                }
            }
            else {
                //Render active user list 
                setAllOwnerFetch();
            }
            //*****************************************
        }
        if (aType == "Team") {
            Xrm.Page.getAttribute("ownerid").setValue([{
                id: teamId,
                name: teamName,
                entityType: "team"
            }]);
            //ownerChange();
            //Xrm.Page.getControl("ftp_iswarmtransfer").setVisible(teamName === "Pharmacy");
        }
    }
    else {
        //Render active user list 
        setAllOwnerFetch();
    }
}

function filterRFR() {

    //deprecated
    return;
    try {
        // debugger;
        if (Xrm.Page.getControl("ftp_reasonforrequest")) {
            var uID = Xrm.Page.context.getUserId();
            var SetName = "TeamMembership";
            uID = uID.replace(/({|})/g, '').toLowerCase();
            var teams = [];
            var tID;
            var team = REST.SYNC.retrieveMultipleRecordsSync(SetName, "$select=TeamId&$filter=SystemUserId eq guid'" + uID + "'");
            for (i = 0; i < team.results.length; i++) {
                teams.push(team.results[i].TeamId);
            }
            for (t = 0; t < teams.length; t++) {
                var d = REST.SYNC.retrieveMultipleRecordsSync("Team", "$select=Name,TeamId&$filter=TeamId eq guid'" + teams[t] + "'");
                for (i = 0; i < d.results.length; i++) {
                    if (d.results[i].Name == "Pharmacy" || d.results[i].Name == "PACT User" || d.results[i].Name == "CCA Team" || d.results[i].Name == "MSA" || d.results[i].Name == "Advanced MSA" || d.results[i].Name == "LIP" || d.results[i].Name == "RN") {
                        var tName = d.results[i].Name;
                        tID = d.results[i].TeamId;
                        var fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                            '     <entity name="ftp_reasonforrequest">' +
                            '         <attribute name="ftp_reasonforrequestid" />' +
                            '         <attribute name="ftp_reason" />' +
                            '         <attribute name="createdon" />' +
                            '         <filter type="and">' +
                            '             <condition attribute="statecode" operator="eq" value="0" />' +
                            '             <condition attribute="ftp_display" operator="eq" value="1" />' +
                            '         </filter>' +
                            '        <link-entity name="ftp_ftp_reasonforrequest_team" from="ftp_reasonforrequestid" to="ftp_reasonforrequestid">' +
                            '            <link-entity name="team" from="teamid" to="teamid" alias="ac">' +
                            '                <filter type="and">' +
                            '                    <condition attribute="teamid" value="' + tID + '" uitype="team" uiname="' + tName + '" operator="eq" />' +
                            '                </filter>' +
                            '            </link-entity>' +
                            '        </link-entity>' +
                            '     </entity>' +
                            ' </fetch>';
                        var entityName = 'ftp_reasonforrequest';
                        var viewDisplayName = 'Reasons for Request';
                        var viewId = Xrm.Page.getControl("ftp_reasonforrequest").getDefaultView();
                        var isDefault = true;
                        var layoutXml = '<grid name="resultset" object="1" jump="ftp_reasonforrequestid" select="1" icon="1" preview="1">' +
                            '<row name="result" id="ftp_reasonforrequestid">' +
                            '<cell name="ftp_reason" width="150" />' +
                            '<cell name="createdon" width="150" />' +
                            '</row>' +
                            '</grid>';

                        Xrm.Page.getControl("ftp_reasonforrequest").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, isDefault);
                    }
                }
            }


        }
    }
    catch (e) {
        alert('Error occurred in filter RFR: ' + e.message);
    }
}

function setTeamFetch(facility, pact, pharm, tan, msa, adv, lip) {
    //debugger;
    var pactName = !!pact ? pact.Name : "";
    var pactId = !!pact ? setFetchId(pact.TeamId) : "";
    var pharmName = !!pharm ? pharm.Name : "";
    var pharmId = !!pharm ? setFetchId(pharm.TeamId) : "";
    var tanName = !!tan ? tan.Name : "";
    var tanId = !!tan ? setFetchId(tan.TeamId) : "";
    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="team">' +
        '<attribute name="name" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="teamid" />' +
        '<attribute name="teamtype" />' +
        '<order attribute="name" descending="false" />';
    if (!!pact || !!pharm || !!tan) {
        fetch += '<filter type="and"><filter type="or">';
        if (!!pact) fetch += '<condition attribute="teamid" operator="eq" uiname="' + pact.Name + '" uitype="team" value="' + setFetchId(pact.TeamId) + '" />';
        if (!!tan) fetch += '<condition attribute="teamid" operator="eq" uiname="' + tan.Name + '" uitype="team" value="' + setFetchId(tan.TeamId) + '" />';
        if (!!pharm) fetch += '<condition attribute="teamid" operator="eq" uiname="' + pharm.Name + '" uitype="team" value="' + setFetchId(pharm.TeamId) + '" />';
        if (!!msa) fetch += '<condition attribute="teamid" operator="eq" uiname="' + msa.Name + '" uitype="team" value="' + setFetchId(msa.TeamId) + '" />';
        if (!!adv) fetch += '<condition attribute="teamid" operator="eq" uiname="' + adv.Name + '" uitype="team" value="' + setFetchId(adv.TeamId) + '" />';
        if (!!lip) fetch += '<condition attribute="teamid" operator="eq" uiname="' + lip.Name + '" uitype="team" value="' + setFetchId(lip.TeamId) + '" />';
        //******************
        // Commented out 09/2019; PCMM no longer needed
        //if (pcmm_Enabled == false) { fetch += '<condition attribute="businessunitid" operator="eq-businessid"/>'; }
        //******************
        fetch += '</filter></filter>';
    }
    fetch += '</entity></fetch>';
    var entityName = 'team';
    var viewDisplayName = 'Teams Lookup View';
    var viewId = Xrm.Page.getControl("ftp_teamselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="teamid" select="1" icon="1" preview="1">' +
        '<row name="result" id="teamid">' +
        '<cell name="name" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_teamselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
}

function setUserTeamFetch(facility, pact, specialty, pharm) {
    //debugger;
    var pactName = !!pact ? pact.Name : "";
    var pactId = !!pact ? setFetchId(pact.TeamId) : "";
    var specialtyId = !!specialty ? setFetchId(specialty.TeamId) : "";
    var specialtyName = !!specialty ? specialty.Name : "";
    var pharmName = !!pharm ? pharm.Name : "";
    var pharmId = !!pharm ? setFetchId(pharm.TeamId) : "";
    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="team">' +
        '<attribute name="name" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="teamid" />' +
        '<attribute name="teamtype" />' +
        '<order attribute="name" descending="false" />';
    if (!!pact || !!specialty || !!pharm) {
        fetch += '<filter type="and"><filter type="or">';
        if (!!pact) fetch += '<condition attribute="teamid" operator="eq" uiname="' + pactName + '" uitype="team" value="' + pactId + '" />'; // set equal to veteran's PACT
        if (!!specialty) fetch += '<condition attribute="teamid" operator="eq" uiname="' + specialtyName + '" uitype="team" value="' + specialtyId + '" />';
        if (!!pharm) fetch += '<condition attribute="teamid" operator="eq" uiname="' + pharmName + '" uitype="team" value="' + pharmId + '" />';
        //*********************************
        // Commented out 09/2019: PCMM not used 
        //if (pcmm_Enabled == false) { fetch += '<condition attribute="businessunitid" operator="eq-businessid"/>'; }
        //
        //*********************************
        fetch += '</filter></filter>';
    }
    fetch += '</entity></fetch>';
    var entityName = 'team';
    var viewDisplayName = 'Teams Lookup View';
    var viewId = Xrm.Page.getControl("ftp_teamselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="teamid" select="1" icon="1" preview="1">' +
        '<row name="result" id="teamid">' +
        '<cell name="name" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_teamselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);

}

function setPactOwnerFetch(pName) {
    //debugger;
    var pact = retrievePactTeam(pName);
    var pactId = setFetchId(pact.d.results[0].ftp_pactId);

    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="systemuser">' +
        '<attribute name="fullname" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="title" />' +
        '<attribute name="ftp_pactteamrole" />' +
        '<attribute name="positionid" />' +
        '<attribute name="systemuserid" />' +
        '<attribute name="ftp_pactsortorder" />' +
        '<order attribute="ftp_pactsortorder" descending="false" />' +
        //'<order attribute="fullname" descending="false" />' +
        '<filter type="and">' +
        '<condition attribute="ftp_pactid" operator="eq" uiname="' + pName + '" uitype="ftp_pact" value="' + pactId + '" />' +
        '</filter>' +
        '</entity>' +
        '</fetch>';
    var entityName = 'systemuser';
    var viewDisplayName = 'User Lookup View';
    var viewId = Xrm.Page.getControl("ftp_userselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="systemuserid" select="1" icon="1" preview="1">' +
        '<row name="result" id="systemuserid">' +
        '<cell name="fullname" width="150" />' +
        //'<cell name="ftp_pactteamrole" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_userselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
}

function setSpecialtyOwnerFetch(facility, team) {
    //debugger;
    //3/9/18: remove facility filter from user field; filter only on selected team
    var teamName = team.Name;
    var teamId = setFetchId(team.TeamId);
    //var facilityName = facility.Name;
    //var facilityId = setFetchId(facility.Id);

    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">' +
        '<entity name="systemuser">' +
        '<attribute name="fullname" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="title" />' +
        '<attribute name="ftp_pactteamrole" />' +
        '<attribute name="positionid" />' +
        '<attribute name="systemuserid" />' +
        '<order attribute="fullname" descending="false" />' +
        //'<filter type="and">'+
        //  '<condition attribute="ftp_facilitysiteid" operator="eq" uiname="'+facilityName+'" uitype="ftp_facility" value="'+facilityId+'" />'+
        //'</filter>'+
        '<link-entity name="teammembership" from="systemuserid" to="systemuserid" visible="false" intersect="true">' +
        '<link-entity name="team" from="teamid" to="teamid" alias="ae">' +
        '<filter type="and">' +
        '<condition attribute="teamid" operator="eq" uiname="' + teamName + '" uitype="team" value="' + teamId + '" />' +
        '</filter>' +
        '</link-entity>' +
        '</link-entity>' +
        '</entity>' +
        '</fetch>';
    var entityName = 'systemuser';
    var viewDisplayName = 'User Lookup View';
    var viewId = Xrm.Page.getControl("ftp_userselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="systemuserid" select="1" icon="1" preview="1">' +
        '<row name="result" id="systemuserid">' +
        '<cell name="fullname" width="150" />' +
        '<cell name="ftp_pactteamrole" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_userselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
}

function setPharmOwnerFetch(facility, pharm) {
    //debugger;
    //3/9/18: remove facility filter from user field; filter only on selected team
    //var facilityName=facility.Name;
    //var facilityId=setFetchId(facility.Id);
    var pharmName = pharm.Name;
    var pharmId = setFetchId(pharm.TeamId);
    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">' +
        '<entity name="systemuser">' +
        '<attribute name="fullname" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="title" />' +
        '<attribute name="ftp_pactteamrole" />' +
        '<attribute name="positionid" />' +
        '<attribute name="systemuserid" />' +
        '<order attribute="fullname" descending="false" />' +
        //'<filter type="and">'+
        //  '<condition attribute="ftp_facilitysiteid" operator="eq" uiname="'+facilityName+'" uitype="ftp_facility" value="'+facilityId+'" />'+
        //'</filter>'+
        '<link-entity name="teammembership" from="systemuserid" to="systemuserid" visible="false" intersect="true">' +
        '<link-entity name="team" from="teamid" to="teamid" alias="ac">' +
        '<filter type="and">' +
        '<condition attribute="teamid" operator="eq" uiname="' + pharmName + '" uitype="team" value="' + pharmId + '" />' +
        '</filter>' +
        '</link-entity>' +
        '</link-entity>' +
        '</entity>' +
        '</fetch>';
    var entityName = 'systemuser';
    var viewDisplayName = 'User Lookup View';
    var viewId = Xrm.Page.getControl("ftp_userselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="systemuserid" select="1" icon="1" preview="1">' +
        '<row name="result" id="systemuserid">' +
        '<cell name="fullname" width="150" />' +
        '<cell name="ftp_pactteamrole" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_userselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
}

function setUserOwner() {
    //debugger;
    try {
        var userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
        if (!!userSelectedValue) {
            Xrm.Page.getAttribute("ownerid").setValue([{
                id: userSelectedValue[0].id,
                name: userSelectedValue[0].name,
                entityType: "systemuser"
            }]);
            ownerChange();
        }
    }
    catch (e) {
        alert("Error occurred in Request Assignment - setUserOwner function. Error: " + e);
    }

}

function setFetchId(guid) {
    //debugger;
    var id = guid.toUpperCase();
    var prefix = "{";
    var suffix = "}";
    var fetchId = prefix + id + suffix;
    return fetchId;
}

function retrieveSingleVeteran(veteranId) {
    //debugger;
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "ContactSet";
        //7/12/18 added ftp_currentfacilityid to query string
        var selectString = "(guid'" + veteranId + "')?$select=ftp_PACTId, ftp_FacilityId, ftp_currentfacilityid";
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
                alert('Fail: Ajax Error in Request Assignment - retrieveSingleVeteran Function. Error: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred in Request Assignment - retrieveSingleVeteran function. Error data:" + e);
    }
}

function retrieveTeams(pactName) {
    //debugger;
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "TeamSet";
        var selectString = "?$select=Name, TeamId&$filter=Name eq 'LIP' or Name eq 'Advanced MSA' or Name eq 'MSA' or Name eq 'Pharmacy' or Name eq 'RN' or Name eq 'Speciality'";// or Name eq '" + pactName + "'";
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
                alert('Fail: Ajax Error in Request Assignment - retrieveTeams Function. Error: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred in Request Assignment - retrieveTeams function. Error data:" + e);
    }
}

function retrievePactTeam(pactName) {
    //debugger;
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "ftp_pactSet";
        var selectString = "?$select=ftp_name, ftp_pactId&$filter=ftp_name eq '" + pactName + "'";
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
                alert('Fail: Ajax Error in Request Assignment - retrieveTeams Function. Error: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred in Request Assignment - retrieveTeams function. Error data:" + e);
    }
}

//******************************
function setAllOwnerFetch() {
    //debugger;
    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="systemuser">' +
        '<attribute name="fullname" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="title" />' +
        '<attribute name="ftp_pactteamrole" />' +
        '<attribute name="positionid" />' +
        '<attribute name="systemuserid" />' +
        '<order attribute="fullname" descending="false" />' +
        '<filter type="and">' +
        '<condition attribute="isdisabled" value="0" operator="eq"/>' +
        '<condition attribute="accessmode" value="3" operator="ne"/>' +
        '<condition attribute="businessunitid" operator="eq-businessid"/>' +
        '</filter>' +
        '</entity>' +
        '</fetch>';
    var entityName = 'systemuser';
    var viewDisplayName = 'User Lookup View';
    var viewId = Xrm.Page.getControl("ftp_userselected").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="systemuserid" select="1" icon="1" preview="1">' +
        '<row name="result" id="systemuserid">' +
        '<cell name="fullname" width="150" />' +
        '<cell name="ftp_pactteamrole" width="150" />' +
        '</row>' +
        '</grid>';

    Xrm.Page.getControl("ftp_userselected").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
}

function pcmm_retrievePCMMSetting() {
    //debugger;
    try {
        var context = Xrm.Page.context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var EntitySetName = "mcs_settingSet";
        var selectString = "?$select=ftp_IsPCMMEnabled&$filter=mcs_name eq 'Active Settings'";
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
                alert('Fail: Ajax Error in Request Assignment - pcmm_retrievePCMMSetting Function. Error: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        return EntityData;
    }
    catch (e) {
        alert("Error occurred in Request Assignment - pcmm_retrievePCMMSetting function. Error data:" + e);
    }
}