function doPageLoad() {
    //query uii_option entity for records named MHVTermsVersionNumber and MHVTCText
    var retrievedOptions = [];
    SDK.REST.retrieveMultipleRecords(
        "uii_option",
        "$filter=uii_name eq 'MHVTermsVersionNumber' or uii_name eq 'MHVTCText'&$select=uii_name,uii_value",
        function (retrievedRecords) {
            if (!!retrievedRecords && retrievedRecords.length > 0) retrievedOptions = retrievedOptions.concat(retrievedRecords);
        },
        function (e) {

        },
        function () {
            if (retrievedOptions.length > 0) {
                var versionNumber = retrievedOptions[ArrayIndexOfObjectByAttribute(retrievedOptions, "uii_name", "MHVTermsVersionNumber")].uii_value;
                var termsText = retrievedOptions[ArrayIndexOfObjectByAttribute(retrievedOptions, "uii_name", "MHVTCText")].uii_value;
                renderPage(versionNumber, termsText);
            }
        }
    );
}

function renderPage(pVersionNumber, pText) {
    document.getElementById("TCHeader").innerHTML = "<h1>MHV Terms and Conditions " + pVersionNumber + "</h1>";
    document.getElementById("TCContent").innerHTML = pText;

}

function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    for (var i = 0; i < pArray.length; i += 1) {
        if (pArray[i][pAttr] === pValue) {
            return i;
        }
    }
    return -1;
}