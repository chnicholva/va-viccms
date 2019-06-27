using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Models
{
    public class VEISVASTRefreshFacility
    {
        public readonly static string CrmEntityName;

        public readonly static string CrmPrimaryIdentiferFieldName;

        public readonly static string CrmPrimaryAttributeName;

        public readonly static string FullStationNameFieldName;

        public readonly static string CommonStationNameFieldName;

        public readonly static string StationNumberFieldName;

        public readonly static string VISNLookupFieldName;

        public readonly static string CoCClasificationFieldName;

        public readonly static string StationIDFieldName;

        public readonly static string LastUpdatedFieldName;

        public static ColumnSet CrmColumns;

        public string CoCClassification { get; set; }
        public string CommonStationName { get; set; }
        public string CRMDisplayname { get; set; }
        public string StationID { get; set; }
        public string StationName { get; set; }
        public string StationNumber { get; set; }
        public string VisnID { get; set; }
        static VEISVASTRefreshFacility()
        {
            VEISVASTRefreshFacility.CrmEntityName = "ftp_facility";
            VEISVASTRefreshFacility.CrmPrimaryIdentiferFieldName = "ftp_facilityid";
            VEISVASTRefreshFacility.CrmPrimaryAttributeName = "ftp_name";
            VEISVASTRefreshFacility.FullStationNameFieldName = "ftp_name";
            VEISVASTRefreshFacility.CommonStationNameFieldName = "ftp_commonstationname";
            VEISVASTRefreshFacility.StationNumberFieldName = "ftp_facilitycode";
            VEISVASTRefreshFacility.VISNLookupFieldName = "ftp_visnid";
            VEISVASTRefreshFacility.CoCClasificationFieldName = "ftp_cocclassification_text";
            VEISVASTRefreshFacility.StationIDFieldName = "ftp_vaststationid_text";
            VEISVASTRefreshFacility.LastUpdatedFieldName = "ftp_lastupdatedfromvaston";
            string[] crmPrimaryAttributeName = new string[] { VEISVASTRefreshFacility.CrmPrimaryAttributeName, VEISVASTRefreshFacility.FullStationNameFieldName, VEISVASTRefreshFacility.CommonStationNameFieldName, VEISVASTRefreshFacility.StationNumberFieldName, VEISVASTRefreshFacility.VISNLookupFieldName, VEISVASTRefreshFacility.CoCClasificationFieldName, VEISVASTRefreshFacility.StationIDFieldName };
            VEISVASTRefreshFacility.CrmColumns = new ColumnSet(crmPrimaryAttributeName);
        }

        public VEISVASTRefreshFacility(VASTStation stationFromVAST)
        {
            this.StationID = stationFromVAST.StationID.Trim();
            this.VisnID = stationFromVAST.VisnID.Trim();
            this.StationNumber = stationFromVAST.StationNumber.Trim();
            this.StationName = stationFromVAST.StationName.Trim();
            this.CommonStationName = stationFromVAST.CommonStationName.Trim();
            this.CoCClassification = stationFromVAST.CocClassification.Trim();
            this.CRMDisplayname = string.Concat(stationFromVAST.StationNumber.Trim(), " - ", stationFromVAST.CommonStationName.Trim());
        }

        public Entity MapToCRMRecord(Guid recordId, Dictionary<string, Entity> visnDictionary)
        {
            Entity entity = new Entity("ftp_facility");
            entity.Id = recordId;
            entity[VEISVASTRefreshFacility.CrmPrimaryAttributeName] = this.CRMDisplayname;
            entity[VEISVASTRefreshFacility.StationIDFieldName] = this.StationID;
            int stationNumber;
            if (Int32.TryParse(this.StationNumber, out stationNumber))
            {
                entity[VEISVASTRefreshFacility.StationNumberFieldName] = stationNumber;
            }
            entity[VEISVASTRefreshFacility.CommonStationNameFieldName] = this.CommonStationName;
            entity[VEISVASTRefreshFacility.FullStationNameFieldName] = this.StationName;
            entity[VEISVASTRefreshFacility.CoCClasificationFieldName] = this.CoCClassification;
            entity[VEISVASTRefreshFacility.LastUpdatedFieldName] = DateTime.Now;
            KeyValuePair<string, Entity> keyValuePair = visnDictionary.FirstOrDefault<KeyValuePair<string, Entity>>((KeyValuePair<string, Entity> entry) => entry.Key == this.VisnID);
            Entity value = keyValuePair.Value;
            if (value != null)
            {
                entity[VEISVASTRefreshFacility.VISNLookupFieldName] = value.ToEntityReference();
            }
            return entity;
        }

        public bool MatchesCRMRecord(Entity record)
        {
            return (!record.Contains(VEISVASTRefreshFacility.StationIDFieldName) ||
                !(record[VEISVASTRefreshFacility.StationIDFieldName].ToString() == this.StationID) ||
                !record.Contains(VEISVASTRefreshFacility.StationNumberFieldName) ||
                !(record[VEISVASTRefreshFacility.StationNumberFieldName].ToString() == this.StationNumber) ||
                !record.Contains(VEISVASTRefreshFacility.CommonStationNameFieldName) ||
                !((string)record[VEISVASTRefreshFacility.CommonStationNameFieldName] == this.CommonStationName) ||
                !record.Contains(VEISVASTRefreshFacility.CrmPrimaryAttributeName) ||
                !((string)record[VEISVASTRefreshFacility.CrmPrimaryAttributeName] == this.CRMDisplayname) ||
                !record.Contains(VEISVASTRefreshFacility.FullStationNameFieldName) ||
                !((string)record[VEISVASTRefreshFacility.FullStationNameFieldName] == this.StationName) ||
                !record.Contains(VEISVASTRefreshFacility.VISNLookupFieldName) ||
                !(((EntityReference)record[VEISVASTRefreshFacility.VISNLookupFieldName]).Name == this.VisnID) ||
                !record.Contains(VEISVASTRefreshFacility.CoCClasificationFieldName) ? false : (string)record[VEISVASTRefreshFacility.CoCClasificationFieldName] == this.CoCClassification);
        }
    }
}