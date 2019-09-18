//RequestCascadingReasonsFormScript.js
//Contains variables and functions used by the CRM Request Form for the Reason for Request and related cascading attribute lookups

function request_ReasonsCascadingFormOnLoad() {
    try {
        //Trigger Filter settings using reasons for request on change
        if (Xrm.Page.getAttribute("ftp_reasonforrequest").getValue() != null) {
            //Enable sub reason
            Xrm.Page.getControl("ftp_subreasonid").setDisabled(false);
            //Apply Filtered lookup
            request_Prep_ftp_subreasonidLookupFilter();
            if (Xrm.Page.getAttribute("ftp_subreasonid").getValue() != null) {
                //Enable minor reason
                Xrm.Page.getControl("ftp_minorreasonid").setDisabled(false);
                //Apply Filtered lookup
                request_Prep_ftp_minorreasonidLookupFilter();
            }
            else {
                Xrm.Page.getControl("ftp_minorreasonid").setDisabled(true);
            }
        }
        else {
            Xrm.Page.getControl("ftp_subreasonid").setDisabled(true);
            Xrm.Page.getControl("ftp_minorreasonid").setDisabled(true);
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_ReasonsCascadingFormOnLoad function.  Error Detail Message: " + err);
    }
}

function request_ftp_reasonforrequestOnChange() {
    try {
        //Clear sub attributes
        Xrm.Page.getAttribute("ftp_subreasonid").setValue(null)
        Xrm.Page.getAttribute("ftp_minorreasonid").setValue(null)
        Xrm.Page.getAttribute("ftp_subreasonid").setSubmitMode("always");
        Xrm.Page.getAttribute("ftp_minorreasonid").setSubmitMode("always");
        //Disable related attributes
        Xrm.Page.getControl("ftp_subreasonid").setDisabled(true);
        Xrm.Page.getControl("ftp_minorreasonid").setDisabled(true);
        if (Xrm.Page.getAttribute("ftp_reasonforrequest").getValue() != null) {
            //Enable sub reason
            Xrm.Page.getControl("ftp_subreasonid").setDisabled(false);
            //Apply Filtered lookup
            request_Prep_ftp_subreasonidLookupFilter();
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_ftp_reasonforrequestOnChange function.  Error Detail Message: " + err);
    }
}

function request_Prep_ftp_subreasonidLookupFilter() {
    //Prep Filtered Lookup
    try {
        Xrm.Page.getControl("ftp_subreasonid").removePreSearch(request_Apply_ftp_subreasonidLookupFilter);  //Remove Existing Handler if it exists 
        if (Xrm.Page.getAttribute("ftp_reasonforrequest").getValue() != null) {
            Xrm.Page.getControl("ftp_subreasonid").addPreSearch(request_Apply_ftp_subreasonidLookupFilter);  //Add new Filter Handler
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_Prep_ftp_subreasonidLookupFilter function.  Error Detail Message: " + err);
    }
}

function request_Apply_ftp_subreasonidLookupFilter() {
    //Apply Filtered Lookup
    try {
        if (Xrm.Page.getAttribute("ftp_reasonforrequest").getValue() != null) {
            var FilterXml = '<filter type="and"><condition attribute="ftp_reasonforrequestid" operator="eq" value="' + Xrm.Page.getAttribute("ftp_reasonforrequest").getValue()[0].id + '" /></filter>';
            Xrm.Page.getControl("ftp_subreasonid").addCustomFilter(FilterXml, "ftp_subreason"); //Apply the custom lookup filter
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_Apply_ftp_subreasonidLookupFilter function.  Error Detail Message: " + err);
    }
}

function request_ftp_subreasonidOnChange() {
    try {
        //Clear sub attributes
        Xrm.Page.getAttribute("ftp_minorreasonid").setValue(null)
        Xrm.Page.getAttribute("ftp_minorreasonid").setSubmitMode("always");
        //Disable related attributes
        Xrm.Page.getControl("ftp_minorreasonid").setDisabled(true);
        if (Xrm.Page.getAttribute("ftp_subreasonid").getValue() != null) {
            //Enable sub reason
            Xrm.Page.getControl("ftp_minorreasonid").setDisabled(false);
            //Apply Filtered lookup
            request_Prep_ftp_minorreasonidLookupFilter();
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_ftp_subreasonidOnChange function.  Error Detail Message: " + err);
    }
}

function request_Prep_ftp_minorreasonidLookupFilter() {
    //Prep Filtered Lookup
    try {
        Xrm.Page.getControl("ftp_minorreasonid").removePreSearch(request_Apply_ftp_minorreasonidLookupFilter);  //Remove Existing Handler if it exists 
        if (Xrm.Page.getAttribute("ftp_subreasonid").getValue() != null) {
            Xrm.Page.getControl("ftp_minorreasonid").addPreSearch(request_Apply_ftp_minorreasonidLookupFilter);  //Add new Filter Handler
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_Prep_ftp_minorreasonidLookupFilter function.  Error Detail Message: " + err);
    }
}

function request_Apply_ftp_minorreasonidLookupFilter() {
    //Apply Filtered Lookup
    try {
        if (Xrm.Page.getAttribute("ftp_subreasonid").getValue() != null) {
            var FilterXml = '<filter type="and"><condition attribute="ftp_subtominorreasonid" operator="eq" value="' + Xrm.Page.getAttribute("ftp_subreasonid").getValue()[0].id + '" /></filter>';
            Xrm.Page.getControl("ftp_minorreasonid").addCustomFilter(FilterXml, "ftp_minorreason"); //Apply the custom lookup filter
        }
    }
    catch (err) {
        //Display Error
        alert("An error occured in the request_Apply_ftp_minorreasonidLookupFilter function.  Error Detail Message: " + err);
    }
}