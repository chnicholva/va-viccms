function form_onSave(econtext) {
	var eventArgs = econtext.getEventArgs();

	//prevent auto save
	if (eventArgs.getSaveMode() == 70) {
		eventArgs.preventDefault();
		return;
	}
}

function form_onLoad() {

	var recordStatus = Xrm.Page.getAttribute("statecode").getValue();
	var recordPrinted = Xrm.Page.getAttribute("ftp_recordprinted_bool").getValue();
    var formType = Xrm.Page.ui.getFormType();

    var interactionTypeCode;

    if (!!Mscrm && !!Mscrm.EntityPropUtil && !!Mscrm.EntityPropUtil.EntityTypeName2CodeMap && typeof Mscrm.EntityPropUtil.EntityTypeName2CodeMap == "object") {
        interactionTypeCode = Mscrm.EntityPropUtil.EntityTypeName2CodeMap.ftp_interaction;
    }
    else {
        interactionTypeCode = "10068";
    }

	if (formType != 1) {
		Xrm.Page.getControl("WebResource_printInteraction").setVisible(false);
	}

	if (formType == 2 && recordStatus == 0 && recordPrinted == 0) {
		var serverUrl = Xrm.Page.context.getClientUrl();
		var interactionGuid = Xrm.Page.getAttribute("ftp_interaction_id").getValue()[0].id.replace("{", "").replace("}", "");
        var reportUrl = serverUrl + "/crmreports/viewer/viewer.aspx?action=run&context=records&helpid=Interaction%20Print%20Record.rdl&id=%7bCEB8C39F-AB44-E811-8130-1289A8FDD3DA%7d&records=%7b" + interactionGuid + "%7d&recordstype=" + interactionTypeCode;
		Xrm.Page.getAttribute("ftp_recordprinted_bool").setValue(1);
		Xrm.Page.data.entity.save();
		setTimeout(
			function () {
				window.open(reportUrl);
			}, 1500);
	}
}

