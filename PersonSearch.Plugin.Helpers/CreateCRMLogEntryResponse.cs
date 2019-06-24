using System;

namespace PersonSearch.Plugin.Helpers
{
	public class CreateCRMLogEntryResponse
	{
		public string MessageId
		{
			get;
			set;
		}

		public Guid crme_loggingId
		{
			get;
			set;
		}
	}
}
