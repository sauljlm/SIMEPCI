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

function ReporteFinancieroController() {
    this.ViewName = "ReporteFinanciero";
    this.ApiService = "Reporte";

    this.InitView = function () {
        this.LoadReports();
    };

    this.buildReportes = function (reportes) {

        for (const reporte of reportes) {
            var $reporteContainer = $("<div>").addClass("card p-5 m-3").appendTo("#reportes-container");
            var $cardBody = $("<div>").addClass("card-body").appendTo($reporteContainer);

            $("<h3>").addClass("card-title text-primary").text(reporte.nombreServicio).appendTo($cardBody);
            $("<p>").addClass("card-text").html("<b>Ingresos generados por el servicio:</b></br> $" + reporte.ingresosServicio).appendTo($cardBody);
            $("<p>").addClass("card-text").html("<b>Costos asociados:</b></br> $ " + reporte.costosAsociados).appendTo($cardBody);
            $("<p>").addClass("card-text").html("<b>Ganancias netas:</b></br> $ " + reporte.gananciasNetas).appendTo($cardBody);
        }
    }
    
    this.GetService = function (idCita) {
        return new Promise(function (resolve, reject) {
            var ca = new ControlActions();
            var serviceRoute = "Reporte/RetrieveServicioByIdCita/" + idCita;

            ca.GetToApi(serviceRoute, function (Servicio) {
                if (Servicio) {
                    resolve(Servicio);
                } else {
                    reject("Error: La respuesta del servidor no contiene datos válidos.");
                }
            });
        });
    };

    this.LoadReports = async () => {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAllReporteFinanciero";
        var self = this; // Almacenar una referencia al objeto

        ca.GetToApi(serviceRoute, async function (Reportes) {
            if (Reportes && Array.isArray(Reportes)) {


                var listaReportes = [];

                for (const Reporte of Reportes) {
                    var nombreServicio = await self.GetService(Reporte.idCita);
                    var existeReporte = listaReportes.find(itemReporte => itemReporte.nombreServicio === nombreServicio);

                    if (existeReporte) {
                        existeReporte.ingresosServicio += (Reporte.montoTotal);
                        existeReporte.costosAsociados += (Reporte.montoBase * 0.13);
                        existeReporte.gananciasNetas += (Reporte.montoTotal - Reporte.montoBase * 0.13);
                    } else {
                        var reporteData = {
                            nombreServicio: nombreServicio,
                            ingresosServicio: (Reporte.montoTotal),
                            costosAsociados: (Reporte.montoBase * 0.13),
                            gananciasNetas: (Reporte.montoTotal - Reporte.montoBase * 0.13)
                        }
                        listaReportes.push(reporteData);
                    }
                }

                self.buildReportes(listaReportes)

            } else {
                console.error("Error: La respuesta del servidor no contiene datos válidos.");
            }
        });
    };
}

$(document).ready(function () {
    var vc = new ReporteFinancieroController();
    vc.InitView();
});
