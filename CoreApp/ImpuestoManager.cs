using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class ImpuestoManager
    {

        public List<Impuesto> RetrieveAll()
        {
            var ci = new ImpuestoCrudFactory();
            return ci.RetrieveAll<Impuesto>();
        }

        public Impuesto RetrieveImpuestoById(int idImpuesto)
        {
            var cf = new ImpuestoCrudFactory();
            return cf.RetrieveById<Impuesto>(idImpuesto);
        }
    }
}
