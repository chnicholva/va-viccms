using System;
using System.Runtime.Serialization;
using System.Security;

namespace VEIS.Plugins.Messages
{

    public class SelectedPersonRequest : VeisRequest
    {
        [DataMember(EmitDefaultValue = false)]
        public Guid CorrelationId { get; set; }
        
        [DataMember(EmitDefaultValue = false)]
        public bool LogTiming { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public bool LogSoap { get; set; }
        
        /// <summary>
        /// Gets or sets the search identifier to use when the user clicks a record from search results grid.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string PatientSearchIdentifier { get; set; }


        /// <summary>
        /// If the search is with SSN, the authority is SSA, if it's with the VA then the value is VHA, etc.
        /// </summary>
        [DataMember(EmitDefaultValue = false)]
        public string AssigningAuthority { get; set; }

        [DataMember(EmitDefaultValue = false)]
        public string UserFirstName { get; set; }
        [DataMember(EmitDefaultValue = false)]
        public string UserLastName { get; set; }
        

        [DataMember(EmitDefaultValue = false)]
        public string RecordSource { get; set; }

    }
}
