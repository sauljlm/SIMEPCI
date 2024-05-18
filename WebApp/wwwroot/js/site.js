function mostrarAvatar() {
    let avatarimg = localStorage.getItem('AvatarImg');
    let avatarrequest = localStorage.getItem('Avatar');
    if (!avatarimg) {
        $.ajax({
            url: 'https://localhost:7081/Files/Image',
            type: 'GET',
            data: { fileName: avatarrequest },
            success: function (response) {
                localStorage.setItem('AvatarImg', response.img)
                $('#avataruser').attr('src', response.img); 
            },
            error: function (xhr, status, error) {
                // Manejar errores de la solicitud AJAX
                console.error('Error al obtener la imagen:', error);
            }
        });
    }
    else {
        $('#avataruser').attr('src', avatarimg); 
    }
    
}

function gestionarRoles(lista) {
    $('#NavSIMEPCI li').each(function () {
        let enlace = $(this).find('a');

        let valorAtributo = enlace.attr('href');
        if (valorAtributo != "" && valorAtributo != undefined) {
            let indicador = valorAtributo.substring(1)

            if (lista.indexOf(indicador) === -1) {

                $(this).addClass('d-none');
            }
        }

    });
}

function SiteController() {
    this.ViewName = "_Layout";

    this.InitView = function () {
        this.GestionRoles();
        mostrarAvatar();

        $("#aCerrarSesion").click(function () {
            // Mostrar el SweetAlert para confirmar el cierre de sesión
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Estás seguro que deseas cerrar sesión?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0353A4',
                cancelButtonColor: '#f27474',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                // Si el usuario confirma que desea cerrar sesion, ejecutar el código para cerrar sesión
                if (result.isConfirmed) {
                    window.location.href = '/Login'; // Reemplaza '/logout' con la URL de tu página de cierre de sesión
                }
            });
        });

        $('.open-menu-btn').on('click', function () {
            if ($('body').hasClass('closed-menu')) {
                $('body').removeClass('closed-menu');
                $('#LogoSIMEPCI').removeClass('NotshowLog');
            } else {
                $('#LogoSIMEPCI').addClass('NotshowLog');
                $('body').addClass('closed-menu');
            }
        });

        var contenido = localStorage.getItem('userName');

        // Verificar si el contenido existe en localStorage
        if (contenido) {
            // Establecer el contenido del elemento <p> con el string de localStorage
            $('#NombreUsuario').text(contenido);
        } else {
            // Si no hay contenido en localStorage, mostrar un mensaje de error
            $('#NombreUsuario').text('Nombre de usuario');
        }
    }

    this.GestionRoles = function () {
        let rol = localStorage.getItem("Rol")
        if (rol == "Administrador") {
            gestionarRoles(['Usuario', 'Sede', 'CrearCupos', 'GestionCupos','Expedientes','Perfil','Configuracion', 'ReporteCalidad', 'ReporteFinanciero']);
            $('#NavSIMEPCI').removeClass('opacity-0');
        }
        if (rol == "Secretario") {
            gestionarRoles(['Usuario', 'Expedientes', 'Perfil', 'Configuracion', 'GestionCupos']);
            $('#NavSIMEPCI').removeClass('opacity-0');
        }
        if (rol == "Paciente") {
            gestionarRoles(['AgendarCita', 'MisCitas', 'Perfil', 'Configuracion', 'MisRecetas', 'Expedientes', ]);
            $('#NavSIMEPCI').removeClass('opacity-0');
        }
  
        if (rol == "Enfermero") {
            gestionarRoles(['Expedientes', 'Perfil', 'Configuracion', 'GestionRecetas', 'Recetas']);
            $('#NavSIMEPCI').removeClass('opacity-0');
        }


        if (rol == "Doctor") {
            gestionarRoles(['Perfil', 'Usuario', 'ProximasConsultas', 'CrearRecetas', 'GestionRecetas', 'Recetas', 'Configuracion', 'Expedientes']);
            $('#NavSIMEPCI').removeClass('opacity-0');
        }
    }
}

// Instanciamiento de la clase
$(document).ready(function () {
    var st = new SiteController();
    st.InitView();
})