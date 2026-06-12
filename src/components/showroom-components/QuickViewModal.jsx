import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import Badge from './Badge';
import { formatPrice } from '@/lib/utils';
import './showroom.css';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart, whatsappNumber }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const hasMultipleImages = images.length > 1;

  const handleNext = () => setCurrentIndex((p) => (p + 1) % images.length);
  const handlePrev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);

  const discountPercent = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsApp = () => {
    const text = `Hello! I'm interested in the ${product.name} (KSh ${product.price?.toLocaleString()}). Is it available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--sc-ink)]/70 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-5xl bg-[var(--sc-paper)] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/50 backdrop-blur-md rounded-full p-2 text-[var(--sc-ink)] hover:bg-[var(--sc-ink)] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left: Mini Gallery */}
        <div className="w-full md:w-1/2 bg-[var(--sc-stone)] relative flex flex-col min-h-[40vh] md:min-h-[60vh]">
          {product.badges?.map((badge, i) => (
            <Badge key={i} type={badge} />
          ))}

          <div className="flex-1 relative flex items-center justify-center p-8">
            {images[currentIndex] ? (
              <img 
                src={images[currentIndex]} 
                alt={product.name} 
                className="max-w-full max-h-[50vh] object-contain mix-blend-multiply drop-shadow-xl"
              />
            ) : (
              <span className="text-[var(--sc-ash)]">No Image</span>
            )}

            {hasMultipleImages && (
              <>
                <button onClick={handlePrev} className="absolute left-4 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={handleNext} className="absolute right-4 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"><ChevronRight size={20} /></button>
              </>
            )}
          </div>
          
          {hasMultipleImages && (
            <div className="h-24 bg-white/50 backdrop-blur flex items-center justify-center gap-2 px-4 border-t border-[var(--sc-line)]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-16 h-16 rounded overflow-hidden transition-all ${idx === currentIndex ? 'ring-2 ring-[var(--sc-gold)] scale-105' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-[var(--sc-paper)] flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--sc-ash)] mb-2 block">
            {product.category || 'Collection'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--sc-ink)] leading-tight mb-4">
            {product.name}
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            {discountPercent > 0 ? (
              <>
                <span className="text-3xl font-bold text-[var(--sc-gold)]">{formatPrice(product.price)}</span>
                <span className="text-lg text-[var(--sc-ash)] line-through font-medium">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded uppercase tracking-wider">Save {discountPercent}%</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[var(--sc-ink)]">{product.price ? formatPrice(product.price) : 'POA'}</span>
            )}
          </div>

          <p className="text-[var(--sc-ash)] text-sm leading-relaxed mb-8 border-b border-[var(--sc-line)] pb-8">
            {product.description || 'Premium furniture piece designed for modern spaces. Crafted with exceptional materials and attention to detail.'}
          </p>

          <div className="mt-auto space-y-3">
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full py-4 bg-[var(--sc-ink)] text-white text-xs font-bold tracking-widest uppercase hover:bg-[var(--sc-gold)] transition-colors flex items-center justify-center gap-2 rounded-sm"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            
            {whatsappNumber && (
              <button 
                onClick={handleWhatsApp}
                className="w-full py-4 bg-[#25D366]/10 text-[#128C7E] text-xs font-bold tracking-widest uppercase hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <MessageCircle size={16} /> Inquire on WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
