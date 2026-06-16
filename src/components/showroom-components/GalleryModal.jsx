import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const distance = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

/**
 * GalleryModal
 *
 * Fullscreen image gallery for a single product.
 *
 * Props:
 *  - images: string[]        — all images uploaded for this product
 *  - productName: string
 *  - initialIndex: number    — which image to open on
 *  - onClose: () => void
 *
 * Interactions:
 *  - Desktop: mouse wheel zooms in/out, drag to pan when zoomed,
 *             arrow buttons / keyboard arrows to switch images
 *  - Mobile:  pinch with two fingers to zoom, drag to pan when zoomed,
 *             swipe left/right to switch images when not zoomed
 *  - Double-click / double-tap toggles zoom
 */
export default function GalleryModal({ images, productName, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const goTo = (i) => {
    const next = (i + images.length) % images.length;
    setIndex(next);
    resetZoom();
  };

  /* ---------------- Desktop: mouse wheel zoom ---------------- */
  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setScale((s) => clamp(s + delta, MIN_SCALE, MAX_SCALE));
  };

  /* ---------------- Desktop: drag to pan when zoomed ---------------- */
  const onMouseDown = (e) => {
    if (scale <= 1) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: translate };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setTranslate({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
  };
  const onMouseUp = () => {
    dragRef.current = null;
  };

  /* ---------------- Mobile: pinch zoom, pan, swipe ---------------- */
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchRef.current = { startDist: distance(e.touches[0], e.touches[1]), startScale: scale };
    } else if (e.touches.length === 1) {
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        origin: translate,
        time: Date.now(),
      };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const newDist = distance(e.touches[0], e.touches[1]);
      const ratio = newDist / pinchRef.current.startDist;
      setScale(clamp(pinchRef.current.startScale * ratio, MIN_SCALE, MAX_SCALE));
    } else if (e.touches.length === 1 && dragRef.current && scale > 1) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setTranslate({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
    }
  };

  const onTouchEnd = (e) => {
    if (dragRef.current && scale <= 1 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - dragRef.current.startX;
      const elapsed = Date.now() - dragRef.current.time;
      if (Math.abs(dx) > 60 && elapsed < 500 && images.length > 1) {
        dx > 0 ? goTo(index - 1) : goTo(index + 1);
      }
    }
    dragRef.current = null;
    pinchRef.current = null;
  };

  const onDoubleClick = () => {
    if (scale > 1) resetZoom();
    else setScale(2.2);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 sc-fade-in flex flex-col sc-font-body"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--sc-gold)]">{productName}</p>
          <p className="text-xs text-white/50 mt-0.5">
            {index + 1} / {images.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => clamp(s - 0.5, MIN_SCALE, MAX_SCALE))}
            aria-label="Zoom out"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)] transition-colors"
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => clamp(s + 0.5, MIN_SCALE, MAX_SCALE))}
            aria-label="Zoom in"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)] transition-colors"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Go back"
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-white/10 hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)] transition-colors text-xs uppercase tracking-[0.1em] font-medium"
          >
            <ArrowLeft size={16} /> GO BACK
          </button>
        </div>
      </div>

      {/* Main image */}
      <div
        className="relative flex-1 overflow-hidden flex items-center justify-center select-none"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={images[index]}
          alt={`${productName} — view ${index + 1}`}
          draggable={false}
          className="sc-zoom-image max-h-full max-w-full object-contain"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)] transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-[var(--sc-gold)] hover:text-[var(--sc-ink)] transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sc-thumb-scroll px-4 sm:px-6 py-4">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden border-2 transition-colors ${
                i === index
                  ? "border-[var(--sc-gold)]"
                  : "border-white/10 opacity-50 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
