using System;
using System.Runtime.Serialization;

namespace PersonSearch.Plugin.Entities.Person
{
    [DataContract]
	public class MVILog
	{
        [DataMember]
		public string Organization_Name;

        [DataMember]
        public string First;

        [DataMember]
        public string Last;

        [DataMember]
        public string Middle;

        [DataMember]
        public string DOB;

        [DataMember]
        public string SSN;

        [DataMember]
        public string EDIPI;

        [DataMember]
        public string Phone;

        [DataMember]
        public bool Attended;

        [DataMember]
        public string Address;

        [DataMember]
        public string Sex;

        [DataMember]
        public string MMN;

        [DataMember]
        public string POBC;

        [DataMember]
        public string POBS;

        [DataMember]
        public string RequestType;

        [DataMember]
        public string ICN;

        [DataMember]
        public string Source;

        [DataMember]
        public string ClassCode;

        [DataMember]
        public string Type;

        [DataMember]
        public DateTime CreatedOn;

        [DataMember]
        public string SessionId;

        [DataMember]
        public string UserName;

        [DataMember]
        public string IDs;
	}
}
