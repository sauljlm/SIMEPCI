using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class NotaMedica : BaseDTO
    {
        public int IdExpediente { get; set; }
        public int IdUsuarioDoctor { get; set; }
        public string Nota { get; set; }
        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }

    }
}
