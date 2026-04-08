'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Confetti from 'react-confetti';

export default function WaitingListPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Verify that share step is completed
    const shareCompleted = localStorage.getItem('shareCompleted');
    if (shareCompleted !== 'true') {
      router.push('/share-required');
      return;
    }
    // Optional: also verify userInfo exists
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/winning-info');
      return;
    }

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, [router]);

  // Calculate position (static #97 for demo, but you can make dynamic)
  const position = 97;
  const totalParticipants = 100;
  const drawDays = 5;

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />
      <div className="flex flex-col mt-28 items-center justify-center px-4 py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center">
          {showConfetti && (
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />
          )}
          <div className="text-7xl mb-4">🎉🏆🎉</div>
          <h1 className="text-3xl font-bold text-[#6a4020] mb-2">You're on the List!</h1>
          <p className="text-gray-600 mb-4">
            Congratulations! Your entry has been recorded.
          </p>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-semibold text-gray-700">Your current position:</p>
            <p className="text-5xl font-black text-[#c9a96e] my-2">#{position}</p>
            <p className="text-sm text-gray-500">
              out of {totalParticipants} participants
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-md text-gray-700">
              🗓️ The final draw will take place in <strong>{drawDays} days</strong>.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              One lucky winner will receive the 500 DH prize. Good luck!
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 px-8 rounded-full transition shadow-md"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}