function formatDate(dateStr) {
    var parts = dateStr.split("-");
    var year = parts[0];
    var month = parts[1];
    var day = parts[2];
    return day + '/' + month + '/' + year;
}

function formatAMPM(timeStr) {
    var time = timeStr.split(":");
    var hours = parseInt(time[0]);
    var minutes = parseInt(time[1]);
    var ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutesStr + ' ' + ampm;
    return strTime;
}

function ProximasConsultasController() {
    this.ViewName = "ProximasConsultas";
    this.ApiService = "Cita";

    this.InitView = function () {
        this.RetrieveProximasConsultas();
    };

    this.RetrieveProximasConsultas = function () {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAll";

        ca.GetToApi(serviceRoute, function (respuesta) {
            var citas = respuesta;

            if (citas != null) {
                citas.forEach(function (cita) {
                    if (cita.idDoctor == localStorage.getItem('userId')) {
                        // Obtener la fecha y hora actual
                        var fechaHoraActual = new Date();
                        var horaCupo = new Date(cita.horaCupo);

                        // Calcular diferencia en milisegundos
                        var diferencia = horaCupo - fechaHoraActual;
                        var horasRestantes = diferencia / (1000 * 60 * 60);

                        if (horaCupo >= fechaHoraActual && cita.estado == "PG") {
                            // Verificar si la cita es en el futuro o en el presente
                            // Separar fecha y hora
                            var fechaHora = cita.horaCupo.split("T");
                            var fecha = fechaHora[0];
                            var hora = fechaHora[1];

                            // Dar formato de 12 horas a la hora
                            var horaFormateada = formatAMPM(hora);
                            var fechaFormateada = formatDate(fecha);

                            // Crear la estructura HTML para mostrar la cita
                            var cancelable = (horasRestantes >= 24) ? '' : 'disabled'; // Verificar si se puede cancelar

                            $("#proximasConsultas").append(
                                '<div class="col-md-4 mb-4">' +
                                '<div class="card rounded-3 border-2" style="border-color: #0353A4;">' +
                                '<div class="card-body">' +
                                '<h5 class="card-title">' + fechaFormateada + " " + horaFormateada + '</h5>' +
                                '<p class="card-text">' + 'Paciente(a). ' + cita.nombrePaciente + ' ' + cita.apellidoUnoPaciente + ' ' + cita.apellidoDosPaciente + '<br>' +
                                cita.especialidad + '<br>' + cita.provincia + ', ' + cita.distrito + ', ' + cita.canton + '</p>' +
                                '<button id="btnCancelarCita" data-id="' + cita.id + '" data-cupo="' + cita.idDisponibilidadCupo + '" class="btn mx-auto d-block w-50 text-light" style="background-color: #f27474;" ' + cancelable + '>Cancelar</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            );
                        }
                    }
                });
            }
        });
    };

    // Delegación de eventos para el botón de cancelar (con selector de clase)
    $("#proximasConsultas").on("click", "#btnCancelarCita", function () {
        var $btnCancelar = $(this); // Obtener el botón de cancelar que se ha hecho clic

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Estás a punto de cancelar la consulta. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0353A4',
            cancelButtonColor: '#f27474',
            confirmButtonText: 'Sí, cancelar consulta',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si se confirma la cancelación, proceder con la cancelación de la cita
                var mc = new ProximasConsultasController();
                var idCita = $btnCancelar.data("id");
                var idDisponibilidadCupo = $btnCancelar.data("cupo");
                mc.CancelCita(idCita, idDisponibilidadCupo); // Pasar los datos a la función CancelCita
            }
        });
    });

    this.CancelCita = function (idCita, idDisponibilidadCupo) {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Delete";

        var cita = {};
        cita.id = idCita;
        cita.idDisponibilidadCupo = idDisponibilidadCupo;
        ca.DeleteToAPI(serviceRoute, cita, function () {
            $("#proximasConsultas").find(`[data-id="${cita.id}"]`).closest('.col-md-4').remove();
        });
    };
}

$(document).ready(function () {
    var vc = new ProximasConsultasController();
    vc.InitView();
});
