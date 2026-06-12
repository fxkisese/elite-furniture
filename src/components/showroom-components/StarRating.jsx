import React from 'react';
import { Star } from 'lucide-react';
import './showroom.css';

export default function StarRating({ rating = 0, reviews = 0 }) {
  if (reviews === 0 && rating === 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="w-3.5 h-3.5 fill-[var(--sc-gold)] text-[var(--sc-gold)]" />;
          } else if (i === fullStars && hasHalfStar) {
            // Simple half star hack using svg gradient or just showing a colored stroke
            return (
              <div key={i} className="relative w-3.5 h-3.5">
                <Star className="absolute inset-0 w-3.5 h-3.5 text-[var(--sc-gold)]" />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-3.5 h-3.5 fill-[var(--sc-gold)] text-[var(--sc-gold)]" />
                </div>
              </div>
            );
          }
          return <Star key={i} className="w-3.5 h-3.5 fill-transparent text-[var(--sc-line)]" />;
        })}
      </div>
      <span className="text-[10px] text-[var(--sc-ash)] tracking-wider">
        ({reviews})
      </span>
    </div>
  );
}
