using System;
using System.IO;
using System.Net;
using Microsoft.Xrm.Sdk;
using System.Activities;
using System.Text;
using Microsoft.Xrm.Sdk.Workflow;


namespace VCCM.VistA.Actions
{
    public partial class VistALogin : BaseAction
    {
        [Input("Override Site Id")]
        public InArgument<string> OverrideSiteId
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
                    //VistALoginRequest loginRequest = JsonHelper.Deserialize<VistALoginRequest>(this.Request.Get<string>(context));
                    //if(this.OverrideSiteId.Get(localContext.ActivityContext) != null && this.OverrideSiteId.Get(localContext.ActivityContext) != "")
                    //{
                    //    loginRequest.SiteId = this.OverrideSiteId.Get(localContext.ActivityContext);
                    //}
                    Entity settings = localContext.RetrieveActiveSettings("ftp_veisservicebaseurl", "ftp_vialoginurl", "ftp_mvisubscriptionkey");
                    localContext.Trace("Settings retrieved.");
                    string apiUrl = settings.GetAttributeValue<string>("ftp_veisservicebaseurl") + settings.GetAttributeValue<string>("ftp_vialoginurl");
                    //string apiUrl = "https://nonprod.integration.d365.va.gov/veis/api/VIA/LoginVIA/1.0/json";

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
                    apiRequest.Method = "POST";
                    apiRequest.ContentType = "application/json";
                    //string postData = JsonHelper.Serialize(stringRequest);
                    string postData = stringRequest;
                    this.VeisRawRequest.Set(localContext.ActivityContext, postData);
                    byte[] postBytes = Encoding.UTF8.GetBytes(postData);
                    apiRequest.ContentLength = postBytes.Length;
                    using (Stream postStream = apiRequest.GetRequestStream())
                    {
                        postStream.Write(postBytes, 0, postBytes.Length);
                    }

                    WebResponse webResponse = apiRequest.GetResponse();
                    Stream webStream = webResponse.GetResponseStream();
                    StreamReader responseReader = new StreamReader(webStream);
                    string apiStringResponse = responseReader.ReadToEnd();
                    responseReader.Close();
                    
                    this.VeisRawResponse.Set(localContext.ActivityContext, apiStringResponse);
                    //VistALoginResponse loginResponse = JsonHelper.Deserialize<VistALoginResponse>(apiStringResponse);
                    this.Response.Set(context, apiStringResponse);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }

}
