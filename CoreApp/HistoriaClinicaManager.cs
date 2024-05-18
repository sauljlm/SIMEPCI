using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class HistoriaClinicaManager
    {
        public void Create(HistoriaClinica historiaClinica)
        {
            var hc = new HistoriaClinicaCrudFactory();
            hc.Create(historiaClinica);
        }

        public List<HistoriaClinica> RetrieveByExpedienteId(HistoriaClinica historiaClinica)
        {
            var hcc = new HistoriaClinicaCrudFactory();
            return hcc.RetrieveByExpedienteId(historiaClinica);
        }

        public void Delete(HistoriaClinica historiaClinica)
        {
            var hcc = new HistoriaClinicaCrudFactory();
            hcc.Delete(historiaClinica);
        }

        public void Update(HistoriaClinica historiaClinica)
        {
            var hcc = new HistoriaClinicaCrudFactory();
            hcc.Update(historiaClinica);
        }
    }
}
