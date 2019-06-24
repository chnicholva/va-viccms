using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Models
{
    public class VEISVASTRefreshSubFacility
    {
        public readonly static string CrmEntityName;

        public readonly static string PrimaryIdentiferFieldName;

        public readonly static string CrmPrimaryAttributeName;

        public readonly static string FullStationNameFieldName;

        public readonly static string CommonStationNameFieldName;

        public readonly static string StationNumberFieldName;

        public readonly static string ParentFacilityLookupFieldName;

        public readonly static string DefaultFacilityFlagFieldName;

        public readonly static string CoCClasificationFieldName;

        public readonly static string StationIDFieldName;

        public readonly static string LastUpdatedFieldName;

        public static ColumnSet CrmColumns;

        public string CoCClassification { get; set; }
        public string CommonStationName { get; set; }
        public string CRMDisplayname { get; set; }
        public bool CRMFacilityDefaultFlag { get; set; }
        public Entity ParentFacilityRecord { get; set; }
        public string ParentStationID { get; set; }
        public string ParentStationNumber { get; set; }
        public string StationID { get; set; }
        public string StationName { get; set; }
        public string StationNumber { get; set; }
        public string VisnID { get; set; }
        static VEISVASTRefreshSubFacility()
        {
            VEISVASTRefreshSubFacility.CrmEntityName = "patsr_subfacility";
            VEISVASTRefreshSubFacility.PrimaryIdentiferFieldName = "patsr_subfacilityid";
            VEISVASTRefreshSubFacility.CrmPrimaryAttributeName = "patsr_name";
            VEISVASTRefreshSubFacility.FullStationNameFieldName = "patsr_name";
            VEISVASTRefreshSubFacility.CommonStationNameFieldName = "patsr_commonstationname";
            VEISVASTRefreshSubFacility.StationNumberFieldName = "patsr_facilitycode";
            VEISVASTRefreshSubFacility.ParentFacilityLookupFieldName = "patsr_facility";
            VEISVASTRefreshSubFacility.DefaultFacilityFlagFieldName = "patsr_facilitydefaultflag";
            VEISVASTRefreshSubFacility.CoCClasificationFieldName = "patsr_cocclassisfication";
            VEISVASTRefreshSubFacility.StationIDFieldName = "patsr_vaststationid";
            VEISVASTRefreshSubFacility.LastUpdatedFieldName = "patsr_lastupdatedfromvaston";
            string[] crmPrimaryAttributeName = new string[] { VEISVASTRefreshSubFacility.CrmPrimaryAttributeName, VEISVASTRefreshSubFacility.FullStationNameFieldName, VEISVASTRefreshSubFacility.CommonStationNameFieldName, VEISVASTRefreshSubFacility.StationNumberFieldName, VEISVASTRefreshSubFacility.ParentFacilityLookupFieldName, VEISVASTRefreshSubFacility.DefaultFacilityFlagFieldName, VEISVASTRefreshSubFacility.CoCClasificationFieldName, VEISVASTRefreshSubFacility.StationIDFieldName };
            VEISVASTRefreshSubFacility.CrmColumns = new ColumnSet(crmPrimaryAttributeName);
        }

        public VEISVASTRefreshSubFacility(VASTStation stationFromVAST, Dictionary<VASTStation, Entity> parentFacilityDictionary)
        {
            this.StationID = stationFromVAST.StationID.Trim();
            this.VisnID = stationFromVAST.VisnID.Trim();
            this.StationNumber = stationFromVAST.StationNumber.Trim();
            this.StationName = stationFromVAST.StationName.Trim();
            this.CommonStationName = stationFromVAST.CommonStationName.Trim();
            this.CoCClassification = stationFromVAST.CocClassification.Trim();
            this.CRMDisplayname = string.Concat(stationFromVAST.StationNumber.Trim(), " - ", stationFromVAST.CommonStationName.Trim());
            this.CRMFacilityDefaultFlag = stationFromVAST.IsATopLevelStation;
            KeyValuePair<VASTStation, Entity> keyValuePair = parentFacilityDictionary.FirstOrDefault<KeyValuePair<VASTStation, Entity>>((KeyValuePair<VASTStation, Entity> entry) => (stationFromVAST.IsATopLevelStation ? entry.Key.StationID == stationFromVAST.StationID : entry.Key.StationID == stationFromVAST.ParentStation.StationID));
            this.ParentFacilityRecord = keyValuePair.Value;
        }

        public Entity MapToCRMRecord(Guid recordId, Dictionary<VASTStation, Entity> parentFacilityDictionary)
        {
            Entity entity = new Entity("patsr_subfacility");
            entity.Id = recordId;
            entity[VEISVASTRefreshSubFacility.StationIDFieldName] = this.StationID;
            entity[VEISVASTRefreshSubFacility.StationNumberFieldName] = this.StationNumber;
            entity[VEISVASTRefreshSubFacility.CommonStationNameFieldName] = this.CommonStationName;
            entity[VEISVASTRefreshSubFacility.CrmPrimaryAttributeName] = this.CRMDisplayname;
            entity[VEISVASTRefreshSubFacility.FullStationNameFieldName] = this.StationName;
            entity[VEISVASTRefreshSubFacility.CoCClasificationFieldName] = this.CoCClassification;
            entity[VEISVASTRefreshSubFacility.DefaultFacilityFlagFieldName] = this.CRMFacilityDefaultFlag;
            entity[VEISVASTRefreshSubFacility.LastUpdatedFieldName] = DateTime.Now;
            if (this.ParentFacilityRecord != null)
            {
                entity[VEISVASTRefreshSubFacility.ParentFacilityLookupFieldName] = this.ParentFacilityRecord.ToEntityReference();
            }
            return entity;
        }

        public bool MatchesCRMRecord(Entity record)
        {
            EntityReference item;
            bool flag = (!record.Contains(VEISVASTRefreshSubFacility.StationIDFieldName) ? false : (string)record[VEISVASTRefreshSubFacility.StationIDFieldName] == this.StationID);
            bool flag1 = (!record.Contains(VEISVASTRefreshSubFacility.StationNumberFieldName) ? false : (string)record[VEISVASTRefreshSubFacility.StationNumberFieldName] == this.StationNumber);
            bool flag2 = (!record.Contains(VEISVASTRefreshSubFacility.CommonStationNameFieldName) ? false : (string)record[VEISVASTRefreshSubFacility.CommonStationNameFieldName] == this.CommonStationName);
            bool flag3 = (!record.Contains(VEISVASTRefreshSubFacility.CrmPrimaryAttributeName) ? false : (string)record[VEISVASTRefreshSubFacility.CrmPrimaryAttributeName] == this.CRMDisplayname);
            bool flag4 = (!record.Contains(VEISVASTRefreshSubFacility.FullStationNameFieldName) ? false : (string)record[VEISVASTRefreshSubFacility.FullStationNameFieldName] == this.StationName);
            bool flag5 = (!record.Contains(VEISVASTRefreshSubFacility.CoCClasificationFieldName) ? false : (string)record[VEISVASTRefreshSubFacility.CoCClasificationFieldName] == this.CoCClassification);
            bool flag6 = (!record.Contains(VEISVASTRefreshSubFacility.DefaultFacilityFlagFieldName) ? false : (bool)record[VEISVASTRefreshSubFacility.DefaultFacilityFlagFieldName] == this.CRMFacilityDefaultFlag);
            bool parentFacilityRecord = false;
            if (record.Contains(VEISVASTRefreshSubFacility.ParentFacilityLookupFieldName))
            {
                item = (EntityReference)record[VEISVASTRefreshSubFacility.ParentFacilityLookupFieldName];
            }
            else
            {
                item = null;
            }
            EntityReference entityReference = item;
            if (entityReference == null)
            {
                parentFacilityRecord = this.ParentFacilityRecord == null;
            }
            else
            {
                parentFacilityRecord = (this.ParentFacilityRecord == null ? false : this.ParentFacilityRecord.Id == entityReference.Id);
            }
            return (!flag || !flag1 || !flag2 || !flag3 || !flag4 || !flag5 || !flag6 ? false : parentFacilityRecord);
        }
    }
}