const SIDEREAL_YEAR_SECS = (365 * 86400) + (5 * 3600) + (48 * 60) + 45;
const EPOCH = new Date('2000-01-01T00:00:00.000Z');

const DAYS_IN_YEAR = 1000;
const DAYS_PER_MONTH = 50;
const MONTHS_PER_SEASON = 5;
const SEASONS_PER_YEAR = 4;
const NARES_PER_DAY = 10; 
const DINS_PER_NARE = 50; 
const SECS_PER_DIN = 10;
const PINGS_PER_SEC = 10;

const PING_LENGTH = SIDEREAL_YEAR_SECS / (DAYS_IN_YEAR * NARES_PER_DAY * DINS_PER_NARE * SECS_PER_DIN * PINGS_PER_SEC); 
const SEC_LENGTH = PING_LENGTH * PINGS_PER_SEC;
const DIN_LENGTH = SEC_LENGTH * SECS_PER_DIN;
const NARE_LENGTH = DIN_LENGTH * DINS_PER_NARE; 

let MY_LAT = parseFloat(localStorage.getItem('user_lat')) || 51.5074; 
let MY_LONG = parseFloat(localStorage.getItem('user_long')) || -0.1278;

document.getElementById('ping-length').textContent = `${PING_LENGTH.toFixed(2)} s`;
document.getElementById('sec-length').textContent = `${SEC_LENGTH.toFixed(2)} s`;
document.getElementById('din-length').textContent = `${DIN_LENGTH.toFixed(2)} s`;
document.getElementById('nare-length').textContent = '≈ 52 m';

const naresHand = document.getElementById('nares-hand'); 
const dinsHand = document.getElementById('dins-hand');
const secsHand = document.getElementById('secs-hand');
const dinDisplayText = document.getElementById('din-display-text');
const rotationEl = document.getElementById('rotation-display');
const yearDisplayEl = document.getElementById('year-display');
const pingsDisplayEl = document.getElementById('pings-display');

const solarHorizonTrack = document.getElementById('solar-horizon-track');
const workWindowTrack = document.getElementById('work-window-track');

// Cross-tab Synchronization Listener (Updates coordinates & lock parameters automatically)
window.addEventListener('storage', (e) => {
  if (e.key === 'user_lat') MY_LAT = parseFloat(e.newValue) || 51.5074;
  if (e.key === 'user_long') MY_LONG = parseFloat(e.newValue) || -0.1278;
});

function drawNotches() {
  const naresGroup = document.getElementById('nares-notches'); 
  const naresLabelsGroup = document.getElementById('nares-labels');
  const dinsGroup = document.getElementById('dins-notches');
  const secsGroup = document.getElementById('secs-notches');
  const secsLabelsGroup = document.getElementById('secs-labels');
  
  naresGroup.innerHTML = ''; 
  naresLabelsGroup.innerHTML = '';
  dinsGroup.innerHTML = '';
  secsGroup.innerHTML = '';
  secsLabelsGroup.innerHTML = '';

  for (let i = 0; i < NARES_PER_DAY; i++) { 
    const angle = (i / NARES_PER_DAY) * 360 - 90; 
    const rad = angle * Math.PI / 180;
    const x1 = 100 + 31 * Math.cos(rad);
    const y1 = 100 + 31 * Math.sin(rad);
    const x2 = 100 + 35 * Math.cos(rad);
    const y2 = 100 + 35 * Math.sin(rad);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#F9FAFB');
    line.setAttribute('stroke-width', 2);
    naresGroup.appendChild(line);

    const textX = 100 + 26 * Math.cos(rad);
    const textY = 100 + 26 * Math.sin(rad);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', textX);
    text.setAttribute('y', textY);
    text.setAttribute('class', 'notch-label');
    text.textContent = i; 
    naresLabelsGroup.appendChild(text);
  }

  for (let i = 0; i < DINS_PER_NARE; i++) { 
    const angle = (i / DINS_PER_NARE) * 360 - 90; 
    const rad = angle * Math.PI / 180;
    const isProminent = (i % 10 === 0);
    
    const x1 = 100 + (isProminent ? 48 : 51) * Math.cos(rad);
    const y1 = 100 + (isProminent ? 48 : 51) * Math.sin(rad);
    const x2 = 100 + 55 * Math.cos(rad);
    const y2 = 100 + 55 * Math.sin(rad);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isProminent ? '#F9FAFB' : '#9CA3AF');
    line.setAttribute('stroke-width', isProminent ? 2 : 1);
    dinsGroup.appendChild(line);
  }

  const TOTAL_OUTER_NOTCHES = 100;
  for (let i = 0; i < TOTAL_OUTER_NOTCHES; i++) {
    const angle = (i / TOTAL_OUTER_NOTCHES) * 360 - 90;
    const rad = angle * Math.PI / 180;
    const isProminent = (i % 10 === 0);
    
    const x1 = 100 + (isProminent ? 89 : 92) * Math.cos(rad);
    const y1 = 100 + (isProminent ? 89 : 92) * Math.sin(rad);
    const x2 = 100 + 96 * Math.cos(rad);
    const y2 = 100 + 96 * Math.sin(rad);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isProminent ? '#F9FAFB' : '#4B5563');
    line.setAttribute('stroke-width', isProminent ? 1.5 : 0.75);
    secsGroup.appendChild(line);

    if (isProminent) {
      const textX = 100 + 81 * Math.cos(rad);
      const textY = 100 + 81 * Math.sin(rad);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('class', 'outer-notch-label');
      text.textContent = i.toString().padStart(2, '0');
      secsLabelsGroup.appendChild(text);
    }
  }
}

function updateEnvironmentalTimelines(now) {
  const targetTimezoneOffsetHours = MY_LONG / 15;
  const localDecimalHour = (now.getUTCHours() + (now.getUTCMinutes() / 60) + (now.getUTCSeconds() / 3600) + targetTimezoneOffsetHours + 24) % 24;
  
  // 1. Solar Ring Processing
  const cSolar = 2 * Math.PI * 112;
  try {
    const sunTimes = SunCalc.getTimes(now, MY_LAT, MY_LONG);
    const sunriseDec = (sunTimes.sunrise.getUTCHours() + sunTimes.sunrise.getUTCMinutes() / 60 + targetTimezoneOffsetHours + 24) % 24;
    const sunsetDec = (sunTimes.sunset.getUTCHours() + sunTimes.sunset.getUTCMinutes() / 60 + targetTimezoneOffsetHours + 24) % 24;
    
    let dayLengthHours = sunsetDec - sunriseDec;
    if (dayLengthHours < 0) dayLengthHours += 24;

    const dayDash = (dayLengthHours / 24) * cSolar;
    const nightDash = cSolar - dayDash;
    
    solarHorizonTrack.style.strokeDasharray = `${dayDash} ${nightDash}`;
    
    const solarStartAngle = (sunriseDec / 24) * 360;
    const currentAngle = (localDecimalHour / 24) * 360;
    solarHorizonTrack.style.transform = `rotate(${-90 + solarStartAngle - currentAngle}deg)`;
    solarHorizonTrack.setAttribute('stroke', '#FEF08A');
  } catch (e) {
    solarHorizonTrack.style.strokeDasharray = "none";
    solarHorizonTrack.setAttribute('stroke', '#1E293B');
  }

  // 2. Work Window Processing (Directly syncing to the calendar storage token 'lock_to_uk')
  const cWork = 2 * Math.PI * 104;
  const lockToUK = localStorage.getItem('lock_to_uk') === 'true';
  
  let startHour = 9;
  let endHour = 17;

  if (lockToUK) {
    const ukTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/London"}));
    
    // Calculate the difference between your selected longitudinal zone and true London time
    const localTime = new Date(now.getTime() + (targetTimezoneOffsetHours * 3600000));
    const ukOffset = (localTime.getTime() - ukTime.getTime()) / 3600000;
    
    startHour = (9 + ukOffset + 24) % 24;
    endHour = (17 + ukOffset + 24) % 24;
  }

  let workLengthHours = endHour - startHour;
  if (workLengthHours < 0) workLengthHours += 24;

  const workDash = (workLengthHours / 24) * cWork;
  const restDash = cWork - workDash;

  workWindowTrack.style.strokeDasharray = `${workDash} ${restDash}`;
  
  const workStartAngle = (startHour / 24) * 360;
  const currentWorkAngle = (localDecimalHour / 24) * 360;
  workWindowTrack.style.transform = `rotate(${-90 + workStartAngle - currentWorkAngle}deg)`;
  workWindowTrack.setAttribute('stroke', '#34D399');
}

function updateClock() {
  const now = new Date();
  const elapsed = (now.getTime() - EPOCH.getTime()) / 1000;
  const totalPings = elapsed / PING_LENGTH;

  const secs = (totalPings / PINGS_PER_SEC) % SECS_PER_DIN;
  const dins = (totalPings / (PINGS_PER_SEC * SECS_PER_DIN)) % DINS_PER_NARE; 
  const nares = (totalPings / (PINGS_PER_SEC * SECS_PER_DIN * DINS_PER_NARE)) % NARES_PER_DAY; 

  secsHand.style.transform = `rotateZ(${(secs / SECS_PER_DIN) * 360}deg)`;
  dinsHand.style.transform = `rotateZ(${(dins / DINS_PER_NARE) * 360}deg)`; 
  naresHand.style.transform = `rotateZ(${(nares / NARES_PER_DAY) * 360}deg)`; 

  pingsDisplayEl.textContent = `${Math.floor(totalPings % PINGS_PER_SEC)}`;

  const dinsDisplayRadius = 63;
  const dinsAngleRad = ((dins / DINS_PER_NARE) * 360 - 90) * Math.PI / 180; 
  dinDisplayText.textContent = Math.floor(dins); 
  dinDisplayText.setAttribute('x', 100 + dinsDisplayRadius * Math.cos(dinsAngleRad));
  dinDisplayText.setAttribute('y', 100 + dinsDisplayRadius * Math.sin(dinsAngleRad));

  const totalDays = Math.floor(totalPings / (PINGS_PER_SEC * SECS_PER_DIN * DINS_PER_NARE * NARES_PER_DAY)); 
  const dayOfYear = totalDays % DAYS_IN_YEAR;
  const seasons = ['Α', 'Β', 'Γ', 'Δ'];
  const months = ['I', 'II', 'III', 'IV', 'V'];
  const daysPerSeason = DAYS_PER_MONTH * MONTHS_PER_SEASON;
  const seasonIndex = Math.floor(dayOfYear / daysPerSeason);
  const dayInSeason = dayOfYear % daysPerSeason;
  const monthIndex = Math.floor(dayInSeason / DAYS_PER_MONTH);
  const dayInMonth = (dayInSeason % DAYS_PER_MONTH) + 1;
  rotationEl.innerHTML = `<span class="color-season">${seasons[seasonIndex]}</span> <span class="color-month">${months[monthIndex]}</span> <span class="color-day">${dayInMonth}</span>`;

  const siderealYear = Math.floor(elapsed / SIDEREAL_YEAR_SECS);
  yearDisplayEl.textContent = `Year ${siderealYear}`;

  updateEnvironmentalTimelines(now);

  requestAnimationFrame(updateClock);
}

if (!localStorage.getItem('user_lat') && "geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    MY_LAT = position.coords.latitude;
    MY_LONG = position.coords.longitude;
    localStorage.setItem('user_lat', MY_LAT);
    localStorage.setItem('user_long', MY_LONG);
  });
}

drawNotches();
updateClock();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service Worker Registered');
  });
}
