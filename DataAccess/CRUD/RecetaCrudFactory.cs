using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class RecetaCrudFactory : CrudFactory
    {
        public RecetaCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var receta = baseDTO as Receta;
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_RECETA_PR" };
            sqlOperation.AddIntParam("P_ID_CITA", receta.IdCita);
            sqlOperation.AddVarcharParam("P_MEDICAMENTO", receta.Medicamento);
            sqlOperation.AddDoubleParam("P_DOSIFICACION", (double)receta.Dosificacion);
            sqlOperation.AddVarcharParam("P_INDICACIONES", receta.Indicaciones);
            sqlOperation.AddVarcharParam("P_IMAGEN_RECETA", receta.ImagenReceta);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Update(BaseDTO baseDTO)
        {
            var receta = baseDTO as Receta;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_RECETA_PR" };
            sqlOperation.AddIntParam("P_ID", receta.Id);
            sqlOperation.AddIntParam("P_ID_CITA", receta.IdCita);
            sqlOperation.AddVarcharParam("P_MEDICAMENTO", receta.Medicamento);
            sqlOperation.AddDoubleParam("P_DOSIFICACION", (double)receta.Dosificacion);
            sqlOperation.AddVarcharParam("P_INDICACIONES", receta.Indicaciones);
            sqlOperation.AddVarcharParam("P_IMAGEN_RECETA", receta.ImagenReceta);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var receta = baseDTO as Receta;

            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_RECETA_PR" };
            sqlOperation.AddIntParam("P_ID", receta.Id);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstRecetas = new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_RECETA_ALL_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);


            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var user = BuildReceta(row);
                    lstRecetas.Add((T)Convert.ChangeType(user, typeof(T)));
                }
            }
            return lstRecetas;
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public List<Receta> RetrieveByCitaId(Receta receta)
        {
            var lstRecetasMedicas = new List<Receta>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_RECETA_POR_CITA_PR" };
            sqlOperation.AddIntParam("P_CITA_ID", receta.IdCita);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var recetaSel = BuildReceta(row);
                    lstRecetasMedicas.Add(recetaSel);
                }
            }

            return lstRecetasMedicas;
        }

        private Receta BuildReceta(Dictionary<string, object> row)
        {
            var recetaToReturn = new Receta()
            {
                Id = (int)row["Id"],
                NombrePaciente = (string)row["Nombre_Paciente"],
                ApellidoUnoPaciente = (string)row["Apellido1_Paciente"],
                ApellidoDosPaciente = (string)row["Apellido2_Paciente"],
                NombreDoctor = (string)row["Nombre_Doctor"],
                ApellidoUnoDoctor = (string)row["Apellido1_Doctor"],
                ApellidoDosDoctor = (string)row["Apellido2_Doctor"],
                NombreSede = (string)row["Nombre_Sede"],
                IdCita = (int)row["Id_Cita"],
                IdExpediente = (int)row["Id_Expediente"],
                Medicamento = row["Medicamento"] != DBNull.Value ? (string)row["Medicamento"] : string.Empty,
                Dosificacion = row["Dosificacion"] != DBNull.Value ? Convert.ToDouble(row["Dosificacion"]) : 0.0,
                Indicaciones = row["Indicaciones"] != DBNull.Value ? (string)row["Indicaciones"] : string.Empty,
                ImagenReceta = row["ImagenReceta"] != DBNull.Value ? (string)row["ImagenReceta"] : string.Empty,
                Emision = (DateTime)row["Emision"],
            };

            return recetaToReturn;
        }
    }
}
