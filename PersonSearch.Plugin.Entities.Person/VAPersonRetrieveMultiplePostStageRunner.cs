using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using MVI.PersonSearch.Plugin.Helpers;
using PersonSearch.Plugin.Helpers;
using PersonSearch.Plugin.VistA;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Security;
using System.ServiceModel;
using System.Web.Script.Serialization;
using VEIS.Plugin.Helpers;
using VEIS.Plugins.Messages;
using VEIS.Plugins.Models;

namespace PersonSearch.Plugin.Entities.Person
{
    public class VAPersonRetrieveMultiplePostStageRunner : Runner
    {
        private const string Query = "Query";

        private string _uri = "";

        private string _orgOverride = "";

        private string orgName = "";

        private string _requestMessageTypePrefix = "";

        private LogSettings _logSettings = null;

        private Uri uri = null;

        private bool enableAuditing = false;

        private string auditUrl = "";

        private string userName = "";

        private string stationNumber = "";

        private string userSensLevel = "";

        private string cssName = "";


        public VAPersonRetrieveMultiplePostStageRunner(IServiceProvider serviceProvider)
            : base(serviceProvider)
        {
        }
        internal Entity RetrieveActiveSettings(params string[] cols)
        {
            QueryByAttribute query = new QueryByAttribute
            {
                //change these fields as required for your implementation
                ColumnSet = new ColumnSet(cols),
                EntityName = "mcs_setting"
            };
            query.AddAttributeValue("mcs_name", "Active Settings");

            EntityCollection results = this.OrganizationService.RetrieveMultiple(query);
            if (results.Entities.Count > 0)
            {
                return results.Entities[0];
            }
            throw new InvalidPluginExecutionException("There is no Active settings record in the system");
        }

        internal VeisConfig RetrieveVeisConfig(string servicePathField, string subscriptionKeyField)
        {
            Entity settings = RetrieveActiveSettings(
                                                        "mcs_transactiontiming", 
                                                        "ftp_veisservicebaseurl", 
                                                        "ftp_vastlistrefreshapiurl",
                                                        "ftp_veisorganizationname", 
                                                        "ftp_veisclientsecret", 
                                                        "ftp_veistenantid", 
                                                        "ftp_veisclientapplicationid",
                                                        "ftp_veisresourceid", 
                                                        servicePathField, 
                                                        subscriptionKeyField, 
                                                        "mcs_granulartimings",
                                                        "vre_searchlogtiming", 
                                                        "vre_searchlogsoap", 
                                                        "mcs_unexpectedmessage", 
                                                        "bah_masksensitiveinfo",
                                                        "bah_retrievesensitivitylevel", 
                                                        "bah_enableauditing", 
                                                        "ftp_employeeendpoint", 
                                                        "ftp_sensitiveendpoint"
                                                        );
            if (settings != null)
            {
                VeisConfig config = new VeisConfig()
                {
                    OrgOverride = (settings.Contains("ftp_veisorganizationname")) ? settings["ftp_veisorganizationname"].ToString() : string.Empty,
                    GetSensitiveInfo = (settings.Contains("bah_retrievesensitivitylevel")) ? (Boolean)settings["bah_retrievesensitivitylevel"] : false,
                    EnableAuditing = (settings.Contains("bah_enableauditing")) ? (Boolean)settings["bah_enableauditing"] : false,
                    LogTimer = (settings.Contains("vre_searchlogtiming")) ? (Boolean)settings["vre_searchlogtiming"] : false,
                    LogSoap = (settings.Contains("vre_searchlogsoap")) ? (Boolean)settings["vre_searchlogsoap"] : false,
                    EmployeeEndpoint = (settings.Contains("ftp_employeeendpoint")) ? settings.GetAttributeValue<string>("ftp_employeeendpoint") : string.Empty,
                    SensitiveEndpoint = (settings.Contains("ftp_sensitiveendpoint")) ? settings.GetAttributeValue<string>("ftp_sensitiveendpoint") : string.Empty
                };
                config.UserId = this.PluginExecutionContext.UserId;
                config.OrgName = (config.OrgOverride != "" && config.OrgOverride != string.Empty) ? config.OrgOverride : "FTP";

                config.VeisConfiguration = new VeisConfiguration()
                {
                    CRMAuthInfo = new CRMAuthTokenConfiguration()
                    {
                        ClientApplicationId = (settings.Contains("ftp_veisclientapplicationid")) ? settings["ftp_veisclientapplicationid"].ToString() : string.Empty,
                        ClientSecret = (settings.Contains("ftp_veisclientsecret")) ? settings["ftp_veisclientsecret"].ToString() : string.Empty,
                        TenantId = (settings.Contains("ftp_veistenantid")) ? settings["ftp_veistenantid"].ToString() : string.Empty,
                        ResourceId = (settings.Contains("ftp_veisresourceid")) ? settings["ftp_veisresourceid"].ToString() : string.Empty,

                    },
                    SvcConfigInfo = new VEISSvcLOBConfiguration()
                    {
                        ApimSubscriptionKey = (settings.Contains(subscriptionKeyField)) ? settings[subscriptionKeyField].ToString() : string.Empty,
                    }
                };

                if (settings.Contains("ftp_veisservicebaseurl") && settings.Contains(servicePathField))
                {
                    config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl = settings["ftp_veisservicebaseurl"].ToString();
                    if (settings["ftp_veisservicebaseurl"].ToString().EndsWith("/"))
                    {
                        config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl = settings["ftp_veisservicebaseurl"].ToString() + settings[servicePathField].ToString();
                    }
                    else
                    {
                        config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl = settings["ftp_veisservicebaseurl"].ToString() + "/" + settings[servicePathField].ToString();
                    }
                }

                return config;
            }
            return null;
        }

        internal void Execute()
        {
            try
            {
                base.Logger.setDebug = true;
                if (base.PluginExecutionContext.InputParameters.Contains("Query"))
                {
                    QueryExpression qe;
                    if (base.PluginExecutionContext.InputParameters["Query"] is FetchExpression)
                    {
                        FetchExpression feExp = base.PluginExecutionContext.InputParameters["Query"] as FetchExpression;
                        FetchXmlToQueryExpressionRequest req = new FetchXmlToQueryExpressionRequest();
                        req.FetchXml = feExp.Query;
                        var feResp = (FetchXmlToQueryExpressionResponse)this.OrganizationService.Execute(req);
                        qe = feResp.Query;
                    }
                    else
                    {
                        qe = base.PluginExecutionContext.InputParameters["Query"] as QueryExpression;
                    }
                    var eCol = (EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"];
                    try
                    {
                        getSettingValues();
                        
                        var searchType = qe.GetSearchType();
                        if (string.IsNullOrWhiteSpace(searchType))
                        {// stop all processing is no search type
                            return;
                        }
                        VeisConfig config = RetrieveVeisConfig("ftp_mviserviceurl", "ftp_mvisubscriptionkey");
                        if (!string.IsNullOrEmpty(searchType))
                        {
                            orgName = ((_orgOverride != "" && _orgOverride != string.Empty) ? _orgOverride : base.PluginExecutionContext.OrganizationName);
                            uri = new Uri(_uri);
                            _logSettings = new LogSettings
                            {
                                Org = orgName,
                                ConfigFieldName = "RESTCALL",
                                UserId = base.PluginExecutionContext.InitiatingUserId,
                                callingMethod = "MVIPersonSearchPlugin"
                            };
                            _requestMessageTypePrefix = setMessageType(orgName);
                            if (searchType != null)
                            {
                                if (searchType != "SearchByIdentifier" && searchType != "SearchByFilter")
                                {
                                    if (searchType != "SelectedPersonSearch")
                                    {
                                        if (searchType == "DeterministicSearch")
                                        {

                                            DeterministicSearchRequest deterministicSearchRequest = new DeterministicSearchRequest();
                                            SetQueryString(deterministicSearchRequest, qe);
                                            deterministicSearchRequest.OrganizationName = config.OrgName;
                                            deterministicSearchRequest.UserId = base.PluginExecutionContext.InitiatingUserId;
                                            deterministicSearchRequest.MessageId = Guid.NewGuid().ToString();
                                            string text2 = $"{_requestMessageTypePrefix}DeterministicSearchRequest";
                                            PersonSearchResponse personSearchResponse = WebApiUtility.SendReceiveVeisRequest<PersonSearchResponse>(config, "DeterministicSearch", deterministicSearchRequest);
                                            if (personSearchResponse.ExceptionOccured)
                                            {
                                                base.Logger.WriteDebugMessage(string.Format("ERROR::" + searchType + ": Search Exception Message: {0} MVI Message: {1}", personSearchResponse.Message, personSearchResponse.CORPDbMessage));
                                            }
                                            bool flag = (personSearchResponse.Person != null && personSearchResponse.Person.Length > 0) ? true : false;
                                            Map(personSearchResponse, config);
                                            base.Logger.WriteDebugMessage(string.Format("DEBUG::" + searchType + ": Search Response Message: {0} Person Found: {1}", personSearchResponse.Message, flag));
                                        }
                                    }
                                    else
                                    {
                                        SelectedPersonRequest selectedPersonRequest = new SelectedPersonRequest();
                                        SetQueryString(selectedPersonRequest, qe, config);
                                        selectedPersonRequest.UserId = base.PluginExecutionContext.InitiatingUserId;
                                        selectedPersonRequest.OrganizationName = config.OrgName;
                                        selectedPersonRequest.MessageId = Guid.NewGuid().ToString();
                                        selectedPersonRequest.RecordSource = "MVI";
                                        selectedPersonRequest.AssigningAuthority = "USVHA";
                                        selectedPersonRequest.CorrelationId = Guid.Empty;
                                        //selectedPersonRequest.Debug = false;
                                        selectedPersonRequest.LogSoap = config.LogSoap;
                                        selectedPersonRequest.LogTiming = config.LogTimer;
                                        //selectedPersonRequest.noAddPerson = false;
                                        CorrespondingIdsResponse correspondingIdsResponse = WebApiUtility.SendReceiveVeisRequest<CorrespondingIdsResponse>(config, "SelectedPerson", selectedPersonRequest);
                                        MapCorrespondingIds(correspondingIdsResponse, selectedPersonRequest, config);
                                    }
                                }
                                else
                                {
                                    PersonSearchRequest personSearchRequest = new PersonSearchRequest();
                                    SetQueryString(personSearchRequest, qe, config);
                                    personSearchRequest.MessageId = Guid.NewGuid().ToString();
                                    personSearchRequest.UserId = base.PluginExecutionContext.InitiatingUserId;
                                    personSearchRequest.Debug = false;
                                    personSearchRequest.LogSoap = config.LogSoap;
                                    personSearchRequest.LogTiming = config.LogTimer;
                                    string message = searchType == "SearchByIdentifier" ? "SearchMessage" : "SearchPerson";

                                    PersonSearchResponse personSearchResponse2 = WebApiUtility.SendReceiveVeisRequest<PersonSearchResponse>(config, message, personSearchRequest);
                                    if (personSearchResponse2.ExceptionOccured)
                                    {
                                        base.Logger.WriteDebugMessage(string.Format("ERROR::" + searchType + ": Search Exception Message: {0} MVI Message: {1}", personSearchResponse2.Message, personSearchResponse2.CORPDbMessage));
                                    }
                                    bool flag3 = (personSearchResponse2.Person != null && personSearchResponse2.Person.Length > 0) ? true : false;
                                    Map(personSearchResponse2, config);
                                    base.Logger.WriteDebugMessage(string.Format("DEBUG::" + searchType + ": Search Response Message: {0} Person Found: {1}", personSearchResponse2.Message, flag3));
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        var ent = new Entity("crme_person");
                        ent.Id = Guid.NewGuid();
                        ent.Attributes.Add("crme_exceptionmessage", ex.Message);
                        eCol.Entities.Add(ent);
                        base.Logger.WriteToFile(ex.Message);
                        base.Logger.WriteDebugMessage($"ERROR:: Search Exception Occurred. Error Message: {ex.Message}");
                        base.Logger.WriteDebugMessage($"ERROR:: Search Exception Stack Trace: {ex.StackTrace}");
                        //HandleMVIErrorInUI();
                        throw new InvalidPluginExecutionException(ex.ToString());
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                base.Logger.WriteToFile(ex2.Message);
                throw new InvalidPluginExecutionException("ERROR::Unable to process MVI request due to: {0}".Replace("{0}", ex2.Message));
            }
            catch (Exception ex)
            {
                base.Logger.WriteToFile(ex.Message);
                throw new InvalidPluginExecutionException("ERROR::Unable to process MVI request due to {0}".Replace("{0}", ex.Message));
            }
        }

        private string setMessageType(string organization)
        {
            if (organization == null)
            {
                return "";
            }
            if (organization.ToUpper().Contains("FTP"))
            {
                return "FTP";
            }
            if (organization.ToUpper().Contains("VCL"))
            {
                return "VCL";
            }
            if (organization.ToUpper().Contains("VRE"))
            {
                return "VRE";
            }
            if (organization.ToUpper().Contains("HRC") || organization.ToUpper().Contains("VHA"))
            {
                return "HRC";
            }
            if (organization.ToUpper().Contains("CCWF"))
            {
                return "CCWF";
            }
            if (organization.ToUpper().Contains("ICP"))
            {
                return "ICP";
            }
            if (organization.ToUpper().Contains("FCMT"))
            {
                return "FCMT";
            }
            if (organization.ToUpper().Contains("ECC"))
            {
                return "ECC";
            }
            if (organization.ToUpper().Contains("VEMS"))
            {
                return "VEMS";
            }
            return "";
        }

        internal void getSettingValues()
        {
            //IL_0001: Unknown result type (might be due to invalid IL or missing references)
            //IL_0007: Expected O, but got Unknown
            //IL_0059: Unknown result type (might be due to invalid IL or missing references)
            //IL_0063: Expected O, but got Unknown
            QueryByAttribute val = new QueryByAttribute();
            val.ColumnSet = new ColumnSet(
                "mcs_transactiontiming",
                "crme_restendpointforvimt",
                "mcs_granulartimings",
                "vre_searchlogtiming",
                "vre_searchlogsoap",
                "mcs_unexpectedmessage",
                "bah_masksensitiveinfo",
                "bah_retrievesensitivitylevel",
                "bah_enableauditing");
            //val.set_ColumnSet(new ColumnSet(new string[9]
            //{
            //	"mcs_transactiontiming",
            //	"crme_restendpointforvimt",
            //	"mcs_granulartimings",
            //	"vre_searchlogtiming",
            //	"vre_searchlogsoap",
            //	"mcs_unexpectedmessage",
            //	"bah_masksensitiveinfo",
            //	"bah_retrievesensitivitylevel",
            //	"bah_enableauditing"
            //}));
            val.EntityName = "mcs_setting";
            QueryByAttribute val2 = val;
            val2.AddAttributeValue("mcs_name", (object)"Active Settings");
            EntityCollection val3 = base.OrganizationService.RetrieveMultiple(val2);
            if (((Collection<Entity>)val3.Entities).Count > 0)
            {
                enableAuditing = (bool)((Collection<Entity>)val3.Entities)[0]["bah_enableauditing"];
                _orgOverride = (((Collection<Entity>)val3.Entities)[0].Contains("mcs_unexpectedmessage") ? ((Collection<Entity>)val3.Entities)[0]["mcs_unexpectedmessage"].ToString() : string.Empty);
                _uri = (((Collection<Entity>)val3.Entities)[0].Contains("crme_restendpointforvimt") ? ((Collection<Entity>)val3.Entities)[0]["crme_restendpointforvimt"].ToString() : string.Empty);
                //_logTimer = (((Collection<Entity>)val3.Entities)[0].Contains("vre_searchlogtiming") && (bool)((Collection<Entity>)val3.Entities)[0]["vre_searchlogtiming"]);
                //_logSoap = (((Collection<Entity>)val3.Entities)[0].Contains("vre_searchlogsoap") && (bool)((Collection<Entity>)val3.Entities)[0]["vre_searchlogsoap"]);
            }
        }

        private static string TryGetAlias(Name aliasName)
        {
            try
            {
                if (aliasName == null)
                {
                    return string.Empty;
                }
                return $"{aliasName.GivenName} {aliasName.FamilyName}";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
        public override Entity GetPrimaryEntity()
        {
            //IL_0016: Unknown result type (might be due to invalid IL or missing references)
            //IL_001c: Expected O, but got Unknown
            return base.PluginExecutionContext.InputParameters["Target"] as Entity;
        }

        public override Entity GetSecondaryEntity()
        {
            //IL_0016: Unknown result type (might be due to invalid IL or missing references)
            //IL_001c: Expected O, but got Unknown
            return base.PluginExecutionContext.InputParameters["Target"] as Entity;
        }

        private Entity TryGetUserInfo(Guid userId)
        {
            Entity val = new Entity("systemuser");
            QueryByAttribute val2 = null;
            if (orgName.ToUpper().Contains("VRE"))
            {
                QueryByAttribute val3 = new QueryByAttribute();
                val3.ColumnSet = new ColumnSet(
                    "firstname",
                    "lastname",
                    "vre_css_text",
                    "new_sensitivitylevel",
                    "vre_stationid");
                //val3.set_ColumnSet(new ColumnSet(new string[5]
                //{
                //    "firstname",
                //    "lastname",
                //    "vre_css_text",
                //    "new_sensitivitylevel",
                //    "vre_stationid"
                //}));
                val3.EntityName = "systemuser";
                val2 = val3;
            }
            else
            {
                QueryByAttribute val4 = new QueryByAttribute();
                val4.ColumnSet = new ColumnSet(
                    "firstname",
                    "lastname"
                    );
                //val4.set_ColumnSet(new ColumnSet(new string[2]
                //{
                //    "firstname",
                //    "lastname"
                //}));
                val4.EntityName = "systemuser";
                val2 = val4;
            }
            Entity val5 = base.OrganizationService.Retrieve(val2.EntityName, userId, val2.ColumnSet);
            if (val5 != null)
            {
                val["FirstName"] = (object)((val5.Attributes.Contains("firstname") && val5.Attributes["firstname"] != null) ? val5.Attributes["firstname"].ToString() : string.Empty);
                val["LastName"] = (object)((val5.Attributes.Contains("lastname") && val5.Attributes["lastname"] != null) ? val5.Attributes["lastname"].ToString() : string.Empty);
            }
            if (orgName.ToUpper().Contains("VRE"))
            {
                if (val5.Attributes.Contains("vre_stationid"))
                {
                    EntityReference val6 = val5.Attributes["vre_stationid"] as EntityReference;
                    if (val6 != null)
                    {
                        int num = val6.Name.IndexOf("(") + 1;
                        int length = val6.Name.IndexOf(")") - num;
                        stationNumber = val6.Name.Substring(num, length);
                    }
                }
                cssName = ((val5.Attributes.Contains("vre_css_text") && val5.Attributes["vre_css_text"] != null) ? val5.Attributes["vre_css_text"].ToString() : string.Empty);
                userSensLevel = ((val5.Attributes.Contains("new_sensitivitylevel") && val5.Attributes["new_sensitivitylevel"] != null) ? val5.Attributes["new_sensitivitylevel"].ToString() : string.Empty);
            }
            return val;
        }

        public void SetQueryString(PersonSearchRequest request, QueryExpression qe, VeisConfig config)
        {
            //IL_04d6: Unknown result type (might be due to invalid IL or missing references)
            try
            {
                base.Logger.setMethod = "SetQueryString";
                if (qe.Criteria != null)
                {
                    if (((IEnumerable<FilterExpression>)qe.Criteria.Filters).Any())
                    {
                        request.Edipi = GetStringValueOrDefault(qe.Criteria, "crme_edipi");
                        request.FirstName = GetStringValueOrDefault(qe.Criteria, "crme_firstname");
                        request.MiddleName = GetStringValueOrDefault(qe.Criteria, "crme_middlename");
                        request.FamilyName = GetStringValueOrDefault(qe.Criteria, "crme_lastname");
                        request.BirthDate = GetStringValueOrDefault(qe.Criteria, "crme_dobstring");
                        request.PhoneNumber = GetStringValueOrDefault(qe.Criteria, "crme_primaryphone");
                        string stringValueOrDefault = GetStringValueOrDefault(qe.Criteria, "crme_isattended");
                        request.IsAttended = Convert.ToBoolean(string.IsNullOrEmpty(stringValueOrDefault) ? "false" : stringValueOrDefault);
                        request.OrganizationName = config.OrgName;
                        request.FetchMessageProcessType = "remote";
                        request.UserId = base.PluginExecutionContext.UserId;
                        //Entity val = TryGetUserInfo(base.PluginExecutionContext.UserId);
                        //if (val != null)
                        //{
                        //    request.UserFirstName = val["FirstName"].ToString();
                        //    request.UserLastName = val["LastName"].ToString();
                        //    userName = request.UserFirstName + " " + request.UserLastName;
                        //}
                        request.Address = GetStringValueOrDefault(qe.Criteria, "crme_fulladdress");
                        request.Gender = GetStringValueOrDefault(qe.Criteria, "crme_gender");
                        request.MMN = GetStringValueOrDefault(qe.Criteria, "crme_mmn");
                        request.POBC = GetStringValueOrDefault(qe.Criteria, "crme_pobc");
                        request.POBS = GetStringValueOrDefault(qe.Criteria, "crme_pobs");
                        request.SocialSecurityNumber = GetStringValueOrDefault(qe.Criteria, "crme_ssn");
                        if (enableAuditing)
                        {
                            auditRequest(request);
                        }
                        if (request.SocialSecurityNumber.Contains("XXX"))
                        {
                            request.SocialSecurityNumber = "";
                        }
                        if (request.BirthDate.Contains("XX/XX"))
                        {
                            request.BirthDate = "";
                        }
                    }
                    else if (((IEnumerable<ConditionExpression>)qe.Criteria.Conditions).Any())
                    {
                        request.Edipi = GetStringValueOrDefaultFetch(qe.Criteria, "crme_edipi");
                        request.FirstName = GetStringValueOrDefaultFetch(qe.Criteria, "crme_firstname");
                        request.MiddleName = GetStringValueOrDefaultFetch(qe.Criteria, "crme_middlename");
                        request.FamilyName = GetStringValueOrDefaultFetch(qe.Criteria, "crme_lastname");
                        request.BirthDate = GetStringValueOrDefaultFetch(qe.Criteria, "crme_dobstring");
                        request.PhoneNumber = GetStringValueOrDefaultFetch(qe.Criteria, "crme_primaryphone");
                        string stringValueOrDefault = GetStringValueOrDefaultFetch(qe.Criteria, "crme_isattended");
                        request.IsAttended = Convert.ToBoolean(string.IsNullOrEmpty(stringValueOrDefault) ? "false" : stringValueOrDefault);
                        request.OrganizationName = config.OrgName;
                        request.FetchMessageProcessType = "remote";
                        request.UserId = base.PluginExecutionContext.UserId;
                        //Entity val = TryGetUserInfo(base.PluginExecutionContext.UserId);
                        //if (val != null)
                        //{
                        //    request.UserFirstName = val["FirstName"].ToString();
                        //    request.UserLastName = val["LastName"].ToString();
                        //    userName = request.UserFirstName + " " + request.UserLastName;
                        //}
                        request.Address = GetStringValueOrDefaultFetch(qe.Criteria, "crme_fulladdress");
                        request.Gender = GetStringValueOrDefaultFetch(qe.Criteria, "crme_gender");
                        request.MMN = GetStringValueOrDefaultFetch(qe.Criteria, "crme_mmn");
                        request.POBC = GetStringValueOrDefaultFetch(qe.Criteria, "crme_pobc");
                        request.POBS = GetStringValueOrDefaultFetch(qe.Criteria, "crme_pobs");
                        request.SocialSecurityNumber = GetStringValueOrDefaultFetch(qe.Criteria, "crme_ssn");
                        if (enableAuditing)
                        {
                            auditRequest(request);
                        }
                    }
                }
                base.Logger.setMethod = "Execute";
            }
            catch (Exception ex)
            {
                base.Logger.WriteToFile("ERROR::Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
            }
        }

        private void auditRequest(PersonSearchRequest request)
        {
            if (auditUrl == "")
            {
                auditUrl = PatientPersonExtensions.getKVPSetting("MVI_Log", base.OrganizationService);
            }
            bool isAttended = request.IsAttended;
            MVILog mVILog = new MVILog();
            mVILog.Address = ((request.Address != null && request.Address.Length > 40) ? request.Address.Substring(0, 40) : request.Address);
            mVILog.Attended = isAttended;
            mVILog.ClassCode = ((request.IdentifierClassCode != null && request.IdentifierClassCode.Length > 10) ? request.IdentifierClassCode.Substring(0, 10) : request.IdentifierClassCode);
            mVILog.CreatedOn = DateTime.UtcNow;
            mVILog.DOB = ((request.BirthDate != null && request.BirthDate.Length > 15) ? request.BirthDate.Substring(0, 15) : request.BirthDate);
            mVILog.EDIPI = ((request.Edipi != null && request.Edipi.Length > 10) ? request.Edipi.Substring(0, 10) : request.Edipi);
            mVILog.First = ((request.FirstName != null && request.FirstName.Length > 30) ? request.FirstName.Substring(0, 30) : request.FirstName);
            mVILog.ICN = ((request.PatientIdentifier != null && request.PatientIdentifier.Length > 30) ? request.PatientIdentifier.Substring(0, 30) : request.PatientIdentifier);
            mVILog.Last = ((request.FamilyName != null && request.FamilyName.Length > 30) ? request.FamilyName.Substring(0, 30) : request.FamilyName);
            mVILog.Middle = ((request.MiddleName != null && request.MiddleName.Length > 20) ? request.MiddleName.Substring(0, 20) : request.MiddleName);
            mVILog.MMN = ((request.MMN != null && request.MMN.Length > 20) ? request.MMN.Substring(0, 20) : request.MMN);
            mVILog.Organization_Name = orgName;
            mVILog.Phone = ((request.PhoneNumber != null && request.PhoneNumber.Length > 17) ? request.PhoneNumber.Substring(0, 17) : request.PhoneNumber);
            mVILog.POBC = ((request.POBC != null && request.POBC.Length > 25) ? request.POBC.Substring(0, 25) : request.POBC);
            mVILog.POBS = ((request.POBS != null && request.POBS.Length > 20) ? request.POBS.Substring(0, 20) : request.POBS);
            mVILog.RequestType = "PersonSearch";
            mVILog.SessionId = request.UserId.ToString();
            mVILog.Sex = ((request.Gender != null && request.Gender.Length > 1) ? request.Gender.Substring(0, 1) : request.Gender);
            mVILog.Source = "";
            mVILog.SSN = ((request.SocialSecurityNumber != null && request.SocialSecurityNumber.Length > 10) ? request.SocialSecurityNumber.Substring(0, 10) : request.SocialSecurityNumber);
            mVILog.Type = "Request";
            mVILog.UserName = ((userName.Length > 30) ? userName.Substring(0, 30) : userName);
            MVILog obj = mVILog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(auditUrl, json, "MVILog");
        }

        public void SetQueryString(SelectedPersonRequest request, QueryExpression qe, VeisConfig config)
        {
            //IL_025c: Unknown result type (might be due to invalid IL or missing references)
            try
            {
                base.Logger.setMethod = "SetQueryString";
                if (qe.Criteria != null && ((IEnumerable<FilterExpression>)qe.Criteria.Filters).Any())
                {
                    request.PatientSearchIdentifier = GetStringValueOrDefault(qe.Criteria, "crme_icn");
                    request.UserId = base.PluginExecutionContext.UserId;
                    Entity val = TryGetUserInfo(base.PluginExecutionContext.UserId);
                    if (val != null)
                    {
                        request.UserFirstName = val["FirstName"].ToString();
                        request.UserLastName = val["LastName"].ToString();
                        userName = request.UserFirstName + " " + request.UserLastName;
                    }
                    if (enableAuditing)
                    {
                        auditRequest(request);
                    }
                }
            }
            catch (Exception ex)
            {
                base.Logger.WriteToFile("ERROR::Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
            }
        }

        private void auditRequest(SelectedPersonRequest request)
        {
            if (auditUrl == "")
            {
                auditUrl = PatientPersonExtensions.getKVPSetting("MVI_Log2", base.OrganizationService);
            }
            MVILog2 mVILog = new MVILog2();
            mVILog.Organization_Name = request.OrganizationName;
            mVILog.CreatedOn = DateTime.UtcNow;
            //mVILog.DOB = ((request.DateofBirth != null && request.DateofBirth.Length > 15) ? request.DateofBirth.Substring(0, 15) : request.DateofBirth);
            //mVILog.EDIPI = ((request.Edipi != null && request.Edipi.Length > 10) ? request.Edipi.Substring(0, 10) : request.Edipi);
            //mVILog.ICN = ((request.ICN != null && request.ICN.Length > 30) ? request.ICN.Substring(0, 30) : request.ICN);
            mVILog.RequestType = "SelectedPerson";
            mVILog.SessionId = request.UserId.ToString();
            //mVILog.SSN = ((request.SocialSecurityNumber != null && request.SocialSecurityNumber.Length > 10) ? request.SocialSecurityNumber.Substring(0, 10) : request.SocialSecurityNumber);
            mVILog.UserName = ((userName.Length > 30) ? userName.Substring(0, 30) : userName);
            MVILog2 obj = mVILog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(auditUrl, json, "MVILog2");
        }

        public void SetQueryString(DeterministicSearchRequest request, QueryExpression qe)
        {
            //IL_0169: Unknown result type (might be due to invalid IL or missing references)
            try
            {
                base.Logger.setMethod = "SetQueryString";
                if (qe.Criteria != null && ((IEnumerable<FilterExpression>)qe.Criteria.Filters).Any())
                {
                    request.EdiPi = GetStringValueOrDefault(qe.Criteria, "crme_edipi");
                    request.BirthDate = GetStringValueOrDefaultFetch(qe.Criteria, "crme_dobstring");
                    request.SearchType = (string.IsNullOrWhiteSpace(request.EdiPi) ? DeterministicSearchType.SocialSecurity : DeterministicSearchType.Edipi);
                    request.UserId = base.PluginExecutionContext.UserId;
                    Entity val = TryGetUserInfo(base.PluginExecutionContext.UserId);
                    if (val != null)
                    {
                        request.UserFirstName = val["FirstName"].ToString();
                        request.UserLastName = val["LastName"].ToString();
                        userName = request.UserFirstName + " " + request.UserLastName;
                    }
                    request.SocialSecurityNumber = GetStringValueOrDefault(qe.Criteria, "crme_ssn");
                    if (enableAuditing)
                    {
                        auditRequest(request);
                    }
                }
            }
            catch (Exception ex)
            {
                base.Logger.WriteToFile("ERROR::Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
                throw new InvalidPluginExecutionException("Unable to set Query String due to: {0}".Replace("{0}", ex.Message));
            }
        }

        private void auditRequest(DeterministicSearchRequest request)
        {
            if (auditUrl == "")
            {
                auditUrl = PatientPersonExtensions.getKVPSetting("MVI_Log", base.OrganizationService);
            }
            MVILog mVILog = new MVILog();
            mVILog.Address = "";
            mVILog.Attended = false;
            mVILog.ClassCode = "";
            mVILog.CreatedOn = DateTime.UtcNow;
            mVILog.DOB = ((request.BirthDate != null && request.BirthDate.Length > 15) ? request.BirthDate.Substring(0, 15) : request.BirthDate);
            mVILog.EDIPI = ((request.EdiPi != null && request.EdiPi.Length > 10) ? request.EdiPi.Substring(0, 10) : request.EdiPi);
            mVILog.First = "";
            mVILog.ICN = "";
            mVILog.Last = "";
            mVILog.Middle = "";
            mVILog.MMN = "";
            mVILog.Organization_Name = orgName;
            mVILog.Phone = "";
            mVILog.POBC = "";
            mVILog.POBS = "";
            mVILog.RequestType = "DeterministicSearchRequest";
            mVILog.SessionId = request.UserId.ToString();
            mVILog.Sex = "";
            mVILog.Source = "";
            mVILog.SSN = ((request.SocialSecurityNumber != null && request.SocialSecurityNumber.Length > 10) ? request.SocialSecurityNumber.Substring(0, 10) : request.SocialSecurityNumber);
            mVILog.Type = "Request";
            mVILog.UserName = userName;
            MVILog obj = mVILog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(auditUrl, json, "MVILog");
        }

        private static string GetStringValueOrDefaultFetch(FilterExpression expression, string fieldName)
        {
            try
            {
                ConditionExpression val = ((IEnumerable<ConditionExpression>)expression.Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                if (val != null)
                {
                    return ((Collection<object>)val.Values)[0].ToString();
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }
            return string.Empty;
        }

        private static string GetStringValueOrDefault(FilterExpression expression, string fieldName)
        {
            try
            {
                ConditionExpression val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)expression.Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val == null)
                {
                    val = ((IEnumerable<ConditionExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)((Collection<FilterExpression>)expression.Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Filters)[0].Conditions).FirstOrDefault((ConditionExpression v) => v.AttributeName.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
                }
                if (val != null)
                {
                    return ((Collection<object>)val.Values)[0].ToString();
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }
            return string.Empty;
        }

        public int GetOptionSetValue(string optionSetString, string entityName, string attributeName)
        {
            //IL_0014: Unknown result type (might be due to invalid IL or missing references)
            //IL_001a: Expected O, but got Unknown
            //IL_0040: Unknown result type (might be due to invalid IL or missing references)
            //IL_0046: Expected O, but got Unknown
            //IL_004c: Unknown result type (might be due to invalid IL or missing references)
            //IL_0052: Expected O, but got Unknown
            try
            {
                RetrieveAttributeRequest val = new RetrieveAttributeRequest();
                val.EntityLogicalName = entityName;
                val.LogicalName = attributeName;
                val.RetrieveAsIfPublished = false;
                RetrieveAttributeRequest val2 = val;
                RetrieveAttributeResponse val3 = (RetrieveAttributeResponse)base.OrganizationService.Execute(val2);
                PicklistAttributeMetadata val4 = (PicklistAttributeMetadata)val3.AttributeMetadata;
                return (from t in (IEnumerable<OptionMetadata>)val4.OptionSet.Options
                        where ((Collection<LocalizedLabel>)t.Label.LocalizedLabels)[0].Label == optionSetString
                        let value = t.Value
                        where value.HasValue
                        select value.Value).FirstOrDefault();
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                base.Logger.setModule = "getOptionSetValue";
                base.Logger.WriteToFile(ex.Detail.Message);
                base.Logger.setModule = "execute";
                return 0;
            }
            catch (Exception ex2)
            {
                base.Logger.setModule = "getOptionSetValue";
                base.Logger.WriteToFile(ex2.Message);
                base.Logger.setModule = "execute";
                return 0;
            }
        }

        private SecureString ConvertToSecureString(string value)
        {
            if (value == null)
            {
                throw new ArgumentNullException("password");
            }
            SecureString secureString = new SecureString();
            foreach (char c in value)
            {
                secureString.AppendChar(c);
            }
            secureString.MakeReadOnly();
            return secureString;
        }

        private string SecureStringToString(SecureString value)
        {
            IntPtr intPtr = IntPtr.Zero;
            try
            {
                intPtr = Marshal.SecureStringToGlobalAllocUnicode(value);
                return Marshal.PtrToStringUni(intPtr);
            }
            finally
            {
                Marshal.ZeroFreeGlobalAllocUnicode(intPtr);
            }
        }



        private string getSensitivityLevelVBA(string url, string pId, bool byPid)
        {
            if (!byPid)
            {
                url = url.Replace("SensitivityByPid", "SensitivityByFileNumber");
            }
            url = url.Replace("xml", "json");
            url = url.Replace("<cssName>", cssName);
            url = url.Replace("<stationNumber>", stationNumber);
            url = url.Replace("<pId>", pId);
            using (WebClient webClient = new WebClient())
            {
                string input = webClient.DownloadString(url);
                SensitiveObject sensitiveObject = JsonHelper.Deserialize<SensitiveObject>(input);
                return (sensitiveObject.Data[0].Return1 == null) ? "" : sensitiveObject.Data[0].Return1.ScrtyLevelTypeCd;
            }
        }

        private string getVHAVeteranEmployeeFlag(string url, string icn)
        {
            string[] nationalIds = new string[1]
            {
                icn
            };
            NonVet nonVet = new NonVet();
            nonVet.ClientName = "VCCM";
            nonVet.Format = "JSON";
            nonVet.NationalIds = nationalIds;
            NonVet obj = nonVet;
            string value = JsonHelper.Serialize(obj);
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(value);
                streamWriter.Flush();
                streamWriter.Close();
            }
            HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            string input = "";
            using (StreamReader streamReader = new StreamReader(httpWebResponse.GetResponseStream()))
            {
                input = streamReader.ReadToEnd();
            }
            try
            {
                NonVetRoot nonVetRoot = JsonHelper.Deserialize<NonVetRoot>(input);
                foreach (NVDatum datum in nonVetRoot.Data)
                {
                    if (datum.Veteran == null || datum.Veteran.ToUpper() == "YES")
                    {
                        return "NO";
                    }
                    if (datum.Veteran.ToUpper() == "NO" && datum.NewPersonIndicator != null && datum.NewPersonIndicator.ToUpper() == "YES")
                    {
                        return "YES";
                    }
                    if (datum.Veteran.ToUpper() == "NO" && datum.PrimaryEligibilityCode != null && datum.PrimaryEligibilityCode.ToUpper() == "EMPLOYEE")
                    {
                        return "YES";
                    }
                }
            }
            catch (Exception ex)
            {
                base.Logger.WriteDebugMessage("ERROR::Getting Employee flag for single record with ICN: " + icn + ". " + ex.Message);
            }
            return "NO";
        }

        private void MapCorrespondingIds(CorrespondingIdsResponse response, SelectedPersonRequest request, VeisConfig config)
        {
            try
            {
                Entity crme_person = new Entity("crme_person");
                crme_person.Id = Guid.NewGuid();
                crme_person["crme_fullname"] = string.Empty;
                if (response.ExceptionOccured)
                {
                    crme_person["crme_exceptionoccured"] = true;
                    crme_person["crme_exceptionmessage"] = "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.";
                }
                if (response.CorrespondingIdList == null || !response.CorrespondingIdList.Any())
                {
                    base.Logger.WriteDebugMessage("DEBUG::No Corresponding IDs retrieved.");
                    crme_person["crme_returnmessage"] = response.Message;
                    if (!string.IsNullOrEmpty(response.RawMviExceptionMessage))
                    {
                        base.Logger.WriteDebugMessage(response.RawMviExceptionMessage);
                    }
                    ((EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"]).Entities.Add(crme_person);
                }
                else if (response.ExceptionOccured)
                {
                    crme_person.Id = Guid.NewGuid();
                    crme_person["crme_fullname"] = string.Empty;
                    crme_person["crme_returnmessage"] = response.Message;
                    if (!string.IsNullOrEmpty(response.RawMviExceptionMessage))
                    {
                        base.Logger.WriteDebugMessage(response.RawMviExceptionMessage);
                    }
                    ((EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"]).Entities.Add(crme_person);
                }
                else
                {
                    string text = string.Empty;
                    bool flag = false;
                    bool flag2 = false;
                    bool flag3 = false;
                    string b = "";
                    CorrespondingIDs[] correspondingIdList;


                    string text2 = string.Empty;
                    string empty = string.Empty;
                    correspondingIdList = response.CorrespondingIdList;
                    foreach (CorrespondingIDs correspondingIDs in correspondingIdList)
                    {
                        Entity crme_person3 = new Entity("crme_person");
                        Guid guid = default(Guid);
                        crme_person3.Id = guid;
                        crme_person3["crme_siteid"] = correspondingIDs.AssigningFacility;
                        if (_requestMessageTypePrefix == "FTP")
                        {
                            empty = string.Empty;
                            try
                            {
                                empty = VistaSiteService.GetSiteName(correspondingIDs.AssigningFacility, base.OrganizationService);
                            }
                            catch (Exception)
                            {
                            }
                            if (empty == string.Empty)
                            {
                                empty = correspondingIDs.AssigningFacility;
                            }
                            crme_person3["crme_sitename"] = empty;
                            crme_person3["crme_url"] = "http://event/?eventname=Set location&site=" + empty;
                        }
                        crme_person3["crme_dobstring"] = FormatDate(response.DateofBirth);
                        crme_person3["crme_mvidobstring"] = response.DateofBirth;
                        crme_person3["crme_primaryphone"] = response.PhoneNumber;
                        crme_person3["crme_fulladdress"] = response.FullAddress;
                        crme_person3["crme_firstname"] = response.FirstName;
                        crme_person3["crme_lastname"] = response.FamilyName;
                        crme_person3["crme_patientmviidentifier"] = request.PatientSearchIdentifier;
                        crme_person3["crme_patientid"] = correspondingIDs.PatientIdentifier;
                        crme_person3["crme_fullname"] = response.FullName;
                        //text2 = ((text2 == string.Empty) ? request.RawValueFromMvi : (text2 + ";" + request.RawValueFromMvi));
                        if (correspondingIDs.AssigningFacility.Contains("CORP") && correspondingIDs.AssigningAuthority == "USVBA" && correspondingIDs.IdentifierType == "PI")
                        {
                            crme_person3["crme_filenumber"] = correspondingIDs.PatientIdentifier;
                        }
                        if ((!crme_person3.Contains("crme_edipi") || crme_person3["crme_edipi"].ToString() == "") && correspondingIDs.AssigningFacility.Contains("DOD") && correspondingIDs.AssigningAuthority == "USDOD" && correspondingIDs.IdentifierType == "NI")
                        {
                            crme_person3["crme_edipi"] = correspondingIDs.PatientIdentifier;
                        }
                        if (orgName.Contains("VCL"))
                        {
                            int result = 0;
                            bool flag4 = int.TryParse(correspondingIDs.AssigningFacility, out result);
                            if (config.GetSensitiveInfo && flag4 && correspondingIDs.AssigningAuthority == "USVHA" && correspondingIDs.AssigningFacility == b && flag)
                            {
                                crme_person3["crme_veteransensitivitylevel"] = text;
                                base.Logger.WriteDebugMessage("DEBUG::Facility match found with ESR/MVI, Sensitivity Level set for " + correspondingIDs.AssigningFacility);
                            }
                            else if (config.GetSensitiveInfo && flag4 && correspondingIDs.AssigningAuthority == "USVHA" && !flag && !flag2)
                            {
                                string prefFacility = correspondingIDs.AssigningAuthority;
                                crme_person3["crme_veteransensitivitylevel"] = text;
                                flag2 = true;
                                base.Logger.WriteDebugMessage("DEBUG::No facility match found with ESR/MVI, Sensitivity Level set for " + correspondingIDs.AssigningFacility + " != " + prefFacility);
                            }
                        }
                        else
                        {
                            crme_person3["crme_veteransensitivitylevel"] = text;
                        }

                        List<string> strs = new List<string>();
                        CorrespondingIDs icnId = correspondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200M" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVHA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                        string icn = (icnId != null) ? icnId.PatientIdentifier : string.Empty;
                        crme_person3["crme_icn"] = icn;
                        strs.Add(icn);
                        string url = PatientPersonExtensions.getKVPSetting("sensitive_endpoint", base.OrganizationService);
                        string keys = config.VeisConfiguration.SvcConfigInfo.ApimSubscriptionKey;
                        NonVetResponse nvResponse = PatientPersonExtensions.getVHAVeteranEmployeeFlags(String.Format("{0}{1}", config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl, config.EmployeeEndpoint), keys, strs, base.Logger);
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
                            isEmp = PatientPersonExtensions.isEmployee(crme_person3["crme_icn"].ToString(), vHAVeteranEmployeeFlags);
                        }

                        crme_person3["crme_ssn"] = response.SocialSecurityNumber;
                        crme_person3["crme_veteransensitivitylevel"] = PatientPersonExtensions.getSensitivityLevelVHA(config, crme_person3, isEmp);
                        ((EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"]).Entities.Add(crme_person3);
                    }
                    if (flag3)
                    {
                        auditSensitivity(response.FullName, true);
                    }
                }
            }
            catch (FaultException<OrganizationServiceFault> ex2)
            {
                base.Logger.WriteDebugMessage("ERROR::OrganizationServiceFault Exception while mapping PatientIdentifier:" + ex2.Message);
                throw new InvalidPluginExecutionException(ex2.Message);
            }
            catch (NullReferenceException ex3)
            {
                base.Logger.WriteDebugMessage("ERROR::Null Reference Exception while mapping PatientIdentifier:" + ex3.Message);
                throw new InvalidPluginExecutionException(ex3.Message);
            }
            catch (Exception ex)
            {
                base.Logger.WriteDebugMessage("ERROR::Error while mapping PatientIdentifier:" + ex.Message);
                throw new InvalidPluginExecutionException(ex.Message);
            }
        }

        private void auditSelectedPersonResponse(CorrespondingIdsResponse response, string ids)
        {
            if (auditUrl == "")
            {
                auditUrl = PatientPersonExtensions.getKVPSetting("MVI_Log2", base.OrganizationService);
            }
            MVILog2 mVILog = new MVILog2();
            mVILog.Organization_Name = response.OrganizationName;
            mVILog.CreatedOn = DateTime.UtcNow;
            mVILog.DOB = ((response.DateofBirth != null && response.DateofBirth.Length > 15) ? response.DateofBirth.Substring(0, 15) : response.DateofBirth);
            mVILog.EDIPI = ((response.Edipi != null && response.Edipi.Length > 10) ? response.Edipi.Substring(0, 10) : response.Edipi);
            mVILog.ICN = ((response.ParticipantId != null && response.ParticipantId.Length > 30) ? response.ParticipantId.Substring(0, 30) : response.ParticipantId);
            mVILog.IDs = ((ids != null && ids.Length > 1000) ? ids.Substring(0, 1000) : ids);
            mVILog.Phone = response.PhoneNumber;
            mVILog.SessionId = response.UserId.ToString();
            mVILog.SSN = ((response.SocialSecurityNumber != null && response.SocialSecurityNumber.Length > 10) ? response.SocialSecurityNumber.Substring(0, 10) : response.SocialSecurityNumber);
            mVILog.UserName = ((userName.Length > 30) ? userName.Substring(0, 30) : userName);
            MVILog2 obj = mVILog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(auditUrl, json, "MVILog2");
        }

        private void auditSensitivity(string crmeFullName, bool accessed)
        {
            string kVPSetting = PatientPersonExtensions.getKVPSetting("MVI_Sensitivity_Log", base.OrganizationService);
            SensitiveLog sensitiveLog = new SensitiveLog();
            sensitiveLog.Accessed = accessed;
            sensitiveLog.Access_Time = DateTime.UtcNow.ToString("G");
            sensitiveLog.HDR_Response_Code = "";
            sensitiveLog.Organization_Name = orgName.Trim();
            sensitiveLog.Sensitive_Veteran = true;
            sensitiveLog.SessionId = base.PluginExecutionContext.InitiatingUserId.ToString();
            sensitiveLog.Veteran = ((crmeFullName.Length > 30) ? crmeFullName.Substring(0, 30) : crmeFullName);
            sensitiveLog.Who_Accessed = userName;
            //sensitiveLog.SiteId = (orgName.ToUpper().Contains("VRE") ? stationNumber : ((prefFacility != null && prefFacility.Length > 20) ? prefFacility.Substring(0, 20) : prefFacility));
            SensitiveLog obj = sensitiveLog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(kVPSetting, json, "Sensitivity_Log");
        }

        private void Map(PersonSearchResponse response, VeisConfig config)
        {
            //IL_0001: Unknown result type (might be due to invalid IL or missing references)
            //IL_0007: Expected O, but got Unknown
            var eCol = (EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"];

            bool flag = false;
            if (response.ExceptionOccured)
            {
                if (response.Message.ToLower().Contains("correlation does not exist") || response.Message.ToLower().Contains("unknown key identifier"))
                {
                    flag = true;
                }
                else
                {
                    var errEnt = new Entity("crme_person");
                    errEnt.Id = Guid.NewGuid();
                    errEnt.Attributes.Add("crme_fullname", "");
                    errEnt.Attributes.Add("crme_exceptionoccured", true);
                    errEnt.Attributes.Add("crme_exceptionmessage", "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.");
                }
            }

            if (response.Person == null || (response.Person != null && response.Person[0] == null))
            {
                var errEnt = new Entity("crme_person");
                errEnt.Id = Guid.NewGuid();
                errEnt.Attributes.Add("crme_fullname", "");
                errEnt.Attributes.Add("crme_exceptionoccured", true);

                if (flag)
                {
                    errEnt.Attributes.Add("crme_exceptionmessage", "Your search in MVI did not find any records matching the search criteria.");
                }
                errEnt.Attributes.Add("crme_returnmessage", response.Message + response.CORPDbMessage);
                eCol.Entities.Add(errEnt);
                return;
            }

            if (response != null
                && response.Person != null
                && response.Person.Count() > 0)
            {
                foreach (PatientPerson p in response.Person)
                {
                    var ePatient = p.Map(base.OrganizationService, base.Logger, config);
                    eCol.Entities.Add(ePatient);
                }
            }
            base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"] = (object)eCol;

        }

        private void getMVICorpPidBIRLSFN(Entity newPerson, VeisConfig config)
        {
            SelectedPersonRequest selectedPersonRequest = new SelectedPersonRequest();
            selectedPersonRequest.OrganizationName = orgName;
            selectedPersonRequest.RecordSource = "MVI";
            selectedPersonRequest.UserId = base.PluginExecutionContext.InitiatingUserId;
            selectedPersonRequest.MessageId = Guid.NewGuid().ToString();
            //selectedPersonRequest.Debug = false;
            selectedPersonRequest.LogSoap = config.LogSoap;
            selectedPersonRequest.LogTiming = config.LogTimer;
            //selectedPersonRequest.noAddPerson = false;
            //selectedPersonRequest.ICN = newPerson.crme_ICN;
            CorrespondingIdsResponse correspondingIdsResponse = WebApiUtility.SendReceiveVeisRequest<CorrespondingIdsResponse>(config, "SelectedPerson", selectedPersonRequest);
            if (correspondingIdsResponse.ExceptionOccured)
            {
                base.Logger.WriteDebugMessage($"ERROR::VBASensitivityCheck: Search Exception Message: {correspondingIdsResponse.RawMviExceptionMessage}");
            }
            try
            {
                if (correspondingIdsResponse.CorrespondingIdList == null || !correspondingIdsResponse.CorrespondingIdList.Any())
                {
                    base.Logger.WriteDebugMessage("DEBUG::VBASensitivityCheck: No Correlations Returned in getMVICorpPidBIRLSFN()");
                }
                else
                {
                    CorrespondingIDs correspondingIDs = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200CORP" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    newPerson["crme_participantid"] = ((correspondingIDs != null) ? correspondingIDs.PatientIdentifier : string.Empty);
                    CorrespondingIDs correspondingIDs2 = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200BRLS" && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USVBA", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("PI", StringComparison.InvariantCultureIgnoreCase));
                    newPerson["crme_filenumber"] = ((correspondingIDs2 != null) ? correspondingIDs2.PatientIdentifier : string.Empty);
                    CorrespondingIDs correspondingIDs3 = correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.AssigningFacility != null && v.AssigningFacility == "200DOD" && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase)) ?? correspondingIdsResponse.CorrespondingIdList.FirstOrDefault((CorrespondingIDs v) => v.AssigningAuthority != null && v.AssigningAuthority.Equals("USDOD", StringComparison.InvariantCultureIgnoreCase) && v.IdentifierType != null && v.IdentifierType.Equals("NI", StringComparison.InvariantCultureIgnoreCase));
                    newPerson["crme_edipi"] = ((correspondingIDs3 != null) ? correspondingIDs3.PatientIdentifier : string.Empty);
                    base.Logger.WriteDebugMessage($"DEBUG::VBASensitivityCheck: Response Success for PId: {correspondingIDs.PatientIdentifier}, FileNumber: {correspondingIDs2.PatientIdentifier}, EDIPI: {correspondingIDs3.PatientIdentifier} ");
                }
            }
            catch (Exception)
            {
                base.Logger.WriteDebugMessage("ERROR::VBASensitivityCheck: Error in getMVICorpPidBIRLSFN()");
            }
        }


        private void auditPersonResponse(Entity person)
        {
            /*
            if (auditUrl == "")
            {
                auditUrl = getKVPSetting("MVI_Log");
            }
            string text = person.crme_ICN;
            if (text.Length > 15)
            {
                text = person.crme_ICN.Substring(0, 15);
            }
            MVILog mVILog = new MVILog();
            mVILog.Address = ((person.crme_FullAddress != null && person.crme_FullAddress.Length > 40) ? person.crme_FullAddress.Substring(0, 40) : person.crme_FullAddress);
            mVILog.Attended = (person.crme_IsAttended.HasValue && person.crme_IsAttended.Value);
            mVILog.ClassCode = ((person.crme_ClassCode != null && person.crme_ClassCode.Length > 10) ? person.crme_ClassCode.Substring(0, 10) : person.crme_ClassCode);
            mVILog.CreatedOn = DateTime.UtcNow;
            mVILog.DOB = ((person.crme_DOBString != null && person.crme_DOBString.Length > 15) ? person.crme_DOBString.Substring(0, 15) : person.crme_DOBString);
            mVILog.EDIPI = ((person.crme_EDIPI != null && person.crme_EDIPI.Length > 10) ? person.crme_EDIPI.Substring(0, 15) : person.crme_EDIPI);
            mVILog.First = ((person.crme_FirstName != null && person.crme_FirstName.Length > 30) ? person.crme_FirstName.Substring(0, 30) : person.crme_FirstName);
            mVILog.ICN = text;
            mVILog.Last = ((person.crme_LastName != null && person.crme_LastName.Length > 30) ? person.crme_LastName.Substring(0, 30) : person.crme_LastName);
            mVILog.Middle = ((person.crme_MiddleName != null && person.crme_MiddleName.Length > 20) ? person.crme_MiddleName.Substring(0, 20) : person.crme_MiddleName);
            mVILog.MMN = ((person.crme_MMN != null && person.crme_MMN.Length > 20) ? person.crme_MMN.Substring(0, 20) : person.crme_MMN);
            mVILog.Organization_Name = orgName;
            mVILog.Phone = ((person.crme_PrimaryPhone != null && person.crme_PrimaryPhone.Length > 17) ? person.crme_PrimaryPhone.Substring(0, 17) : person.crme_PrimaryPhone);
            mVILog.POBC = ((person.crme_POBC != null && person.crme_POBC.Length > 25) ? person.crme_POBC.Substring(0, 25) : person.crme_POBC);
            mVILog.POBS = ((person.crme_POBS != null && person.crme_POBS.Length > 20) ? person.crme_POBS.Substring(0, 20) : person.crme_POBS);
            mVILog.RequestType = ((person.crme_searchtype != null && person.crme_searchtype.Length > 20) ? person.crme_searchtype.Substring(0, 20) : person.crme_searchtype);
            mVILog.SessionId = base.PluginExecutionContext.InitiatingUserId.ToString();
            mVILog.Sex = ((person.crme_Gender != null && person.crme_Gender.Length > 1) ? person.crme_Gender.Substring(0, 1) : person.crme_Gender);
            mVILog.Source = ((person.crme_RecordSource != null && person.crme_RecordSource.Length > 10) ? person.crme_RecordSource.Substring(0, 10) : person.crme_RecordSource);
            mVILog.Type = "Response";
            mVILog.UserName = ((userName.Length > 30) ? userName.Substring(0, 30) : userName.Trim());
            mVILog.SSN = ((person.crme_SSN != null && person.crme_SSN.Length > 10) ? person.crme_SSN.Substring(0, 10) : person.crme_SSN);
            MVILog obj = mVILog;
            string json = JsonHelper.Serialize(obj);
            handleRequest(auditUrl, json, "MVILog");
            */
        }

        private void handleRequest(string url, string json, string logTable)
        {
            /*
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            using (StreamWriter streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }
            try
            {
                HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (StreamReader streamReader = new StreamReader(httpWebResponse.GetResponseStream()))
                {
                    streamReader.ReadToEnd();
                    streamReader.Close();
                }
                httpWebResponse.Close();
            }
            catch (Exception ex)
            {
                base.Logger.WriteDebugMessage("ERROR::Error creating " + logTable + " response record: " + ex.Message);
            }
            */
        }

        private void HandleMVIErrorInUI()
        {
            //IL_0016: Unknown result type (might be due to invalid IL or missing references)
            //IL_0037: Unknown result type (might be due to invalid IL or missing references)
            //IL_0056: Unknown result type (might be due to invalid IL or missing references)
            //IL_005c: Expected O, but got Unknown
            if (((EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"]).Entities != null && ((EntityCollection)base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"]).Entities.Count > 0)
            {
            }
            EntityCollection val = new EntityCollection();
            Entity crme_person = new Entity("crme_person");
            crme_person["crme_personid"] = Guid.NewGuid();
            crme_person["crme_fullname"] = string.Empty;
            crme_person["crme_exceptionoccured"] = true;
            crme_person["crme_exceptionmessage"] = "An unexpected error occured during the MVI search. Please try again or contact your system administrator if the problem persists.";
            base.Logger.WriteDebugMessage("ERROR::Sending back empty Person for Exception Handling.");
            ((EntityCollection)val).Entities.Add(crme_person);
            base.PluginExecutionContext.OutputParameters["BusinessEntityCollection"] = (object)val;
        }

        private string FormatDate(string date)
        {
            if (date != "" && !string.IsNullOrWhiteSpace(date) && date.Length == 8)
            {
                return date.Substring(4, 2) + "/" + date.Substring(6, 2) + "/" + date.Substring(0, 4);
            }
            return date;
        }
    }
}
