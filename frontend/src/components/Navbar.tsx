'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if token exists
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      // Optional: If you store user info in cookies or localStorage, get name
      const storedName = Cookies.get('userName'); 
      if (storedName) setUserName(storedName);
    }
  }, []);

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
            <span className="text-gray-700 font-semibold">{userName || 'User'}</span>
            {/* Optionally, you can add a logout button */}
            <button
              className="text-gray-700 hover:text-red-600 ml-2"
              onClick={() => {
                Cookies.remove('token');
                Cookies.remove('userName');
                setIsLoggedIn(false);
                setUserName('');
                window.location.href = '/auth';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
