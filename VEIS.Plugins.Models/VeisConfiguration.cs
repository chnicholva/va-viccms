namespace VEIS.Plugins.Models
{
    public class VeisConfiguration
    {
        public CRMAuthTokenConfiguration CRMAuthInfo { get; set; }
        public VEISSvcLOBConfiguration SvcConfigInfo { get;set;}
        public string VASTRefreshFacilityAPI { get; set; }
    }
}
