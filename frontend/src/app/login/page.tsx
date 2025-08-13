"use client"; 
import { useState } from 'react';
import Cookies from 'js-cookie';

import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
export default function LoginPage() {



  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {

      Cookies.set('token', data.token); // after successful login

      router.push('/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Login
        </button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Continue with Google
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
