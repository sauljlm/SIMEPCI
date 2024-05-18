using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Receta:BaseDTO
    {
        public string? NombrePaciente { get; set; }
        public string? ApellidoUnoPaciente { get; set; }
        public string? ApellidoDosPaciente { get; set; }
        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }

        public string? NombreSede { get; set; }
        public int IdCita { get; set; }
        public int IdExpediente { get; set; }
        public string? Medicamento { get; set; }
        public double? Dosificacion { get; set;}
        public string? Indicaciones { get; set; }
        public string? ImagenReceta { get; set; }
        public DateTime? Emision {  get; set; }
    }
}
