using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class CalidadServicio : BaseDTO
    {
        public int IdUsuario { get; set; }
        public string Servicio { get; set; }
        public DateTime FechaVisita { get; set; }
        public int Cortesia { get; set; }
        public int Trato { get; set; }
        public int Infraestructura { get; set; }
        public int TiempoEspera { get; set; }
        public int SatisfaccionTratamiento { get; set; }
        public string Sugerencias { get; set; }
        public int CalificacionGeneral { get; set; }
    }
}
