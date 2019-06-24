using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Security;

namespace VEIS.Plugins.Messages
{
    public class PatientPerson
    {
        /// <summary>
        /// Gets or sets the identify value for the patient. This could be SSN, EDIPI or some other identifier.
        /// </summary>
        public string Identifier { get; set; }
        public string IdentifierType { get; set; }
        public string SocialSecurityNumber { get; set; }
        //public SecureString SocialSecurityNumber { get; set; }
        public string FileNumber { get; set; }
        public string EdiPi { get; set; }
        public string ParticipantId { get; set; }
        public string PhoneNumber { get; set; }
        public string BranchOfService { get; set; }
        public string VeteranSensitivityLevel { get; set; }
        public string GenderCode { get; set; }
        public string BirthDate { get; set; }
        public string StatusCode { get; set; }
        public string IsDeceased { get; set; }
        public string DeceasedDate { get; set; }
        public string IdentifyTheft { get; set; }
        public PatientAddress Address { get; set; }
        public Name[] NameList { get; set; }
        public CorrespondingIDs[] CorrespondingIdList { get; set; }
        public string RecordSource { get; set; }
        public string Url { get; set; }

        public string FullName
        {
            get
            {
                const string nameFormat = "{0} {1}";

                if (NameList != null && NameList.Any())
                {
                    return string.Format(nameFormat, NameList[0].GivenName, NameList[0].FamilyName);
                }

                return string.Empty;
            }
        }

        public string FullAddress
        {
            get
            {
                if (Address == null) return string.Empty;

                const string addressFormat = "{0} {1} {2} {3}";
                object[] addressArrary =
                {
                    Address.StreetAddressLine, Address.City, Address.State, Address.PostalCode
                };
                var address = string.Format(addressFormat, addressArrary);

                return address;
            }
        }


    }
}
