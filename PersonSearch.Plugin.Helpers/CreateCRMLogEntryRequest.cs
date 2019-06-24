using System;

namespace PersonSearch.Plugin.Helpers
{
	public class CreateCRMLogEntryRequest
	{
		public string MessageId
		{
			get;
			set;
		}

		public string OrganizationName
		{
			get;
			set;
		}

		public Guid UserId
		{
			get;
			set;
		}

		public int crme_Sequence
		{
			get;
			set;
		}

		public string crme_Name
		{
			get;
			set;
		}

		public string NameofDebugSettingsField
		{
			get;
			set;
		}

		public string crme_ErrorMessage
		{
			get;
			set;
		}

		public string crme_Method
		{
			get;
			set;
		}

		public bool crme_GranularTiming
		{
			get;
			set;
		}

		public bool crme_TransactionTiming
		{
			get;
			set;
		}

		public bool crme_Debug
		{
			get;
			set;
		}

		public int crme_LogLevel
		{
			get;
			set;
		}

		public Guid crme_RelatedParentId
		{
			get;
			set;
		}

		public string crme_RelatedParentEntityName
		{
			get;
			set;
		}

		public string crme_RelatedParentFieldName
		{
			get;
			set;
		}

		public string crme_RelatedWebMethodName
		{
			get;
			set;
		}

		public string crme_TimeStart
		{
			get;
			set;
		}

		public string crme_TimeEnd
		{
			get;
			set;
		}

		public decimal crme_Duration
		{
			get;
			set;
		}
	}
}
