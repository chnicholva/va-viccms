using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PersonSearch.Plugin.Helpers
{
    public class Query
    {
        public string type;
        public string entity;
        public string select;
        public List<Criteria> criteria;
    }

    public class Criteria
    {
        public string attribute;
        public string type = "string";
        public string value;
    }
}
