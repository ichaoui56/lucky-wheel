'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, ArrowUp, Instagram, Twitter, Facebook, X } from 'lucide-react';

type DrawerType = 'privacy' | 'terms' | 'cookies' | null;

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDrawerOpen]);

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

  const openDrawer = (type: DrawerType) => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerType(null);
  };

  // Render content based on drawer type
  const renderDrawerContent = () => {
    switch (drawerType) {
      case 'privacy':
        return (
          <div className="space-y-4" dir="rtl">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">سياسة الخصوصية</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              في موقعنا، نلتزم بحماية خصوصية زوارنا. توضح هذه السياسة كيفية جمع واستخدام بياناتك:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">جمع البيانات:</h3>
                <p className="text-sm text-gray-600">لا نقوم بجمع معلومات شخصية حساسة. البيانات التي يتم إدخالها (مثل الاسم أو الولاية) تُستخدم فقط لتحسين تجربة اللعبة التفاعلية وإظهار "لوحة الرابحين".</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">إعلانات الطرف الثالث:</h3>
                <p className="text-sm text-gray-600">نستخدم "جوجل أدسنس" لعرض الإعلانات. تستخدم جوجل ملفات تعريف الارتباط (DART cookies) لعرض إعلانات بناءً على زياراتك لموقعنا ومواقع أخرى. يمكنك إلغاء الاشتراك في استخدام هذه الملفات عبر إعدادات إعلانات جوجل.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">أمان البيانات:</h3>
                <p className="text-sm text-gray-600">نطبق معايير تقنية عالية لحماية بياناتك من الوصول غير المصرح به.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">الموافقة:</h3>
                <p className="text-sm text-gray-600">باستخدامك لموقعنا، فإنك توافق على ممارسات الخصوصية المذكورة هنا.</p>
              </div>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-4" dir="rtl">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">شروط الخدمة</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              أهلاً بك في منصتنا الترفيهية. باستخدامك لهذا الموقع، فإنك تقر وتوافق على الشروط التالية:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">طبيعة الموقع:</h3>
                <p className="text-sm text-gray-600">هذا الموقع هو وجهة ترفيهية تقدم ألعاباً تفاعلية وعروضاً ترويجية. الجوائز والقسائم هي هدايا تحفيزية تخضع لعملية التحقق التقني.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">إخلاء مسؤولية (Affiliation):</h3>
                <p className="text-sm text-gray-600">هذا الموقع مستقل تماماً ولا يتبع لشركة شي إن (SHEIN) الرسمية. نحن نستخدم العلامات التجارية لأغراض ترويجية وتوضيحية فقط، وجميع الحقوق تعود لأصحابها الأصليين.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">الاستخدام العادل:</h3>
                <p className="text-sm text-gray-600">يُحظر استخدام البرامج الآلية (Bots) للتلاعب بالنتائج. أي تلاعب يؤدي إلى إلغاء نتائج المستخدم فوراً.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">تعديل الشروط:</h3>
                <p className="text-sm text-gray-600">نحتفظ بالحق في تحديث هذه الشروط في أي وقت لمواكبة التغييرات التقنية أو القانونية.</p>
              </div>
            </div>
          </div>
        );
      case 'cookies':
        return (
          <div className="space-y-4" dir="rtl">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-4">سياسة ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              يستخدم موقعنا ملفات تعريف الارتباط لتحسين أدائنا وضمان أفضل تجربة لك:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">ما هي الكوكيز؟:</h3>
                <p className="text-sm text-gray-600">هي ملفات نصية صغيرة تُخزن على جهازك لتذكر تفضيلاتك (مثل اللغة أو مرحلة اللعبة التي وصلت إليها).</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">كيف نستخدمها؟:</h3>
                <p className="text-sm text-gray-600">نستخدمها لتحليل حركة المرور عبر Google Analytics ولتخصيص الإعلانات عبر Google AdSense.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">التحكم:</h3>
                <p className="text-sm text-gray-600">يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك، ولكن قد يؤثر ذلك على عمل بعض ميزات اللعبة.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6a4020] mb-1">تحديثات:</h3>
                <p className="text-sm text-gray-600">يتم تحديث هذه السياسة دورياً لضمان الامتثال لقوانين حماية البيانات العالمية لعام 2026.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
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
                  <Link href="/#blog" className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    المقالات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies - Now with drawer trigger buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#d4af37] to-[#f4e4b8] rounded-full"></span>
                القانوني
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => openDrawer('privacy')}
                    className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group w-full text-right"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    سياسة الخصوصية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openDrawer('terms')}
                    className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group w-full text-right"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    شروط الخدمة
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openDrawer('cookies')}
                    className="text-slate-300 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2 group w-full text-right"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                    سياسة ملفات تعريف الارتباط
                  </button>
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

      {/* Right Sidebar Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300"
            onClick={closeDrawer}
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 left-0 md:left-auto right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
              isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col`}
            dir="rtl"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-[#f7f2ed] to-white">
              <h3 className="text-xl font-bold text-[#6a4020]">المعلومات القانونية</h3>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderDrawerContent()}
            </div>
            {/* Drawer Footer (optional) */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
              <p>© 2026 SHEIN Spin - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </>
      )}

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