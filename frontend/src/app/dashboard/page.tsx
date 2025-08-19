// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';


export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
    } else {
      // Optional: decode JWT and extract user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email);
      } catch (err) {
        console.error('Invalid token');
        router.push('/login');
      }
      setLoading(false);
    }
    
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-4">
     




    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {/* Add more sections here if needed */}
  
    </main>




      
    </main>
  );
}
