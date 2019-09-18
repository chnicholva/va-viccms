var configData = null,
	context = null,
	retrievedSettings = null;
var esrResponseXML = null,
	hdrResponseXml = null;
var isDeceased = false,
	isSensitive = false,
	isProd = false;
var deathDate = null,
	dataSource = null; /*not used*/
var goodToGoText = "";
var dacURL = null,
	vistaURL = null,
	flagsAPIURL = null,
	sensitivePatientAPIURL = null;

$(document).ready(function () {
	context = getContext();
	configData = null;
	esrResponseXML = null;
	isDeceased = false;
	isSensitive = false;
	deathDate = null;
	goodToGoText = "";
	//put onLoad logic here
	configData = parseDataParametersFromUrl(location.search);
	
	if(!configData){
		showErrorMessage("Could not parse config data from URL", "No debugging information available", "Configuration error");
		return;
	}
	
	dataSource = configData.hasOwnProperty("dataSource") ? configData.dataSource : null;
	
	if(!(configData.hasOwnProperty("nationalid")) || (configData.hasOwnProperty("nationalid") && configData.nationalid == null)){
		if(configData.hasOwnProperty("ICN") && configData.ICN != null){
			configData.nationalid = configData.ICN.substring(0,10);
		}
	}
	
	if(configData.hasOwnProperty("queriedESR") && configData.queriedESR.toLowerCase() == "true" && configData.hasOwnProperty("isDeceased") && configData.hasOwnProperty("isSensitive")){
		isDeceased = configData.isDeceased.toLowerCase() == "true";
		deathDate = configData.hasOwnProperty("deathDate") ? configData.deathDate : null;
		isSensitive = configData.isSensitive.toLowerCase() == "true";
		
		//proceed into logic flow: show deceasedMessage (or not) first, then show sensitivity message (or not) second
		checkDeceased();
	}
	else{//have to query ESR
		queryESR();
	}
});

function queryESR(){
	if (configData.hasOwnProperty("ICN") && configData.ICN != "null" && configData.ICN != "undefined" && configData.ICN != "NEWVETERAN") {
			//retrieve Active Settings record to get URLs, THEN query ESR
			var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
			SDK.REST.retrieveMultipleRecords(
				"mcs_setting",
				queryString,
				function (retrievedRecords) {
					if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
				},
				errorHandler,
				function () {
					if (!!retrievedSettings) {
						if (!(retrievedSettings.hasOwnProperty("ftp_DACURL")) || !retrievedSettings.ftp_DACURL) {
							showErrorMessage("Could not find DAC URL","", "Settings retrieval error");
							return;
						}
						
						writeToConsole("got Active Settings record.");
						
						dacURL = retrievedSettings.ftp_DACURL;
						vistaURL = (retrievedSettings.hasOwnProperty("ftp_VistaUsersAPIURL") && !!retrievedSettings.ftp_VistaUsersAPIURL) ? retrievedSettings.ftp_VistaUsersAPIURL : null;
						isProd = (retrievedSettings.hasOwnProperty("ftp_IsProductionEnvironment") && retrievedSettings.ftp_IsProductionEnvironment == true);
						flagsAPIURL = (retrievedSettings.hasOwnProperty("ftp_FlagsAPIURL") && !!retrievedSettings.ftp_FlagsAPIURL) ? retrievedSettings.ftp_FlagsAPIURL : null;
						sensitivePatientAPIURL = (retrievedSettings.hasOwnProperty("ftp_SensitivePatientAPIURL") && !!retrievedSettings.ftp_SensitivePatientAPIURL) ? retrievedSettings.ftp_SensitivePatientAPIURL : null;
						
						//ESR
						if (retrievedSettings.hasOwnProperty("ftp_ESRAPIURL") && !!retrievedSettings.ftp_ESRAPIURL) {
							var baseESRUrl = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_ESRAPIURL;						
							var fullURL = baseESRUrl + "000000" + configData.ICN + "000000";
							
							//query ESR using jquery
							jQuery.support.cors = true;
							$.ajax({
								type: "GET",
								//contentType: "application/json; charset=utf-8",
								//datatype: "json",
								url: fullURL,
								beforeSend: function (XMLHttpRequest) {
									//Specifying this header ensures that the results will be returned as JSON.
									//XMLHttpRequest.setRequestHeader("Accept", "application/json");
								},
								success: function (response, textStatus, XmlHttpRequest) {
									writeToConsole("inside ajax success");
									esrResponseXML = response.xml;
									
									//determine if veteran is alive
									var deathInfoNode = $(esrResponseXML).find("deathRecond"); //the deathRecond node contains data such as deathDate, dataSource, facilityReceived, deathLastModified, deathReportDate
									isDeceased = deathInfoNode.length > 0;
									writeToConsole("isDeceased: " + isDeceased);
									
									//determine if veteran is sensitive
									var sensitivityFlag = ($(esrResponseXML).find("sensityFlag").length > 0) ? $(esrResponseXML).find("sensityFlag")[0].innerText : null;
									isSensitive = !sensitivityFlag || (!!sensitivityFlag && sensitivityFlag.toLowerCase() != "false");
									writeToConsole("veteran sensitivity: " + isSensitive);
									
									//proceed into logic flow: show deceasedMessage (or not) first, then show sensitivity message (or not) second
									checkDeceased();

								},
								error: function (XMLHttpRequest, textStatus, errorThrown) {
									showErrorMessage("Error querying ESR: " + errorThrown + ".", XMLHttpRequest.responseText, "Error querying ESR for veteran data");
									//setTimeout(queryESR, 2000);
								},
								async: false,
								cache: false
							});
							
							
						}
						else {
							showErrorMessage("Could not find ESR API URL.", "", "Configuration Error");
							return;
						}

						//PCMM aka Patient Summary
						//the pcmm query happens AFTER our other ESR query (which gets the vet's preferred facility code), in the GetFacilityFromService.OnSuccess function, in the PopulatePreferredFacility library
					} //end if !!retrievedSettings
					else {
						showErrorMessage("Could not find Active Settings for this org; contact your system administrator.","", "Settings retrieval error");
						return;
					}				
				} //end active settings retrieval complete callback
			);//end active settings query
		}
		else{
			showErrorMessage("Could not query ESR", "No ICN provided", "Configuration error");
			return;
		}
}

function parseDataParametersFromUrl(pQueryString) {
	//example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
	var fullParameterArray = pQueryString.substr(1).split("&");

	//clean up the URL query string and split each member into a key/value pair
	for (var i in fullParameterArray) {
		fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
	}

	var customDataString = "";
	for (var i in fullParameterArray) {
		if (fullParameterArray[i][0].toLowerCase() == "data") {
			customDataString = fullParameterArray[i][1];
			break;
		}
	}

	var customDataArray = decodeURIComponent(customDataString).split("&");
	for (var i in customDataArray) {
		customDataArray[i] = customDataArray[i].replace(/\+/g, " ").split("=");
	}

	var configObject = {};
	for (var i in customDataArray) {
		configObject[customDataArray[i][0]] = customDataArray[i][1];
	}

	//optionally, put code here to show body once we have the config object, if it's taking too long
	return configObject;
}

function checkDeceased(){
	writeToConsole("begin checkDeceased()");
	if(isDeceased){
		if (configData.IsUSD == "true") window.open("http://event/?eventname=SetESRTabLabel&ESRTabLabel=Deceased Veteran Warning");
		
		if(esrResponseXML != null){//get deathDate, or deathReportDate from esrResponseXML
			var deathReportDateString = ($(esrResponseXML).find("deathReportDate").length > 0) ? $(esrResponseXML).find("deathReportDate")[0].innerText : null;
			deathDate = null;
			if(!!deathReportDateString){
				var dateTimeSplit = deathReportDateString.split("T");
				var dateParts = dateTimeSplit[0].split("-");
				var timeZoneOffset = dateTimeSplit[1].split("-")[1]; //e.g. 05:00
				var timeZoneOffsetParts = timeZoneOffset.split(":");
				var timeParts = dateTimeSplit[1].split("-")[0].split(".")[0].split(":");
				var utcDeathDate = new Date(Date.UTC(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10)-1, parseInt(dateParts[2], 10), parseInt(timeParts[0], 10) + parseInt(timeZoneOffsetParts[0], 10), parseInt(timeParts[1], 10) + parseInt(timeZoneOffsetParts[1], 10), parseInt(timeParts[2], 10)));
				deathDate = utcDeathDate;										
			}
		}
		var deathDesc = "This patient died on " + (deathDate != null ? deathDate.toLocaleString("en-US") : "an unknown date" ) + ".";
		$("#deceasedVetDescription").html(deathDesc);
		
		showDiv("#deceasedVetContainer");
	}
	else{
		checkSensitivity();
	}
}

function checkSensitivity(){
	writeToConsole("begin checkSensitivity()");
	if(isSensitive){
		if (configData.IsUSD == "true") window.open("http://event/?eventname=SetESRTabLabel&ESRTabLabel=Sensitive Veteran Warning");
		showDiv("#sensitiveVetContainer");
	}
	else{
		showDiv("#goodToGoDiv");
		
		//fire Saved event to close this control and navigate to Patient Flags.
		fireSavedEvent("sensitiveVetAnswer=yes&nationalid=" + configData.nationalid);		
		
		/* var data = configData.ICN.substring(0,10); //nationalid
		Xrm.Utility.openWebResource("ftp_/Veteran/PatientFlags.html", data);
		writeToConsole("opened PatientFlags.html"); */
	}
}

function btn_sensitiveVetYes_click(pIteration) {
	var iteration = pIteration; //an integer indicating how many times we've been through this function in succession, in case the user did not select a result from multiple retrieved VistA users
	
	//send web service call to HDR for auditing sensitive veteran access, then fire this USD hosted control's "Saved" event
	if(!!vistaURL){
		//get user IEN from VistA
		var fullVistaBaseUrl = dacURL + vistaURL;
		
		var duz = null;
		//get user info from CRM, in order to the query VistA for user's IEN
		SDK.REST.retrieveRecord(
			context.getUserId(),
			"SystemUser",
			"FirstName,LastName,ftp_ftp_facility_systemuser/ftp_facilitycode",
			"ftp_ftp_facility_systemuser",
			function(retrievedUser){
				if(retrievedUser.hasOwnProperty("ftp_ftp_facility_systemuser") && retrievedUser.ftp_ftp_facility_systemuser.hasOwnProperty("ftp_facilitycode") && retrievedUser.hasOwnProperty("FirstName") && retrievedUser.hasOwnProperty("LastName")){
					//***Non-prod Test User Search********
					impersonateLori = false;
					if (isProd == false) {
						//Provide the option to search for Lori Nicholls, site# 613
						var vcmn_impersonatePromptString = "**THIS IS A VISTA USER SEARCH TEST PROMPT** \nTo impersonate Lori Nicholls (613) select OK.\nTo search VistA for yourself, select CANCEL.";
						impersonateLori = confirm(vcmn_impersonatePromptString);
					}
					
					var vistaSearchFN = impersonateLori ? "Lori" : retrievedUser.FirstName;
					var vistaSearchLN = impersonateLori ? "Nicholls" : retrievedUser.LastName;
					var vistaSearchFC = impersonateLori ? "613" : retrievedUser.ftp_ftp_facility_systemuser.facilitycode;
					
					var selectedAUser = false;
					var selectedVistaUser = null;
					
					showLoadingMessage("Fetching IEN from VistA...");
					var retrievedVistaUsers = vcmn_getVistaUsersData(vistaSearchFN, vistaSearchLN, vistaSearchFC, false);
					$("#loadingGifDiv").hide();
					
					if(retrievedVistaUsers.Data.length > 0){
						if (retrievedVistaUsers.Data.length > 1) {
							renderVistAMultipleUsersAsButtons(retrievedVistaUsers);
						}
						else {
							//post to HDR using the first VistA record
							btn_vistaSelect_click($("<div userIEN=\"" + retrievedVistaUsers[0].Ien + "\"></div>"));
						}
						
						

						/* //Check if a user was selected
						if (selectedVistaUser != null) {
							//send HDR soap query
							
							
							//then ALSO log the answer in CRM, then proceed to fire ESR's "Saved" event and continue to Patient Flags check.
							createCRMRecordAccessLog("yes");
						}
						else{
							alert("A user was not selected from the previous prompts.");
							return false;
						} */
					}
					else{
						showErrorMessage("Could not find your corresponding user in VistA.", "Search criteria: \nFirst Name: " + retrievedUser.FirstName + "\nLast Name: " + retrievedUser.LastName + "\nFacility Code: " + retrievedUser.ftp_ftp_facility_systemuser.facilitycode, "VistA search error");
					}
				}
				else{
					showErrorMessage("Your CRM user record is missing some information.", "Make sure it has your first name, last name, and a designated Site. The identified Site should in turn have a value for Facility Code", "Configuration error");
				}
				
			},
			errorHandler
		);
		
		
		//url: vcmn_VistaUsersURLbase + vcmn_userFirstName + "/" + vcmn_userLastName + "/" + vcmn_userSiteNo + "?noFilter=" + vcmn_noFilter,
	}
}
function btn_sensitiveVetNo_click() {
	//send web service call to HDR for auditing sensitive veteran access?
	
	//end session via proper action call path under ESR's "Saved" event
	fireSavedEvent("sensitiveVetAnswer=no");
}

function renderVistAMultipleUsersAsButtons(pVistaUsers){
	if(!!pVistaUsers){		
		for(var u = 0; u < pVistaUsers.Data.length; u++){
			var thisVistaUser = pVistaUsers.Data[u];
			var newButton = $("<button tabindex=\"" + u +"\" class=\"ms-crm-RefreshDialog-Button\" style=\"margin-left: 8px;\" onclick=\"btn_vistaSelect_click(this)\" type=\"button\">SELECT</button>");
			var newLabelHTML = $("<label id=\"vistaUserLabel" + u + "\">" + thisVistaUser.DisplayName +": " + thisVistaUser.Title + "</label><br/>");
			$(newButton).attr("userIEN", thisVistaUser.Ien);
			$("#vistaUsersListFormContainer").append(newButton);
			$("#vistaUsersListFormContainer").append(newLabelHTML);
		}
		showDiv("#vistaUsersListContainer");
	}
}

function btn_vistaSelect_click(pObject){
	writeToConsole("inside btn_vistaSelect_click()");
	var IEN = $(pObject).attr("userIEN");
	createHDRLogEntry(IEN, configData.DFN, configData.facilityCode);
}

function createHDRLogEntry(pIEN, pDFN, pFacilityCode){
	writeToConsole("inside createHDRLogEntry(pIEN: " + pIEN + ", pDFN: " + pDFN + ", pFacilityCode: " + pFacilityCode + ")");	
	//fire request to HDR, validate user can access this vet, then fire CRM auditing code, which then finally opens the Patient Flags web resource.
	if(!!sensitivePatientAPIURL){
		if(!!pIEN && !!pDFN && !!pFacilityCode){
			var fullSensitivePatientAPIURL = dacURL + sensitivePatientAPIURL + pIEN + "/USVHA/" + pDFN + "/" + pFacilityCode;
			showLoadingMessage("Checking your access rights in HDR and logging your access to this sensitive veteran...");
			//ping HDR
			hdrResponseXml = null;
			$.ajax({
				type: "GET",
				//contentType: "application/json; charset=utf-8",
				//datatype: "json",
				url: fullSensitivePatientAPIURL,
				beforeSend: function (XMLHttpRequest) {
					//Specifying this header ensures that the results will be returned as JSON.
					//XMLHttpRequest.setRequestHeader("Accept", "application/json");
				},
				success: function (response, textStatus, XmlHttpRequest) {
					writeToConsole("inside HDR query success");
					hdrResponseXml = response.xml;
					writeToConsole("got hdrResponseXml");
					
					var codeNode = $(hdrResponseXml).find("Code");
					if(!!codeNode && codeNode.length > 0){
						var statusCodeValue = codeNode[0].innerText;
						
						switch (statusCodeValue){
							case "0":
								//not a sensitive patient (according to HDR)
								//log user's actions in CRM anyway?
								createCRMRecordAccessLog(true, 100000000);
								break;
							case "1":
								//sensitive patient, user has access, CREATES LOG in HDR
								createCRMRecordAccessLog(true, 100000001);
								break;
							case "2":
								//sensitive patient, user does not have access, tell them so
								handleInsufficientRights("You do not have permission to view this veteran's personal and health information.", 100000002);
								//end USD session
								break;
							case "3":
								//user is accessing their own record (not allowed, probably), tell them so
								//log user's action in CRM?
								handleInsufficientRights("You are attempting to access your own record(s), which is not allowed.", 100000003);
								//end USD session
								break;
							case "4":
								//user does not have SSN defined?
								//not sure what this means
								handleInsufficientRights("User does not have SSN defined", 100000004);
							default:
								$("#insufficientRightsHeader").html("Unknown status code from HDR");
								handleInsufficientRights("Unknown status code: ", 100000006);
								break;
						}
					}
					else{
						$("#insufficientRightsHeader").html("Missing status code from HDR");
						handleInsufficientRights("HDR did not return a status code for you sensitive veteran access request.", 100000005);
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					showErrorMessage("Error logging your Sensitive Veteran access with HDR: " + errorThrown + ".", XMLHttpRequest.responseText, "Sensitive Veteran Audit Error");
				},
				async: false,
				cache: false
			});
		}
		else{
			showErrorMessage("Could not query HDR for verification that you have rights to view this sensitive veteran.", "Missing HDR query parameters.", "Sensitive Veteran Audit Error");
		}
	}
	else{
		showErrorMessage("Could not find Sensitive Patient API URL.", "", "Configuration Error");
	}
}

function handleInsufficientRights(pDescription, pHDRCode){
	$("#insufficientRightsDescription").html(pDescription);
	$("#btn_insufficentRightsEndSession_click").prop("statusCode", pHDRCode);
	showDiv("#insufficientRightsContainer");
}

function btn_insufficentRightsEndSession_click(pButton){
	//log user's action in CRM, noting that they do not have access
	createCRMRecordAccessLog(false, $(pButton).prop("statusCode"));
}
function btn_insufficentRightsEscalate_click(){
	return;
	//not yet implemented
}





function btn_deceasedVetYes_click() {
	checkSensitivity();
}
function btn_deceasedVetNo_click() {
	//end session via proper action call path under ESR's "Saved" event
	fireSavedEvent("deceasedVetAnswer=no");
}

function btn_errorOK_click(){
	window.open("http://event/?eventname=EndSessionOnBadESRCall");
}

function fireSavedEvent(pParameterString){
	var url = "http://event/?eventname=Saved";
	if(!!pParameterString) url += "&" + pParameterString;
	window.open(url);
}

function vcmn_getVistaUsersData(vcmn_userFirstName, vcmn_userLastName, vcmn_userSiteNo, vcmn_noFilter) {
    try {
        var vcmn_jsonData = null;
        $.ajax({
            type: "GET",
            url: dacURL + vistaURL + vcmn_userFirstName + "/" + vcmn_userLastName + "/" + vcmn_userSiteNo + "?noFilter=" + vcmn_noFilter,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                vcmn_jsonData = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vcmn_jsonData = null;
            },
            async: false,
            cache: false
        });
        return vcmn_jsonData;
    }
    catch (err) {
        alert('Progress Note Ribbon Function Error(vcmn_getVistaUsersData): ' + err.message);
        return null;
    }
}


function createCRMRecordAccessLog(pCanAccess, pHDRStatusCode) {
	writeToConsole("inside createCRMRecordAccessLog()");
	showLoadingMessage("Logging record access in CRM");
	if (!!context && !!configData) {
		if(configData.hasOwnProperty("fullname") && configData.hasOwnProperty("contactid")){
			//create an ftp_recordaccess record and then proceed w/ USD logic
			var simpleName = configData.fullname + " accessed by " + context.getUserName();
			simpleName = simpleName.length > 100 ? simpleName.substring(0, 97) + "..." : simpleName;
			var newRecord = {
				ftp_issensitive: isSensitive, //boolean
				ftp_Accessed: pCanAccess, //boolean
				ftp_veteran: { //lookup to contact
					Id: configData.contactid,
					Name: configData.fullname,
					LogicalName: "contact"
				},
				ftp_accessinguser: { //lookup to systemuser
					Id: context.getUserId(),
					Name: context.getUserName(),
					LogicalName: "systemuser"
				},
				ftp_name: simpleName,
				ftp_HDRResponseStatusCode: {
					Value: pHDRStatusCode
				}
			};

			//create, then call USD event to close this WR or close the session
			SDK.REST.createRecord(
				newRecord,
				"ftp_recordaccess",
				function (createdRecord) {
					showDiv("#goodToGoDiv");
					if(pCanAccess){
						//checkPatientFlags(configData.nationalid);
						var url = "http://event/?eventname=Saved&sensitiveVetAnswer=" + (pCanAccess ? "yes" : "no") + "&nationalid=" + configData.nationalid;
						if(configData.IsUSD == "true") window.open(url);
					}
					else{
						window.open("http://event/?eventname=EndSessionOnBadESRCall");
					}
				},
				function (error) {
					showErrorMessage(error.message, "", "Error creating record access log in CRM.");
					if(pCanAccess){
						//checkPatientFlags(configData.nationalid);
						var url = "http://event/?eventname=Saved&sensitiveVetAnswer=" + (pCanAccess ? "yes" : "no") + "&nationalid=" + configData.nationalid;
						if(configData.IsUSD == "true") window.open(url);
					}
					else{
						window.open("http://event/?eventname=EndSessionOnBadESRCall");
					}
				}
			);
		}
		else{
			showErrorMessage("Not enough information to create Record Access log in CRM.", "Missing 'fullname' and/or 'contactid' URL parameters.", "Configuration error.");
		}
	}
	else{
		showErrorMessage("Missing page context or URL parameters.", "", "Configuration error");
	}
}

function getContext() {
	if (typeof GetGlobalContext != "undefined") {
		return GetGlobalContext();
	} else {
		return null;
	}
}

function showErrorMessage(pErrorMessage, pDebugMessage, pAlternateHeaderTitle) {
	writeToConsole("inside showErrorMessage()");
	if($("#errorContainer").is(":hidden")){
		if(!!pAlternateHeaderTitle) $("#errorHeaderTitle").text(pAlternateHeaderTitle);
		$("#errorHeaderDescription").html("<p>" + pErrorMessage + "<br/><br/>" + pDebugMessage + "</p>");
		showDiv("#errorContainer");
	}
}

function showLoadingMessage(pMessage){
	$("#progressText").html(pMessage);
	showDiv("#loadingGifDiv");
}

function showDiv(pDivToShow){
	var knownDivs = [
		"#loadingGifDiv",
		"#goodToGoDiv",
		"#errorContainer",
		"#sensitiveVetContainer",
		"#deceasedVetContainer",
		"#vistaUsersListContainer",
		"#patientFlagsContainer",
		"#insufficientRightsContainer"
	];
	for(var d = 0; d < knownDivs.length; d++){
		if(knownDivs[d] == pDivToShow) {
			$(knownDivs[d]).show();
		}
		else{
			$(knownDivs[d]).hide();
		}
	}
}

function errorHandler(error) {
	writeToConsole(error.message);
    showErrorMessage("Error", error.message);
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}