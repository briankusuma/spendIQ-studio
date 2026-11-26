import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { countUp } from '../utils/count-up.js';

gsap.registerPlugin(ScrollTrigger);

/** Animasi scroll khusus per section (di luar reveal generik & hero). */
export function initSectionAnimations() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* ---------- Stats: counter ---------- */
    document.querySelectorAll('.stats [data-count]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => countUp(el, { duration: 2 }),
      });
    });

    /* ---------- Problem: kartu masuk dari sisi ikon ---------- */
    document.querySelectorAll('.problem-card').forEach((card, i) => {
      const fromLeft = card.classList.contains('problem-card--reverse');
      gsap.from(card, {
        opacity: 0,
        x: fromLeft ? -48 : 48,
        duration: 1,
        ease: 'power3.out',
        delay: (i % 2) * 0.05,
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
    });

    /* ---------- Features: kartu bento + mini-UI hidup ---------- */
    const bento = document.querySelector('[data-bento]');
    if (bento) {
      const cards = bento.querySelectorAll('.feature');
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: bento, start: 'top 80%', once: true },
      });

      cards.forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 70%', once: true },
          defaults: { ease: 'power3.out' },
        });
        const bars = card.querySelectorAll('.fp-bar');
        const pops = card.querySelectorAll('[data-feature-pop]');
        const progress = card.querySelector('[data-feature-progress]');
        const rows = card.querySelectorAll('.fp-sub:not(.fp-sub--float), .fp-tx__item');

        if (bars.length) tl.from(bars, { scaleY: 0, duration: 0.9, stagger: 0.07 }, 0.2);
        if (rows.length) tl.from(rows, { opacity: 0, x: -12, duration: 0.6, stagger: 0.07 }, 0.2);
        if (progress) tl.from(progress, { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, 0.3);
        if (pops.length) {
          tl.from(pops, { opacity: 0, y: 16, scale: 0.92, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform' }, 0.6);
        }
      });
    }

    /* ---------- Pricing: glow kartu Pro ikut scroll ---------- */
    const proGlow = document.querySelector('.plan--pro .plan__glow');
    if (proGlow) {
      gsap.fromTo(
        proGlow,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: proGlow.closest('.plan'), start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }

    /* ---------- CTA: glow parallax + judul per baris ---------- */
    const ctaGlow = document.querySelector('[data-cta-glow]');
    if (ctaGlow) {
      gsap.fromTo(
        ctaGlow,
        { y: 120, opacity: 0.6 },
        {
          y: -40,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'top top', scrub: true },
        },
      );
    }
  });

  /* ---------- Back to top ---------- */
  document.querySelectorAll('[data-back-to-top]').forEach((btn) =>
    btn.addEventListener('click', () => {
      document.querySelector('a[href="#top"]')?.click();
    }),
  );
}
