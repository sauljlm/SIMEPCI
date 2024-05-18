using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class ImpuestoCrudFactory : CrudFactory
    {
        public ImpuestoCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }


        public override void Update(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }

        public override void Delete(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstCitas= new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_IMPUESTOS_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var impuesto = BuildImpuesto(row);
                    lstCitas.Add((T)Convert.ChangeType(impuesto, typeof(T)));
                }
            }
            return lstCitas;
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override T RetrieveById<T>(int id)
        {
            if (typeof(T) == typeof(Impuesto))
            {
                var sqlOperation = new SqlOperation { ProcedureName = "RET_IMPUESTOS_BY_ID_PR" };
                sqlOperation.AddIntParam("P_IDIMPUEST", id);

                var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

                if (listResults.Count > 0)
                {
                    var row = listResults[0];
                    var impuesto = BuildImpuesto(row);
                    return (T)Convert.ChangeType(impuesto, typeof(T));
                }
            }
            else
            {
                throw new ArgumentException("Invalid type parameter for RetrieveById");
            }
            return default(T);
        }

        private Impuesto BuildImpuesto(Dictionary<string, object> row)
        {
            Impuesto impuestoToReturn = new Impuesto()
            {
                Id = (int)row["Id"],
                tipo = (string)row["Tipo_Impuesto"],
                porcentaje = (decimal)row["Porcentaje"]

            };

            return impuestoToReturn;
        }
    }
}
