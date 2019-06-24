using System;
using System.Text;

namespace VEIS.Plugins.Messages
{

    public class CorrespondingIdsResponse
    {
        public string MessageId { get; set; }
        public CorrespondingIDs[] CorrespondingIdList { get; set; }

        public bool ExceptionOccured { get; set; }
        public string Message { get; set; }
        public string RawMviExceptionMessage { get; set; }
        public string OrganizationName { get; set; }
        public string Url { get; set; }
        private byte[] _ssnBytes;
        
        public string SocialSecurityNumber
        {
            get { return _ssnBytes == null ? "" : Encoding.UTF8.GetString(_ssnBytes); }
            set
            {
                if (value == null)
                    _ssnBytes = null;
                else
                    _ssnBytes = Encoding.UTF8.GetBytes(value);
            }
        }

        public string Edipi { get; set; }
        public string ParticipantId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string FamilyName { get; set; }
        public Guid UserId { get; set; }
        public string FullAddress { get; set; }
        public string FullName { get; set; }
        public string DateofBirth { get; set; }
        public string PhoneNumber { get; set; }
    }
}
