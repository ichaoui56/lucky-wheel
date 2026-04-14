// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setIsAtTop(scrollY < 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    fixed top-5 left-1/2 -translate-x-1/2 z-50 
    transition-all duration-500 ease-out
    ${isScrolled
      ? 'w-[90%] md:w-[90%] py-3 bg-white/95 backdrop-blur-md shadow-lg rounded-full'
      : 'w-[90%] md:w-[90%] py-4 bg-white shadow-md rounded-full'
    }
    ${!isAtTop && isScrolled ? 'scale-100' : 'scale-100'}
  `;

  return (
    <header className={headerClasses} dir="rtl">
      <nav className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        <div className="text-2xl font-serif font-bold bg-gradient-to-r from-charcoal to-charcoal/80 bg-clip-text text-transparent">
          <Link href="/">SHEIN</Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            الرئيسية
          </a>
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            عن المنصة
          </a>
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            التوزيعات
          </a>
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            الخطوات
          </a>
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            اكتشفي
          </a>
          <a href="#" className="text-charcoal hover:text-gold transition-colors duration-300 text-sm font-medium">
            الأسئلة الشائعة
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-charcoal hover:text-gold transition-colors duration-300 font-semibold text-sm">
            تسجيل الدخول
          </button>
          <button className="bg-charcoal text-white px-6 py-2 rounded-full font-semibold hover:bg-charcoal/90 transition-all duration-300 hover:shadow-lg">
            إنشاء حساب
          </button>
        </div>
      </nav>
    </header>
  );
}