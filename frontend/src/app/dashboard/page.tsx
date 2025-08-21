'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include', // send HTTP-only cookie
        });

        if (!res.ok) {
          router.push('/auth'); // corrected from '/login'
          return;
        }

        const data = await res.json();
        setUserName(data.name || data.email); // show name if available
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/auth'); // redirect if error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-2">Welcome, {userName}!</h2>
      </section>
    </main>
  );
}
