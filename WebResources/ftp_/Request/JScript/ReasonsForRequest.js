$(document).ready(function () {
    var Xrm = window.parent.Xrm;
    
    if (Xrm.Page.getAttribute("customerid").getValue() != null) {
        var veteran = Xrm.Page.getAttribute("customerid").getValue();
        SDK.REST.retrieveRecord(
            veteran[0].id,
            "Contact",
            "ftp_PACTId",
            null,
            function (v) {
                // if the veteran is assigned to a PACT retrieve the PACT members and dynamic build resource DOM, else alert that the veteran needs a PACT assigned to continue
                if (v.ftp_PACTId.Id) {
                    RetrievePactMembers(v.ftp_PACTId.Id, Xrm);
                } else {
                    $("body").html("Veteran must be assigned to a PACT team before you can use this functionality");
                }
            },
            function (error) { alert(error.message); }
        );
    }
});

function RetrievePactMembers(pID, Xrm) {
    SDK.REST.retrieveMultipleRecords(
        "SystemUser",
        "$select=SystemUserId,FullName,ftp_PACTRole&$filter=ftp_PACTId/Id eq guid'" + pID + "'",
        function (su) {
            BuildResource(AppendTeamAndRole(su, pID, Xrm), Xrm);
        },
        function (error) { alert(error.message); },
        function () { }
    );

}

function AppendTeamAndRole(systemUsers, pID, Xrm) {
    // Retrieves the PACT team and appends to the assignList
    var assignList = [];
    var oDataSelect = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/ftp_pactSet(guid'" + pID + "')?select=ftp_Team";
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: oDataSelect,
        beforeSend: function (XMLHttpRequest) { XMLHttpRequest.setRequestHeader("Accept", "application/json"); },
        success: function (data, textStatus, XmlHttpRequest) {
            assignList.push({ Id: data.d.ftp_Team.Id, Text: data.d.ftp_Team.Name, LogicalName: "team" });
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus + "; ErrorThrown: " + errorThrown);
        }
    });

    // Retrieve the PACT Role Metadata
    var entityMetadata = SDK.Metadata.RetrieveEntity(
            SDK.Metadata.EntityFilters.Attributes,
            "systemuser",
            null,
            false
    );
    var AttributeMetadata;
    $(entityMetadata.Attributes).each(function() {
        if (this.SchemaName.toLowerCase() == "ftp_pactrole") {
            AttributeMetadata = this;
            return false;
        }
    });

    // Add each systemuser to the assignList along with their PACT Role, if they have one
    $(systemUsers).each(function () {
        var $this = this;
        $(AttributeMetadata.OptionSet.Options).each(function () {
            if (this.Value == $this.ftp_PACTRole.Value) {
                $this.ftp_PACTRole = " " + this.Label.UserLocalizedLabel.Label;
                return false;
            }
        });
        if (typeof this.ftp_PACTRole != "string") this.ftp_PACTRole = "";
        assignList.push({ Id: this.SystemUserId, Text: this.FullName + this.ftp_PACTRole, LogicalName: "systemuser" });
    });
    return assignList;
}

function BuildResource(assignList, Xrm) {
    // build an array of reasons from the reason for request field
    var reasons = [];
    $.each(Xrm.Page.getAttribute("ftp_reasonforrequest").getOptions(), function () {
        if (this.value != "100000000" && this.text != "") reasons.push(this);
    });

    // populate a reference select element with the veteran's PACT members, PACT Role, and PACT Team
    var output = [];
    $(assignList).each(function () {
        output.push('<option value="' + this.Id + "|" + this.LogicalName + '">' + this.Text + '</option>');
    });
    $('#mySelect').html(output.join(''));

    // split the reasons into 3 arrays
    var thirds = reasons.length / 3;
    var reasons1 = reasons.splice(0, (thirds));
    var reasons2 = reasons.splice(0, (thirds));

    // populate the 3 columns with the 3 reason arrays
    CreateColumns(reasons1, "#col1");
    CreateColumns(reasons2, "#col2");
    CreateColumns(reasons, "#col3");

    // When Submit is clicked..
    $("#Submit").click(function () {
        // loop through all the visible select elements (as a result of their respective checkbox being checked)
        $("select:visible").each(function () {
            // if the reasons processed flag hasn't been set to true, set it to true
            if (!Xrm.Page.getAttribute("ftp_reasonsprocessed").getValue()) Xrm.Page.getAttribute("ftp_reasonsprocessed").setValue(true);
            var values = this.value.split("|");
            ReasonsMap(values[0], this.id.replace("ddl_", ""), $("#" + this.id.replace("ddl", "lbl"))[0].innerText, values[1], Xrm);
        })
        // Save the record, if the reasons processed flag is set to true RequestUpdatePreStageRunner.cs will do it's thing
        Xrm.Page.data.refresh(true).then(function () { }, function () { });
    });
}

// Receives the Reason for request, converts it into an attribute name, and maps the associated hidden field 
// with concatenated data that RequestUpdatePreStageRunner.cs uses to create child requests
function ReasonsMap(owner, reasonValue, reasonText, ownerType, Xrm) {
    var attr = "ftp_rfr" + reasonText.toLowerCase().replace(/[^A-Z0-9]+/ig, "");
    Xrm.Page.getAttribute(attr).setValue(owner + "|" + reasonValue + "|" + reasonText + "|" + ownerType);
}

// Goes through each reason and appends the following to a specified column:
//      1. A list item (the row)
//      2. A checkbox with an onClick that shows/hides its associated select element
//      3. A label
//      4. A select element which is cloned from #mySelect to prevent multiple retrieves
// For each reason we check whether the label has a larger width than the previous label.
// Once we have the max label width of the column we apply it to all the column label's widths to have optimal select element presentation.
function CreateColumns(reasons, colId) {
    var max = 0;
    $(reasons).each(function () {
        $(colId).append(
            $("<li></li>").append(
                $("<input id='cbx_" + this.value + "' type='checkbox'>")
                .click(function (event) {
                    this.checked ? $("#" + this.id.replace("cbx", "ddl")).show() : $("#" + this.id.replace("cbx", "ddl")).hide()
                })
            )
            .append(
                $("<label id='lbl_" + this.value + "'>" + this.text + "</label>")
            )
            .append(
                $("#mySelect").clone().attr("id", "ddl_" + this.value).hide()
            )
        );
        if ($("#lbl_" + this.value).width() > max) max = $("#lbl_" + this.value).width();
    });
    $(colId + " label").width(max);
}