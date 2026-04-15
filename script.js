// Journey progress reflects: home -> back home.
const journeyStart = new Date('2026-04-04T10:00:00+02:00');
const journeyEnd = new Date('2026-05-01T10:00:00+02:00');

const countdownEl = document.getElementById('countdown');
const metaEl = document.getElementById('meta');
const doneEl = document.getElementById('done');
const munichClockEl = document.getElementById('munichClock');
const vancouverClockEl = document.getElementById('vancouverClock');
const planeEl = document.getElementById('plane');
const trackFillEl = document.getElementById('trackFill');
const progressPctEl = document.getElementById('progressPct');
const elapsedEl = document.getElementById('elapsed');
const remainingEl = document.getElementById('remaining');

const munichFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
});

const vancouverFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Vancouver',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
});

function pad(num, size) {
  return String(num).padStart(size, '0');
}

function formatHours(ms) {
  const totalHours = Math.max(0, ms) / (1000 * 60 * 60);
  if (totalHours >= 24) return `${(totalHours / 24).toFixed(1)}d`;
  if (totalHours >= 1) return `${totalHours.toFixed(1)}h`;
  return `${Math.round(totalHours * 60)}m`;
}

function update() {
  const now = new Date();
  const diff = journeyEnd - now;

  munichClockEl.textContent = munichFormatter.format(now);
  vancouverClockEl.textContent = vancouverFormatter.format(now);

  if (diff <= 0) {
    countdownEl.style.display = 'none';
    metaEl.textContent = 'Back home in Munich local time';
    doneEl.style.display = 'block';
    planeEl.style.left = '100%';
    trackFillEl.style.width = '100%';
    progressPctEl.textContent = '100%';
    elapsedEl.textContent = formatHours(journeyEnd - journeyStart);
    remainingEl.textContent = '0m';
    countdownEl.style.display = 'none';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const remAfterDays = diff % (1000 * 60 * 60 * 24);
  const hours = Math.floor(remAfterDays / (1000 * 60 * 60));
  const minutes = Math.floor((remAfterDays % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remAfterDays % (1000 * 60)) / 1000);
  const millis = diff % 1000;

  countdownEl.innerHTML = `${pad(days, 3)}:${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}:<small>${pad(millis, 3)}</small>`;
  metaEl.textContent = `Target: ${journeyEnd.toLocaleString('en-GB', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'medium',
    timeStyle: 'medium'
  })} · Europe/Berlin`;

  const totalJourney = journeyEnd - journeyStart;
  const elapsed = now - journeyStart;
  let pct = (elapsed / totalJourney) * 100;
  if (!Number.isFinite(pct)) pct = 0;
  pct = Math.max(0, Math.min(100, pct));

  planeEl.style.left = `${pct}%`;
  trackFillEl.style.width = `${pct}%`;
  progressPctEl.textContent = `${pct.toFixed(2)}%`;
  elapsedEl.textContent = formatHours(elapsed);
  remainingEl.textContent = formatHours(diff);

  requestAnimationFrame(update);
}

update();
