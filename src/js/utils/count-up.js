import { gsap } from 'gsap';

const format = (value, decimals, prefix = '', suffix = '') =>
  prefix +
  value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
  suffix;

/**
 * Animasikan angka dari 0 ke nilai di data-count.
 * Atribut: data-count, data-decimals, data-prefix, data-suffix.
 * Mengembalikan tween agar bisa dimasukkan ke timeline.
 */
export function countUp(el, { duration = 1.6, ease = 'power3.out' } = {}) {
  const end = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals ?? '0', 10);
  const { prefix = '', suffix = '' } = el.dataset;
  const state = { value: 0 };

  el.textContent = format(0, decimals, prefix, suffix);
  return gsap.to(state, {
    value: end,
    duration,
    ease,
    onUpdate: () => {
      el.textContent = format(state.value, decimals, prefix, suffix);
    },
  });
}
