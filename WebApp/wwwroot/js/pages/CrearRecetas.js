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

function mostrarPantallaCitas() {
    $('#pantallaCitas').show();
    $('#pantallaRecetaManual').hide();
    $('#pantallaRecetaImagen').hide();
}

function mostrarPantallaRecetaManual() {
    $('#pantallaRecetaManual').show();
    $('#pantallaCitas').hide();
    $('#pantallaRecetaImagen').hide();
}

function mostrarPantallaRecetaImagen() {
    $('#pantallaRecetaManual').hide();
    $('#pantallaCitas').hide();
    $('#pantallaRecetaImagen').show();
}

function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

function CrearRecetasController() {
    this.ViewName = "CrearRecetas";
    this.ApiService = "Receta";
    this.CitaService = "Cita";

    this.InitView = function () {
        var cr = new CrearRecetasController();
        $("#btnCrear").click(function () {
            var vc = new CrearRecetasController();
            cr.CreateReceta();
        })

        $("#btnAtras").click(function () {
            mostrarPantallaCitas();
            ocultarBoton("btnAdelante");
            $('input').removeClass('input-error');
            cr.ReloadTable();
        })

        $("#btnAtrasImagen").click(function () {
            mostrarPantallaRecetaManual();
            ocultarBoton("btnAdelante");
            $('input').removeClass('input-error');
            cr.ReloadTable();
        })

        $("#btnCrearImagen").click(function () {
            var cr = new CrearRecetasController();
            cr.CreateRecetaImagen();
        })

        $("#btnAdelante").click(function () {
            mostrarPantallaRecetaManual();
            cr.ReloadTable();
        })

        $("#btnRecetaImagen").click(function () {
            mostrarPantallaRecetaImagen();
            cr.ReloadTable();
        })

        $('input').on('change', function () {
            $(this).removeClass('input-error');
        });

        $('.image-upload-wrap').bind('dragover', function () {
            $('.image-upload-wrap').addClass('image-dropping');
        });
        $('.image-upload-wrap').bind('dragleave', function () {
            $('.image-upload-wrap').removeClass('image-dropping');
        });

        ocultarBoton("btnAdelante");
        this.LoadTable();
        mostrarPantallaCitas();
    }

    this.CreateReceta = function () {
        var receta = {};
        receta.idCita = $("#txtIdCita").val();
        receta.medicamento = $("#txtMedicamento").val();
        receta.dosificacion = $("#txtDosificacion").val();
        receta.indicaciones = $("#txtIndicaciones").val();
        receta.imagenReceta = "";

        //console.log(receta)
        var ca = new ControlActions();
        var cr = new CrearRecetasController();
        var serviceRoute = this.ApiService + "/Create";

        var isValid = true;
        var messageError = "";


        if ($("#txtIdCita").val() == "") {
            messageError += "<p>Debe de llenar el campo de id cita</p>";
            isValid = false;
            $("#txtIdCita").addClass("input-error");
        }

        if ($("#txtMedicamento").val() == "") {
            messageError += "<p>Debe de llenar el campo de medicamento</p>";
            isValid = false;
            $("#txtMedicamento").addClass("input-error");
        }

        if ($("#txtDosificacion").val() == "") {
            messageError += "<p>Debe de llenar el campo de dosificación</p>";
            isValid = false;
            $("#txtDosificacion").addClass("input-error");
        }

        if ($("#txtIndicaciones").val() == "") {
            messageError += "<p>Debe de llenar el campo de indicaciones</p>";
            isValid = false;
            $("#txtIndicaciones").addClass("input-error");
        }


        if (isValid) {
            try {
                ca.PostToAPI(serviceRoute, receta, function () {
                    cr.ReloadTable();
                    ocultarBoton("btnAdelante");

                    setTimeout(function () {
                        window.location.href = "/CrearRecetas";
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

    this.CreateRecetaImagen = function () {
        var receta = {};
        receta.idCita = sessionStorage.getItem("citaId");;
        receta.medicamento = "";
        receta.dosificacion = 0;
        receta.indicaciones = "";
        imagenReceta = $('.file-upload-input')[0].files[0];

        var ca = new ControlActions();
        var cr = new CrearRecetasController();
        var serviceRoute = this.ApiService + "/Create";

        if (imagenReceta != undefined) {
            // Crear un objeto FormData y agregar la imagen al mismo
            var formData = new FormData();
            formData.append('file', imagenReceta);


            // Realizar una solicitud AJAX para enviar la imagen a la API
            $.ajax({
                url: 'https://localhost:7081/Files/ImageReceta',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    receta.imagenReceta = response.fileName;


                    ca.PostToAPI(serviceRoute, receta, function () {
                        cr.ReloadTable();
                        ocultarBoton("btnAdelante");

                        setTimeout(function () {
                            window.location.href = "/CrearRecetas";
                        }, 1000);
                        removeUpload();
                    });
                },
                error: function (xhr, status, error) {
                    // Manejar errores de la solicitud AJAX
                    console.error('Error al cargar la imagen:', error);
                }
            });
        } else {
            Toast.fire({
                icon: "warning",
                title: "El formulario no esta debidamente lleno",
                html: "<p>Debe de llenar el campo de imagen de receta</p>"
            });
        }
    }

    // Metodo para la carga de datos en la tabla
    this.LoadTable = function () {
        var ca = new ControlActions();
        // Ruta del API para consumir servicios
        var urlService = ca.GetUrlApiService(this.CitaService + "/RetrieveAll");

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
        var table = $("#tblCitas").DataTable({
            "ajax": {
                "url": urlService,
                "dataSrc": ""
            },
            "columns": [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                {
                    'data': 'horaCupo',
                    'render': function (data) {
                        // Formatear la fecha utilizando la función personalizada
                        return hora24H(data);
                    }
                },
                { 'data': 'id', 'visible': false }, // Id oculto
                { 'data': 'idDoctor', 'visible': false }, // Id del doctor oculto
                { 'data': 'idDisponibilidadCupo', 'visible': false }, // idDisponibilidadCupo oculto
                { 'data': 'idExpediente', 'visible': false }, // idExpediente oculto
                { 'data': 'nombreDoctor' },
                { 'data': 'apellidoUnoDoctor', 'visible': false }, // apellidoDosDoctor oculto
                { 'data': 'apellidoDosDoctor', 'visible': false }, // apellidoDosDoctor oculto
                { 'data': 'especialidad' },
                { 'data': 'nombrePaciente' },
                { 'data': 'apellidoUnoPaciente', 'visible': false }, // apellidoUnoPaciente oculto
                { 'data': 'apellidoDosPaciente', 'visible': false }, // apellidoDosPaciente oculto
                { 'data': 'nombreSede' },

                { 'data': 'provincia', 'visible': false }, // Provincia oculta
                { 'data': 'distrito', 'visible': false }, // Distrito oculto
                { 'data': 'canton', 'visible': false }, // Canton oculto
                { 'data': 'otrasSennas', 'visible': false } // otrasSennas oculto
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
                '<col style="width: 150px;">' + // Ancho para la tercera columna (etiqueta)
                '<col style="width: 200px;">' + // Ancho para la cuarta columna (valor)
                '</colgroup>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Id:</td><td>' + (d.id || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Sede:</td><td>' + (d.nombreSede || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Expediente:</td><td>' + (d.idExpediente || '') + '</td>' +

                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Doctor:</td><td>' + (d.nombreDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Provincia:</td><td>' + (d.provincia || '') + '</td>' +

                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Paciente:</td><td>' + (d.nombrePaciente || '') + '</td>' +

                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 1:</td><td>' + (d.apellidoUnoDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Distrito:</td><td>' + (d.distrito || '') + '</td>' +

                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 1:</td><td>' + (d.apellidoUnoPaciente || '') + '</td>' +

                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 2:</td><td>' + (d.apellidoDosDoctor || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Cantón:</td><td>' + (d.canton || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido 2:</td><td>' + (d.apellidoDosPaciente || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Especialidad:</td><td>' + (d.especialidad || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Otras señas:</td><td>' + (d.otrasSennas || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Fecha y hora:</td><td>' + (hora24H(d.horaCupo) || '') + '</td>' +
                '</tr>' +
                '</table>'
            );
        }

        // Asignación de evento al hacer clic en una fila de la tabla principal
        $('#tblCitas tbody').on('click', 'tr', function () {
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
                $('#tblCitas tbody').find('tr.selected').removeClass('selected');
                // Seleccionar la fila actual agregando la clase 'selected'
                row.addClass('selected');
            }

            // Mostrar el botón 'btnAdelante'
            mostrarBoton("btnAdelante");

            // Obtener los datos de la fila seleccionada
            var cita = $('#tblCitas').DataTable().row(row).data();
            
            // Obtener el id de la cita
            $("#txtIdCita").val(cita.id);
            sessionStorage.setItem("citaId", cita.id);
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
        $('#tblCitas').dataTable().fnDestroy();;
        this.LoadTable();
    }


    this.Clean = function () {
        $("#txtIdCita").val("");
        $("#txtMedicamento").val("");
        $("#txtDosificacion").val("");
        $("#txtIndicaciones").val("");
    }
}

// Instanciamiento de la clase
$(document).ready(function () {
    var vc = new CrearRecetasController();
    vc.InitView();
});