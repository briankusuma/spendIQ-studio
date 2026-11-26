import Swiper from 'swiper';
import { Navigation, Keyboard, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/a11y';

/**
 * Slider testimoni (Swiper): slide aktif di tengah, tetangga terlihat pudar (opacity .2, lihat CSS),
 * loop tak berujung, tombol prev/next, keyboard ←/→, swipe, autoplay yang berhenti saat hover.
 */
export function initTestimonialSlider() {
  const el = document.querySelector('[data-testimonial-swiper]');
  if (!el) return null;

  const section = el.closest('.testimonials');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loop + slidesPerView "auto" butuh cukup slide untuk mengisi kiri & kanan layar.
  // Gandakan set slide (klon disembunyikan dari screen reader) bila jumlahnya sedikit.
  const wrapper = el.querySelector('.swiper-wrapper');
  const originals = [...wrapper.children];
  if (originals.length < 8) {
    originals.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = '';
      wrapper.appendChild(clone);
    });
  }

  const swiper = new Swiper(el, {
    modules: [Navigation, Keyboard, Autoplay, A11y],
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 40,
    loop: true,
    speed: reduce ? 0 : 900,
    grabCursor: true,
    navigation: {
      prevEl: section.querySelector('[data-carousel-prev]'),
      nextEl: section.querySelector('[data-carousel-next]'),
    },
    keyboard: { enabled: true, onlyInViewport: true },
    autoplay: reduce ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
    a11y: {
      enabled: true,
      prevSlideMessage: 'Previous review',
      nextSlideMessage: 'Next review',
      slideLabelMessage: 'Review {{index}} of {{slidesLength}}',
    },
    breakpoints: {
      600: { spaceBetween: 64 },
      900: { spaceBetween: 160 }, // Figma: slide 630px, tetangga di ±790px
    },
  });

  // autoplay hanya berjalan saat section terlihat (mulai dari slide pertama)
  if (swiper.autoplay) {
    swiper.autoplay.stop();
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) swiper.autoplay.start();
      else swiper.autoplay.stop();
    }, { threshold: 0.3 }).observe(section);
  }

  return swiper;
}
