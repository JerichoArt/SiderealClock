// Sidereal Clock: one planet-wide time. Draws the dial and shows the date. All time and calendar maths
// lives in sidereal-core.js (loaded first in index.html).
const S = SiderealCore;
const SVG_NS = 'http://www.w3.org/2000/svg';
const DAY_MS = 86400000;

let MY_LAT = parseFloat(localStorage.getItem('user_lat')) || 51.5074;
let MY_LONG = parseFloat(localStorage.getItem('user_long')) || -0.1278;

const $ = id => document.getElementById(id);

// Legend values come straight from the constants, so they can never drift out of step.
$('ping-length').textContent = `${S.PING_SECS.toFixed(2)} s`;
$('sec-length').textContent = `${S.SEC_SECS.toFixed(1)} s`;
$('din-length').textContent = `${S.DIN_SECS} s`;
$('hour-length').textContent = `${S.HOUR_SECS / 60} min`;

const hoursHand = $('hours-hand');
const dinsHand = $('dins-hand');
const secsHand = $('secs-hand');
const dinDisplayText = $('din-display-text');
const rotationEl = $('rotation-display');
const yearDisplayEl = $('year-display');
const pingsDisplayEl = $('pings-display');
const breathEl = $('breath');
const timeEl = $('time-display');
let lastTimeKey = -1;
const pad2 = n => String(n).padStart(2, '0');
const solarHorizonTrack = $('solar-horizon-track');
const workWindowTrack = $('work-window-track');

// Work zone: '' means "the time zone of this device". Shared with the calendar app via localStorage.
const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let workZone = localStorage.getItem('work_zone') ||
  (localStorage.getItem('lock_to_uk') === 'true' ? 'Europe/London' : '');   // old setting

// By default the work window ignores daylight saving; the toggle in the legend turns it on.
let followDst = localStorage.getItem('work_follow_dst') === 'true';

// Keep location and work zone in step with the calendar app in other tabs.
window.addEventListener('storage', e => {
  if (e.key === 'user_lat') MY_LAT = parseFloat(e.newValue) || 51.5074;
  if (e.key === 'user_long') MY_LONG = parseFloat(e.newValue) || -0.1278;
  if (e.key === 'work_zone') { workZone = e.newValue || ''; $('work-zone').value = workZone; }
  if (e.key === 'work_follow_dst') { followDst = e.newValue === 'true'; $('follow-dst').checked = followDst; refreshZoneLabels(); }
  lastRingKey = ''; // force the rings to redraw
});

// ---- Dial drawing ------------------------------------------------------
function polar(r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)];
}

function addLine(group, r1, r2, angleDeg, stroke, width) {
  const [x1, y1] = polar(r1, angleDeg);
  const [x2, y2] = polar(r2, angleDeg);
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', stroke);
  line.setAttribute('stroke-width', width);
  group.appendChild(line);
}

function addLabel(group, r, angleDeg, cls, text) {
  const [x, y] = polar(r, angleDeg);
  const el = document.createElementNS(SVG_NS, 'text');
  el.setAttribute('x', x); el.setAttribute('y', y);
  el.setAttribute('class', cls);
  el.textContent = text;
  group.appendChild(el);
}

function drawNotches() {
  const [hoursGroup, hoursLabels, dinsGroup, secsGroup, secsLabels] =
    ['hours-notches', 'hours-labels', 'dins-notches', 'secs-notches', 'secs-labels'].map($);
  [hoursGroup, hoursLabels, dinsGroup, secsGroup, secsLabels].forEach(g => { g.innerHTML = ''; });

  // Outer dial, next to the daylight and work bars: 24 hours, numbered 0, 3, 6 ... 21.
  for (let i = 0; i < S.HOURS_PER_DAY; i++) {
    const angle = (i / S.HOURS_PER_DAY) * 360;
    const numbered = i % 3 === 0;
    addLine(hoursGroup, numbered ? 89 : 92, 96, angle, numbered ? '#F9FAFB' : '#9CA3AF', numbered ? 2 : 1);
    if (numbered) addLabel(hoursLabels, 82.5, angle, 'hour-label', i);
  }

  // Middle dial: 50 dins, prominent every 10.
  for (let i = 0; i < S.DINS_PER_HOUR; i++) {
    const angle = (i / S.DINS_PER_HOUR) * 360;
    const big = i % 10 === 0;
    addLine(dinsGroup, big ? 64 : 67, 71, angle, big ? '#F9FAFB' : '#9CA3AF', big ? 2 : 1);
  }

  // Inner dial: 10 secs, each labelled with its ping count (00, 10 ... 90).
  for (let i = 0; i < S.SECS_PER_DIN; i++) {
    const angle = (i / S.SECS_PER_DIN) * 360;
    const big = i === 0;
    addLine(secsGroup, big ? 42 : 45, 50, angle, big ? '#F9FAFB' : '#9CA3AF', big ? 2 : 1.5);
    addLabel(secsLabels, 37, angle, 'outer-notch-label', String(i * S.PINGS_PER_SEC).padStart(2, '0'));
  }
}

// ---- Daylight and work-window bars --------------------------------------
// The hands show one planet-wide time (UTC, midnight at the top). Both bars sit on that
// same 24-hour dial: daylight is placed from your location, the work window from your work zone.
const C_SOLAR = 2 * Math.PI * 112;
const C_WORK = 2 * Math.PI * 104;
let lastRingKey = '';

function utcHour(date) {
  return (((date.getTime() % DAY_MS) + DAY_MS) % DAY_MS) / 3600000;
}

function setArc(el, circumference, startHour, lengthHours) {
  const dash = (lengthHours / 24) * circumference;
  el.style.strokeDasharray = `${dash} ${circumference - dash}`;
  el.style.transform = `rotate(${-90 + (startHour / 24) * 360}deg)`;
}

function updateRings(now) {
  const key = `${Math.floor(now.getTime() / 60000)}|${MY_LAT}|${MY_LONG}|${workZone}|${followDst}`;
  if (key === lastRingKey) return;       // the bars only need redrawing once a minute
  lastRingKey = key;

  // Daylight at your location
  try {
    const t = SunCalc.getTimes(now, MY_LAT, MY_LONG);
    if (isNaN(t.sunrise.getTime()) || isNaN(t.sunset.getTime())) {
      // Polar day or night: fill the bar or leave it empty.
      const up = SunCalc.getPosition(now, MY_LAT, MY_LONG).altitude > 0;
      setArc(solarHorizonTrack, C_SOLAR, 0, up ? 24 : 0);
    } else {
      const rise = utcHour(t.sunrise);
      setArc(solarHorizonTrack, C_SOLAR, rise, (utcHour(t.sunset) - rise + 24) % 24);
    }
    solarHorizonTrack.setAttribute('stroke', '#FEF08A');
  } catch (e) {
    solarHorizonTrack.style.strokeDasharray = 'none';
    solarHorizonTrack.setAttribute('stroke', '#1E293B');
  }

  // Work window: 9 to 5 on the clock of the chosen work zone (standard time unless following daylight saving).
  const w = S.workWindowUTC(workZone || deviceZone, now, { followDST: followDst });
  setArc(workWindowTrack, C_WORK, w.start, w.length);
  workWindowTrack.setAttribute('stroke', '#34D399');
}

// ---- Work zone picker ------------------------------------------------------
function fmtOffset(h) {
  const m = Math.round(Math.abs(h) * 60);
  return `UTC${h < 0 ? '-' : '+'}${Math.floor(m / 60)}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''}`;
}

function zoneLabel(z) {
  const now = new Date();
  const off = followDst ? S.zoneOffsetHours(z, now) : S.zoneStandardOffsetHours(z, now);
  return `${z.replace(/_/g, ' ')} (${fmtOffset(off)})`;
}

function refreshZoneLabels() {
  [...$('work-zone').options].slice(1).forEach(o => { o.textContent = zoneLabel(o.value); });
}

function setupWorkZonePicker() {
  const select = $('work-zone');
  const zones = (Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [])
    .filter(z => z.includes('/') || z === 'UTC');
  const fallback = ['Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles',
                    'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland'];
  const first = document.createElement('option');
  first.value = '';
  first.textContent = `My time zone (${deviceZone})`;
  select.appendChild(first);
  (zones.length ? zones : fallback).forEach(z => {
    const o = document.createElement('option');
    o.value = z; o.textContent = zoneLabel(z);
    select.appendChild(o);
  });
  select.value = workZone;
  const box = $('follow-dst');
  box.checked = followDst;
  box.addEventListener('change', () => {
    followDst = box.checked;
    localStorage.setItem('work_follow_dst', followDst);
    refreshZoneLabels();
    lastRingKey = '';
  });
  select.addEventListener('change', () => {
    workZone = select.value;
    if (workZone) localStorage.setItem('work_zone', workZone);
    else localStorage.removeItem('work_zone');
    lastRingKey = '';
  });
}

// ---- Main loop -----------------------------------------------------------
function updateClock() {
  const now = new Date();
  const c = S.fromDate(now);

  hoursHand.style.transform = `rotateZ(${(c.hands.hours / S.HOURS_PER_DAY) * 360}deg)`;
  dinsHand.style.transform = `rotateZ(${(c.hands.dins / S.DINS_PER_HOUR) * 360}deg)`;
  secsHand.style.transform = `rotateZ(${(c.hands.secs / S.SECS_PER_DIN) * 360}deg)`;

  // One sec (10 pings, 7.2 s) is one breath. The pie breathes in for 4 pings and out for 6;
  // the ping number is green for 0-4 and yellow for 5-9.
  const timeKey = (c.time.hour * 100 + c.time.din) * 10 + c.time.sec;
  if (timeKey !== lastTimeKey) {          // hours:dins:secs only needs redrawing when a sec ticks over
    lastTimeKey = timeKey;
    timeEl.innerHTML = `<span class="t-hour">${pad2(c.time.hour)}</span>:` +
      `<span class="t-din">${pad2(c.time.din)}</span>:<span class="t-sec">${pad2(c.time.sec)}</span>`;
  }
  pingsDisplayEl.textContent = c.time.ping;
  const inhale = c.time.ping < 5;
  pingsDisplayEl.classList.toggle('ping-in', inhale);
  pingsDisplayEl.classList.toggle('ping-out', !inhale);
  breathEl.style.setProperty('--a', `${(c.hands.secs % 1) * 360}deg`);

  // Floating din number, just outside the dins dial.
  const [tx, ty] = polar(76, (c.hands.dins / S.DINS_PER_HOUR) * 360);
  dinDisplayText.textContent = c.time.din;
  dinDisplayText.setAttribute('x', tx);
  dinDisplayText.setAttribute('y', ty);

  if (c.isReturnDay) {
    rotationEl.innerHTML = `<span class="color-season">Return</span> <span class="color-day">${c.returnDay}/${c.returnDaysInYear}</span>`;
    rotationEl.title = `Return day ${c.returnDay} of ${c.returnDaysInYear}`;
  } else {
    rotationEl.innerHTML =
      `<span class="color-season">${c.season}</span> <span class="color-month">${c.month}</span> ` +
      `<span class="color-day">${c.day}</span><span class="color-week">${c.weekdayGlyph}</span>`;
    rotationEl.title = `Season ${c.season}, month ${c.month}, day ${c.day}, ${c.weekday}`;
  }
  yearDisplayEl.textContent = `Year ${c.year}`;

  updateRings(now);
  requestAnimationFrame(updateClock);
}

// ---- Location (shared with the calendar app through localStorage) ---------
if (!localStorage.getItem('user_lat') && 'geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    MY_LAT = position.coords.latitude;
    MY_LONG = position.coords.longitude;
    localStorage.setItem('user_lat', MY_LAT);
    localStorage.setItem('user_long', MY_LONG);
    lastRingKey = '';
  });
}

drawNotches();
setupWorkZonePicker();
updateClock();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service Worker Registered');
  });
}
