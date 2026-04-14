'use client';

import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  id: number;
  user: string;
  avatar: string;
  avatarColor: string;
  location: string;
  text: string;
  likes: number;
  caption: string;
  time: string;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    user: 'نسرين الشابي',
    avatar: 'ن',
    avatarColor: '#c9a96e',
    location: 'Tunis, TN',
    text: 'بنات راهي صحيحة! أنا ربحت قسيمة 30 دينار 😍🔥',
    likes: 1102,
    caption: 'ربحت قسيمة 30 دينار! ما صدقتش 🤯',
    time: '3 hours ago',
    comment: 'ماشاء الله عليك! 🔥',
  },
  {
    id: 2,
    user: 'آية بن سالم',
    avatar: 'آ',
    avatarColor: '#8b7355',
    location: 'Sousse, TN',
    text: 'كيفاش نلعب؟ ما فهمتش 😅',
    likes: 887,
    caption: 'حد يعرف كيفاش نلعب في العجلة؟ 😅',
    time: '2 hours ago',
    comment: 'دوّري تحت في الصفحة 📍',
  },
  {
    id: 3,
    user: 'مريم التونسي',
    avatar: 'م',
    avatarColor: '#b8925a',
    location: 'Sfax, TN',
    text: 'جربتها توّا وطلعتلي "حظ موفق" 😭 نعاود؟',
    likes: 512,
    caption: 'أول مرة طلعلي حظ موفق... نعاود ولا نصبر؟ 😭',
    time: '45 min ago',
    comment: 'عاودي عاودي!! 💪',
  },
  {
    id: 4,
    user: 'سارة الجلاصي',
    avatar: 'س',
    avatarColor: '#a07840',
    location: 'Nabeul, TN',
    text: 'أنا زادة في الأول ما ربحتش، عاودت وربحت 🎉💖',
    likes: 423,
    caption: 'اللي تحب تربح تعاود ماتيأسش 🎉💖',
    time: '1 hour ago',
    comment: 'تبارك الرحمان 💕',
  },
  {
    id: 5,
    user: 'أمينة الزواري',
    avatar: 'أ',
    avatarColor: '#7a6040',
    location: 'Bizerte, TN',
    text: 'والله ما صدقت حتى جربت… توّا عندي كود خصم 😭❤️',
    likes: 678,
    caption: 'كود خصم توّا جاني! ما تصدقو 😭❤️',
    time: '4 hours ago',
    comment: 'شاركينا الكود 😭',
  },
  {
    id: 6,
    user: 'حنان بن علي',
    avatar: 'ح',
    avatarColor: '#c4a46b',
    location: 'Kairouan, TN',
    text: 'شكون زادة ربح 50 دينار؟ ولا أنا وحدي 😍',
    likes: 934,
    caption: '50 دينار!! أنا وحدي ولا معايا حد؟ 😍',
    time: '30 min ago',
    comment: 'أنا زادة! 😍🙋‍♀️',
  },
  {
    id: 7,
    user: 'ريم القفصي',
    avatar: 'ر',
    avatarColor: '#9e7c50',
    location: 'Gafsa, TN',
    text: 'الصحباتي الكل يلعبو فيها توّا 😂🔥',
    likes: 305,
    caption: 'كل الصحبات دخلو يلعبو 🤣🔥',
    time: '5 hours ago',
    comment: 'حبيت نعرفهم 🌸',
  },
  {
    id: 8,
    user: 'إيمان الطرابلسي',
    avatar: 'إ',
    avatarColor: '#b07d44',
    location: 'Tunis, TN',
    text: 'تنجم نشاركها مع صحباتي؟ 👀',
    likes: 512,
    caption: 'ننجم نشارك الرابط ولا لا؟ 👀',
    time: '2 hours ago',
    comment: 'أي أي شاركي 💌',
  },
  {
    id: 9,
    user: 'فاطمة الزهراء',
    avatar: 'ف',
    avatarColor: '#8e6b3e',
    location: 'Monastir, TN',
    text: 'ياخي بصح تعطيو الجوائز؟ ولا fake؟ 🤔',
    likes: 298,
    caption: 'حد ربح حاجة حقيقية؟ ولا كلو كذب؟ 🤔',
    time: '6 hours ago',
    comment: 'أنا ربحت بلا مزاح 🎁',
  },
  {
    id: 10,
    user: 'خولة الدريدي',
    avatar: 'خ',
    avatarColor: '#a8864b',
    location: 'Gabès, TN',
    text: 'جربوها بنات قبل ما تسكّر 😱⏳',
    likes: 1203,
    caption: 'قبل ما تسكر العجلة جربو!!! 😱⏳',
    time: '15 min ago',
    comment: 'نركض نلعب قبل ما تفوت 🏃‍♀️💨',
  },
];

function InstagramCard({ testimonial }: { testimonial: Testimonial }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        flex-shrink-0 w-80 bg-white border border-[#e0d9cf] rounded-xl overflow-hidden
        transition-all duration-300 ease-in-out
        hover:shadow-[0_8px_32px_rgba(180,140,80,0.2)] hover:z-10
        relative
        ${isHovered ? 'scale-110' : 'scale-100'}
      `}
      style={{
        width: '80vw',
        maxWidth: '350px',
        minWidth: '280px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f0ebe3]">
        {/* Instagram-style gradient ring avatar */}
        <div
          className="w-9 h-9 rounded-full p-[2px] flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white text-[13px] font-medium"
            style={{ backgroundColor: testimonial.avatarColor }}
          >
            {testimonial.avatar}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#2c2c2c] leading-tight truncate">
            {testimonial.user}
          </p>
          <p className="text-[11px] text-[#888] truncate">{testimonial.location}</p>
        </div>

        <span className="text-[#bbb] text-base leading-none tracking-widest">···</span>
      </div>

      {/* Text Content Area */}
      <div className="w-full min-h-28 bg-[#faf6f0] flex items-center justify-center p-6 select-none">
        <p className="text-[#2c2c2c] text-sm text-center leading-relaxed font-medium">
          {testimonial.text}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3.5 px-3 pt-2.5 pb-1.5">
        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          className="p-0 bg-transparent border-0 cursor-pointer flex items-center"
          aria-label="Like"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px]"
            style={{
              fill: liked ? '#e0245e' : 'none',
              stroke: liked ? '#e0245e' : '#2c2c2c',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              transition: 'all 0.2s ease',
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Comment */}
        <button className="p-0 bg-transparent border-0 cursor-pointer flex items-center" aria-label="Comment">
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px]"
            style={{ fill: 'none', stroke: '#2c2c2c', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Share */}
        <button className="p-0 bg-transparent border-0 cursor-pointer flex items-center" aria-label="Share">
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px]"
            style={{ fill: 'none', stroke: '#2c2c2c', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>

        {/* Save */}
        <button
          onClick={() => setSaved(!saved)}
          className="ml-auto p-0 bg-transparent border-0 cursor-pointer flex items-center"
          aria-label="Save"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px]"
            style={{
              fill: saved ? '#2c2c2c' : 'none',
              stroke: '#2c2c2c',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              transition: 'fill 0.2s ease',
            }}
          >
            <polygon points="19 21 12 16 5 21 5 3 19 3 19 21" />
          </svg>
        </button>
      </div>

      {/* Likes count */}
      <p className="px-3 pb-1 text-[12px] font-semibold text-[#2c2c2c]">
        {(testimonial.likes + (liked ? 1 : 0)).toLocaleString()} likes
      </p>

      {/* Caption */}
      <p className="px-3 pb-1.5 text-[12px] text-[#2c2c2c] leading-relaxed">
        <span className="font-semibold">{testimonial.user}</span> {testimonial.caption}
      </p>

      {/* Comment preview */}
      <p className="px-3 pb-1 text-[11px] text-[#aaa]">
        View all comments · <span className="text-[#888]">{testimonial.comment}</span>
      </p>

      {/* Timestamp */}
      <p className="px-3 pb-3 text-[10px] text-[#bbb] uppercase tracking-wide">
        {testimonial.time}
      </p>
    </div>
  );
}

export default function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef(0);

  // Triple for smooth infinite loop
  const tripled = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 320; // Base width in px (w-80)
    const gap = 16; // gap-4 = 16px
    const cardTotalWidth = cardWidth + gap;
    const oneSet = testimonials.length * cardTotalWidth;

    // Start from the middle set
    posRef.current = oneSet;
    el.scrollLeft = oneSet;

    const speed = 1.2; // Slightly faster for smoother animation

    const animate = () => {
      if (el) {
        posRef.current += speed;
        // Reset position when reaching the end of the second set
        if (posRef.current >= oneSet * 2) {
          posRef.current = oneSet;
        }
        el.scrollLeft = posRef.current;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <section className="bg-[#FDFBF7] py-12 w-full overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-serif font-medium mb-2"
          style={{ color: '#6a4020' }}
        >
          Winner&apos;s Circle
        </h2>
        <div
          className="w-14 h-[3px] mx-auto rounded-full mb-3"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #b8925a, #D4AF37)' }}
        />
        <p className="text-sm text-[#888]">
          Real customers, real prizes — see what&apos;s possible with one spin
        </p>
      </div>

      {/* Centered carousel container */}
      <div className="flex justify-center">
        <div className="w-[100vw] max-w-[1400px]">
          {/* Carousel track */}
          <div
            ref={scrollRef}
            className="overflow-x-auto h-[400px] overflow-y-visible"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex mt-10 gap-4 w-max px-6 py-3">
              {tripled.map((t, i) => (
                <InstagramCard 
                  key={`${t.id}-${i}`} 
                  testimonial={t} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <div className="text-center mt-5">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#b0a090]">
          Scroll for more
        </span>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}