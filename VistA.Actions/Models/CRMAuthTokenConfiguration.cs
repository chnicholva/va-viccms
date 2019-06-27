using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VCCM.VistA.Actions.Models
{
    public class CRMAuthTokenConfiguration
    {

        public string ClientApplicationId { get; set; }
        public string ClientSecret { get; set; }
        public string TenantId { get; set; }
        public string ResourceId { get; set; }
    }
}
