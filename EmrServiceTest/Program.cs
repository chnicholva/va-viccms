using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EmrServiceTest
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                //  try to hit EmrService 
                string apiUrl = "https://vaww.viapreprod.va.gov/via-webservices/services/EmrService";
                HttpWebRequest apiRequest = (HttpWebRequest)WebRequest.Create(apiUrl);
                //  implement subscription key
                //string subKeys = settings.GetAttributeValue<string>("ftp_mvisubscriptionkey");
                //if (subKeys.Length > 0)
                //{
                //    string[] headers = subKeys.Split('|');
                //    for (int i = 0; i < headers.Length; i = i + 2)
                //    {
                //        apiRequest.Headers.Add(headers[i], headers[i + 1]);
                //    }
                //}
                apiRequest.Method = "POST";
                apiRequest.ContentType = "application/xml";
                string postData = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.via.med.va.gov/'>"+
                    "<soapenv:Header/><soapenv:Body><ser:loginVIA><queryBean><requestingApp>VCCM_APP</requestingApp><consumingAppToken>VCCM_ID_3877</consumingAppToken>"+
                    "<consumingAppPassword>hG3Ce5M!r5k8</consumingAppPassword></queryBean><accessCode>4543BGL</accessCode><verifyCode>TEST0987!</verifyCode><siteCode>991</siteCode>"+
                    "</ser:loginVIA></soapenv:Body></soapenv:Envelope>";
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

                Console.WriteLine(apiStringResponse);
            }
            catch(Exception ex)
            {
                Console.WriteLine("ERROR:: {0}", ex.Message);
            }
            Console.WriteLine("done...");
            Console.ReadLine();
        }
    }
}
