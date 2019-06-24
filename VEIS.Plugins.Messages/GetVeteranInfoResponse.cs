using System;

namespace MVI_Search.Plugins.Messages
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// Reviewed By Brian Greig - 4/30/15
    /// </remarks>
   
    public class GetVeteranInfoResponse 
    {
        
        public GetVeteranInfoMultipleResponse[] GetVeteranInfo { get; set; }
        
        public string RecordSource { get; set; }
        
        public string ErrorMessage { get; set; }
        
        public bool ExceptionOccured { get; set; }

    }
   
    public class GetVeteranInfoMultipleResponse 
    {
        
        public string patsr_VeteranSensitivityLevel { get; set; }
        
        public string patsr_BranchOfService { get; set; }
        
        public string patsr_ZIP { get; set; }
        
        public string patsr_VAFileNumber { get; set; }
        
        public string patsr_StoredSSN { get; set; }
        
        public string patsr_State { get; set; }
        
        public string patsr_SSN { get; set; }
        
        public string patsr_SecondaryPhone { get; set; }
        
        public string patsr_PrimaryPhone { get; set; }
        
        public string patsr_ParticipantID { get; set; }
        
        public string patsr_MiddleName { get; set; }
        
        public string patsr_LastName { get; set; }
        
        public string patsr_FirstName { get; set; }
        
        public string patsr_Email { get; set; }
        
        public string patsr_EDIP { get; set; }
        
        public string patsr_DOBString { get; set; }
        
        public bool patsr_DataFromApplication { get; set; }
        
        public string patsr_Country { get; set; }
        
        public string patsr_City { get; set; }
        
        public string patsr_Address3 { get; set; }
        
        public string patsr_Address2 { get; set; }
        
        public string patsr_Address1 { get; set; }
        
        public string patsr_AddressType { get; set; }
        
        public string patsr_AllowPOAAccess { get; set; }
        
        public string patsr_AllowPOACADD { get; set; }
        
        public string patsr_beneficiarydateofbirth { get; set; }
        
        public string patsr_DayTimeAreaCode { get; set; }
        
        public string patsr_NightTimeAreaCode { get; set; }
        
        public string patsr_ZipPlus4 { get; set; }
        
        public string patsr_SuffixName { get; set; }
        
        public string patsr_Title { get; set; }
    }
}
