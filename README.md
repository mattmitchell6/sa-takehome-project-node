# Stripe take home project

This is a simple e-commerce application that a customer can use to purchase a book, but it's missing the payments functionality —  your goal is to integrate Stripe to get this application running!

## Candidate instructions

Your output should be a simple program that allows the user to take a few actions:

* Select a book to purchase
* Checkout and purchase the item using Stripe Elements.
* Display a confirmation of purchase to the user with the total amount of the charge and Stripe charge ID (beginning with ch_). 

When you're done, push the project to Github or place in a zip file and return along with a doc (README.md, a Google doc, etc.) containing the following (usually ~1 page):
* A paragraph or two about your solution: how does it work? Which Stripe APIs does it use?
* A paragraph or two about how you approached this problem: which docs did you use to complete the project? What challenges did you encounter?
* A paragraph about why you picked the language/framework you did.
* A paragraph or two about how you might extend this if you were building a more robust instance of the same application.

This document will give us a chance to assess your writing abilities as well.

We'll also extend this example later in the process if you interview in person with us, asking you to present to one of our team members and add a feature. We suggest your application is structured in such a way that you’re able to run it locally and integrate other Stripe features easily later.

## Application overview

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/). You'll need to retrieve a set of testmode API keys from the Stripe dashboard (you can create a free test account [here](https://dashboard.stripe.com/register)) to run this locally.

We're using the [Bootstrap](https://getbootstrap.com/docs/4.6/getting-started/introduction/) CSS framework. It's the most popular CSS framework in the world and is pretty easy to get started with — feel free to modify styles/layout if you like. 

To get started, clone the repository and run bundler to install dependencies:

```
git clone https://git.corp.stripe.com/stripe-sandbox/sa-takehome-project-node && cd sa-takehome-project-node
npm install
```

Then run the application locally:

```
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.
