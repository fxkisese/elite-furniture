import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingCart, MessageCircle, Maximize2, Star, Award } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import ProductGalleryModal from './ProductGalleryModal';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const title = product.title || product.name;
  const image = product.imageUrl || product.image;
  const images = product.images && product.images.length > 0 ? product.images : (image ? [image] : []);
  
  const price = product.price;
  const discountPrice = product.discount_price;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  
  const badge = product.badge;
  const rating = product.rating || 5.0;
  const reviewCount = product.review_count || 0;
  
  const description = product.description;
  const categoryLabel = product.category?.toUpperCase() || 'PRODUCT';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hello, I'm interested in the ${title} from Furniture Elite Space.`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openGallery = (e) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

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
              src={images[0]} 
              alt={title} 
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
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
