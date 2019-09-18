/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />

//ViaWorkloadLookupScriptLib.js
//Contains variables and functions used by the ViaWorkloadLookup.html page

//Static Variables
var viawl_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var viawl_context = GetGlobalContext();
var viawl_serverUrl = viawl_context.getClientUrl();
var viawl_orgName = viawl_context.getOrgUniqueName();
var viawl_userId = viawl_context.getUserId();
var viawl_userSiteId = '';
var viawl_UserSiteNo = '';
var viawl_duz = '';
var viawl_providername = '';
var viawl_baseServiceEndpointUrl = null;
var viawl_requestingApp = null;
var viawl_consumingAppToken = null;
var viawl_consumingAppPassword = null;
var viawl_NoteTitleIEN = null;
var viawl_LocationIEN = null;
var viawl_isValidNoteTitle = false;
var viawl_isValidLocation = false;
var gbl_vcmn_facilityGroupDefaultId = "";
var gbl_vcmm_usdconfigid = '';
//viawl_serverUrl + viawl_crmOdataEndPoint
var viawl_freqUsedNoteTitleArray = [{ "text": "--SELECT A NOTE TITLE--", "value": "00" }];
var viawl_freqUsedLocationArray = [{ "text": "--SELECT A LOCATION--", "value": "00" }];

var gbl_viawl_facilitygroupdefaultvalues = {viaworkloadencounterlocationdefault:'', viaworkloadencounternotetitledefault:''};

var viawl_visitArray = [{ "text": "--SELECT A VISIT--", "value": "00~~DUMMY LOCATION~~20180101.010101" }];  //Visit value consist of ID & NAME & DATETIME
var viawl_crmVeteranId = null;
var viawl_patientId = null;

function viawl_onTransportReadNoteTitle(e) {
    //debugger;
    try {
        var viawl_NoteTitleText = $.trim(e.data.filter.filters[0].value);
        //Clear existing note data
        var viawl_noNoteTitleData = [];
        //Set data when data is found
        if (viawl_NoteTitleText.length == 0) { e.success(viawl_noNoteTitleData); }
        if (viawl_NoteTitleText.length >= 1) {
            //Apply Note Title form data
            var viawl_sortChar = viawl_NoteTitleText.toUpperCase();
            var viawl_sortDir = "1"; //Asc
            //Execute getNoteTitles Service
            vialib_getNoteTitles(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_sortChar, viawl_sortDir, viawl_onTransportReadNoteTitle_response, e);
        }
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onTransportReadNoteTitle): " + err.message);
    }
}

function viawl_onTransportReadNoteTitle_response(viawl_error, viawl_getnotetitlesresponse, viawl_externalObject) {
    //debugger;
    try {
        //Create empty Notes Title Array
        viawl_NoteTitleArray = [];
        //Check for non VIA service error
        if (viawl_error != null) {
            viawl_externalObject.success(viawl_NoteTitleArray);
            return false;
        }
        //Test for VIA Service Error
        if (viawl_getnotetitlesresponse.noteTitles.fault != null) {
            viawl_externalObject.success(viawl_NoteTitleArray);
            return false;
        }
        //Get VIA service Response
        if (viawl_getnotetitlesresponse.noteTitles.results.length > 0) {
            var viawl_notetitlesArray = viawl_getnotetitlesresponse.noteTitles.results;
            //Add each value returned to the array
            for (var i = 0; i <= viawl_notetitlesArray.length - 1; i++) {
                //childNodes[0] holds the record identifier or IEN,  childNodes[1] holds the text value
                //*viawl_NoteTitleArray.push({ id: viawl_notetitlesArray[i].childNodes[0].textContent, name: viawl_notetitlesArray[i].childNodes[1].textContent });
                var viawl_baseNoteIEN = viawl_notetitlesArray[i].tag;
                for (var ii = 0; ii <= viawl_notetitlesArray[i].taggedResults.length - 1; ii++) {
                    viawl_NoteTitleArray.push({ id: viawl_notetitlesArray[i].taggedResults[ii].tag, name: viawl_notetitlesArray[i].taggedResults[ii].textArray[0] });
                }
            }
            viawl_externalObject.success(viawl_NoteTitleArray);
            return false;
        }
        else {
            viawl_externalObject.success(viawl_NoteTitleArray);
            return false;
        }
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onTransportReadNoteTitle_response): " + err.message);
    }
}

function viawl_onSelectNoteTitle(e) {
    try {
        viawl_isValidNoteTitle = true;
        var viawl_dataItem = this.dataItem(e.item.index());
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(viawl_dataItem.name);
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(viawl_dataItem.id);
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onSelectNoteTitle): " + err.message);
    }
}

function viawl_onChangeNoteTitle(e) {
    try {
        if ($('#viawl_searchNoteTitle').val() == "") { viawl_isValidNoteTitle = false; }
        // if no valid selection - clear input
        if (!viawl_isValidNoteTitle) {
            e.sender.value("");
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
        }
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onChangeNoteTitle): " + err.message);
    }
}

function viawl_onTransportReadLocation(e) {
    //debugger;
    try {
        var viawl_LocationText = $.trim(e.data.filter.filters[0].value);
        //Clear existing location data
        var viawl_noLocationData = [];
        //Set data when data is found
        if (viawl_LocationText.length == 0) { e.success(viawl_noLocationData); }
        //Apply Note Title form data
        var viawl_locSortChar = viawl_LocationText.toUpperCase();
        var viawl_locSortDir = "1";
        //Execute getLocations Service
        vialib_getLocations(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_locSortChar, viawl_locSortDir, viawl_onTransportReadLocation_response, e);
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onTransportReadLocation): " + err.message);
    }
}

function viawl_onTransportReadLocation_response(viawl_error, viawl_getlocationsresponse, viawl_externalObject) {
    //debugger;
    try {
        //Create empty Location Array
        viawl_LocationArray = [];
        //Check for non VIA service error
        if (viawl_error != null) {
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
		
		//Test for VIA Service Error
        if (viawl_getlocationsresponse == null) {
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
		
		//Test for VIA Service Error
        if (viawl_getlocationsresponse.locations == null) {
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
		
        //Test for VIA Service Error
        if (viawl_getlocationsresponse.locations.fault != null) {
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
        //Get VIA service Response
        if (viawl_getlocationsresponse.locations.resultsInfo.length > 0) {
            var viawl_locationsArray = viawl_getlocationsresponse.locations.resultsInfo;
            //Add each value returned to the array
            for (var i = 0; i <= viawl_locationsArray.length - 1; i++) {
                //childNodes[0] holds the record identifier or IEN,  childNodes[1] holds the text value
                viawl_LocationArray.push({ id: viawl_locationsArray[i].id, name: viawl_locationsArray[i].name });
            }
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
        else {
            viawl_externalObject.success(viawl_LocationArray);
            return false;
        }
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onTransportReadLocation_response): " + err.message);
    }
}

function viawl_onSelectLocation(e) {
    try {
        viawl_isValidLocation = true;
        var viawl_dataItem = this.dataItem(e.item.index());
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(viawl_dataItem.name);
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(viawl_dataItem.id);
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onSelectLocation): " + err.message);
    }
}

function viawl_onChangeLocation(e) {
    try {
        if ($('#viawl_searchLocation').val() == "") { viawl_isValidLocation = false; }
        // if no valid selection - clear input
        if (!viawl_isValidLocation) {
            e.sender.value("");
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
        }
    }
    catch (err) {
        alert("ViaWorkloadLookup Web Resource Function Error(viawl_onChangeLocation): " + err.message);
    }
}

function viawl_decryptServiceConnector(viawl_connectorArray, viawl_connectorValue) {
    var viawl_decryptedString = "";
    if (viawl_connectorArray != null && viawl_connectorArray != "") {
        var viawl_newArray = viawl_connectorArray.toString().split(',');
        viawl_newArray.reverse();
        for (i = 0; i < viawl_newArray.length; i++) {
            var viawl_curChar = "";
            if (i == 0) {
                viawl_curChar = viawl_newArray[i] - viawl_connectorValue;
            }
            else {
                viawl_curChar = viawl_newArray[i] - (i + viawl_connectorValue);
            }
            viawl_decryptedString = viawl_decryptedString + String.fromCharCode(viawl_curChar);
        }
    }
    return viawl_decryptedString;
}

function viawl_formLoad() {
    debugger;
    try {
        vialib_getConfig();
        //Configure Kendo autocomplete for Search Note Title
        $('#viawl_searchNoteTitle').kendoAutoComplete({
            placeholder: "Select Note Title...",
            dataValueField: "id",
            dataTextField: "name",
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                transport: { read: viawl_onTransportReadNoteTitle }
            }),
            select: viawl_onSelectNoteTitle,
            change: viawl_onChangeNoteTitle,
            filtering: function () { viawl_isValidNoteTitle = false; },
            suggest: false,
            height: 120
        });

        //Configure Kendo autocomplete for Search Location
        $('#viawl_searchLocation').kendoAutoComplete({
            placeholder: "Select Location...",
            dataValueField: "id",
            dataTextField: "name",
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                transport: { read: viawl_onTransportReadLocation }
            }),
            select: viawl_onSelectLocation,
            change: viawl_onChangeLocation,
            filtering: function () { viawl_isValidLocation = false; },
            suggest: false,
            height: 120
        });

        //Determine the status of the parent record, if open, build lookups and grids
        if (parent.Xrm.Page.ui.getFormType() > 2) {
            //The form is disabled, disable the lookup and grid controls and exit
            document.getElementById('viawl_searchNoteTitle').disabled = true;
            document.getElementById('viawl_searchLocation').disabled = true;
            document.getElementById('selFreqUsedNoteTitle').disabled = true;
            document.getElementById('selFreqUsedLocation').disabled = true;
            document.getElementById('selVisit').disabled = true;
            document.getElementById('selSite').disabled = true;
            return false;
        }

        //Check if VIA Login cookie exist (not expired)
        var viawl_ViaLoginCookie = viawl_getCookie("viasessionlink");

        //if (viawl_ViaLoginCookie != null && viawl_ViaLoginCookie != '') {
        //    var viawl_cookiearray = viawl_ViaLoginCookie.split("~~~~", 2);
        //    viawl_duz = viawl_cookiearray[0];
        //    viawl_providername = viawl_cookiearray[1];
        //}

		if (viawl_ViaLoginCookie == null || viawl_ViaLoginCookie == '' || viawl_ViaLoginCookie == "undefined") {
			//empty ftp_selectedworkloadlocationtext, ftp_selectedworkloadnotetitletext, ftp_progressnotefacility
			parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue();
			parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue();
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setValue();
			
			//$( "#viawl_searchLocation" ).prop( "disabled", true );
			//$( "#viawl_searchNoteTitle" ).prop( "disabled", true );
			
			$("#selSite").append("<option data-providername='' data-duz='' data-sitecode='' value=''>--SELECT A SITE--</option>");
			
			//Define Frequently Used Note Title Options from Array
			for (i = 0; i < viawl_freqUsedNoteTitleArray.length; i++) {
				//Add to optionset
				var viawl_newOption = document.createElement("option");
				viawl_newOption.text = viawl_freqUsedNoteTitleArray[i].text;
				viawl_newOption.value = viawl_freqUsedNoteTitleArray[i].value;
				document.getElementById("selFreqUsedNoteTitle").add(viawl_newOption);
			}

			//Define Frequently Used Location Options from Array
			for (i = 0; i < viawl_freqUsedLocationArray.length; i++) {
				//Add to optionset
				var viawl_newOption = document.createElement("option");
				viawl_newOption.text = viawl_freqUsedLocationArray[i].text;
				viawl_newOption.value = viawl_freqUsedLocationArray[i].value;
				document.getElementById("selFreqUsedLocation").add(viawl_newOption);
			}				
		}else{
			//$( "#viawl_searchLocation" ).prop( "disabled", false );
			//$( "#viawl_searchNoteTitle" ).prop( "disabled", false );
			
			//GET CRM SETTINGS WEB SERVICE URLS
			var viawl_conditionalFilter = "(mcs_name eq 'Active Settings')";
			viawl_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_VIAServiceBaseURL, ftp_VIARequestingApplicationCode, ftp_VIAConsumingApplicationToken, ftp_VIAConsumingApplicationPassword', viawl_conditionalFilter, 'mcs_name', 'asc', 0, viawl_SettingsWebServiceURL_response, '');			

			var showVisits =  false;

			//Get User Configuration
			var viawl_userData = viawl_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId', viawl_userId);
			if (viawl_userData != null) {
				if (viawl_userData.d.msdyusd_USDConfigurationId != null) {
					if (viawl_userData.d.msdyusd_USDConfigurationId.Name != null) {
						//Check for PACT Configuration, to display visits
						gbl_vcmm_usdconfigid = viawl_userData.d.msdyusd_USDConfigurationId.Id;
						if (viawl_userData.d.msdyusd_USDConfigurationId.Name != 'PACT Configuration') {
							//Hide Visits dropdown
							document.getElementById("selVisit").style.display = "none";
							document.getElementById("lblVisit").style.display = "none";
							showVisits = false;
							//return false;
						}else{
							document.getElementById("selVisit").style.display = "block";
							document.getElementById("lblVisit").style.display = "block";
							showVisits = true;						
						}
					}
				}
			}

			// Populate Sites
			var viawl_ViaLoginData = null;

			if (viawl_ViaLoginCookie != "")
				viawl_ViaLoginData = JSON.parse(viawl_ViaLoginCookie);
			if (viawl_ViaLoginData && viawl_ViaLoginData.length) {
				if (viawl_ViaLoginData.length > 1)
					$("#selSite").append("<option data-providername='' data-duz='' data-sitecode='' value=''>--SELECT A SITE--</option>");
				for (var i = 0; i < viawl_ViaLoginData.length; i++)
					$("#selSite").append("<option data-providername='" + viawl_ViaLoginData[i].providerName + "' data-duz='" + viawl_ViaLoginData[i].duz + "' data-sitecode='" + viawl_ViaLoginData[i].siteCode + "' value='" + viawl_ViaLoginData[i].facilityId + "'>" + viawl_ViaLoginData[i].siteName + "</option>");

				var pFacility = parent.Xrm.Page.getAttribute("ftp_progressnotefacility");
				var pLocation = parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid");
				var pNote = parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid");
				if (pFacility != null)
					viawl_selectSite(pFacility.getValue(), pLocation, pNote);
				//else
				//	viawl_selectSite(pFacility, pLocation, pNote);
			

				//Populate the Visit picklist
				if (showVisits)
					viawl_populateVisits(0);
			}

			//Check if the parent is a workload encounter, if not don't display.
			var viawl_entityName = parent.Xrm.Page.data.entity.getEntityName();
			if (viawl_entityName == 'incident') {
				//Get Note type from request
				var viawl_noteType = parent.Xrm.Page.getAttribute("ftp_notetype_code").getValue();
				if (viawl_noteType != 100000001) {
					//Hide Visits dropdown
					document.getElementById("selVisit").style.display = "none";
					document.getElementById("lblVisit").style.display = "none";
					return false;
				}
			}
		}
    }
    catch (err) {
		alert('Via Workload Lookup Web Resource Function Error(viawl_formLoad): ' + err.message);
    }
}


function viawl_selectSite(site, location, note) {
    try {		
        //debugger;
		
		if (location == 'from' && note == 'dropdown'){
            //location = parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid");
            //note = parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid");
			location = null;
			note = null;
			
			var tempText = $('#selSite').find(":selected").text();			
			var tempVal = $('#selSite').find(":selected").val();
			
			site = [{entityType:"ftp_facility", id:tempVal, name:tempText}];
			viawl_testPatient(0);
		}
		
        $('#selFreqUsedNoteTitle').html('');
        $('#selFreqUsedLocation').html('')
        $('#selVisit').html('');
        $("#viawl_searchNoteTitle").val('');
        $("#viawl_searchLocation").val('');

        //if (!$("#myselect").val()) 
        //    return;

        if (site) {
            // Select the provided site first
            var opts = $('#selSite option');
            for (var i = 0; i < opts.length; i++) {
                var optVal = opts[i].value;
                if (new RegExp(optVal, 'i').test(site[0].id)) {
                    $('#selSite').val(optVal);
                }
            }
        }
        var selSiteCode = $('#selSite').find(":selected").data('sitecode');
        viawl_userSiteId = $('#selSite').val();

        gbl_vcmn_facilityGroupDefaultId = getDefaultGroupIDFromSiteName(selSiteCode);		
        parent.Xrm.Utility.setDefaultGroupId(gbl_vcmn_facilityGroupDefaultId);
		
		viawl_getFacilityGroupDefaults();

        //TODO: how to know which element to use in array???
        viawl_duz = $('#selSite').find(":selected").data('duz');
        viawl_providername = $('#selSite').find(":selected").data('providername');

        //Check Cookie return values if missing exit
        if (viawl_duz == '' || viawl_providername == '') 
		{ 
			parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue();
			parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue();
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setValue();
			
			//Define Frequently Used Note Title Options from Array
			for (i = 0; i < viawl_freqUsedNoteTitleArray.length; i++) {
				//Add to optionset
				var viawl_newOption = document.createElement("option");
				viawl_newOption.text = viawl_freqUsedNoteTitleArray[i].text;
				viawl_newOption.value = viawl_freqUsedNoteTitleArray[i].value;
				document.getElementById("selFreqUsedNoteTitle").add(viawl_newOption);
				break;
			}

			//Define Frequently Used Location Options from Array
			for (i = 0; i < viawl_freqUsedLocationArray.length; i++) {
				//Add to optionset
				var viawl_newOption = document.createElement("option");
				viawl_newOption.text = viawl_freqUsedLocationArray[i].text;
				viawl_newOption.value = viawl_freqUsedLocationArray[i].value;
				document.getElementById("selFreqUsedLocation").add(viawl_newOption);
				break;
			}			
			
			return false; 
		}

        ////Get the current CRM User's assigned site/facility
        //var viawl_userData = viawl_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', facilityId);

        //if (viawl_userData != null) {
        //    if (viawl_userData.d.ftp_FacilitySiteId != null) {
        //        viawl_userSiteId = viawl_userData.d.ftp_FacilitySiteId.Id;
        //    }
        //}

        //Lookup the Facility/Site #
		if (viawl_userSiteId != null && viawl_userSiteId != '') {
			try{
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setValue([{
				id: viawl_userSiteId,
				name: $('#selSite').find(":selected").text(),
				entityType: "ftp_facility"
			}]);
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setSubmitMode('always');
			}catch(e){
				parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setValue([{
					id: viawl_userSiteId,
					name: $('#selSite').find(":selected").text(),
					entityType: "ftp_facility"
				}]);
				parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setSubmitMode('always');						
			}

			var viawl_facilityData = viawl_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode, ftp_FacilityCode_text', viawl_userSiteId);
			if (viawl_facilityData != null) {
				//if (viawl_facilityData.d.ftp_facilitycode != null) { viawl_UserSiteNo = viawl_facilityData.d.ftp_facilitycode; }
				if (viawl_facilityData.d.ftp_FacilityCode_text != null) { viawl_UserSiteNo = viawl_facilityData.d.ftp_FacilityCode_text; }
			}
		}
		else {
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setValue();
			parent.Xrm.Page.getAttribute("ftp_progressnotefacility").setSubmitMode('always');
		}
		
        //Create Frequently Used Note Titles and Locations
        viawl_populateFrequentlyUsed(0, location, note);
    }
    catch (err) {
        alert('Via Workload Lookup Web Resource Function Error(viawl_selectSite): ' + err.message);
    }
}

function viawl_SettingsWebServiceURL_response(viawl_settingData, viawl_lastSkip, viawl_Blank_NA) {
    try {
        //debugger;
        //viawl_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        for (var i = 0; i <= viawl_settingData.d.results.length - 1; i++) {
            //Get info
            if (viawl_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { viawl_baseServiceEndpointUrl = viawl_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (viawl_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { viawl_requestingApp = viawl_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (viawl_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { viawl_consumingAppToken = viawl_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (viawl_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { viawl_consumingAppPassword = viawl_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            break;
        }
        if (viawl_baseServiceEndpointUrl == null || viawl_requestingApp == null || viawl_consumingAppToken == null || viawl_consumingAppPassword == null) {
            parent.Xrm.Page.ui.setFormNotification("ERROR: THE 'VIA Service Connector' CONFIGURATION IS MISSING DATA IN THE 'Settings Entity', PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VISTASERVICE");
        }
        //Decrypt VIA Service Connector Items
        viawl_requestingApp = viawl_decryptServiceConnector(viawl_requestingApp, 4);
        viawl_consumingAppToken = viawl_decryptServiceConnector(viawl_consumingAppToken, 6);
        viawl_consumingAppPassword = viawl_decryptServiceConnector(viawl_consumingAppPassword, 8);

/*
		var showVisits =  false;

        //Get User Configuration
        var viawl_userData = viawl_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId', viawl_userId);
        if (viawl_userData != null) {
            if (viawl_userData.d.msdyusd_USDConfigurationId != null) {
                if (viawl_userData.d.msdyusd_USDConfigurationId.Name != null) {
                    //Check for PACT Configuration, to display visits
                    gbl_vcmm_usdconfigid = viawl_userData.d.msdyusd_USDConfigurationId.Id;
                    if (viawl_userData.d.msdyusd_USDConfigurationId.Name != 'PACT Configuration') {
                        //Hide Visits dropdown
                        document.getElementById("selVisit").style.display = "none";
                        document.getElementById("lblVisit").style.display = "none";
						showVisits = false;
                        //return false;
                    }else{
                        document.getElementById("selVisit").style.display = "block";
                        document.getElementById("lblVisit").style.display = "block";
						showVisits = true;						
					}
                }
            }
        }

        // Populate Sites
        var vlc_ViaLoginCookie = viawl_getCookie("viasessionlink");
        var vlc_ViaLoginData = null;

        if (vlc_ViaLoginCookie != "")
            vlc_ViaLoginData = JSON.parse(vlc_ViaLoginCookie);
        if (vlc_ViaLoginData && vlc_ViaLoginData.length) {
			if (vlc_ViaLoginData.length > 1)
				$("#selSite").append("<option data-providername='' data-duz='' data-sitecode='' value=''>--SELECT A SITE--</option>");
            for (var i = 0; i < vlc_ViaLoginData.length; i++)
                $("#selSite").append("<option data-providername='" + vlc_ViaLoginData[i].providerName + "' data-duz='" + vlc_ViaLoginData[i].duz + "' data-sitecode='" + vlc_ViaLoginData[i].siteCode + "' value='" + vlc_ViaLoginData[i].facilityId + "'>" + vlc_ViaLoginData[i].siteName + "</option>");

            var pFacility = parent.Xrm.Page.getAttribute("ftp_progressnotefacility");
            var pLocation = parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid");
            var pNote = parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid");
			if (pFacility != null)
				viawl_selectSite(pFacility.getValue(), pLocation, pNote);
			//else
			//	viawl_selectSite(pFacility, pLocation, pNote);

            //Populate the Visit picklist
			if (showVisits)
				viawl_populateVisits(0);
        }

        //Check if the parent is a workload encounter, if not don't display.
        var viawl_entityName = parent.Xrm.Page.data.entity.getEntityName();
        if (viawl_entityName == 'incident') {
            //Get Note type from request
            var viawl_noteType = parent.Xrm.Page.getAttribute("ftp_notetype_code").getValue();
            if (viawl_noteType != 100000001) {
                //Hide Visits dropdown
                document.getElementById("selVisit").style.display = "none";
                document.getElementById("lblVisit").style.display = "none";
                return false;
            }
        }
*/
    }
    catch (err) {
        alert('Via Workload Lookup Web Resource Function Error(viawl_SettingsWebServiceURL_response): ' + err.message);
    }
}

function viawl_getCookie(cname) {
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
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_getCookie): ' + err.message);
    }*/
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
}

function getDefaultGroupIDFromSiteName(siteCode) {
    var groupID = null;
    var facilityId;
    var siteName = "";

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilities?$select=ftp_facilityid,ftp_name&$filter=ftp_facilitycode_text eq '" + siteCode + "'", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                for (var i = 0; i < results.value.length; i++) {
                    var ftp_facilityid = results.value[i]["ftp_facilityid"];
                    var ftp_name = results.value[i]["ftp_name"];
                    siteName = ftp_name;
                    facilityId = ftp_facilityid;
					
					var req1 = new XMLHttpRequest();
					req1.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilitygroupdefaults?$select=ftp_facilitygroupdefaultid&$filter=_ftp_usdgroupid_value eq " + gbl_vcmm_usdconfigid + " and _ftp_facilitysiteid_value eq " + facilityId, false);
					req1.setRequestHeader("OData-MaxVersion", "4.0");
					req1.setRequestHeader("OData-Version", "4.0");
					req1.setRequestHeader("Accept", "application/json");
					req1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req1.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
					req1.onreadystatechange = function () {
						if (this.readyState === 4) {
							req1.onreadystatechange = null;
							if (this.status === 200) {
								var results = JSON.parse(this.response);
								for (var i = 0; i < results.value.length; i++) {
									var ftp_facilitygroupdefaultid = results.value[i]["ftp_facilitygroupdefaultid"];
									groupID = ftp_facilitygroupdefaultid;									
								}
							} else {
								Xrm.Utility.alertDialog(this.statusText);
							}
						}
					};
					req1.send();					
                }
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
	
    return groupID;
}

function viawl_populateFrequentlyUsed(viawl_retryCount, location, note) {
    try {
        //debugger;
        viawl_freqUsedNoteTitleArray = [{ "text": "--SELECT A NOTE TITLE--", "value": "00" }];
        viawl_freqUsedLocationArray = [{ "text": "--SELECT A LOCATION--", "value": "00" }];

        if (!note) {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue();
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue();
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
        }
        if (!location) {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue();
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue();
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
        }
        //Get Parent Document Facility Group Default Id
        var viawl_facilityGroupDefaultId = gbl_vcmn_facilityGroupDefaultId;

        //Verify that parent value is loaded, if not wait and retry
        //if (parent.vcmn_facilityGroupDefaultId == null && viawl_retryCount < 6) {
        //if (parent.vcmn_facilityGroupDefaultId == null && viawl_retryCount < 6) {

        ////////********************
        /////// Commented out July 24, 2019
        //if (parent.Xrm.Utility.getDefaultGroupId() == null && viawl_retryCount < 6) {
        //    setTimeout(function () {
        //        viawl_populateFrequentlyUsed(viawl_retryCount + 1);
        //    }, 1000);
        //    return false;
        //}

        //viawl_facilityGroupDefaultId = parent.Xrm.Utility.getDefaultGroupId();//gbl_vcmn_facilityGroupDefaultId;
        ////////********************
        /////// Commented out July 24, 2019

        if (viawl_facilityGroupDefaultId != null && viawl_facilityGroupDefaultId != "") {
            //Get data and add to note title and location array for frequently used items
            var viawl_frequentlyUsedNoteTitles = null;
            var viawl_frequentlyUsedLocations = null;
            var viawl_facilityGroupDefaultData = viawl_getSingleEntityDataSync('ftp_facilitygroupdefaultSet', 'ftp_frequentlyusednotetitles, ftp_frequentlyusedlocations', viawl_facilityGroupDefaultId);
            if (viawl_facilityGroupDefaultData != null) {
                if (viawl_facilityGroupDefaultData.d.ftp_frequentlyusednotetitles != null) {
                    viawl_frequentlyUsedNoteTitles = viawl_facilityGroupDefaultData.d.ftp_frequentlyusednotetitles;
                }
                if (viawl_facilityGroupDefaultData.d.ftp_frequentlyusedlocations != null) {
                    viawl_frequentlyUsedLocations = viawl_facilityGroupDefaultData.d.ftp_frequentlyusedlocations;
                }
            }

            //Loop through values if they exist
            if (viawl_frequentlyUsedNoteTitles != null & viawl_frequentlyUsedNoteTitles != "") {
                var viawl_freqUsedMainNoteTitleArray = viawl_frequentlyUsedNoteTitles.split("^^");
                if (viawl_freqUsedMainNoteTitleArray.length > 0) {
                    //Parse data and add to option array
                    for (i = 0; i < viawl_freqUsedMainNoteTitleArray.length; i++) {
                        var viawl_freqUsedMainNoteTitleItemArray = viawl_freqUsedMainNoteTitleArray[i].split("~~");
                        if (viawl_freqUsedMainNoteTitleItemArray.length == 2) {
                            //Add to Frequently Used Note Title array
                            if (viawl_freqUsedMainNoteTitleItemArray[0] != null && viawl_freqUsedMainNoteTitleItemArray[0] != '' && viawl_freqUsedMainNoteTitleItemArray[1] != null && viawl_freqUsedMainNoteTitleItemArray[1] != '') {
                                viawl_freqUsedNoteTitleArray.push({ "text": viawl_freqUsedMainNoteTitleItemArray[1], "value": viawl_freqUsedMainNoteTitleItemArray[0] });
                            }
                        }
                    }
                }
            }

            if (viawl_frequentlyUsedLocations != null & viawl_frequentlyUsedLocations != "") {
                var viawl_freqUsedMainLocationArray = viawl_frequentlyUsedLocations.split("^^");
                if (viawl_freqUsedMainLocationArray.length > 0) {
                    //Parse data and add to option array
                    for (i = 0; i < viawl_freqUsedMainLocationArray.length; i++) {
                        var viawl_freqUsedMainLocationItemArray = viawl_freqUsedMainLocationArray[i].split("~~");
                        if (viawl_freqUsedMainLocationItemArray.length == 2) {
                            //Add to Frequently Used Location array
                            if (viawl_freqUsedMainLocationItemArray[0] != null && viawl_freqUsedMainLocationItemArray[0] != '' && viawl_freqUsedMainLocationItemArray[1] != null && viawl_freqUsedMainLocationItemArray[1] != '') {
                                viawl_freqUsedLocationArray.push({ "text": viawl_freqUsedMainLocationItemArray[1], "value": viawl_freqUsedMainLocationItemArray[0] });
                            }
                        }
                    }
                }
            }
        }
		
		//ftp_viaworkloadencounterlocationdefault:"3901~~TCP-RENO",
		//ftp_viaworkloadencounternotetitledefault:"1435~~C&P AUDIOLOGY EXAM",
		
		//{viaworkloadencounterlocationdefault: "3901~~TCP-RENO", viaworkloadencounternotetitledefault: "1435~~C&P AUDIOLOGY EXAM"}
		//gbl_viawl_facilitygroupdefaultvalues

        //Define Frequently Used Note Title Options from Array
        for (i = 0; i < viawl_freqUsedNoteTitleArray.length; i++) {
            //Add to optionset
            var viawl_newOption = document.createElement("option");
            viawl_newOption.text = viawl_freqUsedNoteTitleArray[i].text;
            viawl_newOption.value = viawl_freqUsedNoteTitleArray[i].value;
            document.getElementById("selFreqUsedNoteTitle").add(viawl_newOption);
        }
		
        if (note != null && note.getValue() != null) {
            $('#selFreqUsedNoteTitle').val(note.getValue());
			viawl_selectFreqUsedNoteTitle();
        }else{
			if (gbl_viawl_facilitygroupdefaultvalues != null){
				var noteDefault = gbl_viawl_facilitygroupdefaultvalues.viaworkloadencounternotetitledefault;
				var noteDefaultArray = noteDefault.split('~~');
				if (noteDefaultArray != "" && noteDefaultArray != null && noteDefaultArray != "undefined"){
					$('#selFreqUsedNoteTitle').val(noteDefaultArray[0]);
					viawl_selectFreqUsedNoteTitle();
				}
			}
		}

        //Define Frequently Used Location Options from Array
        for (i = 0; i < viawl_freqUsedLocationArray.length; i++) {
            //Add to optionset
            var viawl_newOption = document.createElement("option");
            viawl_newOption.text = viawl_freqUsedLocationArray[i].text;
            viawl_newOption.value = viawl_freqUsedLocationArray[i].value;
            document.getElementById("selFreqUsedLocation").add(viawl_newOption);
        }
        if (location != null && location.getValue() != null) {
            $('#selFreqUsedLocation').val(location.getValue());
			viawl_selectFreqUsedLocation();
        }else{
			if (gbl_viawl_facilitygroupdefaultvalues != null){
				var locationDefault = gbl_viawl_facilitygroupdefaultvalues.viaworkloadencounterlocationdefault;
				var locationDefaultArray = locationDefault.split('~~');
				if (locationDefaultArray != "" && locationDefaultArray != null && locationDefaultArray != "undefined"){
					$('#selFreqUsedLocation').val(locationDefaultArray[0]);
					viawl_selectFreqUsedLocation();
				}
			}			
		}
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_populateFrequentlyUsed): ' + err.message);
    }
}

function viawl_getFacilityGroupDefaults(){
	try{		
		if (gbl_vcmn_facilityGroupDefaultId == null || gbl_vcmn_facilityGroupDefaultId == "undefined" || gbl_vcmn_facilityGroupDefaultId == "")
			return;
		
		$.ajax({
			type: "GET",
			contentType: "application/json; charset=utf-8",
			datatype: "json",
			url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilitygroupdefaults("+gbl_vcmn_facilityGroupDefaultId+")?$select=ftp_viaworkloadencounterlocationdefault,ftp_viaworkloadencounternotetitledefault",
			beforeSend: function(XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
				XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
				XMLHttpRequest.setRequestHeader("Accept", "application/json");
				XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
			},
			async: false,
			success: function(data, textStatus, xhr) {
				var result = data;
				var ftp_viaworkloadencounterlocationdefault = result["ftp_viaworkloadencounterlocationdefault"];
				var ftp_viaworkloadencounternotetitledefault = result["ftp_viaworkloadencounternotetitledefault"];
				
				gbl_viawl_facilitygroupdefaultvalues = 
				{
					viaworkloadencounterlocationdefault:ftp_viaworkloadencounterlocationdefault, 
					viaworkloadencounternotetitledefault:ftp_viaworkloadencounternotetitledefault
				};				
			},
			error: function(xhr, textStatus, errorThrown) {
				Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
			}
		});
	}catch(err){
		alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_getFacilityGroupDefaults): ' + err.message);
	}
}

function viawl_selectFreqUsedNoteTitle() {
	//debugger;
    try {
        //Get the selected Frequently Used Note Title options
        var viawl_freqNoteTitleOptions = document.getElementById("selFreqUsedNoteTitle");
        var viawl_freqNoteTitleText = viawl_freqNoteTitleOptions.options[viawl_freqNoteTitleOptions.selectedIndex].text;
        var viawl_freqNoteTitleValue = viawl_freqNoteTitleOptions.options[viawl_freqNoteTitleOptions.selectedIndex].value;
        //Update workload note title text
        if (viawl_freqNoteTitleValue != "00") {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(viawl_freqNoteTitleText);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(viawl_freqNoteTitleValue);
        }
        else {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setValue(null);
        }
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitletext").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadnotetitleid").setSubmitMode('always');
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_selectFreqUsedNoteTitle): ' + err.message);
    }
}

function viawl_selectFreqUsedLocation() {
    //debugger;
    try {
        //Get the selected Frequently Used Location options
        var viawl_freqLocationOptions = document.getElementById("selFreqUsedLocation");
        var viawl_freqLocationText = viawl_freqLocationOptions.options[viawl_freqLocationOptions.selectedIndex].text;
        var viawl_freqLocationValue = viawl_freqLocationOptions.options[viawl_freqLocationOptions.selectedIndex].value;
        //Update workload location text and IEN
        if (viawl_freqLocationValue != "00") {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(viawl_freqLocationText);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(viawl_freqLocationValue);
        }
        else {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(null);
        }
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_selectFreqUsedLocation): ' + err.message);
    }
}

function viawl_testPatient(viawl_retryCount) {
    try {
        //debugger;
        //Get the related veteran id (support control for progress note entity and request/incident entity only)
        var viawl_entityName = parent.Xrm.Page.data.entity.getEntityName();
        if (viawl_entityName == 'incident') {
            //Get Veteran from request form
            viawl_crmVeteranId = parent.Xrm.Page.getAttribute("customerid").getValue();
        }
        else {
            //Get Veteran from progress note form
            viawl_crmVeteranId = parent.Xrm.Page.getAttribute("ftp_patient").getValue();
        }
        //Verify that veteran value is loaded, if not wait and retry
        if (viawl_crmVeteranId == null && viawl_retryCount < 6) {
            setTimeout(function () {
                viawl_testPatient(viawl_retryCount + 1);
            }, 1000);
            return false;
        }

        //Retrieve required veteran data
        var viawl_SSN = null;
        var viawl_contactData = viawl_getSingleEntityDataSync('ContactSet', 'GovernmentId', viawl_crmVeteranId[0].id);
        if (viawl_contactData != null) {
            if (viawl_contactData.d.GovernmentId != null) { viawl_SSN = viawl_contactData.d.GovernmentId; }
        }
        if (viawl_SSN == null || viawl_SSN == "") {
            alert("The veteran is missing a SSN!");
            return false;
        }
		
		if ($('#selSite').val() != ""){
			//Execute match Service
			vialib_match(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_SSN, viawl_match_response);
		}
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_testPatient): ' + err.message);
    }
}

function viawl_populateVisits(viawl_retryCount) {
    try {
        //debugger;
        //Get the related veteran id (support control for progress note entity and request/incident entity only)
        var viawl_entityName = parent.Xrm.Page.data.entity.getEntityName();
        if (viawl_entityName == 'incident') {
            //Get Veteran from request form
            viawl_crmVeteranId = parent.Xrm.Page.getAttribute("customerid").getValue();
        }
        else {
            //Get Veteran from progress note form
            viawl_crmVeteranId = parent.Xrm.Page.getAttribute("ftp_patient").getValue();
        }
        //Verify that veteran value is loaded, if not wait and retry
        if (viawl_crmVeteranId == null && viawl_retryCount < 6) {
            setTimeout(function () {
                viawl_populateVisits(viawl_retryCount + 1);
            }, 1000);
            return false;
        }

        //Retrieve required veteran data
        var viawl_SSN = null;
        var viawl_contactData = viawl_getSingleEntityDataSync('ContactSet', 'GovernmentId', viawl_crmVeteranId[0].id);
        if (viawl_contactData != null) {
            if (viawl_contactData.d.GovernmentId != null) { viawl_SSN = viawl_contactData.d.GovernmentId; }
        }
        if (viawl_SSN == null || viawl_SSN == "") {
            alert("The veteran is missing a SSN, the visits cannot be displayed!");
            return false;
        }
		if ($('#selSite').val() != ""){
			//Execute match Service
			vialib_match(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_SSN, viawl_match_response);
		}
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_populateVisits): ' + err.message);
    }
}

function viawl_match_response(viawl_error, viawl_matchresponse) {
    try {
        //debugger;
        //Check for non VIA service error
        if (viawl_error != null) {
            alert("The VIA match failed with error: " + viawl_matchresponse);
            return false;
        }
        ////Test for VIA Service Error
        //if (viawl_matchresponse.getElementsByTagName("fault").length > 0) {
        //    alert("Service Error: " + viawl_matchresponse.getElementsByTagName("fault")[0].textContent);
        //    return false;
        //}
        //Get VIA service Response
        if (viawl_matchresponse.taggedPatientArray
            && viawl_matchresponse.taggedPatientArray.patients
            && viawl_matchresponse.taggedPatientArray.patients.length) {
            var viawl_matchArray = viawl_matchresponse.taggedPatientArray.patients;
            if (viawl_matchArray.length > 0) {
                viawl_patientId = viawl_matchArray[0].localPid;
            }
        }
		
        if (viawl_patientId == null || viawl_patientId == "") {
            alert("Patient not found at Selected Site for Progress Note");
            return false;
        }

        //Execute select Service
        vialib_select(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_patientId, viawl_UserSiteNo, viawl_select_response);
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_match_response): ' + err.message);
    }
}

function viawl_select_response(viawl_error, viawl_selectresponse) {
    try {
        //Check for non VIA service error
        //if (viawl_error != null) {
        //    alert("The VIA select failed with error: " + viawl_selectresponse);
        //    return false;
        //}
        ////Test for VIA Service Error
        //if (viawl_selectresponse.getElementsByTagName("fault").length > 0) {
        //    alert("Service Error: " + viawl_selectresponse.getElementsByTagName("fault")[0].textContent);
        //    return false;
        //}
        //Get VIA service Response
        var viawl_mpiPid = null;
        if (viawl_selectresponse.patient
            && viawl_selectresponse.patient.mpiPid) {
            viawl_mpiPid = viawl_selectresponse.patient.mpiPid;
            //var viawl_selectNodes = viawl_selectresponse.getElementsByTagName("ns2:selectResponse")[0];
            //$(viawl_selectNodes).children().each(function (index) {
            //    viawl_mpiPid = $(viawl_selectNodes.childNodes[index].getElementsByTagName('mpiPid')).text();
            //});
            //if (viawl_mpiPid == null || viawl_mpiPid == "") {
            //    alert("Unable to obtain an mpiPid for the veteran via the select service, the visits cannot be displayed!");
            //    return false;
            //}
        }
        else {
            alert("Unable to obtain an mpiPid for the veteran via the select service, the visits cannot be displayed!");
            return false;
        }

        //Construct a date range to limit result to 1 year
        var viawl_endDate = new Date();
        var viawl_startDate = new Date();
        viawl_startDate.setFullYear(viawl_startDate.getFullYear() - 1);

        var viawl_formattedEndDate = viawl_endDate.getFullYear() + vialib_formatTwoDigits(viawl_endDate.getMonth() + 1) + vialib_formatTwoDigits(viawl_endDate.getDate());
        var viawl_formattedStartDate = viawl_startDate.getFullYear() + vialib_formatTwoDigits(viawl_startDate.getMonth() + 1) + vialib_formatTwoDigits(viawl_startDate.getDate());

        //Execute getVisits service
        vialib_getVisits(viawl_requestingApp, viawl_consumingAppToken, viawl_consumingAppPassword, viawl_baseServiceEndpointUrl, viawl_providername, viawl_duz, viawl_UserSiteNo, viawl_patientId, viawl_UserSiteNo, viawl_mpiPid, '1', viawl_formattedStartDate, viawl_formattedEndDate, viawl_getVisits_response);
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_select_response): ' + err.message);
    }
}

function viawl_getVisits_response(viawl_error, viawl_getvisitsresponse) {
    try {
        //Check for non VIA service error
		//debugger;
        if (viawl_error != null) {
            alert("The VIA getVisits failed with error: " + viawl_getvisitsresponse);
            return false;
        }
        //Test for VIA Service Error
        if (viawl_getvisitsresponse.VEISEMRgvtaggedVisitArrayInfo.VEISEMRgvfault71Info != null) { //.getElementsByTagName("fault").length > 0) {
            alert("Service Error: " + viawl_getvisitsresponse.VEISEMRgvtaggedVisitArrayInfo.VEISEMRgvfault71Info.mcs_message);
            return false;
        }
        //Get VIA service Response
        if (viawl_getvisitsresponse.VEISEMRgvtaggedVisitArrayInfo.mcs_count>0) {
            var viawl_tempMessage = "";

			for(var i = 0; i < viawl_getvisitsresponse.VEISEMRgvtaggedVisitArrayInfo.mcs_count; i++) {
				var visit = viawl_getvisitsresponse.VEISEMRgvtaggedVisitArrayInfo.VEISEMRgvvisitsInfo[i];
				
				var viawl_visit_Type = visit.mcs_type;
                var viawl_visit_locationId = visit.VEISEMRgvlocation1Info.mcs_id;
                var viawl_visit_locationName = visit.VEISEMRgvlocation1Info.mcs_name;
                var viawl_visit_timeStamp = visit.mcs_timestamp;
                var viawl_visit_Status = visit.mcs_status;
                var viawl_visit_Fault = visit.VEISEMRgvfault70Info;
                //var viawl_visit_Value = $(viawl_valueNodes.childNodes[index]).text();
				
				if (viawl_visit_Type != null && viawl_visit_Type != "" && viawl_visit_Type != "H") {
                    if (viawl_visit_locationId != null && viawl_visit_locationId != "" && viawl_visit_locationName != null && viawl_visit_locationName != "" && viawl_visit_timeStamp != null && viawl_visit_timeStamp != "") {
                        //Add to Visits array
                        viawl_visitArray.push({
                            "text": viawl_visit_timeStamp.substring(4, 6) + "/" + viawl_visit_timeStamp.substring(6, 8) + "/" + viawl_visit_timeStamp.substring(0, 4) + " " + viawl_visit_timeStamp.substring(9, 11) + ":" + viawl_visit_timeStamp.substring(11, 13) + "  " + viawl_visit_locationName,
                            "value": viawl_visit_locationId + "~~" + viawl_visit_locationName + "~~" + viawl_visit_timeStamp
                        });
                    }
                }
			}


            //Define Visits Options from Array
            for (i = 0; i < viawl_visitArray.length; i++) {
                //Add to optionset
                var viawl_newOption = document.createElement("option");
                viawl_newOption.text = viawl_visitArray[i].text;
                viawl_newOption.value = viawl_visitArray[i].value;
                document.getElementById("selVisit").add(viawl_newOption);
            }
        }
        else {
            //Define Visits Options from Array, will only have a header record
            for (i = 0; i < viawl_visitArray.length; i++) {
                //Add to optionset
                var viawl_newOption = document.createElement("option");
                viawl_newOption.text = viawl_visitArray[i].text;
                viawl_newOption.value = viawl_visitArray[i].value;
                document.getElementById("selVisit").add(viawl_newOption);
            }
        }
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_getVisits_response): ' + err.message);
    }
}

function viawl_selectVisit() {
    try {
        //Get the selected Frequently Used Note Title options
        var viawl_VisitOptions = document.getElementById("selVisit");
        var viawl_VisitText = viawl_VisitOptions.options[viawl_VisitOptions.selectedIndex].text;
        var viawl_VisitValue = viawl_VisitOptions.options[viawl_VisitOptions.selectedIndex].value;

        //Extract Values
        var viawl_newArray = viawl_VisitValue.split('~~');
        var viawl_VisitValueId = viawl_newArray[0];
        var viawl_VisitValueText = viawl_newArray[1];
        var viawl_VisitValueDateTime = viawl_newArray[2];

        //Update location title text & visit date/time
        if (viawl_VisitValueId != "00") {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(viawl_VisitValueText);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(viawl_VisitValueId);
            //Convert VIA Visit Date to CRM format
            if (viawl_VisitValueDateTime != null && viawl_VisitValueDateTime != "") {
                var viawl_VisitDateString = viawl_VisitValueDateTime.substring(0, 4) + "-" + viawl_VisitValueDateTime.substring(4, 6) + "-" +
                    viawl_VisitValueDateTime.substring(6, 8) + "T" + viawl_VisitValueDateTime.substring(9, 11) + ":" +
                    viawl_VisitValueDateTime.substring(11, 13) + ":" + viawl_VisitValueDateTime.substring(13, 15);
                var viawl_visitEntryDateTime = new Date(viawl_VisitDateString);
                parent.Xrm.Page.getAttribute("ftp_userentrydate").setValue(viawl_visitEntryDateTime);
            }
            else {
                parent.Xrm.Page.getAttribute("ftp_userentrydate").setValue(null);
            }
        }
        else {
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setValue(null);
            parent.Xrm.Page.getAttribute("ftp_userentrydate").setValue(null);
        }
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationtext").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_selectedworkloadlocationid").setSubmitMode('always');
        parent.Xrm.Page.getAttribute("ftp_userentrydate").setSubmitMode('always');
    }
    catch (err) {
        alert('ViaWorkloadLookup Control Web Resource Function Error(viawl_selectVisit): ' + err.message);
    }
}

function viawl_executeCrmOdataGetRequest(viawl_jsonQuery, viawl_aSync, viawl_aSyncCallback, viawl_skipCount, viawl_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*viawl_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*viawl_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*viawl_aSyncCallback* - specify the name of the return function to call upon completion (required if viawl_aSync = true.  Otherwise '')
    //*viawl_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*viawl_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var viawl_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: viawl_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                viawl_entityData = data;
                if (viawl_aSync == true) {
                    viawl_aSyncCallback(viawl_entityData, viawl_skipCount, viawl_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in viawl_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + viawl_jsonQuery);
            },
            async: viawl_aSync,
            cache: false
        });
        return viawl_entityData;
    }
    catch (err) {
        alert('An error occured in the viawl_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function viawl_getMultipleEntityDataAsync(viawl_entitySetName, viawl_attributeSet, viawl_conditionalFilter, viawl_sortAttribute, viawl_sortDirection, viawl_skipCount, viawl_aSyncCallback, viawl_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*viawl_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*viawl_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*viawl_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*viawl_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*viawl_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*viawl_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*viawl_aSyncCallback* - is the name of the function to call when returning the result
    //*viawl_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var viawl_jsonQuery = viawl_serverUrl + viawl_crmOdataEndPoint + '/' + viawl_entitySetName + '?$select=' + viawl_attributeSet + '&$filter=' + viawl_conditionalFilter + '&$orderby=' + viawl_sortAttribute + ' ' + viawl_sortDirection + '&$skip=' + viawl_skipCount;
        viawl_executeCrmOdataGetRequest(viawl_jsonQuery, true, viawl_aSyncCallback, viawl_skipCount, viawl_optionArray);
    }
    catch (err) {
        alert('An error occured in the viawl_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function viawl_getSingleEntityDataSync(viawl_entitySetName, viawl_attributeSet, viawl_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*viawl_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*viawl_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*viawl_entityId* - is the Guid for the entity record

    try {
        var viawl_entityIdNoBracket = viawl_entityId.replace(/({|})/g, '');
        var viawl_selectString = '(guid' + "'" + viawl_entityIdNoBracket + "'" + ')?$select=' + viawl_attributeSet;
        var viawl_jsonQuery = viawl_serverUrl + viawl_crmOdataEndPoint + '/' + viawl_entitySetName + viawl_selectString;
        var viawl_entityData = viawl_executeCrmOdataGetRequest(viawl_jsonQuery, false, '', 0, null);
        return viawl_entityData;
    }
    catch (err) {
        alert('An error occured in the viawl_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function viawl_getMultipleEntityDataSync(viawl_entitySetName, viawl_attributeSet, viawl_conditionalFilter, viawl_sortAttribute, viawl_sortDirection, viawl_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*viawl_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*viawl_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*viawl_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*viawl_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*viawl_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*viawl_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var viawl_jsonQuery = viawl_serverUrl + viawl_crmOdataEndPoint + '/' + viawl_entitySetName + '?$select=' + viawl_attributeSet + '&$filter=' + viawl_conditionalFilter + '&$orderby=' + viawl_sortAttribute + ' ' + viawl_sortDirection + '&$skip=' + viawl_skipCount;
        var viawl_entityData = viawl_executeCrmOdataGetRequest(viawl_jsonQuery, false, '', viawl_skipCount, null);
        return viawl_entityData;
    }
    catch (err) {
        alert('An error occured in the viawl_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}
