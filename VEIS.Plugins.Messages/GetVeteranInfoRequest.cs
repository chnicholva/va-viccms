using System;

namespace MVI_Search.Plugins.Messages
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// Reviewed By Brian Greig - 4/30/15
    /// </remarks>
    
    public class GetVeteranInfoRequest
    {
        public string MessageId { get; set; }

        public string patsr_OrganizationName { get; set; }

        
        public Guid patsr_UserId { get; set; }

        
        public string patsr_SSN { get; set; }
    }
}
