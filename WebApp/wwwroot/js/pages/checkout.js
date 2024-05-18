let idcupo = document.getElementById('idcupo').value;
let idcita = document.getElementById('idcita').value;
let idimpuesto = document.getElementById('idimpuesto').value;
let total = document.getElementById('total').value;

let paypal_buttons = paypal.Buttons({
    createOrder() {



        return fetch("https://localhost:7081/Checkout/CreateOrder", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                Total: total,
                idcupo: idcupo,
                idcita: idcita,
            })
        })
            .then((response) => response.json())
            .then((order) => order.id)
    },


        onApprove(data) {
        paypal_buttons.close();
            return fetch("https://localhost:7081/Checkout/CompleteOrder", {
                method: "POST",
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderID: data.orderID,

                idcupo: idcupo,
                total: total,
                idcita: idcita,

                idimpuesto: idimpuesto,
            })
        })
            .then((response) => response.json())
            .then((details) => {
                if (details.success) {
                    document.getElementById("notificacion-container").innerHTML =
                        '<div class="alert alert-success" role="alert">Created successfully!</div>'
                    window.location.href = '/MisCitas';
                }
                else {
                    document.getElementById("notificacion-container").innerHTML =
                        '<div class="alert alert-danger" role="alert">Failed!</div>'
                }
            });
    },

        onCancel(data) {
            document.getElementById("notificacion-container").innerHTML =
            '<div class="alert alert-danger" role="alert">Order Canceled!</div>'

        return fetch("/Checkout?handler=CancelOrder", {
            method: "POST",
            body: JSON.stringify({
                orderID: data.orderID
            })
        })
    },

    onError(err) {
           
        document.getElementById("notificacion-container").innerHTML =
            '<div class="alert alert-danger" role="alert">Failed to create the order!</div>'
    }
});

paypal_buttons.render("#paypal-button-container");

