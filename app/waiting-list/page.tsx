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
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center" dir="rtl">
          {showConfetti && (
            <Confetti 
              width={windowSize.width} 
              height={windowSize.height} 
              recycle={false} 
              numberOfPieces={300}
              colors={['#c9a96e', '#b8925a', '#a07840', '#d4b898', '#f4ecde']}
            />
          )}
          
          <div className="text-7xl mb-4">🎉🏆🎉</div>
          
          <h1 className="text-3xl font-bold text-[#6a4020] mb-2">🎊 ألف مبروك! أنتِ في القائمة 🎊</h1>
          
          <p className="text-gray-600 mb-4">
            تم تسجيل مشاركتك بنجاح! أنتِ الآن ضمن السحب النهائي
          </p>
          
          {/* Position Card */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border border-amber-200">
            <p className="text-lg font-semibold text-gray-700">موقعك الحالي:</p>
            <p className="text-5xl font-black text-[#c9a96e] my-2">#{position}</p>
            <p className="text-sm text-gray-500">
              من أصل {totalParticipants} مشارك
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#c9a96e] to-[#b8925a] h-2 rounded-full"
                style={{ width: `${(position / totalParticipants) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Draw Info Card */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🗓️</span>
              <p className="text-md font-semibold text-gray-700">
                السحب النهائي خلال <strong className="text-[#c9a96e] text-xl">{drawDays}</strong> أيام
              </p>
            </div>
            <p className="text-sm text-gray-600">
              فائز واحد محظوظ سيربح جائزة <strong>500 دينار</strong> من SHEIN!
            </p>
          </div>
          
          {/* Stats Card */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="text-2xl mb-1">🎁</div>
              <p className="text-xs text-gray-600">الجائزة الكبرى</p>
              <p className="font-bold text-green-600">500 دينار</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
              <div className="text-2xl mb-1">👭</div>
              <p className="text-xs text-gray-600">المشاركات</p>
              <p className="font-bold text-purple-600">{totalParticipants}+</p>
            </div>
          </div>
          
          {/* Success Message */}
          <div className="bg-green-50 rounded-lg p-3 mb-6 border border-green-200">
            <p className="text-sm text-green-700">
              ✨ تم تأكيد مشاركاتك العشر! أنتِ الآن في قائمة الانتظار للسحب ✨
            </p>
          </div>
          
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-[#c9a96e] to-[#b8925a] hover:from-[#b8925a] hover:to-[#a07840] text-white font-bold py-3 px-8 rounded-full transition shadow-md flex items-center justify-center gap-2"
          >
            <span>🏠</span> العودة للرئيسية
          </button>
          
          {/* Share Reminder */}
          <p className="text-xs text-gray-400 mt-6">
            💡 تذكير: كلما زادت مشاركاتك، زادت فرصك للفوز! شاركي الرابط مع صديقاتك الأخريات
          </p>
        </div>
      </div>
    </main>
  );
}