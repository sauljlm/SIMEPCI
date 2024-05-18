using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{

        [Route("api/[controller]")]
        [ApiController]
        public class DiagnosticoController : Controller
        {
            [HttpPost]
            [Route("Create")]

            public ActionResult Create(Diagnostico diagnostico)
            {
                try
                {
                    var dm = new DiagnosticoManager();
                    dm.Create(diagnostico);
                    return Ok(diagnostico);

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
                var d = new Diagnostico { IdCita = id };
                var dm = new DiagnosticoManager();
                var lstDiagnosticos = dm.RetrieveByCitaId(d);
                return Ok(lstDiagnosticos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(Diagnostico diagnostico)
        {
            try
            {
                var dm = new DiagnosticoManager();
                dm.Delete(diagnostico);
                return Ok(diagnostico);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(Diagnostico diagnostico)
        {
            try
            {
                var dm = new DiagnosticoManager();
                dm.Update(diagnostico);
                return Ok(diagnostico);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

    }

        

}

