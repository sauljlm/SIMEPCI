using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class ExamenMedicoManager
    {
        public void Create(ExamenMedico examenMedico)
        {
            var ec = new ExamenMedicoCrudFactory();
            ec.Create(examenMedico);
        }

        public List<ExamenMedico> RetrieveByExpedienteId(ExamenMedico examenMedico)
        {
            var emc = new ExamenMedicoCrudFactory();
            return emc.RetrieveByExpedienteId(examenMedico);
        }

        public void Delete(ExamenMedico examenMedico)
        {
            var emc = new ExamenMedicoCrudFactory();
            emc.Delete(examenMedico);
        }

        public void Update(ExamenMedico examenMedico)
        {
            var emc = new ExamenMedicoCrudFactory();
            emc.Update(examenMedico);
        }

    }
}
