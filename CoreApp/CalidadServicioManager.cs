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
    public class CalidadServicioManager
    { 

        public void Create(CalidadServicio calidadServicio)
        {
            var cs = new CalidadServicioCrudFactory();
            cs.Create(calidadServicio);
        }

        public List<CalidadServicio> RetrieveAll()
        {
            var cs = new CalidadServicioCrudFactory();
            return cs.RetrieveAll<CalidadServicio>();
        }
    }
}
