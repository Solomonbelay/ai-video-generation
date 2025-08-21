'use client';
//frontend/src/payment/page.tsx
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
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Pay for Generation</h1>
        <p className="text-gray-500 mt-2">Securely pay $5 to generate your video instantly</p>
      </header>

      {/* Card */}
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-semibold mb-4">Generate Your Video</h2>
        <p className="text-gray-600 mb-6">
          A charge of <span className="font-bold">$5</span> will be applied to your account if you are ready. Click the button below to proceed.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg text-white font-medium transition 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Redirecting..." : "Pay $5 to Generate Video"}
        </button>
      </div>
    </div>
  );
}
