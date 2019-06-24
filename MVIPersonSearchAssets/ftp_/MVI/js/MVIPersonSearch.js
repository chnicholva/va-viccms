/// <reference path="../../JScript/VCCM.USDHelper.js" />
var veteranCountFromMVI = 0;
var autoExpandLocationsForSingleVetResult = true;
var autoClicked = false;
var _vetEDIPI = null;
var mhvIDs = [];
var retrievedSettings = null,
    dacURL = null,
    esrResponseObject = {},
    includeESRHomeStationQuery = false;
var _dob = "1/1/1900";
var _deceasedDate = "1/1/2000";
var _edipi = "";
var _icn = "";
var _gender = "";
var _middleName = "";
var _ssn = "";
var _firstName = "";
var _lastName = "";
var _suffix = "";
var context = null;
var _selectedVetIsSensitive = false;
var _esrDataForUSD = [];
var webApi;
$(document).ready(function () {
    context = getContext();
    webApi = Xrm.WebApi;
    if (webApi === undefined || webApi == null) {
        webApi = parent.Xrm.WebApi;
    }
    $("#SearchByNameButton").bind("click", function () {
        searchByName();
    });

    $("#SearchByIdentifierButton").bind("click", function () {
        searchByIdentitier();
    });

    $('#clearIdentifierFieldsButton').bind("click", function () {
        $("#EdipiTextBox").val("");
        $("#validationFailedDiv").hide();
        $("#notFoundDiv").hide();
        $("#resultsFieldSetDiv").hide();
        personSearchComplete();
    });

    $('#clearNameFieldsButton').bind("click", function () {
        // clear Trait fields
        $("#LastNameTextBox").val("");
        $("#BirthMonthTextBox").val("");
        $("#BirthDayTextBox").val("");
        $("#BirthYearTextBox").val("");
        $("#SocialSecurityTextBox").val("");
        // additional search fields
        $("#FirstNameTextBox").val("");
        $("#AddMiddleNameTextBox").val("");
        $("#AddGenderTextBox").val("");
        $("#AddMaidenNameTextBox").val("");
        $("#AddHomeStreetTextBox").val("");
        $("#AddHomeCityTextBox").val("");
        $("#AddHomeStateTextBox").val("");
        $("#AddHomeZipTextBox").val("");
        $("#AddPhoneNoTextBox").val("");
        $("#AddBirthCityTextBox").val("");
        $("#AddBirthStateTextBox").val("");
        $("#AddMMNTextBox").val("");
        $("#validationFailedDiv").hide();
        $("#notFoundDiv").hide();
        $("#resultsFieldSetDiv").hide();

        veteranCountFromMVI = 0;
        personSearchComplete();
    });

    $('#createNewVeteranButton').bind("click", createNewVeteran);

    // Added to get parameters from CTI call
    updateFieldsFromQueryString();
});

function updateRecord(entityName, id, entity, successCallback, errorCallback) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", serverURL + "/api/data/v8.2/" + entityName + "s(" + id.replace("{", "").replace("}", "") + ")" + filter, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200) {
                var data = JSON.parse(this.response);
                successCallback(data);
            } else {
                errorCallback(JSON.parse(this.response).error);
            }
        }
    };
    req.send(JSON.stringify(entity));
}

function retrieveRecord(entityName, id, filter, successCallback, errorCallback) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", serverURL + "/api/data/v8.2/" + entityName + "s(" + id.replace("{", "").replace("}", "") + ")" + filter, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200) {
                var data = JSON.parse(this.response);
                successCallback(data);
            } else {
                errorCallback(JSON.parse(this.response).error);
            }
        }
    };
    req.send();
}
function retrieveMultipleRecords(entityName, filter, successCallback, errorCallback) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", serverURL + "/api/data/v8.2/" + entityName + "s?" + filter, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200) {
                var data = JSON.parse(this.response);
                successCallback(data.value);
            } else {
                errorCallback(JSON.parse(this.response).error);
            }
        }
    };
    req.send();
}
//end jQuery Document.ready
function personSearchComplete() {
    if (autoExpandLocationsForSingleVetResult && veteranCountFromMVI == 1) {
        $("#stationTmpDialog").show(); //if MVI returns 1 and only 1 veteran, show this waiting message while stations are automatically fetched
    }
    else {
        $("#stationTmpDialog").hide();
    }
    $('div#tmpDialog').hide();
    $("#deathAndSensitivityTmpDialog").hide();
    $("#SearchByNameButton").attr('disabled', false);
    $("#SearchByAddButton").attr('disabled', false);
    $("#SearchByIdentifierButton").attr('disabled', false);
    //$("#personSearchResultsTable").find("tr:gt(0)").focus();               
    $("#personSearchResultsTable").focus();
}

function buildQueryFilter(field, value, and) {
    // remove unwanted characters                           
    var arr1 = ["'", "\""];
    for (a = 0; a < arr1.length ; a++) {
        if (value.indexOf(arr1[a]))
            value = value.replace(arr1[a], " ");
    }

    if (and) {
        return " and " + field + " eq '" + value + "'";
    } else {
        return field + " eq '" + value + "'";
    }
}

// **Comment out for correct method calls below:
//      searchCallBack    -   used w/out addition of checking for the veteran facility/locations
//      searchCallBackWithStations -   used to create the additional table/grid of veteran facility/locations
//
function edipiSearchCallBack(data) {
    //searchCallBack(data);     
    searchCallBackWithStations(data, true);
    personSearchComplete();
}

function personSearchCallBack(data) {
    //searchCallBack(data);     
    searchCallBackWithStations(data, false);
    personSearchComplete();
;}

function searchCallBack(returnData) {
    /**************

    For VCCM, this function is not used.  Go to searchCallBackWithStations() instead.



    ******************/
    $('div#tmpDialog').show();
    // get the table
    var table = $("#personSearchResultsTable");

    // reset the table by removing all data rows
    $("#personSearchResultsTable").find("thead, tr, th").remove();
    $("#personSearchResultsTable").find("tr:gt(0)").remove();
    $("#resultsFieldSetDiv").hide();

    if (returnData != null && returnData.length > 0) {

        // check for exceptions 1st
        if (returnData[0].crme_exceptionoccured || (returnData[0].crme_returnmessage != null && returnData[0].crme_returnmessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
            $("#searchResultsMessageDiv").show();
            $("#searchResultsMessageDiv").text(returnData[0].crme_exceptionmessage != null ? returnData[0].crme_exceptionmessage : returnData[0].crme_returnmessage);
            $("#resultsFieldSetDiv").show();
            return;
        }

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');

        for (var i = 0; i < returnData.length; i++) {

            var fullName = formatName(returnData[i]);

            //CRMe can return result, even if just ReturnMessage that there were no results...
            //If blank\no name, we should break
            if (fullName.trim() == "") {
                $("#searchResultsMessageDiv").show();
                $("#searchResultsMessageDiv").text((returnData != null && returnData.length > 0 && returnData[0].crme_returnmessage != null) ? returnData[0].crme_returnmessage : "Your search in MVI did not find any records matching the search criteria.");
                $("#notFoundDiv").show();
                $('div#tmpDialog').hide();
                break;
            }
            var dateOfBirth = returnData[i].crme_dobstring == null ? "" : returnData[i].crme_dobstring;
            var address = formatAddress(returnData[i]);
            var phoneNumber = returnData[i].crme_primaryphone == null ? "" : returnData[i].crme_primaryphone;
            var icn = returnData[i].crme_icn == null ? "" : returnData[i].crme_icn;
            var patientMviIdentifier = returnData[i].crme_patientmviidentifier == null ? "" : returnData[i].crme_patientmviidentifier;
            var recordSource = returnData[i].crme_recordsource == null ? "" : returnData[i].crme_recordsource;
            var edipi = returnData[i].crme_edipi == null ? "" : returnData[i].crme_edipi;
            /*global page edipi variable*/
            _vetEDIPI = edipi;
            var ssn = returnData[i].crme_ssn == null ? "" : returnData[i].crme_ssn;
            var firstName = returnData[i].crme_firstname == null ? "" : returnData[i].crme_firstname;
            var lastName = returnData[i].crme_lastname == null ? "" : returnData[i].crme_lastname;
            var alias = returnData[i].crme_alias == null ? "" : returnData[i].crme_alias;
            var gender = returnData[i].crme_gender == null ? "" : returnData[i].crme_gender;
            var deceasedDate = returnData[i].crme_deceaseddate == null ? "" : returnData[i].crme_deceaseddate;
            var identityTheft = returnData[i].crme_identitytheft == null ? "" : returnData[i].crme_identitytheft;
            var vetSensLevel = returnData[i].crme_veteransensitivitylevel == null ? "" : returnData[i].crme_veteransensitivitylevel;
            var branchOfService = returnData[i].crme_branchofservice == null ? "" : returnData[i].crme_branchofservice;

            // *ToDo: Remove. Demo purpose only
            var participantId = returnData[i].crme_patientmviidentifier == null ? "" : returnData[i].crme_patientmviidentifier;

            // *Add any new/different variables you want to display in the Results grid here.
            //            You will also need to add those additional crme_ values to the table, and all
            //  relevant place below.

            if (i == 0) {
                var th1 = document.createElement('th');
                //     var thAlias = document.createElement('th');
                var th2 = document.createElement('th');
                //     var th3 = document.createElement('th');
                var th4 = document.createElement('th');
                var th5 = document.createElement('th');
                var th6 = document.createElement('th');
                var th7 = document.createElement('th');
                var th8 = document.createElement('th');
                //    var th10 = document.createElement('th');
                var th11 = document.createElement('th');
                var th12 = document.createElement('th');
                var th13 = document.createElement('th');
                //    var th14 = document.createElement('th');                            

                th1.appendChild(document.createTextNode('Name'));
                //     thAlias.appendChild(document.createTextNode('Alias'));
                th2.appendChild(document.createTextNode('Date of Birth'));
                //     th3.appendChild(document.createTextNode('Deceased Date'));
                th4.appendChild(document.createTextNode('Sex'));
                th5.appendChild(document.createTextNode('Address'));
                th6.appendChild(document.createTextNode('Phone No'));
                th7.appendChild(document.createTextNode('SSN'));
                th8.appendChild(document.createTextNode('EDIPI'));
                //      th10.appendChild(document.createTextNode('Identity Theft'));
                th11.appendChild(document.createTextNode('Sens. Level'));
                th12.appendChild(document.createTextNode('Source'));
                th13.appendChild(document.createTextNode('Br. of Svc'));
                //       th14.appendChild(document.createTextNode('Part. ID'));                                

                theadRow.appendChild(th1);
                //if (alias != "") {
                //    theadRow.appendChild(thAlias);
                //}
                theadRow.appendChild(th2);
                //if (deceasedDate != "") {
                //    theadRow.appendChild(th3);
                //}
                theadRow.appendChild(th4);
                theadRow.appendChild(th5);
                theadRow.appendChild(th6);
                theadRow.appendChild(th7);
                theadRow.appendChild(th8);
                //if (identityTheft != "") {
                //    theadRow.appendChild(th10);
                //}
                theadRow.appendChild(th11);
                theadRow.appendChild(th12);
                theadRow.appendChild(th13);
                //    theadRow.appendChild(th14);                  
                thead.appendChild(theadRow);
            }

            // Table rows
            var row = document.createElement('tr');
            var col1 = document.createElement('td');
            //      var colAlias = document.createElement('td');
            var col2 = document.createElement('td');
            //      var col3 = document.createElement('td');
            var col4 = document.createElement('td');
            var col5 = document.createElement('td');
            var col6 = document.createElement('td');
            var col7 = document.createElement('td');
            var col8 = document.createElement('td');
            //      var col10 = document.createElement('td');
            var col11 = document.createElement('td');
            var col12 = document.createElement('td');
            var col13 = document.createElement('td');
            //      var col14 = document.createElement('td');                                                          
            col1.appendChild(document.createTextNode(fullName));
            //      colAlias.appendChild(document.createTextNode(alias));
            col2.appendChild(document.createTextNode(dateOfBirth));
            //      col3.appendChild(document.createTextNode(deceasedDate));
            col4.appendChild(document.createTextNode(gender));
            col5.appendChild(document.createTextNode(address));
            col6.appendChild(document.createTextNode(phoneNumber));
            col7.appendChild(document.createTextNode(ssn));
            col8.appendChild(document.createTextNode(edipi));
            //       col10.appendChild(document.createTextNode(identityTheft));
            col11.appendChild(document.createTextNode(vetSensLevel));
            col12.appendChild(document.createTextNode(recordSource));
            col13.appendChild(document.createTextNode(branchOfService));
            //       col14.appendChild(document.createTextNode(participantId));                 // *ToDo: Remove. Demo purpose only
            row.appendChild(col1);

            //if (alias != "") {
            //    row.appendChild(colAlias);
            //}
            row.appendChild(col2);
            //if (deceasedDate != "") {
            //    row.appendChild(col3);
            //}
            row.appendChild(col4);
            row.appendChild(col5);
            row.appendChild(col6);
            row.appendChild(col7);
            row.appendChild(col8);
            //if (identityTheft != "") {
            //    row.appendChild(col10);
            //}
            row.appendChild(col11);
            row.appendChild(col12);
            row.appendChild(col13);
            //      row.appendChild(col14);                                                                                              
            row.setAttribute('fullName', fullName);
            row.setAttribute('dateofbirth', dateOfBirth);
            row.setAttribute('fulladdress', address);
            row.setAttribute('ssn', ssn);
            row.setAttribute('edipi', edipi);
            row.setAttribute('recordSource', recordSource);
            row.setAttribute('firstName', firstName);
            row.setAttribute('lastName', lastName);
            row.setAttribute('patientMviIdentifier', patientMviIdentifier);
            row.setAttribute('icn', icn);
            row.setAttribute('vetSensLevel', vetSensLevel);
            row.setAttribute('participantId', participantId);
            row.setAttribute('gender', gender);

            row.className = (i % 2 == 0) ? "even" : "odd";

            row.ondblclick = function () { openSelectedPerson(this); };
            row.onkeydown = function (e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    openSelectedPerson(this);
                }
            };
            row.tabIndex = 100 + i;
            table.append(thead);
            table.append(row);

            $("#resultsFieldSetDiv").show();
            if (i == 1)
                row.focus = true;
        }
    }
    else {
        $("#notFoundDiv").show();
        $('div#tmpDialog').hide();
    }

    $("#searchResultsMessageDiv").show();
    $("#searchResultsMessageDiv").text((returnData != null && returnData.length > 0 && returnData[0].crme_returnmessage != null) ? returnData[0].crme_returnmessage : "Your search in MVI did not find any records matching the search criteria.");
    //document.getElementById("searchResultsMessageDiv").scrollIntoView();
}

// use this when you need the ability to show the additional Station/Location grid
function searchCallBackWithStations(returnData, isEdipi) {
    veteranCountFromMVI = 0;
    $('div#tmpDialog').show();
    // get the table
    var table = $("#personSearchResultsTable");

    // reset the table by removing all data rows
    $("#personSearchResultsTable").find("thead, tr, th").remove();
    $("#personSearchResultsTable").find("tr:gt(0)").remove();
    $("#resultsFieldSetDiv").hide();

    //     clearResults();
    var veteranData = [];
    var stationData = [];
    if (returnData != null && returnData.length == 1 && returnData[0] != null && returnData[0].crme_returnmessage != null && returnData[0].crme_lastname == null && returnData[0].crme_patientmviidentifier == null) {
        veteranData = returnData;
    }
    //    else {
    if (isEdipi) {
        for (var i = 0; i < returnData.length; i++) {
            if (returnData[i].crme_lastname && returnData[i].crme_patientmviidentifier) {
                veteranData.push(returnData[i]);
            } else {
                stationData.push(returnData[i]);
            }
        }
    } else {
        veteranData = returnData;
    }

    //var displayMsg = "Your search in MVI did not find any records matching the search criteria.";
    //if (returnData != null && returnData[0].crme_returnmessage != "Your search in MVI did not find any records matching the search criteria.") {

    //}



    if (veteranData != null &&
        veteranData.length > 0 &&
        returnData != null &&
        (returnData[0].crme_returnmessage != "Your search in MVI did not find any records matching the search criteria." && returnData[0].crme_exceptionmessage != "Your search in MVI did not find any records matching the search criteria.")
    ) {

        // check for exceptions 1st  
        if (returnData[0].crme_exceptionoccured ||
            returnData[0].crme_returnmessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists." ||
            returnData[0].crme_returnmessage == "Unknown Key Identifier| Unknown Key Identifier" /*EDIPI search error*/
        ) {
            $("#searchResultsMessageDiv").show();
            $("#searchResultsMessageDiv").text(returnData[0].crme_exceptionmessage != null ? returnData[0].crme_exceptionmessage : returnData[0].crme_returnmessage);
            $("#resultsFieldSetDiv").show();
            return;
        }

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');

        for (var i = 0; i < veteranData.length; i++) {
            veteranCountFromMVI++;
            var fullName = formatName(veteranData[i]);

            if (fullName === "") {
                $("#searchResultsMessageDiv").show();

                //  var displayMsg = "Your search in MVI did not find any records matching the search criteria.";
                //     if (returnData[0].crme_returnmessage != null && returnData[0].crme_returnmessage != "Unknown Key Identifier| Unknown Key Identifier") {
                //        displayMsg = returnData[0].crme_returnmessage;
                //      } 
                //     else
                //       displayMsg = "Your search in MVI did not find any records matching the search criteria.";

                $("#searchResultsMessageDiv").text(returnData[0].crme_exceptionmessage);
                $("#notFoundDiv").show();
                $('div#tmpDialog').hide();
                break;
            }

            var contactId = veteranData[i].crme_personId == null ? "" : veteranData[i].crme_personId;
            var dateOfBirth = veteranData[i].crme_dobstring == null ? "" : veteranData[i].crme_dobstring;
            var address = formatAddress(veteranData[i]);
            var patientMviIdentifier = veteranData[i].crme_patientmviidentifier == null ? "" : veteranData[i].crme_patientmviidentifier;
            var recordSource = veteranData[i].crme_recordsource == null ? "" : veteranData[i].crme_recordsource;
            var edipi = veteranData[i].crme_edipi == null ? "" : veteranData[i].crme_edipi;
            /*page variable*/
            _vetEDIPI = edipi;
            var ssn = veteranData[i].crme_ssn == null ? "" : veteranData[i].crme_ssn;
            var firstName = veteranData[i].crme_firstname == null ? "" : veteranData[i].crme_firstname;
            var middleName = veteranData[i].crme_middlename == null ? "" : veteranData[i].crme_middlename;
            var lastName = veteranData[i].crme_lastname == null ? "" : veteranData[i].crme_lastname;
            var suffix = veteranData[i].crme_suffix == null ? "" : veteranData[i].crme_suffix;
            var alias = veteranData[i].crme_alias == null ? "" : veteranData[i].crme_alias;
            var gender = veteranData[i].crme_gender == null ? "" : veteranData[i].crme_gender;
            var deceasedDate = veteranData[i].crme_deceaseddate == null ? "" : veteranData[i].crme_deceaseddate;
            var identityTheft = veteranData[i].crme_identitytheft == null ? "" : veteranData[i].crme_identitytheft;
            var participantId = veteranData[i].crme_participantid == null ? "" : veteranData[i].crme_participantid;
            var phoneNumber = veteranData[i].crme_primaryphone == null ? "" : veteranData[i].crme_primaryphone;
            var retrieveFilter = veteranData[i].crme_url == null ? "" : veteranData[i].crme_url;
            var vetSensLevel = returnData[i].crme_veteransensitivitylevel == null ? "" : returnData[i].crme_veteransensitivitylevel;
            var branchOfService = returnData[i].crme_branchofservice == null ? "" : returnData[i].crme_branchofservice;
            var icn = returnData[i].crme_icn == null ? "" : returnData[i].crme_icn;


            if (i === 0) {
                var th0 = document.createElement('th'); //commenting out location details for now - lpa - 2016-01-13
                var th1 = document.createElement('th');
                //     var thAlias = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');
                var th4 = document.createElement('th');
                var th5 = document.createElement('th');
                var th6 = document.createElement('th');
                var th7 = document.createElement('th');
                var th8 = document.createElement('th');
                //    var th10 = document.createElement('th');
                var th11 = document.createElement('th');
                var th12 = document.createElement('th');
                var th13 = document.createElement('th');
                //    var th14 = document.createElement('th');                            // *ToDo: Remove. Demo purpose only

                th1.appendChild(document.createTextNode('Name'));
                //     thAlias.appendChild(document.createTextNode('Alias'));
                th2.appendChild(document.createTextNode('Date of Birth'));
                th3.appendChild(document.createTextNode('Deceased Date'));
                th4.appendChild(document.createTextNode('Sex'));
                th5.appendChild(document.createTextNode('Address'));
                th6.appendChild(document.createTextNode('Phone No'));
                th7.appendChild(document.createTextNode('SSN'));
                th8.appendChild(document.createTextNode('EDIPI'));
                //      th10.appendChild(document.createTextNode('Identity Theft'));
                th11.appendChild(document.createTextNode('Sens. Level'));
                th12.appendChild(document.createTextNode('Source'));
                th13.appendChild(document.createTextNode('Br. of Svc'));

                theadRow.appendChild(th0); //commenting out location details for now - lpa - 2016-01-13
                theadRow.appendChild(th1);
                theadRow.appendChild(th2);
                //if (deceasedDate != "") {
                theadRow.appendChild(th3);
                //}
                theadRow.appendChild(th4);
                theadRow.appendChild(th5);
                theadRow.appendChild(th6);
                theadRow.appendChild(th7);
                theadRow.appendChild(th8);
                //if (identityTheft != "") {
                //    theadRow.appendChild(th10);
                //}
                theadRow.appendChild(th11);
                theadRow.appendChild(th12);
                theadRow.appendChild(th13);
                thead.appendChild(theadRow);
                table.append(thead);
            }

            // Table rows
            var row = document.createElement('tr');
            var col0 = document.createElement('td'); //commenting out location details for now - lpa - 2016-01-13
            var col1 = document.createElement('td');
            var col2 = document.createElement('td');
            var col3 = document.createElement('td');
            var col4 = document.createElement('td');
            var col5 = document.createElement('td');
            var col6 = document.createElement('td');
            var col7 = document.createElement('td');
            var col8 = document.createElement('td');
            //      var col10 = document.createElement('td');
            var col11 = document.createElement('td');
            var col12 = document.createElement('td');
            var col13 = document.createElement('td');

            // comment out start - to disable Station subgrid functionality (also comment out comments from lpa)
            var aElem = document.createElement('a');
            aElem.className = "GetStationDataButton";
            aElem.href = "#";
            var aElemNode = document.createTextNode("+");
            aElem.appendChild(aElemNode);
            aElem.setAttribute('data-retrieveFilter', retrieveFilter);
            aElem.setAttribute('data-patientId', patientMviIdentifier);
            aElem.setAttribute('fullName', fullName);
            aElem.setAttribute('dateofbirth', dateOfBirth);
            aElem.setAttribute('fulladdress', address);
            aElem.setAttribute('ssn', ssn);
            aElem.setAttribute('edipi', edipi);
            aElem.setAttribute('recordSource', recordSource);
            aElem.setAttribute('firstName', firstName);
            aElem.setAttribute('middleName', middleName);
            aElem.setAttribute('lastName', lastName);
            aElem.setAttribute('suffix', suffix);
            aElem.setAttribute('patientMviIdentifier', patientMviIdentifier);
            aElem.setAttribute('icn', icn);
            aElem.setAttribute('vetSensLevel', vetSensLevel);
            aElem.setAttribute('participantId', participantId);
            aElem.setAttribute('gender', gender);

            //5/11/17 added deceasedDate to aElem
            aElem.setAttribute("deceasedDate", deceasedDate);

            $(aElem).bind("click", function () {
                this.setAttribute("id", "ClickedButton");
                //executeRetrieve(this);
                handleVeteranSelectionWithHomeStationQuery(this);
            });

            col0.appendChild(aElem); //commenting out location details for now - lpa -2016-01-13
            col1.appendChild(document.createTextNode(fullName));
            //      colAlias.appendChild(document.createTextNode(alias));
            col2.appendChild(document.createTextNode(dateOfBirth));
            var deceasedDateDiv = document.createElement("div");
            deceasedDateDiv.setAttribute("class", "deceasedDateText");
            deceasedDateDiv.appendChild(document.createTextNode(deceasedDate));
            col3.appendChild(deceasedDateDiv);
            col4.appendChild(document.createTextNode(gender));
            col5.appendChild(document.createTextNode(address));
            col6.appendChild(document.createTextNode(phoneNumber));
            col7.appendChild(document.createTextNode(ssn));
            col8.appendChild(document.createTextNode(edipi));
            //       col10.appendChild(document.createTextNode(identityTheft));
            //var sensitivityColumnValue = vetSensLevel == "true:true" ? "Sensitive Vet Employee" : vetSensLevel == "true:false" ? "Sensitive Veteran" : "Not Sensitive";
            //kknab: changed on 4/5/18 for simpler interpretation of sensitivity & employee indicators.
            var sensitivityColumnValue = vetSensLevel == "true:true" || vetSensLevel == "true:false" ? "Sensitive" : "Not Sensitive";
            col11.appendChild(document.createTextNode(sensitivityColumnValue));
            col12.appendChild(document.createTextNode(recordSource));
            col13.appendChild(document.createTextNode(branchOfService));

            row.appendChild(col0); //commenting out location details for now - lpa - 2016-01-13
            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
            row.appendChild(col5);
            row.appendChild(col6);
            row.appendChild(col7);
            row.appendChild(col8);
            //if (identityTheft != "") {
            //    row.appendChild(col10);
            //}
            row.appendChild(col11);
            row.appendChild(col12);
            row.appendChild(col13);

            row.setAttribute('fullName', fullName);
            row.setAttribute('dateofbirth', dateOfBirth);
            row.setAttribute('fulladdress', address);
            row.setAttribute('ssn', ssn);
            row.setAttribute('edipi', edipi);
            row.setAttribute('recordSource', recordSource);
            row.setAttribute('firstName', firstName);
            row.setAttribute('middleName', middleName);
            row.setAttribute('lastName', lastName);
            row.setAttribute('suffix', suffix);
            row.setAttribute('patientMviIdentifier', patientMviIdentifier);
            row.setAttribute('icn', icn);
            row.setAttribute('vetSensLevel', vetSensLevel);
            row.setAttribute('participantId', participantId);
            row.setAttribute('gender', gender);

            row.className = (i % 2 === 0) ? "even" : "odd";
            row.id = "resultstable-row-" + i;

            //added by lucas to query station data on row doubleclick or enter key press
            row.ondblclick = function () {
                var anchorsForRow = $(this).find("a");
                if (!!anchorsForRow && anchorsForRow.length == 1) {
                    var anchor = anchorsForRow[0];
                    anchor.setAttribute("id", "ClickedButton");
                    //executeRetrieve(aElem);
                    handleVeteranSelectionWithHomeStationQuery(anchor);
                }

                //aElem.setAttribute("id", "ClickedButton");
                ////executeRetrieve(aElem);
                //handleVeteranSelectionWithHomeStationQuery(aElem);
            };
            row.onkeydown = function (e) {
                if (e.keyCode === 13 || e.keyCode === 32) {
                    var anchorsForRow = $(this).find("a");
                    if (!!anchorsForRow && anchorsForRow.length == 1) {
                        var anchor = anchorsForRow[0];
                        anchor.setAttribute("id", "ClickedButton");
                        //executeRetrieve(aElem);
                        handleVeteranSelectionWithHomeStationQuery(anchor);
                    }

                    //aElem.setAttribute("id", "ClickedButton");
                    ////executeRetrieve(aElem);
                    //handleVeteranSelectionWithHomeStationQuery(aElem);
                }
            };

            var stationRow = document.createElement('tr');
            stationRow.className = "StationRow";

            table.append(row);
            table.append(stationRow);
            //table.append(thead); //8/2/18 moved append(thead) operation into the same step as creating the thead, so that thead exists on the page ahead of the tbody
        }

        $("#StationTable").hide();

        var tabIndex = 30;
        $("#personSearchResultsTable tr").each(function () {
            $(this).children("td").each(function (index) {
                if (index == 0) {
                    this.firstChild.tabIndex = tabIndex;
                } else {
                    this.tabIndex = tabIndex;
                }
                tabIndex++;
            });
        });

        $("#resultsFieldSetDiv").show();
        table.show();
        $("#resultstable-row-0 td:eq(1)").focus();

        //kknab VCCM enhancement: auto expand Stations subgrid if MVI only returns one veteran
        if (autoExpandLocationsForSingleVetResult && veteranCountFromMVI == 1) {
            autoClicked = true;
            $(".GetStationDataButton")[0].click();
        }
    }
    else {
        $("#notFoundDiv").show();
        $('div#tmpDialog').hide();
    }


    $("#resultsFieldSetDiv").show();
    $("#searchResultsMessageDiv").show();
    //  $("#searchResultsMessageDiv").text(displayMsg);
    $("#searchResultsMessageDiv").text((returnData != null && returnData.length > 0 && returnData[0].crme_returnmessage != null && returnData[0].crme_returnmessage != "Unknown Key Identifier| Unknown Key Identifier") ? returnData[0].crme_returnmessage : "Your search in MVI did not find any records matching the search criteria.");

}

//for VCCM, this is called when selecting a station
function openSelectedPerson(obj) {
    $("#stationTmpDialog").hide();
    $('div#tmpDialog').show();
    var firstName = obj.getAttribute('firstName');
    var lastName = obj.getAttribute('lastName');
    var patientMviIdentifier = obj.getAttribute('patientMviIdentifier');
    var dfn = obj.getAttribute("DFN");
    var facilityCode = obj.getAttribute("facilityCode");
    var ssn = obj.getAttribute('ssn');
    var alias = obj.getAttribute('alias');
    var USDEventLink = obj.getAttribute('link');
    var dob = obj.getAttribute('dateofbirth');
    //var edipi = obj.getAttribute('edipi');
    var edipi = _edipi;
    //var gender = obj.getAttribute('gender');
    var gender = _gender
    //var middleName = obj.getAttribute('middleName');
    var middleName = _middleName
    var suffix = obj.getAttribute('suffix');
    var vetSensLevel = obj.getAttribute("vetSensLevel");

    /*TODO: adjust select* to only select appropriate columns*/
    //var filterPrefix = "$select=*&$filter=";
    var filterPrefix = "$select=contactid,fullname,firstname,lastname&$filter=";

    //  var filter = buildQueryFilter("tri_VeteranID", edipi, false);
    var filter = buildQueryFilter("firstname", firstName, false);
    filter += buildQueryFilter("lastname", lastName, true);
    filter += buildQueryFilter("tri_searchtype_text", "CREATEUPDATEMVI", true);
    //filter += buildQueryFilter("bah_MVIpatientidentifier", patientMviIdentifier, true); removed by kknab on 9/27 - cannot pass this field to a retrievemultiple of Contact, b/c the BAH.Core.Plugin will update that field in the DB, but we can no longer store bah_mviidentifier in CRM
    if (ssn != "") filter += buildQueryFilter("governmentid", ssn, true);
    if (middleName != "") filter += buildQueryFilter("middlename", middleName, true);
    if (suffix != "") filter += buildQueryFilter("suffix", suffix, true);
    if (gender != "") filter += buildQueryFilter("ftp_gender", gender, true);
    //if (gender == "M"){
    //	filter += " and GenderCode/Value eq 1";
    //}
    //else if (gender == "F"){
    //	filter += " and GenderCode/Value eq 2";
    //}
    if (edipi != "") filter += buildQueryFilter("ftp_edipi", edipi, true);
    if (dob != "") filter += buildQueryFilter("ftp_dateofbirth", dob, true);
    filter = encodeURIComponent(filter);
    filter = filterPrefix + filter;

    //added 9/27/16 by kknab, for more-accurate contact search in the absence of bah_MVIpatientidentifier
    //TODO filter += " and StateCode/Value eq 0";
    //filter += " and ftp_ManuallyCreatedFromMVIcode/Value eq 100000000"/*No*/; //added 12/11/2017
    filter += "&$orderby=modifiedon desc&$top=1";

    //this window.open fires the USD event that is a property of each location in the Veteran's location list
    //it saves the location to context
    if (!!USDEventLink && USDEventLink.trim() != "") {
        VCCM.USDHelper.OpenUSDURL(USDEventLink);
    }


    var retrievedContacts = [];
    retrieveMultipleRecords(
        "contact",
        filter, 
        function (retrievedRecords) {
            if (!!retrievedRecords) retrievedContacts = retrievedContacts.concat(retrievedRecords);

            if (retrievedContacts.length > 0) {
                var thisContact = retrievedContacts[0];
                $("#SearchByIdentifierButton").enable = true;
                $('div#tmpDialog').hide(100);

                var ICN = !!patientMviIdentifier ? patientMviIdentifier.split("^")[0] : "MISSING";
                //add facility and facilityid to Contact URL
                var facilityName = null,
                    facilityId = null;
                if (!!USDEventLink && USDEventLink.trim() != "") {
                    var linkParts = USDEventLink.split("&");
                    for (var p = 0; p < linkParts.length; p++) {
                        var splitPart = linkParts[p].split("=");
                        if (splitPart.length == 2 && splitPart[0] == "site") facilityName = splitPart[1];
                        if (splitPart.length == 2 && splitPart[0] == "siteid") facilityId = splitPart[1];
                    }
                }

                //save MVI data to USD parameters
                var mviDataForUSD = [];
                mviDataForUSD.push("SearchType=Manual");
                mviDataForUSD.push("ICN=" + ICN);
                var deceasedDate = obj.getAttribute("deceasedDate");
                mviDataForUSD.push("DeceasedDate=" + (!!deceasedDate ? deceasedDate : ""));
                var nationalID = ICN != "MISSING" ? ICN.substring(0, 10) : "MISSING";
                mviDataForUSD.push("NationalID=" + (!!nationalID ? nationalID : ""));
                mviDataForUSD.push("EDIPI=" + (!!_vetEDIPI ? _vetEDIPI : "UNK"));
                mviDataForUSD.push("SelectedFacilityCode=" + facilityCode);
                mviDataForUSD.push("SelectedFacilityName=" + facilityName);
                mviDataForUSD.push("SelectedFacilityCRMID=" + facilityId);
                mviDataForUSD.push("SelectedFacilityVetDFN=" + dfn);
                mviDataForUSD.push("VetFullName=" + thisContact.fullname);
                mviDataForUSD.push("VetFirstName=" + thisContact.firstname);
                mviDataForUSD.push("VetLastName=" + thisContact.lastname);
                mviDataForUSD.push("VetCRMContactID=" + thisContact.contactid);
                mviDataForUSD.push("SensitivityLevel=" + vetSensLevel);
                mviDataForUSD.push("IsSensitive=" + (vetSensLevel == "true:true" || vetSensLevel == "true:false").toString());

                /*include knowledge of user's MVI search criteria, for passing to ID validation checkboxes on interaction forms*/
                var lname = $("#LastNameTextBox").val();
                var ssn = $("#SocialSecurityTextBox").val();
                var dobyear = $("#BirthYearTextBox").val();
                var dobmonth = $("#BirthMonthTextBox").val();
                var dobday = $("#BirthDayTextBox").val();
                mviDataForUSD.push("SearchedWithLastName=" + (!!lname).toString());
                mviDataForUSD.push("SearchedWithDOB=" + (!!dobyear && dobyear != "YYYY" && dobyear != "" && !!dobmonth && dobmonth != "MM" && dobmonth != "" && !!dobday && dobday != "DD" && dobday != "").toString());
                mviDataForUSD.push("SearchedWithSSN=" + (!!ssn).toString());

                VCCM.USDHelper.CopyDataToReplacementParameters("MVI", mviDataForUSD, false);
                //TODO VCCM.USDHelper.CopyDataToReplacementParameters("ESR", _esrDataForUSD, false);
                VCCM.USDHelper.AddFunctionToQueue(function () {
                    //open VeteranAlerts.html web resource
                    var veteranAlertsURLParameters = "originatedFromMVISearch=true"
                        + "&alreadyQueriedESR=" + (includeESRHomeStationQuery && !!esrResponseObject).toString()
                        //+ "&isSensitive=" + _selectedVetIsSensitive.toString()
                        + "&isSensitive=" + (vetSensLevel == "true:true" || vetSensLevel == "true:false").toString() /*changed to use MVI sensitivity value instead of ESR value*/
                        + "&contactid=" + thisContact.contactid
                        + "&fullname=" + thisContact.fullname
                        + "&firstname=" + thisContact.firstname
                        + "&lastname=" + thisContact.lastname
                        + "&ICN=" + ICN
                        + "&nationalid=" + nationalID
                        //+ "&IsUSD=" + (location.href.indexOf("Outlook15White") != -1 ? "true" : "false")
                        + "&DFN=" + dfn
                        + "&veteranFacilityCode=" + facilityCode
                        + ("&EDIPI=" + (!!_vetEDIPI ? _vetEDIPI : "UNK"))
                        + (mhvIDs.length > 0 ? "&MHVIDs=" + mhvIDs.join(",") : "");
                    veteranAlertsURLParameters += !!deceasedDate ? ("&deceasedDate=" + deceasedDate) : "";
                    if (!!facilityId && !!facilityName) {
                        veteranAlertsURLParameters += "&ftp_facility=" + facilityName + "&ftp_currentfacilityid=" + facilityId + "&ftp_currentfacilityidname=" + facilityName;
                    }
                    veteranCountFromMVI = 0;
                    $("#deathAndSensitivityTmpDialog").show();
                    Xrm.Utility.openWebResource("ftp_/VeteranAlerts/VeteranAlerts.html", encodeURIComponent(veteranAlertsURLParameters));
                });
            }
            else {
                alert("No data returned by contact search in crm");
            }

        },
        function (error) { alert("Error opening contact: " + error.message); }
    );
    return false;
}

var userSL;
function selectedPersonCallBack(data) {
    //not used by VCCM code.
    // currently called after RetrieveMultiple Contact
    $("#SearchByIdentifierButton").enable = true;
    $('div#tmpDialog').hide(100);
    if (data != null && data.length > 0) {
        var url = Xrm.Page.context.getClientUrl();
        url += "/main.aspx?etc=2&pagetype=entityrecord&id=%7b" + data[0].contactid + "%7d";

        //this window.open() actually opens the CRM contact record
        window.open(url);
    }
    else {
        alert("no data returned by contact search in crm");
    }
}

// ------------Begin Veteran Station Logic----------------------------
function getVeteranStation(personId, stationData) {
    var relatedStations = [];
    for (var i = 0; i < stationData.length; i++) {
        if (stationData[i].ftp_ParentPersonId.Id == personId) {
            relatedStations.push(stationData[i]);
        }
    }
    return relatedStations;
}

function executeRetrieve(element) {
    //this function is called when user clicks on the + or - to expand/collapse the station subgrid beneath a veteran
    //on expansion, it performs the MVI SelectedPersonSearch, to retrieve a veteran's stations/facilities/correlatingIDs

    if (element.innerText == "-") {
        //user clicked '-' to collapse
        personRetrieveCallback(null);
        return;
    }

    //user clicked '+' to expand
    if (autoClicked == true) {
        $('div#stationTmpDialog').show();
    }
    else {
        $('div#tmpDialog').show();
    }

    _dob = "1/1/1900";
    _deceasedDate = "1/1/2000";
    _edipi = "";
    _icn = "";
    _gender = "";
    _middleName = "";
    _ssn = "";
    _firstName = "";
    _lastName = "";
    _suffix = "";

    //var filter = element.getAttribute("data-retrieveFilter");  //"&select=*&filter=crme_patientmviidentifier eq '' and crme_searchtype eq 'SelectedPersonSearch'"
    var patientMviIdentifier = element.getAttribute('patientMviIdentifier');

    var filterPrefix = "$select=*&$filter=";
    var filter = "crme_patientmviidentifier eq '" + patientMviIdentifier + "' and crme_searchtype eq 'SelectedPersonSearch'";
    // var filter = "&select=*&$filter=crme_patientmviidentifier eq '" + patientMviIdentifier + "' and crme_searchtype eq 'SelectedPersonSearch'";
    // update filter/url from row attributes
    var firstName = element.getAttribute('firstName');
    var middleName = element.getAttribute('middleName');
    var lastName = element.getAttribute('lastName');
    var suffix = element.getAttribute('suffix');
    var ssn = element.getAttribute('ssn');
    var participantId = element.getAttribute('participantId');
    var icn = element.getAttribute('icn');
    var edipi = element.getAttribute('edipi');
    var recordSource = element.getAttribute('recordSource');
    var vetSensLevel = element.getAttribute('vetSensLevel');
    var dob = element.getAttribute('dateofbirth');
    var fullAddress = element.getAttribute('fulladdress');

    _firstName = element.getAttribute('firstName');
    _lastName = element.getAttribute('lastName');
    _gender = element.getAttribute('gender');
    _dob = element.getAttribute('dateofbirth'); //this is no longer used b/c we are masking sensitive rows' DOBs with XX/XX/XXXX
    _deceasedDate = element.getAttribute("deceasedDate");
    _middleName = element.getAttribute('middleName');
    _suffix = element.getAttribute('suffix');
    _icn = element.getAttribute('icn');
    _edipi = element.getAttribute('edipi');
    _ssn = element.getAttribute('ssn'); //this is no longer used b/c we are masking sensitive rows' SSNs with XXX-XX-XXXX

    if (firstName != null && firstName != "") filter += buildQueryFilter("crme_firstname", firstName, true);
    if (middleName != null && middleName != "") filter += buildQueryFilter("crme_middlename", middleName, true);
    if (lastName != null && lastName != "") filter += buildQueryFilter("crme_lastname", lastName, true);
    if (suffix != null && suffix != "") filter += buildQueryFilter("crme_suffix", suffix, true);
    if (ssn != null && ssn != "") filter += buildQueryFilter("crme_ssn", ssn, true);
    if (recordSource != null && recordSource != "") filter += buildQueryFilter("crme_recordsource", recordSource, true);
    if (icn != null && icn != "") filter += buildQueryFilter("crme_icn", icn, true);
    if ((icn == null || icn == "") && participantId != null && participantId != "") filter += buildQueryFilter("crme_icn", participantId, true);
    if (edipi != null && edipi != "") filter += buildQueryFilter("crme_edipi", edipi, true);
    if (vetSensLevel != null && vetSensLevel != "") filter += buildQueryFilter("crme_veteransensitivitylevel", vetSensLevel, true);
    if (dob != null && dob != "") filter += buildQueryFilter("crme_mvidobstring", dob, true);
    //  if (fullAddress != null && fullAddress != "") filter += buildQueryFilter("crme_MVIFullAddress", fullAddress, true);

    filter = encodeURIComponent(filter);
    filter = filterPrefix + filter;
    retrieveMultipleRecords("crme_person", filter, personRetrieveCallback, function (error) { errorHandler(error); });
}

function personRetrieveCallback(data) {
    var clickedButton = $("#ClickedButton");
    var nextRow = $(clickedButton).closest('tr').next('tr');
    var className = nextRow.attr('class');

    if (nextRow.has(".SubTableDiv").length === 0) {
        //data not yet retrieved
        createVeteranStationSubgrid(data, nextRow, false);
    }

    expandCollapse(clickedButton);
    clickedButton.removeAttr("id");

    if (autoClicked == true) {
        $('div#stationTmpDialog').hide();
        $('div#tmpDialog').hide();
        autoClicked = false; //reset value
    }
    else {
        $('div#tmpDialog').hide();
    }
}

function expandCollapse(button) {
    var nextRow = $(button).closest('tr').next('tr');
    if ($(nextRow).attr('class') === undefined || $(nextRow).attr('class').indexOf("nav-expanded") === -1) {
        nextRow.addClass("nav-expanded");
        $(button).text("-");
        $("#StationTable").show();
    } else {
        nextRow.removeClass("nav-expanded");
        $(button).text("+");
        $("#StationTable").hide();
    }
}

function createVeteranStationSubgrid(data, row, isEdipi) {
    var subTableCol = document.createElement('td');
    subTableCol.colSpan = $("#personSearchResultsTable > thead > tr:first > th").length;
    var subTableDiv = document.createElement('div');
    subTableDiv.className = "SubTableDiv";

    var previousTabIndex = $(row).prev().children().last()[0].tabIndex;

    var stationTable = createVeteranStationTable(data, previousTabIndex);

    subTableCol.appendChild(stationTable);
    subTableDiv.appendChild(subTableCol);

    if (isEdipi) {
        row.appendChild(subTableDiv);
    }
    else {
        row.append(subTableDiv);
    }
}

function createVeteranStationTable(data, previousTabIndex) {
    var table = document.createElement('table');
    table.id = "StationTable";
    // table.width = "200px";
    table.className = "StationTable";

    var thead = document.createElement("thead");
    var tbody = document.createElement('tbody');
    _vetEDIPI = null;
    mhvIDs = [];
    var preferredFacilityname = getDeepProperty("Data.Demographics.PreferredFacility", esrResponseObject);
    var preferredFacilityCode = !!preferredFacilityname ? preferredFacilityname.split("-")[0] : "";
    preferredFacilityCode = !!preferredFacilityCode ? preferredFacilityCode.trim() : preferredFacilityCode;
    var visibleRowCounter = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty("crme_siteid") && !!data[i].crme_siteid) {
            var facilityCode = data[i].crme_siteid;
            if (facilityCode == "200DOD") {
                /*7/13/17 kknab PatientId from the 200DOD record is the veteran's EDIPI value*/
                _vetEDIPI = data[i].crme_patientid;
            }

            /*9/27/17 kknab gather any/all MHV correlating IDs so we can query the MHV API to find the current 'active' one*/
            if ((facilityCode == "200MHS" || facilityCode == "200MHI") && data[i].hasOwnProperty("crme_patientid") && !!data[i].crme_patientid) {
                /*
                    3/26/18 kknab all MHV functionality has been deprecated at the last minute, due to the MHV group's decision to not allow us to user their APIs in PROD
                    By commenting out the MHV ID collection step, here (and in VeteranAlerts.js for unattended MVI searches), most MHV functionality in the rest of the application (downstream of an MVI search) will remain hidden
                */
                //mhvIDs.push(data[i].crme_patientid);
            }

            /*
                4/28/17 kknab
                only render a row if its crme_siteid is numeric & not alphanumeric

                10/10/17 fix for RTC defect #599638
                also omit rows whose crme_siteid equals '200'
            */
            if (isPhysicalFacility(facilityCode) && facilityCode != "200") {
                //var firstName = data[i].crme_firstname == null ? "" : data[i].crme_firstname;
                //var lastName = data[i].crme_lastname == null ? "" : data[i].crme_lastname;
                var firstName = !!data[i].crme_firstname ? data[i].crme_firstname : _firstName;
                var lastName = !!data[i].crme_lastname ? data[i].crme_lastname : _lastName;
                var middleName = data[i].crme_middlename == null ? "" : data[i].crme_middlename;
                var suffix = !!data[i].crme_suffix ? data[i].crme_suffix : _suffix;
                //var suffix = data[i].crme_suffix == null ? "" : data[i].crme_suffix;
                var dateOfBirth = data[i].crme_dobstring == null ? "" : data[i].crme_dobstring;
                var patientMviIdentifier = data[i].crme_patientmviidentifier == null ? "" : data[i].crme_patientmviidentifier;
                var patientId = data[i].crme_patientid == null ? "" : data[i].crme_patientid;
                var edipi = data[i].crme_edipi == null ? "" : data[i].crme_edipi;
                var ssn = data[i].crme_ssn == null ? "" : data[i].crme_ssn;
                var gender = data[i].crme_gender == null ? "" : data[i].crme_gender;
                var participantId = data[i].crme_participantid == null ? "" : data[i].crme_participantid;
                var vetSensitivityLevel = data[i].crme_veteransensitivitylevel == null ? "false:false" : data[i].crme_veteransensitivitylevel;
                var theadRow = document.createElement("tr");

                /*4/28/17 kknab: after update from kruud, crme_sitename contains the url parameters for our USD event*/
                //var USDEventLink = data[i].crme_url;
                var stationName = "Station";
                var USDEventLink = "http://event/?eventname=Set location&site=&siteid=";
                var thisStationDisplayName = stationName;

                //7/12/18 added getStationName_Sync function because the site name function buried in the MVI plugin is still searching for facility name based on the numeric facility code field, not ftp_facilitycode_text
                //var siteNameValue = getStationName_Sync(facilityCode);
                var facilityObjectFromCRM = getStationName_Sync(facilityCode);
                if (!!facilityObjectFromCRM && !!facilityObjectFromCRM.ftp_name && !!facilityObjectFromCRM.ftp_facilityId) {
                    var siteNameValue = facilityObjectFromCRM.ftp_name;
                    stationName = siteNameValue;
                    USDEventLink = "http://event/?eventname=Set location&site=" + siteNameValue + "&siteid=" + facilityObjectFromCRM.ftp_facilityId;
                    thisStationDisplayName = !!preferredFacilityCode && facilityCode == preferredFacilityCode ? stationName + " (PREFERRED FACILITY: " + preferredFacilityname + ")" : stationName;
                }
                if (i === 0) {
                    var th0 = document.createElement('th');
                    th0.appendChild(document.createTextNode('Location'));
                    theadRow.appendChild(th0);
                    thead.appendChild(theadRow);
                    table.appendChild(thead);
                }

                // Table rows
                var row = document.createElement('tr');
                var col0 = document.createElement('td');

                var stationElement = document.createElement('a');
                stationElement.className = "StationName";
                //    stationElement.href = link;
                stationElement.target = "_blank";
                stationElement.tabIndex = previousTabIndex;

                var stationElementNode = document.createTextNode(thisStationDisplayName);
                stationElement.appendChild(stationElementNode);

                col0.appendChild(stationElement);
                row.appendChild(col0);
                row.setAttribute('StationName', stationName);
                row.setAttribute('link', USDEventLink);
                row.setAttribute('patientMviIdentifier', data[i].crme_patientmviidentifier);
                row.setAttribute('ssn', ssn);
                row.setAttribute('edipi', edipi);
                row.setAttribute('firstName', firstName);
                row.setAttribute('middleName', middleName);
                row.setAttribute('lastName', lastName);
                row.setAttribute('suffix', suffix);
                row.setAttribute('participantId', participantId);
                row.setAttribute('gender', _gender);
                row.setAttribute('dateOfBirth', dateOfBirth);
                row.setAttribute("DFN", patientId);
                row.setAttribute("facilityCode", facilityCode);
                row.setAttribute("deceasedDate", _deceasedDate);
                row.setAttribute("vetSensLevel", vetSensitivityLevel);

                // add click events
                row.ondblclick = function () { openSelectedPerson(this); };
                row.onkeydown = function (e) {
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        openSelectedPerson(this);
                    }
                };

                row.className = (visibleRowCounter % 2 === 0) ? "even" : "odd";
                tbody.appendChild(row);
                visibleRowCounter++;
            }
        }
    }
    table.appendChild(tbody);

    if (mhvIDs.length > 0) {
        /*
        placeholder for logic to get veteran's MHV ID
          -kick off the MHV API call to determine correct/active MHV ID for selected veteran
          -It may be better to pass the IDs to a different page or hosted control for processing in the background
        */
        VCCM.USDHelper.CopyDataToReplacementParameters("MHV", ["IDList=" + mhvIDs.join(",")], false);
    }

    return table;
}

function containsOnlyNumbers(pString) {
    return !/\D/.test(pString);
}
function isPhysicalFacility(pFacilityCode) {
    return containsOnlyNumbers(pFacilityCode[0]) && pFacilityCode[0] != "1" && pFacilityCode[0] != "2"
}
function getStationName_Sync(pFacilityCode) {
    var stationName = "";
    var stationObject = null;
    try {
        var queryString = SDK.REST._ODataPath() + "ftp_facilitySet?$select=ftp_name,ftp_facilityId&$filter=ftp_FacilityCode_text eq '" + pFacilityCode + "' and statecode/Value eq 0&$orderby=ModifiedOn desc&$top=1";
        var retrievedFacilities = null;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: queryString,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                retrievedFacilities = getDeepProperty("d.results", data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Fail: Ajax Error in getStationName: " + errorThrown + " Request: " + queryString);
            },
            async: false,
            cache: false
        });
        if (retrievedFacilities.length == 1) {
            stationName = retrievedFacilities[0].ftp_name;
            stationObject = retrievedFacilities[0];
        }
        //return stationName.trim();
        return stationObject;
    }
    catch (err) {
        alert("An error occured in the getStationName() function:" + err);
    }
}
// ------------End Veteran Station Logic-------------------------------

function formatDatePart(datepart) {
    return datepart.length == 1 ? "0" + datepart : datepart;
}

function createNewVeteran() {
    var lname = $("#LastNameTextBox").val();
    var ssn = $("#SocialSecurityTextBox").val();
    var dobyear = $("#BirthYearTextBox").val();
    var dobmonth = $("#BirthMonthTextBox").val();
    var dobday = $("#BirthDayTextBox").val();

    if (!lname || !ssn || !dobyear || !isNumeric(dobyear) || !dobmonth || !isNumeric(dobmonth) || !dobday || !isNumeric(dobday)) {
        alert("You must provide a valid SSN, Last Name, and Date of Birth in order to create a new contact.");
        return;
    }

    //setup MVI data to save to USD parameters
    var mviDataForUSD = [];
    mviDataForUSD.push("SearchType=Manual");
    var ICN = "MISSING";
    mviDataForUSD.push("ICN=" + ICN);
    var nationalID = ICN != "MISSING" ? ICN.substring(0, 10) : "MISSING";
    mviDataForUSD.push("NationalID=" + (!!nationalID ? nationalID : ""));
    mviDataForUSD.push("EDIPI=" + (!!_vetEDIPI ? _vetEDIPI : "UNK"));
    mviDataForUSD.push("SelectedFacilityVetDFN=MISSING");

    /*include knowledge of user's MVI search criteria, for passing to ID validation checkboxes on interaction forms*/
    mviDataForUSD.push("SearchedWithLastName=" + (!!lname).toString());
    mviDataForUSD.push("SearchedWithDOB=" + (!!dobyear && dobyear != "YYYY" && dobyear != "" && !!dobmonth && dobmonth != "MM" && dobmonth != "" && !!dobday && dobday != "DD" && dobday != "").toString());
    mviDataForUSD.push("SearchedWithSSN=" + (!!ssn).toString());

    $("#creatingVeteranTmpDialog").show();

    if (Xrm != null && Xrm.Page != null && Xrm.Page.context != null) {
        var fname = $("#FirstNameTextBox").val();
        var homePhone = $("#AddPhoneNoTextBox").val();
        // Home Address...
        var street1 = $("#AddHomeStreetTextBox").val();
        var city = $("#AddHomeCityTextBox").val();
        var state = $("#AddHomeStateTextBox").val();
        var zip = $("#AddHomeZipTextBox").val();

        var desiredContact = {
            ftp_ManuallyCreatedFromMVIcode: {
                Value: 100000001 /*Yes*/
            }
        };
        //include parameters of MVI search in desiredContact
        if (!!fname) desiredContact.firstname = fname;
        if (!!lname) desiredContact.lastname = lname;
        if (!!ssn) desiredContact.GovernmentId = ssn;
        var dobString = (!!dobday && isNumeric(dobday) && !!dobmonth && isNumeric(dobmonth) && !!dobyear && isNumeric(dobyear)) ? dobmonth + "/" + dobday + "/" + dobyear : null;
        if (!!dobString) desiredContact.ftp_DateofBirth = dobString;
        if (!!homePhone) desiredContact.ftp_HomePhone = homePhone;
        if (!!street1) desiredContact.Address1_Line1 = street1;
        if (!!city) desiredContact.Address1_City = city;
        if (!!state) desiredContact.Address1_StateOrProvince = state;
        if (!!zip) desiredContact.Address1_PostalCode = zip;

        /*include some details of current user on the desiredContact:
            VISN = user's VISN, Home Facility = user's facility, PACT Team = "PACT Team Not Assigned" CRM team record
        */
        var queryString = "?$select=_ftp_facilitysiteid_value,_ftp_visnid_value";
        retrieveRecord(
            "systemuser",
            Xrm.Page.context.getUserId(),
            queryString,
            function (retrievedUser) {
                if (retrievedUser.hasOwnProperty("ftp_facilitysiteid") && !!retrievedUser.ftp_facilitysiteid) {
                    var queryString = "?$select=ftp_facilitycode,ftp_facilitycode_text,ftp_facilityid,ftp_name";
                    retrieveRecord(
                        "ftp_facility",
                        retrievedUser.ftp_facilitysiteid,
                        queryString,
                        function (retrievedFacility) {
                            //7/12/18: veteran's Home Facility is a text field now (ftp_Facility)
                            //set veteran's Current Facility & VISN with the user's facility and its VISN
                            //desiredContact.ftp_FacilityId = {
                            //    Id: retrievedUser.ftp_facilitysiteid.Id,
                            //    LogicalName: retrievedUser.ftp_facilitysiteid.LogicalName,
                            //    Name: retrievedUser.ftp_facilitysiteid.Name
                            //};
                            desiredContact.ftp_facility = retrievedFacility.ftp_name;
                            desiredContact.ftp_currentfacilityid = {
                                Id: retrievedFacility.ftp_facilityid,
                                LogicalName: "ftp_facility",
                                Name: retrievedFacility.ftp_name
                            };
                        },
                        function (e) {
                            alert("Error retrieving facility: " + e.message);
                        }
                    );
                }

                if (retrievedUser.ftp_ftp_facility_systemuser.hasOwnProperty("ftp_visnid") && !!retrievedUser.ftp_visnid) {
                    desiredContact.ftp_VISN = retrievedUser.ftp_visnid.Name;
                }

                /*retrieve default pact team*/
                var retrievedPACTTeam = null;
                var pactTeamQueryString = "$filter=ftp_name eq 'PACT Team Not Assigned'&$select=ftp_name,ftp_pactId";
                retrieveMultipleRecords.retrieveMultipleRecords(
                    "ftp_pact",
                    pactTeamQueryString, 
                    function (retrievedRecords) {
                        if (!!retrievedRecords && retrievedRecords.length > 0) retrievedPACTTeam = retrievedRecords[0];
                        if (!!retrievedPACTTeam) {
                            desiredContact.ftp_pactid = {
                                Id: retrievedPACTTeam.ftp_pactId,
                                LogicalName: "ftp_pact",
                                Name: retrievedPACTTeam.ftp_name,
                            };
                        }

                        //perform SDK.REST.retrieveMutipleRecords to trigger Contact.RetrieveMultiple plugin, which will find or create a CRM record matching search terms, even if not in MVI
                        //the plugin requires these 3 fields in $filter for its own pre-operation search: LastName, GovernmentId (ssn), and ftp_DateofBirth
                        //these fields can be updated by the plugin to match values in the $filter: FirstName, MiddleName, GenderCode, ftp_Gender

                        var contactQueryString = "";
                        //$select
                        contactQueryString += "$select=contactid,fullname";
                        for (var thisField in desiredContact) { contactQueryString += ("," + thisField); }
                        //$filter
                        contactQueryString += "&$filter=tri_searchtype_text eq 'CREATEUPDATEMVI' and statecode/Value eq 0";
                        var pluginUpdateableFields = ["firstname", "lastname", "governmentid", "ftp_dateofbirth"];
                        for (var thisField in desiredContact) {
                            if (pluginUpdateableFields.indexOf(thisField) != -1) {
                                contactQueryString += " and " + thisField + " eq '" + desiredContact[thisField] + "'";
                            }
                        }
                        var retrievedContact = null;
                        retrieveMultipleRecords(
                            "Contact",
                            contactQueryString, 
                            function (retrievedRecords) {
                                if (!!retrievedRecords && retrievedRecords.length > 0) { retrievedContact = retrievedRecords[0]; }
                                if (!!retrievedContact) {
                                    updateRecord(
                                        "contact",
                                        retrievedContact.contactid,
                                        desiredContact, 
                                            function () {
                                                mviDataForUSD.push("VetFullName=" + retrievedContact.fullname);
                                                mviDataForUSD.push("VetFirstName=" + retrievedContact.firstname);
                                                mviDataForUSD.push("VetLastName=" + retrievedContact.lastname);
                                                mviDataForUSD.push("VetCRMContactID=" + retrievedContact.contactid);
                                                VCCM.USDHelper.CopyDataToReplacementParameters("MVI", mviDataForUSD, false);
                                                VCCM.USDHelper.AddFunctionToQueue(function () {
                                                    $("#creatingVeteranTmpDialog").hide();
                                                    //code to open VeteranAlerts web resource instead of the contact itself
                                                    var veteranAlertsURLParameters = "originatedFromMVISearch=true"
                                                        + "&contactid=" + retrievedContact.contactid
                                                        + "&fullname=" + retrievedContact.fullname
                                                        + "&firstname=" + retrievedContact.firstname
                                                        + "&lastname=" + retrievedContact.lastname
                                                        + "&ICN=MISSING"
                                                        + "&nationalid=MISSING"
                                                        + "&DFN=MISSING"
                                                        + (mhvIDs.length > 0 ? "&MHVIDs=" + mhvIDs.join(",") : "");
                                                    Xrm.Utility.openWebResource("ftp_/VeteranAlerts/VeteranAlerts.html", encodeURIComponent(veteranAlertsURLParameters));
                                                });
                                            },
                                            function (e) {
                                                alert("Error updating found contact to match your search terms: " + e.message);
                                            }
                                    );
                                }
                            },
                            function (e) {
                                alert("Error checking for existing CRM contact: " + e.message);
                            }
                        );

                    },
                    function (e) {
                        alert("Error retrieving default PACT team: " + e.message);
                    }
                );
            },
            function (e) {
                alert("Error retrieving current user: " + e.message);
            }
        );
    }
}

function validateDateOfBirth(dobyear, dobmonth, dobday) {

    if ((dobyear == "" || dobyear == "YYYY") && (dobmonth == "" || dobmonth == "MM") && (dobday == "" || dobday == "DD")) {
        return true;
    }

    if (dobyear != "YYYY" || dobmonth != "MM" || dobday != "DD") {
        if ((dobyear != "" && isNumeric(dobyear) == false) || (dobmonth != "" && isNumeric(dobmonth) == false) || (dobday != "" && isNumeric(dobday) == false)) {
            return false;
        }
    }

    if (dobyear.length != 4) {
        return false;
    }

    if (dobyear >= (new Date).getFullYear() + 1) {
        return false;
    }

    if (dobyear < (new Date).getFullYear() - 200) {
        return false;
    }

    if (dobmonth < 1 || dobmonth > 12) {
        return false;
    }

    if (dobday < 1 || dobday > 31) {
        return false;
    }

    return true;
}

function formatName(data) {

    if (!!data.crme_FullName) {
        return data.crme_FullName;
    }

    var firstName = !!data.crme_firstname ? data.crme_firstname : "";
    var lastName = !!data.crme_lastname ? data.crme_lastname : "";

    return firstName + " " + lastName;
}

function formatAddress(data) {
    if (data.crme_FullAddress != null) {
        return data.crme_FullAddress;
    }

    if (data.crme_StateProvinceId != null && data.crme_ZIPPostalCodeId != null) {

        var street = data.crme_Address1 != null ? data.crme_Address1 : "";
        var city = data.crme_City != null ? data.crme_City : "";
        var state = data.crme_StateProvinceId.Name != null ? data.crme_StateProvinceId.Name : "";
        var zip = data.crme_ZIPPostalCodeId.Name != null ? data.crme_ZIPPostalCodeId.Name : "";

        return street + " " + city + " " + state + " " + zip;
    }

    return "";
}

function searchByName() {
    $("#searchResultsMessageDiv").val("");

    if (validateSearchByTraits() == true) {

        formatExecutingSearch();

        var dobday = $("#BirthDayTextBox").val() == "dd" ? "" : $("#BirthDayTextBox").val();
        var dobyear = $("#BirthYearTextBox").val() == "yyyy" ? "" : $("#BirthYearTextBox").val();
        var dobmonth = $("#BirthMonthTextBox").val() == "mm" ? "" : $("#BirthMonthTextBox").val();
        var dob = "";
        if (dobmonth != "" && dobday != "" && dobyear != "") {
            dob = dobmonth + "/" + dobday + "/" + dobyear;
        }

        var ssn = "";
        if ($("#SocialSecurityTextBox").val() != "") {
            ssn = $("#SocialSecurityTextBox").val();
            ssn = ssn.replace(/-/g, "");
        }

        var filterPrefix = "$select=*&$filter=";
        var filter = buildQueryFilter("crme_lastname", $("#LastNameTextBox").val(), false);
        filter += " and crme_isattended eq true";

        if ($("#FirstNameTextBox").val() != "") {
            filter += buildQueryFilter("crme_firstname", $("#FirstNameTextBox").val(), true);
        }

        if ($("#SocialSecurityTextBox").val() != "") {
            filter += buildQueryFilter("crme_ssn", ssn, true);
        }

        // adding additional search fields
        if ($("#AddMiddleNameTextBox").val() != "") {
            filter += buildQueryFilter("crme_middlename", $("#AddMiddleNameTextBox").val(), true);
        }

        if ($("#AddGenderTextBox").val() != "") {
            filter += buildQueryFilter("crme_gender", $("#AddGenderTextBox").val(), true);
        }

        if ($("#AddMMNTextBox").val() != "") {
            filter += buildQueryFilter("crme_mmn", $("#AddMMNTextBox").val(), true);
        }

        // Home Address...
        if ($("#AddHomeStreetTextBox").val() != "") {
            // add the full address to send
            var address = $("#AddHomeStreetTextBox").val() + " " + $("#AddHomeCityTextBox").val() + " " + $("#AddHomeStateTextBox").val() + " " + $("#AddHomeZipTextBox").val();
            filter += buildQueryFilter("crme_fulladdress", address, true);
        }

        if ($("#AddPhoneNoTextBox").val() != "") {
            filter += buildQueryFilter("crme_primaryphone", $("#AddPhoneNoTextBox").val(), true);
        }

        if ($("#AddBirthCityTextBox").val() != "") {
            filter += buildQueryFilter("crme_pobc", $("#AddBirthCityTextBox").val(), true);
        }

        if ($("#AddBirthStateTextBox").val() != "") {
            filter += buildQueryFilter("crme_pobs", $("#AddBirthStateTextBox").val(), true);
        }

        filter += buildQueryFilter("crme_searchtype", 'SearchByFilter', true);
        if (dob != "") {
            filter += " and crme_dobstring eq '" + dob + "'";
        }

        //filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;

        retrieveMultipleRecords("crme_person", filter, personSearchCallBack, function (error) { errorHandler(error) });

    } else {
        formatValidationFailed();
    }
}

function searchByIdentitier() {
    if (validateSearchByIdentifier() == true) {

        formatExecutingSearch();

        var filterPrefix = "$select=*&$filter=";
        var filter = "";
        if ($("#EdipiTextBox").val() != "") {
            filter += buildQueryFilter("crme_edipi", $("#EdipiTextBox").val(), false);
            filter += buildQueryFilter("crme_classcode", 'MIL', true);
        }

        filter += buildQueryFilter("crme_searchtype", 'SearchByIdentifier', true);
        filter += " and crme_isattended eq false";

        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        retrieveMultipleRecords("crme_person", filter, edipiSearchCallBack, function (error) { alert(error.message); });

    } else {
        formatValidationFailed();
    }

}

function formatExecutingSearch() {
    $('div#tmpDialog').show();
    $("#validationFailedDiv").hide();
    $("#resultsFieldSetDiv").hide();
    $("#notFoundDiv").hide();
    $("#searchResultsMessageDiv").hide();
    $("#SearchByNameButton").attr('disabled', true);
    $("#SearchByAddButton").attr('disabled', true);
    $("#SearchByIdentifierButton").attr('disabled', true);
}

function formatValidationFailed() {
    $("#validationFailedDiv").show();
    $("#notFoundDiv").hide();
    $("#resultsFieldSetDiv").hide();
    $("#searchResultsMessageDiv").hide();
    $("#personSearchResultsTable").find("thead, tr, th").remove();
    $("#personSearchResultsTable").find("tr:gt(0)").remove();
}

function isNumeric(value) {
    return !isNaN(parseFloat(value) && isFinite(value));
}

function validateSearchByIdentifier() {
    var edipi = $("#EdipiTextBox").val();

    if (edipi != "") {
        if ((edipi.length != 10 || isNumeric(edipi) == false)) {
            $("#validationFailedDiv").text("VALIDATION FAILED: EDIPI is invalid.");
            return false;
        }
        return true;
    }
    else {
        $("#validationFailedDiv").text("VALIDATION FAILED: The search requires an EDIPI.");
        return false;
    }
}
function errorHandler(error) {
    alert(error.message); $('div#stationTmpDialog').hide(); $('div#tmpDialog').hide(100);
}

// Add fields here that are required for MVI call
// and at least fields 3 are required.
function validateSearchByTraits() {
    var lname = $("#LastNameTextBox").val();
    var fname = $("#FirstNameTextBox").val();
    var mname = $("#AddMiddleNameTextBox").val();
    var ssn = $("#SocialSecurityTextBox").val();
    var dobyear = $("#BirthYearTextBox").val();
    var dobmonth = $("#BirthMonthTextBox").val();
    var dobday = $("#BirthDayTextBox").val();
    var dob = dobyear + dobmonth + dobday;
    var gender = $("#AddGenderTextBox").val();
    var mmn = $("#AddMMNTextBox").val();
    var phone = $("#AddPhoneNoTextBox").val();
    var birthCity = $("#AddBirthCityTextBox").val();
    var birthState = $("#AddBirthStateTextBox").val();
    var errorMessage = "VALIDATION FAILED: ";
    var errorCount = 0;
    var states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NM", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

    // add checks for correct state and sex
    if (gender != null && gender != "") {
        if (gender.toLowerCase() != "m" && gender.toLowerCase() != "f") {
            errorMessage += "'Sex' must be either 'M' or 'F'.";
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }
    }

    if (birthState != null && birthState != "") {
        if (states.indexOf(birthState.toUpperCase()) == -1) {
            errorMessage += "'Birth State' must be an acceptable state abbreviation.";
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }
    }

    if (lname == null || lname == "") {
        errorMessage += "'Last Name' and at least 2 other fields are required for MVI search.";
        $("#validationFailedDiv").text(errorMessage);
        return false;
    }

    if (ssn == null || ssn.trim() == "") {
        errorCount += 1;
    }
    else if (ssn != null && ssn != "") {
        ssn = ssn.replace(/-/g, "");
        if (ssn.trim().length != 9 || isNumeric(ssn.trim()) == false) {
            errorMessage += " SSN is invalid.";
            errorCount += 1;
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }
    }

    if (fname == "" || fname == null)
        errorCount += 1;

    if (dob == null || dob.trim() == "" || !isNumeric(dob.trim())) {
        errorCount += 1;
    } else if (!validateDateOfBirth(dobyear, dobmonth, dobday)) {
        errorMessage += " DOB is invalid.";
        $("#validationFailedDiv").text(errorMessage);
        return false;
    }

    // if searching with no additional traits check for 3 fields
    if ($("#showHideText").val() == "Show Additional Search Criteria") {
        if (errorCount > 1) {
            errorMessage += " At least 3 fields are required for MVI search.";
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }

        return true;
    }

    if (mname == "" || mname == null)
        errorCount += 1;

    if (gender == "" || gender == null)
        errorCount += 1;

    if (mmn == "" || mmn == null)
        errorCount += 1;

    var homeStreet = $("#AddHomeStreetTextBox").val();
    var homeCity = $("#AddHomeCityTextBox").val();
    var homeState = $("#AddHomeStateTextBox").val();
    var homeZip = $("#AddHomeZipTextBox").val();
    // need to ensure that we have the entire address
    if (homeStreet == "" && homeCity == "" && homeState == "" && homeZip == "") {
        // ok with none..
        errorCount += 1;
    }
    else if (homeStreet != "" && homeCity != "" && homeState != "" && homeZip != "") {
        // ok with all..validate
        if (homeState != null) {
            if (states.indexOf(homeState.toUpperCase()) == -1) {
                errorMessage += "'State' must be an acceptable state abbreviation.";
                $("#validationFailedDiv").text(errorMessage);
                return false;
            }
        }
    }
    else {
        // need all 4 fields for complete address
        errorMessage = errorMessage + " 'Street', 'City', 'State', and 'Zip' are required to search on the Home Address fields.";
        $("#validationFailedDiv").text(errorMessage);
        return false;
    }
    // end address

    if (phone == "" || phone == null)
        errorCount += 1;

    if (birthCity == "" || birthCity == null)
        errorCount += 1;

    if (birthState == "" || birthState == null)
        errorCount += 1;

    if (errorCount > 8) {
        errorMessage += " at least 3 fields are required.";
        $("#validationFailedDiv").text(errorMessage);
        return false;
    }

    return true;
}

function showHideTable(tblObj, imgObj, msgObj) {
    if (tblObj.style.display != "") {  // show table & display -
        tblObj.style.display = "";
        imgObj.alt = "Hide Additional Search Criteria";
        imgObj.src = "bah_collapse"; //"expand_collapse_minus.gif"; 
        msgObj.value = "Hide Additional Search Criteria";
    }
    else {  // hide table & display +
        tblObj.style.display = "none";
        imgObj.alt = "Show Additional Search Criteria";
        imgObj.src = "bah_expand"; //"expand_collapse_plus.gif";
        msgObj.value = "Show Additional Search Criteria";
    }
}

function showHideTableFromKeydown(tblObj, imgObj, msgObj, event) {

    if (event.keyCode === 13 || event.keyCode === 32) {
        if (tblObj.style.display != "") {  // show table & show -
            tblObj.style.display = "";
            imgObj.alt = "Hide Additional Search Criteria";
            imgObj.src = "bah_collapse"; //"expand_collapse_minus.gif";
            msgObj.value = "Hide Additional Search Criteria";
        }
        else {  // hide table & show +
            tblObj.style.display = "none";
            imgObj.alt = "Show Additional Search Criteria";
            imgObj.src = "bah_expand"; // "expand_collapse_plus.gif";
            msgObj.value = "Show Additional Search Criteria";
        }

        // need to set focus back on the image (**NOT WORKING IN CRM)
        imgObj.focus();
    }
}

function checkSubmit(event) {
    if (event.keyCode === 13) {
        // user has pressed Enter in one of the boxes
        //    if (!isEDIPI) {
        $("#SearchByNameButton").click();
        //    }
        //    else
        //        $("#SearchByIdentifierButton").click();
    }
}

function checkSubmitEDIPI(event) {

    if (event.keyCode === 13) {
        //// user has pressed Enter in one of the boxes
        //   if (!isEDIPI) {
        //       $("#SearchByNameButton").click();
        //   }
        //   else
        $("#SearchByIdentifierButton").click();
    }
}

function clearField(obj) {
    if (obj.defaultValue == obj.value) obj.value = '';
}

//functions for CTI stuff
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function updateFieldsFromQueryString() {
    // Function to set query string parameters on form when called from CTI Listener
    // Create variables
    var ANI = "";
    var SSN = "";
    var VETID = "";
    var CALLID = "";
    var DOB = "";
    var USER = "";
    var firstName = "";
    var lastName = "";
    var changingVeteran = false;

    var datavalue = getParameterByName('data');
    // Make sure data was passed in
    if (datavalue != null) {
        //alert("Data found: " + datavalue);
        //Parse the parameters
        var params = decodeURIComponent(datavalue).split("&");
        for (var i in params) {
            params[i] = params[i].replace(/\+/g, " ").split("=");
            switch (params[i][0]) {
                case "ANI":
                    ANI = params[i][1];
                    break;
                case "SSN":
                    SSN = params[i][1];
                    break;
                case "DOB":
                    DOB = params[i][1];
                    break;
                case "USER":
                    USER = params[i][1];
                    break;
                case "VETID":
                    VETID = params[i][1];
                    break;
                case "CALLID":
                    CALLID = params[i][1];
                    break;
                case "firstName":
                    firstName = params[i][1]; //only passed from VEFT Interaction 'Change Veteran' action calls
                    break;
                case "lastName":
                    lastName = params[i][1]; //only passed from VEFT Interaction 'Change Veteran' action calls
                    break;
                case "changingveteran":
                    changingVeteran = (params[i][1] == "true"); //only passed from VEFT Interaction 'Change Veteran' action calls
                    break;
                default:
                    break;
            }
        }

        // set text box values
        if (SSN !== "") $("#SocialSecurityTextBox").val(SSN);

        if (DOB !== "") {
            // parse the DOB field into separate fields
            if (DOB.indexOf("/") > -1) {
                //good for DOB passed from VEFT Interaction 'Change Veteran' action calls, which passes date to MVI with this syntax:
                // encodeURIComponent("DOB="+"[[Shared New Interaction.ftp_dateofbirth_datetime_GMT]+]".split(" ")[0] + etc...)
                var dobParts = DOB.split("/", 3);
                if (dobParts.length == 3) {
                    $("#BirthMonthTextBox").val(dobParts[0]);
                    $("#BirthDayTextBox").val(dobParts[1]);
                    $("#BirthYearTextBox").val(dobParts[2]);
                }
                else {
                    //invalid DOB string
                }
            }
            else {
                //good for DOB passed from CTI
                if (DOB.length == 8) {
                    $("#BirthMonthTextBox").val(DOB.substring(0, 2));
                    $("#BirthDayTextBox").val(DOB.substring(2, 4));
                    $("#BirthYearTextBox").val(DOB.substring(4, 8));
                }
            }
        }
        //Set the phone number field
        if (ANI !== "") $("#AddPhoneNoTextBox").val(ANI);

        if (changingVeteran) {
            //don't automatically search
            if (!!firstName) {
                $("#FirstNameTextBox").val(firstName);
            }
            if (!!lastName) {
                $("#LastNameTextBox").val(lastName);
            }
        }
        else {
            //automatically fire search
            //Check for EDIPI
            if (VETID !== "") {
                searchByIdentitier();
            }
            else {
                //Run the telephony search
                //2/26/2018: changed CTI-driven search to use SearchByFilter
                searchByTelephonyParameters();
            }
        }
    }
}
function searchByTelephonyParameters() {
    $("#searchResultsMessageDiv").val("");
    if (validateDeterministicTelephony() == true) {
        formatExecutingSearch();

        var filterPrefix = "$select=*&$filter=";
        //var filter = buildQueryFilter("crme_searchtype", 'DeterministicSearch', false);
        //2/26/2018: changed CTI-driven search to use SearchByFilter
        var filter = buildQueryFilter("crme_searchtype", 'SearchByFilter', false);
        var dobday = $("#BirthDayTextBox").val() == "dd" ? "" : $("#BirthDayTextBox").val();
        var dobyear = $("#BirthYearTextBox").val() == "yyyy" ? "" : $("#BirthYearTextBox").val();
        var dobmonth = $("#BirthMonthTextBox").val() == "mm" ? "" : $("#BirthMonthTextBox").val();
        var dob = "";
        if (dobmonth != "" && dobday != "" && dobyear != "") {
            dob = dobmonth + "/" + dobday + "/" + dobyear;
        }

        var ssn = "";
        if ($("#SocialSecurityTextBox").val() != "") {
            ssn = $("#SocialSecurityTextBox").val();
            ssn = ssn.replace(/-/g, "");
        }

        if ($("#SocialSecurityTextBox").val() != "") {
            filter += buildQueryFilter("crme_ssn", ssn, true);
        }

        if (dob != "") {
            filter += " and crme_dobstring eq '" + dob + "'";
        }
        //2/26/2018: crme_IsAttended should be true, when doing SearchByFilter
        filter += " and crme_isattended eq true";
        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        //alert(filter);
        retrieveMultipleRecords("crme_person", filter, personSearchCallBack, function (error) { errorHandler(error); });
    }
}
function validateDeterministicTelephony() {
    var ssn = $("#SocialSecurityTextBox").val();
    var dobyear = $("#BirthYearTextBox").val();
    var dobmonth = $("#BirthMonthTextBox").val();
    var dobday = $("#BirthDayTextBox").val();
    var dob = dobyear + dobmonth + dobday;
    var errorMessage = "VALIDATION FAILED: ";
    var errorCount = 0;

    if (ssn == null || ssn.trim() == "") {
        errorCount += 1;
    }
    else if (ssn != null && ssn != "") {
        ssn = ssn.replace(/-/g, "");
        if (ssn.trim().length != 9 || isNumeric(ssn.trim()) == false) {
            errorMessage += " SSN is invalid.";
            errorCount += 1;
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }
    }

    if (dob == null || dob.trim() == "" || !isNumeric(dob.trim())) {
        errorCount += 1;
    } else if (!validateDateOfBirth(dobyear, dobmonth, dobday)) {
        errorMessage += " DOB is invalid.";
        $("#validationFailedDiv").text(errorMessage);
        return false;
    }

    // if searching with no additional traits check for 3 fields
    if ($("#showHideText").val() == "Show Additional Search Criteria") {
        if (errorCount > 1) {
            errorMessage += " At least 2 fields are required for MVI search.";
            $("#validationFailedDiv").text(errorMessage);
            return false;
        }

        return true;
    }

    return true;
}

//functions for ESR query, for getting selected veteran's home station (called PreferredFacility in ESR)
function handleVeteranSelectionWithHomeStationQuery(pElement) {
    if (includeESRHomeStationQuery) {
        //query ESR for veteran's preferred station, then proceed into the executeRetrieve function for the MVI SelectedPersonSearch
        queryESR(pElement, executeRetrieve);
    }
    else {
        //skip straight to the MVI SelectedPersonSearch
        executeRetrieve(pElement);
    }
}

function queryESR(pSelectedVeteranElement, pCallbackFunction) {
    if (!!!pSelectedVeteranElement) {
        return;
    }
    var selectedICN = pSelectedVeteranElement.getAttribute('icn');
    if (!!!selectedICN) {
        return;
    }

    //ok go.
    $('div#tmpDialog').show();
    if (retrievedSettings == null) {
        retrieveActiveSettings(queryESR, pSelectedVeteranElement, pCallbackFunction);
    }
    else {
        _selectedVetIsSensitive = false;
        if (retrievedSettings.hasOwnProperty("ftp_ESREnrollmentEligibilitySummaryAPIURL") && !!retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL) {
            var secureESRURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL;
            var secureESRParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: "000000" + selectedICN + "000000" }) }];
            CrmSecurityTokenEncryption(
                secureESRURL,
                secureESRParams,
                context.getClientUrl(),
                function (pError, pResponse) {
                    writeToConsole("inside ESR query success callback");
                    _esrDataForUSD = [];
                    if (!!pError) {
                        _selectedVetIsSensitive = true;
                        _esrDataForUSD.push("IsSensitive=" + _selectedVetIsSensitive.toString());
                        _esrDataForUSD.push("ErrorOrEmpty=true");
                    }
                    else if (pResponse.ErrorOccurred) {
                        _selectedVetIsSensitive = true;
                        _esrDataForUSD.push("IsSensitive=" + _selectedVetIsSensitive.toString());
                        _esrDataForUSD.push("ErrorOrEmpty=true");
                    }
                    else {
                        esrResponseObject = pResponse;
                        if (!!pResponse.Data) {
                            var sensitivityFlag = getDeepProperty("Data.SensitivityInfo.SensityFlag", pResponse);
                            _selectedVetIsSensitive = sensitivityFlag == undefined || (!!sensitivityFlag && sensitivityFlag.toLowerCase() != "false");
                            _esrDataForUSD.push("IsSensitive=" + _selectedVetIsSensitive.toString());
                            _esrDataForUSD.push("ErrorOrEmpty=false");
                            writeToConsole("veteran sensitivity, from ESR: " + _selectedVetIsSensitive);

                            /*copy a bunch of ESR data to USD replacement parameters, so we don't have to continually query ESR in other places*/

                            /*Preferred Facility*/
                            //Data{Demographics{PreferredFacility}}
                            var preferredFacilityFullName = getDeepProperty("Data.Demographics.PreferredFacility", pResponse);
                            if (!!preferredFacilityFullName) {
                                _esrDataForUSD.push("preferredFacilityFullName=" + preferredFacilityFullName);
                                var pfAsArray = preferredFacilityFullName.split("-");
                                if (pfAsArray.length == 2) {
                                    var facilityCodeFromESR = pfAsArray[0].trim();
                                    var facilityNameFromESR = pfAsArray[1].trim();
                                    _esrDataForUSD.push("preferredFacilityCode=" + facilityCodeFromESR);
                                    _esrDataForUSD.push("preferredFacilityName=" + facilityNameFromESR);
                                }
                            }

                            /*phone numbers*/
                            //Phones drilldown: Data{Demographics{ContactInfo{Phones{Phone[]}}}
                            var phoneNumberList = getDeepProperty("Data.Demographics.ContactInfo.Phones.Phone", esrResponseObject);
                            if (phoneNumberList != undefined && Array.isArray(phoneNumberList) && phoneNumberList.length > 0) {
                                writeToConsole("found phone numbers from ESR");

                                for (var x in phoneNumberList) {
                                    var number = phoneNumberList[x].PhoneNumber;
                                    switch (phoneNumberList[x].Type) {
                                        case "Home":
                                            _esrDataForUSD.push("homePhone=" + number);
                                            break;
                                        case "Business":
                                            _esrDataForUSD.push("workPhone=" + number);
                                            break;
                                        case "Mobile":
                                            _esrDataForUSD.push("mobilePhone=" + number);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }

                            /*address(es)*/
                            var addressList = getDeepProperty("Data.Demographics.ContactInfo.Addresses.Address", esrResponseObject);
                            if (addressList != undefined && Array.isArray(addressList) && addressList.length > 0) {
                                for (var i = 0; i < addressList.length; i++) {
                                    var thisAddress = addressList[i];
                                    if (!!thisAddress.AddressTypeCode) {
                                        if (!!thisAddress.Line1) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine1=" + thisAddress.Line1); }
                                        if (!!thisAddress.Line2) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine2=" + thisAddress.Line2); }
                                        if (!!thisAddress.Line3) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine3=" + thisAddress.Line3); }
                                        if (!!thisAddress.City) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCity=" + thisAddress.City); }
                                        if (!!thisAddress.State) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressState=" + thisAddress.State); }
                                        if (!!thisAddress.ZipCode) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressZipCode=" + thisAddress.ZipCode); }
                                        if (!!thisAddress.ZipPlus4) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressZipPlus4=" + thisAddress.ZipPlus4); }
                                        if (!!thisAddress.County) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCounty=" + thisAddress.County); }
                                        if (!!thisAddress.Country) { _esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCountry=" + thisAddress.Country); }
                                    }
                                }
                            }

                            /*miscellaneous*/
                            //If they are a veteran- pull that return
                            var isAVeteranStr = getDeepProperty("Data.EnrollmentDeterminationInfo.Veteran", esrResponseObject);
                            var isAVeteran = isAVeteranStr != undefined && isAVeteranStr.toLowerCase() == "true";
                            _esrDataForUSD.push("IsAVeteran=" + isAVeteran.toString());

                            var eligibilityType = getDeepProperty("Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type", esrResponseObject);
                            if (eligibilityType != undefined) {
                                _esrDataForUSD.push("PrimaryEligibility=" + eligibilityType);
                            }

                            //var unemployableStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.Unemployable", esrResponseObject);
                            //var unemployable = unemployableStr != undefined && unemployableStr.toLowerCase() == "true";
                            //_esrDataForUSD.push("Unemployable=" + unemployable.toString()); //do we need "True/False" or "Yes/No" for this field on the veteran form?

                            //Revised the code below as it does not change a false or missing value to No
                            /*
                            var unemployableStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.Unemployable", esrResponseObject);
                            var unemployable = unemployableStr != undefined && unemployableStr.toLowerCase() == "true";
                            _esrDataForUSD.push("Unemployable=" + unemployable ? "Yes" : "No"); 
                            */

                            var unemployableStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.Unemployable", esrResponseObject);
                            var unemployable = "No";
                            if (unemployableStr != undefined && unemployableStr.toLowerCase() == "true") { unemployable = "Yes"; }
                            _esrDataForUSD.push("Unemployable=" + unemployable);

                            var svcConnIndicatorStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.ServiceConnectedIndicator", esrResponseObject);
                            var svcConnIndicator = svcConnIndicatorStr != undefined && svcConnIndicatorStr.toLowerCase() == "true";
                            _esrDataForUSD.push("ServiceConnected=" + svcConnIndicator.toString());

                            var svcConnPercentageStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.ServiceConnectedPercentage", esrResponseObject);
                            if (svcConnPercentageStr != undefined) {
                                _esrDataForUSD.push("ServiceConnectedPercentage=" + svcConnPercentageStr);
                            }

                            var insuranceList = !!getDeepProperty("Data.InsuranceList.Insurance", esrResponseObject);
                            var hasInsurance = insuranceList != undefined && Array.isArray(insuranceList) && insuranceList.length > 0;
                            _esrDataForUSD.push("HasInsurance=" + hasInsurance.toString());

                            //next of kin
                            var associationList = getDeepProperty("Data.Associations.Association", esrResponseObject);
                            if (associationList != undefined && Array.isArray(associationList) && associationList.length > 0) {
                                for (var i = 0; i < associationList.length; i++) {
                                    var thisAssociation = associationList[i];
                                    if (thisAssociation.ContactType == "Primary Next of Kin") {
                                        var nokString = !!thisAssociation.GivenName ? thisAssociation.GivenName.trim() : "";
                                        nokString += (!!thisAssociation.MiddleName ? " " + thisAssociation.MiddleName.trim() : "");
                                        nokString += (!!thisAssociation.FamilyName ? " " + thisAssociation.FamilyName.trim() : "");
                                        nokString += (!!thisAssociation.Relationship ? ", " + thisAssociation.Relationship.trim() : "");
                                        _esrDataForUSD.push("NextOfKin=" + nokString);
                                    }
                                }
                            }
                        }
                        else {
                            _selectedVetIsSensitive = true;
                            writeToConsole("veteran sensitivity, due to empty response from ESR: " + _selectedVetIsSensitive);
                            _esrDataForUSD.push("IsSensitive=" + _selectedVetIsSensitive.toString());
                            _esrDataForUSD.push("ErrorOrEmpty=True");
                        }
                    }

                    if (typeof pCallbackFunction == "function") {
                        //pCallbackFunction should be the executeRetrieve function.
                        pCallbackFunction(pSelectedVeteranElement);
                    }
                }
            );
        }
        else {
            return;
        }
    }
}
function retrieveActiveSettings(pCallbackFunction, pPassthroughObject, pSecondCallbackFunction) {
    var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
    retrieveMultipleRecords(
		"mcs_setting",
		queryString).then(
		function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
            if (!!retrievedSettings) {
                if (!(retrievedSettings.hasOwnProperty("ftp_DACURL")) || !retrievedSettings.ftp_DACURL) {
                    alert("Could not find DAC URL in Active Settings record");
                    return;
                }

                writeToConsole("got Active Settings record.");

                dacURL = retrievedSettings.ftp_DACURL;

                if (typeof pCallbackFunction == "function") {
                    pCallbackFunction(pPassthroughObject, pSecondCallbackFunction);
                }
            } //end if !!retrievedSettings
            else {
                alert("Could not find Active Settings record");
                return;
            }

		},
		function (e) {
		    alert("Error retrieving Active Settings!\n" + e.message);
		} //end active settings retrieval complete callback
	);//end active settings query
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
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function getContext() {
    return (typeof GetGlobalContext != "undefined") ? GetGlobalContext() : null;
}