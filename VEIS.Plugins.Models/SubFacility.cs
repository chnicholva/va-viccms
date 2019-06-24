using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Models
{
	public class SubFacility
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
		static SubFacility()
		{
			SubFacility.CrmEntityName = "veo_site";
			SubFacility.PrimaryIdentiferFieldName = "veo_siteid";
			SubFacility.CrmPrimaryAttributeName = "name";
			SubFacility.FullStationNameFieldName = "name";
			SubFacility.CommonStationNameFieldName = "veo_alsoknownas";
			SubFacility.StationNumberFieldName = "veo_parentstationnumber";
			SubFacility.ParentFacilityLookupFieldName = "veo_facilityid";
			SubFacility.DefaultFacilityFlagFieldName = "patsr_facilitydefaultflag";
			SubFacility.CoCClasificationFieldName = "patsr_cocclassification_text";
			SubFacility.StationIDFieldName = "patsr_vaststationid_text";
			SubFacility.LastUpdatedFieldName = "patsr_lastupdatedfromvaston";
			string[] crmPrimaryAttributeName = new string[] { SubFacility.CrmPrimaryAttributeName, SubFacility.FullStationNameFieldName, SubFacility.CommonStationNameFieldName, SubFacility.StationNumberFieldName, SubFacility.ParentFacilityLookupFieldName, SubFacility.DefaultFacilityFlagFieldName, SubFacility.CoCClasificationFieldName, SubFacility.StationIDFieldName };
			SubFacility.CrmColumns = new ColumnSet(crmPrimaryAttributeName);
		}

		public SubFacility(VASTStation stationFromVAST, Dictionary<VASTStation, Entity> parentFacilityDictionary)
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
            Entity entity = new Entity("veo_site");
            entity.Id = recordId;
            entity[SubFacility.StationIDFieldName] = this.StationID;
            entity[SubFacility.StationNumberFieldName] = this.StationNumber;
            entity[SubFacility.CommonStationNameFieldName] = this.CommonStationName;
            entity[SubFacility.CrmPrimaryAttributeName] = this.CRMDisplayname;
            entity[SubFacility.FullStationNameFieldName] = this.StationName;
            entity[SubFacility.CoCClasificationFieldName] = this.CoCClassification;
            entity[SubFacility.DefaultFacilityFlagFieldName] = this.CRMFacilityDefaultFlag;
            entity[SubFacility.LastUpdatedFieldName] = DateTime.Now;
            if (this.ParentFacilityRecord != null)
            {
                entity[SubFacility.ParentFacilityLookupFieldName] = this.ParentFacilityRecord.ToEntityReference();
            }
            return entity;
        }

        public bool MatchesCRMRecord(Entity record)
        {
            EntityReference item;
            bool flag = (!record.Contains(SubFacility.StationIDFieldName) ? false : (string)record[SubFacility.StationIDFieldName] == this.StationID);
            bool flag1 = (!record.Contains(SubFacility.StationNumberFieldName) ? false : (string)record[SubFacility.StationNumberFieldName] == this.StationNumber);
            bool flag2 = (!record.Contains(SubFacility.CommonStationNameFieldName) ? false : (string)record[SubFacility.CommonStationNameFieldName] == this.CommonStationName);
            bool flag3 = (!record.Contains(SubFacility.CrmPrimaryAttributeName) ? false : (string)record[SubFacility.CrmPrimaryAttributeName] == this.CRMDisplayname);
            bool flag4 = (!record.Contains(SubFacility.FullStationNameFieldName) ? false : (string)record[SubFacility.FullStationNameFieldName] == this.StationName);
            bool flag5 = (!record.Contains(SubFacility.CoCClasificationFieldName) ? false : (string)record[SubFacility.CoCClasificationFieldName] == this.CoCClassification);
            bool flag6 = (!record.Contains(SubFacility.DefaultFacilityFlagFieldName) ? false : (bool)record[SubFacility.DefaultFacilityFlagFieldName] == this.CRMFacilityDefaultFlag);
            bool parentFacilityRecord = false;
            if (record.Contains(SubFacility.ParentFacilityLookupFieldName))
            {
                item = (EntityReference)record[SubFacility.ParentFacilityLookupFieldName];
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