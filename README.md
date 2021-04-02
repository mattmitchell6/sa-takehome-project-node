# Objective

Complete Checkout with Stripe Charge API.

## Candidate instructions

You'll receive these in email.

## Application overview

This demo is written in Javascript (Node.js) with the [Express framework](https://expressjs.com/).

I used my Strike Account test API Keys.

## Description

When the application starts, the user is in the home page and can select one of 3 books to purchase.

After a book is selected, the user is redirected to a checkout page where they have to enter their email and purchase details to complete the payment with the stripe Charge API. A valid email is required by the user to complete the checkout. The card details also need to be valid to complete the checkout. If either of these is not correctly entered, and error is displayed to the user.

After the payment is submitted, we use the id of the item to retreive the item details (amount and description) from the backend, which we use to create a charge object to complete checkout. After the checkout is completed in the backend the user is redirected to a success page displaying the amount, item description, charge id and a link to view the receipt. If an error occures in the backend while creating the charge, the user is redirected to an error page.

## Approach

To complete this excercise, I used the documentation on the Charge API located here https://stripe.com/docs/payments/accept-a-payment-charges.

## Challenges

When I started this exercice, I first completed it using Payment Intent API but later noticed that the exercice required a charge id so I had to revert to use the charge API.

I also had never worked with HBS view Engine. But that was not much of an issue.

## Extensions

1 - From the home page, I would add the ability to

- Add ability to register / login
- Select multiple books
- Enter the number of copies for each selection

2 - From the checkout page, I would

- Request more information from the user (names, shipping address) if it is an anonymous user. If returning user, would not request information but just display with the option of changing his shipping address.
- List out the items selected with the ability to modify the amount of copies for each
- Automatically calculate the total based on selections

3 - From the backend

- Persist charge details in a database so it can be referenced later for the given customer
- Have a database of items with their prices and descriptions and any additional information and a client that can query this database for items

## Running Application

To get started, clone the repository and run `npm install` to install dependencies:

```
git clone https://github.com/mattmitchell6/sa-takehome-project-node && cd sa-takehome-project-node
npm install
```

Then run the application locally:

```
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.
