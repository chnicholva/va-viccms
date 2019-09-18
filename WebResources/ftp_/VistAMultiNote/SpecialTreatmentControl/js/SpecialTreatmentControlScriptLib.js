/// <reference path='../../../triipcrm_/TR_KU_V2015_2_902/js/jquery.min.js' />
/// <reference path="SampleJsonData.js" />
/// <reference path="../../../ftp_/WebServiceSecurityLib/js/WebServiceSecurityLibrary.js" />

//SpecialTreatmentControlScriptLib.js

//Contains variables and functions used by the SpecialTreatmentControl.html page

//Static Variables
var sptr_crmOdataEndPoint = '/XRMServices/2011/OrganizationData.svc';
var sptr_context = GetGlobalContext();
var sptr_serverUrl = sptr_context.getClientUrl();

//var sptr_EnrollmentEligibilitySummaryURLbase = 'https://qacrmdac.np.crm.vrm.vba.va.gov/WebParts/DEV/api/esr/EnrollmentEligibilitySummary/2.0/json/';  //OLD MANUAL DEV URL
var sptr_eesummaryURLbase = '';
var sptr_EnrollmentEligibilitySummaryURLbase = '';
//Set Default Service Return value = null
var sptr_EnrollmentEligibilitySummaryData = null;
var sptr_regardingobjectid = null;
var sptr_tanConfiguration = false;

function sptr_SettingsWebServiceURL_response(sptr_settingData, sptr_lastSkip, sptr_eesummaryURLbase_NA) {
    try {
        //sptr_lastSkip is the starting point in the result (use if more than 50 records) //Not used in this scenario
        var sptr_DacUrl = null;
        var sptr_EnrollmentEligibilitySummaryApiUrl = null;
        for (var i = 0; i <= sptr_settingData.d.results.length - 1; i++) {
            //Get info
            if (sptr_settingData.d.results[i].ftp_DACURL != null) { sptr_DacUrl = sptr_settingData.d.results[i].ftp_DACURL; }
            if (sptr_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL != null) { sptr_EnrollmentEligibilitySummaryApiUrl = sptr_settingData.d.results[i].ftp_ESREnrollmentEligibilitySummaryAPIURL; }
            break;
        }

        if (sptr_DacUrl != null && sptr_EnrollmentEligibilitySummaryApiUrl != null) {
            //Construct full web service URL
            sptr_EnrollmentEligibilitySummaryURLbase = sptr_DacUrl + sptr_EnrollmentEligibilitySummaryApiUrl;

            //Get the Related Request Id (Support control for progress note entity and request/incident entity only)
            var sptr_entityName = parent.Xrm.Page.data.entity.getEntityName();
            if (sptr_entityName == 'incident') {
                //Process incident record and get the current id
                var sptr_requestId = parent.Xrm.Page.data.entity.getId();
                if (sptr_requestId != null && sptr_requestId != "") {
                    sptr_regardingobjectid = sptr_requestId;
                }
                else { return false; }
            }
            else {
                var sptr_requestId = parent.Xrm.Page.getAttribute('regardingobjectid').getValue();
                if (sptr_requestId == null) {
                    alert("ERROR: THE CURRENT PROGRESS NOTE DOES NOT HAVE A REQUEST IDENTIFIER, DISABILITY DATA CANNOT BE DISPLAYED, PLEASE CONTACT TECHNICAL SUPPORT!");
                    return false;
                }
                sptr_regardingobjectid = sptr_requestId[0].id;
            }

            var sptr_veteranId = null;  //From request customerid

            var sptr_requestData = sptr_getSingleEntityDataSync('IncidentSet', 'CustomerId', sptr_regardingobjectid);
            if (sptr_requestData != null) {
                if (sptr_requestData.d.CustomerId != null) {
                    //Set as veteran id
                    sptr_veteranId = sptr_requestData.d.CustomerId.Id
                }
            }

            //Get ICN via web service and get Service Connected disabilities, Appointments and Medications thereafter
            //Preserved Variables
            var sptr_veteranFirstName = '';
            var sptr_veteranLastName = '';
            var sptr_SSN = '';
            var sptr_DOB = '';

            if (sptr_veteranId != null) {
                //Get data for ICN lookup
                var sptr_contactData = sptr_getSingleEntityDataSync('ContactSet', 'FirstName, LastName, ftp_DateofBirth, GovernmentId', sptr_veteranId);
                if (sptr_contactData != null) {
                    if (sptr_contactData.d.FirstName != null) { sptr_veteranFirstName = sptr_contactData.d.FirstName; }
                    if (sptr_contactData.d.LastName != null) { sptr_veteranLastName = sptr_contactData.d.LastName; }
                    if (sptr_contactData.d.ftp_DateofBirth != null) { sptr_DOB = sptr_contactData.d.ftp_DateofBirth; }
                    if (sptr_contactData.d.GovernmentId != null) { sptr_SSN = sptr_contactData.d.GovernmentId; }
                }

                //Perform MVI Search for Service Connected Disabilities
                sptr_unattendedMviSearchSCD(sptr_veteranFirstName, sptr_veteranLastName, sptr_DOB, sptr_SSN);
            }
            else {
                alert("ERROR: UNABLE TO OBTAIN VETERAN DATA, DISABILITY DATA CANNOT BE DISPLAYED, PLEASE CONTACT TECHNICAL SUPPORT!");
                return false;
            }
        }
        else {
            alert("ERROR: THE ENROLLMENT ELIGIBILITY SUMMARY WEB SERVICE URL IS MISSING, PLEASE CONTACT TECHNICAL SUPPORT!");
        }
    }
    catch (err) {
        alert("Special Treatment Control Grid Web Resource Function Error(sptr_SettingsWebServiceURL_response): " + err.message);
    }
}

function sptr_unattendedMviSearchSCD(firstname, lastname, dobdate, ssn) {
    try {
        var filter = "";
        var filterPrefix = "$select=*&$filter=";
        var edipi = "";
        var dobstring = "";
        if (dobdate != null) {
            dobstring = dobdate;
        }

        if (ssn != "" && ssn != null) {
            ssn = ssn.replace(/-/g, "");
        }

        //if we have edipi, search using just it
        if (edipi != "") {
            filter = sptr_buildQueryFilterSCD("crme_EDIPI", edipi, false);
            filter += sptr_buildQueryFilterSCD("crme_ClassCode", 'MIL', true);
            filter += sptr_buildQueryFilterSCD("crme_SearchType", 'SearchByIdentifier', true);

            //set search type as unattended
            filter += " and crme_IsAttended eq false";
        }
        else {
            //otherwise search using lastname, firstname, ssn, dob
            filter = sptr_buildQueryFilterSCD("crme_LastName", lastname, false); //assuming lastname will never be blank

            if (firstname != "" && firstname != null) {
                filter += sptr_buildQueryFilterSCD("crme_FirstName", firstname, true);
            }

            if (ssn != "" && ssn != null) {
                filter += sptr_buildQueryFilterSCD("crme_SSN", ssn, true);
            }

            if (dobstring != "") {
                filter += " and crme_DOBString eq '" + dobstring + "'";
            }
            filter += sptr_buildQueryFilterSCD("crme_SearchType", 'SearchByFilter', true);

            //set search type as attended (for now)
            filter += " and crme_IsAttended eq true";
        }

        filter = encodeURIComponent(filter);
        filter = filterPrefix + filter;
        SDK.REST.retrieveMultipleRecords("crme_person", filter, sptr_unattendedMviSearchCallbackSCD, function (error) { alert(error.message); sptr_getServiceConnectedDisabilities(""); }, sptr_unattendedMviSearchComplete);
    }
    catch (err) {
        alert('Special Treatment Control Grid Web Resource Function Error(sptr_unattendedMviSearchSCD): ' + err.message);
    }
}

function sptr_unattendedMviSearchComplete() {
    //do nothing
}

function sptr_buildQueryFilterSCD(field, value, and) {
    try {
        if (value == '') {
            if (and) {
                return " and " + field + " eq null";
            } else {
                return field + " eq null";
            }
        }
        else {
            if (and) {
                return " and " + field + " eq '" + value + "'";
            } else {
                return field + " eq '" + value + "'";
            }
        }
    }
    catch (err) {
        alert('Special Treatment Control Grid Web Resource Function Error(sptr_buildQueryFilterSCD): ' + err.message);
    }
}

function sptr_unattendedMviSearchCallbackSCD(returnData) {
    try {
        if (returnData != null && returnData.length >= 1) {
            // check for exceptions 1st
            if (returnData[0].crme_ExceptionOccured || (returnData[0].crme_ReturnMessage != null && returnData[0].crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")) {
                //do nothing, pass empty ICN
                sptr_getServiceConnectedDisabilities("");
            }
            else {
                var patientMviIdentifier = returnData[0].crme_PatientMviIdentifier == null ? "" : returnData[0].crme_PatientMviIdentifier;
                if (patientMviIdentifier != "") {
                    var idparts = patientMviIdentifier.split("^");

                    if (idparts.length > 0) {
                        var nationalId = idparts[0];
                        _icn = nationalId;
                        //Pass on the ICN and continue with SCD
                        sptr_getServiceConnectedDisabilities(_icn);
                    }
                }
            }
        }
        else {
            //Return empty ICN
            sptr_getServiceConnectedDisabilities("");
        }
    }
    catch (err) {
        alert('Special Treatment Control Grid Web Resource Function Error(sptr_unattendedMviSearchCallbackSCD): ' + err.message);
    }
}

function sptr_getServiceConnectedDisabilities(sptr_patientICN) {
    try {
        //******Developer Bypass for missing ICN******
        if (sptr_patientICN == '' || sptr_patientICN == null) {
            if ((parent.Xrm.Page.context.getUserId()).toUpperCase() == "{CA500504-CBC5-E511-8173-000C2941CE19}") {
                alert("Developer ICN bypass applied!");
                sptr_patientICN = "123456V123456";
            }
        }

        //Verify Patient ICN
        if (sptr_patientICN == '' || sptr_patientICN == null) {
            //No ICN, do not proceed
            return false;
        }

        //Construct Service Parameters
        var sptr_idobject = {};
        sptr_idobject.NationalId = '000000' + sptr_patientICN + '000000';
        var sptr_serviceParams = [{
            key: "identifier",
            type: "c:string",
            value: JSON.stringify(sptr_idobject)
        }];

        //Call the web service security function
        CrmSecurityTokenEncryption(sptr_EnrollmentEligibilitySummaryURLbase, sptr_serviceParams, sptr_serverUrl, sptr_getEsrEnrollmentJSON_response);
    }
    catch (err) {
        alert("Special Treatment Control Grid Web Resource Function Error(sptr_getServiceConnectedDisabilities): " + err.message);
    }
}

function sptr_getEsrEnrollmentJSON_response(sptr_error, sptr_getesrresponse) {
    try {
        //NOTE:Expecting JSON result, if changed to XML modify code accordingly.

        //Set JSON Data to Null;
        sptr_EnrollmentEligibilitySummaryData = null;

        //Check for non ESR service error
        if (sptr_error != null) {
            alert("An ESR Secure Service error occured:\n " + sptr_error + " \nDebugInfo: " + sptr_getesrresponse);
        }
        else {
            //Test for ESR service error
            if (sptr_getesrresponse.ErrorOccurred == true) {
                alert("An ESR Secure Service error occurred:\n " + sptr_getesrresponse.ErrorMessage + " \nDebugInfo: " + sptr_getesrresponse.DebugInfo);
            }
            else {
                //Set Data Returned
                sptr_EnrollmentEligibilitySummaryData = sptr_getesrresponse;
            }
        }

        //Get TAN Configuration status
        var sptr_currentUserId = parent.Xrm.Page.context.getUserId();
        var sptr_currentUserData = sptr_getSingleEntityDataSync('SystemUserSet', 'msdyusd_USDConfigurationId, ftp_FacilitySiteId', sptr_currentUserId);
        if (sptr_currentUserData != null) {
            if (sptr_currentUserData.d.msdyusd_USDConfigurationId != null) {
                if (sptr_currentUserData.d.msdyusd_USDConfigurationId.Name != null) {
                    //TAN logic
                    if (sptr_currentUserData.d.msdyusd_USDConfigurationId.Name == 'TAN Configuration') {
                        sptr_tanConfiguration = true;
                    }
                }
            }
        }

        //Build the Grid
        sptr_BuildGrid();
    }
    catch (err) {
        alert("Special Treatment Control Grid Web Resource Function Error(sptr_getEsrEnrollmentJSON_response): " + err.message);
    }
}

function sptr_FormLoad() {
    try {

        //Get the Related Request info (Support control for progress note entity and request/incident entity only)
        var sptr_entityName = parent.Xrm.Page.data.entity.getEntityName();
        if (sptr_entityName == 'incident') {
            //Test if workload encounter, if not stop
            if (parent.Xrm.Page.getAttribute('ftp_notetype_code').getValue() != "100000001") {
                return false;
            }
        }
        else {
            //Test if workload encounter, if not stop
            if (parent.Xrm.Page.getAttribute('ftp_isworkloadencounter').getValue() != true) {
                return false;
            }
        }

        //Set all Special Treatment Control attributes to disabled
        parent.Xrm.Page.getControl("ftp_serviceconnectedcondition").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_combatveteran").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_agentorangeexposure").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_ionizingradiationexposure").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_southwestasiaconditions").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_shipboardhazardanddefense").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_militarysexualtrauma").setDisabled(true);
        parent.Xrm.Page.getControl("ftp_headandorneckcancer").setDisabled(true);

        //GET CRM SETTINGS WEB SERVICE URLS
        var sptr_conditionalFilter = "(mcs_name eq 'Active Settings')";
        sptr_getMultipleEntityDataAsync('mcs_settingSet', 'ftp_DACURL, ftp_ESREnrollmentEligibilitySummaryAPIURL', sptr_conditionalFilter, 'mcs_name', 'asc', 0, sptr_SettingsWebServiceURL_response, sptr_eesummaryURLbase);
    }
    catch (err) {
        alert("Special Treatment Control Grid Web Resource Function Error(sptr_FormLoad): " + err.message);
    }
}

function sptr_BuildGrid() {
    try {
        //Temporary action: json result is empty, use sample data
        //**********************************************************************************************************************
        //if (sptr_EnrollmentEligibilitySummaryData == null || sptr_EnrollmentEligibilitySummaryData == '') { sptr_EnrollmentEligibilitySummaryData = json_result2[0]; }
        //**********************************************************************************************************************

        //When parent entity is incident, do not populate required
        var sptr_parentIncident = false;
        if (parent.Xrm.Page.data.entity.getEntityName() == 'incident') { sptr_parentIncident = true; }

        //Data from parentnode 'enrollmentDeterminationInfo' 
        var $sptr_enrollmentDeterminationInfo = null;
        var $sptr_primaryEligibility = null;
        var $sptr_type = null;
        var sptr_typeText = null;
        var $sptr_enrollmentCategoryName = null;
        var sptr_enrollmentCategoryNameText = null;
        var $sptr_specialFactors = null;
        var $sptr_envContaminantsInd = null;
        var sptr_envContaminantsIndText = null;
        var $sptr_radiationExposureInd = null;
        var sptr_radiationExposureIndText = null;
        var $sptr_agentOrangeInd = null;
        var sptr_agentOrangeIndText = null;
        var $sptr_campLejeuneInd = null;
        var sptr_campLejeuneIndText = null;
        var $sptr_serviceConnectionAward = null;
        var $sptr_serviceConnectedPercentage = null;
        var sptr_serviceConnectedPercentageText = null;
        var $sptr_ratedDisabilities = null;

        var $sptr_agentOrangeLocation = null;
        var sptr_agentOrangeLocationText = null;
        var $sptr_radiationExposureMethod = null;
        var sptr_radiationExposureMethodText = null;

        var $sptr_noseThroatRadiumInfo = null;
        var $sptr_diagnosedWithCancer = null;
        var sptr_diagnosedWithCancerText = null;

        var $sptr_militarySexualTraumaInfo = null;
        var $sptr_milSexTraumaStatus = null;
        var sptr_milSexTraumaStatusText = null;

        //Data from parentnode 'militaryServiceInfo' 
        var $sptr_militaryServiceInfo = null;
        var $sptr_combatVeteranEligibilityEndDate = null;
        var sptr_combatVeteranEligibilityEndDateText = null;
        var $sptr_shadIndicator = null;
        var sptr_shadIndicatorText = null;

        var sptr_ratedDisabilityPercentageTotal = 0;
        var sptr_detailrowcount = 0;

        if (sptr_EnrollmentEligibilitySummaryData != null) {
            $sptr_enrollmentDeterminationInfo = sptr_EnrollmentEligibilitySummaryData.Data.EnrollmentDeterminationInfo;
        }

        if ($sptr_enrollmentDeterminationInfo != null) {
            $sptr_primaryEligibility = $sptr_enrollmentDeterminationInfo.PrimaryEligibility;
            if ($sptr_primaryEligibility != null) {
                $sptr_type = $sptr_primaryEligibility.Type;
                if ($sptr_type != null) { sptr_typeText = $sptr_type; }
            }
            $sptr_enrollmentCategoryName = $sptr_enrollmentDeterminationInfo.EnrollmentCategoryName;
            if ($sptr_enrollmentCategoryName != null) { sptr_enrollmentCategoryNameText = $sptr_enrollmentCategoryName; }

            $sptr_specialFactors = $sptr_enrollmentDeterminationInfo.SpecialFactors;
            if ($sptr_specialFactors != null) {
                $sptr_envContaminantsInd = $sptr_specialFactors.EnvContaminantsInd;
                if ($sptr_envContaminantsInd != null) { sptr_envContaminantsIndText = $sptr_envContaminantsInd; }

                $sptr_radiationExposureInd = $sptr_specialFactors.RadiationExposureInd;
                if ($sptr_radiationExposureInd != null) { sptr_radiationExposureIndText = $sptr_radiationExposureInd; }

                $sptr_agentOrangeInd = $sptr_specialFactors.AgentOrangeInd;
                if ($sptr_agentOrangeInd != null) { sptr_agentOrangeIndText = $sptr_agentOrangeInd; }

                $sptr_campLejeuneInd = $sptr_specialFactors.CampLejeuneInd;
                if ($sptr_campLejeuneInd != null) { sptr_campLejeuneIndText = $sptr_campLejeuneInd; }

                $sptr_agentOrangeLocation = $sptr_specialFactors.AgentOrangeLocation;
                if ($sptr_agentOrangeLocation != null) { sptr_agentOrangeLocationText = $sptr_agentOrangeLocation; }

                $sptr_radiationExposureMethod = $sptr_specialFactors.RadiationExposureMethod;
                if ($sptr_radiationExposureMethod != null) { sptr_radiationExposureMethodText = $sptr_radiationExposureMethod; }
            }

            $sptr_serviceConnectionAward = $sptr_enrollmentDeterminationInfo.ServiceConnectionAward;
            if ($sptr_serviceConnectionAward != null) {
                $sptr_serviceConnectedPercentage = $sptr_serviceConnectionAward.ServiceConnectedPercentage;
                if ($sptr_serviceConnectedPercentage != null) { sptr_serviceConnectedPercentageText = $sptr_serviceConnectedPercentage; }

                //Reference to grid
                var sptr_grid = document.getElementById("specialTreatmentGrid");
                var sptr_row = sptr_grid.insertRow(1);
                var sptr_cell1 = sptr_row.insertCell(0);
                sptr_cell1.innerHTML = "Service Connected: " + (!!sptr_serviceConnectedPercentageText ? sptr_serviceConnectedPercentageText + "%" : "");

                //Check service connected percentage
                if (sptr_serviceConnectedPercentageText != null && sptr_serviceConnectedPercentageText > 0) {
                    if (sptr_tanConfiguration == false) {
                        parent.Xrm.Page.getControl("ftp_serviceconnectedcondition").setDisabled(false);
                        if (sptr_parentIncident == false) {
                            parent.Xrm.Page.getAttribute("ftp_serviceconnectedcondition").setRequiredLevel("required");
                        }
                    }
                }

                var sptr_detailrowcount = 1;

                $sptr_ratedDisabilities = $sptr_serviceConnectionAward.RatedDisabilities;
                //Get each disability listed
                for (var i = 0; !!$sptr_ratedDisabilities && Array.isArray($sptr_ratedDisabilities.RatedDisability) && i <= $sptr_ratedDisabilities.RatedDisability.length - 1; i++) {
                    var sptr_ratedDisabilityPercent = 0;
                    var sptr_disability = null;
                    if (Number($sptr_ratedDisabilities.RatedDisability[i].Percentage) > 0) {
                        sptr_ratedDisabilityPercentageTotal = sptr_ratedDisabilityPercentageTotal + Number($sptr_ratedDisabilities.RatedDisability[i].Percentage);
                        sptr_ratedDisabilityPercent = Number($sptr_ratedDisabilities.RatedDisability[i].Percentage);
                    }

                    //Add to detail grid
                    sptr_detailrowcount = sptr_detailrowcount + 1;
                    var sptr_row = sptr_grid.insertRow(sptr_detailrowcount);
                    var sptr_cell1 = sptr_row.insertCell(0);
                    sptr_cell1.innerHTML = $sptr_ratedDisabilities.RatedDisability[i].Disability + " (" + sptr_ratedDisabilityPercent.toString() + "% SC)";
                };
            }

            $sptr_noseThroatRadiumInfo = $sptr_enrollmentDeterminationInfo.NoseThroatRadiumInfo;
            if ($sptr_noseThroatRadiumInfo != null) {
                $sptr_diagnosedWithCancer = $sptr_noseThroatRadiumInfo.DiagnosedWithCancer;
                if ($sptr_diagnosedWithCancer != null) { sptr_diagnosedWithCancerText = $sptr_diagnosedWithCancer; }
            }

            $sptr_militarySexualTraumaInfo = $sptr_enrollmentDeterminationInfo.MilitarySexualTraumaInfo;
            if ($sptr_militarySexualTraumaInfo != null) {
                $sptr_milSexTraumaStatus = $sptr_militarySexualTraumaInfo.Status;
                if ($sptr_milSexTraumaStatus != null) { sptr_milSexTraumaStatusText = $sptr_milSexTraumaStatus; }
            }
        }

        if (sptr_EnrollmentEligibilitySummaryData != null) {
            $sptr_militaryServiceInfo = sptr_EnrollmentEligibilitySummaryData.Data.MilitaryServiceInfo;
        }
        if ($sptr_militaryServiceInfo != null) {
            $sptr_combatVeteranEligibilityEndDate = $sptr_militaryServiceInfo.CombatVeteranEligibilityEndDate;
            if ($sptr_combatVeteranEligibilityEndDate != null) {
                sptr_combatVeteranEligibilityEndDateText = sptr_combatVeteranEligibilityEndDateText = $sptr_combatVeteranEligibilityEndDate;
            }
            $sptr_shadIndicator = $sptr_militaryServiceInfo.ShadIndicator;
            if ($sptr_shadIndicator != null) { sptr_shadIndicatorText = $sptr_shadIndicator; }
        }

        //If no eligibility specified, set to false
        if (sptr_typeText == null || sptr_typeText == '') { sptr_typeText = false; }

        //Change boolean values to false if not marked true
        if (sptr_envContaminantsIndText != 'true') { sptr_envContaminantsIndText = false; }
        if (sptr_radiationExposureIndText != 'true') { sptr_radiationExposureIndText = false; }
        if (sptr_agentOrangeIndText != 'true') { sptr_agentOrangeIndText = false; }
        if (sptr_campLejeuneIndText != 'true') { sptr_campLejeuneIndText = false; }

        if (sptr_diagnosedWithCancerText != 'true') { sptr_diagnosedWithCancerText = false; }
        if (sptr_shadIndicatorText != 'true') { sptr_shadIndicatorText = false; }

        //Change all True/False to Yes/No and Hide No columns
        if (sptr_typeText == false) { sptr_typeText = 'No'; }

        if (sptr_tanConfiguration == false) {
            if (sptr_envContaminantsIndText == "true") {
                sptr_envContaminantsIndText = "Yes";
                parent.Xrm.Page.getControl("ftp_southwestasiaconditions").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_southwestasiaconditions").setRequiredLevel("required");
                }
            }
            if (sptr_radiationExposureIndText == "true") {
                sptr_radiationExposureIndText = "Yes";
                parent.Xrm.Page.getControl("ftp_ionizingradiationexposure").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_ionizingradiationexposure").setRequiredLevel("required");
                }
            }
            if (sptr_agentOrangeIndText == "true") {
                sptr_agentOrangeIndText = "Yes";
                parent.Xrm.Page.getControl("ftp_agentorangeexposure").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_agentorangeexposure").setRequiredLevel("required");
                }
            }
            if (sptr_diagnosedWithCancerText == "true") {
                sptr_diagnosedWithCancerText = "Yes";
                parent.Xrm.Page.getControl("ftp_headandorneckcancer").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_headandorneckcancer").setRequiredLevel("required");
                }
            }

            if (sptr_milSexTraumaStatusText == null || sptr_milSexTraumaStatusText == '') {
                //*sptr_disabilityGrid.hideColumn("militarySexualTrauma"); 
            } else {
                parent.Xrm.Page.getControl("ftp_militarysexualtrauma").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_militarysexualtrauma").setRequiredLevel("required");
                }
            }

            if (sptr_combatVeteranEligibilityEndDateText != null && sptr_combatVeteranEligibilityEndDateText != '') {
                sptr_combatVeteranEligibilityEndDateText = 'Yes';
                parent.Xrm.Page.getControl("ftp_combatveteran").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_combatveteran").setRequiredLevel("required");
                }
            }

            if (sptr_shadIndicatorText == "true") {
                sptr_shadIndicatorText = "Yes";
                parent.Xrm.Page.getControl("ftp_shipboardhazardanddefense").setDisabled(false);
                if (sptr_parentIncident == false) {
                    parent.Xrm.Page.getAttribute("ftp_shipboardhazardanddefense").setRequiredLevel("required");
                }
            }
        }
    }
    catch (err) {
        alert("Special Treatment Control Grid Web Resource Function Error(sptr_BuildGrid): " + err.message);
    }
}

function sptr_executeCrmOdataGetRequest(sptr_jsonQuery, sptr_aSync, sptr_aSyncCallback, sptr_skipCount, sptr_optionArray) {
    //This function executes a CRM Odata web service call to retrieve Crm data
    //*sptr_jsonQuery* - a properly formatted CRM Odata Query string (required)
    //*sptr_aSync* - specify 'true' to execute asynchronously otherwise 'false' (required)
    //*sptr_aSyncCallback* - specify the name of the return function to call upon completion (required if sptr_aSync = true.  Otherwise '')
    //*sptr_skipCount* - Initial setting is always '0', increments by 50 per CRM SDK Odata standards (required)
    //*sptr_optionArray* - is an optional array or single value, that contains additional task specific variables that can be passed between functions (pass 'null' if not used)
    try {
        var sptr_entityData = null;
        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            url: sptr_jsonQuery,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('Accept', 'application/json');
            },
            success: function (data, textStatus, XmlHttpRequest) {
                sptr_entityData = data;
                if (sptr_aSync == true) {
                    sptr_aSyncCallback(sptr_entityData, sptr_skipCount, sptr_optionArray);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Fail: Ajax Error in sptr_executeCrmOdataGetRequest: ' + errorThrown + " Request: " + sptr_jsonQuery);
            },
            async: sptr_aSync,
            cache: false
        });
        return sptr_entityData;
    }
    catch (err) {
        alert('An error occured in the sptr_executeCrmOdataGetRequest function.  Error Detail Message: ' + err);
    }
}

function sptr_getMultipleEntityDataAsync(sptr_entitySetName, sptr_attributeSet, sptr_conditionalFilter, sptr_sortAttribute, sptr_sortDirection, sptr_skipCount, sptr_aSyncCallback, sptr_optionArray) {
    //This function returns a CRM JSON dataset for all entity records matching criteria provided Asyncronously
    //*sptr_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sptr_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sptr_conditionalFilter* - is the conditional filter value placed on the data values retrived e.g. 'StateCode/Value eq 0'  to retrieve active contact records only
    //*sptr_sortAttribute* - is a string containing the name of the attribute to sort the result set by e.g. 'LastName'
    //*sptr_sortDirection* - is a string specifying the sort as Ascending or Descending e.g. 'asc' or 'desc'
    //*sptr_skipCount* - is the starting point in the result (use if more than 50), (Put 0 if not used)
    //*sptr_aSyncCallback* - is the name of the function to call when returning the result
    //*sptr_optionArray* - is an optional array, that contains additional task specific variables that can be passed between functions

    try {
        var sptr_jsonQuery = sptr_serverUrl + sptr_crmOdataEndPoint + '/' + sptr_entitySetName + '?$select=' + sptr_attributeSet + '&$filter=' + sptr_conditionalFilter + '&$orderby=' + sptr_sortAttribute + ' ' + sptr_sortDirection + '&$skip=' + sptr_skipCount;
        sptr_executeCrmOdataGetRequest(sptr_jsonQuery, true, sptr_aSyncCallback, sptr_skipCount, sptr_optionArray);
    }
    catch (err) {
        alert('An error occured in the sptr_getMultipleEntityDataAsync function.  Error Detail Message: ' + err);
    }
}

function sptr_getSingleEntityDataSync(sptr_entitySetName, sptr_attributeSet, sptr_entityId) {
    //This function returns a CRM JSON dataset for a single entity record based on the entity id provided Syncronously
    //*sptr_entitySetName* - is the name of the entity set e.g 'ContactSet'
    //*sptr_attributeSet* -  is a string containing the Crm Attributes to retrieve e.g. 'FirstName, LastName, Telephone1, EMailAddress1'
    //*sptr_entityId* - is the Guid for the entity record

    try {
        var sptr_entityIdNoBracket = sptr_entityId.replace(/({|})/g, '');
        var sptr_selectString = '(guid' + "'" + sptr_entityIdNoBracket + "'" + ')?$select=' + sptr_attributeSet;
        var sptr_jsonQuery = sptr_serverUrl + sptr_crmOdataEndPoint + '/' + sptr_entitySetName + sptr_selectString;
        var sptr_entityData = sptr_executeCrmOdataGetRequest(sptr_jsonQuery, false, '', 0, null);
        return sptr_entityData;
    }
    catch (err) {
        alert('An error occured in the sptr_getSingleEntityDataSync function.  Error Detail Message: ' + err);
    }
}