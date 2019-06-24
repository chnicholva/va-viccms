using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using PersonSearch.Plugin.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Messages;
using VEIS.Plugins.Models;

namespace MVIPersonSearchPlugin.Tests
{
    class Program
    {
        static void Main(string[] args)
        {
            QueryExpression query = new QueryExpression("cre_person");
            query.Criteria = new FilterExpression();
            query.Criteria.AddCondition("crme_ssn", ConditionOperator.Equal, "333836565");
            query.Criteria.AddCondition("crme_firstname", ConditionOperator.Equal, "Craig");
            query.Criteria.AddCondition("crme_lastname", ConditionOperator.Equal, "VCCMCampbell");
            FilterExpression fe1 = new FilterExpression();
            FilterExpression fe2 = new FilterExpression();
            fe1.AddFilter(fe2);

            fe2.AddCondition("crme_searchtype", ConditionOperator.Equal, "SearchPerson");

            query.Criteria.AddFilter(fe1);
            var str = query.GetSearchType();
            #region VEIS Search
            //var config = RetrieveVeisConfig("", "");
            //PersonSearchRequest searchRequest = new PersonSearchRequest();
            //searchRequest.SocialSecurityNumber = "333836565";
            //searchRequest.FamilyName = "VCCMCampbell";
            //searchRequest.FirstName = "Craig";

            //searchRequest.MessageId = Guid.NewGuid().ToString();
            //searchRequest.OrganizationName = "FTP";
            //searchRequest.UserId = Guid.NewGuid();
            //searchRequest.Debug = false;
            //searchRequest.LogSoap = false;
            //searchRequest.LogTiming = false;

            ////VeisRawRequest.Set(localContext.ActivityContext, JsonHelper.Serialize(searchRequest));
            //string message = "SearchPerson";

            //string searchResponse = WebApiUtility.SendReceiveVeisRequest<string>(config, message, searchRequest);
            #endregion
        }

        static VeisConfig RetrieveVeisConfig(string servicePathField, string subscriptionKeyField)
        {
            var config = new VeisConfig() { };

            //Entity settings = this.RetrieveActiveSettings("patsr_transactiontiming", "patsr_veisservicebaseurl", "patsr_vastlistrefreshapiurl",
            //    "patsr_veisorganizationname", "patsr_veisclientsecret", "patsr_veistenantid", "patsr_veisclientapplicationid",
            //    "patsr_veisresourceid", servicePathField, subscriptionKeyField, "patsr_granulartiming",
            //    "patsr_searchlogtiming", "patsr_searchlogsoap", "patsr_unexpectedmessage", "patsr_masksensitiveinfo",
            //    "patsr_retrievesenitivitylevel", "patsr_enableauditing", "patsr_employeeendpoint", "patsr_sensitiveendpoint");
            //if (settings != null)
            //{
            //    VeisConfig config = new VeisConfig()
            //    {
            //        OrgOverride = (settings.Contains("patsr_veisorganizationname")) ? settings["patsr_veisorganizationname"].ToString() : string.Empty,
            //        GetSensitiveInfo = (settings.Contains("patsr_retrievesenitivitylevel")) ? (Boolean)settings["patsr_retrievesenitivitylevel"] : false,
            //        EnableAuditing = (settings.Contains("patsr_enableauditing")) ? (Boolean)settings["patsr_enableauditing"] : false,
            //        LogTimer = (settings.Contains("patsr_searchlogtiming")) ? (Boolean)settings["patsr_searchlogtiming"] : false,
            //        LogSoap = (settings.Contains("patsr_searchlogsoap")) ? (Boolean)settings["patsr_searchlogsoap"] : false,
            //        EmployeeEndpoint = (settings.Contains("patsr_employeeendpoint")) ? settings.GetAttributeValue<string>("patsr_employeeendpoint") : string.Empty,
            //        SensitiveEndpoint = (settings.Contains("patsr_sensitiveendpoint")) ? settings.GetAttributeValue<string>("patsr_sensitiveendpoint") : string.Empty
            //    };

            //    config.OrgName = (config.OrgOverride != "" && config.OrgOverride != string.Empty) ? config.OrgOverride : this.OrganizationName;

            config.VeisConfiguration = new VeisConfiguration()
            {
                CRMAuthInfo = new CRMAuthTokenConfiguration()
                {
                    ClientApplicationId = "58d50ca3-b921-4d9b-ac76-8965be2eb80b",
                    ClientSecret = "4RdVDdhq8cv/h2263Ojdy8fD3JI9OwHcr5hOkntAwTc=",
                    TenantId = "f7c49e36-971b-42c7-b244-a88eed6c0bf6",
                    ResourceId = "51472684-3639-41eb-9d5b-9d8c68f173a5",

                },
                SvcConfigInfo = new VEISSvcLOBConfiguration()
                {
                    ApimSubscriptionKey = "Ocp-Apim-Subscription-Key|4a61ad0eaea2445fbbad9d81dbbe1d98",
                }
            };
            config.VeisConfiguration.SvcConfigInfo.SvcBaseUrl = "https://nonprod.integration.d365.va.gov/veis";
            config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl = "https://nonprod.integration.d365.va.gov/veis/EC/MVIService/api/";


            //    //if (settings.Contains("patsr_vastlistrefreshapiurl") && settings.Contains(servicePathField))
            //    //{
            //    //    if (settings["patsr_vastlistrefreshapiurl"].ToString().EndsWith("/"))
            //    //    {
            //    //        config.VeisConfiguration.VASTRefreshFacilityAPI = settings[servicePathField].ToString() + settings["patsr_vastlistrefreshapiurl"].ToString();
            //    //    }
            //    //    else
            //    //    {
            //    //        config.VeisConfiguration.VASTRefreshFacilityAPI = settings[servicePathField].ToString() + "/" + settings["patsr_vastlistrefreshapiurl"].ToString();
            //    //    }
            //    //}

            return config;
            //}
            //return null;
        }
        //static Entity RetrieveActiveSettings(params string[] cols)
        //{
        //    QueryByAttribute query = new QueryByAttribute
        //    {
        //        //change these fields as required for your implementation
        //        ColumnSet = new ColumnSet(cols),
        //        EntityName = "patsr_setting"
        //    };
        //    query.AddAttributeValue("patsr_name", "Active Settings");

        //    EntityCollection results = OrganizationService.RetrieveMultiple(query);
        //    if (results.Entities.Count > 0)
        //    {
        //        return results.Entities[0];
        //    }
        //    throw new InvalidPluginExecutionException("There is no Active settings record in the system");
        //}
    }
}
