using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class SensitivityInfo
	{
        [DataMember]
        public string SensityFlag
		{
			get;
			set;
		}
	}
}
