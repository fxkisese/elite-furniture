import { useState } from "react";
import { X, ShoppingCart, MessageCircle } from "lucide-react";
import StarRating from "./StarRating";
import Badge from "./Badge";

/**
 * QuickViewModal
 */
export default function QuickViewModal({ product, onClose, onAddToCart, onOpenGallery, whatsappNumber }) {
  const [activeImage, setActiveImage] = useState(0);

  let meta = {};
  try { meta = JSON.parse(product.delivery_outside || '{}').metadata || {}; } catch(e) {}

  const {
    category,
    name,
    description,
    price,
    originalPrice,
    rating = 0,
    reviews = 0,
    badges = [],
  } = product;

  const images = meta.images && meta.images.length > 0 ? meta.images : (product.images || []);
  const piece_price = meta.piece_price || product.piece_price;
  const size = meta.size || product.size;
  const combo_items = meta.combo_items || [];

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;

  const currentImage = images.length > 0 ? images[0] : (product.image || "");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in the "${name}" (Ksh ${price.toLocaleString()}). Is it available?${currentImage ? `\n\nImage: ${currentImage}` : ""}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 sm:p-6 sc-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto sc-scale-in grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — visible on all screen sizes, top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors text-black"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Image side */}
        <div className="bg-[var(--sc-stone)] flex flex-col">
          <div
            className="relative aspect-square cursor-zoom-in"
            onClick={() => onOpenGallery(images, activeImage, name)}
          >
            <img
              src={images[activeImage]}
              alt={name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
            {badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {badges.map((b) => (
                  <Badge key={b} type={b} />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto sc-thumb-scroll">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 border-2 overflow-hidden transition-colors ${
                    i === activeImage
                      ? "border-[var(--sc-gold)]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details side */}
        <div className="p-6 sm:p-8 flex flex-col gap-3 sc-font-body relative">

          <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--sc-gold)]">{category}</p>
          <h2 className="sc-font-display text-2xl sm:text-3xl text-[var(--sc-ink)] leading-snug pr-8">
            {name}
          </h2>

          <StarRating rating={rating} reviews={reviews} size={16} />

          {description && (
            <p className="text-sm text-[var(--sc-ash)] leading-relaxed">{description}</p>
          )}

          <div className="flex items-baseline gap-3 flex-wrap pt-1">
            {hasDiscount && (
              <span className="line-through text-[var(--sc-ash)]">
                Ksh {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="sc-font-display text-3xl text-[var(--sc-ink)]">
              Ksh {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs font-semibold bg-[var(--sc-gold)] text-[var(--sc-ink)] px-2.5 py-1 rounded-full">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4">
            <button
              type="button"
              onClick={() => onAddToCart?.(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--sc-ink)] text-white py-3 px-6 uppercase text-sm tracking-[0.15em] transition-colors hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)]"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border border-[var(--sc-ink)] text-[var(--sc-ink)] py-3 px-6 uppercase text-sm tracking-[0.15em] transition-colors hover:border-[var(--sc-gold)] hover:text-[var(--sc-gold)]"
            >
              <MessageCircle size={16} /> Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
