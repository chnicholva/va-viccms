using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class PrimaryEligibility
	{
        [DataMember]
		public string Type
		{
			get;
			set;
		}
	}
}
