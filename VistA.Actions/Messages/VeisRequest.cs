using System;
using System.Runtime.Serialization;

namespace VCCM.VistA.Actions.Messages
{
    public class VeisRequest
    {
        [DataMember(EmitDefaultValue = false)]
        public string MessageId { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string OrganizationName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public Guid UserId { get; set; }
    }
}
