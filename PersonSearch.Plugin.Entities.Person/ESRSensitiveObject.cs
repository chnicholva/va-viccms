namespace PersonSearch.Plugin.Entities.Person
{
	internal class ESRSensitiveObject
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

		public Data Data
		{
			get;
			set;
		}
	}
}
