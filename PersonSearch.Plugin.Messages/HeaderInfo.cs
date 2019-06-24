using System.Security;

namespace PersonSearch.Plugin.Messages
{
	public class HeaderInfo
	{
		public string StationNumber
		{
			get;
			set;
		}

		public string LoginName
		{
			get;
			set;
		}

		public string ApplicationName
		{
			get;
			set;
		}

		public string ClientMachine
		{
			get;
			set;
		}

		public SecureString Password
		{
			get;
			set;
		}
	}
}
