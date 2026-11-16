// DOM elements
const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit');
const messageEl = document.getElementById('payment-message');

// Stripe setup. The server passes the publishable key and book ID through data- attributes.
const stripe = Stripe(form.dataset.publishableKey);

const clientSecretPromise = getClientSecret();
// If the server can't create a Checkout Session, tell the customer instead of
// leaving an empty form.
clientSecretPromise.catch((err) => {
  showError(err.message);
  submitButton.disabled = true;
});

const checkout = stripe.initCheckoutElementsSdk({
  clientSecret: clientSecretPromise, // a Promise is accepted
  elementsOptions: { appearance: { theme: 'stripe' } },
});

const paymentElement = checkout.createPaymentElement({
  layout: {
    type: 'accordion',
    defaultCollapsed: false,
    radios: 'always',
    spacedAccordionItems: false,
  },
});
paymentElement.mount('#payment-element');

const actionsPromise = checkout.loadActions();

form.addEventListener('submit', handleSubmit);

/**
 * Handles the payment form submission: sets the customer's email on the
 * Checkout Session, then confirms the payment. On success Stripe redirects
 * to the session's return_url, so this function only continues on error.
 *
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */
async function handleSubmit(event) {
  event.preventDefault();
  setLoading(true);
  messageEl.textContent = '';

  const loadResult = await actionsPromise;
  if (loadResult.type === 'error') {
    return showError(loadResult.error.message);
  }
  const { actions } = loadResult;

  const email = document.getElementById('email').value;
  const emailResult = await actions.updateEmail(email);
  if (emailResult.type === 'error') {
    return showError(emailResult.error.message);
  }

  const confirmResult = await actions.confirm();
  if (confirmResult.type === 'error') {
    showError(confirmResult.error.message);
  }
}

/**
 * Asks the server to create a Checkout Session for this page's book.
 *
 * @returns {Promise<string>} The Checkout Session's client secret.
 * @throws {Error} If the request fails or the server responds with an error status.
 */
async function getClientSecret() {
  const response = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId: form.dataset.bookId }),
  });

  if (!response.ok) {
    throw new Error('Could not start checkout. Please refresh the page and try again.');
  }

  const data = await response.json();
  return data.clientSecret;
}

/**
 * Shows an error message below the payment form and re-enables the Pay button.
 *
 * @param {string} message
 * @returns {void}
 */
function showError(message) {
  messageEl.textContent = message;
  setLoading(false);
}

/**
 * Disables the Pay button while a payment is in progress to prevent double submission.
 *
 * @param {boolean} isLoading
 * @returns {void}
 */
function setLoading(isLoading) {
  submitButton.disabled = isLoading;
}
