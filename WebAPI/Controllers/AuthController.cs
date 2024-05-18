 using Microsoft.AspNetCore.Mvc;
using DTOs.Security;
using Microsoft.Extensions.Options;
using CoreApp.Authorization.General;
using Microsoft.AspNetCore.Authorization;
using OtpNet;
using System.Net.Mail;
using System.Net;
using webapi.Authorization.General;
using DTOs;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("Security")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppSettings _applicationSettings;

        public AuthController(IOptions<AppSettings> _applicationSettings)
        {
            this._applicationSettings = _applicationSettings.Value;

        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] AuthenticationRequest model)
        {
            try
            {
                AuthenticationResponse responseSecurity = null;
                model.setReq(AuthenticationRequest.UserHostAddress(HttpContext), HttpContext.Request.Headers["User-Agent"]);

                Token token = new Token(this._applicationSettings.Secret, HttpContext.Response.Cookies);
                await Task.Run(() => responseSecurity = AccountSecurity.Authentication(model, token)).ConfigureAwait(false);


                return Ok(responseSecurity);
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex);
            }


        }

        [HttpPost("OlvidoContrasena")]
        public async Task<IActionResult> ForgotPassword([FromQuery] string usuario)
        {
            try
            {
                // Generar una clave secreta única para el usuario
                var secretKey = KeyGeneration.GenerateRandomKey(6);

                // Obtener el valor del OTP en función de la hora actual
                var totp = new Totp(secretKey);
                string otpValue = totp.ComputeTotp(DateTime.UtcNow);


                string userEmail = AccountSecurity.GeneratedOTP(usuario, otpValue);
                if(userEmail != null)
                {
                    // Configurar los detalles del correo electrónico
                    string remitente = "simepcitec@gmail.com";
                    string asunto = "Nueva contraseña de autenticacion";
                    string cuerpoMensaje = "Estimado cliente,\r\n\r\nLe informamos que se ha generado una nueva contraseña para su cuenta: " + otpValue + " . Por motivos de seguridad, le solicitamos que proceda a cambiar su contraseña lo antes posible.\r\n\r\nTenga en cuenta que esta contraseña temporal tiene una validez de 20 minutos a partir de este momento. Después de este período, deberá generar una nueva contraseña.\r\n\r\nLe recomendamos tomar las medidas necesarias para actualizar su contraseña lo antes posible.\r\n\r\nGracias por su comprensión y colaboración.\r\n\r\nAtentamente,";

                    // Configurar las credenciales del remitente
                    string correoRemitente = "simepcitec@gmail.com";
                    string contraseña = "fngg pxvc pldf nqvc";

                    // Configurar el servidor SMTP de Gmail y el puerto
                    SmtpClient clienteSmtp = new SmtpClient("smtp.gmail.com", 587);

                    // Habilitar SSL
                    clienteSmtp.EnableSsl = true;

                    // Autenticación
                    clienteSmtp.Credentials = new NetworkCredential(correoRemitente, contraseña);

                    try
                    {
                        // Crear el mensaje de correo
                        MailMessage mensaje = new MailMessage(remitente, userEmail, asunto, cuerpoMensaje);

                        // Enviar el correo
                        clienteSmtp.Send(mensaje);

                        return Ok(new { message = usuario});
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, "Error al enviar el correo: " + ex.Message);
                    }
                }
                return Ok(new { message = "Usuario no encontrado" });
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }


        }

        [Authorize]
        [HttpGet("CambiarContrasena")]
        public async Task<IActionResult> ChangePassword([FromQuery] string contrasena)
        {
            try
            {
                Usuario usuario = new Usuario();

                usuario = JWTSecurity.RequestToUser(HttpContext);
                AccountSecurity.CambiarContra(usuario.Identificacion, contrasena);

                return Ok(new { message = "Cambiada con exito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message} );
            }


        }
    }
}
