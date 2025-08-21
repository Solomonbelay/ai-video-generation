'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingButton, setLoadingButton] = useState(''); // '', 'login', 'signup', 'google'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingButton(isLogin ? 'login' : 'signup');

    const url = `${API_URL}/api/auth/${isLogin ? 'login' : 'signup'}`;
    try {
      const body = isLogin
        ? { email, password }
        : { name, email, password }; // include name for signup

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for HTTP-only cookie
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          router.push('/dashboard'); // cookie is already set by backend
        } else {
          alert('Registered successfully!');
          setIsLogin(true);
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        setError(data.message || (isLogin ? 'Login failed' : 'Signup failed'));
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingButton('');
    }
  };

  const handleGoogleLogin = () => {
    setLoadingButton('google');
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {/* Toggle */}
        <div className="flex justify-center mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              isLogin
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setIsLogin(true)}
            disabled={loadingButton !== ''}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              !isLogin
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setIsLogin(false)}
            disabled={loadingButton !== ''}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h1>

        {/* Error */}
        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
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
            disabled={loadingButton === 'login' || loadingButton === 'signup'}
            className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${
              loadingButton === 'login' || loadingButton === 'signup'
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loadingButton === 'login' || loadingButton === 'signup'
              ? isLogin
                ? 'Signing In...'
                : 'Signing Up...'
              : isLogin
              ? 'Login'
              : 'Sign Up'}
          </button>
        </form>

        {/* Google Login */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-200" />
        </div>
        <button
          onClick={handleGoogleLogin}
          disabled={loadingButton === 'google'}
          className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors ${
            loadingButton === 'google'
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loadingButton === 'google' ? 'Redirecting...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
