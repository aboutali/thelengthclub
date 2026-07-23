// The Length Club — pre-launch landing page

// ---- Mobile navigation ----
const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('#site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Waitlist form ----
const form = document.getElementById('waitlist-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.classList.remove('is-error');

  if (form.action.includes('FORMSPREE_ID')) {
    status.textContent = 'Form not connected yet — set your Formspree ID (see README).';
    status.classList.add('is-error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.innerHTML = '<p class="form-success">You’re on the list. Talk soon. 🧡</p>';
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    status.textContent = 'Something went wrong. Please try again, or email hi@length.club.';
    status.classList.add('is-error');
    button.disabled = false;
  }
});

// ---- Scroll reveal ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main > section > .container');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}
