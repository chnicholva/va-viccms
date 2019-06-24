using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Json;
using System.Security;
using System.Text;
using System.Web.Script.Serialization;

namespace PersonSearch.Plugin
{
    public static class JsonHelper
    {
        public static T Deserialize<T>(string json)
        {
            if (!string.IsNullOrEmpty(json))
            {
                byte[] jsonBytes = Encoding.UTF8.GetBytes(json);
                using (var ms = new MemoryStream(jsonBytes))
                {
                    var settings = new DataContractJsonSerializerSettings()
                    {
                        DateTimeFormat = new System.Runtime.Serialization.DateTimeFormat("yyyy-MM-dd'T'HH:mm:ssZ"),
                        KnownTypes = Assembly.GetExecutingAssembly().DefinedTypes
                    };
                    var serializer = new DataContractJsonSerializer(typeof(T));
                    return (T)serializer.ReadObject(ms);
                }
            }
            return default(T);
        }
        public static string Serialize(object obj)
        {
            using (var ms = new MemoryStream())
            {
                var serializer = new DataContractJsonSerializer(obj.GetType());
                serializer.WriteObject(ms, obj);

                ms.Position = 0;
                using (StreamReader reader = new StreamReader(ms, Encoding.UTF8))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }
}
