using System;
using System.Runtime.Serialization;
using System.Security;

namespace VEIS.Plugins.Messages
{

    public class PersonSearchRequest : VeisRequest
    {
        [DataMember(EmitDefaultValue = false)]
        public Guid RelatedParentId { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string RelatedParentEntityName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string RelatedParentFieldName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public bool LogTiming { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public bool LogSoap { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public bool Debug { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public HeaderInfo LegacyServiceHeaderInfo { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string FirstName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string MiddleName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string FamilyName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string Edipi { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string SocialSecurityNumber { get; set; }
        //public SecureString SocialSecurityNumber { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string BirthDate { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Gets or sets the search identifier to use when the user clicks a record from search results grid.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string PatientSearchIdentifier { get; set; }

        [DataMember(EmitDefaultValue = false)]
        public string IdentifierClassCode { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string SearchUse { get; set; }

        /// <summary>
        /// NI - National Identifier 
        /// PI - Patient Identifier
        /// EI - Employee Identifier
        /// PN - Patient Number 
        /// SS – Social Security
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string IdentifierType { get; set; }

        /// <summary>
        /// This is the organizationn identifier -- similar to the identifier for UDO, which is "200CMRE"
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string AssigningFacility { get; set; }

        /// <summary>
        /// SSN:USSSA, VA Patient Id:UAVHA, Military: USDOD etc.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string AssigningAuthority { get; set; }

        /// <summary>
        /// Returns the Source ID for the MVI search. Source Id is based on the combination of the
        /// "PatientSearchIdentifier^IdentifierType^AssigningFacility^AssigningAuthority". Not setting
        /// the values for IdentifierType, AssigningFacility and AssigningAuthority returns the DOD Source Id as default.
        /// </summary>
        public override string ToString()
        {
            return string.Format("{0}^{1}^{2}^{3}", PatientSearchIdentifier,
                !string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL") ? "NI" : IdentifierType,
                !string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL") ? "200DOD" : AssigningFacility,
                !string.IsNullOrEmpty(Edipi) || IdentifierClassCode.Equals("MIL") ? "USDOD" : AssigningAuthority);
        }

        [DataMember(EmitDefaultValue = false)]
        public string UserFirstName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string UserLastName { get; set; }

        /// <summary>
        /// Gets or sets whether the search should be treated as an Attended search. This overrides the unattended search functionalities.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public bool IsAttended { get; set; }

        /// <summary>
        /// This is the raw value retrieved from MVI.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string RawValueFromMvi { get; set; }

        /// <summary>
        /// This is the Assigning Authority OID.
        /// Based on MVI SSD, this value is not supported by the VA; however, it could be in the future.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string AuthorityOid { get; set; }

        /// <summary>
        /// This is the EDIPI, SSN, VA ID, etc.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string PatientIdentifier { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string BranchOfService { get; set; }

        [DataMember(EmitDefaultValue = false)]
        public string FetchMessageProcessType { get; set; }

        /* Additional MVI Search Fields */

        /// <summary>
        /// Street, City, State, Zip Code
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string Address { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string POBC { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string POBS { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string MMN { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string Gender { get; set; }

    }
}
