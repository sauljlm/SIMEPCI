using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.Globalization;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitaController : Controller
    {
        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> Create(Cita cita)
        {
            try
            {
                var ci = new CitaManager();
                var um = new UsuarioManager();
                var dm = new DisponibilidadCupoManager();

                ci.Create(cita);

                var usuario = await Task.Run(() => um.RetrieveByExpediente(cita.IdExpediente));
                var cupo = await Task.Run(() => dm.RetrieveById(cita.IdDisponibilidadCupo));

                string userEmail = usuario.Correo;

                // Obtener la fecha y hora por separado
                DateTime fechaHora = cupo.HoraCupo;
                string fecha = fechaHora.ToString("dd/MM/yyyy");
                string hora = fechaHora.ToString(@"hh\:mm tt", CultureInfo.CurrentCulture);


                // Configurar los detalles del correo electrónico
                string asunto = $"Confirmación cita {fecha} {hora}";
                string cuerpoMensaje = $@"
                <div style=""width: 100%; max-width: 800px; margin: auto; padding-top: 40px; padding-bottom: 40px;"">
                    <div style=""border: 2px solid #CDDDED; background: white; width: 100%; border-radius: 20px; text-align: center; box-shadow: -1px 15px 30px -12px black;"">
                            <div style=""background-color: #CDDDED; border-radius: 20px 20px 0 0; text-align: left; font-size: 15px; font-weight: 700; padding: 20px;"">
                                <img src=""https://i.imgur.com/KNLtoSa.png"" alt=""Logo SIMEPCI"" style=""width: 100px; vertical-align: middle;"">
                            <span style=""margin-left: 10px; color: #0353A4; font-weight: bold;"">¡Hola {usuario.Nombre}!</span>
                            </div>
                        <div style=""margin-left: 50px; font-size: 26px; color: black; font-weight: 900; margin-top: 30px; margin-bottom: 20px; text-align: left; color: #0353A4;"">Cita Agendada</div>
                        <div style=""margin-left: 50px; margin-bottom: 30px; text-align:left;"">
                        <p style=""font-size: 16px; line-height: 1.5; text-align: left; color: black;"">
                            <span style=""color: #0353A4; font-weight:bold;"">Nombre del doctor/a:</span> {cupo.NombreDoctor} {cupo.ApellidoUnoDoctor} {cupo.ApellidoDosDoctor}<br>
                            <span style=""color: #0353A4; font-weight:bold;"">Nombre del Paciente:</span> {usuario.Nombre} {usuario.ApellidoUno} {usuario.ApellidoDos}<br>
                            <span style=""color: #0353A4; font-weight:bold;"">Especialidad Médica:</span> {cupo.Especialidad}<br>
                            <span style=""color: #0353A4; font-weight:bold;"">Sede de Consulta:</span> {cupo.NombreSede}<br>
                            <span style=""color: #0353A4; font-weight:bold;"">Ubicación Sede:</span> {cupo.Provincia}, {cupo.Distrito}, {cupo.Canton}
                        </p>
                        </div>
                        <div style=""background: #CDDDED; color: white; font-weight: 700; border-radius: 0 0 20px 20px; overflow: hidden;"">
                            <div style=""width: 50%; float: left; padding: 20px 15px; box-sizing: border-box; position: relative; border-right: solid 2px #A6B2BF;"">
                                <div style=""font-size: 24px; margin-bottom: 10px; color: black;""><span style=""color: #0353A4;"">Fecha:</span> {fecha}</div>
                            </div>
                            <div style=""width: 50%; float: left; padding: 20px 15px; box-sizing: border-box; position: relative;"">
                                <div style=""font-size: 24px; margin-bottom: 10px; color: black;""><span style=""color: #0353A4;"">Hora:</span> {hora}</div>
                            </div>
                        </div>
                    </div>
                </div>
                ";

                // Configurar las credenciales del remitente
                string correoRemitente = "simepcitec@gmail.com";
                string contraseña = "fngg pxvc pldf nqvc";

                using (SmtpClient clienteSmtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    clienteSmtp.EnableSsl = true;
                    clienteSmtp.Credentials = new NetworkCredential(correoRemitente, contraseña);

                    // Crear el mensaje de correo
                    MailMessage mensaje = new MailMessage(correoRemitente, userEmail, asunto, cuerpoMensaje);
                    mensaje.IsBodyHtml = true;

                    try
                    {
                        // Enviar el correo asíncronamente
                        await clienteSmtp.SendMailAsync(mensaje);

                        return Ok(new { message = "Cita creada exitosamente" });
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, "Error al enviar el correo: " + ex.Message);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    

        [HttpDelete]
        [Route("Delete")]
        public ActionResult Delete(Cita cita)
        {
            try
            {
                var ci = new CitaManager();
                ci.Delete(cita);
                return Ok(cita);
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
                var ci = new CitaManager();
                var lstCitas = ci.RetrieveAll();
                return Ok(lstCitas);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet]
        [Route("Impuestos")]
        public ActionResult RetrieveAllImpuestos()
        {
            try
            {
                var ci = new ImpuestoManager();
                var lstCitas = ci.RetrieveAll();
                return Ok(lstCitas);

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
                var ci = new CitaManager();
                var cita = ci.RetrieveCitaById(id);
                return Ok(cita);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("ValidarPagos")]
        public ActionResult ValidarAgendados(int id)
        {
            try
            {
                var ci = new CitaManager();
                int cita = ci.ValidarAgendados(id);
                return Ok(new
                {
                    resultado = cita
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveByExpedienteId")]
        public ActionResult RetrieveByExpedienteId(int id)
        {
            try
            {
                var c = new Cita { IdExpediente = id };
                var cm = new CitaManager();
                var lstCitas = cm.RetrieveByExpedienteId(c);
                return Ok(lstCitas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPost]
        [Route("ServiceQualityForm")]
        public async Task<IActionResult> ServiceQualityForm(Cita cita)
        {
            try
            {
                var um = new UsuarioManager();
                var dm = new DisponibilidadCupoManager();
                var cm = new CitaManager();

                var usuario = await Task.Run(() => um.RetrieveByExpediente(cita.IdExpediente));
                var cupo = await Task.Run(() => dm.RetrieveById(cita.IdDisponibilidadCupo));

                string userEmail = usuario.Correo;
                string fecha = cupo.HoraCupo.ToString("dd/MM/yyyy");

                // Configurar los detalles del correo electrónico
                string remitente = "simepcitec@gmail.com";
                string asunto = "Formulario de calidad de servicio";
                string baseUrl = "https://localhost:7081/";
                string rutaConfirmarCorreo = "api/Cita/SendAnswers";
                string urlConfirmacion = $"{baseUrl}{rutaConfirmarCorreo}?idUsuario={usuario.Id}&idCupo={cita.IdDisponibilidadCupo}";
                string cuerpoMensaje = $@"
                <div style=""width: 100%; max-width: 800px; margin: auto; padding-top: 40px; padding-bottom: 40px;"">
                    <div style=""border: 2px solid #CDDDED; background: white; width: 100%; border-radius: 20px; text-align: center; box-shadow: -1px 15px 30px -12px black;"">
                        <div style=""background-color: #CDDDED; border-radius: 20px 20px 0 0; text-align: left; font-size: 15px; font-weight: 700; padding: 20px;"">
                            <img src=""https://i.imgur.com/KNLtoSa.png"" alt=""Logo SIMEPCI"" style=""width: 100px; vertical-align: middle;"">
                            <span style=""margin-left: 10px; color: #0353A4; font-weight: bold;"">Formulario de Calidad de Servicio</span>
                        </div>
                        <form action=""{urlConfirmacion}"" method=""post"">
                             <div style=""margin-left: 50px; margin-right: 50px; margin-bottom: 30px; text-align: left;"">
                                <p style=""font-size: 16px; line-height: 1.5; color: black;"">
                                    <span style=""color: #0353A4; font-weight:bold;"">Nombre del Paciente:</span> {usuario.Nombre}<br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Servicio Recibido:</span> {cupo.Especialidad}<br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Fecha de la visita:</span> {fecha}<br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Cortesía y Amabilidad:</span> <input type=""number"" min=""1"" max=""5"" name=""cortesia"" required><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Trato Recibido:</span> <input type=""number"" min=""1"" max=""5"" name=""trato"" required><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Infraestructura y Limpieza:</span> <input type=""number"" min=""1"" max=""5"" name=""infraestructura"" required><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Tiempo de Espera:</span> <input type=""number"" min=""1"" max=""5"" name=""tiempoEspera"" required><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Satisfacción con el tratamiento recibido:</span> <input type=""number"" min=""1"" max=""5"" name=""satisfaccionTratamiento"" required><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Sugerencias Específicas:</span><br>
                                    <textarea name=""sugerencias"" rows=""4"" cols=""50"" required></textarea><br>
                                    <span style=""color: #0353A4; font-weight:bold;"">Calificación en General:</span> <input type=""number"" min=""1"" max=""5"" name=""calificacionGeneral"" required><br>
                                </p>
                            </div>
                            <div style=""background: #CDDDED; color: white; font-weight: 700; border-radius: 0 0 20px 20px; overflow: hidden;"">
                                <div style=""width: 100%; padding: 20px 15px; box-sizing: border-box;"">
                                    <button type=""submit"" style=""background-color: #0353A4; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;"">Enviar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                ";

                string correoRemitente = "simepcitec@gmail.com";
                string contraseña = "fngg pxvc pldf nqvc";

                SmtpClient clienteSmtp = new SmtpClient("smtp.gmail.com", 587);

                clienteSmtp.EnableSsl = true;

                clienteSmtp.Credentials = new NetworkCredential(correoRemitente, contraseña);

                try
                {
                    MailMessage mensaje = new MailMessage(remitente, userEmail, asunto, cuerpoMensaje);

                    mensaje.IsBodyHtml = true;

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

        [HttpPost]
        [Route("SendAnswers")]
        public async Task<IActionResult> SendAnswers([FromQuery] int idUsuario, [FromQuery] int idCupo, [FromForm] int cortesia, [FromForm] int trato, [FromForm] int infraestructura, [FromForm] int tiempoEspera, [FromForm] int satisfaccionTratamiento, [FromForm] string sugerencias, [FromForm] int calificacionGeneral)
        {
            try
            {
                var sq = new CalidadServicioManager();
                var calidadServicio = new CalidadServicio();
                var dm = new DisponibilidadCupoManager();
                var cupo = await Task.Run(() => dm.RetrieveById(idCupo));


                calidadServicio.IdUsuario = idUsuario;
                calidadServicio.Servicio = cupo.Especialidad;
                calidadServicio.FechaVisita = cupo.HoraCupo;
                calidadServicio.Cortesia = cortesia;
                calidadServicio.Trato = trato;
                calidadServicio.Infraestructura = infraestructura;
                calidadServicio.TiempoEspera = tiempoEspera;
                calidadServicio.SatisfaccionTratamiento = satisfaccionTratamiento;
                calidadServicio.Sugerencias = sugerencias;
                calidadServicio.CalificacionGeneral = calificacionGeneral;

                sq.Create(calidadServicio);

                return Ok(calidadServicio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al procesar el formulario: " + ex.Message);
            }
        }
    }
}
