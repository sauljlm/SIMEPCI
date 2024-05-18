using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAOs
{
    public class SqlDao
    {
        private string _connectionString;

        private static SqlDao _instance;

        private SqlDao()
        {
            //String de conexión
            _connectionString = "Data Source=srv-db-kgonzalez202401.database.windows.net;Initial Catalog=SIMEPCI;Persist Security Info=True;User ID=sysman;Password=Cenfotec123!;Encrypt=True;Trust Server Certificate=True";
        }

        public static SqlDao GetInstance()
        {
            if (_instance == null)
            {
                _instance = new SqlDao();
            }
            return _instance;
        }

        public void ExecuteProcedure(SqlOperation sqlOperation)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(sqlOperation.ProcedureName, conn)
                {
                    CommandType = CommandType.StoredProcedure
                })
                {
                    foreach (var param in sqlOperation.Parameters)
                    {
                        command.Parameters.Add(param);
                    }
                    conn.Open();

                    command.ExecuteNonQuery();
                }
            }
        }

        public List<Dictionary<string, object>> ExecuteQueryProcedure(SqlOperation sqlOperation)
        {
            var lstResults = new List<Dictionary<string, object>>();

            using (var conn = new SqlConnection(_connectionString))

            {
                using (var command = new SqlCommand(sqlOperation.ProcedureName, conn)

                {

                    CommandType = CommandType.StoredProcedure

                })

                {
                    foreach (var param in sqlOperation.Parameters)

                    {
                        command.Parameters.Add(param);

                    }
                    conn.Open();

                    var reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var row = new Dictionary<string, object>();

                            for (var index = 0; index < reader.FieldCount; index++)

                            {
                                var key = reader.GetName(index);

                                var value = reader.GetValue(index);

                                row[key] = value;
                            }
                            lstResults.Add(row);
                        }
                    }
                }
            }
            return lstResults;

        }
    }
}
