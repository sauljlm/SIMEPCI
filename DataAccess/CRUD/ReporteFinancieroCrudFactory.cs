using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class ReporteFinancieroCrudFactory : CrudFactory
    {
        public ReporteFinancieroCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
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

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_ALL_PAGOS_CONSULTA_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var cs = BuildReporteFinanciero(row);
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

        private ReporteFinanciero BuildReporteFinanciero(Dictionary<string, object> map)
        {
            var reporteFinanciero = new ReporteFinanciero()
            {
                IdCita = (int)map["Id_Cita"],
                IdImpuesto = (int)map["Id_Impuesto"],
                MontoBase = (decimal)map["Monto_Base"],
                MontoTotal = (decimal)map["Monto_Total"],
                FechaPago = (DateTime)map["Fecha_Pago"],
                TipoPago = (string)map["Tipo_De_Pago"]
            };

            return reporteFinanciero;
        }
    }
}