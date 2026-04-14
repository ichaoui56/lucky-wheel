// app/winning-info/page.tsx
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
  const [mounted, setMounted] = useState(false);

  // Tunisian cities list
  const tunisianCities = [
    'تونس', 'صفاقس', 'سوسة', 'القيروان', 'بنزرت', 
    'نابل', 'قابس', 'المهدية', 'المنستير', 'الحمامات',
    'قفصة', 'مدنين', 'تطاوين', 'باجة', 'جندوبة',
    'الكاف', 'سليانة', 'زغوان', 'القصرين', 'توزر'
  ];

  useEffect(() => {
    setMounted(true);
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
      alert('الرجاء تعبئة جميع الحقول');
      return;
    }
    
    // Basic phone validation (Tunisian numbers)
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      alert('الرجاء إدخال رقم هاتف تونسي صحيح (8 أرقام)');
      return;
    }
    
    setIsSubmitting(true);
    // Save user info
    localStorage.setItem('userInfo', JSON.stringify({ fullName, phone, city }));
    // Initialize share counter if not already set
    if (!localStorage.getItem('shareRemaining')) {
      localStorage.setItem('shareRemaining', '10');
    }
    localStorage.removeItem('shareCompleted'); // ensure not completed
    router.push('/share-required');
    setIsSubmitting(false);
  };

  if (!mounted) {
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
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8" dir="rtl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🎉🏆🎉</div>
            <h1 className="text-3xl font-bold text-[#6a4020] mb-2">
              🎉 ألف مبروك! لقد ربحتِ! 🎉
            </h1>
            <p className="text-gray-600">
              أنتِ على بعد خطوة واحدة من الحصول على جائزتك
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 mb-6 border border-amber-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <span className="font-bold text-[#c9a96e] text-xl">500 دينار</span>
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              جائزتك من SHEIN في انتظارك! عبّي البيانات التالية لتأكيد استلام الجائزة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e] focus:border-transparent transition"
                placeholder="مثال: نسرين الشابي"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e] focus:border-transparent transition"
                placeholder="مثال: 12345678"
                required
              />
              <p className="text-xs text-gray-400 mt-1">أدخل 8 أرقام (مثال: 12345678)</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                المدينة <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c9a96e] focus:border-transparent transition bg-white"
                required
              >
                <option value="">اختر مدينتك</option>
                {tunisianCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 rounded-xl transition text-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <span>🎁</span> تأكيد واستلام الجائزة
                  <span>←</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              🔒 معلوماتك آمنة ومحمية. سيتم استخدامها فقط لتوصيل الجائزة إليك.
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            بعد التأكيد، ستحتاجين إلى مشاركة اللعبة مع 10 صديقات لتأكيد الجائزة
          </p>
        </div>
      </div>
    </main>
  );
}