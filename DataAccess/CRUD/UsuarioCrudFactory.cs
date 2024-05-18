using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class UsuarioCrudFactory : CrudFactory
    {
        public UsuarioCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }
        public override void Create(BaseDTO baseDTO)
        {
            var user = baseDTO as Usuario;
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_USUARIO_PR" };

            sqlOperation.AddIntParam("P_IDENTIFICACION", user.Identificacion);
            sqlOperation.AddVarcharParam("P_NOMBRE", user.Nombre);
            sqlOperation.AddVarcharParam("P_APELLIDO_UNO", user.ApellidoUno);
            sqlOperation.AddVarcharParam("P_APELLIDO_DOS", user.ApellidoDos);
            sqlOperation.AddVarcharParam("P_TELEFONO", user.Telefono);
            sqlOperation.AddVarcharParam("P_CORREO", user.Correo);
            sqlOperation.AddIntParam("P_AUTENTIFICACION_CORREO", 0);
            sqlOperation.AddVarcharParam("P_SEXO", user.Sexo);
            sqlOperation.AddDateTimeParam("P_FECHA_NACIMIENTO", user.FechaNacimiento);
            sqlOperation.AddDecimalParam("P_LATITUD", user.Latitud);
            sqlOperation.AddDecimalParam("P_LONGITUD", user.Longitud);
            sqlOperation.AddVarcharParam("P_FOTO_PERFIL", user.FotoPerfil);
            sqlOperation.AddVarcharParam("P_ESTADO", user.Estado);
            sqlOperation.AddVarcharParam("P_TIPO", user.Tipo);
            sqlOperation.AddVarcharParam("P_ESPECIALIDAD", user.Especialidad);
            sqlOperation.AddIntParam("P_ID_SEDE", user.IdSede);
            sqlOperation.AddVarcharParam("P_CONTRASENNA", user.Contrasenna);
            sqlOperation.AddVarcharParam("P_VALIDACION_PERFIL", user.ValidacionPerfil);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            var usuario = baseDTO as Usuario;
            var sqlOperation = new SqlOperation { ProcedureName = "DEL_USUARIO_PR" };
            sqlOperation.AddIntParam("P_ID", usuario.Id);
            _dao.ExecuteProcedure(sqlOperation);
        }

        public override T Retrieve<T>()
        {
            throw new NotImplementedException();
        }

        public override List<T> RetrieveAll<T>()
        {
            var usuarioList = new List<T>();

            var sqlOperation = new SqlOperation() { ProcedureName = "RET_ALL_USUARIOS" };

            var results = _dao.ExecuteQueryProcedure(sqlOperation);
            if (results.Count > 0)
            {
                foreach (var row in results)
                {
                    var usuario = BuildUsuario(row);
                    usuarioList.Add((T)Convert.ChangeType(usuario, typeof(T)));
                }
            }

            return usuarioList;
        }

        public override T RetrieveById<T>(int id)
        {
            if (typeof(T) == typeof(Usuario))
            {
                var sqlOperation = new SqlOperation { ProcedureName = "RET_USUARIO_BY_ID_PR" };
                sqlOperation.AddIntParam("P_ID", id);

                var listResults = _dao.ExecuteQueryProcedure(sqlOperation);

                if (listResults.Count > 0)
                {
                    var row = listResults[0];
                    var usuario = BuildUsuario(row);
                    return (T)Convert.ChangeType(usuario, typeof(T));
                }
            }
            else
            {
                throw new ArgumentException("Invalid type parameter for RetrieveById");
            }
            return default(T);
        }

        public List<T> RetrieveAllTipo<T>()
        {
            var lstUsers = new List<T>();
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_USUARIO_TIPO_ALL_PR" };
            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var user = BuildUsuarioTipo(row);
                    lstUsers.Add((T)Convert.ChangeType(user, typeof(T)));
                }
            }

            return lstUsers;
        }

        public Usuario RetrieveByEmail(Usuario u)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_USUARIO_POR_CORREO" };

            sqlOperation.AddVarcharParam("P_CORREO", u.Correo);

            var lsResult = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lsResult.Count > 0)
            {
                var row = lsResult[0];
                var user = BuildUsuario(row);

                return user;
            }
            return null;
        }

        public Usuario RetrieveByIdentificacion(int Identificacion)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_USUARIO_POR_IDENTIFICACION" };

            sqlOperation.AddIntParam("P_IDENTIFICACION", Identificacion);

            var lsResult = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lsResult.Count > 0)
            {
                var row = lsResult[0];
                var user = BuildUsuario(row);

                return user;
            }
            return null;
        }

        // Función para obtener solo los pacientes que no poseen expediente
        public List<Usuario> RetrieveAllPacientes()
        {
            var lstUsuarios = new List<Usuario>();

            // Se utiliza el sqlOperation necesario
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_USUARIO_TIPO_PACIENTE_PR" };

            // Invocamos al método que se encarga de ejecutar el precedure, dándonos los datos
            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);


            if (lstResults.Count > 0)
            {
                foreach (var row in lstResults)
                {
                    var expediente = BuildUsuario(row);
                    lstUsuarios.Add(expediente);
                }
            }

            return lstUsuarios;
        }

        public T RetrieveByIdentificacion<T>(string id)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RE_USUARIO_POR_IDENTIFICACION_PR" };
            sqlOperation.AddVarcharParam("@P_IDENTIFICACION", id);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                var row = lstResults[0];

                var user = BuildUsuario(row);

                return (T)(object)user;
            }

            return default(T);
        }

        public T RetrieveByExpediente<T>(int id)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "RET_USUARIO_BY_EXPEDIENTE_PR" };
            sqlOperation.AddIntParam("P_ID_EXPEDIENTE", id);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                var row = lstResults[0];

                var user = BuildUsuario(row);

                return (T)(object)user;
            }

            return default(T);
        }

        public override void Update(BaseDTO baseDTO)
        {
            var user = baseDTO as Usuario;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_USUARIO_PR" };

            sqlOperation.AddIntParam("P_ID", user.Id);
            sqlOperation.AddIntParam("P_IDENTIFICACION", user.Identificacion);
            sqlOperation.AddVarcharParam("P_NOMBRE", user.Nombre);
            sqlOperation.AddVarcharParam("P_APELLIDO_UNO", user.ApellidoUno);
            sqlOperation.AddVarcharParam("P_APELLIDO_DOS", user.ApellidoDos);
            sqlOperation.AddVarcharParam("P_TELEFONO", user.Telefono);
            sqlOperation.AddVarcharParam("P_CORREO", user.Correo);
            sqlOperation.AddVarcharParam("P_SEXO", user.Sexo);
            sqlOperation.AddDateTimeParam("P_FECHA_NACIMIENTO", user.FechaNacimiento);
            sqlOperation.AddDecimalParam("P_LATITUD", user.Latitud);
            sqlOperation.AddDecimalParam("P_LONGITUD", user.Longitud);
            sqlOperation.AddVarcharParam("P_FOTO_PERFIL", user.FotoPerfil);
            sqlOperation.AddVarcharParam("P_ESTADO", user.Estado);
            sqlOperation.AddVarcharParam("P_VALIDACION_PERFIL", user.ValidacionPerfil);

            sqlOperation.AddVarcharParam("P_TIPO", user.Tipo);
            sqlOperation.AddVarcharParam("P_ESPECIALIDAD", user.Especialidad);

            sqlOperation.AddIntParam("P_ID_SEDE", user.IdSede);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public void UpdateConfig(BaseDTO baseDTO)
        {
            var user = baseDTO as Usuario;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_USUARIO_CONFIG_PR" };

            sqlOperation.AddIntParam("P_ID", user.Id);
            sqlOperation.AddVarcharParam("P_NOMBRE", user.Nombre);
            sqlOperation.AddVarcharParam("P_APELLIDO_UNO", user.ApellidoUno);
            sqlOperation.AddVarcharParam("P_APELLIDO_DOS", user.ApellidoDos);
            sqlOperation.AddVarcharParam("P_TELEFONO", user.Telefono);
            sqlOperation.AddVarcharParam("P_CORREO", user.Correo);
            sqlOperation.AddVarcharParam("P_SEXO", user.Sexo);
            sqlOperation.AddDateTimeParam("P_FECHA_NACIMIENTO", user.FechaNacimiento);
            sqlOperation.AddDecimalParam("P_LATITUD", user.Latitud);
            sqlOperation.AddDecimalParam("P_LONGITUD", user.Longitud);
            sqlOperation.AddVarcharParam("P_FOTO_PERFIL", user.FotoPerfil);
            _dao.ExecuteProcedure(sqlOperation);
        }

        public void AuthenticateEmail(BaseDTO baseDTO)
        {
            var user = baseDTO as Usuario;

            var sqlOperation = new SqlOperation { ProcedureName = "UPD_USUARIO_AUTENTIFICAR_PR" };

            sqlOperation.AddIntParam("P_ID", user.Id);
            sqlOperation.AddIntParam("P_AUTENTIFICACION_CORREO", user.AutentificacionCorreo);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public T CredentialUsuario<T>(string id, string contrasenna)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "SP_VERIFY_USER" };
            sqlOperation.AddVarcharParam("Identificacion ", id);
            sqlOperation.AddVarcharParam("Contrasenna ", contrasenna);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                var row = lstResults[0];

                var user = BuildUsuario(row);

                return (T)(object)user;
            }

            return default(T);
        }

        public string CreateOTP(int usuario, string contrasenna)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "CRE_CONTRASENNA_OTP" };
            sqlOperation.AddIntParam("P_IDUSER", usuario);
            sqlOperation.AddVarcharParam("P_CONTRASENNA", contrasenna);

            var lstResults = _dao.ExecuteQueryProcedure(sqlOperation);

            if (lstResults.Count > 0)
            {
                var row = lstResults[0];

                string email = (string)row["Correo"];

                return email;
            }
            return string.Empty;
        }
        public void CreateContra(int usuario, string contrasenna)
        {
            var sqlOperation = new SqlOperation() { ProcedureName = "CRE_REGISTRAR_CONTRASENNA_PR" };
            sqlOperation.AddIntParam("P_ID_USUARIO", usuario);
            sqlOperation.AddVarcharParam("P_NUEVA_CONTRASENNA", contrasenna);

            _dao.ExecuteProcedure(sqlOperation);
        }
        private Usuario BuildUsuario(Dictionary<string, object> map)
        {
            var usuario = new Usuario()
            {
                Id = (int)map["Id"],
                Identificacion = (int)map["Identificacion"],
                Nombre = (string)map["Nombre"],
                ApellidoUno = (string)map["Apellido_Uno"],
                ApellidoDos = (string)map["Apellido_Dos"],
                Telefono = (string)map["Telefono"],
                Correo = (string)map["Correo"],
                Sexo = (string)map["Sexo"],
                FechaNacimiento = (DateTime)map["Fecha_Nacimiento"],
                Latitud = (decimal)map["Latitud"],
                Longitud = (decimal)map["Longitud"],
                FotoPerfil = (string)map["Foto_Perfil"],
                Estado = (string)map["Estado"]
            };

            if (map.ContainsKey("Tipo"))
            {
                usuario.Tipo = (string)map["Tipo"];
            }

            if (map.ContainsKey("Especialidad"))
            {
                usuario.Especialidad = (string)map["Especialidad"];
            }

            if (map.ContainsKey("Id_Expediente"))
            {
                usuario.idExpediente = (int)map["Id_Expediente"];
            }

            return usuario;
        }

        private Usuario BuildUsuarioTipo(Dictionary<string, object> map)
        {
            var usuario = new Usuario()
            {
                Id = (int)map["Id"],
                Identificacion = (int)map["Identificacion"],
                Nombre = (string)map["Nombre"],
                ApellidoUno = (string)map["Apellido_Uno"],
                ApellidoDos = (string)map["Apellido_Dos"],
                Telefono = (string)map["Telefono"],
                Correo = (string)map["Correo"],
                Sexo = (string)map["Sexo"],
                FechaNacimiento = (DateTime)map["Fecha_Nacimiento"],
                Latitud = (decimal)map["Latitud"],
                Longitud = (decimal)map["Longitud"],
                FotoPerfil = (string)map["Foto_Perfil"],
                Estado = (string)map["Estado"],
                ValidacionPerfil = (string)map["Validacion_Perfil"],
                Tipo = (string)map["Tipo"],
                Especialidad = (string)map["Especialidad"],
                IdSede = (int)map["Id_Sede"],
            };

            return usuario;
        }
    }
}