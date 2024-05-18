using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisponibilidadCupoController : Controller
    {
        [HttpPost]
        [Route("Create")]
        public ActionResult Create(DisponibilidadCupo disponibilidadCupo)
        {
            try
            {
                var dc = new DisponibilidadCupoManager();
                dc.Create(disponibilidadCupo);
                return Ok(disponibilidadCupo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]
        public ActionResult Update(DisponibilidadCupo disponibilidadCupo)
        {
            try
            {
                var dc = new DisponibilidadCupoManager();
                dc.Update(disponibilidadCupo);
                return Ok(disponibilidadCupo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public ActionResult Delete(DisponibilidadCupo disponibilidadCupo)
        {
            try
            {
                var dc = new DisponibilidadCupoManager();
                dc.Delete(disponibilidadCupo);
                return Ok(disponibilidadCupo);
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
                var dc = new DisponibilidadCupoManager();
                var lstCupos = dc.RetrieveAll();
                return Ok(lstCupos);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        [Route("RetrieveById")]
        public ActionResult RetrieveById(int id)
        {
            try
            {
                var dc = new DisponibilidadCupoManager();
                var cupo = dc.RetrieveById(id);
                return Ok(cupo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
