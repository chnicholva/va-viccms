//request_NoteUserStamp.js

function nus_NoteTextChange() {
    try {
        var nus_NoteDescription = Xrm.Page.getAttribute('description').getValue();
        if (nus_NoteDescription == null || nus_NoteDescription == "") { return false; }
        var nus_UserName = Xrm.Page.context.getUserName();
        var nus_CurrentDateTime = new Date();
        var nus_Hours = '00';
        if ((nus_CurrentDateTime.getHours()) < 10) {
            nus_Hours = '0' + (nus_CurrentDateTime.getHours()).toString();
        }
        else {
            nus_Hours = (nus_CurrentDateTime.getHours()).toString();
        }
        var nus_Minutes = '00';
        if ((nus_CurrentDateTime.getMinutes()) < 10) {
            nus_Minutes = '0' + (nus_CurrentDateTime.getMinutes()).toString();
        }
        else {
            nus_Minutes = (nus_CurrentDateTime.getMinutes()).toString();
        }
        var nus_Seconds = '00';
        if ((nus_CurrentDateTime.getSeconds()) < 10) {
            nus_Seconds = '0' + (nus_CurrentDateTime.getSeconds()).toString();
        }
        else {
            nus_Seconds = (nus_CurrentDateTime.getSeconds()).toString();
        }
        var nus_DateTimeStamp = (nus_CurrentDateTime.getMonth() + 1).toString() + "/" + nus_CurrentDateTime.getDate().toString() + "/" + nus_CurrentDateTime.getFullYear().toString() + " " + nus_Hours + ":" + nus_Minutes + ":" + nus_Seconds;
        var nus_StampedDescription = nus_NoteDescription + "\n" + nus_UserName + " " + nus_DateTimeStamp;
        Xrm.Page.getAttribute('description').setValue(nus_StampedDescription);
    }
    catch (err) {
        alert('Request Form Load Script Function Error(nus_NoteTextChange): ' + err.message);
    }
}