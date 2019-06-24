using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Models
{
    [DataContract]
    public class Person
    {
        [DataMember]
        public Guid Id { get; set; }

        [DataMember]
        public string FirstName { get; set; }
        [DataMember]
        public string MiddleName { get; set; }
        [DataMember]
        public string LastName { get; set; }
        [DataMember]
        public string FullName { get; set; }
        [DataMember]
        public bool ExceptionOccured { get; set; }
        [DataMember]
        public string ExceptionMessage { get; set; }
        [DataMember]
        public string ReturnMessage { get; set; }
        [DataMember]
        public Guid personId { get; set; }
        [DataMember]
        public string PatientMviIdentifier { get; set; }
        [DataMember]
        public string ICN { get; set; }
        [DataMember]
        public string FileNumber { get; set; }
        [DataMember]
        public string ParticipantID { get; set; }
        [DataMember]
        public string VeteranSensitivityLevel { get; set; }
        [DataMember]
        public string EDIPI { get; set; }

        [DataMember]
        public string FullAddress { get; set; }
        [DataMember]
        public string StreetAddressLine { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string State { get; set; }
        [DataMember]
        public string PostalCode { get; set; }
        [DataMember]
        public string BranchOfService { get; set; }
        [DataMember]
        public string PrimaryPhone { get; set; }
        [DataMember]
        public string RecordSource { get; set; }
        [DataMember]
        public string Gender { get; set; }
        [DataMember]
        public string DeceasedDate { get; set; }
        [DataMember]
        public string IdentityTheft { get; set; }
        [DataMember]
        public string url { get; set; }
        [DataMember]
        public string DOBString { get; set; }
        [DataMember]
        public string ClassCode { get; set; }
        [DataMember]
        public bool IsAttended { get; set; }
        [DataMember]
        public string MMN { get; set; }
        [DataMember]
        public string POBC { get; set; }
        [DataMember]
        public string POBS { get; set; }
        [DataMember]
        public string SearchType { get; set; }
        [DataMember]
        public string VetNumber { get; set; }
        [DataMember]
        public string MVIDOBString { get; set; }
        [DataMember]
        public string SiteName { get; set; }
        [DataMember]
        public string Alias { get; set; }
        [DataMember]
        public string PatientId { get; set; }
        [DataMember]
        public string SiteId { get; set; }
        [DataMember]
        public string PreferredFacility { get; set; }
        [DataMember]
        public Facility[] Facilities { get; set; }
        [DataMember]
        public string IdentifierType { get; set; }
        [DataMember]
        public string IdentifierAssigningFacility { get; set; }
        [DataMember]
        public string IdentifierAssigningAuthority { get; set; }
        [DataMember]
        public string VHAVeteranEmployeeFlags { get; set; }
        [DataMember]
        public string SensitivityLevelVHA { get; set; }

    }
}
