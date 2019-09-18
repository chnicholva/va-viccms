var Use_No_Adapter = "1";
var Use_Automation_Adapter = "2";
var Use_Adapter = "3";

window.CommonFunction = function () {
    return 'Common Function';
}
//Code to load common Errorstrings file ... 
var URL = Xrm.Page.context.getClientUrl();
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", URL + "/WebResources/" + getErrorStringFileName(), false);
xmlhttp.send();
eval(xmlhttp.responseText);

function validateSpecialCharacters(data) {
    var namePattern = new RegExp("[\x00-\x1F<>|:#%&\"\*\?\/\\\\]|^[.]|[.]$|^COM[1-9]$|^LPT[1-9]$|^PRN$|^NUL$|^CON$|^CLOCK\\$$|^AUX$", "i");
    if (data != null && namePattern.test(data))
        return false;
    return true;
}

function IsNumeric(sText) {
    var ValidChars = "0123456789.";
    var IsNumber = true;
    var Char;

    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

function HideAssociatedViewButton(loadAreaId, buttonTitle) {
    var navElement = document.getElementById('nav_' + loadAreaId);
    if (navElement != null) {
        navElement.onclick = function LoadAreaOverride() {
            // Call the original method to launch the navigation link
            loadArea(loadAreaId);
            var associatedViewIFrame = document.getElementById(loadAreaId + 'Frame');
            if (associatedViewIFrame != null) {
                associatedViewIFrame.onreadystatechange = function HideTitledButton() {
                    if (associatedViewIFrame.readyState == 'complete') {
                        var iFrame = frames[window.event.srcElement.id];
                        var liElements = iFrame.document.getElementsByTagName('li');
                        for (var i = 0; i < liElements.length; i++) {
                            if (liElements[i].getAttribute('title') == buttonTitle) {
                                liElements[i].style.display = 'none';
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

function validateXML(xmlString) {
    var errTxt = '';
    // code for IE
    if (window.ActiveXObject) {
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlString);
        if (xmlDoc.parseError.errorCode != 0) {
            errTxt = jsErr_Reason + xmlDoc.parseError.reason;
            errTxt = errTxt + jsErr_ErrorLine + xmlDoc.parseError.line;
            return errTxt;
        }
    }
    // code for Chrome, Mozilla Firefox, Safari
    else if (document.implementation && document.implementation.createDocument) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlString, "text/xml");
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            return xmlDoc.getElementsByTagName("parsererror")[0].textContent;           
        }
    }
    else {
        return jsErr_XmlLoad;
    }
    return '';
}

function getErrorStringFileName() {
    var fileName = 'uii_ErrorStrings';
    var userLocaleId = Xrm.Page.context.getUserLcid();

    switch (userLocaleId) {
        case 1025:
        case 1028:
        case 1031:
        case 1036:
        case 1041:
        case 1043:
        case 1049:
        case 1081:
        case 2070:
        case 3082:
            fileName += '_' + userLocaleId;
            break;
    }
    return fileName + '.js';
} 
