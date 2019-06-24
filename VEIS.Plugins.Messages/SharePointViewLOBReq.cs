using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace VEIS.Plugins.Messages
{
    public class SharePointViewLOBReq : VeisRequest
    {
        [DataMember]
        public string SharepointID { get; set; }
        [DataMember]
        public string SharepointSite { get; set; }
        [DataMember]
        public string SharepointList { get; set; }
        [DataMember]
        public string SharepointListIdTitle { get; set; }

        [DataMember]
        public string SharepointUsername { get; set; }
        [DataMember]
        public string SharepointPassword { get; set; }
    }
}