namespace PersonSearch.Plugin.Messages
{
	public class GetSensitivityLevelResponse
	{
		public string SensitivityLevel
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
