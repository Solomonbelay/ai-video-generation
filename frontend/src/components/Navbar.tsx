'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🎥 AI VideoGen</h1>
      <div className="space-x-4">
        <Link href="/home" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link href="/upload" className="text-gray-700 hover:text-blue-600">Generate</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
      </div>
    </nav>
  );
}
