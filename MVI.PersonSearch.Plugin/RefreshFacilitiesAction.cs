
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using VEIS.Plugins.Models;
using VEIS.Plugins.Messages;
using PersonSearch.Plugin;
using PersonSearch.Plugin.Helpers;
using VEIS.Plugin.Helpers;

namespace MVI.PersonSearch.Plugin
{
    public class RefreshFacilitiesAction : BaseAction
    {
        //[Input("DAC URL")]
        //public InArgument<string> dacURLInput { get; set; }

        [Input("Facility Data Date")]
        [RequiredArgument]
        public InArgument<DateTime> FacilityDataDateInput { get; set; }

        [AttributeTarget("mcs_setting", "ftp_vastfacilityrefreshselectedendpoint")]
        [Input("API to use for facility data")]
        [RequiredArgument]
        public InArgument<OptionSetValue> FacilityEndpointToUse { get; set; }

        //[Input("VAST List GIS API Base URL")]
        //public InArgument<string> GISAPIBaseURLInput { get; set; }

        //[Input("VAST List GIS API URL Parameters")]
        //public InArgument<string> GISAPIURLParametersInput { get; set; }

        [Output("Refresh Completed Successfully")]
        public OutArgument<bool> RefreshCompletedSuccessfully { get; set; }

        [Output("Message")]
        public OutArgument<string> ResultMessage { get; set; }

        //[Input("VAST List API URL")]
        //public InArgument<string> VASTAPIURLInput { get; set; }

        [AttributeTarget("mcs_setting", "ftp_vastfacilitytosubfacilitymappingmethod")]
        [Input("VAST Facility to Sub Facility Mapping Method")]
        [RequiredArgument]
        public InArgument<OptionSetValue> VASTMappingMethodInput { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            //WebClient webClient;
            //string str;
            Exception exception;
            int i;
            object[] correlationId;
            ITracingService extension = null;
            
            Response.Set(context, "");
            // Use a 'using' statement to dispose of the service context properly
            // To use a specific early bound entity replace the 'Entity' below with the appropriate class type
            using (var localContext = new ActionContext(context))
            {

                try
                {
                    extension = context.GetExtension<ITracingService>();
                    IWorkflowContext workflowContext = context.GetExtension<IWorkflowContext>();
                    IOrganizationService organizationService = context.GetExtension<IOrganizationServiceFactory>().CreateOrganizationService(new Guid?(localContext.WorkflowExecutionContext.UserId));

                    OptionSetValue optionSetValue = this.FacilityEndpointToUse.Get(context);
                    FacilityEndpoint facilityEndpoint = (optionSetValue != null ? (FacilityEndpoint)Enum.ToObject(typeof(FacilityEndpoint), optionSetValue.Value) : FacilityEndpoint.VASTProxy);
                    OptionSetValue optionSetValue1 = this.VASTMappingMethodInput.Get(context);
                    ParentFacilityMappingMethod parentFacilityMappingMethod = (optionSetValue1 != null ? (ParentFacilityMappingMethod)Enum.ToObject(typeof(ParentFacilityMappingMethod), optionSetValue1.Value) : ParentFacilityMappingMethod.UseParentStationIDFieldFromVAST);
                    DateTime dateTime = this.FacilityDataDateInput.Get(context);
                    int month = dateTime.Month;
                    string str1 = month.ToString();
                    month = dateTime.Day;
                    string str2 = month.ToString();
                    month = dateTime.Year;
                    string str3 = string.Format("{0}-{1}-{2}", str1, str2, month.ToString());
                    VASTRefreshResponse vASTRefreshResponse = new VASTRefreshResponse();
                    if (facilityEndpoint != FacilityEndpoint.VASTProxy)
                    {
                        throw new NotImplementedException("Facility Endpoint Not Supported: " + facilityEndpoint.ToString());
                    }
                    else
                    {
                        VeisConfig config = localContext.RetrieveVeisConfig("ftp_vastlistrefreshapiurl", "ftp_mvisubscriptionkey");

                        vASTRefreshResponse = WebApiUtility.ReceiveVeisRequest<VASTRefreshResponse>(config, config.VeisConfiguration.VASTRefreshFacilityAPI + "/" + str3);

                        if (vASTRefreshResponse.ErrorOccurred)
                        {
                            throw new InvalidPluginExecutionException((string.IsNullOrEmpty((string)vASTRefreshResponse.ErrorMessage) ? "Unspecified error." : (string)vASTRefreshResponse.ErrorMessage));
                        }
                    }

                    if ((int)vASTRefreshResponse.Data.Length != 1)
                    {
                        throw new InvalidPluginExecutionException("Unhandled response content: multiple Data[] members.");
                    }
                    DataMember data = vASTRefreshResponse.Data[0];
                    if ((int)data.vistaList.Length > 0)
                    {
                        VASTStation[] vASTStationArray = data.vistaList;
                        for (i = 0; i < (int)vASTStationArray.Length; i++)
                        {
                            vASTStationArray[i].MassageVASTStation(data.vistaList, parentFacilityMappingMethod);
                        }
                        extension.Trace("staring VISNs...", new object[0]);
                        QueryExpression queryExpression = new QueryExpression();
                        queryExpression.EntityName = "ftp_visn";
                        queryExpression.ColumnSet = new ColumnSet(new string[] { "ftp_name" });
                        queryExpression.Criteria.Conditions.Add(new ConditionExpression("statecode", 0, "Active"));
                        queryExpression.Orders.Add(new OrderExpression("modifiedon", OrderType.Ascending));
                        EntityCollection entityCollection = organizationService.RetrieveMultiple(queryExpression);
                        extension.Trace("got active ftp_visn records", new object[0]);
                        Dictionary<string, Entity> strs = new Dictionary<string, Entity>();
                        vASTStationArray = data.vistaList;
                        for (i = 0; i < (int)vASTStationArray.Length; i++)
                        {
                            VASTStation vASTStation = vASTStationArray[i];
                            if (strs.FirstOrDefault<KeyValuePair<string, Entity>>((KeyValuePair<string, Entity> entry) => entry.Key == vASTStation.VisnID).Key == null)
                            {
                                extension.Trace(string.Concat("VISN from VAST: ", vASTStation.VisnID), new object[0]);
                                Entity entity = entityCollection.Entities.FirstOrDefault<Entity>((Entity v) => (!v.Contains("ftp_name") ? false : (string)v.GetAttributeValue<string>("ftp_name") == vASTStation.VisnID));
                                if (entity != null)
                                {
                                    strs.Add(vASTStation.VisnID, entity);
                                }
                                else
                                {
                                    extension.Trace(string.Concat("creating new ftp_visn record: ", vASTStation.VisnID), new object[0]);
                                    Entity entity1 = new Entity("ftp_visn");
                                    entity1.Attributes.Add("ftp_name", vASTStation.VisnID);
                                    try
                                    {
                                        entity1.Id = organizationService.Create(entity1);
                                    }
                                    catch (Exception exception3)
                                    {
                                        exception = exception3;
                                        extension.Trace(string.Concat("error creating new ftp_visn record: ", vASTStation.VisnID), new object[0]);
                                        throw new InvalidPluginExecutionException(string.Concat("error creating new ftp_visn record: ", exception.Message));
                                    }
                                    strs.Add(vASTStation.VisnID, entity1);
                                }
                            }
                        }
                        extension.Trace("filled VISNDictionary.", new object[0]);
                        extension.Trace("starting top-level facilities (ftp_facility entity)", new object[0]);
                        QueryExpression queryExpression1 = new QueryExpression();
                        queryExpression1.EntityName = VEISVASTRefreshFacility.CrmEntityName;
                        queryExpression1.ColumnSet = VEISVASTRefreshFacility.CrmColumns;
                        queryExpression1.Criteria.Conditions.Add(new ConditionExpression("statecode", 0, "Active"));
                        queryExpression1.Orders.Add(new OrderExpression(VEISVASTRefreshFacility.StationNumberFieldName, 0));
                        queryExpression1.Orders.Add(new OrderExpression("modifiedon", OrderType.Ascending));
                        EntityCollection entityCollection1 = organizationService.RetrieveMultiple(queryExpression1);
                        extension.Trace("got active ftp_facility records.", new object[0]);
                        Dictionary<VASTStation, Entity> vASTStations1 = new Dictionary<VASTStation, Entity>();
                        vASTStationArray = data.vistaList;
                        for (i = 0; i < (int)vASTStationArray.Length; i++)
                        {
                            VASTStation vASTStation1 = vASTStationArray[i];
                            if (vASTStation1.IsATopLevelStation)
                            {
                                VEISVASTRefreshFacility facility = new VEISVASTRefreshFacility(vASTStation1);
                                extension.Trace(string.Concat("top-level ftp_facility from VAST: ", facility.CRMDisplayname), new object[0]);
                                Entity entity2 = entityCollection1.Entities.FirstOrDefault<Entity>((Entity f) => (!f.Contains(VEISVASTRefreshFacility.StationIDFieldName) ? false : (string)f.GetAttributeValue<string>(VEISVASTRefreshFacility.StationIDFieldName) == vASTStation1.StationID));
                                if (entity2 == null)
                                {
                                    entity2 = entityCollection1.Entities.FirstOrDefault<Entity>((Entity f) => (!f.Contains(VEISVASTRefreshFacility.StationNumberFieldName) ? false : (string)f.GetAttributeValue<string>(VEISVASTRefreshFacility.StationNumberFieldName) == vASTStation1.StationNumber));
                                }
                                if (entity2 == null)
                                {
                                    extension.Trace(string.Concat("creating new ftp_facility record: ", facility.CRMDisplayname), new object[0]);
                                    Entity cRMRecord = facility.MapToCRMRecord(Guid.Empty, strs);
                                    try
                                    {
                                        cRMRecord.Id = organizationService.Create(cRMRecord);
                                        vASTStations1.Add(vASTStation1, cRMRecord);
                                    }
                                    catch (Exception exception4)
                                    {
                                        exception = exception4;
                                        extension.Trace("error creating new ftp_facility record.", new object[0]);
                                        throw new InvalidPluginExecutionException(string.Concat("error creating new ftp_facility record: ", exception.Message));
                                    }
                                }
                                else if (facility.MatchesCRMRecord(entity2))
                                {
                                    vASTStations1.Add(vASTStation1, entity2);
                                }
                                else
                                {
                                    extension.Trace(string.Concat("updating ftp_facility record: ", facility.CRMDisplayname), new object[0]);
                                    Entity cRMRecord1 = facility.MapToCRMRecord(entity2.Id, strs);
                                    try
                                    {
                                        organizationService.Update(cRMRecord1);
                                        vASTStations1.Add(vASTStation1, cRMRecord1);
                                    }
                                    catch (Exception exception5)
                                    {
                                        exception = exception5;
                                        extension.Trace("error updating facility record.", new object[0]);
                                        throw new InvalidPluginExecutionException(string.Concat("error updating ftp_facility record: ", exception.Message));
                                    }
                                }
                            }
                        }
                        extension.Trace("finished creating/updating ftp_facility records from vastResponse.Data[0].vistaList.", new object[0]);
                        extension.Trace("filled ParentFacilityDictionary.", new object[0]);
                        extension.Trace("starting full facilities list (ftp_subfacility entity)...", new object[0]);
                        QueryExpression queryExpression2 = new QueryExpression();
                        queryExpression2.EntityName = VEISVASTRefreshSubFacility.CrmEntityName;
                        queryExpression2.ColumnSet = VEISVASTRefreshSubFacility.CrmColumns;
                        queryExpression2.Criteria.Conditions.Add(new ConditionExpression("statecode", 0, "Active"));
                        queryExpression2.Orders.Add(new OrderExpression(VEISVASTRefreshSubFacility.StationNumberFieldName, 0));
                        queryExpression2.Orders.Add(new OrderExpression("modifiedon", OrderType.Ascending));
                        EntityCollection entityCollection2 = organizationService.RetrieveMultiple(queryExpression2);
                        extension.Trace("got active ftp_subfacility records.", new object[0]);
                        vASTStationArray = data.vistaList;
                        for (i = 0; i < (int)vASTStationArray.Length; i++)
                        {
                            VASTStation vASTStation2 = vASTStationArray[i];
                            VEISVASTRefreshSubFacility subFacility = new VEISVASTRefreshSubFacility(vASTStation2, vASTStations1);
                            extension.Trace(string.Concat("ftp_subfacility from VAST: ", subFacility.CRMDisplayname), new object[0]);
                            Entity entity3 = entityCollection2.Entities.FirstOrDefault<Entity>((Entity sf) => (!sf.Contains(VEISVASTRefreshSubFacility.StationIDFieldName) ? false : (string)sf.GetAttributeValue<string>(VEISVASTRefreshSubFacility.StationIDFieldName) == vASTStation2.StationID));
                            if (entity3 == null)
                            {
                                entity3 = entityCollection2.Entities.FirstOrDefault<Entity>((Entity sf) => (!sf.Contains(VEISVASTRefreshSubFacility.StationNumberFieldName) ? false : (string)sf.GetAttributeValue<string>(VEISVASTRefreshSubFacility.StationNumberFieldName) == vASTStation2.StationNumber));
                            }
                            if (entity3 == null)
                            {
                                extension.Trace(string.Concat("creating new ftp_subfacility record: ", subFacility.CRMDisplayname), new object[0]);
                                Entity cRMRecord2 = subFacility.MapToCRMRecord(Guid.Empty, vASTStations1);
                                try
                                {
                                    cRMRecord2.Id = organizationService.Create(cRMRecord2);
                                }
                                catch (Exception exception6)
                                {
                                    exception = exception6;
                                    extension.Trace("error creating new ftp_subfacility record.", new object[0]);
                                    throw new InvalidPluginExecutionException(string.Concat("error creating new ftp_subfacility record: ", exception.Message));
                                }
                            }
                            else if (!subFacility.MatchesCRMRecord(entity3))
                            {
                                extension.Trace(string.Concat("updating ftp_subfacility record: ", subFacility.CRMDisplayname), new object[0]);
                                try
                                {
                                    organizationService.Update(subFacility.MapToCRMRecord(entity3.Id, vASTStations1));
                                }
                                catch (Exception exception7)
                                {
                                    exception = exception7;
                                    extension.Trace("error updating ftp_subfacility record.", new object[0]);
                                    throw new InvalidPluginExecutionException(string.Concat("error updating ftp_subfacility record: ", exception.Message));
                                }
                            }
                        }
                        this.RefreshCompletedSuccessfully.Set(context, true);
                        this.ResultMessage.Set(context, "finished creating/updating ftp_subfacility records.");
                        extension.Trace("finished creating/updating ftp_subfacility records.", new object[0]);
                    }

                }
                catch (Exception ex)
                {

                    this.RefreshCompletedSuccessfully.Set(context, false);
                    correlationId = new object[] { ex.ToString() };
                    extension.Trace("Exception: {0}", correlationId);
                    this.ResultMessage.Set(context, ex.ToString());
                    throw;
                }
                correlationId = new object[] { context.GetExtension<IWorkflowContext>().CorrelationId };
                extension.Trace("Exiting RefreshFacilityListFromVAST.Execute(), Correlation Id: {0}", correlationId);
            }
           
        }

    }
}
