using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json.Nodes;

namespace WebApp.Pages
{
    public class CheckoutModel : PageModel
    { 
        public string Doctor { get; set; }
        public string Especialidad { get; set; }
        public string Total { get; set; }
        public string IDcupo { get; set; }
        public string IDcita { get; set; }
        public string IDimpuesto { get; set; }

        public void OnGet()
        {
            Doctor = TempData["Doctor"]?.ToString()?? "";
            Total = TempData["Total"]?.ToString()?? "";
            IDcupo = TempData["IDcupo"]?.ToString()?? "";
            IDcita = TempData["IDcita"]?.ToString()?? "";
            IDimpuesto = TempData["IDimpuesto"]?.ToString()?? "";
            Especialidad = TempData["Especialidad"]?.ToString()?? "";


            TempData.Keep();

            if (Doctor == "" || Total == "" || IDcupo == "" || Especialidad == "" || IDcita == "" || IDimpuesto == "") {

                Response.Redirect("/MisCitas");
                return;
            }
        }


        
        
    }
}
