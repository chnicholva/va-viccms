/// <reference path="../../JScript/VCCM.USDHelper.js" />
var _usedOutboundCallScript = false;

function form_onLoad() {
    debugger;
    showContactInfo();
    populateDate();
    var callBackNumberAttr = Xrm.Page.getAttribute("ftp_callbacknumber");
    if (!!callBackNumberAttr) {
        //fires formatTelephoneNumber()
        callBackNumberAttr.fireOnChange();
    }

    // only set default direction on create form
    if (Xrm.Page.ui.getFormType() == 1) {
        setInteractionDirectionByTeamMembership();
        Xrm.Page.getAttribute("tri_firstcallinteraction").fireOnChange();
    }

    var mviSite = Xrm.Page.getAttribute('ftp_mvisite');
    var mviSiteId = Xrm.Page.getAttribute('ftp_mvisiteid');

    var mviSiteValue = null;
    var mviSiteIdValue = null;

    if (mviSite != null)
        mviSiteValue = mviSite.getValue();

    if (mviSiteId != null)
        mviSiteIdValue = mviSiteId.getValue();

    if (mviSiteValue != null && mviSiteIdValue != null) {
        //ftp_requestfacilityid
        Xrm.Page.getAttribute('ftp_requestfacilityid').setValue();
        var lookupValue = new Array();
        lookupValue[0] = new Object();
        lookupValue[0].id = "{" + mviSiteIdValue + "}";
        lookupValue[0].name = mviSiteValue; // Name of the lookup
        lookupValue[0].entityType = "ftp_facility"; //Entity Type of the lookup entity
        Xrm.Page.getAttribute("ftp_requestfacilityid").setValue(lookupValue);
    }

    getAnyMissingDataFromVeteran();
    refreshLinker();
    lockdownFormForSubsequentUSDSessions();
    if (Xrm.Page.data.entity.getId()) {
        VCCM.USDHelper.CopyToUSDContext(["InteractionId=" + Xrm.Page.data.entity.getId().replace(/\{|\}/gi, '')]);
    }
}

function lockdownFormForSubsequentUSDSessions() {
    /*
	the ftp_initialusdsessioncomplete field is updated by a USD action call when users closes a session after saving the interaction for the first time
	 */
    var attr = Xrm.Page.getAttribute("ftp_initialusdsessioncomplete");
    if (!!attr) {
        var firstSessionComplete = attr.getValue();
        if (firstSessionComplete == true) {
            var contrs = Xrm.Page.ui.controls.get();
            for (var i in contrs) {
                try {
                    contrs[i].setDisabled(true);
                    contrs[i].clearNotification()
                } catch (e) { }
            }
        }
    }
}

function showContactInfo() {
    //only show ftp_contactname if ftp_interactwith != Veteran (100000000)
    var interactedWithValue = Xrm.Page.getAttribute("ftp_interactedwith").getValue();
    var notAVeteran = interactedWithValue != 100000000;
    var con = Xrm.Page.getControl("ftp_contactname");
    if (!!con) {
        con.setVisible(notAVeteran);
        con.getAttribute().setRequiredLevel(notAVeteran ? "required" : "none");
    }
}

function populateDate() {
    //fill ftp_interactedon if it's empty
    var currentValue = Xrm.Page.getAttribute("ftp_interactedon").getValue();
    if (!currentValue)
        Xrm.Page.getAttribute("ftp_interactedon").setValue(new Date());
}

function setInteractionDirectionByTeamMembership() {
    //true = outbound
    //false = inbound
    retrieveTeamsForUser(
        function (retrievedRecords) {
            for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                if (retrievedRecords[i].hasOwnProperty("Name")) {
                    var thisTeamName = retrievedRecords[i].Name;
                    //INBOUND
                    if (thisTeamName == "CCA Team" || thisTeamName == "RN" || thisTeamName == "Pharmacy") {
                        writeToConsole("User is member of " + thisTeamName + ".  Direction: Inbound");
                        Xrm.Page.getAttribute("ftp_direction").setValue(false);
                        break;
                    }
                    //OUTBOUND
                    if (thisTeamName == "LIP User") {
                        writeToConsole("User is member of " + thisTeamName + ".  Direction: Outbound");
                        Xrm.Page.getAttribute("ftp_direction").setValue(true);
                        break;
                    }
                }
            }
        });
}

function refreshLinker() {
    debugger;
    if (Xrm.Page.ui.getFormType() > 1) {
        var rlinker = Xrm.Page.getControl("WebResource_RequestLinker");
        var source = rlinker.getSrc();
        rlinker.setSrc("about:blank");
        rlinker.setSrc(source);
    }
}

function getAnyMissingDataFromVeteran() {
    if (Xrm.Page.ui.getFormType() == 1) {
        /*
		Phone numbers are filled initially by url parameters from the Veteran Alerts control's "Saved" USD event.
		But if we are missing any phone numbers when this form loads for the first time, check the veteran record to see if we can fill in any missing data that ESR did not provide.
		*/
        var mappedFieldList = [
            { contactField: "ftp_HomePhone", interactionField: "ftp_homephone" },
            { contactField: "ftp_WorkPhone", interactionField: "ftp_businessphone" },
            { contactField: "ftp_MobilePhone", interactionField: "ftp_mobilephone" }
        ];

        for (var i = mappedFieldList.length - 1; i > -1; i--) {
            var attr = Xrm.Page.getAttribute(mappedFieldList[i].interactionField);
            if (!attr || (!!attr && !!attr.getValue())) {
                mappedFieldList.splice(i, 1);
            }
        }

        if (mappedFieldList.length > 0) {
            var veteranValue = Xrm.Page.getAttribute("ftp_veteran").getValue();
            if (!!veteranValue) {
                var queryString = "";
                for (var i = 0; i < mappedFieldList.length; i++) { queryString += (i == 0 ? mappedFieldList[i].contactField : ("," + mappedFieldList[i].contactField)); }
                SDK.REST.retrieveRecord(
                    veteranValue[0].id,
                    "Contact",
                    queryString,
                    null,
                    function (retrievedContact) {
                        if (!!retrievedContact) {
                            for (var i = 0; i < mappedFieldList.length; i++) {
                                var thisPhoneNumber = mappedFieldList[i];
                                if (retrievedContact.hasOwnProperty(thisPhoneNumber.contactField) && !!retrievedContact[thisPhoneNumber.contactField]) {
                                    Xrm.Page.getAttribute(thisPhoneNumber.interactionField).setValue(retrievedContact[thisPhoneNumber.contactField]);
                                    Xrm.Page.getAttribute(thisPhoneNumber.interactionField).setSubmitMode("always");
                                }
                            }
                        }
                    },
                    errorHandler
                );
            }
        }
    }
}

function usdSave() {
    var ftype = Xrm.Page.ui.getFormType();
    if (ftype === 1) {
        /*
		interactiontype
		reasonforrequestid
		callbacknumber
		lastNameChecked
		SSN
		DOB;
		 */
        debugger;
        Xrm.Page.getAttribute("tri_interactiontype").setRequiredLevel("none");
        Xrm.Page.getAttribute("tri_reasonforrequest").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_callbacknumber").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_lastname").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_ssn").setRequiredLevel("none");
        Xrm.Page.getAttribute("ftp_dob").setRequiredLevel("none");
        Xrm.Page.data.entity.save();
    } else {
        alert("ID eq" + Xrm.Page.data.entity.getId());
        Xrm.Page.getAttribute("tri_interactiontype").setRequiredLevel("required");
        Xrm.Page.getAttribute("tri_reasonforrequest").setRequiredLevel("required");
        Xrm.Page.getAttribute("ftp_callbacknumber").setRequiredLevel("required");
        Xrm.Page.getAttribute("ftp_lastname").setRequiredLevel("required");
        Xrm.Page.getAttribute("ftp_ssn").setRequiredLevel("required");
        Xrm.Page.getAttribute("ftp_dob").setRequiredLevel("required");
    }

}

function Mask(field, format) {
    //deprecated in favor of formatTelephoneNumber
    return;
    var thisControl = Xrm.Page.getControl(field);
    if (!!thisControl && thisControl.getControlType() == "standard" && !!(thisControl.getAttribute().getValue())) {
        thisControl.setFocus();
        $("#" + field + "_i").mask(format);
        thisControl.blur();
    }
}

function maskPhone() {
    //deprecated in favor of formatTelephoneNumber
    return;
    Mask("ftp_callbacknumber", "(000) 000-0000");
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

function setControlsOptional(controls) {
    for (var i = 0; i < controls.length; i++) {
        controls[i].getAttribute().setRequiredLevel("none");
    }
}

function setControlsBusinessRequired(controls) {
    for (var i = 0; i < controls.length; i++) {
        controls[i].getAttribute().setRequiredLevel("required");
    }
}

/*
function navToRequestOnChange() {
debugger;
var interactionId = Xrm.Page.data.entity.getId();
var interaction = REST.SYNC.retrieveRecordSync(interactionId, "ftp_interaction", "ftp_Request", null);
if (interaction.ftp_Request.Id != null) {
Xrm.Utility.openEntityForm("incident", interaction.ftp_Request.Id);
}
else {
setTimeout(navToRequestOnChange, 1000);
}
}
 */
function navToVeteranOnChange() {
    var vetLookupValue = Xrm.Page.getAttribute("ftp_veteran").getValue();
    if (!!vetLookupValue) Xrm.Utility.openEntityForm("ftp_veteran", vetLookupValue[0].id);
}

function updateIdProofBusinessRulesOnChange() {
    Xrm.Page.getControl("ftp_lastname").clearNotification("VALIDATION");
    var lastNameControl = Xrm.Page.getControl("ftp_lastname");
    var lastNameChecked = lastNameControl.getAttribute().getValue();
    var dobControl = Xrm.Page.getControl("ftp_ssn");
    var dobChecked = dobControl.getAttribute().getValue();
    var ssnControl = Xrm.Page.getControl("ftp_dob");
    var ssnChecked = ssnControl.getAttribute().getValue();

    if ((!lastNameChecked && !dobChecked && !ssnChecked) //all unchecked
        || (lastNameChecked && !dobChecked && !ssnChecked) //two unchecked
        || (dobChecked && !ssnChecked && !lastNameChecked) //two unchecked
        || (ssnChecked && !lastNameChecked && !dobChecked) //two unchecked
        || (lastNameChecked && dobChecked & ssnChecked)) { //all checked
        setControlsBusinessRequired([lastNameControl, dobControl, ssnControl]); //all check boxes required
    }
    else if (lastNameChecked && dobChecked && !ssnChecked) { //two checked
        setControlsBusinessRequired([lastNameControl, dobControl]);
        setControlsOptional([ssnControl]); //leave third check box optional
        ssnControl.clearNotification();
    }
    else if (dobChecked && ssnChecked && !lastNameChecked) { //two checked
        setControlsBusinessRequired([dobControl, ssnControl]);
        setControlsOptional([lastNameControl]); //leave third check box optional
        lastNameControl.clearNotification();
    }
    else if (ssnChecked && lastNameChecked && !dobChecked) { //two checked
        setControlsBusinessRequired([ssnControl, lastNameControl]);
        setControlsOptional([dobControl]); //leave third check box optional
        dobControl.clearNotification();
    }
}

function passesIdProtocol() {
    var lastNameChecked = Xrm.Page.getAttribute("ftp_lastname").getValue();
    var dobChecked = Xrm.Page.getAttribute("ftp_ssn").getValue();
    var ssnChecked = Xrm.Page.getAttribute("ftp_dob").getValue();

    if ((!lastNameChecked && !dobChecked)
        || (!dobChecked && !ssnChecked)
        || (!ssnChecked && !lastNameChecked)) {

        Xrm.Page.getControl("ftp_lastname").setNotification("Please validate at least two fields before saving.", "VALIDATION");
        return false;
    }
    return true;
}

function populateSubject() {
    var subject = "";
    var vetValue = Xrm.Page.getAttribute("ftp_veteran").getValue();
    if (!!vetValue) subject += vetValue[0].name;
    subject += " - " + Xrm.Page.getAttribute("tri_interactiontype").getText();
    Xrm.Page.getAttribute("ftp_subject").setValue(subject);
}

function ftp_details_onChange() {
    //ftp_details formatting deprecated 3/6/2018
    //var val = Xrm.Page.getAttribute("ftp_details").getValue();
    //val = removeCarriageReturns(val);
    //Xrm.Page.getAttribute("ftp_details").setValue(val);
}

function removeCarriageReturns(pText) {
    return !!pText ? pText.replace(/(\r\n|\r|\n)/gm, ". ").replace("..", ".") : "";
}

function form_onSave(econtext) {
    debugger;
    var eventArgs = econtext.getEventArgs();

    //prevent auto save
    if (eventArgs.getSaveMode() == 70) {
        eventArgs.preventDefault();
        return;
    }

    refreshLinker();

    var isOutbound = Xrm.Page.getAttribute("ftp_direction").getValue() == true;

    //check ID protocol checkboxes before continuing
    if (passesIdProtocol()) {
        populateSubject();
        var number = Xrm.Page.getAttribute("ftp_callbacknumber").getValue();
        var isFirstCallResolution = Xrm.Page.getAttribute("tri_firstcallinteraction").getValue();
        var vetAttr = Xrm.Page.getAttribute('ftp_veteran').getValue()[0];
        var vetName = vetAttr.name;
        var vetId = vetAttr.id.replace(/\{|\}/gi, '');

        var sFacAttr = Xrm.Page.getAttribute('ftp_requestfacilityid').getValue()[0];
        var sfacName = sFacAttr.name.replace(/\s/gi, ' ');
        var sfacId = sFacAttr.id.replace(/\{|\}/gi, '');
        debugger;

        //this is required because USD Saved event on Interaction hosted control is not working
        var savedViaComboRequestButton = Xrm.Page.getAttribute("ftp_comborequest").getValue();
        if (!savedViaComboRequestButton && !isFirstCallResolution && (!isOutbound || (isOutbound && !_usedOutboundCallScript))) {
            var rfrValue = Xrm.Page.getAttribute("tri_reasonforrequest").getValue();
            var rfrName = !!rfrValue ? rfrValue[0].name : "";
            var rfrId = !!rfrValue ? rfrValue[0].id : "";
            var rfrOtherText = !!Xrm.Page.getAttribute("ftp_reasonforrequestother_text") ? Xrm.Page.getAttribute("ftp_reasonforrequestother_text").getValue() : "";

            VCCM.USDHelper.FireUSDEvent(
                "Set interaction fields",
                [
                    "outbound=false",
                    "callbacknumber=" + number,
                    "reasonforrequestname=" + rfrName,
                    "reasonforrequestid=" + rfrId,
                    "reasonforrequestothertext=" + rfrOtherText,
                    "servicingfacilityidname=" + sfacName,
                    "servicingfacilityid=" + sfacId,
                    "veteranid=" + vetId,
                    "veteranname=" + vetName
                ],
                null
            );
        }

        //pharmacy outbound interactions
        if (isOutbound && _usedOutboundCallScript) {
            writeToConsole("firing onSave logic for pharmacy outbound interaction");
            /*
			7/6/17: the _usedOutboundCallScript flag can only be set to true via the setupOutboundInteraction() function,
			which is fired via an action call in the Pharmacy Outbound Call script, which is only accessible to Pharmacy USD users
			 */
            /*
			check required fields before saving this outbound interaction and opening the new request
			these fields are filled in on the form via Agent Script Answers in USD
			 */
            if (Xrm.Page.getAttribute("ftp_outboundinteractionaddress").getValue() != null && Xrm.Page.getAttribute("ftp_outboundinteractionsubreasonid").getValue() != null) {
                /*reason for request, tri_reasonforrequest*/
                var rfrValue = Xrm.Page.getAttribute("tri_reasonforrequest").getValue();
                var rfrName = !!rfrValue ? rfrValue[0].name : "";
                var rfrId = !!rfrValue ? rfrValue[0].id : "";
                var rfrOtherText = !!Xrm.Page.getAttribute("ftp_reasonforrequestother_text") ? Xrm.Page.getAttribute("ftp_reasonforrequestother_text").getValue() : "";

                /*reason for call, ftp_outboundinteractionsubreasonid*/
                var subreasonValue = Xrm.Page.getAttribute("ftp_outboundinteractionsubreasonid").getValue();
                var subreasonName = !!subreasonValue ? subreasonValue[0].name : "";
                var subreasonId = !!subreasonValue ? subreasonValue[0].id : "";

                VCCM.USDHelper.FireUSDEvent(
                    "Set interaction fields",
                    [
                        "outbound=false",
                        "callbacknumber=" + number,
                        "reasonforrequestname=" + rfrName,
                        "reasonforrequestid=" + rfrId,
                        "reasonforrequestothertext=" + rfrOtherText,
                        "subreasonname=" + subreasonName,
                        "subreasonid=" + subreasonId,
                        "subreasonothertext=" + Xrm.Page.getAttribute("ftp_outboundinteractioncallreasonother").getValue(),
                        "servicingfacilityidname=" + sfacName,
                        "servicingfacilityid=" + sfacId,
                        "veteranid=" + vetId,
                        "veteranname=" + vetName
                    ],
                    null
                );
            }
            else {
                alert("Missing some required fields for a pharmacy outbound interaction. Make sure you followed the Pharmacy Outbound Call script.");
                eventArgs.preventDefault();
                return;
            }
        }
    }
}

function retrieveTeamsForUser(CallBackParameter) {
    if (typeof CallBackParameter == "function") {
        var currentUserId = Xrm.Page.context.getUserId();
        var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        var query = "SystemUserSet(guid'" + currentUserId + "')/teammembership_association?$select=Name,TeamId";

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: oDataPath + query,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (!!data)
                    CallBackParameter(data.d.results);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Error retrieving teams for current user: " + errorThrown);
            },
            async: true,
            cache: false
        });
    }
    else {
        alert("Did not retrieve teams for current user.  CallBackParameter must be a function.");
        //CallBackParameter must be a function
    }
}

function setUpControlledSubstanceRenewalForPharmacyTeamMembers() {
    try {
        var reasonForSubstanceRenewalControl = Xrm.Page.getControl("ftp_reasonforcontrolledsubstancerenewal");
        if (!reasonForSubstanceRenewalControl) return;
        reasonForSubstanceRenewalControl.getAttribute().setRequiredLevel("none")
        reasonForSubstanceRenewalControl.setVisible(false);
        reasonForSubstanceRenewalControl.clearNotification();

        var rfrAtt = Xrm.Page.getAttribute("tri_reasonforrequest");
        if (!!rfrAtt) {
            var rfrValue = rfrAtt.getValue();
            if (!!rfrValue && rfrValue[0].name == "Medication - Renewal Narcotic") {
                retrieveTeamsForUser(
                    function (retrievedRecords) {
                        if (retrievedRecords.length < 1) return;
                        for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                            var thisTeam = retrievedRecords[i];
                            if (thisTeam.hasOwnProperty("Name") && thisTeam.Name == "Pharmacy") {
                                reasonForSubstanceRenewalControl.getAttribute().setRequiredLevel("required");
                                reasonForSubstanceRenewalControl.clearNotification();
                                reasonForSubstanceRenewalControl.setVisible(true);
                                break;
                            }
                        }
                    }
                );
            }
            else {
                reasonForSubstanceRenewalControl.getAttribute().setValue();
            }
        }
    }
    catch (e) {
        alert('Error occurred in set Reason for Renewal: ' + e.message);
    }
}

function filterRFR() {
    //deprecated for regular lookup filtering via form field configuration
    return;
    try {
        if (Xrm.Page.getControl("tri_reasonforrequest")) {
            retrieveTeamsForUser(
                function (retrievedRecords) {
                    if (retrievedRecords.length < 1) return;
                    for (var i = 0, l = retrievedRecords.length; i < l; i++) {
                        var thisTeam = retrievedRecords[i];
                        if (thisTeam.hasOwnProperty("Name") && thisTeam.hasOwnProperty("TeamId") &&
                            (thisTeam.Name == "Pharmacy" || thisTeam.Name == "LIP User" || thisTeam.Name == "CCA Team" || thisTeam.Name == "RN")) {
                            var fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                                '     <entity name="ftp_reasonforrequest">' +
                                '         <attribute name="ftp_reasonforrequestid" />' +
                                '         <attribute name="ftp_reason" />' +
                                '         <attribute name="createdon" />' +
                                '         <filter type="and">' +
                                '             <condition attribute="statecode" operator="eq" value="0" />' +
                                '             <condition attribute="ftp_display" operator="eq" value="1" />' +
                                '         </filter>' +
                                '        <link-entity name="ftp_ftp_reasonforrequest_team" from="ftp_reasonforrequestid" to="ftp_reasonforrequestid">' +
                                '            <link-entity name="team" from="teamid" to="teamid" alias="ac">' +
                                '                <filter type="and">' +
                                '                    <condition attribute="teamid" value="' + thisTeam.TeamId + '" uitype="team" uiname="' + thisTeam.Name + '" operator="eq" />' +
                                '                </filter>' +
                                '            </link-entity>' +
                                '        </link-entity>' +
                                '     </entity>' +
                                ' </fetch>';
                            var layoutXml = '<grid name="resultset" object="1" jump="ftp_reasonforrequestid" select="1" icon="1" preview="1">' +
                                '<row name="result" id="ftp_reasonforrequestid">' +
                                '<cell name="ftp_reason" width="150" />' +
                                '<cell name="createdon" width="150" />' +
                                '</row>' +
                                '</grid>';
                            Xrm.Page.getControl("tri_reasonforrequest").addCustomView(
                                "{00000000-0000-0000-0000-00000000000" + i + "}",
                                "ftp_reasonforrequest",
                                "Reasons for Request",
                                fetchXml,
                                layoutXml,
                                true
                            );
                            break;
                        }
                    }//end for loop
                }
            );
        }
    }
    catch (e) {
        alert('Error occurred in filter RFR: ' + e.message);
    }
}

function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}

/*used by USD agent script answers*/
function setupOutboundInteraction(pOutboundCallRFRName) {
    /*requires SDK.REST library for retrieval of appropriate Reason For Request record*/
    var retrievedReasons = [];
    var rfrName = !!pOutboundCallRFRName ? pOutboundCallRFRName : "Pharmacy Outbound Call";
    var query = "$select=ftp_reasonforrequestId,ftp_reason&$filter=ftp_reason eq '" + rfrName + "' and statecode/Value eq 0&$orderby=CreatedOn desc";
    SDK.REST.retrieveMultipleRecords(
        "ftp_reasonforrequest",
        query,
        function (retrievedRecords) {
            if (!!retrievedRecords && retrievedRecords.length > 0) retrievedReasons = retrievedReasons.concat(retrievedRecords);
        },
        errorHandler,
        function () {
            if (retrievedReasons.length > 0) {
                var outboundRFR = retrievedReasons[0];
                Xrm.Page.getAttribute("tri_interactiontype").setValue(167410009); /*set type to 'Other'*/
                Xrm.Page.getAttribute("tri_reasonforrequest").setValue([{ id: outboundRFR.ftp_reasonforrequestId, name: outboundRFR.ftp_reason, entityType: "ftp_reasonforrequest" }]);/*reason for request*/
                Xrm.Page.getAttribute("ftp_direction").setValue(true);/*outbound*/
                Xrm.Page.getAttribute("tri_firstcallinteraction").setValue(false);/*first call resolution = no, as of 5/30/17*/
                Xrm.Page.getAttribute("ftp_interactedwith").setRequiredLevel("none");

                /*Hide Combo Request button?*/

                /*Show Outbound Interaction Details tab*/
                Xrm.Page.ui.tabs.get("Tab_OutboundPharmacyInteraction").setVisible(true);
                Xrm.Page.ui.tabs.get("Tab_OutboundPharmacyInteraction").setDisplayState("expanded");
                Xrm.Page.getControl("ftp_outboundinteractionwhoansweredtext").setVisible(false);

                _usedOutboundCallScript = true;
            }
            else {
		        /*
				could not find the "Pharmacy Outbound Call" reason for request record
				future: if we setup the proper N:N relationship between ftp_reasonforrequest and ftp_facility entity, we can filter against current user's facility.
				*/
                alert("Script error in setupOutboundInteraction(): Could not find '" + rfrName + "' reason for request.");
            }
        }
    );
}

/*used by USD agent script answers*/
function setOutboundInteractionAddressSelection(pValue) {
    if (!!pValue) {
        Xrm.Page.getAttribute("ftp_outboundinteractionaddress").setValue(pValue);
    }
}

/*used by USD agent script answers*/
function setOutboundInteractionSubReasonSelection(pName) {
    /*
	find sub-reason record called pName and fill the ftp_outboundinteractionsubreasonid lookup field on this interaction
	*/
    if (!!pName) {
        var retrievedReasons = [];
        var query = "$select=ftp_subreasonId,ftp_name&$filter=ftp_name eq '" + pName + "' and statecode/Value eq 0&$orderby=CreatedOn desc";
        SDK.REST.retrieveMultipleRecords(
            "ftp_subreason",
            query,
            function (retrievedRecords) {
                if (!!retrievedRecords && retrievedRecords.length > 0) retrievedReasons = retrievedReasons.concat(retrievedRecords);
            },
            errorHandler,
            function () {
                if (retrievedReasons.length > 0) {
                    var subreason = retrievedReasons[0];
                    Xrm.Page.getAttribute("ftp_outboundinteractionsubreasonid").setValue([{ id: subreason.ftp_subreasonId, name: subreason.ftp_name, entityType: "ftp_subreason" }]);
                    Xrm.Page.getAttribute("ftp_outboundinteractionsubreasonid").fireOnChange();
                }
                else {
			        /*
					could not find the reason for request record called pName
					*/
                    alert("Script error in setOutboundInteractionSubReasonSelection(): Could not find '" + pName + "' sub-reason record.");
                }
            }
        );
    }
}

function ftp_outboundinteractionsubreasonid_onChange() {
    var reasonValue = Xrm.Page.getAttribute("ftp_outboundinteractionsubreasonid").getValue();
    var reasonName = !!reasonValue && reasonValue.length == 1 ? reasonValue[0].name : null;

    /*setup ftp_outboundinteractioncallreasonother field */
    var otherTextControl = Xrm.Page.getControl("ftp_outboundinteractioncallreasonother");
    if (!!otherTextControl) {
        otherTextControl.setVisible(reasonName == "Other");
        otherTextControl.getAttribute().setRequiredLevel(reasonName == "Other" ? "required" : "none");
        //otherTextControl.setFocus();
    }
}

function ftp_outboundinteractionwhoansweredos_onChange() {
    /*
		keep the value of ftp_outboundinteractionwhoansweredtext field in-sync with user's selection in the ftp_outboundinteractionwhoansweredos field;
		if ftp_outboundinteractionwhoansweredos value is 100000005 ("other"), show and require the ftp_outboundinteractionwhoansweredtext field
	*/
    var whoAnsweredOSValue = Xrm.Page.getAttribute("ftp_outboundinteractionwhoansweredos").getValue();

    /*setup ftp_outboundinteractionwhoansweredtext field*/
    var whoAnsweredTextControl = Xrm.Page.getControl("ftp_outboundinteractionwhoansweredtext");
    if (!!whoAnsweredTextControl) {
        whoAnsweredTextControl.setVisible(whoAnsweredOSValue == 100000005);
        whoAnsweredTextControl.getAttribute().setValue((!!whoAnsweredOSValue && whoAnsweredOSValue != 100000005) ? Xrm.Page.getAttribute("ftp_outboundinteractionwhoansweredos").getText() : null);
        whoAnsweredTextControl.getAttribute().setRequiredLevel(whoAnsweredOSValue == 100000005 ? "required" : "none");
        if (whoAnsweredOSValue == 100000005) { whoAnsweredTextControl.setFocus(); }
    }
}

function tri_firstcallinteraction_onChange() {
    var fcrAttr = Xrm.Page.getAttribute("tri_firstcallinteraction");
    var callBackNumberAttr = Xrm.Page.getAttribute("ftp_callbacknumber");
    if (!!fcrAttr && !!callBackNumberAttr) {
        callBackNumberAttr.setRequiredLevel(fcrAttr.getValue() == true ? "none" : "required");
    }
}

function errorHandler(error) {
    writeToConsole(error.message);
    alert(error.message);
}

function newProgressNoteFromRibbon() {

    debugger;

    try {
        var vcmn_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
        var vcmn_serverUrl = Xrm.Page.context.getClientUrl();
        //alert('Launched New Progress Note Window');
        var vcmn_entityId = Xrm.Page.data.entity.getId();
        var vcmn_entityType = Xrm.Page.data.entity.getEntityName();
        var vcmn_primaryAtributeValue = Xrm.Page.data.entity.getPrimaryAttributeValue();
        var vcm_patientAttr = Xrm.Page.getAttribute("ftp_veteran").getValue()[0];
        var vcm_patientId = vcm_patientAttr.id.replace(/\{|\}/gi, '');
        var vcm_patientName = vcm_patientAttr.name;

        //Populate values of the crm attributes to be included on the form
        var vcmn_extraqs = "";
        vcmn_extraqs += "subject=" + "New Progress Note";
        vcmn_extraqs += "&regardingobjectid=" + vcmn_entityId + "&regardingobjectidname=" + vcmn_primaryAtributeValue + "&regardingobjectidtype=" + vcmn_entityType;
        vcmn_extraqs += "&ftp_patient=" + vcm_patientId + "&ftp_patientname=" + vcm_patientName;
        vcmn_extraqs += "&parameter_regardingobjectid=" + vcmn_entityId + "&parameter_regardingobjectidname=" + vcmn_primaryAtributeValue + "&parameter_regardingobjectidtype=" + vcmn_entityType + "&parameter_triageexpert=NO";
        var vcmn_progressNoteUrl = vcmn_serverUrl + "/apps/vicccms/main.aspx?etn=" + "ftp_progressnote" + "&pagetype=entityrecord&navbar=off" + "&extraqs=" +
            encodeURIComponent(vcmn_extraqs);  //+ "&newWindow=true";
        var vcmn_progressNoteWindow = window.open(vcmn_progressNoteUrl, "_blank", "toolbar=no, scrollbars=yes, status=no, resizable=yes, top=1, left=1, width=1000, height=800", false);
    }
    catch (err) {
        alert('VistA CPRS Multi Note Ribbon Function Error(vcmn_launchNewProgressNote): ' + err.message);
    }
	/*

	
	//ftp_patient

	
	//ftp_patientfacility
	//not on this form - where to get?
	
	//ftp_reasonforrequest
	var reason  = Xrm.Page.getAttribute("tri_reasonforrequest");
	if (reason != null){
		var reasonId = reason.getValue();
		if (reasonId != null && reasonId.length > 0){
			formParameters["ftp_reasonforrequestid"] = reasonId[0].id;
			formParameters["ftp_reasonforrequestidname"] = reasonId[0].name;
			formParameters["ftp_reasonforrequestidtype"] = "ftp_reasonforrequest";	
		}
	}
	
	//ftp_callbacknumber
	var callback  = Xrm.Page.getAttribute("ftp_callbacknumber");
	if (callback != null){
		var callbackVal = callback.getValue();
		formParameters["ftp_callbacknumber"] = callbackVal;
	}
	
	Xrm.Navigation.openForm(entityFormOptions,formParameters).then(successCallback,errorCallback);
	*/

    /*
    var myID = Xrm.Page.data.entity.getId();
    if (myID.indexOf('{') > -1)
        myID = myID.substring(1, myID.length - 1);


    var veteranID = null;
    var patient = Xrm.Page.getAttribute("ftp_veteran");
    var patientId = null;
    if (patient != null) {
        patientId = patient.getValue();
        if (patientId != null && patientId.length > 0) {
            veteranID = patientId[0].id;
        }
    }

    if (veteranID.indexOf('{') > -1)
        veteranID = veteranID.substring(1, veteranID.length - 1);

    var myID = Xrm.Page.data.entity.getId();
    if (myID.indexOf('{') > -1)
        myID = myID.substring(1, myID.length - 1);


    var veteranID = null;
    var veteranName = null;
    var patient = Xrm.Page.getAttribute("ftp_veteran");
    var patientId = null;
    if (patient != null) {
        patientId = patient.getValue();
        if (patientId != null && patientId.length > 0) {
            veteranID = patientId[0].id;
            veteranName = patientId[0].name;
        }
    }

    if (veteranID.indexOf('{') > -1)
        veteranID = veteranID.substring(1, veteranID.length - 1);


    var pnData = {};
    pnData["ftp_callbacknumber"] = Xrm.Page.getAttribute("ftp_callbacknumber").getValue();
    pnData["regardingobjectid_ftp_interaction@odata.bind"] = "/ftp_interactions(" + myID + ")";
    pnData["ftp_createdfromscript"] = true;
    pnData["ftp_isworkloadencounter"] = true;

    Xrm.WebApi.createRecord("ftp_progressnote", pnData).then(
        function success(result) {
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "ftp_progressnote";//Logical name of the entity
            entityFormOptions["entityId"] = result.id; //ID of the entity record
            Xrm.Navigation.openForm(entityFormOptions).then(
                function success(result) {
                },
                function (error) {
                    Xrm.Utility.alertDialog("Error :" + error.message, null);
                }
            );
        },
        function (error) {
            // Show Error
            Xrm.Utility.alertDialog("Error :" + error.message, null);
        }
    );
    */
}