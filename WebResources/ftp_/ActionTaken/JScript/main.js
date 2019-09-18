//global variables
var _isPharmacyOutbound = false;

function form_onLoad() {
    try {
        //Supress Original Interaction in optionset
        Xrm.Page.getControl("ftp_title").removeOption(100000008);
        Xrm.Page.getAttribute("ftp_title").fireOnChange();

        if (Xrm.Page.ui.getFormType() == 2) {
            /*lcok all controls*/
            var contrs = Xrm.Page.ui.controls.get();
            for (var i in contrs) {
                contrs[i].setDisabled(true);
                contrs[i].clearNotification()
            }
        }
    }
    catch (err) {
        //Display Error
        alert('Action Taken Form Load Script Function Error(form_onLoad): ' + err.message);
    }
}

function setName() {
    if (!!(Xrm.Page.getAttribute("ftp_title").getValue())) {
        Xrm.Page.getAttribute("ftp_name").setValue(Xrm.Page.getAttribute("ftp_title").getText());
        Xrm.Page.getAttribute("ftp_name").setSubmitMode("always");
    }
}

function ftp_title_onChange() {
    setName();
    var titleValue = Xrm.Page.getAttribute("ftp_title").getValue();
    if (!!titleValue) {
        /*setup ftp_outboundactionid lookup field*/
        var outboundActionTakenControl = Xrm.Page.getControl("ftp_outboundactionid");
        if (!!outboundActionTakenControl) {
            outboundActionTakenControl.setVisible((titleValue == 100000010 || titleValue == 100000009) && _isPharmacyOutbound);
            outboundActionTakenControl.getAttribute().setRequiredLevel((titleValue == 100000010 || titleValue == 100000009) && _isPharmacyOutbound ? "required" : "none");
        }
    }
}

function setOutboundActionSelection(pName) {
    /*
	find outbound record called pName and fill the ftp_outboundactionid lookup field on this action taken record
	*/
    if (!!pName) {
        var retrievedOutboundActions = [];
        var query = "$select=ftp_outboundactionId,ftp_name&$filter=ftp_name eq '" + pName + "' and statecode/Value eq 0&$orderby=CreatedOn desc";
        SDK.REST.retrieveMultipleRecords(
			"ftp_outboundaction",
			query,
			function (retrievedRecords) {
			    if (!!retrievedRecords && retrievedRecords.length > 0) retrievedOutboundActions = retrievedOutboundActions.concat(retrievedRecords);
			},
			errorHandler,
			function () {
			    if (retrievedOutboundActions.length > 0) {
			        var outboundAction = retrievedOutboundActions[0];
			        Xrm.Page.getAttribute("ftp_outboundactionid").setValue([{ id: outboundAction.ftp_outboundactionId, name: outboundAction.ftp_name, entityType: "ftp_outboundaction" }]);
			        Xrm.Page.getAttribute("ftp_outboundactionid").fireOnChange();
			        _isPharmacyOutbound = true;
			        Xrm.Page.getAttribute("ftp_title").fireOnChange();
			    }
			    else {
			        /*
					could not find the outbound action record called pName
					*/
			        alert("Script error in setOutboundActionSelection(): Could not find '" + pName + "' outbound action record.");
			    }
			}
		);
    }
}


function ftp_outboundactionid_onChange() {
    Xrm.Page.ui.clearFormNotification("additionalDetailsNotification");
    Xrm.Page.getAttribute("ftp_description").setRequiredLevel("none");
    var outboundActionValue = Xrm.Page.getAttribute("ftp_outboundactionid").getValue();
    if (!!outboundActionValue) {
        var query = "ftp_name,ftp_Description,ftp_RequiresAdditionalDetail,ftp_AdditionalDetailHelperText";
        SDK.REST.retrieveRecord(
			outboundActionValue[0].id,
			"ftp_outboundaction",
			query,
			null,
			function (retrievedRecord) {
			    if (!!retrievedRecord) {
			        if (retrievedRecord.ftp_RequiresAdditionalDetail == true) {
			            var detailHelperText = !!retrievedRecord.ftp_AdditionalDetailHelperText ? retrievedRecord.ftp_AdditionalDetailHelperText : "Provide additional information in the Details field.";
			            Xrm.Page.getAttribute("ftp_description").setRequiredLevel("required");
			            Xrm.Page.ui.setFormNotification(detailHelperText, "INFO", "additionalDetailsNotification");
			            _isPharmacyOutbound = true;
			        }
			    }
			},
			errorHandler
		);
    }
}

function errorHandler(error) {
    writeToConsole(error.message);
    alert(error.message);
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}

function hideNewAssociatedButton(){

}

function hideSubGridNewAssociatedButton(){

}