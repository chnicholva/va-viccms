using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace PersonSearch.Plugin.VistA
{
	internal class VistaService
	{
		public static string CrmIdToVistaId(Guid crmId)
		{
			return new VistaPatientKey(crmId).VistaId;
		}

		public static string CrmIdToSiteCode(Guid crmId)
		{
			return new VistaPatientKey(crmId).SiteCode;
		}

		public static Guid VistaIdToCrmId(string vistaId, string siteCode)
		{
			return new VistaPatientKey(vistaId, siteCode).CrmId;
		}

		public static EntityReference GetPatientReference(Guid crmPatientId)
		{
			//IL_0001: Unknown result type (might be due to invalid IL or missing references)
			//IL_0007: Expected O, but got Unknown
			EntityReference val = new EntityReference();
			val.LogicalName = "contact";
			val.Id = crmPatientId;
			return val;
		}

		public static Guid IntegerToCrmId(int integerValue)
		{
			string str = string.Empty;
			if (integerValue < 0)
			{
				str = "f";
				integerValue *= -1;
			}
			str += integerValue.ToString(CultureInfo.InvariantCulture);
			str = str.PadRight(32, 'f');
			return new Guid(str);
		}

		public static int CrmIdToInteger(Guid crmId)
		{
			string text = crmId.ToString("N").ToLower();
			bool flag = false;
			if (text.StartsWith("f"))
			{
				text = text.Substring(1);
				flag = true;
			}
			if (text.Contains("f"))
			{
				text = text.Substring(0, text.IndexOf('f'));
			}
			if (!int.TryParse(text, out int result))
			{
				throw new ApplicationException("Invalid crmId");
			}
			if (flag)
			{
				return result * -1;
			}
			return result;
		}

		public static Guid GetCrmIdFromTimestamp(string timeStamp, Guid patientId)
		{
			string arg = timeStamp.Remove(timeStamp.IndexOf('.'), 1);
			arg = string.Format("{0}F{1}", arg, patientId.ToString("N").ToLower().TrimEnd('f'));
			return new Guid(arg.PadRight(32, 'f'));
		}

		public static string GetTimestampFromCrmId(Guid crmId)
		{
			string text = crmId.ToString("N").ToLower();
			text = text.Substring(0, text.IndexOf('f'));
			return $"{text.Substring(0, 8)}.{text.Substring(8)}";
		}

		public static string GetPatientVistaIdFromCrmTimestampId(Guid crmId)
		{
			return GetSiteCodePlusPatientIdFromCrmTimestampId(crmId).Substring(3);
		}

		public static string GetSiteCodeFromCrmTimestampId(Guid crmId)
		{
			return GetSiteCodePlusPatientIdFromCrmTimestampId(crmId).Substring(0, 3);
		}

		internal static string GetSiteCodePlusPatientIdFromCrmTimestampId(Guid crmId)
		{
			string text = crmId.ToString("N").ToLower();
			int num = text.IndexOf('f');
			return text.Substring(num + 1, text.IndexOf('f', num + 1) - num - 1);
		}

		public static Dictionary<string, string> ParsePatientName(string patientFullName)
		{
			Dictionary<string, string> dictionary = new Dictionary<string, string>();
			patientFullName = patientFullName.Trim();
			if (!patientFullName.Contains(","))
			{
				if (patientFullName.Contains(" "))
				{
					int num = patientFullName.LastIndexOf(" ");
					dictionary.Add("firstname", patientFullName.Substring(0, num));
					dictionary.Add("lastname", patientFullName.Substring(num + 1));
				}
			}
			else
			{
				dictionary.Add("lastname", patientFullName.Substring(0, patientFullName.IndexOf(",")));
				dictionary.Add("firstname", patientFullName.Substring(patientFullName.IndexOf(",") + 1));
			}
			if (dictionary.ContainsKey("firstname") && dictionary["firstname"].Contains(" "))
			{
				int num = dictionary["firstname"].IndexOf(" ");
				dictionary.Add("middlename", dictionary["firstname"].Substring(num + 1));
				dictionary["firstname"] = dictionary["firstname"].Substring(0, num);
			}
			return dictionary;
		}
	}
}
