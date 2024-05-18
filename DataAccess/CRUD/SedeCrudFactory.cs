using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class SedeCrudFactory : CrudFactory
    {
        // Inicializar el DAO
        public SedeCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            var sede = baseDTO as Sede;
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_SEDE_PR" };
            sqlOperation.AddVarcharParam("P_NOMBRE", sede.Nombre);
            sqlOperation.AddVarcharParam("P_DESCRIPCION", sede.Descripcion);
            sqlOperation.AddDateTimeParam("P_FECHA_CREACION", sede.FechaCreacion);
            sqlOperation.AddVarcharParam("P_FOTO_SEDE", sede.FotoSede);
            sqlOperation.AddDoubleParam("P_LATITUD", sede.Latitud);
            sqlOperation.AddDoubleParam("P_LONGITUD", sede.Longitud);
            sqlOperation.AddVarcharParam("P_PROVINCIA", sede.Provincia);
            sqlOperation.AddVarcharParam("P_CANTON", sede.Canton);
            sqlOperation.AddVarcharParam("P_DISTRITO", sede.Distrito);
            sqlOperation.AddVarcharParam("P_OTRAS_SENNAS", sede.OtrasSennas);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var sede = baseDTO as Sede;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_SEDE_PR" };
            sqlOperation.AddIntParam("P_ID", sede.Id);
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            var sedeList = new List<T>();

            var sqlOperation = new SqlOperation { ProcedureName = "RET_ALL_SEDES_PR" };

            var results = _dao.ExecuteQueryProcedure(sqlOperation);
            if (results.Count > 0)
            {

                foreach (var row in results)
                {
                    var sede = BuildSede(row);
                    sedeList.Add((T)Convert.ChangeType(sede, typeof(T)));
                }
            }

            return sedeList;
        }

        public override T RetrieveById<T>(int id)
        {
            if (typeof(T) == typeof(Sede))
            {
                var sqlOperation = new SqlOperation { ProcedureName = "RET_SEDE_BY_ID_PR" };
                sqlOperation.AddIntParam("P_ID", id);

                var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

                if (listResults.Count > 0)
                {
                    var row = listResults[0];
                    var sede = BuildSede(row);
                    return (T)Convert.ChangeType(sede, typeof(T));
                }
            }
            else
            {
                throw new ArgumentException("Invalid type parameter for RetrieveById");
            }
            return default(T);
        }

        public Sede RetrieveByName(Sede sd)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_SEDE_BY_NAME_PR" };

            sqlOperation.AddVarcharParam("P_NAME", sd.Nombre);

            var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (listResults.Count > 0)
            {

                var row = listResults[0];

                var sede = BuildSede(row);
                return sede;


            }

            return null;
        }

        public override void Update(BaseDTO baseDTO)
        {
            var sede = baseDTO as Sede;
            var sqlOperation = new SqlOperation { ProcedureName = "UPD_SEDE_PR" };
            sqlOperation.AddIntParam("@P_ID", sede.Id);
            sqlOperation.AddVarcharParam("@P_NOMBRE", sede.Nombre);
            sqlOperation.AddVarcharParam("@P_DESCRIPCION", sede.Descripcion);
            sqlOperation.AddDateTimeParam("@P_FECHA_CREACION", sede.FechaCreacion);
            sqlOperation.AddVarcharParam("@P_FOTO_SEDE", sede.FotoSede);
            sqlOperation.AddDoubleParam("@P_LATITUD", sede.Latitud);
            sqlOperation.AddDoubleParam("@P_LONGITUD", sede.Longitud);
            sqlOperation.AddVarcharParam("@P_PROVINCIA", sede.Provincia);
            sqlOperation.AddVarcharParam("@P_CANTON", sede.Canton);
            sqlOperation.AddVarcharParam("@P_DISTRITO", sede.Distrito);
            sqlOperation.AddVarcharParam("@P_OTRAS_SENNAS", sede.OtrasSennas);

            _dao.ExecuteProcedure(sqlOperation);
        }

        private Sede BuildSede(Dictionary<string, object> row)
        {
            var sedeToReturn = new Sede()
            {
                Id = (int)row["Id"],
                Nombre = (string)row["Nombre"],
                Descripcion = (string)row["Descripcion"],
                FechaCreacion = (DateTime)row["Fecha_Creacion"],
                FotoSede = (string)row["Foto_Sede"],
                Latitud = Convert.ToDouble(row["Latitud"]),
                Longitud = Convert.ToDouble(row["Longitud"]),
                Provincia = (string)row["Provincia"],
                Canton = (string)row["Canton"],
                Distrito = (string)row["Distrito"],
                OtrasSennas = (string)row["Otras_Sennas"]
            };
            return sedeToReturn;
        }
    }
}
