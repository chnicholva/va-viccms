//ViaServiceConnectorScriptLib.js
//Contains variables and functions used by the ViaServiceConnector.html page

var fieldOffset;

function getOffset(fieldName) {
    switch (fieldName) {
        case 'ftp_medalliaapipassword':
            fieldOffset = 7;
            break;
        case 'ftp_sharepointpassword_text':
            fieldOffset = 5;
            break;
        default:
            fieldOffset = 3;
            break;
    }

    return fieldOffset;
}

function field_KeyUp(fieldName) {
    try {
        //If any key was pressed, take the complete attribute string and convert to CRM storage array
        var fieldArray = [];
        var fieldString = document.getElementById(fieldName).value;

        fieldOffset = getOffset(fieldName);

        if (fieldString != null && fieldString != "") {
            for (var i = 0; i <= fieldString.length - 1; i++) {
                if (fieldArray.length == 0) { fieldArray.push((fieldString.charCodeAt(i) + fieldOffset)); }
                else {
                    fieldArray.push((fieldString.charCodeAt(i) + i + fieldOffset));
                }
            }
            //Reverse Array
            fieldArray.reverse();
        }
        //Update CRM form
        parent.Xrm.Page.getAttribute(fieldName).setValue(fieldArray.toString());
        parent.Xrm.Page.getAttribute(fieldName).setSubmitMode('always');
    }
    catch (err) {
        //Display Error
        alert('Script Failure Function(field_KeyUp: ' + fieldName + ') Error Detail: ' + err);
    }
}

function formLoad(fieldArray) {

    var fieldArray;
    var fieldString;
    var fieldNewArray = [];
    var fieldOffset;
    var curChar;

    try {
        //Load any existing CRM data
        var fields = fieldArray.split("||");

        for (n = 0; n < fields.length; n++) {

            fieldOffset = getOffset(fields[n]);

            fieldArray.length = 0;
            fieldNewArray.length = 0;

            if (parent.Xrm.Page.getAttribute(fields[n]).getValue() != null) {
                fieldArray = parent.Xrm.Page.getAttribute(fields[n]).getValue();
                fieldString = "";
                if (fieldArray != null && fieldArray != "") {
                    fieldNewArray = fieldArray.toString().split(',');
                    fieldNewArray.reverse();
                    for (i = 0; i < fieldNewArray.length; i++) {
                        curChar = "";
                        if (i == 0) {
                            curChar = fieldNewArray[i] - fieldOffset;
                        }
                        else {
                            curChar = fieldNewArray[i] - (i + fieldOffset);
                        }
                        fieldString = fieldString + String.fromCharCode(curChar);
                    }
                }
                document.getElementById(fields[n]).value = fieldString;
            }
        }
    }
    catch (err) {
        //Display Error
        alert('Medallia Credentials Script Failure Function(formLoad) Error Detail: ' + err);
    }
}