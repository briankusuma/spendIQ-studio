import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal generik berbasis atribut — dipakai section-section berikutnya.
 *   data-reveal="fade-up" | "fade" | "scale" | "stagger"
 *   data-reveal-delay="0.1"
 * "stagger" menganimasikan anak-anak langsung elemen.
 */
const VARIANTS = {
  'fade-up': { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: { from: { opacity: 0, scale: 0.94 }, to: { opacity: 1, scale: 1 } },
  stagger: { from: { opacity: 0, y: 32 }, to: { opacity: 1, y: 0 } },
};

export function initReveal(root = document) {
  const els = root.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    els.forEach((el) => {
      const variant = VARIANTS[el.dataset.reveal] ?? VARIANTS['fade-up'];
      const targets = el.dataset.reveal === 'stagger' ? el.children : el;
      gsap.fromTo(targets, variant.from, {
        ...variant.to,
        duration: 1,
        ease: 'power3.out',
        delay: parseFloat(el.dataset.revealDelay ?? 0),
        stagger: el.dataset.reveal === 'stagger' ? 0.08 : 0,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
  });
}
