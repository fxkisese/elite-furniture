import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function ProductGalleryModal({ images, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-[#D4AF37] transition-colors z-50 p-2"
      >
        <X size={32} />
      </button>

      <div className="relative w-full max-w-6xl h-[75vh] flex items-center justify-center">
        {images.length > 1 && (
          <button onClick={handlePrev} className="absolute left-2 md:left-8 z-50 text-white/50 hover:text-[#D4AF37] p-2 transition-colors">
            <ChevronLeft size={48} />
          </button>
        )}
        
        <div className="w-full h-full flex items-center justify-center overflow-hidden px-12">
          <TransformWrapper
            key={currentIndex}
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={images[currentIndex]} 
                  alt={`Product view ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>

        {images.length > 1 && (
          <button onClick={handleNext} className="absolute right-2 md:right-8 z-50 text-white/50 hover:text-[#D4AF37] p-2 transition-colors">
            <ChevronRight size={48} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto max-w-full px-4 pb-4 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 ${
                idx === currentIndex ? 'ring-2 ring-[#D4AF37] scale-105 opacity-100 shadow-lg shadow-[#D4AF37]/20' : 'opacity-40 hover:opacity-100'
              }`}
              style={{ width: '70px', height: '70px' }}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
