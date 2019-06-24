using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Helpers
{
    public static class PatientAddressExtensions
    {
        public static AttributeCollection Map(this PatientAddress patientAddress)
        {
            AttributeCollection attrCol = new AttributeCollection();
            if (patientAddress.StreetAddressLine != "" && patientAddress.State != "" && patientAddress.City != "" && patientAddress.State != "" && patientAddress.PostalCode != "")
                attrCol.Add("crme_fulladdress", patientAddress.StreetAddressLine + " " + patientAddress.City + " " + patientAddress.State + " " + patientAddress.PostalCode);

            attrCol.Add("crme_address1", patientAddress.StreetAddressLine);
            attrCol.Add("crme_city", patientAddress.City);
            attrCol.Add("crme_addressstate", patientAddress.State);
            attrCol.Add("crme_addresszip", patientAddress.PostalCode);

            return attrCol;
        }
    }
}
