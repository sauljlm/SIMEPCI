using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class DisponibilidadCupo: BaseDTO
    {
        public int IdUsuarioDoctor { get; set; }
        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }
        public string? Especialidad { get; set; }

        public DateTime HoraCupo { get; set; }
        public int IdSede { get; set; }
        
        public string? NombreSede { get; set; }
        public string? Provincia {  get; set; }
        public string? Distrito { get; set; }
        public string? Canton {  get; set; }
        public string? Estado { get; set; }
        public double? Precio { get; set; }
        public int? idImpuesto { get; set; }
    }
}
