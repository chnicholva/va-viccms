using System.Runtime.Serialization;


namespace VEIS.Plugins.Messages
{
    public class NonVetRequest
    {
        [DataMember]
        public string ClientName { get; set; }
        [DataMember]
        public string Format { get; set; }
        [DataMember]
        public string[] NationalIds { get; set; }
    }
}
