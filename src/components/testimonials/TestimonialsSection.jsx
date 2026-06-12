import React, { useState, useEffect, useCallback, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonialsData, reviewSummary } from "./testimonialsData";
import "./testimonials.css";

/* -----------------------------------------------------------------------
   Initials Avatar (fallback when profile_photo_url is null)
   ----------------------------------------------------------------------- */
function InitialsAvatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="tm-avatar-ring"
      style={{
        width: 48, height: 48, borderRadius: "50%",
        backgroundColor: "#1A1A1A",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Inter, sans-serif", fontWeight: 700,
        fontSize: 14, letterSpacing: "0.05em",
        color: "#D4AF37", flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* -----------------------------------------------------------------------
   Star Rating (gold fill, muted empty)
   ----------------------------------------------------------------------- */
function Stars({ rating = 5 }) {
  return (
    <div style={{ display: "flex", gap: 3 }} className="tm-star-shimmer">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          fill={i <= rating ? "#D4AF37" : "transparent"}
          color={i <= rating ? "#D4AF37" : "#333333"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------
   Google "G" badge
   ----------------------------------------------------------------------- */
function GoogleBadge() {
  return (
    <div
      className="tm-google-badge"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 20,
        fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
        color: "#AAAAAA", textTransform: "uppercase",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Google
    </div>
  );
}

/* -----------------------------------------------------------------------
   MAIN: TestimonialsSection
   ----------------------------------------------------------------------- */
export default function TestimonialsSection({
  reviews = testimonialsData,
  summary = reviewSummary,
  autoplayInterval = 5000,
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const touchStartX = useRef(0);

  const total = reviews.length;

  /* -- Navigation helpers -- */
  const goTo = useCallback(
    (idx) => {
      setActiveIdx((idx + total) % total);
      setProgress(0);
    },
    [total]
  );
  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);
  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);

  /* -- Autoplay -- */
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / autoplayInterval) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        next();
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [activeIdx, isPaused, autoplayInterval, next, total]);

  /* -- Keyboard navigation -- */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  /* -- Touch/swipe support -- */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  };

  const review = reviews[activeIdx];

  return (
    <section
      style={{ backgroundColor: "var(--tm-bg)", padding: "6rem 2rem", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Client Testimonials"
    >
      {/* Subtle background texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Eyebrow */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            className="tm-body-font"
            style={{
              fontSize: 10, letterSpacing: "0.3em", color: "var(--tm-ash)",
              textTransform: "uppercase", fontWeight: 600,
            }}
          >
            Client Testimonials
          </span>
        </div>

        {/* Quote icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Quote size={32} color="#D4AF37" strokeWidth={1} style={{ opacity: 0.3 }} />
        </div>

        {/* Review body */}
        <div key={activeIdx} className="tm-fade-in" style={{ textAlign: "center" }}>
          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Stars rating={review.rating} />
          </div>

          {/* Quote text */}
          <blockquote
            className="tm-quote-font"
            style={{
              fontSize: "clamp(1.15rem, 2.5vw, 1.7rem)",
              fontWeight: 300,
              lineHeight: 1.6,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              margin: "0 auto 2rem",
              maxWidth: 680,
              fontStyle: "italic",
            }}
          >
            "{review.text}"
          </blockquote>

          {/* Author */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            marginBottom: "0.5rem",
          }}>
            {review.profile_photo_url ? (
              <img
                src={review.profile_photo_url}
                alt={review.author_name}
                style={{
                  width: 48, height: 48, borderRadius: "50%", objectFit: "cover",
                }}
                className="tm-avatar-ring"
              />
            ) : (
              <InitialsAvatar name={review.author_name} />
            )}
            <div style={{ textAlign: "left" }}>
              <div
                className="tm-body-font"
                style={{
                  fontWeight: 600, fontSize: 13, color: "#FFFFFF",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}
              >
                {review.author_name}
              </div>
              {review.role && (
                <div style={{ fontSize: 11, color: "var(--tm-ash)", letterSpacing: "0.05em" }}>
                  {review.role}
                </div>
              )}
            </div>
          </div>

          {/* Source badge */}
          {review.source === "google" && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <GoogleBadge />
            </div>
          )}
        </div>

        {/* Navigation: arrows + dots */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 16, marginTop: "3rem",
        }}>
          {/* Prev */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            style={{
              background: "transparent", border: "1px solid #2A2A2A",
              color: "#666", cursor: "pointer", padding: 8,
              borderRadius: 4, display: "flex", alignItems: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#666"; }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots (dash style) */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === activeIdx ? 28 : 8,
                  height: 2,
                  backgroundColor: i === activeIdx ? "#FFFFFF" : "#333333",
                  border: "none", cursor: "pointer", padding: 0,
                  borderRadius: 1,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            style={{
              background: "transparent", border: "1px solid #2A2A2A",
              color: "#666", cursor: "pointer", padding: 8,
              borderRadius: 4, display: "flex", alignItems: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#666"; }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Autoplay progress bar */}
        {total > 1 && (
          <div style={{
            width: 120, height: 2, backgroundColor: "#1A1A1A",
            margin: "1rem auto 0", borderRadius: 1, overflow: "hidden",
          }}>
            <div
              className="tm-progress-bar"
              style={{ width: `${progress}%`, height: "100%" }}
            />
          </div>
        )}

        {/* Summary row */}
        {summary && (
          <div
            className="tm-count-up"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 16, marginTop: "3rem", paddingTop: "2rem",
              borderTop: "1px solid #1A1A1A",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <span
                className="tm-body-font"
                style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 18 }}
              >
                {summary.averageRating}
              </span>
            </div>
            <div style={{ width: 1, height: 20, backgroundColor: "#2A2A2A" }} />
            <span
              className="tm-body-font"
              style={{ color: "var(--tm-ash)", fontSize: 12, letterSpacing: "0.05em" }}
            >
              Based on{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>
                {summary.totalReviews}
              </span>{" "}
              {summary.source}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
