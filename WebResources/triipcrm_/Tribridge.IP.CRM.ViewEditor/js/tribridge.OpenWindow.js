
function openViewEditorWindow() {
    var functionName = "openViewEditorWindow";
    try {
        //set window width
        var windowWidth = "610";
        //set window height
        var windowHeight = "520";

        //set url and querystring parameter
        var url = getCRMUrl() + "WebResources/triipcrm_/Tribridge.IP.CRM.ViewEditor/ViewEditor.html?";

        //validate Xrm.DialogOptions
        if (isValid(Xrm.DialogOptions)) {

            //Dialog Options would be set here
            var DialogOptions = new Xrm.DialogOptions();

            //set dialog width
            DialogOptions.width = windowWidth;

            //set dialog height
            DialogOptions.height = windowHeight;

            //open url in Internal dialog
            Xrm.Internal.openDialog(Mscrm.CrmUri.create(url).toString(), DialogOptions, null, null);
        }
        else {
            //validate showmodalDialog
            if (isValid(window.showModalDialog)) {
                //open url in show modal Dialog
                window.showModalDialog(url, null, "dialogWidth:" + windowWidth + "px;dialogHeight:" + windowHeight + "px;resizable:yes");
            }
            else {
                //open url in window
                window.open(url, null, "width=" + windowWidth + ", height=" + windowHeight + "", null);
            }
        }

    } catch (e) {
        throwError(functionName, e);
    }
}
/*
function to get the CRM URL
*/
function getCRMUrl() {
    var funcitonName = "getCRMUrl";
    var crmURL = "";
    try {
        try {
            //get CRM client URL
            crmURL = Xrm.Page.context.getClientUrl();

        } catch (e) {
            //return server url
            return Xrm.Page.context.getServerUrl();
        }
        //add '/' symbol
        if (!(crmURL.charAt(crmURL.length - 1) == '/')) {
            crmURL += '/';
        }
    } catch (e) {
        throwError(funcitonName, e);
    }
    return crmURL;
}

//Method to Show Error
function throwError(functionName, e) {
    var name = "showError";
    try {
        showAlert(functionName + ":" + (e.description || e.message));
    } catch (error) {
        showAlert(name + ":" + (error.description || error.message));
    }
}

//This function validates the fields and their attributes 
function isValid(attributes) {
    var functionName = "isValid";
    try {
        if (attributes != null && attributes != "undefined" && attributes != "") {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        throwError(e, functionName);
    }
}
//function to show message
function showAlert(message) {
    var functionName = "";
    try {
        if (isValid(Xrm.Utility)) {
            Xrm.Utility.alertDialog(message);
        }
    } catch (e) {
        alert(message);
    }
}


