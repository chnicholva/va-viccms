//RequestSignerSearchFormScript.js
//Contains variables and functions used by the CRM Request Form Ribbon 

function rss_launchRequestSignerSearch() {
    try {
        //Refresh the web resource URL
        var rss_RequestSignerSearchURL = Xrm.Page.getControl('WebResource_RequestSignerSearch').getSrc();
        Xrm.Page.getControl('WebResource_RequestSignerSearch').setSrc(rss_RequestSignerSearchURL);
        //Prep the tab
        if(Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').getVisible() == false) {;
            Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').setVisible(true);
        }
        if (Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').getDisplayState() != 'expanded') {
            Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').setDisplayState('expanded');
        }
        //Set focus to the signers tab
        Xrm.Page.ui.tabs.get('Tab_RequestSignerSearch').setFocus();
    }
    catch (err) {
        alert('Request Signer Search Ribbon Function Error(rss_launchRequestSignerSearch): ' + err.message);
    }
}