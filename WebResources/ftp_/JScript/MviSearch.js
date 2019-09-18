$(document).ready(function () {
    $('div#tmpDialog').hide();
    $("#btnSearchByTraits").bind("click", function () {

        if (!validateSearchFields()) {
            $("#validationFailedDiv").show();
        } else {

            $("#searchResultsMessageDiv").val("");

            //if (validateSearchByName() == true) {
            //    formatValidationFailed();
            //    return;
            //}

            formatExecutingSearch();

            var txtFirstName = $("#txtFirstName").val();
            txtFirstName = txtFirstName == null ? "" : txtFirstName.trim();
            var txtLastName = $("#txtLastName").val();
            txtLastName = txtLastName == null ? "" : txtLastName.trim();
            var txtMiddleName = $("#txtMiddleName").val();
            txtMiddleName = txtMiddleName == null ? "" : txtMiddleName.trim();

            var filter = "$select=*&$filter=";

            filter += "crme_IsAttended eq true";

            if (txtFirstName.length > 0)
                filter += buildQueryFilter("crme_FirstName", txtFirstName, true);

            if (txtLastName.length > 0)
                filter += buildQueryFilter("crme_LastName", txtLastName, true);

            if (txtMiddleName !== "") {
                filter += buildQueryFilter("crme_MiddleName", txtMiddleName, true);
            }

            var ssn = $("#txtSSN").val();
            ssn = ssn.trim();
            if (ssn !== "") {
                filter += buildQueryFilter("crme_SSN", ssn, true);
            }

            filter += buildQueryFilter("crme_SearchType", 'SearchByFilter', true);

            SDK.REST.retrieveMultipleRecords("crme_person", filter, personSearchCallBack, function (error) { alert(error.message); }, personSearchComplete);

        }
    });
    $('#btnClearTraitFields').bind("click", function () {
        clearTraitFields();
        personSearchComplete();
    });
    $("#SearchByIdentifierButton").bind("click", function () {
        $("#searchResultsMessageDiv").val("");
        formatExecutingSearch();
        var txtEdipi = $("#txtEDIPI").val();
        var filter = "$select=*&$filter=";
        filter += "crme_IsAttended eq false";
        filter += buildQueryFilter("crme_EDIPI", txtEdipi, true);
        filter += buildQueryFilter("crme_SearchType", 'SearchByIdentifier', true);
        SDK.REST.retrieveMultipleRecords("crme_person", filter, edipiSearchCallBack, function (error) { alert(error.message); }, personSearchComplete);
    });
    $('#btnClearEDIPIField').bind("click", function () {
        clearEdipiFields();
        personSearchComplete();
    });
    $("input").keyup(function (event) {
        if (event.keyCode == 13) {
            if (this.className == "TraitSearch") {
                $("#btnSearchByTraits").click();
            } else {
                $("#SearchByIdentifierButton").click();
            }
        }
    });

});

function clearTraitFields() {
    $("#txtFirstName").val("");
    $("#txtMiddleName").val("");
    $("#txtLastName").val("");
    $("#txtDobMonth").val("");
    $("#txtDobDay").val("");
    $("#txtDobYear").val("");
    $("#txtSSN").val("");
    $("#validationFailedDiv").hide();
}

function clearEdipiFields() {
    $("#txtEDIPI").val("");
    $("#validationFailedDiv").hide();
}

function formatExecutingSearch() {
    $('div#tmpDialog').show();
    $("#validationFailedDiv").hide();
    $("#resultsFieldSetDiv").hide();
    $("#searchResultsMessageDiv").hide();
    $("#btnSearchByTraits").attr('disabled', true);
    $("#SearchByIdentifierButton").attr('disabled', true);
}

function formatValidationFailed() {
    $("#validationFailedDiv").show();
    $("#resultsFieldSetDiv").hide();
    $("#searchResultsMessageDiv").hide();
    $("#personSearchResultsTable").find("thead, tr, th").remove();
    $("#personSearchResultsTable").find("tr:gt(0)").remove();
}

function personSearchComplete() {
    $('div#tmpDialog').hide();
    $("#btnSearchByTraits").attr('disabled', false);
    $("#SearchByIdentifierButton").attr('disabled', false);
}

function buildQueryFilter(field, value, and) {
    if (and) {
        return " and " + field + " eq '" + value + "'";
    } else {
        return field + " eq '" + value + "'";
    }
}

function validateSearchFields() {
    if (//$("#txtSSN").val() == "" ||
        //$("#txtFirstName").val() == "" ||
        //$("#txtMiddleName").val() == "" ||
        $("#txtLastName").val() == "") {
        return false;
    }
    return true;
}

function openSelectedPerson(obj) {

    $('div#tmpDialog').show();
    var ssn = obj.getAttribute('ssn');
    var firstName = obj.getAttribute('firstName');
    var lastName = obj.getAttribute('lastName');
    var recordSource = obj.getAttribute('recordSource');
    var patientMviIdentifier = obj.getAttribute('patientMviIdentifier');
    var filter = "$select=*&$filter=";

    filter += buildQueryFilter("GovernmentId", ssn, false);
    filter += buildQueryFilter("ftp_SearchType", 'SelectedPersonSearch', true);
    filter += buildQueryFilter("ftp_PatientMviIdentifier", patientMviIdentifier, true);
    filter += buildQueryFilter("FirstName", firstName, true);
    filter += buildQueryFilter("LastName", lastName, true);
    filter += buildQueryFilter("ftp_RecordSource", recordSource, true);

    SDK.REST.retrieveMultipleRecords("crme_person", filter, edipiSearchCallBack, function (error) { alert(error.message); }, personSearchComplete);

    return false;
}

function clearResults() {
    // get the table
    var table = $("#personSearchResultsTable");

    // reset the table by removing all data rows
    table.find("thead, tr, th").remove();
    table.find("tr:gt(0)").remove();
    table.hide();
    table.val("");
    table.hide();

}

function edipiSearchCallBack(data) {
    searchCallBack(data, true);
}

function personSearchCallBack(data) {
    searchCallBack(data, false);
}

function searchCallBack(returnData, isEdipi) {
debugger;
    $('div#tmpDialog').show();
    // get the table
    var table = $("#personSearchResultsTable");

    clearResults();
    var veteranData = [];
    var stationData = [];
    if (returnData != null && returnData.length == 1 && returnData[0] != null && returnData[0].crme_ReturnMessage != null && returnData[0].crme_LastName == null && returnData[0].crme_PatientMviIdentifier == null) {
        veteranData = returnData;
    }
    else {
        if (isEdipi) {
            for (var i = 0; i < returnData.length; i++) {
                if (returnData[i].crme_LastName && returnData[i].crme_PatientMviIdentifier) {
                    veteranData.push(returnData[i]);
                } else {
                    stationData.push(returnData[i]);
                }
            }
        } else {
            veteranData = returnData;
        }

        if (veteranData != null && veteranData.length > 0) {

            var thead = document.createElement('thead');
            var theadRow = document.createElement('tr');

            for (var i = 0; i < veteranData.length; i++) {

                var fullName = formatName(veteranData[i]);

                if (fullName === "") {
                    break;
                }

                var contactId = veteranData[i].crme_personId == null ? "" : veteranData[i].crme_personId;
                var dateOfBirth = veteranData[i].crme_DOBString == null ? "" : veteranData[i].crme_DOBString;
                var address = formatAddress(veteranData[i]);
                var patientMviIdentifier = veteranData[i].crme_PatientMviIdentifier == null ? "" : veteranData[i].crme_PatientMviIdentifier;
                var recordSource = veteranData[i].crme_RecordSource == null ? "" : veteranData[i].crme_RecordSource;
                var edipi = veteranData[i].crme_EDIPI == null ? "" : veteranData[i].crme_EDIPI;
                var ssn = veteranData[i].crme_SSN == null ? "" : veteranData[i].crme_SSN;
                var firstName = veteranData[i].crme_FirstName == null ? "" : veteranData[i].crme_FirstName;
                var middleName = veteranData[i].crme_MiddleName == null ? "" : veteranData[i].crme_MiddleName;
                var lastName = veteranData[i].crme_LastName == null ? "" : veteranData[i].crme_LastName;
                var alias = veteranData[i].crme_Alias == null ? "" : veteranData[i].crme_Alias;
                var gender = veteranData[i].crme_Gender == null ? "" : veteranData[i].crme_Gender;
                var deceasedDate = veteranData[i].crme_DeceasedDate == null ? "" : veteranData[i].crme_DeceasedDate;
                var identityTheft = veteranData[i].crme_IdentityTheft == null ? "" : veteranData[i].crme_IdentityTheft;
                var participantId = veteranData[i].crme_ParticipantID == null ? "" : veteranData[i].crme_ParticipantID;
                var phoneNumber = veteranData[i].crme_PrimaryPhone == null ? "" : veteranData[i].crme_PrimaryPhone;
                var retrieveFilter = veteranData[i].crme_url == null ? "" : veteranData[i].crme_url;

                if (i === 0) {
                    var th0 = document.createElement('th');
                    var th1 = document.createElement('th');
                    var th2 = document.createElement('th');
                    var th3 = document.createElement('th');
                    var th4 = document.createElement('th');
                    var th5 = document.createElement('th');
                    var th6 = document.createElement('th');

                    th0.appendChild(document.createTextNode(''));
                    th1.appendChild(document.createTextNode('Name'));
                    th2.appendChild(document.createTextNode('Date of Birth'));
                    th3.appendChild(document.createTextNode('SSN'));
                    th4.appendChild(document.createTextNode('Identity Theft'));
                    th5.appendChild(document.createTextNode('Deceased Date'));
                    th6.appendChild(document.createTextNode('Alias'));

                    theadRow.appendChild(th0);
                    theadRow.appendChild(th1);
                    theadRow.appendChild(th2);
                    theadRow.appendChild(th3);
                    if (identityTheft != "") {
                        theadRow.appendChild(th4);
                    }
                    if (deceasedDate != "") {
                        theadRow.appendChild(th5);
                    }

                    if (alias != "") {
                        theadRow.appendChild(th6);
                    }

                    thead.appendChild(theadRow);
                }

                // Table rows
                var row = document.createElement('tr');
                var col0 = document.createElement('td');
                var col1 = document.createElement('td');
                var col2 = document.createElement('td');
                var col3 = document.createElement('td');
                var col4 = document.createElement('td');
                var col5 = document.createElement('td');
                var col6 = document.createElement('td');

                var aElem = document.createElement('a');
                aElem.className = "GetStationDataButton";
                aElem.href = "#";
                var aElemNode = document.createTextNode("+");
                aElem.appendChild(aElemNode);
                aElem.setAttribute('data-retrieveFilter', retrieveFilter);
                aElem.setAttribute('data-patientId', patientMviIdentifier);

                $(aElem).bind("click", function () {
                    if (!isEdipi) {
                        this.setAttribute("id", "ClickedButton");
                        executeRetrieve(this);
                    } else {
                        //Edipi search, table will already exist, just needs to be shown
                        expandCollapse(this)
                    }
                });

                col0.appendChild(aElem);
                col1.appendChild(document.createTextNode(fullName));
                col2.appendChild(document.createTextNode(dateOfBirth));
                col3.appendChild(document.createTextNode(ssn));
                col4.appendChild(document.createTextNode(identityTheft));
                col5.appendChild(document.createTextNode(deceasedDate));
                col6.appendChild(document.createTextNode(alias));

                row.appendChild(col0);
                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);

                if (identityTheft != "") {
                    row.appendChild(col4);
                }
                if (deceasedDate != "") {
                    row.appendChild(col5);
                }

                if (alias != "") {
                    row.appendChild(col6);
                }
                row.className = (i % 2 === 0) ? "even" : "odd";
                row.id = "resultstable-row-" + i;


                var stationRow = document.createElement('tr');
                stationRow.className = "StationRow";
                table.append(row);
                table.append(stationRow);
                table.append(thead);

                if (isEdipi) {
                    //create table holding station records by associating veteran ids between veteran and entire stationData table
                    var veteranStations = getVeteranStation(veteranData[i].crme_personId, stationData);

                    //update + button binding to display subgrid instead of conducting rest call
                    createVeteranStationSubgrid(veteranStations, stationRow, isEdipi); //data, row, button
                }
            }

            var tabIndex = 10;
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
        }
    }
    $("#searchResultsMessageDiv").show();
    $("#searchResultsMessageDiv").text((veteranData != null && veteranData[0] != null && veteranData[0] != undefined && veteranData[0].crme_ReturnMessage != null) ? veteranData[0].crme_ReturnMessage : "");
}

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
    var filter = element.getAttribute("data-retrieveFilter");
    SDK.REST.retrieveMultipleRecords("crme_person", filter, personRetrieveCallback, function (error) { alert(error.message); }, function () { });
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
}

function expandCollapse(button) {
    var nextRow = $(button).closest('tr').next('tr');
    if ($(nextRow).attr('class') === undefined || $(nextRow).attr('class').indexOf("nav-expanded") === -1) {
        nextRow.addClass("nav-expanded");
        $(button).text("-");
    } else {
        nextRow.removeClass("nav-expanded");
        $(button).text("+");
    }
}

function createVeteranStationSubgrid(data, row, isEdipi) {

    var subTableCol = document.createElement('td');
    var subTableDiv = document.createElement('div');
    subTableDiv.className = "SubTableDiv";

    var previousTabIndex = $(row).prev().children().last()[0].tabIndex;

    var stationTable = createVeteranStationTable(data, previousTabIndex);

    subTableCol.appendChild(stationTable);
    subTableDiv.appendChild(subTableCol);

    if (isEdipi) {
        row.appendChild(subTableDiv);
    } else { row.append(subTableDiv); }

}

function createVeteranStationTable(data, previousTabIndex) {
    var table = document.createElement('table');
    table.id = "StationTable";

    var thead = document.createElement("thead");
    var tbody = document.createElement('tbody');

    for (var i = 0; i < data.length; i++) {
        var theadRow = document.createElement("tr");
        var stationName = data[i].crme_SiteName;
        var link = data[i].crme_url;

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
        stationElement.href = link;
        stationElement.target = "_blank";
        stationElement.tabIndex = previousTabIndex;
        var stationElementNode = document.createTextNode(stationName);
        stationElement.appendChild(stationElementNode);

        col0.appendChild(stationElement);
        row.appendChild(col0);
        row.setAttribute('StationName', stationName);
        row.className = (i % 2 === 0) ? "even" : "odd";
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    return table;
}

function formatDatePart(datepart) {
    return datepart.length == 1 ? "0" + datepart : datepart;
}

function formatName(data) {

    if (data.crme_FullName != null) {
        return data.crme_FullName;
    }

    var firstName = data.crme_FirstName != null ? data.crme_FirstName : "";
    var lastName = data.crme_LastName != null ? data.crme_LastName : "";

    return firstName + " " + lastName;
}

function formatAddress(data) {
    if (data.ftp_FullAddress != null) {
        return data.ftp_FullAddress;
    }

    var street = data.Address1_Line1 != null ? data.Address1_Line1 : "";
    var city = data.Address1_City != null ? data.Address1_City : "";
    var state = data.Address1_StateOrProvince != null ? data.Address1_StateOrProvince : "";
    var zip = data.Address1_PostalCode != null ? data.Address1_PostalCode : "";

    return street + " " + city + " " + state + " " + zip;
}

function selectedPersonCallBack(data) {
    $("#SearchByIdentifierButton").enable = true;
    $('div#tmpDialog').hide(100);
    if (data != null) {
        var url = data[0].crme_url;
        window.open(url);
    }
}

function validateSearchByName() {
    var fname = $("#txtFirstName").val();
    var lname = $("#txtLastName").val();
    var mname = $("#txtMiddleName").val();
    var ssn = $("#txtSSN").val();
    var dobyear = $("#txtDobYear").val();
    var dobmonth = $("#txtDobMonth").val();
    var dobday = $("#txtDobDay").val();
    var dob = dobyear + dobmonth + dobday;
    var traitcount = 1;
    if (lname == null) lname = "";
    if (fname == null) fname = "";
    if (mname == null) mname = "";
    if (ssn == null) ssn = "";

    if (lname == "") {
        $("#validationFailedDiv").text("VALIDATION FAILED: 'Last Name' is required.");
        return false;
    }

    if (dobyear == "YYYY") dobyear = "";
    if (dobmonth == "MM") dobmonth = "";
    if (dobday == "DD") dobday = "";

    if (dobyear != "" && dobmonth != "" && dobday != "") {
        if (validateDateOfBirth(dobyear, dobmonth, dobday) == false) {
            $("#validationFailedDiv").text("VALIDATION FAILED: 'DOB' is invalid or out of range.");
            return false;
        }
        traitcount = 2;
    }

    if (fname != "") {
        traitcount = traitcount + 1;
    }

    if (mname != "") {
        traitcount = traitcount + 1;
    }

    if (traitcount < 3) {
        $("#validationFailedDiv").text("VALIDATION FAILED: A minimum of four fields are required for a trait-based search.");
        return false;
    }

    if (traitcount < 4) {
        // if there are less than 4 traits so far, see if file numbe is an ssn so
        // that it can be used as the 4th trait

        if (ssn.trim() == "") {
            $("#validationFailedDiv").text("VALIDATION FAILED: A minimum of four fields are required for a trait-based search.");
            return false;
        }

        if (ssn.trim().length != 9 || isNumeric(ssn.trim()) == false) {
            $("#validationFailedDiv").text("VALIDATION FAILED: File#/SSN is not a valid SSN.  A minimum of four fields are required for a trait-based search.");
            return false;
        }
    }

    return true;
}

function isNumeric(value) {

    return !isNaN(parseFloat(value) && isFinite(value));
}

function clearField(obj) {
    if (obj.defaultValue == obj.value) obj.value = '';
}

function getServerUrl() {
    var serverUrl = getOrganizationUrl() + "/XRMServices/2011/OrganizationData.svc";
    return serverUrl;
}