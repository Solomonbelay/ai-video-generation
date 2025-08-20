'use client';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   


const url = `${API_URL}/api/auth/${isLogin ? 'login' : 'signup'}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: isLogin ? 'include' : undefined,
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          Cookies.set('token', data.token);
          router.push('/dashboard');
        } else {
          alert('Registered successfully!');
          setIsLogin(true); // switch to login after signup
        }
      } else {
        setError(data.message || (isLogin ? 'Login failed' : 'Signup failed'));
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Toggle */}
        <div className="flex justify-center mb-6 border-b border-gray-300">
          <button
            className={`px-4 py-2 font-semibold ${
              isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              !isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h1>

        {/* Error */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Forgot Password only for login */}
        {isLogin && (
          <div className="text-right mt-2 text-sm">
            <button
              onClick={() => router.push('/forgot-password')}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Continue with Google */}
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
