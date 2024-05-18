using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteController : ControllerBase
    {
        [HttpPost]
        [Route("Create")]
        public ActionResult Create(CalidadServicio calidadServicio)
        {
            try
            {
                var cs = new CalidadServicioManager();
                cs.Create(calidadServicio);

                return Ok(calidadServicio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveAllCalidadServicio")]

        public ActionResult RetrieveAllCalidadServicio()
        {
            try
            {
                var cs = new CalidadServicioManager();
                var lstOpiniones = cs.RetrieveAll();

                return Ok(lstOpiniones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveAllReporteFinanciero")]

        public ActionResult RetrieveAllReporteFinanciero()
        {
            try
            {
                var rf = new ReporteFinancieroManager();
                var lstReportes = rf.RetrieveAll();

                return Ok(lstReportes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveServicioByIdCita/{idCita}")]
        public async Task<IActionResult> RetrieveServicioByIdCita(int idCita)
        {
            try
            {
                var cm = new CitaManager();
                var dm = new DisponibilidadCupoManager();

                var cita = await Task.Run(() => cm.RetrieveCitaById(idCita));
                var cupo = await Task.Run(() => dm.RetrieveById(cita.IdDisponibilidadCupo));

                var servicio = cupo.Especialidad;

                return Ok(servicio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}
