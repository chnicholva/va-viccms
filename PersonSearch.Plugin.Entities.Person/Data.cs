using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
	public class Data
	{
        [DataMember]
		public SensitivityInfo SensitivityInfo
		{
			get;
			set;
		}

        [DataMember]
        public EnrollmentDeterminationInfo EnrollmentDeterminationInfo
		{
			get;
			set;
		}

        [DataMember]
        public Demographics Demographics
		{
			get;
			set;
		}
	}
}
