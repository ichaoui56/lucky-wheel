// components/HeroSection.tsx
export default function HeroSection() {
  const scrollToWheel = () => {
    const wheelElement = document.querySelector('.wheel-section');
    if (wheelElement) {
      wheelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="w-full bg-cream pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-beige/40 rounded-full px-4 py-1.5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-dark opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark"></span>
          </span>
          <span className="text-xs font-medium text-charcoal/70">🔥 3,482+ بنت تلعب توّا</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
          🚨 مفاجأة لكل البنات في تونس! 🚨
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-charcoal/80 mb-8 leading-relaxed">
          🎁 تخيّلي تربحي قسيمة شراء من SHEIN توّا… بضغطة وحدة فقط!
        </p>

        {/* Prize Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-beige">
            <div className="text-3xl mb-2">💳</div>
            <h3 className="font-bold text-charcoal">قسائم شراء</h3>
            <p className="text-gold-dark font-semibold">حتى 500 دينار</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-beige">
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-bold text-charcoal">خصومات كبيرة</h3>
            <p className="text-gold-dark font-semibold">أحدث الموضة</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-beige">
            <div className="text-3xl mb-2">🎀</div>
            <h3 className="font-bold text-charcoal">هدايا مفاجئة</h3>
            <p className="text-gold-dark font-semibold">كل يوم</p>
          </div>
        </div>

        {/* Secret Message Box */}
        <div className="bg-gradient-to-r from-beige/40 to-beige/20 rounded-2xl p-5 mb-6 border border-beige">
          <p className="text-lg font-bold text-charcoal">
            😱 السر؟ مجرد دورة وحدة ممكن تغيّر حظك!
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50/50 rounded-2xl p-5 mb-8 border border-amber-200">
          <p className="font-semibold text-charcoal mb-1">
            🔥 الناس الكل تحكي عليها توّا… ومازالت الفرصة متاحة!
          </p>
          <p className="text-sm text-charcoal/70">
            ⏳ الجوائز محدودة كل يوم — يمكن إنتِ الرابحة الجاية!
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToWheel}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gold-dark hover:bg-gold-dark/90 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span>👇</span>
          <span>اضغطي توّا وجرّبي حظك</span>
          <span>👇</span>
        </button>

        {/* Small print */}
        <p className="text-xs text-charcoal/40 mt-6">
          الجوائز محدودة يوميًا • شاركي مع صديقاتك لزيادة فرصك
        </p>
      </div>
    </section>
  );
}