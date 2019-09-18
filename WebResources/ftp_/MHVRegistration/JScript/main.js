/// <reference path="../../JScript/VCCM.MHVHelper.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />

var _ICN = null,
    _registrationAPIURL = null,
    _vetContactMethods = null;

function form_onLoad() {
    //fire USD event to fire form_onLoadWithParameters with parameters from USD $Context
    window.open("http://event?eventname=CRMFormReady");

    //for testing purposes:
    //form_onLoadWithParameters();
}

function form_onLoadWithParameters(pICN, pRegistrationAPIURL, pMobilePhone, pHomePhone, pWorkPhone, pEmail/*, pFax, pPager*/) {
    try{
        _vetContactMethods = {
            "Mobile Phone": pMobilePhone,
            "Home Phone": pHomePhone,
            "Work Phone": pWorkPhone,
            "Email": pEmail/*,
            "Fax": pFax,
            "Pager": pPager*/
        };

        var contactMethodAttr = Xrm.Page.getAttribute("ftp_contactmethod");
        if (!!contactMethodAttr) {
            contactMethodAttr.fireOnChange();
        }

        var signinParntersAttribute = Xrm.Page.getAttribute("ftp_signinpartners");
        if (!!signinParntersAttribute) {
            signinParntersAttribute.controls.forEach(function (con, i) { con.setDisabled(!!signinParntersAttribute.getValue() ? true : false); });
            signinParntersAttribute.setSubmitMode("always");
        }

        var termsVersionAttribute = Xrm.Page.getAttribute("ftp_termsversion");
        if (!!termsVersionAttribute) {
            termsVersionAttribute.controls.forEach(function (con, i) { con.setDisabled(!!termsVersionAttribute.getValue() ? true : false); });
            termsVersionAttribute.setSubmitMode("always");
        }

        var callerAcceptsTCAttribute = Xrm.Page.getAttribute("ftp_calleracknowledgestc");
        if (!!callerAcceptsTCAttribute) {
            callerAcceptsTCAttribute.fireOnChange();
        }

        _ICN = pICN;
        _registrationAPIURL = pRegistrationAPIURL;
    }
    catch (e) {
        Xrm.Utility.alertDialog("Error in form_onLoadWithParameters(): \n" + e.message, function () { });
    }
}

function ftp_contactmethod_onChange(pContext) {
    try{
        var contactMethodAttr = Xrm.Page.getAttribute("ftp_contactmethod");
        if (!!contactMethodAttr) {
            var selectedContactMethodLabel = contactMethodAttr.getText();
            if (!!selectedContactMethodLabel) {
                var contactMethodValueAttr = Xrm.Page.getAttribute("ftp_contactmethodvalue");
                if (!!contactMethodValueAttr) {
                    contactMethodValueAttr.controls.forEach(function (con, i) { con.setLabel(selectedContactMethodLabel); });
                    contactMethodValueAttr.setValue(!!_vetContactMethods[selectedContactMethodLabel] ? _vetContactMethods[selectedContactMethodLabel] : null);
                }
            }
        }
    }
    catch (e) {
        Xrm.Utility.alertDialog("Error in ftp_contactmethod_onChange(): \n" + e.message, function () { });
    }
}

function ftp_contactmethodvalue_onChange(pContext) {
    try {
        var contactMethodAttr = Xrm.Page.getAttribute("ftp_contactmethod");
        if (!!contactMethodAttr) {
            var selectedContactMethodLabel = contactMethodAttr.getText();
            if (!!selectedContactMethodLabel && selectedContactMethodLabel.toLowerCase().indexOf("phone") > -1) {
                formatTelephoneNumber(pContext);
            }
        }
    }
    catch (e) {
        Xrm.Utility.alertDialog("Error in ftp_contactmethodvalue_onChange(): \n" + e.message, function () { });
    }
}

function formatTelephoneNumber(pContext) {
    try{
        if (!!pContext) {
            var changedAttribute = pContext.getEventSource();
            if (!!changedAttribute) {
                var value = changedAttribute.getValue();
                if (!!value) {
                    var tempValue = value.toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
                    //if (tempValue.substr(0, 1) == "1") tempValue = tempValue.substr(1, 99);
                    var hasUSACountryCode = tempValue.substr(0, 1) == "1";
                    var offset = hasUSACountryCode ? 0 : 1;
                    var formattedValue = (tempValue.length >= 10) ? (hasUSACountryCode ? tempValue.substr(0, 1) + "-" : "") + tempValue.substr(0 + offset, 3) + "-" + tempValue.substr(3 + offset, 3) + "-" + tempValue.substr(6 + offset, 4) : tempValue.substr(0, 3) + "-" + tempValue.substr(3, 4);
                    changedAttribute.setValue(formattedValue);
                }
            }
        }
    }
    catch (e) {
        Xrm.Utility.alertDialog("Error in formatTelephoneNumber(): \n" + e.message, function () { });
    }
}

function fill_ftp_calleracknowledgestc(pValue) {
    if (typeof pValue == "boolean" || (typeof pValue == "string" && (pValue.toLowerCase() === "true" || pValue.toLowerCase() === "false"))) {
        var bValue = typeof pValue == "boolean" ? pValue : pValue.toLowerCase() == "true";
        var attr = Xrm.Page.getAttribute("ftp_calleracknowledgestc");
        if (!!attr) {
            attr.setValue(bValue);
            attr.fireOnChange();
        }
    }
    else {
        //invalid type
    }
}

function ftp_calleracknowledgestc_onChange(pContext) {
    var changedAttribute = pContext.getEventSource();
    if (!!changedAttribute) {
        var value = changedAttribute.getValue();
        var acknowledgementDateAttribute = Xrm.Page.getAttribute("ftp_termsaccepteddate");
        if (!!acknowledgementDateAttribute) {
            acknowledgementDateAttribute.setValue(value == true ? new Date() : null);
            acknowledgementDateAttribute.setSubmitMode("always");
        }
    }
}

function submitRegistrationToMHV() {
    try {
        Xrm.Page.ui.clearFormNotification("ERRORNOTIFICATION");
        Xrm.Page.ui.clearFormNotification("REG");
        Xrm.Page.ui.setFormNotification("Submitting registration info...", "INFO", "REG");
        var contactMethodText = Xrm.Page.getAttribute("ftp_contactmethod").getText();
        var trimmedContactMethodText = !!contactMethodText ? contactMethodText.replace(" ", "") : contactMethodText;

        var postData = {
            icn: _ICN,
            //address1: Xrm.Page.getAttribute("ftp_address1").getValue(),
            //address2: Xrm.Page.getAttribute("ftp_address2").getValue(),
            //city: Xrm.Page.getAttribute("ftp_city").getValue(),
            //province: Xrm.Page.getAttribute("ftp_stateorprovince").getValue(),
            //zip: Xrm.Page.getAttribute("ftp_postalcode").getValue(),
            //country: Xrm.Page.getAttribute("ftp_country").getValue(),
            isPatient: Xrm.Page.getAttribute("ftp_ispatient").getValue(),
            isPatientAdvocate: Xrm.Page.getAttribute("ftp_ispatientadvocate").getValue(),
            isVeteran: Xrm.Page.getAttribute("ftp_isveteran").getValue(),
            isChampVABeneficiary: Xrm.Page.getAttribute("ftp_ischampvabeneficiary").getValue(),
            isServiceMember: Xrm.Page.getAttribute("ftp_isservicemember").getValue(),
            isEmployee: Xrm.Page.getAttribute("ftp_isemployee").getValue(),
            isHealthCareProvider: Xrm.Page.getAttribute("ftp_ishealthcareprovider").getValue(),
            isOther: Xrm.Page.getAttribute("ftp_isother").getValue(),
            signInPartners: Xrm.Page.getAttribute("ftp_signinpartners").getValue(),
            contactMethod: trimmedContactMethodText,
            termsVersion: Xrm.Page.getAttribute("ftp_termsversion").getValue(),
            termsAcceptedDate: Xrm.Page.getAttribute("ftp_termsaccepteddate").getValue()
        }
        postData[trimmedContactMethodText] = Xrm.Page.getAttribute("ftp_contactmethodvalue").getValue();

        Xrm.Page.getAttribute("ftp_postdata").setValue(JSON.stringify(postData));
        Xrm.Page.getAttribute("ftp_postdata").setSubmitMode("always");

        VCCM.MHVHelper.RegisterVeteran(
            _registrationAPIURL,
            _ICN,
            //Xrm.Page.getAttribute("ftp_address1").getValue(),
            //Xrm.Page.getAttribute("ftp_address2").getValue(),
            //Xrm.Page.getAttribute("ftp_city").getValue(),
            //Xrm.Page.getAttribute("ftp_stateorprovince").getValue(),
            //Xrm.Page.getAttribute("ftp_postalcode").getValue(),
            //Xrm.Page.getAttribute("ftp_country").getValue(),
            Xrm.Page.getAttribute("ftp_ispatient").getValue(),
            Xrm.Page.getAttribute("ftp_ispatientadvocate").getValue(),
            Xrm.Page.getAttribute("ftp_isveteran").getValue(),
            Xrm.Page.getAttribute("ftp_ischampvabeneficiary").getValue(),
            Xrm.Page.getAttribute("ftp_isservicemember").getValue(),
            Xrm.Page.getAttribute("ftp_isemployee").getValue(),
            Xrm.Page.getAttribute("ftp_ishealthcareprovider").getValue(),
            Xrm.Page.getAttribute("ftp_isother").getValue(),
            Xrm.Page.getAttribute("ftp_signinpartners").getValue(),
            trimmedContactMethodText,
            Xrm.Page.getAttribute("ftp_contactmethodvalue").getValue(),
            Xrm.Page.getAttribute("ftp_termsversion").getValue(),
            Xrm.Page.getAttribute("ftp_termsaccepteddate").getValue(),
            function (pResponse) {
                //process response, save integration response to form, save record, then close the tab
                Xrm.Page.getAttribute("ftp_integrationresponse").setValue(JSON.stringify(pResponse));
                Xrm.Page.getAttribute("ftp_integrationresponse").setSubmitMode("always");
                Xrm.Page.data.save().then(
                    function () {
                        if (!!pResponse) {
                            if (pResponse.hasOwnProperty("ErrorOccurred") && pResponse.ErrorOccurred == false) {
                                if (!!pResponse && !!pResponse.Data && Object.prototype.toString.call(pResponse.Data) == "[object Array]" && pResponse.Data.length > 0) {
                                    var responseData = pResponse.Data[0];
                                    if (responseData.AccountStatus == "MVI Correlation Completed" && responseData.ApiCompletionStatus == "Successful") {
                                        if (!!responseData.CorrelationId) {
                                            Xrm.Page.ui.setFormNotification("Successfully registered! This form will now close.", "INFO", "REG");
                                            setTimeout(function () {
                                                Xrm.Page.ui.clearFormNotification("REG");
                                            }, 5000);
                                            VCCM.USDHelper.CopyDataToReplacementParameters("MHV", ["ID=" + responseData.CorrelationId], false);
                                            /*
                                               fire USD event, under which action calls will:
                                                   -collapse agent script pane
                                                   -set focus to Request tab
                                                   -close this tab (MHV Registration)
                                                   -set _MHVID variable on request form
                                                   -refresh and set focus on Refillable Medications form tab
                                                       -code on MHVMedicationRefillGrid will fetch a new token and then fetch the medication list from MHV
                                           */
                                            VCCM.USDHelper.OpenUSDURL("http://event?eventname=RegistrationSucceeded");
                                        }
                                        else {
                                            errorHandler("Missing CorrelationId from MHV response. See the Integration Details tab for more information.", null, 5000);
                                        }
                                    }
                                    else {
                                        errorHandler("Unhandled AccountStatus or ApiCompletionStatus from MHV response. See the Integration Details tab for more information.", null, 5000);
                                    }                                 
                                }
                                else {
                                    errorHandler("Missing Data from MHV response. See the Integration Details tab for more information.", null, 5000);
                                }
                            }
                            else {
                                errorHandler("Error occurred in MHV response. See the Integration Details tab for more information.", null, 5000);
                            }                            
                        }
                        else {
                            errorHandler("No response from MHV.", null, 5000);
                        }
                    },
                    function (saveError) {
                        errorHandler("Error from MHV Registration API. See the Integration Details tab for more information.", saveError, 5000);
                    }
                );
            },
            function (apiError) {
                Xrm.Page.getAttribute("ftp_integrationresponse").setValue(JSON.stringify(apiError));
                Xrm.Page.getAttribute("ftp_integrationresponse").setSubmitMode("always");
                Xrm.Page.data.save().then(
                    function () {
                        errorHandler("Error from MHV Registration API. See the Integration Details tab for more information.", apiError, 5000);
                    }
                );
            }
        );
    }
    catch (e) {
        errorHandler("Error in submitRegistrationToMHV(); see the Integration Details tab for more information.", e, 5000);
    }
}

function errorHandler(pMessage, e, pTimeout) {
    Xrm.Page.ui.clearFormNotification("REG");
    var fullMessage = pMessage + (!!e && !!e.message ? "\n" + e.message : "");
    Xrm.Utility.alertDialog(
        fullMessage,
        function () {
            Xrm.Page.ui.setFormNotification(pMessage, "ERROR", "ERRORNOTIFICATION");
            if (typeof pTimeout == "number") {
                setTimeout(function () { Xrm.Page.ui.clearFormNotification("ERRORNOTIFICATION"); }, pTimeout);
            }
        }
    );
}