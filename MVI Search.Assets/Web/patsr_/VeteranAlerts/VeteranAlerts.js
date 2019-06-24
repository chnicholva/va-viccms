if (typeof VetAlerts === 'undefined') { VetAlerts = { __namespace: true }; }

var webAPIPath = "/api/data/v9.0";
var clientUrl = "";

VetAlerts.request = function (action, uri, data, addHeader) {
    if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) { // Expected action verbs.
        throw new Error("Persona.request: action parameter must be one of the following: " +
            "POST, PATCH, PUT, GET, or DELETE.");
    }
    if (!typeof uri === "string") {
        throw new Error("VetAlerts.request: uri parameter must be a string.");
    }
    if ((RegExp(action, "g").test("POST PATCH PUT")) && (!data)) {
        throw new Error("VetAlerts.request: data parameter must not be null for operations that create or modify data.");
    }
    if (addHeader) {
        if (typeof addHeader.header != "string" || typeof addHeader.value != "string") {
            throw new Error("VetAlerts.request: addHeader parameter must have header and value properties that are strings.");
        }
    }

    // Construct a fully qualified URI if a relative URI is passed in.
    if (uri.charAt(0) === "/") {
        uri = clientUrl + webAPIPath + uri;
    }

    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(action, encodeURI(uri), true);
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        if (addHeader) {
            request.setRequestHeader(addHeader.header, addHeader.value);
        }
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                request.onreadystatechange = null;
                switch (this.status) {
                    case 200: // Success with content returned in response body.
                    case 204: // Success with no content returned in response body.
                    case 304: // Success with Not Modified
                        resolve(this);
                        break;
                    default: // All other statuses are error cases.
                        var error;
                        try {
                            error = JSON.parse(request.response).error;
                        } catch (e) {
                            error = new Error("Unexpected Error: " + this.status);
                        }
                        reject(error);
                        break;
                }
            }
        };
        request.send(JSON.stringify(data));
    });
};
function isAnonymous() {
	var custAttr = Xrm.Page.getAttribute('customerid');
    if (custAttr && custAttr.getValue()) {
        var name = custAttr.getValue()[0].name;
        var isAnon = name && name.match(/anonymous/gmi);
		return !(isAnon === null);
	}
	return false;
}
VetAlerts.execute = function (context) {
	var formContext = context.getFormContext();
	var entity = formContext.data.entity.getEntityName();
	if(entity == "incident" && isAnonymous()) {
		return;
	}
	VetAlerts.getFlags(formContext);
	if(entity == "contact") {
		if(formContext.getAttribute("veo_sensitiveveteran").getValue()) {
			VetAlerts.whoAmI()
			.then(function (userId) {
				//	check last access time (last 4 hours)
				var entityId = formContext.data.entity.getId();
				Xrm.WebApi.retrieveMultipleRecords("patsr_recordaccess","?$filter=patsr_veteran/contactid eq "+entityId+" and _patsr_accessinguser_value eq "+userId+" and Microsoft.Dynamics.CRM.LastXHours(PropertyName='createdon',PropertyValue='4')").then(
					function success(result) {
						console.log(result);
						if(result.entities && result.entities.length >0) {
							VetAlerts.ToggleVisibility(true, formContext);
						}
						else {
							VetAlerts.Sensitive(formContext)							
						}
					},
					function (error) {
					}
				);
			});
		}
		else {
			VetAlerts.ToggleVisibility(true, formContext);
		}
	}
	if(entity == "patsr_request") {
		//debugger;
		var custAttr = Xrm.Page.getAttribute('patsr_veteran');
		if (custAttr && custAttr.getValue() && custAttr.getValue()[0].entityType === 'contact') {
			Xrm.Utility.showProgressIndicator("Checking Sensitivity");
			Xrm.WebApi.retrieveRecord("contact", custAttr.getValue()[0].id, "?$select=contactid,veo_sensitiveveteran").then(
				function success(result) {
					Xrm.Utility.closeProgressIndicator();
					if (result.veo_sensitiveveteran) {
						var userId = Xrm.Page.context.getUserId();
						var contactId = custAttr.getValue()[0].id;
						Xrm.WebApi.retrieveMultipleRecords("patsr_recordaccess","?$filter=patsr_veteran/contactid eq "+contactId+" and _patsr_accessinguser_value eq "+userId+" and Microsoft.Dynamics.CRM.LastXHours(PropertyName='createdon',PropertyValue='4')").then(
						function success(result) {
							console.log(result);
							if(result.entities && result.entities.length >0) {
								//formToggleVisibility(true, context);
							}
							else {
								Xrm.Page.ui.setFormNotification('Sensitive Veteran', 'INFORMATION', '3');  
								var confirmStrings = {
									text: "This record is protected by the Privacy Act of 1974 and the Health Insurance Portability and Accountability Act of 1996. If you elect to proceed, you will be required to prove you have a need to know. Accessing this patient is tracked, and your station Security Officer will contact you for your justification.",
									title: "Sensitive Record Alert",
									confirmButtonLabel: "Acknowledge and proceed",
									cancelButtonLabel: "Cancel and go back"
								};
								var confirmOptions = { height: 200, width: 450 };
								Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions)
									.then(function (success) {
										if (success.confirmed) {
											var userId = Xrm.Page.context.getUserId().replace("{","").replace("}","");
											var reqTitle = Xrm.Page.getAttribute('subject').getValue();
											var contactId = custAttr.getValue()[0].id;
											var data = {
												"patsr_name": "Sensitive Record Accessed",
												"patsr_accessed" : true,
												"patsr_issensitiveveteran" : true,
												"patsr_recordaccessed" : (reqTitle == null ? "New Request" : "Request " + reqTitle),	// case #
												"patsr_AccessingUser@odata.bind": "/systemusers("+userId+")",
												"patsr_veteran@odata.bind": "/contacts(" + contactId.replace(/[{}]/gi, "") + ")"
											};
											Xrm.WebApi.createRecord("patsr_recordaccess", data)
												.then(function success(result) {

												},
													function (error) {
														console.log(error.message);
													});
											//formToggleVisibility(true, context);                                
										}
										else
											window.history.back();
									});
								
							}
						},
						function (error) {
						}
					);
						
						
					}
				},
				function (error) {
				}
			);
		}
	}
}

VetAlerts.getFlags = function (formContext) {
    return new Promise(function (resolve, reject) {
        VetAlerts.getNationalId(formContext, function(nationalid) {
			if(nationalid != null) {
				var parameters = { "Request": nationalid };
				VetAlerts.request("POST", "/patsr_PatientFlags", parameters)
				.then(function (request) {
					VetAlerts.onFlagsResponse(JSON.parse(request.response), formContext);
				})
				.catch(function (err) {
					reject("Error in Action call: " + err.message);
				})
			}
		});
    })
}

VetAlerts.getNationalId = function(formContext, callback) {
	var entity = formContext.data.entity.getEntityName();
	if(entity == "patsr_request") {
		callback(null);
	}
	if(entity == "contact") {
		var icn = formContext.getAttribute("patsr_icn").getValue();
		if(icn != null && icn != "") {
			callback(icn.substring(0,10));
		}
	}
	if(entity == "incident") {
		//	get customer
		var c = Xrm.Page.getAttribute("customerid").getValue();
		if(c != null && c.length>0) {
			//	get edipi
			Xrm.WebApi.retrieveRecord("contact", c[0].id, "?$select=contactid,patsr_icn").then(
				function success(result) {
					console.log(result);
					var icn = result.patsr_icn;
					if(icn != null && icn != "") {
						callback(icn.substring(0,10));
					}
				},
				function (error) {
				}
			);
		}
	}
}

VetAlerts.onFlagsResponse = function (response, formContext) {
   return new Promise(function (resolve, reject) {
        var data = JSON.parse(response.Response);
		console.log(data);
		if (data.ExceptionOccurred != true) {
			for (var i in data.Data) {
				
                formContext.ui.setFormNotification("Alert: " + data.Data[i].Name, "WARN", "Alert" + i);
			}
        }
        else {
            formContext.ui.setFormNotification("Error: " + response.ExceptionMessage, "WARN", "AlertsError");
        }
    });
}

VetAlerts.Sensitive = function (formContext) {
    return new Promise(function (resolve, reject) {
		//	check record access entity 
        var confirmStrings = {
            text: "This record is protected by the Privacy Act of 1974 and the Health Insurance Portability and Accountability Act of 1996. If you elect to proceed, you will be required to prove you have a need to know. Accessing this patient is tracked, and your station Security Officer will contact you for your justification.",
            title: "Sensitive Record Alert",
            confirmButtonLabel: "Acknowledge and proceed",
            cancelButtonLabel: "Cancel and go back"
        };
        var confirmOptions = { height: 200, width: 450 };
        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions)
            .then(function (success) {
                if (success.confirmed) {
                    VetAlerts.RecordAccess(formContext);
                }
                else
                    window.history.back();
            });
    })
}

VetAlerts.RecordAccess = function (formContext) {
    VetAlerts.whoAmI()
    .then(function (userId) {
        var contactId = formContext.data.entity.getId();
        var data = {
            "patsr_name": "Sensitive Record Accessed",
			"patsr_accessed" : true,
			"patsr_issensitiveveteran" : true,
			"patsr_recordaccessed" : "Veteran",
            "patsr_AccessingUser@odata.bind": "/systemusers("+userId+")",
            "patsr_veteran@odata.bind": "/contacts("+contactId.replace(/[{}]/gi,"")+")"
        };
        Xrm.WebApi.createRecord("patsr_recordaccess", data)
            .then(function success(result) {
                VetAlerts.ToggleVisibility(true, formContext);
            },
            function (error) {
                console.log(error.message);
            });
    })
}

VetAlerts.whoAmI = function () {
    return new Promise(function (resolve, reject) {
        //Use WhoAmI Function
        VetAlerts.request("GET", "/WhoAmI")
        .then(function (request) {
            resolve(JSON.parse(request.response).UserId);
        })
        .catch(function (err) {
            reject("Error in WhoAmI function: " + err.message);
        });
    })
}

VetAlerts.ToggleVisibility = function (state, formContext) {
    var tabNames = ["summary_tab", "eligibility_tab", "communication_tab", "history_tab"];
	for(var i =0; i<tabNames.length; i++) {
		var tab = formContext.ui.tabs.get(tabNames[i]);
		if(tab != null) {
			tab.setVisible(state);
		}
	}
    //formContext.ui.tabs.get("provider_tab").setVisible(state);
    //formContext.ui.tabs.get("tab_5").setVisible(state);	//	PATS-R Cases
    //formContext.ui.tabs.get("tab_medcharts").setVisible(state); //	Medical Charts
    //formContext.ui.tabs.get("summary_tab").setDisplayState("expanded");
}

