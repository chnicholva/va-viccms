using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Helpers
{
    public static class NameListExtensions
    {
        public static Name GetName(this Name[] NameList, string NameType, bool defaultTop = false)
        {
            Name name = null;

            if(NameList != null)
            {
                name = (from n in NameList
                        where n.NameType == NameType
                        select n).FirstOrDefault();

                if(name == null 
                    && defaultTop)
                {
                    name = NameList.FirstOrDefault();
                }
            }

            return name;
        }
    }
}
