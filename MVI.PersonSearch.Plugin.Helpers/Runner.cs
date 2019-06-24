using Microsoft.Xrm.Sdk;
using System;

namespace MVI.PersonSearch.Plugin.Helpers
{
	public abstract class Runner
	{
		private readonly IServiceProvider _ServiceProvider;

		private IPluginExecutionContext _PluginExecutionContext;

		private IOrganizationServiceFactory _OrganizationServiceFactory;

		private IOrganizationService _OrganizationService;

		private ITracingService _TracingService;

		private Logger _Logger;

		internal IServiceProvider ServiceProvider => _ServiceProvider;

		internal IPluginExecutionContext PluginExecutionContext
		{
			get
			{
                //IL_0021: Unknown result type (might be due to invalid IL or missing references)
                //IL_0026: Unknown result type (might be due to invalid IL or missing references)
                //IL_0028: Expected O, but got Unknown
                //IL_002d: Expected O, but got Unknown
                IPluginExecutionContext obj = _PluginExecutionContext;
				if (obj == null)
				{
					var val = (IPluginExecutionContext)ServiceProvider.GetService(typeof(IPluginExecutionContext));
					IPluginExecutionContext val2 = val;
					_PluginExecutionContext = val;
					obj = val2;
				}
				return obj;
			}
		}

		internal IOrganizationServiceFactory OrganizationServiceFactory
		{
			get
			{
                //IL_0021: Unknown result type (might be due to invalid IL or missing references)
                //IL_0026: Unknown result type (might be due to invalid IL or missing references)
                //IL_0028: Expected O, but got Unknown
                //IL_002d: Expected O, but got Unknown
                IOrganizationServiceFactory obj = _OrganizationServiceFactory;
				if (obj == null)
				{
                    IOrganizationServiceFactory val = (IOrganizationServiceFactory)ServiceProvider.GetService(typeof(IOrganizationServiceFactory));
					IOrganizationServiceFactory val2 = val;
					_OrganizationServiceFactory = val;
					obj = val2;
				}
				return obj;
			}
		}

		internal IOrganizationService OrganizationService => _OrganizationService ?? (_OrganizationService = OrganizationServiceFactory.CreateOrganizationService((Guid?)PluginExecutionContext.InitiatingUserId));

		internal ITracingService TracingService
		{
			get
			{
                //IL_0021: Unknown result type (might be due to invalid IL or missing references)
                //IL_0026: Unknown result type (might be due to invalid IL or missing references)
                //IL_0028: Expected O, but got Unknown
                //IL_002d: Expected O, but got Unknown
                ITracingService obj = _TracingService;
				if (obj == null)
				{
                    ITracingService val = (ITracingService)ServiceProvider.GetService(typeof(ITracingService));
					ITracingService val2 = val;
					_TracingService = val;
					obj = val2;
				}
				return obj;
			}
		}

		internal Logger Logger => _Logger ?? (_Logger = new Logger
		{
			setService = OrganizationService,
			setTracingService = TracingService,
			setModule = $"{GetType()}:"
		});

		protected Runner(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}
			_ServiceProvider = serviceProvider;
		}

		public abstract Entity GetPrimaryEntity();

		public abstract Entity GetSecondaryEntity();
	}
}
