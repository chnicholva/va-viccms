function form_onLoad() {
    Xrm.Page.getAttribute("ftp_callbacknumber").fireOnChange();
    //Note: This function is no longer used, now VIA based
    //filterNoteTitles();
}

function Mask(field, format) {
    var oCtrl = Xrm.Page.getControl(field);
    if (oCtrl != null && oCtrl.getControlType() == 'standard') {
        oCtrl.setFocus();
        $("#" + field + "_i").mask(format);
        oCtrl.blur();
    }
}

function maskPhone() {
    //debugger;
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

function filterNoteTitles() {
    //debugger;
    try {
        var user = Xrm.Page.context.getUserId();
        var SetName = "TeamMembershipSet";
        var filter = "SystemUserId";
        var tArray = [];
        var data = {};
        var d = {};
        data = RetrieveMultipleEntitySync(SetName, filter, user);




        for (i = 0; i < data.d.results.length; i++) {
            tArray.push(data.d.results[i].TeamId);
        }
        for (i = 0; i < tArray.length; i++) {
            d = RetrieveMultipleEntitySync("TeamSet", "", tArray[i]);
            // d = RetrieveAllAttributesByEntitySync("TeamSet", tArray[i]);
            if (d.d.Name === "Pharmacy") {
                //pharmFilter is temporarily disabled pending redesign
                //pharmFilter();

                var pharmLocation = RetrieveSingleRecordSync("ftp_hospitallocationsSet", "ftp_name eq 'REN PHARM TELE CALL CTR'");
                if (Xrm.Page.ui.getFormType() == 1) {
                    SetLookupValue("ftp_notehospitallocation", pharmLocation.d.results[0].ftp_hospitallocationsId, pharmLocation.d.results[0].ftp_name, "ftp_hospitallocations");
                }

            }
            if (d.d.Name === "CCA Team") {
                //debugger;
                var ccaLocation = RetrieveSingleRecordSync("ftp_hospitallocationsSet", "ftp_name eq 'TCP-RENO'");
                var ccaTitle = RetrieveSingleRecordSync("ftp_localtitleSet", "ftp_name eq 'CALL CENTER NOTE'");
                if (Xrm.Page.ui.getFormType() == 1) {
                    SetLookupValue("ftp_notehospitallocation", ccaLocation.d.results[0].ftp_hospitallocationsId, ccaLocation.d.results[0].ftp_name, "ftp_hospitallocations");
                    SetLookupValue("ftp_localnotetitle", ccaTitle.d.results[0].ftp_localtitleId, ccaTitle.d.results[0].ftp_name, "ftp_localtitle");
                }
            }
            if (d.d.Name === "TAN") {
                //debugger;
                var tanLocation = RetrieveSingleRecordSync("ftp_hospitallocationsSet", "ftp_name eq 'TCP-RENO'");
                var tanTitle = RetrieveSingleRecordSync("ftp_localtitleSet", "ftp_name eq 'CALL CENTER NOTE'");
                if (Xrm.Page.ui.getFormType() == 1) {
                    SetLookupValue("ftp_notehospitallocation", tanLocation.d.results[0].ftp_hospitallocationsId, tanLocation.d.results[0].ftp_name, "ftp_hospitallocations");
                    SetLookupValue("ftp_localnotetitle", tanTitle.d.results[0].ftp_localtitleId, tanTitle.d.results[0].ftp_name, "ftp_localtitle");
                }
            }
        }
    }
    catch (e) {
    }

}
function pharmFilter() {


    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
  '<entity name="ftp_localtitle">' +
    '<attribute name="ftp_name" />' +
    '<attribute name="createdon" />' +
    '<attribute name="ftp_frequentlyused" />' +
    '<attribute name="ftp_facility" />' +
    '<attribute name="ftp_defaultforcca" />' +
    '<attribute name="ftp_localtitleid" />' +
    '<order attribute="ftp_name" descending="false" />' +
    '<link-entity name="ftp_ftp_localtitle_team" from="ftp_localtitleid" to="ftp_localtitleid" visible="false" intersect="true">' +
	'<link-entity name="team" from="teamid" to="teamid" alias="ac">' +
		'<filter type="and">' +
			'<condition attribute="teamid" operator="eq" uiname="Pharmacy" uitype="team" value="{E7625841-30DA-E511-9430-0050568D743D}" />' +
		'</filter>' +
	'</link-entity>' +
    '</link-entity>' +
  '</entity>' +
'</fetch>';
    var entityName = 'ftp_localtitle';
    var viewDisplayName = 'Note Title Lookup View';
    var viewId = Xrm.Page.getControl("ftp_localnotetitle").getDefaultView();
    var isDefault = true;
    var layoutXml = '<grid name="resultset" object="1" jump="ftp_name" select="1" icon="1" preview="1">' +
	'<row name="result" id="ftp_name">' +
	'<cell name="ftp_name" width="150" />' +
	'<cell name="createdon" width="150" />' +
	'</row>' +
	'</grid>';

    var pharmLocation = RetrieveSingleRecordSync("ftp_hospitallocationsSet", "ftp_name eq 'REN PHARM TELE CALL CTR'");
    Xrm.Page.getControl("ftp_localnotetitle").addCustomView(viewId, entityName, viewDisplayName, fetch, layoutXml, isDefault);
    if (Xrm.Page.ui.getFormType() == 1) {
        SetLookupValue("ftp_notehospitallocation", pharmLocation.d.results[0].ftp_hospitallocationsId, pharmLocation.d.results[0].ftp_name, "ftp_hospitallocations");
    }
}

RetrieveMultipleEntitySync = function (EntitySetName, filter, Guid) {

    //This function will return a json object with every attribute from an entity for a single record synchronously 
    try {
        //Perform REST call
        var context = Xrm.Page.context;
        var serverUrl = context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Format Entity Guid
        var EntityIdnobracket = Guid.replace(/({|})/g, '');
        //Construct the JSON Query
        var selectString = "";
        if (filter !== "") { selectString = "?$filter=" + filter + " eq guid'" + EntityIdnobracket + "'"; }
        else { selectString = "(guid'" + EntityIdnobracket + "')?$select=*"; }

        var jsonQuery = serverUrl + ODATA_ENDPOINT + "/" + EntitySetName + selectString;

        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in RetrieveMultipleEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        //Return the data result
        return EntityData;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the RetrieveMultipleEntitySyncEntitySync function.  Error Detail Message: " + err);
    }
};

RetrieveSingleRecordSync = function (EntitySetName, filter) {

    //This function will return a json object with every attribute from an entity for a single record synchronously 
    try {
        //Perform REST call
        var context = Xrm.Page.context;
        var serverUrl = context.getClientUrl();
        var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
        //Construct the JSON Query
        var selectString = "";
        selectString = "?$filter=" + filter;

        var jsonQuery = serverUrl + ODATA_ENDPOINT + "/" + EntitySetName + selectString;

        //Initialize the return value
        var EntityData = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                //Get the data values
                EntityData = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in RetrieveMultipleEntitySync: ' + errorThrown);
            },
            async: false,
            cache: false
        });
        //Return the data result
        return EntityData;
    }
    catch (err) {
        //Display Error
        alert("An error occured in the RetrieveMultipleEntitySyncEntitySync function.  Error Detail Message: " + err);
    }
};

function SetLookupValue(fieldName, id, name, entityType) {
    if (fieldName != null) {
        var lookupValue = new Array();
        lookupValue[0] = new Object();
        lookupValue[0].id = id;
        lookupValue[0].name = name;
        lookupValue[0].entityType = entityType;
        Xrm.Page.getAttribute(fieldName).setValue(lookupValue);
    }
}

function populateVistaFlyout() {
    debugger;
}

function vlc_getCookie(cname) {
    if (arguments.length < 2) {
        var cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i].replace(/^\s+/, '')
            if (c.indexOf(name + '=') == 0) {
                return decodeURIComponent(c.substring(name.length + 1).split('+').join(' '))
            }
        }
        return null
    }
}