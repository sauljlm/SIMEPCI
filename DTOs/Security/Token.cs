using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;

namespace DTOs.Security
{
    public class Token
    {

        private string UserName { get; set; }
        public string Avatar { get; set; }
        private int IdExpediente { get; set; }
        private int Iduser { get; set; }
        private string Rol { get; set; }
        private string Especialidad { get; set; }


        private DateTime TokenCreated { get; set; }
        private DateTime TokenExpires { get; set; }
        private int identificacion { get; set; }
        private string key { get; set; }
        private IResponseCookies Cookie { get; set; }

        private readonly byte[] _keyToken;

        private readonly byte[] _iv;

        public Token(string SecretKey, IResponseCookies cookie)
        {
            _iv = GenerateRandomBytes(16);
            _keyToken = GenerateRandomBytes(32);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _keyToken;
                aesAlg.IV = _iv;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(SecretKey);
                        }
                    }

                    key = Convert.ToBase64String(msEncrypt.ToArray());
                }
            }

            UserName = string.Empty;
            Cookie = cookie;
            Iduser = 0;
            Rol = string.Empty;
            TokenCreated = DateTime.Now;
            TokenExpires = DateTime.Now;
            identificacion =0;


        }

        public Token()
        {
            _iv = GenerateRandomBytes(16);
            _keyToken = GenerateRandomBytes(32);

            UserName = string.Empty;
            key = string.Empty;
            Iduser = 0;
            Rol = string.Empty;
            Especialidad = string.Empty;
            TokenCreated = DateTime.Now;
            TokenExpires = DateTime.Now;
            identificacion = 0;

        }
        public void UserToToken(Usuario usuario)
        {
            UserName = string.Format("{0} {1} {2}", usuario.Nombre, usuario.ApellidoUno, usuario.ApellidoDos).Trim(); ;
            identificacion = usuario.Identificacion;
            Iduser = usuario.Id;
            Rol = usuario.Tipo;
            Especialidad = usuario.Especialidad;
            IdExpediente = usuario.idExpediente;
            Avatar = usuario.FotoPerfil;
        }

        public void setExpires(int tokenExpire)
        {
            TokenExpires = DateTime.UtcNow.AddMinutes(tokenExpire);
        }

        private static byte[] GenerateRandomBytes(int length)
        {
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);
                return randomBytes;
            }
        }

        public string Decrypt(string keyD)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _keyToken;
                aesAlg.IV = _iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(keyD)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        public string getName() => UserName;

        public int getId() => Iduser;

        public int getIdentificacion() => identificacion;

        public string getKey() => key;

        public string getRol() => Rol;
        public string getEspecialidad() => Especialidad;
        public int getIdExpediente() => IdExpediente;

        public DateTime getDateExpire() => TokenExpires;


    }
}
