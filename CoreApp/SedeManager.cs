using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class SedeManager
    {

        public void Create(Sede sede)
        {
            var sd = new SedeCrudFactory();

            if (string.IsNullOrEmpty(sede.Nombre))
            {
                throw new Exception("El nombre es requerido");
            }

            var actualSede = sd.RetrieveByName(sede);
            if (actualSede == null)
            {
                sd.Create(sede);
            }
            else
            {
                throw new Exception("El nombre de la sede ya existe");
            }
        }

        public void Update(Sede sede)
        {
            var sc = new SedeCrudFactory();
            sc.Update(sede);
        }

        public void Delete(Sede sede)
        {
            var sc = new SedeCrudFactory();
            sc.Delete(sede);
        }

        public Sede RetrieveSedeByName(Sede s)
        {
            var sc = new SedeCrudFactory();
            var sede = sc.RetrieveByName(s);
            return sede;

        }

        public Sede RetrieveSedeById(Sede s)
        {
            var sc = new SedeCrudFactory();
            return sc.RetrieveById<Sede>(s.Id);
        }

        public List<Sede> RetrieveAll()
        {
            var sc = new SedeCrudFactory();
            return sc.RetrieveAll<Sede>();
        }
    }
}
