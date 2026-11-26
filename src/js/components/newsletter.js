const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validasi form newsletter di sisi klien (belum ada backend). */
export function initNewsletter() {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const msg = form.querySelector('[data-newsletter-msg]');

  const show = (text, type) => {
    msg.textContent = text;
    msg.className = `newsletter__msg is-${type}`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (!EMAIL_RE.test(value)) {
      input.setAttribute('aria-invalid', 'true');
      show('Please enter a valid email address.', 'error');
      input.focus();
      return;
    }

    input.removeAttribute('aria-invalid');
    // TODO: kirim ke layanan newsletter
    form.reset();
    show('Thanks for subscribing! Check your inbox to confirm.', 'success');
  });

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' && EMAIL_RE.test(input.value.trim())) {
      input.removeAttribute('aria-invalid');
      show('', 'idle');
    }
  });
}
