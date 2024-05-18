using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs
{
    public class HistoriaClinica : BaseDTO
    {
        public int IdExpediente { get; set; }

        [Required(ErrorMessage = "Los Antecedentes son requeridos")]
        public string Antecedentes { get; set; }
        public string HabitosNoSaludables { get; set; }
        public string EnfermedadesFamiliares { get; set; }

    }
}
