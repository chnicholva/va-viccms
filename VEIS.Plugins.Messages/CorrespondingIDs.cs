using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{
    public class CorrespondingIDs
    {
        /// <summary>
        /// This is the EDIPI, SSN, VA ID, etc.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string PatientIdentifier { get; set; }

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
        /// If the search is with SSN, the authority is SSA, if it's with the VA then the value is VHA, etc.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string AssigningAuthority { get; set; }

        public override string ToString()
        {
            return string.Format("{0}^{1}^{2}^{3}", PatientIdentifier, IdentifierType, AssigningFacility,
                AssigningAuthority);
        }

        /// <summary>
        /// This is the raw value retrieved from MVI.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string RawValueFromMvi { get; set; }

        /// <summary>
        /// Value of the patsr_facility from CRM after mapping
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public Guid FacilityId { get; set; }
        
        /// <summary>
        /// Value of the patsr_name from CRM after mapping
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string FacilityName { get; set; }
    }
}
