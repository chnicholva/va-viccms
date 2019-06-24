using Microsoft.Xrm.Sdk;
using System;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.ServiceModel;

namespace MVI.PersonSearch.Plugin
{
	public class Plugin : IPlugin
	{
		protected class LocalPluginContext
		{
			internal IServiceProvider ServiceProvider
			{
				get;
				private set;
			}

			internal IOrganizationService OrganizationService
			{
				get;
				private set;
			}

			internal IPluginExecutionContext PluginExecutionContext
			{
				get;
				private set;
			}

			internal ITracingService TracingService
			{
				get;
				private set;
			}

			private LocalPluginContext()
			{
			}

			internal LocalPluginContext(IServiceProvider serviceProvider)
			{
				//IL_0030: Unknown result type (might be due to invalid IL or missing references)
				//IL_003a: Expected O, but got Unknown
				//IL_004c: Unknown result type (might be due to invalid IL or missing references)
				//IL_0056: Expected O, but got Unknown
				//IL_0067: Unknown result type (might be due to invalid IL or missing references)
				//IL_006d: Expected O, but got Unknown
				if (serviceProvider == null)
				{
					throw new ArgumentNullException("serviceProvider");
				}
				PluginExecutionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
				TracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
				IOrganizationServiceFactory val = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
				OrganizationService = val.CreateOrganizationService((Guid?)PluginExecutionContext.UserId);
			}

			internal void Trace(string message)
			{
				if (!string.IsNullOrWhiteSpace(message) && TracingService != null)
				{
					if (PluginExecutionContext == null)
					{
						TracingService.Trace(message, new object[0]);
					}
					else
					{
						TracingService.Trace("{0}, Correlation Id: {1}, Initiating User: {2}", new object[3]
						{
							message,
							PluginExecutionContext.CorrelationId,
							PluginExecutionContext.InitiatingUserId
						});
					}
				}
			}
		}

		private Collection<Tuple<int, string, string, Action<LocalPluginContext>>> registeredEvents;

		protected Collection<Tuple<int, string, string, Action<LocalPluginContext>>> RegisteredEvents
		{
			get
			{
				if (registeredEvents == null)
				{
					registeredEvents = new Collection<Tuple<int, string, string, Action<LocalPluginContext>>>();
				}
				return registeredEvents;
			}
		}

		protected string ChildClassName
		{
			get;
			private set;
		}

		internal Plugin(Type childClassName)
		{
			ChildClassName = childClassName.ToString();
		}

		public void Execute(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}
			LocalPluginContext localcontext = new LocalPluginContext(serviceProvider);
			localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Entered {0}.Execute()", new object[1]
			{
				ChildClassName
			}));
			try
			{
				Action<LocalPluginContext> action = (from a in RegisteredEvents
					where a.Item1 == localcontext.PluginExecutionContext.Stage && a.Item2 == localcontext.PluginExecutionContext.MessageName && (string.IsNullOrWhiteSpace(a.Item3) || a.Item3 == localcontext.PluginExecutionContext.PrimaryEntityName)
					select a.Item4).FirstOrDefault();
				if (action != null)
				{
					localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "{0} is firing for Entity: {1}, Message: {2}", new object[3]
					{
						ChildClassName,
						localcontext.PluginExecutionContext.PrimaryEntityName,
						localcontext.PluginExecutionContext.MessageName
					}));
					action(localcontext);
				}
			}
			catch (FaultException<OrganizationServiceFault> ex)
			{
				localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", new object[1]
				{
					ex.ToString()
				}));
				throw;
			}
			finally
			{
				localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exiting {0}.Execute()", new object[1]
				{
					ChildClassName
				}));
			}
		}
	}
}
