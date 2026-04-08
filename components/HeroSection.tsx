// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="bg-cream pt-32 pb-12 border-b border-beige">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center animate-fade-in">
        <p className="text-sm text-gold-dark font-semibold mb-3 tracking-widest">✨ SPIN TO WIN ✨</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-4 text-balance">
          Medal Legends
        </h1>
        <p className="text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
          Win up to 300 exclusive shopping deals
        </p>
      </div>
    </section>
  );
}