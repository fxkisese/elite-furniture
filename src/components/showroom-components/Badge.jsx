import React from 'react';
import './showroom.css';

export default function Badge({ type }) {
  if (!type) return null;

  const normalizedType = type.toLowerCase();
  let baseStyle = "absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase shadow-md inline-block w-max";

  if (normalizedType === 'new') {
    return <span className={`${baseStyle} bg-[var(--sc-ink)] text-white`}>NEW</span>;
  }
  
  if (normalizedType === 'bestseller' || normalizedType === 'best seller') {
    return <span className={`${baseStyle} bg-[var(--sc-gold)] text-[var(--sc-ink)]`}>BEST SELLER</span>;
  }
  
  if (normalizedType === 'sale') {
    return <span className={`${baseStyle} bg-red-600 text-white`}>SALE</span>;
  }
  
  if (normalizedType === 'limited' || normalizedType === 'limited stock') {
    return <span className={`${baseStyle} bg-orange-600 text-white sc-pulse-anim`}>LIMITED</span>;
  }

  // Fallback
  return <span className={`${baseStyle} bg-[var(--sc-ink)] text-white`}>{type}</span>;
}
