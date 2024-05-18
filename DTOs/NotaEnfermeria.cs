using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class NotaEnfermeria : BaseDTO
    {
        public int IdExpediente { get; set; }
        public int IdUsuarioEnfermero { get; set; }
        public string Nota { get; set; }
        public string? NombreEnfermero { get; set; }
        public string? ApellidoUnoEnfermero { get; set; }
        public string? ApellidoDosEnfermero { get; set; }
    }
}
