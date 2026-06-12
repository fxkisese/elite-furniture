import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, MessageCircle, Maximize2 } from 'lucide-react';
import StarRating from './StarRating';
import Badge from './Badge';
import './showroom.css';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onGalleryOpen, 
  onAddToCart,
  whatsappNumber
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [''];
  const mainImage = images[0];

  const hasDiscount = product.originalPrice && product.price < product.originalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (!whatsappNumber) return;
    const text = `Hello! I'm interested in the ${product.name} (KSh ${product.price?.toLocaleString()}). Is it available?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <article className="group flex flex-col h-full bg-[var(--sc-paper)] border border-[var(--sc-line)] hover:border-[var(--sc-gold)] transition-colors duration-500 rounded-lg overflow-hidden relative">
      
      {/* Top Overlays */}
      <div className="absolute top-0 left-0 w-full p-4 flex flex-col items-start gap-2 z-10 pointer-events-none">
        {product.badges?.map((badge, idx) => (
          <Badge key={idx} type={badge} />
        ))}
        
        {hasDiscount && (
          <span className="bg-red-600 text-white px-2.5 py-1 rounded-[2px] text-[10px] font-bold tracking-widest uppercase shadow-sm pointer-events-auto">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Image Section */}
      <div 
        className="relative w-full aspect-[4/3] bg-[var(--sc-stone)] overflow-hidden cursor-pointer flex-shrink-0 flex items-center justify-center p-6 sc-hover-frame"
        onClick={() => onGalleryOpen(product)}
      >
        {!imgLoaded && mainImage && (
          <div className="absolute inset-0 sc-skeleton" />
        )}
        
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.name} 
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-110 drop-shadow-sm mix-blend-multiply ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <span className="text-[var(--sc-ash)] text-xs uppercase tracking-widest">No Image</span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="bg-white/95 backdrop-blur-sm text-[var(--sc-ink)] px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-[var(--sc-gold)] hover:text-white pointer-events-auto"
          >
            <Maximize2 size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-1 bg-[var(--sc-paper)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--sc-ash)] text-[9px] font-bold tracking-[0.2em] uppercase truncate pr-4">
            {product.category || 'Collection'}
          </span>
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-[var(--sc-ink)] mb-1 group-hover:text-[var(--sc-gold)] transition-colors">
          {product.name}
        </h3>
        
        {/* Pricing */}
        <div className="mt-auto pt-4 flex flex-col gap-1">
          {hasDiscount ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[var(--sc-gold)] text-lg">
                {formatPrice(product.price)}
              </span>
              <span className="text-[var(--sc-ash)] text-xs line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-[var(--sc-ink)] text-lg">
              {product.price ? formatPrice(product.price) : 'Price on Request'}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-5 gap-2 opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="col-span-4 bg-[var(--sc-ink)] text-white py-2.5 px-4 rounded-[3px] text-[10px] font-bold tracking-widest uppercase hover:bg-[var(--sc-gold)] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
          
          {whatsappNumber && (
            <button 
              onClick={handleWhatsApp}
              className="col-span-1 bg-[#25D366]/10 text-[#25D366] py-2.5 rounded-[3px] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
              title="Inquire on WhatsApp"
            >
              <MessageCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
