// components/ShoppingGuide.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ShoppingGuide() {
  const [expanded, setExpanded] = useState(false);

  const fullContent = {
    title: "دليل التسوق الذكي من شي إن في تونس - صيف 2026",
    sections: [
      {
        heading: "أولاً: اختيار المقاسات الصحيحة (The Size Guide)",
        text: "من أكبر التحديات التي تواجه المتسوق التونسي هو اختلاف المقاسات العالمية. ننصح دائماً باستخدام 'جدول المقاسات' الموجود أسفل كل قطعة ملابس بدلاً من الاعتماد على المقاس المعتاد (S/M/L). من الضروري قياس محيط الصدر والخصر بالسنتيمتر ومقارنتها بالجدول بدقة. لا تنسَ قراءة تعليقات المستخدمين الآخرين، فهي تعطي فكرة واقعية عما إذا كان القماش يتمدد أو إذا كان المقاس أصغر أو أكبر من المعتاد، مما يجعلك تتجنبين عناء استرجاع الطلبية."
      },
      {
        heading: "ثانياً: الشحن والجمارك في تونس (Shipping & Customs)",
        text: "عند الطلب من شي إن إلى تونس، يفضل تقسيم الطلبيات الكبيرة إلى طلبيات أصغر لا تتجاوز قيمتها مبالغ معينة لتجنب التأخير الطويل في الديوانة (الجمارك التونسية). استخدام شركات الشحن العالمية يضمن لك تتبع الشحنة بدقة عبر تطبيق الهاتف من لحظة خروجها من المستودع في الصين حتى وصولها إلى باب منزلك في تونس أو سوسة أو صفاقس. الصبر هو المفتاح عند التعامل مع الشحن الدولي، لكن النتيجة تستحق الانتظار."
      },
      {
        heading: "ثالثاً: كيف توفر المال وتجمع النقاط؟ (How to Save)",
        text: "التسوق الذكي يعني استخدام النقاط والقسائم بذكاء. توفر شي إن برنامج نقاط مكافئ، حيث يمكنك جمع النقاط من خلال تسجيل الدخول اليومي أو تقييم المنتجات بعد استلامها وإضافة صور حقيقية. بالإضافة إلى ذلك، المشاركة في الفعاليات التفاعلية (مثل عجلة الحظ التي نقدمها هنا) تمنحك فرصة ذهبية للحصول على قسائم شراء قد تصل قيمتها إلى مبالغ كبيرة، مما يقلل من التكلفة الإجمالية لطلبيتك بشكل مذهل ويجعل الموضة العالمية في متناول الجميع."
      },
      {
        heading: "رابعاً: مجتمع الموضة في تونس (The Local Community)",
        text: "أصبح لمحبي شي إن في تونس مجموعات كبيرة على وسائل التواصل الاجتماعي لتبادل الخبرات والصور الحقيقية للملابس. المشاركة في هذه المجتمعات تساعدك على معرفة جودة الأقمشة قبل الشراء. كما نلاحظ أن الذوق التونسي يميل لدمج اللمسات العصرية مع الإكسسوارات التقليدية، وهو ما توفره شي إن بتشكيلات واسعة تناسب جميع الأذواق والأعمار، من ملابس الأطفال إلى الأزياء الرجالية والنسائية الراقية."
      },
      {
        heading: "خامساً: صيحات الموضة لصيف 2026 (2026 Trends)",
        text: "هذا العام، تبرز الألوان الزاهية والمبهجة مثل الأخضر الزمردي والأصفر الليموني. كما نلاحظ عودة قوية للأقمشة الطبيعية والمريحة مثل الكتان والقطن الخالص، والتي تناسب المناخ المتوسطي الحار في تونس. استثمر في القطع الأساسية (Basics) التي يمكن تنسيقها بأكثر من طريقة للحصول على خزانة ملابس متجددة يومياً بأقل التكاليف الممكنة."
      }
    ]
  };

  const truncatedSections = fullContent.sections.slice(0, 2);
  const displayedSections = expanded ? fullContent.sections : truncatedSections;

  // Replace with your actual image path or use a placeholder service
  const imageUrl = "/blogs/shopping-guide-placeholder.jpg"; // Your horizontal image
  // Or use an online placeholder: "https://placehold.co/800x450/DFD5C5/6a4020?text=SHEIN+Shopping+Guide"

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-beige mb-12">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Section - Horizontal image with 16:9 container */}
        <div className="relative bg-gradient-to-br p-10 from-beige to-cream md:order-first order-first">
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl}
              alt="دليل التسوق الذكي من شي إن"
              fill
              className="object-cover rounded-2xl mt-12"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Optional: subtle gradient overlay for text if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Text Content Section */}
        <div className="p-6 md:p-8" dir="rtl">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
              {fullContent.title}
            </h2>
            <div className="w-20 h-0.5 bg-gold-dark mb-4"></div>
          </div>

          <div className="space-y-5 text-gray-700 leading-relaxed">
            {displayedSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-gold-dark mb-2">{section.heading}</h3>
                <p className="text-sm">{section.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-6 inline-flex items-center gap-2 text-gold-dark font-semibold hover:text-gold transition-colors"
          >
            {expanded ? "إظهار أقل ↑" : "اقرأ المزيد ←"}
          </button>
        </div>
      </div>
    </div>
  );
}