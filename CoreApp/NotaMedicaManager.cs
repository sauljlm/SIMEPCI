using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class NotaMedicaManager
    {
        public void Create(NotaMedica notaMedica)
        {
            var nc = new NotaMedicaCrudFactory();
            nc.Create(notaMedica);
        }

        public List<NotaMedica> RetrieveByExpedienteId(NotaMedica notaMedica)
        {
            var nmc = new NotaMedicaCrudFactory();
            return nmc.RetrieveByExpedienteId(notaMedica);
        }

        public void Delete(NotaMedica notaMedica)
        {
            var nmc = new NotaMedicaCrudFactory();
            nmc.Delete(notaMedica);
        }

        public void Update(NotaMedica notaMedica)
        {
            var nmc = new NotaMedicaCrudFactory();
            nmc.Update(notaMedica);
        }
    }
}
