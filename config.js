/**
 * Loads and validates the app's environment variables.
 *
 * Requiring this module runs the checks once, so `require('./config')` must
 * come before any code that reads `process.env`.
 */

const path = require('node:path');
const { styleText } = require('node:util');

const REQUIRED_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'];
const API_KEYS_URL = 'https://dashboard.stripe.com/test/apikeys';

/**
 * Prints an error in red, plus an optional plain-text hint, then exits with code 1.
 *
 * @param {string} message - What went wrong.
 * @param {string} [hint] - What the user should do next.
 * @returns {never}
 */
function fail(message, hint) {
  console.error(styleText('red', message));
  if (hint) {
    console.error(hint);
  }
  process.exit(1);
}

/**
 * Loads `.env` from the project root into `process.env`, checks that the
 * required variables are set, and validates the Stripe key formats.
 *
 * Uses Node's built-in `process.loadEnvFile()` (Node 20.12+ / 21.7+), so the
 * `dotenv` package isn't needed.
 *
 * Exits with code 1 if `.env` is missing, a required variable is missing or
 * empty, or a Stripe key has the wrong format (see validateStripeKeys).
 *
 * @returns {void}
 * @throws {Error} Re-throws any error from reading `.env` other than a missing
 *   file (`ENOENT`), such as a permission error.
 * @see https://nodejs.org/api/process.html#processloadenvfilepath
 */
function loadEnv() {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
  } catch (err) {
    // ENOENT ("Error NO ENTry"): the .env file doesn't exist
    if (err.code === 'ENOENT') {
      fail('No .env file found.', 'Copy sample.env to .env and fill in your Stripe test keys.');
    }
    throw err;
  }

  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    fail(
      `Missing required environment variables: ${missing.join(', ')}`,
      'Add them to .env (see sample.env for the full list).',
    );
  }

  validateStripeKeys();
}

/**
 * Checks that the Stripe keys have the expected test-mode prefixes, so swapped,
 * live, or placeholder keys are caught at startup with a clear message.
 *
 * Exits with code 1 if any key looks wrong. Never prints the key values.
 *
 * @returns {void}
 */
function validateStripeKeys() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  // Check for swapped keys first: it's the most common mistake,
  // so it gets its own message.
  if (secretKey.startsWith('pk_') && publishableKey.startsWith('sk_')) {
    fail('STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY look swapped.', 'Swap their values in .env.');
  }

  const problems = [];
  if (!/^(sk|rk)_test_/.test(secretKey)) {
    problems.push('STRIPE_SECRET_KEY should start with sk_test_ (or rk_test_ for a restricted key).');
  }
  if (!publishableKey.startsWith('pk_test_')) {
    problems.push('STRIPE_PUBLISHABLE_KEY should start with pk_test_.');
  }

  if (problems.length > 0) {
    fail(
      'Invalid Stripe keys in .env:\n  - ' + problems.join('\n  - '),
      `Use your test-mode keys from ${API_KEYS_URL}`,
    );
  }
}

// Run once when this module is first required.
loadEnv();
