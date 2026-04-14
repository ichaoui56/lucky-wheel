// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

// Article type definition
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

// Articles data
const articles: Article[] = [
  {
    id: 1,
    title: "الدليل الشامل لاستخراج واستخدام البطاقة التكنولوجية الدولية في تونس 2026",
    slug: "cti-card-tunisia-comprehensive-guide",
    excerpt: "تعد البطاقة التكنولوجية الدولية في تونس حجر الزاوية لكل من يرغب في ولوج عالم التجارة الإلكترونية العالمية",
    content: `<p>تعد البطاقة التكنولوجية الدولية في تونس حجر الزاوية لكل من يرغب في ولوج عالم التجارة الإلكترونية العالمية، خاصة لمحبي التسوق من منصات كبرى مثل شي إن.</p>
<h2>كيفية الحصول على البطاقة</h2>
<p>يمكنك الحصول على هذه البطاقة من خلال البريد التونسي أو عبر البنوك التجارية.</p>`,
    image: "/articles/cti-card.jpg",
    category: "دليل التسوق",
    readTime: "5 دقائق",
    date: "2026-01-15"
  },
  {
    id: 2,
    title: "أسرار تتبع الطرود والتعامل مع الديوانة التونسية عند الشراء من شي إن",
    slug: "shein-tunisia-customs-tracking-secrets",
    excerpt: "يعتبر انتظار الطرد هو الجزء الأكثر حماسا في تجربة التسوق من شي إن",
    content: `<p>يعتبر انتظار الطرد هو الجزء الأكثر حماسا في تجربة التسوق من شي إن.</p>`,
    image: "/articles/customs-tracking.jpg",
    category: "الشحن والتوصيل",
    readTime: "4 دقائق",
    date: "2026-01-20"
  },
  {
    id: 3,
    title: "كيف تختار ملابس شي إن المناسبة لحرارة الصيف في تونس",
    slug: "choosing-summer-clothes-tunisia-guide",
    excerpt: "الصيف في تونس يتميز بحرارة شديدة ورطوبة عالية",
    content: `<p>الصيف في تونس يتميز بحرارة شديدة ورطوبة عالية.</p>`,
    image: "/articles/summer-clothes.jpg",
    category: "نصائح تسوق",
    readTime: "6 دقائق",
    date: "2026-01-25"
  },
  {
    id: 4,
    title: "الرزنامة السنوية لأقوى تخفيضات وعروض شي إن في تونس 2026",
    slug: "shein-tunisia-sales-calendar-2026",
    excerpt: "تعرف على أفضل أوقات التسوق من شي إن لتوفير المال",
    content: `<p>تعرف على أفضل أوقات التسوق من شي إن لتوفير المال.</p>`,
    image: "/articles/sales-calendar.jpg",
    category: "عروض وتخفيضات",
    readTime: "4 دقائق",
    date: "2026-01-10"
  },
  {
    id: 5,
    title: "حقوق المستهلك: كيفية المطالبة بالتعويض عن تأخر الشحنات الدولية",
    slug: "how-to-claim-compensation-for-delayed-shipping",
    excerpt: "تعرف على حقوقك عند تأخر شحناتك الدولية",
    content: `<p>تعرف على حقوقك عند تأخر شحناتك الدولية.</p>`,
    image: "/articles/shipping-delay.jpg",
    category: "حقوق المستهلك",
    readTime: "7 دقائق",
    date: "2026-01-05"
  },
  {
    id: 6,
    title: "أفضل 5 بطاقات ائتمان للتسوق الدولي عبر الإنترنت في 2026",
    slug: "best-credit-cards-for-international-shopping-2026",
    excerpt: "اختر أفضل بطاقة ائتمان للتسوق الدولي",
    content: `<p>اختر أفضل بطاقة ائتمان للتسوق الدولي.</p>`,
    image: "/articles/credit-cards.jpg",
    category: "خدمات مالية",
    readTime: "6 دقائق",
    date: "2026-01-18"
  },
  {
    id: 7,
    title: "اتجاهات الأمن السيبراني: حماية بياناتك المالية",
    slug: "cybersecurity-shopping-trends-2026-protection-guide",
    excerpt: "تعرف على أحدث طرق حماية بياناتك المالية",
    content: `<p>تعرف على أحدث طرق حماية بياناتك المالية.</p>`,
    image: "/articles/cybersecurity.jpg",
    category: "أمن المعلومات",
    readTime: "5 دقائق",
    date: "2026-01-22"
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const slug = params?.slug as string;
    const found = articles.find(a => a.slug === slug);
    
    if (!found) {
      router.push('/');
      return;
    }
    
    setArticle(found);
    
    // Find related articles (same category, excluding current)
    const sameCategory = articles.filter(a => a.id !== found.id && a.category === found.category);
    const otherCategory = articles.filter(a => a.id !== found.id && a.category !== found.category);
    
    let related = [...sameCategory];
    if (related.length < 3) {
      related = [...related, ...otherCategory.slice(0, 3 - related.length)];
    }
    setRelatedArticles(related.slice(0, 3));
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Related Articles Section - Cards at the end */}
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
                    {/* Card Image */}
                    <div className="h-40 bg-gradient-to-br from-beige to-cream flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📚</span>
                    </div>
                    
                    {/* Card Content */}
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

      {/* Footer Section */}
      <footer className="bg-charcoal text-white/80 mt-16" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold text-gold-dark mb-4">عن الموقع</h3>
              <p className="text-sm leading-relaxed">
                منصة ترفيهية تقدم ألعاباً تفاعلية وجوائز قيمة لمحبي التسوق في تونس. نهدف إلى إضفاء المتعة والإثارة على تجربة التسوق الخاصة بك.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-gold-dark mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-gold-dark transition-colors">الرئيسية</Link></li>
                <li><a href="#wheel-section" className="hover:text-gold-dark transition-colors cursor-pointer">عجلة الحظ</a></li>
                <li><Link href="/winning-info" className="hover:text-gold-dark transition-colors">الجوائز</Link></li>
                <li><Link href="/blog" className="hover:text-gold-dark transition-colors">المقالات</Link></li>
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h3 className="text-xl font-bold text-gold-dark mb-4">سياسات الموقع</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-gold-dark transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-gold-dark transition-colors">اتفاقية الاستخدام</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-gold-dark transition-colors">سياسة ملفات الارتباط</Link></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h3 className="text-xl font-bold text-gold-dark mb-4">تواصلي معنا</h3>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
                  <span className="text-xl">📧</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
                  <span className="text-xl">📱</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold-dark transition-colors">
                  <span className="text-xl">💬</span>
                </a>
              </div>
              <p className="text-sm text-white/60">
                البريد الإلكتروني: support@sheinspin.com
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <p className="text-xs text-white/50 text-center leading-relaxed">
              هذا الموقع ليس جزءاً من شركة شي إن (SHEIN) الرسمية ولا يمثلها بشكل قانوني. نحن موقع مستقل يقدم عروضاً ترويجية ومسابقات ترفيهية لمستخدمينا في تونس. جميع العلامات التجارية والشعارات هي ملك لأصحابها الأصليين.
            </p>
            <p className="text-xs text-white/40 text-center mt-3">
              © 2026 جميع الحقوق محفوظة | تصميم وتطوير بواسطة SHEIN Spin
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gold-dark text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 z-50"
      >
        <span className="text-xl">↑</span>
      </button>
    </main>
  );
}