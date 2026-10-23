// The Length Club — pilot booking page

// ---- Strings (German / English) ----
// Placeholders in {curly braces} are filled in by t().
const STRINGS = {
  en: {
    page_title: 'Request a session — The Length Club',
    logo_label: 'The Length Club — home',
    eyebrow: 'Pilot day',
    headline: 'Pilot day at {company}',
    lead: 'Assisted stretching at your office. A practitioner stretches you on a portable table.',
    meta_date: 'Date',
    meta_place: 'Room',
    meta_length: 'Session length',
    minutes: '{n} minutes',
    expect_title: 'What to expect',
    expect_1: 'You stay in your clothes. No oil, no changing.',
    expect_2: 'You do not need to be flexible. The practitioner adapts every stretch to you.',
    expect_3: 'Arrive 2 minutes early.',
    form_title: 'Choose your session',
    label_name: 'Name',
    ph_name: 'Your name',
    label_email: 'Work email',
    ph_email: 'you@company.com',
    label_ack: 'I will tell the practitioner about injuries, pregnancy or recent surgery before the session.',
    label_optin: 'Email me when the studio opens.',
    submit: 'Request a session',
    sending: 'Sending…',
    privacy: 'We use your details only to organize the session. Your employer receives no individual data.',
    err_slot: 'Please choose a session.',
    err_name: 'Please enter your name.',
    err_email: 'Please enter a valid email address.',
    err_ack: 'Please confirm this note.',
    error: 'Something went wrong. Please try again, or email hi@length.club.',
    success_title: 'Thanks, {name}. We received your request.',
    success_text: 'You requested a session on {date} at {slot}. We confirm your request by email to {email}.',
    closed_title: 'Session requests are closed',
    closed_text: 'Session requests are not open right now. Questions? Write to hi@length.club.',
    no_slots: 'No sessions are available yet. Please check again later.',
  },
  de: {
    page_title: 'Session anfragen — The Length Club',
    logo_label: 'The Length Club — Startseite',
    eyebrow: 'Pilot-Tag',
    headline: 'Pilot-Tag bei {company}',
    lead: 'Assisted Stretching in deinem Büro. Ein Stretching-Coach dehnt dich auf einer mobilen Liege.',
    meta_date: 'Datum',
    meta_place: 'Raum',
    meta_length: 'Dauer pro Session',
    minutes: '{n} Minuten',
    expect_title: 'Das erwartet dich',
    expect_1: 'Du bleibst in deinen Kleidern. Kein Öl, kein Umziehen.',
    expect_2: 'Du musst nicht beweglich sein. Der Stretching-Coach passt jede Dehnung an dich an.',
    expect_3: 'Sei 2 Minuten früher da.',
    form_title: 'Wähle deine Session',
    label_name: 'Name',
    ph_name: 'Dein Name',
    label_email: 'Geschäftliche E-Mail',
    ph_email: 'du@firma.ch',
    label_ack: 'Ich informiere den Stretching-Coach vor der Session über Verletzungen, Schwangerschaft oder eine kürzliche Operation.',
    label_optin: 'Informiere mich über die Eröffnung des Studios.',
    submit: 'Session anfragen',
    sending: 'Wird gesendet…',
    privacy: 'Wir verwenden deine Angaben nur, um die Session zu organisieren. Dein Arbeitgeber erhält keine individuellen Daten.',
    err_slot: 'Bitte wähle eine Session.',
    err_name: 'Bitte gib deinen Namen ein.',
    err_email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    err_ack: 'Bitte bestätige diesen Hinweis.',
    error: 'Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreibe an hi@length.club.',
    success_title: 'Danke, {name}. Wir haben deine Anfrage erhalten.',
    success_text: 'Du hast eine Session am {date} um {slot} angefragt. Wir bestätigen deine Anfrage per E-Mail an {email}.',
    closed_title: 'Session-Anfragen sind geschlossen',
    closed_text: 'Zurzeit sind keine Session-Anfragen möglich. Fragen? Schreibe an hi@length.club.',
    no_slots: 'Es sind noch keine Sessions verfügbar. Bitte schaue später wieder vorbei.',
  },
};

// ---- State ----
const config = BOOKING_CONFIG;
const LANG_KEY = 'tlc-lang';

const form = document.getElementById('booking-form');
const statusEl = document.getElementById('form-status');
const successBox = document.getElementById('book-success');
const slotGroups = document.getElementById('slot-groups');

let lang = detectLanguage();
let selectedSlot = '';
let submitted = null;

// ---- Language ----
function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch (error) {
    // Storage can be blocked. Fall through to the browser language.
  }
  return (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
}

function t(key, vars = {}) {
  return STRINGS[lang][key].replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

// ---- Dates and times ----
function formatDate(iso) {
  const locale = lang === 'de' ? 'de-CH' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso + 'T00:00:00Z'));
}

function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const pad = (n) => String(n).padStart(2, '0');
  return pad(Math.floor(total / 60) % 24) + ':' + pad(total % 60);
}

function slotRange(start) {
  return start + '–' + addMinutes(start, config.slotMinutes);
}

// ---- Rendering ----
function buildSlots() {
  slotGroups.textContent = '';
  const days = config.days.filter((day) => day.slots && day.slots.length);

  if (!days.length) {
    const empty = document.createElement('p');
    empty.textContent = t('no_slots');
    slotGroups.appendChild(empty);
    return;
  }

  days.forEach((day, d) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'slot-group';
    const legend = document.createElement('legend');
    legend.textContent = formatDate(day.date);
    fieldset.appendChild(legend);

    const grid = document.createElement('div');
    grid.className = 'slot-grid';

    day.slots.forEach((start, s) => {
      const value = day.date + '|' + start;
      const id = 'slot-' + d + '-' + s;

      const wrap = document.createElement('div');
      wrap.className = 'slot';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'slot_choice';
      input.id = id;
      input.value = value;
      input.checked = value === selectedSlot;
      input.setAttribute('aria-describedby', 'err-slot');

      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = start;
      label.title = slotRange(start);

      wrap.append(input, label);
      grid.appendChild(wrap);
    });

    fieldset.appendChild(grid);
    slotGroups.appendChild(fieldset);
  });
}

function renderSuccess() {
  if (!submitted) return;
  document.getElementById('success-title').textContent = t('success_title', { name: submitted.name });
  document.getElementById('success-text').textContent = t('success_text', {
    date: formatDate(submitted.date),
    slot: submitted.slot,
    email: submitted.email,
  });
}

function render() {
  document.documentElement.lang = lang;
  document.title = t('page_title');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nLabel));
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });

  document.getElementById('book-title').textContent = t('headline', { company: config.company });
  const dates = config.days.filter((day) => day.slots && day.slots.length).map((day) => formatDate(day.date));
  document.getElementById('meta-date').textContent = dates.join(' · ');
  document.getElementById('meta-place').textContent = config.location;
  document.getElementById('meta-length').textContent = t('minutes', { n: config.slotMinutes });
  document.getElementById('bk-lang').value = lang;

  // Validation messages that are showing follow the language too.
  document.querySelectorAll('.field-error').forEach((el) => {
    if (el.textContent) el.textContent = t('err_' + el.dataset.errorFor);
  });
  if (statusEl.classList.contains('is-error') && statusEl.textContent) statusEl.textContent = t('error');

  buildSlots();
  renderSuccess();
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      // Storage can be blocked. The choice then lasts for this visit only.
    }
    render();
  });
});

// ---- Open / closed ----
if (!config.open) {
  document.getElementById('book-main').hidden = true;
  document.getElementById('book-closed').hidden = false;
}

// ---- Fixed hidden fields ----
document.getElementById('bk-subject').value = 'Pilot booking – ' + config.company;
document.getElementById('bk-company').value = config.company;

// ---- Slot choice ----
slotGroups.addEventListener('change', (event) => {
  if (event.target.name !== 'slot_choice') return;
  selectedSlot = event.target.value;
  const [date, start] = selectedSlot.split('|');
  document.getElementById('bk-date').value = date;
  document.getElementById('bk-slot').value = slotRange(start);
  clearError('slot');
});

// ---- Validation ----
function showError(key, control) {
  document.getElementById('err-' + key).textContent = t('err_' + key);
  control.setAttribute('aria-invalid', 'true');
}

function clearError(key) {
  document.getElementById('err-' + key).textContent = '';
  const controls = key === 'slot'
    ? form.querySelectorAll('input[name="slot_choice"]')
    : [form.querySelector('#bk-' + key)];
  controls.forEach((control) => control.removeAttribute('aria-invalid'));
}

function validate() {
  const nameInput = document.getElementById('bk-name');
  const emailInput = document.getElementById('bk-email');
  const ackInput = document.getElementById('bk-ack');
  const checks = [
    ['slot', Boolean(selectedSlot), form.querySelector('input[name="slot_choice"]')],
    ['name', nameInput.value.trim() !== '', nameInput],
    ['email', emailInput.value.trim() !== '' && emailInput.checkValidity(), emailInput],
    ['ack', ackInput.checked, ackInput],
  ];

  let firstInvalid = null;
  checks.forEach(([key, ok, control]) => {
    clearError(key);
    if (ok || !control) return;
    showError(key, control);
    if (!firstInvalid) firstInvalid = control;
  });

  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

['name', 'email'].forEach((key) => {
  document.getElementById('bk-' + key).addEventListener('input', () => clearError(key));
});
document.getElementById('bk-ack').addEventListener('change', () => clearError('ack'));

// ---- Submit ----
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.classList.remove('is-error');
  statusEl.textContent = '';

  if (!validate()) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = t('sending');

  const data = new FormData(form);
  data.delete('slot_choice');

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      submitted = {
        name: data.get('name').trim(),
        email: data.get('email').trim(),
        date: data.get('date'),
        slot: data.get('slot'),
      };
      form.hidden = true;
      renderSuccess();
      successBox.hidden = false;
      successBox.focus();
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    statusEl.textContent = t('error');
    statusEl.classList.add('is-error');
    button.disabled = false;
  }
});

render();
