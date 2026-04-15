// components/ArticlesCarousel.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { articles, Article } from '@/lib/articles';

function ArticleCard({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/blog/${article.slug}`}>
      <div className="flex-shrink-0 w-80 bg-white border border-[#e0d9cf] rounded-xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer group hover:shadow-[0_8px_32px_rgba(180,140,80,0.2)] hover:scale-105"
        style={{
          width: '80vw',
          maxWidth: '350px',
          minWidth: '280px',
        }}
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-beige to-cream overflow-hidden">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10" />
          {!imgError ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 350px) 100vw, 350px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-amber-50">
              📚
            </div>
          )}
        </div>

        <div className="px-3 pt-3">
          <span className="inline-block text-xs font-semibold text-gold-dark bg-beige/30 px-2 py-1 rounded-full">
            {article.category}
          </span>
        </div>

        <div className="px-3 pt-2">
          <h3 className="text-base font-bold text-charcoal line-clamp-2 leading-tight group-hover:text-gold-dark transition-colors">
            {article.title}
          </h3>
        </div>

        <div className="px-3 pt-1">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="px-3 pb-3 pt-2 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">📖 {article.readTime}</span>
        </div>

        <div className="px-3 pb-3 pt-1">
          <span className="text-sm font-semibold text-gold-dark group-hover:underline inline-flex items-center gap-1">
            اقرأ المزيد
            <span className="group-hover:translate-x-1 transition-transform">←</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef(0);

  const tripled = [...articles, ...articles, ...articles];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 320;
    const gap = 16;
    const cardTotalWidth = cardWidth + gap;
    const oneSet = articles.length * cardTotalWidth;

    posRef.current = oneSet;
    el.scrollLeft = oneSet;

    const speed = 1.2;

    const animate = () => {
      if (el) {
        posRef.current -= speed;
        if (posRef.current <= 0) {
          posRef.current = oneSet;
          el.scrollLeft = oneSet;
        } else {
          el.scrollLeft = posRef.current;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section className="bg-[#FDFBF7] py-12 w-full overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-medium mb-2" style={{ color: '#6a4020' }}>
          📚 مقالات SHEIN تونس
        </h2>
        <div className="w-14 h-[3px] mx-auto rounded-full mb-3" style={{ background: 'linear-gradient(90deg, #D4AF37, #b8925a, #D4AF37)' }} />
        <p className="text-sm text-[#888]">
          أحدث النصائح والدليلات لتسوق أذكى من SHEIN في تونس
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-[100vw] max-w-[1400px]">
          <div ref={scrollRef} className="overflow-x-auto h-[420px] overflow-y-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-4 w-max px-6 py-3">
              {tripled.map((article, i) => (
                <ArticleCard key={`${article.id}-${i}`} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#b0a090]">
          → اسحب للمزيد من المقالات ←
        </span>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}