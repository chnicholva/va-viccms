using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Models;

namespace PersonSearch.Plugin.Helpers
{
    public class VeisConfig
    {
        public string AuditUrl { get; set; }
        public string OrgOverride { get; set; }
        public string OrgName { get; set; }
        public bool GetSensitiveInfo { get; set; }
        public string EmployeeEndpoint { get; set; }
        public string SensitiveEndpoint { get; set; }
        public bool EnableAuditing { get; set; }
        public bool LogTimer { get; set; }
        public bool LogSoap { get; set; }
        public string UserSensLevel { get; set; }
        public string UserName { get; set; }
        public Guid UserId { get; set; }
        public string StationNumber { get; set; }
        public string CssName { get; set; }
        public VeisConfiguration VeisConfiguration { get; set; }
    }
}