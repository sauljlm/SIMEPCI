using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class ExpedienteCrudFactory : CrudFactory
    {
        //Solicita la base de datos
        public ExpedienteCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO en un ExpedienteCrudFactory
            var expediente = baseDTO as Expediente;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_EXPEDIENTE_PR" };

            sqlOperation.AddIntParam("P_ID_PACIENTE", expediente.IdUsuarioPaciente);

            _dao.ExecuteProcedure(sqlOperation);

        }

        public override void Delete(BaseDTO baseDTO)
        {
            var expediente = baseDTO as Expediente;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_ID", expediente.Id);
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstExpedientes = new List<T>();

            // Se utiliza el sqlOperation necesario
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_ALL_EXPEDIENTES_PR" };

            // Invocamos al método que se encarga de ejecutar el precedure, dándonos los datos
            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);


            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var expediente = BuildExpediente(row);
                    lstExpedientes.Add((T)Convert.ChangeType(expediente, typeof(T)));
                }
            }

            return lstExpedientes;
        }


        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }



        public Expediente RetrieveByPacienteId(Expediente expediente)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_EXPEDIENTE_POR_PACIENTE_PR" };
            sqlOperation.AddIntParam("P_PACIENTE_ID", expediente.IdUsuarioPaciente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                var row = lstResults[0];

                var expedienteSel = BuildExpediente(row);

                return expedienteSel;
            }

            return null;
        }

        public override void Update(BaseDTO baseDTO)
        {
            var expediente = baseDTO as Expediente;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_EXPEDIENTE_PR" };

            sqlOperation.AddIntParam("P_ID", expediente.Id);
            sqlOperation.AddIntParam("P_ID_PACIENTE", expediente.IdUsuarioPaciente);

            _dao.ExecuteProcedure(sqlOperation);

        }

        private Expediente BuildExpediente(Dictionary<string, object> row)
        {
            var expedienteToReturn = new Expediente()
            {
                /*
                Id = (int)row["Id"],
                IdUsuarioPaciente = (int)row["Id_Usuario_Paciente"],
                Identificacion = (int)row["Identificacion"],
                Nombre = (string)row["Nombre"],
                ApellidoUno = (string)row["Apellido_Uno"],
                ApellidoDos = (string)row["Apellido_Dos"],
                Telefono = (string)row["Telefono"],
                Correo = (string)row["Correo"],
                Sexo = (string)row["Sexo"],
                FechaNacimiento = (DateTime)row["Fecha_Nacimiento"],
                Latitud = (decimal)row["Latitud"],
                Longitud = (decimal)row["Longitud"],
                Antecedentes = (string)row["Antecedentes"],
                EnfermedadesFamiliares =(string)row["Enfermedades_Familiares"],*/

                
                Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                IdUsuarioPaciente = row["Id_Usuario_Paciente"] != DBNull.Value ? (int)row["Id_Usuario_Paciente"] : 0,
                Identificacion = row["Identificacion"] != DBNull.Value ? (int)row["Identificacion"] : 0,
                Nombre = row["Nombre"] != DBNull.Value ? (string)row["Nombre"] : string.Empty,
                ApellidoUno = row["Apellido_Uno"] != DBNull.Value ? (string)row["Apellido_Uno"] : string.Empty,
                ApellidoDos = row["Apellido_Dos"] != DBNull.Value ? (string)row["Apellido_Dos"] : string.Empty,
                Telefono = row["Telefono"] != DBNull.Value ? (string)row["Telefono"] : string.Empty,
                Correo = row["Correo"] != DBNull.Value ? (string)row["Correo"] : string.Empty,
                Sexo = row["Sexo"] != DBNull.Value ? (string)row["Sexo"] : string.Empty,
                FechaNacimiento = row["Fecha_Nacimiento"] != DBNull.Value ? (DateTime)row["Fecha_Nacimiento"] : DateTime.MinValue,
                Latitud = row["Latitud"] != DBNull.Value ? (decimal)row["Latitud"] : 0,
                Longitud = row["Longitud"] != DBNull.Value ? (decimal)row["Longitud"] : 0,
                Antecedentes = row["Antecedentes"] != DBNull.Value ? (string)row["Antecedentes"] : string.Empty,
                EnfermedadesFamiliares = row["Enfermedades_Familiares"] != DBNull.Value ? (string)row["Enfermedades_Familiares"] : string.Empty,

            };

            return expedienteToReturn;
        }

    }
}
