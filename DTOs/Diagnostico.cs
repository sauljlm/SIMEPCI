using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Diagnostico : BaseDTO
    {
        public int IdCita { get; set; }
        public int IdUsuarioDoctor { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaDiagnostico { get; set; }

        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }


    }
}
