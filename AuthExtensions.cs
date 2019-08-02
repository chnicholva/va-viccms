using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using VEIS.Plugins.Models;

namespace PersonSearch.Plugin
{
    public static class AuthExtensions
    {
        public static HttpClient AddAuthHeader(this HttpClient httpClient, CRMAuthTokenConfiguration crmAuthInfo)
        {
            AzureAccessToken token = GetAccessToken(crmAuthInfo);

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", $"{token.token_type} {token.access_token}");
            return httpClient;
        }
        public static WebClient AddAuthHeader(this WebClient webClient, CRMAuthTokenConfiguration crmAuthInfo)
        {
            AzureAccessToken token = GetAccessToken(crmAuthInfo);
            webClient.Headers[HttpRequestHeader.Authorization] = $"{token.token_type} {token.access_token}";
            return webClient;
        }

        public static AzureAccessToken GetAccessToken(CRMAuthTokenConfiguration crmAuthInfo)
        {
            AzureAccessToken token = null;
            using (WebClient client = new WebClient())
            {
                string oauthUrl = $"https://login.microsoftonline.com/{crmAuthInfo.TenantId}/oauth2/token";
                string reqBody = $"grant_type=client_credentials&client_id={Uri.EscapeDataString(crmAuthInfo.ClientApplicationId)}&client_secret={Uri.EscapeDataString(crmAuthInfo.ClientSecret)}&resource={Uri.EscapeDataString(crmAuthInfo.ResourceId)}";

                client.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";
                string response = client.UploadString(oauthUrl, reqBody);
                token = JsonHelper.Deserialize<AzureAccessToken>(response);
            }
            return token;
        }
    }
}
