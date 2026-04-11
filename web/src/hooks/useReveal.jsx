import { useEffect, useRef } from 'react';

/**
 * useReveal — Intersection Observer hook that adds 'revealed' class
 * when element scrolls into view. Fires once, then disconnects.
 *
 * @param {number} threshold - 0–1, fraction of element visible before trigger
 */
export const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
};

/**
 * RevealSection — wraps children in a div that fades+rises into view
 * when scrolled into the viewport.
 *
 * Props:
 *   children   — content to reveal
 *   className  — extra classes on the wrapper
 *   delay      — CSS animation-delay in seconds (for staggered children)
 *   threshold  — intersection ratio before triggering (default 0.15)
 */
export const RevealSection = ({ children, className = '', delay = 0, threshold = 0.15 }) => {
  const ref = useReveal(threshold);
  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};
