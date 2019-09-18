//SecureWebPartHostScriptLib.js

//Static Variables
var swph_configObject = null;

var swph_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var swph_context = GetGlobalContext();
var swph_serverUrl = swph_context.getClientUrl();

var swph_DacUrl = null;
var swph_ChartSecureURLbase = null;
var swph_ChartURLbase = null;

var swph_VeteranICN = '';
var swph_ChartType = '';

/*
To the form pass the ICN/National Id plus comma and then the word for the secure chart to create, e.g.
data=69696V98989,AllergyChart  or sample
var svcUrl = context.getClientUrl() + "/WebResources/ftp_/WebServiceSecurityLib/SecureWebPartHost.html?data=" + configData.ICN + ",AllergyChart";
*/


function swph_getQueryVariable(swph_variable) {
    //deprecated 4/30/18
    try {
        //Get a Query Variable
        var swph_query = window.location.search.substring(1);
        var swph_vars = swph_query.split('&');
        for (var i = 0; i < swph_vars.length; i++) {
            var swph_pair = swph_vars[i].split('=');
            if (swph_pair[0] == swph_variable) {
                return swph_pair[1];
            }
        }
        //alert('A required Query Variable: ' + swph_variable + ' is missing!');
        return '';
    }
    catch (err) {
        alert("Secure Web Part Host Web Resource Function Error(swph_getQueryVariable): " + err.message);
    }
}

function swph_SettingsWebServiceURL_response(swph_settingData, swph_lastSkip, swph_optionArray_NA) {
    //deprecated 4/30/18
    try {
        //swph_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario

        var swph_ChartSecureUrl = null;  //Sample: "DEV/allergy/latest/"
        var swph_ChartUrl = null;  //Sample: "DEV/allergy/1.0/FtPCRM/"
        for (var i = 0; i <= swph_settingData.d.results.length - 1; i++) {
            //Get info
            if (swph_settingData.d.results[i].ftp_DACURL != null) { swph_DacUrl = swph_settingData.d.results[i].ftp_DACURL; }
            if (swph_ChartType == "AllergyChart") {
                if (swph_settingData.d.results[i].ftp_AllergyChartSecureURL != null) { swph_ChartSecureUrl = swph_settingData.d.results[i].ftp_AllergyChartSecureURL; }
                if (swph_settingData.d.results[i].ftp_AllergyChartURL != null) { swph_ChartUrl = swph_settingData.d.results[i].ftp_AllergyChartURL; }
            }
            break;
        }

        if (swph_DacUrl != null && swph_ChartSecureUrl != null && swph_ChartUrl != null) {
            //Construct full web service URLs
            swph_ChartSecureURLbase = swph_DacUrl + swph_ChartSecureUrl;
            swph_ChartURLbase = swph_DacUrl + swph_ChartUrl;

            //Construct Service Parameters
            var swph_idobject = {};
            swph_idobject.NationalId = '000000' + swph_VeteranICN + '000000';
            var swph_serviceParams = [{
                key: "identifier",
                type: "c:string",
                value: JSON.stringify(swph_idobject)
            }];
            //Call the web service security function
            CrmSecurityTokenEncryption(swph_ChartSecureURLbase, swph_serviceParams, swph_serverUrl, swph_getSecureChart_response)
        }
        else {
            alert("ERROR: THE CHART WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!");
        }
    }
    catch (err) {
        alert("Secure Web Part Host Web Resource Function Error(swph_SettingsWebServiceURL_response): " + err.message);
    }
}

function swph_FormLoad() {
    try {
    //debugger;
        //Get the passed nationalid variable and URL of secure chart
        swph_configObject = swph_parseDataParametersFromUrl(location.search);
        showChartLoadingGif();
        if (!!swph_configObject) {
            swph_VeteranICN = !!swph_configObject.ICN ? swph_configObject.ICN : "";
            swph_ChartSecureURLbase = !!swph_configObject.SecureWebPartURL ? swph_configObject.SecureWebPartURL : "";
            swph_DacUrl = !!swph_configObject.DACURL ? swph_configObject.DACURL : "";
            swph_setupSecureChartPOST();
        }
        else {
            alert("ERROR: COULD NOT CONSTRUCT CONFIG OBJECT ON PAGE, PLEASE CONTACT TECHNICAL SUPPORT!");
        }

        //rest of this function deprecated 4/30/18
        //var swph_xrmdata = swph_getQueryVariable("data");
        //if (swph_xrmdata == null || swph_xrmdata == '') {
        //    alert("Unable to load the requested chart, due to missing data parameters!");
        //    return false;
        //}
        //var swph_vals = swph_xrmdata.split(",", 2);
        //if (swph_vals.length > 1) {
        //    swph_VeteranICN = swph_vals[0];
        //    swph_ChartType = swph_vals[1];
        //}
        //else {
        //    alert("Unable to load the requested chart, due to missing data parameters!");
        //    return false;
        //}
        ////GET CRM SETTINGS WEB SERVICE URLS
        //var swph_conditionalFilter = "(mcs_name eq 'Active Settings')";
        //var swph_includeAttributes = "";
        //if (swph_ChartType == "AllergyChart") {
        //    swph_includeAttributes = 'ftp_DACURL, ftp_AllergyChartURL, ftp_AllergyChartSecureURL';
        //} else if(swph_ChartType == "DummyChart") {
        //    //Dummy
        //} else {
        //    alert("Unable to load the chart '" + swph_ChartType + "' it is not defined as a secure Web Part!");
        //    return false;
        //}

        //swph_getMultipleEntityDataAsync('mcs_settingSet', swph_includeAttributes, swph_conditionalFilter, 'mcs_name', 'asc', 0, swph_SettingsWebServiceURL_response, '');
    }
    catch (err) {
        alert("Secure Web Part Host Web Resource Function Error(swph_FormLoad): " + err.message);
    }
}

function swph_setupSecureChartPOST() {
    if (!!swph_VeteranICN) {
        if (!!swph_ChartSecureURLbase) {
            //Construct Service Parameters
            var swph_serviceParams = [{
                key: "identifier",
                type: "c:string",
                value: JSON.stringify({ NationalId: '000000' + swph_VeteranICN + '000000' })
            }];
            //Call the web service security function
			//comment out this line for hidden-form-submission method instead of HTTP POST
            CrmSecurityTokenEncryption(swph_ChartSecureURLbase, swph_serviceParams, swph_serverUrl, swph_getSecureChart_response); return;
			
			//submit a hidden form (only if the above line is commented out)
			CrmSecurityCallAction(
				"bah_requestserviceticketaction",
				swph_serviceParams,
				function (outputParams) {
					// Success
					for (var i = 0; i < outputParams.length; i++) {
						//alert(outputParams[i].key + "=" + outputParams[i].value);
						if(outputParams[i].key=='serviceticket') {
							var postdata = {};
							postdata.token = outputParams[i].value;
							$('#webpartform').attr('action', swph_ChartSecureURLbase);
							$('#token').attr('value',postdata.token);
							//submit the form
							$('#webpartform').submit();
						}
					}
				},
				function(e){console.log("error"); console.log(e);},
				swph_serverUrl
			);
        }
        else {
            alert("ERROR: THE CHART WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!");
        }
    }
    else {
        alert("ERROR: MISSING VETERAN ICN FOR CHART, PLEASE CONTACT TECHNICAL SUPPORT!");
    }
}

function swph_getSecureChart_response(swph_error, swph_getchartresponse) {
    try {
        //Check for errors
        if (swph_error != null) {
            alert("Secure Web Service Error: " + swph_error); return false;
        }
        //Replace WebPart URL's so that they point back to the correct server.
        var swph_baseReplacementUrl = swph_DacUrl.toUpperCase();
        swph_baseReplacementUrl = swph_baseReplacementUrl.replace("/WEBPARTS/", "");  //DEV/QA environment
        swph_baseReplacementUrl = swph_baseReplacementUrl.replace("/WEBPARTS25/", "");  //PROD environment
        //Fix CSS reference
        var swph_cssParameter = 'link href="' + swph_baseReplacementUrl;
        swph_getchartresponse = swph_getchartresponse.replace(/link href="/g, swph_cssParameter);
        //Fix Script reference
        var swph_scriptParameter = 'script src="' + swph_baseReplacementUrl;
        swph_getchartresponse = swph_getchartresponse.replace(/script src="/g, swph_scriptParameter);
        //Fix Popup reference
        var swph_popupParameter = "var url = '" + swph_ChartURLbase + swph_VeteranICN + "';";
        swph_getchartresponse = swph_getchartresponse.replace(/var url = window.location.href;/g, swph_popupParameter);
        //Fix custom Grid CSS reference
        var swph_cssGridParameter = 'link rel="stylesheet" href="' + swph_baseReplacementUrl;
        swph_getchartresponse = swph_getchartresponse.replace(/link rel="stylesheet" href="/g, swph_cssGridParameter);

        //Add additional logic so that USD will load page properly
        var swph_extraLoadScript = '<script type="text/javascript">' + 
            'if(parent.secureChartCounter == 0) {location.reload();}' +
            'parent.secureChartCounter = parent.secureChartCounter +1;' +
            '</script>' + 
            '</body>';
        swph_getchartresponse = swph_getchartresponse.replace("</body>", swph_extraLoadScript);

        //Update current page with web part HTML
        hideChartLoadingGif();
        document.write(swph_getchartresponse);        
    }
    catch (err) {
        alert("Secure Web Part Host Web Resource Function Error(swph_getSecureChart_response): " + err.message);
    }
}

function swph_executeCrmOdataGetRequest(swph_jsonQuery, swph_aSync, swph_aSyncCallback, swph_skipCount, swph_optionArray) {
    //deprecated 4/30/18

    //This function executes a CRM Odata web service call to retrieve Crm data
    //*swph_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*swph_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*swph_aSyncCallback* - specify the name of the return function to call upon completion (required if swph_aSync = true.  Otherwise '')
    //*swph_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*swph_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var swph_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: swph_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                swph_entityData = data;
                if (swph_aSync == true) {
                    swph_aSyncCallback(swph_entityData, swph_skipCount, swph_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in swph_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + swph_jsonQuery);
            },
            async: swph_aSync,
            cache: false
        });
        return swph_entityData;
    }
    catch (err) {
        alert('An error occured in the swph_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function swph_getMultipleEntityDataAsync(swph_entitySetName, swph_attributeSet, swph_conditionalFilter, swph_sortAttribute, swph_sortDirection, swph_skipCount, swph_aSyncCallback, swph_optionArray) {
    //deprecated 4/30/18

    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*swph_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*swph_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*swph_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*swph_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*swph_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*swph_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*swph_aSyncCallback* - is the name of the function to call when returning the result
    //*swph_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var swph_jsonQuery = swph_serverUrl + swph_crmOdataEndPoint + '/' + swph_entitySetName + '?$select=' + swph_attributeSet + '&$filter=' + swph_conditionalFilter + '&$orderby=' + swph_sortAttribute + ' ' + swph_sortDirection + '&$skip=' + swph_skipCount;
        swph_executeCrmOdataGetRequest(swph_jsonQuery, true, swph_aSyncCallback, swph_skipCount, swph_optionArray);
    }
    catch (err) {
        alert('An error occured in the swph_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function swph_parseDataParametersFromUrl(pQueryString) {
    //deprecated 4/30/18

    try{
        //example query string (unencoded): contactid={32CA1B55-DC81-E611-9445-0050568D743D}&fullname=TIFINKLE, ANDREW&sensitivity=true&IsUSD=true
        var fullParameterArray = pQueryString.substr(1).split("&");

        //clean up the URL query string and split each member into a key/value pair
        for (var i in fullParameterArray) {
            fullParameterArray[i] = fullParameterArray[i].replace(/\+/g, " ").split("=");
        }

        var customDataString = "";
        for (var i in fullParameterArray) {
            if (fullParameterArray[i][0].toLowerCase() == "data") {
                customDataString = fullParameterArray[i][1];
                break;
            }
        }

        var customDataArray = decodeURIComponent(customDataString).split("&");
        for (var i in customDataArray) {
            customDataArray[i] = customDataArray[i].replace(/\+/g, " ").split("=");
        }

        var configObject = {};
        for (var i in customDataArray) {
            configObject[customDataArray[i][0]] = customDataArray[i][1];
        }

        //optionally, put code here to show body once we have the config object, if it's taking too long
        return configObject;
    }
    catch (e) {
        alert("Error parsing data parameters from URL");
        return null;
    }
}

function showChartLoadingGif() {
    if (typeof parent.showLoadingMessage == "function") {
        parent.showLoadingMessage();
    }
}
function hideChartLoadingGif() {
    if (typeof parent.showDiv == "function") {
        parent.showDiv("#framediv");
    }
}