//Javascript Libary for the mvi_searchui.html

if (typeof veo == 'undefined') { veo = { __namespace: true }; } a

if (typeof (veo.Search) == "undefined") {
    veo.Search = {
        __namespace: true
    };
}

(function () {

    var inputSSN = "";
    var inputFirstName = "";
    var inputLastName = "";
    var inputMonth = "";
    var inputDay = "";
    var inputYear = "";

    var selectedFirstName = "";
    var selectedLastName = "";

    this.Initialize = function (page) {

        veo.Search.UI_HideAll();

        $("#searchtab").click(function () {
            $("#search").tab('show');
            $("#searchedipi").tab('hide');
            $("#altsearch").tab('hide');
        });

        $("#edipitab").click(function () {
            $("#search").tab('hide');
            $("#searchedipi").tab('show');
            $("#altsearch").tab('hide');
        });

        $("#altsearchtab").click(function () {
            $("#search").tab('hide');
            $("#searchedipi").tab('hide');
            $("#altsearch").tab('show');
        });

        $("#SearchButton").bind("click", function () {
            if (page) {
                veo.Search.CustomerSearch();
                veo.Search.UI_EnableButtons();
            }
            else {
                veo.Search.VeteranSearch();
                veo.Search.UI_EnableButtons();
            }

        });

        $('#ClearButton').bind("click", function () {
            veo.Search.UI_ResetForm();
        });

        $('#IdProofVeteranComplete').bind("click", function () {
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#Casebuttons").show();

            veo.Search.VeteranRowSelected(document.getElementById("personSearchResultsTable").rows[1]);
        });

        $('#IdProofComplete').bind("click", function () {
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#Casebuttons").show();

            $("#CallerFirstNameTextBox").val("");
            $("#CallerLastNameTextBox").val("");
            $("#CallerRelationshipToVeteran").val("");
        });

        $('#IdProofFailed').bind("click", function () {
            //createCaseRecord();
        });

        $('#ReturnToSearchFormButton').bind("click", function () {
            veo.Search.UI_HideAll();
            $("#searchResults").show();
        });

        $('#CreateCaseButton').bind("click", function () {
            veo.Search.ContactSearchForCasesCreateRecord();
        });

        document.getElementById("SocialSecurityTextBox").focus();
    }

    this.CustomerSearch = function () {
        var filter = "";

        if (veo.Search.VeteranValidateSearch() == true) {

            veo.Search.inputSSN = $("#SocialSecurityTextBox").val();
            veo.Search.inputFirstName = $("#FirstNameTextBox").val();
            veo.Search.inputLastName = $("#LastNameTextBox").val();
            veo.Search.inputMonth = $("#BirthMonthTextBox").val();
            veo.Search.inputDay = $("#BirthDayTextBox").val();
            veo.Search.inputYear = $("#BirthYearTextBox").val();

            veo.Search.UI_ShowExecutingMessage();

            var stringDOB = "" + $("#BirthYearTextBox").val() + $("#BirthMonthTextBox").val() + $("#BirthDayTextBox").val();

            filter = "$select=FullName,FirstName,MiddleName,LastName,BirthDate,veo_BranchofService,veo_Rank,GenderCode," +
                "Address1_Line1,Address1_Line2,Address1_Line3,Address1_City,Address1_StateOrProvince,Address1_PostalCode,GovernmentId," +
                "ContactId,Telephone1,veo_EDIPI&$filter=";

            filter += veo.Search.Query_BuildFilter("GovernmentId", $("#SocialSecurityTextBox").val(), false);

            if ($("#FirstNameTextBox").val() != "") {
                filter += veo.Search.Query_BuildFilter("FirstName", $("#FirstNameTextBox").val(), true);
            }

            filter += veo.Search.Query_BuildFilter("LastName", $("#LastNameTextBox").val(), true);


        } else {
            veo.Search.VeteranValidationFailed();
            return;
        }

        if (filter != "") {
            try {
                SDK.REST.retrieveMultipleRecords("Contact", filter, veo.Search.CustomerSearchSuccessCallBack, veo.Search.VeteranSearchErrorCallBack, veo.Search.UI_EnableButtons);
            }
            catch (e) {
                veo.Search.VeteranSearchErrorCallBack(e);
            }
        }
    }

    this.CustomerHouseHoldSearch = function (contact) {
        debugger;
        var filter = "";
        veo.Search.UI_ShowExecutingMessage();
        filter = "$select=FullName,FirstName,MiddleName,LastName,BirthDate,veo_BranchofService,veo_Rank,GenderCode,Address1_Line1," +
            "Address1_Line2,Address1_Line3,Address1_City,Address1_StateOrProvince,Address1_PostalCode,GovernmentId,ContactId,Telephone1,veo_EDIPI&$filter=";
        filter += veo.Search.Query_BuildFilter("veo_DFN", contact.children.td_0_9_DFN.title, false);
        if (filter != "") {
            try {
                SDK.REST.retrieveMultipleRecords("Contact", filter, veo.Search.CustomerHouseHoldSearchSuccessCallBack, veo.Search.VeteranSearchErrorCallBack, veo.Search.UI_EnableButtons);
            }
            catch (e) {
                veo.Search.VeteranSearchErrorCallBack(e);
            }
        }
    }

    this.VeteranValidateSearch = function () {

        $("#validationErrors").find("ul").remove();
        var html = "";
        var ssn = $("#SocialSecurityTextBox").val();

        //html += ($("#FirstNameTextBox").val() == "") ? "<li>The First Name is missing.</li>" : "";
        html += ($("#LastNameTextBox").val() == "") ? "<li>The Last Name is missing.</li>" : "";

        if (ssn == "" || ssn == " 9 digits, no dashes") {
            html += "<li>The Social Security Number is missing.</li>";
        }

        if (html != "") {
            html = "<ul id='errorList'>" + html + "</ul>";
            $("#validationErrors").append(html);
            return false;
        }
        else
            return true;
    }

    this.VeteranValidationFailed = function () {
        veo.Search.UI_HideAll();
        veo.Search.UI_EnableButtons();
        $("#msgBoxFailedValidation").show();
        $("#msgBoxFailedValidation").focus();
    }

    this.VeteranSearchEvaluateMVIMessage = function (data) {
        if (data == null) {
            $("#msgBoxSearchResultError").show();
            $("#errorDetails").text("");
            message = "An unexpected error occurred. Please try your search again.";
            $("#errorDetails").append(message);
            return false;
        }

        var message = data.crme_MviMessage;

        if (message == null)
            return true;

        //check the returned message for "no match" indicators
        var noMatchMessage = "No results were returned from MVI matching the search criteria provided. Please refine your search and try again.";
        var toManyMatches = "The query returned more than the allowable number of matches. Please refine your search and try again.";

        if (message.indexOf("[NF]") >= 0) {
            $("#warningDetails").text("");
            $("#warningDetails").append(noMatchMessage);
            $("#msgBoxNoDataReturned").show();
            return false;
        }

        if (message.indexOf("[QE]") >= 0) {
            $("#warningDetails").text("");
            $("#warningDetails").append(toManyMatches);
            $("#msgBoxNoDataReturned").show();
            return false;
        }

        //check for an error - display error dialog
        if (message.indexOf("[ER]") >= 0) {
            $("#msgBoxSearchResultError").show();
            $("#errorDetails").text("");
            $("#errorDetails").append(message.replace("[ER]", ""));
            return false;
        }

        return true;
    }

    this.VeteranGetCRMValues = function (data, row) {

        debugger;
        var ssn = data.GovernmentId == null ? "" : data.GovernmentId;

        var firstname = data.FirstName == null ? "" : data.FirstName;
        var middlename = data.MiddleName == null ? "" : data.MiddleName;
        var lastname = data.LastName == null ? "" : data.LastName;

        var dob = new Date(data.BirthDate);
        var year = dob.getFullYear();
        var month = dob.getMonth() + 1;
        var day = dob.getDay();
        var dateOfBirth = data.BirthDate == null ? "" : month + "-" + day + "-" + year;

        var branchofservice = data.veo_BranchofService == null ? "" : data.veo_BranchofService;
        var rank = data.veo_Rank == null ? "" : data.veo_Rank;

        var genderCode = "";
        if (data.GenderCode != null) {
            if (data.GenderCode.Value == 1) {
                genderCode = "Male";
            } else {
                genderCode = "Female";
            }
        }

        var address = data.Address1_Line1 == null ? "" : data.Address1_Line1;
        address += data.Address1_Line2 == null ? "" : " " + data.Address1_Line2;
        address += data.Address1_Line3 == null ? "" : " " + data.Address1_Line3;
        address += data.Address1_City == null ? "" : ", " + data.Address1_City;
        address += data.Address1_StateOrProvince == null ? "" : " " + data.Address1_StateOrProvince;
        address += data.Address1_PostalCode == null ? "" : " " + data.Address1_PostalCode;

        var edipi = data.veo_EDIPI == null ? "" : data.veo_EDIPI;
        var senitivitylevel = "0";
        var source = "Contact";

        var crmValues = [ssn, firstname, middlename, lastname, dateOfBirth, branchofservice, rank, genderCode, address, edipi, senitivitylevel, source];
        return crmValues;
    }

    this.CustomerGetCRMValues = function (data, row) {

        debugger;
        var ssn = data.GovernmentId == null ? "" : data.GovernmentId;
        var dfn = data.veo_DFN == null ? "" : data.veo_DFN;
        var bfn = data.veo_BFN == null ? "" : data.veo_BFN;

        var firstname = data.FirstName == null ? "" : data.FirstName;
        var middlename = data.MiddleName == null ? "" : data.MiddleName;
        var lastname = data.LastName == null ? "" : data.LastName;

        var dob = new Date(data.BirthDate);
        var year = dob.getFullYear();
        var month = dob.getMonth() + 1;
        var day = dob.getDay();
        var dateOfBirth = data.BirthDate == null ? "" : month + "-" + day + "-" + year;


        var address = data.Address1_Line1 == null ? "" : data.Address1_Line1;
        address += data.Address1_Line2 == null ? "" : " " + data.Address1_Line2;
        address += data.Address1_Line3 == null ? "" : " " + data.Address1_Line3;
        address += data.Address1_City == null ? "" : ", " + data.Address1_City;
        address += data.Address1_StateOrProvince == null ? "" : " " + data.Address1_StateOrProvince;
        address += data.Address1_PostalCode == null ? "" : " " + data.Address1_PostalCode;

        var source = "Contact";

        var crmValues = [ssn, firstname, middlename, lastname, dateOfBirth, address, source, dfn, bfn];
        return crmValues;
    }

    this.VeteranSearchErrorCallBack = function (error) {

        veo.Search.UI_HideAll();
        veo.Search.UI_EnableButtons();
        $("#msgBoxSearchResultError").show();
        $("#errorDetails").text("");
        $("#errorDetails").append(error.message);
        $("#errorDetails").focus();
    }

    this.CustomerSearchSuccessCallBack = function (data, textStatus, XmlHttpRequest) {
        veo.Search.UI_HideAll();

        var table = $("#personSearchResultsTable");
        $("#personSearchResultsTable").find("thead, tr, th").remove();
        $("#personSearchResultsTable").find("tr:gt(0)").remove();

        if (data != null && data.length > 0) {

            if (data.length == 1 && !veo.Search.VeteranSearchEvaluateMVIMessage(data[0]))
                return;

            $("#searchResultsGrid").show();
            var headers = ['SSN', 'First Name', 'Middle Name', 'Last Name', 'Date of Birth', 'Address', 'Source'];
            var thead = document.createElement('tr');

            var headerCnt = 0;
            for (var i = 0; i < headers.length; i++) {
                var th = document.createElement('th');
                th.className = "grid_title";
                th.appendChild(document.createTextNode(headers[i]));
                th.id = "th_" + headers[i].replace(' ', '');
                th.title = headers[i];
                th.scope = "col";
                thead.appendChild(th);
                headerCnt++;
            }

            var th = document.createElement('th');
            th.className = "grid_title";
            th.appendChild(document.createTextNode("Contact ID"));
            th.id = "th_" + "Contact ID".replace(' ', '');
            th.style.display = 'none';
            th.title = "Contact ID";
            th.scope = "col";
            thead.appendChild(th);

            var th1 = document.createElement('th');
            th1.className = "grid_title";
            th1.appendChild(document.createTextNode("Telephone"));
            th1.id = "th_" + "Telephone".replace(' ', '');
            th1.style.display = 'none';
            th1.title = "Telephone";
            th1.scope = "col";
            thead.appendChild(th1);

            table.append(thead);

            for (var i = 0; i < data.length; i++) {
                var row = document.createElement('tr');

                //ssn, firstname, middlename, lastname, dateOfBirth, branchofservice, rank, genderCode, address, edipi, senitivitylevel, source
                var crmValues = veo.Search.CustomerGetCRMValues(data[i], row);


                for (var j = 0; j < headers.length; j++) {
                    if (j == 0) {

                        var td = document.createElement('td');
                        td.scope = "row";
                    }
                    else {
                        var td = document.createElement('td');
                    }

                    td.id = "td_" + i + "_" + j + "_" + headers[j].replace(' ', '');
                    td.title = crmValues[j];
                    td.innerHTML = crmValues[j];
                    row.appendChild(td);
                }

                debugger;
                var td = document.createElement('td');
                td.id = "td_" + i + "_" + j + "_" + "Contact ID".replace(' ', '');
                td.title = data[i].ContactId;
                td.style.display = 'none';
                td.appendChild(document.createTextNode(data[i].ContactId));

                row.appendChild(td);
                j++;

                var td1 = document.createElement('td');
                td1.id = "td_" + i + "_" + j + "_" + "Telephone".replace(' ', '');
                td1.title = data[i].Telephone1;
                td1.style.display = 'none';
                td1.appendChild(document.createTextNode(data[i].Telephone1));

                row.appendChild(td1);

                row.className = (i % 2 === 0) ? "even" : "odd";
                row.ondblclick = function () { veo.Search.CustomerRowSelected(this); };
                debugger;
                //row.ondblclick = function () { veo.Search.CustomerHouseHoldSearch  (this); };
                table.append(row);
            }

            //Force focus to message
            table.focus();
            veo.Search.UI_EnableButtons();
        }
        else {
            veo.Search.UI_EnableButtons();
            $("#warningDetails").text("");
            $("#warningDetails").append("No matches where returned from MVI matching the data provided. Please refine your search and try again.");
            $("#msgBoxNoDataReturned").show();

            //Force focus to message
            $("#msgBoxNoDataReturned").focus();
        }
    }

    this.CustomerHouseHoldSearchSuccessCallBack = function (data, textStatus, XmlHttpRequest) {
        veo.Search.UI_HideAll();

        var table = $("#householdSearchResultsTable");
        $("#householdSearchResultsTable").find("thead, tr, th").remove();
        $("#householdSearchResultsTable").find("tr:gt(0)").remove();

        if (data != null && data.length > 0) {

            if (data.length == 1 && !veo.Search.VeteranSearchEvaluateMVIMessage(data[0]))
                return;

            $("#householdSearchResultsGrid").show();
            var headers = ['SSN', 'First Name', 'Middle Name', 'Last Name', 'Date of Birth', 'Address', 'Source'];
            var thead = document.createElement('tr');

            var headerCnt = 0;
            for (var i = 0; i < headers.length; i++) {
                var th = document.createElement('th');
                th.className = "grid_title";
                th.appendChild(document.createTextNode(headers[i]));
                th.id = "th_" + headers[i].replace(' ', '');
                th.title = headers[i];
                th.scope = "col";
                thead.appendChild(th);
                headerCnt++;
            }

            var th = document.createElement('th');
            th.className = "grid_title";
            th.appendChild(document.createTextNode("Contact ID"));
            th.id = "th_" + "Contact ID".replace(' ', '');
            th.style.display = 'none';
            th.title = "Contact ID";
            th.scope = "col";
            thead.appendChild(th);

            var th1 = document.createElement('th');
            th1.className = "grid_title";
            th1.appendChild(document.createTextNode("Telephone"));
            th1.id = "th_" + "Telephone".replace(' ', '');
            th1.style.display = 'none';
            th1.title = "Telephone";
            th1.scope = "col";
            thead.appendChild(th1);

            table.append(thead);

            for (var i = 0; i < data.length; i++) {
                var row = document.createElement('tr');

                //ssn, firstname, middlename, lastname, dateOfBirth, branchofservice, rank, genderCode, address, edipi, senitivitylevel, source
                var crmValues = veo.Search.CustomerGetCRMValues(data[i], row);


                for (var j = 0; j < headers.length; j++) {
                    if (j == 0) {

                        var td = document.createElement('td');
                        td.scope = "row";
                    }
                    else {
                        var td = document.createElement('td');
                    }

                    td.id = "td_" + i + "_" + j + "_" + headers[j].replace(' ', '');
                    td.title = crmValues[j];
                    td.innerHTML = crmValues[j];
                    row.appendChild(td);
                }

                debugger;
                var td = document.createElement('td');
                td.id = "td_" + i + "_" + j + "_" + "Contact ID".replace(' ', '');
                td.title = data[i].ContactId;
                td.style.display = 'none';
                td.appendChild(document.createTextNode(data[i].ContactId));

                row.appendChild(td);
                j++;
                var td1 = document.createElement('td');
                td1.id = "td_" + i + "_" + j + "_" + "Telephone".replace(' ', '');
                td1.title = data[i].Telephone1;
                td1.style.display = 'none';
                td1.appendChild(document.createTextNode(data[i].Telephone1));

                row.appendChild(td1);

                row.className = (i % 2 === 0) ? "even" : "odd";
                row.ondblclick = function () { veo.Search.CustomerRowSelected(this); };
                //row.ondblclick = function () { veo.Search.CustomerHouseHoldSearch  (this); };
                table.append(row);
            }

            //Force focus to message
            table.focus();
            veo.Search.UI_EnableButtons();
        }
        else {
            veo.Search.UI_EnableButtons();
            $("#warningDetails").text("");
            $("#warningDetails").append("No matches where returned from MVI matching the data provided. Please refine your search and try again.");
            $("#msgBoxNoDataReturned").show();

            //Force focus to message
            $("#msgBoxNoDataReturned").focus();
        }
    }

    this.CustomerRowSelected = function (contact) {
        debugger;
        var lookupData = new Array();
        var lookupItem = new Object();

        lookupItem.id = contact.cells[7].title;
        lookupItem.name = contact.cells[1].title + " " + contact.cells[3].title;
        lookupItem.entityType = "contact";
        lookupData[0] = lookupItem;

        parent.Xrm.Page.getAttribute("veo_selectedcontactid").setValue(lookupData);

        var entityFormOptions = {};
        entityFormOptions["entityName"] = "incident";
        entityFormOptions["useQuickCreateForm"] = true;
        // Set default values for the Incident form
        var formParameters = {};
        //formParameters["customerid"] = lookupData[0].id;
        // formParameters["customeridname"] = lookupData[0].name;	
        formParameters["customerid"] = contact.cells[7].title;
        formParameters["customeridname"] = contact.cells[1].title + " " + contact.cells[3].title;
        formParameters["customeridtype"] = "contact";
        formParameters["veo_interactionid"] = parent.Xrm.Page.data.entity.getId();
        formParameters["veo_interactionidname"] = parent.Xrm.Page.getAttribute("veo_name").getValue();
        Xrm.Navigation.openForm(entityFormOptions, formParameters);
    }

    this.UI_ClearField = function (obj) {
        if (obj.defaultValue == obj.value)
            obj.value = "";
    }

    this.UI_HideAll = function () {
        $("#searchByTraits").show();
        $("#msgBoxWorking").hide();
        $("#msgBoxFailedValidation").hide();
        $("#msgBoxSearchResultError").hide();
        $("#msgBoxNoDataReturned").hide();
        $("#searchResultsGrid").hide();
        $("#householdSearchResultsGrid").hide();
    }

    this.UI_ResetForm = function () {

        $("#FirstNameTextBox").val("");
        $("#LastNameTextBox").val("");
        $("#BirthYearTextBox").val("");
        $("#BirthMonthTextBox").val("");
        $("#BirthDayTextBox").val("");
        $("#PhoneNoTextBox").val("");
        $("#SocialSecurityTextBox").val("");
        $("#FirstNameNotification").html("");
        $("#LastNameNotification").html("");
        $("#SSNotification").html("");
        $("#DOBNotification").html("");

        veo.Search.UI_HideAll();
        veo.Search.UI_EnableButtons();

        document.getElementById("SocialSecurityTextBox").focus();
    }

    this.UI_DisableButtons = function () {
        $("#SearchButton").attr('disabled', true);
        $("#ClearButton").attr('disabled', true);
    }

    this.UI_EnableButtons = function () {
        $("#SearchButton").attr('disabled', false);
        $("#ClearButton").attr('disabled', false);
    }

    this.UI_ShowExecutingMessage = function () {
        veo.Search.UI_HideAll();
        veo.Search.UI_DisableButtons();
        $("#msgBoxWorking").show();
        $("#msgBoxWorking").focus();
    }

    this.UI_ValidateNumeric = function (value) {
        var cleanNo = value.replace(/\D/g, '');

        if (value.length != cleanNo.length)
            return "The Social Security Number cannot contain non numbers.";
        else if (cleanNo.length != 9)
            return "The Social Security Number must be 9 numbers in length.";
        return "";
    }

    this.Query_BuildFilter = function (field, value, and) {
        if (and)
            return " and " + field + " eq '" + encodeURIComponent(value).replace("'", "%APOS") + "'";
        else
            return field + " eq '" + encodeURIComponent(value).replace("'", "%APOS") + "'";
    }

    this.QueryBuildOptionSetFilter = function (field, value, and) {
        if (and)
            return " and " + field + "/Value eq " + value;
        else
            return field + "/Value eq " + value;
    }

}).call(veo.Search);


//Create a Pipe Delimited Full Name from the individual name fields
function serializeName(data) {
    if (data == null)
        return "";

    var lastName = (data.crme_LastName != null && data.crme_LastName != "") ? data.crme_LastName : "";
    var firstName = (data.crme_FirstName != null && data.crme_FirstName != "") ? data.crme_FirstName : "";
    var middleName = (data.crme_MiddleName != null && data.crme_MiddleName != "") ? data.crme_MiddleName : "";
    var suffix = (data.crme_Suffix != null && data.crme_Suffix != "") ? data.crme_Suffix : "";

    return lastName + "|" + firstName + "|" + middleName + "|" + suffix + "|"; //Removed prefix
}

//Create a Full Name from the individual name fields
function formatName(data) {
    if (data.crme_FullName != null) {
        return data.crme_FullName;
    }

    var name = "";
    name = data.crme_LastName != null ? data.crme_LastName : "";
    name += data.crme_Suffix != null ? " " + data.crme_Suffix : "";
    name += ", ";
    name += data.crme_FirstName != null ? data.crme_FirstName : "";
    name += data.crme_MiddleName != null ? " " + data.crme_MiddleName : "";
    name = name.trim();
    name = name == "," ? "" : name;

    return name;
}

//Format a Full Address from the individual address fields
function formatAddress(data) {
    if (data.crme_FullAddress != null) {
        return data.crme_FullAddress;
    }

    var street = data.crme_Address1 != null ? data.crme_Address1 : "";
    var city = data.crme_City != null ? data.crme_City : "";
    var state = data.crme_StateProvinceId != null ? data.crme_StateProvinceId : "";
    var zip = data.crme_ZIPPostalCodeId != null ? data.crme_ZIPPostalCodeId : "";

    return street + " " + city + " " + state + " " + zip;
}

//Format a one digit month or day into a two digit part
function formatDatePart(datepart) {
    return datepart.length == 1 ? "0" + datepart : datepart;
}

//Required Field Validation
function CheckRequiredField(fieldName, text, displayArea) {
    //Check the field for text, if empty, pop open a new image with alt text.
    var fieldValue = $(fieldName).val();
    var msg = "";
    $("#" + displayArea)[0].setAttribute("aria-haspopup", false);

    if (fieldValue == "")
        msg = "Please enter the " + text + ", it is required.";
    else if (text == "Social Security Number") {
        if (fieldValue != "" || fieldValue != " 9 digits, no dashes") {
            var checkNumber = validateNumeric(fieldValue.trim());
            if (checkNumber != "")
                msg = checkNumber;
        }
    }

    if (msg != "")
        $("#" + displayArea)[0].setAttribute("aria-haspopup", true);

    msg = '<font color="red">' + msg + '</font>';
    $("#" + displayArea).html(msg);
}
