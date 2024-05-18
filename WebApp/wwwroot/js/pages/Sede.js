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

function limpiarFormulario() {
    $('[id^="txt"]').val('');
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
    var vc = new SedeController();
    vc.LoadTable();
}



// Definimos la clase
function SedeController() {
    this.ViewName = "Sedes";
    this.ApiService = "Sede";

    // Método a ejecutar al inicio de la vista
    this.InitView = function () {
        // Bind del click del botón con la función correspondiente.
        $("#btnCreate").click(function () {
            var vc = new SedeController();
            vc.Create();
        })

        $("#btnUpdate").click(function () {
            var vc = new SedeController();
            vc.Update();
        })

        $("#btnDelete").click(function () {
            var vc = new SedeController();
            vc.Delete();
        })

        // Ocultar los botones al iniciar la vista
        ocultarBoton("btnUpdate");
        ocultarBoton("btnDelete");

        // Carga de la tabla
        $("#registro2").hide();

        // Carga de las provincias al iniciar la vista
        mostrarProvincias();

        $("#txtProvincia").change(function () {
            mostrarCantones($("#txtProvincia").val());
        });

        $("#txtCanton").change(function () {
            mostrarDistritos($("#txtCanton").val());
        });

    };

    this.Create = function () {
        // Crear un DTO de sede
        var sede = {};
        sede.Nombre = $("#txtNombre").val();
        sede.Descripcion = $("#txtDescripcion").val();
        sede.FechaCreacion = $("#txtFechaCreacion").val();
        sede.FotoSede = $("#txtFotoSede").val();
        sede.Latitud = $("#txtLatitud").val();
        sede.Longitud = $("#txtLongitud").val();
        sede.Provincia = $("#txtProvincia").val();
        sede.Canton = $("#txtCanton").val();
        sede.Distrito = $("#txtDistrito").val();
        sede.OtrasSennas = $("#txtOtrasSennas").val();

        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Create";

        var isValid = true;
        var messageError = "";


        if (sede.Nombre == "") {
            messageError += "<p>Debe de llenar el campo de nombre.</p>";
            isValid = false;
            $("#txtNombre").addClass("input-invalid");
        }
        if (sede.Descripcion == "") {
            messageError += "<p>Debe de llenar el campo de la descipción.</p>";
            isValid = false;
            $("#txtDescripcion").addClass("input-invalid");
        }
        if (sede.FechaCreacion == "") {
            messageError += "<p>Debe de llenar el campo de la fecha de creación.</p>";
            isValid = false;
            $("#txtFechaCreacion").addClass("input-invalid");
        }
        if (sede.Latitud == "") {
            messageError += "<p>Debe de llenar el campo de la latitud.</p>";
            isValid = false;
            $("#txtLatitud").addClass("input-invalid");
        }
        if (sede.Longitud == "") {
            messageError += "<p>Debe de llenar el campo de la longitud.</p>";
            isValid = false;
            $("#txtLongitud").addClass("input-invalid");
        }

        if (sede.Provincia == "") {
            messageError += "<p>Debe de llenar el campo de la provincia.</p>";
            isValid = false;
            $("#txtProvincia").addClass("input-invalid");
        }
        if (sede.Canton == "") {
            messageError += "<p>Debe de llenar el campo del cantón.</p>";
            isValid = false;
            $("#txtCanton").addClass("input-invalid");
        }
        if (sede.Distrito == "") {
            messageError += "<p>Debe de llenar el campo del distrito.</p>";
            isValid = false;
            $("#txtDistrito").addClass("input-invalid");
        }

        if (isValid) {
            try {
                ca.PostToAPI(serviceRoute, sede, function () {
                    console.log("Sede Creada -->" + JSON.stringify(sede));
                    limpiarFormulario();
                });
                this.Clean();
            } catch (error) {
                console.error("Error:", error);
            }
        }
        else {
            Toast.fire({
                icon: "warning",
                title: "El formulario no está debidamente lleno",
                html: messageError
            });
        }
       
    };

    this.Update = function () {
        var sede = {};
        sede.Id = $("#txtId").val();
        sede.Nombre = $("#txtNombre").val();
        sede.Descripcion = $("#txtDescripcion").val();
        sede.FechaCreacion = $("#txtFechaCreacion").val();
        sede.FotoSede = $("#txtFotoSede").val();
        sede.Latitud = $("#txtLatitud").val();
        sede.Longitud = $("#txtLongitud").val();
        sede.Provincia = $("#txtProvincia").val();
        sede.Canton = $("#txtCanton").val();
        sede.Distrito = $("#txtDistrito").val();
        sede.OtrasSennas = $("#txtOtrasSennas").val();

        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Update";

        ca.PutToAPI(serviceRoute, sede, function () {
            console.log("Sede updated -->" + JSON.stringify(sede));
            var vc = new SedeController();
            vc.LoadTable();
            limpiarFormulario();
        });
    };

    this.Delete = function () {
        var sede = {};
        sede.id = $("#txtId").val(),
        sede.nombre = "nombre";
        sede.descripcion = "descripcion";
        sede.fechaCreacion = new Date().toISOString();
        sede.fotoSede = "foto";
        sede.latitud = 12;
        sede.longitud = 12;
        sede.provincia = "provincia";
        sede.canton = "canton";
        sede.distrito = "distrito";
        sede.otrasSennas = "sennas";

        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Delete";

        ca.DeleteToAPI(serviceRoute, sede, function () {
            console.log("Sede deleted -->" + JSON.stringify(sede));
            var vc = new SedeController();
            vc.LoadTable();
            limpiarFormulario();
        });
    };

    // Método para la carga de las tablas
    this.LoadTable = function () {
        var ca = new ControlActions();

        // Ruta API para consumir el servicio
        var urlService = ca.GetUrlApiService(this.ApiService + "/RetrieveAll");

        // Destruir la tabla DataTable existente, si existe
        if ($.fn.DataTable.isDataTable('#tblSedes')) {
            $('#tblSedes').DataTable().destroy();
        }

        var spanishLanguage = {
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",
            "info": " ",
            "infoEmpty": " ",
            "infoFiltered": "(filtrado de MAX entradas totales)",
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
        var table = $("#tblSedes").DataTable({
            ajax: {
                url: urlService,
                dataSrc: ""
            },
            "columns": [
                { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
                { 'data': 'id'},
                { 'data': 'nombre' },
                { 'data': 'descripcion', 'visible': false },
                { 'data': 'fechaCreacion', 'visible': false },
                { 'data': 'fotoSede', 'visible': false },
                { 'data': 'latitud', 'visible': false },
                { 'data': 'longitud', 'visible': false },
                { 'data': 'provincia' },
                { 'data': 'canton' },
                { 'data': 'distrito', 'visible': false },
                { 'data': 'otrasSennas', 'visible': false }
            ],
            pageLength: 7, // Mostrar solo 7 entradas por página
            lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
            language: spanishLanguage
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
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Fecha Creacion:</td><td>' + (d.fechaCreacion || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Nombre:</td><td>' + (d.nombre || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Descripcion:</td><td>' + (d.descripcion || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Provincia:</td><td>' + (d.provincia || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Foto Sede:</td><td>' + (d.fotoSede || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;">Cantón:</td><td>' + (d.canton || '') + '</td>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Otras Señas:</td><td>' + (d.otrasSennas || '') + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="color: #0353A4; font-weight: bold; padding-right: 20px;"> Distrito:</td><td>' + (d.distrito || '') + '</td>' +
                
                '</tr>' +
                '</table>'
            );
        }

        // Asignación de evento al hacer clic en la fila de la tabla
        $('#tblSedes tbody').on('click', 'tr', function () {
            if (!$(this).hasClass('odd') && !$(this).hasClass('even')) {
                // No hacer nada si se hace clic en una fila expandida (child row)
                return;
            }
            // Extraer la fila a la que le dio click
            var row = $(this).closest('tr');

            // Manejar la selección de filas
            if (row.hasClass('selected')) {
                // Si la fila ya está seleccionada, quitar la clase 'selected'
                row.removeClass('selected');
            } else {
                // Deseleccionar todas las filas seleccionadas
                $('#tblSedes tbody').find('tr.selected').removeClass('selected');
                // Seleccionar la fila actual agregando la clase 'selected'
                row.addClass('selected');
            }

            // Extraer la data del registro contenido en la fila
            var sede = $('#tblSedes').DataTable().row(row).data();

            // Mapeo de los valores del objeto data con el formulario
            $("#txtId").val(sede.id);
            $("#txtNombre").val(sede.nombre);
            $("#txtDescripcion").val(sede.descripcion);
            var onlyDate = sede.fechaCreacion.split("T");
            $("#txtFechaCreacion").val(onlyDate[0]);
            $("#txtFotoSede").val(sede.fotoSede);
            $("#txtLatitud").val(sede.latitud);
            $("#txtLongitud").val(sede.longitud);
            $("#txtProvincia").val(sede.provincia);
            mostrarCantones($("#txtProvincia").val());
            $("#txtCanton").val(sede.canton);
            mostrarDistritos($("#txtCanton").val());
            $("#txtDistrito").val(sede.distrito);
            $("#txtOtrasSennas").val(sede.otrasSennas);

            // Mostrar los botones "Actualizar" y "Eliminar"
            mostrarBoton("btnUpdate");
            mostrarBoton("btnDelete");
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

}

// Función para mostrar las provincias
const mostrarProvincias = () => {
    distribucion.provincias.forEach(provincia => {
        $('#txtProvincia').append($('<option>', {
            value: provincia.title,
            text: provincia.title
        }));
    });
};

// Función para mostrar los cantones
const mostrarCantones = (nombreProvincia) => {
    $('#txtCanton').empty().append($('<option>', {
        value: '',
        text: '-- Seleccione un cantón --'
    }));
    distribucion.provincias.forEach(provincia => {
        if (nombreProvincia === provincia.title) {
            provincia.cantones.forEach(canton => {
                $('#txtCanton').append($('<option>', {
                    value: canton.title,
                    text: canton.title
                }));
            });
        }
    });
};

// Función para mostrar los distritos
const mostrarDistritos = (nombreCanton) => {
    $('#txtDistrito').empty().append($('<option>', {
        value: '',
        text: '-- Seleccione un distrito --'
    }));
    distribucion.provincias.forEach(provincia => {
        provincia.cantones.forEach(canton => {
            if (nombreCanton === canton.title) {
                canton.distritos.forEach(distrito => {
                    $('#txtDistrito').append($('<option>', {
                        value: distrito.title,
                        text: distrito.title
                    }));
                });
            }
        });
    });
};

// Instanciamiento de la clase
$(document).ready(function () {
    var vc = new SedeController();
    vc.InitView();
    initMap();
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
