using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VEIS.Plugins.Messages
{
    public class MVISearchResponse
    {
        public bool BoolValue { get; set; }
        public string StringValue { get; set; }
        public string StringValue2 { get; set; }
        public string StringValue3 { get; set; }
        public string StringValue4 { get; set; }
        public string StringValue5 { get; set; }
        public bool ExceptionOccurred { get; set; }
        public object ExceptionMessage { get; set; }
        public object SerializedSOAPRequest { get; set; }
        public object SerializedSOAPResponse { get; set; }
        public int ProcessorTimer { get; set; }
        public int ServiceTimer { get; set; }
        public string CorrelationId { get; set; }
        public string EcTraceLog { get; set; }
        public string MessageId { get; set; }
    }
}
