using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{
    public class NonVetResponse
    {
        public bool ErrorOccurred { get; set; }
        public string ErrorMessage { get; set; }
        public string Status { get; set; }
        public object DebugInfo { get; set; }
        public NVDatum[] Data { get; set; }
    }

    public class NVDatum
    {
        public string NationalId { get; set; }
        public string Veteran { get; set; }
        public string NewPersonIndicator { get; set; }
        public string PrimaryEligibilityCode { get; set; }
    }

}
