(function () {
    // Namespace Variables
//	//debugger;

    var Xrm = window.parent.Xrm;
    var vetLookupValue = Xrm.Page.getAttribute("ftp_veteran").getValue();
	var otherText = "Other";
	var narcoText = "Medication - Refill Narcotic";
	var pharmaTeam = "Pharmacy";
    var height = 385;   // gets changed throughout loading and event handling based on different scenarios
    var multipleRfrId = "156db634-ee0d-e511-8108-00155d14711e";
    var otherRfrId = "136db634-ee0d-e511-8108-00155d14711e";
	var _userTeams = [];
	var queryStringParameters = Xrm.Page.context.getQueryStringParameters();
	var originatingEntityType = (queryStringParameters.hasOwnProperty("originatingEntityType_0")) ? queryStringParameters.originatingEntityType_0 : "";
	var originatingEntityId = (queryStringParameters.hasOwnProperty("originatingEntityId_0")) ? queryStringParameters.originatingEntityId_0 : "";
	var originatingEntityName = (queryStringParameters.hasOwnProperty("originatingEntityName_0")) ? queryStringParameters.originatingEntityName_0 : "";
	var requestLinkedInteractionId = (queryStringParameters.hasOwnProperty("requestLinkedInteractionId_0")) ? queryStringParameters.requestLinkedInteractionId_0 : "";

    /// <summary>
    /// This angular module at a high level does the following (in order):
    /// 1) Gets Reasons for Request
    /// 2) Establishes a inter-controller connector (MySharedService)
    /// 3) Builds the Reason for Request controller
    /// 4) Gets Pact Role Names
    /// 5) Gets the Pact Id associated with the Veteran
    /// 6) Assembles a Pact Members object array
    /// 7) Adds the Pact Team to the beginning of the object array
    /// 8) Builds the Assignment controller
    /// 9) Executes the Addendum controller
    /// </summary>
    angular.module('RequestAssignment', [])
    .factory('pID', [function () {
        var _pID;
        //debugger;
		var vetid = vetLookupValue[0].id;
		var nobracket=vetid.replace(/({|})/g,'');
        var pID = REST.SYNC.retrieveRecordSync(nobracket.toLowerCase(), "Contact", "ftp_PACTId", null);
        _pID = pID.ftp_PACTId;
        return _pID;
    }])
    .factory('mySharedService', function ($rootScope) {
        // view this in //debugger once for clarity, it's kind of weird.
		//debugger;
        var sharedService = {};

        sharedService.message = '';

        sharedService.prepForBroadcast = function (msg) {
            this.message = msg;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcast');
        };

        return sharedService;
    })
    .factory('rfrs', function () {
		var _rfrs = [];
		var currentUserId = Xrm.Page.context.getUserId();
		var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
		
		//old query, retrieves only the RFR records connected to teams of which the current member is a user
		//var query = "SystemUserSet(guid'" + currentUserId + "')/teammembership_association?$expand=ftp_ftp_reasonforrequest_team&$select=TeamId,Name,ftp_ftp_reasonforrequest_team/ftp_reason,ftp_ftp_reasonforrequest_team/ftp_reasonforrequestId,ftp_ftp_reasonforrequest_team/ftp_display";
		
		//new query, just retrieve all active RFR records set for display
		var query = "ftp_reasonforrequestSet?$select=ftp_reason,ftp_reasonforrequestId&$filter=ftp_display eq true and ftp_reason ne null";
		
		$.ajax({
			type : "GET",
			contentType : "application/json; charset=utf-8",
			datatype : "json",
			url : oDataPath + query,
			beforeSend : function (XMLHttpRequest) {
				//Specifying this header ensures that the results will be returned as JSON.
				XMLHttpRequest.setRequestHeader("Accept", "application/json");
			},
			success : function (data, textStatus, XmlHttpRequest){
				if(!!data){
					//code for parsing results of old query (by user's teams)
					/*
					var retrievedTeams = data.d.results;
					for(var i = 0, l = retrievedTeams.length; i < l; i++){
						var thisTeam = retrievedTeams[i];
						_userTeams.push(thisTeam);
						
						for(var j = 0, m = thisTeam.ftp_ftp_reasonforrequest_team.results.length; j < m; j++){
							var thisRfr = thisTeam.ftp_ftp_reasonforrequest_team.results[j];
							if(!!thisRfr.ftp_reason && !!thisRfr.ftp_reasonforrequestId && (thisRfr.ftp_display != null && thisRfr.ftp_display)){
								_rfrs.push({
									text: thisRfr.ftp_reason,
									id: thisRfr.ftp_reasonforrequestId
								});
							}
						}
					}
					*/
					
					//code for parsing results of new query (just RFRs)
					var retrievedRecords = data.d.results;
					for(var i = 0, l = retrievedRecords.length; i < l; i++){
						var thisRfr = retrievedRecords[i];
						_rfrs.push({
							text: thisRfr.ftp_reason,
							id: thisRfr.ftp_reasonforrequestId
						});
					}
				}
			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Error retrieving reason for request records: " + errorThrown);
				//alert("Error retrieving teams for current user: " + errorThrown);
			},
			async : false,
			cache : false
		});
		return _rfrs;
	})
	.factory('userTeams', function(){
		var retrievedTeams = [];
		var currentUserId = Xrm.Page.context.getUserId();
		var oDataPath = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
		var query = "SystemUserSet(guid'" + currentUserId + "')/teammembership_association";
		
		$.ajax({
			type : "GET",
			contentType : "application/json; charset=utf-8",
			datatype : "json",
			url : oDataPath + query,
			beforeSend : function (XMLHttpRequest) {
				//Specifying this header ensures that the results will be returned as JSON.
				XMLHttpRequest.setRequestHeader("Accept", "application/json");
			},
			success : function (data, textStatus, XmlHttpRequest){
				if(!!data){
					var retrievedTeams = data.d.results;
					for(var i = 0, l = retrievedTeams.length; i < l; i++){
						var thisTeam = retrievedTeams[i];
						_userTeams.push(thisTeam); //this is the important line
						retrievedTeams.push(thisTeam);
					}
				}
			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				alert("Error retrieving teams for current user: " + errorThrown);
			},
			async : false,
			cache : false
		});
		return retrievedTeams;
	})
    
    .controller('AddendumController', ['rfrs', '$scope', 'mySharedService',
        function (rfrs, $scope, mySharedService) {
			//debugger;
            var addendumCtrl = this;
            // Watch the height div containing all addendum parts
            $scope.$watch(function () { return $(".footer").height() }, function (newValue, oldValue) {
                // if we have an addendum div check whether the div has gotten larger or smaller and adjust the web resource container size
                if ($scope.visible) {
                    var offset = (newValue - oldValue);
                    // Sometimes the offsets are rediculously large pos/neg numbers for no reason.
                    if (offset > 50) return;
                    if (offset < -50) return;
                    height += (offset);
                }
            });

            // build an array of reasons from the reason for request field, not including Multiple Reasons for Request
            addendumCtrl.reasons = [];
            $.each(rfrs, function () {
                if (this.id != multipleRfrId && this.id != "") addendumCtrl.reasons.push(this);
            });
            $scope.visible = true;

            // If the reason for request was changed to multiple show the addendum control, otherwise hide it
            $scope.$on('handleBroadcast', function () {
                addendumCtrl.selectedReasonId = mySharedService.message;
                addendumCtrl.selectedReasonId == multipleRfrId ? $scope.visible = true : $scope.visible = false;
                $scope.$apply();
            });
			
			$scope.RetrieveMultipleEntitySync = function (EntitySetName, filter, Guid) {

				//This function will return a json object with every attribute from an entity for a single record synchronously 
				try {
					//Perform REST call
					var context = Xrm.Page.context;
					var serverUrl = context.getClientUrl();
					var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
					//Format Entity Guid
					var EntityIdnobracket = Guid.replace(/({|})/g, '');
					//Construct the JSON Query
					var selectString = "";
					if (filter !== "") { selectString = "?$filter=" + filter + " eq guid'" + EntityIdnobracket + "'"; }
					else { selectString = "(guid'" + EntityIdnobracket + "')?$select=*"; }

					var jsonQuery = serverUrl + ODATA_ENDPOINT + "/" + EntitySetName + selectString;

					//Initialize the return value
					var EntityData = null;
					$.ajax({
						type: "GET",
						contentType: "application/json; charset=utf-8",
						datatype: "json",
						url: jsonQuery,
						beforeSend: function (XMLHttpRequest) {
							//Specifying this header ensures that the results will be returned as JSON.
							XMLHttpRequest.setRequestHeader("Accept", "application/json");
						},
						success: function (data, textStatus, XmlHttpRequest) {
							//Get the data values
							EntityData = data;
						},
						error: function (XMLHttpRequest, textStatus, errorThrown) {
							alert('Fail: Ajax Error in RetrieveMultipleEntitySync: ' + errorThrown);
						},
						async: false,
						cache: false
					});
					//Return the data result
					return EntityData;
				}
				catch (err) {
					//Display Error
					alert("An error occured in the RetrieveMultipleEntitySyncEntitySync function.  Error Detail Message: " + err);
				}
			};
			$scope.CheckMandatoryFields = function () {
				var populated = true; 
				Xrm.Page.getAttribute(function (attribute, index) {
					if (attribute.getRequiredLevel() == "required") {
						if(attribute.getValue() === null && attribute.getName() != "ftp_name") {
							//alert(attribute.getName() + " is missing");
							populated = false;
						}
					}
					
				});
					
				return populated;
			};	
			$scope.isUserOnTeam = function(teamName){
				//compare teamName against the global _userTeams array that was populated onLoad, in the rfrs factory function (now in the userTeams factor function 11/1/16)
				var matchFound = false;
				if (_userTeams.length == 0) matchFound = false;
				for(var i = 0, l = _userTeams.length; i < l; i++){
					if(_userTeams[i].Name == teamName) {
						matchFound = true;
						break;
					}
				}
				return matchFound;				
				
				/* var data = {};
				var d = {};
				var tArray = [];
				var SetName = "TeamMembershipSet";
				var filter = "SystemUserId";
				var user = Xrm.Page.context.getUserId();
				data = $scope.RetrieveMultipleEntitySync(SetName, filter, user);
				
				for (i = 0; i < data.d.results.length; i++) {
					for (i = 0; i < data.d.results.length; i++) {
						tArray.push(data.d.results[i].TeamId);
					}
				}
				for (i = 0; i < tArray.length; i++) {
					d = $scope.RetrieveMultipleEntitySync("TeamSet", "", tArray[i]);
					if (d.d.Name === teamName){
						matchFound = true;
						break;
					}
				}
				return matchFound; */
			};
			$scope.addendumCtrl.click = function ($event, $label) {
				//$event is a boolean (for checked/unchecked box)
				//$label is a string (for label of box)
				if($label == narcoText){
					var narcoControl = Xrm.Page.getControl("ftp_reasonforcontrolledsubstancerenewal");
					if(!!narcoControl){
						narcoControl.setVisible($event);
						narcoControl.getAttribute().setRequiredLevel(($event && $scope.isUserOnTeam(pharmaTeam)) ? "required" : "none");
					}
				}
				else{
					if($label == otherText){
						// If reason is other show the other control, else hide it (on load)
						var otherReasonControl = Xrm.Page.getControl("ftp_otherreason");
						if(!!otherReasonControl){
							Xrm.Page.getControl("ftp_otherreason").setVisible($event);
							Xrm.Page.getAttribute("ftp_otherreason").setRequiredLevel($event ? "required" : "none");
						}
					}
				}
			};
			//debugger;
            // Handles the submit event and performs validation
            addendumCtrl.submit = function () {
				var title = "Combo -";
				var reasonCount = 0;
                var validOwner = true;
                var submit = [];
				var missingFields = false;
                $(addendumCtrl.reasons).each(function () {
                    if (this.checked) {
                        var myText = this.text;
                        if (this.text == otherText) {
							if (Xrm.Page.getAttribute("ftp_otherreason").getValue() != null){
								myText = Xrm.Page.getAttribute("ftp_otherreason").getValue();
							}
							else{
								missingFields = true;
							}
						}  
						else{
							if (this.text == narcoText && Xrm.Page.getAttribute("ftp_reasonforcontrolledsubstancerenewal").getValue() == null){
								missingFields = $scope.isUserOnTeam(pharmaTeam);
							}
						}
                        submit.push({ id: this.id, text: myText});
						title = title + myText + "/";
						reasonCount = reasonCount + 1;
                        //this.checked = false;
                    }
                });
				//debugger;
				title = title.slice(0, -1);
				
                var strLengthExceeded = false;
				var aType = Xrm.Page.getAttribute("ftp_assigneetype").getText();
				var userOwner = Xrm.Page.getAttribute("ftp_userselected").getValue();
				var teamOwner = Xrm.Page.getAttribute("ftp_teamselected").getValue();
				var ownerType = "systemuser";
				if(aType == "User"){
					ownerType = "systemuser";
					if(userOwner == null){
						validOwner = false;
						
					}
				}
				if(aType == "Team"){
					ownerType = "team";
					if(teamOwner == null){
						validOwner = false;
						
					}
				}
				
                // Go through the object array, if the request text exceeds the title maxlength then set our flag which is subsequently picked up in an alert
                $(submit).each(function () {
                    var txt = "";
                    $(this).each(function () {
                        txt += " " + this.text;
                        if (txt.length > 450) {
                            strLengthExceeded = true;
                            return false;
                        }
                    });
                    if (strLengthExceeded) return false;
                });
				
				
				//debugger;
				
				//removed check for valid form -!addendumCtrl.addendumForm.$valid- need to add check statement
                if (!addendumCtrl.addendumForm.repeatForm.$valid || !validOwner || missingFields || !$scope.CheckMandatoryFields()) {
                    $("#validatemsg").text('Validation Failed: Please ensure all required fields are filled out');
                }
                else if (strLengthExceeded) {
                    $("#validatemsg").text('Validation Failed: Combo Request has too many reasons for request. Please assign fewer reasons or create a second Combo Request.');
					strLengthExceeded = false;
                }
				//added by kknab, per Rational Defect 392884
				else if (reasonCount < 1){
					$("#validatemsg").text('Validation Failed: Combo Request must have at least ONE reason(s) selected. Please select at least ' +(1-reasonCount)+ ' more reason(s).');
				}
				/*  
				//Requirement of having at least 2 reasons was changed to just only requiring one reason or more.
				//Rational Defect 392884
				//kknab 10/26/16
				else if (reasonCount < 2){
					$("#validatemsg").text('Validation Failed: Combo Request must have at least TWO reasons selected. Please select at least ' +(2-reasonCount)+ ' more reason(s).');
				}
				 */
				else if (reasonCount > 3){
					$("#validatemsg").text('Validation Failed: Combo Request can only have at most THREE reasons selected. Please select at least ' +(reasonCount-3)+ ' less reason(s).');
				}
                else { //good to go
					var oId = Xrm.Page.getAttribute("ftp_ownerid").getValue();
					var ownerId = oId.toUpperCase();
					Xrm.Page.getAttribute("ftp_name").setValue(title);
					
					//show loading gif
					document.getElementsByClassName("footer")[0].style.display = "none";
					document.getElementById("loadingGifDiv").style.display = "block";
					Xrm.Page.data.save().then(
						function(){
							//set up for SDK.REST.createRecord();
						    if (!!originatingEntityName && !!originatingEntityType && !!originatingEntityId) {
						        Xrm.Page.ui.clearFormNotification("MissingParentEntityMessage");
						        if (!!vetLookupValue) {
						            Xrm.Page.ui.clearFormNotification("MissingVeteranLookupValueMessage");
						            //Retrieve facility lookup value from veteran.
						            var selectString = "ftp_currentfacilityid,ftp_FacilityId";
						            SDK.REST.retrieveRecord(
                                        vetLookupValue[0].id,
                                        "Contact",
                                        selectString,
                                        null,
                                        function (retrievedContact) {
                                            if (!!retrievedContact.ftp_currentfacilityid || !!retrievedContact.ftp_FacilityId) {
                                                //7/12/18 removed fallback to home facility.
                                                var veteranFacilityEntityReference = !!retrievedContact.ftp_currentfacilityid ? retrievedContact.ftp_currentfacilityid : null;

                                                var ftp_teamselectedValue = Xrm.Page.getAttribute("ftp_teamselected").getValue();
                                                var ftp_userselectedValue = Xrm.Page.getAttribute("ftp_userselected").getValue();
                                                var subReasonValue = Xrm.Page.getAttribute("ftp_reasonforcontrolledsubstancerenewal").getValue();
												var cachedICN = Xrm.Page.getAttribute("ftp_cachedicnid");
												var cachedICNValue = null;
												if (cachedICN != null){
													cachedICNValue = cachedICN.getValue();
												}
                                                var newIncident = {
                                                    ftp_CallbackNumber: Xrm.Page.getAttribute("ftp_callback").getValue(),
                                                    CustomerId: {
                                                        Id: vetLookupValue[0].id,
                                                        LogicalName: vetLookupValue[0].entityType,
                                                        Name: vetLookupValue[0].name
                                                    },
                                                    ftp_ReasonforRequest: {
                                                        Id: multipleRfrId,
                                                        LogicalName: "ftp_reasonforrequest",
                                                        Name: "Multiple Reasons for Request"
                                                    },
                                                    ftp_SubReasonId: !!subReasonValue ? {
                                                        Id: subReasonValue[0].id,
                                                        LogicalName: subReasonValue[0].entityType,
                                                        Name: subReasonValue[0].name
                                                    } : null,													
                                                    //OwnerId: {
                                                    //    Id: ownerId,
                                                    //    LogicalName: ownerType,
                                                    //    Name: Xrm.Page.getAttribute("ftp_owner").getValue()
                                                    //},
                                                    ftp_OtherReason: title,
                                                    Title: title,
                                                    Description: Xrm.Page.getAttribute("ftp_notes").getValue(),
                                                    ftp_assigneetype: {
                                                        Value: Xrm.Page.getAttribute("ftp_assigneetype").getValue()
                                                    },
                                                    ftp_teamselected: !!ftp_teamselectedValue ? {
                                                        Id: ftp_teamselectedValue[0].id,
                                                        LogicalName: ftp_teamselectedValue[0].entityType,
                                                        Name: ftp_teamselectedValue[0].name
                                                    } : null,
                                                    ftp_userselected: !!ftp_userselectedValue ? {
                                                        Id: ftp_userselectedValue[0].id,
                                                        LogicalName: ftp_userselectedValue[0].entityType,
                                                        Name: ftp_userselectedValue[0].name
                                                    } : null,
                                                    ftp_CachedICNId: !!cachedICNValue ? {
                                                        Id: cachedICNValue[0].id,
                                                        LogicalName: cachedICNValue[0].entityType,
                                                        Name: cachedICNValue[0].name
                                                    } : null													
                                                };
                                                if (!!veteranFacilityEntityReference) {
                                                    newIncident.ftp_facility = veteranFacilityEntityReference;
                                                }

                                                //fill "Latest Interaction" or "Parent Case" lookup field, depending on which button was clicked to bring us to this page
                                                if (originatingEntityType.toLowerCase() == "incident") {
                                                    newIncident.ParentCaseId = {
                                                        Id: originatingEntityId,
                                                        LogicalName: originatingEntityType,
                                                        Name: originatingEntityName
                                                    };

                                                    if (!!requestLinkedInteractionId) {
                                                        newIncident.tri_ftp_interaction_incidentId = {
                                                            Id: requestLinkedInteractionId,
                                                            LogicalName: "ftp_interaction"
                                                        };
                                                    }
                                                }
                                                else if (originatingEntityType.toLowerCase() == "ftp_interaction") {
                                                    newIncident.tri_ftp_interaction_incidentId = {
                                                        Id: originatingEntityId,
                                                        LogicalName: originatingEntityType,
                                                        Name: originatingEntityName
                                                    };
                                                }

                                                SDK.REST.createRecord(
                                                    newIncident,
                                                    "Incident",
                                                    function (createdIncident) {
														//fire the assign step even if a new owner is not selected.
														SDK.SOAP.assign(
															ownerId,
															ownerType,
															createdIncident.IncidentId,
															"incident",
															function () {
																Xrm.Page.getAttribute("ftp_successfulcreationofrequest").setValue(true);
																Xrm.Page.data.save().then(
																	function(){
																		//open the createdIncident. It will be routed to the Shared New Request tab via USD window nav rule
																		var windowOptions = { openInNewWindow: true };
																		Xrm.Utility.openEntityForm("incident", createdIncident.IncidentId, null, windowOptions);

																		document.getElementsByClassName("footer")[0].style.display = "block";
																		document.getElementById("loadingGifDiv").style.display = "none";
																	},
																	function(e){}
																);
															},
															function (error) {
																alert("Error assigning newly created request to the " + (ownerType == "systemuser" ? "user" : "team") + " that you specified\n\n" + error.message);
																document.getElementsByClassName("footer")[0].style.display = "block";
																document.getElementById("loadingGifDiv").style.display = "none";
															}
														);
                                                    },
                                                    function (error) {
                                                        var errorText = "There was an error creating your combo request:\n\n" + error.message;
                                                        alert(errorText);

                                                        document.getElementsByClassName("footer")[0].style.display = "block";
                                                        document.getElementById("loadingGifDiv").style.display = "none";
                                                    }
                                                );
                                            }
                                            else {
                                                var errorText = "Cannot create combo request! The veteran for this request does not have a current facility or home facility.\n\n";
                                                alert(errorText);
                                                document.getElementsByClassName("footer")[0].style.display = "block";
                                                document.getElementById("loadingGifDiv").style.display = "none";
                                            }
                                        },
                                        function (error) {
                                            var errorText = "There was an error retrieving the veteran before creating your combo request:\n\n" + error.message;
                                            alert(errorText);
                                            document.getElementsByClassName("footer")[0].style.display = "block";
                                            document.getElementById("loadingGifDiv").style.display = "none";
                                        }
                                    );
						        }
						        else {
						            var msg = "Could not create your combo request because don't have a Veteran to link it to.";
						            Xrm.Page.ui.setFormNotification(msg, "ERROR", "MissingVeteranLookupValueMessage");
						            document.getElementsByClassName("footer")[0].style.display = "block";
						            document.getElementById("loadingGifDiv").style.display = "none";
						        }
							}
							else{
								var msg = "Could not create your combo request because don't have a Request or Interaction to link it to.";
								msg += "\noriginatingEntityName: " + originatingEntityName;
								msg += "\noriginatingEntityType: " + originatingEntityType;
								msg += "\noriginatingEntityId: " + originatingEntityId;
								Xrm.Page.ui.setFormNotification(msg, "ERROR", "MissingParentEntityMessage");
								document.getElementsByClassName("footer")[0].style.display = "block";
								document.getElementById("loadingGifDiv").style.display = "none";
							}
						},
						function (error){
							alert("Error saving record: " + error.message);
						}
					);
				}
            };
			
            addendumCtrl.columns = [];
            addendumCtrl.columnCount = 3;
            addendumCtrl.colWidthPercent = Math.floor(1 / addendumCtrl.columnCount * 100);
            var itemsPerColumn = Math.ceil(addendumCtrl.reasons.length / addendumCtrl.columnCount);
            height += (itemsPerColumn - 8) * 30;
            for (var i = 0; i < addendumCtrl.reasons.length; i += itemsPerColumn) {
                var col = { start: i, end: Math.min(i + itemsPerColumn, addendumCtrl.reasons.length) };
                addendumCtrl.columns.push(col);
            }
            if (Xrm.Page.ui.getFormType() == 3 || Xrm.Page.ui.getFormType() == 4) {
                $(".footer").children().prop('disabled', true);
            }
        }
    ])
    .filter('slice', function () {
        return function (arr, start, end) {
            return arr.slice(start, end);
        };
    });
})();