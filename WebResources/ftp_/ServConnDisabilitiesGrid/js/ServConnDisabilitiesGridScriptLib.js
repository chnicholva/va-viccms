/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />
/// <reference path='../../triipcrm_/TR_KU_V2015_2_902/js/kendo.all.min.js' />
/// <reference path="SampleJsonData.js" />
/// <reference path="../../ftp_/WebServiceSecurityLib/js/WebServiceSecurityLibrary.js" />

//ServConnDisabilitiesGridScriptLib.js
//Contains variables and functions used by the ServConnDisabilitiesGrid.html page

//Static Variables
var scdg_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var scdg_context = GetGlobalContext();
var scdg_serverUrl = scdg_context.getClientUrl();

//var scdg_EnrollmentEligibilitySummaryURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/esr/EnrollmentEligibilitySummary/2.0/json/';  //OLD MANUAL DEV URL
var scdg_eesummaryURLbase = '';
var scdg_EnrollmentEligibilitySummaryURLbase = '';
//Set Default Service Return value = null
var scdg_EnrollmentEligibilitySummaryData = null;

function callAction(action, data, callback, errHandler) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    // specify name of the entity, record id and name of the action in the Wen API Url
    req.open("POST", serverURL + "/api/data/v9.0/" + action, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200 && this.response != null) {
                var res = JSON.parse(this.response);
                callback(res);
            }
            else {
                if (this.response != null && this.response != "") {
                    var error = JSON.parse(this.response).error;
                    errHandler(error.message);
                }
            }
        }
    };
    // send the request with the data for the input parameter
    req.send(window.JSON.stringify(data));
}
function scdg_getQueryVariable(scdg_variable) {
    try {
        //Get a Query Variable
        var scdg_query = window.location.search.substring(1);
        var scdg_vars = scdg_query.split('&');
        for (var i = 0; i < scdg_vars.length; i++) {
            var scdg_pair = scdg_vars[i].split('=');
            if (scdg_pair[0] == scdg_variable) {
                return scdg_pair[1];
            }
        }
        //alert('A required Query Variable: ' + scdg_variable + ' is missing!');
        return '';
    }
    catch (err) {
        alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_getQueryVariable): " + err.message);
    }
}

function scdg_SettingsWebServiceURL_response(scdg_settingData, scdg_lastSkip, scdg_eesummaryURLbase_NA) {
    try {
        var scdg_xrmdata = scdg_getQueryVariable("data");
        //'000000' + scdg_xrmdata + '000000'
        var data =
        {
            "Request": scdg_xrmdata
            //"Request": '000000' + scdg_xrmdata + '000000'
        }
        callAction("ftp_EnrollmentEligibilityAction", data, scdg_getEsrEnrollmentJSON_response, function (err) { alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_SettingsWebServiceURL_response): " + err.message); });
    }
    catch (err) {
        alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_SettingsWebServiceURL_response): " + err.message);
    }
}
function scdg_getEsrEnrollmentJSON_response(data) {
    try {
        //NOTE:Expecting JSON result, if changed to XML modify code accordingly.

        //Set JSON Data to Null;
        scdg_EnrollmentEligibilitySummaryData = JSON.parse(data.Response);;
        if (scdg_EnrollmentEligibilitySummaryData.ErrorOccurred == true && scdg_EnrollmentEligibilitySummaryData.ErrorMessage != "") {
            alert("An ESR Secure Service error occured:\n " + scdg_EnrollmentEligibilitySummaryData.ErrorMessage);
        }
        else {
            scdg_BuildGrid();
        }
    }
    catch (err) {
        alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_getEsrEnrollmentJSON_response): " + err.message);
    }
}

function scdg_FormLoad() {
    try {
        //GET CRM SETTINGS WEB SERVICE URLS
        var scdg_conditionalFilter = "(mcs_name eq 'Active Settings')";
        scdg_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_ESREnrollmentEligibilitySummaryAPIURL', scdg_conditionalFilter, 'mcs_name', 'asc', 0, scdg_SettingsWebServiceURL_response, scdg_eesummaryURLbase);
    }
    catch (err) {
        alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_FormLoad): " + err.message);
    }
}

function scdg_BuildGrid() {
    try {
        //Temporary action: json result is empty, use sample data
        //**********************************************************************************************************************
        //if (scdg_EnrollmentEligibilitySummaryData == null || scdg_EnrollmentEligibilitySummaryData == '') { scdg_EnrollmentEligibilitySummaryData = json_result2[0]; }
        //**********************************************************************************************************************

        //Define Grids
        //Define the main grid
        $('#ku_disabilitygrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'type', title: 'Eligibility', type: 'string' },
                { field: 'enrollmentCategoryName', title: 'Status', type: 'string' },
                { field: 'ratedDisabilityPercentageTotal', title: 'SC% (total)', type: 'string' },
                { field: 'envContaminantsInd', title: 'Environmental Contaminant', type: 'string' },
                { field: 'radiationExposureInd', title: 'Radiation Exposure', type: 'string' },
                { field: 'agentOrangeInd', title: 'Agent Orange', type: 'string' },
                { field: 'campLejeuneInd', title: 'Camp Lejeune', type: 'string' },
                { field: 'diagnosedWithCancer', title: 'Head/Neck Cancer', type: 'string' },
                { field: 'militarySexualTrauma', title: 'Military Sexual Trauma', type: 'string' },
                { field: 'combatVeteran', title: 'Combat Veteran', type: 'string' },
                { field: 'shadIndicator', title: 'Shipboard Hazard & Defense', type: 'string' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },
            groupable: false,
            sortable: false,
            editable: false,
            height: 130,
            resizable: true,
            navigatable: true,
            selectable: false,
            noRecords: true
        });
        //Define the detail grid
        $('#ku_disabilitydetailgrid').kendoGrid({
            columns: [
                { field: 'ID', type: 'string', hidden: true },
                { field: 'disability', title: 'Individual Disability', type: 'string' },
                { field: 'percentage', title: 'SC%', type: 'string' }
            ],
            dataSource: {
                schema: {
                    model: {
                        id: 'ID'
                    }
                }
            },
            groupable: false,
            sortable: false,
            editable: false,
            height: 200,
            resizable: true,
            navigatable: true,
            selectable: false,
            noRecords: true
        });

        //Create disabilty grid datasource
        var scdg_disabilityGrid = $('#ku_disabilitygrid').data('kendoGrid');
        //Create disabilty detail grid datasource
        var scdg_disabilitydetailGrid = $('#ku_disabilitydetailgrid').data('kendoGrid');

        //Data from parentnode 'enrollmentDeterminationInfo' 
        var $scdg_enrollmentDeterminationInfo = null;
        var $scdg_primaryEligibility = null;
        var $scdg_type = null;
        var scdg_typeText = null;
        var $scdg_enrollmentCategoryName = null;
        var scdg_enrollmentCategoryNameText = null;
        var $scdg_specialFactors = null;
        var $scdg_envContaminantsInd = null;
        var scdg_envContaminantsIndText = null;
        var $scdg_radiationExposureInd = null;
        var scdg_radiationExposureIndText = null;
        var $scdg_agentOrangeInd = null;
        var scdg_agentOrangeIndText = null;
        var $scdg_campLejeuneInd = null;
        var scdg_campLejeuneIndText = null;
        var $scdg_serviceConnectionAward = null;
        var $scdg_serviceConnectedPercentage = null;
        var scdg_serviceConnectedPercentageText = null;
        var $scdg_ratedDisabilities = null;

        var $scdg_agentOrangeLocation = null;
        var scdg_agentOrangeLocationText = null;
        var $scdg_radiationExposureMethod = null;
        var scdg_radiationExposureMethodText = null;

        var $scdg_noseThroatRadiumInfo = null;
        var $scdg_diagnosedWithCancer = null;
        var scdg_diagnosedWithCancerText = null;

        var $scdg_militarySexualTraumaInfo = null;
        var $scdg_milSexTraumaStatus = null;
        var scdg_milSexTraumaStatusText = null;

        //Data from parentnode 'militaryServiceInfo' 
        var $scdg_militaryServiceInfo = null;
        var $scdg_combatVeteranEligibilityEndDate = null;
        var scdg_combatVeteranEligibilityEndDateText = null;
        var $scdg_shadIndicator = null;
        var scdg_shadIndicatorText = null;

        var scdg_ratedDisabilityPercentageTotal = 0;
        var scdg_detailrowcount = 0;

        if (scdg_EnrollmentEligibilitySummaryData != null) {
            $scdg_enrollmentDeterminationInfo = scdg_EnrollmentEligibilitySummaryData.Data.EnrollmentDeterminationInfo;
        }

        if ($scdg_enrollmentDeterminationInfo != null) {
            $scdg_primaryEligibility = $scdg_enrollmentDeterminationInfo.PrimaryEligibility;
            if ($scdg_primaryEligibility != null) {
                $scdg_type = $scdg_primaryEligibility.Type;
                if ($scdg_type != null) { scdg_typeText = $scdg_type; }
            }
            $scdg_enrollmentCategoryName = $scdg_enrollmentDeterminationInfo.EnrollmentCategoryName;
            if ($scdg_enrollmentCategoryName != null) { scdg_enrollmentCategoryNameText = $scdg_enrollmentCategoryName; }

            $scdg_specialFactors = $scdg_enrollmentDeterminationInfo.SpecialFactors;
            if ($scdg_specialFactors != null) {
                $scdg_envContaminantsInd = $scdg_specialFactors.EnvContaminantsInd;
                if ($scdg_envContaminantsInd != null) { scdg_envContaminantsIndText = $scdg_envContaminantsInd; }

                $scdg_radiationExposureInd = $scdg_specialFactors.RadiationExposureInd;
                if ($scdg_radiationExposureInd != null) { scdg_radiationExposureIndText = $scdg_radiationExposureInd; }

                $scdg_agentOrangeInd = $scdg_specialFactors.AgentOrangeInd;
                if ($scdg_agentOrangeInd != null) { scdg_agentOrangeIndText = $scdg_agentOrangeInd; }

                $scdg_campLejeuneInd = $scdg_specialFactors.CampLejeuneInd;
                if ($scdg_campLejeuneInd != null) { scdg_campLejeuneIndText = $scdg_campLejeuneInd; }

                $scdg_agentOrangeLocation = $scdg_specialFactors.AgentOrangeLocation;
                if ($scdg_agentOrangeLocation != null) { scdg_agentOrangeLocationText = $scdg_agentOrangeLocation; }

                $scdg_radiationExposureMethod = $scdg_specialFactors.RadiationExposureMethod;
                if ($scdg_radiationExposureMethod != null) { scdg_radiationExposureMethodText = $scdg_radiationExposureMethod; }
            }

            $scdg_serviceConnectionAward = $scdg_enrollmentDeterminationInfo.ServiceConnectionAward;
            if ($scdg_serviceConnectionAward != null) {
                $scdg_serviceConnectedPercentage = $scdg_serviceConnectionAward.ServiceConnectedPercentage;
                if ($scdg_serviceConnectedPercentage != null) { scdg_serviceConnectedPercentageText = $scdg_serviceConnectedPercentage; }

                $scdg_ratedDisabilities = $scdg_serviceConnectionAward.RatedDisabilities;
                //Get each disability listed
                for (var i = 0; !!$scdg_ratedDisabilities && Array.isArray($scdg_ratedDisabilities.RatedDisability) && i <= $scdg_ratedDisabilities.RatedDisability.length - 1; i++) {
                    var scdg_ratedDisabilityPercent = 0;
                    var scdg_disability = null;
                    if (Number($scdg_ratedDisabilities.RatedDisability[i].Percentage) > 0) {
                        scdg_ratedDisabilityPercentageTotal = scdg_ratedDisabilityPercentageTotal + Number($scdg_ratedDisabilities.RatedDisability[i].Percentage);
                        scdg_ratedDisabilityPercent = Number($scdg_ratedDisabilities.RatedDisability[i].Percentage);
                    }

                    //Add to detail grid
                    scdg_detailrowcount = scdg_detailrowcount + 1;
                    scdg_disabilitydetailGrid.dataSource.pushCreate({
                        ID: scdg_detailrowcount,
                        disability: $scdg_ratedDisabilities.RatedDisability[i].Disability,
                        percentage: scdg_ratedDisabilityPercent
                    });
                };
            }

            $scdg_noseThroatRadiumInfo = $scdg_enrollmentDeterminationInfo.NoseThroatRadiumInfo;
            if ($scdg_noseThroatRadiumInfo != null) {
                $scdg_diagnosedWithCancer = $scdg_noseThroatRadiumInfo.DiagnosedWithCancer;
                if ($scdg_diagnosedWithCancer != null) { scdg_diagnosedWithCancerText = $scdg_diagnosedWithCancer; }
            }

            $scdg_militarySexualTraumaInfo = $scdg_enrollmentDeterminationInfo.MilitarySexualTraumaInfo;
            if ($scdg_militarySexualTraumaInfo != null) {
                $scdg_milSexTraumaStatus = $scdg_militarySexualTraumaInfo.Status;
                if ($scdg_milSexTraumaStatus != null) { scdg_milSexTraumaStatusText = $scdg_milSexTraumaStatus; }
            }
        }

        if (scdg_EnrollmentEligibilitySummaryData != null) {
            $scdg_militaryServiceInfo = scdg_EnrollmentEligibilitySummaryData.Data.MilitaryServiceInfo;
        }
        if ($scdg_militaryServiceInfo != null) {
            $scdg_combatVeteranEligibilityEndDate = $scdg_militaryServiceInfo.CombatVeteranEligibilityEndDate;
            if ($scdg_combatVeteranEligibilityEndDate != null) {
                scdg_combatVeteranEligibilityEndDateText = scdg_combatVeteranEligibilityEndDateText = $scdg_combatVeteranEligibilityEndDate;
            }
            $scdg_shadIndicator = $scdg_militaryServiceInfo.ShadIndicator;
            if ($scdg_shadIndicator != null) { scdg_shadIndicatorText = $scdg_shadIndicator; }
        }

        //If no eligibility specified, set to false
        if (scdg_typeText == null || scdg_typeText == '') { scdg_typeText = false; }

        //Change boolean values to false if not marked true
        if (scdg_envContaminantsIndText != 'true') { scdg_envContaminantsIndText = false; }
        if (scdg_radiationExposureIndText != 'true') { scdg_radiationExposureIndText = false; }
        if (scdg_agentOrangeIndText != 'true') { scdg_agentOrangeIndText = false; }
        if (scdg_campLejeuneIndText != 'true') { scdg_campLejeuneIndText = false; }

        if (scdg_diagnosedWithCancerText != 'true') { scdg_diagnosedWithCancerText = false; }
        if (scdg_shadIndicatorText != 'true') { scdg_shadIndicatorText = false; }

        //Change all True/False to Yes/No and Hide No columns
        if (scdg_typeText == false) { scdg_typeText = 'No'; }

        if (scdg_envContaminantsIndText == "true") { scdg_envContaminantsIndText = "Yes"; } else { scdg_envContaminantsIndText = "No"; scdg_disabilityGrid.hideColumn("envContaminantsInd"); }
        if (scdg_radiationExposureIndText == "true") {
            scdg_radiationExposureIndText = "Yes";
            if (scdg_radiationExposureMethodText != null) { scdg_radiationExposureIndText = scdg_radiationExposureIndText + " - " + scdg_radiationExposureMethodText; }
        } else {
            scdg_radiationExposureIndText = "No"; scdg_disabilityGrid.hideColumn("radiationExposureInd");
        }
        if (scdg_agentOrangeIndText == "true") {
            scdg_agentOrangeIndText = "Yes";
            if (scdg_agentOrangeLocationText != null) { scdg_agentOrangeIndText = scdg_agentOrangeIndText + " - " + scdg_agentOrangeLocationText; }
        }
        else {
            scdg_agentOrangeIndText = "No"; scdg_disabilityGrid.hideColumn("agentOrangeInd");
        }
        if (scdg_campLejeuneIndText == "true") { scdg_campLejeuneIndText = "Yes"; } else { scdg_campLejeuneIndText = "No"; scdg_disabilityGrid.hideColumn("campLejeuneInd"); }

        if (scdg_diagnosedWithCancerText == "true") { scdg_diagnosedWithCancerText = "Yes"; } else { scdg_diagnosedWithCancerText = "No"; scdg_disabilityGrid.hideColumn("diagnosedWithCancer"); }

        if (scdg_milSexTraumaStatusText == null || scdg_milSexTraumaStatusText == '') { scdg_disabilityGrid.hideColumn("militarySexualTrauma"); }

        if (scdg_combatVeteranEligibilityEndDateText != null && scdg_combatVeteranEligibilityEndDateText != '') { scdg_combatVeteranEligibilityEndDateText = 'Yes'; } else { scdg_disabilityGrid.hideColumn("combatVeteran"); }

        if (scdg_shadIndicatorText == "true") { scdg_shadIndicatorText = "Yes"; } else { scdg_shadIndicatorText = "No"; scdg_disabilityGrid.hideColumn("shadIndicator"); }

        //Update disability main grid data
        scdg_disabilityGrid.dataSource.pushCreate({
            ID: '01',
            type: scdg_typeText,
            enrollmentCategoryName: scdg_enrollmentCategoryNameText,
            ratedDisabilityPercentageTotal: scdg_serviceConnectedPercentageText,
            envContaminantsInd: scdg_envContaminantsIndText,
            radiationExposureInd: scdg_radiationExposureIndText,
            agentOrangeInd: scdg_agentOrangeIndText,
            campLejeuneInd: scdg_campLejeuneIndText,
            diagnosedWithCancer: scdg_diagnosedWithCancerText,
            militarySexualTrauma: scdg_milSexTraumaStatusText,
            combatVeteran: scdg_combatVeteranEligibilityEndDateText,
            shadIndicator: scdg_shadIndicatorText
        });

        //Hide the details grid if the SC% total = 0
        if (scdg_ratedDisabilityPercentageTotal == 0 || scdg_ratedDisabilityPercentageTotal == null || scdg_ratedDisabilityPercentageTotal == '') {
            $('#ku_disabilitydetailgrid').hide();
        }

    }
    catch (err) {
        alert("Service Connected Disabilities Grid Web Resource Function Error(scdg_BuildGrid): " + err.message);
    }
}


function scdg_executeCrmOdataGetRequest(scdg_jsonQuery, scdg_aSync, scdg_aSyncCallback, scdg_skipCount, scdg_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*scdg_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*scdg_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*scdg_aSyncCallback* - specify the name of the return function to call upon completion (required if scdg_aSync = true.  Otherwise '')
    //*scdg_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*scdg_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var scdg_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: scdg_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                scdg_entityData = data;
                if (scdg_aSync == true) {
                    scdg_aSyncCallback(scdg_entityData, scdg_skipCount, scdg_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in scdg_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + scdg_jsonQuery);
            },
            async: scdg_aSync,
            cache: false
        });
        return scdg_entityData;
    }
    catch (err) {
        alert('An error occured in the scdg_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function scdg_getMultipleEntityDataAsync(scdg_entitySetName, scdg_attributeSet, scdg_conditionalFilter, scdg_sortAttribute, scdg_sortDirection, scdg_skipCount, scdg_aSyncCallback, scdg_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*scdg_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*scdg_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*scdg_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*scdg_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*scdg_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*scdg_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*scdg_aSyncCallback* - is the name of the function to call when returning the result
    //*scdg_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var scdg_jsonQuery = scdg_serverUrl + scdg_crmOdataEndPoint + '/' + scdg_entitySetName + '?$select=' + scdg_attributeSet + '&$filter=' + scdg_conditionalFilter + '&$orderby=' + scdg_sortAttribute + ' ' + scdg_sortDirection + '&$skip=' + scdg_skipCount;
        scdg_executeCrmOdataGetRequest(scdg_jsonQuery, true, scdg_aSyncCallback, scdg_skipCount, scdg_optionArray);
    }
    catch (err) {
        alert('An error occured in the scdg_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}