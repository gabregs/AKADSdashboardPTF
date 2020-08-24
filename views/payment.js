document.getElementById("submitbutton").addEventListener("click", () => {
    var data = JSON.stringify({
        "data": {
          "attributes": {
            "details": {
              "card_number": document.getElementById("card_number").value,
              "exp_month": document.getElementById("exp_month").value,
              "exp_year": document.getElementById("exp_year").value,
              "cvc": document.getElementById("cvc").value
            },
            "billing": {
              "address": {
                "line1": document.getElementById("line1").value,
                "line2": document.getElementById("line2").value,
                "city": document.getElementById("city").value,
                "state": "National Capital Region",
                "postal_code": document.getElementById("postal_code").value,
                "country": "PH"
              },
              "name": document.getElementById("name").value,
              "email": document.getElementById("email").value,
              "phone": document.getElementById("phone").value
            },
            "type": "card"
          }
        }
      });
      
      var xhr = new XMLHttpRequest();
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("POST", "https://api.paymongo.com/v1/payment_methods");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("authorization", "Basic c2tfdGVzdF9KdzJHY05kN2l1U3p5VHVOMlZRenF4Vlo6");
      
        // This PaymentMethod ID must be created before the attach action. This is just a sample value to represent a PaymentMethod
        var paymentMethodId = paymentIntent.data.id;

        // PaymentIntent client_key example
        var clientKey = paymentIntent.data.attributes.client_key;

        // Get the payment intent id from the client key
        var paymentIntentId = clientKey.split('_client')[0];

        axios.post(
        'https://api.paymongo.com/v1/payment_intents/' + paymentIntentId + '/attach',
        {
            data: {
            attributes: {
                client_key: clientKey,
                payment_method: paymentMethodId
            }
            }
        },
        {
            headers: {
            // Base64 encoded public PayMongo API key.
            Authorization: `Basic ${window.btoa(pk_test_e4wyG5SyP5Bh96Fw6948XwBK)}`
            }
        }
        ).then(function(response) {
        var paymentIntent = response.data.data;
        var paymentIntentStatus = paymentIntent.attributes.status;
        
        if (paymentIntentStatus === 'awaiting_next_action') {
            // render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } else if (paymentIntentStatus === 'succeeded') {
            // You already received your customer's payment. You can show a success message from this condition.
            alert('Payment Successful');
        } else if(paymentIntentStatus === 'awaiting_payment_method') {
            // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
            alert('Payment Failed');
        }
        })
});


