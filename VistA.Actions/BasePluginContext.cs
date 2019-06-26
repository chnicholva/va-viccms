using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using VCCM.VistA.Actions.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VCCM.VistA.Actions
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
