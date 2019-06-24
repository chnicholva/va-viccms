using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace VEIS.Plugins.Messages
{
    public class SharePointViewLOBRes
    {
        [DataMember]
        public string FileStream { get; set; }
    }
}