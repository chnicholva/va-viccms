//ViaServiceConnectorScriptLib.js
//Contains variables and functions used by the ViaServiceConnector.html page

function vsc_AppCodeKeyUp() {
    try {
        //If any key was pressed, take the complete attribute string and convert to CRM storage array
        var vsc_crmAppCodeArray = [];
        var vsc_crmAppCodeString = document.getElementById("vsc_requestingAppCode").value;
        if (vsc_crmAppCodeString != null && vsc_crmAppCodeString != "") {
            for (var i = 0; i <= vsc_crmAppCodeString.length - 1; i++) {
                if (vsc_crmAppCodeArray.length == 0) { vsc_crmAppCodeArray.push((vsc_crmAppCodeString.charCodeAt(i) + 4)); }
                else {
                    vsc_crmAppCodeArray.push((vsc_crmAppCodeString.charCodeAt(i) + i + 4));
                }
            }
            //Reverse Array
            vsc_crmAppCodeArray.reverse();
        }
        //Update CRM form
        parent.Xrm.Page.getAttribute('ftp_viarequestingapplicationcode').setValue(vsc_crmAppCodeArray.toString());
        parent.Xrm.Page.getAttribute('ftp_viarequestingapplicationcode').setSubmitMode('always');
    }
    catch (err) {
        //Display Error
        alert('VIA Service Connector Script Failure Function(vsc_AppCodeKeyUp) Error Detail: ' + err);
    }
}

function vsc_AppTokenKeyUp() {
    try {
        //If any key was pressed, take the complete attribute string and convert to CRM storage array
        var vsc_crmAppTokenArray = [];
        var vsc_crmAppTokenString = document.getElementById("vsc_consumingAppToken").value;
        if (vsc_crmAppTokenString != null && vsc_crmAppTokenString != "") {
            for (var i = 0; i <= vsc_crmAppTokenString.length - 1; i++) {
                if (vsc_crmAppTokenArray.length == 0) { vsc_crmAppTokenArray.push((vsc_crmAppTokenString.charCodeAt(i) + 6)); }
                else {
                    vsc_crmAppTokenArray.push((vsc_crmAppTokenString.charCodeAt(i) + i + 6));
                }
            }
            //Reverse Array
            vsc_crmAppTokenArray.reverse();
        }
        //Update CRM form
        parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationtoken').setValue(vsc_crmAppTokenArray.toString());
        parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationtoken').setSubmitMode('always');
    }
    catch (err) {
        //Display Error
        alert('VIA Service Connector Script Failure Function(vsc_AppTokenKeyUp) Error Detail: ' + err);
    }
}

function vsc_AppPasswordKeyUp() {
    try {
        //If any key was pressed, take the complete attribute string and convert to CRM storage array
        var vsc_crmAppPasswordArray = [];
        var vsc_crmAppPasswordString = document.getElementById("vsc_consumingAppPassword").value;
        if (vsc_crmAppPasswordString != null && vsc_crmAppPasswordString != "") {
            for (var i = 0; i <= vsc_crmAppPasswordString.length - 1; i++) {
                if (vsc_crmAppPasswordArray.length == 0) { vsc_crmAppPasswordArray.push((vsc_crmAppPasswordString.charCodeAt(i) + 8)); }
                else {
                    vsc_crmAppPasswordArray.push((vsc_crmAppPasswordString.charCodeAt(i) + i + 8));
                }
            }
            //Reverse Array
            vsc_crmAppPasswordArray.reverse();
        }
        //Update CRM form
        parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationpassword').setValue(vsc_crmAppPasswordArray.toString());
        parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationpassword').setSubmitMode('always');
    }
    catch (err) {
        //Display Error
        alert('VIA Service Connector Script Failure Function(vsc_AppPasswordKeyUp) Error Detail: ' + err);
    }
}

function vsc_formLoad() {
    try {
        //Load any existing CRM data
        if (parent.Xrm.Page.getAttribute('ftp_viarequestingapplicationcode').getValue() != null) {
            var vsc_crmAppCodeArray = parent.Xrm.Page.getAttribute('ftp_viarequestingapplicationcode').getValue();
            var vsc_convAppCode = "";
            if (vsc_crmAppCodeArray != null && vsc_crmAppCodeArray != "") {
                var vsc_newAppCodeArray = vsc_crmAppCodeArray.toString().split(',');
                vsc_newAppCodeArray.reverse();
                for (i = 0; i < vsc_newAppCodeArray.length; i++) {
                    var vsc_curChar = "";
                    if (i == 0) {
                        vsc_curChar = vsc_newAppCodeArray[i] - 4;
                    }
                    else {
                        vsc_curChar = vsc_newAppCodeArray[i] - (i + 4);
                    }
                    vsc_convAppCode = vsc_convAppCode + String.fromCharCode(vsc_curChar);
                }
            }
            document.getElementById("vsc_requestingAppCode").value = vsc_convAppCode;
        }

        if (parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationtoken').getValue() != null) {
            var vsc_crmAppTokenArray = parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationtoken').getValue();
            var vsc_convAppToken = "";
            if (vsc_crmAppTokenArray != null && vsc_crmAppTokenArray != "") {
                var vsc_newAppTokenArray = vsc_crmAppTokenArray.toString().split(',');
                vsc_newAppTokenArray.reverse();
                for (i = 0; i < vsc_newAppTokenArray.length; i++) {
                    var vsc_curChar = "";
                    if (i == 0) {
                        vsc_curChar = vsc_newAppTokenArray[i] - 6;
                    }
                    else {
                        vsc_curChar = vsc_newAppTokenArray[i] - (i + 6);
                    }
                    vsc_convAppToken = vsc_convAppToken + String.fromCharCode(vsc_curChar);
                }
            }
            document.getElementById("vsc_consumingAppToken").value = vsc_convAppToken;
        }

        if (parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationpassword').getValue() != null) {
            var vsc_crmAppPasswordArray = parent.Xrm.Page.getAttribute('ftp_viaconsumingapplicationpassword').getValue();
            var vsc_convAppPassword = "";
            if (vsc_crmAppPasswordArray != null && vsc_crmAppPasswordArray != "") {
                var vsc_newAppPasswordArray = vsc_crmAppPasswordArray.toString().split(',');
                vsc_newAppPasswordArray.reverse();
                for (i = 0; i < vsc_newAppPasswordArray.length; i++) {
                    var vsc_curChar = "";
                    if (i == 0) {
                        vsc_curChar = vsc_newAppPasswordArray[i] - 8;
                    }
                    else {
                        vsc_curChar = vsc_newAppPasswordArray[i] - (i + 8);
                    }
                    vsc_convAppPassword = vsc_convAppPassword + String.fromCharCode(vsc_curChar);
                }
            }
            document.getElementById("vsc_consumingAppPassword").value = vsc_convAppPassword;
        }
    }
    catch (err) {
        //Display Error
        alert('VIA Service Connector Script Failure Function(vsc_formLoad) Error Detail: ' + err);
    }
}