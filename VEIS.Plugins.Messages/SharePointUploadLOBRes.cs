using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace VEIS.Plugins.Messages
{
    public class SharePointUploadLOBRes
    {
        [DataMember]
        public string FilePath { get; set; }
        [DataMember]
        public string SharepointID { get; set; }
        [DataMember]
        public bool ExceptionOccurred { get; set; }
        [DataMember]
        public string ExceptionMessage { get; set; }

    }
}