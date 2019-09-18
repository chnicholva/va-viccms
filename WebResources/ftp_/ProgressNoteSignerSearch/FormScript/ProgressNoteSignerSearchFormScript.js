//ProgressNoteSignerSearchFormScript.js
//Contains variables and functions used by the CRM Progress Note Form Ribbon 

function pnss_launchProgressNoteSignerSearch() {
    try {
        //Refresh the web resource URL
        var pnss_ProgressNoteSignerSearchURL = Xrm.Page.getControl('WebResource_ProgressNoteSignerSearch').getSrc();
        Xrm.Page.getControl('WebResource_ProgressNoteSignerSearch').setSrc(pnss_ProgressNoteSignerSearchURL);
        //Prep the tab
        if (Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').getVisible() == false) {;
            Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').getDisplayState() != 'expanded') {
            Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setDisplayState('expanded');
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get('Tab_AdditionalSigners').setFocus();
    }
    catch (err) {
        alert('Progress Note Signer Search Ribbon Function Error(pnss_launchProgressNoteSignerSearch): ' + err.message);
    }
}