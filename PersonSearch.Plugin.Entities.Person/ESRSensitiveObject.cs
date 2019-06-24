using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class ESRSensitiveObject
	{
        [DataMember]
		public bool ErrorOccurred
		{
			get;
			set;
		}

        [DataMember]
        public object ErrorMessage
		{
			get;
			set;
		}

        [DataMember]
        public object Status
		{
			get;
			set;
		}

        [DataMember]
        public object DebugInfo
		{
			get;
			set;
		}

        [DataMember]
        public Data Data
		{
			get;
			set;
		}
	}
}
