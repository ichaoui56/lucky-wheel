// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { articles, Article } from '@/lib/articles';

// Helper to get article by slug
function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

// Generate metadata dynamically (for server component - but this is client component, so we'll use next/head)
// Instead, we'll use useEffect to update document head

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const slug = params?.slug as string;
    const found = getArticleBySlug(slug);
    
    if (!found) {
      router.push('/');
      return;
    }
    
    setArticle(found);
    
    // Update document title and meta tags for SEO
    document.title = `${found.title} | SHEIN Spin Tunisia`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', found.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = found.excerpt;
      document.head.appendChild(meta);
    }
    
    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', found.keywords.join(', '));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = found.keywords.join(', ');
      document.head.appendChild(meta);
    }
    
    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = `https://lucky-wheel-kappa.vercel.app/blog/${found.slug}`;
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
      document.head.appendChild(link);
    }
    
    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', found.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = found.title;
      document.head.appendChild(meta);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', found.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = found.excerpt;
      document.head.appendChild(meta);
    }
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.content = canonicalUrl;
      document.head.appendChild(meta);
    }
    
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', `https://lucky-wheel-kappa.vercel.app${found.image}`);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.content = `https://lucky-wheel-kappa.vercel.app${found.image}`;
      document.head.appendChild(meta);
    }
    
    let ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', 'article');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:type');
      meta.content = 'article';
      document.head.appendChild(meta);
    }
    
    // Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary_large_image');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:card';
      meta.content = 'summary_large_image';
      document.head.appendChild(meta);
    }
    
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', found.title);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:title';
      meta.content = found.title;
      document.head.appendChild(meta);
    }
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', found.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:description';
      meta.content = found.excerpt;
      document.head.appendChild(meta);
    }
    
    // Add JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": found.title,
      "description": found.excerpt,
      "image": `https://lucky-wheel-kappa.vercel.app${found.image}`,
      "datePublished": found.date,
      "dateModified": found.date,
      "author": {
        "@type": "Organization",
        "name": "SHEIN Spin Tunisia"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SHEIN Spin Tunisia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lucky-wheel-kappa.vercel.app/icon.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "keywords": found.keywords.join(", ")
    };
    
    let existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    
    // Find related articles
    const sameCategory = articles.filter(a => a.id !== found.id && a.category === found.category);
    const otherCategory = articles.filter(a => a.id !== found.id && a.category !== found.category);
    let related = [...sameCategory];
    if (related.length < 3) {
      related = [...related, ...otherCategory.slice(0, 3 - related.length)];
    }
    setRelatedArticles(related.slice(0, 3));
    
    // Cleanup function to remove added meta tags when component unmounts (optional)
    return () => {
      // Don't remove canonical and essential tags to avoid issues
    };
  }, [params, router]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  
  if (!article) {
    return (
      <main className="min-h-screen bg-[#f7f2ed]">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f2ed] to-white">
      <Header />
      
     
      <article className="max-w-4xl mx-auto px-4 py-28" dir="rtl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-gold-dark hover:text-gold-dark/80 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">→</span>
          <span className="text-sm font-medium">العودة إلى الرئيسية</span>
        </button>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-10">
          <div className="relative w-full h-80 md:h-[450px] bg-gradient-to-br from-amber-100 via-beige/50 to-cream">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <div className="text-8xl mb-4">📚✨</div>
              <p className="text-white font-medium text-lg drop-shadow-lg bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm">
                {article.category}
              </p>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-30">
            <span className="inline-block text-xs font-bold text-white bg-gold-dark/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              {article.category}
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 leading-tight">
            {article.title}
          </h1>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-beige">
            <div className="flex items-center gap-2 bg-white/50 rounded-full px-3 py-1.5">
              <span className="text-lg">📖</span>
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 rounded-full px-3 py-1.5">
              <span className="text-lg">📅</span>
              <span>{new Date(article.date).toLocaleDateString('ar-TN')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none 
            prose-headings:text-charcoal prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
            prose-h2:text-2xl prose-h2:border-r-4 prose-h2:border-gold-dark prose-h2:pr-4
            prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-5
            prose-strong:text-gold-dark prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-beige">
          <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <span className="text-xl">📤</span> شاركي المقال مع صديقاتك
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://wa.me/?text=${encodeURIComponent('📚 ' + article.title + '\n\n' + url)}`, '_blank');
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">📱</span>
              <span className="font-medium">مشاركة عبر واتساب</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">🔗</span>
              <span className="font-medium">{isCopied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-beige">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-charcoal flex items-center gap-2">
                <span className="text-2xl">📖</span> مقالات ذات صلة
              </h3>
              <Link href="/" className="text-sm text-gold-dark hover:underline flex items-center gap-1">
                عرض الكل <span>←</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-beige hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-40 bg-gradient-to-br from-beige to-cream flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📚</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gold-dark bg-beige/30 px-2 py-1 rounded-full">
                          {related.category}
                        </span>
                        <span className="text-xs text-gray-400">📖 {related.readTime}</span>
                      </div>
                      <h4 className="font-bold text-charcoal mb-2 line-clamp-2 group-hover:text-gold-dark transition-colors text-base">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-beige/50">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>📅</span>
                          <span>{new Date(related.date).toLocaleDateString('ar-TN')}</span>
                        </div>
                        <span className="text-xs text-gold-dark group-hover:underline flex items-center gap-1">
                          اقرأ المزيد <span className="group-hover:translate-x-1 transition-transform">←</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}