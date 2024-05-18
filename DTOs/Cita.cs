using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Cita : BaseDTO
    {
        public string? NombreDoctor { get; set; }
        public string? ApellidoUnoDoctor { get; set; }
        public string? ApellidoDosDoctor { get; set; }
        public string? NombrePaciente { get; set; }
        public string? ApellidoUnoPaciente { get; set; }
        public string? ApellidoDosPaciente { get; set; }

        public string? NombreSede { get; set; }
        public DateTime? HoraCupo { get; set; }
        public string? Provincia { get; set; }
        public string? Canton { get; set; }
        public string? Distrito { get; set; }
        public string? OtrasSennas { get; set; }
        public string? Especialidad { get; set; }
        public int IdExpediente { get; set; }
        public int IdDisponibilidadCupo { get; set; }
        public int IdDoctor { get; set; }
        public double Precio { get; set; }
        public int IdImpuesto { get; set; }
        public string? Estado { get; set; }

    }
}
