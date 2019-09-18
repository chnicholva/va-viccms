$(document).ready(function () {
	$("#rectangle").height($(document).height());
	getDataParam();
});
function getDataParam() {
	var vals = [];
	if (location.search != "") {
		vals = location.search.substr(1).split("&");
		for (var i in vals) {
			vals[i] = vals[i].replace(/\+/g, " ").split("=");
		}
		var found = false;
		for (var i in vals) {
			if (vals[i][0].toLowerCase() == "data") {
				parseDataValue(vals[i][1]);
				found = true;
				break;
			}
		}
	}
}
function parseDataValue(pNatId) {
	if(!!pNatId && pNatId != "NEWVETERAN"){
		try {
			var xrm = window.location.host;
			var subURL = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
			var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
			var EntitySetName = "mcs_settingSet";
			var selectString = "?$select=*&$filter=mcs_name eq 'Active Settings'";
			var jsonQuery = "https://" + xrm + "/" + subURL + ODATA_ENDPOINT + "/" + EntitySetName + selectString;
			var EntityData = null;
			$.ajax({
				type : "GET",
				contentType : "application/json; charset=utf-8",
				datatype : "json",
				url : jsonQuery,
				beforeSend : function (XMLHttpRequest) {
					XMLHttpRequest.setRequestHeader("Accept", "application/json");
				},
				success : function (data, textStatus, XmlHttpRequest) {
					EntityData = data;
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					alert('Fail: Ajax Error in TRIBRIDGE.RetrieveAllAttributesByEntitySync: ' + errorThrown);
				},
				async : false,
				cache : false
			});
			if(EntityData.d.results.length > 0) {
				var activeSettings = EntityData.d.results[0];
				if(!!activeSettings.ftp_DACURL && !!activeSettings.ftp_FlagsAPIURL){
					var PatientFlagsUrl = activeSettings.ftp_DACURL + activeSettings.ftp_FlagsAPIURL + pNatId;
					jQuery.support.cors = true;
					$.get(PatientFlagsUrl, function (hdrResponse, status) {
						try {
							if(!hdrResponse.ErrorOccurred) { /*note: Prod HDR response doesn't even have the 'ErrorOccurred' property*/
								var data = hdrResponse.hasOwnProperty("Data") ? hdrResponse.Data /*non prod*/: hdrResponse /*prod*/; /*added 11/19/16 kknab to accomodate schema difference between Prod and NonProd HDR responses*/
								if (data.hasOwnProperty("length") && data.length > 0) { /*changed 11/19/16 kknab to accomodate schema difference between Prod and NonProd HDR responses*/
									$.each(data, function () { /*changed 11/19/16 kknab to accomodate schema difference between Prod and NonProd HDR responses*/
										if (this.Category == "I (NATIONAL)") {
											$("#flagdetails").append($("<h2 id='h2_" + this.Id + "'>" + this.Type + "</h2>").click(function () {
													$("#" + this.id.replace("h2", "p")).is(":visible") ? $("#" + this.id.replace("h2", "p")).hide() : $("#" + this.id.replace("h2", "p")).show();
												})).append($("<p id='p_" + this.Id + "'>" + this.Name + "</p>"));
										}
										else {
											$("#flagdetails").append($("<h2 id='h2_" + this.Id + "'>" + this.Type + "</h2>").click(function () {
													$("#" + this.id.replace("h2", "p")).is(":visible") ? $("#" + this.id.replace("h2", "p")).hide() : $("#" + this.id.replace("h2", "p")).show();
												})).append($("<p id='p_" + this.Id + "'>" + this.Name + "</p>"));
										}
									});
									window.open("http://event/?eventname=Show Flags");
								}
								else {
									$("#flagdetails").append($("<h2 id=noFlagsHeader>No flags.</h2>")).append($("<div id=noFlagsDiv><p>Keeping patient flags page hidden.</p><p>You may acknowledge and continue, or close the session now</p></div>"));
									window.open("http://event/?eventname=Saved");
								}
							}
							else { /*no data or error from HDR*/
								showErrorMessage(
									!!hdrResponse.ErrorMessage ? hdrResponse.ErrorMessage : "Error making service request.",
									!!hdrResponse.DebugInfo ? hdrResponse.DebugInfo : "No DebugInfo available."
								);
							}
						}
						catch (err){
							showErrorMessage("Encountered an error retrieving patient flags.", err.message);
						}
					});
				}
				else {
					showErrorMessage("Unable to retrieve Active Settings from CRM.", "Missing either 'DACURL' or 'Flags API URL'. Contact your CRM administrator.");
				}
			}
			else { /*could not retrieve Active Settings*/
				showErrorMessage("Unable to retrieve Active Settings from CRM.", "Contact your CRM administrator.");
			}
		}
		catch (err) {
			showErrorMessage("Encountered an error retrieving patient flags.", err.message);
		}
	}
	else {
		showErrorMessage("No National ID for veteran.", "Did not query Patient Flags API.");
	}
}

function showErrorMessage(pErrorMessage, pDebugMessage){
	$("#flagdetails").append($("<h2 id=errorHeader>Could not retrieve patient flags at this time</h2>")).append($("<div id=errorDiv><p>" + pErrorMessage + "</p><p>" + pDebugMessage + "</p><p>You may acknowledge and continue, or close the session now</p></div>"));
	$("#abtn").val("Acknowledge and Continue");
	window.open("http://event/?eventname=Show Flags");
}