using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class CalidadServicioCrudFactory : CrudFactory
    {
        public CalidadServicioCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            var calidadServicio = baseDTO as CalidadServicio;
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_OPINION_SERVICIO_PR" };

            sqlOperation.AddIntParam("P_ID_USUARIO", calidadServicio.IdUsuario);
            sqlOperation.AddVarcharParam("P_Servicio", calidadServicio.Servicio);
            sqlOperation.AddDateTimeParam("P_FECHA_VISITA", calidadServicio.FechaVisita);
            sqlOperation.AddIntParam("P_CORTESIA", calidadServicio.Cortesia);
            sqlOperation.AddIntParam("P_TRATO", calidadServicio.Trato);
            sqlOperation.AddIntParam("P_INFRAESTRUCTURA", calidadServicio.Infraestructura);
            sqlOperation.AddIntParam("P_TIEMPO_ESPERA", calidadServicio.TiempoEspera);
            sqlOperation.AddIntParam("P_SATISFACCION_TRATAMIENTO", calidadServicio.SatisfaccionTratamiento);
            sqlOperation.AddVarcharParam("P_SUGERENCIAS", calidadServicio.Sugerencias);
            sqlOperation.AddIntParam("P_CALIFICACION_GENERAL", calidadServicio.CalificacionGeneral);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstOpiniones = new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_ALL_OPINION_SERVICIO_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var cs = BuildCalidadServicio(row);
                    lstOpiniones.Add((T)Convert.ChangeType(cs, typeof(T)));
                }
            }
            return lstOpiniones;
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override void Update(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }

        private CalidadServicio BuildCalidadServicio(Dictionary<string, object> map)
        {
            var calidadServicio = new CalidadServicio()
            {
                Id = (int)map["Id"],
                IdUsuario = (int)map["Id_Usuario"],
                Servicio = (string)map["Servicio"],
                FechaVisita = (DateTime)map["Fecha_Visita"],
                Cortesia = (int)map["Cortesia"],
                Trato = (int)map["Trato"],
                Infraestructura = (int)map["Infraestructura"],
                TiempoEspera = (int)map["Tiempo_Espera"],
                SatisfaccionTratamiento = (int)map["Satisfaccion_Tratamiento"],
                Sugerencias = (string)map["Sugerencias"],
                CalificacionGeneral = (int)map["Calificacion_General"],
            };

            return calidadServicio;
        }
    }
}
