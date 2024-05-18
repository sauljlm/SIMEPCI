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

function ocultarBoton(idBoton) {
    $("#" + idBoton).hide();
}

function mostrarBoton(idBoton) {
    $("#" + idBoton).show();
}

function mostrarUsuarios() {
    $('#usuarios1').show();
    $('#recetas').hide();
    $('#editarRecetas').hide();
    $('#verRecetasImagen').hide();

    ocultarBoton("btnFlechaSiguiente");
    ocultarBoton("btnAtras");
}

function mostrarRecetas() {
    $('#recetas').show();
    $('#usuarios1').hide();
    $('#editarRecetas').hide();
    $('#verRecetasImagen').hide();

    mostrarBoton("btnAtras");
}

function mostrarEditar() {
    $('#recetas').hide();
    $('#usuarios1').hide();
    $('#editarRecetas').show();

    ocultarBoton("btnAtras");
    ocultarBoton("btnFlechaSiguiente");
}


function mostrarRecetaImagen() {
    $('#recetas').hide();
    $('#usuarios1').hide();
    $('#editarRecetas').hide();
    $('#verRecetasImagen').show();

    ocultarBoton("btnAtras");
    ocultarBoton("btnFlechaSiguiente");
}

function RecetasController() {
    this.ViewName = "Recetas";
    this.ApiService = "Receta";
    this.ExpedienteService = "Expediente";

    this.InitView = function () {
        var rc = new RecetasController();

        $("#btnFlechaSiguiente").click(function () {
            mostrarRecetas();
            rc.RetrieveRecetas();
        })

        $("#btnAtras").click(function () {
            mostrarUsuarios();
            rc.ReloadTable();
        })

        $("#btnActualizar").click(function () {
            rc.Update();
            rc.ReloadTable();
        })

        $("#btnEliminar").click(function () {
            rc.Delete();
            rc.ReloadTable();
        })

        $("#btnEliminarRecetaImagen").click(function () {
            rc.DeleteRecetaImagen();
            rc.ReloadTable();
        })


        $("#btnAtrasEditar").click(function () {
            mostrarRecetas();
            $('input').removeClass('input-error');
        })

        $("#btnAtrasRecetaImagen").click(function () {
            mostrarRecetas();
        })

        $('input').on('change', function () {
            $(this).removeClass('input-error');
        });

        mostrarUsuarios();
        ocultarBoton("btnFlechaSiguiente");
        ocultarBoton("btnAtras");
        this.LoadTable();
    }

    this.Update = function () {
        var receta = {};
        receta.id = $("#txtIdReceta").val();
        receta.idCita = $("#txtIdCita").val();
        receta.medicamento = $("#txtMedicamento").val();
        receta.dosificacion = $("#txtDosificacion").val();
        receta.indicaciones = $("#txtIndicaciones").val();
        receta.imagenReceta = "";

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

        var ca = new ControlActions();
        var rc = new RecetasController();
        var serviceRoute = this.ApiService + "/Update";

        if (isValid) {
            try {
                ca.PutToAPI(serviceRoute, receta, function () {

                    setTimeout(function () {
                        // Cerrar SweetAlert
                        swal.close();
                        rc.RetrieveRecetas();
                        mostrarRecetas();
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
        var receta = {};
        receta.id = $("#txtIdReceta").val();
        receta.idCita = 0;
        receta.medicamento = "";
        receta.dosificacion = 0;
        receta.indicaciones = "";
        receta.imagenReceta = "";

        var ca = new ControlActions();
        var rc = new RecetasController();
        var serviceRoute = this.ApiService + "/Delete";

        ca.DeleteToAPI(serviceRoute, receta, function () {

            setTimeout(function () {
                // Cerrar SweetAlert
                swal.close();
                rc.RetrieveRecetas();
                mostrarRecetas();
            }, 1000);
        });

        this.Clean();
    }


    this.DeleteRecetaImagen = function () {
        var receta = {};
        receta.id = $(".btnRecetaImagen").data("id");
        receta.idCita = 0;
        receta.medicamento = "";
        receta.dosificacion = 0;
        receta.indicaciones = "";
        receta.imagenReceta = "";

        console.log(receta)
        var ca = new ControlActions();
        var rc = new RecetasController();
        var serviceRoute = this.ApiService + "/Delete";

        ca.DeleteToAPI(serviceRoute, receta, function () {

            setTimeout(function () {
                // Cerrar SweetAlert
                swal.close();
                rc.RetrieveRecetas();
                mostrarRecetas();
            }, 1000);
        });

        this.Clean();
    }

    // Método para la carga de las tablas
    this.LoadTable = function () {
        var ca = new ControlActions();

        // Ruta API para consumir el servicio
        var urlService = ca.GetUrlApiService(this.ExpedienteService + "/RetrieveAll");

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

        // Inicializar la tabla como un DataTable con la configuración de idioma personalizada
        var table = $("#tblUsuario").DataTable({
            ajax: {
                url: urlService,
                dataSrc: ""
            },
            columns: [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { data: 'id', visible: false },
                { data: 'idUsuarioPaciente', visible: false },
                { data: 'identificacion' },
                { data: 'nombre' },
                { data: 'apellidoUno' },
                { data: 'apellidoDos' },
                { data: 'telefono', visible: false },
                { data: 'correo', visible: false },
                { data: 'sexo', visible: false },
                { data: 'fechaNacimiento', visible: false },
                { data: 'latitud', visible: false },
                { data: 'longitud', visible: false },
                { data: 'enfermedadesFamiliares', visible: false },
                { data: 'habitosNoSaludables', visible: false },
                { data: 'antecedentes', visible: false }
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
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Id:</td><td>' + (d.id || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Correo:</td><td>' + (d.correo || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Identificación:</td><td>' + (d.identificacion || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Sexo:</td><td>' + (d.sexo || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Nombre:</td><td>' + (d.nombre || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Fecha Nacimiento:</td><td>' + (d.fechaNacimiento || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Apellido Uno:</td><td>' + (d.apellidoUno || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Latitud:</td><td>' + (d.latitud || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Apellido Dos:</td><td>' + (d.apellidoDos || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Longitud:</td><td>' + (d.longitud || '') + '</td>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Teléfono:</td><td>' + (d.telefono || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Estado:</td><td>' + (d.estado || '') + '</td>' +
                '</tr>' +
                '</table>'
            );
        }

        // Asignación de evento al hacer clic en la fila de la tabla
        $('#tblUsuario tbody').on('click', 'tr', function () {
            if (!$(this).hasClass('odd') && !$(this).hasClass('even')) {
                // No hacer nada si se hace clic en una fila expandida (child row)
                return;
            }

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }

            //extrae la fila a la que le dio click
            var row = $(this).closest('tr');

            // Manejar la selección de filas
            if (row.hasClass('selected')) {
                // Si la fila ya está seleccionada, quitar la clase 'selected'
                row.removeClass('selected');
            } else {
                // Deseleccionar todas las filas seleccionadas
                $('#tblUsuario tbody').find('tr.selected').removeClass('selected');
                // Seleccionar la fila actual agregando la clase 'selected'
                row.addClass('selected');
            }

            //extraer la data del registro contenido en la fila
            var expediente = $('#tblUsuario').DataTable().row(row).data();

            mostrarBoton("btnFlechaSiguiente");

            // Ingresar id del expediente del paciente en el session storage
            sessionStorage.setItem('PacienteExpediente', expediente.id)
        });

        table.on('click', 'td.dt-control', function (e) {

            let tr = e.target.closest('tr');
            let row = table.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
            } else {
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

    this.RetrieveRecetas = function () {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAll";

        $("#recetas").empty();

        ca.GetToApi(serviceRoute, function (respuesta) {
            var recetas = respuesta;

            if (recetas != null) {
                recetas.sort((a, b) => new Date(b.emision) - new Date(a.emision));

                recetas.forEach(function (receta) {
                    if (receta.idExpediente == sessionStorage.getItem('PacienteExpediente')) {

                        // Obtener la fecha de emisión en el formato deseado (solo la fecha)
                        var fechaEmision = new Date(receta.emision); // Convertir la cadena a un objeto Date
                        var fechaFormateada = fechaEmision.toLocaleDateString('es-ES'); // Formatear la fecha a un formato local (español en este caso)

                        if (receta.imagenReceta == "") {
                            // Mostrar información de la receta sin imagen
                            recetaManual =
                                '<div class="col-md-4 mb-4">' +
                                '<div class="card rounded-3 border-2" style="border-color: #0353A4; height: 100%;">' +
                                '<div class="card-body">' +
                                '<h5 class="card-title" style="color: #0353A4;">Asigna Dr(a). ' + receta.nombreDoctor + '</h5>' +
                                '<p class="card-text" style="color: #6b757d; margin-bottom:1.1vh">' +
                                "Medicamento: " + receta.medicamento + '<br>' +
                                "Dosificación: " + receta.dosificacion + '<br>' +
                                "Indicaciones: " + receta.indicaciones + '<br>' +
                                "Doctor: " + receta.nombreDoctor + " " + receta.apellidoUnoDoctor + " " + receta.apellidoDosDoctor + '<br>' +
                                "Sede: " + receta.nombreSede + '<br>' +
                                "Emisión: " + fechaFormateada + '</p>' +
                                '<button class="btn mx-auto d-block w-50 text-light btnEditarReceta" ' +
                                'data-id="' + receta.id + '" ' +
                                'data-idCita="' + receta.idCita + '" ' +
                                'data-medicamento="' + receta.medicamento + '" ' +
                                'data-dosificacion="' + receta.dosificacion + '" ' +
                                'data-indicaciones="' + receta.indicaciones + '" ' +
                                'style="background-color: #0353A4;">Editar</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            $("#recetas").append(recetaManual);

                        } else {
                            // Obtener la imagen de la receta
                            let avatarrequest = receta.imagenReceta;

                            $.ajax({
                                url: 'https://localhost:7081/Files/ImageReceta',
                                type: 'GET',
                                data: { fileName: avatarrequest },
                                success: function (response) {
                                    // Crear el elemento <div> que contiene la tarjeta de receta con la imagen
                                    recetaImagen =
                                        '<div class="col-md-4 mb-4">' +
                                        '<div class="card rounded-3 border-2" style="border-color: #0353A4; height: 100%;">' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title" style="color: #0353A4;">Asigna Dr(a). ' + receta.nombreDoctor + '</h5>' +
                                        '<img class="image-container" src="' + response.img + '" style="width:100%; height:150px; object-fit: cover;">' +
                                        '<button class="btnRecetaImagen btn mx-auto d-block w-50 text-light btnVerReceta" ' +
                                        'style="background-color: #0353A4;" data-img="' + response.img + '" data-id="' + receta.id + '">Ver</button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';

                                    // Agregar el elemento al contenedor con id="recetas"
                                    $("#recetas").append(recetaImagen);
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error al obtener la imagen de la receta:', error);
                                }
                            });
                        }
                    }
                });

                // Delegación de eventos para el botón de editar receta (con selector de clase)
                $("#recetas").on("click", ".btnEditarReceta", function () {
                    var $btnEditar = $(this);

                    var receta = {}
                    receta.id = $btnEditar.data("id");
                    receta.idCita = $btnEditar.data("idcita");
                    receta.medicamento = $btnEditar.data("medicamento");
                    receta.dosificacion = $btnEditar.data("dosificacion");
                    receta.indicaciones = $btnEditar.data("indicaciones");

                    $("#txtIdReceta").val(receta.id);
                    $("#txtIdCita").val(receta.idCita);
                    $("#txtMedicamento").val(receta.medicamento);
                    $("#txtDosificacion").val(receta.dosificacion);
                    $("#txtIndicaciones").val(receta.indicaciones);
                    // Llamar a la función para mostrar el formulario de edición
                    mostrarEditar();
                });

                // Asignar el controlador de eventos click después de agregar todos los elementos
                $("#recetas").on("click", ".btnRecetaImagen", function () {
                    var imgSrc = $(this).data('img');
                    $('#verRecetasImagen').find('.imgRecetaMedica').attr('src', imgSrc);
                    mostrarRecetaImagen();
                });
            }
        });
    };


    this.ReloadTable = function () {
        $('#tblUsuario').dataTable().fnDestroy();
        this.LoadTable();
    }


    this.Clean = function () {
        $("#txtIdReceta").val("");
        $("#txtMedicamento").val("");
        $("#txtDosificacion").val("");
        $("#txtIndicaciones").val("");
    }
}

// Instanciamiento de la clase
$(document).ready(function () {
    var rc = new RecetasController();
    rc.InitView();
})

