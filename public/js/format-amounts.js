/**
 * Client-side helper: formats prices for display.
 *
 * Prices are rendered in cents in a `data-amount` attribute (e.g. 2300).
 * Once the page loads, every element with the `amount` class shows the
 * dollar value instead (e.g. 23.00).
 */
$(document).ready(function () {
  const amounts = document.getElementsByClassName('amount');

  for (let i = 0; i < amounts.length; i++) {
    const dollars = amounts[i].getAttribute('data-amount') / 100;
    amounts[i].textContent = dollars.toFixed(2);
  }
});
