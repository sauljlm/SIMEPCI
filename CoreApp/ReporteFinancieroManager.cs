using DataAccess.CRUD;
using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class ReporteFinancieroManager
    { 

        public void Create(ReporteFinanciero reporteFinanciero)
        {
            var cs = new ReporteFinancieroCrudFactory();
            cs.Create(reporteFinanciero);
        }

        public List<ReporteFinanciero> RetrieveAll()
        {
            var cs = new ReporteFinancieroCrudFactory();
            return cs.RetrieveAll<ReporteFinanciero>();
        }
    }
}
