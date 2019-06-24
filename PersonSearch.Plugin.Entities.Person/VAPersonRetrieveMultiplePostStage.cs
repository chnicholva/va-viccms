using Microsoft.Xrm.Sdk;
using System;

namespace PersonSearch.Plugin.Entities.Person
{
	public class VAPersonRetrieveMultiplePostStage : IPlugin
	{
		public void Execute(IServiceProvider serviceProvider)
		{
			VAPersonRetrieveMultiplePostStageRunner vAPersonRetrieveMultiplePostStageRunner = new VAPersonRetrieveMultiplePostStageRunner(serviceProvider);
			vAPersonRetrieveMultiplePostStageRunner.Execute();
		}
	}
}
