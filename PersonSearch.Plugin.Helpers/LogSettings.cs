using System;

namespace PersonSearch.Plugin.Helpers
{
	public class LogSettings
	{
		public string Org
		{
			get;
			set;
		}

		public string ConfigFieldName
		{
			get;
			set;
		}

		public Guid UserId
		{
			get;
			set;
		}

		public string callingMethod
		{
			get;
			set;
		}
	}
}
