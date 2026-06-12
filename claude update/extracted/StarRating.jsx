import { Star } from "lucide-react";

/**
 * StarRating
 * Renders a 5-star rating with partial fills (supports decimals like 4.6)
 * plus an optional review count.
 *
 * Props:
 *  - rating: number (0-5)
 *  - reviews: number (review count, optional)
 *  - size: icon size in px (default 14)
 */
export default function StarRating({ rating = 0, reviews = 0, size = 14 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((s) => {
          const fill = Math.max(0, Math.min(1, rating - (s - 1)));
          return (
            <span
              key={s}
              className="relative inline-block shrink-0"
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                strokeWidth={1.5}
                className="absolute inset-0 text-[var(--sc-line)]"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  size={size}
                  strokeWidth={1.5}
                  className="text-[var(--sc-gold)] fill-[var(--sc-gold)]"
                />
              </span>
            </span>
          );
        })}
      </div>
      {reviews > 0 && (
        <span className="text-xs sc-font-body text-[var(--sc-ash)]">
          {rating.toFixed(1)} ({reviews})
        </span>
      )}
    </div>
  );
}
