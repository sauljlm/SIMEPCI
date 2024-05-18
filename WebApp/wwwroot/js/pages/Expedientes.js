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


// Función para mostrar las vistas
function mostrarCard(card) {
    $("#card" + card).show();
}

// Función para ocultar las vistas
function ocultarCard(card) {
    $("#card" + card).hide();
}

function updateData(tabla) {
    // ... código para actualizar el registro en la base de datos ...
    $('#tbl' + tabla).DataTable().ajax.reload();
}

function deleteData(tabla) {
    // ... código para actualizar el registro en la base de datos ...

    dataTable = $('#tbl' + tabla)
    if ($.fn.DataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
}

function crearHistoriaClinica() {
    var vc = new ExpedienteController();
    vc.CrearHistoriaClinica();
}

function actualizarHistoriaClinica() {
    var vc = new ExpedienteController();
    vc.ActualizarHistoriaClinica();
}

// Obtiene una fila de datos del get de la tabla
function createInputRow( data, keysToIgnore = [], customKeyText = [], empty, sel) {

    id = sessionStorage.getItem('idCreate');
    if (!empty) {
         inputContainer = $('<div class="row justify-content-md-center"></div>');
    } else {
         inputContainer = $('<div id="formTemporal" class="row justify-content-md-center"></div>');
    }
    var count = 0

    for (const key in data) {

        if (!keysToIgnore.includes(key)) {

            const formGroup = $('<div class="form-group row"></div>');
            
            const label = $('<label for = ' + data.id + '-' + count +'></label>').text(customKeyText[count]);

            // Validación para crear un form temporal para la creación de un campo

            if (!empty) {
                input = $('<input id="txt' + id + count + '" class="form-control inputSIMEPCI" type="text" readonly>').val(data[key]);
            } else if (sel) {

                input = $('<input id="txtTemporal' + count + '" class="form-control inputSIMEPCI" type="text">');
            } else {

                input = $('<input id="txtTemporal' + count + '" class="form-control inputSIMEPCI" type="text">');
            }         

            inputContainer.append(formGroup);
            formGroup.append(label);
            formGroup.append(input);            
            count++;
        }
    }


    return inputContainer;
}

// Añade los grupos de datos a la card correspondiente
function populateInputSection(data, id, keysToIgnore = [], customKeyText = [], empty, sel) {

    // Recorre los datos del JSON enviado por el API
    $.each(data, function (index, item) {
        const inputRow = createInputRow(item, keysToIgnore, customKeyText, empty);
        const radioB = $('<input type="radio" name="dataRadio" id="' + item.id + '">');
        $("#txt" + id).append(radioB);
        $("#txt" + id).append(inputRow);
        $("#txt" + id).append('<hr></hr>');
    });

    // Se agregan los botones de las funcionalidades
    $("#txt" + id).append('<div id="form' + id + '" class="row mx-1"></div>');
    $("#form" + id).append('<div id="formCreate' + id + '" class="form-group col-lg-3"></div>');
    $("#form" + id).append('<div id="formUpdate' + id + '" class="form-group col-lg-3"></div>');
    $("#formCreate" + id).append('<button id="btnCreate' + id + '" class="btnSIMEPCI" type="button" onclick="create' + id +'()" style="height:40px; width:90px">Crear</button>');
    $("#formUpdate" + id).append('<button id="btnUpdate' + id + '" class="btnSIMEPCI" type="button" onclick="update' + id +'()" style="height:40px; width:95px; margin-left:22px">Actualizar</button>');
    $("#formDelete" + id).append('<button id="btnDelete' + id + '" class="btnSIMEPCI" type="button" style="height:40px; width:90px; margin-left:45px">Eliminiar</button>');


}

// Crea los DTO
function dtoSelect(dto) {
    
    var vc = new ExpedienteController();
    switch (dto) {
        case "ExamenesMedicos":
                var examenMedico = {};
                examenMedico.id = sessionStorage.getItem('idExamenMedico') != null ? sessionStorage.getItem('idExamenMedico') : 0;
                examenMedico.idExpediente = sessionStorage.getItem('idExpediente');
                examenMedico.idUsuarioDoctor = $("#slctNombreDoctor").val();
                examenMedico.tipo = $("#txtTipo").val();
                examenMedico.resultados = $("#txtResultado").val();
                examenMedico.realizadoEnClinica = $("#slctInterno").val();
                examenMedico.imagenExamen = "";

            var isValid = true;
            var messageError = "";

            if (examenMedico.realizadoEnClinica == 11) {
                messageError += "<p>Debe seleccionar dónde se realizó el examen.</p>";
                isValid = false;
                $("#slctInterno").addClass("input-invalid");
            }
            if (examenMedico.tipo == "") {
                messageError += "<p>Debe escribir el tipo de examen.</p>";
                isValid = false;
                $("#txtTipo").addClass("input-invalid");
            }

            if (isValid) {
                return examenMedico;

            } else {

                return ["Error", messageError];

                break;
            }

        case "NotasMedicas":

            var notaMedica = {};
            notaMedica.id = sessionStorage.getItem('idNotaMedica') != null ? sessionStorage.getItem('idNotaMedica') : 0; 
            notaMedica.idExpediente = sessionStorage.getItem('idExpediente');
            notaMedica.idUsuarioDoctor = $("#slctNombreMedico").val();
            notaMedica.nota = $("#txtNotaMedica").val();

            var isValid = true;
            var messageError = "";

            if (notaMedica.idUsuarioDoctor == -1) {
                messageError += "<p>Debe seleccionar el doctor.</p>";
                isValid = false;
                $("#slctNombreMedico").addClass("input-invalid");
            }
            if (notaMedica.nota == "") {
                messageError += "<p>Debe escribir una nota médica.</p>";
                isValid = false;
                $("#txtNotaMedica").addClass("input-invalid");
            }

            if (isValid) {
                return notaMedica;

            } else {

                return ["Error", messageError];      

                break;
            }
            

            
        case "NotasEnfermeria":
            
            var notaEnfermeria = {};
            notaEnfermeria.id = sessionStorage.getItem('idNotaEnfermeria') != null ? sessionStorage.getItem('idNotaEnfermeria') : 0;
            notaEnfermeria.idExpediente = sessionStorage.getItem('idExpediente');
            notaEnfermeria.idUsuarioEnfermero = $("#slctNombreEnfermero").val();
            notaEnfermeria.nota = $("#txtNotaEnfermeria").val();

            var isValid = true;
            var messageError = "";

            if (notaEnfermeria.idUsuarioEnfermero == -1) {
                messageError += "<p>Debe seleccionar el enfermero.</p>";
                isValid = false;
                $("#slctNombreEnfermero").addClass("input-invalid");
            }
            if (notaEnfermeria.nota == "") {
                messageError += "<p>Debe escribir una nota de enfermería.</p>";
                isValid = false;
                $("#txtNotaEnfermeria").addClass("input-invalid");
            }

            if (isValid) {
                return notaEnfermeria;

            } else {

                return ["Error", messageError];

                break;
            }

        case "Diagnosticos":

                        
            var diagnostico = {};
            diagnostico.id =  sessionStorage.getItem('idDiagnostico') != null ? sessionStorage.getItem('idDiagnostico') : 0;
            diagnostico.idCita = sessionStorage.getItem('idCita');
            diagnostico.idUsuarioDoctor = $("#slctNombreDoctorDiag").val();
            diagnostico.nombre = $("#txtNombreDiagnostico").val();
            diagnostico.descripcion = $("#txtDescripcion").val();
            diagnostico.fechaDiagnostico = $("#txtFechaDiagnostico").val();

            var isValid = true;
            var messageError = "";

            if (diagnostico.idUsuarioDoctor == -1) {
                messageError += "<p>Debe seleccionar el doctor.</p>";
                isValid = false;
                $("#slctNombreDoctorDiag").addClass("input-invalid");
            }
            if (diagnostico.nombre == "") {
                messageError += "<p>Debe escribir el nombre del diagnóstico.</p>";
                isValid = false;
                $("#txtNombreDiagnostico").addClass("input-invalid");
            }
            if (diagnostico.descripcion == "") {
                messageError += "<p>Debe escribir la descripción del diagnóstico.</p>";
                isValid = false;
                $("#txtDescipcion").addClass("input-invalid");
            }

            if (isValid) {
                return diagnostico;

            } else {

                return ["Error", messageError];

                break;
            }

        default:
            (`Sorry, we are out of ${expr}.`);
    }

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

// Asignación de formulario de Create a los botones de cada DTO

// Historia Clinica
function createHistoriaClinica() {
 
    sessionStorage.setItem('idCreate', "HistoriaClinica");
    id = "HistoriaClinica";
    const inputContainer = createInputRow([1, 2, 3], keysToIgnore = [], customKeyText = ["Antecedentes", "Hábitos no Saludables", "Enfermedades Familiares"], empty = true);
    $("#form" + id).remove();
    $("#txt" + id).append(inputContainer);
    $("#txt" + id).append('<div id="formBtnCreate" class="form-group row d-flex justify-content-center"></div>');
    $("#formBtnCreate").append('<button id="btnCreate' + id + '" class="btnSIMEPCI" style="height:40px; width:95px" onclick="crearHistoriaClinica()" type="button">Crear</button>');
    
}

function updateHistoriaClinica() {

    const selectedRadio = $('input[type="radio"]:checked');
    sessionStorage.setItem('idCreate', "HistoriaClinica");
    id = "HistoriaClinica";
    const inputContainer = createInputRow([1, 2, 3], keysToIgnore = [], customKeyText = ["Antecedentes", "Hábitos no Saludables", "Enfermedades Familiares"], empty = true);
    $("#form" + id).remove();
    $("#txt" + id).append(inputContainer);
    $("#txt" + id).append('<div id="formBtnCreate" class="form-group row d-flex justify-content-center"></div>');
    $("#formBtnCreate").append('<button id="btnCreate' + id + '" class="btnSIMEPCI" style="height:40px; width:95px" onclick="actualizarHistoriaClinica()" type="button">Crear</button>');
    
}



    //Definimnos la clase
function ExpedienteController() {

    this.ViewName = "Expedientes";
    this.ApiService = "Expediente";
    this.ApiServiceHistoriasClinicas = "HistoriaClinica"
    this.ApiServiceExamenesMedicos = "ExamenMedico"
    this.ApiServiceDiagnosticos = "Diagnostico"
    this.ApiServiceNotasEnfermeria = "NotaEnfermeria"
    this.ApiServiceNotasMedicas = "NotaMedica"
    this.ApiServiceUsuario = "Usuario"
    this.ApiServiceRegistroCitas = "Cita"
    this.ApiServiceRecetas = "Receta"

    //Metodo a ejecutar al inicio de la vista.
    this.InitView = function () {


        // Bind del click del boton create con la funcion correspondiente

        $("#btnVolverExpediente").click(function () {
            mostrarCard("TblExpedientes");
            ocultarCard("Expedientes");
            $('[id^="txt"]').empty();
            deleteData("ExamenesMedicos");
            $("#btnSelect").hide();
        })

        $("#btnVolverExamenMedico").click(function () {

            $('#slctNombreDoctor').val(-1);
            $('#tblExamenesMedicos tbody tr').removeClass('selected');
            $('#cardExamenesMedicos .inputSIMEPCI').val("");
            mostrarCard("Expedientes");
            ocultarCard("ExamenesMedicos");
            sessionStorage.removeItem('idExamenMedico');
        })

        $("#btnVolverNotaMedica").click(function () {

            $('#slctNombreDoctor').val(-1);
            $('#tblNotasMedicas tbody tr').removeClass('selected');
            $('#cardNotasMedicas .inputSIMEPCI').val("");
            mostrarCard("Expedientes");
            ocultarCard("NotasMedicas");
            sessionStorage.removeItem('idNotaMedica');
        })

        $("#btnVolverNotaEnfermeria").click(function () {

            $('#slctNombreEnfermeria').val(-1);
            $('#tblNotasEnfermeria tbody tr').removeClass('selected');
            $('#cardNotasEnfermeria .inputSIMEPCI').val("");
            mostrarCard("Expedientes");
            ocultarCard("NotasEnfermeria");
            sessionStorage.removeItem('idNotaEnfermeria');
        })

        $("#btnVolverRegistroCita").click(function () {


            $('#tblRegistroCitas tbody tr').removeClass('selected');
            $('#cardRegistroCitas .inputSIMEPCI').val("");
            mostrarCard("Expedientes");
            ocultarCard("RegistroCitas");
            sessionStorage.removeItem('idCita');


        })

        $("#btnVolverDiagnostico").click(function () {

            $('#slctNombreDoctorDiag').val(-1);
            $('#tblDiagnosticos tbody tr').removeClass('selected');
            $('#cardDiagnosticos .inputSIMEPCI').val("");
            mostrarCard("RegistroCitas");
            ocultarCard("Diagnosticos");
            sessionStorage.removeItem('idDiagnostico');
            sessionStorage.removeItem('idUsuarioDoctor');

        })
        $("#btnVolverReceta").click(function () {

            $('#slctNombreDoctorRec').val(-1);
            $('#tblRecetas tbody tr').removeClass('selected');
            $('#cardRecetas .inputSIMEPCI').val("");
            mostrarCard("RegistroCitas");
            ocultarCard("Recetas");
            sessionStorage.removeItem('idReceta');


        })

        $("#btnAtrasImagenExamen").click(function () {
            ocultarCard("PantallaExamenImagen");
            mostrarCard("ExamenesMedicos");
        })

        $("#btnSelect").click(function () {
            var vc = new ExpedienteController();
            vc.Select();
            mostrarCard("Expedientes");
            ocultarCard("TblExpedientes");
            vc.LoadExamenesMedicos();
            vc.LoadNotasMedicas();
            vc.LoadNotasEnfermeria();
            vc.LoadRegistroCitas();

            // Añade las historias clínicas al grupo de acordeón correspondiente
            vc.SelHistoriaClinica();
        })




        // Exámenes médicos

        //BTN Volver al Expediente
        $("#btnExamenesMedicos").on("click", function () {

            mostrarCard("ExamenesMedicos");
            ocultarCard("Expedientes");
            $("#btnActualizarExamenesMedicos").hide();
            $("#btnEliminarExamenesMedicos").hide();
        })

        $("#btnExamenesMedicosImagen").on("click", function () {

            mostrarCard("PantallaExamenImagen");
            ocultarCard("ExamenesMedicos");

            var vc = new ExpedienteController();
            vc.loadImagenesExamenes();
        })

        $("#btnNotasMedicas").on("click", function () {

            mostrarCard("NotasMedicas");
            ocultarCard("Expedientes");
        })

        $("#btnNotasEnfermeria").on("click", function () {

            mostrarCard("NotasEnfermeria");
            ocultarCard("Expedientes");
        })

        $("#btnRegistroCitas").on("click", function () {


            mostrarCard("RegistroCitas");
            ocultarCard("Expedientes");
        })

        $("#btnDiagnosticos").on("click", function () {

            var vc = new ExpedienteController();
            mostrarCard("Diagnosticos");
            ocultarCard("RegistroCitas");
            vc.LoadDiagnosticos();
        })

        $("#btnRecetas").on("click", function () {

            var vc = new ExpedienteController();
            mostrarCard("Recetas");
            ocultarCard("RegistroCitas");
            vc.LoadRecetas();
        })

        //BTN Agregar un Exámen Médico

        $('[id^="btnAgregar"]').on("click", function () {

            // Extract the suffix from the button ID
            const sufijo = $(this).attr('id').slice(10); // Toma como sufijo lo que va después del btnAgregar

            var vc = new ExpedienteController(); // Llama al controlador

            var dto = dtoSelect(sufijo);

            // Invocar al API
            var ca = new ControlActions();



            var serviceRoute = vc["ApiService" + sufijo] + "/Create";

            if (dto[0] != "Error") {
                ca.PostToAPI(serviceRoute, dto, function () {
                    updateData(sufijo);
                });
                $('[id^="txt"]').removeClass('input-invalid')
                $('[id^="slct"]').removeClass('input-invalid')
            } else {
                Toast.fire({
                    icon: "warning",
                    title: "El formulario no está debidamente lleno",
                    html: dto[1]
                });
            }


        });

        $('#btnCrearExamenesMedicosImg').on("click", function () {
            var vc = new ExpedienteController(); // Llama al controlador
            vc.CrearExamenImagen();
        });

        $('[id^="btnActualizar"]').on("click", function () {

            // Extract the suffix from the button ID
            const sufijo = $(this).attr('id').slice(13); // Toma como sufijo lo que va después del btnAgregar

            var vc = new ExpedienteController(); // Llama al controlador

            var dto = dtoSelect(sufijo);

            if ($("#slctNombreDoctor").val() == undefined) {
                dto.idUsuarioDoctor = -1;
            }

            // Invocar al API
            var ca = new ControlActions();



            var serviceRoute = vc["ApiService" + sufijo] + "/Update";

            if (dto[0] != "Error") {
                ca.PutToAPI(serviceRoute, dto, function () {
                    updateData(sufijo);
                });
                $('[id^="txt"]').removeClass('input-invalid')
                $('[id^="slct"]').removeClass('input-invalid')
            } else {
                Toast.fire({
                    icon: "warning",
                    title: "El formulario no está debidamente lleno",
                    html: dto[1]
                });
            }
        });

        $('[id^="btnEliminar"]').on("click", function () {

            // Extract the suffix from the button ID
            const sufijo = $(this).attr('id').slice(11); // Toma como sufijo lo que va después del btnAgregar

            var vc = new ExpedienteController(); // Llama al controlador

            var dto = dtoSelect(sufijo);
            dto.idUsuarioDoctor = 0;

            // Invocar al API
            var ca = new ControlActions();



            var serviceRoute = vc["ApiService" + sufijo] + "/Delete";

            ca.DeleteToAPI(serviceRoute, dto, function () {
                updateData(sufijo);
            });
        });

        const rol = localStorage.getItem('Rol');
        console.log(rol)

        if (rol != "Paciente") {
            ocultarCard("Expedientes");
        } else {
            this.Select();
            mostrarCard("Expedientes");
            ocultarCard("TblExpedientes");
            this.LoadExamenesMedicos();
            this.LoadNotasMedicas();
            this.LoadNotasEnfermeria();
            this.LoadRegistroCitas();
            $('[id^="btnEliminar"]').hide();
            $('[id^="btnAgregar"]').hide();
            $('[id^="btnActualizar"]').hide();
            $('#btnVolverExpediente').hide();
            $('#btnExamenesMedicosImagen').hide();
            // Añade las historias clínicas al grupo de acordeón correspondiente
            this.SelHistoriaClinica();
        }

        // Carga de data de la tabla
        this.LoadTableExpedientes();

        // Oculta los cards cuando carga la página

        ocultarCard("ExamenesMedicos");
        ocultarCard("NotasMedicas");
        ocultarCard("NotasEnfermeria");
        ocultarCard("PantallaExamenImagen");
        $('.carousel').carousel()
        $("#btnSelect").hide();
        $("#btnActualizarExamenesMedicos").hide();
        $("#btnEliminarExamenesMedicos").hide();
        ocultarCard("RegistroCitas");
        ocultarCard("Diagnosticos");
        ocultarCard("Recetas");
    }

    // Funciones de Creacion de DTO's

    // Historia Clinica
    this.CrearHistoriaClinica = function () {

        var historiaClinica = {};
        historiaClinica.idExpediente = sessionStorage.getItem('idExpediente');
        historiaClinica.antecedentes = $("#txtTemporal0").val();
        historiaClinica.habitosNoSaludables = $("#txtTemporal1").val();
        historiaClinica.enfermedadesFamiliares = $("#txtTemporal2").val();


        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiServiceHistoriasClinicas + "/Create";

        ca.PostToAPI(serviceRoute, historiaClinica, function () {
            ("Historia Clinica Created --->" + JSON.stringify(historiaClinica));

            var vc = new ExpedienteController();
            $("#formTemporal").remove();
            $("#formBtnCreate").remove();
            $("#txtHistoriaClinica").empty();
            vc.SelHistoriaClinica();// Actualiza la tabla
        });

    }

    this.CrearExamenImagen = function () {

        var ca = new ControlActions();
        var serviceRoute = this.ApiServiceExamenesMedicos + "/Create";

        var examenMedico = {};
        examenMedico.id = sessionStorage.getItem('idExamenMedico') != null ? sessionStorage.getItem('idExamenMedico') : 0;
        examenMedico.idExpediente = sessionStorage.getItem('idExpediente');
        examenMedico.idUsuarioDoctor = 0;
        examenMedico.tipo = "";
        examenMedico.resultados = "";
        examenMedico.realizadoEnClinica = "";

        // Crear un objeto FormData y agregar la imagen al mismo
        var formData = new FormData();
        var imagenExamen = $('.file-upload-input')[0].files[0];
        formData.append('file', imagenExamen);



        // Realizar una solicitud AJAX para enviar la imagen a la API
        $.ajax({
            url: 'https://localhost:7081/Files/ImageExamen',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                examenMedico.imagenExamen = response.fileName;
                ca.PostToAPI(serviceRoute, examenMedico, function () {
                    removeUpload();
                });

                setTimeout(function () {
                    ocultarCard("PantallaExamenImagen");
                    mostrarCard("ExamenesMedicos");
                }, 1000);
            },
            error: function (xhr, status, error) {
                // Manejar errores de la solicitud AJAX
                console.error('Error al cargar la imagen:', error);
            }
        });

        var vc = new ExpedienteController();
        vc.loadImagenesExamenes();
    }

    // Historia Clinica
    this.ActualizarHistoriaClinica = function () {

        var historiaClinica = {};
        historiaClinica.idExpediente = sessionStorage.getItem('idExpediente');
        historiaClinica.antecedentes = $("#txtTemporal0").val();
        historiaClinica.habitosNoSaludables = $("#txtTemporal1").val();
        historiaClinica.enfermedadesFamiliares = $("#txtTemporal2").val();

        

        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiServiceHC + "/Update";

        ca.PutToAPI(serviceRoute, historiaClinica, function () {
            ("Historia Clinica Created --->" + JSON.stringify(historiaClinica));

            var vc = new ExpedienteController();
            $("#formTemporal").remove();
            $("#formBtnCreate").remove();
            $("#txtHistoriaClinica").empty();
            vc.SelHistoriaClinica();// Actualiza la tabla
        });
    }

    // Carga los DTO's en el acordeón

    // Carga las Historias Clínicas
    this.SelHistoriaClinica = function () {
        var ca = new ControlActions();
        ("API Base URL:", this.ApiServiceHistoriasClinicas); // Log the base URL
        var serviceRoute = this.ApiServiceHistoriasClinicas + "/RetrieveByExpedienteId?id=" + sessionStorage.getItem('idExpediente');

        ca.GetToApi(serviceRoute, function (historiaClinica) {
            (historiaClinica);
            ("Historia Clinica Selectd --->" + JSON.stringify(historiaClinica));

            // Llama a la función que crea los rows de datos
            populateInputSection(historiaClinica, "HistoriaClinica", ["id", "idExpediente"], ["Antecedentes", "Hábitos no Saludables", "Enfermedades Familiares"], empty = false);

        });
    }

    this.Select = function () {

        const rol = localStorage.getItem('Rol');

        // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
        var idPaciente = rol == "Paciente" ? localStorage.getItem('userId') : sessionStorage.getItem('idUsuarioPaciente');


        // Invocar al API
        var ca = new ControlActions();
        ("API Base URL:", this.ApiService); // Log the base URL
        var serviceRoute = this.ApiService + "/RetrieveByPacienteId?id=" + idPaciente;

        ca.GetToApi(serviceRoute, function (expediente) {

            $('#tblExpedientes').DataTable().ajax.reload(); // Actualiza la tabla
            $("#txtIdentificacion").val(expediente.identificacion);
            $("#txtNombre").val(expediente.nombre);
            $("#txtApellidoUno").val(expediente.apellidoUno);
            $("#txtApellidoDos").val(expediente.apellidoDos);
            $("#txtCorreo").val(expediente.correo);
            $("#txtTelefono").val(expediente.telefono);
            $("#txtSexo").val(expediente.sexo);

            //Extraer solo la fecha
            var onlyDate = expediente.fechaNacimiento.split("T");

            $("#txtFechaNacimiento").val(onlyDate[0]);
            $("#txtLatitud").val(expediente.latitud);
            $("#txtLongitud").val(expediente.longitud);

        });

        //$('#tblExpedientes').DataTable().ajax.reload();
    }

    this.Update = function () {

        //Actualizar un DTO de expediente
        var expediente = {};
        expediente.expedienteID = $("#txtId").val();
        expediente.name = $("#txtName").val();
        expediente.email = $("#txtEmail").val();
        expediente.department = $("#txtDepartment").val();
        expediente.role = $("#txtRole").val();
        expediente.birthDate = $("#txtBirthDate").val();

        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Update";

        ca.PutToAPI(serviceRoute, expediente, function () {
            ("Expediente Updated --->" + JSON.stringify(expediente));
            $('#tblExpedientes').DataTable().ajax.reload(); // Actualiza la tabla
        });
    }

    this.Delete = function () {
        //Actualizar un DTO de expediente
        var expediente = {};
        expediente.expedienteID = $("#txtId").val();
        expediente.name = $("#txtName").val();
        expediente.email = $("#txtEmail").val();
        expediente.department = $("#txtDepartment").val();
        expediente.role = $("#txtRole").val();
        expediente.birthDate = $("#txtBirthDate").val();
        // Invocar al API
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/Delete";

        ca.DeleteToAPI(serviceRoute, expediente, function () {
            ("Expediente Deleted --->" + JSON.stringify(expediente));
            $('#tblExpedientes').DataTable().ajax.reload(); // Actualiza la tabla
        });
    }

    this.LoadTableExpedientes = function () {

        var ca = new ControlActions();

        //Ruta del API para consumir el servicio
        var urlService = ca.GetUrlApiService(this.ApiService + "/RetrieveAll");

        //Definir las columnas a extraer del json de respeusta

        var columns = [];

        columns[0] = { 'data': 'identificacion' }
        columns[1] = { 'data': 'nombre' }
        columns[2] = { 'data': 'apellidoUno' }
        columns[3] = { 'data': 'apellidoDos' }
        columns[4] = { 'data': 'id', visible: false }
        columns[5] = { 'data': 'idUsuarioPaciente', visible: false }

        var spanishLanguage = {
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",  
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

        //inicializar la table como una data table
        $("#tblExpedientes").dataTable({

            "ajax": {
                "url": urlService,
                "dataSrc": ""
            },
            "columns": columns,
            pageLength: 7, // Mostrar solo 7 entradas por página
            lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
            language: spanishLanguage // Aplicar la configuración personalizada del idioma
        });

        // Asignacion de evento al click de la fila de la tabla
        $('#tblExpedientes tbody').on('click', 'tr', function () {

            // Extrae la fila a la que le dio click

            $('#tblExpedientes tbody tr').removeClass('selected');
            $(this).addClass('selected');
            $("#btnSelect").show();
            var row = $(this).closest('tr');

            // Extraer la data del registro contenido en la fila
            var expediente = $('#tblExpedientes').DataTable().row(row).data();

            // Se guarda en el sessionStorage el ID del Paciente
            sessionStorage.setItem('idUsuarioPaciente', expediente.idUsuarioPaciente);
            (sessionStorage.getItem('idUsuarioPaciente'));

            // Se guarda en el sessionStorage el ID del Expediente
            sessionStorage.setItem('idExpediente', expediente.id);
            (sessionStorage.getItem('idExpediente'));

        });
    }


    
        var ca = new ControlActions();
        var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";

        const rol = localStorage.getItem('Rol');

        this.loadImagenesExamenes = function () {
            $('#carouselExampleControls').hide();

            $('.carousel-control-prev, .carousel-control-next').hide();
            // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
            var idExpedientePaciente = rol == "Paciente" ? localStorage.getItem('IdExpediente') : sessionStorage.getItem('idExpediente');

            var ca = new ControlActions();
            var serviceRoute = this.ApiServiceExamenesMedicos + "/RetrieveByExpedienteId?id=" + idExpedientePaciente;
            var carouselInner = $('.carousel-inner');
            var firstImage = true; // Bandera para rastrear si es la primera imagen

            $(".carousel-inner").empty();

            ca.GetToApi(serviceRoute, function (examenes) {
                examenes.forEach(function (examen) {
                    if (examen.imagenExamen != "") {
                        let avatarrequest = examen.imagenExamen;
                        $.ajax({
                            url: 'https://localhost:7081/Files/ImageExamen',
                            type: 'GET',
                            data: { fileName: avatarrequest },
                            success: function (response) {
                                var itemClass = firstImage ? 'carousel-item active' : 'carousel-item';
                                var imgElement = '<img class="d-block w-100" src="' + response.img + '">';

                                var buttonContainer = $('<div class="d-flex justify-content-center"></div>');
                                var buttonVer = '<button class="btn text-light btnVerExamen my-2" style="background-color: #0353A4;" data-img="' + response.img + '">Ver</button>';
                                var buttonEliminar = '<button class="btn text-light btnEliminarExamenImagen ms-2 my-2" style="background-color: #f27474;" data-id="' + examen.id + '">Eliminar</button>';

                                buttonContainer.append(buttonVer);
                                buttonContainer.append(buttonEliminar);

                                var carouselItem = $('<div class="' + itemClass + '"></div>');
                                carouselItem.append(imgElement);
                                carouselItem.append(buttonContainer);

                                carouselInner.append(carouselItem);

                                firstImage = false;
                                // Mostrar botones de navegación después de agregar todas las imágenes
                                $('#carouselExampleControls').show();
                                $('.carousel-control-prev, .carousel-control-next').show();
                            },
                            error: function (xhr, status, error) {
                                console.error('Error al obtener la imagen del examen:', error);
                            }
                        });
                    }
                });
            });

            // Delegar eventos click a los botones después de agregar todos los elementos
            carouselInner.on("click", ".btnVerExamen", function () {
                var imgSrc = $(this).data('img');
                $('#exampleModalCenter').find('.imgExamenMedico').attr('src', imgSrc);
                $('#exampleModalCenter').modal('show');
            });

            carouselInner.on("click", ".btnEliminarExamenImagen", function () {
                var $btnEliminar = $(this);

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Estás a punto de eliminar el examen. ¿Deseas continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#0353A4',
                    cancelButtonColor: '#f27474',
                    confirmButtonText: 'Sí, eliminar examen',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Llamar a la función para eliminar el examen
                        var idExamen = $btnEliminar.data("id");
                        var ec = new ExpedienteController();
                        ec.EliminarExamenImg(idExamen);
                        setTimeout(function () {
                            ocultarCard("PantallaExamenImagen");
                            mostrarCard("ExamenesMedicos");
                        }, 1000);
                    }
                });
            });
        }

        this.EliminarExamenImg = function (idExamen) {
            var ca = new ControlActions();
            var serviceRoute = this.ApiServiceExamenesMedicos + "/Delete";

            var examen = { id: idExamen };
            ca.DeleteToAPI(serviceRoute, examen, function () {
                // Eliminar el elemento del carrusel que corresponde al examen eliminado
                $("#carouselExampleControls").find(`[data-id="${examen.id}"]`).closest('.carousel-item').remove();
            });
        }

        // Carga los Exámenes Médicos
        this.LoadExamenesMedicos = function () {
            var ca = new ControlActions();

            const rol = localStorage.getItem('Rol');

            // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
            var idExpedientePaciente = rol == "Paciente" ? localStorage.getItem('IdExpediente') : sessionStorage.getItem('idExpediente');

            var serviceRoute = this.ApiServiceExamenesMedicos + "/RetrieveByExpedienteId?id=" + idExpedientePaciente;
            var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";
            var urlService = ca.GetUrlApiService(serviceRoute);

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

            if ($.fn.DataTable.isDataTable($('#tblNotasMedicas'))) {
                $('#tblNotasMedicas').DataTable().destroy();
            }

            var columns = [];

            columns[0] = { 'data': 'nombreDoctor' }
            columns[1] = { 'data': 'tipo' }
            columns[2] = { 'data': 'resultados' }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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


            // Inicializar la tabla como una DataTable
            $("#tblExamenesMedicos").dataTable({
                "ajax": {
                    "url": urlService,
                    "dataSrc": function (data) {
                        // Filtrar los datos para exámenes con examenImagen definido
                        return data.filter(function (examen) {
                            return examen.imagenExamen === "";
                        });
                    }
                },
                "columns": columns,
                "pageLength": 7,
                "lengthChange": false,
                "language": spanishLanguage
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblExamenesMedicos tbody').on('click', 'tr', function () {

                const rol = localStorage.getItem('Rol');

                // Extrae la fila a la que le dio click

                $('#tblExamenesMedicos tbody tr').removeClass('selected');
                $(this).addClass('selected');
                if (rol != "Paciente") {
                    $("#btnActualizarExamenesMedicos").show();
                    $("#btnEliminarExamenesMedicos").show();
                }
                
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var examenMedico = $('#tblExamenesMedicos').DataTable().row(row).data();

                var nombreCompleto = examenMedico.nombreDoctor + " " + examenMedico.apellidoUnoDoctor + " " + examenMedico.apellidoDosDoctor;

                $("#txtTipo").val(examenMedico.tipo);
                $("#txtResultado").val(examenMedico.resultados);
                $("#slctNombreDoctor").val(examenMedico.idUsuarioDoctor);
                $("#slctInterno").val(examenMedico.realizadoEnClinica);


                // Se guarda en el sessionStorage el ID del Paciente
                sessionStorage.setItem('idExamenMedico', examenMedico.id);
            });

            ca.GetToApi(urlServiceUsuario, function (usuarios) {
                var opcionesUsuario = {};

                usuarios.forEach(function (usuario) {
                    if (usuario.tipo == "Doctor") {
                        var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                        if (!opcionesUsuario[nombreCompleto]) {
                            $("#slctNombreDoctor").append('<option value="' + usuario.id + '">' + nombreCompleto + '</option>');
                            opcionesUsuario[nombreCompleto] = true;
                        }
                    }
                });
            });
        }

        // Carga las Notas Médicas

        this.LoadNotasMedicas = function () {
            var ca = new ControlActions();

            const rol = localStorage.getItem('Rol');

            // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
            var idExpedientePaciente = rol == "Paciente" ? localStorage.getItem('IdExpediente') : sessionStorage.getItem('idExpediente');

            var serviceRoute = this.ApiServiceNotasMedicas + "/RetrieveByExpedienteId?id=" + idExpedientePaciente;
            var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";
            var urlService = ca.GetUrlApiService(serviceRoute);

            if ($.fn.DataTable.isDataTable($('#tblNotasMedicas'))) {
                $('#tblNotasMedicas').DataTable().destroy();
            }

            var columns = [];

            columns[0] = { 'data': 'nombreDoctor' }
            columns[1] = { 'data': 'nota' }
            columns[2] = { 'data': 'id', visible: false }
            columns[3] = { 'data': 'idUsuarioDoctor', visible: false }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

            //inicializar la table como una data table
            $("#tblNotasMedicas").dataTable({

                "ajax": {
                    "url": urlService,
                    "dataSrc": ""
                },
                "columns": columns,
                pageLength: 7, // Mostrar solo 7 entradas por página
                lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
                language: spanishLanguage // Aplicar la configuración personalizada del idioma
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblNotasMedicas tbody').on('click', 'tr', function () {

                // Extrae la fila a la que le dio click

                $('#tblNotasMedicas tbody tr').removeClass('selected');
                $(this).addClass('selected');
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var notaMedica = $('#tblNotasMedicas').DataTable().row(row).data();

                $("#txtNotaMedica").val(notaMedica.nota);
                $("#slctNombreMedico").val(notaMedica.idUsuarioDoctor);


                // Se guarda en el sessionStorage el ID del Paciente
                sessionStorage.setItem('idNotaMedica', notaMedica.id);
            });

            ca.GetToApi(urlServiceUsuario, function (usuarios) {
                var opcionesUsuario = {};

                usuarios.forEach(function (usuario) {
                    if (usuario.tipo == "Doctor") {
                        var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                        if (!opcionesUsuario[nombreCompleto]) {
                            $("#slctNombreMedico").append('<option value="' + usuario.id + '">' + nombreCompleto + '</option>');
                            opcionesUsuario[nombreCompleto] = true;
                        }
                    }
                });
            });
        }

        // Carga las Notas de Enfermería

        this.LoadNotasEnfermeria = function () {
            var ca = new ControlActions();

            const rol = localStorage.getItem('Rol');

            // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
            var idExpedientePaciente = rol == "Paciente" ? localStorage.getItem('IdExpediente') : sessionStorage.getItem('idExpediente');

            var serviceRoute = this.ApiServiceNotasEnfermeria + "/RetrieveByExpedienteId?id=" + idExpedientePaciente;
            var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";
            var urlService = ca.GetUrlApiService(serviceRoute);

            if ($.fn.DataTable.isDataTable($('#tblNotasEnfermeria'))) {
                $('#tblNotasEnfermeria').DataTable().destroy();
            }

            var columns = [];

            columns[0] = { 'data': 'nombreEnfermero' }
            columns[1] = { 'data': 'nota' }
            columns[2] = { 'data': 'id', visible: false }
            columns[3] = { 'data': 'idUsuarioEnfermero', visible: false }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

            //inicializar la table como una data table
            $("#tblNotasEnfermeria").dataTable({

                "ajax": {
                    "url": urlService,
                    "dataSrc": ""
                },
                "columns": columns,
                pageLength: 7, // Mostrar solo 7 entradas por página
                lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
                language: spanishLanguage // Aplicar la configuración personalizada del idioma
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblNotasEnfermeria tbody').on('click', 'tr', function () {

                // Extrae la fila a la que le dio click

                $('#tblNotasEnfermeria tbody tr').removeClass('selected');
                $(this).addClass('selected');
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var notaEnfermeria = $('#tblNotasEnfermeria').DataTable().row(row).data();

                var nombreCompleto = notaEnfermeria.nombreEnfermero + " " + notaEnfermeria.apellidoUnoEnfermero + " " + notaEnfermeria.apellidoDosEnfermero;

                $("#txtNotaEnfermeria").val(notaEnfermeria.nota);
                $("#slctNombreEnfermero").val(notaEnfermeria.idUsuarioEnfermero);


                // Se guarda en el sessionStorage el ID del Paciente
                sessionStorage.setItem('idNotaEnfermeria', notaEnfermeria.id);



            });


            ca.GetToApi(urlServiceUsuario, function (usuarios) {
                var opcionesUsuario = {};

                usuarios.forEach(function (usuario) {
                    if (usuario.tipo == "Enfermero") {
                        var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                        if (!opcionesUsuario[nombreCompleto]) {
                            $("#slctNombreEnfermero").append('<option value="' + usuario.id + '">' + nombreCompleto + '</option>');
                            opcionesUsuario[nombreCompleto] = true;
                        }
                    }
                });
            });
        }

        // Carga el Registro de Citas

        this.LoadRegistroCitas = function () {
            var ca = new ControlActions();

            const rol = localStorage.getItem('Rol');

            // Si el usuario que está conectado es un paciente, utiliza directamente su ID de usuario
            var idExpedientePaciente = rol == "Paciente" ? localStorage.getItem('IdExpediente') : sessionStorage.getItem('idExpediente');

            var serviceRoute = this.ApiServiceRegistroCitas + "/RetrieveByExpedienteId?id=" + idExpedientePaciente;
            var urlService = ca.GetUrlApiService(serviceRoute);

            if ($.fn.DataTable.isDataTable($('#tblRegistroCitas'))) {
                $('#tblRegistroCitas').DataTable().destroy();
            }

            var columns = [];

            //columns[0] = { 'data': 'nombreDoctor' }

            columns[0] = {
                'data': null,
                'render': function (data, type, row) {
                    return data.nombreDoctor + " " + data.apellidoUnoDoctor + " " + data.apellidoDosDoctor;
                }
            };
            columns[1] = { 'data': 'nombreSede' }
            columns[2] = { 'data': 'especialidad' }
            columns[3] = { 'data': 'horaCupo' }
            columns[4] = { 'data': 'id', visible: false }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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


            //inicializar la table como una data table
            $("#tblRegistroCitas").dataTable({

                "ajax": {
                    "url": urlService,
                    "dataSrc": ""
                },
                "columns": columns,
                pageLength: 7, // Mostrar solo 7 entradas por página
                lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
                language: spanishLanguage // Aplicar la configuración personalizada del idioma
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblRegistroCitas tbody').on('click', 'tr', function () {

                // Extrae la fila a la que le dio click

                $('#tblRegistroCitas tbody tr').removeClass('selected');
                $(this).addClass('selected');
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var registroCita = $('#tblRegistroCitas').DataTable().row(row).data();

                var nombreCompleto = registroCita.nombreDoctor + " " + registroCita.apellidoUnoDoctor + " " + registroCita.apellidoDosDoctor;
                var fechaCita = new Date(registroCita.horaCupo); // Convierte la horaCupo en Hora
                var formattedFechaCita = fechaCita.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) + " " + fechaCita.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true, hourCycle: 'h24' }); // Variable que le da formato a la fecha

                $("#txtNombreDoctor").val(nombreCompleto);
                $("#txtNombreSede").val(registroCita.nombreSede);
                $("#txtEspecialidad").val(registroCita.especialidad);
                $("#txtFechaCita").val(formattedFechaCita);


                // Se guarda en el sessionStorage el ID del Paciente
                sessionStorage.setItem('idCita', registroCita.id);
            });
        }

        // Carga los diagnósticos

        this.LoadDiagnosticos = function () {
            var ca = new ControlActions();

            var serviceRoute = this.ApiServiceDiagnosticos + "/RetrieveByCitaId?id=" + sessionStorage.getItem('idCita');
            var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";
            var urlService = ca.GetUrlApiService(serviceRoute);

            if ($.fn.DataTable.isDataTable($('#tblDiagnosticos'))) {
                $('#tblDiagnosticos').DataTable().destroy();
            }

            var columns = [];

            columns[0] = {
                'data': null,
                'render': function (data, type, row) {
                    return data.nombreDoctor + " " + data.apellidoUnoDoctor + " " + data.apellidoDosDoctor;
                }
            };

            columns[1] = { 'data': 'nombre' }
            columns[2] = { 'data': 'descripcion' }
            columns[3] = { 'data': 'fechaDiagnostico' }
            columns[4] = { 'data': 'idCita', visible: false }
            columns[5] = { 'data': 'idUsuarioDoctor', visible: false }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

            //inicializar la table como una data table
            $("#tblDiagnosticos").dataTable({

                "ajax": {
                    "url": urlService,
                    "dataSrc": ""
                },
                "columns": columns,
                pageLength: 7, // Mostrar solo 7 entradas por página
                lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
                language: spanishLanguage // Aplicar la configuración personalizada del idioma
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblDiagnosticos tbody').on('click', 'tr', function () {

                // Extrae la fila a la que le dio click

                $('#tblDiagnosticos tbody tr').removeClass('selected');
                $(this).addClass('selected');
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var diagnostico = $('#tblDiagnosticos').DataTable().row(row).data();

                var fechaCita = new Date(diagnostico.fechaDiagnostico); // Convierte la horaCupo en Hora

                // Extrae la fecha en formato yyyy-MM-dd
                var formattedFechaCita = fechaCita.toISOString().split('T')[0];

                $("#slctNombreDoctorDiag").val(diagnostico.idUsuarioDoctor);
                $("#txtNombreDiagnostico").val(diagnostico.nombre);
                $("#txtDescripcion").val(diagnostico.descripcion);
                $("#txtFechaDiagnostico").val(formattedFechaCita);


                // Se guarda en el sessionStorage el ID del diagnóstico y la cita
                sessionStorage.setItem('idDiagnostico', diagnostico.id);
                sessionStorage.setItem('idDoctor', diagnostico.idUsuarioDoctor);


            });


            ca.GetToApi(urlServiceUsuario, function (usuarios) {
                var opcionesUsuario = {};

                usuarios.forEach(function (usuario) {
                    if (usuario.tipo == "Doctor") {
                        var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                        if (!opcionesUsuario[nombreCompleto]) {
                            $("#slctNombreDoctorDiag").append('<option value="' + usuario.id + '">' + nombreCompleto + '</option>');
                            opcionesUsuario[nombreCompleto] = true;
                        }
                    }
                });
            });
        }

        // Carga las Recetas

        this.LoadRecetas = function () {
            var ca = new ControlActions();

            var serviceRoute = this.ApiServiceRecetas + "/RetrieveByCitaId?id=" + sessionStorage.getItem('idCita');
            var urlServiceUsuario = this.ApiServiceUsuario + "/RetrieveAllTipo";
            var urlService = ca.GetUrlApiService(serviceRoute);

            if ($.fn.DataTable.isDataTable($('#tblRecetas'))) {
                $('#tblRecetas').DataTable().destroy();
            }

            var columns = [];

            columns[0] = {
                'data': null,
                'render': function (data, type, row) {
                    return data.nombreDoctor + " " + data.apellidoUnoDoctor + " " + data.apellidoDosDoctor;
                }
            };

            columns[1] = { 'data': 'medicamento' }
            columns[2] = { 'data': 'dosificacion' }
            columns[3] = { 'data': 'indicaciones' }
            columns[4] = { 'data': 'emision' }
            columns[5] = { 'data': 'imagenReceta', visible: false }

            var spanishLanguage = {
                "decimal": "",
                "emptyTable": "No hay datos disponibles en la tabla",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
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

            //inicializar la table como una data table
            $("#tblRecetas").dataTable({

                "ajax": {
                    "url": urlService,
                    "dataSrc": ""
                },
                "columns": columns,
                pageLength: 7, // Mostrar solo 7 entradas por página
                lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de entradas por página
                language: spanishLanguage // Aplicar la configuración personalizada del idioma
            });

            // Asignacion de evento al click de la fila de la tabla
            $('#tblRecetas tbody').on('click', 'tr', function () {

                // Extrae la fila a la que le dio click

                $('#tblRecetas tbody tr').removeClass('selected');
                $(this).addClass('selected');
                var row = $(this).closest('tr');

                // Extraer la data del registro contenido en la fila
                var receta = $('#tblRecetas').DataTable().row(row).data();

                var fechaEmision = new Date(receta.emision); // Convierte la horaCupo en Hora

                // Variable que asigna el nombre completo del doctor para buscarlo en el select
                var nombreCompletoDoctor = receta.nombreDoctor + " " + receta.apellidoUnoDoctor + " " + receta.apellidoDosDoctor;

                // Buscar el nombre del doctor seleccionado y toma su valor
                var doctor = $("#slctNombreDoctorRec").find("option").filter(function () {
                    return $(this).text() === nombreCompletoDoctor;
                });

                // Extrae la fecha en formato yyyy-MM-dd
                var formattedFechaEmision = fechaEmision.toISOString().split('T')[0];

                $("#slctNombreDoctorRec").val(doctor.val());
                $("#txtMedicamento").val(receta.medicamento);
                $("#txtDosificacion").val(receta.dosificacion);
                $("#txtIndicaciones").val(receta.indicaciones);
                $("#txtEmision").val(formattedFechaEmision);


                // Se guarda en el sessionStorage el ID del diagnóstico y la cita
                sessionStorage.setItem('idReceta', receta.id);


            });


            ca.GetToApi(urlServiceUsuario, function (usuarios) {
                var opcionesUsuario = {};

                usuarios.forEach(function (usuario) {
                    if (usuario.tipo == "Doctor") {
                        var nombreCompleto = usuario.nombre + " " + usuario.apellidoUno + " " + usuario.apellidoDos;
                        if (!opcionesUsuario[nombreCompleto]) {
                            $("#slctNombreDoctorRec").append('<option value="' + usuario.id + '">' + nombreCompleto + '</option>');
                            opcionesUsuario[nombreCompleto] = true;
                        }
                    }
                });
            });
        }

    }


    //Instanciamiento de la clase
$(document).ready(function () {
    var vc = new ExpedienteController();
    vc.InitView();
})