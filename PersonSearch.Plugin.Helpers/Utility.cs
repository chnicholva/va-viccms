using System;
using System.IO;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;

namespace PersonSearch.Plugin.Helpers
{
	public class Utility
	{
		public enum LogLevel
		{
			Debug = 935950000,
			Info,
			Warn,
			Error,
			Fatal,
			Timing
		}

		public const string OneWayPassTest = "TestMessages#OneWayPassTest";

		public const string TwoWayPassTest = "TestMessages#TwoWayPassTest";

		public const string CreateCRMLogEntryRequest = "CRMe#CreateCRMLogEntryRequest";

		private const string _urlRestPath = "/Servicebus/Rest/{0}";

		private const string _urlParams = "?messageId={0}&messageType=text%2Fjson&isQueued=false";

		private const string SEND = "Send";

		private const string SEND_RECEIVE = "SendReceive";

		public static HttpResponseMessage Send(Uri baseUri, string messageId, object requestObj, LogSettings logSettings)
		{
			HttpResponseMessage httpResponseMessage = null;
			Uri requestUri = FormatUri(baseUri, "Send", messageId);
			try
			{
				using (HttpClient httpClient = new HttpClient())
				{
					string empty = string.Empty;
					using (MemoryStream content = ObjectToJSonStream(requestObj))
					{
						using (StreamContent content2 = new StreamContent(content))
						{
							httpResponseMessage = httpClient.PostAsync(requestUri, content2).Result;
							httpResponseMessage.EnsureSuccessStatusCode();
						}
					}
				}
			}
			catch (Exception ex)
			{
				if (logSettings != null)
				{
					LogError(baseUri, logSettings, "Send", ex);
				}
				throw;
			}
			return httpResponseMessage;
		}

		public static void SendAsync(Uri baseUri, string messageId, object obj, LogSettings logSettings, Action<HttpResponseMessage> callBack)
		{
			new Thread((ThreadStart)delegate
			{
				try
				{
					Thread.CurrentThread.IsBackground = false;
					HttpResponseMessage obj2 = Send(baseUri, messageId, obj, logSettings);
					if (callBack != null)
					{
						callBack(obj2);
					}
				}
				catch (Exception ex)
				{
					if (logSettings != null)
					{
						LogError(baseUri, logSettings, "SendAsync", ex);
					}
				}
			}).Start();
		}

		public static T SendReceive<T>(Uri baseUri, string messageId, object obj, LogSettings logSettings)
		{
			string message = string.Empty;
			Uri requestUri = FormatUri(baseUri, "SendReceive", messageId);
			try
			{
				using (HttpClient httpClient = new HttpClient())
				{
					using (MemoryStream content = ObjectToJSonStream(obj))
					{
						string result2;
						using (StreamContent content2 = new StreamContent(content))
						{
							HttpResponseMessage result = httpClient.PostAsync(requestUri, content2).Result;
							result.EnsureSuccessStatusCode();
							result2 = result.Content.ReadAsStringAsync().Result;
						}
						int num = result2.IndexOf("<Message>") + 9;
						int num2 = result2.IndexOf("</Message>");
						if (num2 != -1)
						{
							message = result2.Substring(num, num2 - num);
						}
					}
				}
			}
			catch (Exception ex)
			{
				if (logSettings != null)
				{
					LogError(baseUri, logSettings, "SendReceive", ex);
				}
				throw;
			}
			return DeserializeResponse<T>(message);
		}

		public static Uri FormatUri(Uri baseUri, string method, string messageId)
		{
			string str = $"/Servicebus/Rest/{method}";
			string str2 = $"?messageId={HttpUtility.UrlEncode(messageId)}&messageType=text%2Fjson&isQueued=false";
			Uri relativeUri = new Uri(str + str2, UriKind.Relative);
			return new Uri(baseUri, relativeUri);
		}

		private static T DeserializeResponse<T>(string message)
		{
			byte[] bytes = Convert.FromBase64String(message);
			UTF8Encoding uTF8Encoding = new UTF8Encoding();
			string @string = uTF8Encoding.GetString(bytes);
			string text = Regex.Replace(@string, "new Date\\(([-+0-9]*)\\)", "\"\\/Date($1)\\/\"");
			using (MemoryStream memoryStream = new MemoryStream())
			{
				memoryStream.Write(uTF8Encoding.GetBytes(text), 0, text.Length);
				memoryStream.Position = 0L;
				DataContractJsonSerializer dataContractJsonSerializer = new DataContractJsonSerializer(typeof(T));
				return (T)dataContractJsonSerializer.ReadObject((Stream)memoryStream);
			}
		}

		private static MemoryStream ObjectToJSonStream(object obj)
		{
			MemoryStream memoryStream = new MemoryStream();
			DataContractJsonSerializer dataContractJsonSerializer = new DataContractJsonSerializer(obj.GetType());
			dataContractJsonSerializer.WriteObject((Stream)memoryStream, obj);
			memoryStream.Position = 0L;
			return memoryStream;
		}

		public static void LogError(Uri baseUri, string org, string configFieldName, Guid userId, string method, string message, string callingMethod)
		{
			try
			{
				CreateCRMLogEntryRequest createCRMLogEntryRequest = new CreateCRMLogEntryRequest();
				createCRMLogEntryRequest.MessageId = Guid.NewGuid().ToString();
				createCRMLogEntryRequest.OrganizationName = org;
				createCRMLogEntryRequest.UserId = userId;
				createCRMLogEntryRequest.crme_Name = string.Format("Exception: {0}:{1}", "Error in ", method);
				createCRMLogEntryRequest.crme_ErrorMessage = message;
				createCRMLogEntryRequest.crme_Debug = false;
				createCRMLogEntryRequest.crme_GranularTiming = false;
				createCRMLogEntryRequest.crme_TransactionTiming = false;
				createCRMLogEntryRequest.crme_Method = callingMethod + ":" + method;
				createCRMLogEntryRequest.crme_LogLevel = 935950003;
				createCRMLogEntryRequest.crme_Sequence = 1;
				createCRMLogEntryRequest.NameofDebugSettingsField = configFieldName;
				CreateCRMLogEntryRequest obj = createCRMLogEntryRequest;
				CreateCRMLogEntryResponse createCRMLogEntryResponse = SendReceive<CreateCRMLogEntryResponse>(baseUri, "CRMe#CreateCRMLogEntryRequest", obj, null);
			}
			catch (Exception)
			{
			}
		}

		public static void LogError(Uri baseUri, string org, string configFieldName, Guid userId, string method, Exception ex, string callingMethod)
		{
			string message = StackTraceToString(ex);
			LogError(baseUri, org, configFieldName, userId, method, message, callingMethod);
		}

		public static void LogError(Uri baseUri, LogSettings logSettings, string method, Exception ex)
		{
			LogError(baseUri, logSettings.Org, logSettings.ConfigFieldName, logSettings.UserId, method, ex, logSettings.callingMethod);
		}

		public static string StackTraceToString(Exception ex)
		{
			StringBuilder sb = new StringBuilder();
			sb = StackTraceToString(ex, sb);
			return sb.ToString();
		}

		internal static StringBuilder StackTraceToString(Exception ex, StringBuilder sb)
		{
			sb.AppendLine("***************************");
			sb.AppendLine(ex.Message);
			sb.AppendLine(ex.StackTrace);
			if (ex.InnerException != null)
			{
				sb = StackTraceToString(ex.InnerException, sb);
			}
			return sb;
		}
	}
}
