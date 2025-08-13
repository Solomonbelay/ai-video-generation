"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        Cookies.set("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between text-sm text-blue-600 mt-2">
          <button
            onClick={() => router.push("/forgot-password")}
            className="hover:underline"
          >
            Forgot Password?
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="hover:underline"
          >
            Sign Up
          </button>
        </div>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 488 512"
            fill="currentColor"
          >
            <path d="M488 261.8c0-17.7-1.6-35.1-4.7-51.8H249v98h134.7c-5.8 31.2-23.1 57.7-49 75.4v62.6h79.3c46.4-42.8 73-105.6 73-184.2zM249 492c66.7 0 122.6-22.1 163.4-60.1l-79.3-62.6c-22 14.8-50.2 23.6-84.1 23.6-64.7 0-119.5-43.7-139.1-102.5H28.4v64.5C69 435 151.6 492 249 492zM109.9 282.4c-4.7-14.1-7.3-29.1-7.3-44.4s2.6-30.3 7.3-44.4v-64.5H28.4C10.4 173.5 0 210.8 0 248s10.4 74.5 28.4 102.5l81.5-64.1zM249 100c35.8 0 68.1 12.3 93.5 36.4l70.1-70.1C371.6 24.1 315.7 0 249 0 151.6 0 69 57 28.4 142.5l81.5 64.5C129.5 143.7 184.3 100 249 100z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
