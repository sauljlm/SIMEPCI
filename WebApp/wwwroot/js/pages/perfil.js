function PerfilController() {
    this.ViewName = "Perfil";

    this.InitView = function () {
        var pf = new PerfilController();
        $("#CambiarContra").click(function () {
            pf.CambiarContrasenna();
        });

        pf.NombreUsuario();
        pf.RolUsuario();
        pf.ImgUsuario();
    }

    this.CambiarContrasenna = function () {
        Swal.fire({
            title: "Ingrese su nueva clave de acceso",
            input: "password",
            inputAttributes: {
                autocapitalize: "Cancelar"
            },
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async (contra) => {
                try {
                    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(contra)) {
                        return Swal.showValidationMessage(`La contrase&ntilde;a debe contener al menos una letra may&ntilde;scula, una letra min&uacute;scula, un n&uacute;mero y un car&uacute;cter especial`);
                    }

                    const token = localStorage.getItem("token");
                    const encodedContra = encodeURIComponent(contra); // Codificar la contraseña

                    const Url = `https://localhost:7081/Security/CambiarContrasena?contrasena=${encodedContra}`;

                    const response = await fetch(Url, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        let data = await response.json();
                        if (data.message == "No puedes usar una contrasenna que hayas usado anteriormente.") {
                            return Swal.showValidationMessage(`No puede utilizar una contrase&ntilde;a anterior`);
                        }
                    }

                    return response.json();
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `Contrase&ntilde;a actualizada correctamente`,
                });
            }
        });
    }

    this.NombreUsuario = function () {
        let nombreusuario = localStorage.getItem('userName');

        // Verificar si el contenido existe en localStorage
        if (nombreusuario) {
            // Establecer el contenido del elemento <p> con el string de localStorage
            $('#usuariNombre').text(nombreusuario);
        } else {
            // Si no hay contenido en localStorage, mostrar un mensaje de error
            $('#usuariNombre').text('Nombre de usuario');
        }
    }

    this.RolUsuario = function () {

        let rol = localStorage.getItem('Rol');

        // Verificar si el contenido existe en localStorage
        if (rol) {
            // Establecer el contenido del elemento <p> con el string de localStorage
            $('#RolUsuario').text(rol);
        } else {
            // Si no hay contenido en localStorage, mostrar un mensaje de error
            $('#RolUsuario').text('Rol');
        }

    }

    this.ImgUsuario = function () {
        let avatarimg = localStorage.getItem('AvatarImg');
        let avatarrequest = localStorage.getItem('Avatar');
        if (!avatarimg) {
            $.ajax({
                url: 'https://localhost:7081/Files/Image',
                type: 'GET',
                data: { fileName: avatarrequest },
                success: function (response) {
                    $('#PerfilImagen').attr('src', response.img);
                },
                error: function (xhr, status, error) {
                    // Manejar errores de la solicitud AJAX
                    console.error('Error al obtener la imagen:', error);
                }
            });
        }
        else {
            $('#PerfilImagen').attr('src', avatarimg);
        }
    }

}

// Instanciamiento de la clase
$(document).ready(function () {
    var pc = new PerfilController();
    pc.InitView();
})

