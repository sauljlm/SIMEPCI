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

function MisCitasController() {
    this.ViewName = "MisCitas";
    this.ApiService = "Cita";

    this.InitView = function () {
        this.RetrieveMisCitas();
    }

    this.RetrieveMisCitas = function () {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAll";

        ca.GetToApi(serviceRoute, function (respuesta) {
            var citas = respuesta;

            if (citas != null) {
                citas.forEach(function (cita) {
                    if (cita.idExpediente == localStorage.getItem('IdExpediente')) {
                        // Obtener la fecha y hora actual
                        var fechaHoraActual = new Date();
                        var horaCupo = new Date(cita.horaCupo);

                        // Verificar si la cita es en el futuro o en el presente
                        if (horaCupo >= fechaHoraActual) {
                            // Separar fecha y hora
                            var fechaHora = cita.horaCupo.split("T");
                            var fecha = fechaHora[0];
                            var hora = fechaHora[1];

                            // Dar formato de 12 horas a la hora
                            var horaFormateada = formatAMPM(hora);
                            var fechaFormateada = formatDate(fecha);

                            // Crear la estructura HTML para mostrar la cita
                            if (cita.estado == 'PG') {
                                $("#misCitas").append(
                                    '<div class="col-md-4 mb-4">' +
                                    '<div class="card rounded-3 border-2" style="border-color: #0353A4;">' +
                                    '<div class="card-body">' +
                                    '<h5 class="card-title">' + fechaFormateada + " " + horaFormateada + '</h5>' +
                                    '<p class="card-text">' + 'Dr(a). ' + cita.nombreDoctor + ' ' + cita.apellidoUnoDoctor + ' ' + cita.apellidoDosDoctor + '<br>' +
                                    cita.especialidad + '<br>' + cita.provincia + ', ' + cita.distrito + ', ' + cita.canton + '</p>' +
                                    '<div class="w-100 d-flex">' + '<button id="btnFinalizarCita" data-id="' + cita.id + '" data-cupo="' + cita.idDisponibilidadCupo + '" data-expediente="' + cita.idExpediente + '" class="btn mx-auto d-block text-light" style="background-color: #0353A4; width: 45%;">Finalizar</button>' +
                                    '<button id="btnCancelarCita" data-id="' + cita.id + '" data-cupo="' + cita.idDisponibilidadCupo + '" class="btn mx-auto d-block text-light" style="background-color: #f27474; width: 45%;">Cancelar</button>' + '</div>'
                                    +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                );
                            }
                            else if (cita.estado == 'AG') {
                                $("#misCitas").append(
                                    '<div class="col-md-4 mb-4">' +
                                    '<div class="card rounded-3 border-2" style="border-color: #0353A4;">' +
                                    '<div class="card-body">' +
                                    '<h5 class="card-title">' + fechaFormateada + " " + horaFormateada + '</h5>' +
                                    '<p class="card-text">' + 'Dr(a). ' + cita.nombreDoctor + ' ' + cita.apellidoUnoDoctor + ' ' + cita.apellidoDosDoctor + '<br>' +
                                    cita.especialidad + '<br>' + cita.provincia + ', ' + cita.distrito + ', ' + cita.canton + '</p>' +
                                    '<div class="w-100 d-flex">' +
                                    '<button id="btnPagar" data-especialidad="' + cita.especialidad + '" data-cupo="' + cita.idDisponibilidadCupo + '" data-impuesto="' + cita.idImpuesto + '" data-cita="' + cita.id + '" data-precio="' + cita.precio + '" data-doctor="' + cita.nombreDoctor + ' ' + cita.apellidoUnoDoctor + '"  class="btn mx-auto d-block text-light" style="background-color: #0353A4; width: 45%;">Pagar</button>' +
                                    '<button id="btnCancelarCita" data-id="' + cita.id + '" data-cupo="' + cita.idDisponibilidadCupo + '" class="btn mx-auto d-block text-light" style="background-color: #f27474; width: 45%;">Cancelar</button>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                );
                            }
                        }
                    }

                    // Delegación de eventos para el botón de cancelar (con selector de clase)
                    $("#misCitas").on("click", "#btnCancelarCita", function () {
                        var $btnCancelar = $(this); // Obtener el botón de cancelar que se ha hecho clic

                        Swal.fire({
                            title: '¿Estás seguro?',
                            text: 'Estás a punto de cancelar tu cita. ¿Deseas continuar?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#0353A4',
                            cancelButtonColor: '#f27474',
                            confirmButtonText: 'Sí, cancelar cita',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Si se confirma la cancelación, proceder con la cancelación de la cita
                                var mc = new MisCitasController();
                                var idCita = $btnCancelar.data("id");
                                var idDisponibilidadCupo = $btnCancelar.data("cupo");
                                mc.CancelCita(idCita, idDisponibilidadCupo); // Pasar los datos a la función CancelCita
                            }
                        });
                    });

                    $("#misCitas").on("click", "#btnFinalizarCita", function () {
                        var $btnFinalizar = $(this); // Obtener el botón de cancelar que se ha hecho clic

                        Swal.fire({
                            title: '¿Estás seguro?',
                            text: 'Estás a punto de finalizar tu cita. ¿Deseas continuar?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#0353A4',
                            cancelButtonColor: '#f27474',
                            confirmButtonText: 'Sí, Finalizar cita',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Si se confirma la cancelación, proceder con la cancelación de la cita
                                var mc = new MisCitasController();
                                var idCita = $btnFinalizar.data("id");
                                var idDisponibilidadCupo = $btnFinalizar.data("cupo");
                                var idExpediente = $btnFinalizar.data("expediente");
                                mc.FinalizarCita(idCita, idDisponibilidadCupo, idExpediente); // Pasar los datos a la función FinalizarCita
                            }
                        });
                    });

                    $("#misCitas").on("click", "#btnPagar", function () {
                        var $btnFinalizar = $(this); // Obtener el botón de cancelar que se ha hecho clic
                        let especialidad = $btnFinalizar.data("especialidad");
                        let idDisponibilidadCupo = $btnFinalizar.data("cupo").toString();
                        let precio = $btnFinalizar.data("precio").toString();
                        let doctor = $btnFinalizar.data("doctor");
                        let cita = $btnFinalizar.data("cita");
                        let impuesto = $btnFinalizar.data("impuesto");

                        var token = document.querySelector('input[name="__RequestVerificationToken"]').value;

                        // Crear un nuevo formulario dinámicamente
                        var form = document.createElement('form');
                        form.method = 'post';

                        // Crear un campo de entrada para el token y establecer su valor
                        var tokenInput = document.createElement('input');
                        tokenInput.type = 'hidden';
                        tokenInput.name = '__RequestVerificationToken';
                        tokenInput.value = token;

                        // Agregar el campo de entrada al formulario
                        form.appendChild(tokenInput);


                        var totalInput = document.createElement('input');
                        totalInput.type = 'hidden';
                        totalInput.name = 'total';
                        totalInput.value = precio;
                        form.appendChild(totalInput);

                       
                        var docInput = document.createElement('input');
                        docInput.type = 'hidden';
                        docInput.name = 'doctor';
                        docInput.value = doctor;
                        form.appendChild(docInput);


                       
                        var espInput = document.createElement('input');
                        espInput.type = 'hidden';
                        espInput.name = 'especialidad';
                        espInput.value = especialidad;
                        form.appendChild(espInput);

                        var idcupoInput = document.createElement('input');
                        idcupoInput.type = 'hidden';
                        idcupoInput.name = 'idcupo';
                        idcupoInput.value = idDisponibilidadCupo;
                        form.appendChild(idcupoInput);


                        var idcitaInput = document.createElement('input');
                        idcitaInput.type = 'hidden';
                        idcitaInput.name = 'idcita';
                        idcitaInput.value = cita;
                        form.appendChild(idcitaInput);


                        var idimpuestoInput = document.createElement('input');
                        idimpuestoInput.type = 'hidden';
                        idimpuestoInput.name = 'idimpuesto';
                        idimpuestoInput.value = impuesto;
                        form.appendChild(idimpuestoInput);

                        // Agregar el formulario al cuerpo del documento
                        document.body.appendChild(form);

                        // Enviar el formulario
                        form.submit();
                        form.remove();
                    });
                });
            }
        });
    }


    

    this.CancelCita = function (idCita, idDisponibilidadCupo) {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Delete";

        var cita = {};
        cita.id = idCita;
        cita.idDisponibilidadCupo = idDisponibilidadCupo;
        ca.DeleteToAPI(serviceRoute, cita, function () {
            $("#misCitas").find(`[data-id="${cita.id}"]`).closest('.col-md-4').remove();
        });
    }

    this.FinalizarCita = function (idCita, idDisponibilidadCupo, idExpediente) {
        console.log(idCita)
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/ServiceQualityForm";
        var getCitaRoute = this.ApiService + "/RetrieveById/" + idCita;
        console.log(getCitaRoute);

        var cita = {};
        cita.id = idCita;
        cita.idDisponibilidadCupo = idDisponibilidadCupo;
        cita.IdExpediente = idExpediente;

        ca.PostToAPI(serviceRoute, cita, function () {
            $("#misCitas").find(`[data-id="${cita.id}"]`).closest('.col-md-4').remove();
        }, function (authError) {
            console.error("Error al enviar el correo de calidad de servicio: " + authError);
        });
    }
}

$(document).ready(function () {
    var vc = new MisCitasController();
    vc.InitView();
});