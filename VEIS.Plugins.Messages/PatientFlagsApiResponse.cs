using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{
    public class PatientFlagsApiResponse
    {
        public bool ErrorOccurred { get; set; }
        public string ErrorMessage { get; set; }
        public string Status { get; set; }
        public string DebugInfo { get; set; }
        public Remark[] Data { get; set; }
    }

    public class Remark
    {
        public string ApprovedByCode { get; set; }
        public string ApprovedByName { get; set; }
        public string Assigned { get; set; }
        public string Category { get; set; }
        public string Content { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string OrigSiteCode { get; set; }
        public string OrigSiteName { get; set; }
        public string OwnSiteCode { get; set; }
        public string OwnSiteName { get; set; }
        public string ReviewDue { get; set; }
        public string Type { get; set; }
    }
}

