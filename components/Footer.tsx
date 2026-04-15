'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, ArrowUp, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-b to-[#2c2c2c] from-[#3a3a3a] text-slate-100" dir="rtl">
        {/* Newsletter Section */}
        <div className="border-b border-[#d4af37]/20">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#d4af37] via-[#f4e4b8] to-[#d4af37] bg-clip-text text-transparent mb-2">
                  SHEIN Spin
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  ابقَ على اطّلاع بأحدث الجوائز والألعاب والعروض الحصرية. انضم إلى مجتمع الفائزين لدينا!
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#3a3a3a] border border-[#d4af37]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f4e4b8] text-[#2c2c2c] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 transform hover:scale-105"
                >
                  {subscribed ? '✓ تم الاشتراك!' : 'اشترك'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#f4e4b8] rounded-full"></span>
                حول SHEIN Spin
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                وجهتك النهائية للترفيه مع الألعاب التفاعلية والجوائز القيمة. جعل التسوق ممتعاً في تونس منذ 2026.
              </p>
              <div className="pt-4 space-y-2">
                <p className="text-xs text-slate-400">📍 متاح في تونس</p>
                <p className="text-xs text-slate-400">🎮 جوائز يومية</p>
                <p className="text-xs text-slate-400">⚡ لعب فوري</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#f4e4b8] rounded-full"></span>
                استكشف
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <a href="#wheel-section" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 cursor-pointer flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    عجلة الحظ
                  </a>
                </li>
                <li>
                  <Link href="/winning-info" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    الجوائز
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    المقالات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#f4e4b8] rounded-full"></span>
                القانوني
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    شروط الخدمة
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    سياسة ملفات تعريف الارتباط
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#f4e4b8] rounded-full"></span>
                تواصل
              </h3>
              <div className="flex gap-3 mb-6">
                <a 
                  href="mailto:support@sheinspin.com" 
                  className="w-12 h-12 bg-[#3a3a3a] hover:bg-[#d4af37] hover:text-[#2c2c2c] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group shadow-lg"
                  title="البريد الإلكتروني"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-[#3a3a3a] hover:bg-[#d4af37] hover:text-[#2c2c2c] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group shadow-lg"
                  title="الهاتف"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-[#3a3a3a] hover:bg-[#d4af37] hover:text-[#2c2c2c] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group shadow-lg"
                  title="الدردشة"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="text-[#d4af37] font-semibold">البريد الإلكتروني:</span> support@sheinspin.com
                </p>
                <div className="flex gap-4 pt-2">
                  <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors" title="إنستغرام">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors" title="تويتر">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors" title="فيسبوك">
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#d4af37]/20 my-8"></div>

          {/* Bottom Section */}
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              هذا الموقع ليس جزءاً من شركة SHEIN الرسمية ولا يمثلها قانونياً. نحن موقع مستقل نقدم عروضاً ترويجية ومسابقات ترفيهية لمستخدمينا في تونس. جميع العلامات التجارية والشعارات هي ملك لأصحابها الأصليين.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>© 2026 SHEIN Spin. جميع الحقوق محفوظة.</p>
              <p>تم التصميم والبناء بـ ✨ لمحبي الترفيه</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#d4af37] to-[#f4e4b8] text-[#2c2c2c] w-14 h-14 rounded-full shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300 flex items-center justify-center hover:scale-110 z-50 animate-bounce"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp className="w-6 h-6 font-bold" />
        </button>
      )}
    </>
  );
}
