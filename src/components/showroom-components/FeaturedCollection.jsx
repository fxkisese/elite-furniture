import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import GalleryModal from './GalleryModal';
import QuickViewModal from './QuickViewModal';
import './showroom.css';

export default function FeaturedCollection({ products = [], whatsappNumber, allProductsHref = '/products', onAddToCart }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [galleryProduct, setGalleryProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <section className="bg-[var(--sc-paper)] py-20 px-8 text-center">
        <p className="text-[var(--sc-ash)] text-sm tracking-widest uppercase">No featured pieces currently available.</p>
      </section>
    );
  }

  return (
    <section className="bg-[var(--sc-paper)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[var(--sc-line)] gap-6">
          <div>
            <span className="block text-[10px] tracking-[0.2em] font-bold text-[var(--sc-gold)] uppercase mb-2">
              Selected Pieces
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sc-ink)] tracking-tight">
              Featured Collection
            </h2>
          </div>
          
          <a 
            href={allProductsHref}
            className="group flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] text-[var(--sc-ink)] hover:text-[var(--sc-gold)] transition-colors uppercase"
          >
            View Entire Collection 
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard 
                product={product}
                onQuickView={setQuickViewProduct}
                onGalleryOpen={setGalleryProduct}
                onAddToCart={onAddToCart}
                whatsappNumber={whatsappNumber}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Modals */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={onAddToCart}
        whatsappNumber={whatsappNumber}
      />
      
      <GalleryModal 
        images={galleryProduct?.images || []} 
        isOpen={!!galleryProduct} 
        onClose={() => setGalleryProduct(null)} 
      />
    </section>
  );
}
