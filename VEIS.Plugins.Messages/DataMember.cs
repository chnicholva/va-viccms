using System;
using System.Runtime.CompilerServices;
using VEIS.Plugins.Models;

namespace VEIS.Plugins.Messages
{
	public class DataMember
	{
		public int totalItems
		{
			get;
			set;
		}

		public VASTStation[] vistaList
		{
			get;
			set;
		}

		public DataMember()
		{
		}
	}
}