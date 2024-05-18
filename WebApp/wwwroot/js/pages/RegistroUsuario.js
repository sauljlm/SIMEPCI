const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

function initMap() {
    var map = new google.maps.Map($('#map').get(0), {
        center: { lat: 9.9281, lng: -84.0907 }, // Coordenadas centradas en Costa Rica
        zoom: 8
    }); // Zoom inicial

    var marker = new google.maps.Marker({
        position: { lat: 9.9281, lng: -84.0907 }, // Posición inicial del marcador
        map: map,
        draggable: true // Permitir que el marcador sea arrastrable
    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        $('#txtLatitud').val(this.getPosition().lat());
        $('#txtLongitud').val(this.getPosition().lng());
    });
}

function cleanForm() {
    $('[id^="txt"]').val('');
    $("#identificacion").val('');
    $("#nombre").val('');
    $("#apellidoUno").val('');
    $("#apellidoDos").val('');
    $("#telefono").val('');
    $("#correo").val('');
    $("#sexo").val('');
    $("#fechaNacimiento").val('');
    $("#txtLatitud").val('');
    $("#txtLongitud").val('');
    $("#contrasenna").val('');
    $("#confirmarContrasenna").val('');
    $("#fotoPerfil").val('');
    $("#tipo").val('');
    $("#especialidad").val('');
    $("#idSede").val('');
}

function showRegister1() {
    cleanElements();
    $('#registro1').addClass('d-flex');
    $('#registro1').removeClass('d-none');
    $('#crumb-1').addClass('crumb-active');
}

function showRegister2() {
    cleanElements();
    $('#registro2').addClass('d-flex');
    $('#registro2').removeClass('d-none');
    $('#crumb-2').addClass('crumb-active');
}

function showRegister3() {
    cleanElements();
    $('#registro3').addClass('d-flex');
    $('#registro3').removeClass('d-none');
    $('#crumb-3').addClass('crumb-active');
}

function showRegister4() {
    cleanElements();
    $('#registro4').addClass('d-flex');
    $('#registro4').removeClass('d-none');
    $('#crumb-4').addClass('crumb-active');
}

function cleanElements() {
    $('.pantalla-registro').removeClass('d-flex');
    $('.pantalla-registro').addClass('d-none');
    $('.crumb').removeClass('crumb-active');
}

function moveToRegister2() {
    var messageError = validateRegister1();

    if (messageError == "") {
        showRegister2();
    } else {
        Toast.fire({
            icon: "warning",
            title: "El formulario no esta debidamente lleno",
            html: messageError
        });
    }
}

function moveToRegister3() {
    var messageError = validateRegister2();

    if (messageError == "") {
        showRegister3();
    } else {
        Toast.fire({
            icon: "warning",
            title: "El formulario no esta debidamente lleno",
            html: messageError
        });
    }
}

function moveToRegister4() {
    var messageError = validateRegister3(messageError);

    if (messageError == "") {
        showRegister4();
    } else {
        Toast.fire({
            icon: "warning",
            title: "El formulario no esta debidamente lleno",
            html: messageError
        });
    }
}

function validateRegister1() {

    var messageError = "";

    if ($("#identificacion").val() == "") {
        messageError += "<p>Debe de llenar el campo de identificacion</p>";
        $("#identificacion").addClass("input-error");
    } else if (!/^\d{9}$/.test($("#identificacion").val())) {
        messageError += "<p>La Identificación debe tener exactamente 9 caracteres numéricos</p>";
        $("#identificacion").addClass("input-error");
    } else {
        $("#identificacion").removeClass("input-error");
    }

    if ($("#nombre").val() == "") {
        messageError += "<p>Debe de llenar el campo de nombre</p>";
        $("#nombre").addClass("input-error");
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚ\s]+$/.test($("#nombre").val())) {
        messageError += "<p>El campo de nombre solo debe contener letras y espacios</p>";
        $("#nombre").addClass("input-error");
    } else {
        $("#nombre").removeClass("input-error");
    }

    if ($("#apellidoUno").val() == "") {
        messageError += "<p>Debe llenar el campo de Primer Apellido</p>";
        $("#apellidoUno").addClass("input-error");
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚ\s]+$/.test($("#apellidoUno").val())) {
        messageError += "<p>El campo de Primer Apellido solo debe contener letras y espacios</p>";
        $("#apellidoUno").addClass("input-error");
    } else {
        $("#apellidoUno").removeClass("input-error");
    }

    if ($("#apellidoDos").val() == "") {
        messageError += "<p>Debe llenar el campo de Segundo Apellido</p>";
        $("#apellidoDos").addClass("input-error");
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚ\s]+$/.test($("#apellidoDos").val())) {
        messageError += "<p>El campo de Segundo Apellido solo debe contener letras y espacios</p>";
        $("#apellidoDos").addClass("input-error");
    } else {
        $("#apellidoDos").removeClass("input-error");
    }

    if ($("#telefono").val() == "") {
        messageError += "<p>Debe llenar el campo de Teléfono</p>";
        $("#telefono").addClass("input-error");
    } else if (!/^\d{8}$/.test($("#telefono").val())) {
        messageError += "<p>El Teléfono debe tener 8 dígitos numéricos</p>";
        $("#telefono").addClass("input-error");
    } else {
        $("#telefono").removeClass("input-error");
    }

    if ($("#correo").val() == "") {
        messageError += "<p>Debe llenar el campo de Correo Electrónico</p>";
        $("#correo").addClass("input-error");
    } else if (!/\S+@\S+\.\S+/.test($("#correo").val())) {
        messageError += "<p>Ingrese un Correo Electrónico válido</p>";
        $("#correo").addClass("input-error");
    } else {
        $("#correo").removeClass("input-error");
    }

    if ($("#sexo").val() == "") {
        messageError += "<p>Debe seleccionar un Sexo</p>";
        $("#sexo").addClass("input-error");
        $('#sexo').on('click', function () {
            $(this).removeClass('input-error');
        });
    } else {
        $("#sexo").removeClass("input-error");
    }

    if ($("#fechaNacimiento").val() == "") {
        messageError += "<p>Debe seleccionar una Fecha de Nacimiento</p>";
        $("#fechaNacimiento").addClass("input-error");
    } else if ($("#fechaNacimiento").val() > new Date()) {
        messageError += "<p>La Fecha de Nacimiento debe ser anterior a la actual</p>";
        $("#fechaNacimiento").addClass("input-error");
    } else {
        $("#fechaNacimiento").removeClass("input-error");
    }

    if ($("#fotoPerfil").val() == "") {
        messageError += "<p>Debe agregar una Foto de Perfil</p>";
        $("#fotoPerfil").addClass("input-error");
        $('#fotoPerfil').on('click', function () {
            $(this).removeClass('input-error');
        });
    } else {
        $("#fotoPerfil").removeClass("input-error");
    }

    return messageError;
}

function validateRegister2() {

    var messageError = "";

    var latitud = parseFloat($("#txtLatitud").val());
    var longitud = parseFloat($("#txtLongitud").val());

    if ($("#txtLatitud").val() == "") {
        messageError += "<p>Debe llenar el campo de Latitud</p>";
        $("#txtLatitud").addClass("input-error");
    } else if (isNaN(latitud) || latitud < -90 || latitud > 90) {
        messageError += "<p>El valor de la Latitud debe estar entre -90 y 90 grados</p>";
        $("#txtLatitud").addClass("input-error");
    } else {
        $("#txtLatitud").removeClass("input-error");
    }

    if ($("#txtLongitud").val() == "") {
        messageError += "<p>Debe llenar el campo de Longitud</p>";
        $("#txtLongitud").addClass("input-error");
    } else if (isNaN(longitud) || longitud < -180 || longitud > 180) {
        messageError += "<p>El valor de la Longitud debe estar entre -180 y 180 grados</p>";
        $("#txtLongitud").addClass("input-error");
    } else {
        $("#txtLongitud").removeClass("input-error");
    }

    return messageError;
}

function validateRegister3() {

    var messageError = "";

    if ($("#tipo").val() == "") {
        messageError += "<p>Debe seleccionar un Tipo de usuario</p>";
        $(".tipo-btn").addClass("input-error");
        $('.tipo-btn').on('click', function () {
            $(this).removeClass('input-error');
        });
    } else {
        $(".tipo-btn").removeClass("input-error");
    }

    if ($("#tipo").val() == "Doctor" && $("#especialidad").val() == "") {
        messageError += "<p>Debe llenar el campo de Especialidad</p>";
        $("#especialidad").addClass("input-error");
    } else {
        $("#especialidad").removeClass("input-error");
    }

    if ($("#idSede").val() == "") {
        messageError += "<p>Debe seleccionar una Sede</p>";
        $("#idSede").addClass("input-error");
        $('#idSede').on('click', function () {
            $(this).removeClass('input-error');
        });
    } else {
        $("#idSede").removeClass("input-error");
    }

    return messageError;
}

function validateRegister4() {

    var messageError = "";

    if ($("#contrasenna").val() == "") {
        messageError += "<p>Debe una contraseña</p>";
        $("#contrasenna").addClass("input-error");
    } else if (contrasenna.length < 8) {
        messageError += "<p>La contraseña debe tener al menos 8 caracteres</p>";
        $("#contrasenna").addClass("input-error");
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test($("#contrasenna").val())) {
        messageError += "<p>La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial</p>";
        $("#contrasenna").addClass("input-error");
    } else if (/\s/.test($("#contrasenna").val())) {
        messageError += "<p>La contraseña no puede contener espacios en blanco</p>";
        $("#contrasenna").addClass("input-error");
    } else if ($("#contrasenna").val() !== $("#confirmarContrasenna").val()) {
        messageError += "<p>Las contraseñas no coinciden. Por favor, inténtelo de nuevo.</p>";
        $("#confirmarContrasenna").addClass("input-error");
    } else {
        $("#contrasenna").removeClass("input-error");
        $("#confirmarContrasenna").removeClass("input-error");
    }

    return messageError;
}

function UsuarioController() {
    this.viewName = "RegistroUsuario";
    this.ApiService = "Usuario";

    //Metodo para ejecutar inicio de la vista
    this.InitView = function () {
        $("#btnCreate").click(function () {
            var vc = new UsuarioController();
            vc.Create();
        })

        $(".tipo-btn-js").click(function () {
            // Remover la clase 'selected' de todos los elementos
            $(".tipo-btn-js").removeClass("selected");

            // Agregar la clase 'selected' al elemento clickeado
            $(this).addClass("selected");

            var tipo = $(this).data("tipo");
            $("#tipo").val(tipo);

            if (tipo === "Doctor") {
                $("#contenedor-especialidad").show();
            } else {
                $("#contenedor-especialidad").hide();
            }
        });

        showRegister1();

        if (typeof google === 'object' && typeof google.maps === 'object') {
            // Google Maps API is already loaded, initialize map directly
            initMap();
        } else {
            // Wait for the API script to load
            window.addEventListener('load', () => {
                initMap();
            });
        }

        $('input').on('keyup', function () {
            $(this).removeClass('input-error');
        });
        this.LoadSedes();
    }

    this.LoadSedes = function () {
        var ca = new ControlActions();
        var serviceRoute = "Sede/RetrieveAll";

        ca.GetToApi(serviceRoute, function (sedes) {
            if (sedes && Array.isArray(sedes)) {
                sedes.forEach(function (sede) {
                    $("#idSede").append(`<option value="${sede.id}">${sede.nombre}</option>`);
                });
            } else {
                console.error("Error: La respuesta del servidor no contiene datos válidos.");
            }
        });
    }

    this.Create = function () {

        var messageError = validateRegister4(messageError);

        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Create";
        var authenticationRoute = this.ApiService + "/Authenticate";

        if (messageError == "") {

            var imagenPerfil = $('#fotoPerfil')[0].files[0];
            if (imagenPerfil != undefined) {
                // Crear un objeto FormData y agregar la imagen al mismo
                var formData = new FormData();
                formData.append('file', imagenPerfil);

                // Realizar una solicitud AJAX para enviar la imagen a la API
                $.ajax({
                    url: 'https://localhost:7081/Files/Image',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        var user = {};
                        user.Identificacion = $("#identificacion").val();
                        user.Nombre = $("#nombre").val();
                        user.ApellidoUno = $("#apellidoUno").val();
                        user.ApellidoDos = $("#apellidoDos").val();
                        user.Telefono = $("#telefono").val();
                        user.Correo = $("#correo").val();
                        user.Sexo = $("#sexo").val();
                        user.FechaNacimiento = $("#fechaNacimiento").val();
                        user.Latitud = $("#txtLatitud").val();
                        user.Longitud = $("#txtLongitud").val();
                        user.Contrasenna = $("#contrasenna").val();
                        user.FotoPerfil = response.fileName;;
                        user.Tipo = $("#tipo").val();
                        user.Especialidad = $("#especialidad").val();
                        user.IdSede = $("#idSede").val();
                        user.Estado = "IN";
                        user.ValidacionPerfil = "IN";


                        ca.PostToAPI(serviceRoute, user, function (response) {
                            cleanForm();
                            setTimeout(function () {
                                window.location.href = "/Login";
                            }, 1000);
                            ca.PostToAPI(authenticationRoute, user, function () {
                            }, function (authError) {
                                console.error("Error al enviar el correo de autenticación: " + authError);
                            });
                        }, function (error) {
                            console.error("Error al registrar usuario: " + error);
                        });
                    },
                    error: function (xhr, status, error) {
                        // Manejar errores de la solicitud AJAX
                        console.error('Error al cargar la imagen:', error);
                    }
                });
            }
        } else {
            Toast.fire({
                icon: "warning",
                title: "El formulario no esta debidamente lleno",
                html: messageError
            });
        }
    }
}

// Instanciamiento de la clase 
$(document).ready(function () {
    var vc = new UsuarioController();
    vc.InitView();
})