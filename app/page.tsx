'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import SpinningWheel, { SpinningWheelHandle } from '@/components/SpinningWheel';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';

const STORAGE_KEYS = {
  SPIN_COUNT: 'wheel_spinCount',
  HAS_WON: 'wheel_hasWon',
};

const FullScreenModal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f2ed] rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 transform transition-all animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const wheelRef = useRef<SpinningWheelHandle>(null);

  const [spinCount, setSpinCount] = useState<number>(0);
  // useRef for synchronous tracking — useState is async and stale inside callbacks
  const spinCountRef = useRef<number>(0);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showSecondChanceModal, setShowSecondChanceModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedSpinCount = localStorage.getItem(STORAGE_KEYS.SPIN_COUNT);
    const storedHasWon = localStorage.getItem(STORAGE_KEYS.HAS_WON);
    if (storedSpinCount !== null) {
      const count = parseInt(storedSpinCount, 10);
      setSpinCount(count);
      spinCountRef.current = count;
    }
    if (storedHasWon !== null) setHasWon(storedHasWon === 'true');
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEYS.SPIN_COUNT, spinCount.toString());
      localStorage.setItem(STORAGE_KEYS.HAS_WON, hasWon.toString());
    }
  }, [spinCount, hasWon, mounted]);

  const canSpin = !isSpinning && !hasWon && spinCountRef.current < 2;

  const getSpinStatus = () => {
    if (hasWon) return "YOU WON 500 DH!";
    if (spinCountRef.current >= 2) return "SPINS COMPLETED";
    if (spinCountRef.current === 1) return "LAST CHANCE!";
    return "SPIN TO WIN";
  };

  const handleRequestSpin = () => {
    if (!canSpin) return;

    if (spinCountRef.current === 0) {
      // First spin → MUST land on "text-2" = "Another Chance!"
      console.log('[Page] First spin → targeting text-2 (Another Chance!)');
      wheelRef.current?.spin("text-2", 5);
      spinCountRef.current = 1;
      setSpinCount(1);
      setIsSpinning(true);
    } else if (spinCountRef.current === 1) {
      // Second spin → MUST land on "text-10" = "500DH Card"
      console.log('[Page] Second spin → targeting text-10 (500DH Card)');
      wheelRef.current?.spin("text-10", 5);
      spinCountRef.current = 2;
      setSpinCount(2);
      setIsSpinning(true);
    }
  };

  /**
   * spinCountRef.current is already updated synchronously in handleRequestSpin
   * before this callback ever fires, so we can read it reliably here.
   */
  const handleSpinEnd = (_segment: any) => {
    setIsSpinning(false);
    console.log('[Page] handleSpinEnd — spinCountRef.current =', spinCountRef.current);

    if (spinCountRef.current === 1) {
      // First spin just finished → show "another chance" modal
      setShowSecondChanceModal(true);
    } else if (spinCountRef.current === 2) {
      // Second spin just finished → show win
      setHasWon(true);
      setShowWinModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    }
  };

  const closeSecondChanceModal = () => setShowSecondChanceModal(false);
  const closeWinModal = () => setShowWinModal(false);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f7f2ed]">
        <Header />
        <HeroSection />
        <div className="flex flex-col items-center justify-center px-4 py-8 max-w-7xl mx-auto">
          <div className="w-full max-w-4xl">
            <SpinningWheel ref={wheelRef} spinStatus="LOADING..." />
          </div>
          <TestimonialCarousel />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />
      <HeroSection />
      <div className="flex flex-col items-center justify-center px-4 py-8 max-w-7xl mx-auto">
        <div className="w-full max-w-4xl mx-auto animate-slide-up">
          <SpinningWheel
            ref={wheelRef}
            disabled={!canSpin}
            onRequestSpin={handleRequestSpin}
            onSpinEnd={handleSpinEnd}
            spinStatus={getSpinStatus()}
          />
        </div>
        <div className='bg-cream'>
            <TestimonialCarousel />
        </div>
      
      </div>

      {/* Modal: Another Chance */}
      <FullScreenModal isOpen={showSecondChanceModal} onClose={closeSecondChanceModal}>
        <div className="text-center">
          <div style={{ fontSize: 64, lineHeight: 1.2, marginBottom: 12 }}>🎯</div>
          <h2 className="text-3xl font-bold text-[#6a4020] mb-2">You have another chance!</h2>
          <p className="text-gray-600 mb-1">The wheel is on your side.</p>
          <p className="text-gray-700 font-semibold mb-6">
            Spin again to win <span className="text-green-600 font-bold">500 DH</span>!
          </p>
          <button
            onClick={closeSecondChanceModal}
            className="bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 px-8 rounded-full transition text-lg shadow-md"
          >
            🎁 Spin Again!
          </button>
        </div>
      </FullScreenModal>

      {/* Modal: Win */}
      <FullScreenModal isOpen={showWinModal} onClose={closeWinModal}>
        <div className="text-center relative overflow-hidden">
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 4, letterSpacing: 4 }}>🔥🎂🔥</div>
          <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 16, letterSpacing: 6 }}>🎉✨🎊✨🎉</div>
          <h2 className="text-4xl font-bold text-[#6a4020] mb-1">You Won!</h2>
          <p className="text-lg text-gray-600 mb-2">Congratulations, you are our lucky winner!</p>
          <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-2 border-green-400 rounded-2xl py-4 px-6 mb-4 inline-block">
            <p className="text-4xl font-bold text-green-600">🏆 500 DH</p>
            <p className="text-sm text-gray-500 mt-1">Gift Card Prize</p>
          </div>
          <div style={{ fontSize: 28, marginBottom: 16, letterSpacing: 4 }}>🎈🎆🎇🎈</div>
          <button
            onClick={() => {
              closeWinModal();
              router.push('/winning-info');
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-10 rounded-full transition text-lg shadow-lg"
          >
            🎁 Claim My 500 DH Prize!
          </button>
        </div>
      </FullScreenModal>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.25}
        />
      )}
    </main>
  );
}