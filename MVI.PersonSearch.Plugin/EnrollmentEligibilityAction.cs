using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using VEIS.Plugins.Messages;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.IO;
using PersonSearch.Plugin;
using VEIS.Plugin.Helpers;
namespace MVI.PersonSearch.Plugin
{
    public class EnrollmentEligibilityAction : BaseAction
    {
        protected override void Execute(CodeActivityContext context)
        {
            try
            {
                Response.Set(context, "");
                // Use a 'using' statement to dispose of the service context properly
                // To use a specific early bound entity replace the 'Entity' below with the appropriate class type
                using (var localContext = new ActionContext(context))
                {
                    Entity settings = localContext.RetrieveActiveSettings("ftp_esrenrollmenteligibilitysummaryapiurl", "ftp_veisservicebaseurl", "ftp_mvisubscriptionkey");


                    try
                    {
                        if ((System.Net.ServicePointManager.SecurityProtocol & SecurityProtocolType.Tls12) == 0)
                        {
                            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                        }

                        using (WebClient client = new WebClient())
                        {
                            string uri = settings["ftp_veisservicebaseurl"].ToString() + settings["ftp_esrenrollmenteligibilitysummaryapiurl"].ToString() + this.Request.Get<string>(context);
                            client.Headers[HttpRequestHeader.ContentType] = "application/json";
                            string subKeys = settings["ftp_mvisubscriptionkey"].ToString();
                            if (subKeys.Length > 0)
                            {
                                string[] headers = subKeys.Split('|');
                                for (int i = 0; i < headers.Length; i = i + 2)
                                {
                                    client.Headers.Add(headers[i], headers[i + 1]);
                                }
                            }
                            string response = client.DownloadString(uri);
                            this.Response.Set(context, response);
                        }
                    }

                    catch (WebException exception)
                    {
                        string callResponse = string.Empty;
                        if (exception.Response != null)
                        {
                            using (StreamReader reader = new StreamReader(exception.Response.GetResponseStream()))
                            {
                                callResponse = reader.ReadToEnd();
                            }
                            exception.Response.Close();
                        }
                        if (exception.Status == WebExceptionStatus.Timeout)
                        {
                            throw new Exception("The timeout elapsed while attempting to issue the request.", exception);
                        }
                        throw new Exception($"A Web exception occurred while attempting to issue the request. {exception.Message}: {callResponse}", exception);
                    }

                }
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(WebApiUtility.BuildExceptionMessage(ex));
            }
        }
    }
}