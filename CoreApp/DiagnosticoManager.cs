using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class DiagnosticoManager
    {
        public void Create(Diagnostico diagnostico)
        {
            var dc = new DiagnosticoCrudFactory();
            dc.Create(diagnostico);
        }

        public List<Diagnostico> RetrieveByCitaId(Diagnostico diagnostico)
        {
            var dc = new DiagnosticoCrudFactory();
            return dc.RetrieveByCitaId(diagnostico);
        }
        public void Delete(Diagnostico diagnostico)
        {
            var dc = new DiagnosticoCrudFactory();
            dc.Delete(diagnostico);
        }

        public void Update(Diagnostico diagnostico)
        {
            var dc = new DiagnosticoCrudFactory();
            dc.Update(diagnostico);
        }
    }
}
