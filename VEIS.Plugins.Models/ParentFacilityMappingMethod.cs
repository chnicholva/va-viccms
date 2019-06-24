using System;

namespace VEIS.Plugins.Models
{
	public enum ParentFacilityMappingMethod
	{
		CompareFirstThreeDigitsOfStationNumber = 100000000,
		UseParentStationIDFieldFromVAST = 100000001
	}
}