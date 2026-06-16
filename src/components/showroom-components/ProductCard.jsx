import { useState } from "react";
import { Heart, Eye, ShoppingCart, MessageCircle } from "lucide-react";
import StarRating from "./StarRating";
import Badge from "./Badge";

/**
 * ProductCard
 *
 * Expected `product` shape:
 * {
 *   id: string | number,
 *   category: string,
 *   name: string,
 *   description?: string,
 *   images: string[],          // first image is used as the card cover
 *   price: number,
 *   originalPrice?: number,    // if set and > price, shows strike-through + % off
 *   rating?: number,           // 0-5
 *   reviews?: number,
 *   badges?: ("new" | "bestseller" | "sale" | "limited")[],
 * }
 */
export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onOpenGallery,
  onQuickView,
  onAddToCart,
  whatsappNumber,
}) {
  const [loaded, setLoaded] = useState(false);

  const {
    category,
    name,
    description,
    images = [],
    price,
    originalPrice,
    rating = 0,
    reviews = 0,
    badges = [],
    size,
  } = product;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in the "${name}" (Ksh ${(Number(price) || 0).toLocaleString()}). Is it available?`
  )}`;

  return (
    <article className="relative flex flex-col h-full bg-white border border-[var(--sc-line)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_25px_60px_-20px_rgba(11,11,12,0.35)]">
      {/* Image / gallery trigger */}
      <div
        className="group relative aspect-[4/3] bg-[var(--sc-stone)] overflow-hidden cursor-zoom-in"
        onClick={() => onOpenGallery(images, 0, name)}
      >
        {!loaded && <div className="absolute inset-0 sc-skeleton" />}

        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-[transform,opacity] duration-700 ease-out group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gallery-frame corners (signature hover detail) */}
        <span className="sc-corner sc-corner-tl" />
        <span className="sc-corner sc-corner-tr" />
        <span className="sc-corner sc-corner-bl" />
        <span className="sc-corner sc-corner-br" />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          aria-label="Save to wishlist"
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={
              isWishlisted
                ? "fill-[var(--sc-gold)] text-[var(--sc-gold)]"
                : "text-[var(--sc-ink)]"
            }
          />
        </button>

        {/* Quick view */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="w-full flex items-center justify-center gap-2 bg-[var(--sc-ink)]/90 text-white text-xs uppercase tracking-[0.2em] py-3 hover:bg-[var(--sc-ink)] transition-colors"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--sc-gold)]">
          {category}
        </p>
        <h3 className="sc-font-display text-lg sm:text-xl text-[var(--sc-ink)] leading-snug">
          {name}
        </h3>

        <StarRating rating={rating} reviews={reviews} />

        {description && (
          <p className="sc-line-clamp-2 text-sm text-[var(--sc-ash)] leading-relaxed flex-1">
            {description}
          </p>
        )}

        {size && (
          <p className="text-[11px] font-semibold text-[var(--sc-gold)] mt-[-4px]">
            Size: <span className="text-[var(--sc-ash)] font-normal">{size}</span>
          </p>
        )}

        {/* Price block */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {hasDiscount && (
            <span className="text-sm line-through text-[var(--sc-ash)]">
              Ksh {(Number(originalPrice) || 0).toLocaleString()}
            </span>
          )}
          <span className="sc-font-display text-xl text-[var(--sc-ink)]">
            Ksh {(Number(price) || 0).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[11px] font-semibold bg-[var(--sc-gold)] text-[var(--sc-ink)] px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--sc-ink)] text-white text-xs sm:text-sm uppercase tracking-[0.15em] py-3 transition-colors hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)]"
          >
            <ShoppingCart size={15} /> Add to Cart
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            aria-label="Ask about this product on WhatsApp"
            className="w-11 h-11 flex items-center justify-center border border-[var(--sc-ink)] text-[var(--sc-ink)] hover:border-[var(--sc-gold)] hover:text-[var(--sc-gold)] transition-colors"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
