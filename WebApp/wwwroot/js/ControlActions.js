
function ControlActions() {
	//Ruta base del API
	this.URL_API = "https://localhost:7081/api/";

	this.GetUrlApiService = function (service) {
		return this.URL_API + service;
	}

	this.GetTableColumsDataName = function (tableId) {
		var val = $('#' + tableId).attr("ColumnsDataName");

		return val;
	}

	this.FillTable = function (service, tableId, refresh) {

		if (!refresh) {
			columns = this.GetTableColumsDataName(tableId).split(',');
			var arrayColumnsData = [];


			$.each(columns, function (index, value) {
				var obj = {};
				obj.data = value;
				arrayColumnsData.push(obj);
			});
			//Esto es la inicializacion de la tabla de data tables segun la documentacion de 
			// datatables.net, carga la data usando un request async al API
			$('#' + tableId).DataTable({
				"processing": true,
				"ajax": {
					"url": this.GetUrlApiService(service),
					dataSrc: ''
				},
				"columns": arrayColumnsData
			});
		} else {
			//RECARGA LA TABLA
			$('#' + tableId).DataTable().ajax.reload();
		}

	}

	this.GetSelectedRow = function () {
		var data = sessionStorage.getItem(tableId + '_selected');

		return data;
	};

	this.BindFields = function (formId, data) {
		console.log(data);
		$('#' + formId + ' *').filter(':input').each(function (input) {
			var columnDataName = $(this).attr("ColumnDataName");
			this.value = data[columnDataName];
		});
	}

	this.GetDataForm = function (formId) {
		var data = {};

		$('#' + formId + ' *').filter(':input').each(function (input) {
			var columnDataName = $(this).attr("ColumnDataName");
			data[columnDataName] = this.value;
		});

		console.log(data);
		return data;
	}


	/* ACCIONES VIA AJAX, O ACCIONES ASINCRONAS*/

	this.PostToAPI = function (service, data, callBackFunction) {
		$.ajax({
			type: "POST",
			url: this.GetUrlApiService(service),
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data) {
				if (callBackFunction) {
					Swal.fire(
						'¡Bien hecho!',
						'¡Transacción completada!',
						'success'
					)
					callBackFunction(data);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {

				var responseJson = jqXHR.responseJSON;
				var message = jqXHR.responseText;

				if (responseJson) {
					var errors = responseJson.errors;
					var errorMessages = Object.values(errors).flat();
					message = errorMessages.join("<br/> ");
				}
				Swal.fire({
					icon: 'error',
					title: '¡Ups!',
					html: message,
					footer: 'UCenfotec'
				});
			}
		});
	};

	this.PostToAPIRange = function (service, dataArray, callBackFunction) {
		// Variable para almacenar errores
		var errorMessage = '';

		// Iterar sobre cada elemento del arreglo de datos
		var requests = dataArray.map(function (data) {
			return $.ajax({
				type: "POST",
				url: this.GetUrlApiService(service),
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				dataType: "json"
			});
		}, this); // Pasar 'this' como contexto para que sea accesible dentro de la función de iteración

		// Realizar todas las solicitudes en paralelo
		$.when.apply($, requests)
			.done(function () {
				// Todas las solicitudes se completaron con éxito
				Swal.fire(
					'¡Buen trabajo!',
					'¡Todas las transacciones están completadas!',
					'success'
				);
				if (callBackFunction) {
					callBackFunction(arguments); // Llamar a la función de devolución de llamada
				}
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				// Al menos una solicitud falló
				var responseJson = jqXHR.responseJSON;
				var message = jqXHR.responseText;

				if (responseJson) {
					var errors = responseJson.errors;
					var errorMessages = Object.values(errors).flat();
					errorMessage += errorMessages.join("<br/> ");
				} else {
					errorMessage += message;
				}
				// Cancelar todas las solicitudes restantes
				requests.forEach(function (request) {
					request.abort();
				});

				// Mostrar el mensaje de error
				Swal.fire({
					icon: 'error',
					title: '¡Ups!',
					html: errorMessage,
					footer: 'UCenfotec'
				});
			});
	};


	this.PutToAPI = function (service, data, callBackFunction) {
		var jqxhr = $.put(this.GetUrlApiService(service), data, function (response) {
			var ctrlActions = new ControlActions();

			Swal.fire(
				'¡Bien hecho!',
				'¡Transacción completada!',
				'success'
			)

			if (callBackFunction) {
				callBackFunction(response);
			}

		})
			.fail(function (response) {
				var data = response.responseJSON;
				var errors = data.errors;
				var errorMessages = Object.values(errors).flat();
				message = errorMessages.join("<br/> ");
				Swal.fire({
					icon: 'error',
					title: '¡Ups!',
					html: message,
					footer: 'UCenfotec'
				})
			});
	};

	this.DeleteToAPI = function (service, data, callBackFunction) {
		var jqxhr = $.delete(this.GetUrlApiService(service), data, function (response) {
			var ctrlActions = new ControlActions();
			Swal.fire(
				'¡Bien hecho!',
				'¡Transacción completada!',
				'success'
			)

			if (callBackFunction) {
				callBackFunction(response);
			}
		})
			.fail(function (response) {
				var data = response.responseJSON;
				var errors = data.errors;
				var errorMessages = Object.values(errors).flat();
				message = errorMessages.join("<br/> ");
				Swal.fire({
					icon: 'error',
					title: '¡Ups!',
					html: message,
					footer: 'UCenfotec'
				})
			});
	};

	this.GetToApi = function (service, callBackFunction) {
		var jqxhr = $.get(this.GetUrlApiService(service), function (response) {
			// console.log("Response " + response);
			if (callBackFunction) {
				callBackFunction(response);
			}

		});
	};
};

//Custom jquery actions
$.put = function (url, data, callback) {
	if ($.isFunction(data)) {
		type = type || callback,
			callback = data,
			data = {}
	}
	return $.ajax({
		url: url,
		type: 'PUT',
		success: callback,
		data: JSON.stringify(data),
		contentType: 'application/json'
	});
};

$.delete = function (url, data, callback) {
	if ($.isFunction(data)) {
		type = type || callback,
			callback = data,
			data = {}
	}
	return $.ajax({
		url: url,
		type: 'DELETE',
		success: callback,
		data: JSON.stringify(data),
		contentType: 'application/json'
	});
};