using System;
using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
    public class MVILog2
	{
        [DataMember]
        public string Organization_Name;

        [DataMember]
        public string DOB;

        [DataMember]
        public string SSN;

        [DataMember]
        public string EDIPI;

        [DataMember]
        public string Phone;

        [DataMember]
        public string ICN;

        [DataMember]
        public string IDs;

        [DataMember]
        public DateTime CreatedOn;

        [DataMember]
        public string SessionId;

        [DataMember]
        public string UserName;

        [DataMember]
        public string RequestType;
	}
}
