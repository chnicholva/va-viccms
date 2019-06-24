using System;

namespace VEIS.Plugins.Messages
{
    public class PersonSearchResponse
    {
        public string MessageId { get; set; }
        public PatientPerson[] Person { get; set; }       
        public bool ExceptionOccured { get; set; }
        public string Message { get; set; }
        public Acknowledgement Acknowledgement { get; set; }
        public QueryAcknowledgement QueryAcknowledgement { get; set; }
        public string OrganizationName { get; set; }
        public string ExceptionMessage { get; set; }
        public string CORPDbMessage { get; set; }
        public int MVIRecordCount { get; set; }
        public int CORPDbRecordCount { get; set; }
        public string UDOMessage { get; set; }
    }

    public class Acknowledgement
    {
        public string TypeCode { get; set; }
        public string TargetMessage { get; set; }
        public AcknowledgementDetail[] AcknowledgementDetails { get; set; }
    }

    public class AcknowledgementDetail
    {
        public DetailCode Code { get; set; }
        public string Text { get; set; }
    }

    public class DetailCode
    {
        public string CodeSystemName { get; set; }
        public string Code { get; set; }
        public string DisplayName { get; set; }
    }

    public class QueryAcknowledgement
    {
        public string QueryResponseCode { get; set; }
        public string ResultCurrentQuantity { get; set; }
    }

}
