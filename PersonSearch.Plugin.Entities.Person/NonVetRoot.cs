using System.Collections.Generic;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Entities.Person
{
	public class NonVetRoot
	{
		public string ErrorOccurred
		{
			get;
			set;
		}

		public List<object> ErrorMessage
		{
			get;
			set;
		}

		public List<object> Status
		{
			get;
			set;
		}

		public List<object> DebugInfo
		{
			get;
			set;
		}

		public List<NVDatum> Data
		{
			get;
			set;
		}
	}
}
