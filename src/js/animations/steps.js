import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * How It Works — section dipin (desktop), progress line terisi mengikuti scroll,
 * step aktif berpindah 01 → 04. Di layar kecil: tanpa pin, step aktif = yang terlihat.
 */
export function initSteps() {
  const section = document.querySelector('[data-steps]');
  if (!section) return;

  const fill = section.querySelector('[data-steps-fill]');
  const steps = [...section.querySelectorAll('.step')];

  const setActive = (index) =>
    steps.forEach((s, i) => s.classList.toggle('is-active', i === index));

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 1023px), (prefers-reduced-motion: reduce)',
    },
    ({ conditions }) => {
      if (conditions.desktop) {
        const state = { p: 0.218 };
        const apply = () => {
          fill.style.width = `${state.p * 100}%`;
          fill.classList.toggle('is-complete', state.p >= 0.995);
          setActive(Math.min(steps.length - 1, Math.round(state.p * (steps.length - 1) + 0.15)));
        };

        gsap.fromTo(
          state,
          { p: 0 },
          {
            p: 1,
            ease: 'none',
            onUpdate: apply,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=1200',
              pin: true,
              scrub: 0.6,
            },
          },
        );

        gsap.from(steps, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });

        return () => {
          fill.style.width = '';
          setActive(1);
        };
      }

      // mobile / reduced motion: highlight step yang ada di tengah layar
      const triggers = steps.map((s, i) =>
        ScrollTrigger.create({
          trigger: s,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
  );
}
