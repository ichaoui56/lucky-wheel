'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import ArticlesCarousel from '@/components/ArticlesCarousel';
import SpinningWheel, { SpinningWheelHandle } from '@/components/SpinningWheel';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import ShoppingGuide from '@/components/ShoppingGuide';

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
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
  const spinCountRef = useRef<number>(0);

  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showSecondChanceModal, setShowSecondChanceModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);


  useEffect(() => {
    document.title = 'SHEIN Spin Tunisia | العجلة الدوارة لربح قسائم SHEIN في تونس';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'لعبة العجلة الدوارة لربح قسائم شراء من SHEIN (SHEIN) في تونس. دوري العجلة واربحي جوائز تصل إلى 500 دينار. عروض حصرية للمتسوقات التونسيات.');
    }

    // Add FAQ JSON-LD for homepage
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "كيف ألعب عجلة الحظ؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "كل ما عليك فعله هو الضغط على العجلة للدوران. لديك محاولتان مجانيتان. إذا ربحت، ستحتاج إلى مشاركة اللعبة مع 10 صديقات لتأكيد جائزتك."
          }
        },
        {
          "@type": "Question",
          "name": "ما هي الجوائز التي يمكنني ربحها؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "يمكنك ربح قسائم شراء من SHEIN بقيمة تصل إلى 500 دينار تونسي، بالإضافة إلى جوائز أخرى متنوعة."
          }
        },
        {
          "@type": "Question",
          "name": "هل الموقع مجاني؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "نعم، الموقع مجاني تماماً ولا يتطلب أي دفعات للمشاركة في اللعبة."
          }
        }
      ]
    };

    let existingFaq = document.querySelector('#faq-jsonld');
    if (existingFaq) existingFaq.remove();
    const script = document.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);
  }, []);

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
    if (hasWon) return "لقد ربحت 500 دينار!";
    if (spinCountRef.current >= 2) return "اكتملت المحاولات";
    if (spinCountRef.current === 1) return "الفرصة الأخيرة!";
    return "دوري لتربحي";
  };

  const handleRequestSpin = () => {
    if (!canSpin) return;

    if (spinCountRef.current === 0) {
      console.log('[Page] First spin → targeting text-2 (Another Chance!)');
      wheelRef.current?.spin("text-2", 10);
      spinCountRef.current = 1;
      setSpinCount(1);
      setIsSpinning(true);
    } else if (spinCountRef.current === 1) {
      console.log('[Page] Second spin → targeting text-10 (500DH Card)');
      wheelRef.current?.spin("text-10", 10);
      spinCountRef.current = 2;
      setSpinCount(2);
      setIsSpinning(true);
    }
  };

  const handleSpinEnd = (_segment: any) => {
    setIsSpinning(false);
    console.log('[Page] handleSpinEnd — spinCountRef.current =', spinCountRef.current);

    if (spinCountRef.current === 1) {
      setShowSecondChanceModal(true);
    } else if (spinCountRef.current === 2) {
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
            <SpinningWheel ref={wheelRef} spinStatus="جاري التحميل..." />
          </div>
          <TestimonialCarousel />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />

      {/* Full width hero section */}
      <div className="w-full">
        <HeroSection />
      </div>

      {/* Main content with cards */}
      <div className="flex flex-col items-center justify-center px-4 py-12 max-w-7xl mx-auto">

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-beige text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🎰</div>
            <div className="text-2xl font-bold text-gold-dark">{spinCount}/2</div>
            <p className="text-xs text-charcoal/60">عدد المحاولات</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-beige text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-gold-dark">500 د</div>
            <p className="text-xs text-charcoal/60">الحد الأقصى للجائزة</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-beige text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👭</div>
            <div className="text-2xl font-bold text-gold-dark">3,482+</div>
            <p className="text-xs text-charcoal/60">بنت لعبت اليوم</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-beige text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-2xl font-bold text-gold-dark">يوميًا</div>
            <p className="text-xs text-charcoal/60">جوائز محدثة</p>
          </div>
        </div>

        {/* Wheel Card */}
        <div id="wheel-section" className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-12 border border-beige">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">🎡 عجلة الحظ</h2>
            <p className="text-charcoal/60 mt-1">دوري واربحي جوائز رائعة</p>
            <div className="w-20 h-0.5 bg-gold-dark mx-auto mt-3"></div>
          </div>
          <SpinningWheel
            ref={wheelRef}
            disabled={!canSpin}
            onRequestSpin={handleRequestSpin}
            onSpinEnd={handleSpinEnd}
            spinStatus={getSpinStatus()}
            hasWon={hasWon}
          />
        </div>

        {/* Testimonials Card */}
        <div id="blog" className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-12 border border-beige">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">💬 آراء البنات</h2>
            <p className="text-charcoal/60 mt-1">شوفي اللي ربحوا قبل</p>
            <div className="w-20 h-0.5 bg-gold-dark mx-auto mt-3"></div>
          </div>
          <TestimonialCarousel />
        </div>

        <ShoppingGuide />

        {/* Articles Section - New */}
        <div className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-beige">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">📚 مقالات SHEIN تونس</h2>
            <p className="text-charcoal/60 mt-1">أحدث النصائح والدليلات لتسوق أذكى</p>
            <div className="w-20 h-0.5 bg-gold-dark mx-auto mt-3"></div>
          </div>
          <ArticlesCarousel />
        </div>
      </div>

      {/* Modal: فرصة أخرى */}
      <FullScreenModal isOpen={showSecondChanceModal} onClose={closeSecondChanceModal}>
        <div className="text-center" dir="rtl">
          <div style={{ fontSize: 64, lineHeight: 1.2, marginBottom: 12 }}>🎯</div>
          <h2 className="text-3xl font-bold text-[#6a4020] mb-2">لديك فرصة أخرى!</h2>
          <p className="text-gray-600 mb-1">العجلة في صفك.</p>
          <p className="text-gray-700 font-semibold mb-6">
            دورة مرة أخرى لتربحي <span className="text-green-600 font-bold">500 دينار</span>!
          </p>
          <button
            onClick={closeSecondChanceModal}
            className="bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 px-8 rounded-full transition text-lg shadow-md"
          >
            🎁 دورة مرة أخرى!
          </button>
        </div>
      </FullScreenModal>

      {/* Modal: ربحت الجائزة */}
      <FullScreenModal isOpen={showWinModal} onClose={closeWinModal}>
        <div className="text-center relative overflow-hidden" dir="rtl">
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 4, letterSpacing: 4 }}>🎉✨🎊</div>

          <h2 className="text-4xl font-bold text-[#6a4020] mb-2">🎉 مبروك! ربحت قسيمة SHEIN 🎁</h2>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-gold-dark rounded-2xl py-4 px-6 mb-4 inline-block">
            <p className="text-4xl font-bold text-gold-dark">🏆 500 دينار</p>
            <p className="text-sm text-gray-500 mt-1">بطاقة هدية SHEIN</p>
          </div>

          <div className="bg-amber-50 border-r-4 border-amber-500 rounded-lg p-4 my-4 text-right">
            <p className="text-amber-700 font-bold text-lg mb-2">⚠️ لتأكيد الجائزة:</p>
            <p className="text-gray-800 text-md">
              شاركي اللعبة مع <span className="font-bold text-gold-dark">10 من صديقاتك</span> على واتساب 👇
            </p>
          </div>

          <div style={{ fontSize: 28, marginBottom: 16, letterSpacing: 4 }}>💝💕💖</div>

          <button
            onClick={() => {
              closeWinModal();
              router.push('/winning-info');
            }}
            className="bg-gradient-to-r from-gold-dark to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 px-10 rounded-full transition text-lg shadow-lg"
          >
            🎁 تأكيد جائزتي 500 دينار!
          </button>
        </div>
      </FullScreenModal>

      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 0}
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={500}
          gravity={0.25}
          colors={['#c9a96e', '#b8925a', '#a07840', '#8b7355', '#d4b898']}
        />
      )}
    </main>
  );
}