import { gsap } from 'gsap';
import { scrollTo, stopScroll, startScroll } from '../lenis.js';

const SCROLLED_AT = 40;
const HIDE_AFTER = 400;
const HIDE_DELTA = 24; // harus turun ≥24px berturut-turut sebelum navbar disembunyikan
const SHOW_DELTA = 12; // naik ≥12px untuk memunculkan lagi

export function initNavbar() {
  const navbar = document.querySelector('[data-navbar]');
  if (!navbar) return;

  const toggle = navbar.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-mobile-menu]');

  /* ---------- Sticky state: blur saat scroll, sembunyi saat scroll ke bawah ---------- */
  let lastY = window.scrollY;
  let ticking = false;
  let menuOpen = false;
  let travel = 0; // jarak scroll terkumpul ke satu arah (+ turun, − naik)
  let hidden = false;

  const setHidden = (value) => {
    if (hidden === value) return; // hindari toggle berulang → tidak berkedip
    hidden = value;
    navbar.classList.toggle('is-hidden', value);
  };

  const update = () => {
    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;
    lastY = y;
    ticking = false;

    navbar.classList.toggle('is-scrolled', y > SCROLLED_AT);
    if (menuOpen || dy === 0) return; // frame tanpa gerakan: pertahankan state

    // reset akumulasi bila arah berubah
    travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;

    if (y <= HIDE_AFTER) setHidden(false);
    else if (travel > HIDE_DELTA) setHidden(true);
    else if (travel < -SHOW_DELTA) setHidden(false);
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

  navbar.addEventListener('focusin', () => setHidden(false));

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
    setHidden(false);
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
