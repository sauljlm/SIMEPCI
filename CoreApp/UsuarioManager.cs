using DataAccess.CRUD;
using DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreApp
{
    public class UsuarioManager
    {
        public void Create(Usuario user)
        {
            var uc = new UsuarioCrudFactory();
            var existingEmail = uc.RetrieveByEmail(user);
            var existingIdentificacion = uc.RetrieveByIdentificacion(user.Identificacion);

            if (existingEmail == null)
            {
                if (existingIdentificacion == null)
                {
                    if (ValidateSpecialty(user))
                    {
                        uc.Create(user);
                    }
                    else
                    {
                        throw new Exception("Especialidad es requerida cuando Tipo es 'medico'");
                    }
                }
                else
                {
                    throw new Exception("La identificación ya ha sido registrada");
                }
            }
            else
            {
                throw new Exception("El correo electrónico ya ha sido registrado");
            }
        }

        private static bool ValidateSpecialty(Usuario user)
        {
            if (user.Tipo == "Medico" && string.IsNullOrEmpty(user.Especialidad))
            {
                return false;
            } 
            else
            {
                return true;
            }
        }

        public List<Usuario> RetrieveAll()
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveAll<Usuario>();
        }

        public Usuario RetrieveUserByEmail(Usuario u)
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveByEmail(u);
        }

        public Usuario RetrieveUserByIdentificacion(int Identificacion)
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveByIdentificacion(Identificacion);
        }
        public Usuario RetrieveUsuarioById(Usuario u)
        {
            var sc = new UsuarioCrudFactory();
            return sc.RetrieveById<Usuario>(u.Id);
        }

        public Usuario RetrieveByExpediente(int id)
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveByExpediente<Usuario>(id);
        }

        public void Update(Usuario user)
        {
            var um = new UsuarioCrudFactory();
            if (user.Tipo.Equals("-7"))
            {
                um.UpdateConfig(user);
            }
            else { 
                um.Update(user);
            }            
        }

     
        public void AuthenticateEmail(Usuario user)
        {
            var um = new UsuarioCrudFactory();
            um.AuthenticateEmail(user);
        }

        public List<Usuario> RetrieveAllPacientes()
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveAllPacientes();
        }

        public List<Usuario> RetrieveAllTipo()
        {
            var uc = new UsuarioCrudFactory();
            return uc.RetrieveAllTipo<Usuario>();
        }

        public void Delete(Usuario usuario)
        {
            var uc = new UsuarioCrudFactory();
            uc.Delete(usuario);
        }
    }
}
