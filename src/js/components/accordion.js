import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../lenis.js';

/** Accordion FAQ — satu item terbuka pada satu waktu, tinggi dianimasikan GSAP. */
export function initAccordion() {
  const root = document.querySelector('[data-accordion]');
  if (!root) return;

  const items = [...root.querySelectorAll('.faq-item')];
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const refresh = () => {
    getLenis()?.resize();
    ScrollTrigger.refresh();
  };

  const setOpen = (item, open) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const panel = item.querySelector('.faq-item__panel');
    if (item.classList.contains('is-open') === open) return;

    item.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));

    if (reduce()) {
      panel.hidden = !open;
      refresh();
      return;
    }

    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.55, ease: 'power3.out', onComplete: refresh });
      gsap.fromTo(panel.firstElementChild, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
    } else {
      gsap.to(panel, {
        height: 0,
        duration: 0.45,
        ease: 'power3.inOut',
        onComplete: () => {
          panel.hidden = true;
          gsap.set(panel, { clearProps: 'height' });
          refresh();
        },
      });
    }
  };

  items.forEach((item) => {
    item.querySelector('.faq-item__trigger').addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((other) => other !== item && setOpen(other, false));
      setOpen(item, willOpen);
    });
  });
}
