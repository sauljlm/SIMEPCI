 using Microsoft.AspNetCore.Mvc;
using DTOs.Security;
using Microsoft.Extensions.Options;
using CoreApp.Authorization.General;
using Microsoft.AspNetCore.Authorization;
using OtpNet;
using System.Net.Mail;
using System.Net;
using webapi.Authorization.General;
using DTOs;
using System.Text.Json.Nodes;
using CoreApp;
using static System.Runtime.InteropServices.JavaScript.JSType;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("Checkout")]
    [ApiController]
    public class CheckOutController : ControllerBase
    {
        private readonly AppSettings _applicationSettings;

        public CheckOutController(IOptions<AppSettings> _applicationSettings)
        {
            this._applicationSettings = _applicationSettings.Value;

        }



        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] Checkout checkout)
        {
            try
            {
                JsonObject createOrderRequest = new JsonObject();

                createOrderRequest.Add("intent", "CAPTURE");
                JsonObject amount = new JsonObject();
                amount.Add("currency_code", "USD");
                amount.Add("value", checkout.Total);
                JsonObject purchaseUnit1 = new JsonObject();
                purchaseUnit1.Add("amount", amount);
                JsonArray purchaseUnits = new JsonArray();
                purchaseUnits.Add(purchaseUnit1);

                createOrderRequest.Add("purchase_units", purchaseUnits);
                CheckoutManager checkoutManager = new CheckoutManager();

                string accessToken = checkoutManager.GetPaypalAccessToken("https://api-m.sandbox.paypal.com", "AfXs4aJNuC6TdeFz3G6Srvch2I70XM2TnHj0_LW7wz63yMKeZ7sDiYdZjIj1BI0KtIPuPUnOiuLFuP15", "EIUVYLkF4ZA5_SLNIIOTCNsJyRfeNbdNJXBtsweE_AoocTGYjVXhmcVDhHTFovoaG_OU41HjR-tcigy4");

                string url = "https://api-m.sandbox.paypal.com/v2/checkout/orders";

                string orderId = "";

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);


                    var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
                    requestMessage.Content = new StringContent(createOrderRequest.ToString(), null, "application/json");

                    var responseTask = client.SendAsync(requestMessage);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsStreamAsync();
                        readTask.Wait();

                        var strResponse = readTask.Result;
                        var jsonResponse = JsonNode.Parse(strResponse);
                        if (jsonResponse != null)
                        {
                            orderId = jsonResponse["id"]?.ToString() ?? "";
                        }
                    }
                }

                var response = new
                {
                    Id = orderId
                };


                return Ok(response);
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex);
            }


        }

        [HttpPost("CompleteOrder")]
        public async Task<IActionResult> CompleteOrder([FromBody] JsonObject data)
        {
            try
            {
                if (data == null || data["orderID"] == null) return new JsonResult("");

                var orderID = data["orderID"]!.ToString();
                CheckoutManager checkoutManager = new CheckoutManager();
                string accessToken = checkoutManager.GetPaypalAccessToken("https://api-m.sandbox.paypal.com", "AfXs4aJNuC6TdeFz3G6Srvch2I70XM2TnHj0_LW7wz63yMKeZ7sDiYdZjIj1BI0KtIPuPUnOiuLFuP15", "EIUVYLkF4ZA5_SLNIIOTCNsJyRfeNbdNJXBtsweE_AoocTGYjVXhmcVDhHTFovoaG_OU41HjR-tcigy4");

                string url = "https://api-m.sandbox.paypal.com/v2/checkout/orders/"+orderID+"/capture";

                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);


                    var requestMessage = new HttpRequestMessage(HttpMethod.Post, url);
                    requestMessage.Content = new StringContent("", null, "application/json");

                    var responseTask = client.SendAsync(requestMessage);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsStreamAsync();
                        readTask.Wait();

                        var strResponse = readTask.Result;
                        var jsonResponse = JsonNode.Parse(strResponse);
                        if (jsonResponse != null)
                        {
                            string paypalOrderStatus = jsonResponse["status"]?.ToString() ?? "";

                            if(paypalOrderStatus == "COMPLETED")
                            {
                                var dc = new DisponibilidadCupoManager();
                                var dcita = new CitaManager();
                                var dimp = new ImpuestoManager();
                                var idcupo = data["idcupo"]!.ToString();
                                int idC = int.Parse(idcupo);
                                dc.UpdatePago(idC);


                                var idcita= data["idcita"]!.ToString();
                                int idcitaint = int.Parse(idcita);

                                var total = data["total"]!.ToString();
                                decimal totalint = decimal.Parse(total);

                                var idimpuesto = data["idimpuesto"]!.ToString();
                                int idimpuestoint = int.Parse(idimpuesto);

                                Impuesto impuesto = dimp.RetrieveImpuestoById(idimpuestoint);

                                decimal precioBruto = totalint / (1 + (impuesto.porcentaje / 100));
                                Factura factura = new Factura()
                                {
                                    IdCita = idcitaint,
                                    IdImpuesto = idimpuestoint,
                                    FechaPago = DateTime.Now,
                                    TipoPago = "PAYPAL",
                                    MontoBase = precioBruto,
                                    MontoTotal =totalint,
                                };

                                dcita.CreatePago(factura);


                                return Ok(new
                                {
                                    success = true,
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    success = false,
                });
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }


        }

    }
}
