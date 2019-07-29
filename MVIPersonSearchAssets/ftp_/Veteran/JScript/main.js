//global variable.
var _notProd = true;
var _ICN = "", _EDIPI = "", _preferredFacilityFromESR = "";
var _retrievedSettings = null;
var _summary = null;

function form_onLoad() {

    //fire USD event to fire form_onLoadWithParameters with parameters from USD $Context
    window.open("http://event?eventname=VeteranFormReady");
}

Xrm.Utility.form_onLoadWithParameters = function (pICN, pEDIPI, pPreferredFacilityFromESR) {
    var thisOrgUrl = Xrm.Page.context.getClientUrl();
    _notProd = thisOrgUrl.indexOf("vccm-dev") > 1 || thisOrgUrl.indexOf("vccm-int") > 1 || thisOrgUrl.indexOf("vccm-qa") > 1 || thisOrgUrl.indexOf("veft-preprod") > 1;

    _ICN = !!pICN ? pICN : "";
    _EDIPI = !!pEDIPI ? pEDIPI : "";
    _preferredFacilityFromESR = !!pPreferredFacilityFromESR ? pPreferredFacilityFromESR : "";

    //always do these functions
    unemployableVisibility();
    setSubmitModeOnSomeAttributes();
    resetViersCheckboxesOnLoad();

    if (_ICN == "MISSING") {
        alert("ICN MIssing");
		/*we've reached this branch by creating a new Contact from the MVI search page,
		so don't perform any more web service calls...
		and unlock some fields... Fields to be left unlocked:  first, last, dob, ssn, current address, phone numbers.
		*/
        var fieldsToUnlock = [
            "firstname",
            "middlename",
            "lastname",
            "governmentid",
            "ftp_dateofbirth",
            "ftp_mobilephone",
            "ftp_homephone",
            "ftp_workphone",
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
                con.setDisabled(false);
                if (fieldsToUnlock[i].indexOf("address1") == -1) {
                    con.setVisible(true); //control
                    con.getParent().setVisible(true); //section
                    con.getParent().getParent().setVisible(true); //tab
                }
            }
        }
        return;
    }
    else {
        maskPhones();
        setupExternalWebServiceCalls(_ICN);
    }
}

function hideBusinessProcessFlow() {
    var flow = Xrm.Page.ui.process;
    if (!!flow && flow.getVisible())
        flow.setVisible(false);
}

function maskPhones() {
    var phoneFields = [
        "ftp_mobilephone",
        "ftp_mobilephone",
        "ftp_workphone"
    ];

    for (var i = 0, l = phoneFields.length; i < l; i++) {
        var attr = Xrm.Page.getAttribute(phoneFields[i]);
        if (!!attr) attr.fireOnChange();
    }
}

function formatTelephoneNumber(pContext) {
    //pass to new formatTelephoneNumberNANP function, for formatting according to North American Numbering Plan
    if (!!pContext) {
        var changedAttribute = pContext.getEventSource();
        if (!!changedAttribute) {
            var notificationName = changedAttribute.getName() + "_FORMATTINGERROR";
            Xrm.Page.ui.clearFormNotification(notificationName); //use form-level INFO notifications, so as not to block the save of the record
            var value = changedAttribute.getValue();
            if (!!value) {
                var formattedValue = value;
                try {
                    formattedValue = formatTelephoneNumberNANP(value);
                    changedAttribute.setValue(formattedValue);
                }
                catch (e) {
                    changedAttribute.setValue(formattedValue);
                    var message = "Error formatting value of " + Xrm.Page.getControl(changedAttribute.getName()).getLabel() + ": " + e.message;
                    Xrm.Page.ui.setFormNotification(message, "INFO", notificationName);
                }
            }
        }
    }
}

function formatTelephoneNumberNANP(pValue) {
    var formattedValue = pValue;
    if (!!pValue) {
        try {
            var tempValue = pValue.toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
            var leadingZerosWarning = "";
            while (tempValue[0] == "0") {
                tempValue = tempValue.substr(1, 99);
                leadingZerosWarning = ", or leading-zeros";
            }
            if (tempValue.length >= 10) {
                var NAOffset = tempValue.length > 10 && tempValue[0] == "1" ? 1 : 0;
                var countryCode = tempValue.substr(0, NAOffset);
                var countryCodeString = countryCode != "" ? countryCode + "-" : "";
                var areaCode = tempValue.substr(0 + NAOffset, 3);
                if (areaCode[0] == "0" || areaCode[0] == "1") { throw new Error("Area code (first 3-digit segment of a 10-digit number) cannot start with '0' or '1'"); }
                if (areaCode.length == 3) {
                    var centralOfficeCode = tempValue.substr(3 + NAOffset, 3);
                    if (centralOfficeCode[0] == "0" || centralOfficeCode[0] == "1") { throw new Error("Central office code (second 3-digit segment of a 10-digit number) cannot start with '0' or '1'"); }
                    if (centralOfficeCode[1] == "1" && centralOfficeCode[2] == "1") { throw new Error("Central office code (second 3-digit segment of a 10-digit number) cannot be in the format 'N11'"); }
                    if (centralOfficeCode.length == 3) {
                        var lineNumber = tempValue.substr(6 + NAOffset, 4);
                        if (lineNumber.length == 4) {
                            formattedValue = countryCodeString + [areaCode, centralOfficeCode, lineNumber].join("-");
                        }
                        else {
                            throw new Error(pValue + " is not a valid phone number");
                            //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                        }
                    }
                    else {
                        throw new Error(pValue + " is not a valid phone number");
                        //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                    }
                }
                else {
                    throw new Error(pValue + " is not a valid phone number");
                    //throw new Error(tempValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
                }
            }
            else {
                throw new Error(pValue + " is not a valid phone number");
                //throw new Error(pValue + " is not a valid phone number of at least 10 characters, not counting parentheses or dashes" + leadingZerosWarning);
            }
        }
        catch (e) {
            console.error(e.message);
            throw e;
        }
    }
    return formattedValue;
}

function unemployableVisibility() {
    Xrm.Page.getControl("ftp_unemployable").setVisible(Xrm.Page.getAttribute("ftp_scpercent").getValue() !== null);
}

function setSubmitModeOnSomeAttributes() {
    var fieldsToSave = [
        "firstname",
        "middlename",
        "lastname",
        "ftp_edipi",
        "governmentid",
        "ftp_dateofbirth",
        "ftp_nextofkin",
        "ftp_remarks",
        "ftp_primaryeligibilitycode",
        "ftp_patienttype",
        "ftp_serviceconnected",
        "ftp_scpercent",
        "ftp_unemployable",
        "ftp_dentalinj",
        "ftp_medicationcopaymentexemptionstatus",
        "ftp_copaymentexemptionstatus",
        "ftp_isinsurance",
        "ftp_mobilephone",
        "ftp_homephone",
        "ftp_workphone"
    ];
    for (var i = 0, l = fieldsToSave.length; i < l; i++) {
        var field = Xrm.Page.getAttribute(fieldsToSave[i]);
        if (!!field) field.setSubmitMode("always");
    }
}

function resetViersCheckboxesOnLoad() {
    var viersFields = [
        "ftp_ischangemobile",
        "ftp_ischangehome",
        "ftp_ischangework",
        "ftp_ischangepermanentaddress",
        "ftp_ischangetemporaryaddress"
    ];
    for (var i = 0, l = viersFields.length; i < l; i++) {
        var attr = Xrm.Page.getAttribute(viersFields[i]);
        if (!!attr) attr.fireOnChange();
    }
}

function SetVisn() {
    //deprecated in favor of ftp_facilityid_onChange()
    return;
    ////debugger;
    var facilityLookupValue = Xrm.Page.getAttribute("ftp_facilityid").getValue();
    if (!!facilityLookupValue) {
        var columnset = "ftp_visnid";
        SDK.REST.retrieveRecord(
            facilityLookupValue[0].id,
            "ftp_facility",
            columnset,
            null,
            function (retrievedRecord) {
                if (!!retrievedRecord && !!retrievedRecord.ftp_visnid) {
                    Xrm.Page.getAttribute("ftp_visn").setValue(retrievedRecord.ftp_visnid.Name);
                    Xrm.Page.getAttribute("ftp_visn").setSubmitMode("always");
                }
            },
            errorHandler
        );
    }
}

function setupExternalWebServiceCalls(pICN) {
    try {
        var fType = Xrm.Page.ui.getFormType();
        Xrm.Page.ui.clearFormNotification("WebServiceError");
        if (!!pICN && pICN != "MISSING" && !!fType && fType > 1) {
            //retrieve Active Settings record to get URLs, THEN perform external web service calls
            var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
            var retrievedSettings = null;
            SDK.REST.retrieveMultipleRecords(
                "mcs_setting",
                queryString,
                function (retrievedRecords) {
                    if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
                },
                errorHandler,
                function () {
                    if (!!retrievedSettings) {
                        _retrievedSettings = retrievedSettings;
                        if (!(retrievedSettings.hasOwnProperty("ftp_DACURL")) || !retrievedSettings.ftp_DACURL) {
                            var msg = "Configuration error: Active Settings record is missing some URLs; contact your system administrator.";
                            Xrm.Utility.alertDialog(
                                msg,
                                function () {
                                    Xrm.Page.ui.setFormNotification(msg, "ERROR", "WebServiceError");
                                }
                            );
                            return;
                        }
                        writeToConsole("got Active Settings record.");

                        //deprecated 5/4/18 in Release 6 Sprint 23, for Story #727059
                        //if(typeof getBranchAndRankFromVIERS == "function"){
                        //	writeToConsole("firing getBranchAndRankFromVIERS");
                        //	getBranchAndRankFromVIERS();
                        //}

                        if (typeof findOrCreateFacilityInCRM == "function") {
                            findOrCreateFacilityInCRM();
                        }

                        if (typeof setupPCMMWebServiceCall == "function") {
                            var splitFacilityName = !!_preferredFacilityFromESR ? _preferredFacilityFromESR.split("-") : [];
                            var facilityCode = splitFacilityName.length > 0 ? splitFacilityName[0].trim() : "";
                            setupPCMMWebServiceCall(facilityCode, _ICN);
                        }
                    } //end if !!retrievedSettings
                    else {
                        Xrm.Utility.alertDialog(
                            "Could not find Active Settings for this org; contact your system administrator.",
                            function () {
                                Xrm.Page.ui.setFormNotification("Could not find Active Settings for this org; contact your system administrator", "ERROR", "WebServiceError");
                            }
                        );
                    }
                }
            );
        }
        else if (!pICN && !!fType && fType > 1) {
            return;
        }
        else {
            return;
        }
    }
    catch (e) {
        alert(e);
    }
}

function findOrCreateFacilityInCRM() {

    var preferredFacilityLabel = !!_preferredFacilityFromESR ? _preferredFacilityFromESR : "";
    if (!!preferredFacilityLabel) {
        setAndSubmitValue("ftp_facility", preferredFacilityLabel);
        return;

        //everything else here is deprecated.
        var pfAsArray = preferredFacilityLabel.split("-");
        if (pfAsArray.length == 2) {
            var facilityCodeFromESR = pfAsArray[0].trim();
            var facilityNameFromESR = pfAsArray[1].trim();
            var fullName = facilityCodeFromESR + " - " + facilityNameFromESR; //build it from its parts, just in case it was missing any spaces to begin with

            if (!!facilityCodeFromESR) {
                /*10/12/17 ftp_facilitycode (whole number) has been replaced by the ftp_FacilityCode_text field so we can lookup on alphanumeric facility codes*/
                var facilityQueryString = "$select=ftp_name,ftp_FacilityCode_text,ftp_facilityId,ftp_visnid&$filter=ftp_FacilityCode_text eq '" + facilityCodeFromESR + "' and statecode/Value eq 0&$top=1"
                var retrievedFacility = null;
                SDK.REST.retrieveMultipleRecords(
                    "ftp_facility",
                    facilityQueryString,
                    function (retrievedRecords) {
                        if (!!retrievedRecords && retrievedRecords.length == 1) {
                            retrievedFacility = retrievedRecords[0];
                        }
                    },
                    errorHandler,
                    function () {
                        if (!!retrievedFacility) {
                            updateFacilityOnForm(retrievedFacility);
                        }
                        //7/11/2018
                        //for VEFT Release 7 (applies to both VCCM & VEFT):
                        //contents of ftp_facility table come from VAST
                        //use the ftp_facility text field for home facility
                        //pull VISN from ftp_currentfacilityid
                        //else{
                        //	//create the facility record in CRM, then set the lookup field on this form
                        //	var newFacility = {
                        //		ftp_name: fullName,
                        //		ftp_FacilityCode_text: facilityCodeFromESR,
                        //		ftp_SiteName: facilityNameFromESR
                        //	};
                        //	SDK.REST.createRecord(
                        //		newFacility,
                        //		"ftp_facility",
                        //		function(createdRecord){
                        //			updateFacilityOnForm(createdRecord);
                        //		},
                        //		errorHandler
                        //	);
                        //}
                    }
                );
            }
        }
    }
}
function updateFacilityOnForm(pFacilityObject) {
    //sets the Current Facility lookup field, and fires onChange event.
    if (!!pFacilityObject) {
        setAndSubmitValue(
            "ftp_currentfacilityid",
            [{
                id: pFacilityObject.ftp_facilityId,
                name: pFacilityObject.ftp_name,
                entityType: "ftp_facility"
            }]
        );

        Xrm.Page.getAttribute("ftp_currentfacilityid").fireOnChange();
    }
}
function ftp_facilityid_onChange(pContext) {
    return;
    //deprecated because Home Facility is the ftp_facility text field now instead of the ftp_facilityid lookup field
    //Xrm.Page.ui.clearFormNotification("missingVISN");
    //writeToConsole("inside ftp_facilityid_onChange");
    //var facilityLookupValue = Xrm.Page.getAttribute("ftp_facilityid").getValue();
    //if (!!facilityLookupValue) {
    //    //get VISN from looked up facility and set ftp_visn field on form
    //    var columnset = "ftp_visnid";
    //    SDK.REST.retrieveRecord(
    //        facilityLookupValue[0].id,
    //        "ftp_facility",
    //        columnset,
    //        null,
    //        function (retrievedRecord) {
    //            if (!!getDeepProperty("ftp_visnid.Name", retrievedRecord)) {
    //				writeToConsole("found VISN from facility: " + retrievedRecord.ftp_visnid.Name);
    //				setAndSubmitValue("ftp_visn", retrievedRecord.ftp_visnid.Name);
    //            }
    //			else{
    //				Xrm.Page.ui.setFormNotification("Identified home facility does not have a VISN.", "INFO", "missingVISN");
    //			}
    //        },
    //        errorHandler
    //    );
    //}
}
function ftp_currentfacilityid_onChange(pContext) {
    Xrm.Page.ui.clearFormNotification("missingVISN");
    writeToConsole("inside ftp_currentfacilityid_onChange");
    var facilityLookupValue = Xrm.Page.getAttribute("ftp_currentfacilityid").getValue();
    if (!!facilityLookupValue) {
        //get VISN from looked up facility and set ftp_visn field on form
        var columnset = "ftp_visnid";
        SDK.REST.retrieveRecord(
            facilityLookupValue[0].id,
            "ftp_facility",
            columnset,
            null,
            function (retrievedRecord) {
                if (!!getDeepProperty("ftp_visnid.Name", retrievedRecord)) {
                    writeToConsole("found VISN from facility: " + retrievedRecord.ftp_visnid.Name);
                    setAndSubmitValue("ftp_visn", retrievedRecord.ftp_visnid.Name);
                }
                else {
                    Xrm.Page.ui.setFormNotification("Identified current facility does not have a VISN.", "INFO", "missingVISN");
                }
            },
            errorHandler
        );
    }
}

function errorHandler(error) {
    writeToConsole(error.message);
    alert(error.message);
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
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
function setAndSubmitValue(pAttribute, pValue) {
    var attr = Xrm.Page.getAttribute(pAttribute);
    if (!!attr) {
        try {
            attr.setValue(pValue);
            attr.setSubmitMode("always");
        }
        catch (e) {
            alert("Error setting value for " + pAttribute + ": " + e.message);
        }
    }
}
function SortObjectArray(pSortProperty) {
    var sortOrder = 1;
    if (pSortProperty[0] === "-") {
        sortOrder = -1;
        pSortProperty = pSortProperty.substr(1);
    }
    return function (a, b) {
        var result = (a[pSortProperty] < b[pSortProperty]) ? -1 : (a[pSortProperty] > b[pSortProperty]) ? 1 : 0;
        return result * sortOrder;
    };
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}