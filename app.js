const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const stripe = require("stripe")(
  "sk_test_51Ibnw4JMnslr4jqQYY5MJG1U8lVvzxLMcNdPKrAHSIgPwANi2C2N4FT3s410eTocfTuyWmN1k45un259hOHkFrbi002t9818v8"
);

var app = express();
app.use(express.urlencoded());

app.use(express.json());

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

function getItemById(id) {
  let title, amount;
  switch (id) {
    case "1":
      title = "The Art of Doing Science and Engineering";
      amount = 2300;
      break;
    case "2":
      title = "The Making of Prince of Persia: Journals 1985-1993";
      amount = 2500;
      break;
    case "3":
      title = "Working in Public: The Making and Maintenance of Open Source";
      amount = 2800;
      break;
    default:
      return {
        error: "No item selected",
      };
  }

  return {
    title,
    amount,
  };
}

/**
 * Home route
 */
app.get("/", function (req, res) {
  res.render("index");
});

app.post("/charge", async (req, res) => {
  const token = req.body.stripeToken;
  const chargeItem = getItemById(req.body.item);

  if (chargeItem.amount) {
    const charge = await stripe.charges.create({
      amount: chargeItem.amount,
      currency: "usd",
      description: chargeItem.title,
      source: token,
      receipt_email: req.body.email,
    });
    res.render("success", {
      chargeId: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      description: charge.description,
      email: charge.receipt_email,
      receipt_url: charge.receipt_url,
    });
  } else {
    res.render("error");
  }
});

/**
 * Checkout route
 */
app.get("/checkout", async (req, res) => {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;

  const chargeItem = getItemById(item);

  res.render("checkout", {
    ...chargeItem,
  });
});

/**
 * Success route
 */
app.get("/success", function (req, res) {
  res.render("success");
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log("Getting served on port 3000");
});
