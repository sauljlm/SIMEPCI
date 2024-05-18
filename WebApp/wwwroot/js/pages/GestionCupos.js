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

// Función para formatear la fecha y hora en formato personalizado
function hora24H(fechaHora) {
    var fecha = new Date(fechaHora);
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var año = fecha.getFullYear();
    var horas = fecha.getHours();
    var minutos = fecha.getMinutes();
    var ampm = horas >= 12 ? 'pm' : 'am';

    // Convertir horas al formato de 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // La hora '0' es '12' en formato de 12 horas
    minutos = minutos < 10 ? '0' + minutos : minutos;

    var fechaFormateada = dia + '/' + mes + '/' + año + ' ' + horas + ':' + minutos + ampm;
    return fechaFormateada;
}

function ocultarBoton(idBoton) {
    $("#" + idBoton).hide();
}

function mostrarBoton(idBoton) {
    $("#" + idBoton).show();
}

function mostrarRegistro1() {
    $('#registro1').show();
    $('#registro2').hide();
}

function mostrarRegistro2() {
    $('#registro1').hide();
    $('#registro2').show();
}

function GestionCupoController() {
    this.ViewName = "GestionCupos";
    this.ApiService = "DisponibilidadCupo";
    this.SedeService = "Sede";
    this.UsuarioService = "Usuario";

    // Metodo a ejecutar al inicio de la vista.
    this.InitView = function () {
        var gc = new GestionCupoController();
        $("#btnUpdate").click( function () {
            var vc = new GestionCupoController();
            gc.Update();
        })

        $("#btnDelete").click(function () {
            gc.Delete();
        })

        $("#btnAtras").click(function () {
            mostrarRegistro1();
            ocultarBoton("btnAdelante");
            gc.ReloadTable();
        })

        $("#btnAdelante").click(function () {
            mostrarRegistro2();
            gc.ReloadTable();
        })

        $("#txtHoraCupo").click(function () {
            gc.FormateoDeHoras();
        });

        $("#registro2").hide();
        ocultarBoton("btnAdelante");
        this.LoadTable();
        this.FillSelects();

        $('select').on('change', function () {
            $(this).removeClass('input-error');
        });

        $('input').on('change', function () {
            $(this).removeClass('input-error');
        });

        $('#slctNombreDoctor').on('change', function () {
            $(this).removeClass('input-error');
            $('#txtEspecialidad').removeClass('input-error');
        });

        $('#slctNombreSede').on('change', function () {
            $(this).removeClass('input-error');
            $('#txtProvinciaSede').removeClass('input-error');
        });
    }

    this.Update = function () {
        var disponibilidadCupo = {};
        disponibilidadCupo.id = $("#slctIdCupo").val();
        disponibilidadCupo.idUsuarioDoctor = $("#slctNombreDoctor").val();
        disponibilidadCupo.idSede = $("#slctNombreSede").val();
        disponibilidadCupo.horaCupo = $("#txtHoraCupo").val();
        disponibilidadCupo.estado = $("#slctEstado").val();

        var ca = new ControlActions();
        var vc = new GestionCupoController();
        var serviceRoute = this.ApiService + "/Update";

        var isValid = true;
        var messageError = "";


        if ($("#slctIdCupo").val() == "") {
            messageError += "<p>Debe de llenar el campo de id cupo</p>";
            isValid = false;
            $("#slctIdCupo").addClass("input-error");
        }

        if ($("#slctNombreDoctor").val() == "") {
            messageError += "<p>Debe de llenar el campo de nombre del doctor</p>";
            isValid = false;
            $("#slctNombreDoctor").addClass("input-error");
        }

        if ($("#slctNombreSede").val() == "") {
            messageError += "<p>Debe de llenar el campo de nombre de la sede</p>";
            isValid = false;
            $("#slctNombreSede").addClass("input-error");
        }

        if ($("#txtHoraCupo").val() == "") {
            messageError += "<p>Debe de llenar el campo de hora del cupo</p>";
            isValid = false;
            $("#txtHoraCupo").addClass("input-error");
        }

        if ($("#slctEstado").val() == "") {
            messageError += "<p>Debe de llenar el campo de estado del cupo</p>";
            isValid = false;
            $("#slctEstado").addClass("input-error");
        }

        if ($("#txtProvinciaSede").val() == "") {
            messageError += "<p>Debe de llenar el campo de la provincia</p>";
            isValid = false;
            $("#txtProvinciaSede").addClass("input-error");
        }

        if ($("#txtEspecialidad").val() == "") {
            messageError += "<p>Debe de llenar el campo de especialidad</p>";
            isValid = false;
            $("#txtEspecialidad").addClass("input-error");
        }

        if (isValid) {
            try {
                ca.PutToAPI(serviceRoute, disponibilidadCupo, function () {
                    vc.ReloadTable();
                    ocultarBoton("btnAdelante");

                    setTimeout(function () {
                        window.location.href = "/GestionCupos";
                    }, 1000);
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
    }

    this.Delete = function () {
        var disponibilidadCupo = {};
        disponibilidadCupo.id = $("#slctIdCupo").val();
        disponibilidadCupo.idUsuarioDoctor = $("#slctNombreDoctor").val();
        disponibilidadCupo.idSede = $("#slctNombreSede").val();
        disponibilidadCupo.horaCupo = $("#txtHoraCupo").val();
        disponibilidadCupo.estado = $("#slctEstado").val();

        var ca = new ControlActions();
        var vc = new GestionCupoController();
        var serviceRoute = this.ApiService + "/Delete";

        ca.DeleteToAPI(serviceRoute, disponibilidadCupo, function () {
            vc.ReloadTable();
            ocultarBoton("btnAdelante");

            setTimeout(function () {
                window.location.href = "/GestionCupos";
            }, 1000);
        });

        this.Clean();
    }

    // Metodo para la carga de datos en la tabla
    this.LoadTable = function () {
        var ca = new ControlActions();
        // Ruta del API para consumir servicios
        var urlService = ca.GetUrlApiService(this.ApiService + "/RetrieveAll");

        var fechaHoraActual = new Date();

        var spanishLanguage = {
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de _MAX_ entradas totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros coincidentes",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna ascendente",
                "sortDescending": ": activar para ordenar la columna descendente"
            }
        };

        // Inicializar la tabla como un DataTable
        var table = $("#tblDisponibilidadCupo").DataTable({
            "ajax": {
                "url": urlService,
                "dataSrc": function (data) {
                    // Filtrar los datos para mostrar solo los cupos con estado "DI"
                    return data.filter(function (item) {
                        var fechaEvento = new Date(item.horaCupo);
                        return item.estado === "DI" && fechaEvento >= fechaHoraActual;
                    });
                }
            },
            "columns": [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { 'data': 'id', 'visible': false }, // Id oculto
                { 'data': 'idUsuarioDoctor', 'visible': false }, // Id del doctor oculto
                { 'data': 'nombreDoctor' }, // Doctor visible
                { 'data': 'apellidoUnoDoctor' }, // Apellido 1 visible
                { 'data': 'apellidoDosDoctor', 'visible': false }, // Apellido 2 visible
                { 'data': 'especialidad' }, // Especialidad visible
                { 'data': 'idSede', 'visible': false }, // Id de la sede oculto
                { 'data': 'nombreSede' }, // Sede visible
                { 'data': 'provincia', 'visible': false }, // Provincia oculta
                { 'data': 'distrito', 'visible': false }, // Distrito oculto
                { 'data': 'canton', 'visible': false }, // Canton oculto
                {
                    'data': 'horaCupo',
                    'render': function (data) {
                        // Formatear la fecha utilizando la función personalizada
                        return hora24H(data);
                    }
                },
                { 'data': 'estado', 'visible': false } // Estado visible
            ],
            pageLength: 7, // Mostrar solo 7 entradas por página
            lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
            language: spanishLanguage // Aplicar la configuración personalizada del idioma
        });

        function format(d) {
            if (!d) return '';

            return (
                '<table class="child-row">' +
                '<colgroup>' +
                '<col style="width: 150px;">' + // Ancho para la primera columna (etiqueta)
                '<col style="width: 200px;">' + // Ancho para la segunda columna (valor)
                '<col style="width: 150px;">' + // Ancho para la tercera columna (etiqueta)
                '<col style="width: 200px;">' + // Ancho para la cuarta columna (valor)
                '</colgroup>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Doctor:</td><td>' + (d.nombreDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Especialidad:</td><td>' + (d.especialidad || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 1:</td><td>' + (d.apellidoUnoDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Sede:</td><td>' + (d.nombreSede || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 2:</td><td>' + (d.apellidoDosDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Provincia:</td><td>' + (d.provincia || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Fecha y hora:</td><td>' + (hora24H(d.horaCupo) || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Distrito:</td><td>' + (d.distrito || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Estado:</td><td>' + (d.estado || '')   + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Cantón:</td><td>' + (d.canton || '') + '</td>' +
                '</tr>' +
                '</table>'
            );
        }



        // Asignación de evento al hacer clic en una fila de la tabla principal
        $('#tblDisponibilidadCupo tbody').on('click', 'tr', function () {
            if (!$(this).hasClass('odd') && !$(this).hasClass('even')) {
                // No hacer nada si se hace clic en una fila expandida (child row)
                return;
            }

            var row = $(this).closest('tr');

            // Manejar la selección de filas
            if (row.hasClass('selected')) {
                // Si la fila ya está seleccionada, quitar la clase 'selected'
                row.removeClass('selected');
            } else {
                // Deseleccionar todas las filas seleccionadas
                $('#tblDisponibilidadCupo tbody').find('tr.selected').removeClass('selected');
                // Seleccionar la fila actual agregando la clase 'selected'
                row.addClass('selected');
            }

            // Mostrar el botón 'btnAdelante'
            mostrarBoton("btnAdelante");

            // Obtener los datos de la fila seleccionada
            var disponibilidadCupo = $('#tblDisponibilidadCupo').DataTable().row(row).data();

            // Mapear los valores del objeto de datos con el formulario
            $("#slctIdCupo").val(disponibilidadCupo.id);
            $("#slctNombreDoctor").val(disponibilidadCupo.idUsuarioDoctor);
            $("#txtEspecialidad").val(disponibilidadCupo.especialidad);
            $("#slctNombreSede").val(disponibilidadCupo.idSede);
            $("#txtProvinciaSede").val(disponibilidadCupo.provincia);
            $("#txtHoraCupo").val(disponibilidadCupo.horaCupo);
            $("#slctEstado").val(disponibilidadCupo.estado);
            
        });

        table.on('click', 'td.dt-control', function (e) {

            let tr = e.target.closest('tr');
            let row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
            }
            else {
                // Cerramos todas las filas expandidas antes de abrir la nueva
                table.rows().every(function () {
                    if (this.child.isShown()) {
                        this.child.hide();
                    }
                });

                // Abrimos la nueva fila
                row.child(format(row.data())).show();
            }
        });
    };

    this.ReloadTable = function () {
        $('#tblDisponibilidadCupo').dataTable().fnDestroy();;
        this.LoadTable();
    }


    this.Clean = function () {
        $("#slctIdCupo").val("");
        $("#slctNombreDoctor").val("");
        $("#txtEspecialidad").val("");
        $("#slctNombreSede").val("");
        $("#txtProvinciaSede").val("");
        $("#txtHoraCupo").val("");
        $("#slctEstado").val("");
    }

    this.FillSelects = function () {
        var ca = new ControlActions(); // Invocar al API
        var serviceRouteDisponibilidadCupo = this.ApiService + "/RetrieveAll";
        var serviceRouteSede = this.SedeService + "/RetrieveAll";
        var serviceRouteUsuario = this.UsuarioService + "/RetrieveAllTipo";

        ca.GetToApi(serviceRouteDisponibilidadCupo, function (cupos) {
            cupos.forEach(function (cupo) {
                if (cupo.estado === "DI") {
                    $("#slctIdCupo").append('<option value="' + cupo.id + '">' + cupo.id + '</option>');
                }
            });
        });

        ca.GetToApi(serviceRouteUsuario, function (usuarios) {
            var opcionesUsuario = {};
            usuarios.forEach(function (usuario) {
                if (usuario.tipo === "Doctor") {
                    var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                    if (!opcionesUsuario[nombreCompleto]) {
                        $("#slctNombreDoctor").append('<option value="' + usuario.id + '" data-especialidad="' + usuario.especialidad + '">' + nombreCompleto + '</option>');
                        opcionesUsuario[nombreCompleto] = true;
                    }
                }
            });

            // Agregar evento para detectar el cambio en el usuario seleccionado
            $("#slctNombreDoctor").on("change", function () {
                var especialidad = $("#slctNombreDoctor option:selected").data("especialidad");
                $("#txtEspecialidad").val(especialidad);
            });
        });

        ca.GetToApi(serviceRouteSede, function (sedes) {
            var opcionesSede = {};
            sedes.forEach(function (sede) {
                if (!opcionesSede[sede.nombre]) {
                    $("#slctNombreSede").append('<option value="' + sede.id + '"  data-provincia="' + sede.provincia + '">' + sede.nombre + '</option>');
                    opcionesSede[sede.nombre] = true;
                }
            });

            // Agregar evento para detectar el cambio en el usuario seleccionado
            $("#slctNombreSede").on("change", function () {
                var provincia = $("#slctNombreSede option:selected").data("provincia");
                $("#txtProvinciaSede").val(provincia);
            });
        });
    };

    this.FormateoDeHoras = function () {
        const timeInput = $("#txtHoraCupo");

        // Evento que se ejecuta cuando cambia el valor del input datetime-local
        timeInput.on('change', function () {
            const selectedDateTime = timeInput.val();

            // Separar la fecha y la hora
            const [datePart, timePart] = selectedDateTime.split('T');
            const selectedTime = timePart.split(':');

            // Obtener horas y minutos
            let hours = parseInt(selectedTime[0]);
            let minutes = parseInt(selectedTime[1]);

            // Redondear la hora al más cercano (0 o 30)
            if (minutes < 15) {
                minutes = 0;
            } else if (minutes < 45) {
                minutes = 30;
            } else {
                minutes = 0;
                hours++; // Aumentar la hora si se pasa de 45 minutos
            }

            // Formatear la nueva hora en formato HH:mm
            const formattedHours = ('0' + hours).slice(-2);
            const formattedMinutes = ('0' + minutes).slice(-2);
            const formattedTime = `${formattedHours}:${formattedMinutes}`;

            // Combinar la fecha y la nueva hora
            const formattedDateTime = `${datePart}T${formattedTime}`;

            // Establecer el nuevo valor en el input
            timeInput.val(formattedDateTime);
        });
    };
}

// Instanciamiento de la clase
$(document).ready(function () {
    var vc = new GestionCupoController();
    vc.InitView();
});