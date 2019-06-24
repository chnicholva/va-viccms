namespace PersonSearch.Plugin.Messages
{
	public class GetVeteranInfoResponse
	{
		public GetVeteranInfoMultipleResponse[] GetVeteranInfo
		{
			get;
			set;
		}

		public string RecordSource
		{
			get;
			set;
		}

		public string ErrorMessage
		{
			get;
			set;
		}

		public bool ExceptionOccured
		{
			get;
			set;
		}
	}
}
