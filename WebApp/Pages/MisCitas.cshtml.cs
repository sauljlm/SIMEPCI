using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebApp.Pages
{
    public class MisCitasModel : PageModel
    {
        public void OnGet()
        {
        }

        public IActionResult OnPost(string total, string doctor, string especialidad, string idcupo, string idcita, string idimpuesto)
        {

                TempData["Doctor"] = doctor;
                TempData["Total"] = total;
                TempData["Especialidad"] = especialidad;
                TempData["IDcupo"] = idcupo;
                TempData["IDcita"] = idcita;
                TempData["IDimpuesto"] = idimpuesto;

            return RedirectToPage("/Checkout");
        }
    }
}
