var _retrievedSettings = null;
var _addlSignersAPIUrl = null;

function form_onLoad() {
    try {
        launchSignerSearch();

        _retrievedSettings = null;
        var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
        SDK.REST.retrieveMultipleRecords(
            "mcs_setting",
            queryString,
            function (retrievedRecords) {
                if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) _retrievedSettings = retrievedRecords[0];
            },
            function (e) {
                //silently error
            },
            function () {
                if (!!_retrievedSettings && !!_retrievedSettings.ftp_DACURL && !!_retrievedSettings.hasOwnProperty("ftp_VIAAdditionalSignersURL") && !!_retrievedSettings.ftp_VIAAdditionalSignersURL) {
                    _addlSignersAPIUrl = _retrievedSettings.ftp_DACURL + _retrievedSettings.ftp_VIAAdditionalSignersURL;
                }
                else {
                    //missing settings
                }
            }
        );
    }
    catch (e) {
        alert("VistACPRSAdditionalSignersFormScript.form_onLoad() error: " + e.message);
    }
}

function vcmn_initViaDropdownControls() {
    /*do not delete this function! Odd's code calls it from the VIA Login Control.*/
    launchSignerSearch();
}

function launchSignerSearch() {
    try {
        //Refresh the web resource URL
        var SignerSearchWRUrl = Xrm.Page.getControl("WebResource_SignerSearch").getSrc();
        Xrm.Page.getControl("WebResource_SignerSearch").setSrc(SignerSearchWRUrl);
        //Prep the tab
        if (Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").getVisible() == false) {
            ;
            Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").getDisplayState() != "expanded") {
            Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").setDisplayState("expanded");
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").setFocus();
    }
    catch (err) {
        alert("VistACPRSAdditionalSignersFormScript.launchSignerSearch() error: " + err.message);
    }
}

function integrateAdditionalSigners() {
    try {
        debugger
        Xrm.Page.ui.clearFormNotification("preIntegrationError");
        Xrm.Page.ui.clearFormNotification("postIntegrationError");
        if (!Xrm.Page.data.entity.getId()) {
            alert("Save the record first.");
            return;
        }
        if (Xrm.Page.getAttribute("ftp_integrationstatus").getValue() == "OK") {
            alert("These signers have already been integrated.  Open a new Additional Signers record in order to add more signers.");
            return;
        }

        var vadi_confirmSaveToVista = confirm('Are you sure you want to save additional signers to VistA/CPRS?\nThis action cannot be cancelled!\n\nUpon completion of this process, the addendum will automatically be marked as completed and you will be prompted to exit the record!');
        if (vadi_confirmSaveToVista == false) {
            return false;
        }

        Xrm.Page.ui.setFormNotification("Saving additional signers, please wait..", "INFO", "SAVEVISTA");

        /*make sure we have the additional signers api URL, set in form_onLoad*/
        if (!!_addlSignersAPIUrl) {
			/*check for required fields on form:
			ftp_vistarecordid - filled by SDK.REST.createRecord code on Veteran Charts web resource
			ftp_selectedsigners - filled by ProgressNoteSignerSearch.html web resource on this form
			*/
            var vistaRecordId = Xrm.Page.getAttribute("ftp_vistarecordid").getValue();
            if (!!vistaRecordId) {
				/*get IEN array browser local storage (previously set by ProgressNoteSignerSearch.html web resource),
				then parse into single string for POSTing to VIA*/
                var signersIENArrayAsString = "";
                //Get Note's Browser Local Storage Values
                var storedIENArrayAsString = localStorage.getItem("PN" + Xrm.Page.data.entity.getId());
                if (!!storedIENArrayAsString) {
                    var signersIENArray = storedIENArrayAsString.split('~~~');
                    if (signersIENArray.length > 1) {
                        for (var a = 0; a < signersIENArray.length; a++) {
                            signersIENArrayAsString += (signersIENArray[a] != "NEW") ? (signersIENArray[a] + " ") : "";
                        }
                        signersIENArrayAsString = signersIENArrayAsString.trim();
                        var pFacilityCode = Xrm.Page.getAttribute('ftp_facilityid');
                        if (!pFacilityCode ||
                            !pFacilityCode.getValue()) {
                            var msg = "Did not find facility associated with additional signers. Facility must be provided";
                            Xrm.Page.ui.setFormNotification(msg, "INFO", "preIntegrationError");
                            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                            promptForVIALogin(msg);

                            return;
                        }
                        var creds = tryGetCreds(pFacilityCode.getValue());
                        if (!creds) {
                            var msg = "Please log into site: " + pFacilityCode.getValue();
                            Xrm.Page.ui.setFormNotification(msg, "INFO", "preIntegrationError");
                            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                            promptForVIALogin(msg);

                            return;
                        }
                        /*check VIA login cookie and require login first if necessary*/
                        //var viaLoginCookie = docCookies.getItemUnparsed("viasessionlink");
                        //if (!!viaLoginCookie) {
                        //    var viaLoginCookieAsArray = viaLoginCookie.split("~~~~", 2);
                        //    if (viaLoginCookieAsArray.length == 2) {
                        //        var duzFromCookie = viaLoginCookieAsArray[0];
                        //        var userNameFromCookie = viaLoginCookieAsArray[1];
                        //        if (!!duzFromCookie && !!userNameFromCookie) {
                        /*get current user's facility code*/
                        //SDK.REST.retrieveRecord(
                        //    Xrm.Page.context.getUserId(),
                        //    "SystemUser",
                        //    "FirstName,LastName,ftp_ftp_facility_systemuser/ftp_facilitycode",
                        //    "ftp_ftp_facility_systemuser",
                        //    function (retrievedUser) {
                        //        if (retrievedUser.hasOwnProperty("ftp_ftp_facility_systemuser") && !!retrievedUser.ftp_ftp_facility_systemuser && retrievedUser.ftp_ftp_facility_systemuser.hasOwnProperty("ftp_facilitycode") && !!retrievedUser.ftp_ftp_facility_systemuser.ftp_facilitycode) {
                        //            //Create the Additional Signers oject
                        var vcmn_viaSigners = {
                            ProviderName: creds.providerName,
                            Duz: creds.duz,
                            LoginSiteCode: pFacilityCode.getValue(),
                            Target: vistaRecordId,
                            SupplementalParameters: signersIENArrayAsString
                        };

                        var postData = { "Request": JSON.stringify(vcmn_viaSigners) };

                        vialib_callAction("vccm_VIAAddSigner", postData,
                            function (data) {
                                vcmn_viaSignersResponse = JSON.parse(data.Response);

                                //Test for Failure
                                if (vcmn_viaSignersResponse.ErrorOccurred == true) {
                                    //have a Fault message
                                    Xrm.Page.ui.setFormNotification("Error adding additional signers: " + responseData.Fault.Message, "ERROR", "postIntegrationError");
                                    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                                }
                                else {
                                    //successful signer integration
                                    Xrm.Page.getAttribute("ftp_integrationdate").setValue(new Date());
                                    Xrm.Page.getAttribute("ftp_integrationdate").setSubmitMode("always");
                                    Xrm.Page.getAttribute("ftp_integrationstatus").setValue("OK");
                                    Xrm.Page.getAttribute("ftp_integrationstatus").setSubmitMode("always");
                                    Xrm.Page.data.entity.save();
                                    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                                    //close the activity
                                }
                            },
                            function (error) {
                                alert("Error: Unable to add the additional signers selected to this note.\n\nPlease review the note and signers in your Vista/CPRS application!");
                            }
                        );
                        //}
                        //else {
                        //    //missing user facility code
                        //    var msg = "Your CRM user record is missing a designated Site, or its designated Site does not have a Facility Code.";
                        //    Xrm.Page.ui.setFormNotification(msg, "ERROR", "preIntegrationError");
                        //}

                        //    },
                        //    errorHandler
                        //);
                        //        }
                        //        else {
                        //            //viaLoginCookie is incomplete, prompt for login and instruct to re-integrate after logging in
                        //            var msg = "Your temporarily stored VistA credentials are missing some information. In order to add additional signers, please login to VistA again.";
                        //            Xrm.Page.ui.setFormNotification(msg, "INFO", "preIntegrationError");
                        //            promptForVIALogin(msg);
                        //        }
                        //    }
                        //    else {
                        //        //viaLoginCookie is incomplete, prompt for login and instruct to re-integrate after logging in
                        //        var msg = "Your temporarily stored VistA credentials are missing some information. In order to add additional signers, please login to VistA again.";
                        //        Xrm.Page.ui.setFormNotification(msg, "INFO", "preIntegrationError");
                        //        promptForVIALogin(msg);
                        //    }
                        //}
                        //else {
                        //    //missing viaLoginCookie, prompt for login and instruct to re-integrate after logging in
                        //    var msg = "Your VISTA session has expired. In order to add additional signers, you must be logged into VistA";
                        //    Xrm.Page.ui.setFormNotification(msg, "INFO", "preIntegrationError");
                        //    promptForVIALogin(msg);
                        //}
                    }
                    else {
                        //select and apply signers before trying to integrate
                        var msg = "Use the signer search control to select and apply additional signers before trying to Save to VsitA/CPRS";
                        Xrm.Page.ui.setFormNotification(msg, "ERROR", "preIntegrationError");
                        Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                    }
                }
                else {
                    //select and apply signers before trying to integrate
                    var msg = "Use the signer search control to select and apply additional signers before trying to Save to VsitA/CPRS";
                    Xrm.Page.ui.setFormNotification(msg, "ERROR", "preIntegrationError");
                    Xrm.Page.ui.clearFormNotification("SAVEVISTA");
                }
            }
            else {
                //missing required values on form, user must close form and try again
                var msg = "Your form is missing required data.  Close this form and try adding signers again from the Medical Charts tab.";
                Xrm.Page.ui.setFormNotification(msg, "ERROR", "preIntegrationError");
                Xrm.Page.ui.clearFormNotification("SAVEVISTA");
            }
        }
        else {
            //missing settings
            var msg = "API URLs missing from Active Settings record. Contact your administrator";
            Xrm.Page.ui.setFormNotification(msg, "ERROR", "preIntegrationError");
            Xrm.Page.ui.clearFormNotification("SAVEVISTA");
        }
    }
    catch (e) {
        alert("VistACPRSAdditionalSignersFormScript.integrateAdditionalSigners() error: " + err.message);
    }
}

function promptForVIALogin(pMessage) {
    //alert(pMessage);
    Xrm.Page.ui.tabs.get('Tab_VistALogin').setVisible(true);
    Xrm.Page.ui.tabs.get('Tab_VistALogin').setFocus();
}

function Tab_AdditionalSigners_onTabStateChange() {
    if (Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").getDisplayState() != "expanded") {
        Xrm.Page.ui.tabs.get("Tab_AdditionalSigners").setDisplayState("expanded");
    }
}

var docCookies = {
    getItem: function (sKey) {
        //return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "$&") + "s*=s*([^;]*).*$)|^.*$"), "$1")) || null;
        if (!sKey) return null;
        var keys = this.keys();
        for (var i = 0, l = keys.length; i < l; i++) {
            if (keys[i].name == sKey) return keys[i].value;
        }
    },
    getItemUnparsed: function (sKey) {
        var name = sKey + "=";
        var keys = this.keysUnparsed();
        for (var i = 0, l = keys.length; i < l; i++) {
            var thisCookie = keys[i];
            while (thisCookie.charAt(0) == ' ') {
                thisCookie = thisCookie.substring(1);
            }
            if (thisCookie.indexOf(name) == 0) {
                return thisCookie.substring(name.length, thisCookie.length);
            }
        }
        return "";
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        var newCookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        document.cookie = newCookie;
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        var removalCookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"/* + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "")*/;
        document.cookie = removalCookie;
        return true;
    },
    hasItem: function (sKey) {
        //return (new RegExp("(?:^|;s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "$&") + "s*=")).test(document.cookie);
        if (!sKey) return false;
        var keys = this.keys();
        for (var i = 0, l = keys.length; i < l; i++) {
            if (keys[i].name == sKey) return true;
        }
    },
    keys: function () {
        var encodedCookies = document.cookie.split(';');
        var cookieObjectArray = [];
        for (var i = 0, l = encodedCookies.length; i < l; i++) {
            var x = encodedCookies[i].split('=');
            cookieObjectArray.push({ name: x[0].trim(), value: decodeURIComponent(x[1]).trim() });
        }
        cookieObjectArray.sort(SortArray("name"));
        cookieObjectArray = RemoveDuplicates(cookieObjectArray, "name");
        return cookieObjectArray;
    },
    keysUnparsed: function () {
        var encodedCookiesArray = document.cookie.split(';');
        return encodedCookiesArray;
    }
};
function SortArray(pSortProperty) {
    var sortOrder = 1;
    if (pSortProperty[0] === "-") {
        sortOrder = -1;
        pSortProperty = pSortProperty.substr(1);
    }
    return function (a, b) {
        var result = (a[pSortProperty] < b[pSortProperty]) ? -1 : (a[pSortProperty] > b[pSortProperty]) ? 1 : 0;
        return result * sortOrder;
    }
}
function RemoveDuplicates(pArray, pAttribute) {
    var pArrayObject = {};
    var returnArray = [];
    var j = 0;
    for (var i = 0; i < pArray.length; i++) {
        var item = pArray[i];
        if (pArrayObject[item[pAttribute]] !== 1) {
            pArrayObject[item[pAttribute]] = 1;
            returnArray[j++] = item;
        }
    }
    return returnArray;
}
function errorHandler(error) {
    writeToConsole(error.message);
    alert(error.message);
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}

function tryGetCreds(siteNo) {
    var creds;
    //Check if VIA Login cookie exist (not expired)
    var pnss_ViaLoginCookie = pnss_getCookie("viasessionlink");

    var pnss_ViaLoginData = null;

    if (pnss_ViaLoginCookie != "") {
        pnss_ViaLoginData = JSON.parse(pnss_ViaLoginCookie);

        for (var j = 0; j < pnss_ViaLoginData.length; j++) {
            if (pnss_ViaLoginData[j].siteCode == siteNo) {
                creds = pnss_ViaLoginData[j];
                break;
            }
        }
    }

    return creds;
}

function pnss_getCookie(cname) {
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