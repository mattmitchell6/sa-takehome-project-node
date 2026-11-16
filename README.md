# SA Take-Home Project: BookStripes

By [akira71s](https://github.com/akira71s)

**BookStripes** is an online bookstore built with Node.js and Express. The boilerplate store let customers browse books but had no way to take payments. I added checkout with the **Stripe Payment Element**, embedded directly in the store's own checkout page. After paying, customers see a confirmation with the amount charged and the **Stripe PaymentIntent ID** (`pi_...`).

## How to run the app

### Prerequisites

- [Node.js](https://nodejs.org/) 22.22 or later (`node -v` to check). This is required by `express-handlebars` 9, which this app uses.
- A Stripe account to obtain [your own keys](#2-configure-your-stripe-keys). A free account in test mode is enough: [sign up here](https://dashboard.stripe.com/register).

### 1. Install

```bash
git clone https://github.com/akira71s/sa-takehome-project-node
cd sa-takehome-project-node
npm install
```

### 2. Configure your Stripe keys

Copy the sample environment file:

```bash
cp sample.env .env
```

Then open `.env` and paste in your **test-mode** keys from the [API keys page](https://dashboard.stripe.com/test/apikeys) in the Stripe Dashboard:

| Variable | Starts with | Where it's used |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_` | Server only. Never share or commit it. |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_` | Sent to the browser to initialize Stripe.js. |

The app checks your keys when it starts. If `.env` is missing, a key is empty, the two keys are swapped, or you've pasted live keys instead of test keys, it stops and tells you exactly what to fix.

### 3. Run

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

For development, `npm run dev` restarts the server automatically when you edit a server-side file.

```bash
npm run dev
```

## Make a test payment

1. Pick a book and click **Purchase**.
2. Enter any email address.
3. Pay with test card `4242 4242 4242 4242`, any future expiry date, and any CVC.
4. The confirmation page shows the amount charged and the PaymentIntent ID (`pi_...`).

### Other test cards to try

| Card number | What happens |
|---|---|
| `4000 0025 0000 3155` | Asks for 3D Secure authentication. Click **Complete** in the pop-up to finish the payment, or **Fail** to see how a failed authentication is handled. |
| `4000 0000 0000 0002` | Declined. The error appears under the payment form, and you can try again with another card. |
| `4000 0000 0000 9995` | Declined for insufficient funds. |

Use any future expiry date and any CVC with these too. Stripe's [testing docs](https://docs.stripe.com/testing) list many more scenarios.

### Find the payment in the Stripe Dashboard

1. Copy the PaymentIntent ID from the confirmation page (the **Copy** button next to it helps).
2. Open the [Payments page](https://dashboard.stripe.com/test/payments) in the Stripe Dashboard, in test mode.
3. Paste the `pi_...` ID into the search bar at the top.

The payment's details show the same amount, the book's name as the line item, and the customer's email.
