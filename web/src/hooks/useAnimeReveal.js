/**
 * useAnimeReveal — Anime.js v4 powered stagger reveal hook
 * Observes a container ref and fires an animation
 * on all child elements matching `selector` when in viewport.
 */
import { useEffect, useRef } from 'react';
import { animate, stagger as animeStagger } from 'animejs';

export function useAnimeReveal({
  selector = '.anime-item',
  startDelay = 0,
  staggerMs = 80,
  duration = 700,
  translateY = [40, 0],
  scale = [0.96, 1],
  once = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    const run = () => {
      animate(targets, {
        translateY: {
          from: translateY[0],
          to: translateY[1],
        },
        scale: {
          from: scale[0],
          to: scale[1],
        },
        opacity: {
          from: 0,
          to: 1,
        },
        easing: 'spring(1, 80, 12, 0)',
        duration,
        delay: animeStagger(staggerMs, { start: startDelay }),
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * useMagneticHover — subtle magnetic pull toward cursor
 * Attach to any card/image to feel alive.
 */
export function useMagneticHover(strength = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      animate(el, {
        translateX: { to: dx },
        translateY: { to: dy },
        duration: 400,
        easing: 'easeOutQuad',
      });
    };

    const handleLeave = () => {
      animate(el, {
        translateX: { to: 0 },
        translateY: { to: 0 },
        duration: 600,
        easing: 'spring(1, 80, 10, 0)',
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return ref;
}
