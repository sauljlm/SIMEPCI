using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecetaController : Controller
    {
        [HttpPost]
        [Route("Create")]
        public ActionResult Create(Receta receta)
        {
            try
            {
                var re = new RecetaManager();
                re.Create(receta);
                return Ok(receta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]
        public ActionResult Update(Receta receta)
        {
            try
            {
                var re = new RecetaManager();
                re.Update(receta);
                return Ok(receta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public ActionResult Delete(Receta receta)
        {
            try
            {
                var re = new RecetaManager();
                re.Delete(receta);
                return Ok(receta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveByCitaId")]
        public ActionResult RetrieveByCitaId(int id)
        {
            try
            {
                var r = new Receta { IdCita = id };
                var rm = new RecetaManager();
                var lstRecetas = rm.RetrieveByCitaId(r);
                return Ok(lstRecetas);
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
                var re = new RecetaManager();
                var lstRecetas = re.RetrieveAll();
                return Ok(lstRecetas);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
