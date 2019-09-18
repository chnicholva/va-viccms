function outboundTemplate_buildNoteText(){
	//retrieve necessary records first, then set ftp_notedetail value
	var resultText = "";
	var requestValue = Xrm.Page.getAttribute("regardingobjectid").getValue();
	if(!!requestValue){
		var queryString = "ftp_ReasonforRequest,ftp_SubReasonId,Description,CustomerId"; /*fields from request*/
		queryString += ",incident_customer_contacts/Address1_Composite,incident_customer_contacts/Address2_Composite,incident_customer_contacts/ftp_currentfacilityid,incident_customer_contacts/ftp_FacilityId"; /*fields from request's veteran*/
		queryString += ",tri_ftp_interaction_incident/ftp_OutboundInteractionWhoAnsweredText,tri_ftp_interaction_incident/ftp_Details,tri_ftp_interaction_incident/ftp_OutboundInteractionAddress,tri_ftp_interaction_incident/ftp_OutboundInteractionCallReasonOther"; /*fields from request's interaction*/
		queryString += ",ftp_ftp_subreason_incident/ftp_notetext"; /*fields from request's sub reason*/
		var expandString = "incident_customer_contacts,tri_ftp_interaction_incident,ftp_ftp_subreason_incident"; /*expand request relationships*/
		SDK.REST.retrieveRecord(
			requestValue[0].id,
			"Incident",
			queryString,
			expandString,
			function(retrievedRequest){
				if(!!retrievedRequest){
					/*Lines 1-3: indicated address*/
					resultText += "Address: ";
					if(!!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress){
						var addressSelection = !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress.Value ? retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionAddress.Value : 100000000;
						/*
						100000000 -> Primary
						100000001 -> Temporary
						*/
						
						resultText += (addressSelection == 100000000) ? 
							(!!retrievedRequest.incident_customer_contacts.Address1_Composite ? retrievedRequest.incident_customer_contacts.Address1_Composite : "") :
							(!!retrievedRequest.incident_customer_contacts.Address2_Composite ? retrievedRequest.incident_customer_contacts.Address2_Composite : "");
						
					}
					
					/*Line 4*/
					resultText += "\n";
					resultText += "Interacted with: "
					resultText += !!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionWhoAnsweredText ? retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionWhoAnsweredText : "";
					
					/*Line 5*/
					resultText += "\n";					
					resultText += "Callback Number: ";
					resultText += (!!(Xrm.Page.getAttribute("ftp_callbacknumber").getValue()) ? Xrm.Page.getAttribute("ftp_callbacknumber").getValue() : "");
					
					/*Line 6*/
					/* 
					-per carol 5/5/17, use Description from request instead of ftp_Details from interaction
					-fallback to use interaction's ftp_Details if request's Description is empty for whatever reason.
					*/					
					if(!!retrievedRequest.Description){
						resultText += "\n\n";
						resultText += retrievedRequest.Description;
					}
					else{
						if(!!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_Details){
							resultText += "\n\n";
							resultText += retrievedRequest.tri_ftp_interaction_incident.ftp_Details;
						}
					}
					
					/*line 7*/
					/*if subreason == "other", grab the ftp_OutboundInteractionCallReasonOther value from the Interaction connected to this request*/
					/*note: this expects that incident.ftp_subreasonid == interaction.ftp_outboundinteractionsubreasonid*/
					if(!!retrievedRequest.ftp_SubReasonId){
						if(retrievedRequest.ftp_SubReasonId.Name == "Other"){
							if(!!retrievedRequest.tri_ftp_interaction_incident && !!retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionCallReasonOther){
								resultText += "\n\n";
								resultText += retrievedRequest.tri_ftp_interaction_incident.ftp_OutboundInteractionCallReasonOther;
							}
						}
						else{
							/*other wise, use the 'note text' value from the connected sub reason record*/
							if(!!retrievedRequest.ftp_ftp_subreason_incident && !!retrievedRequest.ftp_ftp_subreason_incident.ftp_notetext){
								resultText += "\n\n";
								resultText += retrievedRequest.ftp_ftp_subreason_incident.ftp_notetext;
							}
						}
					}
					
					resultText += "\n";
					/*
						get ftp_Description value of ftp_outboundaction record attached to the newest action taken beneath this request.
					*/
					var actionTakenQuery = "$expand=ftp_ftp_outboundaction_ftp_actiontaken&$filter=ftp_RequestId/Id eq (guid'" + requestValue[0].id + "')&$orderby=CreatedOn desc";
					var newestActionTaken = null;
					SDK.REST.retrieveMultipleRecords(
						"ftp_actiontaken",
						actionTakenQuery,
						function(retrievedRecords){
							if(!!retrievedRecords && retrievedRecords.length > 0) newestActionTaken = retrievedRecords[0];
						},
						function(error){
							alert("Outbound Template error retrieving newest action taken record: " + error.message);
							outboundTemplate_setNoteDetail(resultText);
						},
						function(){
							if(!!newestActionTaken && !!newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken){
								if(!!newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_Description){
									resultText += newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_Description;
								}
								
								if(newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.hasOwnProperty("ftp_RequiresAdditionalDetail") && newestActionTaken.ftp_ftp_outboundaction_ftp_actiontaken.ftp_RequiresAdditionalDetail == true){
									/*if outboundaction requires more detail, print the ftp_Description field from the action taken*/
									resultText += "\n";
									//resultText += "Free Form Text: ";
									resultText += !!newestActionTaken.ftp_Description ? newestActionTaken.ftp_Description : "";
								}
								outboundTemplate_setNoteDetail(resultText);
							}
							else{
								/*could not find newest action taken record*/
							}
						}
					);
					
					/*Set ftp_patient from request.customerid*/
					if(!!retrievedRequest.CustomerId){
						Xrm.Page.getAttribute("ftp_patient").setValue([{
							id: retrievedRequest.CustomerId.Id,
							entityType: retrievedRequest.CustomerId.LogicalName,
							name: retrievedRequest.CustomerId.Name
						}]);
						Xrm.Page.getAttribute("ftp_patient").setSubmitMode("always");
					}
					
					/*set ftp_patientfacility from veteran.ftp_currentfacilityid | veteran.ftp_FacilityId*/
					var facilityToUse = !!retrievedRequest.incident_customer_contacts.ftp_currentfacilityid ? retrievedRequest.incident_customer_contacts.ftp_currentfacilityid : 
						!!retrievedRequest.incident_customer_contacts.ftp_FacilityId ? retrievedRequest.incident_customer_contacts.ftp_FacilityId : null;
					if(!!facilityToUse){
						Xrm.Page.getAttribute("ftp_patientfacility").setValue([{
							id: facilityToUse.Id,
							entityType: facilityToUse.LogicalName,
							name: facilityToUse.Name
						}]);
						Xrm.Page.getAttribute("ftp_patientfacility").setSubmitMode("always");
					}
					
					/*set Local Note Title to "PHARMACY TECHNICIAN CALL"*/
					var localTitleQuery = "$select=ftp_name,ftp_localtitleId&$filter=ftp_name eq 'PHARMACY TECHNICIAN CALL'";
					var retrievedTitles = [];
					SDK.REST.retrieveMultipleRecords(
						"ftp_localtitle",
						localTitleQuery,
						function(retrievedRecords){
							if (typeof retrievedRecords != "undefined" && !!retrievedRecords) retrievedTitles = retrievedTitles.concat(retrievedRecords);
						},
						function(error){
							alert("Outbound Template error retrieving 'PHARMACY TECHNICIAN CALL' local title: " + error.message);
						},
						function(){
							if(retrievedTitles.length > 0){
								var ptcTitle = retrievedTitles[0];
								if(!!ptcTitle.ftp_localtitleId && !!ptcTitle.ftp_name){
									Xrm.Page.getAttribute("ftp_localnotetitle").setValue([{
										id: ptcTitle.ftp_localtitleId,
										entityType: "ftp_localtitle",
										name: ptcTitle.ftp_name
									}]);
								}
							}
						}
					);
				}
			},
			function(error){
				alert("Outbound Template error retrieving request and its related records: " + error.message);
				outboundTemplate_setNoteDetail("Outbound Template error retrieving request and its related records: " + error.message);
			}
		);
		
	}
}

function outboundTemplate_setNoteDetail(pText){
	if(!!pText){
		Xrm.Page.getAttribute("ftp_notedetail").setValue(pText);
		Xrm.Page.getAttribute("ftp_notedetail").setSubmitMode("always");
	}
}