using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace VCCM.VistA.Actions
{
    public class GetVeisPresentationCallout : BaseAction
    {
        [Input("API Active Settings Field")]
        [RequiredArgument]
        public InArgument<string> APIActiveSettingsField
        {
            get;
            set;
        }

        protected override void Execute(CodeActivityContext context)
        {
            try
            {
                // Use a 'using' statement to dispose of the service context properly
                // To use a specific early bound entity replace the 'Entity' below with the appropriate class type
                using (var localContext = new ActionContext(context))
                {
                    string stringRequest = this.Request.Get<string>(context);
                    string apiActiveSettingsField = this.APIActiveSettingsField.Get<string>(context);

                    //VistALoginRequest loginRequest = JsonHelper.Deserialize<VistALoginRequest>(this.Request.Get<string>(context));
                    //if(this.OverrideSiteId.Get(localContext.ActivityContext) != null && this.OverrideSiteId.Get(localContext.ActivityContext) != "")
                    //{
                    //    loginRequest.SiteId = this.OverrideSiteId.Get(localContext.ActivityContext);
                    //}
                    Entity settings = localContext.RetrieveActiveSettings("ftp_veisservicebaseurl", apiActiveSettingsField, "ftp_mvisubscriptionkey");
                    localContext.Trace("Settings retrieved.");
                    string apiUrl = settings.GetAttributeValue<string>("ftp_veisservicebaseurl") + settings.GetAttributeValue<string>(apiActiveSettingsField) + stringRequest;

                    HttpWebRequest apiRequest = (HttpWebRequest)WebRequest.Create(apiUrl);
                    //  implement subscription key
                    string subKeys = settings.GetAttributeValue<string>("ftp_mvisubscriptionkey");
                    if (subKeys.Length > 0)
                    {
                        string[] headers = subKeys.Split('|');
                        for (int i = 0; i < headers.Length; i = i + 2)
                        {
                            apiRequest.Headers.Add(headers[i], headers[i + 1]);
                        }
                    }
                    apiRequest.Method = "GET";
                    apiRequest.ContentType = "application/json";
                    //string postData = JsonHelper.Serialize(stringRequest);
                    string postData = stringRequest;
                    this.VeisRawRequest.Set(localContext.ActivityContext, postData);

                    WebResponse webResponse = apiRequest.GetResponse();
                    Stream webStream = webResponse.GetResponseStream();
                    StreamReader responseReader = new StreamReader(webStream);
                    string apiStringResponse = responseReader.ReadToEnd();
                    responseReader.Close();
                    this.VeisRawResponse.Set(localContext.ActivityContext, apiStringResponse);
                    //VistALoginResponse loginResponse = JsonHelper.Deserialize<VistALoginResponse>(apiStringResponse);
                    this.Response.Set(localContext.ActivityContext, apiStringResponse);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
