using System;

namespace PersonSearch.Plugin.Messages
{
	public class CorrespondingIDs
	{
		public string PatientIdentifier
		{
			get;
			set;
		}

		public string IdentifierType
		{
			get;
			set;
		}

		public string AssigningFacility
		{
			get;
			set;
		}

		public string AssigningAuthority
		{
			get;
			set;
		}

		public string RawValueFromMvi
		{
			get;
			set;
		}

		public string AuthorityOid
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

		public override string ToString()
		{
			return $"{PatientIdentifier}^{IdentifierType}^{AssigningFacility}^{AssigningAuthority}";
		}
	}
}
