using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Serialization.Json;
using System.Security;
using System.Text;
using System.Web.Script.Serialization;

namespace VCCM.VistA.Actions
{
    public static class JsonHelper
    {
        public static void WriteSecure(this StreamWriter writer, SecureString sec)
        {
            int length = sec.Length;
            if (length == 0)
                return;
            IntPtr ptr = Marshal.SecureStringToBSTR(sec);
            try
            {
                // each char in that string is 2 bytes, not one (it's UTF-16 string)
                for (int i = 0; i < length * 2; i += 2)
                {
                    // so use ReadInt16 and convert resulting "short" to char
                    var ch = Convert.ToChar(Marshal.ReadInt16(ptr + i));
                    // write
                    writer.Write(ch);
                }
            }
            finally
            {
                // don't forget to zero memory
                Marshal.ZeroFreeBSTR(ptr);
            }
        }
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
