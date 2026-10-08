import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';

const SingAlongTime = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('5200px');

  useEffect(() => {
    document.title = "The 90–110 BPM Reset: Why Rhythm Scaffolds Language, Motor Coordination, and Focus | The Sound of Essentials";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Pediatric specialists and early educators explore how tempo-regulated acoustic music (90–110 BPM) regulates the parasympathetic nervous system and builds speech fluency in children ages 2–7.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/sing-along-time';

    window.scrollTo(0, 0);

    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'ADV_RESIZE' || event.data.type === 'RESIZE') && event.data.height > 0) {
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
      'headline': "The 90–110 BPM Reset: Why Rhythm Scaffolds Language, Motor Coordination, and Focus",
      'author': {
        '@type': 'Person',
        'name': 'Dr. Julian Vance & Early Learning Collective',
        'jobTitle': 'Developmental Neuro-Rhythm Researchers'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'mainEntityOfPage': 'https://thesoundofessentials.com/sing-along-time'
    }
  ];

  return (
    <div className="sing-along-time-page" style={{ width: '100%', minHeight: '100vh', background: '#FDFBF7' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/sing-along-time.html"
        title="Sing Along Time Advertorial"
        scrolling="no"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          display: 'block',
          overflow: 'hidden',
          background: '#FDFBF7'
        }}
      />
    </div>
  );
};

export default SingAlongTime;
