using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Expediente : BaseDTO
    {
        public int IdUsuarioPaciente { get; set; }
        public int? Identificacion { get; set; }
        public string? Nombre { get; set; }
        public string? ApellidoUno { get; set; }
        public string? ApellidoDos {  get; set; }
		public string? Telefono {  get; set; }
        public string? Correo { get; set; }
        public string? Sexo { get; set; }
		public DateTime? FechaNacimiento { get; set; }
        public decimal? Latitud {  get; set; }
        public decimal? Longitud { get; set; }
        public string? Antecedentes { get; set; }
        public string? EnfermedadesFamiliares { get; set; }
        public string? HabitosNoSaludables { get; set; }

    }
}
