/// <reference path='../../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />
/// <reference path='SSOiServiceScriptLib.js' />
/// <reference path='../../ViaServiceLibrary.js' />

//VistaLoginControlScriptLib.js
//Contains variables and functions used by the VistaLoginControl.html page

//Static Variables
var vlc_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vlc_context = _getContext();//GetGlobalContext();
if (vlc_context) {
    var vlc_serverUrl = vlc_context.getClientUrl();
    var vlc_orgName = vlc_context.getOrgUniqueName();
    var vlc_userId = vlc_context.getUserId();
    var vlc_userName = vlc_context.getUserName();
}

//var vlc_ViaLoginUrl = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/dev/api/VIA/LoginVIA/1.0/json';  //OLD MANUAL DEV URL
var vlc_ViaLoginUrl = '';
var vlc_userSiteId = '';
var vlc_UserSiteNo = '';
var vlc_ViaLoginMinutes = 1;  //Populated from settings, but should typically be 230 minutes (3 hours 50 Minutes)

//To use Login Control directly from a USD page (not using CRM Form), add '?data=USD' to the calling URL
var vlc_USDdata = "";

//VIA SSOi Settings
var vlc_ViaSSOiLoginUrl = '';
var vlc_ViaSSOiRefreshTokenUrl = '';
var vlc_ViaSSOiPivCardUrl = '';
var _SAMLToken = null;
var _IAMSession = null;

//VIA service library settings
var vlc_baseServiceEndpointUrl = null;
var vlc_consumingApp = '';
var vlc_consumingAppToken = '';
var vlc_consumingAppPassword = '';

var vlc_mvisubscriptionkey = '';

function _getContext() {
    //debugger;
    var errorMessage = "Context is not available.";
    if (typeof GetGlobalContext != "undefined") { return GetGlobalContext(); }
    else {
        if (typeof Xrm != "undefined") {
            return Xrm.Page.context;
        }
        else {
            return null;
        }
    }
}

function vlc_getQueryVariable(vlc_variable) {
    try {
        //Get a Query Variable
        var vlc_query = window.location.search.substring(1);
        var vlc_vars = vlc_query.split("&");
        for (var i = 0; i < vlc_vars.length; i++) {
            var vlc_pair = vlc_vars[i].split("=");
            if (vlc_pair[0] == vlc_variable) {
                return decodeURIComponent(vlc_pair[1]);
            }
        }
        return "";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getQueryVariable): ' + err.message);
    }
}

function vlc_SettingsWebServiceURL_response(vlc_settingData, vlc_lastSkip, vlc_ViaLoginUrl_NA) {
    try {
        //vlc_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var vlc_DacUrl = null;
        var vlc_ViaLoginApiUrl = null;
        var vlc_ViaSSOiLoginApiUrl = null;
        for (var i = 0; i <= vlc_settingData.d.results.length - 1; i++) {
            //Get info
            if (vlc_settingData.d.results[i].ftp_DACURL != null) { vlc_DacUrl = vlc_settingData.d.results[i].ftp_DACURL; }
            if (vlc_settingData.d.results[i].ftp_VIALoginURL != null) { vlc_ViaLoginApiUrl = vlc_settingData.d.results[i].ftp_VIALoginURL; }
            if (vlc_settingData.d.results[i].ftp_VIALoginMinutes != null) { vlc_ViaLoginMinutes = vlc_settingData.d.results[i].ftp_VIALoginMinutes; }
            if (vlc_settingData.d.results[i].ftp_VIASSOiLoginURL != null) { vlc_ViaSSOiLoginApiUrl = vlc_settingData.d.results[i].ftp_VIASSOiLoginURL; }
            if (vlc_settingData.d.results[i].ftp_VIASSOiRefreshTokenURL != null) { vlc_ViaSSOiRefreshTokenUrl = vlc_settingData.d.results[i].ftp_VIASSOiRefreshTokenURL; }
            if (vlc_settingData.d.results[i].ftp_VIASSOiPIVCardURL != null) { vlc_ViaSSOiPivCardUrl = vlc_settingData.d.results[i].ftp_VIASSOiPIVCardURL; }

            if (vlc_settingData.d.results[i].ftp_VIAServiceBaseURL != null) { vlc_baseServiceEndpointUrl = vlc_settingData.d.results[i].ftp_VIAServiceBaseURL; }
            if (vlc_settingData.d.results[i].ftp_VIARequestingApplicationCode != null) { vlc_consumingApp = vlc_settingData.d.results[i].ftp_VIARequestingApplicationCode; }
            if (vlc_settingData.d.results[i].ftp_VIAConsumingApplicationToken != null) { vlc_consumingAppToken = vlc_settingData.d.results[i].ftp_VIAConsumingApplicationToken; }
            if (vlc_settingData.d.results[i].ftp_VIAConsumingApplicationPassword != null) { vlc_consumingAppPassword = vlc_settingData.d.results[i].ftp_VIAConsumingApplicationPassword; }
            if (vlc_settingData.d.results[i].ftp_MVISubscriptionKey != null) { vlc_mvisubscriptionkey = vlc_settingData.d.results[i].ftp_MVISubscriptionKey; }
            break;
        }
        if (vlc_DacUrl != null && vlc_ViaLoginApiUrl != null) {
            //Construct full web service URL
            vlc_ViaLoginUrl = vlc_DacUrl + vlc_ViaLoginApiUrl;
        }
        else {
            parent.Xrm.Page.ui.setFormNotification("ERROR: THE VIA LOGIN SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "VIASERVICE");
        }
        if (vlc_DacUrl != null && vlc_ViaSSOiLoginApiUrl != null) {
            //Construct full web service URL
            vlc_ViaSSOiLoginUrl = vlc_DacUrl + vlc_ViaSSOiLoginApiUrl;
        }

        //Decrypt VIA Service Connector Items
        vlc_consumingApp = vialib_decryptServiceConnector(vlc_consumingApp, 4);
        vlc_consumingAppToken = vialib_decryptServiceConnector(vlc_consumingAppToken, 6);
        vlc_consumingAppPassword = vialib_decryptServiceConnector(vlc_consumingAppPassword, 8);

    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_SettingsWebServiceURL_response): ' + err.message);
    }
}

function vlc_formLoad() {
    //debugger;
    try {
        //Hide Busy Spinner
        //done in the table
        //document.getElementById("BusySpinner").style.display = "none";
        if (typeof Xrm === 'undefined') {
            location.reload();
            return;
        }
        var userId = Xrm.Page.context.getUserId();

        var visnId = vlc_getUserVisn(userId);

        if (visnId != null) {
            if (visnId != "") {
                if (visnId.length > 0) {

                    if (visnId[0] == '{')
                        visnId = visnId.substring(1, visnId.length - 1);

                    var req = new XMLHttpRequest();
                    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ftp_facilities?$select=ftp_facilitycode_text,ftp_facilityid,ftp_name&$filter=_ftp_visnid_value eq " + visnId + " and  statecode eq 0", false);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 200) {
                                var vlc_ViaLoginCookie = vlc_getCookie("viasessionlink");
                                var vlc_ViaLoginData = null;

                                if (vlc_ViaLoginCookie != "")
                                    vlc_ViaLoginData = JSON.parse(vlc_ViaLoginCookie);

                                var loginTbl = document.getElementById("tblVistaLogin");
                                var results = JSON.parse(this.response);
                                var curRow = 1;
                                for (var i = 0; i < results.value.length; i++) {
                                    var ftp_facilitycode_text = results.value[i]["ftp_facilitycode_text"];
                                    var ftp_facilityid = results.value[i]["ftp_facilityid"];
                                    var ftp_name = results.value[i]["ftp_name"];

                                    var loggedIn = false;

                                    if (vlc_ViaLoginData != null) {
                                        for (var x = 0; x < vlc_ViaLoginData.length; x++) {
                                            if (ftp_facilitycode_text == vlc_ViaLoginData[x].siteCode)
                                                loggedIn = true;
                                        }
                                    }

                                    var disableInput = "";

                                    if (loggedIn)
                                        disableInput = " disabled ";

                                    var myRow = loginTbl.insertRow(curRow);

                                    var cell0 = myRow.insertCell(0);
                                    if (loggedIn)
                                        cell0.innerHTML = "<b><font color='green'>" + ftp_name + "</font></b>";
                                    else
                                        cell0.innerHTML = "<b>" + ftp_name + "</b>";

                                    var cell1 = myRow.insertCell(1);
                                    cell1.innerHTML = "&nbsp;";

                                    var cell2 = myRow.insertCell(2);
                                    if (loggedIn)
                                        cell2.innerHTML = "<b><font color='green'>Access Code</font></b>";
                                    else
                                        cell2.innerHTML = "<b>Access Code</b>";

                                    var cell3 = myRow.insertCell(3);
                                    cell3.innerHTML = "<input id=\"vlc_accessCode" + curRow.toString() + "\" type=\"text\" value=\"\" title=\"Enter your Access Code\" maxlength=\"30\" " + disableInput + " >";

                                    var cell4 = myRow.insertCell(4);
                                    cell4.innerHTML = "&nbsp;";

                                    var cell5 = myRow.insertCell(5);
                                    if (loggedIn)
                                        cell5.innerHTML = "<b><font color='green'>Verify Code</font></b>";
                                    else
                                        cell5.innerHTML = "<b>Verify Code</b>";

                                    var cell6 = myRow.insertCell(6);
                                    cell6.innerHTML = "<input id=\"vlc_verifyCode" + curRow.toString() + "\" type=\"password\" value=\"\" title=\"Enter your Verify Code\" maxlength=\"30\" " + disableInput + ">";

                                    var cell7 = myRow.insertCell(7);
                                    cell7.innerHTML = "&nbsp;";

                                    var cell8 = myRow.insertCell(8);
                                    if (loggedIn)
                                        cell8.innerHTML = "<b><font color='green'>eSignature Code</font></b>";
                                    else
                                        cell8.innerHTML = "<b>eSignature Code</b>";

                                    var cell9 = myRow.insertCell(9);
                                    cell9.innerHTML = "<input id=\"vlc_esignatureCode" + curRow.toString() + "\" type=\"password\" value=\"\" onkeypress=\"vlc_loginKeyPress(event)\" title=\"Enter your eSignature Code\" maxlength=\"30\" " + disableInput + ">";

                                    var cell10 = myRow.insertCell(10);
                                    cell10.innerHTML = "<input name=\"vlc_loginbutton" + curRow.toString() + "\" id=\"vlc_loginbuttonid" + curRow.toString() + "\" type=\"button\" value=\"Login\" onclick=\"vlc_vistaLogin(" + curRow + ", '" + ftp_facilitycode_text + "','" + ftp_facilityid + "');\" style=\"cursor:pointer; vertical-align:bottom\" title=\"Login to VISTA " + ftp_name + "\" " + disableInput + ">";

                                    var cell11 = myRow.insertCell(11);
                                    cell11.innerHTML = "<div id=\"BusySpinner" + curRow.toString() + "\" style=\"display:none\"><img src=\"img/busy_spinner.gif\"></div>";

                                    var cell12 = myRow.insertCell(12);
                                    cell12.innerHTML = "&nbsp;";

                                    var cell13 = myRow.insertCell(13);
                                    cell13.innerHTML = "<input type=\"hidden\" id=\"siteCode" + curRow.toString() + "\" name=\"siteCode" + curRow.toString() + "\" value=\"" + ftp_facilitycode_text + "\">";

                                    var cell14 = myRow.insertCell(14);
                                    cell14.innerHTML = "<input type=\"hidden\" id=\"siteName" + curRow.toString() + "\" name=\"siteName" + curRow.toString() + "\" value=\"" + ftp_name + "\">";

                                    var cell15 = myRow.insertCell(15);
                                    cell15.innerHTML = "<input type=\"hidden\" id=\"facilityID" + curRow.toString() + "\" name=\"facilityID" + curRow.toString() + "\" value=\"" + ftp_facilityid + "\">";

                                    curRow = curRow + 1;
                                }
                                loginTbl.deleteRow(0);
                            } else {
                                Xrm.Utility.alertDialog(this.statusText);
                            }
                        }
                    };
                    req.send();
                }
            }
        }

        vlc_USDdata = vlc_getQueryVariable("data");
        if (vlc_USDdata != "USD") {
            //Determine the status of the parent record
            if (parent.Xrm.Page.ui.getFormType() > 2) {
                //The form is disabled, hide login tab
                parent.Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(false);
                return false;
            }

            //Check if VIA Login cookie exist (not expired)
            var vlc_ViaLoginCookie = vlc_getCookie("viasessionlink");

            //GM - not hiding tab now in new format
            //Hide Vista Login Tab and exit if cookie exist
			/*
            if (vlc_ViaLoginCookie != "") {
                parent.Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(false);
                //**TRIGGER FORM SCRIPT CODE TO RECREATE DEPENDENT WEB RESOURCES**
                //parent.vcmn_initViaDropdownControls();
                return false;
            }
			*/
            if (vlc_ViaLoginCookie != "") {
                //**TRIGGER FORM SCRIPT CODE TO RECREATE DEPENDENT WEB RESOURCES**
                //this function is found in the VistaCPRSMultiProgressNoteFormScript fileCreatedDate
                //doesn't seem to be getting called
                //parent.vcmn_initViaDropdownControls();
                return false;
            }
        }

        //GET CRM SETTINGS WEB SERVICE URLS
        var vlc_conditionalFilter = "(mcs_name eq 'Active Settings')";
        vlc_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_VIALoginURL, ftp_VIALoginMinutes, ftp_VIASSOiLoginURL, ftp_VIASSOiRefreshTokenURL, ftp_VIASSOiPIVCardURL, ftp_VIAServiceBaseURL, ftp_VIARequestingApplicationCode, ftp_VIAConsumingApplicationToken, ftp_VIAConsumingApplicationPassword, ftp_MVISubscriptionKey', vlc_conditionalFilter, 'mcs_name', 'asc', 0, vlc_SettingsWebServiceURL_response, vlc_ViaLoginUrl);
        if (vlc_USDdata != "USD") {
            //Notify User to Login To VistA
            parent.Xrm.Page.ui.setFormNotification("ERROR: YOUR VISTA SESSION HAS EXPIRED, PLEASE LOGIN BELOW!", "ERROR", "VIASERVICE");
            //Set focus to the login control
            parent.Xrm.Page.getControl("WebResource_VistaLoginControl").setFocus();
        }

        //Get the current CRM User's assigned site/facility
        var vlc_userData = vlc_getSingleEntityDataSync('SystemUserSet', 'ftp_FacilitySiteId', vlc_userId);
        if (vlc_userData != null) {
            if (vlc_userData.d.ftp_FacilitySiteId != null) {
                vlc_userSiteId = vlc_userData.d.ftp_FacilitySiteId.Id;
            }
        }

        //Lookup the Facility/Site #
        //7/12/18 replaced usage of ftp_facilitycode field with ftp_FacilityCode_text field
        if (vlc_userSiteId != null && vlc_userSiteId != '') {
            var vlc_facilityData = vlc_getSingleEntityDataSync('ftp_facilitySet', 'ftp_facilitycode,ftp_FacilityCode_text', vlc_userSiteId);
            if (vlc_facilityData != null) {
                //if (vlc_facilityData.d.ftp_facilitycode != null) { vlc_UserSiteNo = vlc_facilityData.d.ftp_facilitycode; }
                if (vlc_facilityData.d.ftp_FacilityCode_text != null) { vlc_UserSiteNo = vlc_facilityData.d.ftp_FacilityCode_text; }
            }
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_formLoad): ' + err.message);
    }
}

function vlc_getUserVisn(userId) {

    if (userId == null)
        return null;

    if (userId == "")
        return null;

    if (userId.length == 0)
        return null;

    if (userId[0] == '{')
        userId = userId.substring(1, userId.length - 1);

    var visinId = null;
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/systemusers(" + userId + ")?$select=_ftp_visnid_value", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                var _ftp_visnid_value = result["_ftp_visnid_value"];
                var _ftp_visnid_value_formatted = result["_ftp_visnid_value@OData.Community.Display.V1.FormattedValue"];
                var _ftp_visnid_value_lookuplogicalname = result["_ftp_visnid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                visnId = _ftp_visnid_value;
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
    return visnId;
}

function vlc_vistaLogin(row, facilityName, facilityId) {
    //debugger;
    try {
        //Check for SSOi Login
        var vlc_ssoiChecked = document.getElementById("ssoicheck").checked;
        if (vlc_ssoiChecked) {
            //Perform SSOi Login
            vlc_ssoiLogin(row);
            return false;
        }

        //Perform Non SSOi Login
        //Get Login Field data
        var vlc_accessCode = $('#vlc_accessCode' + row).val();
        var vlc_esignatureCode = $('#vlc_esignatureCode' + row).val();
        var vlc_verifyCode = $('#vlc_verifyCode' + row).val();
        //Verify that fields are not empty
        if (vlc_accessCode == null || vlc_accessCode == "") { alert("Please enter your VISTA Access Code!"); return false; }
        if (vlc_esignatureCode == null || vlc_esignatureCode == "") { alert("Please enter your VISTA eSignature Code!"); return false; }
        if (vlc_verifyCode == null || vlc_verifyCode == "") { alert("Please enter your VISTA Verify Code!"); return false; }

        //Disable login fields and button
        document.getElementById('vlc_accessCode' + row).disabled = true;
        document.getElementById('vlc_esignatureCode' + row).disabled = true;
        document.getElementById('vlc_verifyCode' + row).disabled = true;
        document.getElementById('vlc_loginbuttonid' + row).disabled = true;

        //Show Busy Spinner
        document.getElementById("BusySpinner" + row).style.display = "inline-block";
        //Process VistA Login using VIA web service
        var vlc_viaLogin = new Object();
        vlc_viaLogin.AccessCode = vlc_accessCode;
        vlc_viaLogin.VerifyCode = vlc_verifyCode;
        vlc_viaLogin.SiteId = facilityName;//vlc_UserSiteNo.toString();
        vlc_viaLogin.Target = "";

        var vlc_loginResponse = "";
        //vlc_mvisubscriptionkey

        vlc_callAction('vccm_VistALogin',
            {
                "Request": window.JSON.stringify(vlc_viaLogin)
            },
            function (data) {
                vlc_loginResponse = JSON.parse(data.Response);
                vlc_vistaLogin_response(row, null, vlc_loginResponse, facilityId);
            },
            function (err) {
                //System Error
                vlc_vistaLogin_response(row, err, null, null);
            }
        );

        /*$.ajax({
            type: "POST",
            url: vlc_ViaLoginUrl,
            data: JSON.stringify(vlc_viaLogin),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
			beforeSend: function (xhr) {                         
				var subKeys = vlc_mvisubscriptionkey;
                var keys = subKeys.split("|");
                for(var i =0; i<keys.length;i = i+2) {
                    xhr.setRequestHeader(keys[i], keys[i+1]);
                }
            },
            success: function (data) {
                vlc_loginResponse = data;
                vlc_vistaLogin_response(row, null, vlc_loginResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
				
				//TODO:
				
				//this is the error - keep it when login is working
                //vlc_vistaLogin_response(row, errorThrown, null);
				
				//TEST Code - remove or comment out when login is working
				///////////////////////////////////////////////////////////////////////////////////
				var vlc_loginResponse = new Object();
				vlc_loginResponse = { "Data" : [ {Duz:"+UXrOK4+QTGyRUwnpLaIV4eWY5VFJf5YEZ6EuLU9xGOMBbFLrzces6IxFGMp3YlmYfaM", ProviderName:"SMITH,AMBER C", VistaDUZ:"520824648"} ] };
				///////////////////////////////////////////////////////////////////////////////////
								
				vlc_vistaLogin_response(row, null, vlc_loginResponse);
            },
            async: true,
            cache: false
        });*/

		/*
               //var vlc_viaLogin = new Object();
                //vlc_viaLogin.AccessCode = '4543BGL';
                //vlc_viaLogin.VerifyCode = 'TEST0987!';
                //vlc_viaLogin.SiteId = '991';
                //vlc_viaLogin.Target = "";
        var vlc_viaLogin = new Object();
        vlc_viaLogin.AccessCode = vlc_accessCode;
        vlc_viaLogin.VerifyCode = vlc_verifyCode;
        vlc_viaLogin.SiteId = facilityName;//vlc_UserSiteNo.toString();
        vlc_viaLogin.Target = ""; 
                var vlc_loginResponse = "";
                
                $.ajax({
                     type: "post",
                     url: 'https://nonprod.integration.d365.va.gov/veis/api/VIA/LoginVIA/1.0/json',
                     data: JSON.stringify(vlc_viaLogin),
                     contentType: "application/json; charset=utf-8",
                     dataType: "json",
                     beforeSend: function (xhr) {
                        var subKeys = 'Ocp-Apim-Subscription-Key|4a61ad0eaea2445fbbad9d81dbbe1d98';
                        var keys = subKeys.split("|");
                        for(var i =0; i<keys.length;i = i+2) {
                            xhr.setRequestHeader(keys[i], keys[i+1]);
                        }
                    },
                     success: function (data) {
                         console.log(data);
                vlc_loginResponse = data;
                vlc_vistaLogin_response(row, null, vlc_loginResponse);						 
                     },
                     error: function (jqxhr, textstatus, errorthrown) {
                         //system error
                         console.log(errorthrown);
                     },
                     async: true,
                     cache: false
                 });
				 */
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_vistaLogin): ' + err.message);
        //Hide Busy Spinner
        document.getElementById("BusySpinner" + row).style.display = "none";
    }
}


function vlc_callAction(action, data, callback, errHandler) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    // specify name of the entity, record id and name of the action in the Wen API Url
    req.open("POST", serverURL + "/api/data/v8.2/" + action, true);
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

function vlc_vistaLogin_response(row, vlc_errorThrown, vlc_loginResponse, thisFacilityId) {
    try {
        var vlc_ssoiChecked = document.getElementById("ssoicheck").checked;
        if (vlc_errorThrown != null) {
            //General Web Service Error
            alert("Error: The VISTA Login Web Service Failed with error(" + vlc_errorThrown + ")  Please try your login again!");
            //Enable login fields and button
            if (!vlc_ssoiChecked) {
                document.getElementById('vlc_accessCode' + row).disabled = false;
                document.getElementById('vlc_verifyCode' + row).disabled = false;
            }
            document.getElementById('vlc_esignatureCode' + row).disabled = false;
            document.getElementById('vlc_loginbuttonid' + row).disabled = false;

            //Hide Busy Spinner
            document.getElementById("BusySpinner" + row).style.display = "none";
            return false;
        }
        if (vlc_loginResponse.ErrorOccurred == true) {
            alert("Error: The VISTA Login Web Service Failed with error(" + vlc_loginResponse.ErrorMessage + ")  Please try your login again!");
            //Enable login fields and button
            if (!vlc_ssoiChecked) {
                document.getElementById('vlc_accessCode' + row).disabled = false;
                document.getElementById('vlc_verifyCode' + row).disabled = false;
            }
            document.getElementById('vlc_esignatureCode' + row).disabled = false;
            document.getElementById('vlc_loginbuttonid' + row).disabled = false;

            //Hide Busy Spinner
            document.getElementById("BusySpinner" + row).style.display = "none";
            return false;
        }
        else {
            //Get sessionid/token full VistA user name and VistaDUZ(IEN)
            var vlc_duz = "";
            var vlc_providername = "";
            var vlc_vistaduz = "";

            if (vlc_loginResponse.Data[0].Duz != null) { vlc_duz = vlc_loginResponse.Data[0].Duz; }
            if (vlc_loginResponse.Data[0].ProviderName != null) { var vlc_providername = vlc_loginResponse.Data[0].ProviderName; }
            if (vlc_loginResponse.Data[0].VistaDUZ != null) { vlc_vistaduz = vlc_loginResponse.Data[0].VistaDUZ; }

            //Check that there are values returned
            if (vlc_duz == "" || vlc_providername == "") {
                //Check for Fault, set default message
                var vlc_viaLoginFault = "The Login is invalid, please try your login again!";
                if (vlc_loginResponse.Data[0].Fault != null) { vlc_viaLoginFault = "The Login is invalid, " + vlc_loginResponse.Data[0].Fault.Message; }
                alert("Error: " + vlc_viaLoginFault);
                //Enable login fields and button
                if (!vlc_ssoiChecked) {
                    document.getElementById('vlc_accessCode' + row).disabled = false;
                    document.getElementById('vlc_verifyCode' + row).disabled = false;
                }
                document.getElementById('vlc_esignatureCode' + row).disabled = false;
                document.getElementById('vlc_loginbuttonid' + row).disabled = false;

                //Hide Busy Spinner
                document.getElementById("BusySpinner" + row).style.display = "none";
                return false;
            }

            //////////////////////////////////////////////////////////////////
            //GM: TODO: This will need attention once the login is working!!!		
            //////////////////////////////////////////////////////////////////

            //Validate the user's eSignature code using VIA services before continuing to close/hide this window
            //TODO: this will need to get reinstated after testing with forced success login values
            //var vlc_esignatureCode = $('#vlc_esignatureCode' + row).val();
            //vialib_isValidEsig(vlc_consumingApp, vlc_consumingAppToken, vlc_consumingAppPassword, vlc_baseServiceEndpointUrl, vlc_providername, vlc_duz, vlc_UserSiteNo, vlc_esignatureCode, vlc_isValidEsig_Response, { vlc_duz: vlc_duz, vlc_providername: vlc_providername, vlc_vistaduz: vlc_vistaduz });

            //TODO:
            //get cookie
            var vlc_ViaLoginCookie = vlc_getCookie("viasessionlink");
            var vlc_ViaLoginData = null;

            if (vlc_ViaLoginCookie != "")
                vlc_ViaLoginData = JSON.parse(vlc_ViaLoginCookie);

            //find this site if existing
            //	update if so
            //	add, if not

            //TEMP CODE to test cookies
            document.getElementById("BusySpinner" + row).style.display = "none";
            var eSig = $('#vlc_esignatureCode' + row).val();
            var siteCodeVal = $('#siteCode' + row).val();
            var siteNameVal = $('#siteName' + row).val();
            var vlc_CookieData = new Object();

            if (vlc_ViaLoginData == null) {
                vlc_CookieData = [{ duz: vlc_duz, providerName: vlc_providername, vistaduz: vlc_vistaduz, eSig: eSig, siteCode: siteCodeVal, siteName: siteNameVal, facilityId: thisFacilityId }];
            } else {
                //determine if in here first - shouldn't be - but ...
                var temp = [];

                for (var x = 0; x < vlc_ViaLoginData.length; x++) {
                    temp.push(vlc_ViaLoginData[x]);
                }
                temp.push({ duz: vlc_duz, providerName: vlc_providername, vistaduz: vlc_vistaduz, eSig: eSig, siteCode: siteCodeVal, siteName: siteNameVal, facilityId: thisFacilityId });
                vlc_CookieData = temp;
            }

            //vlc_setCookie("viasessionlink", vlc_passThroughObject.vlc_duz + "~~~~" + vlc_passThroughObject.vlc_providername + "~~~~" + vlc_esignatureCode, vlc_ViaLoginMinutes);
            vlc_setCookie("viasessionlink", JSON.stringify(vlc_CookieData), vlc_ViaLoginMinutes);
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_vistaLogin_response): ' + err.message);
        //Hide Busy Spinner
        document.getElementById("BusySpinner" + row).style.display = "none";
    }
}

function vlc_isValidEsig_Response(row, vlc_errorThrown, vlc_isValidEsigResponse, vlc_passThroughObject) {
    //Get Login Field data
    var vlc_accessCode = $('#vlc_accessCode' + row).val();
    var vlc_esignatureCode = $('#vlc_esignatureCode' + row).val();
    var vlc_verifyCode = $('#vlc_verifyCode' + row).val();

    if (vlc_errorThrown != null) {
        alert("Error validating eSignature code: " + vlc_errorThrown);
        document.getElementById('vlc_accessCode' + row).disabled = false;
        document.getElementById('vlc_esignatureCode' + row).disabled = false;
        document.getElementById('vlc_verifyCode' + row).disabled = false;
        document.getElementById('vlc_loginbuttonid' + row).disabled = false;
        document.getElementById('vlc_esignatureCode' + row).value = '';
        document.getElementById("BusySpinner" + row).style.display = "none";
        return false;
    }
    else {
        if (vlc_isValidEsigResponse.getElementsByTagName("fault").length > 0) {
            alert("Error validating eSignature code: " + vlc_isValidEsigResponse.getElementsByTagName("fault")[0].textContent);
            document.getElementById('vlc_accessCode' + row).disabled = false;
            document.getElementById('vlc_esignatureCode' + row).disabled = false;
            document.getElementById('vlc_verifyCode' + row).disabled = false;
            document.getElementById('vlc_loginbuttonid' + row).disabled = false;
            document.getElementById('vlc_esignatureCode' + row).value = '';
            document.getElementById("BusySpinner" + row).style.display = "none";
            return false;
        }
        else {
            if (vlc_isValidEsigResponse.getElementsByTagName("text").length > 0) {
                if (vlc_isValidEsigResponse.getElementsByTagName("text")[0].textContent == "FALSE") {
                    alert("Invalid eSignature code!");
                    document.getElementById('vlc_accessCode' + row).disabled = false;
                    document.getElementById('vlc_esignatureCode' + row).disabled = false;
                    document.getElementById('vlc_verifyCode' + row).disabled = false;
                    document.getElementById('vlc_loginbuttonid' + row).disabled = false;
                    document.getElementById('vlc_esignatureCode' + row).value = '';
                    document.getElementById("BusySpinner" + row).style.display = "none";
                    return false;
                }
                else {
                    //esignature code is valid
                    //Write values to Browser Cookie

                    //get current cookie if exists
                    //set values for all facilities that apply
                    //reset cookie
                    var vlc_CookieData = new Object();

                    vlc_CookieData = { duz: vlc_passThroughObject.vlc_duz, providerName: vlc_passThroughObject.vlc_providername, eSig: vlc_esignatureCode, siteCode: "", siteName: "" };

                    //vlc_setCookie("viasessionlink", vlc_passThroughObject.vlc_duz + "~~~~" + vlc_passThroughObject.vlc_providername + "~~~~" + vlc_esignatureCode, vlc_ViaLoginMinutes);
                    vlc_setCookie("viasessionlink", vlc_CookieData.stringify(), vlc_ViaLoginMinutes);

                    //Update Cross Reference
                    vlc_updateCrossReference(vlc_userId, vlc_userName, vlc_passThroughObject.vlc_vistaduz, vlc_passThroughObject.vlc_providername);

                    //Clear login fields and hide control
                    if (vlc_USDdata != "USD") {
                        parent.Xrm.Page.ui.clearFormNotification("VIASERVICE");
                    }
                    document.getElementById('vlc_accessCode' + row).disabled = false;
                    document.getElementById('vlc_esignatureCode' + row).disabled = false;
                    document.getElementById('vlc_verifyCode' + row).disabled = false;
                    document.getElementById('vlc_loginbuttonid' + row).disabled = false;
                    document.getElementById('vlc_accessCode' + row).value = '';
                    document.getElementById('vlc_esignatureCode' + row).value = '';
                    document.getElementById('vlc_verifyCode' + row).value = '';
                    //Hide the login tab
                    if (vlc_USDdata != "USD") {
                        parent.Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(false);

                        //**TRIGGER FORM SCRIPT CODE TO RECREATE DEPENDENT WEB RESOURCES**
                        //this function is found in the Vis	taCPRSMultiProgressNoteFormScript fileCreatedDate
                        //doesn't seem to be getting called						
                        //parent.vcmn_initViaDropdownControls();
                    }

                    if (vlc_USDdata == "USD") {
                        //Call USD Function passing VISTA data
                        var vlc_pData = ["AccessCode=" + vlc_accessCode, "VerifyCode=" + vlc_verifyCode, "SiteNumber=" + vlc_UserSiteNo.toString(), "ESignatureCode=" + vlc_esignatureCode];
                        VCCM.USDHelper.CopyDataToReplacementParameters("VISTA", vlc_pData, true);

                        //Wait a few seconds before closing tab to allow USD to receive the values
                        setTimeout(function () {
                            //Hide Busy Spinner
                            document.getElementById("BusySpinner").style.display = "none";
                            VCCM.USDHelper.CallUSDAction("Credential Manager", "Close");
                        }, 1000);
                    }
                    else {
                        //Hide Busy Spinner
                        document.getElementById("BusySpinner").style.display = "none";
                    }
                }
            }
        }
    }
}

function vlc_loginKeyPress(event) {
    //debugger;
    try {
        //Determine if 'enter' key was pressed if so attempt login
        var vlc_keypressed = event.which || event.keyCode;
        if (vlc_keypressed == 13) {
            var curRow = 0;
            var facilityName = "";
            var facilityId = "";

            var currentElem = document.activeElement.id;

            if (currentElem == null) {
                vlc_vistaLogin();
                return;
            }

            if (currentElem.indexOf("vlc_esignatureCode") > -1) {
                var ssElem = currentElem.substring(18);
                curRow = parseInt(ssElem, 10);

                var loginTable = document.getElementById("tblVistaLogin");

                var elemName = tblVistaLogin.rows[curRow - 1].cells[13].innerHTML;
                var elemId = tblVistaLogin.rows[curRow - 1].cells[15].innerHTML;

                var ssName = elemName.indexOf("value=") + 7;
                var ssId = elemId.indexOf("value=") + 7;

                facilityName = elemName.substring(ssName, elemName.length - 2);
                facilityId = elemId.substring(ssId, elemId.length - 2);

                vlc_vistaLogin(curRow, facilityName, facilityId);
            } else {
                vlc_vistaLogin();
                return;
            }
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_loginKeyPress): ' + err.message);
    }
}

function vlc_getCookie(cname) {
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

function vlc_setCookie(cname, cvalue, exminutes) {
    try {
        var d = new Date();
        d.setMinutes(d.getMinutes() + (exminutes));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires + "; path=/";// + vlc_orgName + "/";
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_getCookie): ' + err.message);
    }
}

function vlc_updateCrossReference(vlc_crmUserGuid, vlc_crmUserName, vlc_viaUserIen, vlc_viaUserName) {
    try {
        //Check that the required parameters has a value
        if (vlc_crmUserGuid != "" && vlc_crmUserGuid != null && vlc_viaUserIen != "" && vlc_viaUserIen != null) {
            //Check if a record already exists for the CRM user, if so preserve the cross reference record guid
            var vlc_crossReferenceId = null;
            var vlc_conditionalFilter = "ftp_crmuser/Id eq (guid'" + vlc_crmUserGuid + "')";
            var vlc_crossReferenceData = vlc_getMultipleEntityDataSync('ftp_useridSet', 'ftp_useridId', vlc_conditionalFilter, 'ftp_name', 'asc', 0);
            if (vlc_crossReferenceData != null) {
                for (var i = 0; i <= vlc_crossReferenceData.d.results.length - 1; i++) {
                    //Get Info
                    if (vlc_crossReferenceData.d.results[i].ftp_useridId != null) { vlc_crossReferenceId = vlc_crossReferenceData.d.results[i].ftp_useridId; }
                    break;
                }
            }
            //Determine to add new record or update existing
            if (vlc_crossReferenceId != null) {
                //Existing Record, perform update
                var vlc_crossReferenceRecord = new Object();
                vlc_crossReferenceRecord.ftp_crmguid = vlc_crmUserGuid;
                vlc_crossReferenceRecord.ftp_vistaduz = vlc_viaUserIen;
                vlc_crossReferenceRecord.ftp_vistausername = vlc_viaUserName;
                vlc_crossReferenceRecord.ftp_crmuser = { Id: vlc_crmUserGuid, LogicalName: "systemuser", Name: vlc_crmUserName };
                vlc_crossReferenceRecord.ftp_name = "CROSS REFERENCE - " + vlc_crmUserName;
                vlc_crossReferenceRecord.ftp_lastvialogin = new Date();

                //make it a json object
                var jsonEntity = JSON.stringify(vlc_crossReferenceRecord);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: vlc_serverUrl + vlc_crmOdataEndPoint + "/" + 'ftp_useridSet' + "(guid'" + vlc_crossReferenceId + "')",
                    data: jsonEntity,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                    },
                    success: function (textStatus, XmlHttpRequest) {
                        //alert("The Vista User Cross Reference Record was updated successfully.");
                    },
                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                        alert('Ajax Error in Update of Vista User Cross Reference Record: ' + errorThrown);
                    }
                });
            }
            else {
                //New Record, perform add
                var vlc_crossReferenceRecord = new Object();
                vlc_crossReferenceRecord.ftp_crmguid = vlc_crmUserGuid;
                vlc_crossReferenceRecord.ftp_vistaduz = vlc_viaUserIen;
                vlc_crossReferenceRecord.ftp_vistausername = vlc_viaUserName;
                vlc_crossReferenceRecord.ftp_crmuser = { Id: vlc_crmUserGuid, LogicalName: "systemuser", Name: vlc_crmUserName };
                vlc_crossReferenceRecord.ftp_name = "CROSS REFERENCE - " + vlc_crmUserName;
                vlc_crossReferenceRecord.ftp_lastvialogin = new Date();

                //make it a json object
                var jsonEntity = JSON.stringify(vlc_crossReferenceRecord);

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: vlc_serverUrl + vlc_crmOdataEndPoint + "/" + 'ftp_useridSet',
                    data: jsonEntity,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader('Accept', 'application/json');
                    },
                    success: function (textStatus, XmlHttpRequest) {
                        //alert("The Vista User Cross Reference Record was added successfully.");
                    },
                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                        alert('Ajax Error in Adding a Vista User Cross Reference Record: ' + errorThrown);
                    }
                });
            }
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_updateCrossReference): ' + err.message);
    }
}


//WHERE DOES THIS GET CALLED FROM?
function vlc_ssoiChecked(row) {
    if (row == null || row == "undefined")
        return;
    try {
        //Update Login screen based on ssoi checked/unchecked
        var vlc_ssoiChecked = document.getElementById("ssoicheck").checked;
        if (vlc_ssoiChecked) {
            //update labels
            document.getElementById("lblSubTitle").innerHTML = "Enter your eSignature Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Please note that SSOi is currently not supported for automatic VSE login !)";
            document.getElementById("lblSubTitle").title = "Enter your eSignature Code     (Please note that SSOi is currently not supported for automatic VSE login !)";
            //Disable login fields
            document.getElementById('vlc_accessCode' + row).disabled = true;
            document.getElementById('vlc_verifyCode' + row).disabled = true;
            //Initialize PIV Card Login Form
            var apiName = "startLoginSSOi";
            try {
                SSOiServices.startLogin(vlc_ViaSSOiPivCardUrl);
            } catch (err) {
                alert("PIV Card Error: " + apiName + ': ' + err.message);
            }
        }
        else {
            //update labels
            document.getElementById("lblSubTitle").innerHTML = "Enter your Access Code, Verify Code and eSignature Code";
            document.getElementById("lblSubTitle").title = "Enter your Access Code, Verify Code and eSignature Code";
            //Enable login fields
            document.getElementById('vlc_accessCode' + row).disabled = false;
            document.getElementById('vlc_verifyCode' + row).disabled = false;
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_ssoiChecked): ' + err.message);
    }
}

function vlc_ssoiLogin(row) {
    try {
        //Verify that required URL's have data
        if (vlc_ViaSSOiLoginUrl == '' || vlc_ViaSSOiRefreshTokenUrl == '' || vlc_ViaSSOiPivCardUrl == '') {
            alert("The CRM Settings entity is missing the required VIA SSOi URL data, please contact technical support for assistance!");
            return false;
        }

        //Get Login Field data
        var vlc_esignatureCode = $('#vlc_esignatureCode' + row).val();
        //Verify that fields are not empty
        if (vlc_esignatureCode == null || vlc_esignatureCode == "") { alert("Please enter your VISTA eSignature Code!"); return false; }
        //Disable login fields and button
        document.getElementById('vlc_esignatureCode' + row).disabled = true;
        document.getElementById('vlc_loginbuttonid' + row).disabled = true;

        //Show Busy Spinner
        document.getElementById("BusySpinner" + row).style.display = "inline-block";
        //Check for SAML Token
        if (isBlank(_SAMLToken)) {
            SSOiServices.refreshSSOi(vlc_ViaSSOiRefreshTokenUrl, callLoginVIA_SSOi);
        } else {
            callLoginVIA_SSOi(row);
        }
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_ssoiLogin): ' + err.message);
        //Hide Busy Spinner
        document.getElementById("BusySpinner").style.display = "none";
    }
}

function isBlank(value) {
    return (value === undefined || value == null || value.length <= 0) ? true : false;
}

function callLoginVIA_SSOi(row) {

    var apiName = "loginVIA: SSOi";
    var siteId = vlc_UserSiteNo;

    try {
        //Check Token
        if (isBlank(_SAMLToken) || _SAMLToken == "undefined") {
            //SSOi token failed
            alert("No SSOi token retrieved. SSOi login was not successful, please try again.");
            document.getElementById("BusySpinner").style.display = "none";
            document.getElementById('vlc_esignatureCode' + row).disabled = false;
            document.getElementById('vlc_loginbuttonid' + row).disabled = false;
        } else {
            if (apiName !== null && !isBlank(_SAMLToken) && !isBlank(siteId)) {
                //Call VIA_SSOi_Login service
                vlc_loginVIA_SSOi(row, siteId, _SAMLToken, _IAMSession);
            } else {
                alert("Please verify the SSOi login and that the Site ID is filled out, please try again.");
                document.getElementById("BusySpinner" + row).style.display = "none";
                document.getElementById('vlc_esignatureCode' + row).disabled = false;
                document.getElementById('vlc_loginbuttonid' + row).disabled = false;
            }
        }
    } catch (err) {
        alert(apiName + ': ' + err.message);
    }
}

function vlc_loginVIA_SSOi_OLD(siteId, samlToken, iamSession) {
    //This version of the command has been deprecated
    //This version was used with version 2.0, nw replaced by 2.1
    try {
        var b64token = window.btoa(samlToken);
        var viamessage = {};
        viamessage.AccessCode = "donotuse";
        viamessage.VerifyCode = "donotuse";
        viamessage.SiteId = siteId;

        var vlc_loginResponse = "";

        $.ajax({
            url: vlc_ViaSSOiLoginUrl,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("CRMSSOiSession", iamSession),
                    request.setRequestHeader("CRMSSOiSessionSaml", b64token)
            },
            dataType: 'json',
            data: JSON.stringify(viamessage),
            contentType: 'application/json',
            success: function (data) {
                vlc_loginResponse = data;
                vlc_vistaLogin_response(null, vlc_loginResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vlc_vistaLogin_response(errorThrown, null);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_loginVIA_SSOi): ' + err.message);
    }
}

function vlc_loginVIA_SSOi(row, siteId, samlToken, iamSession) {
    try {
        var b64token = window.btoa(samlToken);
        var viamessage = {};
        viamessage.SiteId = siteId;
        viamessage.SamlToken = b64token;

        var vlc_loginResponse = "";

        $.ajax({
            url: vlc_ViaSSOiLoginUrl,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(viamessage),
            contentType: 'application/json',
            success: function (data) {
                vlc_loginResponse = data;
                vlc_vistaLogin_response(row, null, vlc_loginResponse);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //System Error
                vlc_vistaLogin_response(row, errorThrown, null);
            },
            async: true,
            cache: false
        });
    }
    catch (err) {
        alert('VistA Login Control Web Resource Function Error(vlc_loginVIA_SSOi): ' + err.message);
    }
}

function vlc_executeCrmOdataGetRequest(vlc_jsonQuery, vlc_aSync, vlc_aSyncCallback, vlc_skipCount, vlc_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*vlc_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*vlc_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*vlc_aSyncCallback* - specify the name of the return function to call upon completion (required if vlc_aSync = true.  Otherwise '')
    //*vlc_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*vlc_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var vlc_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: vlc_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                vlc_entityData = data;
                if (vlc_aSync == true) {
                    vlc_aSyncCallback(vlc_entityData, vlc_skipCount, vlc_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in vlc_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + vlc_jsonQuery);
            },
            async: vlc_aSync,
            cache: false
        });
        return vlc_entityData;
    }
    catch (err) {
        alert('An error occured in the vlc_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function vlc_getMultipleEntityDataAsync(vlc_entitySetName, vlc_attributeSet, vlc_conditionalFilter, vlc_sortAttribute, vlc_sortDirection, vlc_skipCount, vlc_aSyncCallback, vlc_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*vlc_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vlc_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vlc_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vlc_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vlc_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vlc_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*vlc_aSyncCallback* - is the name of the function to call when returning the result
    //*vlc_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var vlc_jsonQuery = vlc_serverUrl + vlc_crmOdataEndPoint + '/' + vlc_entitySetName + '?$select=' + vlc_attributeSet + '&$filter=' + vlc_conditionalFilter + '&$orderby=' + vlc_sortAttribute + ' ' + vlc_sortDirection + '&$skip=' + vlc_skipCount;
        vlc_executeCrmOdataGetRequest(vlc_jsonQuery, true, vlc_aSyncCallback, vlc_skipCount, vlc_optionArray);
    }
    catch (err) {
        alert('An error occured in the vlc_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function vlc_getMultipleEntityDataSync(vlc_entitySetName, vlc_attributeSet, vlc_conditionalFilter, vlc_sortAttribute, vlc_sortDirection, vlc_skipCount) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Syncronously
    //*vlc_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vlc_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vlc_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*vlc_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*vlc_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*vlc_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)

    try {
        var vlc_jsonQuery = vlc_serverUrl + vlc_crmOdataEndPoint + '/' + vlc_entitySetName + '?$select=' + vlc_attributeSet + '&$filter=' + vlc_conditionalFilter + '&$orderby=' + vlc_sortAttribute + ' ' + vlc_sortDirection + '&$skip=' + vlc_skipCount;
        var vlc_entityData = vlc_executeCrmOdataGetRequest(vlc_jsonQuery, false, '', vlc_skipCount, null);
        return vlc_entityData;
    }
    catch (err) {
        alert('An error occured in the vlc_getMultipleEntityDataSync function.  Error Detail Message: ' + err);
    }
}

function vlc_getSingleEntityDataSync(vlc_entitySetName, vlc_attributeSet, vlc_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*vlc_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*vlc_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*vlc_entityId* - is the Guid for the entity record

    try {
        var vlc_entityIdNoBracket = vlc_entityId.replace(/({|})/g, '');
        var vlc_selectString = '(guid' + "'" + vlc_entityIdNoBracket + "'" + ')?$select=' + vlc_attributeSet;
        var vlc_jsonQuery = vlc_serverUrl + vlc_crmOdataEndPoint + '/' + vlc_entitySetName + vlc_selectString;
        var vlc_entityData = vlc_executeCrmOdataGetRequest(vlc_jsonQuery, false, '', 0, null);
        return vlc_entityData;
    }
    catch (err) {
        alert('An error occured in the vlc_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
} 