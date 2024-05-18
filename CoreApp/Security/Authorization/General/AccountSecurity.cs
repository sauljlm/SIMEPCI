using DTOs;
using webapi.Authorization.General;
using DTOs.Security;
using DataAccess.CRUD;

namespace CoreApp.Authorization.General
{
    public class AccountSecurity
    {
        public static AuthenticationResponse Authentication(AuthenticationRequest authenticationRequest, Token token)
        {
            AuthenticationResponse result = new AuthenticationResponse();

            token.setExpires(40);

            Usuario userLog = null;
            
            if (authenticationRequest.identificacion == 0)
            {
                result.Reason = "Debe indicar la identificacion";
            }
            else if(string.IsNullOrEmpty(authenticationRequest.Password))
            {
                result.Reason = "Debe indicar la contraseña";
            }


            if(string.IsNullOrEmpty(result.Reason))
            {

                UsuarioCrudFactory userData = new UsuarioCrudFactory();
                try
                {
                    userLog = userData.CredentialUsuario<Usuario>(authenticationRequest.identificacion.ToString(), authenticationRequest.Password);
                    token.UserToToken(userLog);
                    result.setToken(token, JWTSecurity.JWTGenerator);
                }
                catch(Exception ex)
                {
                    result.Reason = ex.Message;
                }

            }

            return result;
        }

        public static string GeneratedOTP(string usuario, string contrasenna)
        {
            UsuarioCrudFactory userData = new UsuarioCrudFactory();

            Usuario userLog = userData.RetrieveByIdentificacion<Usuario>(usuario);
            if(userLog == null)
            {
                return null;
            }

            return userData.CreateOTP(userLog.Id, contrasenna);
        }

        public static void CambiarContra(int idUsuario, string contrasenna)
        {
            UsuarioCrudFactory userData = new UsuarioCrudFactory();

           userData.CreateContra(idUsuario, contrasenna);
        }
    } 
}
