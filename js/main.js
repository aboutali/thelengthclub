// The Length Club: pre-launch landing page

// ---- Strings (English / German) ----
// The page language (<html lang>) picks the set. The German page is /de/.
const STRINGS = {
  en: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    sending: 'Sending…',
    success: 'You’re on the waitlist. We’ll write as soon as we have news.',
    error: 'Something went wrong. Please try again, or email hi@length.club.',
  },
  de: {
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schliessen',
    sending: 'Wird gesendet…',
    success: 'Sie sind auf der Warteliste. Wir schreiben Ihnen, sobald es Neuigkeiten gibt.',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie an hi@length.club.',
  },
};
const t = document.documentElement.lang.startsWith('de') ? STRINGS.de : STRINGS.en;

// ---- Mobile navigation ----
const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? t.closeMenu : t.openMenu);
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
    status.textContent = 'Form not connected yet. Set your Formspree ID (see README).';
    status.classList.add('is-error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.textContent = t.sending;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const success = document.createElement('p');
      success.className = 'form-success';
      success.textContent = t.success;
      form.replaceChildren(success);
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    status.textContent = t.error;
    status.classList.add('is-error');
    button.disabled = false;
  }
});

// ---- Scroll reveal ----
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  // The hero stays visible from the start, so the first screen never waits.
  const sections = document.querySelectorAll('main > section:not(.hero) > .container');
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
