using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class DiagnosticoCrudFactory : CrudFactory
    {
        public DiagnosticoCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            // Convertir BaseDTO en un Diagnostico
            var diagnostico = baseDTO as Diagnostico;

            var sqlOperation = new SqlOperation { ProcedureName = "CRE_DIAGNOSTICO_PR" };

            sqlOperation.AddIntParam("P_ID_CITA", diagnostico.IdCita);
            sqlOperation.AddIntParam("P_USUARIO_DOCTOR", diagnostico.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_NOMBRE", diagnostico.Nombre);
            sqlOperation.AddVarcharParam("P_DESCRIPCION", diagnostico.Descripcion);
            sqlOperation.AddDateTimeParam("P_FECHA_DIAGNOSTICO", diagnostico.FechaDiagnostico);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var diagnostico = baseDTO as Diagnostico;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_DIAGNOSTICO_PR" };
            sqlOperation.AddIntParam("P_ID", diagnostico.Id);
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

        public List<Diagnostico> RetrieveByCitaId(Diagnostico diagnostico) 
        {
            var lstDiagnosticos = new List<Diagnostico>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_DIAGNOSTICO_POR_CITA_PR" };
            sqlOperation.AddIntParam("P_CITA_ID", diagnostico.IdCita);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var diagnosticoSel = BuildDiagnostico(row);
                    lstDiagnosticos.Add(diagnosticoSel);
                }
            }

            return lstDiagnosticos;
        }

        public override T RetrieveById<T>(int id)
        {
            throw new NotImplementedException();
        }

        public override void Update(BaseDTO baseDTO)
        {
            var diagnostico = baseDTO as Diagnostico;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_DIAGNOSTICO_PR" };

            sqlOperation.AddIntParam("P_ID", diagnostico.Id);
            sqlOperation.AddIntParam("P_ID_CITA", diagnostico.IdCita);
            sqlOperation.AddIntParam("P_USUARIO_DOCTOR", diagnostico.IdUsuarioDoctor);
            sqlOperation.AddVarcharParam("P_NOMBRE", diagnostico.Nombre);
            sqlOperation.AddVarcharParam("P_DESCRIPCION", diagnostico.Descripcion);
            sqlOperation.AddDateTimeParam("P_FECHA_DIAGNOSTICO", diagnostico.FechaDiagnostico);

            _dao.ExecuteProcedure(sqlOperation);
        }

        private Diagnostico BuildDiagnostico(Dictionary<string, object> row)
        {
            var diagnosticoToReturn = new Diagnostico()
            {
                Id = row["Id"] != DBNull.Value ? (int)row["Id"] : 0,
                IdCita = row["Id_Cita"] != DBNull.Value ? (int)row["Id_Cita"] : 0,
                IdUsuarioDoctor = row["Id_Usuario_Doctor"] != DBNull.Value ? (int)row["Id_Usuario_Doctor"] : 0,
                Nombre = row["Nombre"] != DBNull.Value ? (string)row["Nombre"] : string.Empty,
                Descripcion = row["Descripcion"] != DBNull.Value ? (string)row["Descripcion"] : string.Empty,
                FechaDiagnostico = row["Fecha_Diagnostico"] != DBNull.Value ? (DateTime)row["Fecha_Diagnostico"] : DateTime.MinValue,
                NombreDoctor = row["Nombre_Doctor"] != DBNull.Value ? (string)row["Nombre_Doctor"] : string.Empty,
                ApellidoUnoDoctor = row["Apellido_Uno_Doctor"] != DBNull.Value ? (string)row["Apellido_Uno_Doctor"] : string.Empty,
                ApellidoDosDoctor = row["Apellido_Dos_Doctor"] != DBNull.Value ? (string)row["Apellido_Dos_Doctor"] : string.Empty,


            };

            return diagnosticoToReturn;
        }
    }
}
