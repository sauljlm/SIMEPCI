using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaMedicaController : Controller
    {
        [HttpPost]
        [Route("Create")]

        public ActionResult Create(NotaMedica notaMedica)
        {
            try
            {
                var em = new NotaMedicaManager();
                em.Create(notaMedica);
                return Ok(notaMedica);

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
                var nm = new NotaMedica { IdExpediente = id };
                var nmm = new NotaMedicaManager();
                var lstNotasMedicas = nmm.RetrieveByExpedienteId(nm);
                return Ok(lstNotasMedicas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(NotaMedica notaMedica)
        {
            try
            {
                var nmm = new NotaMedicaManager();
                nmm.Delete(notaMedica);
                return Ok(notaMedica);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(NotaMedica notaMedica)
        {
            try
            {
                var nmm = new NotaMedicaManager();
                nmm.Update(notaMedica);
                return Ok(notaMedica);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
