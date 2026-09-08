import React, { useEffect } from 'react';
import KineticScrollGallery from '@/components/ui/kinetic-scroll-gallery';

export default function Gallery() {
  useEffect(() => {
    document.title = 'Sample Pages — Rhythm Quest Storybook — The Sound of Essentials';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-page" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Kinetic Scroll Gallery Component */}
      <KineticScrollGallery />
    </div>
  );
}
