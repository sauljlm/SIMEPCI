// Función para inicializar el mapa
function initMap() {
    var map = new google.maps.Map($('#map').get(0), {
        center: { lat: 9.9281, lng: -84.0907 },
        zoom: 8
    });

    var marker = new google.maps.Marker({
        position: { lat: 9.9281, lng: -84.0907 },
        map: map,
        draggable: true
    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        $('#txtLatitud').val(this.getPosition().lat());
        $('#txtLongitud').val(this.getPosition().lng());
    });
}

// Controlador de configuración
function ConfiguracionController() {
    this.ViewName = "Configuraciones";
    this.ApiService = "Usuario";
    this.SedeService = "Sede";

    this.InitView = function () {
        var iu = new ConfiguracionController();
        $("#btnUpdate").click(function () {
            // Validar los campos antes de enviar la solicitud de actualización
            iu.validarCampos()
            iu.Update();
            iu.ImgUsuario();
        });
        iu.ImgUsuario();
    };
    this.validarCampos = function () {
        var camposValidos = true;

        // Verificar si los campos requeridos están llenos
        if ($("#slctSexo").val() === "" ||
            $("#txtCorreo").val() === "" ||
            $("#txtNombre").val() === "" ||
            $("#txtTelefono").val() === "" ||
            $("#txtFoto").val() === "" ||
            $("#txtApellidoDos").val() === "" ||
            $("#txtApellidoUno").val() === "") {
            camposValidos = false;
        }

        return camposValidos;
    };

    this.Update = function () {
        var usuario = {};
        // Actualizar usuario
        usuario.Id = $("#txtId").val();
        usuario.Identificacion = $("#txtIdentificacion").val();
        usuario.Nombre = $("#txtNombre").val();
        usuario.ApellidoUno = $("#txtApellidoUno").val();
        usuario.ApellidoDos = $("#txtApellidoDos").val();
        usuario.Telefono = $("#txtTelefono").val();
        usuario.Correo = $("#txtCorreo").val();
        usuario.Sexo = $("#slctSexo").val();
        usuario.FechaNacimiento = $("#txtFechaNacimiento").val();
        usuario.Latitud = $("#txtLatitud").val();
        usuario.Longitud = $("#txtLongitud").val();
        usuario.Estado = "AC";
        usuario.ValidacionPerfil = "-7";
        usuario.Tipo = "-7";
        usuario.FotoPerfil = $("#txtFoto").val();
        usuario.Especialidad = "-7";

        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Update";
        console.log($("#txtFoto").val())


        if ($("#txtFoto").val() != '') {
            let avatar = $("#txtFoto")[0].files[0];
            // Crear un objeto FormData y agregar la imagen al mismo
            var formData = new FormData();
            formData.append('file', avatar);

            $.ajax({
                url: 'https://localhost:7081/Files/Image',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    usuario.FotoPerfil = response.fileName
                    console.log(usuario.FotoPerfil)
                    ca.PutToAPI(serviceRoute, usuario, function () {

                        localStorage.setItem('userName', usuario.Nombre + " " + usuario.ApellidoUno + " " + usuario.ApellidoDos);
                        localStorage.setItem('Especialidad', usuario.Especialidad);
                        $.ajax({
                            url: 'https://localhost:7081/Files/Image',
                            type: 'GET',
                            data: { fileName: usuario.FotoPerfil },
                            success: function (response) {
                                localStorage.setItem('AvatarImg', response.img)
                                $('#avataruser').attr('src', response.img);
                            },
                            error: function (xhr, status, error) {
                                // Manejar errores de la solicitud AJAX
                                console.error('Error al obtener la imagen:', error);
                            }
                        });
                        //$("#avataruser").attr("src", usuario.FotoPerfil);

                        setTimeout(function () {
                            window.location.href = "/configuracion";
                        }, 1000);
                        
                    });
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener la imagen:', error);
                }
            });
        } else {
            usuario.FotoPerfil = perfilActual
            ca.PutToAPI(serviceRoute, usuario, function () {

                var vc = new UserController();

                setTimeout(function () {
                    window.location.href = "/configuracion";
                }, 1000);
            });
        }
    };

    this.ImgUsuario = function () {
        let avatarimg = localStorage.getItem('AvatarImg');
        let avatarrequest = localStorage.getItem('Avatar');
        if (!avatarimg) {
            $.ajax({
                url: 'https://localhost:7081/Files/Image',
                type: 'GET',
                data: { fileName: avatarrequest },
                success: function (response) {
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
}

// Función para mostrar los datos del usuario y configurar la funcionalidad de actualización
function MostrarDatosUsuario() {
    // Obtener el ID del usuario desde el localStorage
    var userId = localStorage.getItem('userId');

    // Verificar si el ID del usuario está presente
    if (userId) {
        // Invocar al API para obtener los datos del usuario por su ID
        var ca = new ControlActions();
        var serviceRoute = "Usuario/RetrieveById/" + userId; // Ruta del servicio API para obtener el usuario por su ID

        ca.GetToApi(serviceRoute, function (usuario) {
            // Verificar si se encontró el usuario
            if (usuario) {
                // Llenar el formulario con los datos del usuario
                $("#txtId").val(usuario.id).prop('disabled', true); // Deshabilitar el campo de tipo de id
                $("#txtIdentificacion").val(usuario.identificacion).prop('disabled', true);// Deshabilitar el campo de identificacion
                $("#txtNombre").val(usuario.nombre);
                $("#txtApellidoUno").val(usuario.apellidoUno);
                $("#txtApellidoDos").val(usuario.apellidoDos);
                $("#txtTelefono").val(usuario.telefono);
                $("#txtCorreo").val(usuario.correo);
                $("#slctSexo").val(usuario.sexo);
                // Convertir el valor de fecha al formato yyyy-MM-dd
                var fechaNacimiento = new Date(usuario.fechaNacimiento);
                var formattedFechaNacimiento = fechaNacimiento.toISOString().split('T')[0];

                // Asignar el valor formateado al campo de fecha
                $("#txtFechaNacimiento").val(formattedFechaNacimiento);
                $("#txtFoto").val(usuario.foto);
                $("#txtLatitud").val(usuario.latitud);
                $("#txtLongitud").val(usuario.longitud);
            } else {
                console.error("No se encontró ningún usuario con el ID proporcionado.");
            }
        });
    } else {
        console.error("No se encontró ningún ID de usuario en el localStorage.");
    }
}

// Instanciamiento de la clase y configuración inicial
$(document).ready(function () {
    var cc = new ConfiguracionController();
    cc.InitView();
    if (typeof google === 'object' && typeof google.maps === 'object') {
        initMap();
    } else {
        window.addEventListener('load', () => {
            initMap();
        });
    }
    MostrarDatosUsuario();
});
