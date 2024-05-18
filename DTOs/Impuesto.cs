using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class Impuesto : BaseDTO
    {
        public string tipo { get; set; }
        public decimal porcentaje { get; set; }

    }
}
