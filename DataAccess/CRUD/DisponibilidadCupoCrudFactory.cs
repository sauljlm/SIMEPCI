using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class DisponibilidadCupoCrudFactory: CrudFactory
    {
        public DisponibilidadCupoCrudFactory()
        { 
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var disponibilidadCupo = baseDTO as DisponibilidadCupo;
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_DISPONIBILIDAD_CUPO_PR" };
            sqlOperation.AddDateTimeParam("P_HORA_CUPO", disponibilidadCupo.HoraCupo);
            sqlOperation.AddIntParam("P_ID_USUARIO_DOCTOR", disponibilidadCupo.IdUsuarioDoctor);
            sqlOperation.AddIntParam("P_ID_SEDE", disponibilidadCupo.IdSede);
            sqlOperation.AddVarcharParam("P_ESTADO", disponibilidadCupo.Estado);
            sqlOperation.AddDecimalParam("P_PRECIO", (decimal)disponibilidadCupo.Precio);
            sqlOperation.AddDecimalParam("P_IDIMPUESTO", (decimal)disponibilidadCupo.idImpuesto);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Update(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var disponibilidadCupo = baseDTO as DisponibilidadCupo;
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "UPD_DISPONIBILIDAD_CUPO_PR" };
            sqlOperation.AddIntParam("P_ID", disponibilidadCupo.Id);
            sqlOperation.AddDateTimeParam("P_HORA_CUPO", disponibilidadCupo.HoraCupo);
            sqlOperation.AddIntParam("P_ID_USUARIO_DOCTOR", disponibilidadCupo.IdUsuarioDoctor);
            sqlOperation.AddIntParam("P_ID_SEDE", disponibilidadCupo.IdSede);
            sqlOperation.AddVarcharParam("P_ESTADO", disponibilidadCupo.Estado);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public void UpdatePago(int idcupo)
        {
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "UPD_DISPONIBILIDA_CUPO_PAGO_PR" };
            sqlOperation.AddIntParam("P_IDCUPO", idcupo);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var disponibilidadCupo = baseDTO as DisponibilidadCupo;

            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_DISPONIBILIDAD_CUPO_PR" };
            sqlOperation.AddIntParam("P_ID", disponibilidadCupo.Id);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstCupos = new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_DISPONIBILIDAD_CUPO_ALL_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);


            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var user = BuildCupo(row);
                    lstCupos.Add((T)Convert.ChangeType(user, typeof(T)));
                }
            }
            return lstCupos;
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override T RetrieveById<T>(int id)
        {
            if (typeof(T) == typeof(DisponibilidadCupo))
            {
                var sqlOperation = new SqlOperation { ProcedureName = "RET_DISPONIBILIDAD_CUPO_BY_ID" };
                sqlOperation.AddIntParam("P_ID_DISPONIBILIDAD_CUPO", id);

                var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

                if (listResults.Count > 0)
                {
                    var row = listResults[0];
                    var cupo = BuildCupo(row);
                    return (T)Convert.ChangeType(cupo, typeof(T));
                }
            }
            else
            {
                throw new ArgumentException("Invalid type parameter for RetrieveById");
            }
            return default(T);
        }

        private DisponibilidadCupo BuildCupo(Dictionary<string, object> row)
        {
            var cupoToReturn = new DisponibilidadCupo()
            {
                Id = (int)row["Id"],
                IdUsuarioDoctor = (int)row["Id_Usuario_Doctor"],
                NombreDoctor = (string)row["Nombre"],
                ApellidoUnoDoctor = (string)row["Apellido_Uno"],
                ApellidoDosDoctor = (string)row["Apellido_Dos"],
                Especialidad = (string)row["Especialidad"],
                HoraCupo = (DateTime)row["Hora_Cupo"],
                IdSede = (int)row["Id_Sede"],
                NombreSede = (string)row["Nombre_Sede"],
                Provincia = (string)row["Provincia"],
                Distrito = (string)row["Distrito"],
                Canton = (string)row["Canton"],
                Estado = (string)row["Estado"],
                Precio = (double)row["Precio"],
                idImpuesto = (int)row["idImpuesto"],
            };

            return cupoToReturn;
        }
    }
}
