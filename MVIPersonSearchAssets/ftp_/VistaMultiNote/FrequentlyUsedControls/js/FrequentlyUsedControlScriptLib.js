//FrequentlyUsedControlScriptLib.js

var freq_query = null;

function freq_formLoad() {
    try {
        //Initialize content
        freq_query = decodeURI(window.location.search.substring(1));  //Get Query URL
        freq_queryArray = freq_query.split("&");  //Remove non data element
        freq_query = freq_queryArray[0];
        //Get the button name, title (tooltip), value (buttontext)  (The name should not have spaces or special characters).
        //Format is Name~~Title~~Value  as a text string
        freq_query = freq_query.replace("data=", "");
        freq_query = freq_query.split("~~");
        //Verify array length of 3
        if (freq_query.length < 3) {
            alert("The Frequently Used button definition of '" + freq_query + "' is undefined, please update your web resource data, to have a button name, tooltip text and button text, separated by '~~'.");
            //Disable button and set text to UNDEFINED ACTION
            document.getElementById('btnAction').disabled = true;
            document.getElementById("btnAction").value = "*UNDEFINED ACTION*";
            return false;
        }
        //Disable button if entity form is read only
        if (parent.Xrm.Page.ui.getFormType() >= 3) {
            document.getElementById('btnAction').disabled = true;
        }
        //Set button title/tooltip, value/text
        document.getElementById("btnAction").title = freq_query[1];
        document.getElementById("btnAction").value = freq_query[2];
        if (freq_query.length > 3) {
            document.body.style.marginTop = freq_query[3];
        }
    }
    catch (err) {
        alert('Frequently Used Control Script Function Error(freq_formLoad): ' + err.message);
    }
}

function freq_buttonClick() {
    try {
        //Call related function on parent form
        parent.Xrm.Utility.freq_buttonAction(freq_query[0]);
    }
    catch (err) {
        alert('Frequently Used Control Script Function Error(freq_buttonClick): ' + err.message);
    }
}