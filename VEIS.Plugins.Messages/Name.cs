using System;

namespace VEIS.Plugins.Messages
{
    public class Name
    {
        public string GivenName { get; set; }
        public string FamilyName { get; set; }
        public string MiddleName { get; set; }
        public string NamePrefix { get; set; }
        public string NameSuffix { get; set; }

        /// <summary>
        /// Legal, Alias, Maiden
        /// </summary>
        /// 
        public string NameType { get; set; }
    }
}
