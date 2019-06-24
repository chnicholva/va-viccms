using System;

namespace PersonSearch.Plugin.Messages
{
	public class SelectedPersonRequest
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

		public bool noAddPerson
		{
			get;
			set;
		}

		public bool Debug
		{
			get;
			set;
		}

		public bool Debugnothing
		{
			get;
			set;
		}

		public HeaderInfo LegacyServiceHeaderInfo
		{
			get;
			set;
		}

		public string PatientSearchIdentifier
		{
			get;
			set;
		}

		public string ICN
		{
			get;
			set;
		}

		public string IdentifierClassCode
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

		public string FullAddress
		{
			get;
			set;
		}

		public string FullName
		{
			get;
			set;
		}

		public string DateofBirth
		{
			get;
			set;
		}

		public string RawValueFromMvi
		{
			get;
			set;
		}

		public string RecordSource
		{
			get;
			set;
		}

		public string SocialSecurityNumber
		{
			get;
			set;
		}

		public string FileNumber
		{
			get;
			set;
		}

		public string Edipi
		{
			get;
			set;
		}

		public long participantID
		{
			get;
			set;
		}

		public int VeteranSensitivityLevel
		{
			get;
			set;
		}

		public string FetchMessageProcessType
		{
			get;
			set;
		}

		public override string ToString()
		{
			return string.Format("{0}^{1}^{2}^{3}", PatientSearchIdentifier, string.IsNullOrEmpty(IdentifierType) ? "NI" : IdentifierType, string.IsNullOrEmpty(AssigningFacility) ? "200DOD" : AssigningFacility, string.IsNullOrEmpty(AssigningAuthority) ? "USDOD" : AssigningAuthority);
		}
	}
}
