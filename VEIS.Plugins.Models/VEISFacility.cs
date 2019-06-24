using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Models
{
	public class VEISFacility
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
		static VEISFacility()
		{
            VEISFacility.CrmEntityName = "equipment";
            VEISFacility.CrmPrimaryIdentiferFieldName = "equipmentid";
            VEISFacility.CrmPrimaryAttributeName = "name";
            VEISFacility.FullStationNameFieldName = "name";
            VEISFacility.CommonStationNameFieldName = "veo_alsoknownas";
            VEISFacility.StationNumberFieldName = "veo_stationnumber";
            VEISFacility.VISNLookupFieldName = "veo_visnid";
            VEISFacility.CoCClasificationFieldName = "patsr_cocclassification_text";
            VEISFacility.StationIDFieldName = "patsr_vaststationid_text";
            VEISFacility.LastUpdatedFieldName = "patsr_lastupdatedfromvaston";
			string[] crmPrimaryAttributeName = new string[] { VEISFacility.CrmPrimaryAttributeName, VEISFacility.FullStationNameFieldName, VEISFacility.CommonStationNameFieldName, VEISFacility.StationNumberFieldName, VEISFacility.VISNLookupFieldName, VEISFacility.CoCClasificationFieldName, VEISFacility.StationIDFieldName };
            VEISFacility.CrmColumns = new ColumnSet(crmPrimaryAttributeName);
		}

		public VEISFacility(VASTStation stationFromVAST)
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
            Entity entity = new Entity("equipment");
            entity.Id = recordId;
            entity[VEISFacility.CrmPrimaryAttributeName] =  this.CRMDisplayname;
            entity[VEISFacility.StationIDFieldName] = this.StationID;
            entity[VEISFacility.StationNumberFieldName] = this.StationNumber;
            entity[VEISFacility.CommonStationNameFieldName] = this.CommonStationName;
            entity[VEISFacility.FullStationNameFieldName] = this.StationName;
            entity[VEISFacility.CoCClasificationFieldName] = this.CoCClassification;
            entity[VEISFacility.LastUpdatedFieldName] = DateTime.Now;
            KeyValuePair<string, Entity> keyValuePair = visnDictionary.FirstOrDefault<KeyValuePair<string, Entity>>((KeyValuePair<string, Entity> entry) => entry.Key == this.VisnID);
            Entity value = keyValuePair.Value;
            if (value != null)
            {
                entity[VEISFacility.VISNLookupFieldName] = value.ToEntityReference();
            }
            return entity;
        }

        public bool MatchesCRMRecord(Entity record)
        {
            return (!record.Contains(VEISFacility.StationIDFieldName) || 
                !((string)record[VEISFacility.StationIDFieldName] == this.StationID) || 
                !record.Contains(VEISFacility.StationNumberFieldName) || 
                !((string)record[VEISFacility.StationNumberFieldName] == this.StationNumber) || 
                !record.Contains(VEISFacility.CommonStationNameFieldName) || 
                !((string)record[VEISFacility.CommonStationNameFieldName] == this.CommonStationName) || 
                !record.Contains(VEISFacility.CrmPrimaryAttributeName) || 
                !((string)record[VEISFacility.CrmPrimaryAttributeName] == this.CRMDisplayname) || 
                !record.Contains(VEISFacility.FullStationNameFieldName) || 
                !((string)record[VEISFacility.FullStationNameFieldName] == this.StationName) || 
                !record.Contains(VEISFacility.VISNLookupFieldName) || 
                !(((EntityReference)record[VEISFacility.VISNLookupFieldName]).Name == this.VisnID) || 
                !record.Contains(VEISFacility.CoCClasificationFieldName) ? false : (string)record[VEISFacility.CoCClasificationFieldName] == this.CoCClassification);
        }
    }
}