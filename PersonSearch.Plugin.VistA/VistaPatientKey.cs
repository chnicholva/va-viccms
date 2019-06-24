using System;

namespace PersonSearch.Plugin.VistA
{
	public class VistaPatientKey
	{
		public string VistaId
		{
			get;
			private set;
		}

		public string SiteCode
		{
			get;
			private set;
		}

		public Guid CrmId
		{
			get;
			private set;
		}

		public VistaPatientKey(string vistaId, string siteCode = "")
		{
			if (string.IsNullOrEmpty(vistaId))
			{
				throw new ArgumentNullException(vistaId);
			}
			CheckIfStringIsAnInteger(vistaId);
			VistaId = vistaId;
			SiteCode = siteCode;
			ComposeKey();
		}

		public VistaPatientKey(Guid crmId)
		{
			if (crmId == Guid.Empty)
			{
				throw new ArgumentNullException("crmId");
			}
			CrmId = crmId;
			DeComposeKey();
		}

		private void ComposeKey()
		{
			CrmId = new Guid((SiteCode.PadLeft(3, '0') + "F" + VistaId).PadRight(32, 'F'));
		}

		private void DeComposeKey()
		{
			string text = CrmId.ToString("N").Substring(0, 3);
			CheckIfStringIsAnInteger(text);
			string vistaId = CrmId.ToString("N").TrimEnd('F', 'f').Substring(4);
			CheckIfStringIsAnInteger(vistaId);
			VistaId = vistaId;
			SiteCode = text;
		}

		private static void CheckIfStringIsAnInteger(string vistaId)
		{
			if (!int.TryParse(vistaId, out int _))
			{
				throw new ApplicationException("Invalid ID: Parsed ID is not an integer");
			}
		}
	}
}
