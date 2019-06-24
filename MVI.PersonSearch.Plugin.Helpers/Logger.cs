using Microsoft.Xrm.Sdk;
using System;
using System.ServiceModel;

namespace MVI.PersonSearch.Plugin.Helpers
{
	[Serializable]
	public class Logger : ILogger
	{
		private int _sequence = 1;

		private ITracingService _tracingService;

		private IOrganizationService _service;

		private string _method;

		private string _relatedEntityName;

		private Guid _relatedEntityId;

		private string _module;

		private bool _debug;

		private bool _txnTiming;

		private bool _granularTiming;

		public ITracingService setTracingService
		{
			set
			{
				_tracingService = value;
			}
		}

		public IOrganizationService setService
		{
			set
			{
				_service = value;
			}
		}

		public string setMethod
		{
			get
			{
				return _method;
			}
			set
			{
				_method = value;
			}
		}

		public string setEntityName
		{
			get
			{
				return _relatedEntityName;
			}
			set
			{
				_relatedEntityName = value;
			}
		}

		public Guid setEntityId
		{
			get
			{
				return _relatedEntityId;
			}
			set
			{
				_relatedEntityId = value;
			}
		}

		public string setModule
		{
			get
			{
				return _module;
			}
			set
			{
				_module = value;
			}
		}

		public bool setDebug
		{
			set
			{
				_debug = value;
			}
		}

		public bool setTxnTiming
		{
			set
			{
				_txnTiming = value;
			}
		}

		public bool setGranularTiming
		{
			set
			{
				_granularTiming = value;
			}
		}

		private void writeOutMessage(string message, bool debugMessage, bool granularTiming, bool TxnTiming)
		{
			try
			{
				Entity val = new Entity("mcs_log");
				val["mcs_name"] = _module;
				DateTime now = DateTime.Now;
				string str = now.Hour.ToString("00") + ":" + now.Minute.ToString("00") + ":" + now.Second.ToString("00") + ":" + now.Millisecond.ToString("000");
				message = str + " --" + message;
				val["mcs_errormessage"] = message;
				if (debugMessage)
				{
					val["mcs_debugmessage"] = true;
				}
				if (granularTiming)
				{
					val["mcs_grantiming"] = true;
				}
				if (TxnTiming)
				{
					val["mcs_txntiming"] = true;
				}
				if (!_relatedEntityId.ToString().StartsWith("000"))
				{
					val["mcs_entityid"] = _relatedEntityId.ToString();
				}
				if (_relatedEntityName != null)
				{
					val["mcs_entityname"] = _relatedEntityName;
				}
				val["mcs_method"] = _method;
				val["mcs_sequence"] = _sequence;
				_sequence++;
				if (_tracingService != null)
				{
					_tracingService.Trace(message, new object[0]);
				}
				_service.Create(val);
			}
			catch (FaultException<OrganizationServiceFault>)
			{
			}
			catch (Exception)
			{
			}
		}

		private void writeOutMessage(string message, bool debugMessage, bool granularTiming, bool TxnTiming, decimal duration)
		{
			//IL_0007: Unknown result type (might be due to invalid IL or missing references)
			//IL_000d: Expected O, but got Unknown
			//IL_01b9: Unknown result type (might be due to invalid IL or missing references)
			//IL_01c3: Expected O, but got Unknown
			try
			{
				Entity val = new Entity("mcs_log");
				val["mcs_name"] = _module;
				DateTime now = DateTime.Now;
				string str = now.Hour.ToString("00") + ":" + now.Minute.ToString("00") + ":" + now.Second.ToString("00") + ":" + now.Millisecond.ToString("000");
				message = str + " --" + message;
				val["mcs_errormessage"] = message;
				if (debugMessage)
				{
					val["mcs_debugmessage"] = true;
				}
				if (granularTiming)
				{
					val["mcs_grantiming"] = true;
				}
				if (TxnTiming)
				{
					val["mcs_txntiming"] = true;
				}
				if (!_relatedEntityId.ToString().StartsWith("000"))
				{
					val["mcs_entityid"] = _relatedEntityId.ToString();
				}
				if (_relatedEntityName != null)
				{
					val["mcs_entityname"] = _relatedEntityName;
				}
				if (duration != 0m)
				{
					val["crme_duration"] = duration;
					val["crme_loglevel"] = new OptionSetValue(935950001);
				}
				val["mcs_method"] = _method;
				val["mcs_sequence"] = _sequence;
				_sequence++;
				if (_tracingService != null)
				{
					_tracingService.Trace(message, new object[0]);
				}
				_service.Create(val);
			}
			catch (FaultException<OrganizationServiceFault>)
			{
			}
			catch (Exception)
			{
			}
		}

		public void WriteToFile(string message)
		{
			writeOutMessage(message, false, false, false);
		}

		public void WriteTxnTimingMessage(string message)
		{
			if (_txnTiming)
			{
				writeOutMessage(message, false, false, true);
			}
		}

		public void WriteTxnTimingMessage(string message, decimal duration)
		{
			if (_txnTiming)
			{
				writeOutMessage(message, false, false, true, duration);
			}
		}

		public void WriteGranularTimingMessage(string message)
		{
			if (_granularTiming)
			{
				writeOutMessage(message, false, true, false);
			}
		}

		public void WriteDebugMessage(string message)
		{
			if (_debug)
			{
				writeOutMessage(message, true, false, false);
			}
		}
	}
}
