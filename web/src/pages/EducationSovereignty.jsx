import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';

const EducationSovereignty = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('5000px');

  useEffect(() => {
    document.title = "The Sovereign Child: Why the Fall of the Federal Department of Education Is Returning Early Learning to the Living Room Sanctuary | The Sound of Essentials";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "How early childhood education is decentralizing from standardized institutional screens into living room sanctuaries powered by acoustic rhythm and whole-body phonics.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/education-sovereignty';

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
      'headline': "The Sovereign Child: Why the Fall of the Federal Department of Education Is Returning Early Learning to the Living Room Sanctuary",
      'author': {
        '@type': 'Person',
        'name': 'Sarah Jenkins',
        'jobTitle': 'Senior Educational Journalist & Mother'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'mainEntityOfPage': 'https://thesoundofessentials.com/education-sovereignty'
    }
  ];

  return (
    <div className="education-sovereignty-page" style={{ width: '100%', minHeight: '100vh', background: '#FDFBF7' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/education-sovereignty.html"
        title="The Sovereign Child Advertorial"
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

export default EducationSovereignty;
