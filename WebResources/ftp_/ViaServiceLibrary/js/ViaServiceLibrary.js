﻿﻿﻿﻿//ViaServiceLibrary.js
//
//Contains functions that interact with the VIA Services
var apimUrl = "";
var subKeys = "";
var apimToken = "";

var vialib_soapHeaderStartText = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' " +
							  "xmlns:ser='http://service.via.med.va.gov/'><soapenv:Header/><soapenv:Body>";
var vialib_soapHeaderEndText = "</soapenv:Body></soapenv:Envelope>";

function vialib_getConfig() {
	//apimUrl = "https://Va-veis-dev-apim.veis.va.gov/EC/VIAEMRService/api";
	//subKeys = "Ocp-Apim-Subscription-Key|88784cf9396e41dab087c90a5da0c2c1";
	
	//GET CRM SETTINGS WEB SERVICE URLS
	if(apimUrl == "" && subKeys == "") {
		$.ajax({
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			datatype: 'json',
			url: Xrm.Page.context.getClientUrl() + "/api/data/v9.0/mcs_settings?$filter=(mcs_name%20eq%20%27Active%20Settings%27)",
			beforeSend: function (XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader('Accept', 'application/json');
			},
			success: function (data, textStatus, XmlHttpRequest) {
				if(data.value.length >0) {
					apimUrl = data.value[0].ftp_emrserviceurl;
					subKeys = data.value[0].ftp_emrservicesubscriptionkey;
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert('An error occured in vialib_getConfig function. Error Detail Message: ' + errorThrown);
			},
			async: false
		});
	}
}

function vialib_callAction(action, data, callback, errHandler) {
	var serverURL = Xrm.Page.context.getClientUrl();
	var req = new XMLHttpRequest();
	// specify name of the entity, record id and name of the action in the Wen API Url
	req.open("POST", serverURL + "/api/data/v9.0/" + action, true);
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.onreadystatechange = function () {
		if (this.readyState == 4 /* complete */) {
			req.onreadystatechange = null;
			if (this.status == 200 && this.response != null) {
				var data = JSON.parse(this.response);
				callback(data);
			}
			else {
				if (this.response != null && this.response != "") {
					var error = JSON.parse(this.response).error;
					errHandler(error.message);
				}
			}
		}
	};
	// send the request with the data for the input parameter
	req.send(window.JSON.stringify(data));
}
function vialib_getApimToken() {
	vialib_callAction("ftp_APIMGetToken",{"Request":""},
	function(data) {
		//	
		apimToken = data.Response;
	},
	function(error) { 
		console.log(error);
		}
	);
}
vialib_getApimToken();

function vialib_loginVIA(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_accessCode, vialib_verifyCode, vialib_siteCode, vialib_responseCallback) {
    //This function is used to perform a login to VIA and returns an object containing the DUZ/Token and Full Name plus other data
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_accessCode: This is the VIA/VistA UserId
    //vialib_verifyCode: This is the VIA/VistA Password
    //vialib_siteCode: This is the Facility Number/Id e.g. 516 representing the facility the VIA/VistA user belongs to
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
    try {
		vialib_getConfig();
        //Construct Login json request
		var data = {
			"VEISEMRlgReqqueryBeanInfo" : {
				"mcs_requestingApp" : vialib_encodeString(vialib_requestingApp),
				"mcs_consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"mcs_consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword)
			},
			"mcs_accesscode" :vialib_encodeString(vialib_accessCode),
			"mcs_verifycode":vialib_encodeString(vialib_verifyCode),
			"mcs_sitecode":vialib_siteCode
			
		};
        //Call VIA Services
        var vialib_loginResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRlgloginVIA",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_loginResponse = data;
                vialib_responseCallback(null, vialib_loginResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
				vialib_responseCallback(textStatus, response.Message);
            },
            async: false,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_loginVIA): " + err.message, null);
    }
}

function vialib_getNoteTitles(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_Target, vialib_Direction, vialib_responseCallback, vialib_externalObject) {
    //This function is used to retrieve VIA Note Titles, used in the Notes Write process
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_Target: This is the search parameter leave as blank for all or a single letter for note titles starting with that letter
    //vialib_Direction: This is the sort order 1=ASC -1=DESC
    //vialib_responseCallback: This is the name of the function to return the query result to
    //vialib_externalObject: This is an external object not used by this function. This object can be returned to the response function if needed

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
    //3. the externalObject
debugger;

    try {
		vialib_getConfig();
        //Construct getNoteTitles json request
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"target" : vialib_Target,
				"direction" : vialib_Direction
			}
		};
		
		
        //Call VIA Services
        var vialib_notetitlesResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRgetNoteTitles",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_notetitlesResponse = data;
                vialib_responseCallback(null, vialib_notetitlesResponse, vialib_externalObject);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message, vialib_externalObject);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_getNoteTitles): " + err.message, null, vialib_externalObject);
    }
}

function vialib_getLocations(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_Target, vialib_Direction, vialib_responseCallback, vialib_externalObject) {
    //This function is used to retrieve VIA Locations, used in the Notes Write process
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_Target: This is the search parameter leave as blank for all or a single letter for note titles starting with that letter
    //vialib_Direction: This is the sort order 1=ASC -1=DESC
    //vialib_responseCallback: This is the name of the function to return the query result to
    //vialib_externalObject: This is an external object not used by this function. This object can be returned to the response function if needed

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
    //3. the externalObject
debugger;
    try {
		vialib_getConfig();
        //Construct getLocations json request message
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"target" : vialib_Target,
				"direction" : vialib_Direction
			}
		};
        //Call VIA Services
        var vialib_locationsResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRgetLocations",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_locationsResponse = data;
                vialib_responseCallback(null, vialib_locationsResponse, vialib_externalObject);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message, vialib_externalObject);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_getLocations): " + err.message, null, vialib_externalObject);
    }
}

function vialib_writeNote(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_noteTitleIen, vialib_locationIen, vialib_encounterDate, vialib_encounterType, vialib_patientId, vialib_noteText, vialib_responseCallback) {
    //This function is used to create a new note in VistA/CPRS
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_noteTitleIen: This is the IEN for the Note Title
    //vialib_locationIen: This is the IEN for the Location
    //vialib_encounterDate: This is the encounter date, a datetime string formatted in a VistA/VIA datetime format
    //vialib_encounterType: This is the encounter type A-Historical, E-Non-Historical
    //vialib_patientId: This is the patient identifier
    //vialib_noteText: This is the text for the note
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
debugger;
    try {
		vialib_getConfig();
        //Construct writeNote json request message
		var data = {
			"titleIEN": vialib_noteTitleIen,
			"encounterString": vialib_locationIen + ";" + vialib_encounterDate + ";" + vialib_encounterType,
			"text" : vialib_encodeString(vialib_noteText),
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"patient" : {
					"localPid": vialib_patientId
				}
			}
		};
        //Call VIA Services
        var vialib_writeNoteResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRwriteNote",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_writeNoteResponse = data;
                vialib_responseCallback(null, vialib_writeNoteResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_writeNote): " + err.message, null);
    }
}

function vialib_match(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_Target, vialib_responseCallback) {
    //This function is used to get a list of patients matching target entered
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_Target: This is the search parameter which should be:  SSN or LAST, FIRST or LXXXX (first letter of last name followed by last four digits of SSN)
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)

    try {
		vialib_getConfig();
        //Construct match json request
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"target" : vialib_Target
			}
		};

        //Call VIA Services
        var vialib_matchResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRmatch",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_matchResponse = data;
                vialib_responseCallback(null, vialib_matchResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				debugger;
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_match): " + err.message, null);
    }
}

function vialib_saveNoteAndEncounter(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_noteTitleIen, vialib_locationIen, vialib_patientId, vialib_noteText, vialib_startDate, vialib_patientLocalSiteNo, vialib_Inpatient, vialib_CptArrayText, vialib_DiagnosisArrayText, vialib_eSignCode, vialib_signingProviders, vialib_serviceCategory, vialib_visitRelated, vialib_responseCallback) {
    //This function is used to create a new note and encounter in VistA/CPRS
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_noteTitleIen: This is the IEN for the Note Title
    //vialib_locationIen: This is the IEN for the Location
    //vialib_patientId: This is the patient identifier
    //vialib_noteText: This is the text for the note
    //vialib_startDate: This is the note date
    //vialib_patientLocalSiteNo: This is the patient's local Site/Facility No e.g. 613 as a text string
    //vialib_Inpatient: Inpatient = 1, Not Inpatient = 0
    //vialib_CptArrayText: This is the string passed as <procedures>, is made up of CPT Codes and Description formatted per specs
    //vialib_DiagnosisArrayText: This is the string passed as <diagnoses>, is made up of Diagnosis Codes and Description formatted per specs
    //vialib_eSignCode: The eSignature Code (A unique signature code assigned in Vista to the VIA logged in user.  (Not the IEN or DUZ values))
    //vialib_signingProviders: The IENs for additional signers/providers.  A comma delimited string of IENs
    //vialib_serviceCategory:  A, H or E
    //vialib_visitRelated: Is a list of values separated by comma, e.g. 'SC,CV,AO'  (Service Connected, Combat Veteran, Agent Orange)
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
debugger;
    try {
        //Construct saveNoteAndEncounter Soap message
        //NOTE: Added default of '<visitRelatedTos>SC</visitRelatedTos>' below, to correct service issue per Jessica Romeroll 02/16/2017
        //NOTE: The above row, has now been updated to be a parameter consiting of a list of values separated by comma

        //*************************************************************************************************************
        var vialib_noteDescription = vialib_noteText;
        //Reformat Note Description for VIA Note and Encounter web service to handle line feed and carriage return
        //Replace all \n and \r occurrences with |
        vialib_noteDescription = vialib_noteDescription.replace(/\n/g, "|");
        vialib_noteDescription = vialib_noteDescription.replace(/\r/g, "|");

        var vialib_startDateString = "";
        //If there is a start date, then create the start date string
        if (vialib_startDate != "" && vialib_startDate != null) {
            vialib_startDateString = "<startDate>" + vialib_startDate + "</startDate>"
        }
        //*************************************************************************************************************	
		vialib_getConfig();
			
		var data = {
		   "noteAndEncounter": {
			  "locationIen": vialib_locationIen,
			  "noteTitleIen": vialib_noteTitleIen,
			  "serviceCategory": vialib_encodeString(vialib_serviceCategory),
			  "procedures": vialib_encodeString(vialib_CptArrayText),
			  "diagnoses": vialib_encodeString(vialib_DiagnosisArrayText),
			  "noteBody": vialib_encodeString(vialib_noteDescription),
			  "eSig": vialib_encodeString(vialib_eSignCode),
			  "providers": vialib_signingProviders,
			  "visitRelatedTos": vialib_visitRelated
		   },
		   "queryBean": {
			  "patient": {
				 "localPid": vialib_patientId,
				 "localSiteId": vialib_patientLocalSiteNo,
				 "inPatient": vialib_Inpatient
			  },
			  "provider": {
				 "name": vialib_encodeString(vialib_providerName),
				 "loginSiteCode": vialib_loginSiteCode,
				 "userId": vialib_encodeString(vialib_Duz)
			  },
			  "recordSiteCode": vialib_loginSiteCode,
			  "requestingApp": vialib_encodeString(vialib_requestingApp),
			  "consumingAppToken": vialib_encodeString(vialib_consumingAppToken),
			  "consumingAppPassword": vialib_encodeString(vialib_consumingAppPassword),
			  "startDate": vialib_startDate
		   }
		};

        //Call VIA Services
        var vialib_saveNoteAndEncounterResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRsaveNoteAndEncounter",
            type: "POST",
            datatype: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},   
            success: function (data) {
                vialib_saveNoteAndEncounterResponse = data;
                vialib_responseCallback(null, vialib_saveNoteAndEncounterResponse, vialib_noteText);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = jqXHR.response;
				console.log(response);
                vialib_responseCallback(textStatus, response.Message, vialib_noteText);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_saveNoteAndEncounter): " + err.message, null);
    }
}

function vialib_getNote(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_searchNoteId, vialib_searchSiteId, vialib_searchPatientId, vialib_searchPatientSiteId, vialib_responseCallback) {
    //This function is used to retrieve an existing VIA Note
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_searchNoteId: This is the Note Id/Item Id for an existing note
    //vialib_searchSiteId: This is the Site Id/recordSiteCode that the note is associated with
    //vialib_searchPatientId: This is the Patient Id
    //vialib_searchPatientSiteId: This is the Patient's local Site Id e.g. 613 as a text string
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)

    try {
		vialib_getConfig();
        //Construct getNote json request message
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"itemId" : vialib_searchNoteId,
				"patient" : {
					"localPid": vialib_patientId,
					"localSiteId" : vialib_searchPatientSiteId
				}
			}
		};

        //Call VIA Services
        var vialib_noteResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRgetNote",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_noteResponse = data;
                vialib_responseCallback(null, vialib_noteResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_getNote): " + err.message, null);
    }
}

function vialib_cprsUserLookup(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_Target, vialib_responseCallback, vialib_externalObject) {
	debugger;
    //This function is used to retrieve VIA Users
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_Target: This is the search parameter usually consist of lastname, firstname (does partial lastname search)
    //vialib_responseCallback: This is the name of the function to return the query result to
    //vialib_externalObject: This is an external object not used by this function. This object can be returned to the response function if needed

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
    //3. the externalObject

    try {
		vialib_getConfig();
        //Construct cprsUserLookup json request message
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"target" : vialib_Target,
			}
		};

        //Call VIA Services
        var vialib_userlookupResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRcprsUserLookup",
            type: "POST",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            datatype: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_userlookupResponse = data;
                vialib_responseCallback(null, vialib_userlookupResponse, vialib_externalObject);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message, vialib_externalObject);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_cprsUserLookup): " + err.message, null, vialib_externalObject);
    }
}

function vialib_signNote(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_noteIEN, vialib_eSig, vialib_responseCallback) {
    //This function is used to sign an existing note in VistA/CPRS
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_noteIEN: This is the existing note id as string
    //vialib_eSig: This is the esignature code for the current logged in user as string
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured)
debugger;
    try {
		vialib_getConfig();
        //Construct writeNote json request message
		var data = {
			"noteIEN" :vialib_encodeString(vialib_noteIEN),
			"userDUZ" :vialib_encodeString(vialib_Duz),
			"esig" : vialib_encodeString(vialib_eSig),
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"recordSiteCode" : vialib_loginSiteCode,
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
			}
		};

        //Call VIA Services
        var vialib_signNoteResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRsignNote",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_signNoteResponse = data;
                vialib_responseCallback(null, vialib_signNoteResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_signNote): " + err.message, null);
    }
}

function vialib_isValidEsig(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_criteria, vialib_responseCallback, vialib_externalObject) {
    //This function is used to retrieve VIA Note Titles, used in the Notes Write process
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_criteria: This is the user-provided eSignature code to check
    //vialib_responseCallback: This is the name of the function to return the query result to
    //vialib_externalObject: This is an external object not used by this function. This object can be returned to the response function if needed

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occured). UserTO profile is returned, if esignature is valid.
    //3. the externalObject

    try {
		vialib_getConfig();
        //Construct isValidEsig json request object
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"criteria" : vialib_criteria,
			}
		};

        //Call VIA Services
        var vialib_isValidEsigResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRisValidEsig",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_isValidEsigResponse = data;
                vialib_responseCallback(null, vialib_isValidEsigResponse, vialib_externalObject);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message, vialib_externalObject);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_getNoteTitles): " + err.message, null, vialib_externalObject);
    }
}

function vialib_getVisits(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_selectPatientId, vialib_selectPatientSiteId, vialib_selectPatientMpiPid, vialib_Direction, vialib_startDate, vialib_endDate, vialib_responseCallback) {
    //This function is used to get a list of visits associated with a patient within a date range
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_selectPatientId: This is the Patient Id
    //vialib_selectPatientSiteId: This is the Patient's local Site Id e.g. 613 as a text string
    //vialib_selectPatientMpiPid: This is the Patient's mpiPid, retrieved from 'VIA select service'
    //vialib_Direction: This is the sort order 1=ASC -1=DESC
    //vialib_startDate: This is the from date in a range format as yyyymmdd
    //vialib_endDate: This is the to date in a range format as yyyymmdd
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occurred)

    try {
		vialib_getConfig();
        //Construct getVisits Soap message
        var data = {
			"VEISEMRgvReqqueryBeanInfo" : {
            "mcs_requestingApp": vialib_encodeString(vialib_requestingApp),
			"mcs_consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
			"mcs_consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
            "VIMTEMRgvReqproviderInfo" : {
				"mcs_name" : vialib_encodeString(vialib_providerName), 
				"mcs_loginSiteCode" : vialib_loginSiteCode,
				"mcs_userId" : vialib_encodeString(vialib_Duz)
			},
            "VIMTEMRgvReqpatientInfo" : {
				"mcs_localPid" : vialib_selectPatientId,
				"mcs_localSiteId" : vialib_selectPatientSiteId,
				"mcs_mpiPid" : vialib_selectPatientMpiPid
			},
            "mcs_direction" : vialib_Direction,
            "mcs_startDate" : vialib_startDate,
            "mcs_endDate" : vialib_endDate
			}
		};

        //Call VIA Services
        var vialib_getVisitsResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRgvgetVisits",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_getVisitsResponse = data;
                vialib_responseCallback(null, vialib_getVisitsResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_getVisits): " + err.message, null);
    }
}

function vialib_select(vialib_requestingApp, vialib_consumingAppToken, vialib_consumingAppPassword, vialib_baseServiceEndpointUrl, vialib_providerName, vialib_Duz, vialib_loginSiteCode, vialib_selectPatientId, vialib_selectPatientSiteId, vialib_responseCallback) {
    //This function is used to select the patient specified and get a detailed PatientTO object
    //vialib_requestingApp: This is the VIA Application Code
    //vialib_consumingAppToken: This is the VIA Application Token
    //vialib_consumingAppPassword: This is the VIA Application Password
    //vialib_baseServiceEndpointUrl: Thist is the VIA Service URL
    //vialib_providerName: This is the full VIA/VistA username as returned by the loginVIA service
    //vialib_Duz: This is the VIA session/token as returned by the loginVIA service
    //vialib_loginSiteCode: This is the facility id e.g. 516 as a text string
    //vialib_selectPatientId: This is the Patient Id
    //vialib_selectPatientSiteId: This is the Patient's local Site Id e.g. 613 as a text string
    //vialib_responseCallback: This is the name of the function to return the query result to

    //Return Values:
    //1. error text (null when no error)
    //2. the VIA Service data object returned (null when error occurred)

    try {
		vialib_getConfig();
        //Construct select json request message
		var data = {
			"queryBean" : {
				"requestingApp" : vialib_encodeString(vialib_requestingApp),
				"consumingAppToken" : vialib_encodeString(vialib_consumingAppToken),
				"consumingAppPassword" : vialib_encodeString(vialib_consumingAppPassword),
				"provider" : {
					"name" : vialib_encodeString(vialib_providerName),
					"loginSiteCode": vialib_loginSiteCode,
					"userId": vialib_encodeString(vialib_Duz)
				},
				"patient" : {
					"localPid" :vialib_selectPatientId,
					"localSiteId" : vialib_selectPatientSiteId
				},
			}
		};
        //Call VIA Services
        var vialib_selectResponse = null;
        $.ajax({
            url: apimUrl + "/VEISEMRselect",
            type: "POST",
            datatype: "json",
			beforeSend: function (xhr) { 
				xhr.setRequestHeader("Authorization",apimToken);
				var keys = subKeys.split("|");
				for(var i =0; i<keys.length;i = i+2) {
					xhr.setRequestHeader(keys[i], keys[i+1]); 
				}
			},
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                vialib_selectResponse = data;
                vialib_responseCallback(null, vialib_selectResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				var response = JSON.parse(jqXHR.response);
				console.log(response);
                vialib_responseCallback(textStatus, response.Message);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        //Return function error to callback function
        vialib_responseCallback("ViaServiceLibrary.js Function Error(vialib_select): " + err.message, null);
    }
}


//Related utility functions
function vialib_formatTwoDigits(vialib_numberToFormat) {
    //This function takes an integer and reformats it with a '0' prefix if the value is less than 10
    //vialib_numberToFormat is the integer value
    try {
        var vialib_prefixValue = "0";
        if (vialib_numberToFormat < 10) { return (vialib_prefixValue + vialib_numberToFormat.toString()); }
        else { return vialib_numberToFormat.toString(); }
    }
    catch (err) {
        //Display error
        alert("ViaServiceLibrary.js Function Error(vialib_formatTwoDigits): " + err.message);
        return null;
    }
}

function vialib_convertToVistaDateTime(vialib_datetimeToConvert) {
    //This function takes a JavaScript DateTime Object and reformats it for use as a Vista/VIA datetime value
    //vialib_datetimeToConvert: This is a JavaScript datetime object e.g. (new Date())
    try {
        var vialib_day = vialib_formatTwoDigits(vialib_datetimeToConvert.getDate());
        var vialib_month = vialib_formatTwoDigits(vialib_datetimeToConvert.getMonth() + 1);
        var vialib_year = (vialib_datetimeToConvert.getFullYear() - 1700).toString();
        var vialib_hour = vialib_formatTwoDigits(vialib_datetimeToConvert.getHours());
        var vialib_minute = vialib_formatTwoDigits(vialib_datetimeToConvert.getMinutes());
        var vialib_second = vialib_formatTwoDigits(vialib_datetimeToConvert.getSeconds());
        var vialib_vistaDateTime = (vialib_year + vialib_month + vialib_day + "." + vialib_hour + vialib_minute + vialib_second);                             
        return vialib_vistaDateTime;         
    }
    catch (err) {
        //Display error
        alert("ViaServiceLibrary.js Function Error(vialib_convertToVistaDateTime): " + err.message);
        return null;
    }
}

function vialib_convertToStringDateTime(vialib_datetimeToConvert) {
    //This function takes a JavaScript DateTime Object and reformats it as a string date in the format yyyymmdd.hhmmss
    //vialib_datetimeToConvert: This is a JavaScript datetime object e.g. (new Date())
    try {
        var vialib_day = vialib_formatTwoDigits(vialib_datetimeToConvert.getDate());
        var vialib_month = vialib_formatTwoDigits(vialib_datetimeToConvert.getMonth() + 1);
        var vialib_year = (vialib_datetimeToConvert.getFullYear()).toString();
        var vialib_hour = vialib_formatTwoDigits(vialib_datetimeToConvert.getHours());
        var vialib_minute = vialib_formatTwoDigits(vialib_datetimeToConvert.getMinutes());
        var vialib_second = vialib_formatTwoDigits(vialib_datetimeToConvert.getSeconds());
        var vialib_stringDateTime = (vialib_year + vialib_month + vialib_day + "." + vialib_hour + vialib_minute + vialib_second);
        return vialib_stringDateTime;
    }
    catch (err) {
        //Display error
        alert("ViaServiceLibrary.js Function Error(vialib_convertToStringDateTime): " + err.message);
        return null;
    }
}

function vialib_encodeString(vialib_unencodedString) {
    if (vialib_unencodedString == undefined || vialib_unencodedString == null || vialib_unencodedString == '') { return ''; }
    //This function takes a string and encodes for use in XML
    try {
        return vialib_unencodedString.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
    }
    catch (err) {
        //Display Error
        alert("ViaServiceLibrary.js Function Error(vialib_encodeString): " + err.message);
        return null;
    }
}

function vialib_decryptServiceConnector(vialib_connectorArray, vialib_connectorValue) {
    var vialib_decryptedString = "";
    if (vialib_connectorArray != null && vialib_connectorArray != "") {
        var vialib_newArray = vialib_connectorArray.toString().split(',');
        vialib_newArray.reverse();
        for (i = 0; i < vialib_newArray.length; i++) {
            var vialib_curChar = "";
            if (i == 0) {
                vialib_curChar = vialib_newArray[i] - vialib_connectorValue;
            }
            else {
                vialib_curChar = vialib_newArray[i] - (i + vialib_connectorValue);
            }
            vialib_decryptedString = vialib_decryptedString + String.fromCharCode(vialib_curChar);
        }
    }
    return vialib_decryptedString;
}

var xml_encode_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
    '/': '&#92;'
};

var xml_decode_map = {
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>',
    '&#92;': '/'
};

function encodeXml(string) {
    return string.replace(/([\&"<>])/g, function (str, item) {
        return xml_encode_map[item];
    });
};

function decodeXml(string) {
    return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
		function (str, item) {
		    return xml_decode_map[item];
		});
}