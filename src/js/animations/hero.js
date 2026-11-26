import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { countUp } from '../utils/count-up.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const line = hero.querySelector('[data-hero-line]');
  const serif = hero.querySelector('[data-hero-serif]');
  const lead = hero.querySelector('.hero__lead');
  const cta = hero.querySelector('.hero__content .btn');
  const dash = hero.querySelector('[data-dash]');
  const bars = hero.querySelectorAll('.dash-bar');
  const tooltip = hero.querySelector('[data-dash-tooltip]');
  const progress = hero.querySelector('[data-dash-progress]');
  const counters = hero.querySelectorAll('[data-count]');
  const cards = hero.querySelectorAll('.dash-card');

  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 900px)',
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions;

      if (!motion) {
        gsap.set([line, serif, lead, cta, dash], { opacity: 1 });
        return;
      }

      /* ---------- Intro (on load) ---------- */
      const split = SplitText.create(line, { type: 'words', mask: 'words' });
      gsap.set(line, { opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });

      tl.from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.07 })
        .fromTo(
          serif,
          { opacity: 0, y: 24, filter: 'blur(14px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, clearProps: 'filter' },
          '-=0.75',
        )
        .fromTo(lead, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.85')
        .fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.75')
        .fromTo(
          dash,
          { opacity: 0, y: 140, rotateX: desktop ? 28 : 0, transformPerspective: 1800 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.6, ease: 'expo.out' },
          '-=0.7',
        )
        .from(cards, { opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '<0.35')
        .from(
          bars,
          { scaleY: 0, duration: 1, stagger: { each: 0.045, from: 'start' }, ease: 'power3.out' },
          '<0.2',
        )
        .from(tooltip, { opacity: 0, y: 8, scale: 0.94, transformOrigin: '50% 100%', duration: 0.6 }, '>-0.4')
        .from(progress, { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, '<');

      counters.forEach((el) => tl.add(countUp(el, { duration: 1.6 }), '<'));

      // Sengaja tanpa parallax/scroll effect pada dashboard (sesuai permintaan):
      // dashboard tetap diam seperti di Figma saat halaman di-scroll.

      return () => split.revert();
    },
  );
}
