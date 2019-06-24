using System;
using System.Runtime.CompilerServices;

namespace VEIS.Plugins.Messages
{
	public class VASTRefreshResponse
	{
		public DataMember[] Data
		{
			get;
			set;
		}

		public object DebugInfo
		{
			get;
			set;
		}

		public object ErrorMessage
		{
			get;
			set;
		}

		public bool ErrorOccurred
		{
			get;
			set;
		}

		public object Status
		{
			get;
			set;
		}

		public VASTRefreshResponse()
		{
		}
	}
}