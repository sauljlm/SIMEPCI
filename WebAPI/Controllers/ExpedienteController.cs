using DTOs;
using CoreApp;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ExpedienteController : Controller
    {
        [HttpGet]
        [Route("RetrieveAll")]
        public ActionResult RetrieveAll()
        {
            try
            {
                var em = new ExpedienteManager();
                var lstExpedientes = em.RetrieveAll();
                return Ok(lstExpedientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpGet]
        [Route("RetrieveByPacienteId")]
        public ActionResult RetrieveByPacienteId(int id)
        {
            try
            {
                var e = new Expediente { IdUsuarioPaciente = id };
                var em = new ExpedienteManager();
                var lstExpedientes = em.RetrieveByPacienteId(e);
                return Ok(lstExpedientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        [Route("Create")]

        public ActionResult Create(Expediente expediente)
        {
            try
            {
                var em = new ExpedienteManager();
                em.Create(expediente);
                return Ok(expediente);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(Expediente expediente)
        {
            try
            {
                var um = new ExpedienteManager();
                um.Delete(expediente);
                return Ok(expediente);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(Expediente expediente)
        {
            try
            {
                var um = new ExpedienteManager();
                um.Update(expediente);
                return Ok(expediente);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
