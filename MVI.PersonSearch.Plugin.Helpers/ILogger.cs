using Microsoft.Xrm.Sdk;
using System;

namespace MVI.PersonSearch.Plugin.Helpers
{
	public interface ILogger
	{
		ITracingService setTracingService
		{
			set;
		}

		IOrganizationService setService
		{
			set;
		}

		string setMethod
		{
			get;
			set;
		}

		string setEntityName
		{
			get;
			set;
		}

		Guid setEntityId
		{
			get;
			set;
		}

		string setModule
		{
			get;
			set;
		}

		bool setDebug
		{
			set;
		}

		bool setTxnTiming
		{
			set;
		}

		bool setGranularTiming
		{
			set;
		}

		void WriteToFile(string message);

		void WriteTxnTimingMessage(string message);

		void WriteGranularTimingMessage(string message);

		void WriteDebugMessage(string message);
	}
}
