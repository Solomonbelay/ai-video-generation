// routes/checkoutRoutes.js
const express = require("express");
const Stripe = require("stripe");
const { createCheckoutSession } = require("../controllers/checkoutController.js");

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const router = express.Router();

/**
 * POST /api/checkout
 * Create a new Stripe Checkout session
 */
router.post("/checkout", createCheckoutSession);

/**
 * GET /api/checkout-session/:id
 * Verify if the session is paid, and return the video URL if so
 */
router.get("/checkout-session/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Replace this with your real logic for finding the generated video
    const videoUrl =
      session.payment_status === "paid"
        ? "https://example.com/generated-video.mp4"
        : null;

    res.json({
      paid: session.payment_status === "paid",
      videoUrl,
    });
  } catch (err) {
    console.error("❌ Error fetching Stripe session:", err.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

module.exports = router;
