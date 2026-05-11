import { useEffect } from 'react';

/**
 * JsonLd — Injects a <script type="application/ld+json"> block into <head>.
 * Automatically cleans up on unmount so page-specific schemas don't persist
 * across client-side navigations.
 *
 * @param {{ data: object | object[] }} props
 */
const JsonLd = ({ data }) => {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
};

export default JsonLd;
