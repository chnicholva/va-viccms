using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using VEIS.Plugins.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PersonSearch.Plugin.Helpers;

namespace PersonSearch.Plugin
{
    public class BasePluginContext : IDisposable
    {
        public void Dispose()
        {
            if (this.CrmContext != null)
                this.CrmContext.Dispose();
        }

        public BasePluginContext(IOrganizationServiceFactory orgServiceFactory, ITracingService tracingService, Guid userId)
        {
            ServiceFactory = orgServiceFactory;

            // Use the factory to generate the Organization Service.
            this.OrganizationService = this.ServiceFactory.CreateOrganizationService(userId);

            // Generate the CrmContext to use with LINQ etc
            this.CrmContext = new Microsoft.Xrm.Sdk.Client.OrganizationServiceContext(this.OrganizationService);

            this.TracingService = tracingService;

            this.UserId = userId;
        }

        internal string DecryptCredential(string credential, int offsetValue)
        {
            string str = "";
            if ((credential == null ? false : credential != ""))
            {
                string[] strArrays = credential.Split(new char[] { ',' });
                Array.Reverse(strArrays);
                for (int i = 0; i < (int)strArrays.Length; i++)
                {
                    int num = Convert.ToInt16(strArrays[i]) - (i + offsetValue);
                    char chr = Convert.ToChar(num);
                    str = string.Concat(str, chr.ToString());
                }
            }
            return str;
        }

        internal void Trace(string message, params string[] formatParameters)
        {
            if (string.IsNullOrWhiteSpace(message) || this.TracingService == null) return;
            this.TracingService.Trace(message, formatParameters);
        }

        internal VeisConfig RetrieveVeisConfig(string servicePathField, string subscriptionKeyField)
        {
            Entity settings = this.RetrieveActiveSettings("patsr_transactiontiming", "patsr_veisservicebaseurl","patsr_vastlistrefreshapiurl", 
                "patsr_veisorganizationname", "patsr_veisclientsecret", "patsr_veistenantid", "patsr_veisclientapplicationid", 
                "patsr_veisresourceid", servicePathField, subscriptionKeyField, "patsr_granulartiming", 
                "patsr_searchlogtiming", "patsr_searchlogsoap", "patsr_unexpectedmessage", "patsr_masksensitiveinfo", 
                "patsr_retrievesenitivitylevel", "patsr_enableauditing", "patsr_employeeendpoint", "patsr_sensitiveendpoint");
            if (settings != null)
            {
                VeisConfig config = new VeisConfig()
                {
                    OrgOverride = (settings.Contains("patsr_veisorganizationname")) ? settings["patsr_veisorganizationname"].ToString() : string.Empty,
                    GetSensitiveInfo = (settings.Contains("patsr_retrievesenitivitylevel")) ? (Boolean)settings["patsr_retrievesenitivitylevel"] : false,
                    EnableAuditing = (settings.Contains("patsr_enableauditing")) ? (Boolean)settings["patsr_enableauditing"] : false,
                    LogTimer = (settings.Contains("patsr_searchlogtiming")) ? (Boolean)settings["patsr_searchlogtiming"] : false,
                    LogSoap = (settings.Contains("patsr_searchlogsoap")) ? (Boolean)settings["patsr_searchlogsoap"] : false,
                    EmployeeEndpoint = (settings.Contains("patsr_employeeendpoint")) ? settings.GetAttributeValue<string>("patsr_employeeendpoint") : string.Empty,
                    SensitiveEndpoint = (settings.Contains("patsr_sensitiveendpoint")) ? settings.GetAttributeValue<string>("patsr_sensitiveendpoint") : string.Empty
                };

                config.OrgName = (config.OrgOverride != "" && config.OrgOverride != string.Empty) ? config.OrgOverride : this.OrganizationName;

                config.VeisConfiguration = new VeisConfiguration()
                {
                    CRMAuthInfo = new CRMAuthTokenConfiguration()
                    {
                        ClientApplicationId = (settings.Contains("patsr_veisclientapplicationid")) ? settings["patsr_veisclientapplicationid"].ToString() : string.Empty,
                        ClientSecret = (settings.Contains("patsr_veisclientsecret")) ? settings["patsr_veisclientsecret"].ToString() : string.Empty,
                        TenantId = (settings.Contains("patsr_veistenantid")) ? settings["patsr_veistenantid"].ToString() : string.Empty,
                        ResourceId = (settings.Contains("patsr_veisresourceid")) ? settings["patsr_veisresourceid"].ToString() : string.Empty,

                    },
                    SvcConfigInfo = new VEISSvcLOBConfiguration()
                    {
                        ApimSubscriptionKey = (settings.Contains(subscriptionKeyField)) ? settings[subscriptionKeyField].ToString() : string.Empty,
                    }
                };

                if (settings.Contains("patsr_veisservicebaseurl") && settings.Contains(servicePathField))
                {
                    config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl = settings["patsr_veisservicebaseurl"].ToString();
                    if (settings["patsr_veisservicebaseurl"].ToString().EndsWith("/"))
                    {
                        config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl = settings["patsr_veisservicebaseurl"].ToString() + settings[servicePathField].ToString();
                    }
                    else
                    {
                        config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl = settings["patsr_veisservicebaseurl"].ToString() + "/" + settings[servicePathField].ToString();
                    }
                }

                //if (settings.Contains("patsr_vastlistrefreshapiurl") && settings.Contains(servicePathField))
                //{
                //    if (settings["patsr_vastlistrefreshapiurl"].ToString().EndsWith("/"))
                //    {
                //        config.VeisConfiguration.VASTRefreshFacilityAPI = settings[servicePathField].ToString() + settings["patsr_vastlistrefreshapiurl"].ToString();
                //    }
                //    else
                //    {
                //        config.VeisConfiguration.VASTRefreshFacilityAPI = settings[servicePathField].ToString() + "/" + settings["patsr_vastlistrefreshapiurl"].ToString();
                //    }
                //}

                return config;
            }
            return null;
        }
        internal virtual Entity RetrieveActiveSettings(params string[] cols)
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
        internal Microsoft.Xrm.Sdk.Client.OrganizationServiceContext CrmContext { get; private set; }
        //internal IServiceProvider ServiceProvider { get; set; }
        internal IOrganizationServiceFactory ServiceFactory { get; set; }
        internal IOrganizationService OrganizationService { get; set; }
        internal ITracingService TracingService { get; set; }

        internal string OrganizationName { get; set; }
        internal Guid UserId { get; set; }
    }
}
