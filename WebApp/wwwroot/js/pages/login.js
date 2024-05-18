const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: function (toast) {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

async function requestLogin(url = "", data = {}) {
    const requestOptions = {
        method: "POST",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    };

    const response = await fetch(url, requestOptions);
    return response.json(); // parses JSON response into native JavaScript objects
}

function LoginController() {
    this.ViewName = "Login";

    this.InitView = function () {
        var lc = new LoginController();

        $('#ForgotButton').on('click', function () {
            // Agregar clase al elemento1 y quitarla de elemento2
            $('#LoginContent').addClass('d-none');
            $('#ForgotContent').removeClass('d-none');
        });

        $('#BackButton').on('click', function () {
            // Agregar clase al elemento1 y quitarla de elemento2
            $('#LoginContent').removeClass('d-none');
            $('#ForgotContent').addClass('d-none');
        });

        $("#CambiarContra").click(function () {
            pf.CambiarContrasenna();
        });


        $('#LoginForm').on('submit', async function (event) {
            lc.InicioSesion();
        });

        $('#ForgotForm').on('submit', async function (event) {
            lc.OlvidoContrasena();
        });

        $('input').on('change', function () {
            $(this).removeClass('input-invalid');
        });

        localStorage.clear();
    }

    this.InicioSesion = function () {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const id = $('#identificacion').val();
        const contra = $('#contrasenna').val();
        const apiUrl = 'https://localhost:7081/Security/Login';
        let isValid = true;
        let messageError = "";

        if (id == "") {
            messageError += "<p>Debe de llenar el campo de identificaci&oacute;n</p>";
            isValid = false;
            $("#identificacion").addClass("input-invalid");
        }

        if (isNaN(id)) {
            messageError += "<p>El campo identificaci&oacute;n solo puede contener numeros</p>";
            isValid = false;
            $("#identificacion").addClass("input-invalid");
        }

        if (contra == "") {
            messageError += "<p>Debe de llenar el campo de contrase&ntilde;a</p>";
            isValid = false;
            $("#contrasenna").addClass("input-invalid");
        }

        if (isValid) {
            const data = {
                identificacion: id,
                password: contra,
                ipAddress: 'string',
                userAgent: 'string'
            };
            $('#LoadState').removeClass('d-none');

            try {
                requestLogin(apiUrl, data).then(
                    (data) => {
                        if (data.reason) {
                            if (data.reason == "Error: Contrasenna incorrecta.") {
                                Toast.fire({
                                    icon: "error",
                                    title: "Contrase&ntilde;a incorrecta"
                                });
                            } else if (data.reason == "Error: Identificacion de usuario incorrecta.") {
                                Toast.fire({
                                    icon: "error",
                                    title: "Identificaci&oacute;n incorrecta",
                                    text: "El usuario con la identificacion no se encuentra registrado"
                                });
                            }
                        } else {
                            Toast.fire({
                                icon: "success",
                                title: "Inicio exitoso"
                            });

                            localStorage.setItem('userName', data.userName);
                            localStorage.setItem('userId', data.userId);
                            localStorage.setItem('token', data.token);
                            localStorage.setItem('expiresIn', data.expiresIn);
                            localStorage.setItem('identificacion', data.identificacion);
                            localStorage.setItem('Rol', data.rol);
                            localStorage.setItem('Especialidad', data.especialidad);
                            localStorage.setItem('IdExpediente', data.idExpediente);
                            localStorage.setItem('Avatar', data.avatar);

                            window.location.href = "/Perfil";
                        }

                        $('#LoadState').addClass('d-none');
                    });

            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            Toast.fire({
                icon: "warning",
                title: "El formulario no esta debidamente lleno",
                html: messageError
            });
        }
    }

    this.OlvidoContrasena = function () {
        event.preventDefault(); // Evitar el envío del formulario por defecto
        let isValid = true;
        let messageError = "";
        const id = $('#ForgotId').val();

        if (id == "") {
            messageError += "<p>Debe de llenar el campo de identificaci&oacute;n</p>";
            isValid = false;
            $("#ForgotId").addClass("input-invalid");
        }

        if (isNaN(id)) {
            messageError += "<p>El campo identificaci&oacute;n solo puede contener numeros</p>";
            isValid = false;
            $("#ForgotId").addClass("input-invalid");
        }

        if (isValid) {
            const apiUrl = 'https://localhost:7081/Security/OlvidoContrasena?usuario=' + id;
            $('#LoadState').removeClass('d-none');
            try {
                requestLogin(apiUrl).then(
                    (data) => {
                        if (data.message != "Usuario no encontrado") {
                            Toast.fire({
                                icon: "success",
                                title: "Cambio de contrase&ntilde;a exitoso",
                                text: "Se ha enviado la clave temporal al correo del usuario: " + data.message
                            });
                            setTimeout(function () {
                                window.location.href = "/Login";
                            }, 1000);
                        } else {
                            Toast.fire({
                                icon: "error",
                                title: "No se encontr&oacute; el usuario"
                            });
                        }

                        $('#LoadState').addClass('d-none');
                    });

            } catch (error) {
                console.error("Error:", error);
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
    var lc = new LoginController();
    lc.InitView();
})