/**
 * A book available for purchase.
 *
 * @typedef {Object} Book
 * @property {string} title - Display name, also used as the product name on the Stripe line item.
 * @property {string} author - Shown on the store page.
 * @property {string} description - Short blurb shown on the store page.
 * @property {number} amount - Cents in USD, e.g. 2300 = $23.00.
 * @property {string} image - Path to the cover image, served from `public/`.
 */

/**
 * The store's book catalog, keyed by the `bookId` query parameter (e.g. `/checkout?bookId=1`).
 *
 * Hardcoded to keep the demo free of a database. The server looks up prices
 * here and never trusts an amount sent by the browser. The store page is
 * rendered from this catalog too, so titles and prices live in one place.
 *
 * @type {Readonly<Record<string, Book>>}
 */
const BOOKS = {
  '1': {
    title: 'The Art of Doing Science and Engineering',
    author: 'Richard Hamming',
    description: 'The Art of Doing Science and Engineering is a reminder that a childlike capacity for learning and creativity are accessible to everyone.',
    amount: 2300,
    image: '/images/art-science-eng.jpg',
  },
  '2': {
    title: 'The Making of Prince of Persia: Journals 1985-1993',
    author: 'Jordan Mechner',
    description: 'In The Making of Prince of Persia, on the 30th anniversary of the game’s release, Mechner looks back at the journals he kept from 1985 to 1993.',
    amount: 2500,
    image: '/images/prince-of-persia.jpg',
  },
  '3': {
    title: 'Working in Public: The Making and Maintenance of Open Source',
    author: 'Nadia Eghbal',
    description: 'Nadia Eghbal takes an inside look at modern open source and offers a model through which to understand the challenges faced by online creators.',
    amount: 2800,
    image: '/images/working-in-public.jpg',
  },
};

/**
 * Looks up a book by its ID.
 *
 * Uses `Object.hasOwn` so built-in object properties such as `constructor`
 * or `toString` are never mistaken for books.
 *
 * @param {unknown} bookId - The ID from the query string or request body.
 * @returns {Book | undefined} The book, or `undefined` if the ID is unknown.
 */
function getBook(bookId) {
  return typeof bookId === 'string' && Object.hasOwn(BOOKS, bookId) ? BOOKS[bookId] : undefined;
}

// Freeze so prices can't be changed by accident at runtime
module.exports = { BOOKS: Object.freeze(BOOKS), getBook };
