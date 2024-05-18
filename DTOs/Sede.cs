using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Sede : BaseDTO
    {
        [Required]
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        [Required]
        public DateTime FechaCreacion { get; set; }
        public string FotoSede { get; set; }
        [Required]
        public double Latitud { get; set; }

        [Required]
        public double Longitud { get; set; }
    
        [Required]
        public string Provincia { get; set; }
        [Required]
        public string Canton { get; set; }
        [Required]
        public string Distrito { get; set; }
        public string OtrasSennas { get; set; }

    }
}
