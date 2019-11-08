//TriageExpertNotesFormScript.js
//Contains variables and functions used by the CRM Form and Ribbon

//Static Variables
var tenf_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var tenf_serverUrl = Xrm.Page.context.getClientUrl();

function tenf_launchTriageExpertNotes() {
    debugger;
    try {
        var tenf_triageWB = 'ftp_/TriageExpertNotes/TriageExpertNotes.html';
        var tenf_customParameters = encodeURIComponent("entityId=" + Xrm.Page.data.entity.getId() + "&entityType=" + Xrm.Page.data.entity.getEntityName() + "&primaryAtributeValue=" + Xrm.Page.data.entity.getPrimaryAttributeValue());
        //NOTE: The Xrm.Utility.openWebResource command is failing when the CRM Note/Activities Control has been used.  
        //Replacing the function below with window.open script instead
        //Xrm.Utility.openWebResource(tenf_triageWB, tenf_customParameters);
        var tenf_triageUrl = tenf_serverUrl + "/WebResources/" + tenf_triageWB + "?Data=" + tenf_customParameters;
        window.open(tenf_triageUrl);
    }
    catch (err) {
        alert('Triage Expert Notes Ribbon Function Error(tenf_launchTriageExpertNotes): ' + err.message);
    }
}