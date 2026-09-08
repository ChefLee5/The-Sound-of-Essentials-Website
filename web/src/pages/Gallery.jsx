import React, { useEffect } from 'react';
import KineticScrollGallery from '@/components/ui/kinetic-scroll-gallery';

export default function Gallery() {
  useEffect(() => {
    document.title = 'Sample Pages — Rhythm Quest Storybook — The Sound of Essentials';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className="gallery-page" 
      style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        background: 'radial-gradient(ellipse at 50% 0%, #FFF3E0 0%, #FFF8F0 45%, #FFFDF9 100%)',
        color: 'var(--color-text-primary, #E65100)'
      }}
    >
      {/* Kinetic Scroll Gallery Component */}
      <KineticScrollGallery />
    </div>
  );
}
