//VistACPRSMultiNoteFormScript.js
//Contains variables and functions used by the CRM Form and Ribbon
//Requires jQuery loaded on the CRM Form  ??

//Static Variables
var vcmn_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var vcmn_serverUrl = Xrm.Page.context.getClientUrl();

function vcmn_launchNewProgressNote() {
    try {
        //alert('Launched New Progress Note Window');
        var vcmn_entityId = Xrm.Page.data.entity.getId();
        var vcmn_entityType = Xrm.Page.data.entity.getEntityName();
        var vcmn_primaryAtributeValue = Xrm.Page.data.entity.getPrimaryAttributeValue();

        //Populate values of the crm attributes to be included on the form
        var vcmn_extraqs = "";
        vcmn_extraqs += "subject=" + "New Progress Note";
        vcmn_extraqs += "&regardingobjectid=" + vcmn_entityId + "&regardingobjectidname=" + vcmn_primaryAtributeValue + "&regardingobjectidtype=" + vcmn_entityType + "&parameter_triageexpert=NO";
        var vcmn_progressNoteUrl = vcmn_serverUrl + "/apps/vicccms/main.aspx?etn=" + "ftp_progressnote" + "&pagetype=entityrecord&navbar=off" + "&extraqs=" +
            encodeURIComponent(vcmn_extraqs);  //+ "&newWindow=true";
        var vcmn_progressNoteWindow = window.open(vcmn_progressNoteUrl, "_blank", "toolbar=no, scrollbars=yes, status=no, resizable=yes, top=1, left=1, width=1000, height=800", false);
    }
    catch (err) {
        alert('VistA CPRS Multi Note Ribbon Function Error(vcmn_launchNewProgressNote): ' + err.message);
    }
}

function vcmn_launchViewProgressNotes() {
    try {
        //Set focus to the Multi Progress Tab that has the subgrid area
        Xrm.Page.ui.tabs.get('Tab_ProgressNotes').setFocus();
        //Refresh the progress notes subgrid (requestProgressNotesGrid)
        var vcmn_progressNotesGrid = Xrm.Page.getControl("requestProgressNotesGrid");
        if (vcmn_progressNotesGrid != null) { vcmn_progressNotesGrid.refresh(); }
    }
    catch (err) {
        alert('VistA CPRS Multi Note Ribbon Function Error(vcmn_launchViewProgressNotes): ' + err.message);
    }
}