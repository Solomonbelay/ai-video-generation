const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion: "2022-11-15",});

const createCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "AI Video Generation",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cancel`,
    });


    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment failed" });
  }
};

module.exports = { createCheckoutSession };

