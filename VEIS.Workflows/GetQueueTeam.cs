using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Workflows
{
    public class GetQueueTeam : CodeActivity
    {
        [Output("Team")]
        [ReferenceTarget("team")]
        public OutArgument<EntityReference> TeamOutArgument
        {
            get;
            set;
        }

        [Input("Queue")]
        [ReferenceTarget("queue")]
        [RequiredArgument]
        public InArgument<EntityReference> QueueInArgument
        {
            get;
            set;
        }

        internal CodeActivityContext ActivityContext { get; private set; }
        internal IWorkflowContext WorkflowExecutionContext { get; private set; }
        internal IOrganizationServiceFactory ServiceFactory { get; set; }
        internal IOrganizationService OrganizationService { get; set; }
        internal ITracingService TracingService { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            this.ActivityContext = context;
            // Obtain the execution context service from the service provider.
            this.WorkflowExecutionContext = context.GetExtension<IWorkflowContext>();

            ServiceFactory = context.GetExtension<IOrganizationServiceFactory>();

            // Use the factory to generate the Organization Service.
            this.OrganizationService = this.ServiceFactory.CreateOrganizationService(null);

            var queueRef = QueueInArgument.Get<EntityReference>(context);

            QueryExpression query = new QueryExpression("team");
            query.Criteria = new FilterExpression();
            query.Criteria.AddCondition("queueid", ConditionOperator.Equal, queueRef.Id);
            query.TopCount = 1;

            var entCol = this.OrganizationService.RetrieveMultiple(query);
            if(entCol.Entities.Count == 1)
            {
                TeamOutArgument.Set(context, entCol.Entities.First().ToEntityReference());
            }
        }
    }
}
