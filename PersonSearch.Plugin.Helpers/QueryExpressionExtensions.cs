using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PersonSearch.Plugin.Helpers
{
    public static class QueryExpressionExtensions
    {
        public static string GetSearchType(this QueryExpression Query)
        {
            if (Query != null
                && Query.Criteria != null)
            {
                return getSearchType(Query.Criteria);
            }

            return string.Empty;
        }

        private static string getSearchType(FilterExpression filter)
        {
            var searchType = string.Empty;
            var findSearchType = from c in filter.Conditions
                                 where c.AttributeName == "crme_searchtype"
                                         && c.Values != null
                                         && c.Values.Count() == 1
                                         && c.Values[0] is string
                                 select (string)c.Values.FirstOrDefault();
            if(findSearchType.Count() == 1)
            {
                searchType = findSearchType.First();
            }

            if (string.IsNullOrWhiteSpace(searchType))
            {
                foreach (var fe in filter.Filters)
                {
                    searchType = getSearchType(fe);
                    if (!string.IsNullOrWhiteSpace(searchType))
                    {
                        break;
                    }
                }
            }
            return searchType;
        }
    }
}
