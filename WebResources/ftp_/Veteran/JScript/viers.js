/*Demographic update API calls*/

var adph_ESRAddressUpdateURL = "";

var adph_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var adph_serverUrl = Xrm.Page.context.getClientUrl();

//Set all is_change fields to 'No' when form is initially loaded
//Xrm.Page.getAttribute("ftp_ischangemobile").setValue(false);
//Xrm.Page.getAttribute("ftp_ischangehome").setValue(false);
//Xrm.Page.getAttribute("ftp_ischangework").setValue(false);
//Xrm.Page.getAttribute("ftp_ischangepermanentaddress").setValue(false);
//Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").setValue(false);

var subKeys = "";
var apimToken = "";
function vialib_getConfig() {
    //apimUrl = "https://Va-veis-dev-apim.veis.va.gov/EC/VIAEMRService/api";
    //subKeys = "Ocp-Apim-Subscription-Key|88784cf9396e41dab087c90a5da0c2c1";

    //GET CRM SETTINGS WEB SERVICE URLS
    if (subKeys == "") {
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: Xrm.Page.context.getClientUrl() + "/api/data/v9.0/mcs_settings?$filter=(mcs_name%20eq%20%27Active%20Settings%27)",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (data.value.length > 0) {
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
    return new Promise(function(resolve, reject) {
        if (apimToken) {
            resolve(apimToken);
        }
        else {
            vialib_callAction("ftp_APIMGetToken", { "Request": "" },
                function (data) {
                    //	
                    apimToken = data.Response;
                    resolve(apimToken);
                },
                function (error) {
                    console.log(error);
                    reject(error);
                }
            );
        }
    });
}

function checkVIERSUpdatedFields() {
    Xrm.Page.ui.clearFormNotification("PostingToVIERS");
    var ChangeMobile = Xrm.Page.getAttribute("ftp_ischangemobile").getValue() == true;
    var ChangeHome = Xrm.Page.getAttribute("ftp_ischangehome").getValue() == true;
    var ChangeWork = Xrm.Page.getAttribute("ftp_ischangework").getValue() == true;
    var ChangePermAddress = Xrm.Page.getAttribute("ftp_ischangepermanentaddress").getValue() == true;
    var ChangeTempAddress = Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").getValue() == true;

    /*If any of the fields are flagged, run the VIERS update*/
    if (ChangeMobile || ChangeHome || ChangeWork || ChangePermAddress || ChangeTempAddress) {
        Xrm.Page.ui.setFormNotification("Sending update(s) to VIERS...", "INFO", "PostingToVIERS");
        if (!!_ICN && _ICN != "MISSING") {
            var nationalId = _ICN.substring(0, 10);
            if (!!_retrievedSettings && _retrievedSettings.hasOwnProperty("ftp_DACURL")) {
                var dacURL = _retrievedSettings.ftp_DACURL;

                //TODO: change VIERS api usage to new API (E&E)
                var demoAddressUpdateURL = "";
                var demoPhoneUpdateURL = "";
                var demoEmailUpdateURL = "";
                var VIERSAddressUpdateURL = (_retrievedSettings.hasOwnProperty("ftp_VIERSVeteranAddressUpdateURL")) ? _retrievedSettings.ftp_VIERSVeteranAddressUpdateURL : null;
                var VIERSPhoneUpdateURL = (_retrievedSettings.hasOwnProperty("ftp_VIERSVeteranPhoneUpdateURL")) ? _retrievedSettings.ftp_VIERSVeteranPhoneUpdateURL : null;

                var Today = new Date();
                var todayArray = [Today.getFullYear().toString(), (Today.getMonth() + 1).toString(), Today.getDate().toString()];
                todayArray.forEach(function (part, i) { todayArray[i] = (part.length == 1) ? "0" + part : part; });
                var todayString = todayArray.join("-");

                var nextYear = new Date(new Date().setYear(new Date().getFullYear() + 1));
                var nextYearArray = [nextYear.getFullYear().toString(), (nextYear.getMonth() + 1).toString(), nextYear.getDate().toString()];
                nextYearArray.forEach(function (part, i) { nextYearArray[i] = (part.length == 1) ? "0" + part : part; });
                var nextYearString = nextYearArray.join("-");

                if (ChangePermAddress || ChangeTempAddress) {
                    if (!!VIERSAddressUpdateURL) {
                        var viersUpdateUrl = dacURL + VIERSAddressUpdateURL + "json/ftpcrm/000000" + _ICN + "000000";

                        // Update Permenant Address (One call per address)								
                        if (ChangePermAddress) {
                            // Get the fields to send
                            var Address1Line1 = Xrm.Page.getAttribute("address1_line1").getValue();
                            var Address1Line2 = Xrm.Page.getAttribute("address1_line2").getValue();
                            var Address1City = Xrm.Page.getAttribute("address1_city").getValue();
                            var Address1State = Xrm.Page.getAttribute("address1_stateorprovince").getValue();
                            var Address1Postal = Xrm.Page.getAttribute("address1_postalcode").getValue();
                            var Address1Country = Xrm.Page.getAttribute("address1_country").getValue();
                            Address1Country = Address1Country == "USA" ? "US" : Address1Country;

                            var permAddressObject = {
                                "icn": _ICN,
                                "overrideValidation": false,
                                "sourceFormName": "testFormNameValue1", /*where does this come from?*/
                                "sourceOfChangeStationId": "testSrcOfChngStnId", /*where does this come from?*/
                                "contactInfo": {
                                    "recordLifeSpan": {
                                        "start": todayString,
                                        "end": nextYearString
                                    },
                                    "postalAddress": {
                                        "typeAddress": {
                                            "value": "Residence"
                                        },
                                        "address": {
                                            "addressLine1": Address1Line1,
                                            "addressLine2": Address1Line2,
                                            "inCareOf": "",
                                            "attention": "",
                                            "city": Address1City,
                                            "state": Address1State,
                                            "postalCode": Address1Postal,
                                            "country": Address1Country,
                                            "text": ""
                                        }
                                    },
                                    "purposePostalAddress": {
                                        //TODO: check if recordLifeSpan is still part of the business logic; if so, confirm date format
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "coding": {
                                                "code": {
                                                    "value": "Correspondence"
                                                }
                                            }
                                        }
                                    },
                                    "preference": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": "Primary Residence"
                                    },
                                    "isHomeless": false
                                }
                            };
                            postToVIERS(viersUpdateUrl, permAddressObject, "Permanent Address");
                        }

                        // Update Temporary Address (One call per address)								
                        if (ChangeTempAddress) {
                            // Get the fields to send
                            var Address2Line1 = Xrm.Page.getAttribute("address2_line1").getValue();
                            var Address2Line2 = Xrm.Page.getAttribute("address2_line2").getValue();
                            var Address2City = Xrm.Page.getAttribute("address2_city").getValue();
                            var Address2State = Xrm.Page.getAttribute("address2_stateorprovince").getValue();
                            var Address2Postal = Xrm.Page.getAttribute("address2_postalcode").getValue();
                            var Address2Country = Xrm.Page.getAttribute("address2_country").getValue();
                            Address2Country = Address2Country == "USA" ? "US" : Address2Country;

                            var StartDate = Xrm.Page.getAttribute("tri_tempstartdate").getValue();
                            StartDate = !!StartDate ? StartDate : new Date();
                            var startDateArray = [StartDate.getFullYear().toString(), (StartDate.getMonth() + 1).toString(), StartDate.getDate().toString()];
                            startDateArray.forEach(function (part, i) { startDateArray[i] = (part.length == 1) ? "0" + part : part; });
                            var startDateString = startDateArray.join("-");

                            var EndDate = Xrm.Page.getAttribute("tri_tempenddate").getValue();
                            EndDate = !!EndDate ? EndDate : new Date(new Date().setYear(new Date().getFullYear() + 1));
                            var endDateArray = [EndDate.getFullYear().toString(), (EndDate.getMonth() + 1).toString(), EndDate.getDate().toString()];
                            endDateArray.forEach(function (part, i) { endDateArray[i] = (part.length == 1) ? "0" + part : part; });
                            var endDateString = endDateArray.join("-");

                            var tempAddressObject = {
                                "icn": _ICN,
                                "overrideValidation": false,
                                "sourceFormName": "testFormNameValue1",
                                "sourceOfChangeStationId": "testSrcOfChngStnId",
                                "contactInfo": {
                                    "recordLifeSpan": {
                                        "start": startDateString,
                                        "end": endDateString
                                    },
                                    "postalAddress": {
                                        "typeAddress": {
                                            "value": "Residence"
                                        },
                                        "address": {
                                            "addressLine1": Address2Line1,
                                            "addressLine2": Address2Line2,
                                            "inCareOf": "",
                                            "attention": "",
                                            "city": Address2City,
                                            "state": Address2State,
                                            "postalCode": Address2Postal,
                                            "country": Address2Country,
                                            "text": ""
                                        }
                                    },
                                    "purposePostalAddress": {
                                        "recordLifeSpan": {
                                            "start": startDateString
                                        },
                                        "type": {
                                            "coding": {
                                                "code": {
                                                    "value": "Correspondence"
                                                }
                                            }
                                        }
                                    },
                                    "preference": {
                                        "recordLifeSpan": {
                                            "start": startDateString
                                        },
                                        "type": "Primary Residence"
                                    },
                                    "isHomeless": false
                                }
                            };
                            postToVIERS(viersUpdateUrl, tempAddressObject, "Temporary Address");
                        }
                    }
                    else {
                        Xrm.Page.ui.setFormNotification("Could not find VIERS Address API URL from retrieved 'Active Settings'; aborting VIERS update", "ERROR", "VIERSError");
                    }
                }

                if (ChangeMobile || ChangeHome || ChangeWork) {
                    if (!!VIERSPhoneUpdateURL) {
                        var viersUpdateUrl = dacURL + VIERSPhoneUpdateURL + "json/ftpcrm/000000" + _ICN + "000000";

                        // Update Mobile (One call per number)
                        if (ChangeMobile) {
                            //Get the number
                            var Mobile = Xrm.Page.getAttribute("ftp_mobilephone").getValue();
                            if (!!Mobile) {
                                Mobile = Mobile.replace(" ", "").replace("-", "").replace("(", "").replace(")", "");
                            }

                            var mobileNumberObject = {
                                "icn": _ICN,
                                "contactInfo": {
                                    "recordLifeSpan": {
                                        "start": todayString
                                    },
                                    "phoneNumber": {
                                        "typePhone": {
                                            "value": "Cell / Mobile"
                                        },
                                        "isDomestic": true,
                                        "domesticAreaCode": Mobile.substring(0, 3),
                                        "domesticSubscriberNumber": Mobile.substring(3, 7),
                                        /*"extension":"",*/
                                        "ordinality": {
                                            "value": "Primary"
                                        }
                                    },
                                    "purposePhoneNumber": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "coding": {
                                                "code": {
                                                    "value": "Text Message Capable"
                                                }
                                            }
                                        }
                                    },
                                    "preference": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "value": "Work"
                                        }
                                    },
                                    "isHomeless": false
                                }
                            };
                            postToVIERS(viersUpdateUrl, mobileNumberObject, "Mobile Phone");
                        }

                        // Update Home (One call per number)
                        if (ChangeHome) {
                            //Get the number
                            var Home = Xrm.Page.getAttribute("ftp_homephone").getValue();
                            if (!!Home) {
                                Home = Home.replace(" ", "").replace("-", "").replace("(", "").replace(")", "");
                            }

                            var homeNumberObject = {
                                "icn": _ICN,
                                "contactInfo": {
                                    "recordLifeSpan": {
                                        "start": todayString
                                    },
                                    "phoneNumber": {
                                        "typePhone": {
                                            "value": "Home"
                                        },
                                        "isDomestic": true,
                                        "domesticAreaCode": Home.substring(0, 3),
                                        "domesticSubscriberNumber": Home.substring(3, 7),
                                        /*"extension":"",*/
                                        "ordinality": {
                                            "value": "Primary"
                                        }
                                    },
                                    "purposePhoneNumber": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "coding": {
                                                "code": {
                                                    "value": ""
                                                }
                                            }
                                        }
                                    },
                                    "preference": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "value": "Home"
                                        }
                                    },
                                    "isHomeless": false
                                }
                            };
                            postToVIERS(viersUpdateUrl, homeNumberObject, "Home Phone");
                        }

                        // Update Work (One call per number)
                        if (ChangeWork) {
                            //Get the number
                            var Work = Xrm.Page.getAttribute("ftp_workphone").getValue();
                            if (!!Work) {
                                Work = Work.replace(" ", "").replace("-", "").replace("(", "").replace(")", "");
                            }

                            var workNumberObject = {
                                "icn": _ICN,
                                "contactInfo": {
                                    "recordLifeSpan": {
                                        "start": todayString
                                    },
                                    "phoneNumber": {
                                        "typePhone": {
                                            "value": "Work"
                                        },
                                        "isDomestic": true,
                                        "domesticAreaCode": Work.substring(0, 3),
                                        "domesticSubscriberNumber": Work.substring(3, 7),
                                        /*"extension":"",*/
                                        "ordinality": {
                                            "value": "Primary"
                                        }
                                    },
                                    "purposePhoneNumber": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "coding": {
                                                "code": {
                                                    "value": ""
                                                }
                                            }
                                        }
                                    },
                                    "preference": {
                                        "recordLifeSpan": {
                                            "start": todayString
                                        },
                                        "type": {
                                            "value": "Home"
                                        }
                                    },
                                    "isHomeless": false
                                }
                            };
                            postToVIERS(viersUpdateUrl, workNumberObject, "Work Phone");
                        }
                    }
                    else {
                        Xrm.Page.ui.setFormNotification("Could not find VIERS Phone Number API URL from retrieved 'Active Settings'; aborting VIERS update", "ERROR", "VIERSError");
                    }
                }
            }
            else {
                Xrm.Page.ui.setFormNotification("Could not build VIERS URL from retrieved 'Active Settings'; aborting VIERS update", "ERROR", "VIERSError");
            }
        }
        else {
            Xrm.Page.ui.setFormNotification("Could not send update(s) to VIERS. No ICN provided.", "ERROR", "VIERSError");
            return;
        }
        // Clear the checkboxes and fire onChange
        Xrm.Page.getAttribute("ftp_ischangemobile").setValue(0); Xrm.Page.getAttribute("ftp_ischangemobile").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangehome").setValue(0); Xrm.Page.getAttribute("ftp_ischangehome").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangework").setValue(0); Xrm.Page.getAttribute("ftp_ischangework").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangepermanentaddress").setValue(0); Xrm.Page.getAttribute("ftp_ischangepermanentaddress").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").setValue(0); Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").fireOnChange();
    }
}

function postToVIERS(pUrl, pDataObject, pField) {
    var thisSuccessNotificationName = "VIERSSuccess" + pField.replace(" ", "");
    var thisErrorNotificationName = "VIERSError" + pField.replace(" ", "");
    Xrm.Page.ui.clearFormNotification(thisSuccessNotificationName);
    Xrm.Page.ui.clearFormNotification(thisErrorNotificationName);
    if (!!pUrl && !!pDataObject) {
        jQuery.support.cors = true;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: pUrl,
            data: JSON.stringify(pDataObject),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (response, textStatus, XmlHttpRequest) {
                Xrm.Page.ui.clearFormNotification("PostingToVIERS");
                writeToConsole("inside postToVIERS ajax success");
                if (!!response.Data && response.Data.IsSuccessful == true) {
                    var statusCodingDisplay = getDeepProperty("Data.updateRequest.status.coding.display", response);
                    /*example: "Inflight data failed validation/Vet CI NOT Updtd"*/
                    if (statusCodingDisplay.toLowerCase().indexOf("failed") == -1) {
                        //notify
                        Xrm.Page.ui.setFormNotification("Updated " + pField + " in VIERS", "INFO", thisSuccessNotificationName);
                        setTimeout(function () { Xrm.Page.ui.clearFormNotification(thisSuccessNotificationName); }, 7500);

                        //log it
                        if (!!VCCM && !!VCCM.IntegrationLogging && typeof VCCM.IntegrationLogging.LogSuccess == "function") {
                            VCCM.IntegrationLogging.LogSuccess(
                                null,
                                "VIERS",
                                pUrl,
                                new Date(),
                                null,
                                "ftp_veteran",
                                { Id: Xrm.Page.data.entity.getId(), LogicalName: Xrm.Page.data.entity.getEntityName(), Name: Xrm.Page.data.entity.getPrimaryAttributeValue() },
                                function (x) { writeToConsole("logged success"); },
                                function (e) { }
                            );
                        }
                    }
                    else {
                        var dataQualityStatusText = getDeepProperty("Data.updateRequest.dataQuality.status.type.text", response);
                        var errorMessage = (dataQualityStatusText.toLowerCase() == "quality") ? "Unknown error" : dataQualityStatusText;
                        Xrm.Page.ui.setFormNotification("Error updating veteran " + pField + " in VIERS: " + errorMessage, "ERROR", thisErrorNotificationName);
                        setTimeout(function () { Xrm.Page.ui.clearFormNotification(thisErrorNotificationName); }, 10000);
                        //log it
                        if (!!VCCM && !!VCCM.IntegrationLogging && typeof VCCM.IntegrationLogging.LogFailure == "function") {
                            VCCM.IntegrationLogging.LogFailure(
                                null,
                                "VIERS",
                                pUrl,
                                new Date(),
                                null,
                                errorMessage,
                                "ftp_veteran",
                                { Id: Xrm.Page.data.entity.getId(), LogicalName: Xrm.Page.data.entity.getEntityName(), Name: Xrm.Page.data.entity.getPrimaryAttributeValue() },
                                function (x) { writeToConsole("logged failure"); },
                                function (e) { }
                            );
                        }
                    }
                }
                else {
                    /*handle 'Fault' from VIERS API*/
                    var responseFaultText = getDeepProperty("Data.Fault.text", response);
                    var faultText = !!responseFaultText ? responseFaultText : "Unknown fault.";
                    Xrm.Page.ui.setFormNotification("Error updating veteran " + pField + " in VIERS: " + faultText, "ERROR", thisErrorNotificationName);
                    setTimeout(function () { Xrm.Page.ui.clearFormNotification(thisErrorNotificationName); }, 7500);

                    //log it
                    if (!!VCCM && !!VCCM.IntegrationLogging && typeof VCCM.IntegrationLogging.LogFailure == "function") {
                        VCCM.IntegrationLogging.LogFailure(
                            null,
                            "VIERS",
                            pUrl,
                            new Date(),
                            null,
                            faultText,
                            "ftp_veteran",
                            { Id: Xrm.Page.data.entity.getId(), LogicalName: Xrm.Page.data.entity.getEntityName(), Name: Xrm.Page.data.entity.getPrimaryAttributeValue() },
                            function (x) { writeToConsole("logged failure"); },
                            function (e) { }
                        );
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Xrm.Page.ui.clearFormNotification("PostingToVIERS");
                Xrm.Page.ui.setFormNotification("Error updating veteran " + pField + " in VIERS: " + errorThrown, "ERROR", thisErrorNotificationName);
                setTimeout(function () { Xrm.Page.ui.clearFormNotification(thisErrorNotificationName); }, 7500);
                writeToConsole("inside postToVIERS ajax error: " + errorThrown + ". " + XMLHttpRequest.responseText);

                //log it
                if (!!VCCM && !!VCCM.IntegrationLogging && typeof VCCM.IntegrationLogging.LogFailure == "function") {
                    VCCM.IntegrationLogging.LogFailure(
                        null,
                        "VIERS",
                        pUrl,
                        new Date(),
                        null,
                        errorThrown,
                        "ftp_veteran",
                        { Id: Xrm.Page.data.entity.getId(), LogicalName: Xrm.Page.data.entity.getEntityName(), Name: Xrm.Page.data.entity.getPrimaryAttributeValue() },
                        function (x) { writeToConsole("logged failure"); },
                        function (e) { }
                    );
                }
            },
            async: true,
            cache: false
        });
    }
}

function ftp_ischangemobile_onChange() {
    /*unlock mobile phone control when Change Mobile Phone = true, else lock*/
    var enableField = Xrm.Page.getAttribute("ftp_ischangemobile").getValue() == true;
    Xrm.Page.getControl("ftp_mobilephone").setDisabled(!enableField);
}
function ftp_ischangehome_onChange() {
    /*unlock home phone control when Change Home Phone = true, else lock*/
    var enableField = Xrm.Page.getAttribute("ftp_ischangehome").getValue() == true;
    Xrm.Page.getControl("ftp_homephone").setDisabled(!enableField);
}
function ftp_ischangework_onChange() {
    /*unlock work phone control when Change Work Phone = true, else lock*/
    var enableField = Xrm.Page.getAttribute("ftp_ischangework").getValue() == true;
    Xrm.Page.getControl("ftp_workphone").setDisabled(!enableField);
}
function ftp_ischangepermanentaddress_onChange() {
    /*unlock permanent address composite controls when Change Permanent Address = true, else lock them*/
    var enableField = Xrm.Page.getAttribute("ftp_ischangepermanentaddress").getValue() == true;
    var fieldsToUnlock = [
        "address1_composite_compositionLinkControl_address1_line1",
        "address1_composite_compositionLinkControl_address1_line2",
        "address1_composite_compositionLinkControl_address1_line3",
        "address1_composite_compositionLinkControl_address1_city",
        "address1_composite_compositionLinkControl_address1_stateorprovince",
        "address1_composite_compositionLinkControl_address1_postalcode",
        "address1_composite_compositionLinkControl_address1_country"
    ];
    for (var i = 0; i < fieldsToUnlock.length; i++) {
        var con = Xrm.Page.getControl(fieldsToUnlock[i]);
        if (!!con) {
            con.setDisabled(!enableField);
        }
    }
}
function ftp_ischangetemporaryaddress_onChange() {
    /*unlock temp address composite controls when Change Temporary Address = true, else lock them*/
    var enableField = Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").getValue() == true;
    Xrm.Page.getControl("tri_tempstartdate").setDisabled(!enableField);
    Xrm.Page.getControl("tri_tempenddate").setDisabled(!enableField);
    var fieldsToUnlock = [
        "address2_composite_compositionLinkControl_address2_line1",
        "address2_composite_compositionLinkControl_address2_line2",
        "address2_composite_compositionLinkControl_address2_line3",
        "address2_composite_compositionLinkControl_address2_city",
        "address2_composite_compositionLinkControl_address2_stateorprovince",
        "address2_composite_compositionLinkControl_address2_postalcode",
        "address2_composite_compositionLinkControl_address2_country"
    ];
    for (var i = 0; i < fieldsToUnlock.length; i++) {
        var con = Xrm.Page.getControl(fieldsToUnlock[i]);
        if (!!con) {
            con.setDisabled(!enableField);
        }
    }
}

/*Branch and Rank API call(s)*/
function getBranchAndRankFromVIERS() {
    writeToConsole("inside getBranchAndRankFromVIERS");
    var branchCodeIndex = {
        "F": "Air Force",
        "N": "Navy",
        "C": "Coast Guard",
        "A": "Army",
        "M": "Marines",
        "D": "DoD",
        "H": "Public Health Service",
        "O": "NOAA",
        "X": "Other",
        "Z": "Unknown",
        "1": "Foreign Army",
        "2": "Foreign Navy",
        "3": "Foreign Marine Corps",
        "4": "Foreign Air Force",
        "5": "Foreign Coast Guard"
    };

    var bosAttr = Xrm.Page.getAttribute("ftp_branchofservice");
    var rankAttr = Xrm.Page.getAttribute("ftp_militaryrank_text"); //text field for now. (expecting a future solution with a useful global option set)
    if (!!bosAttr && !!rankAttr) {
        if (!!_EDIPI && _EDIPI != "UNK") {
            if (!!_retrievedSettings && !!_retrievedSettings.ftp_DACURL) {
                if (!!_retrievedSettings.ftp_VIERSServiceEpisodesAPIURL) {
                    var fullUrl = _retrievedSettings.ftp_DACURL + _retrievedSettings.ftp_VIERSServiceEpisodesAPIURL + _EDIPI + "/EDIPI";
                    fullUrl.toLowerCase().replace("xml", "json");
                    var dType = fullUrl.indexOf("json") > -1 ? "json" : "text";
                    var cType = fullUrl.indexOf("json") > -1 ? "application/json; charset=utf-8" : "charset=utf-8";
                    var viersDataForUSD = [];
                    $.ajax({
                        type: "GET",
                        contentType: cType,
                        datatype: dType,
                        url: fullUrl,
                        beforeSend: function (XMLHttpRequest) {
                            if (dType == "json") XMLHttpRequest.setRequestHeader("Accept", "application/json");
                        },
                        success: function (response, textStatus, XmlHttpRequest) {
                            writeToConsole("inside getBranchAndRankFromVIERS() API query success callback");
                            if (!!response) {
                                var bosName = "";
                                var rankName = "";
                                if (dType == "json") {
                                    if (response.hasOwnProperty("ErrorOccurred") && response.ErrorOccurred == false) {
                                        viersDataForUSD.push("GotResponse=true");
                                        if (!!response.Data && Array.isArray(response.Data) && response.Data.length > 0) {
                                            //sort service episodes by ServiceEpisodeEndDate and get latest
                                            var latestServiceEpisode = response.Data.sort(SortObjectArray("-ServiceEpisodeEndDate"))[0];
                                            /*TODO: find proper name for branch of service.  hard coded a basic mapping object for now*/
                                            bosName = !!latestServiceEpisode.BranchOfServiceCode ? branchCodeIndex[latestServiceEpisode.BranchOfServiceCode] : "";
                                            rankName = !!latestServiceEpisode.RankCodeName ? latestServiceEpisode.RankCodeName : "";
                                        }
                                        try {
                                            writeToConsole("branch: " + bosName);
                                            writeToConsole("rank: " + rankName);

                                            if (!!bosName) {
                                                viersDataForUSD.push("branchOfService=" + bosName);
                                                bosAttr.setValue(bosName);
                                                bosAttr.setSubmitMode("always");
                                                bosAttr.fireOnChange();
                                            }
                                            if (!!rankName) {
                                                viersDataForUSD.push("rank=" + rankName);
                                                rankAttr.setValue(rankName);
                                                rankAttr.setSubmitMode("always");
                                                rankAttr.fireOnChange();
                                            }
                                            if (viersDataForUSD.length > 0) {
                                                VCCM.USDHelper.CopyDataToReplacementParameters("VIERS", viersDataForUSD, false);
                                            }
                                            //Removed at customer's request on 11/20/17
                                            //updateMilitaryImages();
                                        }
                                        catch (e) {
                                            alert("error in getBranchAndRankFromVIERS(): " + e.message);
                                        }
                                    }
                                    else {
                                        //need to show error message? meh.
                                    }
                                }
                                else {/*xml*/

                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error("error querying VIERS for military info");
                            writeToConsole(XMLHttpRequest.responseJSON);
                            Xrm.Page.ui.setFormNotification("Error querying VIERS for branch of service and rank...", "ERROR", "VIERSMIL");
                            setTimeout(function () { Xrm.Page.ui.clearFormNotification("VIERSMIL"); }, 5000);
                        },
                        async: true,
                        cache: false
                    });
                }
                else {
                    Xrm.Page.ui.setFormNotification("Did not VIERS for branch of service and rank. Missing API URLs from Active Settings.", "ERROR", "VIERSMIL");
                    setTimeout(function () { Xrm.Page.ui.clearFormNotification("VIERSMIL"); }, 5000);
                }
            }
            else {
                //missing DAC URL
            }
        }
        else {
            //cannot query ftp_VIERSServiceEpisodesAPIURL for military branch & rank without veteran's EDIPI
        }
    }
    else {
        //fields not on form
    }
}

function ftp_branchofservice_onChange() {
    writeToConsole("inside ftp_branchofservice_onChange()");
    var data = [];
    data.push("branchOfService=" + Xrm.Page.getAttribute("ftp_branchofservice").getValue());
    data.push("rank=" + Xrm.Page.getAttribute("ftp_militaryrank_text").getValue());
    VCCM.USDHelper.CopyDataToReplacementParameters("VIERS", data, false);
}
function ftp_militaryrank_text_onChange() {
    writeToConsole("inside ftp_militaryrank_text_onChange()");
    var data = [];
    data.push("branchOfService=" + Xrm.Page.getAttribute("ftp_branchofservice").getValue());
    data.push("rank=" + Xrm.Page.getAttribute("ftp_militaryrank_text").getValue());
    VCCM.USDHelper.CopyDataToReplacementParameters("VIERS", data, false);
}
function updateMilitaryImages() {
    //var wrObject = Xrm.Page.getControl("WebResource_MilitaryInfo");
    //if (!!wrObject && !!wrObject.getObject() && !!wrObject.getObject().contentWindow && typeof wrObject.getObject().contentWindow.loadImages == "function") {
    //    wrObject.getObject().contentWindow.loadImages();
    //}
    //else {
    //    setTimeout(function () { updateMilitaryImages(); }, 5000);
    //}
}


Xrm.Utility.freq_buttonAction = function (freq_buttonName) {

    try {
        if (freq_buttonName != null && freq_buttonName != undefined && freq_buttonName != "") {
            //Verify button name and take action accordingly
            if (freq_buttonName == "ApplyAddressPhoneButton") {
                //Save the current CRM data
                //Xrm.Page.data.entity.save();
                //Apply Address Phone button clicked
                adph_checkAddrPhoneUpdatedFields();
            }
            else {
                alert("The Frequently Used button named '" + freq_buttonName + "' has not been defined in this application, please contact your system administrator!");
                return false;
            }
        }
        else {
            alert("The Frequently Used button in use has been defined incorrectly, please contact your system administrator!");
            return false;
        }

    }
    catch (err) {
        alert('Veteran Frequently Used Button Script Function Error(freq_buttonAction): ' + err.message);
    }
}

function adph_checkAddrPhoneUpdatedFields() {
    try {
        Xrm.Page.ui.clearFormNotification("EsrAddrPhoneUpdate");
        var adph_ChangeMobile = Xrm.Page.getAttribute("ftp_ischangemobile").getValue() == true;
        var adph_ChangeHome = Xrm.Page.getAttribute("ftp_ischangehome").getValue() == true;
        var adph_ChangeWork = Xrm.Page.getAttribute("ftp_ischangework").getValue() == true;
        var adph_ChangePermAddress = Xrm.Page.getAttribute("ftp_ischangepermanentaddress").getValue() == true;
        var adph_ChangeTempAddress = Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").getValue() == true;

        //**********************************************************************************
        //_ICN = "1012901147V954482";   //Temporary Value for testing as Marcy VccmWalters
        //**********************************************************************************

        //If any of the phone or address section are marked for changes, process the updates
        if (adph_ChangeMobile || adph_ChangeHome || adph_ChangeWork || adph_ChangePermAddress || adph_ChangeTempAddress) {
            //Validate all required fields to perform integration
            var adph_DeceasedDate = Xrm.Page.getAttribute("ftp_deceaseddate").getValue();
            if (adph_DeceasedDate != null && adph_DeceasedDate != "") {
                alert("The veteran is listed as deceased, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            var adph_FirstName = Xrm.Page.getAttribute("firstname").getValue();
            if (adph_FirstName == null || adph_FirstName == "") {
                alert("The veteran does not have a first name, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            var adph_LastName = Xrm.Page.getAttribute("lastname").getValue();
            if (adph_LastName == null || adph_LastName == "") {
                alert("The veteran does not have a last name, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            var adph_GovernmentId = Xrm.Page.getAttribute("governmentid").getValue();
            if (adph_GovernmentId == null || adph_GovernmentId == "") {
                alert("The veteran does not have a social security number, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            var adph_Gender = Xrm.Page.getAttribute("ftp_gender").getValue();
            if (adph_Gender == null || adph_Gender == "") {
                alert("The veteran does not have a gender, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            var adph_DOB = Xrm.Page.getAttribute("ftp_dateofbirth").getValue();
            if (adph_DOB == null || adph_DOB == "") {
                alert("The veteran does not have a date of birth, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            //Test for _ICN, this will only work with USD
            if (_ICN == undefined) {
                alert("The veteran ICN does not exist, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }
            if (_ICN == null || _ICN == "") {
                alert("The veteran ICN does not have a value, address or phone cannot be updated at this time!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }

            //Test for temporary address start and end dates
            if (adph_ChangeTempAddress) {
                var adph_crmStartDate = Xrm.Page.getAttribute("tri_tempstartdate").getValue();
                var adph_crmEndDate = Xrm.Page.getAttribute("tri_tempenddate").getValue();
                if (adph_crmStartDate == null || adph_crmEndDate == null) {
                    alert("The temporary address is missing a Start or End Date, please correct and retry!");
                    return false;
                }
                if (adph_crmEndDate < adph_crmStartDate) {
                    alert("The temporary address End Date is before the Start Date, please correct and retry!");
                    return false;
                }
            }

            //Turn on Integration Notification
            Xrm.Page.ui.setFormNotification("Sending update(s) to ESR...", "INFO", "EsrAddrPhoneUpdate");

            //GET CRM SETTINGS WEB SERVICE URLS

            var adph_conditionalFilter = "(mcs_name eq 'Active Settings')";
            adph_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_ESRVeteranAddressUpdateURL', adph_conditionalFilter, 'mcs_name', 'asc', 0, adph_SettingsWebServiceURL_response, '');
        }
        else {
            alert("There are no phone or address changes to apply, action cancelled!");
            return false;
        }
    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_checkAddrPhoneUpdatedFields): ' + err.message);
    }
}

function adph_SettingsWebServiceURL_response(adph_settingData, adph_lastSkip, adph_NoUrl_NA) {
    try {

        //adph_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var adph_DacUrl = null;
        var adph_EsrVeteranAddressUpdateApiUrl = null;

        for (var i = 0; i <= adph_settingData.d.results.length - 1; i++) {
            //Get info
            if (adph_settingData.d.results[i].ftp_DACURL != null) { adph_DacUrl = adph_settingData.d.results[i].ftp_DACURL; }
            if (adph_settingData.d.results[i].ftp_ESRVeteranAddressUpdateURL != null) { adph_EsrVeteranAddressUpdateApiUrl = adph_settingData.d.results[i].ftp_ESRVeteranAddressUpdateURL; }
            break;
        }

        if (adph_DacUrl != null && adph_EsrVeteranAddressUpdateApiUrl != null) {
            //Construct full web service URL
            adph_ESRAddressUpdateURL = adph_DacUrl + adph_EsrVeteranAddressUpdateApiUrl;
        }
        else {
            Xrm.Page.ui.setFormNotification("ERROR: THE ESR VETERAN ADDRESS AND PHONE UPDATE SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!", "ERROR", "ESRSERVICE");
            adph_clearEsrUpdateCheckboxes();
            Xrm.Page.ui.clearFormNotification("EsrAddrPhoneUpdate");
        }

        //Process Updates
        adph_processAddressPhoneChange();
    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_SettingsWebServiceURL_response): ' + err.message);
    }
}

function adph_clearEsrUpdateCheckboxes() {
    try {
        // Clear the checkboxes and fire onChange
        Xrm.Page.getAttribute("ftp_ischangemobile").setValue(0); Xrm.Page.getAttribute("ftp_ischangemobile").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangehome").setValue(0); Xrm.Page.getAttribute("ftp_ischangehome").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangework").setValue(0); Xrm.Page.getAttribute("ftp_ischangework").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangepermanentaddress").setValue(0); Xrm.Page.getAttribute("ftp_ischangepermanentaddress").fireOnChange();
        Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").setValue(0); Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").fireOnChange();
        Xrm.Page.ui.clearFormNotification("EsrAddrPhoneUpdate");
    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_clearEsrUpdateCheckboxes): ' + err.message);
    }
}

function adph_finishAddressPhoneUpdates() {
    //Demograhics Update complete
    alert("The selected address and phone number updates were submitted successfully.");
    Xrm.Page.ui.clearFormNotification("EsrAddrPhoneUpdate");
    adph_clearEsrUpdateCheckboxes();

    Xrm.Page.data.save();
    return false;
}

function adph_processAddressPhoneChange() {
    //Process all Address and Phone changes in one transaction with the ESR service
    try {
        //Construct Permanent Address object
        var adph_permanentAddressObject = null;
        var adph_ChangePermAddress = Xrm.Page.getAttribute("ftp_ischangepermanentaddress").getValue() == true;
        if (adph_ChangePermAddress) {
            var adph_city = Xrm.Page.getAttribute("address1_city").getValue();
            if (adph_city == null) { adph_city = ""; }
            var adph_country = Xrm.Page.getAttribute("address1_country").getValue();
            if (adph_country == null) { adph_country = ""; }
            var adph_county = "";
            var adph_line1 = Xrm.Page.getAttribute("address1_line1").getValue();
            if (adph_line1 == null) { adph_line1 = ""; }
            var adph_line2 = Xrm.Page.getAttribute("address1_line2").getValue();
            if (adph_line2 == null) { adph_line2 = ""; }
            var adph_line3 = Xrm.Page.getAttribute("address1_line3").getValue();
            if (adph_line3 == null) { adph_line3 = ""; }
            var adph_postalCode = "";
            var adph_provinceCode = "";
            var adph_state = Xrm.Page.getAttribute("address1_stateorprovince").getValue();
            if (adph_state == null) { adph_state = ""; }
            var adph_zip = Xrm.Page.getAttribute("address1_postalcode").getValue();
            if (adph_zip == null) { adph_zip = ""; }
            var adph_zipPlus4 = "";
            var adph_addressChangeDateTime = "";
            var adph_addressChangeEffectiveDate = "";
            var adph_addressChangeSite = "";
            var adph_addressChangeSource = "";
            var adph_endDate = "";
            var adph_addressTypeCode = "P";

            adph_permanentAddressObject = {
                "city": adph_city,
                "country": adph_country,
                "county": adph_county,
                "line1": adph_line1,
                "line2": adph_line2,
                "line3": adph_line3,
                "postalCode": adph_postalCode,
                "provinceCode": adph_provinceCode,
                "state": adph_state,
                "zip": adph_zip,
                "zipPlus4": adph_zipPlus4,
                "addressChangeDateTime": adph_addressChangeDateTime,
                "addressChangeEffectiveDate": adph_addressChangeEffectiveDate,
                "addressChangeSite": adph_addressChangeSite,
                "addressChangeSource": adph_addressChangeSource,
                "endDate": adph_endDate,
                "addressTypeCode": adph_addressTypeCode
            };
        }

        //Construct Temporary Address object
        var adph_temporaryAddressObject = null;
        var adph_ChangeTempAddress = Xrm.Page.getAttribute("ftp_ischangetemporaryaddress").getValue() == true;
        if (adph_ChangeTempAddress) {
            var adph_city = Xrm.Page.getAttribute("address2_city").getValue();
            if (adph_city == null) { adph_city = ""; }
            var adph_country = Xrm.Page.getAttribute("address2_country").getValue();
            if (adph_country == null) { adph_country = ""; }
            var adph_county = "";
            var adph_line1 = Xrm.Page.getAttribute("address2_line1").getValue();
            if (adph_line1 == null) { adph_line1 = ""; }
            var adph_line2 = Xrm.Page.getAttribute("address2_line2").getValue();
            if (adph_line2 == null) { adph_line2 = ""; }
            var adph_line3 = Xrm.Page.getAttribute("address2_line3").getValue();
            if (adph_line3 == null) { adph_line3 = ""; }
            var adph_postalCode = "";
            var adph_provinceCode = "";
            var adph_state = Xrm.Page.getAttribute("address2_stateorprovince").getValue();
            if (adph_state == null) { adph_state = ""; }
            var adph_zip = Xrm.Page.getAttribute("address2_postalcode").getValue();
            if (adph_zip == null) { adph_zip = ""; }
            var adph_zipPlus4 = "";
            var adph_addressChangeDateTime = "";
            var adph_addressChangeEffectiveDate = "";
            var adph_crmStartDate = Xrm.Page.getAttribute("tri_tempstartdate").getValue();
            if (adph_crmStartDate != null) {
                adph_addressChangeEffectiveDate = adph_formatTwoDigits(adph_crmStartDate.getDate()) + "/" + adph_formatTwoDigits(adph_crmStartDate.getMonth() + 1) + "/" + adph_crmStartDate.getFullYear();
            }
            var adph_addressChangeSite = "";
            var adph_addressChangeSource = "";
            var adph_endDate = "";
            var adph_crmEndDate = Xrm.Page.getAttribute("tri_tempenddate").getValue();
            if (adph_crmEndDate != null) {
                adph_endDate = adph_formatTwoDigits(adph_crmEndDate.getDate()) + "/" + adph_formatTwoDigits(adph_crmEndDate.getMonth() + 1) + "/" + adph_crmEndDate.getFullYear();
            }
            var adph_addressTypeCode = "C";

            adph_temporaryAddressObject = {
                "city": adph_city,
                "country": adph_country,
                "county": adph_county,
                "line1": adph_line1,
                "line2": adph_line2,
                "line3": adph_line3,
                "postalCode": adph_postalCode,
                "provinceCode": adph_provinceCode,
                "state": adph_state,
                "zip": adph_zip,
                "zipPlus4": adph_zipPlus4,
                "addressChangeDateTime": adph_addressChangeDateTime,
                "addressChangeEffectiveDate": adph_addressChangeEffectiveDate,
                "addressChangeSite": adph_addressChangeSite,
                "addressChangeSource": adph_addressChangeSource,
                "endDate": adph_endDate,
                "addressTypeCode": adph_addressTypeCode
            };
        }

        //Construct Mobile Phone object
        var adph_mobilePhoneObject = null;
        var adph_ChangeMobile = Xrm.Page.getAttribute("ftp_ischangemobile").getValue() == true;
        if (adph_ChangeMobile) {
            var adph_MobilePhone = Xrm.Page.getAttribute("ftp_mobilephone").getValue();
            if (adph_MobilePhone != null) {
                adph_MobilePhone = adph_MobilePhone.replace(/ /g, "").replace(/-/g, "").replace("(", "").replace(")", "");
            } else { adph_MobilePhone = ""; }
            var adph_phoneType = "4";

            adph_mobilePhoneObject = {
                "phoneNumber": adph_MobilePhone,
                "type": adph_phoneType
            };
        }

        //Construct Home Phone object
        var adph_homePhoneObject = null;
        var adph_ChangeHome = Xrm.Page.getAttribute("ftp_ischangehome").getValue() == true;
        if (adph_ChangeHome) {
            var adph_HomePhone = Xrm.Page.getAttribute("ftp_homephone").getValue();
            if (adph_HomePhone != null) {
                adph_HomePhone = adph_HomePhone.replace(/ /g, "").replace(/-/g, "").replace("(", "").replace(")", "");
            } else { adph_HomePhone = ""; }
            var adph_phoneType = "1";

            adph_homePhoneObject = {
                "phoneNumber": adph_HomePhone,
                "type": adph_phoneType
            };
        }

        //Construct Work Phone object
        var adph_workPhoneObject = null;
        var adph_ChangeWork = Xrm.Page.getAttribute("ftp_ischangework").getValue() == true;
        if (adph_ChangeWork) {
            var adph_WorkPhone = Xrm.Page.getAttribute("ftp_workphone").getValue();
            if (adph_WorkPhone != null) {
                adph_WorkPhone = adph_WorkPhone.replace(/ /g, "").replace(/-/g, "").replace("(", "").replace(")", "");
            } else { adph_WorkPhone = ""; }
            var adph_phoneType = "2";

            adph_workPhoneObject = {
                "phoneNumber": adph_WorkPhone,
                "type": adph_phoneType
            };
        }

        //Update ESR
        adph_postCombinedEsrAddressPhoneUpdate(adph_permanentAddressObject, adph_temporaryAddressObject, adph_mobilePhoneObject, adph_homePhoneObject, adph_workPhoneObject, adph_postCombinedEsrAddressPhoneUpdate_response);
    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_processAddressPhoneChange): ' + err.message);
    }
}

function adph_postCombinedEsrAddressPhoneUpdate(adph_permanentAddressObject, adph_temporaryAddressObject, adph_mobilePhoneObject, adph_homePhoneObject, adph_workPhoneObject, adph_nextFunction) {
    //This function is used to post ESR Veteran Address and Phone Updates in a single ESR update
    //adph_permanentAddressObject is the permanent address object, contains null if no update
    //adph_temporaryAddressObject is the temporary address object, contains null if no update
    //adph_mobilePhoneObject is the mobile phone object, contains null if no update
    //adph_homePhoneObject is the home phone object, contains null if no update
    //adph_workPhoneObject is the work phone object, contains null if no update
    //adph_nextFunction is the callback function to fire off next step

    try {
        var adph_demographicData = "";
        var adph_postURL = "";
        var adph_FirstName = Xrm.Page.getAttribute("firstname").getValue();
        var adph_LastName = Xrm.Page.getAttribute("lastname").getValue();
        var adph_GovernmentId = Xrm.Page.getAttribute("governmentid").getValue();
        var adph_Gender = Xrm.Page.getAttribute("ftp_gender").getValue();
        var adph_DOB = Xrm.Page.getAttribute("ftp_dateofbirth").getValue();
        var adph_DOB_formatted = adph_DOB.substr(4, 2) + "/" + adph_DOB.substr(6, 2) + "/" + adph_DOB.substr(0, 4);
        var adph_ICN = _ICN;

        //Create Combined Address Object
        var adph_combinedAddressObject = null;
        if (adph_permanentAddressObject != null || adph_temporaryAddressObject != null) {
            if (adph_permanentAddressObject != null && adph_temporaryAddressObject != null) {
                //Include both addresses
                adph_combinedAddressObject = [adph_permanentAddressObject, adph_temporaryAddressObject];
            }
            else {
                if (adph_permanentAddressObject != null) {
                    //Include permanent address only
                    adph_combinedAddressObject = [adph_permanentAddressObject];
                }
                else {
                    //Include temporary address only
                    adph_combinedAddressObject = [adph_temporaryAddressObject];
                }
            }
        }

        //Create Combined Phone Object
        var adph_combinedPhoneObject = null;
        if (adph_mobilePhoneObject != null || adph_homePhoneObject != null || adph_workPhoneObject != null) {
            if (adph_mobilePhoneObject != null && adph_homePhoneObject != null && adph_workPhoneObject != null) {
                //Include all three
                adph_combinedPhoneObject = [adph_mobilePhoneObject, adph_homePhoneObject, adph_workPhoneObject];
            }
            else {
                //Determine how many are null (less than 3)
                var adph_phoneCounter = 0;
                if (adph_mobilePhoneObject != null) { adph_phoneCounter = adph_phoneCounter + 1; }
                if (adph_homePhoneObject != null) { adph_phoneCounter = adph_phoneCounter + 1; }
                if (adph_workPhoneObject != null) { adph_phoneCounter = adph_phoneCounter + 1; }

                if (adph_phoneCounter == 1) {
                    //Include one phone number
                    if (adph_mobilePhoneObject != null) { adph_combinedPhoneObject = [adph_mobilePhoneObject]; }
                    if (adph_homePhoneObject != null) { adph_combinedPhoneObject = [adph_homePhoneObject]; }
                    if (adph_workPhoneObject != null) { adph_combinedPhoneObject = [adph_workPhoneObject]; }
                }
                else {
                    //Include two phone numbers
                    if (adph_mobilePhoneObject != null) {
                        if (adph_homePhoneObject != null) {
                            adph_combinedPhoneObject = [adph_mobilePhoneObject, adph_homePhoneObject];
                        }
                        else {
                            adph_combinedPhoneObject = [adph_mobilePhoneObject, adph_workPhoneObject];
                        }
                    }
                    else {
                        adph_combinedPhoneObject = [adph_homePhoneObject, adph_workPhoneObject];
                    }
                }
            }
        }

        //Determine if to include address or phone or both
        if (adph_combinedAddressObject != null && adph_combinedPhoneObject != null) {
            //Include both address and phone
            var adph_demographicData = {
                "firstName": adph_FirstName,
                "lastName": adph_LastName,
                "ssnText": adph_GovernmentId,
                "gender": adph_Gender,
                //"dob": adph_DOB,
                "dob": adph_DOB_formatted,
                "icn": adph_ICN,
                "Addresses": adph_combinedAddressObject,
                "Phones": adph_combinedPhoneObject
            };
        }
        else {
            //Include address or phone
            if (adph_combinedAddressObject != null) {
                //Include address
                var adph_demographicData = {
                    "firstName": adph_FirstName,
                    "lastName": adph_LastName,
                    "ssnText": adph_GovernmentId,
                    "gender": adph_Gender,
                    //"dob": adph_DOB,
                    "dob": adph_DOB_formatted,
                    "icn": adph_ICN,
                    "Addresses": adph_combinedAddressObject
                };
            }
            else {
                //Include phone
                var adph_demographicData = {
                    "firstName": adph_FirstName,
                    "lastName": adph_LastName,
                    "ssnText": adph_GovernmentId,
                    "gender": adph_Gender,
                    //"dob": adph_DOB,
                    "dob": adph_DOB_formatted,
                    "icn": adph_ICN,
                    "Phones": adph_combinedPhoneObject
                };
            }
        }

        //Set Address and Phone update URL's
        adph_postURL = adph_ESRAddressUpdateURL;

        var adph_demographicResponse = null;
        debugger;
        vialib_getConfig();
        vialib_getApimToken().then(function (apiToken) {
            $.ajax({
                type: "POST",
                url: adph_postURL,
                data: JSON.stringify(adph_demographicData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", apimToken);
                    var keys = subKeys.split("|");
                    for (var i = 0; i < keys.length; i = i + 2) {
                        xhr.setRequestHeader(keys[i], keys[i + 1]);
                    }
                },
                success: function (data) {
                    adph_demographicResponse = data;
                    adph_nextFunction(null, adph_demographicResponse);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //System Error
                    adph_nextFunction(textStatus, errorThrown.message);
                },
                async: true,
                cache: false
            });
        });

    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_postCombinedEsrAddressPhoneUpdate): ' + err.message);
    }
}

function adph_postCombinedEsrAddressPhoneUpdate_response(adph_errorThrown, adph_esrUpdateResponse) {
    try {
        if (adph_errorThrown != null) {
            //General Web Service Error
            alert("Error: The ESR Address and Phone Update Service Failed with error(" + adph_esrUpdateResponse + "), the update is cancelled!");
            adph_clearEsrUpdateCheckboxes();
            return false;
        }
        if (adph_esrUpdateResponse.ErrorOccurred == true) {
            alert("Error: The ESR Address and Phone Update Service Failed with error(" + adph_esrUpdateResponse.ErrorMessage + "), the update is cancelled!");
            adph_clearEsrUpdateCheckboxes();
            return false;
        }
        else {
            if (adph_esrUpdateResponse.Data[0].ESRUpdateErrorResponse != null) {
                alert("Error: The ESR Address and Phone Update Service Failed with error(" +
                    adph_esrUpdateResponse.Data[0].ESRUpdateErrorResponse.Detail.VoaFaultException.FaultExceptions.FaultException[0].Message +
                    "), the update is cancelled!");
                adph_clearEsrUpdateCheckboxes();
                return false;
            }

            //Do next service step from here....
            adph_finishAddressPhoneUpdates();
        }
    }
    catch (err) {
        alert('Veteran demographic data Script Function Error(adph_postCombinedEsrAddressPhoneUpdate_response): ' + err.message);
    }
}

function adph_formatTwoDigits(adph_numberToFormat) {
    //This function takes an integer and reformats it with a '0' prefix if the value is less than 10
    //adph_numberToFormat is the integer value
    try {
        var adph_prefixValue = "0";
        if (adph_numberToFormat < 10) { return (adph_prefixValue + adph_numberToFormat.toString()); }
        else { return adph_numberToFormat.toString(); }
    }
    catch (err) {
        //Display error
        alert("An error occured in the adph_formatTwoDigits function. Error Detail Message: " + err.message);
        return null;
    }
}

function adph_executeCrmOdataGetRequest(adph_jsonQuery, adph_aSync, adph_aSyncCallback, adph_skipCount, adph_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*adph_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*adph_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*adph_aSyncCallback* - specify the name of the return function to call upon completion (required if adph_aSync = true.  Otherwise '')
    //*adph_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*adph_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var adph_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: adph_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                adph_entityData = data;
                if (adph_aSync == true) {
                    adph_aSyncCallback(adph_entityData, adph_skipCount, adph_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in adph_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + adph_jsonQuery);
            },
            async: adph_aSync,
            cache: false
        });
        return adph_entityData;
    }
    catch (err) {
        alert('An error occured in the adph_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function adph_getMultipleEntityDataAsync(adph_entitySetName, adph_attributeSet, adph_conditionalFilter, adph_sortAttribute, adph_sortDirection, adph_skipCount, adph_aSyncCallback, adph_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*adph_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*adph_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*adph_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*adph_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*adph_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*adph_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*adph_aSyncCallback* - is the name of the function to call when returning the result
    //*adph_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var adph_jsonQuery = adph_serverUrl + adph_crmOdataEndPoint + '/' + adph_entitySetName + '?$select=' + adph_attributeSet + '&$filter=' + adph_conditionalFilter + '&$orderby=' + adph_sortAttribute + ' ' + adph_sortDirection + '&$skip=' + adph_skipCount;
        adph_executeCrmOdataGetRequest(adph_jsonQuery, true, adph_aSyncCallback, adph_skipCount, adph_optionArray);
    }
    catch (err) {
        alert('An error occured in the adph_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}
