import { gsap } from 'gsap';
import { scrollTo, stopScroll, startScroll } from '../lenis.js';

const SCROLLED_AT = 40;
const HIDE_AFTER = 400;

export function initNavbar() {
  const navbar = document.querySelector('[data-navbar]');
  if (!navbar) return;

  const toggle = navbar.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-mobile-menu]');

  /* ---------- Sticky state: blur saat scroll, sembunyi saat scroll ke bawah ---------- */
  let lastY = window.scrollY;
  let ticking = false;
  let menuOpen = false;

  const update = () => {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > SCROLLED_AT);
    if (!menuOpen) {
      const goingDown = y > lastY;
      navbar.classList.toggle('is-hidden', goingDown && y > HIDE_AFTER);
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();

  navbar.addEventListener('focusin', () => navbar.classList.remove('is-hidden'));

  /* ---------- Menu mobile ---------- */
  const links = panel ? panel.querySelectorAll('.mobile-menu__links a, .mobile-menu__actions .btn') : [];

  const openMenu = () => {
    menuOpen = true;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    panel.setAttribute('aria-hidden', 'false');
    // navbar bisa berada di bawah announcement bar (belum di-scroll) → mulai link di bawahnya
    panel.style.paddingTop = `${navbar.getBoundingClientRect().bottom + 32}px`;
    panel.classList.add('is-open');
    navbar.classList.remove('is-hidden');
    stopScroll();
    gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(
      links,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.05 },
    );
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!menuOpen) return;
    menuOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    panel.setAttribute('aria-hidden', 'true');
    startScroll();
    gsap.to(panel, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => panel.classList.remove('is-open'),
    });
    if (restoreFocus) toggle.focus();
  };

  toggle?.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu({ restoreFocus: false });
  });

  /* ---------- Anchor link → smooth scroll ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#') {
      e.preventDefault();
      return;
    }
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;

    e.preventDefault();
    closeMenu({ restoreFocus: false });
    scrollTo(target, { offset: -navbar.offsetHeight });
    if (target instanceof HTMLElement) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
}
