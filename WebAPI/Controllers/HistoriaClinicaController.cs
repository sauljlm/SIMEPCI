using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoriaClinicaController : Controller
    {
        [HttpPost]
        [Route("Create")]

        public ActionResult Create(HistoriaClinica historiaClinica)
        {
            try
            {
                var em = new HistoriaClinicaManager();
                em.Create(historiaClinica);
                return Ok(historiaClinica);

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
                var hc = new HistoriaClinica { IdExpediente = id };
                var hcm = new HistoriaClinicaManager();
                var lstHistoriaClinicas = hcm.RetrieveByExpedienteId(hc);
                return Ok(lstHistoriaClinicas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(HistoriaClinica historiaClinica)
        {
            try
            {
                var hcm = new HistoriaClinicaManager();
                hcm.Delete(historiaClinica);
                return Ok(historiaClinica);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(HistoriaClinica historiaClinica)
        {
            try
            {
                var hcm = new HistoriaClinicaManager();
                hcm.Update(historiaClinica);
                return Ok(historiaClinica);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
