import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ height: '350px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-light)' }}>No Image Available</span>
      </div>
    );
  }

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', backgroundColor: '#000' }}>
      <img
        src={images[currentIndex]}
        alt={`Item slide ${currentIndex + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center' }}
            aria-label="Previous slide image"
          >
            <FaChevronLeft style={{ color: '#000' }} />
          </button>
          
          <button
            onClick={nextSlide}
            style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center' }}
            aria-label="Next slide image"
          >
            <FaChevronRight style={{ color: '#000' }} />
          </button>

          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', color: '#fff', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
