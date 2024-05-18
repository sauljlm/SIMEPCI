using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class ExamenMedico : BaseDTO
    {
        public int IdExpediente { get; set; }
        public int IdUsuarioDoctor { get; set; }
        public string? Tipo { get; set; }
        public string? Resultados { get; set; }

        public string? ImagenExamen {  get; set; }
        public string? RealizadoEnClinica { get; set; }

        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }
    }
}
