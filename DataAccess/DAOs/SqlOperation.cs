using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAOs
{
    public class SqlOperation
    {
        public string ProcedureName { get; set; }

        public List<SqlParameter> Parameters { get; set; }
        public SqlOperation()
        {
            Parameters = new List<SqlParameter>();
        }
        public void AddVarcharParam(string paramName, string value)
        {
            Parameters.Add(new SqlParameter(paramName, value));
        }

        public void AddIntParam(string paramName, int value)
        {
            Parameters.Add(new SqlParameter(paramName, value));
        }

        public void AddDateTimeParam(string paramName, DateTime value)
        {
            Parameters.Add(new SqlParameter(paramName, value));
        }
        
        public void AddDoubleParam(string paramName, double value)
        {
            Parameters.Add(new SqlParameter(paramName, value));
        }

        public void AddDecimalParam(string paramName, decimal value)
        {
            Parameters.Add(new SqlParameter(paramName, value));
        }
    }
}
