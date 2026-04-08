'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function ShareRequiredPage() {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user info exists
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/winning-info');
      return;
    }
    // Check if already completed shares
    const shareCompleted = localStorage.getItem('shareCompleted');
    if (shareCompleted === 'true') {
      router.push('/waiting-list');
      return;
    }
    // Load remaining count
    const storedRemaining = localStorage.getItem('shareRemaining');
    let initial = storedRemaining ? parseInt(storedRemaining, 10) : 20;
    if (isNaN(initial) || initial < 0) initial = 20;
    setRemaining(initial);
    setIsLoading(false);
  }, [router]);

  const handleShare = () => {
    if (remaining === null || remaining <= 0) return;

    // Prepare WhatsApp message with site link
    const message = `I just won 500DH on this amazing contest! 🎁 Join and try your luck: ${window.location.origin}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Decrement remaining count
    const newRemaining = remaining - 1;
    setRemaining(newRemaining);
    localStorage.setItem('shareRemaining', newRemaining.toString());

    if (newRemaining === 0) {
      // Mark as completed and redirect to waiting list
      localStorage.setItem('shareCompleted', 'true');
      router.push('/waiting-list');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f2ed]">
        <Header />
        <div className="flex justify-center items-center h-64">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />
      <div className="flex mt-28 flex-col items-center justify-center px-4 py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-lg  bg-[#f7f2ed] rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-[#6a4020] mb-2">Share to Confirm!</h1>
          <p className="text-gray-600 mb-4">
            To secure your 500 DH prize, you must share this contest with <strong>20 friends</strong> on WhatsApp.
          </p>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-[#c9a96e]">{remaining}</p>
            <p className="text-sm text-gray-500">shares remaining</p>
          </div>
          <button
            onClick={handleShare}
            disabled={remaining === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>📤</span> Share on WhatsApp
          </button>
          <p className="text-xs text-gray-400 mt-6">
            Each click opens WhatsApp. After sending the message, return here – your count will update automatically.
          </p>
        </div>
      </div>
    </main>
  );
}