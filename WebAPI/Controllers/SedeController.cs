using CoreApp;
using DTOs;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SedeController : ControllerBase
    {
        [HttpGet]
        [Route("RetrieveAll")]
        public ActionResult RetrieveAll()
        {
            try
            {
                var sm = new SedeManager();
                var lstSedes = sm.RetrieveAll();
                return Ok(lstSedes);

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
                var sm = new SedeManager();
                var sede = sm.RetrieveSedeById(new Sede { Id = id });
                return Ok(sede);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Route("Create")]
        public ActionResult Create(Sede sede)
        {
            try
            {
                var sm = new SedeManager();
                sm.Create(sede);
                return Ok(sede);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        [Route("Update")]

        public ActionResult Update(Sede sede)
        {
            try
            {
                var sm = new SedeManager();
                sm.Update(sede);
                return Ok(sede);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Delete")]

        public ActionResult Delete(Sede sede)
        {
            try
            {
                var sm = new SedeManager();
                sm.Delete(sede);
                return Ok(sede);
            }
            catch (Exception ex)

            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
