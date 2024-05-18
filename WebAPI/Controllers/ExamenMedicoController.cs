using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamenMedicoController : Controller
    {
        [HttpPost]
        [Route("Create")]

        public ActionResult Create(ExamenMedico examenMedico)
        {
            try
            {
                var em = new ExamenMedicoManager();
                em.Create(examenMedico);
                return Ok(examenMedico);

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
                var em = new ExamenMedico { IdExpediente = id };
                var emm = new ExamenMedicoManager();
                var lstExamenMedicos = emm.RetrieveByExpedienteId(em);
                return Ok(lstExamenMedicos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(ExamenMedico examenMedico)
        {
            try
            {
                var emm = new ExamenMedicoManager();
                emm.Delete(examenMedico);
                return Ok(examenMedico);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(ExamenMedico examenMedico)
        {
            try
            {
                var emm = new ExamenMedicoManager();
                emm.Update(examenMedico);
                return Ok(examenMedico);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
