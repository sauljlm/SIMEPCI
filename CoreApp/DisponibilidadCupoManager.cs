using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class DisponibilidadCupoManager
    {
        // Clase de negocio donde se aplican validaciones funcionales
        

        // El metodo para create
        public void Create(DisponibilidadCupo disponibilidadCupo)
        {
            var dc = new DisponibilidadCupoCrudFactory();
            dc.Create(disponibilidadCupo);
                
        }

        public void Update(DisponibilidadCupo disponibilidadCupo)
        {
            var dc = new DisponibilidadCupoCrudFactory();
            dc.Update(disponibilidadCupo);
        }

        public void UpdatePago(int idcupo)
        {
            var dc = new DisponibilidadCupoCrudFactory();
            dc.UpdatePago(idcupo);
        }

        public void Delete(DisponibilidadCupo disponibilidadCupo)
        {
            var dc = new DisponibilidadCupoCrudFactory();
            dc.Delete(disponibilidadCupo);
        }

        public List<DisponibilidadCupo> RetrieveAll()
        {
            var dc = new DisponibilidadCupoCrudFactory();
            return dc.RetrieveAll<DisponibilidadCupo>();
        }

        public DisponibilidadCupo RetrieveById(int id)
        {
            var dc = new DisponibilidadCupoCrudFactory();
            return dc.RetrieveById<DisponibilidadCupo>(id);
        }
    }
}
