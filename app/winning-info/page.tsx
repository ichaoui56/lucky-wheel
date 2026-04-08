'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function WinningInfoPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already submitted info and not completed shares, redirect to share page
    const userInfo = localStorage.getItem('userInfo');
    const shareCompleted = localStorage.getItem('shareCompleted');
    if (userInfo && !shareCompleted) {
      router.push('/share-required');
    } else if (shareCompleted === 'true') {
      router.push('/waiting-list');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    // Save user info
    localStorage.setItem('userInfo', JSON.stringify({ fullName, phone, city }));
    // Initialize share counter if not already set
    if (!localStorage.getItem('shareRemaining')) {
      localStorage.setItem('shareRemaining', '20');
    }
    localStorage.removeItem('shareCompleted'); // ensure not completed
    router.push('/share-required');
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />
      <div className="flex mt-28 flex-col items-center justify-center px-4 py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-md  bg-[#f7f2ed] rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#6a4020] text-center mb-2">
            🎉 You Won! 🎉
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Please provide your details to claim the 500 DH prize.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
                placeholder="+212 6XX XXX XXX"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]"
                placeholder="Casablanca"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 rounded-xl transition text-lg shadow-md disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}