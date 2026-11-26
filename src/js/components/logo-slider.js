import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

/**
 * Logo strip berjalan terus (Swiper autoplay delay 0 + transisi linear, lihat logos.css).
 * Dengan prefers-reduced-motion: tidak diinisialisasi — logo tampil diam di tengah.
 */
export function initLogoSlider() {
  const el = document.querySelector('[data-logo-swiper]');
  if (!el) return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  // Loop butuh lebih banyak slide dari yang muat di layar → gandakan set logo dua kali.
  const wrapper = el.querySelector('.swiper-wrapper');
  const originals = [...wrapper.children];
  for (let k = 0; k < 2; k++) {
    originals.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('[role="img"]')?.removeAttribute('role');
      wrapper.appendChild(clone);
    });
  }

  el.classList.add('is-sliding');

  const swiper = new Swiper(el, {
    modules: [Autoplay],
    slidesPerView: 'auto',
    spaceBetween: 64,
    loop: true,
    speed: 4000, // waktu per 1 logo; transisi linear → gerak konstan
    allowTouchMove: false,
    autoplay: { delay: 0, disableOnInteraction: false },
    breakpoints: { 0: { spaceBetween: 44 }, 600: { spaceBetween: 64 } },
  });

  // jalan hanya saat terlihat
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }).observe(el);

  return swiper;
}
