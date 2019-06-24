using System.Linq;

namespace PersonSearch.Plugin.Messages
{
	public class PatientPerson
	{
		public string Identifier
		{
			get;
			set;
		}

		public string IdentifierType
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

		public string EdiPi
		{
			get;
			set;
		}

		public string ParticipantId
		{
			get;
			set;
		}

		public string PhoneNumber
		{
			get;
			set;
		}

		public string BranchOfService
		{
			get;
			set;
		}

		public string VeteranSensitivityLevel
		{
			get;
			set;
		}

		public string GenderCode
		{
			get;
			set;
		}

		public string BirthDate
		{
			get;
			set;
		}

		public string StatusCode
		{
			get;
			set;
		}

		public string IsDeceased
		{
			get;
			set;
		}

		public string DeceasedDate
		{
			get;
			set;
		}

		public string IdentifyTheft
		{
			get;
			set;
		}

		public PatientAddress Address
		{
			get;
			set;
		}

		public Name[] NameList
		{
			get;
			set;
		}

		public CorrespondingIDs[] CorrespondingIdList
		{
			get;
			set;
		}

		public string RecordSource
		{
			get;
			set;
		}

		public string Url
		{
			get;
			set;
		}

		public string FullName
		{
			get
			{
				if (NameList != null && NameList.Any())
				{
					return $"{NameList[0].GivenName} {NameList[0].FamilyName}";
				}
				return string.Empty;
			}
		}

		public string FullAddress
		{
			get
			{
				if (Address == null)
				{
					return string.Empty;
				}
				object[] args = new object[4]
				{
					Address.StreetAddressLine,
					Address.City,
					Address.State,
					Address.PostalCode
				};
				return string.Format("{0} {1} {2} {3}", args);
			}
		}
	}
}
