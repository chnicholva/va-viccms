using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class Demographics
	{
        [DataMember]
        public string PreferredFacility
		{
			get;
			set;
		}
	}
}
