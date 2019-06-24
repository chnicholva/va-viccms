using Microsoft.Xrm.Sdk;
using PersonSearch.Plugin.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Messages;
using VEIS.Plugins.Models;
using PersonSearch.Plugin;

namespace VEIS.Plugin.Helpers
{

    /// <summary>
    /// 
    /// Instructions on adding to your plugin,
    /// 1) Add a an existing Item to your project, navigate to this cs file, down in the bottom right corner where it says "Add", change to "Add as Link"
    /// 2) Add a Reference to System.Net.Http to the plugin project this is needed by HttpClient
    /// 3) Add a Reference to System.Xml to the plugin project this is needed by the Json Deserializer.
    /// 
    /// </summary>
    public class WebApiUtility
    {
        public enum LogLevel { Debug = 935950000, Info = 935950001, Warn = 935950002, Error = 935950003, Fatal = 935950004, Timing = 935950005 };

        public const string OneWayPassTest = "TestMessages#OneWayPassTest";
        public const string TwoWayPassTest = "TestMessages#TwoWayPassTest";
        public const string TwoMinuteTest = "TestMessages#TwoMinuteTest";
        public const string OneWayTimedTest = "TestMessages#OneWayTimedTest";

        public const string CreateCRMLogEntryRequest = "CRMe#CreateCRMLogEntryRequest";

        const string _urlRestPath = "/api/vimt/{0}";
        const string _urlParams = "?messageId={0}&messageType=text%2Fjson&isQueued=false";

        const string SEND = "Send";
        const string SEND_RECEIVE = "SendReceive";

        const string _vimtExceptionMessage = "The Query of the Legacy system timed out, click on refresh to try again";
        const int DEFAULT_TIMEOUT = 20;
        public static string BuildExceptionMessage(Exception ex)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Begin Exception");
            sb.AppendLine("EX Message: " + ex.Message);
            sb.AppendLine("EX Stack Trace: " + ex.StackTrace);
            Exception iex = ex.InnerException;
            while (iex != null)
            {
                sb.AppendLine("IEX Message: " + iex.Message);
                sb.AppendLine("IEX Stack Trace: " + iex.StackTrace);
                iex = iex.InnerException;
            }
            sb.AppendLine("End Exception");
            return sb.ToString();
        }

        public static T SendReceiveVeisRequest<T>(IPluginExecutionContext localContext, VeisConfig config, string messageId, VeisRequest request)
        {
            //localContext.TracingService.Trace("Sending Request");
            return SendReceiveVeisRequest<T>(config, messageId, request);
        }

        public static T SendReceiveVeisRequest<T>(VeisConfig config, string messageId, VeisRequest request)
        {
            string reqBody = JsonHelper.Serialize(request);
            try
            {
                if ((System.Net.ServicePointManager.SecurityProtocol & SecurityProtocolType.Tls12) == 0)
                {
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                }

                using (WebClient client = new WebClient())
                {
                    string uri;
                    if (config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/"))
                    {
                        uri = config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl + messageId;
                    }
                    else
                    {
                        uri = config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl + "/" + messageId;
                    }
                    client.AddAuthHeader(config.VeisConfiguration.CRMAuthInfo);
                    Console.WriteLine("Auth Header: " + client.Headers[HttpRequestHeader.Authorization]);
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string subKeys = config.VeisConfiguration.SvcConfigInfo.ApimSubscriptionKey;
                    if (subKeys.Length > 0)
                    {
                        string[] headers = subKeys.Split('|');
                        for (int i = 0; i < headers.Length; i = i + 2)
                        {
                            client.Headers.Add(headers[i], headers[i + 1]);
                        }
                    }
                    string response = client.UploadString(uri, reqBody);
                    if (typeof(T) == typeof(string))
                    {
                        return (T)(object)response;
                    }
                    else
                    {
                        return JsonHelper.Deserialize<T>(response);
                    }
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
                throw new Exception($"A Web exception occurred while attempting to issue the request. {exception.Message}: {callResponse} Request: {reqBody}", exception);
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.ToString());
            }
        }

        //public static T ReceiveVeisRequest<T>(ActionContext localContext, VeisConfig config, string messageId)
        //{
        //    localContext.TracingService.Trace("Sending Request");
        //    return ReceiveVeisRequest<T>(config, messageId);
        //}

        public static T ReceiveVeisRequest<T>(VeisConfig config, string messageId)
        {
            try
            {
                if ((System.Net.ServicePointManager.SecurityProtocol & SecurityProtocolType.Tls12) == 0)
                {
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                }

                using (WebClient client = new WebClient())
                {
                    string uri = string.Empty;
                    if ((config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/") && (!messageId.StartsWith("/"))) || ((!config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/")) && (messageId.StartsWith("/"))))
                    {
                        uri = config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl + messageId;
                    }
                    else if (config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/") && (messageId.StartsWith("/")))
                    {
                        uri = config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl + messageId.TrimStart('/');
                    }
                    else if ((!config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/")) && (!messageId.StartsWith("/")))
                    {
                        uri = config.VeisConfiguration.SvcConfigInfo.SvcLOBServiceUrl + "/" + messageId;
                    }
                    client.AddAuthHeader(config.VeisConfiguration.CRMAuthInfo);
                    Console.WriteLine("Auth Header: " + client.Headers[HttpRequestHeader.Authorization]);
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string subKeys = config.VeisConfiguration.SvcConfigInfo.ApimSubscriptionKey;
                    if (subKeys.Length > 0)
                    {
                        string[] headers = subKeys.Split('|');
                        for (int i = 0; i < headers.Length; i = i + 2)
                        {
                            client.Headers.Add(headers[i], headers[i + 1]);
                        }
                    }
                    string response = client.DownloadString(uri);
                    return JsonHelper.Deserialize<T>(response);
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

        public static T ReceiveVeisRequest<T>(VeisConfiguration config, string messageId)
        {
            try
            {
                if ((System.Net.ServicePointManager.SecurityProtocol & SecurityProtocolType.Tls12) == 0)
                {
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                }

                using (WebClient client = new WebClient())
                {
                    string uri = string.Empty;
                    if ((config.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/") && (!messageId.StartsWith("/"))) || ((!config.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/")) && (messageId.StartsWith("/"))))
                    {
                        uri = config.SvcConfigInfo.SvcLOBServiceUrl + messageId;
                    }
                    else if (config.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/") && (messageId.StartsWith("/")))
                    {
                        uri = config.SvcConfigInfo.SvcLOBServiceUrl + messageId.TrimStart('/');
                    }
                    else if ((!config.SvcConfigInfo.SvcLOBServiceUrl.EndsWith("/")) && (!messageId.StartsWith("/")))
                    {
                        uri = config.SvcConfigInfo.SvcLOBServiceUrl + "/" + messageId;
                    }

                    client.AddAuthHeader(config.CRMAuthInfo);
                    Console.WriteLine("Auth Header: " + client.Headers[HttpRequestHeader.Authorization]);
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string subKeys = config.SvcConfigInfo.ApimSubscriptionKey;
                    if (subKeys.Length > 0)
                    {
                        string[] headers = subKeys.Split('|');
                        for (int i = 0; i < headers.Length; i = i + 2)
                        {
                            client.Headers.Add(headers[i], headers[i + 1]);
                        }
                    }
                    string response = client.DownloadString(uri);
                    return JsonHelper.Deserialize<T>(response);
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

        /// <summary>
        /// Log Error
        /// </summary>
        /// <param name="baseUri">REST URI to the VIMT Server</param>
        /// <param name="org">CRM Organization</param>
        /// <param name="configFieldName">Not Used: Future On/Off switch</param>
        /// <param name="userId">Calling UserId</param>
        /// <param name="method">Child Calling Method or Sub Procedure</param>
        /// <param name="message">Error Message</param>
        /// <param name="callingMethod">Parent Calling Method</param>
        public static void LogError(Uri baseUri, string org, string configFieldName, Guid userId, string method, string message, string callingMethod = null)
        {
            string patsr_method;
            if (!string.IsNullOrEmpty(callingMethod))
            {
                patsr_method = callingMethod + ": " + method;
            }
            else
            {
                patsr_method = method;
            }

            try
            {
                CreateCRMLogEntryRequest logRequestStart = new CreateCRMLogEntryRequest()
                {
                    MessageId = Guid.NewGuid().ToString(),
                    OrganizationName = org,
                    UserId = userId,
                    crme_Name = string.Format("Exception: {0}:{1}", "Error in ", method),
                    crme_ErrorMessage = message,
                    crme_Debug = false,
                    crme_GranularTiming = false,
                    crme_TransactionTiming = false,
                    crme_Method = patsr_method,
                    crme_LogLevel = (int)LogLevel.Error,
                    crme_Sequence = 1,
                    NameofDebugSettingsField = configFieldName
                };

                //TODO CreateCRMLogEntryResponse logResponse = SendReceive<CreateCRMLogEntryResponse>(baseUri, WebApiUtility.CreateCRMLogEntryRequest, logRequestStart, null);
            }
            catch (Exception) { }

        }

        /// <summary>
        /// Log Error
        /// </summary>
        /// <param name="baseUri">REST URI to the VIMT Server</param>
        /// <param name="org">CRM Organization</param>
        /// <param name="configFieldName">Not Used: Future On/Off switch</param>
        /// <param name="userId">Calling UserId</param>
        /// <param name="method">Child Calling Method or Sub Procedure</param>
        /// <param name="ex">Exception to log</param>
        /// <param name="callingMethod">Parent Calling Method</param>
        public static void LogError(Uri baseUri, string org, string configFieldName, Guid userId, string method, Exception ex, string callingMethod = null)
        {
            string stackTrace = StackTraceToString(ex);
            LogError(baseUri, org, configFieldName, userId, method, stackTrace, callingMethod);
        }
        /// <summary>
        /// concatentate message and stack traces for exceptions and subsequent innerexceptions.
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string StackTraceToString(Exception ex)
        {
            StringBuilder sb = new StringBuilder();
            BuildStackTrace(ex, sb);
            return sb.ToString();
        }

        /// <summary>
        /// Recursive call to concatentate message and stack traces for exceptions and subsequent innerexceptions.
        /// </summary>
        /// <param name="ex">Exception</param>
        /// <param name="sb">StringBuilder to append to.</param>
        private static void BuildStackTrace(Exception ex, StringBuilder sb)
        {
            sb.AppendLine("***************************");
            sb.AppendLine(ex.Message);
            sb.AppendLine(ex.StackTrace);

            if (ex.InnerException != null)
            {
                BuildStackTrace(ex.InnerException, sb);
            }
        }

    }


    #region Log Messages


    #endregion

    #region VRMRest Excptions
    [Serializable]
    public class VIMTTimeOutExeption : System.Exception
    {
        public VIMTTimeOutExeption()
            : base()
        {
        }

        public VIMTTimeOutExeption(string message)
            : base(message)
        {
        }

        public VIMTTimeOutExeption(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
    #endregion


    public class MessagePayload
    {
        public string MessageId { get; set; }
        public string MessageType { get; set; }
        public bool IsQueued { get; set; }
        public string Message { get; set; }
    }

}