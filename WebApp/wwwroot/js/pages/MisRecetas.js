function MisRecetasController() {
    this.ViewName = "MisRecetas";
    this.ApiService = "Receta";

    this.InitView = function () {
        this.RetrieveMisCitas();
    }

    this.RetrieveMisCitas = function () {
        var ca = new ControlActions();
        var serviceRoute = this.ApiService + "/RetrieveAll";

        $("#misRecetas").empty();


        ca.GetToApi(serviceRoute, function (respuesta) {
            var recetas = respuesta;

            if (recetas != null) {
                recetas.sort((a, b) => new Date(b.emision) - new Date(a.emision));

                recetas.forEach(function (receta) {
                    if (receta.idExpediente == localStorage.getItem('IdExpediente')) {
                        // Obtener la fecha de emisión en el formato deseado (solo la fecha)
                        var fechaEmision = new Date(receta.emision); // Convertir la cadena a un objeto Date
                        var fechaFormateada = fechaEmision.toLocaleDateString('es-ES'); // Formatear la fecha a un formato local (español en este caso)

                        if (receta.imagenReceta == "") {
                            // Mostrar información de la receta sin imagen
                            var recetaManual =
                                '<div class="col-md-4 mb-4">' +
                                '<div class="card rounded-3 border-2" style="border-color: #0353A4; height: 100%;">' +
                                '<div class="card-body">' +
                                '<h5 class="card-title" style="color: #0353A4;">Asigna Dr(a). ' + receta.nombreDoctor + '</h5>' +
                                '<p class="card-text" style="color: #6b757d;">' +
                                "Medicamento: " + receta.medicamento + '<br>' +
                                "Dosificación: " + receta.dosificacion + '<br>' +
                                "Indicaciones: " + receta.indicaciones + '<br>' +
                                "Sede: " + receta.nombreSede + '<br>' +
                                "Doctor: " + receta.nombreDoctor + " " + receta.apellidoUnoDoctor + " " + receta.apellidoDosDoctor + '<br>' +
                                "Emisión: " + fechaFormateada + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            $("#misRecetas").append(recetaManual);

                        } else {
                            // Obtener la imagen de la receta
                            let avatarrequest = receta.imagenReceta;

                            $.ajax({
                                url: 'https://localhost:7081/Files/ImageReceta',
                                type: 'GET',
                                data: { fileName: avatarrequest },
                                success: function (response) {
                                    // Crear el elemento <div> que contiene la tarjeta de receta con la imagen
                                    var recetaImagen =
                                        '<div class="col-md-4 mb-4">' +
                                        '<div class="card rounded-3 border-2" style="border-color: #0353A4; height: 100%;">' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title" style="color: #0353A4;">Asigna Dr(a). ' + receta.nombreDoctor + '</h5>' +
                                        '<img class="image-container" src="' + response.img + '" style="width:100%; height:150px; object-fit: cover;">' +
                                        '<button class="btn mx-auto d-block w-50 text-light btnVerReceta" ' +
                                        'style="background-color: #0353A4;" data-img="' + response.img + '">Ver</button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';

                                    // Agregar el elemento al contenedor con id="misRecetas"
                                    $("#misRecetas").append(recetaImagen);
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error al obtener la imagen de la receta:', error);
                                }
                            });
                        }
                    }
                });

                // Asignar el controlador de eventos click después de agregar todos los elementos
                $("#misRecetas").on("click", ".btnVerReceta", function () {
                    var imgSrc = $(this).data('img');
                    $('#exampleModalCenter').find('.imgRecetaMedica').attr('src', imgSrc);
                    $('#exampleModalCenter').modal('show');
                });
            }
        });
    }
}

$(document).ready(function () {
    var vc = new MisRecetasController();
    vc.InitView();
});
