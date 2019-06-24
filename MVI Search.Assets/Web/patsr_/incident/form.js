function hideContactingEntities(context) {
    var formType = context.getFormContext().ui.getFormType();
    if (formType !== 1) {
        context.getFormContext().ui.tabs.get("tab_10").sections.get("tab_10_section_6").setVisible(false);
    }
}

function isCrisisCase(){
//patsr_crisiskeyword
//100000006
if (Xrm.Page.getAttribute("veo_contactmethod") != null){
    var MOCValue =  Xrm.Page.getAttribute("veo_contactmethod").getValue();
    if (MOCValue == 100000006){//VEFT
        if (Xrm.Page.getAttribute("patsr_crisiskeyword") != null){
            var crisisKeywords = Xrm.Page.getAttribute("patsr_crisiskeyword").getValue();
            if (crisisKeywords != null){ 
                var message = 'CRISIS ALERT: The feedback from this Veteran included crisis keywords: ' + crisisKeywords;
                Xrm.Page.ui.setFormNotification(message, '2');  
            }
        }
    }
}
}

function onLoadSetMOC(){
	var pickList= Xrm.Page.getControl("veo_contactmethod");
	pickList.removeOption(914980000); //Text
	pickList.removeOption(914980001); //Referral
	pickList.removeOption(914980002); //Media Clip
	pickList.removeOption(914980003); //MyVA311
}


function filterPA(){
debugger;
return;
var facility = Xrm.Page.getAttribute("patsr_requestfacility").getValue();

/*
    <filter type='and'>
      <condition attribute='patsr_facilitysiteid' operator='eq' uiname='629 - New Orleans' uitype='patsr_facility' value='{E6ECBA74-7B3F-E911-A964-001DD800BA25}' />
    </filter>
*/


var fetchXMLx = "<filter type='and'><condition attribute='patsr_facilitysiteid' operator='eq' uiname='629 - New Orleans' uitype='patsr_facility' value='{E6ECBA74-7B3F-E911-A964-001DD800BA25}' /></filter>";


      var fetchXML = "<link-entity name='systemuserroles' from='systemuserid' to='systemuserid' visible='false' intersect='true'>";
      fetchXML += "<link-entity name='role' from='roleid' to='roleid' alias='ac'>";
      fetchXML +=   "<filter type='and'>";
      fetchXML +=     "<filter type='or'>";
      fetchXML +=        "<condition attribute='name' operator='eq' value='PATS-R Patient Advocate' />";
      fetchXML +=        "<condition attribute='name' operator='eq' value='PATS-R Patient Advocate Supervisor' />";
      fetchXML +=     "</filter>";
      fetchXML +=   "</filter>";
      fetchXML += "</link-entity>";
      fetchXML += "</link-entity>";

    var pa = Xrm.Page.data._formContext._ui.controls._collection.patsr_patientadvocate;
    pa.addCustomFilter(fetchXML);
    pa.addCustomFilter(fetchXMLx);
}

function onLoadSetPA(){
    var user = Xrm.Page.context.getUserId();
    var name = Xrm.Page.context.getUserName();

    var lookupValue = new Array();
    lookupValue[0] = new Object();
    lookupValue[0].id = user;
    lookupValue[0].name = name;
    lookupValue[0].entityType = "systemuser";

    if (lookupValue[0].id != null){
		if (Xrm.Page.ui.getFormType() == 1){
           if (Xrm.Page.getAttribute("patsr_patientadvocate") == null){
              Xrm.Page.getAttribute("patsr_patientadvocate").setValue(lookupValue);
           }
		   else{
               if (Xrm.Page.getAttribute("patsr_patientadvocate").getValue() == null){
                   Xrm.Page.getAttribute("patsr_patientadvocate").setValue(lookupValue);            
				}
			}
		}
	}
}

function updatePhoneNumberFormat(execContext, patsr_callbacknumber,phoneLabel ) {
                debugger;
                var phoneCleaned;
                var phoneNumber = Xrm.Page.data.entity.attributes.get(patsr_callbacknumber);
                if (phoneNumber.getValue() != null) {
                                phoneCleaned = phoneNumber.getValue().replace(/[^0-9]/g, "");
                                if (phoneCleaned.length != 10) {
                                                alert(phoneLabel + " must contain 10 numbers.");
                                                Xrm.Page.getControl(patsr_callbacknumber).setFocus();
                                                execContext.getEventArgs().preventDefault(); 
                                                return false;
                                }
                                else {
                                                phoneNumber.setValue("(" + phoneCleaned.substr(0, 3) + ") " + phoneCleaned.substr(3, 3) + "-" + phoneCleaned.substr(6, 4));
                                                return true;
                                }
                }
}


function autoPopulateUserFacility(context) {
    var formType = context.getFormContext().ui.getFormType();
    if (formType === 1) {
        var reqFac = Xrm.Page.getAttribute('patsr_requestfacility');
        if (reqFac && !reqFac.getValue()) {

            Xrm.WebApi.online.retrieveRecord("systemuser", Xrm.Page.context.getUserId()).then(function (result) {
                if (result._patsr_facilitysiteid_value)
                    reqFac.setValue([{
                        entityType: "patsr_facility",
                        id: result._patsr_facilitysiteid_value,
                        name: result["_patsr_facilitysiteid_value@OData.Community.Display.V1.FormattedValue"]
                    }]);
            });
        }
    }
}

function autoPopulateDateOfContact(context) {
    var formType = context.getFormContext().ui.getFormType();
    if (formType === 1) {
        var reqDate = Xrm.Page.getAttribute('patsr_dateofcontact');
        if (reqDate && !reqDate.getValue()) {
            reqDate.setValue(new Date());
        }
    }
}

function isAnonymous() {
	//console.log('isAnonymous()');
	var custAttr = Xrm.Page.getAttribute('customerid');
	//console.log(custAttr.getValue());
    if (custAttr && custAttr.getValue()) {
        var name = custAttr.getValue()[0].name;
        var isAnon = name && name.match(/anonymous/gmi);
		//return !(isAnon === null);
		console.log(isAnon);
		return isAnon;
	}
	return false;
}

function hideAnonymous(context) {
	var formContext = context.getFormContext();
    if (isAnonymous()) {
		//	hide for closed cases - 4/5 - HIDE FOR ALL CASES
		//var status = Xrm.Page.getAttribute('statuscode').getValue();
		//if(status != 1 && status != 2 && status != 3 && status != 4 && status != 914980004) {
			formContext.ui.tabs.get("veteran").setVisible(false);
			formContext.ui.tabs.get("medicalcharts").setVisible(false);
			formContext.ui.tabs.get("priorcases").setVisible(false);
		//}
    }
	else {
		formContext.ui.tabs.get("veteran").setVisible(true);
		formContext.ui.tabs.get("medicalcharts").setVisible(true);
		formContext.ui.tabs.get("priorcases").setVisible(true);
	}
}

function hidePersonSearch(context) {
	// hide if a Request exists or Case Status is Inactive/Closed
	var formContext = context.getFormContext();
	var status = Xrm.Page.getAttribute("statuscode").getValue();
	if(status != 1 && status != 2 && status != 3 && status != 4 && status != 914980004) {
		formContext.ui.tabs.get("person_search").setVisible(false);
	}
	else {
		//	check for requests
		var entityId = formContext.data.entity.getId();
		if(entityId) {
			Xrm.WebApi.retrieveMultipleRecords("patsr_request","?$filter=_patsr_case_value eq "+entityId+"")
			.then(
				function success(result) {
					console.log(result);
					if(result.entities && result.entities.length >0) {
						formContext.ui.tabs.get("person_search").setVisible(false);
					}
					else {
						//	set grid refresh event
						addEventToGridRefreshFunction('RequestSummary',function() {
							hidePersonSearch(context);
						});
					}
				},
				function (error) {
					console.log(error);
				}
			);
		}
	}
}

function autoPopulateAnonymousVet(context) {
    var custAttr = Xrm.Page.getAttribute('customerid');
    if (custAttr && !custAttr.getValue()) {
        Xrm.WebApi.retrieveMultipleRecords("contact", "?$select=contactid,fullname&$top=1&$filter=contains(fullname,'anonymous')", 1).then(
            function success(result) {
                var cust = result && result.entities && result.entities.length && result.entities[0];
                if (cust) {
                    var cId = cust.contactid;
                    var fName = cust.fullname;
					//	set vet
                    custAttr.setValue([{
                        entityType: "contact",
                        id: cId,
                        name: fName
                    }]);
					
					//	set patsr_contactingentity = 100000000, patsr_callbacknumber = "(000) 000-0000", patsr_contactingentitynames = "Anonymous Veteran"
					Xrm.Page.getAttribute("patsr_contactingentity").setValue(100000000);
					Xrm.Page.getAttribute("patsr_callbacknumber").setValue("(000) 000-0000");
					Xrm.Page.getAttribute("patsr_contactingentitynames").setValue("Anonymous Veteran");
                }
				hideAnonymous(context);
            },
            function (error) {
            }
        );
    }
	else {
		hideAnonymous(context);
	}
}

function checkSensitivity(context) {
	//debugger;
	if(isAnonymous()) { return;}
	var custAttr = Xrm.Page.getAttribute('customerid');
    if (custAttr
        && custAttr.getValue()
        && custAttr.getValue()[0].entityType === 'contact') {
		//	hide tabs
		formToggleVisibility(false, context);
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
							formToggleVisibility(true, context);
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
										var caseTitle = Xrm.Page.getAttribute('title').getValue();
										var contactId = custAttr.getValue()[0].id;
										var data = {
											"patsr_name": "Sensitive Record Accessed",
											"patsr_accessed" : true,
											"patsr_issensitiveveteran" : true,
											"patsr_recordaccessed" : (caseTitle == null ? "New Case" : "Case " + caseTitle),	// case #
											"patsr_AccessingUser@odata.bind": "/systemusers("+userId+")",
											"patsr_veteran@odata.bind": "/contacts(" + contactId.replace(/[{}]/gi, "") + ")"
										};
										Xrm.WebApi.createRecord("patsr_recordaccess", data)
											.then(function success(result) {

											},
												function (error) {
													console.log(error.message);
												});
										formToggleVisibility(true, context);                                
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
	else {
		formToggleVisibility(true, context); 
	}
}

function displayWHHLTab(context) {
    var lobAttr = Xrm.Page.getAttribute('patsr_lob');
    if (lobAttr && lobAttr.getValue()) {
        var lobVal = lobAttr.getValue();
        if (lobVal === 100000001) {
            var ui = context.getFormContext().ui;
            var whhlTab = ui.tabs.get('whhl');
            whhlTab && whhlTab.setVisible(true);
        }
    }
}

function setAppLOB(context) {
    var formTypeId = context.getFormContext().ui.getFormType();
    var lobAttr = Xrm.Page.getAttribute('patsr_lob');
    var curAttr = Xrm.Page.getAttribute('patsr_currentlob');
    if (formTypeId === 1) {
        var globalContext = Xrm.Utility.getGlobalContext();
        globalContext.getCurrentAppName().then(function (result) {
            switch (result) {
                case 'PATS-R': {
                    lobAttr.getValue() !== 100000000 && lobAttr.setValue(100000000);
                    curAttr.getValue() !== 100000000 && curAttr.setValue(100000000);
                }
                break;
                case 'WHHL': {
                    lobAttr.getValue() !== 100000001 && lobAttr.setValue(100000001);
                    curAttr.getValue() !== 100000001 && curAttr.setValue(100000001);
                }
                break;
            }
        });
    }
}

function formToggleVisibility(state, context) {
	//return;
//debugger;
	var formContext = context.getFormContext();
    formContext.ui.tabs.get("tab_10").setVisible(state);	//report of contact
    //formContext.ui.tabs.get("whhl").setVisible(state);	//whhl
	formContext.ui.tabs.get("tab_13").setVisible(state);
	formContext.ui.tabs.get("tab_12").setVisible(state);
	formContext.ui.tabs.get("tab_9").setVisible(state);
	if(!isAnonymous()) {
		formContext.ui.tabs.get("veteran").setVisible(state);
		formContext.ui.tabs.get("medicalcharts").setVisible(state);
		formContext.ui.tabs.get("priorcases").setVisible(state);
	}
	//formContext.ui.tabs.get("tab_11").setVisible(state);
	//formContext.ui.tabs.get("named_employees").setVisible(state);
	//formContext.ui.tabs.get("tab_17").setVisible(state);
	//formContext.ui.tabs.get("general").setVisible(state);
}

function refreshAfterRequestAdded() {
	
}

function addEventToGridRefreshFunction(gridName, functionToCall) {
	var grid = Xrm.Page.getControl(gridName);  
	// if the subgrid still not available we try again after 1 second
	if (grid == null) {  
		setTimeout(function () { addEventToGridRefreshFunction(gridName, functionToCall); }, 1000);
		return;
	}
	// add the function to the onRefresh event
	grid.addOnLoad(functionToCall);  
}