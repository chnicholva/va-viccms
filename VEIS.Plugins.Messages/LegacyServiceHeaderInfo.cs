using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{ 
    public class LegacyServiceHeaderInfo
    {
        public string StationNumber { get; set; }
        public string LoginName { get; set; }
        public string ApplicationName { get; set; }
        public string ClientMachine { get; set; }
    }
}
