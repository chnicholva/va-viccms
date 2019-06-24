using System;

namespace PersonSearch.Plugin.Messages
{
	public class DeterministicSearchRequest
	{
		public string MessageId
		{
			get;
			set;
		}

		public Guid UserId
		{
			get;
			set;
		}

		public string UserFirstName
		{
			get;
			set;
		}

		public string UserLastName
		{
			get;
			set;
		}

		public string OrganizationName
		{
			get;
			set;
		}

		public string BirthDate
		{
			get;
			set;
		}

		public string SocialSecurityNumber
		{
			get;
			set;
		}

		public string EdiPi
		{
			get;
			set;
		}

		public DeterministicSearchType SearchType
		{
			get;
			set;
		}
	}
}
