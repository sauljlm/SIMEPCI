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

function GestionCuposController() {
    this.ViewName = "CrearCupos";
    this.ApiService = "DisponibilidadCupo";
    this.SedeService = "Sede";
    this.UsuarioService = "Usuario";

    this.InitView = function () {
        $("#btnCreateCupos").click(function () {
            var gc = new GestionCuposController();
            gc.Create();
        })

        $("#txtInicio").click(function () {
            var gc = new GestionCuposController();
            gc.FormateoDeHoras("#txtInicio");
        });

        $("#txtFinal").click(function () {
            var gc = new GestionCuposController();
            gc.FormateoDeHoras("#txtFinal");
        });

        $('input').on('change', function () {
            $(this).removeClass('input-error');
        });

        $('select').on('change', function () {
            $(this).removeClass('input-error');
        });

        $('#slctProfesional').on('change', function () {
            $(this).removeClass('input-error');
            $("#txtEspecialidad").removeClass('input-error');
        });

        this.FillSelects();
        this.RetrieveImpuestos();

    }

    this.Create = function () {
        var fecha = $("#txtFecha").val(); // Asumiendo que txtFecha es un input de tipo fecha
        var inicioJornada = $("#txtInicio").val();
        var finalJornada = $("#txtFinal").val();

        var idUsuarioDoctor = $("#slctProfesional").val();
        var idSede = $("#slctEstablecimiento").val();
        var precio = $("#precioC").val();
        var porcentaje = $("#selectImpuestos").val();
        var selectElement = document.getElementById("selectImpuestos");
        var idImpuestoSeleccionado = selectElement.options[selectElement.selectedIndex].getAttribute("data-idimpuesto");

        var inicioSplit = inicioJornada.split(":"); // Dividir las horas y minutos de inicio
        var inicioHoras = parseInt(inicioSplit[0]);
        var inicioMinutos = parseInt(inicioSplit[1]);

        var finalSplit = finalJornada.split(":"); // Dividir las horas y minutos de final
        var finalHoras = parseInt(finalSplit[0]);
        var finalMinutos = parseInt(finalSplit[1]);

        var horasInicioEnMediasHoras = inicioHoras * 2 + Math.floor(inicioMinutos / 30); // Calcular la cantidad de medias horas totales
        var horasFinalEnMediasHoras = finalHoras * 2 + Math.floor(finalMinutos / 30);
        var mediasHorasTotales = horasFinalEnMediasHoras - horasInicioEnMediasHoras;

        var horaDeInicioFormateda = ("0" + inicioHoras).slice(-2); // Asegurarse de que las horas estén en formato de dos dígitos (por ejemplo, 08 en lugar de 8)      
        var cuposMediaHora = horaDeInicioFormateda + ":" + ("0" + inicioMinutos).slice(-2); // Insertar citas hasta que se cumplan las medias horas totales

        var ca = new ControlActions(); // Invocar al API
        var serviceRoute = this.ApiService + "/Create";
        var disponibilidadCuposArray = []; // Arreglo para almacenar los objetos disponibilidadCupo

        //console.log(inicioJornada)
        //console.log(finalJornada)

        for (var i = 0; i < mediasHorasTotales; i++) {
            var disponibilidadCupo = {};
            disponibilidadCupo.HoraCupo = fecha + "T" + cuposMediaHora;
            disponibilidadCupo.IdUsuarioDoctor = idUsuarioDoctor;
            disponibilidadCupo.IdSede = idSede;
            disponibilidadCupo.Estado = "DI";
            disponibilidadCupo.precio = parseFloat(precio) + (parseFloat(precio) * (parseFloat(porcentaje) / 100));
            disponibilidadCupo.idImpuesto = idImpuestoSeleccionado;
            disponibilidadCuposArray.push(disponibilidadCupo); // Agregar el objeto disponibilidadCupo al arreglo
            // Sumar 30 minutos al inicio
            inicioMinutos += 30;
            if (inicioMinutos >= 60) {
                inicioMinutos -= 60;
                inicioHoras += 1;
            }

            var horaFormateada = ("0" + inicioHoras).slice(-2); // Asegurarse de que las horas estén en formato de dos dígitos (por ejemplo, 08 en lugar de 8)      
            cuposMediaHora = horaFormateada + ":" + ("0" + inicioMinutos).slice(-2); // Crear la nueva hora de inicio
        }
        //console.log(disponibilidadCuposArray)

        var isValid = true;
        var messageError = "";


        if (idUsuarioDoctor == "") {
            messageError += "<p>Debe de llenar el campo de profesional de la salud</p>";
            isValid = false;
            $("#slctProfesional").addClass("input-error");
            $("#txtEspecialidad").addClass("input-error");

        }

        if (idSede == "") {
            messageError += "<p>Debe de llenar el campo de establecimiento de salud</p>";
            isValid = false;
            $("#slctEstablecimiento").addClass("input-error");
        }

        if (precio == "" || precio == undefined || precio == NaN ) {
            messageError += "<p>Debe de llenar el campo de precio</p>";
            isValid = false;
            $("#precioC").addClass("input-error");
        }

        if (porcentaje == "") {
            messageError += "<p>Debe de seleccionar un impuesto/p>";
            isValid = false;
            $("#selectImpuestos").addClass("input-error");
        }

        if (fecha == "") {
            messageError += "<p>Debe de llenar el campo de fecha de los cupos</p>";
            isValid = false;
            $("#txtFecha").addClass("input-error");
        }

        if (inicioJornada == "") {
            messageError += "<p>Debe de llenar el campo de inicio de jornada</p>";
            isValid = false;
            $("#txtInicio").addClass("input-error");
        }

        if (finalJornada == "") {
            messageError += "<p>Debe de llenar el campo de final de jornada</p>";
            isValid = false;
            $("#txtFinal").addClass("input-error");
        }

        var fechaActual = new Date()
        fechaActual.setHours(0, 0, 0, 0)
        // Parsear la fecha en formato 'yyyy-mm-dd'
        var parts = fecha.split('-');
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // Restar 1 al mes porque en JavaScript los meses van de 0 a 11
        var day = parseInt(parts[2], 10);
        // Crear el objeto Date con la fecha sin considerar la hora (00:00:00)
        var fechaCupo = new Date(year, month, day);
        // Normalizar la fecha para ignorar la hora
        fechaCupo.setHours(0, 0, 0, 0)

        if (fechaCupo < fechaActual) {
            messageError += "<p>La fecha no puede ser anterior a la actual</p>";
            isValid = false;
            $("#txtFecha").addClass("input-error");
        };

        var fechaHoraActualCompleta = new Date();

        // Convertir la hora de inicio de jornada a un objeto Date
        // Suponiendo que 'inicioJornada' es una cadena en formato de hora, por ejemplo: "08:00"
        var inicioJornadaParts = inicioJornada.split(':'); // Dividir la cadena en horas y minutos
        var horaInicioJornada = new Date(year, month, day); // Crear un nuevo objeto Date para la fecha de inicio de jornada
        horaInicioJornada.setHours(inicioJornadaParts[0], inicioJornadaParts[1], 0, 0); // Establecer la hora de inicio de jornada

        // Verificar si la fecha de inicio de jornada es para hoy o una fecha futura
        if (horaInicioJornada <= fechaHoraActualCompleta && inicioJornada !== "" && finalJornada !== "") {
            messageError += "<p>El cupo no se puede crear en una hora menor a la actual</p>";
            isValid = false;
            $("#txtInicio").addClass("input-error");
            $("#txtFinal").addClass("input-error");
        }

        if (inicioJornada >= finalJornada && inicioJornada !== "" && finalJornada !== "") {
            messageError += "<p>El inicio de la jornada debe ser anterior al final de la jornada</p>";
            isValid = false;
            $("#txtInicio").addClass("input-error");
            $("#txtFinal").addClass("input-error");
        }

        if (inicioJornada === finalJornada && inicioJornada !== "" && finalJornada !== "") {
            messageError += "<p>El inicio de la jornada y el final de la jornada no pueden ser iguales</p>";
            isValid = false;
            $("#txtInicio").addClass("input-error");
            $("#txtFinal").addClass("input-error");
        }

        if (isValid) {
            try {
                ca.PostToAPIRange(serviceRoute, disponibilidadCuposArray, function () {
                    //console.log("Cupo created -->" + JSON.stringify(disponibilidadCuposArray));
                });
                this.Clean();
            } catch (error) {
                console.error("Error:", error);
            }
        }
        else {
            Toast.fire({
                icon: "warning",
                title: "El formulario no esta debidamente lleno",
                html: messageError
            });
        }

    };

    this.FillSelects = function () {
        var ca = new ControlActions(); // Invocar al API
        var serviceRouteSede = this.SedeService + "/RetrieveAll";
        var serviceRouteUsuario = this.UsuarioService + "/RetrieveAllTipo";

        ca.GetToApi(serviceRouteSede, function (sedes) {
            var opcionesSede = {};
            //console.log(sedes)
            sedes.forEach(function (sede) {
                if (!opcionesSede[sede.nombre]) {
                    $("#slctEstablecimiento").append('<option value="' + sede.id + '">' + sede.nombre + '</option>');
                    opcionesSede[sede.nombre] = true;
                }
            });
        });

        ca.GetToApi(serviceRouteUsuario, function (usuarios) {
            var opcionesUsuario = {};
            //console.log(usuarios)
            usuarios.forEach(function (usuario) {
                if (usuario.tipo == "Doctor") {
                    var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                    if (!opcionesUsuario[nombreCompleto]) {
                        $("#slctProfesional").append('<option value="' + usuario.id + '" data-especialidad="' + usuario.especialidad + '">' + nombreCompleto + '</option>');
                        opcionesUsuario[nombreCompleto] = true;
                    }
                }
            });

            // Agregar evento para detectar el cambio en el usuario seleccionado
            $("#slctProfesional").change(function () {
                var especialidad = $("#slctProfesional option:selected").data("especialidad");
                $("#txtEspecialidad").val(especialidad);
                if ($("#txtEspecialidad") === "") {
                    $("#txtEspecialidad").val("");
                }
            });
        });
    };

    this.FormateoDeHoras = function (inputSelector) {
        const timeInput = $(inputSelector);

        // Evento que se ejecuta cuando cambia el valor del input time
        timeInput.on('change', function () {
            const selectedTime = timeInput.val();

            // Convertir el valor seleccionado en un objeto Date
            const selectedDate = new Date(`1970-01-01T${selectedTime}:00`);

            // Obtener minutos
            const minutes = selectedDate.getMinutes();

            // Si los minutos no son 0 o 30, ajustar al más cercano
            if (minutes !== 0 && minutes !== 30) {
                // Redondear a la hora más cercana (0 o 30)
                const newMinutes = Math.round(minutes / 30) * 30;
                selectedDate.setMinutes(newMinutes);

                // Formatear la nueva hora en formato HH:mm
                const formattedHours = ('0' + selectedDate.getHours()).slice(-2);
                const formattedMinutes = ('0' + selectedDate.getMinutes()).slice(-2);
                const formattedTime = `${formattedHours}:${formattedMinutes}`;

                // Establecer el nuevo valor en el input
                timeInput.val(formattedTime);
            }
        });
    };

    this.Clean = function () {
        $("#txtFecha").val("");
        $("#txtInicio").val("");
        $("#txtFinal").val("");
        $("#txtEspecialidad").val("");
        $("#slctProfesional").val("");
        $("#slctEstablecimiento").val("");
        $("#precioC").val("");
    }

    this.RetrieveImpuestos = function () {
        var ca = new ControlActions();
        var serviceRoute =  "Cita/Impuestos";

        ca.GetToApi(serviceRoute, function (respuesta) {
            var impuestos = respuesta;

            if (impuestos != null) {
                // Obtener el elemento select del DOM
                var selectElement = document.getElementById("selectImpuestos");
                impuestos.forEach(function (impuesto) {
                    // Crear un elemento de opción
                    var option = document.createElement("option");
                    // Establecer el texto de la opción como el tipo del impuesto
                    option.text = impuesto.tipo + " %" + impuesto.porcentaje;
                    // Establecer el valor de la opción como el porcentaje del impuesto
                    option.value = impuesto.porcentaje;
                    // Agregar el atributo data-idimpuesto al elemento de opción
                    option.setAttribute("data-idimpuesto", impuesto.id);
                    // Agregar la opción al elemento select
                    selectElement.appendChild(option);
                });
            }
        });
    }
}

$(document).ready(function () {
    var vc = new GestionCuposController();
    vc.InitView();
});
