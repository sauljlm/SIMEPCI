using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaEnfermeriaController : Controller
    {
        [HttpPost]
        [Route("Create")]

        public ActionResult Create(NotaEnfermeria notaEnfermeria)
        {
            try
            {
                var em = new NotaEnfermeriaManager();
                em.Create(notaEnfermeria);
                return Ok(notaEnfermeria);

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
                var ne = new NotaEnfermeria { IdExpediente = id };
                var nem = new NotaEnfermeriaManager();
                var lstNotasEnfermeria = nem.RetrieveByExpedienteId(ne);
                return Ok(lstNotasEnfermeria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(NotaEnfermeria notaEnfermeria)
        {
            try
            {
                var nem = new NotaEnfermeriaManager();
                nem.Delete(notaEnfermeria);
                return Ok(notaEnfermeria);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(NotaEnfermeria notaEnfermeria)
        {
            try
            {
                var nem = new NotaEnfermeriaManager();
                nem.Update(notaEnfermeria);
                return Ok(notaEnfermeria);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
