using DataAccess.DAOs;
using DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.CRUD
{
    public class DireccionCrudFactory : CrudFactory
    {

        // Inicializar el DAO
        public  DireccionCrudFactory()
        {
            _dao = SqlDao.GetInstance();
        }

        public override void Create(BaseDTO baseDTO)
        {
            var sede = baseDTO as Sede;
            var sqlOperation = new SqlOperation { ProcedureName = "CRE_SEDE_PR" };
            sqlOperation.AddVarcharParam("P_NAME", sede.Nombre);
            sqlOperation.AddVarcharParam("P_DESCRIPCION", sede.Descripcion);
            sqlOperation.AddDateTimeParam("P_FECHA_CREACION", sede.FechaCreacion);
            sqlOperation.AddVarcharParam("P_FOTO_SEDE", sede.FotoSede);

            _dao.ExecuteProcedure(sqlOperation);
        }

        public override void Delete(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
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

        public override void Update(BaseDTO baseDTO)
        {
            throw new NotImplementedException();
        }
    }
}
