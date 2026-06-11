import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const title = product.title || product.name;
  const image = product.imageUrl || product.image;
  const price = product.price;
  const description = product.description;
  const categoryLabel = product.category?.toUpperCase() || 'PRODUCT';

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article className="group relative rounded-lg overflow-hidden bg-white flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-200">
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden bg-white relative p-2">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100 rounded">No Image</div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#D4AF37] text-white px-3 py-1.5 rounded-full text-xs font-bold">
          {categoryLabel}
        </div>

        {/* Heart Icon */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base line-clamp-2 text-gray-900">{title}</h3>
        
        {description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        )}
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-bold text-[#D4AF37] text-lg">
            {price ? formatPrice(price) : 'Price on Request'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-black text-white py-2.5 px-4 rounded font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group/btn"
        >
          ADD TO CART
          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </article>
  );
}
