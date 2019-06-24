namespace PersonSearch.Plugin.Messages
{
	public class PersonSearchResponse
	{
		public string MessageId
		{
			get;
			set;
		}

		public PatientPerson[] Person
		{
			get;
			set;
		}

		public bool ExceptionOccured
		{
			get;
			set;
		}

		public string MVIMessage
		{
			get;
			set;
		}

		public string CORPDbMessage
		{
			get;
			set;
		}

		public int MVIRecordCount
		{
			get;
			set;
		}

		public int CORPDbRecordCount
		{
			get;
			set;
		}

		public string UDOMessage
		{
			get;
			set;
		}

		public string RawMviExceptionMessage
		{
			get;
			set;
		}

		public string OrganizationName
		{
			get;
			set;
		}
	}
}
