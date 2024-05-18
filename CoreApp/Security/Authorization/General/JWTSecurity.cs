using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using DTOs.Security;
using DTOs;

namespace webapi.Authorization.General
{
    public class JWTSecurity
    {

        public static dynamic JWTGenerator(Token tokendata)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(tokendata.Decrypt(tokendata.getKey()));

            List<Claim> Claims = new List<Claim>(); 
            Claims.Add(new Claim(ClaimTypes.Name, tokendata.getName()));
            Claims.Add(new Claim(ClaimTypes.NameIdentifier, tokendata.getId().ToString()));


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(Claims),
                Expires = tokendata.getDateExpire(),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encrypterToken = tokenHandler.WriteToken(token);


            return encrypterToken;
        }

        public static string ReadAuthorization(HttpContext context)
        {

            var authorizationHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (authorizationHeader != null && authorizationHeader.StartsWith("Bearer "))
            {

                return authorizationHeader.Substring("Bearer ".Length).Trim();
            }

            return null;
        }

        public static AuthenticationResponse RefreshToken(Token token, HttpContext context)
        {
            AuthenticationResponse result = new AuthenticationResponse();

            token.setExpires(40);
            Usuario user = RequestToUser(context);

            if (user != null)
            {
                token.UserToToken(user);

                result.setToken(token, JWTSecurity.JWTGenerator);

                return result;
            }
            else
            {
                return result;
            }
        }

        public static Usuario RequestToUser(HttpContext context)
        {
            Usuario user = new Usuario();

            string tokenold = JWTSecurity.ReadAuthorization(context);
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(tokenold) as JwtSecurityToken;

            if (jsonToken != null)
            {
                
                if (int.TryParse(jsonToken.Claims.FirstOrDefault(claim => claim.Type == "nameid")?.Value, out int intValue))
                {
                    int nullableIntValue = intValue;


                    user = new Usuario()
                    {
                        Identificacion = nullableIntValue,
                        Nombre = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "unique_name")?.Value
                    };


                    return user;
                }

            }

            return null;
        }
    }
}
