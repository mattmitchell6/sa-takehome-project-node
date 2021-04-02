/**
 * Clientside helper functions
 */

var stripe = Stripe(
  "pk_test_51Ibnw4JMnslr4jqQQ2lfNUOPCnxsRWKMfvMtYacGcmSVkV71VsFUrIhtRAQWVgyO0DnYGLd59OSMzuFz4M7E66QX00df48M9Lm"
);

$(document).ready(function () {
  document.querySelector("#pay-button").disabled = true;

  var amounts = document.getElementsByClassName("amount");

  // iterate through all "amount" elements and convert from cents to dollars
  for (var i = 0; i < amounts.length; i++) {
    amount = amounts[i].getAttribute("data-amount") / 100;
    amounts[i].innerHTML = amount.toFixed(2);
  }

  var elements = stripe.elements();

  var style = {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      fontFamily: "Arial, sans-serif",
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  var card = elements.create("card", { style: style });
  // Stripe injects an iframe into the DOM
  card.mount("#card-element");

  card.on("change", function (event) {
    // Disable the Pay button if there are no card details in the Element
    document.querySelector("#pay-button").disabled = event.empty;

    if (event.error) {
      document.querySelector("#card-error").classList.remove("d-none");
    } else {
      document.querySelector("#card-error").classList.add("d-none");
    }
    document.querySelector("#card-error").textContent = event.error
      ? event.error.message
      : "";
  });

  var form = document.getElementById("payment-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    loading(true);
    stripe.createToken(card).then(function (result) {
      loading(false);
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById("card-errors");
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token, amount);
      }
    });
  });

  function stripeTokenHandler(token, amount) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById("payment-form");

    // Create input for charge token
    var hiddenInput = document.createElement("input");
    hiddenInput.setAttribute("type", "hidden");
    hiddenInput.setAttribute("name", "stripeToken");
    hiddenInput.setAttribute("value", token.id);
    // Get the item selected
    var urlParams = new URLSearchParams(window.location.search);

    var itemInput = document.createElement("input");
    itemInput.setAttribute("type", "hidden");
    itemInput.setAttribute("name", "item");
    itemInput.setAttribute("value", urlParams.get("item"));

    form.appendChild(hiddenInput);
    form.appendChild(itemInput);
    // Submit the form
    form.submit();
  }

  // Show a spinner on payment submission
  var loading = function (isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("d-none");
      document.querySelector("#spinner").classList.add("d-flex");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("d-none");
      document.querySelector("#spinner").classList.remove("d-flex");
    }
  };
});
