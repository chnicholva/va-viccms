//request_GetSurrogate.js
//Contains functions used on the request form to retrieve VIA surrogate data
//Requires jQuery loaded on the CRM Form

//Static Variables
var rgs_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var rgs_serverUrl = Xrm.Page.context.getClientUrl();

//var rgs_GetSurrogateUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VIA/surrogate/1.0/json';  //OLD MANUAL DEV URL
var rgs_GetSurrogateUrl = '';
var rgs_baseServiceEndpointUrl = null;
var rgs_requestingApp = null;
var rgs_consumingAppToken = null;
var rgs_consumingAppPassword = null;
var rgs_UserSiteNo = "";
var rgs_userSiteId = "";

//Required function, used by Login Control
function vcmn_initViaDropdownControls() {
    //Function is triggered by The VistA Login Control
    try {
        Xrm.Page.getControl("WebResource_ViaWorkloadLookup").setSrc(Xrm.Page.getControl("WebResource_ViaWorkloadLookup").getSrc());
    }
    catch (err) {
        alert('Request Surrogate VIA Login Function Error(vcmn_initViaDropdownControls): ' + err.message);
    }
}

function rgs_assignToSelf() {
    try {
        //Prompt user to confirm assigning record to self
        Xrm.Utility.confirmDialog("Would you like to assign this request to yourself?, Select OK if Yes, otherwise CANCEL.",
            function () {
                //Check the status of the record, do not proceed if read only
                if (Xrm.Page.ui.getFormType() >= 3) {
                    alert("The current request cannot be assigned due to the current read-only status!");
                    return false;
                }
                //Get the current user guid & Name
                var rgs_currentUserId = Xrm.Page.context.getUserId();
                var rgs_currentUserName = Xrm.Page.context.getUserName();

                //Check if VIA Login cookie exist (not expired)
                var rgs_ViaLoginCookie = rgs_getCookie("viasessionlink");

                if (rgs_ViaLoginCookie == "") {
                    alert("Your VISTA session has expired. In order to assign this request, you must be logged into VISTA!");
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
                    Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
                    return false;
                }

                //Update the Assignee Type attribute to User
                Xrm.Page.getAttribute("ftp_assigneetype").setValue(100000000); //User
                Xrm.Page.getAttribute("ftp_assigneetype").setSubmitMode('always');
                //Trigger Asignee Type On Change event
                Xrm.Page.getAttribute("ftp_assigneetype").fireOnChange();
                //Wait 1 second before proceeding
                setTimeout(function () {
                    //Set the selected user to the current user
                    Xrm.Page.getAttribute("ftp_userselected").setValue([{
                        id: rgs_currentUserId,
                        name: rgs_currentUserName,
                        entityType: "systemuser"
                    }]);
                    Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
                    //Trigger Selected User On Change event
                    Xrm.Page.getAttribute("ftp_userselected").fireOnChange();
                }, 1000);
            }
        );
    }
    catch (err) {
        alert('Request Assign Button Function Error(rgs_assignToSelf): ' + err.message);
    }
}

function rgs_getSurrogate() {
	//debugger;
    try {
        Xrm.Page.ui.clearFormNotification("SURR1001");
        //If selected user is null, then exit
        var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
        if (rgs_userSelectedValue == null) {
            return false;
        }

        //Turn on Surrogate Processing Message.....
        Xrm.Page.ui.setFormNotification("Checking for VIA Surrogates for the assigned user, please wait..", "INFO", "SURR1001");

        //GET CRM SETTINGS WEB SERVICE URLS
        var rgs_conditionalFilter = "(mcs_name eq 'Active Settings')";
        rgs_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_VIASurrogateURL, ftp_IsProductionEnvironment, ftp_VIAServiceBaseURL, ftp_VIARequestingApplicationCode, ftp_VIAConsumingApplicationToken, ftp_VIAConsumingApplicationPassword', rgs_conditionalFilter, 'mcs_name', 'asc', 0, rgs_viaSurrogateSetting_response);
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_getSurrogate): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SURR1001");
    }
}

function rgs_viaSurrogateSetting_response(rgs_settingData, rgs_lastSkip) {
    try {
        //rgs_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var rgs_DacUrl = null;
        var rgs_ViaSurrogateApiUrl = null;
        for (var i = 0; i <= rgs_settingData.d.results.length - 1; i++) {
            //Get info
            if (rgs_settingData.d.results[i].ftp_DACURL != null) { rgs_DacUrl = rgs_settingData.d.results[i].ftp_DACURL; }
            if (rgs_settingData.d.results[i].ftp_VIASurrogateURL != null) { rgs_ViaSurrogateApiUrl = rgs_settingData.d.results[i].ftp_VIASurrogateURL; }
            if (rgs_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { rgs_baseServiceEndpointUrl = rgs_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (rgs_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { rgs_requestingApp = rgs_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (rgs_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { rgs_consumingAppToken = rgs_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (rgs_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { rgs_consumingAppPassword = rgs_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            break;
        }
        if (rgs_DacUrl != null && rgs_ViaSurrogateApiUrl != null) {
            //Construct full web service URL
            rgs_GetSurrogateUrl = rgs_DacUrl + rgs_ViaSurrogateApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE VIA GET SURROGATE SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
            //Exit process, clear notification message
            Xrm.Page.ui.clearFormNotification("SURR1001");
            Xrm.Page.getAttribute("ftp_userselected").setValue(null);
            Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
            return false;
        }
        if (rgs_baseServiceEndpointUrl == null || rgs_requestingApp == null || rgs_consumingAppToken == null || rgs_consumingAppPassword == null) {
            Xrm.Page.ui.setFormNotification("ERROR: THE 'VIA CONFIGURATION IS MISSING DATA IN THE 'Settings Entity', PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
            //Exit process, clear notification message
            Xrm.Page.ui.clearFormNotification("SURR1001");
            Xrm.Page.getAttribute("ftp_userselected").setValue(null);
            Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
            return false;
        }
        //Decrypt VIA Service Connector Items
        rgs_requestingApp = rgs_decryptServiceConnector(rgs_requestingApp, 4);
        rgs_consumingAppToken = rgs_decryptServiceConnector(rgs_consumingAppToken, 6);
        rgs_consumingAppPassword = rgs_decryptServiceConnector(rgs_consumingAppPassword, 8);

        //Get the selected user value
        var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
        //Check if a record already exists for the selected CRM user
        var rgs_crossReferenceId = null;
        var rgs_crossReferenceDuz = null;
        var rgs_crossReferenceName = null;
        var rgs_conditionalFilter = "ftp_crmuser/Id eq (guid'" + rgs_userSelectedValue[0].id + "')";
        var rgs_crossReferenceData = rgs_getMultipleEntityDataSync('ftp_useridSet', 'ftp_useridId, ftp_vistaduz, ftp_vistausername', rgs_conditionalFilter, 'ftp_name', 'asc', 0);
        if (rgs_crossReferenceData != null) {
            for (var i = 0; i <= rgs_crossReferenceData.d.results.length - 1; i++) {
                //Get Info
                if (rgs_crossReferenceData.d.results[i].ftp_useridId != null) { rgs_crossReferenceId = rgs_crossReferenceData.d.results[i].ftp_useridId; }
                if (rgs_crossReferenceData.d.results[i].ftp_vistaduz != null) { rgs_crossReferenceDuz = rgs_crossReferenceData.d.results[i].ftp_vistaduz; }
                if (rgs_crossReferenceData.d.results[i].ftp_vistausername != null) { rgs_crossReferenceName = rgs_crossReferenceData.d.results[i].ftp_vistausername; }
                break;
            }
        }

        if (rgs_crossReferenceId == null) {
            //Values are null, inform user and perform standard assignement and exit
            Xrm.Page.ui.setFormNotification("The selected user does not have a VIA/CRM Cross Reference record. A surrogate check was not performed!", "INFO", "SURR1001");
            Xrm.Page.getAttribute("ownerid").setValue([{
                id: rgs_userSelectedValue[0].id,
                name: rgs_userSelectedValue[0].name,
                entityType: "systemuser"
            }]);
            Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
            //Set Assigned to Surrogate to No
            Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(0);
            Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
            rgs_ownerChange();
            return false;
        }

        //Check if VIA Login cookie exist (not expired)
        var rgs_ViaLoginCookie = rgs_getCookie("viasessionlink");
		
		var rgs_ViaLoginData = null;
		
		if (rgs_ViaLoginCookie != "")
			rgs_ViaLoginData = JSON.parse(rgs_ViaLoginCookie);

        if (rgs_ViaLoginCookie == "") {
            alert("Your VISTA session has expired. In order to check for surrogates, you must be logged into VISTA!");
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
            Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
            //Exit process, clear notification message
            Xrm.Page.ui.clearFormNotification("SURR1001");
            Xrm.Page.getAttribute("ftp_userselected").setValue(null);
            Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
            return false;
        }

        //Prep user data
        
        //var rgs_UserSiteNo = "";
        var rgs_duz = "";
        var rgs_providername = "";
        //var rgs_userData = rgs_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', Xrm.Page.context.getUserId());
        //if (rgs_userData != null) {
        //    if (rgs_userData.d.ftp_FacilitySiteId != null) {
        //        rgs_userSiteId = rgs_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}
        //Lookup the Facility/Site #
        //if (rgs_userSiteId != null && rgs_userSiteId != '') {
        //    var rgs_facilityData = rgs_getSingleEntityDataSync('ftp_facilitySet', 'ftp_FacilityCode_text', rgs_userSiteId);
        //    if (rgs_facilityData != null) {
        //        if (rgs_facilityData.d.ftp_FacilityCode_text != null) { rgs_UserSiteNo = rgs_facilityData.d.ftp_FacilityCode_text; }
        //    }
        //}
		
		//if (rgs_UserSiteNo == ""){
		var siteData = setUserSite();
		//}

        //Get VIA Login Cookie data
        //var rgs_ViaLoginCookie = rgs_getCookie("viasessionlink");
		if (rgs_ViaLoginCookie != null && rgs_ViaLoginCookie != ''){
			if (rgs_ViaLoginData.length > 1){
				if (siteData != null){
					for(var j = 0; j < rgs_ViaLoginData.length; j++){
						if(rgs_ViaLoginData[j].siteCode == siteData.SiteNo){
							rgs_duz = rgs_ViaLoginData[j].duz;
							rgs_providername = rgs_ViaLoginData[j].providerName;	
							break;
						}
					}
				}else{
					rgs_duz = rgs_ViaLoginData[0].duz;
					rgs_providername = rgs_ViaLoginData[0].providerName;					
				}
			}else if(rgs_ViaLoginData.length == 1){
				rgs_duz = rgs_ViaLoginData[0].duz;
				rgs_providername = rgs_ViaLoginData[0].providerName;			
			}
		}
		
        //if (rgs_ViaLoginCookie != null && rgs_ViaLoginCookie != '') {
        //    var rgs_cookiearray = rgs_ViaLoginCookie.split("~~~~", 2);
        //    rgs_duz = rgs_cookiearray[0];
        //    rgs_providername = rgs_cookiearray[1];
        //}

        if (rgs_crossReferenceDuz == null && rgs_crossReferenceName != null && rgs_crossReferenceName != '') {
            //No IEN, but have name, attempt cprs User Lookup
            //Extract Last Name from VISTA Name
            var rgs_cprsSearchName = null;
            //Split on comma
			//GLM - not splitting name - search integration didn't like it - wanted lastname, firstname
            //rgs_cprsSearchName = rgs_crossReferenceName.split(",", 1);
            //Split on space
            //rgs_cprsSearchName = rgs_cprsSearchName[0].split(" ", 1);
			rgs_cprsSearchName = rgs_crossReferenceName;

            //Prep external object for via service use
            var rgs_viaDataObject = new Object();
            rgs_viaDataObject.ProviderName = rgs_providername;
            rgs_viaDataObject.Duz = rgs_duz;
            rgs_viaDataObject.LoginSiteCode = rgs_UserSiteNo;
            rgs_viaDataObject.CrossRefName = rgs_crossReferenceName;
            
            //Execute cprsUserLookup Service
            vialib_cprsUserLookup(rgs_requestingApp, rgs_consumingAppToken, rgs_consumingAppPassword, rgs_baseServiceEndpointUrl, rgs_providername, rgs_duz, rgs_UserSiteNo, rgs_cprsSearchName, rgs_cprsUserLookup_response, rgs_viaDataObject);

        }
        if (rgs_crossReferenceDuz != null) {
            //Perform Surrogate Check
            rgs_executeVistaGetSurrogate(rgs_providername, rgs_duz, rgs_UserSiteNo, rgs_crossReferenceDuz)
        }
        //Fallback if no match, should not happen
        if (rgs_crossReferenceDuz == null && (rgs_crossReferenceName == null || rgs_crossReferenceName == '')) {
            //Values are null, inform user and perform standard assignement and exit
            var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
            Xrm.Page.ui.setFormNotification("The selected user has an incomplete VIA/CRM Cross Reference record. A surrogate check was not performed!", "INFO", "SURR1001");
            Xrm.Page.getAttribute("ownerid").setValue([{
                id: rgs_userSelectedValue[0].id,
                name: rgs_userSelectedValue[0].name,
                entityType: "systemuser"
            }]);
            Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
            //Set Assigned to Surrogate to No
            Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(0);
            Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
            rgs_ownerChange();
            return false;
        }
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_viaSurrogateSetting_response): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SURR1001");
    }
}

function setUserSite(){
	var retVal = null;
	var progressNoteFacility = parent.Xrm.Page.data.entity.attributes.get("ftp_progressnotefacility");
	
	if (progressNoteFacility != null){
		var progressNoteFacilityLookup = progressNoteFacility.getValue();
		if (progressNoteFacilityLookup != null){
			if (progressNoteFacilityLookup.length != null){
				if (progressNoteFacilityLookup.length > 0){
					var facilityId = progressNoteFacilityLookup[0].id;
					if (facilityId[0] ==  '{')
						facilityId = facilityId.substring(1, facilityId.length - 1);
					$.ajax({
						type: "GET",
						contentType: "application/json; charset=utf-8",
						datatype: "json",
						url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilities("+facilityId+")?$select=_ftp_facility_id_value,ftp_facilitycode_text",
						beforeSend: function(XMLHttpRequest) {
							XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
							XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
							XMLHttpRequest.setRequestHeader("Accept", "application/json");
							XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
						},
						async: false,
						success: function(data, textStatus, xhr) {
							var result = data;
							var ftp_facility_id = result["ftp_facilityid"];
							var ftp_facilitycode_text = result["ftp_facilitycode_text"];
							rgs_userSiteId = ftp_facility_id;
							rgs_UserSiteNo = ftp_facilitycode_text;
							retVal = {SiteId: rgs_userSiteId, SiteNo: rgs_UserSiteNo};
						},
						error: function(xhr, textStatus, errorThrown) {
							Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
						}
					});						
				}
			}		
		}
	}
	
	return retVal;
}


function rgs_executeVistaGetSurrogate(rgs_providername, rgs_duz, rgs_UserSiteNo, rgs_crossReferenceDuz) {
    try {
        //Perform the Surrogate Lookup
        var rgs_viaSurrogate = new Object();
        rgs_viaSurrogate.ProviderName = rgs_providername;
        rgs_viaSurrogate.Duz = rgs_duz;
        rgs_viaSurrogate.LoginSiteCode = rgs_UserSiteNo;
        rgs_viaSurrogate.Target = rgs_crossReferenceDuz;

        $.ajax({
            type: "POST",
            url: rgs_GetSurrogateUrl,
            data: JSON.stringify(rgs_viaSurrogate),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var rgs_newdata = data.Data;
                var rgs_requestResponse = rgs_newdata;
                rgs_executeVistaGetSurrogate_response(null, rgs_requestResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                rgs_executeVistaGetSurrogate_response(errorThrown, null);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_executeVistaGetSurrogate): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SURR1001");
    }
}

function rgs_cprsUserLookup_response(rgs_error, rgs_userlookupResponse, rgs_externalObject) {
	//debugger;
    try {
        //Check for non VIA Service Error
        if (rgs_error != null) {
            alert("The VIA cprsUserLookup service failed with error: " + rgs_userlookupResponse);
            //Exit process, clear notification message
            Xrm.Page.ui.clearFormNotification("SURR1001");
            Xrm.Page.getAttribute("ftp_userselected").setValue(null);
            Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
            return false;
        }
        //Test for VIA Service Error
        if (rgs_userlookupResponse.userArray.fault != null) {
            alert("The VIA cprsUserLookup service failed with error: " + rgs_userlookupResponse.userArray.fault.message);
            //Exit process, clear notification message
            Xrm.Page.ui.clearFormNotification("SURR1001");
            Xrm.Page.getAttribute("ftp_userselected").setValue(null);
            Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');
            return false;
        }

        var rgs_cprsUserIEN = null;
        var rgs_cprsMatchCount = 0;

        //Get VIA service Response
        if (rgs_userlookupResponse.userArray.users > 0) {
            var rgs_userlookupArray = rgs_userlookupResponse.userArray.users;

            //Analyze result
            for (var i = 0; i <= rgs_userlookupArray.length - 1; i++) {             
                //Compare VIA Full Name to the VIA Full Name in CRM and if a match, add to list...
                var rgs_cprsUserName = rgs_userlookupArray[i].name;
                var rgs_cprsUserNameUpper = rgs_cprsUserName.toUpperCase();
                var rgs_crossRefName = rgs_externalObject.CrossRefName;
                var rgs_crossRefNameUpper = rgs_crossRefName.toUpperCase();

                if (rgs_cprsUserNameUpper == rgs_crossRefNameUpper) {
                    //User Names Match
                    rgs_cprsMatchCount = rgs_cprsMatchCount + 1;
                    rgs_cprsUserIEN = rgs_userlookupArray[i].DUZ;
                }
            }
        }

        //
        if (rgs_cprsMatchCount == 1 && rgs_cprsUserIEN != null) {
            //Perform Surrogate Check
            rgs_executeVistaGetSurrogate(rgs_externalObject.ProviderName, rgs_externalObject.Duz, rgs_externalObject.LoginSiteCode, rgs_cprsUserIEN)
        }
        else {
            //Values are null, inform user and perform standard assignement and exit
            var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
            Xrm.Page.ui.setFormNotification("The selected user was not located in VIA/CPRS or more than one exist with the same name. A surrogate check was not performed!", "INFO", "SURR1001");
            Xrm.Page.getAttribute("ownerid").setValue([{
                id: rgs_userSelectedValue[0].id,
                name: rgs_userSelectedValue[0].name,
                entityType: "systemuser"
            }]);
            Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
            //Set Assigned to Surrogate to No
            Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(0);
            Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
            rgs_ownerChange();
            return false;
        }
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_cprsUserLookup_response): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SURR1001");
    }
}

function rgs_executeVistaGetSurrogate_response(rgs_errorThrown, rgs_requestResponse) {
    try {
        //Process Get Surrogate Request Response
        if (rgs_errorThrown != null) {
            //Handle Error
            alert("The VIA GetSurrogate Service Failed with error: " + rgs_errorThrown);
            Xrm.Page.ui.clearFormNotification("SURR1001");
            return false;
        }
        else {
            if (rgs_requestResponse.length > 0) {
                //Surrogate Returned, process data
                var rgs_surrogateId = rgs_requestResponse[0].Id;
                var rgs_surrogateName = rgs_requestResponse[0].Name;
                var rgs_surrogateStartDate = rgs_requestResponse[0].StartDate;
                var rgs_surrogateEndDate = rgs_requestResponse[0].EndDate;

                //Populate Surrogate Assignee Field
                Xrm.Page.getAttribute("ftp_surrogateassignee").setValue(rgs_surrogateName);
                Xrm.Page.getAttribute("ftp_surrogateassignee").setSubmitMode('always');
                //Set Assigned to Surrogate to Yes
                Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(1);
                Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
                //Display surrogate assigned to user
                Xrm.Page.ui.setFormNotification("A surrogate user '" + rgs_surrogateName + "' was applied!", "INFO", "SURR1001");
                //Update the owner field...
                var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
                Xrm.Page.getAttribute("ownerid").setValue([{
                    id: rgs_userSelectedValue[0].id,
                    name: rgs_userSelectedValue[0].name,
                    entityType: "systemuser"
                }]);
                Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
                rgs_ownerChange();
                return false;


                //***The Section below is the prior method of assigning surrogates
                //***Code is commented out, but may be used again later..
                /*
                //Determine if CRM Cross Reference has a record for this IEN/Id
                var rgs_crossReferenceId = null;
                var rgs_crossReferenceCrmUser = null;
                var rgs_conditionalFilter = "ftp_vistaduz eq '" + rgs_surrogateId + "'";
                var rgs_crossReferenceData = rgs_getMultipleEntityDataSync('ftp_useridSet', 'ftp_useridId, ftp_crmuser', rgs_conditionalFilter, 'ftp_name', 'asc', 0);
                if (rgs_crossReferenceData != null) {
                    for (var i = 0; i <= rgs_crossReferenceData.d.results.length - 1; i++) {
                        //Get Info
                        if (rgs_crossReferenceData.d.results[i].ftp_useridId != null) { rgs_crossReferenceId = rgs_crossReferenceData.d.results[i].ftp_useridId; }
                        if (rgs_crossReferenceData.d.results[i].ftp_crmuser != null) { rgs_crossReferenceCrmUser = rgs_crossReferenceData.d.results[i].ftp_crmuser; }
                        break;
                    }
                }

                if (rgs_crossReferenceCrmUser != null) {
                    //Cross Reference for Surrogate Exists
                    Xrm.Page.ui.setFormNotification("A surrogate user '" + rgs_surrogateName + "' was assigned!", "INFO", "SURR1001");
                    //Set the selected user as the Original Assignee
                    var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
                    Xrm.Page.getAttribute("tri_originalassignee").setValue([{
                        id: rgs_userSelectedValue[0].id,
                        name: rgs_userSelectedValue[0].name,
                        entityType: "systemuser"
                    }]);
                    Xrm.Page.getAttribute("tri_originalassignee").setSubmitMode('always');

                    //Set the owner to the Surrogate user
                    Xrm.Page.getAttribute("ownerid").setValue([{
                        id: rgs_crossReferenceCrmUser.Id,
                        name: rgs_crossReferenceCrmUser.Name,
                        entityType: "systemuser"
                    }]);
                    Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
                    //Set Assigned to Surrogate to Yes
                    Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(1);
                    Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');

                    rgs_ownerChange();

                    //Set the selected user to the surrogate user
                    Xrm.Page.getAttribute("ftp_userselected").setValue([{
                        id: rgs_crossReferenceCrmUser.Id,
                        name: rgs_crossReferenceCrmUser.Name,
                        entityType: "systemuser"
                    }]);
                    Xrm.Page.getAttribute("ftp_userselected").setSubmitMode('always');

                    return false;
                }
                else {
                    //No matching surrogate User In CRM
                    Xrm.Page.ui.setFormNotification("The surrogate user '" + rgs_surrogateName + "' does not have a VIA/CRM Cross Reference record. The selected user was used instead!", "INFO", "SURR1001");
                    var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
                    Xrm.Page.getAttribute("ownerid").setValue([{
                        id: rgs_userSelectedValue[0].id,
                        name: rgs_userSelectedValue[0].name,
                        entityType: "systemuser"
                    }]);
                    Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
                    //Set Assigned to Surrogate to No
                    Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(0);
                    Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
                    rgs_ownerChange();
                    return false;
                }
                */
                //***End of commented out section for reuse later

            }
            else {
                //No Surrogate Returned, complete assign with current selection
                var rgs_userSelectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
                Xrm.Page.getAttribute("ownerid").setValue([{
                    id: rgs_userSelectedValue[0].id,
                    name: rgs_userSelectedValue[0].name,
                    entityType: "systemuser"
                }]);
                Xrm.Page.getAttribute("ownerid").setSubmitMode('always');
                //Set Assigned to Surrogate to No
                Xrm.Page.getAttribute("tri_issurrogateassigned").setValue(0);
                Xrm.Page.getAttribute("tri_issurrogateassigned").setSubmitMode('always');
                rgs_ownerChange();
            }
            //Clear progress messages
            Xrm.Page.ui.clearFormNotification("SURR1001");
        }
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_executeVistaGetSurrogate_response): ' + err.message);
        Xrm.Page.ui.clearFormNotification("SURR1001");
    }
}

function rgs_ownerChange() {
    try {
        Xrm.Page.getAttribute("ownerid").fireOnChange();
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_ownerChange): ' + err.message);
    }
}

function rgs_getCookie(cname) {
	    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }
	/*
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    catch (err) {
        alert('Request Surrogate Function Error(rgs_getCookie): ' + err.message);
    }
	*/
}

function rgs_decryptServiceConnector(rgs_connectorArray, rgs_connectorValue) {
    var rgs_decryptedString = "";
    if (rgs_connectorArray != null && rgs_connectorArray != "") {
        var rgs_newArray = rgs_connectorArray.toString().split(',');
        rgs_newArray.reverse();
        for (i = 0; i < rgs_newArray.length; i++) {
            var rgs_curChar = "";
            if (i == 0) {
                rgs_curChar = rgs_newArray[i] - rgs_connectorValue;
            }
            else {
                rgs_curChar = rgs_newArray[i] - (i + rgs_connectorValue);
            }
            rgs_decryptedString = rgs_decryptedString + String.fromCharCode(rgs_curChar);
        }
    }
    return rgs_decryptedString;
}

function rgs_executeCrmOdataGetRequest(rgs_jsonQuery, rgs_aSync, rgs_aSyncCallback, rgs_skipCount, rgs_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*rgs_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*rgs_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*rgs_aSyncCallback* - specify the name of the return function to call upon completion (required if rgs_aSync = true.  Otherwise '')
    //*rgs_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*rgs_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var rgs_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: rgs_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                rgs_entityData = data;
                if (rgs_aSync == true) {
                    rgs_aSyncCallback(rgs_entityData, rgs_skipCount, rgs_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in rgs_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + rgs_jsonQuery);
            },
            async: rgs_aSync,
            cache: false
        });
        return rgs_entityData;
    }
    catch (err) {
        alert('An error occured in the rgs_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function rgs_getMultipleEntityDataAsync(rgs_entitySetName, rgs_attributeSet, rgs_conditionalFilter, rgs_sortAttribute, rgs_sortDirection, rgs_skipCount, rgs_aSyncCallback, rgs_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*rgs_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rgs_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rgs_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*rgs_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*rgs_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*rgs_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*rgs_aSyncCallback* - is the name of the function to call when returning the result
    //*rgs_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var rgs_jsonQuery = rgs_serverUrl + rgs_crmOdataEndPoint + '/' + rgs_entitySetName + '?$select=' + rgs_attributeSet + '&$filter=' + rgs_conditionalFilter + '&$orderby=' + rgs_sortAttribute + ' ' + rgs_sortDirection + '&$skip=' + rgs_skipCount;
        rgs_executeCrmOdataGetRequest(rgs_jsonQuery, true, rgs_aSyncCallback, rgs_skipCount, rgs_optionArray);
    }
    catch (err) {
        alert('An error occured in the rgs_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function rgs_getMultipleEntityDataSync(rgs_entitySetName, rgs_attributeSet, rgs_conditionalFilter, rgs_sortAttribute, rgs_sortDirection, rgs_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*rgs_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rgs_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rgs_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*rgs_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*rgs_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*rgs_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var rgs_jsonQuery = rgs_serverUrl + rgs_crmOdataEndPoint + '/' + rgs_entitySetName + '?$select=' + rgs_attributeSet + '&$filter=' + rgs_conditionalFilter + '&$orderby=' + rgs_sortAttribute + ' ' + rgs_sortDirection + '&$skip=' + rgs_skipCount;
        var rgs_entityData = rgs_executeCrmOdataGetRequest(rgs_jsonQuery, false, '', rgs_skipCount, null);
        return rgs_entityData;
    }
    catch (err) {
        alert('An error occured in the rgs_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function rgs_getSingleEntityDataSync(rgs_entitySetName, rgs_attributeSet, rgs_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*rgs_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*rgs_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*rgs_entityId* - is the Guid for the entity record

    try {
        var rgs_entityIdNoBracket = rgs_entityId.replace(/({|})/g, '');
        var rgs_selectString = '(guid' + "'" + rgs_entityIdNoBracket + "'" + ')?$select=' + rgs_attributeSet;
        var rgs_jsonQuery = rgs_serverUrl + rgs_crmOdataEndPoint + '/' + rgs_entitySetName + rgs_selectString;
        var rgs_entityData = rgs_executeCrmOdataGetRequest(rgs_jsonQuery, false, '', 0, null);
        return rgs_entityData;
    }
    catch (err) {
        alert('An error occured in the rgs_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}