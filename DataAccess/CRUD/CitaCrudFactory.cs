using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class CitaCrudFactory : CrudFactory
    {
        public CitaCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo 
            var cita = baseDTO as Cita;
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_CITA_PR" };
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", cita.IdExpediente);
            sqlOperation.AddIntParam("P_ID_DISPONIBILIDAD_CUPO", cita.IdDisponibilidadCupo);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public void CreatePagoCita(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo 
            var factura = baseDTO as Factura;
            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_PAGO_CONSULTA_PR" };
            sqlOperation.AddIntParam("P_ID_CITA", factura.IdCita);
            sqlOperation.AddIntParam("P_ID_IMPUESTO", factura.IdImpuesto);
            sqlOperation.AddDecimalParam("P_MONTO_TOTAL", factura.MontoTotal);
            sqlOperation.AddDecimalParam("P_MONTO_BASE", factura.MontoBase);
            sqlOperation.AddDateTimeParam("P_FECHA_PAGO", factura.FechaPago);
            sqlOperation.AddVarcharParam("P_TIPO_DE_PAGO", factura.TipoPago);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Update(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }

        public override void Delete(BaseDTO baseDTO)
        {
            // Convertir el BaseDTO en un disponibilidad cupo
            var cita = baseDTO as Cita;

            // Creacion de instructivo para que el DAO
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_CITA_PR" };
            sqlOperation.AddIntParam("P_ID", cita.Id);
            sqlOperation.AddIntParam("P_ID_DISPONIBILIDAD_CUPO", cita.IdDisponibilidadCupo);

            // Ir al DAO a ejecutar
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override List<T> RetrieveAll<T>()
        {
            var lstCitas= new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_CITA_ALL_PR" };

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var cita = BuildCita(row);
                    lstCitas.Add((T)Convert.ChangeType(cita, typeof(T)));
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
            if (typeof(T) == typeof(Cita))
            {
                var sqlOperation = new SqlOperation { ProcedureName = "RET_CITA_BY_ID_PR" };
                sqlOperation.AddIntParam("P_ID", id);

                var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

                if (listResults.Count > 0)
                {
                    var row = listResults[0];
                    var usuario = BuildCita(row);
                    return (T)Convert.ChangeType(usuario, typeof(T));
                }
            }
            else
            {
                throw new ArgumentException("Invalid type parameter for RetrieveById");
            }
            return default(T);
        }

        public  int RetrieveByExpediente(int id)
        {
            var sqlOperation = new SqlOperation { ProcedureName = "RET_VALIDACION_ESTADO_CUENTA_PACIENTE_PR" };
            sqlOperation.AddIntParam("P_ID_Expediente", id);

            var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (listResults.Count > 0)
            {
                var row = listResults[0];

                return (int)row["Resultado"];
            }
            return 0;
        }
        public List<Cita> RetrieveByExpedienteId(Cita cita)
        {
            var lstCitas = new List<Cita>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_CITA_BY_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_EXPEDIENTE_ID", cita.IdExpediente);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var citaSel = BuildCita(row);
                    lstCitas.Add(citaSel);
                }
            }

            return lstCitas;
        }

        private Cita BuildCita(Dictionary<string, object> row)
        {
            var citaToReturn = new Cita()
            {
                Id = (int)row["Id"],
                IdExpediente = (int)row["Id_Expediente"],
                IdDisponibilidadCupo = (int)row["Id_Disponibilidad_Cupo"],
                IdDoctor = (int)row["Id_Usuario_Doctor"],
                NombreDoctor = (string)row["NombreDoctor"],
                ApellidoUnoDoctor = (string)row["Apellido_Uno"],
                ApellidoDosDoctor = (string)row["Apellido_Dos"],
                NombrePaciente = (string)row["NombrePaciente"],
                ApellidoUnoPaciente = (string)row["ApellidoUnoPaciente"],
                ApellidoDosPaciente = (string)row["ApellidoDosPaciente"],
                NombreSede = (string)row["Nombre"],
                HoraCupo = (DateTime)row["Hora_Cupo"],
                Provincia = (string)row["Provincia"],
                Canton = (string)row["Canton"],
                Distrito = (string)row["Distrito"],
                OtrasSennas = (string)row["Otras_Sennas"],
                Especialidad = (string)row["Especialidad"],
                Precio = (double)row["Precio"],
                IdImpuesto = (int)row["IdImpuesto"],
                Estado = (string)row["Estado"]

            };

            return citaToReturn;
        }
    }
}
