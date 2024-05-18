using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class NotaEnfermeriaCrudFactory : CrudFactory
    {
        public NotaEnfermeriaCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Nota Enfermeria
            var notaEnfermeria = baseDTO as NotaEnfermeria;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_NOTA_ENFERMERIA_PR" };

            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", notaEnfermeria.IdExpediente);
            sqlOperation.AddIntParam("P_ID_USUARIO_ENFERMERO", notaEnfermeria.IdUsuarioEnfermero);
            sqlOperation.AddVarcharParam("P_NOTA", notaEnfermeria.Nota);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var notaEnfermeria = baseDTO as NotaEnfermeria;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_NOTA_ENFERMERIA_PR" };
            sqlOperation.AddIntParam("P_ID", notaEnfermeria.Id);
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            throw new NotImplementedException();
        }

        public List<NotaEnfermeria> RetrieveByExpedienteId(NotaEnfermeria notaEnfermeria)
        {
            var lstNotasEnfermeria = new List<NotaEnfermeria>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_NOTA_ENFERMERIA_POR_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_EXPEDIENTE_ID", notaEnfermeria.IdExpediente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var notaEnfermeriaSel = BuildNotaEnfermeria(row);
                    lstNotasEnfermeria.Add(notaEnfermeriaSel);
                }
            }

            return lstNotasEnfermeria;
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override void Update(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Nota Enfermeria
            var notaEnfermeria = baseDTO as NotaEnfermeria;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_NOTA_ENFERMERIA_PR" };

            sqlOperation.AddIntParam("P_ID", notaEnfermeria.Id);
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", notaEnfermeria.IdExpediente);
            sqlOperation.AddIntParam("P_ID_USUARIO_ENFERMERO", notaEnfermeria.IdUsuarioEnfermero);
            sqlOperation.AddVarcharParam("P_NOTA", notaEnfermeria.Nota);

            _dao.ExecuteProcedure(sqlOperation);
        }

        private NotaEnfermeria BuildNotaEnfermeria(Dictionary<string, object> row)
        {
            var notaEnfermeriaToReturn = new NotaEnfermeria()
            {
                Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                IdExpediente = row["Id_Expediente"] != DBNull.Value ? (int)row["Id_Expediente"] : 0,
                IdUsuarioEnfermero= row["Id_Usuario_Enfermero"] != DBNull.Value ? (int)row["Id_Usuario_Enfermero"] : 0,
                NombreEnfermero = row["Nombre_Enfermero"] != DBNull.Value ? (string)row["Nombre_Enfermero"] : string.Empty,
                ApellidoUnoEnfermero = row["Apellido_Uno_Enfermero"] != DBNull.Value ? (string)row["Apellido_Uno_Enfermero"] : string.Empty,
                ApellidoDosEnfermero = row["Apellido_Dos_Enfermero"] != DBNull.Value ? (string)row["Apellido_Dos_Enfermero"] : string.Empty,
                Nota = row["Nota"] != DBNull.Value ? (string)row["Nota"] : string.Empty,


            };

            return notaEnfermeriaToReturn;
        }
    }
}
