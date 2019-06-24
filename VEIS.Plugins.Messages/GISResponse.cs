using System;
using System.Runtime.CompilerServices;
using VEIS.Plugins.Models;

namespace VEIS.Plugins.Messages
{
	public class GISResponse
	{
		public GISStation[] features
		{
			get;
			set;
		}

		public GISResponse()
		{
		}
	}
}