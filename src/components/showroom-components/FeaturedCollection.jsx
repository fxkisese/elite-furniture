import { useState } from "react";
import ProductCard from "./ProductCard";
import GalleryModal from "./GalleryModal";
import QuickViewModal from "./QuickViewModal";
import "./showroom.css";

/**
 * FeaturedCollection
 *
 * Premium showroom-style grid for the Craftsman Galore product collection.
 *
 * Props:
 *  - products: array of products (see sampleData.js for the expected shape)
 *  - onAddToCart: (product) => void   — wire this to your cart / Supabase logic
 *  - allProductsHref: string          — link target for "All Products"
 *  - whatsappNumber: string           — international format, digits only, no "+"
 *                                        e.g. "254712345678"
 */
export default function FeaturedCollection({
  products = [],
  onAddToCart,
  allProductsHref = "/shop",
  whatsappNumber = "254793816450",
}) {
  const [gallery, setGallery] = useState(null); // { images, index, name }
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openGallery = (images, index, name) => setGallery({ images, index, name });

  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-8 lg:px-16 sc-font-body">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-[var(--sc-line)] pb-6 mb-10">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--sc-gold)] mb-2">
              Selected Pieces
            </p>
            <h2 className="sc-font-display text-3xl sm:text-5xl font-semibold text-[var(--sc-ink)]">
              Featured Collection
            </h2>
          </div>
          <a
            href={allProductsHref}
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--sc-ink)]"
          >
            All Products
            <span className="block h-px w-6 bg-[var(--sc-gold)] transition-all duration-300 group-hover:w-10" />
          </a>
        </div>

        {/* Product grid — uniform card heights via grid item stretch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.has(product.id)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              onOpenGallery={openGallery}
              onQuickView={() => setQuickViewProduct(product)}
              onAddToCart={onAddToCart}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen gallery */}
      {gallery && (
        <GalleryModal
          images={gallery.images}
          initialIndex={gallery.index}
          productName={gallery.name}
          onClose={() => setGallery(null)}
        />
      )}

      {/* Quick view */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={onAddToCart}
          onOpenGallery={(images, index, name) => {
            setQuickViewProduct(null);
            openGallery(images, index, name);
          }}
          whatsappNumber={whatsappNumber}
        />
      )}
    </section>
  );
}
