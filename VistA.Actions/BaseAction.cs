using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk.Query;
using System.Activities;
using VCCM.VistA.Actions.Models;
using Microsoft.Xrm.Sdk.Workflow;
//using VEIS.Plugins.Messages;

namespace VCCM.VistA.Actions
{
    public abstract partial class BaseAction : CodeActivity
    {
        [Output("Response")]
        public OutArgument<string> Response
        {
            get;
            set;
        }
        [Output("VeisRawResponse")]
        public OutArgument<string> VeisRawResponse
        {
            get;
            set;
        }
        [Input("Request")]
        [RequiredArgument]
        public InArgument<string> Request
        {
            get;
            set;
        }
        [Output("VeisRawRequest")]
        public OutArgument<string> VeisRawRequest
        {
            get;
            set;
        }
        public class ActionContext : BasePluginContext
        {
            internal CodeActivityContext ActivityContext { get; private set; }
            internal IWorkflowContext WorkflowExecutionContext { get; private set; }

            internal ActionContext(CodeActivityContext context) : base(context.GetExtension<IOrganizationServiceFactory>(), context.GetExtension<ITracingService>(), context.GetExtension<IWorkflowContext>().UserId)
            {
                this.ActivityContext = context;
                // Obtain the execution context service from the service provider.
                this.WorkflowExecutionContext = context.GetExtension<IWorkflowContext>();
                this.OrganizationName = this.WorkflowExecutionContext.OrganizationName;
            }


        }
    }
}

