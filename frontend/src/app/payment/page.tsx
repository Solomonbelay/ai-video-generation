'use client';
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }), // $5
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        console.error("Backend returned non-JSON:", text);
        alert("Checkout request failed. See console.");
        return;
      }

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Backend response:", data);
        alert("Checkout session creation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrongggg.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
    >
      {loading ? "Redirecting..." : "Pay $5 to Generate Video"}
    </button>
  );
}
