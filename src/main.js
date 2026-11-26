/* Fonts (self-hosted via @fontsource) */
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';

/* Styles */
import 'lenis/dist/lenis.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/components/dashboard.css';
import './styles/sections/announcement.css';
import './styles/sections/navbar.css';
import './styles/sections/hero.css';
import './styles/sections/stats.css';
import './styles/sections/problem.css';
import './styles/sections/features.css';
import './styles/sections/testimonials.css';
import './styles/sections/pricing.css';
import './styles/sections/steps.css';
import './styles/sections/logos.css';
import './styles/sections/faq.css';
import './styles/sections/cta-footer.css';

/* Scripts */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis } from './js/lenis.js';
import { initNavbar } from './js/components/navbar.js';
import { initDashboardScale } from './js/components/dashboard-scale.js';
import { initTestimonialSlider } from './js/components/testimonial-slider.js';
import { initLogoSlider } from './js/components/logo-slider.js';
import { initAccordion } from './js/components/accordion.js';
import { initNewsletter } from './js/components/newsletter.js';
import { initHero } from './js/animations/hero.js';
import { initReveal } from './js/animations/reveal.js';
import { initSectionAnimations } from './js/animations/sections.js';
import { initSteps } from './js/animations/steps.js';

initLenis();
initNavbar();
initDashboardScale();
initTestimonialSlider();
initAccordion();
initNewsletter();

// Tunggu font agar SplitText & ukuran layout memakai metrik font yang benar.
document.fonts.ready.then(() => {
  initHero();
  initSteps(); // pin harus dibuat sebelum trigger lain yang berada di bawahnya
  initReveal();
  initSectionAnimations();
  initLogoSlider();
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => ScrollTrigger.refresh());
