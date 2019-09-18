/// <reference path="../../JScript/SDK.REST.js" />
/// <reference path="../../JScript/VCCM.MHVHelper.js" />
/// <reference path="../../JScript/VCCM.USDHelper.js" />
/// <reference path="../../WebServiceSecurityLib/js/WebServiceSecurityLibrary.js" />

var configData = null,
    context = null,
    retrievedSettings = null;
var esrResponseObject = null,
    mhvObject = null,
    sensitiveVetResponseObject = null,
    sensitiveVetResponseXML = null,
    hdrResponseObject = null;
var isProd = true; /*default to true, but set according to retrievedSettings from CRM*/
var deathDate = null,
    dataSource = null; /*not used*/
var dacURL = null,
    vistaURL = null,
    flagsUseSecureAPI = true,
    patientRemarksUseSecureAPI = true,
    sensitivePatientAPIURL = null;
var retrievedContact = null;
var mviDataForUSD = [],
    esrDataForUSD = [],
    mhvIDs = [];
var webServiceDataToUpdateVeteran = {};
var _useCrossReferenceTableForIEN = false;
var _userChoseToAccessSensitiveVeteran = false;

$(document).ready(function () {
    runOnDocumentReady();
});

function runOnDocumentReady() {
	debugger;
    console.log("begin runOnDocumentReady()");
    showLoadingMessage("Loading...");
    //reset stuff
    context = getContext();
    configData = null;
    esrResponseObject = null;
    sensitiveVetResponseObject = null;
    sensitiveVetResponseXML = null;
    hdrResponseObject = null;
    deathDate = null;
    //put onLoad logic here
    configData = parseDataParametersFromUrl(location.search);
    mviDataForUSD = [];
    esrDataForUSD = [];
    mhvIDs = [];
    _userChoseToAccessSensitiveVeteran = false;

    if (!configData) {
        showErrorMessage("Could not parse config data from URL", "No debugging information available", "Configuration error");
        return;
    }

    //set sessionname
    if (configData.hasOwnProperty("fullname") && !!configData.fullname) {
        //if (configData.hasOwnProperty("firstname") && !!configData.firstname && configData.hasOwnProperty("lastname") && !!configData.lastname) {
        // KDT 03/19/2018 Story 650818
        //VCCM.USDHelper.CopyToUSDContext(["SESSIONNAME=" + configData.firstname + " " + configData.lastname]);
        VCCM.USDHelper.CopyToUSDContext(["SESSIONNAME=" + configData.fullname]);
    }

    //8/22/2018
    //if configData.fullname is anonymous veteran, revert ICN values to match that.
    //currently, this would happen only if we've opened a WHH interaction that has a CachedICN value but the workflow to link it to a veteran has failed so the interaction is also link to the Anonymous Veteran contact record.
    if (!!configData.fullname && configData.fullname.toLowerCase().indexOf("anonymous") > -1) {
        configData.ICN = "MISSING";
        //delete configData.CachedICNId;
    }
    manageICNCaching();
}

function manageICNCaching() {
    console.log("begin manageICNCaching()");
    try {
        if (!!configData.ICN) {
            if (configData.ICN != "MISSING") {
                if (!!configData.CachedICNId) {
                    console.log("have ICN and CachedICNId");
                    VCCM.USDHelper.SetCookie(configData.CachedICNId + "_ICN", configData.ICN, 6);
                    configData.nationalid = configData.ICN.substring(0, 10);

                    //EDIPI was used to query VIERS for veteran rank and branch of service.
                    //because the rank & branch functionality has been deprecated, we no longer need to check for EDIPI, here
                    //if we need to resume getting EDIPI, comment out the following code block:
                    if (!!!configData.EDIPI) {
                        configData.EDIPI = "UNK";
                        console.log("set configData.EDIPI to UNK");
                    }

                    //DFN was used on this page for submitting to the HDR Sensitive Patient API, for logging the current user's access to a veteran (passing vet DFN, vet station code, and user IEN)
                    //because we no longer use that API for auditing of sensitive veteran access, we no longer need to check for DFN, here.
                    //if we need to resume getting the veteran's DFN for the station matching the veterans' Current Facility value, comment out the following code block:
                    if (!!!configData.DFN) {
                        configData.DFN = "UNK";
                        console.log("set configData.DFN to UNK");
                    }

                    if (!!configData.EDIPI && !!configData.DFN) {
                        finishMVIOperations();
                    }
                    else {
                        //should never reach this point...
                        performMVISelectedPersonSearch();
                    }
                }
                else {
                    console.log("have ICN but no Cached ICN record. Create a new ftp_CachedICN record, using configData.ICN");
                    showLoadingMessage("Caching ICN...");
                    var newRecord = {
                        ftp_ICN: configData.ICN
                    }
                    SDK.REST.createRecord(
                        newRecord,
                        "ftp_cachedicn",
                        function (createdRecord) {
                            console.log("created new ftp_CachedICN record.");
                            configData.CachedICNId = createdRecord.ftp_cachedicnId;
                            VCCM.USDHelper.SetCookie(configData.CachedICNId + "_ICN", configData.ICN, 6);

                            console.log("re-entering manageICNCaching()");
                            manageICNCaching(); //re-enter parent function

                            //actually LINKING this Cached ICN record to the pertinent Addendum/Interaction/Request happens via USD action calls, on the Veteran Alerts 'Saved' event

                        },
                        function (error) {
                            console.log("error creating Cached ICN record.");
                            console.log(error);
                            showErrorMessage("Error managing cached veteran ICN.", error.message, "Caching Error");
                        }
                    );
                }
            }
            else {
                //reach this branch when we previously got zero MVI results and decided to create a brand new veteran
                //or, for VEFT, when opening an interaction/request linked to Anonymous Veteran
                configData.isSensitive = false;
                prepareAndOpenRecords();
            }
        }
        else {
            //if we don't even have an ICN value yet, start from the top...
            //get contact from CRM
            //use contact details to perform MVI search for vet and their ICN
            /*
            the following 2 lines are now deprecated:
                //perform a SelectedPersonSearch MVI search to get stations and grab EDIPI from 200DOD record
                //---also grab veteran's DFN matching the facility code of their ftp_currentfacilityid
            */
            //query ESR using the ICN
            //if sensitive, and have a veteran DFN, and user clicks "Yes" to continue, get user's IEN from VistA, using the user's identified facility code (from systemuser record)
            //send access/logging request to HDR
            //if returned status code == 1, check patient flags
            //if no patient flags, open the veteran
            retrieveCRMContact();
        }
    }
    catch (e) {
        showErrorMessage("Error in manageICNCaching() function", e.message, "General Error");
    }
}

//MVI operations, used when checking Veteran Alerts without first doing a manual MVI search
function retrieveCRMContact() {
    showLoadingMessage("Retrieving veteran's MVI search criteria from CRM...");
    if (configData.hasOwnProperty("contactid") && !!configData.contactid) {
        var select = "ContactId,FirstName,LastName,FullName,ftp_DateofBirth,GovernmentId,ftp_ManuallyCreatedFromMVIcode,ftp_ftp_facility_contact_currentfacilityid/ftp_FacilityCode_text,ftp_ftp_facility_contact_currentfacilityid/ftp_facilityId,ftp_ftp_facility_contact_currentfacilityid/ftp_name";
        SDK.REST.retrieveRecord(
            configData.contactid,
            "Contact",
            select,
            "ftp_ftp_facility_contact_currentfacilityid",
            function (retrievedRecord) {
                writeToConsole("got CRM contact");
                retrievedContact = retrievedRecord;
                //VCCM.USDHelper.CopyToUSDContext(["SESSIONNAME=" + retrievedContact.FirstName + " " + retrievedContact.LastName]);
                configData.fullname = retrievedContact.FullName;
                VCCM.USDHelper.CopyToUSDContext(["SESSIONNAME=" + retrievedContact.FullName]);
                configData.veteranFacilityCode = getDeepProperty("retrievedContact.ftp_ftp_facility_contact_currentfacilityid.ftp_FacilityCode_text");
                mviDataForUSD.push("SelectedFacilityCode=" + configData.veteranFacilityCode);
                mviDataForUSD.push("SelectedFacilityName=" + getDeepProperty("retrievedContact.ftp_ftp_facility_contact_currentfacilityid.ftp_name"));
                mviDataForUSD.push("SelectedFacilityCRMID=" + getDeepProperty("retrievedContact.ftp_ftp_facility_contact_currentfacilityid.ftp_facilityId"));
                mviDataForUSD.push("VetFullName=" + retrievedContact.FullName);
                mviDataForUSD.push("VetFirstName=" + retrievedContact.FirstName);
                mviDataForUSD.push("VetLastName=" + retrievedContact.LastName);
                mviDataForUSD.push("VetCRMContactID=" + retrievedContact.ContactId);

                if (getDeepProperty("ftp_ManuallyCreatedFromMVIcode.Value", retrievedContact) == 100000001/*yes*/) {
                    /*reach this branch when we've retrieved a Veteran who was previously manually created from MVI search page*/
                    configData.isSensitive = false;
                    configData.ICN = "MISSING";
                    configData.DFN = "MISSING";
                    configData.nationalid = "MISSING";
                    prepareAndOpenRecords();
                }
                else { /*no, or empty*/
                    fetchVeteranFromMVIUnattended();
                }
            },
            errorHandler
        );
    }
    else {
        showErrorMessage("Unable to retrieve contact from CRM.", "Missing 'contactid' from URL parameters.", "Configuration Error");
    }
}
function fetchVeteranFromMVIUnattended() {
    showLoadingMessage("Querying MVI for Veteran...");

    //perform MVI search to get ICN and DFN (and also parse facilityCode from ftp_currentfacilityid, then call performExternalWebServiceCalls() with retrieved ICN.
    var queryString = "$select=*&$filter=";
    var firstname = retrievedContact.FirstName;
    var lastname = retrievedContact.LastName;

    var dobdate = retrievedContact.ftp_DateofBirth;
    var dobstring = !!dobdate ? dobdate : "";

    var ssn = retrievedContact.GovernmentId;
    if (!!ssn) ssn = ssn.replace(/-/g, "");

    queryString += buildQueryFilter("crme_LastName", lastname, false); //assuming lastname will never be blank
    if (!!firstname) queryString += buildQueryFilter("crme_FirstName", firstname, true);
    if (!!ssn) queryString += buildQueryFilter("crme_SSN", ssn, true);
    if (!!dobstring) queryString += " and crme_DOBString eq '" + dobstring + "'";
    queryString += buildQueryFilter("crme_SearchType", 'SearchByFilter', true);
    //set search as attended (for now)
    queryString += " and crme_IsAttended eq true";

    //queryString = encodeURIComponent(queryString);
    var retrievedPerson = null;
    var MVIBadResultsText = "Invalid results from MVI.";
    SDK.REST.retrieveMultipleRecords(
        "crme_person",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) {
                retrievedPerson = retrievedRecords[0];
                mviDataForUSD.push("SearchType=Unattended");
            }
            else {
                MVIBadResultsText = "Could not determine veteran ICN from " + retrievedRecords.length + " MVI search results.";
                mviDataForUSD.push("SearchType=Hybrid"); //possible future enhancement: display selection of veterans from MVI matching search criteria
            }
        },
        errorHandler,
        function () {
            if (!!retrievedPerson) {
                // check for exceptions 1st
                if ((retrievedPerson.crme_ExceptionOccured || !!retrievedPerson.crme_ExceptionMessage)
                    || (!!retrievedPerson.crme_ReturnMessage && retrievedPerson.crme_ReturnMessage == "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.")
                    || (!!retrievedPerson.crme_ReturnMessage && retrievedPerson.crme_ReturnMessage == "Unknown Key Identifier| Unknown Key Identifier")
                    || (!!retrievedPerson.crme_ReturnMessage && retrievedPerson.crme_ReturnMessage == "Your search in MVI did not find any records matching the search criteria.")) {
                    var messageToShow =
                        !!retrievedPerson.crme_ExceptionMessage ? retrievedPerson.crme_ExceptionMessage :
                            !!retrievedPerson.crme_ReturnMessage ? retrievedPerson.crme_ReturnMessage :
                                "Unknown error";

                    showErrorMessage("No cached ICN present. Error performing MVI search for veteran ICN. This session will now close.", messageToShow, "MVI Search Error");
                }
                else {
                    //5/11/17 MVI is now the authoritative source for deceasedDate
                    configData.deceasedDate = (retrievedPerson.hasOwnProperty("crme_DeceasedDate") && !!retrievedPerson.crme_DeceasedDate) ? retrievedPerson.crme_DeceasedDate : null;

                    var patientMviIdentifier = retrievedPerson.crme_PatientMviIdentifier == null ? "" : retrievedPerson.crme_PatientMviIdentifier;
                    if (patientMviIdentifier != "") {
                        var idparts = patientMviIdentifier.split("^");
                        if (idparts.length > 0) {
                            configData.ICN = idparts[0];
                            configData.nationalid = configData.ICN.substring(0, 10);
                            writeToConsole("got ICN from MVI: " + configData.ICN);

                            //EDIPI was used to query VIERS for veteran rank and branch of service.
                            //because the rank & branch functionality has been deprecated, we no longer need to check for EDIPI, here
                            //if we need to resume getting EDIPI, comment out the following code block:
                            if (!!!configData.EDIPI) {
                                configData.EDIPI = "UNK";
                                console.log("set configData.EDIPI to UNK");
                            }

                            //DFN was used on this page for submitting to the HDR Sensitive Patient API, for logging the current user's access to a veteran (passing vet DFN, vet station code, and user IEN)
                            //because we no longer use that API for auditing of sensitive veteran access, we no longer need to check for DFN, here.
                            //if we need to resume getting the veteran's DFN for the station matching the veterans' Current Facility value, comment out the following code block:
                            if (!!!configData.DFN) {
                                configData.DFN = "UNK";
                                console.log("set configData.DFN to UNK");
                            }

                            performMVISelectedPersonSearch();
                        }
                    }
                }
            }
            else {
                showErrorMessage(MVIBadResultsText + " This session will now close.", "", "MVI Search Error");
            }
        }
    );
}
function performMVISelectedPersonSearch() {
    if (configData.hasOwnProperty("DFN") && !!configData.DFN && configData.hasOwnProperty("EDIPI") && !!configData.EDIPI) {
        //if we already have DFN and EDIPI, can skip the MVI SelectedPersonSearch
        //by July 2018, we don't NEED the DFN and EDIPI values anymore...
        //so just skip back to manageICNCaching, which will fill default 'UNK' values in those properties and proceed into the finishMVIOperations() function
        manageICNCaching();
    }
    else {
        //should never reach this point...
        showLoadingMessage("Querying MVI for veteran station data...");
        var needToFindCurrentFacilityInMVI = configData.hasOwnProperty("veteranFacilityCode") && !!configData.veteranFacilityCode;
        //to get patient DFN and EDIPI: query MVI again, this time including ICN, then parse through list of returned stations to find station where 
        //crme_SiteId == facilityCode (DFN)
        //or where crme_SiteId == 200DOD (EDIPI)
        var currentLocationFromMVIUnattended = null;
        var DODLocationFromMVI = null;
        var mviStationQuery = "$select=*&$filter=crme_ICN eq '" + configData.ICN + "' and crme_SearchType eq 'SelectedPersonSearch'";
        SDK.REST.retrieveMultipleRecords(
            "crme_person",
            mviStationQuery,
            function (retrievedStations) {
                for (var s = 0; s < retrievedStations.length; s++) {
                    var thisStation = retrievedStations[s];
                    if (thisStation.hasOwnProperty("crme_SiteId")) {
                        if (needToFindCurrentFacilityInMVI) {
                            if (currentLocationFromMVIUnattended == null) {
                                if (thisStation.crme_SiteId == configData.veteranFacilityCode) {
                                    currentLocationFromMVIUnattended = retrievedStations[s];
                                    writeToConsole("found station matching currentFacilityCode from MVI SelectedPersonSearch");
                                }
                            }
                            else {
                                //alert that we're missing
                            }
                        }
                        if (DODLocationFromMVI == null && thisStation.crme_SiteId == "200DOD") {
                            DODLocationFromMVI = thisStation;
                            writeToConsole("found station 200DOD station from MVI SelectedPersonSearch ");
                        }


                        if ((thisStation.crme_SiteId == "200MHS" || thisStation.crme_SiteId == "200MHI") && !!thisStation.crme_PatientId) {
			                /*
                                3/26/18 kknab all MHV functionality has been deprecated at the last minute, due to the MHV group's decision to not allow us to user their APIs in PROD
                                By commenting out the MHV ID collection step, here, most MHV functionality in the rest of the application (downstream of an MVI search) will remain hidden
                            */
                            //mhvIDs.push(thisStation.crme_PatientId);
                        }
                    }
                }
            },
            errorHandler,
            function () {
                if (!!DODLocationFromMVI) {
                    configData.EDIPI = DODLocationFromMVI.hasOwnProperty("crme_PatientId") && !!DODLocationFromMVI.crme_PatientId ? DODLocationFromMVI.crme_PatientId : "UNK";
                    writeToConsole("got veteran EDIPI from MVI: " + configData.EDIPI);

                    /*get veteran sensitivity level from this station, too*/
                    var sensLevelString = DODLocationFromMVI.hasOwnProperty("crme_VeteranSensitivityLevel") && !!DODLocationFromMVI.crme_VeteranSensitivityLevel ? DODLocationFromMVI.crme_VeteranSensitivityLevel : "false:false";
                    configData.isSensitive = (sensLevelString == "true:true" || sensLevelString == "true:false");
                }
                if (needToFindCurrentFacilityInMVI) {
                    if (!!currentLocationFromMVIUnattended) {
                        if (currentLocationFromMVIUnattended.hasOwnProperty("crme_PatientId") && !!currentLocationFromMVIUnattended.crme_PatientId) {
                            configData.DFN = currentLocationFromMVIUnattended.crme_PatientId;
                            mviDataForUSD.push("SelectedFacilityVetDFN=" + configData.DFN);
                            writeToConsole("got veteran DFN from MVI: " + configData.DFN);
                            //finishMVIOperations();
                            manageICNCaching();
                        }
                        else {
                            //found facility but it didn't have a crme_PatientId value
                            showErrorMessage("Could not determine your access to this potentially sensitive veteran.", "Did not find a Veteran DFN for facility code " + configData.veteranFacilityCode, "MVI Search Error");
                        }
                    }
                    else {
                        //need to find current facility from MVI, but couldn't find it.
                        showErrorMessage("Could not determine your access to this potentially sensitive veteran without a known current facility code for the veteran.", "To remedy, perform a manual MVI search for this veteran, select a facility, and acknowledge any Veteran Alerts in order to save that facility to this veteran.", "MVI Search Error");
                    }
                }
                else {
                    manageICNCaching();
                }
            }
        );

    }
}
function finishMVIOperations() {
    mviDataForUSD.push("ICN=" + configData.ICN);
    mviDataForUSD.push("NationalID=" + configData.nationalid);
    mviDataForUSD.push("EDIPI=" + configData.EDIPI);
    mviDataForUSD.push("DeceasedDate=" + (!!configData.deceasedDate ? configData.deceasedDate : ""));
    mviDataForUSD.push("IsSensitive=" + (configData.hasOwnProperty("isSensitive") ? configData.isSensitive.toString() : "false"));

    VCCM.USDHelper.CopyDataToReplacementParameters("MVI", mviDataForUSD, false);

    configData.MHVIDs = !!configData.MHVIDs ? configData.MHVIDs : mhvIDs.length > 0 ? mhvIDs.join(",") : "";

    retrieveActiveSettingsThenQueryESR();
}

//other web services
function retrieveActiveSettingsThenQueryESR() {
    showLoadingMessage("Retrieving Active Settings...");
    var queryString = "$select=*&$filter=mcs_name eq 'Active Settings'";
    SDK.REST.retrieveMultipleRecords(
        "mcs_setting",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) retrievedSettings = retrievedRecords[0];
        },
        errorHandler,
        function () {
            if (!!retrievedSettings) {
                if (!(retrievedSettings.hasOwnProperty("ftp_DACURL")) || !retrievedSettings.ftp_DACURL) {
                    showErrorMessage("Could not find DAC URL", "", "Settings retrieval error");
                    return;
                }

                writeToConsole("got Active Settings record.");

                dacURL = retrievedSettings.ftp_DACURL;
                vistaURL = (retrievedSettings.hasOwnProperty("ftp_VistaUsersAPIURL") && !!retrievedSettings.ftp_VistaUsersAPIURL) ? retrievedSettings.ftp_VistaUsersAPIURL : null;
                isProd = (retrievedSettings.hasOwnProperty("ftp_IsProductionEnvironment") && retrievedSettings.ftp_IsProductionEnvironment == true);
                if (isProd == false) { $("#developerBypassContainer").show(); }
                sensitivePatientAPIURL = (retrievedSettings.hasOwnProperty("ftp_SensitivePatientAPIURL") && !!retrievedSettings.ftp_SensitivePatientAPIURL) ? retrievedSettings.ftp_SensitivePatientAPIURL : null;

		        /*
                1/24/2018 - kknab hotfix - always query ESR on this page, so that we can find the address data and perform UPDATE on veteran before opening the veteran record.
                */
                //if (!!configData.alreadyQueriedESR && configData.alreadyQueriedESR.toString() == "true") {
                //    //already queried ESR on MVI search page, so we've already copied demographic data to [[ESR]] replacement parameters, and we've passed vet sensitivity to this page
                //    checkDeceased();
                //}
                //else {
                queryESR();
                //}
            } //end if !!retrievedSettings
            else {
                showErrorMessage("Could not find Active Settings for this org; contact your system administrator.", "", "Settings retrieval error");
                return;
            }
        } //end active settings retrieval complete callback
    );//end active settings query
}

function queryESR() {

    debugger;
    vlc_callAction('ftp_VeteranEnrollment',
        {
            "Request": configData.ICN
        },
        function (data) {
            debugger;
            writeToConsole("inside ESR query success callback");
            esrDataForUSD = [];
            esrResponseObject = JSON.parse(data.Response);
            processESRData(); //finishes with finishESROperations();
        },
        function (err) {
            console.log(err);
        }
    );

    //11/22/17 enhancement: veteran sensitivity level comes from MVI now. Go ahead and query ESR for other data, but don't use its 'SensityFlag'
    //if (retrievedSettings.hasOwnProperty("ftp_ESREnrollmentEligibilitySummaryAPIURL") && !!retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL) {
    //    var secureESRURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_ESREnrollmentEligibilitySummaryAPIURL;
    //    var secureESRParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: "000000" + configData.ICN + "000000" }) }];
    //    showLoadingMessage("Querying ESR for additional veteran data...");
    //    CrmSecurityTokenEncryption(
    //        secureESRURL,
    //        secureESRParams,
    //        context.getClientUrl(),
    //        function (pError, pResponse) {
    //            writeToConsole("inside ESR query success callback");
    //            esrDataForUSD = [];
    //            if (!!pError) {
    //                //configData.isSensitive = true;
    //                showErrorMessage("Error querying ESR: " + pError + ".", pResponse.responseText, "Error querying ESR for veteran data");
    //                //esrDataForUSD.push("IsSensitive=" + configData.isSensitive.toString());
    //                esrDataForUSD.push("IsSensitive=" + true.toString());
    //                esrDataForUSD.push("ErrorOrEmpty=true");
    //                finishESROperations();
    //            }
    //            else if (pResponse.ErrorOccurred) {
    //                //configData.isSensitive = true;
    //                showErrorMessage("Error querying ESR.", pResponse.ErrorMessage, "Error querying ESR for veteran data");
    //                //esrDataForUSD.push("IsSensitive=" + configData.isSensitive.toString());
    //                esrDataForUSD.push("IsSensitive=" + true.toString());
    //                esrDataForUSD.push("ErrorOrEmpty=true");
    //                finishESROperations();
    //            }
    //            else {
    //                esrResponseObject = pResponse;
    //                processESRData(); //finishes with finishESROperations();
    //            }
    //        }
    //    );
    //}
    //else {
    //    showErrorMessage("Could not find Secure ESR API URL.", "", "Configuration Error");
    //    return;
    //}
}
function processESRData() {
    try {
        if (!!esrResponseObject && !!esrResponseObject.Data) {
            var sensitivityFlag = getDeepProperty("Data.SensitivityInfo.SensityFlag", esrResponseObject);
            //configData.isSensitive = sensitivityFlag == undefined || (!!sensitivityFlag && sensitivityFlag.toLowerCase() != "false");
            //esrDataForUSD.push("IsSensitive=" + configData.isSensitive.toString());
            esrDataForUSD.push("IsSensitive=" + (sensitivityFlag == undefined || (!!sensitivityFlag && sensitivityFlag.toLowerCase() != "false")).toString());

            //may need to set the ftp_SensitiveVeteran field using configData.isSensitive, instead of the esr sensitivityFlag
            webServiceDataToUpdateVeteran.ftp_SensitiveVeteran = (!!sensitivityFlag && sensitivityFlag.toLowerCase() != "false").toString();
            esrDataForUSD.push("ErrorOrEmpty=false");
            writeToConsole("veteran sensitivity, from MVI (maybe ESR indirectly): " + configData.isSensitive);

            /*copy a bunch of ESR data to USD replacement parameters, so we don't have to continually query ESR in other places*/

            /*Preferred Facility*/
            //Data{Demographics{PreferredFacility}}
            var preferredFacilityFullName = getDeepProperty("Data.Demographics.PreferredFacility", esrResponseObject);
            if (!!preferredFacilityFullName) {
                esrDataForUSD.push("preferredFacilityFullName=" + preferredFacilityFullName);
                var pfAsArray = preferredFacilityFullName.split("-");
                if (pfAsArray.length == 2) {
                    var facilityCodeFromESR = pfAsArray[0].trim();
                    var facilityNameFromESR = pfAsArray[1].trim();
                    esrDataForUSD.push("preferredFacilityCode=" + facilityCodeFromESR);
                    esrDataForUSD.push("preferredFacilityName=" + facilityNameFromESR);
                }
                webServiceDataToUpdateVeteran.ftp_Facility = preferredFacilityFullName;
            }

            /*phone numbers*/
            //Phones drilldown: Data{Demographics{ContactInfo{Phones{Phone[]}}}
            var phoneNumberList = getDeepProperty("Data.Demographics.ContactInfo.Phones.Phone", esrResponseObject);
            if (phoneNumberList != undefined && Array.isArray(phoneNumberList) && phoneNumberList.length > 0) {
                writeToConsole("found phone numbers from ESR");

                for (var x in phoneNumberList) {
                    var number = phoneNumberList[x].PhoneNumber;
                    switch (phoneNumberList[x].Type) {
                        case "Home":
                            esrDataForUSD.push("homePhone=" + number);
                            webServiceDataToUpdateVeteran.ftp_HomePhone = number;
                            break;
                        case "Business":
                            esrDataForUSD.push("workPhone=" + number);
                            webServiceDataToUpdateVeteran.ftp_WorkPhone = number;
                            break;
                        case "Mobile":
                            esrDataForUSD.push("mobilePhone=" + number);
                            webServiceDataToUpdateVeteran.ftp_MobilePhone = number;
                            break;
                        default:
                            break;
                    }
                }
            }

            /*address(es)*/
            var addressList = getDeepProperty("Data.Demographics.ContactInfo.Addresses.Address", esrResponseObject);
            if (addressList != undefined && Array.isArray(addressList) && addressList.length > 0) {
                for (var i = 0; i < addressList.length; i++) {
                    var thisAddress = addressList[i];
                    if (!!thisAddress.AddressTypeCode) {
                        if (!!thisAddress.Line1) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine1=" + thisAddress.Line1); }
                        if (!!thisAddress.Line2) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine2=" + thisAddress.Line2); }
                        if (!!thisAddress.Line3) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressLine3=" + thisAddress.Line3); }
                        if (!!thisAddress.City) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCity=" + thisAddress.City); }
                        if (!!thisAddress.State) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressState=" + thisAddress.State); }
                        if (!!thisAddress.ZipCode) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressZipCode=" + thisAddress.ZipCode); }
                        if (!!thisAddress.ZipPlus4) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressZipPlus4=" + thisAddress.ZipPlus4); }
                        if (!!thisAddress.County) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCounty=" + thisAddress.County); }
                        if (!!thisAddress.Country) { esrDataForUSD.push(thisAddress.AddressTypeCode + "AddressCountry=" + thisAddress.Country); }
                    }
                }
            }

            /*miscellaneous*/
            //If they are a veteran- pull that return
            var isAVeteranStr = getDeepProperty("Data.EnrollmentDeterminationInfo.Veteran", esrResponseObject);
            var isAVeteran = isAVeteranStr != undefined && isAVeteranStr.toLowerCase() == "true";
            esrDataForUSD.push("IsAVeteran=" + isAVeteran.toString());
            webServiceDataToUpdateVeteran.ftp_PatientType = isAVeteran ? "Veteran" : "Non-Veteran";

            var eligibilityType = getDeepProperty("Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type", esrResponseObject);
            if (eligibilityType != undefined) {
                esrDataForUSD.push("PrimaryEligibility=" + eligibilityType);
                webServiceDataToUpdateVeteran.ftp_PrimaryEligibilityCode = eligibilityType;
            }

            //Revised the code below as it does not change a false or missing value to No
            /*
            var unemployableStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.Unemployable", esrResponseObject);
            var unemployable = unemployableStr != undefined && unemployableStr.toLowerCase() == "true";
            esrDataForUSD.push("Unemployable=" + unemployable ? "Yes" : "No"); 
            webServiceDataToUpdateVeteran.ftp_Unemployable = unemployable.toString();
            */

            var unemployableStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.Unemployable", esrResponseObject);
            var unemployable = "No";
            if (unemployableStr != undefined && unemployableStr.toLowerCase() == "true") { unemployable = "Yes"; }
            esrDataForUSD.push("Unemployable=" + unemployable);
            webServiceDataToUpdateVeteran.ftp_Unemployable = unemployable;

            var svcConnIndicatorStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.ServiceConnectedIndicator", esrResponseObject);
            var svcConnIndicator = svcConnIndicatorStr != undefined && svcConnIndicatorStr.toLowerCase() == "true";
            esrDataForUSD.push("ServiceConnected=" + svcConnIndicator.toString());
            webServiceDataToUpdateVeteran.ftp_ServiceConnected = svcConnIndicator.toString();

            var svcConnPercentageStr = getDeepProperty("Data.EnrollmentDeterminationInfo.ServiceConnectionAward.ServiceConnectedPercentage", esrResponseObject);
            if (svcConnPercentageStr != undefined) {
                esrDataForUSD.push("ServiceConnectedPercentage=" + svcConnPercentageStr);
                webServiceDataToUpdateVeteran.ftp_SCPercent = svcConnPercentageStr;
            }

            var insuranceList = getDeepProperty("Data.InsuranceList.Insurance", esrResponseObject);
            var hasInsurance = insuranceList != undefined && Array.isArray(insuranceList) && insuranceList.length > 0;
            esrDataForUSD.push("HasInsurance=" + hasInsurance.toString());
            webServiceDataToUpdateVeteran.ftp_IsInsurance = hasInsurance.toString();

            //next of kin
            var associationList = getDeepProperty("Data.Associations.Association", esrResponseObject);
            if (associationList != undefined && Array.isArray(associationList) && associationList.length > 0) {
                for (var i = 0; i < associationList.length; i++) {
                    var thisAssociation = associationList[i];
                    if (thisAssociation.ContactType == "Primary Next of Kin") {
                        var nokString = !!thisAssociation.GivenName ? thisAssociation.GivenName.trim() : "";
                        nokString += (!!thisAssociation.MiddleName ? " " + thisAssociation.MiddleName.trim() : "");
                        nokString += (!!thisAssociation.FamilyName ? " " + thisAssociation.FamilyName.trim() : "");
                        nokString += (!!thisAssociation.Relationship ? ", " + thisAssociation.Relationship.trim() : "");
                        esrDataForUSD.push("NextOfKin=" + nokString);
                        webServiceDataToUpdateVeteran.ftp_NextofKin = nokString;
                    }
                }
            }

            /*Co Pay Info*/

            //Note: Medication Copayment Exemption Status, changed title to Medication Co-Pay
            //Note: Co-Payment Exemption Status, changed title to Outpatient Visit Co-Pay

            //Clear out existing copay data for the vetran
            webServiceDataToUpdateVeteran.ftp_CopaymentExemptionStatus = "";
            webServiceDataToUpdateVeteran.ftp_MedicationCopaymentexemptionstatus = "";

            //Update copay data for the veteran from ESR service
            var copayList = getDeepProperty("Data.FinancialsInfo.IncomeTest.Statuses.Status", esrResponseObject);
            if (copayList != undefined && Array.isArray(copayList) && copayList.length > 0) {
                for (var i = 0; i <= copayList.length - 1; i++) {
                    var copayStatusStr = copayList[i].Status;
                    var copayIncomeTestTypeStr = copayList[i].IncomeTestType;

                    if (copayStatusStr != undefined && copayIncomeTestTypeStr != undefined) {
                        if (copayIncomeTestTypeStr.toUpperCase() == "MEANS TEST") {
                            if (copayStatusStr.toUpperCase() == "MT COPAY REQUIRED" || copayStatusStr.toUpperCase() == "GMT COPAY REQUIRED" ||
                                copayStatusStr.toUpperCase() == "REQUIRED" || copayStatusStr.toUpperCase() == "CONVERTED - MT COPAY REQUIRED") {
                                //Outpatient Visit Co-pay 'Yes' result
                                esrDataForUSD.push("coPayStatus=" + "Yes");
                                webServiceDataToUpdateVeteran.ftp_CopaymentExemptionStatus = "Yes";
                            }
                            else if (copayStatusStr.toUpperCase() == "MT COPAY EXEMPT" || copayStatusStr.toUpperCase() == "NO LONGER REQUIRED" ||
                                copayStatusStr.toUpperCase() == "NO LONGER APPLICABLE" || copayStatusStr.toUpperCase() == "NOT CONVERTED - MT COPAY EXEMPT") {
                                //Outpatient Visit Co-pay 'No' result
                                esrDataForUSD.push("coPayStatus=" + "No");
                                webServiceDataToUpdateVeteran.ftp_CopaymentExemptionStatus = "No";
                            }
                        }
                        else if (copayIncomeTestTypeStr.toUpperCase() == "CO-PAY EXEMPTION TEST") {
                            if (copayStatusStr.toUpperCase() == "NON-EXEMPT" || copayStatusStr.toUpperCase() == "INCOMPLETE") {
                                //Medication Co-pay 'Yes' result
                                esrDataForUSD.push("medCoPayStatus=" + "Yes");
                                webServiceDataToUpdateVeteran.ftp_MedicationCopaymentexemptionstatus = "Yes";
                            }
                            else if (copayStatusStr.toUpperCase() == "EXEMPT" || copayStatusStr.toUpperCase() == "NO LONGER REQUIRED" ||
                                copayStatusStr.toUpperCase() == "NO LONGER APPLICABLE") {
                                //Medication Co-pay 'No' result
                                esrDataForUSD.push("medCoPayStatus=" + "No");
                                webServiceDataToUpdateVeteran.ftp_MedicationCopaymentexemptionstatus = "No";
                            }
                        }
                    }
                }
            }

            queryPatientRemarks();
        }
        else {
            //configData.isSensitive = true;
            writeToConsole("veteran sensitivity, due to empty response from ESR: " + configData.isSensitive);
            esrDataForUSD.push("IsSensitive=" + configData.isSensitive.toString());
            esrDataForUSD.push("ErrorOrEmpty=True");
            queryPatientRemarks();
        }
    }
    catch (e) {
        alert("Error processing ESR data: " + e.message);
        queryPatientRemarks();
    }
}

function queryPatientRemarks() {
    try {
        if (!!configData.ICN) {
            vlc_callAction('ftp_VeteranRemarks',
                {
                    "Request": configData.ICN.split('V')[0]
                },
                function (data) {
                    debugger;
                    processPatientRemarksData(JSON.parse(data.Response));
                    //var response = JSON.parse(data.Response);
                    //console.log(response);
                },
                function (err) {
                    console.log(err);
                }
            );
            ///////////////
            // OLD ON PREM
            ///////////////
            //if (!!retrievedSettings.ftp_DACURL) {
            //    if (patientRemarksUseSecureAPI == true) {
            //        if (retrievedSettings.hasOwnProperty("ftp_PatientRemarksSecureAPIURL") && !!retrievedSettings.ftp_PatientRemarksSecureAPIURL) {
            //            showLoadingMessage("Gathering Patient Remarks...");
            //            var securePatientRemarksURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_PatientRemarksSecureAPIURL;
            //            var securePatientRemarksParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: "000000" + configData.ICN + "000000" }) }];
            //            CrmSecurityTokenEncryption(
            //                securePatientRemarksURL,
            //                securePatientRemarksParams,
            //                context.getClientUrl(),
            //                function (pError, pResponse) {
            //                    writeToConsole("inside Patient Remarks query success callback");
            //                    if (!!pError) {
            //                        showErrorMessage("Error querying Patient Remarks: " + pError + ".", pResponse.responseText, "Error querying Secure Patient Remarks API");
            //                        processPatientRemarksData();
            //                    }
            //                    else if (pResponse.ErrorOccurred) {
            //                        showErrorMessage("Error querying Patient Remarks: " + pError + ".", pResponse.responseText, "Error querying Secure Patient Remarks API");
            //                        processPatientRemarksData();
            //                    }
            //                    else {
            //                        processPatientRemarksData(pResponse);
            //                    }
            //                }
            //            );
            //        }
            //        else {
            //            showErrorMessage("Could not find Patient Remarks Secure API URL.", "", "Configuration Error");
            //            return;
            //        }
            //    }
            //    else {
            //        if (retrievedSettings.hasOwnProperty("ftp_PatientRemarksAPIURL") && !!retrievedSettings.ftp_PatientRemarksAPIURL) {
            //            var patientRemarksURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_PatientRemarksAPIURL + configData.ICN;
            //            var jsonPatientRemarksData = null;
            //            showLoadingMessage("Gathering Patient Remarks...");
            //            $.ajax({
            //                type: "GET",
            //                url: patientRemarksURL,
            //                contentType: "application/json; charset=utf-8",
            //                dataType: "json",
            //                success: function (data) {
            //                    jsonPatientRemarksData = data;
            //                    processPatientRemarksData(jsonPatientRemarksData);
            //                },
            //                error: function (jqXHR, textStatus, errorThrown) {
            //                    //System Error
            //                    jsonPatientRemarksData = null;
            //                    processPatientRemarksData(jsonPatientRemarksData);
            //                },
            //                async: true, //kknab 2/13/18: switched to asynchronous because Remarks API was timing out
            //                cache: false
            //            });
            //        }
            //        else {
            //            showErrorMessage("Could not find Patient Remarks API URL.", "", "Configuration Error");
            //            return;
            //        }
            //    }
            //}
            //else {
            //    showErrorMessage("Could not find DAC URL.", "", "Configuration Error");
            //}
        }
        else {
            showErrorMessage("Could not query Patient Remarks API.", "Missing value for configData.ICN", "Configuration Error");
        }
    }
    catch (e) {
        alert('Query Patient Remarks Script Function Error(queryPatientRemarksSecure): ' + err.message);
        processPatientRemarksData();
    }
}
function processPatientRemarksData(patientRemarksData) {
    try {
        var patientRemarksString = '';
        if (patientRemarksData == null || patientRemarksData == '') {
            finishESROperations();
        }
        else {
            if (patientRemarksData.ErrorOccurred == false) {
                if (patientRemarksData.Data != null) {
                    for (var i = 0; i <= patientRemarksData.Data.length - 1; i++) {
                        if (patientRemarksData.Data[i].AssigningFacility != null && patientRemarksData.Data[i].AssigningFacility != '' && patientRemarksData.Data[i].Remarks != null && patientRemarksData.Data[i].Remarks != '') {
                            patientRemarksString = patientRemarksData.Data[i].AssigningFacility + ": " + patientRemarksData.Data[i].Remarks + "\n";
                        }
                    }
                }
                if (patientRemarksString != '') {
                    //Add to CRM
                    webServiceDataToUpdateVeteran.ftp_Remarks = patientRemarksString;
                }
                finishESROperations();
            }
            else {
                finishESROperations();
            }
        }
    }
    catch (err) {
        alert('Process Patient Remarks Data Script Function Error(processPatientRemarksData): ' + err.message);
        finishESROperations();
    }
}

function finishESROperations() {
    VCCM.USDHelper.CopyDataToReplacementParameters("ESR", esrDataForUSD, false);
    //proceed into logic flow: show deceasedMessage (or not) first, then show sensitivity message (or not) second
    checkDeceased();
}

function checkDeceased() {
    writeToConsole("begin checkDeceased()");
    if (configData.hasOwnProperty("deceasedDate") && !!configData.deceasedDate) {
        VCCM.USDHelper.CopyDataToReplacementParameters("Veteran Alerts", ["TabName=Deceased Veteran Warning"], false);

        //5/11/17: deceasedDate info comes from MVI search (passed into this page's configData object or found via unattended MVI searchon this page).
        var deathDesc = "This patient died on <span class=\"deceasedDateText\">" + configData.deceasedDate + "</span>.";
        $("#deceasedVetDescription").html(deathDesc);
        showDiv("#deceasedVetContainer");

        //Update CRM Deceased Date
        if (configData.deceasedDate != null && configData.deceasedDate != "") {
            webServiceDataToUpdateVeteran.ftp_DeceasedDate = configData.deceasedDate;
        }
    }
    else {
        checkSensitivity();
    }
}
function btn_deceasedVetYes_click() {
    checkSensitivity();
}
function btn_deceasedVetNo_click() {
    //end session via proper action call path under the "EndSession" event
    VCCM.USDHelper.OpenUSDURL("http://event/?eventname=EndSession");
}

function checkSensitivity() {
    writeToConsole("begin checkSensitivity()");
    if (configData.isSensitive.toString() == "true") {
        VCCM.USDHelper.CopyDataToReplacementParameters("Veteran Alerts", ["TabName=Sensitive Veteran Warning"], false);

        //if ((!!!configData.alreadyQueriedESR || !!configData.alreadyQueriedESR && configData.alreadyQueriedESR.toString() == "false") && getDeepProperty("Data.SensitivityInfo.SensityFlag", esrResponseObject) == undefined) {
        //    /*if  configData.isSensitive.toString() == "true" because ESR didn't tell us otherwise, then add some flavor text*/
        //	$("#sensitiveVetHeader").text("Possible Sensitive Veteran Warning")
        //	$("#sensitiveVetDescription").prepend("Could not determine veteran sensitivity...</br></br>")
        //}

        showDiv("#sensitiveVetContainer");
    }
    else if (!(configData.hasOwnProperty("isSensitive") && configData.isSensitive != null && configData.isSensitive != undefined)) {
        VCCM.USDHelper.CopyDataToReplacementParameters("Veteran Alerts", ["TabName=Sensitive Veteran Warning"], false);
        $("#sensitiveVetHeader").text("Possible Sensitive Veteran Warning")
        $("#sensitiveVetDescription").prepend("Could not determine veteran sensitivity...</br></br>")
        showDiv("#sensitiveVetContainer");
    }
    else {
        checkPatientFlags();
    }
}
function btn_sensitiveVetYes_click() {
    _userChoseToAccessSensitiveVeteran = true;
    setupMVILoggingCall(true, _userChoseToAccessSensitiveVeteran, null, 100000007);
}
function btn_sensitiveVetNo_click() {
    _userChoseToAccessSensitiveVeteran = false;
    setupMVILoggingCall(true, _userChoseToAccessSensitiveVeteran, null, 100000007);
}

function setupMVILoggingCall(pUserCanAccess, pUserChoseToAccess, pHDRStatusCode, pCRMLoggingRecordOptionSetValue) {
    //retrieve correct KVP then call the web service
    var queryString = "$select=bah_stringvalue_text&$filter=bah_name_text eq 'MVI_Sensitivity_Log' and statecode/Value eq 0";
    var retrievedKVP = null;
    showLoadingMessage("Logging your decision to " + (pUserChoseToAccess ? "" : "not") + " access this veteran...");
    SDK.REST.retrieveMultipleRecords(
        "bah_keyvaluepair",
        queryString,
        function (retrievedRecords) {
            if (typeof retrievedRecords != "undefined" && !!retrievedRecords && retrievedRecords.length == 1) {
                retrievedKVP = retrievedRecords[0];
            }
        },
        errorHandler,
        function () {
            if (!!retrievedKVP && !!retrievedKVP.bah_stringvalue_text) {
                var url = retrievedKVP.bah_stringvalue_text;
                var orgName = context.getClientUrl().indexOf("dev") > -1 ? context.getOrgUniqueName() + "DEV" : context.getOrgUniqueName();
                createMVISensitivityLogEntry(url, orgName, configData.fullname, configData.isSensitive, pUserCanAccess, pUserChoseToAccess, context.getUserName(), pHDRStatusCode, new Date(), "{00000000-0000-0000-0000-000000000000}", pCRMLoggingRecordOptionSetValue);
            }
            else {
                showErrorMessage("Could not find MVI Sensitivity Log URL.", "Check CRM key value pair records for the MVI_Sensitivity_Log url.", "Configuration Error");
            }
        }
    );
}
function createMVISensitivityLogEntry(pURL, pOrgName, pVeteranFullName, pIsSensitive, pUserCanAccess, pUserChoseToAccessVeteran, pUserFullName, pHDRStatusCode, pAccessTime, pSessionId, pCRMLoggingRecordOptionSetValue) {
    writeToConsole("inside createMVISensitivityLogEntry()");
    var postData = {
        Organization_Name: pOrgName, //string
        Veteran: pVeteranFullName, //string
        Sensitive_Veteran: pIsSensitive, //boolean
        Accessed: pUserChoseToAccessVeteran, //boolean
        Who_Accessed: pUserFullName, //string
        Access_Time: formatDateTime(pAccessTime), //string
        SessionId: pSessionId //string
    };
    if (!!pHDRStatusCode) {
        postData.HDR_Response_Code = pHDRStatusCode;
    }

    $.ajax({
        type: "POST",
        data: postData,
        url: pURL,
        success: function (response, textStatus, XmlHttpRequest) {
            createCRMRecordAccessLog(pUserChoseToAccessVeteran, pCRMLoggingRecordOptionSetValue);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Error logging your Sensitive Veteran access with MVI: " + errorThrown);
            createCRMRecordAccessLog(pUserChoseToAccessVeteran, pCRMLoggingRecordOptionSetValue);
            //showErrorMessage("Error logging your Sensitive Veteran access with MVI: " + errorThrown + ".", XMLHttpRequest.responseText, "Sensitive Veteran Audit Error");
        },
        async: true,
        cache: false
    });
}

function createCRMRecordAccessLog(pUserChoseToAccessVeteran, pHDRStatusCodeOptionSetValue) {
    writeToConsole("inside createCRMRecordAccessLog()");
    var dataForContext = [];
    if (configData.isSensitive.toString() == "true") {
        dataForContext.push("AcknowledgedSensitivity=true");
    }
    dataForContext.push("UserChoseToAccess=" + pUserChoseToAccessVeteran.toString());
    VCCM.USDHelper.CopyToUSDContext(dataForContext);

    if (!!context && !!configData) {
        if (configData.hasOwnProperty("fullname") && configData.hasOwnProperty("contactid")) {
            //create an ftp_recordaccess record and then proceed w/ USD logic
            var simpleName = configData.fullname + (pUserChoseToAccessVeteran ? "" : " not") + " accessed by " + context.getUserName();
            simpleName = simpleName.length > 100 ? simpleName.substring(0, 97) + "..." : simpleName;
            var newRecord = {
                ftp_issensitive: configData.isSensitive, //boolean
                ftp_Accessed: pUserChoseToAccessVeteran, //boolean
                ftp_veteran: { //lookup to contact
                    Id: configData.contactid,
                    Name: configData.fullname,
                    LogicalName: "contact"
                },
                ftp_accessinguser: { //lookup to systemuser
                    Id: context.getUserId(),
                    Name: context.getUserName(),
                    LogicalName: "systemuser"
                },
                ftp_name: simpleName,
                ftp_HDRResponseStatusCode: {
                    Value: pHDRStatusCodeOptionSetValue /*this will always be 100000007 as of 12/7/2017*/
                }
            };

            //create, then call USD event to close this WR or close the session
            SDK.REST.createRecord(
                newRecord,
                "ftp_recordaccess",
                function (createdRecord) {
                    if (pUserChoseToAccessVeteran) {
                        checkPatientFlags();
                    }
                    else {
                        VCCM.USDHelper.OpenUSDURL("http://event/?eventname=EndSession");
                    }
                },
                function (error) {
                    alert("Error creating record access log in CRM: " + error.message);
                    showErrorMessage(error.message, "", "Error creating record access log in CRM.");
                    if (pUserChoseToAccessVeteran) {
                        checkPatientFlags();
                    }
                    else {
                        VCCM.USDHelper.OpenUSDURL("http://event/?eventname=EndSession");
                    }
                }
            );
        }
        else {
            showErrorMessage("Not enough information to create Record Access log in CRM.", "Missing 'fullname' and/or 'contactid' URL parameters.", "Configuration error.");
        }
    }
    else {
        showErrorMessage("Missing page context or URL parameters.", "", "Configuration error");
    }
}

function vlc_callAction(action, data, callback, errHandler) {
    var serverURL = Xrm.Page.context.getClientUrl();
    var req = new XMLHttpRequest();
    // specify name of the entity, record id and name of the action in the Wen API Url
    req.open("POST", serverURL + "/api/data/v8.2/" + action, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
            req.onreadystatechange = null;
            if (this.status == 200 && this.response != null) {
                var data = JSON.parse(this.response);
                callback(data);
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

function checkPatientFlags() {
    //btn_flagsYes_click();
    //return;
    debugger;
    if (configData.hasOwnProperty("ICN") && !!configData.ICN) {
        var vlc_loginResponse = "";
        vlc_callAction('ftp_VeteranFlags',
            {
                "Request": configData.ICN.split('V')[0]
            },
            function (data) {
                debugger;
                processFlagsResponse(JSON.parse(data.Response));
                //var response = JSON.parse(data.Response);
                //console.log(response);
            },
            function (err) {
                console.log(err);
            }
        );

        //////////////////////////////////////////////////////
        // OLD ON PREM
        //////////////////////////////////////////////////////
        //if (flagsUseSecureAPI == true) {
        //    if (retrievedSettings.hasOwnProperty("ftp_FlagsAPISecureURL") && !!retrievedSettings.ftp_FlagsAPISecureURL) {
        //        var flagsSecureURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_FlagsAPISecureURL;
        //        var flagsSecureParams = [{ key: "identifier", type: "c:string", value: JSON.stringify({ NationalId: configData.nationalid }) }];
        //        showLoadingMessage("Checking patient flags...");
        //        CrmSecurityTokenEncryption(
        //            flagsSecureURL,
        //            flagsSecureParams,
        //            context.getClientUrl(),
        //            function (pError, pResponse) {
        //                writeToConsole("inside flags secure API query success callback");
        //                if (!!pError) {
        //                    showErrorMessage("Error querying flags API: " + pError + ".", pResponse.responseText, "Error querying Flags API");
        //                }
        //                else if (pResponse.ErrorOccurred) {
        //                    showErrorMessage(
        //                        !!pResponse.ErrorMessage ? pResponse.ErrorMessage : "Unknown error.",
        //                        !!pResponse.DebugInfo ? pResponse.DebugInfo : "No DebugInfo available.",
        //                        "Error querying Flags API"
        //                    );
        //                }
        //                else {
        //                    processFlagsResponse(pResponse);
        //                }
        //            }
        //        );
        //    }
        //    else {
        //        showErrorMessage("Could not query HDR for patient flags.", "Missing Flags API Secure URL.", "Configuration Error");
        //    }
        //}
        //else {
        //    if (retrievedSettings.hasOwnProperty("ftp_FlagsAPIURL") && !!retrievedSettings.ftp_FlagsAPIURL) {
        //        var flagsQueryURL = retrievedSettings.ftp_DACURL + retrievedSettings.ftp_FlagsAPIURL + configData.nationalid;
        //        showLoadingMessage("Checking patient flags...");
        //        $.ajax({
        //            type: "GET",
        //            contentType: "application/json; charset=utf-8",
        //            datatype: "json",
        //            url: flagsQueryURL,
        //            beforeSend: function (XMLHttpRequest) {
        //                //Specifying this header ensures that the results will be returned as JSON.
        //                XMLHttpRequest.setRequestHeader("Accept", "application/json");
        //            },
        //            success: function (response, textStatus, XmlHttpRequest) {
        //                writeToConsole("inside Patient Flags query success callback");
        //                processFlagsResponse(response);
        //            },
        //            error: function (XMLHttpRequest, textStatus, errorThrown) {
        //                showErrorMessage("Error querying flags API: " + errorThrown + ".", XMLHttpRequest.responseText, "Error querying Flags API");
        //            },
        //            async: true,
        //            cache: false
        //        });
        //    }
        //    else {
        //        showErrorMessage("Could not query HDR for patient flags.", "Missing Flags API URL.", "Configuration Error");
        //    }
        //}
    }
    else {
        showErrorMessage("Could not query HDR for patient flags.", "Missing patient's National ID.", "Configuration Error");
    }
}
function processFlagsResponse(flagsResponse) {
    if (!flagsResponse.ErrorOccurred) {
        var data = flagsResponse.hasOwnProperty("Data") ? flagsResponse.Data /*non prod*/ : flagsResponse /*prod*/; /*this accomodates schema differences between Prod and NonProd responses*/
        if (data.hasOwnProperty("length") && data.length > 0) {
            writeToConsole("found " + data.length + " flags.");
            $("#patientFlagsDescription").html("");
            $("#patientFlagsFormContainer").html("");
            $.each(data, function () {
                var thisId = this.Id;
                var thisHeaderId = "h2_" + thisId.replace(/\W+/g, "");
                var thisParagraphId = "p_" + thisId.replace(/\W+/g, "");

                $("#patientFlagsDescription").append($("<h3 id='" + thisHeaderId + "' class='flagTypeHeader'>" + this.Type + "</h3>").click(function () {
                    $("#" + thisParagraphId).is(":visible") ? $("#" + thisParagraphId).hide() : $("#" + thisParagraphId).show();
                })).append($("<p id='" + thisParagraphId + "' class='flagItem'>" + this.Name + "</p>"));
            });
            $("#patientFlagsFormContainer").append("<button tabindex='1' class='ms-crm-RefreshDialog-Button' id='abtn' style='margin-left: 8px; width: auto;' onclick='btn_flagsYes_click()' type='button'>Acknowledge</button>");
            VCCM.USDHelper.CopyDataToReplacementParameters("Veteran Alerts", ["TabName=Patient Flags"], false);
            showDiv("#patientFlagsContainer");
        }
        else {
            showLoadingMessage("No additional acknowledgement required. Opening veteran and beginning session...", true);
            //no flags, good to go!
            btn_flagsYes_click();
        }
    }
    else { /*no data or error from HDR Flags query*/
        showErrorMessage(
            !!flagsResponse.ErrorMessage ? flagsResponse.ErrorMessage : "Unknown error.",
            !!flagsResponse.DebugInfo ? flagsResponse.DebugInfo : "No DebugInfo available.",
            "Error querying Flags API"
        );
    }
}
function btn_flagsYes_click() {
    //flags have been acknowledged, good to go!
    prepareAndOpenRecords();
}
function btn_flagsNo_click() {
    //end session via proper action call path under the "EndSession" event
    VCCM.USDHelper.OpenUSDURL("http://event/?eventname=EndSession");
}

function prepareAndOpenRecords() {
    showLoadingMessage("No additional acknowledgement required. Opening veteran and beginning session...", true);
    var eventParameterArray = [];
    eventParameterArray.push(
        "originatedFromMVISearch=" + (!!configData.originatedFromMVISearch && (configData.originatedFromMVISearch == true || configData.originatedFromMVISearch == "true")).toString(),
        "ICN=" + configData.ICN,
        "DFN=" + configData.DFN,
        "noMVIMatch=" + (configData.ICN == "MISSING").toString(),
        "contactId=" + configData.contactid,
        "contactFullName=" + configData.fullname
    );
    if (!!configData.CachedICNId) { eventParameterArray.push("CachedICNId=" + configData.CachedICNId); }
    if (!!configData.EDIPI) { eventParameterArray.push("EDIPI=" + configData.EDIPI); }
    if (!!configData.ftp_facility) { eventParameterArray.push("facilityName=" + configData.ftp_facility); }
    if (!!configData.ftp_currentfacilityid && !!configData.ftp_currentfacilityidname) {
        eventParameterArray.push(
            "currentFacilityId=" + configData.ftp_currentfacilityid,
            "currentFacilityIdName=" + configData.ftp_currentfacilityidname
        );
    }

    if (configData.ICN == "MISSING") {
        //we enter this branch when we've reached VeteranAlerts.html after creating a new Veteran record from the a null-returning MVI search
        fireSavedEvent(eventParameterArray);
    }
    else if ((configData.isSensitive.toString() == "true"/* && !!sensitiveVetResponseObject*/) || configData.isSensitive.toString() == "false") {
        /*follow this branch for existing veterans who have been found in MVI, checked in ESR, and access has been audited; or if the vet isn't sensitive.*/
        //find phone numbers from esrResponseObject to add to event parameters
        //Phones drilldown: Data{Demographics{ContactInfo{Phones{Phone[]}}}}
        var phoneNumberList = getDeepProperty("Data.Demographics.ContactInfo.Phones.Phone", esrResponseObject);
        if (phoneNumberList != undefined && Array.isArray(phoneNumberList) && phoneNumberList.length > 0) {
            writeToConsole("found phone numbers from ESR");

            for (var x in phoneNumberList) {
                var number = phoneNumberList[x].PhoneNumber;
                switch (phoneNumberList[x].Type) {
                    case "Home":
                        eventParameterArray.push("homePhone=" + number);
                        break;
                    case "Business":
                        eventParameterArray.push("workPhone=" + number);
                        break;
                    case "Mobile":
                        eventParameterArray.push("mobilePhone=" + number);
                        break;
                    default:
                        break;
                }
            }
        }
        //check MHV IDs to get a session token (and save it to cookies), then fire saved event to open the appropriate records
        //deprecated as of 3/26/18.  configData.MHVIDs will always be an empty array.
        if (!!configData.MHVIDs && !!retrievedSettings.ftp_MHVSessionAPIURL) {
            VCCM.MHVHelper.GetSessionToken(
                retrievedSettings.ftp_DACURL + retrievedSettings.ftp_MHVSessionAPIURL,
                configData.MHVIDs.split(","),
                function (pMHVObject) {
                    if (!!pMHVObject) {
                        mhvObject = pMHVObject;
                        VCCM.USDHelper.CopyDataToReplacementParameters("MHV", ["ID=" + pMHVObject.ID], false);
                        fireSavedEvent(eventParameterArray);
                    }
                    else {
                        mhvObject = null;
                        fireSavedEvent(eventParameterArray);
                    }
                },
                {},
                function (pError) {
                    errorHandler(pError);
                    mhvObject = null;
                    fireSavedEvent(eventParameterArray);
                }
            );
        }
        else {
            mhvObject = null;
            fireSavedEvent(eventParameterArray);
        }
    }
    else { }
}
function developerBypass() {
    configData.isSensitive = false;
    prepareAndOpenRecords();
}

function fireSavedEvent(pParameterArray) {
    var baseURL = "http://event/?eventname=Saved";
    var fullURL = [baseURL].concat(pParameterArray).join("&");

    if (!!configData.contactid && !!esrResponseObject) {
        //update Veteran before firing Saved event.
        //permanent address
        try {
            var addressArray = getDeepProperty("Data.Demographics.ContactInfo.Addresses.Address", esrResponseObject);
            var permAddress = addressArray[ArrayIndexOfObjectByAttribute(addressArray, "AddressTypeCode", "Permanent")];
            var address1Line1 = getDeepProperty("Line1", permAddress);
            var address1Line2 = getDeepProperty("Line2", permAddress);
            var address1Line3 = getDeepProperty("Line3", permAddress);
            var address1City = getDeepProperty("City", permAddress);
            var address1State = getDeepProperty("State", permAddress);
            var address1Zip = getDeepProperty("ZipCode", permAddress);
            var address1Country = getDeepProperty("Country", permAddress);

            if (!!address1Line1) webServiceDataToUpdateVeteran.Address1_Line1 = address1Line1;
            if (!!address1Line2) webServiceDataToUpdateVeteran.Address1_Line2 = address1Line2;
            if (!!address1Line3) webServiceDataToUpdateVeteran.Address1_Line3 = address1Line3;
            if (!!address1City) webServiceDataToUpdateVeteran.Address1_City = address1City;
            if (!!address1State) webServiceDataToUpdateVeteran.Address1_StateOrProvince = address1State;
            if (!!address1Zip) webServiceDataToUpdateVeteran.Address1_PostalCode = address1Zip;
            if (!!address1Country) webServiceDataToUpdateVeteran.Address1_Country = address1Country;
        }
        catch (e) {

        }

        //temporary address
        try {
            var addressArray = getDeepProperty("Data.Demographics.ContactInfo.Addresses.Address", esrResponseObject);
            var tempAddress = addressArray[ArrayIndexOfObjectByAttribute(addressArray, "AddressTypeCode", "Temporary")];
            var address2Line1 = getDeepProperty("Line1", tempAddress);
            var address2Line2 = getDeepProperty("Line2", tempAddress);
            var address2Line3 = getDeepProperty("Line3", tempAddress);
            var address2City = getDeepProperty("City", tempAddress);
            var address2State = getDeepProperty("State", tempAddress);
            var address2Zip = getDeepProperty("ZipCode", tempAddress);
            var address2Country = getDeepProperty("Country", tempAddress);

            if (!!address2Line1) webServiceDataToUpdateVeteran.Address2_Line1 = address2Line1;
            if (!!address2Line2) webServiceDataToUpdateVeteran.Address2_Line2 = address2Line2;
            if (!!address2Line3) webServiceDataToUpdateVeteran.Address2_Line3 = address2Line3;
            if (!!address2City) webServiceDataToUpdateVeteran.Address2_City = address2City;
            if (!!address2State) webServiceDataToUpdateVeteran.Address2_StateOrProvince = address2State;
            if (!!address2Zip) webServiceDataToUpdateVeteran.Address2_PostalCode = address2Zip;
            if (!!address2Country) webServiceDataToUpdateVeteran.Address2_Country = address2Country;
        }
        catch (e) {

        }

        //current facility (the facility selected from MVI search results)
        if (configData.hasOwnProperty("ftp_currentfacilityid") && !!configData.ftp_currentfacilityid && configData.hasOwnProperty("ftp_currentfacilityidname") && !!configData.ftp_currentfacilityidname) {
            webServiceDataToUpdateVeteran.ftp_currentfacilityid = {
                LogicalName: "ftp_facility",
                Id: configData.ftp_currentfacilityid,
                Name: configData.ftp_currentfacilityidname
            };
        }

        /*as of 3/26/18, all MHV functionality has been deprecated.  mhvObject will always be empty.*/
        webServiceDataToUpdateVeteran.ftp_RegisteredInMHV = !!mhvObject && !!mhvObject.ID && !!mhvObject.Token;

        SDK.REST.updateRecord(
            configData.contactid,
            webServiceDataToUpdateVeteran,
            "Contact",
            function () {
                VCCM.USDHelper.OpenUSDURL(fullURL);
            },
            function (e) {
                showErrorMessage("Error updating veteran in CRM!", e.message, "CRM update error");
                console.error(e.message);
                VCCM.USDHelper.OpenUSDURL(fullURL);
            }
        );
    }
    else {
        if (!!configData.contactid) {
            //even if we didn't get a response from ESR, at least update the ftp_RegisteredinMHV field and ftp_currentfacilityid field
            var updateObject = {};
            /*as of 3/26/18, all MHV functionality has been deprecated.  mhvObject will always be empty.*/
            updateObject.ftp_RegisteredInMHV = !!mhvObject && !!mhvObject.ID && !!mhvObject.Token;
            if (configData.hasOwnProperty("ftp_currentfacilityid") && !!configData.ftp_currentfacilityid && configData.hasOwnProperty("ftp_currentfacilityidname") && !!configData.ftp_currentfacilityidname) {
                updateObject.ftp_currentfacilityid = {
                    LogicalName: "ftp_facility",
                    Id: configData.ftp_currentfacilityid,
                    Name: configData.ftp_currentfacilityidname
                };
            }

            SDK.REST.updateRecord(
                configData.contactid,
                updateObject,
                "Contact",
                function () {
                    VCCM.USDHelper.OpenUSDURL(fullURL);
                },
                function (e) {
                    showErrorMessage("Error updating veteran in CRM!", e.message, "CRM update error");
                    console.error(e.message);
                    VCCM.USDHelper.OpenUSDURL(fullURL);
                }
            );
        }
        else {
            VCCM.USDHelper.OpenUSDURL(fullURL); //no updates to contact.
        }
    }
}

function showErrorMessage(pErrorMessage, pDebugMessage, pAlternateHeaderTitle) {
    writeToConsole("inside showErrorMessage()");
    if ($("#errorContainer").is(":hidden")) {
        if (!!pAlternateHeaderTitle) $("#errorHeaderTitle").text(pAlternateHeaderTitle);
        $("#errorHeaderDescription").html("<p>" + pErrorMessage + "<br/><br/>" + pDebugMessage + "</p>");
        showDiv("#errorContainer");
    }
}
function btn_errorOK_click() {
    VCCM.USDHelper.OpenUSDURL("http://event/?eventname=EndSession");
}
function btn_errorTryAgain_click() {
    location.reload();
}
function enableDebugMode() {
    $("#btn_errorTryAgain").show();
}

function showLoadingMessage(pMessage, pGoodToGo) {
    if (!!pMessage) {
        $("#progressText").html(pMessage);
        if (pGoodToGo == true) {
            $("#progressImg").prop("src", "/_imgs/BusinessRuleEditor/ConditionButton_OK_Default_24.png");
        }
        $("#progressImg").prop("alt", pMessage);
        $("#progressImg").prop("title", pMessage);
    }
    showDiv("#loadingGifDiv");
}
function showDiv(pDivToShow) {
    var knownDivs = [
        "#loadingGifDiv",
        "#errorContainer",
        "#sensitiveVetContainer",
        "#deceasedVetContainer",
        "#vistaUserImpersonationContainer",
        "#vistaUsersListContainer",
        "#patientFlagsContainer",
        "#insufficientRightsContainer"
    ];
    for (var d = 0; d < knownDivs.length; d++) {
        if (knownDivs[d] == pDivToShow) {
            $(knownDivs[d]).show();
        }
        else {
            $(knownDivs[d]).hide();
        }
    }
}
function getContext() {
    return (typeof GetGlobalContext != "undefined") ? GetGlobalContext() : null;
}
function parseDataParametersFromUrl(pQueryString) {
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
        var thisValue = customDataArray[i][1];
        if (thisValue === "null") {
            thisValue = null;
        }
        configObject[customDataArray[i][0]] = thisValue;
    }

    //optionally, put code here to show body once we have the config object, if it's taking too long
    return configObject;
}
function buildQueryFilter(field, value, and) {
    return !!field ? ((and ? " and " : "") + field + " eq " + (value == '' ? "null" : "'" + value + "'")) : "";
}
function errorHandler(error) {
    writeToConsole(error.message);
    showErrorMessage("Error", error.message, "Error");
}
function writeToConsole(message) {
    if (typeof console != 'undefined') console.log(message);
}
function xmlParser(txt) {
    //cross browser responseXml to return a XML object
    var xmlDoc = null;
    try {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(txt);
    }
    catch (e) {
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt, "text/xml");
        }
        else {
            showErrorMessage("Cannot convert string to a cross-browser XML object.", "", "Error parsing XML");
        }
    }
    return xmlDoc;
}
function getDeepProperty(pPath, pObject) {
    if (!!pPath) {
        var pathAsArray = pPath.split(".");
        var returnObj = !!pObject ? pObject : window[pathAsArray.shift()];
        if (typeof returnObj != "undefined") {
            while (!!returnObj && pathAsArray.length > 0) {
                var nextLevel = pathAsArray.shift();
                var isArrayQuery = nextLevel.indexOf("[") > -1 && nextLevel.indexOf("]") == nextLevel.indexOf("[") + 2;
                var nextLevelName = !isArrayQuery ? nextLevel : nextLevel.split("[")[0];
                var nextLevelArrayMember = !isArrayQuery ? null : parseInt((nextLevel.split("[")[1]).substr(0, (nextLevel.split("[")[1].length)));

                returnObj = isArrayQuery ? returnObj[nextLevelName][nextLevelArrayMember] : returnObj[nextLevelName];

            }
            return returnObj;
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function ArrayIndexOfObjectByAttribute(pArray, pAttr, pValue) {
    if (!!pArray && Object.prototype.toString.call(pArray) == "[object Array]") {
        for (var i = 0; i < pArray.length; i += 1) {
            if (pArray[i][pAttr] === pValue) {
                return i;
            }
        }
    }
    return -1;
}
function formatDateTime(pDate) {
    var returnString = "";
    if (!!pDate && Object.prototype.toString.call(pDate) === "[object Date]") {
        var monthString = zeroPadDatePartAsString(pDate.getMonth() + 1, 2);
        var dateString = zeroPadDatePartAsString(pDate.getDate(), 2);
        var yearString = zeroPadDatePartAsString(pDate.getFullYear(), 4);
        var hoursString = zeroPadDatePartAsString(pDate.getHours(), 2);
        var minutesString = zeroPadDatePartAsString(pDate.getMinutes(), 2);
        var secondsString = zeroPadDatePartAsString(pDate.getSeconds(), 2);
        returnString = [monthString, dateString, yearString].join("/") + " " + [hoursString, minutesString, secondsString].join(":");
    }
    return returnString;
}
function zeroPadDatePartAsString(pValue, pPlaces) {
    return pValue.toString().length < pPlaces ? zeroPadDatePartAsString("0" + pValue, pPlaces) : pValue.toString();
}