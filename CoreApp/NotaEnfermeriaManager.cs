using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class NotaEnfermeriaManager
    {
        public void Create(NotaEnfermeria notaEnfermeria)
        {
            var nc = new NotaEnfermeriaCrudFactory();
            nc.Create(notaEnfermeria);
        }

        public List<NotaEnfermeria> RetrieveByExpedienteId(NotaEnfermeria notaEnfermeria)
        {
            var nec = new NotaEnfermeriaCrudFactory();
            return nec.RetrieveByExpedienteId(notaEnfermeria);
        }

        public void Delete(NotaEnfermeria notaEnfermeria)
        {
            var nec = new NotaEnfermeriaCrudFactory();
            nec.Delete(notaEnfermeria);
        }

        public void Update(NotaEnfermeria notaEnfermeria)
        {
            var nec = new NotaEnfermeriaCrudFactory();
            nec.Update(notaEnfermeria);
        }
    }
}
