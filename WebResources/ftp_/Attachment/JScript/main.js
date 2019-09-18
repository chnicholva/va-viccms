function form_onSave(econtext) {
    var eventArgs = econtext.getEventArgs();

    //prevent auto save
    if (eventArgs.getSaveMode() == 70) {
        eventArgs.preventDefault();
        return;
    }
}

function form_onLoad() {

    var intId = Xrm.Page.getAttribute("ftp_interactionid").getValue();
    var reqId = Xrm.Page.getAttribute("ftp_requestid").getValue();

    if (!!intId) {
        getRecordState("ftp_interaction", intId[0].id.replace(/({|})/g, ''), "statecode");
    }
    else if (!!reqId) {
        getRecordState("Incident", reqId[0].id.replace(/({|})/g, ''), "StateCode");
    }

}

function removed_onChange() {

    var removed = Xrm.Page.getAttribute("ftp_removed_bool").getValue();

    displayButtons(null);
}

function displayButtons(parentRecordState) {
    var formType = Xrm.Page.ui.getFormType();
    var userId = Xrm.Page.context.getUserId();

    var parentState = "active";

    if (!!parentRecordState) {
        if (parentRecordState != 0) {
            parentState = "inactive";
        }
    }

    var removed = Xrm.Page.getAttribute("ftp_removed_bool").getValue();

    var generalTab = Xrm.Page.ui.tabs.get("tab_General");
    var viewSection = generalTab.sections.get("section_viewButton");
    var removeSection = generalTab.sections.get("section_removeButton");
    var createdBy;

    if (removed) {
        viewSection.setVisible(false);
        removeSection.setVisible(false);
    }
    else {
        viewSection.setVisible(true);

        //show the Remove button if the viewing user is the creator of the record

        if (Xrm.Page.getAttribute("createdonbehalfby").getValue() == null) {
            createdBy = Xrm.Page.getAttribute("createdby").getValue()[0].id;
        }
        else {
            createdBy = Xrm.Page.getAttribute("createdonbehalfby").getValue()[0].id;
        }

        if (userId == createdBy) {
            if (parentState == "active") {
                removeSection.setVisible(true);
            }
            else if (parentState == "inactive") {
                removeSection.setVisible(false);
            }
        }
        else {
            removeSection.setVisible(false);
        }
    }
}

function getRecordState(recordType, id, statusField) {

    SDK.REST.retrieveRecord(
        id,
        recordType,
        statusField,
        null,
        function (retrievedRecord) {
            if (!!retrievedRecord) {
                if (recordType == "ftp_interaction") {
                    displayButtons(retrievedRecord.statecode.Value);
                }
                else if (recordType == "Incident") {
                    displayButtons(retrievedRecord.StateCode.Value);
                }
            }
            else {
                window.alert("nothing found");
            }
        },
        errorCallback 
    );

}

function errorCallback(error) {
    window.alert(error.message);
}