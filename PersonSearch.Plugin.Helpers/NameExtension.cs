using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Messages;

namespace PersonSearch.Plugin.Helpers
{
    public static class NameExtension
    {
        public static AttributeCollection Map(this Name name)
        {
            AttributeCollection attrCol = new AttributeCollection();
            attrCol.Add("crme_firstname", name.GivenName);
            attrCol.Add("crme_lastname", name.FamilyName);
            attrCol.Add("crme_middlename", name.MiddleName);
            attrCol.Add("crme_suffix", name.NameSuffix);
            attrCol.Add("crme_alias", name.GetAlias());
            attrCol.Add("crme_FullName", name.GetFullName());

            return attrCol;
        }

        public static string GetAlias(this Name name)
        {
            try
            {
                if (name == null)
                {
                    return string.Empty;
                }
                return $"{name.GivenName} {name.FamilyName}";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public static string GetFullName(this Name name)
        {
            string text = "n/a";
            string text2 = string.IsNullOrEmpty(name.GivenName) ? "" : name.GivenName;
            string text3 = string.IsNullOrEmpty(name.MiddleName) ? "" : name.MiddleName;
            string text4 = string.IsNullOrEmpty(name.FamilyName) ? "" : name.FamilyName;
            string text5 = string.IsNullOrEmpty(name.NameSuffix) ? "" : name.NameSuffix;
            text = $"{text2} {text3} {text4} {text5}";
            return text.Trim();
        }
    }
}
