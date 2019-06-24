using System;

namespace PersonSearch.Plugin.Messages
{
	public class GetVeteranInfoRequest
	{
		public string MessageId
		{
			get;
			set;
		}

		public string crme_OrganizationName
		{
			get;
			set;
		}

		public Guid crme_UserId
		{
			get;
			set;
		}

		public string crme_SSN
		{
			get;
			set;
		}
	}
}
