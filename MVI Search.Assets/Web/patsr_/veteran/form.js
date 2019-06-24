function notifyFacilityMatch(context) {
    var facAttr = Xrm.Page.getAttribute('patsr_currentfacility');
    if (facAttr && facAttr.getValue()) {
        Xrm.WebApi.retrieveRecord('systemuser', Xrm.Page.context.getUserId(), "?$select=_patsr_facilitysiteid_value")
            .then(function (result) {
                if (result._patsr_facilitysiteid_value) {
                    var r = new RegExp(result._patsr_facilitysiteid_value, 'gi');
                    var facId = facAttr.getValue()[0].id.replace(/{|}/gi, '');

                    !r.test(facId)
                        && context.getFormContext().ui.setFormNotification('Veteran Facility is not the same as Users Facility', 'Information');
                }
            });
    }
}

function unlockForCreate(context) {
	//	check form type = Create
	var formContext = context.getFormContext();
	if(formContext.ui.getFormType()==1) {
		// 	unlock fields
		var fields = ["birthdate","governmentid","veo_edipi","patsr_nextofkin","patsr_remarks","telephone1","telephone2","mobilephone",
		"fullname_compositionLinkControl_firstname","fullname_compositionLinkControl_lastname","address1_composite_compositionLinkControl_address1_line1",
		"address1_composite_compositionLinkControl_address1_line2","address1_composite_compositionLinkControl_address1_line3","address1_composite_compositionLinkControl_address1_city",
		"address1_composite_compositionLinkControl_address1_stateorprovince","address1_composite_compositionLinkControl_address1_postalcode",
		"address1_composite_compositionLinkControl_address1_country"];
		for(var i = 0;i<fields.length;i++) {
			if(formContext.getControl(fields[i])) {
				formContext.getControl(fields[i]).setDisabled(false);
			}
		}
		//	set tab focus
		formContext.ui.tabs.get("summary_tab").setFocus();
	}
}