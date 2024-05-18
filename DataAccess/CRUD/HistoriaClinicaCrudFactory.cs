using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class HistoriaClinicaCrudFactory : CrudFactory
    {
        public HistoriaClinicaCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Historia Clinica
            var historiaClinica = baseDTO as HistoriaClinica;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_HISTORIA_CLINICA_PR" };

            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", historiaClinica.IdExpediente);
            sqlOperation.AddVarcharParam("P_ANTECEDENTES", historiaClinica.Antecedentes);
            sqlOperation.AddVarcharParam("P_HABITOS_NO_SALUDABLES", historiaClinica.HabitosNoSaludables);
            sqlOperation.AddVarcharParam("P_ENFERMEDADES_FAMILIARES", historiaClinica.EnfermedadesFamiliares);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var historiaClinica = baseDTO as HistoriaClinica;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_HISTORIA_CLINICA_PR" };
            sqlOperation.AddIntParam("P_ID", historiaClinica.Id);
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
        public List<HistoriaClinica> RetrieveByExpedienteId(HistoriaClinica historiaClinica)
        {
            var lstHistoriaClinicas = new List<HistoriaClinica>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_HIST_CLINICA_POR_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_EXPEDIENTE_ID", historiaClinica.IdExpediente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var historiaClinicaSel = BuildHistoriaClinica(row);
                    lstHistoriaClinicas.Add(historiaClinicaSel);
                }
            }

            return lstHistoriaClinicas;
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override void Update(BaseDTO baseDTO)
        {
            // Convertir BaseDTO a una Historia Clinica
            var historiaClinica = baseDTO as HistoriaClinica;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_HISTORIA_CLINICA_PR" };

            sqlOperation.AddIntParam("P_ID", historiaClinica.Id);
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", historiaClinica.IdExpediente);
            sqlOperation.AddVarcharParam("P_ANTECEDENTES", historiaClinica.Antecedentes);
            sqlOperation.AddVarcharParam("P_HABITOS_NO_SALUDABLES", historiaClinica.HabitosNoSaludables);
            sqlOperation.AddVarcharParam("P_ENFERMEDADES_FAMILIARES", historiaClinica.EnfermedadesFamiliares);

            _dao.ExecuteProcedure(sqlOperation);
        }

        private HistoriaClinica BuildHistoriaClinica(Dictionary<string, object> row)
        {
            var historiaClinicaToReturn = new HistoriaClinica()
            {
                Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                IdExpediente = row["Id_Expediente"] != DBNull.Value ? (int)row["Id_Expediente"] : 0,
                Antecedentes = row["Antecedentes"] != DBNull.Value ? (string)row["Antecedentes"] : string.Empty,
                HabitosNoSaludables = row["Habitos_No_Saludables"] != DBNull.Value ? (string)row["Habitos_No_Saludables"] : string.Empty,
                EnfermedadesFamiliares = row["Enfermedades_Familiares"] != DBNull.Value ? (string)row["Enfermedades_Familiares"] : string.Empty,


            };

            return historiaClinicaToReturn;
        }
    }
}
