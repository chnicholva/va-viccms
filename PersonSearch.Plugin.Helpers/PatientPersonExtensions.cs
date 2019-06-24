using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using MVI.PersonSearch.Plugin.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugin.Helpers;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Helpers
{
    public static class PatientPersonExtensions
    {
        public static Entity Map(this PatientPerson patient, IOrganizationService organizationService, Logger logger)
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
            return ent;
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



}
