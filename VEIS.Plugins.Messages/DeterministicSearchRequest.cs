using System;

namespace VEIS.Plugins.Messages
{

    public class DeterministicSearchRequest : VeisRequest
    {
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string BirthDate { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string EdiPi { get; set; }
        public DeterministicSearchType SearchType { get; set; }
    }

    public enum DeterministicSearchType
    {
        Edipi,
        SocialSecurity
    }
}

