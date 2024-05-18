using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Usuario : BaseDTO
    {
        [Required(ErrorMessage = "Identificación es requerida")]
        public int Identificacion{ get; set;}

        [Required(ErrorMessage = "Nombre es requerido")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "Apellido es requerido")]
        public string ApellidoUno { get; set; }
        
        public string ApellidoDos { get; set; }

        [Required(ErrorMessage = "Telefono es requerido")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "Telefono debe tener 8-digitos numericos")]
        public string Telefono { get; set; }

        [Required(ErrorMessage = "Correo es requerido")]
        [EmailAddress(ErrorMessage = "Correo uno no es valido")]
        public string Correo { get; set; }

        public int AutentificacionCorreo { get; set; }

        [Required(ErrorMessage = "Sexo es requerido")]
        [RegularExpression("^(M|F)$", ErrorMessage = "Sexo debe ser 'M' o 'F'")]
        public string Sexo { get; set; }

        [Required(ErrorMessage = "Fecha de Nacimiento es requerido")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime FechaNacimiento { get; set; }

        [Required(ErrorMessage = "Latitud es requerida")]
        [Range(-90, 90, ErrorMessage = "Latitud debe ser entre -90 y 90")]
        public decimal Latitud { get; set; }

        [Required(ErrorMessage = "Longitud es requerida")]
        [Range(-180, 180, ErrorMessage = "Longitud debe ser entre -180 y 180")]
        public decimal Longitud { get; set; }

        public string FotoPerfil { get; set; }
                
        [RegularExpression("^(AC|IN)$", ErrorMessage = "Estado debe ser 'AC' o 'IN'")]
        public string Estado { get; set; }

        //[Required(ErrorMessage = "Contrasenna is required")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "Contrasenna debe tener al menos 8 caracteres")]
        public string? Contrasenna { get; set; }

        [Required(ErrorMessage = "Tipo es requerido")]
        public string Tipo { get; set; }

        public string Especialidad { get; set; }

        [Required(ErrorMessage = "ID de Sede es requerida")]
        public int IdSede { get; set; }

        public int idExpediente { get; set; }

        public string ValidacionPerfil { get; set; }
    }
}
