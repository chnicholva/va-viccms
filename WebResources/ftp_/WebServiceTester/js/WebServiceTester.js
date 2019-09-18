var mhvPrescriptionTestData = {"ErrorOccurred":false,"ErrorMessage":null,"Status":null,"DebugInfo":null,"Data":{"failedStationList":"","lastUpdatedTime":"Fri, 12 Jan 2018 15:43:01 EST","prescriptionList":[{"dispensedDate":null,"expirationDate":"Sat, 10 Mar 2018 00:00:00 EST","facilityName":"DAYT3","isRefillable":true,"isTrackable":false,"orderedDate":"Thu, 09 Mar 2017 00:00:00 EST","prescriptionId":1827565,"prescriptionName":"METHOCARBAMOL 500MG TAB","prescriptionNumber":2719381,"quantity":1,"refillDate":"Fri, 24 Mar 2017 00:00:00 EDT","refillRemaining":3,"refillStatus":"active","refillSubmitDate":"Fri, 24 Mar 2017 16:03:30 EDT","stationNumber":994},{"dispensedDate":null,"expirationDate":"Sat, 10 Mar 2018 00:00:00 EST","facilityName":"DAYT3","isRefillable":false,"isTrackable":false,"orderedDate":"Thu, 09 Mar 2017 00:00:00 EST","prescriptionId":1827566,"prescriptionName":"AMINOPHYLLINE 100 MG TAB","prescriptionNumber":2719382,"quantity":1,"refillDate":"Fri, 24 Mar 2017 00:00:00 EDT","refillRemaining":3,"refillStatus":"submitted","refillSubmitDate":"Fri, 05 Jan 2018 13:21:21 EST","stationNumber":994}]}};
var configData = null,
	context = null,
	retrievedSettings = null;
var _ICN = null,
	_nationalId = null,
	_EDIPI = null,
	_MHVID = null,
	_MHVSessionToken = null,
	_MHVPrescriptionList = [],
	_MHVSelectedPrescriptionID = null,
	_facilityCodeFromMVI = null,
	_facilityCodeFromMVIDFN = null,
	_facilityCodeFromESR = null,
	_facilityCodeFromESRDFN = null,
	_currentSetting = null,
    _currentSettingIsAPI = false,
    _currentSettingIsSecureAPI = false;
var _stationList = [];
var _userFirstName = null,
	_userLastName = null,
	_userFacilityCode = null,
	_userIENAtFacilityCode = null,
    _freeBuilderMode = false,
    _secureAPIBuilderMode = false,
    _secureWebPartBuilderMode = false;

$(document).ready(function () {
	context = getContext();
	_ICN = null;
	_EDIPI = null;
	_MHVID = null;
	_MHVSessionToken = null;
	_MHVPrecriptionIDList = [];
	_MHVSelectedPrescriptionID = null;
	_nationalId = null;
	_facilityCodeFromMVI = null;
	_facilityCodeFromMVIDFN = null;
	_facilityCodeFromESR = null;
	_facilityCodeFromESRDFN = null;
	_currentSetting = null;
	_currentSettingIsAPI = false;
    _currentSettingIsSecureAPI = false;
	_stationList = [];
	_userFirstName = null;
	_userLastName = null;
	_userFacilityCode = null;
	_userIENAtFacilityCode = null;
	configData = parseDataParametersFromUrl(location.search);
	
	getActiveSettings();
	getUserFromCRM();
	
	$("#displayframe").load(function(){
		/*$("#loadingGifDiv").hide();
		writeToConsole("hide loadingGifDiv");*/
	});
	window.onscroll = function(){$("#loadingGifDiv").css("top", window.pageYOffset);}
	$("#loadingGifDiv").hide();
});
function checkSubmitMVI(event) {
	if (event.keyCode === 13) {
		searchMVI();
	}
}
function searchMVI(){
	var firstName = $("#mviFirstName").val();
	var lastName = $("#mviLastName").val();
	if(!!firstName && !!lastName){
		var ssn = $("#mviSSN").val();
		var dobM = $("#mviDOBMonth").val();
		var dobD = $("#mviDOBDate").val();
		var dobY = $("#mviDOBYear").val();
		var dob = "";
		if(!!dobM && !!dobD && !!dobY){
			dob = dobM + "/" + dobD + "/" + dobY;
		}
		if(!!ssn || !!dob){
			$("#ICN").val("");
			$("#nationalId").val("");
			$("#edipi").val("");
			$("#mhvid").val("");
			$("#mhvtoken").val("");
			$("#selectedMVIFacilityCode").val("");
			$("#selectedMVIFacilityCodeDFN").val("");
			$("#preferredFacilityCodeFromESR").val("");
			$("#preferredFacilityCodeFromESRDFN").val("");
			
			showLoadingMessage("querying MVI for veteran");
			var queryString = "$select=*&$filter=crme_IsAttended eq true and crme_SearchType eq 'SearchByFilter'";
			queryString += " and crme_LastName eq '" + lastName + "'";
			queryString += " and crme_FirstName eq '" + firstName + "'";
			queryString += !!ssn ? " and crme_SSN eq '" + ssn + "'" : "";
			queryString += !!dob ? " and crme_DOBString eq '" + dob + "'" : "";
			var retrievedVeterans = [];
			SDK.REST.retrieveMultipleRecords(
				"crme_person",
				queryString,
				function(retrievedRecords){
					if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedVeterans = retrievedVeterans.concat(retrievedRecords);
				},
				errorHandler,
				function(){
					if(retrievedVeterans.length > 0 && retrievedVeterans[0].crme_ReturnMessage != "Your search in MVI did not find any records matching the search criteria."){
						if (retrievedVeterans[0].crme_ExceptionOccured || (retrievedVeterans[0].crme_ReturnMessage != null && retrievedVeterans[0].crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
							alert("Error searching MVI: \n" + (!!(retrievedVeterans[0].crme_ExceptionMessage) ? retrievedVeterans[0].crme_ExceptionMessage : retrievedVeterans[0].crme_ReturnMessage));
							$("#loadingGifDiv").hide();
							return;
						}
						$("#MVISearchResultsTable").html("<thead><th></th><th>Name</th><th>DOB</th><th>Stations</th></thead>");
						var veteranCountFromMVI = 0;
						for (var i = 0; i < retrievedVeterans.length; i++) {
							veteranCountFromMVI++;
							var thisVet = retrievedVeterans[i];
							var vetName = !!thisVet.crme_FullName ? thisVet.crme_FullName : thisVet.crme_FirstName + " " + thisVet.crme_LastName;
							var buttonId = "btn_" + thisVet.crme_ICN;
							var buttonHTML = "<button id='" +  buttonId + "' onclick='selectVeteran(this);'>Select Vet</button>";
							var rowId = "row_" + thisVet.crme_ICN;
							var stationCellId = "stations_" + thisVet.crme_ICN;
							var entryHTML = "<tr id=' " + rowId + "'><td>" +  buttonHTML + "</td><td>" + vetName + "</td><td>" + thisVet.crme_DOBString + "</td><td id='" + stationCellId + "'/></tr>";
							$("#MVISearchResultsTable").append(entryHTML);
							$("#" + buttonId).attr("patientMviIdentifier", thisVet.crme_PatientMviIdentifier);
						}
						$("#loadingGifDiv").hide();
						if(veteranCountFromMVI == 1){
							$("#btn_" + retrievedVeterans[0].crme_ICN).click();
						}
					}
					else{
						$("#loadingGifDiv").hide();
						//0 results
						alert("0 veterans from MVI.");
					}
				}
			);
		}
	}
}
function selectVeteran(pButton){
	var thisICN = pButton.id.replace("btn_","");
	if(!!thisICN){
		$("#ICN").val(thisICN);
		icn_onChange();
		
		var MVIID = pButton.getAttribute("patientMviIdentifier");
		if(!!MVIID){
			getStations(thisICN, MVIID);
		}
	}
}
function getStations(pICN, pMVIIdentifier){
	showLoadingMessage("querying MVI for stations");
	var stationCellId = "stations_" + pICN;
	$("#" + stationCellId).html("");
	var retrievedStations = [];
	var queryString = "$select=*&$filter=crme_PatientMviIdentifier eq '" + pMVIIdentifier + "' and crme_SearchType eq 'SelectedPersonSearch'";
	queryString += "and crme_ICN eq '" + pICN + "'";
	SDK.REST.retrieveMultipleRecords(
		"crme_person",
		queryString,
		function(retrievedRecords){
			if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedStations = retrievedStations.concat(retrievedRecords);
		},
		errorHandler,
		function () {
			if(retrievedStations.length > 0){
				_stationList = [];
				_stationList = _stationList.concat(retrievedStations);
				//getPreferredFacilityFromESR(pICN);
				getPreferredFacilityFromSecureESR(pICN);
				var stationCount = 0;
				for(var i = 0; i < retrievedStations.length; i++){
					var thisStation = retrievedStations[i];
					if(!!thisStation.crme_SiteId){
						var facilityCode = thisStation.crme_SiteId;
						var identifierAtThisStation = thisStation.crme_PatientId;
						if (facilityCode == "200DOD") {
							//200DOD contains EDIPI value
							$("#edipi").val(identifierAtThisStation);
							edipi_onChange(false);
						}
						if(facilityCode == "200MHI"){
							//200MHI contains MHV ID value
							$("#mhvid").val(identifierAtThisStation);
							mhvid_onChange(false);
						}
						if(containsOnlyNumbers(facilityCode)){
							stationCount++;
							var stationName = thisStation.crme_SiteName.split("&")[0];
							var stationListEntry = ((stationCount > 1 ? ",<br/>" : "") + "<a id='station_" + facilityCode + "' href='#' onclick='selectFacility(this);' title='pick'>" + stationName + "</a>");
							$("#" + stationCellId).append(stationListEntry);
							$("#station_" + facilityCode).attr("DFN", identifierAtThisStation);
						}
					}
				}
				$("#loadingGifDiv").hide();
			}
			else{
				$("#loadingGifDiv").hide();
				alert("0 stations from MVI");
			}
		}
	);
}
function getPreferredFacilityFromESR(pICN) {
    //deprecated in favor of getPreferredFacilityFromSecureESR();
    return;
	$("#preferredFacilityCodeFromESR").val("loading...");
	if(!!retrievedSettings && !!retrievedSettings.ftp_ESRAPIURL){
		var esrJsonUrl = retrievedSettings.ftp_ESRAPIURL.replace("xml", "json");
		var esrURL = retrievedSettings.ftp_DACURL + esrJsonUrl + "000000" + _ICN + "000000";
		//query ESR using jquery
		jQuery.support.cors = true;
		$.ajax({
			type: "GET",
			contentType: "application/json; charset=utf-8",
			datatype: "json",
			url: esrURL,
			beforeSend: function (XMLHttpRequest) {
				//Specifying this header ensures that the results will be returned as JSON.
				//XMLHttpRequest.setRequestHeader("Accept", "application/json");
			},
			success: function (response, textStatus, XmlHttpRequest) {
				writeToConsole("inside ESR query success callback");
				var preferredFacility = getDeepProperty("SOAP-ENV:Envelope.SOAP-ENV:Body.getEESummaryResponse.summary.demographics.preferredFacility", response);
				var facilityCodeFromESR = preferredFacility.split("-")[0].trim();
				$("#preferredFacilityCodeFromESR").val(facilityCodeFromESR);
				preferredFacilityCodeFromESR_onChange();
				
				if(_stationList.length > 0){
					for(var i = 0; i < _stationList.length; i++){
						if(_stationList[i].crme_SiteId == facilityCodeFromESR){
							$("#preferredFacilityCodeFromESRDFN").val(_stationList[i].crme_PatientId);
							preferredFacilityCodeFromESRDFN_onChange();
							break;
						}
					}
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				writeToConsole("Error querying ESR: " + errorThrown + ".", XMLHttpRequest.responseText, "Error querying ESR for veteran data");
				//setTimeout(queryESR, 2000);
				$("#preferredFacilityCodeFromESR").val("error in query");
			},
			async: true,/*changed 6/9/17*/
			cache: false
		});
	}
}
function getPreferredFacilityFromSecureESR(pICN) {
    $("#preferredFacilityCodeFromESR").val("loading...");
    if (!!retrievedSettings && !!retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL) {
        var secureESRURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL;
        var secureESRParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: "000000" + _ICN + "000000" }) }];
        CrmSecurityTokenEncryption(
            secureESRURL,
            secureESRParams,
            context.getClientUrl(),
            function (pError, pResponse) {
                writeToConsole("inside ESR query success callback");
                var preferredFacility = getDeepProperty("Data.Demographics.PreferredFacility", pResponse);
                if (preferredFacility != undefined) {
                    var facilityCodeFromESR = preferredFacility.split("-")[0].trim();
                    $("#preferredFacilityCodeFromESR").val(facilityCodeFromESR);
                    preferredFacilityCodeFromESR_onChange();

                    if (_stationList.length > 0) {
                        for (var i = 0; i < _stationList.length; i++) {
                            if (_stationList[i].crme_SiteId == facilityCodeFromESR) {
                                $("#preferredFacilityCodeFromESRDFN").val(_stationList[i].crme_PatientId);
                                preferredFacilityCodeFromESRDFN_onChange();
                                break;
                            }
                        }
                    }
                }
            }
        );
    }
}
function selectFacility(pElement){
	var facilityCode = pElement.id.replace("station_", "");
	$("#selectedMVIFacilityCode").val(facilityCode);
	selectedMVIFacilityCode_onChange();
	
	var dfn = pElement.getAttribute("DFN");
	$("#selectedMVIFacilityCodeDFN").val(dfn);
	selectedMVIFacilityCodeDFN_onChange();
}
function popStationList(){
	var msg = "Stations and Correlating IDs:\n\n";
	_stationList.forEach(function(s, i){msg += "site: " + s.crme_SiteId + " | patientid: " + s.crme_PatientId + "\n\n";});
	alert(msg);
}
function getMHVToken(){
	$("#btn_getMHVToken").attr("disabled", "disabled")
	$("#mhvtoken").val("");
	$("#mhvtoken").attr("placeholder", "querying API...");
	var dacURL = $("#ftp_DACURL_setting").val();
	var apiURL = $("#ftp_MHVSessionAPIURL_setting").val();
	var mhvID = _MHVID;
	var fullUrl = dacURL + apiURL + "/" + _MHVID + "/json";
	var dType = fullUrl.toLowerCase().indexOf("json") > -1 ? "json" : "text";
	var cType = dType == "json" ? "application/json; charset=utf-8" : "charset=utf-8";
	$.ajax({
		type: "GET",
		contentType: cType,
		datatype: dType,
		url: fullUrl,
		beforeSend: function (XMLHttpRequest) {
			//Specifying this header ensures that the results will be returned as JSON.
			if (dType == "json") XMLHttpRequest.setRequestHeader("Accept", "application/json");
		},
		success: function (pResponse, textStatus, XmlHttpRequest) {
		    if (!!pResponse) {
				$("#mhvtoken").val(getDeepProperty("Data[0].Token", pResponse));
				mhvtoken_onChange(false);
				$("#btn_getMHVToken").removeAttr("disabled");
				$("#mhvtoken").attr("placeholder", "MHV Token goes here");
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$("#mhvtoken").val("error!");
			mhvtoken_onChange(false);
			$("#btn_getMHVToken").removeAttr("disabled");
			$("#mhvtoken").attr("placeholder", "MHV Token goes here");
		},
		async: true,
		cache: false
	});
}

function getActiveSettings(){
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
				$("#retrievedSettingsContainer h2").html("Active Settings, last modified on " + retrievedSettings.ModifiedOn.toLocaleString());
				
				$("#retrievedSettingsTable").html("");
				$("#retrievedSettingsTable").append("<tr><td/><td>Setting</td><td>Configured Value</td>");
				Object.keys(retrievedSettings).sort().forEach(function(prop,i){
					if((prop.indexOf("ftp_") > -1 || prop.indexOf("vre_") > -1 || prop.indexOf("bah_") > -1) && prop.indexOf("mcs_setting_") == -1 && prop.indexOf("_mcs_setting") == -1){
						console.log(prop + " (" + typeof retrievedSettings[prop] + "): " + retrievedSettings[prop]);
						var entryHTML = "<tr>"
						+ "<td><button id='btn_" + prop + "' title='Test' onclick='setupQueryBuilder(this,true)'>Test</button></td>"
						+ "<td>" + prop + " [" + typeof retrievedSettings[prop] + "]</td>"
						+ "<td class='autoWidth'><input class='autoWidth' type='text' id='" + prop + "_setting' value='" + retrievedSettings[prop] + "'></td>"
						+ "</tr>";
						$("#retrievedSettingsTable").append(entryHTML);
					}
				});
			} //end if !!retrievedSettings				
		}
	);
}
function setupImpersonation(){
	//retrieveVistaUsers("Lori", "Nicholls", "613", false);
	$("#userFirstName").val("Lori");
	userFirstName_onChange(false);
	$("#userLastName").val("Nicholls");
	userLastName_onChange(false);
	$("#userFacilityCode").val("613");
	userFacilityCode_onChange(true);
	retrieveVistaUsers();
}
function getUserFromCRM(){
	SDK.REST.retrieveRecord(
		context.getUserId(),
		"SystemUser",
		"FirstName,LastName,ftp_ftp_facility_systemuser/ftp_FacilityCode_text",
		"ftp_ftp_facility_systemuser",
		function(retrievedUser){
		    if (retrievedUser.hasOwnProperty("ftp_ftp_facility_systemuser") && !!retrievedUser.ftp_ftp_facility_systemuser && retrievedUser.ftp_ftp_facility_systemuser.hasOwnProperty("ftp_FacilityCode_text") && retrievedUser.hasOwnProperty("FirstName") && !!retrievedUser.FirstName && retrievedUser.hasOwnProperty("LastName") && !!retrievedUser.LastName) {
				$("#userFirstName").val(retrievedUser.FirstName);
				userFirstName_onChange(false);
				$("#userLastName").val(retrievedUser.LastName);
				userLastName_onChange(false);
				$("#userFacilityCode").val(retrievedUser.ftp_ftp_facility_systemuser.ftp_FacilityCode_text);
				userFacilityCode_onChange(true);
				
		        //retrieveVistaUsers(retrievedUser.FirstName, retrievedUser.LastName, retrievedUser.ftp_ftp_facility_systemuser.ftp_FacilityCode_text, false);
			}
			else{
				//showErrorMessage("Your CRM user record is missing some information.", "Make sure it has your first name, last name, and a designated Site. The identified Site should in turn have a value for Facility Code", "Configuration Error");
			}
		},
		errorHandler
	);
}

function retrieveVistaUsers() {
	$("#vistaUsersListFormContainer").hide();
	var dacURL = $("#ftp_DACURL_setting").val();
	var vistaUrl = $("#ftp_VistaUsersAPIURL_setting").val();
	if(!!dacURL && !!vistaUrl && !!_userFirstName && !!_userLastName && !!_userFacilityCode){
		var fullUrl = dacURL + vistaUrl + _userFirstName + "/" + _userLastName + "/" + _userFacilityCode;
		showLoadingMessage("Looking up your IEN in VistA...");
		var filter = $("#ftp_Filter_setting").val().replace("true", "false");
		try {
			$.ajax({
				type: "GET",
				url: fullUrl,
				
				//https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/VistaUsers/1.0/json/FtPCRM/kyle/knab/991
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (response) {
					if(response.hasOwnProperty("Data") && !!response.Data && response.Data.length > 0){
						var retrievedVistaUsers = response.Data;
						if (retrievedVistaUsers.length > 1) {
							//show selection of VistA users, then post to HDR using IEN of selection
							renderVistAMultipleUsersAsButtons(retrievedVistaUsers);
						}
						else {
							//post to HDR using the first VistA record
							btn_vistaSelect_click($("<div userIEN=\"" + retrievedVistaUsers[0].Ien + "\"></div>"));
						}
					}
					else{
						var debugMessage = "Search criteria: \nFirst Name: " + _userFirstName + "\nLast Name: " + _userLastName + "\nFacility Code: " + _userFacilityCode;
						if(response.hasOwnProperty("DebugInfo")) debugMessage += "<br/>DebugInfo:<br/>" + response.DebugInfo;
						alert("Could not find your corresponding user in VistA. VistA may be down at the moment...." + debugMessage);
						$("#loadingGifDiv").hide()
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					alert("Could not find your corresponding user in VistA... " + errorThrown);
					$("#loadingGifDiv").hide()
				},
				async: true,
				cache: false
			});
		}
		catch (err) {
			alert("Error retrieving VistA user(s): " +  err.message);
			$("#loadingGifDiv").hide()
		}
	}
}
function renderVistAMultipleUsersAsButtons(pVistaUsers){
	$("#vistaUsersListFormContainer").html("<br/><p>VistA returned multiple users; select the correct one that represents YOU.</p>");
	if(!!pVistaUsers){
		for(var u = 0; u < pVistaUsers.length; u++){
			var thisVistaUser = pVistaUsers[u];
			var newButton = $("<button tabindex=\"" + u +"\" class=\"ms-crm-RefreshDialog-Button\" style=\"margin-left: 8px;\" onclick=\"btn_vistaSelect_click(this)\" type=\"button\">SELECT</button>");
			var newLabelHTML = $("<label id=\"vistaUserLabel" + u + "\">" + thisVistaUser.DisplayName +": " + thisVistaUser.Title + "</label><br/>");
			$(newButton).attr("userIEN", thisVistaUser.Ien);
			$("#vistaUsersListFormContainer").append(newButton);
			$("#vistaUsersListFormContainer").append(newLabelHTML);
		}
		$("#vistaUsersListFormContainer").show();
		$("#loadingGifDiv").hide()
	}
}
function btn_vistaSelect_click(pObject){
	//this function is entered by the user selecting a VistA user record, or automatically when VistA only returns 1 user record
	writeToConsole("inside btn_vistaSelect_click()");
	$("#userIEN").val($(pObject).attr("userIEN"));
	userIEN_onChange();
	$("#loadingGifDiv").hide()
}

function setupQueryBuilder(pNewSetting, pFocus) {
    _currentSettingIsAPI = settingValue.toLowerCase().indexOf("api") > -1 || _currentSetting == "ftp_MHVSessionAPIURL";
    _currentSettingIsSecureAPI = _currentSettingIsAPI && (settingValue.toLowerCase().indexOf("2.0/json") > -1 || settingValue.toLowerCase().indexOf("2.0/xml") > -1);
    _currentSettingIsPOSTAPI = _currentSettingIsAPI && ["ftp_MHVActivePrescriptionAPIURL", "ftp_MHVTrackingAPIURL", "ftp_MHVRefillAPIURL", "ftp_MHVRegistrationAPIURL"].indexOf(_currentSetting) > -1;


    //mode switch
    _freeBuilderMode = $("input[name=urlBuilderModeSelection]:checked").val() == "free" ? true : false;
    _secureAPIBuilderMode = $("input[name=urlBuilderModeSelection]:checked").val() == "secureAPI" ? true : false;
    _currentSettingIsSecureAPI = _secureAPIBuilderMode;
    _secureWebPartBuilderMode = $("input[name=urlBuilderModeSelection]:checked").val() == "secureWebPart" ? true : false;

    $("#postDataObjectBuilder").hide();
    $("#postDataObjectBuilder").html(
        "<button id='postDataTableAddRowButton' onclick='postDataTableAddRowButton_onClick()'>Add post data property</button>" +
            "<table id='postDataTable'>" +
                "<thead>" +
                    "<tr>" +
                        "<th>Name</th>" +
                        "<th>Value</th>" +
                    "</tr>" +
                "</thead>" +
                "<tbody>" +
                    "<tr>" +
                        "<td><input type='text' id='postAPIParamInputLabel_Format' class='postAPIParamInputLabel' value='Format' onchange='postAPIParamInputLabel_onChange(this);'/></td>" +
                        "<td><input type='text' id='postAPIParamInput_Format' class='postAPIParamInput' value='json'/></td>" +
                    "</tr>" +
                "</tbody>" +
            "</table>"
    );
    $("#facilitySelectionDiv").hide();
    $("#userFacilityInfo").hide();
    $("#secureAPIIntegrationParametersTableContainer").html("");
    $("#secureAPIIntegrationParametersTableContainer").hide();
    $("#secureAPIIntegrationParametersStringifiedContainer").hide();
    $("#postAPIIntegrationParametersTableContainer").html("");
    $("#postAPIIntegrationParametersTableContainer").hide();
    $("#postAPIIntegrationParametersStringifiedContainer").hide();


    if (_freeBuilderMode) {
        $("#postDataObjectBuilder").html(
           "<button id='postDataTableAddRowButton' onclick='postDataTableAddRowButton_onClick()'>Add post data property</button>" +
                "<table id='postDataTable'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th>Name</th>" +
                            "<th>Value</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                        "<tr>" +
                            "<td><button id='postDataTableDeleteRowButton_Format' class='postDataTableDeleteRowButton' onclick='postDataTableDeleteRowButton_onClick()'>Delete</button>" +
                            "<td><input type='text' id='postAPIParamInputLabel_Format' class='postAPIParamInputLabel' value='Format' onchange='postAPIParamInputLabel_onChange(this);'/></td>" +
                            "<td><input type='text' id='postAPIParamInput_Format' class='postAPIParamInput' value='json'/></td>" +
                        "</tr>" +
                    "</tbody>" +
                "</table>"
        );
        $("#postDataObjectBuilder").show();
    }
    else if (_currentSettingIsSecureAPI) {
        $("#secureAPIIntegrationParametersTableContainer").show();
        $("#secureAPIIntegrationParametersStringifiedContainer").show();

        $("#secureAPIIntegrationParametersTableContainer").html(
            "<button id='postDataTableAddRowButton' onclick='postDataTableAddRowButton_onClick()'>Add post data property</button>" +
                "<table id='postDataTable'>" +
                    "<thead>" +
                        "<tr>" +
                            "<th>Name</th>" +
                            "<th>Value</th>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                        "<tr>" +
                            "<td><button id='postDataTableDeleteRowButton_Format' class='postDataTableDeleteRowButton' onclick='postDataTableDeleteRowButton_onClick()'>Delete</button>" +
                            "<td><input type='text' id='postAPIParamInputLabel_Format' class='postAPIParamInputLabel' value='Format' onchange='postAPIParamInputLabel_onChange(this);'/></td>" +
                            "<td><input type='text' id='postAPIParamInput_Format' class='postAPIParamInput' value='json'/></td>" +
                        "</tr>" +
                    "</tbody>" +
                "</table>"
        );


    }
    else {
        _currentSetting = (!!pNewSetting && pNewSetting.id != "") ? pNewSetting.id.substr(4) : _currentSetting;
        if (!!!_currentSetting) {
            $("#urlToTest").val("select a setting from the list above");
            return;
        }
        $("#queryBuilderCurrentSettingLabel").html(_currentSetting);
        $("#queryBuilderCurrentSettingLabel").show();
        var settingValue = $("#" + _currentSetting + "_setting").val();

        if (_currentSettingIsSecureAPI) {
           
        }
        else {
            $("#secureAPIIntegrationParametersTableContainer").hide();
            $("#secureAPIIntegrationParametersStringifiedContainer").hide();
        }

        if (_currentSettingIsPOSTAPI) {
            $("#postAPIIntegrationParametersTableContainer").show();
            $("#postAPIIntegrationParametersStringifiedContainer").show();
        }
        else {
            $("#postAPIIntegrationParametersTableContainer").hide();
            $("#postAPIIntegrationParametersStringifiedContainer").hide();
        }

        var useMVISelectedFacility = $("input[name=facilitySelection]:checked").val() == "mvi" ? true : false;
        var selectedVeteranFacilityCode = useMVISelectedFacility ? _facilityCodeFromMVI : _facilityCodeFromESR;
        selectedVeteranFacilityCode = !!selectedVeteranFacilityCode ? selectedVeteranFacilityCode : "[[FACILITYCODE]]";
        var selectedVeteranDFN = useMVISelectedFacility ? _facilityCodeFromMVIDFN : _facilityCodeFromESRDFN;
        selectedVeteranDFN = !!selectedVeteranDFN ? selectedVeteranDFN : "[[DFN]]";

        var fullUrl = "";
        var dacURL = $("#ftp_DACURL_setting").val();
        var filter = $("#ftp_Filter_setting").val();

        //reveal service-specific fields
        switch (_currentSetting) {
            case "ftp_ESRAPIURL":
                fullUrl = dacURL + settingValue + "000000" + _ICN + "000000";
                break;
            case "ftp_ESREnrollmentEligibilitySummaryAPIURL":
                fullUrl = dacURL + settingValue;
                $("#secureAPIIntegrationParametersTableContainer").append($(
                    "<table id='secureAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                        "<tr id='secureAPIParam_NationalId'>" +
                            "<td>NationalId</td>" +
                            "<td><input type='text' id='secureAPIParamInput_NationalId' class='secureAPIParamInput' value='" + _ICN + "'/></td>" +
                        "</tr>" +
                    "</table>"
                    )
                );
                break;
            case "ftp_PatientSummaryAPIURL":
                $("#facilitySelectionDiv").show();
                if (!_currentSettingIsSecureAPI) {
                    fullUrl = dacURL + settingValue + selectedVeteranFacilityCode + "/" + _ICN + "?idType=ICN";
                }
                else {
                    fullUrl = dacURL + settingValue;
                    $("#secureAPIIntegrationParametersTableContainer").append($(
                        "<table id='secureAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                            "<tr id='secureAPIParam_stationNumber'>" +
                                "<td>stationNumber</td>" +
                                "<td><input type='text' id='secureAPIParamInput_stationNumber' class='secureAPIParamInput' value='" + selectedVeteranFacilityCode + "'/></td>" +
                            "</tr>" +
                            "<tr id='secureAPIParam_stationDFN'>" +
                                "<td>Veteran DFN at selected station</td>" +
                                "<td><input type='text' id='secureAPIParamInput_dfnNum' class='secureAPIParamInput' value='" + selectedVeteranDFN + "'/></td>" +
                            "</tr>" +
                        "</table>"
                        )
                    );
                }
                break;
            case "ftp_FlagsAPIURL":
                fullUrl = dacURL + settingValue + _nationalId;
                break;
            case "ftp_SensitivePatientAPIURL":
                $("#facilitySelectionDiv").show();
                $("#userFacilityInfo").show();
                $("#btn_getVistaUsers").show();
                $("#vistaUsersListFormContainer").show();
                $("#userIENDiv").show();
                var ien = _userIENAtFacilityCode;
                fullUrl = dacURL + settingValue + ien + "/USVHA/" + dfn + "/" + facilityCode;
                break;
            case "ftp_VistaUsersAPIURL":
                $("#userFacilityInfo").show();
                $("#btn_getVistaUsers").hide();
                $("#vistaUsersListFormContainer").hide();
                $("#userIENDiv").hide();
                fullUrl = dacURL + settingValue + _userFirstName + "/" + _userLastName + "/" + _userFacilityCode;
                break;
            case "ftp_MHVSessionAPIURL":
                fullUrl = dacURL + settingValue + "/" + _MHVID + "/json";
                break;
            case "ftp_MHVActivePrescriptionAPIURL":
                fullUrl = dacURL + settingValue;
                $("#postAPIIntegrationParametersTableContainer").append($(
                    "<table id='postAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                        "<tr id='postAPIParam_MHVSessionToken'>" +
                            "<td>MHV Session Token</td>" +
                            "<td><input type='text' id='postAPIParamInput_token' class='postAPIParamInput' value='" + _MHVSessionToken + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_format'>" +
                            "<td>format</td>" +
                            "<td><input type='text' id='postAPIParamInput_format' class='postAPIParamInput' value='json'/></td>" +
                        "</tr>" +
                    "</table>"
                    )
                );
                break;
            case "ftp_MHVTrackingAPIURL":
                fullUrl = dacURL + settingValue;
                var trackingAPIRadios = "";
                _MHVPrescriptionList.forEach(function (thisPrescription, i) {
                    var prescriptionId = getDeepProperty("prescriptionId", thisPrescription);
                    var prescriptionName = getDeepProperty("prescriptionName", thisPrescription);
                    var elementId = prescriptionId + prescriptionName;
                    trackingAPIRadios += "<input id='" + elementId + "' name='prescriptionSelection' type='radio' value='" + prescriptionId + "' checked onchange='prescriptionSelected(this)'/><label for='" + elementId + "'>" + prescriptionName + "</label><br/>";
                });

                $("#postAPIIntegrationParametersTableContainer").append($(
                    "<table id='postAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                        "<tr id='postAPIParam_MHVSessionToken'>" +
                            "<td>MHV Session Token</td>" +
                            "<td><input type='text' id='postAPIParamInput_token' class='postAPIParamInput' value='" + _MHVSessionToken + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_format'>" +
                            "<td>format</td>" +
                            "<td><input type='text' id='postAPIParamInput_format' class='postAPIParamInput' value='json'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_MHVPrescriptionID'>" +
                            "<td>MHV Prescription ID</td>" +
                            "<td><input type='text' id='postAPIParamInput_rxid' class='postAPIParamInput' value='" + _MHVSelectedPrescriptionID + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_MHVRefillPrescriptionPickerRow'>" +
                            "<td>MHV Prescription ID Picker</td>" +
                            //insert table cell with radio button selection for prescription IDs in _MHVPrecriptionIDList array
                            "<td>" + trackingAPIRadios + "</td>" +
                        "</tr>" +
                    "</table>"
                    )
                );
                break;
            case "ftp_MHVRefillAPIURL":
                fullUrl = dacURL + settingValue;
                var trackingAPIRadios = "";
                _MHVPrescriptionList.forEach(function (thisPrescription, i) {
                    var prescriptionId = getDeepProperty("prescriptionId", thisPrescription);
                    var prescriptionName = getDeepProperty("prescriptionName", thisPrescription);
                    var elementId = prescriptionId + prescriptionName;
                    var tooltip = "<pre>" + JSON.stringify(thisPrescription, undefined, 2) + "</pre>";
                    trackingAPIRadios += "<input id='" + elementId + "' name='prescriptionSelection' type='radio' value='" + prescriptionId + "' checked onchange='prescriptionSelected(this)'/><label for='" + elementId + "' tooltip='" + tooltip + "'>" + prescriptionName + "</label><br/>";
                });
                $("#postAPIIntegrationParametersTableContainer").append($(
                    "<table id='postAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                        "<tr id='postAPIParam_MHVSessionToken'>" +
                            "<td>MHV Session Token</td>" +
                            "<td><input type='text' id='postAPIParamInput_token' class='postAPIParamInput' value='" + _MHVSessionToken + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_format'>" +
                            "<td>format</td>" +
                            "<td><input type='text' id='postAPIParamInput_format' class='postAPIParamInput' value='json'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_MHVPrescriptionID'>" +
                            "<td>MHV Prescription ID</td>" +
                            "<td><input type='text' id='postAPIParamInput_rxid' class='postAPIParamInput' value='" + _MHVSelectedPrescriptionID + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_MHVRefillPrescriptionPickerRow'>" +
                            "<td>MHV Prescription ID Picker</td>" +
                            //insert table cell with radio button selection for prescription IDs in _MHVPrecriptionIDList array
                            "<td>" + trackingAPIRadios + "</td>" +
                        "</tr>" +
                    "</table>"
                    )
                );
                break;
            case "ftp_MHVRegistrationAPIURL":
                fullUrl = dacURL + settingValue;
                $("#postAPIIntegrationParametersTableContainer").append($(
                    "<table id='postAPIIntegrationParametersTable_" + _currentSetting + "'>" +
                        "<tr id='postAPIParam_ICN'>" +
                            "<td>ICN</td>" +
                            "<td><input type='text' id='postAPIParamInput_ICN' class='postAPIParamInput' value='" + _ICN + "'/></td>" +
                        "</tr>" +
                        /*"<tr id='postAPIParam_AddressStreet'>" +
                            "<td>Address Street Address</td>" +
                            "<td><input type='text' id='postAPIParamInput_address1' class='postAPIParamInput' value='" + "[[address street]]" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_AddressCity'>" +
                            "<td>Address Street City</td>" +
                            "<td><input type='text' id='postAPIParamInput_city' class='postAPIParamInput' value='" + "[[address city]]" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_AddressStreet'>" +
                            "<td>Address Street Address</td>" +
                            "<td><input type='text' id='postAPIParamInput_province' class='postAPIParamInput' value='" + "[[address state/province]]" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_AddressPostalCode'>" +
                            "<td>Address Street Postal Code</td>" +
                            "<td><input type='text' id='postAPIParamInput_zip' class='postAPIParamInput' value='" + "[[address postal code]]" + "'/></td>" +
                        "</tr>" +*/
                        "<tr><td>Select at least one checkbox.</td></tr>" +
                        "<tr id='postAPIParam_IsPatient'>" +
                            "<td>Is Patient</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isPatient' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsPatientAdvocate'>" +
                            "<td>Is Patient Advocate</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isPatientAdvocate' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsVeteran'>" +
                            "<td>Is Veteran</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isVeteran' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsChampVABeneficiary'>" +
                            "<td>Is Champ VA Beneficiary</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isChampVABeneficiary' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsServiceMember'>" +
                            "<td>Is Service Member</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isServiceMember' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsEmployee'>" +
                            "<td>Is Employee</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isEmployee' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsHealthcareProvider'>" +
                            "<td>Is Healthcare Provider</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isHealthcareProvider' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_IsOther'>" +
                            "<td>Is Other</td>" +
                            "<td><input type='checkbox' id='postAPIParamInput_isOther' class='postAPIParamInput'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_SignInPartners'>" +
                            "<td>Sign In Partners</td>" +
                            "<td><input type='text' id='postAPIParamInput_signInPartners' class='postAPIParamInput' value='" + "VETS.VA.GOV" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_ContactMethod'>" +
                            "<td>Contact Method</td>" +
                            "<td><input type='text' id='postAPIParamInput_contactMethod' class='postAPIParamInput' value='" + "MobilePhone" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_MobilePhone'>" +
                            "<td>Mobile Phone</td>" +
                            "<td><input type='text' id='postAPIParamInput_mobilePhone' class='postAPIParamInput' value='" + "777-888-9999" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_TermsVersion'>" +
                            "<td>Terms Version</td>" +
                            "<td><input type='text' id='postAPIParamInput_termsVersion' class='postAPIParamInput' value='" + "v3.2" + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_TermsAcceptedDate'>" +
                            "<td>Terms Acepted Date</td>" +
                            "<td><input type='text' id='postAPIParamInput_termsAcceptedDate' class='postAPIParamInput' value='" + new Date().toUTCString() + "'/></td>" +
                        "</tr>" +
                        "<tr id='postAPIParam_Format'>" +
                            "<td>Format</td>" +
                            "<td><input type='text' id='postAPIParamInput_format' class='postAPIParamInput' value='" + "json" + "'/></td>" +
                        "</tr>" +
                    "</table>"
                    )
                );
                break;
            default:
                //Notes, Orders, Appointments, Medications, Postings, Allergies, Labs, Consults, Non-VA Meds, Vitals, Radiology, Discharges
                fullUrl = dacURL + settingValue + _nationalId + filter;
                break;
        }
        //SC Disabilities
        //fullUrl = context.getClientUrl() + "/WebResources/ftp_/ServConnDisabilitiesGrid/ServConnDisabilitiesGrid.html?data=" + icn;

        $("#urlToTest").val(fullUrl);
        if (pFocus) { $("#urlToTest").focus(); }
    }
}

function postDataTableAddRowButton_onClick() {
    try{
        var table = document.getElementById("postDataTable");
        if (!!table) {
            var newRow = table.insertRow(table.rows.length);
            var nameCell = newRow.insertCell(0);
            var valueCell = newRow.insertCell(1);
        }

        $("#postDataTable").append(
            "<tr>" +
                "<td><input type='text' class='postAPIParamInputLabel' value='' onchange='postAPIParamInputLabel_onChange(this);'/></td>" +
                "<td><input type='text' class='postAPIParamInput' value=''/></td>" +
            "</tr>"
        );
    }
    catch (e) {
        alert(e.message);
    }
}

//function freeModePOSTTestButton_onClick() {

//}

function postAPIParamInputLabel_onChange(pElement) {
    $(pElement).attr("id", "postAPIParamInputLabel_" + pElement.value);
    var valueInput = $(pElement).closest("td").next().find("input");
    valueInput.attr("id", "postAPIParamInput_" + pElement.value);
}

function checkSubmitTest(event){
	if (event.keyCode === 13) {
		beginTest();
	}
}
function beginTest(){
	showLoadingMessage("Loading test result...");
	setTestResultContainerHTML();
}
function setTestResultContainerHTML(){
	$("#displayframe").load(function(){return;});
	resetTestResultContainer();
	var fullUrl = $("#urlToTest").val();

	if (_freeBuilderMode) {
	    _currentSettingIsAPI = true;
	    _currentSettingIsSecureAPI = false;
	    _currentSettingIsPOSTAPI = true;
	}
	
	if (_currentSettingIsAPI) {
	    //for APIs, query the API and then format results in an HTML page in the iFrame
	    var dType = fullUrl.toLowerCase().indexOf("json") > -1 ? "json" : "text";
	    var cType = dType == "json" ? "application/json; charset=utf-8" : "charset=utf-8";
	    if (!_currentSettingIsSecureAPI && !_currentSettingIsPOSTAPI) {
	        $.ajax({
	            type: "GET",
	            contentType: cType,
	            datatype: dType,
	            url: fullUrl,
	            beforeSend: function (XMLHttpRequest) {
	                //Specifying this header ensures that the results will be returned as JSON.
	                if (dType == "json") XMLHttpRequest.setRequestHeader("Accept", "application/json");
	            },
	            success: function (pResponse, textStatus, XmlHttpRequest) {
	                showLoadingMessage("Loading test result...");
	                writeToConsole("inside setTestResultContainerHTML() API query success callback");
                    if (!!pResponse) {
                        if (_currentSetting == "ftp_MHVSessionAPIURL") {
                            var newFrameContent = "<pre>" + JSON.stringify(pResponse, undefined, 2) + "</pre>";
                            setIFrame(newFrameContent, true);
                            $("#mhvtoken").val(pResponse);
                            mhvtoken_onChange(false);
                        }
                        else if (dType == "json") {
                            var newFrameContent = "<pre>" + JSON.stringify(pResponse, undefined, 2) + "</pre>";
                            setIFrame(newFrameContent, true);
                        }
                        else {
                            try {
                                var serializedContent = new XMLSerializer().serializeToString(pResponse);
                                var newFrameContent = "<textarea cols='200' rows='200'>" + serializedContent + "</textarea>";
                                setIFrame(newFrameContent, true);
                            }
                            catch (e) {
                                console.log(e);
                                alert("Content might not be XML...\n\n" + e.message);
                                hideLoadingGif();
                            }
                        }
                    }
                    else {
                        var newFrameContent = "<pre>Empty response from API</pre>";
                        setIFrame(newFrameContent, true);
                    }
	            },
	            error: function (XMLHttpRequest, textStatus, errorThrown) {
	                alert("error querying API. use developer console.");
	                var newFrameContent = "<p>error querying API. use developer console.</p><pre>" + JSON.stringify(XMLHttpRequest.responseJSON, undefined, 2) + "</pre>";
	                setIFrame(newFrameContent, true);
	                $("#loadingGifDiv").hide();
	            },
	            async: true,/*changed 6/9/17*/
	            cache: false
	        });
	    }
	    else {
			if(_currentSettingIsSecureAPI){
				fullUrl = fullUrl.toLowerCase().replace("/ftpcrm/", ""); //remove org name from secure API urls
				var integrationParameters = {};
				$(".secureAPIParamInput").each(
					function (i, elem) {
						var paramName = $(this).prop("id").split("_")[1];
						var paramValue = $(this).val();
						integrationParameters[paramName] = paramValue;
					}
				);

				var actionParameters = [{ key: "identifier", type: "c:string", value: JSON.stringify(integrationParameters) }];
				$("#secureAPIIntegrationParametersStringifiedText").html(JSON.stringify(integrationParameters));
				dType = "json";
				CrmSecurityTokenEncryption(
					fullUrl,
					actionParameters,
					context.getClientUrl(),
					function (pError, pResponse) {
						if (!!pError) {
							alert("error querying API. use developer console.");
							console.error("error querying secure API: " + pError);
							var newFrameContent = "<p>error querying API. use developer console.</p><pre>" + JSON.stringify(pError) + "</pre>";
							setIFrame(newFrameContent, true);
							$("#loadingGifDiv").hide();
						}
						else {
							showLoadingMessage("Loading test result...");
							writeToConsole("inside setTestResultContainerHTML() secure API query success callback");

							if (!!pResponse) {
								if (dType == "json") {
									var newFrameContent = "<pre>" + JSON.stringify(pResponse, undefined, 2) + "</pre>";
									setIFrame(newFrameContent, true);
								}
								else {/*xml*/
									try{
										var serializedContent = new XMLSerializer().serializeToString(pResponse);
										var newFrameContent = "<textarea cols='200' rows='200'>" + serializedContent + "</textarea>";
										setIFrame(newFrameContent, true);
									}
									catch(e){
										console.log(e);
										alert("Content might not be XML...\n\n" + e.message);
										hideLoadingGif();
									}
								}
							}
						}
					}
				);
			}
			else if(_currentSettingIsPOSTAPI){
				var postData = {};
				$(".postAPIParamInput").each(
					function (i, elem) {
						var paramName = $(this).prop("id").split("_")[1];
						var paramValue = $(this).prop("type") == "checkbox" ? $(this).is(":checked") : $(this).val();
                        postData[paramName] = paramValue;
                        if (paramName.toLowerCase() == "format") {
                            dType = paramValue == "json" ? "json" : "text";
                        }
					}
				);
				$("#postAPIIntegrationParametersStringifiedText").html(JSON.stringify(postData));
				$("#postAPIIntegrationParametersStringifiedText").show();
				
				$.ajax({
					type: "POST",
					data: postData,//JSON.stringify(postData),
					url: fullUrl,
					timeout: 10000,
					error: function (jqXHR, textStatus, pError) {
						alert("error POSTing to API. User developer console.");
						console.error("error POSTing to  API: " + pError);
						var newFrameContent = "<p>error querying API. use developer console.</p><pre>" + JSON.stringify(pError) + "<br/>" + JSON.stringify(jqXHR.responseJSON, undefined, 2) + "</pre>";
						setIFrame(newFrameContent, true);
						$("#loadingGifDiv").hide();
						
						if(_currentSetting == "ftp_MHVActivePrescriptionAPIURL"){
							_MHVPrescriptionList = [];
						}
					},
					success: function (pResponse) {
						showLoadingMessage("Loading test result...");
						writeToConsole("inside setTestResultContainerHTML() POST API query success callback");
						if(!!pResponse){
							if(dType == "json"){
								var newFrameContent = "<pre>" + JSON.stringify(pResponse, undefined, 2) + "</pre>";
								setIFrame(newFrameContent, true);
								
                                if (_currentSetting == "ftp_MHVActivePrescriptionAPIURL") {
                                    var retrievedPrescriptions = getDeepProperty("Data.prescriptionList", pResponse);
                                    _MHVPrescriptionList = !!retrievedPrescriptions ? retrievedPrescriptions : [];
								}
							}
							else {
								try{
									var serializedContent = new XMLSerializer().serializeToString(pResponse);
									var newFrameContent = "<textarea cols='200' rows='200'>" + serializedContent + "</textarea>";
									setIFrame(newFrameContent, true);
								}
								catch(e){
									console.log(e);
									alert("Content might not be XML...\n\n" + e.message);
									hideLoadingGif();
								}
							}
						}
					}
				});
				
			}
	    }
	}
	else{
		$("#displayframe").load(function(){
			$("#loadingGifDiv").hide();
			writeToConsole("hide loadingGifDiv");
			$("#displayframe").load(function(){return;});
		});
		//for web parts, just query the web part url
		setIFrame(fullUrl, false);
	}
}
function setIFrame(pSource, pIsText){
	if(!!pSource){
		if(pIsText){
			$('#displayframe')[0].contentWindow.document.write(pSource);
			writeToConsole("set displayFrame HTML content directly");
			$("#loadingGifDiv").hide();
		}
		else{
			$('#displayframe').attr({
				src: pSource,
				title: _currentSetting
			});
			writeToConsole("set displayFrame src attribute");
		}
	}
}

function resetTestResultContainer(){
	$('#displayframe').attr({
		src: "",
		title: ""/*settingName*/
	});
	
}
function hideLoadingGif(){
	writeToConsole("begin hideLoadingGif()");
	$("#loadingGifDiv").hide();
}

function prescriptionSelected(pElement) {
    var selectedPrescription = $("input[name=prescriptionSelection]:checked").val();
    try {
        $("#postAPIParamInput_rxid").val(selectedPrescription);
    }
    catch (e) {

    }
}
function icn_onChange(){
	_ICN = $("#ICN").val();
	$("#nationalId").val(_ICN.substring(0,10));
	nationalId_onChange(false);
	setupQueryBuilder(null, false);
}
function nationalId_onChange(pFireSetupQueryBuilder){
	_nationalId = $("#nationalId").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function edipi_onChange(pFireSetupQueryBuilder){
	_EDIPI = $("#edipi").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function mhvid_onChange(pFireSetupQueryBuilder){
	_MHVID = $("#mhvid").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function mhvtoken_onChange(pFireSetupQueryBuilder){
	_MHVSessionToken = $("#mhvtoken").val();
	var size = !!_MHVSessionToken ? _MHVSessionToken.length : 40;
	$("#mhvtoken").attr("size", size);
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function selectedMVIFacilityCode_onChange(){
	_facilityCodeFromMVI = $("#selectedMVIFacilityCode").val();
	$("label[for=useMVISelectedFacility]").text("Use veteran facility from MVI (" + _facilityCodeFromMVI + ")");
	setupQueryBuilder(null, false);
}
function selectedMVIFacilityCodeDFN_onChange(){
	_facilityCodeFromMVIDFN = $("#selectedMVIFacilityCodeDFN").val();
	setupQueryBuilder(null, false);
}
function preferredFacilityCodeFromESR_onChange(){
	_facilityCodeFromESR = $("#preferredFacilityCodeFromESR").val();
	$("label[for=useESRPreferredFacility]").text("Use veteran preferred facility from ESR (" + _facilityCodeFromESR + ")");
	setupQueryBuilder(null, false);
}
function preferredFacilityCodeFromESRDFN_onChange(){
	_facilityCodeFromESRDFN = $("#preferredFacilityCodeFromESRDFN").val();
	setupQueryBuilder(null, false);
}
function userFirstName_onChange(pFireSetupQueryBuilder){
	_userFirstName = $("#userFirstName").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function userLastName_onChange(pFireSetupQueryBuilder){
	_userLastName = $("#userLastName").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function userFacilityCode_onChange(pFireSetupQueryBuilder){
	_userFacilityCode = $("#userFacilityCode").val();
	if(pFireSetupQueryBuilder == null || pFireSetupQueryBuilder == true){
		setupQueryBuilder(null, false);
	}
}
function userIEN_onChange(){
	_userIENAtFacilityCode = $("#userIEN").val();
	setupQueryBuilder(null, false);
}


function getContext() {
	return (typeof GetGlobalContext != "undefined") ? GetGlobalContext() : null;
}
function showLoadingMessage(pMessage){
	$("#progressText").html(pMessage);
	$("#loadingGifDiv").show();
}

function showDiv(pDivToShow){
	var knownDivs = [
		"#loadingGifDiv",
		"#MVISearchContainer",
		"#retrievedSettingsContainer",
		"#testQueryBuilderContainer",
		"#testResultContainer"
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
function buildQueryFilter(field, value, and) {
    return !!field ? ((and ? " and " : "") + field + " eq " + (value == '' ? "null" : "'" + value + "'")) : "";
}
function errorHandler(error) {
	writeToConsole(error.message);
    //showErrorMessage("Error", error.message, "Error");
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function xmlParser(txt){
	//cross browser responseXml to return a XML object
	var xmlDoc = null;
	try{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(txt);
	}
	catch(e){
		if(window.DOMParser){
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(txt, "text/xml");
		}
		else{
			showErrorMessage("Cannot convert string to a cross-browser XML object.","","Error parsing XML");
		}
	}
	return xmlDoc;
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
function containsOnlyNumbers(pString){
	return !/\D/.test(pString);
}