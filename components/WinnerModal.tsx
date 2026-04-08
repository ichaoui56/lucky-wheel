// components/WinnerModal.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Product {
  name: string;
  image: string;
}

interface WinnerModalProps {
  product: Product;
  onClose: () => void;
}

export default function WinnerModal({ product, onClose }: WinnerModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-beige">
          {/* Celebration Animation */}
          <div className="text-7xl mb-6 animate-bounce">🎉</div>

          <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent mb-2">
            Congratulations!
          </h2>

          <p className="text-lg text-charcoal/70 mb-6 font-semibold">
            You&apos;ve won an amazing prize!
          </p>

          {/* Product Image */}
          <div className="relative w-48 h-48 mx-auto mb-6 bg-beige rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Product Name */}
          <div className="bg-gradient-to-br from-cream to-beige rounded-2xl p-6 mb-6 border border-gold/20">
            <p className="text-sm text-charcoal/60 mb-2 font-medium">Your Prize</p>
            <p className="text-2xl font-serif font-bold text-charcoal">
              {product.name}
            </p>
          </div>

          {/* Message */}
          <p className="text-charcoal/70 mb-8 leading-relaxed">
            Check your email for details on how to claim your exclusive reward!
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 bg-charcoal text-white px-6 py-3 rounded-lg font-semibold hover:bg-charcoal/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Claim Prize
            </button>
            <button
              onClick={handleClose}
              className="flex-1 border-2 border-gold text-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-all duration-300 hover:border-gold-dark"
            >
              Spin Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}