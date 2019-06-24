using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace VEIS.Plugins.Messages
{
    public class SharePointRemoveLOBRes
    {
        [DataMember]
        public bool Success { get; set; }
    }
}