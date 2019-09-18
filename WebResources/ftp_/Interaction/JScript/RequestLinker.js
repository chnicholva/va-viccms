(function () {
debugger;
	var Crm = window.parent.Xrm;
	if ((Crm.Page.ui.getFormType() !== null) && (Crm.Page.ui.getFormType() === 1)) {
	return;
	}
	else{

    $(document).ready(function () {
        var Xrm = window.parent.Xrm;
        var veteran = Xrm.Page.getAttribute("ftp_veteran").getValue();
        var interaction = Xrm.Page.data.entity.getId();
		
		/*function setInt(){
alert("in setInt");
			var i = Xrm.Page.data.entity.getId();
			interaction = i;
alert("setI +"+ i);
if(interaction === ""){
			window.setTimeout(setInt,500);
		}
		}
		if(interaction === ""){
			window.setTimeout(setInt,500);
		}*/
//alert("interactionId"+interaction);
        var requests = REST.SYNC.retrieveMultipleRecordsSync("Incident", "$select=Title,IncidentId,ftp_Target,ftp_Start,CreatedBy,OwnerId,StateCode&$filter=CustomerId/Id eq guid'" + veteran[0].id + "'&$orderby=CreatedOn desc");
//alert("Requests eq" +requests.results.length);
        requests = RequestCleaner(requests);
		//alert(interaction);
        requests = ProcessAssociations(requests, interaction);
        $('#vetRequests').dataTable({
            "data": requests.results,
            "columns": [
                {
                    "className": "cbx",
                    "orderable": false,
                    "data": "Associated",
                    "title": "Link"
                },
                { "data": "Title", "title": "Request Name" },
                { "data": "ftp_Start", "title": "Start Date" },
                { "data": "ftp_Target", "title": "Target Date" },
                { "data": "CreatedBy.Name", "title": "Created By" },
                { "data": "OwnerId.Name", "title": "Owner" },
                { "data": "StateCode", "title": "State" }
            ],
            "sDom": 'tfp',
            "pageLength": 5,
            "order": [[2, "desc"]]
        });

        var vetTable = $('#vetRequests').DataTable();

        $('#vetRequests').on('draw.dt', function () {
            CheckboxesAndLinks(vetTable, interaction);
        });
        CheckboxesAndLinks(vetTable, interaction);

        if (Xrm.Page.ui.getFormType() == 3 || Xrm.Page.ui.getFormType() == 4) {
            $("#container").children().prop('disabled', true);
        }

        $('#vetRequests_filter input').keydown(function (event) {
            if (event.keyCode == 8 && this.value != "") {
                this.value = this.value.slice(0, -1);
            }
        });
    });  

    function CheckboxesAndLinks(vetTable, interaction) {
        $('#vetRequests td').each(function () {
            var data = vetTable.row($(this).parent()).data();
            if ($(this).hasClass("cbx")) {
                $(this).text('');
                $(this).append($("<input type=checkbox />").prop('checked', data.Associated));
            }
            else {
                $(this).hover(
                    function () {
                        $(this).addClass("hover");
                    }, function () {
                        $(this).removeClass("hover");
                    }
                );
                $(this).click(function () {
                    Xrm.Utility.openEntityForm("incident", data.IncidentId);
                });
            }
        });

        $('input[type=checkbox]').click(function () {
            var data = vetTable.row($(this).parent().parent()).data();

            if (this.checked) {

                SDK.REST.associateRecords(data.IncidentId, "Incident", "tri_ftp_interaction_incident", interaction, "ftp_interaction");
                data.Associated = true;
            } else {
                SDK.REST.disassociateRecords(data.IncidentId, "Incident", "tri_ftp_interaction_incident", interaction);
                data.Associated = false;
            }
        });
    }

    function ProcessAssociations(requests, interaction) {
//alert ("before assrequest");
//alert("int eq"+interaction);
		var nobracket=interaction.replace(/({|})/g,'')
        var assRequests = REST.SYNC.retrieveMultipleRecordsSync("Incident", "?$select=IncidentId,tri_ftp_interaction_incidentId&$filter=tri_ftp_interaction_incidentId/Id eq (guid'"+nobracket+"')");
		//(interaction, "ftp_interaction", "tri_ftp_interaction_incident/IncidentId", "tri_ftp_interaction_incident");
        if (assRequests.results.length > 0) {
            $(requests.results).each(function () {
                var _this = this;
                $(assRequests.results).each(function () {
                    if (this.IncidentId == _this.IncidentId) {
                        _this.Associated = true;
                        return false;
                    } else {
                        _this.Associated = false;
                    }
                });
            });
        }
        else {
            $(requests.results).each(function () {
                this.Associated = false;
            });
        }
        return requests;
    }

    function RequestCleaner(requests) {
        $(requests.results).each(function () {
            if (this.ftp_Target != null) {
                var dt = this.ftp_Target;
                dt = dt.replace('/Date(', '');
                dt = dt.replace(')/', '');
                dt = new Date(parseInt(dt, 10));
                var mins = ('0' + dt.getMinutes()).slice(-2);
                var timeVals = HoursCalc(dt);
                this.ftp_Target = dt.getMonth()+1 + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + timeVals[0] + ":" + mins + " " + timeVals[1];
            }
            if (this.ftp_Start!=null) {
                var dt2 = this.ftp_Start;
                dt2 = dt2.replace('/Date(', '');
                dt2 = dt2.replace(')/', '');
                dt2 = new Date(parseInt(dt2, 10));
                var mins2 = ('0' + dt2.getMinutes()).slice(-2);
                var timeVals = HoursCalc(dt2);
                this.ftp_Start = dt2.getMonth()+1 + "/" + dt2.getDate() + "/" + dt2.getFullYear() + " " + timeVals[0] + ":" + mins2 + " " + timeVals[1];
            }
            if (this.StateCode.Value == 0)
                this.StateCode = "Active";
            else
                this.StateCode = "Resolved";
        });
        return requests;
    }

    function HoursCalc(dt) {
        var vals = [];
        var hours = dt.getHours();
        if (hours > 12) {
            vals[0] = hours - 12;
            vals[1] = "PM";
        }
        else if (hours == 0) {
            vals[0] = "12";
            vals[1] = "AM";
        }
        else {
            vals[0] = hours;
            hours == 12 ? vals[1] = "PM" : vals[1] = "AM";
        }
        return vals;
    }

}
})()