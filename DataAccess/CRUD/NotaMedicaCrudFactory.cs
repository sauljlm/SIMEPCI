using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class NotaMedicaCrudFactory : CrudFactory
    {
        public NotaMedicaCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Nota Medica
            var notaMedica = baseDTO as NotaMedica;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_NOTA_MEDICA_PR" };

            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", notaMedica.IdExpediente);
            sqlOperation.AddIntParam("P_ID_USUARIO_DOCTOR", notaMedica.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_NOTA", notaMedica.Nota);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var notaMedica = baseDTO as NotaMedica;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_NOTA_MEDICA_PR" };
            sqlOperation.AddIntParam("P_ID", notaMedica.Id);
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

        public List<NotaMedica> RetrieveByExpedienteId(NotaMedica notaMedica)
        {
            var lstNotasMedicas = new List<NotaMedica>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_NOTA_MEDICA_POR_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_EXPEDIENTE_ID", notaMedica.IdExpediente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var notaMedicaSel = BuildNotaMedica(row);
                    lstNotasMedicas.Add(notaMedicaSel);
                }
            }

            return lstNotasMedicas;
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override void Update(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Nota Medica
            var notaMedica = baseDTO as NotaMedica;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_NOTA_MEDICA_PR" };

            sqlOperation.AddIntParam("P_ID", notaMedica.Id);
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", notaMedica.IdExpediente);
            sqlOperation.AddIntParam("P_ID_USUARIO_DOCTOR", notaMedica.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_NOTA", notaMedica.Nota);

            _dao.ExecuteProcedure(sqlOperation);
        }

        private NotaMedica BuildNotaMedica(Dictionary<string, object> row)
        {
            var notaMedicaToReturn = new NotaMedica()
            {
                Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                IdExpediente = row["Id_Expediente"] != DBNull.Value ? (int)row["Id_Expediente"] : 0,
                IdUsuarioDoctor = row["Id_Usuario_Doctor"] != DBNull.Value ? (int)row["Id_Usuario_Doctor"] : 0,
                NombreDoctor = row["Nombre_Doctor"] != DBNull.Value ? (string)row["Nombre_Doctor"] : string.Empty,
                ApellidoUnoDoctor = row["Apellido_Uno_Doctor"] != DBNull.Value ? (string)row["Apellido_Uno_Doctor"] : string.Empty,
                ApellidoDosDoctor = row["Apellido_Dos_Doctor"] != DBNull.Value ? (string)row["Apellido_Dos_Doctor"] : string.Empty,
                Nota = row["Nota"] != DBNull.Value ? (string)row["Nota"] : string.Empty,


            };

            return notaMedicaToReturn;
        }
    }
}
