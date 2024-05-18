using CoreApp;
using CoreApp.Authorization.General;
using DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OtpNet;
using System.Net.Mail;
using System.Net;
using DTOs.Security;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        [HttpPost]
        [Route("Create")]
        public ActionResult Create(Usuario user)
        {
            try
            {
                var um = new UsuarioManager();
                um.Create(user);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]
        public ActionResult Update(Usuario user)
        {
            try
            {
                var um = new UsuarioManager();
                um.Update(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(Usuario usuario)
        {
            try
            {
                var um = new UsuarioManager();
                um.Delete(usuario);
                return Ok(usuario);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveAll")]

        public ActionResult RetrieveAll()
        {
            try
            {
                var um = new UsuarioManager();
                var lstUsers = um.RetrieveAll();

                return Ok(lstUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveAllTipo")]

        public ActionResult RetrieveAllTipo()
        {
            try
            {
                var um = new UsuarioManager();
                var lstUsers = um.RetrieveAllTipo();

                return Ok(lstUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet]
        [Route("RetrieveById/{id}")]
        public ActionResult RetrieveById(int id)
        {
            try
            {
                var um = new UsuarioManager();
                var usuario = um.RetrieveUsuarioById(new Usuario { Id = id });
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet]
        [Route("RetrieveByEmail")]
        public ActionResult RetrieveByEmail(string email)
        {
            try
            {
                var u = new Usuario { Correo = email };
                var um = new UsuarioManager();
                var user = um.RetrieveUserByEmail(u);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveByIdentificacion")]
        public ActionResult RetrieveByIdentificacion(int identificacion)
        {
            try
            {
                var um = new UsuarioManager();
                var user = um.RetrieveUserByIdentificacion(identificacion);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveByExpediente")]
        public ActionResult RetrieveByExpediente(int id)
        {
            try
            {
                var um = new UsuarioManager();
                var user = um.RetrieveByExpediente(id);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveAllPacientes")]

        public ActionResult RetrieveAllPacientes()
        {
            try
            {
                var um = new UsuarioManager();
                var lstUsers = um.RetrieveAllPacientes();
                return Ok(lstUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }               

        [HttpPost]
        [Route("Authenticate")]
        public async Task<IActionResult> AuthenticateEmail(Usuario user)
        {
            try
            {
                string userEmail = user.Correo;

                // Configurar los detalles del correo electrónico
                string remitente = "simepcitec@gmail.com";
                string asunto = "Confirmacion de correo electronico";
                string baseUrl = "https://localhost:7081/";
                string rutaConfirmarCorreo = "api/Usuario/ConfirmarCorreo";
                string urlConfirmacion = $"{baseUrl}{rutaConfirmarCorreo}?identification={user.Identificacion}";
                string cuerpoMensaje = $"Estimado cliente,<br/><br/>Por favor haz click en el siguiente enlace para confirmar tu correo electrónico:<br/><br/><a href=\"{urlConfirmacion}\"><button style=\"padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;\">Confirmar Correo</button></a><br/><br/>Gracias!";
                
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

                    // Establecer el tipo de contenido del cuerpo del mensaje como HTML
                    mensaje.IsBodyHtml = true;

                    // Enviar el correo
                    clienteSmtp.Send(mensaje);

                    return Ok(new { message = userEmail });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error al enviar el correo: " + ex.Message);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet]
        [Route("ConfirmarCorreo")]
        public ActionResult ConfirmarCorreo(int identification)
        {
            try
            {
                var um = new UsuarioManager();

                var user = um.RetrieveUserByIdentificacion(identification);
                if (user != null)
                {
                    user.AutentificacionCorreo = 1;
                    um.AuthenticateEmail(user);
                    return Ok("Correo electrónico confirmado correctamente.");
                }
                else
                {
                    return BadRequest("ID de usuario inválido.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
