import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './showroom.css';

export default function GalleryModal({ images = [], isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(initialIndex);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialIndex]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--sc-ink)] flex flex-col items-center justify-center">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-[var(--sc-paper)]/70 hover:text-[var(--sc-gold)] transition-colors z-[10000] p-2"
        aria-label="Close gallery"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Main Viewport */}
      <div className="relative w-full h-[75vh] md:h-[80vh] flex items-center justify-center">
        {images.length > 1 && (
          <button 
            onClick={handlePrev} 
            className="absolute left-2 md:left-8 z-50 text-[var(--sc-paper)]/40 hover:text-[var(--sc-gold)] p-4 transition-colors"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center overflow-hidden px-16">
          <TransformWrapper
            key={currentIndex}
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
            doubleClick={{ step: 1.5 }}
          >
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={images[currentIndex]} 
                  alt={`Product View ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>

        {images.length > 1 && (
          <button 
            onClick={handleNext} 
            className="absolute right-2 md:right-8 z-50 text-[var(--sc-paper)]/40 hover:text-[var(--sc-gold)] p-4 transition-colors"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto max-w-full px-4 pb-6 sc-scrollbar-hide h-[15vh]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded overflow-hidden flex-shrink-0 transition-all duration-300 ${
                idx === currentIndex 
                  ? 'ring-2 ring-[var(--sc-gold)] scale-105 opacity-100' 
                  : 'opacity-40 hover:opacity-100 ring-1 ring-[var(--sc-line)]'
              }`}
              style={{ width: '64px', height: '64px' }}
            >
              <div className="absolute inset-0 bg-[var(--sc-stone)] -z-10" />
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
