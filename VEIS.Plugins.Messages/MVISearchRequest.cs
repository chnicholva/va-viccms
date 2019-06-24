using PersonSearch.Plugin;
using PersonSearch.Plugin.Helpers;
using VEIS.Plugins.Models;

namespace VEIS.Plugins.Messages
{
    public class MVISearchRequest
    {
        private Query query = null;
        private Person person = null;
        public string QueryJson { get; set; }

        public string PersonJson { get; set; }
        public Query Query
        {
            get
            {
                if (query == null && !string.IsNullOrEmpty(this.QueryJson))
                {
                    query = JsonHelper.Deserialize<Query>(this.QueryJson);
                }
                return query;
            }
        }

        public Person Person
        {
            get
            {
                if (person == null && !string.IsNullOrEmpty(this.PersonJson))
                {
                    person = JsonHelper.Deserialize<Person>(this.PersonJson);
                }
                return person;
            }
        }
    }
}
