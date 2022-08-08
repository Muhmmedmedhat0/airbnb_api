// create a new payment controller
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.createPayment = async (req, res, next) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json({ error: stripeErr });
      } else {
        res.status(200).json({ message: stripeRes });
      }
    }
  );
};
