using System.Collections.Generic;

namespace PersonSearch.Plugin.Entities.Person
{
	public class SensitiveObject
	{
		public bool ErrorOccurred
		{
			get;
			set;
		}

		public object ErrorMessage
		{
			get;
			set;
		}

		public object Status
		{
			get;
			set;
		}

		public object DebugInfo
		{
			get;
			set;
		}

		public List<Datum> Data
		{
			get;
			set;
		}
	}
}
