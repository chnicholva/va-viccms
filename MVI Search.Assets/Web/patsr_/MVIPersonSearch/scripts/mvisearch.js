ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};

function SearchModel() {
    var self = this;
    // variables/members
    self.inputVetNumber = ko.observable("");
    self.inputFirstName = ko.observable("");
    self.inputLastName = ko.observable("");
    self.inputMonth = ko.observable("");
    self.inputDay = ko.observable("");
    self.inputYear = ko.observable("");
    self.inputEDIPI = ko.observable("");

    self.inputMiddle = ko.observable("");
    self.inputGender = ko.observable("");
    self.inputMothersMaiden = ko.observable("");
    self.inputPhoneNo = ko.observable("");
    self.inputBirthState = ko.observable("");
    self.inputBirthCity = ko.observable("");
    self.inputHomeStreet = ko.observable("");
    self.inputHomeCity = ko.observable("");
    self.inputHomeState = ko.observable("");
    self.inputHomeZip = ko.observable("");

	self.onCaseForm = ko.computed(function() {
		//	check if we're loaded in case form
		if(window.parent.Xrm && window.parent.Xrm.Page && window.parent.Xrm.Page.data) {
			var e = window.parent.Xrm.Page.data.entity.getEntityName();
			//console.log(e);
			return e == "incident";
		}
		return false;		
	}, self);
    self.noResults = ko.observable(false);
    self.callerFirstName = ko.observable("");
    self.callerLastName = ko.observable("");
    self.callerTelephone = ko.observable("");
    self.selectedVeteran = ko.observable(null);
	self.errorEDIPI = ko.observable(false);
	self.errorLastName = ko.observable(false);
	self.errorFirstName = ko.observable(false);
	self.errorFields = ko.observable(false);
    self.validationErrors = ko.computed(function() {
		if (self.errorEDIPI() || self.errorLastName() || self.errorFirstName() || self.errorFields()) {
			return true;
		}
		else {
			return false;
		}
	}, self);
    self.searchError = ko.observable(null);
    self.searching = ko.observable(false);
	self.facilitiesLoaded = ko.observable(false);
    self.searchResults = ko.observableArray([]);
    self.searchOptionsVisible = ko.observable(false);
    self.createCaseVisible = ko.observable(false);
    self.searchOptions = ko.computed(function () {
        return self.searchOptionsVisible() ? "- Hide Additional Search Criteria" : "+ Show Additional Search Criteria";
    }, self);

    //  methods/functions
    self.callAction = function (action, data, callback, errHandler) {
        var serverURL = Xrm.Page.context.getClientUrl();
        var req = new XMLHttpRequest();
        // specify name of the entity, record id and name of the action in the Wen API Url
        req.open("POST", serverURL + "/api/data/v9.0/" + action, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200 && this.response != null) {
                    var data = JSON.parse(this.response);
                    callback(data);
                }
                else {
                    if (this.response != null && this.response != "") {
                        var error = JSON.parse(this.response).error;
                        errHandler(error.message);
                    }
                }
            }
        };
        // send the request with the data for the input parameter
        req.send(window.JSON.stringify(data));
    }
    self.clearField = function () {
        console.log('clear');
    }
    self.createInteraction = function(facility) {
        try {
			//	change these back to properties for serialization
			var ssn = self.selectedVeteran().VetNumber();
			var edipi = self.selectedVeteran().EDIPI();
			self.selectedVeteran().VetNumber = ssn;
			self.selectedVeteran().EDIPI = edipi;
			self.selectedVeteran().VeteranSensitivityLevel = self.selectedVeteran().isSensitive;

            self.callAction('patsr_MVIFindCreateContact',
                {
                    "Request": window.JSON.stringify({
                    "PersonJson": JSON.stringify(self.selectedVeteran())
                    })
                },
                function (data) {
                    //console.log(data);
                    var contact = JSON.parse(data.Response);
                    if (contact.IsSensitive) {
						var userId = Xrm.Page.context.getUserId();
						var contactId = contact.Id;
						Xrm.WebApi.retrieveMultipleRecords("patsr_recordaccess","?$filter=patsr_veteran/contactid eq "+contactId+" and _patsr_accessinguser_value eq "+userId+" and Microsoft.Dynamics.CRM.LastXHours(PropertyName='createdon',PropertyValue='4')").then(
						function success(result) {
							console.log(result);
							if(result.entities && result.entities.length >0) {
								//	just open case form - deprecated 4/4 - open vet form instead							
								//self.openCaseForm(contact, facility);
								self.openVetForm(contact, facility);
							}
							else {
								//	display acknowledgment
								var confirmStrings = { text: "This record is protected by the Privacy Act of 1974 and the Health Insurance Portability and Accountability Act of 1996. If you elect to proceed, you will be required to prove you have a need to know. Accessing this patient is tracked, and your station Security Officer will contact you for your justification.", title: "Sensitive Record Alert", cancelButtonLabel: "Cancel and go back", confirmButtonLabel: "Acknowledge and proceed" };
								var confirmOptions = { height: 200, width: 450 };
								Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
									function (success) {
										if (success.confirmed) {
											//	record access
											var data = {
												"patsr_name": "Sensitive Record Accessed",
												"patsr_accessed" : true,
												"patsr_issensitiveveteran" : true,
												"patsr_recordaccessed" : "New Case",
												"patsr_AccessingUser@odata.bind": "/systemusers("+userId.replace(/[{}]/gi,"")+")",
												"patsr_veteran@odata.bind": "/contacts(" + contactId.replace(/[{}]/gi, "") + ")"
											};
											                              
											Xrm.WebApi.createRecord("patsr_recordaccess", data)
											.then(function success(result) {
												//	just open case form - deprecated 4/4 - open vet form instead							
												//self.openCaseForm(contact, facility);
												self.openVetForm(contact, facility);
											},
											function (error) {
												console.log(error.message);
											});

										}
									});
							}
						});
                       
                    }
                    else {
						//	just open case form - deprecated 4/4 - open vet form instead							
						//self.openCaseForm(contact, facility);
						self.openVetForm(contact, facility);
                    }
                    self.searching(false);
                },
                function (err) {
                    //console.log(err);
                    self.searching(false);
                    if (err.message === undefined || err.message == '') {
                        self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
                    }
                    else {
                        self.searchError(err.message);
                    }
                    self.toggleCreateCase();
                });
        }
        catch (e) {
            self.searching(false);
            if (e.message === undefined || e.message == '') {
                self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
            }
            else {
                self.searchError(e.message);
            }
            self.toggleCreateCase();
        }
    }
    self.disableButtons = function () {
        $("#SearchButton").attr('disabled', true);
        $("#ClearButton").attr('disabled', true);
    }
    self.enableButtons = function () {
        $("#SearchButton").attr('disabled', false);
        $("#ClearButton").attr('disabled', false);
    }
    self.hideAll = function () {
        $("#searchByTraits").show();
        $("#CallerInfo").hide();
        $("#CaseManagement").hide();
    }
    self.hideAll();
    self.idProofFailed = function () {
        //  do nothing?
        console.log('ID Proof Failed click');
    }
    self.loadFacilities = function (vet) {
		//	do SelectedPersonSearch to load facilities
		var qry = {
			type: "SelectedPersonSearch",
			criteria: []
		};
		qry.criteria.push({ "attribute" : "PatientSearchIdentifier", "value" : vet.ICN });
		self.callAction('patsr_MVISearch',
			{
				"Request": window.JSON.stringify({
					"QueryJson": JSON.stringify(qry)
				})
			},
			function (data) {
				//console.log(data);
				var response = JSON.parse(data.Response); 
				if(response.ExceptionOccured == true && response.ExceptionMessage !== '') {
					self.searchError(response.ExceptionMessage);
				}
				else {
					if (response.CorrespondingIdList.length > 0) {
						console.log(response.CorrespondingIdList);

						//	parse facility data for edipi, etc.
						var displayFacilities = [];
						ko.utils.arrayForEach(response.CorrespondingIdList, function (f) {
							if(f.AssigningFacility == "200DOD" && f.AssigningAuthority == "USDOD") {
								vet.EDIPI(f.PatientIdentifier);
							}
							if(f.AssigningFacility == "200BRLS" && f.AssigningAuthority == "USVBA") {
								vet.VetNumber(f.PatientIdentifier);
							}
							//	don't display "1" and "2" facilities
							if(f.AssigningFacility.substring(0,1) != "1" && f.AssigningFacility.substring(0,1) != "2") {
								displayFacilities.push(f);
							}
						});
						vet.Facilities = displayFacilities;
						self.facilitiesLoaded(true);
					}
				};
			},
			function (err) {
				console.log(err);
			});
		
        // if (vet.Facilities === undefined || vet.Facilities == null || vet.Facilities.length == 0) {
			// //	no facilities returned?
        // }
		// else {
			// if(vet.Facilities.length >0) {
				// //	show vet
				// vet.selected(true);
				// self.selectedVeteran(vet);
			// }
		// }
    }
    self.resetForm = function () {
        self.inputVetNumber("");
        self.inputFirstName("");
        self.inputLastName("");
        self.inputMonth("");
        self.inputDay("");
        self.inputYear("");
        self.inputEDIPI("");
        self.inputMiddle("");
        self.inputGender("");
        self.inputMothersMaiden("");
        self.inputPhoneNo("");
        self.inputBirthState("");
        self.inputBirthCity("");
        self.inputHomeStreet("");
        self.inputHomeCity("");
        self.inputHomeState("");
        self.inputHomeZip("");
        self.searchError(null);
		self.errorEDIPI(false);
		self.errorFields(false);
		self.errorLastName(false);
		self.errorFirstName(false);
        self.searchResults.removeAll();
        self.selectedVeteran(null);
        self.noResults(false);
        self.hideAll();
        self.enableButtons();
		self.facilitiesLoaded(false);
    }
	self.resetTraits = function() {
		self.resetForm();
		//$("#VetTextBox").focus();
	}
	self.resetEdipi = function() {
		self.resetForm();
		//$("#EdipiTextBox").focus();
	}
    self.returnToSearch = function () {
        self.selectedVeteran(null);
        self.callerFirstName("");
        self.callerLastName("");
        self.callerTelephone("");
    }
    self.create = function (type) {
		console.log('create');
        self.noResults(false);
		self.errorEDIPI(false);
		self.errorFields(false);
		self.errorLastName(false);
		self.errorFirstName(false);
		self.searchResults.removeAll();

        if (self.validateSearch(type) == true) {

			//	4/4 - create interaction deprecated - open new vet form instead
            // var vet =
            // {
                // "VetNumber": self.inputVetNumber(),
                // "FirstName": self.inputFirstName(),
                // "LastName": self.inputLastName()
            // }
            //self.selectedVeteran(vet);
            //self.createInteraction();
			var entityFormOptions = {};
			entityFormOptions["entityName"] = "contact";

			// Set default values for the Contact form
			var formParameters = {};
			formParameters["governmentid"] = self.inputVetNumber();
			formParameters["firstname"] = self.inputFirstName();
			formParameters["lastname"] = self.inputLastName();

			// Open the form.
			Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
				function (success) {
					console.log(success);
				},
				function (error) {
					console.log(error);
				});
        }
    }
    self.search = function (type) {
        self.noResults(false);
		self.errorEDIPI(false);
		self.errorFields(false);
		self.errorLastName(false);
		self.errorFirstName(false);
		self.searchError(null);
        self.searchResults.removeAll();
		self.facilitiesLoaded(false);
        
        if (self.validateSearch(type) == true) {
            self.searching(true);
            var qry = {
                type: "SearchByIdentifier",
                criteria: []
            };
            if (type == 'EDIPI') {
				qry.type = "SearchEdipi";
				qry.criteria.push({ "attribute" : "edipi", "value" : self.inputEDIPI() });
            }
            if (type == null) {
                if (self.inputVetNumber() != "") {
					qry.criteria.push({ "attribute": "vetNumber", "value": self.inputVetNumber() });
				}
                if (self.inputFirstName() != "") {
                    qry.criteria.push({ "attribute" : "firstname", "value" : self.inputFirstName() });
                }
				if(self.inputYear() != "" && self.inputYear() != "" && self.inputYear() != "") {
					var stringDOB = "" + self.inputYear() + self.inputMonth() + self.inputDay();
					qry.criteria.push({ "attribute" : "dobstring", "value" : stringDOB } );
				}
				if(self.inputLastName() != "") {
					qry.criteria.push({ "attribute": "lastname", "value" : self.inputLastName() });
				}
				if(self.inputMiddle() != "") {
					qry.criteria.push({ "attribute": "middlename", "value" : self.inputMiddle() });
				}
				if(self.inputGender() != "") {
					qry.criteria.push({ "attribute": "gender", "value" : self.inputGender() });
				}
				if(self.inputMothersMaiden() != "") {
					qry.criteria.push({ "attribute": "maidenname", "value" : self.inputMothersMaiden() });
				}
				if(self.inputPhoneNo() != "") {
					qry.criteria.push({ "attribute": "phone", "value": self.inputPhoneNo() });
				}
				if(self.inputHomeStreet() != "") {
					qry.criteria.push({ "attribute": "homeStreet", "value": self.inputHomeStreet() });
				}
				if(self.inputHomeCity() != "") {
					qry.criteria.push({ "attribute": "homeCity", "value": self.inputHomeCity() });
				}
				if(self.inputHomeState() != "") {
					qry.criteria.push({ "attribute": "homeState", "value": self.inputHomeState() });
				}
				if(self.inputHomeZip() != "") {
					qry.criteria.push({ "attribute": "homeZip", "value": self.inputHomeZip() });
				}
				if(self.inputBirthCity() != "") {
					qry.criteria.push({ "attribute": "birthCity", "value": self.inputBirthCity() });
				}
				if(self.inputBirthState() != "") {
					qry.criteria.push({ "attribute": "birthState", "value": self.inputBirthState() });
				}
            }
            //console.log(query);
            try {
                
                self.callAction('patsr_MVISearch',
                    {
                        "Request": window.JSON.stringify({
                            "QueryJson": JSON.stringify(qry)
                        })
                    },
                    function (data) {
                        //console.log(data);
                        var response = JSON.parse(data.Response); 
                        if(response.ExceptionOccured == true && response.ExceptionMessage !== '') {
							self.searching(false);
							self.searchError(response.ExceptionMessage);
						}
						else if (response.Results.length == 0) {
                            //  no records returned
                            self.noResults(true);
                            self.toggleCreateCase();
                        }
                        else {
                            if (response.Results.length > 0) {
								console.log(response.Results);
                                ko.utils.arrayForEach(response.Results, function (d) {
                                    d.selected = ko.observable(false);
									d.EDIPI = ko.observable();
									d.VetNumber = ko.observable();
									var sensLvl = d.VeteranSensitivityLevel.split(":");
									if(sensLvl.length>0 && sensLvl[0] == "true") {
										d.isSensitive = 1;
									}
									else {
										d.isSensitive = 0;
									}
									
                                    self.searchResults.push(d);
                                });
                            }
                        };
                        self.searching(false);
						//	load our facilities
						ko.utils.arrayForEach(self.searchResults(), function (v) {
							self.loadFacilities(v);
						});
                    },
                    function (err) {
                        //console.log(err);
                        self.searching(false);
                        if (err.message === undefined || err.message == '') {
                            self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
                        }
                        else {
                            self.searchError(err.message);
                        }
                        self.toggleCreateCase();
                    });
            }
            catch (e) {
                self.searching(false);
                if (e.message === undefined || e.message == '') {
                    self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
                }
                else {
                    self.searchError(e.message);
                }
                self.toggleCreateCase();
            }
        }
    }
    self.selectVeteran = function () {
        /*
        if (self.selectedVeteran() != null) {
            self.selectedVeteran().selected(false);
        }*/
        //	load facilities?
		if(self.onCaseForm() && self.facilitiesLoaded()) {
			self.updateCase(this);
		}
		else {
			//self.loadFacilities(this);
			// while(self.facilitiesLoaded() == false) {
				// //	wait until loading is done?
			// }
			if(self.facilitiesLoaded()) {
				self.selectedVeteran(this);
				this.selected(true);
			}
		}
		return false;
    }
	self.updateCase = function(vet) {
		//	check vet is in CRM, then update case with the vet
		//console.log('Update Case');
		//console.log(vet);
		var ssn = vet.VetNumber();
		var edipi = vet.EDIPI();
		vet.VetNumber = ssn;
		vet.EDIPI = edipi;
		vet.VeteranSensitivityLevel = vet.isSensitive;
		try {
            self.callAction('patsr_MVIFindCreateContact',
                {
                    "Request": window.JSON.stringify({
                    "PersonJson": JSON.stringify(vet)
                    })
                },
                function (data) {
                    //console.log(data);
                    var contact = JSON.parse(data.Response);
                    var contactId = contact.Id;
					if (contact.IsSensitive) {
						var userId = Xrm.Page.context.getUserId();
						
						Xrm.WebApi.retrieveMultipleRecords("patsr_recordaccess","?$filter=patsr_veteran/contactid eq "+contactId+" and _patsr_accessinguser_value eq "+userId+" and Microsoft.Dynamics.CRM.LastXHours(PropertyName='createdon',PropertyValue='4')").then(
						function success(result) {
							//console.log(result);
							if(result.entities && result.entities.length >0) {
								//	update case form field
								if(window.parent.Xrm) {
									var oldVet = Xrm.Page.getAttribute("customerid").getValue();
									//console.log(oldVet);
									
									window.parent.Xrm.Page.getAttribute("customerid").setValue([{id: contactId, name: contact.FullName, entityType: 'contact'}]);
									window.parent.Xrm.Page.getAttribute("customerid").fireOnChange();
									
									//	alert user
									if(oldVet.length >0) {
										var msg = oldVet[0].name + " changed to " + contact.FullName;
										var alertStrings = { confirmButtonLabel: "OK", text: msg };
										var alertOptions = { height: 120, width: 260 };
										Xrm.Navigation.openAlertDialog(alertStrings,alertOptions).then(function(result) {
											//	save record
											window.parent.Xrm.Page.ui.tabs.get("tab_10").setFocus();
											window.parent.Xrm.Page.data.refresh(true);
										},
										function (error) {
											console.log(error.message);
										});
										
									}
								}
							}
							else {
								//	display acknowledgment
								var confirmStrings = { text: "This record is protected by the Privacy Act of 1974 and the Health Insurance Portability and Accountability Act of 1996. If you elect to proceed, you will be required to prove you have a need to know. Accessing this patient is tracked, and your station Security Officer will contact you for your justification.", title: "Sensitive Record Alert", cancelButtonLabel: "Cancel and go back", confirmButtonLabel: "Acknowledge and proceed" };
								var confirmOptions = { height: 200, width: 450 };
								Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
									function (success) {
										if (success.confirmed) {
											//	record access
											var caseTitle = window.parent.Xrm.Page.getAttribute("title").getValue();
											 
											var data = {
												"patsr_name": "Sensitive Record Accessed",
												"patsr_accessed" : true,
												"patsr_issensitiveveteran" : true,
												"patsr_recordaccessed" : "Case " + (caseTitle == null ? "New Case" : caseTitle),	//	existing case number
												"patsr_AccessingUser@odata.bind": "/systemusers("+userId.replace(/[{}]/gi,"")+")",
												"patsr_veteran@odata.bind": "/contacts(" + contactId.replace(/[{}]/gi, "") + ")"
											};
											                              
											Xrm.WebApi.createRecord("patsr_recordaccess", data)
											.then(function success(result) {
												if(window.parent.Xrm) {
													var oldVet = Xrm.Page.getAttribute("customerid").getValue();
													//console.log(oldVet);
													
													window.parent.Xrm.Page.getAttribute("customerid").setValue([{id: contactId, name: contact.FullName, entityType: 'contact'}]);
													window.parent.Xrm.Page.getAttribute("customerid").fireOnChange();
													//	alert user
													if(oldVet.length >0) {
														var msg = oldVet[0].name + " changed to " + contact.FullName;
														var alertStrings = { confirmButtonLabel: "OK", text: msg };
														var alertOptions = { height: 120, width: 260 };
														Xrm.Navigation.openAlertDialog(alertStrings,alertOptions).then(function(result) {
															//	save record
															window.parent.Xrm.Page.ui.tabs.get("tab_10").setFocus();
															window.parent.Xrm.Page.data.refresh(true);
														},
														function (error) {
															console.log(error.message);
														});
														
													}
												}
											},
											function (error) {
												console.log(error.message);
											});
										}
									});	
								}
						});
                    }
                    else {
						//	update case form field
						if(window.parent.Xrm) {
							var oldVet = Xrm.Page.getAttribute("customerid").getValue();
							//console.log(oldVet);
							
							window.parent.Xrm.Page.getAttribute("customerid").setValue([{id: contactId, name: contact.FullName, entityType: 'contact'}]);
							window.parent.Xrm.Page.getAttribute("customerid").fireOnChange();
							//	alert user
							if(oldVet.length >0) {
								var msg = oldVet[0].name + " changed to " + contact.FullName;
								var alertStrings = { confirmButtonLabel: "OK", text: msg };
								var alertOptions = { height: 120, width: 260 };
								Xrm.Navigation.openAlertDialog(alertStrings,alertOptions).then(function(result) {
									//	save record
									window.parent.Xrm.Page.ui.tabs.get("tab_10").setFocus();
									window.parent.Xrm.Page.data.refresh(true);
								},
								function (error) {
									console.log(error.message);
								});
								
							}
						}                    
					}
                    self.searching(false);
                },
                function (err) {
                    //console.log(err);
                    self.searching(false);
                    if (err.message === undefined || err.message == '') {
                        self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
                    }
                    else {
                        self.searchError(err.message);
                    }
                });
        }
        catch (e) {
            self.searching(false);
            if (e.message === undefined || e.message == '') {
                self.searchError('An unexpected error ocurred while searching MVI for the Veteran specified. Please try again or click create case to continue');
            }
            else {
                self.searchError(e.message);
            }
        }
		
		
	}
    self.openCaseForm = function (contact, facility) {
        var entityFormOptions = {};
        entityFormOptions["entityName"] = "incident";

        // Set default values for the Contact form
        var formParameters = {};
        formParameters["customerid"] = contact.Id;
        formParameters["customeridtype"] = "contact";
        formParameters["customeridname"] = contact.FullName;
		if(facility != null) {
			formParameters["patsr_requestfacility"] = facility.Id;
			formParameters["patsr_requestfacilitytype"] = "patsr_facility";
			formParameters["patsr_requestfacilityname"] = facility.Name;
		}
        // Open the form.
        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error);
            });
    }
	self.openVetForm = function (contact, facility) {
		var entityFormOptions = {};
        entityFormOptions["entityId"] = contact.Id;
        entityFormOptions["entityName"] = "contact";
		
		var formParameters = {};
		if(facility != null) {
			formParameters["patsr_selectedfacilityid"] = facility.FacilityId;
			formParameters["patsr_selectedfacilitytype"] = "patsr_facility";
			formParameters["patsr_selectedfacilityname"] = facility.FacilityName;
		}
		
        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
            function (success) {
                console.log(success);
            },
            function (error) {
                console.log(error);
            });
	}
    self.toggleSearchOptions = function () {
        self.searchOptionsVisible(!self.searchOptionsVisible());
    }
    self.toggleCreateCase = function () {
        self.createCaseVisible(true);
    }
    self.validateSearch = function (type) {
        if (type == 'EDIPI') {
            if (self.inputEDIPI() == "") {
				self.errorEDIPI(true);
            }
        }
        else if (type == 'Create') {
            if (self.inputFirstName() == "") {
				self.errorFirstName(true);
            }
            if (self.inputLastName() == "") {
				self.errorLastName(true);
            }
        }
        else {
			var filledCount = 0;
			if (self.inputFirstName() != "") {
				filledCount++;
			}
			if (self.inputLastName() != "") {
				filledCount++;
			}
			if (self.inputMonth() != "" && self.inputDay() != "" && self.inputYear()!= "") {
				filledCount++;
			}
			if (self.inputEDIPI() != "") {
				filledCount++;
			}
			if (self.inputMiddle() != "") {
				filledCount++;
			}
			if (self.inputGender() != "") {
				filledCount++;
			}
			if (self.inputMothersMaiden() != "") {
				filledCount++;
			}
			if (self.inputPhoneNo() != "") {
				filledCount++;
			}
			if (self.inputBirthState() != "") {
				filledCount++;
			}
			if (self.inputBirthCity() != "") {
				filledCount++;
			}
			if (self.inputHomeStreet() != "") {
				filledCount++;
			}
			if (self.inputHomeCity() != "") {
				filledCount++;
			}
			if (self.inputHomeState() != "") {
				filledCount++;
			}
			if (self.inputHomeZip() != "") {
				filledCount++;
			}
            var vetNumber = self.inputVetNumber();
            if ( (vetNumber == "" || vetNumber == " 9 digits, no dashes") && filledCount < 3) {
				self.errorFields(true);
            }
        }
		
        return !self.validationErrors();
    }
};