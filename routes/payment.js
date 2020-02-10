//Make keySecret secret before deploying
const keySecret = process.env.STRIPE_SECRET;

var express = require("express");
var router = express.Router();
//const authenticate = require("./utils/auth");
const stripe = require("stripe")(keySecret);
//Add Authorization later
router.post("/", async function (req, res) {
    const domainURL = process.env.DOMAIN;

    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [payment_intent_data] - lets capture the payment later
    // [customer_email] - lets you prefill the email input in the form
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
        payment_method_types: [req.body.payment_method_type],
        line_items: [
            {
                name: req.body.name,
                //images: ["https://picsum.photos/300/300?random=4"],
                quantity: req.body.quantity,
                currency: req.body.currency,
                amount: req.body.amount + req.body.decimal // Keep the amount on the server to prevent customers from manipulating on client
            }
        ],
        success_url: `${domainURL}/my-jobs`,
        cancel_url: `${domainURL}/profile-payment`
    });

    res.send({
        sessionId: session.id,
    });
}),

    module.exports = router;