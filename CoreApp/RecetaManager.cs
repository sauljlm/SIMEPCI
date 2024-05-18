using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class RecetaManager
    {
        public void Create(Receta receta)
        {
            var re = new RecetaCrudFactory();
            re.Create(receta);
        }

        public void Update(Receta receta)
        {
            var re = new RecetaCrudFactory();
            re.Update(receta);
        }

        public void Delete(Receta receta)
        {
            var re = new RecetaCrudFactory();
            re.Delete(receta);
        }

        public List<Receta> RetrieveAll()
        {
            var re = new RecetaCrudFactory();
            return re.RetrieveAll<Receta>();
        }

        public List<Receta> RetrieveByCitaId(Receta receta)
        {
            var re = new RecetaCrudFactory();
            return re.RetrieveByCitaId(receta);
        }
    }
}
