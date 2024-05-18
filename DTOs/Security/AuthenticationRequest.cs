using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Http;

namespace DTOs.Security
{
    [Serializable(), DataContract()]
    public class AuthenticationRequest
    {

        /// <summary>
        /// Identificacion
        /// </summary>
        [DataMember(), Required] public int identificacion { get; set; }
        /// <summary>
        /// Clave de acceso
        /// </summary>
        [DataMember(), Required] public string Password { get; set; }

        /// <summary>
        /// Dirección IP/Nombre de la maquina donde se hizo la solicitud.
        /// </summary>
        [DataMember()] public string? IPAddress { get; set; }
        /// <summary>
        /// Información sobre el dispositivo de consulta que efectúa una petición de red.
        /// </summary>
        [DataMember()] public string? UserAgent { get; set; }

        public static string UserHostAddress(HttpContext context)
        {
            string result = string.Empty;



            if (context != null)
            {
                if (context.Connection.RemoteIpAddress != null)
                    result = context.Connection.RemoteIpAddress.ToString();
            }
            if (string.Equals(result, "::1", StringComparison.CurrentCultureIgnoreCase))
                result = "127.0.0.1";

            if (string.IsNullOrEmpty(result))
                result = "127.0.0.1";

            return result;
        }

        public AuthenticationRequest()
        {
            identificacion = 0;
            Password = string.Empty;
            IPAddress = "";
            UserAgent = "";
        }

        public AuthenticationRequest(string ipaddress, int identificacion, string useragent)
        {
            this.identificacion = identificacion;
            UserAgent = useragent;
            IPAddress = ipaddress;
            Password = string.Empty;
        }

        public void setReq(string ipaddress, string useragent)
        {
            IPAddress = ipaddress;
            UserAgent = useragent;
        }


    }
}
