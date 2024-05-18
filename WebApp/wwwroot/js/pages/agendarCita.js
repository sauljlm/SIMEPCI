function DisponibilidadCupoController() {
    this.ViewName = "AgendarCita";
    this.ApiService = "DisponibilidadCupo";
    this.CitaService = "Cita";
    //this.ExpedienteService = "Expediente";
    
    this.InitView = function () {
        this.FullCalendar();
    }

    this.FullCalendar = function () {
        var calendarioEvents;
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAll";
        var CitaServiceRoute = this.CitaService + "/Create";

        var calendarEl = document.getElementById('calendar'); 
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            allDaySlot: false,
            dayMaxEventRows: true,
            views: {
                timeGrid: {
                    dayMaxEventRows: 1
                },
                dayGridMonth: {
                    dayMaxEventRows: 4
                }
            },
            validRange: {
                start: new Date(),
            },
            slotLabelFormat: {
                hour: 'numeric',
                minute: '2-digit',
                hourCycle: 'h12'
            },
            eventTimeFormat: {
                hour: 'numeric',
                minute: '2-digit',
                hourCycle: 'h12'
            },
            dateClick: function (info) {
                calendar.changeView('timeGridDay', info.dateStr)
            }
        });
        calendar.render();

        ca.GetToApi(serviceRoute, function (respuesta) {
            respuesta.forEach(function (evento) {
                evento.title = evento.especialidad;
                evento.start = evento.horaCupo;
                delete evento.especialidad;
                delete evento.horaCupo;
            });

            //var eventosFiltrados = respuesta.filter(evento => evento.estado == 'DI');
            // Obtén la fecha y hora actual
            var fechaHoraActual = new Date();

            // Filtra los eventos que cumplen con ambas condiciones
            var eventosFiltrados = respuesta.filter(function (evento) {
                // Convertir la hora del evento a un objeto Date
                var fechaEvento = new Date(evento.start);

                // Verificar si el evento es del estado 'DI' y su fecha es igual o posterior a la actual
                return evento.estado === 'DI' && fechaEvento >= fechaHoraActual;
            });


            calendar.addEventSource(eventosFiltrados);

            var opcionesEspecialidad = {};
            eventosFiltrados.forEach(function (cupo) {
                if (!opcionesEspecialidad[cupo.title]) {
                    $("#slctEspecialidad").append('<option>' + cupo.title + '</option>');
                    opcionesEspecialidad[cupo.title] = true;
                }
            });

            var opcionesSede = {};
            eventosFiltrados.forEach(function (cupo) {
                if (!opcionesSede[cupo.nombreSede]) {
                    $("#slctUbicacion").append('<option>' + cupo.nombreSede + '</option>');
                    opcionesSede[cupo.nombreSede] = true;
                }
            });

            // Obtener eventos después de que se hayan cargado
            calendarioEvents = calendar.getEvents();
            calendar.render();
        });

        $('#slctEspecialidad, #slctUbicacion, #inputBuscar').on('change keyup', function () {
            var especialidadSeleccionada = $('#slctEspecialidad').val();
            var ubicacionSeleccionada = $('#slctUbicacion').val();
            var texto = $('#inputBuscar').val().trim().toLowerCase();

            var eventosFiltrados = calendarioEvents.filter(function (evento) {
                especialidadSeleccionada = especialidadSeleccionada == "-- Especialidad medica --" ? null : especialidadSeleccionada;
                ubicacionSeleccionada = ubicacionSeleccionada == "-- Establecimiento de salud --" ? null : ubicacionSeleccionada;

                return evento._def.extendedProps.estado == 'DI' &&
                    (especialidadSeleccionada === null || evento._def.title == especialidadSeleccionada) &&
                    (ubicacionSeleccionada === null || evento._def.extendedProps.nombreSede == ubicacionSeleccionada) &&
                    (evento._def.title.toLowerCase().includes(texto) || evento._def.extendedProps.nombreSede.toLowerCase().includes(texto) || evento._def.extendedProps.nombreDoctor.toLowerCase().includes(texto));
            });
            calendar.removeAllEvents();
            calendar.addEventSource(eventosFiltrados);
        });

        $('#btnResetFiltros').on('click', function () {
            var eventos = calendarioEvents

            calendar.removeAllEvents();
            calendar.addEventSource(eventos);
        });

        calendar.setOption('eventClick', function (info) {
            var fechaCupo = info.event._instance.range.start.toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            var horaCupo = info.event._instance.range.start.toLocaleString('en-EN', {
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'UTC'
            });

            $('#exampleModalCenter').modal('show');
            $('.fc-more-popover').remove(); // Eliminar cualquier ventana emergente dayMaxEventRows abierta
            var modal = $('#exampleModalCenter')
            modal.find('.modal-title').text(fechaCupo + ' ' + horaCupo)
            modal.find('.modal-sede').text(info.event._def.extendedProps.nombreSede)
            modal.find('.modal-doctor').text('Dr/a. ' + info.event._def.extendedProps.nombreDoctor + ' ' + info.event._def.extendedProps.apellidoUnoDoctor + ' ' + info.event._def.extendedProps.apellidoDosDoctor)
            modal.find('.modal-ubicacion').text(info.event._def.extendedProps.provincia + ', ' + info.event._def.extendedProps.distrito + ', ' + info.event._def.extendedProps.canton)
            modal.find('.modal-especialidad').text(info.event._def.title)
            modal.find('.modal-precio').text(info.event._def.extendedProps.precio + ' $')

            /* Agregar funcionalidad de revisar si ha pagado*/
            $('#modal-agendar').off('click').on('click', function () {
                var expediente = localStorage.getItem('IdExpediente');
                var ServiceRoute = "Cita/ValidarPagos?id=" + expediente;

                ca.GetToApi(ServiceRoute, function (respuesta) {
                    var estado = respuesta.resultado;

                    if (estado === 0) {
                        var cita = {};
                        cita.idDisponibilidadCupo = info.event._def.publicId;
                        cita.idExpediente = localStorage.getItem('IdExpediente');

                        if (cita.idExpediente === "") {
                            Swal.fire({
                                icon: 'warning',
                                title: 'No existe el expediente',
                                html: "Por favor, solicite la creación del expediente.",
                                footer: 'SIMEPCI'
                            });
                        } else {
                            ca.PostToAPI(CitaServiceRoute, cita, function () {
                                info.event.remove();
                                $('#exampleModalCenter').modal('hide');
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: '¡Atención!',
                            html: 'Tu cuenta presenta un saldo pendiente.<br>Por favor, realiza el pago para poder continuar.',
                            footer: 'SIMEPCI'
                        });
                        $('#exampleModalCenter').modal('hide');
                    }
                });
            });
        });
    };
}

$(document).ready(function () {
    var vc = new DisponibilidadCupoController();
    vc.InitView();
});
