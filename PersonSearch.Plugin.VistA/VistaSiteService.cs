using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PersonSearch.Plugin.VistA
{
	internal class VistaSiteService
	{
		internal static string GetSiteName(string siteId, IOrganizationService crmService)
		{
			//IL_0006: Unknown result type (might be due to invalid IL or missing references)
			//IL_000c: Expected O, but got Unknown
			//IL_002a: Unknown result type (might be due to invalid IL or missing references)
			//IL_0034: Expected O, but got Unknown
			QueryByAttribute val = new QueryByAttribute("ftp_facility");
			val.AddAttributeValue("ftp_facilitycode", (object)siteId);
            val.ColumnSet = new ColumnSet("ftp_name");
			//val.set_ColumnSet(new ColumnSet(new string[1]
			//{
			//	"ftp_name"
			//}));
			EntityCollection val2 = crmService.RetrieveMultiple(val);
			return (val2 != null && ((IEnumerable<Entity>)val2.Entities).Any()) ? ((string)val2.Entities[0].Attributes["ftp_name"] + "&siteid=" + val2.Entities[0].Attributes["ftp_facilityid"]
				.ToString()) : siteId;
		}

		internal static Guid? GetSiteCrmId(string siteCode, IOrganizationService crmService)
		{
			//IL_0006: Unknown result type (might be due to invalid IL or missing references)
			//IL_000c: Expected O, but got Unknown
			//IL_002a: Unknown result type (might be due to invalid IL or missing references)
			//IL_0034: Expected O, but got Unknown
			QueryByAttribute val = new QueryByAttribute("ftp_facility");
			val.AddAttributeValue("ftp_facilitycode", (object)siteCode);
            val.ColumnSet = new ColumnSet("ftp_facilityid");
			//val.set_ColumnSet(new ColumnSet(new string[1]
			//{
			//	"ftp_facilityid"
			//}));
			EntityCollection val2 = crmService.RetrieveMultiple(val);
			return (val2 != null && ((IEnumerable<Entity>)val2.Entities).Any()) ? new Guid?((Guid)val2.Entities[0].Attributes["ftp_facilityid"]) : null;
		}
	}
}
