using VEIS.Plugins.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{
    [DataContract]
    public class ContactFindCreateResponse
    {
        [DataMember]
        public Guid Id {get; set;}
        [DataMember]
        public bool IsSensitive { get; set; }
        [DataMember]
        public string FullName { get; set; }

    }
}
