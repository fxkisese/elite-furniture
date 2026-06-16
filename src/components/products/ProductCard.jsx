import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingCart, MessageCircle, Maximize2, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import ProductGalleryModal from './ProductGalleryModal';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const { addToCart } = useCart();

  if (!product) return null;

  // Extract metadata for multiple images from delivery_outside if necessary
  let meta = {};
  try { meta = JSON.parse(product.delivery_outside || '{}').metadata || {}; } catch(e) {}

  const title = product.title || product.name;
  const image = product.imageUrl || product.image;
  
  const metaImages = meta.images && meta.images.length > 0 ? meta.images : null;
  const productImages = product.images && product.images.length > 0 ? product.images : null;
  const fallback = image ? [image] : [];
  const images = metaImages || productImages || fallback;
  
  const price = product.price;
  const discountPrice = product.discount_price;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  
  const badge = product.badge;
  const rating = product.rating || 5.0;
  const reviewCount = product.review_count || 0;
  
  const categoryLabel = product.category?.toUpperCase() || 'PRODUCT';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hello, I'm interested in the ${title} from Furniture Elite Space.`;
    window.open(`https://wa.me/254793816450?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openGallery = (e) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((i) => (i + 1) % images.length);
  };

  // Automatic slideshow effect
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <article className="group relative rounded-xl overflow-hidden bg-white flex flex-col h-full hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border border-gray-100">
        {/* Image Container */}
        <div 
          className="relative w-full aspect-[4/3] bg-[#F9F9F9] overflow-hidden cursor-pointer"
          onClick={openGallery}
        >
          {images.length > 0 ? (
            <img 
              key={images[activeIdx]}
              src={images[activeIdx]} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
          )}

          {/* Prev / Next arrows & Dots */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-md text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-md text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === activeIdx ? "bg-[#D4AF37] w-3" : "bg-black/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Top Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
            {badge && (
              badge === 'Best Seller' ? (
                <span className="bg-[#D4AF37] text-[#0A0A0A] px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-md inline-flex items-center gap-1 w-max">
                  <Award className="w-3 h-3" /> {badge}
                </span>
              ) : (
                <span className="bg-[#0A0A0A] text-white px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-md inline-block w-max">
                  {badge}
                </span>
              )
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-md inline-block w-max">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 z-10"
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* Quick View Button (Hover) */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-0">
            <button className="bg-white/95 backdrop-blur-sm text-[#0A0A0A] px-6 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl pointer-events-auto hover:bg-[#D4AF37] hover:text-white">
              <Maximize2 size={14} /> QUICK VIEW
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#888888] text-[10px] font-bold tracking-widest uppercase">
              {categoryLabel}
            </span>
            {reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="text-xs font-medium text-gray-600">{rating}</span>
                <span className="text-[10px] text-gray-400">({reviewCount})</span>
              </div>
            )}
          </div>

          <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-[#0A0A0A] mb-2 group-hover:text-[#D4AF37] transition-colors">
            {title}
          </h3>
          
          <div className="mt-auto pt-4 flex flex-col gap-1">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#D4AF37] text-lg">
                  {formatPrice(discountPrice)}
                </span>
                <span className="text-gray-400 text-xs line-through font-medium">
                  {formatPrice(price)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-[#0A0A0A] text-lg">
                {price ? formatPrice(price) : 'Price on Request'}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 grid grid-cols-5 gap-2">
            <button 
              onClick={handleAddToCart}
              className="col-span-4 bg-[#0A0A0A] text-white py-3 px-4 rounded-md text-[11px] font-bold tracking-widest hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2 group/btn shadow-md"
            >
              ADD TO CART
              <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            </button>
            <button 
              onClick={handleWhatsApp}
              className="col-span-1 bg-[#25D366]/10 text-[#25D366] py-3 rounded-md flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors shadow-sm"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>

      <ProductGalleryModal 
        images={images} 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
      />
    </>
  );
}
