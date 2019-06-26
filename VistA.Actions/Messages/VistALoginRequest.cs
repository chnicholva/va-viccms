using System.Runtime.Serialization;

namespace VCCM.VistA.Actions.Messages
{
    public class VistALoginRequest
    {
        [DataMember]
        public string AccessCode { get; set; }
        [DataMember]
        public string VerifyCode { get; set; }
        [DataMember]
        public string SiteId { get; set; }
        [DataMember]
        public string Target { get; set; }

    }
}
