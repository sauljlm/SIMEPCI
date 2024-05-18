function calculateAverageOpinions(Opiniones) {
    var totalOpinions = Opiniones.length;

    var sumOpinionData = {
        trato: 0,
        cortesia: 0,
        infraestructura: 0,
        tiempoEspera: 0,
        satisfaccionTratamiento: 0,
        calificacionGeneral: 0
    };

    for (const Opinion of Opiniones) {
        sumOpinionData.trato += Opinion.trato;
        sumOpinionData.cortesia += Opinion.cortesia;
        sumOpinionData.infraestructura += Opinion.infraestructura;
        sumOpinionData.tiempoEspera += Opinion.tiempoEspera;
        sumOpinionData.satisfaccionTratamiento += Opinion.satisfaccionTratamiento;
        sumOpinionData.calificacionGeneral += Opinion.calificacionGeneral;
    }

    var averageOpinionData = {
        trato: (sumOpinionData.trato / totalOpinions).toFixed(1),
        cortesia: (sumOpinionData.cortesia / totalOpinions).toFixed(1),
        infraestructura: (sumOpinionData.infraestructura / totalOpinions).toFixed(1),
        tiempoEspera: (sumOpinionData.tiempoEspera / totalOpinions).toFixed(1),
        satisfaccionTratamiento: (sumOpinionData.satisfaccionTratamiento / totalOpinions).toFixed(1),
        calificacionGeneral: (sumOpinionData.calificacionGeneral / totalOpinions).toFixed(1)
    };

    return averageOpinionData;
}


function formatDate(fechaISO) {
    // Crear un objeto Date a partir del formato ISO 8601
    var fecha = new Date(fechaISO);

    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por lo que se suma 1
    var anio = fecha.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }

    return dia + '/' + mes + '/' + anio;
}

function ReporteCalidadController() {
    this.ViewName = "ReporteCalidad";
    this.ApiService = "Reporte";

    this.InitView = function () {
        this.LoadServices();
        this.LoadOpinions("");
    };

    this.LoadServices = async () => {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAllCalidadServicio";

        ca.GetToApi(serviceRoute, async function (Opiniones) {
            if (Opiniones && Array.isArray(Opiniones)) {

                var servicios = new Set();

                for (const Opinion of Opiniones) {
                    servicios.add(Opinion.servicio);
                }

                servicios = Array.from(servicios);
                servicios.forEach(function (servicio) {
                    $("#select-service").append(`<option value="${servicio}">${servicio}</option>`);
                });
            } else {
                console.error("Error: La respuesta del servidor no contiene datos válidos.");
            }
        });
    }

    this.buildProgressBar = function (reporte, $cardBody) {
        // Barras de progreso para las calificaciones
        var $progressContainer = $("<div>").addClass("mb-5").appendTo($cardBody);
        var calificaciones = {
            "Trato": reporte.trato,
            "Cortesía": reporte.cortesia,
            "Infraestructura": reporte.infraestructura,
            "Tiempo de Espera": reporte.tiempoEspera,
            "Satisfacción del Tratamiento": reporte.satisfaccionTratamiento,
            "Calificación General": reporte.calificacionGeneral
        };
        Object.keys(calificaciones).forEach(function (key) {
            var $progressBarBox = $("<div>").appendTo($progressContainer);
            var $progressBar = $("<div>").addClass("progress mb-3").appendTo($progressBarBox);
            $("<span>").addClass("progress-text font-weight-bold").text(key).prependTo($progressBarBox);
            $("<div>").addClass("progress-bar bg-primary").attr("role", "progressbar").attr("aria-valuenow", calificaciones[key]).attr("aria-valuemin", "0").attr("aria-valuemax", "5").css("width", (calificaciones[key] / 5 * 100) + "%").text(calificaciones[key]).appendTo($progressBar);
        });
    }

    this.buildGeneralSection = function (Opiniones) {
        var opinionAverageData = calculateAverageOpinions(Opiniones);

        this.buildProgressBar(opinionAverageData, "#reportes-container");
    }

    this.buildOpinion = function(reporte) {
        var $reporteContainer = $("<div>").addClass("card p-5 m-3").appendTo("#reportes-container");
        var $cardBody = $("<div>").addClass("card-body").appendTo($reporteContainer);

        var fechaVisita = formatDate(reporte.fechaVisita);

        $("<h3>").addClass("card-title text-primary").text("Reporte de Opinión de Servicio").appendTo($cardBody);
        $("<p>").addClass("card-text").html("<b>Nombre del Paciente:</b> " + reporte.nombre).appendTo($cardBody);
        $("<p>").addClass("card-text").html("<b>Especialidad Médica:</b> " + reporte.servicio).appendTo($cardBody);
        $("<p>").addClass("card-text").html("<b>Fecha de Visita:</b> " + fechaVisita).appendTo($cardBody);

        this.buildProgressBar(reporte, $cardBody);

        $("<p>").addClass("card-text").html("<b>Sugerencias:</b> " + reporte.sugerencias).appendTo($cardBody);
    }

    this.GetUserName = function (idUser) {
        return new Promise(function (resolve, reject) {
            var ca = new ControlActions();
            var serviceRoute = "Usuario/RetrieveById/" + idUser;

            ca.GetToApi(serviceRoute, function (Usuario) {
                if (Usuario) {
                    resolve(Usuario.nombre);
                } else {
                    reject("Error: La respuesta del servidor no contiene datos válidos.");
                }
            });
        });
    };

    this.LoadOpinions = async (filter) => {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAllCalidadServicio";
        var self = this; // Almacenar una referencia al objeto

        ca.GetToApi(serviceRoute, async function (Opiniones) {
            if (Opiniones && Array.isArray(Opiniones)) {

                var generalOpinionList = [];

                for (const Opinion of Opiniones) {

                    if (filter == "" || filter == Opinion.servicio) {
                        var opinionData = {
                            id: Opinion.id,
                            idUsuario: Opinion.idUsuario,
                            nombre: "",
                            fechaVisita: Opinion.fechaVisita,
                            servicio: Opinion.servicio,
                            trato: Opinion.trato,
                            cortesia: Opinion.cortesia,
                            infraestructura: Opinion.infraestructura,
                            tiempoEspera: Opinion.tiempoEspera,
                            satisfaccionTratamiento: Opinion.satisfaccionTratamiento,
                            sugerencias: Opinion.sugerencias,
                            calificacionGeneral: Opinion.calificacionGeneral
                        };

                        try {
                            opinionData.nombre = await self.GetUserName(Opinion.idUsuario);
                        } catch (error) {
                            console.error(error);
                        }

                        generalOpinionList.push(opinionData);
                    }
                }

                self.buildGeneralSection(generalOpinionList);
                for (const opinion of generalOpinionList) {
                    self.buildOpinion(opinion);
                }

            } else {
                console.error("Error: La respuesta del servidor no contiene datos válidos.");
            }
        });
    };
}

$(document).ready(function () {
    var rc = new ReporteCalidadController();
    rc.InitView();

    $("#select-service").change(function () {
        $("#reportes-container").empty();
        var selectedService = $(this).val();
        rc.LoadOpinions(selectedService);
    });
});
