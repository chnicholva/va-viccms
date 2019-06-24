using VEIS.Plugins.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PersonSearch.Plugin.Helpers;
using PersonSearch.Plugin;

namespace VEIS.Plugins.Messages
{
    public class ContactFindCreateRequest
    {
        private Person person = null;
        public string PersonJson { get; set; }

        public Person Person
        {
            get
            {
                if (person == null)
                {
                    person = JsonHelper.Deserialize<Person>(this.PersonJson);
                }
                return person;
            }
        }
    }
}
