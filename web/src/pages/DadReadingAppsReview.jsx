import React, { useState, useEffect, useRef } from 'react';
import JsonLd from '../components/JsonLd';

const DadReadingAppsReview = () => {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState('4200px');

  useEffect(() => {
    document.title = "I Spent $240 on 'Top-Rated' Reading Apps. Here Are 5 Reasons I Deleted Every Single One. | The Sound of Essentials";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "A software engineer and father reviews why gamified reading apps fail phonemic decoding and how an acoustic, screen-free rhythm quest rewired his child's reading confidence.";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://thesoundofessentials.com/dad-reading-apps-review';

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
      'headline': "I Spent $240 on 'Top-Rated' Reading Apps. Here Are 5 Reasons I Deleted Every Single One.",
      'description': "A software engineer and father reviews why gamified reading apps fail phonemic decoding and how acoustic rhythm restored reading confidence.",
      'author': {
        '@type': 'Person',
        'name': 'David Vance',
        'jobTitle': 'Software Engineer & Father'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'url': 'https://thesoundofessentials.com'
      },
      'mainEntityOfPage': 'https://thesoundofessentials.com/dad-reading-apps-review'
    }
  ];

  return (
    <div className="dad-review-page" style={{ width: '100%', minHeight: '100vh', background: '#F8F9FA' }}>
      <JsonLd data={structuredData} />
      <iframe
        ref={iframeRef}
        src="/dad-reading-apps-review.html"
        title="Why I Deleted My Kids Reading Apps"
        scrolling="no"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          display: 'block',
          overflow: 'hidden',
          background: '#F8F9FA'
        }}
      />
    </div>
  );
};

export default DadReadingAppsReview;
