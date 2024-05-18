using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class CitaManager
    {
        public void Create(Cita cita)
        {
            var ci = new CitaCrudFactory();
            ci.Create(cita);

        }

        public void CreatePago(Factura factura)
        {
            var ci = new CitaCrudFactory();
            ci.CreatePagoCita(factura);

        }

        public void Delete(Cita cita)
        {
            var ci = new CitaCrudFactory();
            ci.Delete(cita);
        }

        public List<Cita> RetrieveAll()
        {
            var ci = new CitaCrudFactory();
            return ci.RetrieveAll<Cita>();
        }

        public Cita RetrieveCitaById(int idCita)
        {
            var cf = new CitaCrudFactory();
            return cf.RetrieveById<Cita>(idCita);
        }

        public int ValidarAgendados(int idExpediente)
        {
            var cf = new CitaCrudFactory();
            return cf.RetrieveByExpediente(idExpediente);
        }

        public List<Cita> RetrieveByExpedienteId(Cita cita)
        {
            var cf = new CitaCrudFactory();
            return cf.RetrieveByExpedienteId(cita);
        }
    }
}
