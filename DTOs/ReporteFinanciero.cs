using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class ReporteFinanciero : BaseDTO
    {
        public int IdCita { get; set; }
        public int IdImpuesto { get; set; }
        public decimal MontoBase { get; set; }
        public decimal MontoTotal { get; set; }
        public DateTime FechaPago { get; set; }
        public string TipoPago { get; set; }
    }
}
