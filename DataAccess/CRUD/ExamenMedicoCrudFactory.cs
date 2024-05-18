using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class ExamenMedicoCrudFactory : CrudFactory
    {
        public ExamenMedicoCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a un Examen Medico
            var examenMedico = baseDTO as ExamenMedico;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_EXAMEN_MEDICO_PR" };

            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", examenMedico.IdExpediente);
            sqlOperation.AddIntParam("P_USUARIO_DOCTOR", examenMedico.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_TIPO", examenMedico.Tipo);
            sqlOperation.AddVarcharParam("P_RESULTADOS", examenMedico.Resultados);
            sqlOperation.AddVarcharParam("P_IMAGEN_EXAMEN", examenMedico.ImagenExamen);
            sqlOperation.AddVarcharParam("P_REALIZADO_EN_CLINICA", examenMedico.RealizadoEnClinica);


            _dao.ExecuteProcedure(sqlOperation);

        }

        public override void Delete(BaseDTO baseDTO)
        {
            var examenMedico = baseDTO as ExamenMedico;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_EXAMEN_MEDICO_PR" };
            sqlOperation.AddIntParam("P_ID", examenMedico.Id);
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

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public List<ExamenMedico> RetrieveByExpedienteId(ExamenMedico examenMedico)
        {
            var lstExamenMedicos = new List<ExamenMedico>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_EX_MEDICO_POR_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_EXPEDIENTE_ID", examenMedico.IdExpediente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var examenMedicoSel = BuildExamenMedico(row);
                    lstExamenMedicos.Add(examenMedicoSel);
                }
            }

            return lstExamenMedicos;
        }


        public override void Update(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a un Examen Medico
            var examenMedico = baseDTO as ExamenMedico;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_EXAMEN_MEDICO_PR" };

            sqlOperation.AddIntParam("P_ID", examenMedico.Id);
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", examenMedico.IdExpediente);
            sqlOperation.AddIntParam("P_USUARIO_DOCTOR", examenMedico.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_TIPO", examenMedico.Tipo);
            sqlOperation.AddVarcharParam("P_RESULTADOS", examenMedico.Resultados);
            sqlOperation.AddVarcharParam("P_IMAGEN_EXAMEN", examenMedico.ImagenExamen);
            sqlOperation.AddVarcharParam("P_REALIZADO_EN_CLINICA", examenMedico.RealizadoEnClinica);

            _dao.ExecuteProcedure(sqlOperation);
        }


        private ExamenMedico BuildExamenMedico(Dictionary<string, object> row)
        {

            if (row.ContainsKey("Imagen_Examen")){
                return new ExamenMedico()
                {
                    Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                    IdExpediente = row["Id_Expediente"] != DBNull.Value ? (int)row["Id_Expediente"] : 0,
                    IdUsuarioDoctor = row["Id_Usuario_Doctor"] != DBNull.Value ? (int)row["Id_Usuario_Doctor"] : 0,
                    NombreDoctor = row["Nombre_Doctor"] != DBNull.Value ? (string)row["Nombre_Doctor"] : string.Empty,
                    ApellidoUnoDoctor = row["Apellido_Uno_Doctor"] != DBNull.Value ? (string)row["Apellido_Uno_Doctor"] : string.Empty,
                    ApellidoDosDoctor = row["Apellido_Dos_Doctor"] != DBNull.Value ? (string)row["Apellido_Dos_Doctor"] : string.Empty,
                    Tipo = row["Tipo"] != DBNull.Value ? (string)row["Tipo"] : string.Empty,
                    Resultados = row["Resultados"] != DBNull.Value ? (string)row["Resultados"] : string.Empty,
                    ImagenExamen = row["Imagen_Examen"] != DBNull.Value ? (string)row["Imagen_Examen"] : string.Empty,
                    RealizadoEnClinica = row["Realizado_En_Clinica"] != DBNull.Value ? (string)row["Realizado_En_Clinica"] : string.Empty,

                };

            }
            else
            {
                return new ExamenMedico()
                {
                    Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                    IdExpediente = row["Id_Expediente"] != DBNull.Value ? (int)row["Id_Expediente"] : 0,
                    IdUsuarioDoctor = row["Id_Usuario_Doctor"] != DBNull.Value ? (int)row["Id_Usuario_Doctor"] : 0,
                    NombreDoctor = row["Nombre_Doctor"] != DBNull.Value ? (string)row["Nombre_Doctor"] : string.Empty,
                    ApellidoUnoDoctor = row["Apellido_Uno_Doctor"] != DBNull.Value ? (string)row["Apellido_Uno_Doctor"] : string.Empty,
                    ApellidoDosDoctor = row["Apellido_Dos_Doctor"] != DBNull.Value ? (string)row["Apellido_Dos_Doctor"] : string.Empty,
                    Tipo = row["Tipo"] != DBNull.Value ? (string)row["Tipo"] : string.Empty,
                    Resultados = row["Resultados"] != DBNull.Value ? (string)row["Resultados"] : string.Empty,
                    RealizadoEnClinica = row["Realizado_En_Clinica"] != DBNull.Value ? (string)row["Realizado_En_Clinica"] : string.Empty,

                };
            }
        }
    }
}
