'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/articles';

interface RelatedArticleCardProps {
  article: Article;
}

export default function RelatedArticleCard({ article }: RelatedArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/blog/${article.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-beige hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-40 bg-gradient-to-br from-beige to-cream overflow-hidden">
          {!imgError ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-amber-50">
              📚
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold-dark bg-beige/30 px-2 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">📖 {article.readTime}</span>
          </div>
          <h4 className="font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-gold-dark transition-colors text-base">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-beige/50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>📅</span>
              <span>{new Date(article.date).toLocaleDateString('ar-TN')}</span>
            </div>
            <span className="text-xs text-gold-dark group-hover:underline flex items-center gap-1">
              اقرأ المزيد <span className="group-hover:translate-x-1 transition-transform">←</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
