using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class EnrollmentDeterminationInfo
	{
        [DataMember]
        public PrimaryEligibility PrimaryEligibility
		{
			get;
			set;
		}

        [DataMember]
        public string Veteran
		{
			get;
			set;
		}
	}
}
