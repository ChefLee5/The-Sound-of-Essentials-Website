import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';

const GlobalLearnEnglish = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('4800px');

  useEffect(() => {
    document.title = "Sound Before Symbol: How Natural Acoustic Cadence Teaches English Without Screen Fatigue | The Sound of Essentials";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Why global bilingual families are switching from gamified screen apps to natural acoustic cadence for English language acquisition in children ages 2–7.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/global-learn-english';

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
      'headline': "Sound Before Symbol: How Natural Acoustic Cadence Teaches English Without Screen Fatigue",
      'author': {
        '@type': 'Person',
        'name': 'Natalia Rostova',
        'jobTitle': 'Multilingual Pedagogy Specialist'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'mainEntityOfPage': 'https://thesoundofessentials.com/global-learn-english'
    }
  ];

  return (
    <div className="global-learn-english-page" style={{ width: '100%', minHeight: '100vh', background: '#FDFBF7' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/global-learn-english.html"
        title="Global Learn English Advertorial"
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

export default GlobalLearnEnglish;
