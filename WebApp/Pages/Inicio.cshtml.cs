using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebApp.Pages
{
    public class InicioModel : PageModel
    {
        public void OnGet()
        {
        }

        public IActionResult OnPost()
        {
            TempData["DeliveryAddress"] = "Direcci�n de entrega";
            TempData["Total"] = 100; // Total
            TempData["IDProduct"] = 1; // ID del producto

            return RedirectToPage("/Checkout"); // Ruta a la p�gina de checkout
        }
    }
}
