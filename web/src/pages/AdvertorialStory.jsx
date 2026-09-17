import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';

const AdvertorialStory = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('11200px');

  useEffect(() => {
    document.title = 'More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read — and It Starts with Sound, Not Screens';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Leaving behind the frenetic noise of autoplay loops, our quest enters a neuro-affirming sanctuary—anchoring early childhood literacy and math to calm, acoustic rhythms during the brain\'s golden window.';

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/story';

    window.scrollTo(0, 0);

    // Listen for resize messages from the embedded exact Landra clone
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'LANDRA_RESIZE' && event.data.height > 0) {
        setIframeHeight(`${event.data.height + 40}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read — and It Starts with Sound, Not Screens',
      'description': 'Leaving behind the frenetic noise of autoplay loops, our quest enters a neuro-affirming sanctuary—anchoring early childhood literacy and math to calm, acoustic rhythms during the brain’s golden window, completely free from ads, algorithms, and dopamine traps.',
      'author': {
        '@type': 'Person',
        'name': 'Ivy W.',
        'jobTitle': 'Early Literacy & Pediatric Sound Contributor'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'datePublished': '2026-09-13',
      'dateModified': '2026-09-14'
    }
  ];

  return (
    <div className="adv-exact-wrapper" style={{ width: '100%', minHeight: '100vh', background: '#faf8f4' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/story.html"
        title="More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read"
        scrolling="no"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          display: 'block',
          overflow: 'hidden',
          background: '#faf8f4'
        }}
      />
    </div>
  );
};

export default AdvertorialStory;
