//Javascript Libary for the mvi_searchui.html
if (typeof veo == 'undefined') {
    veo = {
        __namespace: true
    };
}

if (typeof(veo.Search) == "undefined") {
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

    this.Initialize = function () {

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
            veo.Search.VeteranSearch();
            veo.Search.UI_EnableButtons();
        });

        $('#ClearButton').bind("click", function () {
            veo.Search.UI_ResetForm();
        });

        $('#IdProofVeteranComplete').bind("click", function () {
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#CallerInfo").show();

            veo.Search.VeteranRowSelected(document.getElementById("personSearchResultsTable").rows[1]);
        });

        $('#IdProofComplete').bind("click", function () {
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#CallerInfo").show();

            $("#CallerFirstNameTextBox").val("");
            $("#CallerLastNameTextBox").val("");
            $("#CallerRelationshipToVeteran").val("");
        });

        $('#IdProofFailed').bind("click", function () {
            //createCaseRecord();
        });

        $('#ReturnToSearchButton').bind("click", function () {
            veo.Search.UI_HideAll();
            $("#searchResults").show();
        });

        $('#CaseManagementButton').bind("click", function () {
            veo.Search.UI_HideAll();
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#CaseManagement").show();
        });

        $('#ReturnToCallerInfoButton').bind("click", function () {
            veo.Search.UI_HideAll();
            $("#searchByTraits").hide();
            $("#searchResults").hide();
            $("#CallerInfo").show();
        });

        $('#CreateCaseButton').bind("click", function () {
            veo.Search.ContactSearchForCasesCreateRecord();
        });

        document.getElementById("SocialSecurityTextBox").focus();
    }

    this.ContactSearchForCases = function (contactId) {

        var filter = "";
        debugger;

        filter = "$select=Title,TicketNumber,CaseOriginCode,CreatedOn,IncidentId,StatusCode&$filter=";
        filter += "CustomerId/Id eq (guid'" + contactId + "')";

        if (filter != "") {
            try {
                SDK.REST.retrieveMultipleRecords("Incident", filter, veo.Search.ContactSearchForCasesSuccessCallBack, veo.Search.ContactSearchForCasesErrorCallBack, veo.Search.UI_EnableButtons);
            }
            catch(e) {
                veo.Search.ContactSearchForCasesErrorCallBack(e);
            }
        }
    }

    this.ContactSearchForCasesSuccessCallBack = function (data, textStatus, XmlHttpRequest) {

        debugger;
        var table = $("#contactCaseResultsTable");
        $("#contactCaseResultsTable").find("thead, tr, th").remove();
        $("#contactCaseResultsTable").find("tr:gt(0)").remove();

        if (data != null && data.length > 0) {

            $("#contactCaseResultsTable").show();

            var headers = ['Title', 'Ticket Number', 'Contact Method', 'Status', 'Created On'];
            var thead = document.createElement('tr');

            for (var i = 0; i < headers.length; i++) {
                var th = document.createElement('th');
                th.className = "grid_title";
                th.appendChild(document.createTextNode(headers[i]));
                th.id = "th_" + headers[i].replace(' ', '');
                th.title = headers[i];
                th.scope = "col";
                thead.appendChild(th);
            }

            table.append(thead);

            for (var i = 0; i < data.length; i++) {
                var row = document.createElement('tr');

                var crmValues = veo.Search.ContactSearchForCasesGetCRMValues(data[i], row);
                for (var j = 0; j < headers.length; j++) {
                    if (j == 0) {

                        var td = document.createElement('td');
                        td.scope = "row";
                    }
                    else {
                        var td = document.createElement('td');
                    }

                    td.id = "td_" + i + "_" + j + "_" + headers[j].replace(' ', '');

                    if (j == 0) {
                        td.title = data[i].IncidentId;
                    }
                    else {
                        td.title = crmValues[j];
                    }

                    td.appendChild(document.createTextNode(crmValues[j]));
                    row.appendChild(td);
                }

                row.className = "grid_row";
                row.ondblclick = function () {
                    veo.Search.ContactSearchForCaseOpenExistingCase(this);
                };
                table.append(row);
            }

            //Force focus to message
            table.focus();
            veo.Search.UI_EnableButtons();
        }
        else {
            veo.Search.UI_EnableButtons();
            //$("#warningDetails").text("");
            //$("#warningDetails").append("No matches where returned from MVI matching the data provided. Please refine your search and try again.");
            //$("#msgBoxNoDataReturned").show();
            //Force focus to message
            // $("#msgBoxNoDataReturned").focus();
        }
    }

    this.ContactSearchForCasesErrorCallBack = function (error) {
        //hideAll();
        alert(error.message);
        veo.Search.UI_EnableButtons();
        //$("#msgBoxSearchResultError").show();
        //$("#errorDetails").text("");
        //$("#errorDetails").append(error.message);
        //$("#errorDetails").focus();
    }

    this.ContactSearchForCasesGetCRMValues = function (data, row) {
        //get the display values
        var title = data.Title == null ? "" : data.Title;
        //row.setAttribute("Full Name", FullName);	
        var ticketnumber = data.TicketNumber == null ? "" : data.TicketNumber;

        var createdon = new Date(data.CreatedOn);
        var year = createdon.getFullYear();
        var month = createdon.getMonth() + 1;
        var day = createdon.getDay();
        var createdOnDate = data.CreatedOn == null ? "" : month + "-" + day + "-" + year;
        //row.setAttribute("Date of Birth", dateOfBirth);
        var caseorigincode = data.CaseOriginCode == null ? "" : data.CaseOriginCode.Value.toString();
        if (caseorigincode == "1") {
            caseorigincode = "Phone";
        }

        switch (caseorigincode) {
        case "1":
            caseorigincode = "Phone";
            break;
        case "2":
            caseorigincode = "Email";
            break;
        case "3":
            caseorigincode = "Web";
            break;
        case "2483":
            caseorigincode = "Facebook";
            break;
        case "3986":
            caseorigincode = "Twitter";
            break;
        default:

            break;
        }

        debugger;
        var statuscode = data.StatusCode == null ? "" : data.StatusCode.Value.toString();
        switch (statuscode) {
        case "1":
            statuscode = "In Progress";
            break;
        case "2":
            statuscode = "On Hold";
            break;
        case "3":
            statuscode = "Waiting for Details";
            break;
        case "4":
            statuscode = "Researching";
            break;
        case "5":
            statuscode = "Problem Solved";
            break;
        case "6":
            statuscode = "Canceled";
            break;
        case "1000":
            statuscode = "Information Provided";
            break;
        case "2000":
            statuscode = "Merged";
            break;
        default:

            break;
        }

        var crmValues = [title, ticketnumber, caseorigincode, statuscode, createdOnDate];
        return crmValues;
    }

    this.ContactSearchForCasesCreateRecord = function () {

        var customerId = parent.Xrm.Page.getAttribute("veo_selectedcontactid").getValue()[0].id;
        var customerName = parent.Xrm.Page.getAttribute("veo_selectedcontactid").getValue()[0].name;
        var customerType = parent.Xrm.Page.getAttribute("veo_selectedcontactid").getValue()[0].entityType;

        var parameters = {};
        parameters["title"] = "Case created for " + customerName;
        parameters["veo_interactionid"] = parent.Xrm.Page.data.entity.getId();
        parameters["veo_interactionidname"] = parent.Xrm.Page.getAttribute("veo_name").getValue();
        parameters["customerid"] = customerId;
        parameters["customeridname"] = customerName;
        parameters["customeridtype"] = customerType;
        parameters["caseorigincode"] = "1";

        Xrm.Utility.openEntityForm("incident", null, parameters);
    }

    this.ContactSearchForCaseOpenExistingCase = function (obj) {

        debugger;
        Xrm.Utility.openEntityForm("incident", obj.cells[0].title, null);

        veo.Search.UI_EnableButtons();
        return false;
    }

    this.VeteranSearch = function () {

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

            filter = "$select=FullName,FirstName,MiddleName,LastName,BirthDate,veo_BranchofService,veo_Rank,GenderCode,Address1_Line1,Address1_Line2,Address1_Line3,Address1_City,Address1_StateOrProvince,Address1_PostalCode,veo_SSN,ContactId,Telephone1,veo_EDIPI&$filter=";

            filter += veo.Search.Query_BuildFilter("veo_SSN", $("#SocialSecurityTextBox").val(), false);

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
                SDK.REST.retrieveMultipleRecords("Contact", filter, veo.Search.VeteranSearchSuccessCallBack, veo.Search.VeteranSearchErrorCallBack, veo.Search.UI_EnableButtons);
            }
            catch(e) {
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
        else return true;
    }

    this.VeteranValidationFailed = function () {
        veo.Search.UI_HideAll();
        veo.Search.UI_EnableButtons();
        $("#msgBoxFailedValidation").show();
        $("#msgBoxFailedValidation").focus();
    }

    this.VeteranSearchSuccessCallBack = function (data, textStatus, XmlHttpRequest) {

        veo.Search.UI_HideAll();

        var table = $("#personSearchResultsTable");
        $("#personSearchResultsTable").find("thead, tr, th").remove();
        $("#personSearchResultsTable").find("tr:gt(0)").remove();

        if (data != null && data.length > 0) {

            if (data.length == 1 && !veo.Search.VeteranSearchEvaluateMVIMessage(data[0])) return;

            $("#searchResultsGrid").show();

            var headers = ['SSN', 'First Name', 'Middle Name', 'Last Name', 'Date of Birth', 'Br of Svc', 'Rank', 'Gender', 'Address', 'EDIPI', 'Sens. Level', 'Source'];
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

                var crmValues = veo.Search.VeteranGetCRMValues(data[i], row);
                for (var j = 0; j < headers.length; j++) {
                    if (j == 0) {

                        var td = document.createElement('td');
                        td.scope = "row";
                    }
                    else {
                        var td = document.createElement('td');
                    }

                    td.id = "td_" + i + "_" + j + "_" + headers[j].replace(' ', '');
                    //td.id = data[i].ContactId;
                    //if (j == 0) {
                    //    td.title = data[i].ContactId;
                    //}
                    //else {
                    td.title = crmValues[j];
                    //}
                    if (j == 0) {
                        var ssnIdProofCheckbox = document.createElement("INPUT");
                        ssnIdProofCheckbox.setAttribute("type", "checkbox");
                        ssnIdProofCheckbox.setAttribute("aria-label", "SSN ID Proof checkbox: " + crmValues[j]);
                        ssnIdProofCheckbox.setAttribute("id", "nameIdProofCheckbox" + i);
                        ssnIdProofCheckbox.setAttribute("tabindex", 100 + 10 * i);
                        ssnIdProofCheckbox.setAttribute("name", "ssnVerified");
                        ssnIdProofCheckbox.setAttribute("rowNum", i);
                        ssnIdProofCheckbox.setAttribute("checked", "true");
                        ssnIdProofCheckbox.onchange = veo.Search.VeteranResultOnIDProofCheckboxCheck;
                        td.appendChild(ssnIdProofCheckbox);
                        var ssnSpan = document.createElement("SPAN");
                        ssnSpan.setAttribute("onclick", "javascript:onIdProofCheckboxTextClick('nameIdProofCheckbox" + i + "');");
                        ssnSpan.appendChild(document.createTextNode(crmValues[j]));
                        td.appendChild(ssnSpan);
                    } else if (j == 1) {
                        var firstnameIdProofCheckbox = document.createElement("INPUT");
                        firstnameIdProofCheckbox.setAttribute("type", "checkbox");
                        firstnameIdProofCheckbox.setAttribute("aria-label", "First Name ID Proof checkbox: " + crmValues[j]);
                        firstnameIdProofCheckbox.setAttribute("id", "firstnameIdProofCheckbox" + i);
                        firstnameIdProofCheckbox.setAttribute("tabindex", 101 + 10 * i);
                        firstnameIdProofCheckbox.setAttribute("name", "firstnameVerified");
                        firstnameIdProofCheckbox.setAttribute("rowNum", i);
                        firstnameIdProofCheckbox.setAttribute("checked", "true");
                        firstnameIdProofCheckbox.onchange = veo.Search.VeteranResultOnIDProofCheckboxCheck;
                        td.appendChild(firstnameIdProofCheckbox);
                        var firstnameSpan = document.createElement("SPAN");
                        firstnameSpan.setAttribute("onclick", "javascript:onIdProofCheckboxTextClick('firstnameIdProofCheckbox" + i + "');");
                        firstnameSpan.appendChild(document.createTextNode(crmValues[j]));
                        td.appendChild(firstnameSpan);
                    } else if (j == 3) {
                        var lastnameIdProofCheckbox = document.createElement("INPUT");
                        lastnameIdProofCheckbox.setAttribute("type", "checkbox");
                        lastnameIdProofCheckbox.setAttribute("aria-label", "Last Name ID Proof checkbox: " + crmValues[j]);
                        lastnameIdProofCheckbox.setAttribute("id", "lastnameIdProofCheckbox" + i);
                        lastnameIdProofCheckbox.setAttribute("tabindex", 102 + 10 * i);
                        lastnameIdProofCheckbox.setAttribute("name", "lastnameVerified");
                        lastnameIdProofCheckbox.setAttribute("rowNum", i);
                        lastnameIdProofCheckbox.setAttribute("checked", "true");
                        lastnameIdProofCheckbox.onchange = veo.Search.VeteranResultOnIDProofCheckboxCheck;
                        td.appendChild(lastnameIdProofCheckbox);
                        var lastnameSpan = document.createElement("SPAN");
                        lastnameSpan.setAttribute("onclick", "javascript:onIdProofCheckboxTextClick('lastnameIdProofCheckbox" + i + "');");
                        lastnameSpan.appendChild(document.createTextNode(crmValues[j]));
                        td.appendChild(lastnameSpan);
                    } else if (j == 4) {
                        var dobIdProofCheckbox = document.createElement("INPUT");
                        dobIdProofCheckbox.setAttribute("type", "checkbox");
                        dobIdProofCheckbox.setAttribute("aria-label", "Date of Birth ID Proof checkbox: " + crmValues[j]);
                        dobIdProofCheckbox.setAttribute("id", "dobIdProofCheckbox" + i);
                        dobIdProofCheckbox.setAttribute("tabindex", 103 + 10 * i);
                        dobIdProofCheckbox.setAttribute("name", "dobVerified");
                        dobIdProofCheckbox.setAttribute("rowNum", i);
                        dobIdProofCheckbox.setAttribute("checked", "true");
                        dobIdProofCheckbox.onchange = veo.Search.VeteranResultOnIDProofCheckboxCheck;
                        td.appendChild(dobIdProofCheckbox);
                        var dobSpan = document.createElement("SPAN");
                        dobSpan.setAttribute("onclick", "javascript:onIdProofCheckboxTextClick('dobIdProofCheckbox" + i + "');");
                        dobSpan.appendChild(document.createTextNode(crmValues[j]));
                        td.appendChild(dobSpan);
                    } else if (j == 5) {
                        //var longBranchofService = LongBranchOfService(branchOfService);
                        var bosIdProofCheckbox = document.createElement("INPUT");
                        bosIdProofCheckbox.setAttribute("type", "checkbox");
                        bosIdProofCheckbox.setAttribute("aria-label", "Branch of Service ID Proof checkbox: " + crmValues[j]);
                        bosIdProofCheckbox.setAttribute("id", "bosIdProofCheckbox" + i);
                        bosIdProofCheckbox.setAttribute("tabindex", 104 + 10 * i);
                        bosIdProofCheckbox.setAttribute("name", "bosVerified");
                        bosIdProofCheckbox.setAttribute("rowNum", i);
                        bosIdProofCheckbox.setAttribute("checked", "true");
                        bosIdProofCheckbox.onchange = veo.Search.VeteranResultOnIDProofCheckboxCheck;
                        td.appendChild(bosIdProofCheckbox);
                        var bosSpan = document.createElement("SPAN");
                        bosSpan.setAttribute("onclick", "javascript:onIdProofCheckboxTextClick('bosIdProofCheckbox" + i + "');");
                        bosSpan.appendChild(document.createTextNode(crmValues[j]));
                        td.appendChild(bosSpan);
                    } else {
                        td.appendChild(document.createTextNode(crmValues[j]));
                    }

                    row.appendChild(td);
                }

                var td = document.createElement('td');
                td.id = "td_" + i + "_" + j + "_" + "Contact ID".replace(' ', '');
                td.title = data[i].ContactId;
                td.style.display = 'none';
                td.appendChild(document.createTextNode(data[i].ContactId));

                row.appendChild(td);

                var td1 = document.createElement('td');
                td1.id = "td_" + i + "_" + j + "_" + "Telephone".replace(' ', '');
                td1.title = data[i].Telephone1;
                td1.style.display = 'none';
                td1.appendChild(document.createTextNode(data[i].Telephone1));

                row.appendChild(td1);

                row.className = "grid_row";
                //row.ondblclick = function () { openSelectedVeteran(this); };
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

    this.VeteranSearchEvaluateMVIMessage = function (data) {
        if (data == null) {
            $("#msgBoxSearchResultError").show();
            $("#errorDetails").text("");
            message = "An unexpected error occurred. Please try your search again.";
            $("#errorDetails").append(message);
            return false;
        }

        var message = data.crme_MviMessage;

        if (message == null) return true;

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
        var ssn = data.veo_SSN == null ? "" : data.veo_SSN;

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

    this.VeteranSearchErrorCallBack = function (error) {

        veo.Search.UI_HideAll();
        veo.Search.UI_EnableButtons();
        $("#msgBoxSearchResultError").show();
        $("#errorDetails").text("");
        $("#errorDetails").append(error.message);
        $("#errorDetails").focus();
    }

    this.VeteranRowSelected = function (obj) {

        debugger;

        var lookupData = new Array();
        var lookupItem = new Object();

        lookupItem.id = obj.cells[12].title;
        lookupItem.name = obj.cells[1].title + " " + obj.cells[3].title;
        lookupItem.entityType = "contact";
        lookupData[0] = lookupItem;

        parent.Xrm.Page.getAttribute("veo_selectedcontactid").setValue(lookupData);

        //$("#Casebuttons").show();
        selectedFirstName = obj.cells[1].title;
        selectedLastName = obj.cells[3].title;

        $("#CallerFirstNameTextBox").val(selectedFirstName);
        $("#CallerLastNameTextBox").val(selectedLastName);
        $("#CallerRelationshipToVeteran").val("752280000");
        $("#CallerTelephoneTextBox").val(obj.cells[13].title);

        veo.Search.ContactSearchForCases(obj.cells[12].title);

    }

    this.VeteranResultOnIDProofCheckboxCheck = function () {
        if (veo.Search.VeteranResultIDProofCheckboxCheck(this) == true) {
            $('#idProofCompleteButton').attr('disabled', false);
            if (selectAnotherVet === "true") $('#idProofVeteranCompleteButton').attr('disabled', true);
            else $('#idProofVeteranCompleteButton').attr('disabled', false);
            $('#idProofFailedButton').attr('disabled', true);
        }
        else {
            $('#idProofCompleteButton').attr('disabled', true);
            $('#idProofVeteranCompleteButton').attr('disabled', true);
            $('#idProofFailedButton').attr('disabled', false);
        }
    }

    this.VeteranResultIDProofCheckboxCheck = function (obj) {
        var table = $("#personSearchResultsTable");
        var rowNum = obj.getAttribute("rowNum");
        var row = table.find("[rowIdNum=" + rowNum + "]");

        switch (obj.name) {
        case "firstnameVerified":
            row[0].setAttribute('crme_firstnameverified', obj.checked);
            break;
        case "lastnameVerified":
            row[0].setAttribute('crme_lastnameverified', obj.checked);
            break;
        case "dobVerified":
            row[0].setAttribute('crme_dobverified', obj.checked);
            break;
        case "ssnVerified":
            row[0].setAttribute('crme_ssnverified', obj.checked);
            break;
        case "bosVerified":
            row[0].setAttribute('crme_bosverified', obj.checked);
            break;
        }
        var checkboxes = $("[id*='IdProofCheckbox" + rowNum + "']");
        for (var key in checkboxes) {
            if (checkboxes[key].checked === false) return false;
        }
        return true;
    }

    this.UI_ClearField = function (obj) {
        if (obj.defaultValue == obj.value) obj.value = "";
    }

    this.UI_HideAll = function () {
        $("#searchByTraits").show();
        $("#msgBoxWorking").hide();
        $("#msgBoxFailedValidation").hide();
        $("#msgBoxSearchResultError").hide();
        $("#msgBoxNoDataReturned").hide();
        $("#searchResultsGrid").hide();
        $("#CallerInfo").hide();
        $("#CaseManagement").hide();
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

        if (value.length != cleanNo.length) return "The Social Security Number cannot contain non numbers.";
        else if (cleanNo.length != 9) return "The Social Security Number must be 9 numbers in length.";
        return "";
    }

    this.Query_BuildFilter = function (field, value, and) {
        if (and) return " and " + field + " eq '" + encodeURIComponent(value).replace("'", "%APOS") + "'";
        else return field + " eq '" + encodeURIComponent(value).replace("'", "%APOS") + "'";
    }

    this.QueryBuildOptionSetFilter = function (field, value, and) {
        if (and) return " and " + field + "/Value eq " + value;
        else return field + "/Value eq " + value;
    }

}).call(veo.Search);

//Create a Pipe Delimited Full Name from the individual name fields
function serializeName(data) {
    if (data == null) return "";

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

    if (fieldValue == "") msg = "Please enter the " + text + ", it is required.";
    else if (text == "Social Security Number") {
        if (fieldValue != "" || fieldValue != " 9 digits, no dashes") {
            var checkNumber = validateNumeric(fieldValue.trim());
            if (checkNumber != "") msg = checkNumber;
        }
    }

    if (msg != "") $("#" + displayArea)[0].setAttribute("aria-haspopup", true);

    msg = '<font color="red">' + msg + '</font>';
    $("#" + displayArea).html(msg);
}

//Format Date of Birth
//function FormatDOB(location) {
//    var rawDOB = $(DateofBirthDateInput).val();
//    var cleanDOB = rawDOB.replace(/\D/g, '');
//    var cleanDOBwithSlashes = rawDOB.replace(/[^0-9/]/g, '');
//    var msg = "";
//    var formattedDOB = cleanDOBwithSlashes;
//    if (rawDOB.length != 0) {
//        if (cleanDOB.length == 8 && cleanDOBwithSlashes.length == 8 && rawDOB.length == 8) {
//            msg = '<font color="blue">' + "Attempted to format DOB from MMDDYYYY to MM/DD/YYYY." + '</font>';
//            formattedDOB = rawDOB.substring(0, 2) + "/" + rawDOB.substring(2, 4) + "/" + rawDOB.substring(4, 8);
//        }
//        else if ((rawDOB.length != 10 && cleanDOBwithSlashes.length != 10) || (cleanDOB.length != 8)) {
//            msg = "Date of Birth must be formatted MM/DD/YYYY.";
//            formattedDOB = cleanDOBwithSlashes;
//        }
//        if (formattedDOB.length == 10) {
//            var validateDate = new Date(formattedDOB);
//            var currentDate = new Date();
//            var earlyDate = new Date("01/01/1850");
//            if (validateDate == "Invalid Date")
//                msg = "Invalid Date: Cannot convert into real date.";
//            else if (earlyDate > validateDate)
//                msg = "Invalid Date: Date entered is too far in the past.";
//            else if (validateDate > currentDate)
//                msg = "Invalid Date: Date entered is too far in the future.";
//        }
//    }
//    else {
//        //Required Notification
//        msg = '<font color="red">Please enter the Date of Birth, it is required.</font>';
//    }
//    if (location == "field") {
//        $("#DOBNotification")[0].setAttribute("aria-haspopup", true);
//        msg = '<font color="red">' + msg + '</font>';
//        //$("#DateofBirthDateInput").val(formattedDOB);
//        $("#DOBNotification").html(msg);
//    }
//    else
//        return msg;
//}
