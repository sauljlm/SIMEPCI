function limpiarFormulario() {
    $('[id^="txt"]').val('');
}

function ocultarBoton(idBoton) {
    $("#" + idBoton).hide();
}

function mostrarBoton(idBoton) {
    $("#" + idBoton).show();
}

function mostrarusuarios1() {
    $('#usuarios1').show();
    $('#usuarios2').hide();
    // Ocultar los botones al iniciar la vista
    ocultarBoton("btnUpdate");
    ocultarBoton("btnDelete");
    ocultarBoton("btnFlechaSiguiente");
    var vc = new UserController();
    vc.LoadTable();
}

function mostrarusuarios2() {
    $('#usuarios1').hide();
    $('#usuarios2').show();
    mostrarBoton("btnUpdate");
    mostrarBoton("btnDelete");
}

function UserController() {
    this.ViewName = "Usuarios";
    this.ApiService = "Usuario";
    this.SedeService = "Sede";

    this.InitView = function () {
        $("#btnUpdate").click(function () {
            var vc = new UserController();
            vc.Update();
        })

        // Carga de la tabla
        $("#usuarios2").hide();

        // Agrega un listener de eventos al campo "tipo"
        $("#slctTipo").change(function () {
            // Verifica si la opción seleccionada es "Doctor"
            if ($(this).val() === "Doctor") {
                // Muestra el campo "especialidad"
                $("#contenedor-especialidad").removeClass('d-none');
            } else {
                // Oculta el campo "especialidad"
                $("#contenedor-especialidad").addClass('d-none');
            }
        });

        this.FillSelects();
        this.LoadTable();
        ocultarBoton("btnFlechaSiguiente");
    }
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
        usuario.Estado = $("#slctEstado").val();
        usuario.ValidacionPerfil = $("#slctValidacion").val();

        // Actualizar rol
        usuario.Tipo = $("#slctTipo").val();
        usuario.Especialidad = $("#txtEspecialidad").val();

        // Actualizar sede
        usuario.IdSede = $("#slctSede").val();


        let perfilActual = localStorage.getItem('Avatar');

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

                        var vc = new UserController();
                        vc.LoadTable();
                        limpiarFormulario();
                        ocultarBoton("btnFlechaSiguiente");
                        localStorage.setItem('Avatar', usuario.FotoPerfil);

                        setTimeout(function () {
                            window.location.href = "/Usuario";
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
                vc.LoadTable();
                limpiarFormulario();
                ocultarBoton("btnFlechaSiguiente");

                setTimeout(function () {
                    window.location.href = "/Usuario";
                }, 1000);
            });
        }
    };   

    // Método para la carga de las tablas
    this.LoadTable = function () {
        var ca = new ControlActions();

        // Ruta API para consumir el servicio
        var urlService = ca.GetUrlApiService(this.ApiService + "/RetrieveAllTipo");

        // Destruir la tabla DataTable existente, si existe
        if ($.fn.DataTable.isDataTable('#tblUsuario')) {
            $('#tblUsuario').DataTable().destroy();
        }  

        var spanishLanguage = {
            buttons: {
                copyTitle: 'Copiado al portapapeles',
                copySuccess: {
                    _: '%d filas copiadas',
                    1: '1 fila copiada'
                }
            },
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de _MAX_ entradas totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar MENU entradas",
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
        var table = $("#tblUsuario").DataTable({
            ajax: {
                url: urlService,
                dataSrc: ""
            },
            "columns": [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { 'data': 'id', 'visible': false },
                { 'data': 'identificacion'},
                { 'data': 'nombre'},
                { 'data': 'apellidoUno'},
                { 'data': 'apellidoDos'},
                { 'data': 'telefono', 'visible': false },
                { 'data': 'correo', 'visible': false },
                { 'data': 'sexo', 'visible': false },
                { 'data': 'fechaNacimiento', 'visible': false },
                { 'data': 'latitud', 'visible': false },
                { 'data': 'longitud', 'visible': false },
                { 'data': 'fotoPerfil', 'visible': false },
                { 'data': 'estado' },
                { 'data': 'validacionPerfil', 'visible': false }
            ],
            dom: 'Bfrtip', // Agrega los botones en la parte superior derecha
            buttons: [
                {
                    extend: 'collection',
                    text: 'Exportar',
                    buttons: [
                        {
                            extend: 'copy',
                        },
                        {
                            extend: 'excel',
                        },
                        {
                            extend: 'csv',
                        },
                        {
                            extend: 'pdf',
                            orientation: 'landscape', // Configurar la orientación como horizontal (paisaje)
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13] // Índices de columnas a copiar
                            }
                        }
                    ]
                }
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
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Foto:</td><td>' + (d.fotoPerfil || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Validación:</td><td>' + (d.validacionPerfil || '') + '</td>' +
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
            var usuario = $('#tblUsuario').DataTable().row(row).data();

            mostrarBoton("btnFlechaSiguiente"); 

            // Mapeo de los valores del objeto data con el formulario
            $("#txtId").val(usuario.id);
            $("#txtIdentificacion").val(usuario.identificacion);
            $("#txtNombre").val(usuario.nombre);
            $("#txtApellidoUno").val(usuario.apellidoUno);
            $("#txtApellidoDos").val(usuario.apellidoDos);
            $("#txtTelefono").val(usuario.telefono);
            $("#txtCorreo").val(usuario.correo);
            $("#slctSexo").val(usuario.sexo);
            var onlyDate = usuario.fechaNacimiento.split("T");
            $("#txtFechaNacimiento").val(onlyDate[0]);
            $("#txtLatitud").val(usuario.latitud);
            $("#txtLongitud").val(usuario.longitud);
            $("#txtFoto").val('');/**/
            $("#slctTipo").val(usuario.tipo);

            // Verifica el valor inicial del campo "tipo" al cargar la página
            if (usuario.tipo === "Doctor") {
                $("#contenedor-especialidad").removeClass('d-none'); // Muestra el campo "especialidad"
            } else {
                $("#contenedor-especialidad").addClass('d-none'); // Oculta el campo "especialidad"
            }

            $("#txtEspecialidad").val(usuario.especialidad);
            $("#slctSede").val(usuario.idSede);
            $("#slctEstado").val(usuario.estado);
            $("#slctValidacion").val(usuario.validacionPerfil);
            $("#txtContrasenna").val(usuario.contrasenna);
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

    this.FillSelects = function () {
        var ca = new ControlActions(); // Invocar al API
        var serviceRouteSede = this.SedeService + "/RetrieveAll";

        ca.GetToApi(serviceRouteSede, function (sedes) {
            var opcionesSede = {};
            //console.log(sedes)
            sedes.forEach(function (sede) {
                if (!opcionesSede[sede.nombre]) {
                    $("#slctSede").append('<option value="' + sede.id + '">' + sede.nombre + '</option>');
                    opcionesSede[sede.nombre] = true;
                }
            });
        });
    };
}

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

// Instanciamiento de la clase
$(document).ready(function () {
    var vc = new UserController();
    vc.InitView();
    if (typeof google === 'object' && typeof google.maps === 'object') {
        // Google Maps API is already loaded, initialize map directly
        initMap();
    } else {
        // Wait for the API script to load
        window.addEventListener('load', () => {
            initMap();
        });
    }
})

