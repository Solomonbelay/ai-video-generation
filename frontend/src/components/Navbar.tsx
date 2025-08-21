'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch current user from backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include', // send cookies
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setIsLoggedIn(true);
        setUserName(data.name || 'User'); // or data.name if backend returns name
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserName('');
      });
  }, []);

  const handleLogout = () => {
    // Optionally call backend logout endpoint
    setIsLoggedIn(false);
    setUserName('');
    window.location.href = '/auth';
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🎥 AI VideoGen</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>

        {!isLoggedIn && (
          <Link href="/auth" className="text-gray-700 hover:text-blue-600">Login</Link>
        )}

        {isLoggedIn && (
          <>
            <span className="text-gray-700 font-semibold">{userName}</span>
            <button
              className="text-gray-700 hover:text-red-600 ml-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
