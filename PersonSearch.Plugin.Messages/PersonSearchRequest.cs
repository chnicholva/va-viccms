using System;

namespace PersonSearch.Plugin.Messages
{
	public class PersonSearchRequest
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

		public Guid RelatedParentId
		{
			get;
			set;
		}

		public string RelatedParentEntityName
		{
			get;
			set;
		}

		public string RelatedParentFieldName
		{
			get;
			set;
		}

		public bool LogTiming
		{
			get;
			set;
		}

		public bool LogSoap
		{
			get;
			set;
		}

		public bool Debug
		{
			get;
			set;
		}

		public HeaderInfo LegacyServiceHeaderInfo
		{
			get;
			set;
		}

		public string FirstName
		{
			get;
			set;
		}

		public string MiddleName
		{
			get;
			set;
		}

		public string FamilyName
		{
			get;
			set;
		}

		public string Edipi
		{
			get;
			set;
		}

		public string SocialSecurityNumber
		{
			get;
			set;
		}

		public string BirthDate
		{
			get;
			set;
		}

		public string PhoneNumber
		{
			get;
			set;
		}

		public string PatientSearchIdentifier
		{
			get;
			set;
		}

		public string IdentifierClassCode
		{
			get;
			set;
		}

		public string SearchUse
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

		public bool IsAttended
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

		public string PatientIdentifier
		{
			get;
			set;
		}

		public string BranchOfService
		{
			get;
			set;
		}

		public string FetchMessageProcessType
		{
			get;
			set;
		}

		public string Address
		{
			get;
			set;
		}

		public string POBC
		{
			get;
			set;
		}

		public string POBS
		{
			get;
			set;
		}

		public string MMN
		{
			get;
			set;
		}

		public string Gender
		{
			get;
			set;
		}

		public override string ToString()
		{
			return string.Format("{0}^{1}^{2}^{3}", PatientSearchIdentifier, (!string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL")) ? "NI" : IdentifierType, (!string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL")) ? "200DOD" : AssigningFacility, (!string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL")) ? "USDOD" : AssigningAuthority);
		}
	}
}
