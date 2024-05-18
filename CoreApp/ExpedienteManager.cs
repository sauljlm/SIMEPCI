using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class ExpedienteManager
    {
        public void Create(Expediente expediente)
        {
            var ec = new ExpedienteCrudFactory();
            ec.Create(expediente);
        }

        public List<Expediente> RetrieveAll()
        {
            var er = new ExpedienteCrudFactory();
            return er.RetrieveAll<Expediente>();
        }

        public Expediente RetrieveByPacienteId(Expediente e) 
        {
            var er = new ExpedienteCrudFactory();
            return er.RetrieveByPacienteId(e);
        }

        public void Delete(Expediente expediente)
        {
            var ec = new ExpedienteCrudFactory();
            ec.Delete(expediente);
        }

        public void Update(Expediente expediente)
        {
            var ec = new ExpedienteCrudFactory();
            ec.Update(expediente);
        }

    }
}
