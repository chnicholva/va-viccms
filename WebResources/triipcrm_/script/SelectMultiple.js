/// <reference path="XrmServiceToolkit.js" />

var inputOptionSet;
var outputTextField;

// Function - On document ready
$(document).ready(function () {
    var functionName = "documentready";
    var data;
    var optionSetCollection;
    var queryString;
    var entity;
    try {
        // show loader
        showLoading(true);

        // get the querystring
        queryString = parseQueryString(window.location.search.substring(1));

        // Check if query string is not null or undefined else show respective alert message
        if (queryString != null && queryString != undefined && queryString != "undefined" && queryString["typename"] != null && queryString["typename"] != undefined && queryString["typename"] != "undefined") {

            // Check if input data parameters are provided else show respective alert message
            if (queryString["data"] != null && queryString["data"] != undefined && queryString["data"] != "undefined") {
                // get the data parameter from query string
                data = queryString["data"].split(",");

                // get the entity from querystring
                entity = queryString["typename"];

                // get the input and output fields names from data parameter
                inputOptionSet = data[0];
                outputTextField = data[1];

                // get the optionset data
                optionSetCollection = getOptionSet(entity, inputOptionSet);

                // populate multiSelect tag with optionset data
                populateSelect(optionSetCollection);

                // set the values from the multiline text field to select("multiselect" )
                setSelectOptions();

                // multiSelect on change event
                $('#multiSelect').change(function (e) {
                    onChangeMultiSelect(e, outputTextField);
                });
            }
            else {
                // Show alert message for missing required input parameters
                showAlertMessage("Please provide the Custom parameter(data) which is missing in the webresource.");
            }
        }
        else {
            // Show error message for missing required webresource settings in order to send input data as query string
            showAlertMessage("Please check if - \"Pass record object-type code and unique identifier as parameters\" property is checked in the webresource.");
        }
        // Hide loader
        showLoading(false);
    }
    catch (e) {
        // throw error
        throwError(e, functionName);
    }
});

// Function to show Alert message
function showAlertMessage(message) {
    var functionName = "showAlertMessage";
    try{
        Xrm.Utility.alertDialog("MultiSelect : " + message);
    }
    catch (e) {
        alert("MultiSelect : " + message);
    }
}

// Function to set the values from outputTextField to show selected in the Select options
function setSelectOptions()
{
    var functionName = "setSelectOptions";
    var selectedOptions;    
    try
    {
        // check if outputTextField is available
        if (parent.Xrm.Page.getAttribute(outputTextField) != null && parent.Xrm.Page.getAttribute(outputTextField) != undefined && parent.Xrm.Page.getAttribute(outputTextField) != "undefined") {

            // get the values of outputTextField field
            selectedOptions = parent.Xrm.Page.getAttribute(outputTextField).getValue();

            // check if value is not null or undefined
            if (selectedOptions != null && selectedOptions != undefined && selectedOptions != "undefined")
            {
                // replace the ";" seperated text with ","
                selectedOptions = selectedOptions.replace(/;/g, ",");
               
                // split the values using "," and loop through each and set it to the select options to show them selected
                $.each(selectedOptions.split(","), function (i, e) {
                    $("#multiSelect option[value='" + e + "']").prop("selected", true);
                });
            }
        }        
    }
    catch (e)
    {
        // throw error
        throwError(e, functionName);
    }
}

// Function to be called on OnChange event of select tag
function onChangeMultiSelect(e, outputTextField) {
    var functionName = "onChangeMultiSelect";
    try {
        // gets the selected values in a variable in comma seperated form, remove the first element which is "Select" using shift()
        var selected = $(e.target).val();
        
        // get the array items and join them using (;)
        if (selected != null && selected != undefined && selected != "undefined" && selected.length > 0) {
            if (parent.Xrm.Page.getAttribute(outputTextField) != null && parent.Xrm.Page.getAttribute(outputTextField) != undefined && parent.Xrm.Page.getAttribute(outputTextField) != "undefined") {
                // set the selected values in output field
                parent.Xrm.Page.getAttribute(outputTextField).setValue(selected.join(";"));
                // make the output field as dirty by setting its submitmode as 'always'
                parent.Xrm.Page.getAttribute(outputTextField).setSubmitMode("always");
            }
            else {
                showAlertMessage("The output text field is not present or removed from the form.");
            }
        }
        else {
            if (parent.Xrm.Page.getAttribute(outputTextField) != null && parent.Xrm.Page.getAttribute(outputTextField) != undefined && parent.Xrm.Page.getAttribute(outputTextField) != "undefined") {
                // No values selected so set the output field as empty
                parent.Xrm.Page.getAttribute(outputTextField).setValue("");
                // make the output field as dirty by setting its submitmode as 'always'
                parent.Xrm.Page.getAttribute(outputTextField).setSubmitMode("always");
            }
            else {
                showAlertMessage("The output text field is not present or removed from the form.");
            }
        }       
    }
    catch (e) {
        // throw error
        throwError(e, functionName);
    }
}

// Function to populate Select(multiSelect) tag with optionset data 
function populateSelect(optionSetCollection)
{
    var functionName = "populateSelect";
    try
    {
        // clear the multiselect options 
        $("#multiSelect").empty();

        // Bind the multiselect options with the optionset data
        for (var i in optionSetCollection)
        {
            $('#multiSelect').append($('<option>', {
                value: optionSetCollection[i].Label,
                text: optionSetCollection[i].Label,
                title: optionSetCollection[i].Label
            }));
        }
    }
    catch (e) {
        // throw error
        throwError(e, functionName);
    }
}

// Function to parse the querystring 
function parseQueryString(qstr) {
    var functionName = "parseQueryString";
    try
    {
        var query = {};
        var qString = qstr.split('&');
        for (var i in qString) {
            var keyValPair = qString[i].split('=');
            query[decodeURIComponent(keyValPair[0])] = decodeURIComponent(keyValPair[1]);
        }
    }
    catch (e)
    {
        // throw error
        throwError(e, functionName);
    }
    return query;
}

// Function to retrieve OptionSet value
function getOptionSet(entityName, attributeName) {
    var functionName = "getOptionSet";
    var optionSetCollection = [];
    try {       
            var optionset = XrmServiceToolkit.Soap.RetrieveAttributeMetadata(entityName, attributeName, true);
            //Check for optionset
            if (optionset != null && optionset != undefined && optionset != 'undefined' && optionset.length > 0) {
                //Check for OptionSet
                if (optionset[0].OptionSet != null && optionset[0].OptionSet != undefined && optionset[0].OptionSet != 'undefined') {
                    //// Add first option as Select 
                    //optionSetCollection[0] = { "Label": "Select", "Value": 0 };
                    //Check for   Options
                    if (optionset[0].OptionSet.Options != null && optionset[0].OptionSet.Options != undefined && optionset[0].OptionSet.Options != 'undefined') {
                        for (var i = 0; i < optionset[0].OptionSet.Options.length; i++) {
                            optionSetCollection[i] = {};
                            var value = null;
                            var label = '';
                            //Add logic for adding label and value in option set
                            //get value
                            if (optionset[0].OptionSet.Options[i].Value != 'undefined' && optionset[0].OptionSet.Options[i].Value != undefined) {
                                value = optionset[0].OptionSet.Options[i].Value;
                            }
                            //get label
                            if (optionset[0].OptionSet.Options[i].Label != null && optionset[0].OptionSet.Options[i].Label != 'undefined') {

                                //UserLocalizedLabel
                                if (optionset[0].OptionSet.Options[i].Label.UserLocalizedLabel != null && optionset[0].OptionSet.Options[i].Label.UserLocalizedLabel != 'undefined') {
                                    //Label
                                    if (optionset[0].OptionSet.Options[i].Label.UserLocalizedLabel.Label != null && optionset[0].OptionSet.Options[i].Label.UserLocalizedLabel.Label != 'undefined') {
                                        label = optionset[0].OptionSet.Options[i].Label.UserLocalizedLabel.Label;
                                    }

                                }
                                //if label not found in UserLocalizedLabel
                                if (label == '') {
                                    //LocalizedLabels
                                    if (optionset[0].OptionSet.Options[i].Label.LocalizedLabels != null && optionset[0].OptionSet.Options[i].Label.LocalizedLabels != 'undefined') {
                                        //Check if 0 th element present
                                        if (optionset[0].OptionSet.Options[i].Label.LocalizedLabels.length > 0) {
                                            if (optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0] != null && optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0] != undefined && optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0] != 'undefined') {
                                                //get label
                                                if (optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0].Label != null && optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0].Label != undefined && optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0].Label != 'undefined') {
                                                    label = optionset[0].OptionSet.Options[i].Label.LocalizedLabels[0].Label;
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                            optionSetCollection[i] = { "Label": label, "Value": value };
                        }

                    }
                }
            }
            
            return optionSetCollection;

    } catch (e) {
        throwError(functionName + (e.message || e.description));
    }

}

// Function to show loader
function showLoading(status) {
    var functionName = "showLoading";
    try
    {
        if (status == true) {
            $("#loader").show();
        }
        else {
            $("#loader").hide();
        }
    }
    catch (e) {
        throwError(functionName + (e.message || e.description));
    }
}


// Function to show the Error Message 
function throwError(error, functionName) {
    try {
        Xrm.Utility.alertDialog(functionName + " Error: " + (error.description || error.message));
        showLoading(false);
    } catch (e) {
        alert(functionName + " Error: " + (error.description || error.message));
        showLoading(false);
    }
}