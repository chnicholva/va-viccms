using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
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
