import React, { useEffect } from 'react';
import KineticScrollGallery from '@/components/ui/kinetic-scroll-gallery';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Gallery() {
  usePageMeta({
    title: 'Sample Pages — Rhythm Quest Storybook — The Sound of Essentials',
    description: 'Preview illustrated spreads and characters from The Sound of Essentials: Rhythm Quest storybook and picture dictionary.',
    canonicalPath: '/gallery',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-page" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Kinetic Scroll Gallery Component */}
      <KineticScrollGallery />
    </div>
  );
}
