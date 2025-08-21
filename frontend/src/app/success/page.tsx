"use client";
//frontend/src/success/page.tsx
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout-session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          setVideoUrl(data.videoUrl);
        } else {
          setError("Payment not confirmed.");
        }
      })
      .catch(() => setError("Failed to fetch session details."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-20">⏳ Verifying payment...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="text-center p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          ✅ Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your video is ready to download.
        </p>
        {videoUrl && (
          <a
            href={videoUrl}
            download
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ⬇ Download Video
          </a>
        )}
      </div>
    </main>
  );
}
