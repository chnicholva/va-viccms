using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using MVI.PersonSearch.Plugin.Helpers;
using PersonSearch.Plugin.Entities.Person;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugin.Helpers;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Helpers
{
    public static class PatientPersonExtensions
    {
        public static Entity Map(this PatientPerson patient, IOrganizationService organizationService, Logger logger, VeisConfig config)
        {
            Entity ent = null;
            if (patient != null)
            {
                ent = new Entity("crme_person");
                ent.Id = new Guid();
                ent.Attributes.Add("crme_ssn", patient.SocialSecurityNumber);
                ent.Attributes.Add("crme_primaryphone", patient.PhoneNumber);
                ent.Attributes.Add("crme_branchofservice", patient.BranchOfService);
                ent.Attributes.Add("crme_recordsource", patient.RecordSource);
                ent.Attributes.Add("crme_gender", patient.GenderCode);
                ent.Attributes.Add("crme_deceaseddate", patient.DeceasedDate);
                ent.Attributes.Add("crme_identitytheft", patient.IdentifyTheft);
                ent.Attributes.Add("crme_url", "&select=*&$filter=crme_patientmviidentifier eq '" + patient.Identifier + "' and crme_searchtype eq 'SelectedPersonSearch'");
                ent.Attributes.Add("crme_dobstring", patient.BirthDate);

                if (patient.NameList != null)
                {
                    var legalName = patient.NameList.GetName("Legal", true);
                    if (legalName != null)
                    {
                        ent.Attributes.AddRange(legalName.Map());
                    }
                }
                if (patient.Address != null)
                {
                    ent.Attributes.AddRange(patient.Address.Map());
                    if (!ent.Attributes.Contains("crme_fulladdress"))
                    {
                        ent.Attributes.Add("crme_fulladdress", patient.FullAddress);
                    }
                }
            }

            TryGetMviQueryParams(patient, ent, logger);
            TryGetCorpInfo(patient, ent, logger);
            ent.Attributes.Add("crme_veteransensitivitylevel", patient.VeteranSensitivityLevel);
            ent.Attributes.Add("crme_edipi", patient.EdiPi);

            List<KeyValuePair<string, string>> list = null;
            string empty = string.Empty;
            if (config.GetSensitiveInfo)
            {
                List<string> strs = new List<string>();
                strs.Add(TryGetICN(patient, logger));
                string url = getKVPSetting("sensitive_endpoint", organizationService);
                List<string> list2 = new List<string>();
                list2.Add(TryGetICN(patient, logger));
                string keys = config.VeisConfiguration.SvcConfigInfo.ApimSubscriptionKey;
                NonVetResponse nvResponse = getVHAVeteranEmployeeFlags(String.Format("{0}{1}", config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl, config.EmployeeEndpoint), keys, strs, logger);
                List<VeteranEmployeeFlag> vHAVeteranEmployeeFlags = new List<VeteranEmployeeFlag>();

                foreach (NVDatum datum in nvResponse.Data)
                {
                    if (datum.NationalId == null)
                    {
                        vHAVeteranEmployeeFlags.Add(new VeteranEmployeeFlag() { NationalId = "", Value = "NO" });
                    }
                    else if (!(datum.Veteran == null || datum.Veteran == "" ? false : !(datum.Veteran.ToUpper() == "YES")))
                    {
                        vHAVeteranEmployeeFlags.Add(new VeteranEmployeeFlag() { NationalId = datum.NationalId, Value = "NO" });
                    }
                    else if (!(!(datum.Veteran.ToUpper() == "NO") || datum.NewPersonIndicator == null ? true : !(datum.NewPersonIndicator.ToUpper() == "YES")))
                    {
                        vHAVeteranEmployeeFlags.Add(new VeteranEmployeeFlag() { NationalId = datum.NationalId, Value = "YES" });
                    }
                    else if ((!(datum.Veteran.ToUpper() == "NO") || datum.PrimaryEligibilityCode == null ? false : datum.PrimaryEligibilityCode.ToUpper() == "EMPLOYEE"))
                    {
                        vHAVeteranEmployeeFlags.Add(new VeteranEmployeeFlag() { NationalId = datum.NationalId, Value = "YES" });
                    }

                }

                string isEmp = string.Empty;
                if (vHAVeteranEmployeeFlags.Count > 0)
                {
                    isEmp = isEmployee(ent["crme_icn"].ToString(), vHAVeteranEmployeeFlags);
                }
                HandleSensitivityMasking(config, patient, ent, isEmp);
            }

            return ent;
        }

        private static NonVetResponse getVHAVeteranEmployeeFlags(string url, string subKeys, List<string> list, Logger logger)
        {
            NonVetRequest request = new NonVetRequest()
            {
                ClientName = "VCCM",
                Format = "JSON",
                NationalIds = list.ToArray()
            };
            string str = JsonHelper.Serialize(request);
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            if (subKeys.Length > 0)
            {
                string[] headers = subKeys.Split('|');
                for (int i = 0; i < headers.Length; i = i + 2)
                {
                    httpWebRequest.Headers.Add(headers[i], headers[i + 1]);
                }
            }
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(str);
            }

            WebResponse webResponse = httpWebRequest.GetResponse();
            Stream webStream = webResponse.GetResponseStream();
            StreamReader responseReader = new StreamReader(webStream);
            string responseString = responseReader.ReadToEnd();
            responseReader.Close();

            NonVetResponse nvResponse = JsonHelper.Deserialize<NonVetResponse>(responseString);
            /*
             * List<KeyValuePair<string, string>> keyValuePairs = new List<KeyValuePair<string, string>>();
            try
            {
                foreach (NVDatum datum in nvResponse.Data)
                {
                    if (datum.NationalId == null)
                    {
                        // no nationalid
                        keyValuePairs.Add(new KeyValuePair<string, string>("", "NO"));
                    }
                    else if (!(datum.Veteran == null || datum.Veteran == "" ? false : !(datum.Veteran.ToUpper() == "YES")))
                    {
                        keyValuePairs.Add(new KeyValuePair<string, string>(datum.NationalId, "NO"));
                    }
                    else if (!(!(datum.Veteran.ToUpper() == "NO") || datum.NewPersonIndicator == null ? true : !(datum.NewPersonIndicator.ToUpper() == "YES")))
                    { 
                        keyValuePairs.Add(new KeyValuePair<string, string>(datum.NationalId, "YES"));
                    }
                    else if ((!(datum.Veteran.ToUpper() == "NO") || datum.PrimaryEligibilityCode == null ? false : datum.PrimaryEligibilityCode.ToUpper() == "EMPLOYEE"))
                    {
                        keyValuePairs.Add(new KeyValuePair<string, string>(datum.NationalId, "YES"));
                    }
                }
            }
            catch (Exception ex)
            {
                //Exception exception = ex;
                //base.Logger.WriteDebugMessage(string.Concat("ERROR::Error pulling NonVet info from HDR with the supplied ICNs.", exception.Message));
            }
            return keyValuePairs;*/

            return nvResponse;
        }


        private static string isEmployee(string ICN, List<VeteranEmployeeFlag> empList)
        {
            string value;
            int num = 0;
            while (true)
            {
                if (num > empList.Count)
                {
                    //base.Logger.WriteDebugMessage("DEBUG::Employee ICN No match found for employee logic.");
                    value = "";
                    break;
                }
                else if (!(empList[num].NationalId == ICN))
                {
                    num++;
                }
                else
                {
                    //Logger logger = base.Logger;
                    //string[] key = new string[] { "DEBUG::Employee ICN match found : ", null, null, null, null, null };
                    //VeteranEmployeeFlag item = empList[num];
                    //key[1] = item.Key;
                    //key[2] = " and ";
                    //key[3] = ICN;
                    //key[4] = " values match, returning: ";
                    //item = empList[num];
                    //key[5] = item.Value;
                    //logger.WriteDebugMessage(string.Concat(key));
                    value = empList[num].Value;
                    break;
                }
            }
            return value;
        }

        private static void HandleSensitivityMasking(VeisConfig config, PatientPerson person, Entity newPerson, string employee)
        {
            if (config.GetSensitiveInfo && newPerson.Contains("crme_icn") && newPerson["crme_icn"].ToString() != "" && !config.OrgName.ToUpper().Contains("VRE"))
            {
                newPerson["crme_veteransensitivitylevel"] = getSensitivityLevelVHA(config, newPerson, employee);
                if (config.OrgName.ToUpper().Contains("VCL") && (newPerson["crme_veteransensitivitylevel"].ToString() == "true:false" || newPerson["crme_veteransensitivitylevel"].ToString() == "true:true" || newPerson["crme_veteransensitivitylevel"] == "false:true"))
                {
                    newPerson["crme_dobstring"] = "XX/XX/XXXX";
                    newPerson["crme_ssn"] = "XXXXXXXXX";
                    newPerson["crme_primaryphone"] = "(XXX) XXX-XXXX";
                    if (person.Address != null && person.Address.StreetAddressLine != "" && person.Address.State != "" && person.Address.City != "" && person.Address.State != "" && person.Address.PostalCode != "" && person.Address.StreetAddressLine != string.Empty)
                    {
                        string a = person.Address.StreetAddressLine + " " + person.Address.City + " " + person.Address.State + " " + person.Address.PostalCode;
                        if (a != "   ")
                        {
                            newPerson["crme_fulladdress"] = "XXXXXXXXX  XXXX, XX  XXXXX";
                            newPerson["crme_address1"] = "XXXXXXXXX";
                            newPerson["crme_city"] = "XXXX";
                            newPerson["crme_addressstate"] = "XX";
                            newPerson["crme_addresszip"] = "XXXXX";
                        }
                        else
                        {
                            newPerson["crme_fulladdress"] = "";
                        }
                    }
                }
                else if (newPerson["crme_veteransensitivitylevel"].ToString() == "true:true" || newPerson["crme_veteransensitivitylevel"].ToString() == "false:true")
                {
                    newPerson["crme_dobstring"] = "XX/XX/XXXX";
                    newPerson["crme_ssn"] = "XXXXXXXXX";
                }
            }
            else
            {
                newPerson["crme_dobstring"] = person.BirthDate;
                newPerson["crme_ssn"] = person.SocialSecurityNumber;
            }
        }

        private static string getSensitivityLevelVHA(VeisConfig config, Entity person, string employee)
        {
            string url = String.Format("{0}{1}{2}", config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl, config.SensitiveEndpoint, person["crme_icn"].ToString());
            //return url;
            string str;
            bool flag;

            HttpWebRequest apiRequest = (HttpWebRequest)WebRequest.Create(url);
            string subKeys = config.VeisConfiguration.SvcConfigInfo.ApimSubscriptionKey;
            if (subKeys.Length > 0)
            {
                string[] headers = subKeys.Split('|');
                for (int i = 0; i < headers.Length; i = i + 2)
                {
                    apiRequest.Headers.Add(headers[i], headers[i + 1]);
                }
            }
            apiRequest.Method = "GET";

            WebResponse webResponse = apiRequest.GetResponse();
            Stream webStream = webResponse.GetResponseStream();
            StreamReader responseReader = new StreamReader(webStream);
            string str1 = responseReader.ReadToEnd();
            responseReader.Close();
            //return str1;
            person["crme_veteransensitivitylevel"] = str1;
            ESRSensitiveObject eSRSensitiveObject = JsonHelper.Deserialize<ESRSensitiveObject>(str1);
            //TODO Create contact person.PreferredFacility = (eSRSensitiveObject.Data.Demographics != null ? eSRSensitiveObject.Data.Demographics.PreferredFacility : "");
            if (!(employee == string.Empty))
            {
                str = (!(employee == "YES") ? string.Concat(eSRSensitiveObject.Data.SensitivityInfo.SensityFlag.ToLower(), ":false") : "true:true");
            }
            else if (!config.OrgName.Contains("VCL"))
            {
                str = ((eSRSensitiveObject.Data.EnrollmentDeterminationInfo == null || eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility == null || eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type == null ? true : !(eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type.ToUpper() == "EMPLOYEE")) ? string.Concat(eSRSensitiveObject.Data.SensitivityInfo.SensityFlag.ToLower(), ":false") : string.Concat(eSRSensitiveObject.Data.SensitivityInfo.SensityFlag.ToLower(), ":true"));
            }
            else
            {
                if (eSRSensitiveObject.Data.EnrollmentDeterminationInfo == null || eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility == null || eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type == null)
                {
                    flag = true;
                }
                else
                {
                    flag = (eSRSensitiveObject.Data.EnrollmentDeterminationInfo.PrimaryEligibility.Type.ToUpper() == "EMPLOYEE" ? false : !(eSRSensitiveObject.Data.EnrollmentDeterminationInfo.Veteran.ToUpper() == "FALSE"));
                }
                str = (flag ? string.Concat(eSRSensitiveObject.Data.SensitivityInfo.SensityFlag.ToLower(), ":false") : string.Concat(eSRSensitiveObject.Data.SensitivityInfo.SensityFlag.ToLower(), ":true"));
            }

            return str;


        }

        private static void TryGetMviQueryParams(PatientPerson person, Entity newPerson, Logger Logger)
        {
            try
            {
                if (person.CorrespondingIdList == null || !person.CorrespondingIdList.Any())
                {
                    newPerson.Attributes.Add("crme_patientmviidentifier", string.Empty);
                    newPerson.Attributes.Add("crme_icn", string.Empty);
                }
                else
                {
                    CorrespondingIDs correspondingIDs = person.CorrespondingIdList.FirstOrDefault(v => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200M" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    newPerson.Attributes.Add("crme_patientmviidentifier", ((correspondingIDs != null) ? correspondingIDs.RawValueFromMvi : string.Empty));
                    newPerson.Attributes.Add("crme_icn", ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty));
                }
            }
            catch (ArgumentNullException ex)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (NullReferenceException ex3)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
            }
            catch (Exception ex4)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
            }
        }


        private static string TryGetICN(PatientPerson person, Logger Logger)
        {
            try
            {
                if (person.CorrespondingIdList == null || !person.CorrespondingIdList.Any())
                {
                    return string.Empty;
                }
                CorrespondingIDs correspondingIDs = person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200M" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                return (correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty;
            }
            catch (ArgumentNullException ex)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (NullReferenceException ex3)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
            }
            catch (Exception ex4)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
            }
        }

        private static void TryGetCorpInfo(PatientPerson person, Entity ent, Logger Logger)
        {
            try
            {
                if (person.CorrespondingIdList == null || !person.CorrespondingIdList.Any())
                {
                    ent.Attributes.Add("crme_participantid", string.Empty);
                }
                else
                {
                    CorrespondingIDs correspondingIDs = person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200CORP" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_participantid", ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty));
                }
            }
            catch (ArgumentNullException ex)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (NullReferenceException ex3)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
            }
            catch (Exception ex4)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
            }
        }

        private static void TryGetBIRLSInfo(PatientPerson person, Entity ent, Logger Logger)
        {
            try
            {
                if (person.CorrespondingIdList == null || !person.CorrespondingIdList.Any())
                {
                    ent.Attributes.Add("crme_filenumber", string.Empty);
                }
                else
                {
                    CorrespondingIDs correspondingIDs = person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200BRLS" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_filenumber", ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty));
                }
            }
            catch (ArgumentNullException ex)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex.Message));
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (NullReferenceException ex3)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex3.Message));
            }
            catch (Exception ex4)
            {
                Logger.WriteToFile("ERROR::Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
                throw new InvalidPluginExecutionException("Unable to Get MVI Query Params due to: {0}".Replace("{0}", ex4.Message));
            }
        }

        private static void TryGetEDIPI(PatientPerson person, Entity ent, Logger Logger)
        {
            try
            {
                if (person.CorrespondingIdList == null || !person.CorrespondingIdList.Any())
                {
                    ent.Attributes.Add("crme_edipi", string.Empty);
                }
                else
                {
                    CorrespondingIDs correspondingIDs = person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200DOD" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? person.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_edipi", ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty));
                }
            }
            catch (ArgumentNullException ex)
            {
                Logger.WriteToFile("ERROR::Unable to Get EDIPI due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to Get EDIPI due to: {0}".Replace("{0}", ex.Message));
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                Logger.WriteToFile("ERROR::Unable to Get EDIPI due to: {0}".Replace("{0}", ex2.Message));
                throw new InvalidPluginExecutionException("Unable to Get EDIPI due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (NullReferenceException ex3)
            {
                Logger.WriteToFile("ERROR::Unable to Get EDIPI due to: {0}".Replace("{0}", ex3.Message));
                throw new InvalidPluginExecutionException("Unable to Get EDIPI due to: {0}".Replace("{0}", ex3.Message));
            }
            catch (Exception ex4)
            {
                Logger.WriteToFile("ERROR::Unable to Get EDIPI due to: {0}".Replace("{0}", ex4.Message));
                throw new InvalidPluginExecutionException("Unable to Get EDIPI due to: {0}".Replace("{0}", ex4.Message));
            }
        }


        private static void getMVICorpPidBIRLSFN(this PatientPerson patient, Logger logger, Entity ent, VeisConfig config)
        {
            SelectedPersonRequest selectedPersonRequest = new SelectedPersonRequest();
            selectedPersonRequest.OrganizationName = config.OrgName;
            selectedPersonRequest.UserId = config.UserId;
            selectedPersonRequest.MessageId = Guid.NewGuid().ToString();
            //selectedPersonRequest.Debug = false;
            selectedPersonRequest.LogSoap = config.LogSoap;
            selectedPersonRequest.LogTiming = config.LogTimer;
            //selectedPersonRequest.noAddPerson = false;
            //selectedPersonRequest.ICN = newPerson.crme_ICN;
            CorrespondingIdsResponse correspondingIdsResponse = WebApiUtility.SendReceiveVeisRequest<CorrespondingIdsResponse>(config, "SelectedPerson", selectedPersonRequest);
            if (correspondingIdsResponse.ExceptionOccured)
            {
                logger.WriteDebugMessage($"ERROR::VBASensitivityCheck: Search Exception Message: {correspondingIdsResponse.RawMviExceptionMessage}");
            }
            try
            {
                if (correspondingIdsResponse.CorrespondingIdList == null || !correspondingIdsResponse.CorrespondingIdList.Any())
                {
                    logger.WriteDebugMessage("DEBUG::VBASensitivityCheck: No Correlations Returned in getMVICorpPidBIRLSFN()");
                }
                else
                {
                    CorrespondingIDs correspondingIDs = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200CORP" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_participantid", ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty));
                    CorrespondingIDs correspondingIDs2 = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200BRLS" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_filenumber", ((correspondingIDs2 != null) ? correspondingIDs2.PatientIdentifier : string.Empty));
                    CorrespondingIDs correspondingIDs3 = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200DOD" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase));
                    ent.Attributes.Add("crme_edipi", ((correspondingIDs3 != null) ? correspondingIDs3.PatientIdentifier : string.Empty));
                    logger.WriteDebugMessage($"DEBUG::VBASensitivityCheck: Response Success for PId: {correspondingIDs.PatientIdentifier}, FileNumber: {correspondingIDs2.PatientIdentifier}, EDIPI: {correspondingIDs3.PatientIdentifier} ");
                }
            }
            catch (Exception)
            {
                logger.WriteDebugMessage("ERROR::VBASensitivityCheck: Error in getMVICorpPidBIRLSFN()");
            }
        }

        public static string getKVPSetting(string name, IOrganizationService organizationService)
        {
            //IL_0001: Unknown result type (might be due to invalid IL or missing references)
            //IL_0007: Expected O, but got Unknown
            //IL_001b: Unknown result type (might be due to invalid IL or missing references)
            //IL_0025: Expected O, but got Unknown
            QueryByAttribute val = new QueryByAttribute();
            val.ColumnSet = new ColumnSet(
                "bah_stringvalue_text");
            //val.set_ColumnSet(new ColumnSet(new string[1]
            //{
            //    "bah_stringvalue_text"
            //}));
            val.EntityName = "bah_keyvaluepair";
            QueryByAttribute val2 = val;
            val2.AddAttributeValue("bah_name_text", (object)name);
            EntityCollection val3 = organizationService.RetrieveMultiple(val2);
            if (((Collection<Entity>)val3.Entities).Count > 0)
            {
                return ((Collection<Entity>)val3.Entities)[0].Contains("bah_stringvalue_text") ? ((Collection<Entity>)val3.Entities)[0]["bah_stringvalue_text"].ToString() : string.Empty;
            }
            return string.Empty;
        }

    }

    public class VeteranEmployeeFlag
    {
        public string NationalId { get; set; }
        public string Value { get; set; }
    }
}
