$(document).ready(function() {

    $("#btnSearchByTraits").bind("click", function() {
        personSearchCallBack();
    });

});


function personSearchCallBack() {
    var data = getData();

    $('div#tmpDialog').show();
    // get the table
    var table = $("#personSearchResultsTable");

    clearResults("personSearchResultsTable");

    if (data != null && data.length > 0) {

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');

        for (var i = 0; i < data.length; i++) {

            var fullName = formatName(data[i]);

            if (fullName === "") {
                break;
            }

            var dateOfBirth = data[i].crme_DOBString == null ? "" : data[i].crme_DOBString;
            var ssn = data[i].crme_ssn == null ? "" : data[i].crme_ssn;


            if (i === 0) {
                var th0 = document.createElement('th');
                var th1 = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');

                th0.appendChild(document.createTextNode(''));
                th1.appendChild(document.createTextNode('Name'));
                th2.appendChild(document.createTextNode('Date of Birth'));
                th3.appendChild(document.createTextNode('SSN'));

                theadRow.appendChild(th0);
                theadRow.appendChild(th1);
                theadRow.appendChild(th2);
                theadRow.appendChild(th3);
                
                thead.appendChild(theadRow);
                table.append(thead);
            }

            // Table rows
            var row = document.createElement('tr');
            var col0 = document.createElement('td');
            var col1 = document.createElement('td');
            var col2 = document.createElement('td');
            var col3 = document.createElement('td');

            var aElem = document.createElement('a');
            aElem.className = "GetStationDataButton";
            aElem.href = "#"; 
            var aElemNode = document.createTextNode("+");
            aElem.appendChild(aElemNode);
            aElem.setAttribute("data-retrieveUrl", dateOfBirth);
            //$(aElem).data('RetrieveUrl', dateOfBirth);

            $(aElem).bind("click", function () {
                testFunc(this);
                expandCollapse(this);
            });

            col0.appendChild(aElem);
            col1.appendChild(document.createTextNode(fullName));
            col2.appendChild(document.createTextNode(dateOfBirth));
            col3.appendChild(document.createTextNode(ssn));
            
            row.appendChild(col0);
            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            
            row.className = (i % 2 == 0) ? "even" : "odd";

            var stationRow = document.createElement('tr');
            stationRow.className = "StationRow";

            table.append(row);
            table.append(stationRow);
        }
        //$(".GetStationDataButton").each(function () {
        //    var button = this;
        //    $(button).bind("click", function() {
        //        expandCollapse(button);
        //    });
        //});

        $("#resultsFieldSetDiv").show();
        table.show();
    }
    $("#searchResultsMessageDiv").show();
    $("#searchResultsMessageDiv").text((data != null && data[0] != null && data[0] != undefined && data[0].crme_ReturnMessage != null) ? data[0].crme_ReturnMessage : "");
}

function testFunc(element) {
    alert(element.getAttribute('data-retrieveUrl'));
}

function expandCollapse(button) {

    var nextRow = $(button).closest('tr').next('tr');
    var className = nextRow.attr('class');

    if (className.indexOf("nav-expanded") === -1) {
        //subgrid not expanded

        if (nextRow.has(".SubTableDiv").length === 0) {
            //data not yet retrieved
            displayVeteranStationSubgrid(nextRow);
        }
        nextRow.addClass("nav-expanded");
        $(button).text("-");
    } else {
        nextRow.removeClass("nav-expanded");
        $(button).text("+");
    }
}

function displayVeteranStationSubgrid(row) {

    var subTableCol = document.createElement('td');
    var subTableDiv = document.createElement('div');
    subTableDiv.className = "SubTableDiv";

    var stationTable = createVeteranStationTable();

    subTableCol.appendChild(stationTable);
    subTableDiv.appendChild(subTableCol);

    row.append(subTableDiv);
}

function createVeteranStationTable() {
    var table = document.createElement('table');
    table.id = "StationTable";

    var stationData = getStationData();
    
    var thead = document.createElement("thead");
    var tbody = document.createElement('tbody');

    for (var i = 0; i < stationData.length; i++) {
        var theadRow = document.createElement("tr");
        var stationName = stationData[i].crme_SiteName;
        var link = stationData[i].crme_url;

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

function formatName(data) {

    if (data.crme_FullName != null) {
        return data.crme_FullName;
    }

    var firstName = data.crme_FirstName != null ? data.crme_FirstName : "";
    var lastName = data.crme_LastName != null ? data.crme_LastName : "";

    return firstName + " " + lastName;
}

function clearResults(tableName) {
    // get the table
    var table = $("#" + tableName);

    // reset the table by removing all data rows
    table.find("thead, tr, th").remove();
    table.find("tr:gt(0)").remove();
    table.hide();
    table.val("");
    table.hide();

}

function getData() {
    var data = [
        {
            crme_FullName: "Richard Carr",
            crme_DOBString: "7/4/1976",
            crme_ssn:"111-22-3333"
        },
        {
            crme_FullName: "Dan Blake",
            crme_DOBString: "3/12/1904",
            crme_ssn: "333-22-1111"
        }
    ];

    return data;
}

function getStationData() {
    var stationData = [
    {
        crme_SiteName: "Reno, NV",
        crme_url: "http://www.bing.com"
    },
    {
        crme_SiteName: "Northern California",
        crme_url:"http://www.google.com"
    }];

    return stationData;
}