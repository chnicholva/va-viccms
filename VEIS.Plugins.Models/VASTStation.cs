using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Models
{
	public class VASTStation
	{
		public string CocClassification
		{
			get;
			set;
		}

		public string CommonStationName
		{
			get;
			set;
		}

		public string FacilityDataDate
		{
			get;
			set;
		}

		public bool IsATopLevelStation
		{
			get;
			set;
		}

		public ParentFacilityMappingMethod ParentFacilityMappingMethodCode
		{
			get;
			set;
		}

		public VASTStation ParentStation
		{
			get;
			set;
		}

		public string ParentStationID
		{
			get;
			set;
		}

		public string StationID
		{
			get;
			set;
		}

		public string StationName
		{
			get;
			set;
		}

		public string StationNumber
		{
			get;
			set;
		}

		public string VisnID
		{
			get;
			set;
		}

		public VASTStation()
		{
		}

		public VASTStation(GISStation gisStation)
		{
			this.StationID = gisStation.attributes.StationID;
			this.VisnID = gisStation.attributes.VisnID;
			this.StationNumber = gisStation.attributes.StationNumber;
			this.StationName = gisStation.attributes.StationName;
			this.CommonStationName = gisStation.attributes.CommonStationName;
			this.CocClassification = gisStation.attributes.CocClassification;
			this.FacilityDataDate = gisStation.attributes.FacilityDataDate;
			this.ParentStationID = gisStation.attributes.ParentStationID;
		}

		public bool DetermineIsATopLevelStation(ParentFacilityMappingMethod mappingMethod)
		{
			bool length;
			if (mappingMethod == ParentFacilityMappingMethod.CompareFirstThreeDigitsOfStationNumber)
			{
				length = this.StationNumber.Length == 3;
			}
			else if (mappingMethod != ParentFacilityMappingMethod.UseParentStationIDFieldFromVAST)
			{
				length = false;
			}
			else
			{
				length = (this.ParentStationID == null ? true : this.ParentStationID == this.StationNumber);
			}
			return length;
		}

		public VASTStation DetermineParentStationFromList(VASTStation[] stations)
		{
			VASTStation vASTStation = null;
			if (!(this.IsATopLevelStation || this.StationNumber == null ? false : this.StationID != null))
			{
				vASTStation = null;
			}
			else if (this.ParentFacilityMappingMethodCode == ParentFacilityMappingMethod.CompareFirstThreeDigitsOfStationNumber)
			{
				vASTStation = ((IEnumerable<VASTStation>)stations).FirstOrDefault<VASTStation>((VASTStation s) => (s.StationNumber == null || s.StationNumber.Length != 3 ? false : s.StationNumber == this.StationNumber.Substring(0, 3)));
			}
			else if ((this.ParentFacilityMappingMethodCode != ParentFacilityMappingMethod.UseParentStationIDFieldFromVAST ? true : this.ParentStationID == null))
			{
				vASTStation = null;
			}
			else
			{
				vASTStation = ((IEnumerable<VASTStation>)stations).FirstOrDefault<VASTStation>((VASTStation s) => s.StationNumber == this.ParentStationID);
			}
			return vASTStation;
		}

		public void MassageVASTStation(VASTStation[] stations, ParentFacilityMappingMethod mappingMethod)
		{
			this.StationID = (!string.IsNullOrEmpty(this.StationID) ? this.StationID.Trim() : this.StationID);
			this.VisnID = (!string.IsNullOrEmpty(this.VisnID) ? this.VisnID.Trim() : this.VisnID);
			this.StationNumber = (!string.IsNullOrEmpty(this.StationNumber) ? this.StationNumber.Trim() : this.StationNumber);
			this.StationName = (!string.IsNullOrEmpty(this.StationName) ? this.StationName.Trim() : this.StationName);
			this.CommonStationName = (!string.IsNullOrEmpty(this.CommonStationName) ? this.CommonStationName.Trim() : this.CommonStationName);
			this.FacilityDataDate = (!string.IsNullOrEmpty(this.FacilityDataDate) ? this.FacilityDataDate.Trim() : this.FacilityDataDate);
			this.ParentStationID = (!string.IsNullOrEmpty(this.ParentStationID) ? this.ParentStationID.Trim() : this.ParentStationID);
			this.ParentFacilityMappingMethodCode = mappingMethod;
			this.IsATopLevelStation = this.DetermineIsATopLevelStation(this.ParentFacilityMappingMethodCode);
			this.ParentStation = this.DetermineParentStationFromList(stations);
		}
	}
}