using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using System.Xml;

namespace MVI.PersonSearch.Plugin
{
    public class ContactSearch : IPlugin
	{
		private const string SearchFieldNotInQuery = "SEARCHFIELDNOTINQUERY";

		private string bah_edipi_text = "";

		private bool createOrUpdate = false;

		private string strErrorText = string.Empty;

		private string _controlAttribute = "XXXXXX";

		private string _controlValue = "CREATEUPDATEMVI";

		private string strConfig = string.Empty;

		private XmlNodeList nodeQueryFields = null;

		private XmlNodeList searchNodes = null;

		private ArrayList aryFields = new ArrayList();

		private Hashtable hshEntityAttribs = new Hashtable();

		private Dictionary<string, object> _conditionDictionary = new Dictionary<string, object>();

		public ContactSearch(string config)
		{
			//IL_0232: Unknown result type (might be due to invalid IL or missing references)
			if (string.IsNullOrEmpty(config))
			{
				throw new Exception("must supply configuration data");
			}
			strConfig = config;
			XmlDocument xmlDocument = new XmlDocument();
			xmlDocument.LoadXml(config);
			XmlNodeList xmlNodeList = xmlDocument.DocumentElement.SelectNodes("/config/controlattribute");
			if (xmlNodeList.Count == 1)
			{
				_controlAttribute = xmlNodeList[0].InnerText;
				searchNodes = xmlDocument.DocumentElement.SelectNodes("/config/searches");
				if (searchNodes.Count != 1)
				{
					throw new Exception("config data must contain exactly one 'config/searches' element");
				}
				if (searchNodes[0].ChildNodes.Count < 1)
				{
					throw new Exception("config data must contain exactly one or more 'config/searches/search' elements");
				}
				nodeQueryFields = xmlDocument.DocumentElement.SelectNodes("/config/queryfields/field");
				if (nodeQueryFields != null && nodeQueryFields.Count > 0)
				{
					foreach (XmlNode nodeQueryField in nodeQueryFields)
					{
						if (nodeQueryField.Attributes != null)
						{
							string oDataFieldName = nodeQueryField.Attributes.GetNamedItem("odata").Value;
							string schemaName = nodeQueryField.Attributes.GetNamedItem("schema").Value;
							string attributeType = nodeQueryField.Attributes.GetNamedItem("type").Value;
							if (oDataFieldName.Length == 0 || schemaName.Length == 0 || attributeType.Length == 0)
							{
								throw new InvalidPluginExecutionException("Either the OData name, Schema name, or Type name in XML conguration setting is empty.");
							}
							QueryFields queryFields = new QueryFields
							{
								ODataName = oDataFieldName,
								SchemaName = schemaName,
								TypeName = attributeType
							};
							aryFields.Add(queryFields);
						}
					}
					return;
				}
				throw new Exception("config data must contain at leaset one 'config/queryfields/field' element");
			}
			throw new Exception("config data must contain exactly one 'controlattribute' element");
		}

		private void AddFilterConditionsToDictionary(FilterExpression filter)
		{
			int num = -1;
			DataCollection<ConditionExpression> conditions = filter.Conditions;
			for (int i = 0; i < ((Collection<ConditionExpression>)conditions).Count; i++)
			{
				if ((int)((Collection<ConditionExpression>)conditions)[i].Operator == 0 || (int)((Collection<ConditionExpression>)conditions)[i].Operator == 25)
				{
					_conditionDictionary.Add(((Collection<ConditionExpression>)conditions)[i].AttributeName.ToUpper(), ((Collection<object>)((Collection<ConditionExpression>)conditions)[i].Values)[0]);
				}
				if (((Collection<ConditionExpression>)conditions)[i].AttributeName.ToUpper() == _controlAttribute.ToUpper())
				{
					num = i;
				}
			}
			if (num != -1)
			{
				((Collection<ConditionExpression>)filter.Conditions).RemoveAt(num);
			}
			foreach (FilterExpression item in (Collection<FilterExpression>)filter.Filters)
			{
				AddFilterConditionsToDictionary(item);
			}
		}

		private void AddConditionToDictionary(ConditionExpression condition)
		{
			if ((int)condition.Operator == 0 || (int)condition.Operator == 25)
			{
				_conditionDictionary.Add(condition.AttributeName.ToUpper(), ((Collection<object>)condition.Values)[0]);
			}
		}

		private XmlNode GetFirstParent(XmlNode node)
		{
			if (node.NodeType == XmlNodeType.Document)
			{
				return node;
			}
			return GetFirstParent(node.ParentNode);
		}

		public void Execute(IServiceProvider serviceProvider)
		{
		    try
			{
				ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
				IPluginExecutionContext executionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
				IOrganizationServiceFactory orgServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
				IOrganizationService orgService = orgServiceFactory.CreateOrganizationService((Guid?)executionContext.UserId);
				tracingService.Trace($"strConfig: {strConfig}", new object[0]);
				tracingService.Trace($"_controlAttribute: {_controlAttribute}", new object[0]);
				tracingService.Trace($"nodeQueryFields: {nodeQueryFields.Count}", new object[0]);
				if (executionContext.InputParameters.Contains("Query"))
				{
					tracingService.Trace("has a query", new object[0]);
					QueryExpression queryExpression = new QueryExpression();
					bool flag = false;
					bool flag2 = false;
					string fetchXml = string.Empty;
					if (executionContext.InputParameters["Query"] is FetchExpression)
					{
						flag2 = true;
						tracingService.Trace("query is a fetchexpression", new object[0]);
						fetchXml = ((FetchExpression)executionContext.InputParameters["Query"]).Query;
						XmlDocument xmlDocument = new XmlDocument();
						xmlDocument.LoadXml(fetchXml);
						XmlElement documentElement = xmlDocument.DocumentElement;
						string xpath = $"//condition[@attribute='{_controlAttribute}' and @operator='eq' and @value='{_controlValue}']";
						XmlNode xmlNode = documentElement.SelectSingleNode(xpath);
						if (xmlNode != null)
						{
							FetchXmlToQueryExpressionRequest fetchExpression = new FetchXmlToQueryExpressionRequest();
							fetchExpression.FetchXml = fetchXml;
							FetchXmlToQueryExpressionResponse response = (FetchXmlToQueryExpressionResponse)orgService.Execute(fetchExpression);
							queryExpression = response.Query;
							XmlNode parentNode = xmlNode.ParentNode;
							parentNode.RemoveChild(xmlNode);
							fetchXml = GetFirstParent(parentNode).OuterXml;
							flag = true;
						}
						else
						{
							flag = false;
						}
					}
					else if (executionContext.InputParameters["Query"] is QueryExpression)
					{
						tracingService.Trace("query is a queryexpression", new object[0]);
						queryExpression = (QueryExpression)executionContext.InputParameters["Query"];
						flag = true;
					}
					if (flag && queryExpression.Criteria != null)
					{
						tracingService.Trace("non-null criteria", new object[0]);
						string text2 = "";
						tracingService.Trace("filter count: " + ((Collection<FilterExpression>)queryExpression.Criteria.Filters).Count.ToString(), new object[0]);
						if (((Collection<FilterExpression>)queryExpression.Criteria.Filters).Count > 0)
						{
							foreach (FilterExpression item in (Collection<FilterExpression>)queryExpression.Criteria.Filters)
							{
								AddFilterConditionsToDictionary(item);
							}
						}
						if (((Collection<ConditionExpression>)queryExpression.Criteria.Conditions).Count > 0)
						{
							int num = -1;
							for (int i = 0; i < ((Collection<ConditionExpression>)queryExpression.Criteria.Conditions).Count; i++)
							{
								ConditionExpression val9 = ((Collection<ConditionExpression>)queryExpression.Criteria.Conditions)[i];
								AddConditionToDictionary(val9);
								if (val9.AttributeName.ToUpper() == _controlAttribute.ToUpper())
								{
									num = i;
								}
							}
							if (num != -1)
							{
								((Collection<ConditionExpression>)queryExpression.Criteria.Conditions).RemoveAt(num);
							}
						}
						foreach (string key in _conditionDictionary.Keys)
						{
							text2 += $"key: {key}, value: {_conditionDictionary[key].ToString()}\n";
						}
						tracingService.Trace("conditions: " + text2, new object[0]);
						if (_conditionDictionary.ContainsKey(_controlAttribute.ToUpper()) && (string)_conditionDictionary[_controlAttribute.ToUpper()] == _controlValue)
						{
							strErrorText = strErrorText + "found " + _controlValue + "\r\n";
							tracingService.Trace("should execute create/update", new object[0]);
							createOrUpdate = true;
							strErrorText = strErrorText + bah_edipi_text + "\r\n";
							object obj = strErrorText;
							strErrorText = obj + "aryFields.Count:" + aryFields.Count + "\r\n";
							for (int j = 0; j < aryFields.Count; j++)
							{
								strErrorText = strErrorText + "looping:" + j.ToString() + "\r\n";
								QueryFields queryFields = (QueryFields)aryFields[j];
								if (_conditionDictionary.ContainsKey(queryFields.ODataName.ToUpper()))
								{
									queryFields.Value = _conditionDictionary[queryFields.SchemaName.ToUpper()].ToString();
									hshEntityAttribs.Add(queryFields.SchemaName, queryFields);
									tracingService.Trace($"Hsh: {queryFields.SchemaName}-{queryFields.Value}", new object[0]);
								}
							}
						}
					}
					if (createOrUpdate)
					{
						bool flag3 = false;
						EntityCollection contactCollection = new EntityCollection();
						foreach (XmlNode childNode in searchNodes[0].ChildNodes)
						{
							string text3 = generateSearchFetch(childNode, hshEntityAttribs, tracingService);
                            tracingService.Trace("Fetch: " + text3);
							if (text3 != "SEARCHFIELDNOTINQUERY")
							{
								tracingService.Trace(string.Format("Search: {0}, FetchXML: {1}", childNode.Attributes["name"].Value, text3), new object[0]);
								FetchExpression val11 = new FetchExpression(text3);
								contactCollection = orgService.RetrieveMultiple(val11);
								XmlNode xmlNode3 = childNode.Attributes["returnnone"];
								if (xmlNode3 != null && !string.IsNullOrEmpty(xmlNode3.Value))
								{
									if (xmlNode3.Value.ToUpper() == "true".ToUpper() && ((Collection<Entity>)contactCollection.Entities).Count > 0)
									{
										flag3 = true;
										break;
									}
								}
								else
								{
									if (((Collection<Entity>)contactCollection.Entities).Count > 1)
									{
										flag3 = false;
										XmlNode xmlNode4 = childNode.Attributes["ignoremultiples"];
										if (xmlNode4 != null && !string.IsNullOrEmpty(xmlNode4.Value) && xmlNode4.Value.ToUpper() == "true".ToUpper())
										{
											flag3 = true;
										}
										break;
									}
									if (((Collection<Entity>)contactCollection.Entities).Count == 1)
									{
										flag3 = false;
										break;
									}
								}
							}
						}
						if (!flag3)
						{
							if (((Collection<Entity>)contactCollection.Entities).Count > 1)
							{
								((Collection<Entity>)contactCollection.Entities).Clear();
							}

                            if (((Collection<Entity>)contactCollection.Entities).Count == 0)
							{
								Entity newContact = new Entity("contact");
								tracingService.Trace("Create: parsing hashtable", new object[0]);
								ICollection keys = hshEntityAttribs.Keys;
								foreach (string item2 in keys)
								{
									QueryFields queryFields2 = (QueryFields)hshEntityAttribs[item2];
									if (queryFields2.Value != null)
									{
										tracingService.Trace($"strprop:{item2} -- {queryFields2.Value} : {queryFields2.TypeName}", new object[0]);
										if (queryFields2.TypeName.ToUpper() == "STRING")
										{
											newContact[item2] = (object)queryFields2.Value;
										}
										else if (queryFields2.TypeName.ToUpper() == "DATE")
										{
                                            newContact[item2] = (object)DateTime.Parse(queryFields2.Value);
										}
										else if (queryFields2.TypeName.ToUpper() == "NUMERIC")
										{
                                            newContact[item2] = (object)Convert.ToDecimal(queryFields2.Value);
										}
										else if (queryFields2.TypeName.ToUpper() == "OPTIONSET")
										{
											OptionSetValue opt = new OptionSetValue();
											opt.Value = (Convert.ToInt32(queryFields2.Value));
                                            newContact[item2] = (object)opt;
										}
										else if (queryFields2.TypeName.ToUpper().StartsWith("LOOKUP"))
										{
											string text6 = queryFields2.TypeName.Split("-".ToCharArray())[1];
											newContact[item2] = (object)new EntityReference(text6, new Guid(queryFields2.Value));
										}
									}
									else
									{
										tracingService.Trace($"strprop:{item2} has no value.", new object[0]);
									}
								}
								orgService.Create(newContact);
							}
							else
							{
								if (((Collection<Entity>)contactCollection.Entities).Count != 1)
								{
									throw new InvalidPluginExecutionException("Multiple records found using the provided EDIPI value.");
								}
								Entity val12 = ((Collection<Entity>)contactCollection.Entities)[0];
								tracingService.Trace("Update: parsing hashtable", new object[0]);
								ICollection keys = hshEntityAttribs.Keys;
								foreach (string item3 in keys)
								{
									QueryFields queryFields2 = (QueryFields)hshEntityAttribs[item3];
									if (queryFields2.Value != null && queryFields2.Value != string.Empty)
									{
										tracingService.Trace($"strprop:{item3} -- {queryFields2.Value} : {queryFields2.TypeName}", new object[0]);
										if (queryFields2.TypeName.ToUpper() == "STRING")
										{
											val12[item3] = (object)queryFields2.Value;
										}
										else if (queryFields2.TypeName.ToUpper() == "DATE")
										{
                                            val12[item3] = (object)DateTime.Parse(queryFields2.Value);
										}
										else if (queryFields2.TypeName.ToUpper() == "NUMERIC")
										{
                                            val12[item3] = (object)Convert.ToDecimal(queryFields2.Value);
										}
										else if (queryFields2.TypeName.ToUpper() == "OPTIONSET")
										{
											OptionSetValue val14 = new OptionSetValue();
											val14.Value = (Convert.ToInt32(queryFields2.Value));
											val12[item3] = (object)val14;
										}
										else if (queryFields2.TypeName.ToUpper().StartsWith("LOOKUP"))
										{
											string text6 = queryFields2.TypeName.Split("-".ToCharArray())[1];
											val12[item3] = (object)new EntityReference(text6, new Guid(queryFields2.Value));
										}
									}
									else
									{
										tracingService.Trace($"strprop:{item3} has no value.", new object[0]);
									}
								}
								orgService.Update(val12);
							}
						}
					}
					if (flag2)
					{
						executionContext.InputParameters["Query"] = (object)new FetchExpression(fetchXml);
					}
				}
				else
				{
					tracingService.Trace("value of returnNoContact is true", new object[0]);
				}
			}
			catch (Exception ex)
			{
				throw new InvalidPluginExecutionException(ex.Message);
			}
		}

		private string generateSearchFetch(XmlNode searchnode, Hashtable queryfields, ITracingService tracingService)
		{
			StringBuilder stringBuilder = new StringBuilder();
			StringBuilder stringBuilder2 = new StringBuilder();
            
			foreach (XmlNode childNode in searchnode.ChildNodes)
			{
				bool flag = false;
				bool flag2 = false;
				int result = 0;
				string name = childNode.Attributes["name"].Value;
				string type = childNode.Attributes["type"].Value;
                tracingService.Trace("Name: " + name + " Type: " + type);
				if (type.ToUpper().StartsWith("STRINGLAST"))
				{
					flag = int.TryParse(type.ToUpper().Replace("STRINGLAST", ""), out result);
				}
				if (type.ToUpper() == "STARTSWITH")
				{
					flag2 = true;
				}
				if (!queryfields.ContainsKey(name))
				{
					return "SEARCHFIELDNOTINQUERY";
				}
				if (string.IsNullOrWhiteSpace(((QueryFields)queryfields[name]).Value))
				{
					return "SEARCHFIELDNOTINQUERY";
				}
				stringBuilder.AppendLine($"<attribute name='{name}'/>");
				if (flag && ((QueryFields)queryfields[name]).Value.Length >= result)
				{
					int length = ((QueryFields)queryfields[name]).Value.Length;
					string arg = ((QueryFields)queryfields[name]).Value.Substring(length - result, result);
					stringBuilder2.AppendLine($"<condition attribute='{name}' value='{arg}' operator='eq'/>");
				}
				else if (flag2)
				{
					stringBuilder2.AppendLine($"<condition attribute='{name}' value='{((QueryFields)queryfields[name]).Value}' operator='begins-with'/>");
				}
				else
				{
					stringBuilder2.AppendLine($"<condition attribute='{name}' value='{((QueryFields)queryfields[name]).Value}' operator='eq'/>");
				}
			}
			string format = "<fetch distinct='false' mapping='logical' output-format='xml-platform' version='1.0' no-lock='true'>\r\n                            <entity name='contact'>\r\n                            {0}\r\n                            <attribute name='contactid'/>\r\n                            <filter type='and'>\r\n                            {1}\r\n                            </filter>\r\n                            </entity>\r\n                            </fetch>";
			return string.Format(format, stringBuilder.ToString(), stringBuilder2.ToString());
		}
	}
}
