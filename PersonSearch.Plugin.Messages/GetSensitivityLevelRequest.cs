using System;

namespace PersonSearch.Plugin.Messages
{
	public class GetSensitivityLevelRequest
	{
		public string MessageId
		{
			get;
			set;
		}

		public string OrganizationName
		{
			get;
			set;
		}

		public Guid UserId
		{
			get;
			set;
		}

		public string SSN
		{
			get;
			set;
		}

		public long? ParticipantId
		{
			get;
			set;
		}
	}
}
