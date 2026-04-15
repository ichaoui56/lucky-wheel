// app/share-required/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function ShareRequiredPage() {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<number>(1);
  const [baseUrl, setBaseUrl] = useState<string>('');

  const shareMessages = {
    1: `بنات شوفو هاللعبة!
أنا جربتها وربحت قسيمة من SHEIN
قالولي لازم نشاركها مع صحابي باش نأكد الجائزة، جربو حظكم زادة 

${baseUrl}`,

    2: `عرض محدود للبنات في تونس!
دوّر الدولاب واربح قسائم SHEIN حتى 50 دينار
أنا قريب ربحت
سارعو قبل ما تسكّر 

${baseUrl}`,

    3: `ما نصدقش اللي صارلي!
جربت لعبة بالصدفة وربحت قسيمة من SHEIN
لازمكم تشوفوها بنفسكم 

${baseUrl}`,

    4: `لعبة SHEIN في تونس توّا!
دوّر الدولاب وربح هدايا وقسائم
أنا نلعب فيها توّا 

${baseUrl}`
  };

  useEffect(() => {
    // Set base URL after component mounts (client-side only)
    setBaseUrl(window.location.origin);

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
    let initial = storedRemaining ? parseInt(storedRemaining, 10) : 10;
    if (isNaN(initial) || initial < 0) initial = 10;
    setRemaining(initial);
    setIsLoading(false);
  }, [router]);

  const handleShare = () => {
    if (remaining === null || remaining <= 0) return;

    // Get selected message variant
    const message = shareMessages[selectedVariant as keyof typeof shareMessages];
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
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2ed]">
      <Header />
      <div className="flex mt-28 flex-col items-center justify-center px-4 py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-3xl font-bold text-[#6a4020] mb-2">شاركي لتأكيد الجائزة!</h1>
            <p className="text-gray-600">
              لتأكيد جائزتك 500 دينار، شاركي اللعبة مع <strong>10 صديقات</strong> على واتساب
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>تقدم المشاركة</span>
              <span className="font-bold text-[#c9a96e]">{remaining}/10 مشاركة</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#c9a96e] to-[#b8925a] h-3 rounded-full transition-all duration-500"
                style={{ width: `${remaining !== null ? ((10 - remaining) / 10) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Message Variants Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#6a4020] mb-3">
              اختاري طريقة المشاركة:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedVariant(1)}
                className={`p-3 rounded-xl text-right transition-all ${selectedVariant === 1
                    ? 'bg-[#c9a96e]/20 border-2 border-[#c9a96e]'
                    : 'bg-gray-50 border border-gray-200 hover:border-[#c9a96e]'
                  }`}
              >
                <div className="font-bold text-sm mb-1">🔥 طبيعي وفعّال</div>
                <p className="text-xs text-gray-600 line-clamp-2">بنات شوفو هاللعبة! أنا جربتها وربحت...</p>
              </button>

              <button
                onClick={() => setSelectedVariant(2)}
                className={`p-3 rounded-xl text-right transition-all ${selectedVariant === 2
                    ? 'bg-[#c9a96e]/20 border-2 border-[#c9a96e]'
                    : 'bg-gray-50 border border-gray-200 hover:border-[#c9a96e]'
                  }`}
              >
                <div className="font-bold text-sm mb-1">⚡ عرض محدود + استعجال</div>
                <p className="text-xs text-gray-600 line-clamp-2">🚨 عرض محدود للبنات في تونس! دوّر الدولاب...</p>
              </button>

              <button
                onClick={() => setSelectedVariant(3)}
                className={`p-3 rounded-xl text-right transition-all ${selectedVariant === 3
                    ? 'bg-[#c9a96e]/20 border-2 border-[#c9a96e]'
                    : 'bg-gray-50 border border-gray-200 hover:border-[#c9a96e]'
                  }`}
              >
                <div className="font-bold text-sm mb-1">💣 فضول قوي</div>
                <p className="text-xs text-gray-600 line-clamp-2">😱 ما نصدقش اللي صارلي! جربت لعبة بالصدفة...</p>
              </button>

              <button
                onClick={() => setSelectedVariant(4)}
                className={`p-3 rounded-xl text-right transition-all ${selectedVariant === 4
                    ? 'bg-[#c9a96e]/20 border-2 border-[#c9a96e]'
                    : 'bg-gray-50 border border-gray-200 hover:border-[#c9a96e]'
                  }`}
              >
                <div className="font-bold text-sm mb-1">🎯 مباشر + فيروسي</div>
                <p className="text-xs text-gray-600 line-clamp-2">🎁 لعبة SHEIN في تونس توّا! دوّر الدولاب...</p>
              </button>
            </div>
          </div>

          {/* Preview Message */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-xs text-green-700 mb-2 font-semibold">📱 معاينة الرسالة:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {shareMessages[selectedVariant as keyof typeof shareMessages]}
            </p>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={remaining === 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition text-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📤</span> شاركي على واتساب
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
              {remaining} متبقي
            </span>
          </button>

          {/* Info Message */}
          <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800 text-center">
              💡 نصيحة: اختاري الرسالة اللي تناسب صديقاتك عشان تزيدي فرصة الفوز!
              كل مشاركة توصل تحسبلك تلقائياً.
            </p>
          </div>

          {/* Success Message when completed */}
          {remaining === 0 && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300 animate-pulse">
              <p className="text-sm text-green-700 text-center font-semibold">
                ✅ مبروك! كمّلتي المشاركات. جاري تحويلك...
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}