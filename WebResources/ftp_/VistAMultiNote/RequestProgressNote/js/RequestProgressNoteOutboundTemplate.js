//RequestProgressNoteOutboundTemplate.js

function outboundTemplate_buildNoteText() {
    //retrieve necessary records first, then set ftp_notedetail value
    //***var requestValue = Xrm.Page.getAttribute("regardingobjectid").getValue();
    var vcmn_requestId = Xrm.Page.data.entity.getId();


    if (!!vcmn_requestId) {
        var queryString = "ftp_ReasonforRequest,ftp_SubReasonId"; /*fields from request*/
        queryString += ",incident_customer_contacts/Address1_Composite,incident_customer_contacts/Address2_Composite"; /*fields from request's veteran*/
        queryString += ",tri_ftp_interaction_incident/ftp_OutboundInteractionWhoAnsweredText,tri_ftp_interaction_incident/ftp_Details,tri_ftp_interaction_incident/ftp_OutboundInteractionAddress"; /*fields from request's interaction*/
        queryString += ",ftp_ftp_subreason_incident/ftp_notetext"; /*fields from request's sub reason*/
        var expandString = "incident_customer_contacts,tri_ftp_interaction_incident,ftp_ftp_subreason_incident"; /*expand request relationships*/
        SDK.REST.retrieveRecord(
			vcmn_requestId,
			"Incident",
			queryString,
			expandString,
			function (retrievedRequest) {
			    var resultText = "";
			    if (!!retrievedRequest) {
			        /*add indicated address*/
			        resultText += "Address: ";
			        if (!!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress) {
			            var addressSelection = !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress.Value ? retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress.Value : 100000000;
			            /*
						100000000 -> Primary
						100000001 -> Temporary
						*/

			            resultText += (addressSelection == 100000000) ?
							(!!retrievedRequest.incident_customer_contacts.Address1_Composite ? retrievedRequest.incident_customer_contacts.Address1_Composite : "") :
							(!!retrievedRequest.incident_customer_contacts.Address2_Composite ? retrievedRequest.incident_customer_contacts.Address2_Composite : "");

			        }

			        resultText += "\n";
			        resultText += "Spoke with: "
			        resultText += !!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionWhoAnsweredText ? retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionWhoAnsweredText : "";

			        resultText += "\n";
			        resultText += "Callback Number: ";
			        resultText += (!!(Xrm.Page.getAttribute("ftp_callbacknumber").getValue()) ? Xrm.Page.getAttribute("ftp_callbacknumber").getValue() : "");

			        if (!!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_Details) {
			            resultText += "\n\n";
			            resultText += retrievedRequest.tri_ftp_interaction_incident.ftp_Details;
			        }

			        resultText += "\n\n";
			        resultText += "Sub-Reason: ";
			        resultText += (!!retrievedRequest.ftp_ftp_subreason_incident && !!retrievedRequest.ftp_ftp_subreason_incident.ftp_notetext) ? retrievedRequest.ftp_ftp_subreason_incident.ftp_notetext : "not provided";

			        resultText += "\n";
			        resultText += "Minor Reason: ";
			        /*
						get ftp_Description value of ftp_outboundaction record attached to the newest action taken beneath this request.
					*/
			        var actionTakenQuery = "$expand=ftp_ftp_outboundaction_ftp_actiontaken&$filter=ftp_RequestId/Id eq (guid'" + vcmn_requestId + "')&$orderby=CreatedOn desc";
			        var newestActionTaken = null;
			        SDK.REST.retrieveMultipleRecords(
						"ftp_actiontaken",
						actionTakenQuery,
						function (retrievedRecords) {
						    if (!!retrievedRecords && retrievedRecords.length > 0) newestActionTaken = retrievedRecords[0];
						},
						function (error) {
						    alert("Outbound Template error retrieving newest action taken record: " + error.message);
						},
						function () {
						    if (!!newestActionTaken && !!newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken) {
						        if (!!newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_Description) {
						            resultText += newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_Description;
						        }

						        if (newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.hasOwnProperty("ftp_RequiresAdditionalDetail") && newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_RequiresAdditionalDetail == true) {
						            /*if outboundaction requires more detail, print the ftp_Description field from the action taken*/
						            resultText += "\n";
						            resultText += "Free Form Text: ";
						            resultText += !!newestActionTaken.ftp_Description ? newestActionTaken.ftp_Description : "";
						        }
						        outboundTemplate_setNoteDetail(resultText);
						    }
						    else {
						        /*could not find newest action taken record*/
						    }
						}
					);
			    }
			},
			function (error) {
			    alert("Outbound Template error retrieving request and its related records: " + error.message);
			}
		);

    }
}

function outboundTemplate_setNoteDetail(pText) {
    if (!!pText) {
        Xrm.Page.getAttribute("ftp_notedetail").setValue(pText);
        Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode("always");
    }
}