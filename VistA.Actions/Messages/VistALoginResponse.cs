using System.Runtime.Serialization;

namespace VCCM.VistA.Actions.Messages
{
    public class VistALoginResponse
    {
        [DataMember]
        public bool ErrorOccurred { get; set; }
        [DataMember]
        public string ErrorMessage { get; set; }

        [DataMember]
        public LoginData[] Data { get; set; }
        public string Status { get; set; }
        public string DebugInfo { get; set; }
    }

    public class LoginData
    {
        [DataMember]
        public string Duz { get; set; }
        [DataMember]
        public string Ssn { get; set; }
        [DataMember]
        public string Greetings { get; set; }
        [DataMember]
        public string LoginSiteCode { get; set; }
        [DataMember]
        public string ProviderName { get; set; }
        [DataMember]
        public string VistaDUZ { get; set; }
        [DataMember]
        public LoginFault Fault { get; set; }
    }

    public class LoginFault
    {
        [DataMember]
        public string Message { get; set; }
    }
}
