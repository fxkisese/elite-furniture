import { useState, useEffect } from "react";
import { Heart, Eye, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import StarRating from "./StarRating";
import Badge from "./Badge";

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
  const [activeIdx, setActiveIdx] = useState(0);

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

  const piece_price = meta.piece_price || product.piece_price;
  const size = meta.size || product.size;
  const combo_items = meta.combo_items || [];

  // Merge images from metadata (admin upload) and product.images array
  const metaImages = meta.images && meta.images.length > 0 ? meta.images : null;
  const productImages = product.images && product.images.length > 0 ? product.images : null;
  const fallback = product.image ? [product.image] : [];
  const displayImages = metaImages || productImages || fallback;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in the "${name}" (Ksh ${(Number(price) || 0).toLocaleString()}). Is it available?`
  )}`;

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((i) => (i - 1 + displayImages.length) % displayImages.length);
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((i) => (i + 1) % displayImages.length);
  };

  // Automatic slideshow effect
  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % displayImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <article className="relative flex flex-col h-full bg-white border border-[var(--sc-line)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_25px_60px_-20px_rgba(11,11,12,0.35)]">
      {/* Image area */}
      <div
        className="group relative aspect-[4/3] bg-[var(--sc-stone)] overflow-hidden cursor-zoom-in"
        onClick={() => onOpenGallery(displayImages, activeIdx, name)}
      >
        {!loaded && <div className="absolute inset-0 sc-skeleton" />}

        {/* Current image */}
        <img
          key={displayImages[activeIdx]}
          src={displayImages[activeIdx]}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Prev / Next arrows — only when multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--sc-gold)] hover:text-black"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--sc-gold)] hover:text-black"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeIdx ? "bg-[var(--sc-gold)] w-3" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Gallery-frame corners */}
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

        {combo_items && combo_items.length > 0 && (
          <div className="mt-1 bg-gray-50 p-3 border border-gray-100 rounded-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1.5">Combo Includes:</p>
            <ul className="space-y-1">
              {combo_items.map((ci, i) => (
                <li key={i} className="text-xs text-gray-600 flex justify-between">
                  <span>• {ci.name}</span>
                  <span>
                    {ci.discount ? <span className="line-through text-gray-400 mr-1">KSh {Number(ci.price).toLocaleString()}</span> : null}
                    <span className="font-semibold text-gray-800">KSh {(Number(ci.price) - (Number(ci.discount) || 0)).toLocaleString()}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
          {piece_price && (
            <span className="text-sm text-[var(--sc-ash)] ml-1 border-l border-gray-300 pl-2">
              Ksh {(Number(piece_price) || 0).toLocaleString()} / piece
            </span>
          )}
          {hasDiscount && (
            <span className="text-[11px] font-semibold bg-[var(--sc-gold)] text-[var(--sc-ink)] px-2 py-0.5 rounded-none">
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
