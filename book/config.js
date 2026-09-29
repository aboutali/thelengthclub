// The Length Club — pilot booking page: settings for ONE company
// Edit this object for each pilot company, then commit. Nothing else needs to change.

const BOOKING_CONFIG = {
  // true = the booking form is shown. false = visitors see a "Booking is closed" message.
  open: true,

  // Company name. Appears in the headline and in the email subject ("Pilot booking – {company}").
  company: 'Beispiel AG',

  // Where the practitioner sets up: building, floor, room. Shown to employees as written.
  location: 'Hauptsitz, 3. Stock, Raum «Ruhe»',

  // Length of every slot in minutes. The end time of each slot is calculated from this.
  slotMinutes: 20,

  // One entry per stretch day, in date order.
  // date:  the day as YYYY-MM-DD.
  // slots: start times on that day as "HH:MM" (24-hour clock). Any gaps (lunch, meetings) are simply left out.
  days: [
    {
      date: '2026-11-12',
      slots: [
        '09:00', '09:20', '09:40', '10:00', '10:20', '10:40',
        '13:00', '13:20', '13:40', '14:00',
      ],
    },
    // Second day, if the company books more than one:
    // { date: '2026-11-13', slots: ['09:00', '09:20', '09:40'] },
  ],
};
