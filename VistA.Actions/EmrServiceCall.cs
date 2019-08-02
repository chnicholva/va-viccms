using System;
using System.IO;
using System.Net;
using System.ServiceModel;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using VCCM.VistA.Actions.Messages;
using System.Web.Script.Serialization;
using System.Runtime.Serialization;
using System.Activities;
using System.Text;
using System.Security;
using Microsoft.Xrm.Sdk.Workflow;

namespace VCCM.VistA.Actions
{
    public partial class EmrServiceCall : BaseAction
    {
        protected override void Execute(CodeActivityContext context)
        {
            try
            {
                // Use a 'using' statement to dispose of the service context properly
                // To use a specific early bound entity replace the 'Entity' below with the appropriate class type
                using (var localContext = new ActionContext(context))
                {
                    string stringRequest = this.Request.Get<string>(context);

                    Entity settings = localContext.RetrieveActiveSettings("ftp_veisservicebaseurl", "ftp_emrserviceurl", "ftp_mvisubscriptionkey");
                    localContext.Trace("Settings retrieved.");
                    string apiUrl = settings.GetAttributeValue<string>("ftp_viaservicebaseurl") + settings.GetAttributeValue<string>("ftp_emrserviceurl");
                    //string apiUrl = "https://vaww.viapreprod.va.gov/via-webservices/services/EmrService";

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
                    apiRequest.ContentType = "application/xml";
                    string postData = stringRequest;
                    //this.VeisRawRequest.Set(localContext.ActivityContext, postData);
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

                    //this.VeisRawResponse.Set(localContext.ActivityContext, apiStringResponse);
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
