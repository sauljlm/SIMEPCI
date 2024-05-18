namespace DTOs.Security
{
    /// <summary>
    /// Respuesta para una solictud de acceso
    /// </summary>
    public class AuthenticationResponse
    {
        /// <summary>
        /// ID del usuario
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// Nombre del usuario
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Rol
        /// </summary>
        public string Rol { get; set; }
        /// <summary>
        /// Especialidad
        /// </summary>
        public string Especialidad { get; set; }

        /// <summary>
        /// ID Expediente
        /// </summary>
        public int IdExpediente { get; set; }

        /// <summary>
        /// Indica la fecha y hora en que expira el acceso.
        /// </summary>
        public DateTime ExpiresIn { get; set; }

        /// <summary>
        /// Razón o mensajes asociados a la autenticación.
        /// </summary>
        public string Reason { get; set; }


        /// <summary>
        /// Token de acceso
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// E-Mail del Usuario.
        /// </summary>
        public int Identificacion { get; set; }

        public string Avatar { get; set; }

        public delegate dynamic GenerateJWT(Token token);
        
        public void setToken(Token token, GenerateJWT generatetoken)
        {
            Identificacion = token.getIdentificacion();
            ExpiresIn = token.getDateExpire();
            UserName = token.getName();
            Rol = token.getRol();
            Especialidad = token.getEspecialidad();
            IdExpediente = token.getIdExpediente();
            Token = generatetoken(token);
            UserId = token.getId();
            Avatar = token.Avatar;
        }

    }
}
