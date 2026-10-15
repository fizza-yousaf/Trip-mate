'use strict';

const STORAGE_KEY = 'tripmate_trips_v1';
const form = document.getElementById('tripForm');
const tripsList = document.getElementById('tripsList');
const tripCount = document.getElementById('tripCount');
const dialog = document.getElementById('tripDialog');
const dialogBody = document.getElementById('dialogBody');
const formError = document.getElementById('formError');
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const currentDate = new Date();
const today = [
  currentDate.getFullYear(),
  String(currentDate.getMonth() + 1).padStart(2, '0'),
  String(currentDate.getDate()).padStart(2, '0')
].join('-');
startInput.min = today;
endInput.min = today;
document.getElementById('year').textContent = new Date().getFullYear();

function readTrips() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
let trips = readTrips();

function saveTrips() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch {
    formError.textContent = 'Unable to save trips. Check your browser storage settings.';
    return false;
  }
}

function parseDate(value) { return new Date(`${value}T12:00:00`); }
function dayCount(start, end) { return Math.round((Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / 86400000) + 1; }
function formatDate(value) { return parseDate(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function formatMoney(value) { return new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(value); }
function iconForStyle(style) { return ({adventure:'🏔️',culture:'🏛️',relaxation:'🌴',food:'🍜'})[style] || '✈️'; }

const activityIdeas = {
  adventure: ['Explore a scenic hiking trail', 'Discover a nearby natural landmark', 'Try a local outdoor adventure', 'Watch the sunset from a viewpoint', 'Take a nature photography walk', 'Visit a national park or garden'],
  culture: ['Explore the historic center', 'Visit a museum or heritage site', 'Join a guided walking tour', 'Discover local art and architecture', 'Browse a traditional market', 'Experience a cultural performance'],
  relaxation: ['Enjoy a slow morning at a café', 'Visit a peaceful park or waterfront', 'Book some time for rest and wellness', 'Find a beautiful sunset spot', 'Enjoy a leisurely scenic walk', 'Spend an unplanned afternoon exploring'],
  food: ['Try a signature local breakfast', 'Visit a food market', 'Taste a popular regional dish', 'Explore neighborhood cafés', 'Try a street-food favorite', 'Book a memorable local dinner']
};
const destinationIdeas = [
  {match:/hunza|gilgit|skardu|swat|kashmir|murree/i, ideas:['Enjoy panoramic mountain views', 'Visit a scenic lake or valley', 'Explore local mountain culture']},
  {match:/paris/i, ideas:['Stroll along the Seine', 'Admire the Eiffel Tower', 'Explore Montmartre']},
  {match:/tokyo|japan/i, ideas:['Explore a vibrant shopping district', 'Visit a traditional shrine', 'Try a local ramen spot']},
  {match:/dubai/i, ideas:['Explore the historic Al Fahidi district', 'Enjoy a waterfront walk', 'Visit a traditional souk']},
  {match:/istanbul/i, ideas:['Explore the historic Sultanahmet area', 'Walk along the Bosphorus', 'Browse the Grand Bazaar']},
  {match:/london/i, ideas:['Explore a free museum', 'Walk beside the Thames', 'Visit a famous city market']}
];

function buildItinerary(trip) {
  const basics = activityIdeas[trip.style] || activityIdeas.adventure;
  const match = destinationIdeas.find(item => item.match.test(trip.destination));
  const suggestions = match ? [...match.ideas, ...basics] : basics;
  const days = Math.min(dayCount(trip.startDate, trip.endDate), 30);
  return Array.from({length: days}, (_, index) => {
    const date = parseDate(trip.startDate);
    date.setDate(date.getDate() + index);
    return {
      day: index + 1,
      date: date.toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric'}),
      ideas: [suggestions[(index * 2) % suggestions.length], suggestions[(index * 2 + 1) % suggestions.length]]
    };
  });
}

function renderTrips() {
  tripCount.textContent = `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'}`;
  if (!trips.length) {
    tripsList.innerHTML = '<div class="empty-state"><div class="empty-icon">🧳</div><h3>Your adventure starts here</h3><p>No trips yet. Create your first itinerary above!</p></div>';
    return;
  }
  tripsList.innerHTML = trips.map(trip => `
    <article class="trip-card">
      <div class="trip-card-top"><span aria-hidden="true">${iconForStyle(trip.style)}</span><span>${dayCount(trip.startDate,trip.endDate)} DAYS</span></div>
      <div class="trip-card-body"><h3>${escapeHtml(trip.destination)}</h3><p>📅 ${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}</p><p>👥 ${trip.travelers} ${trip.travelers === 1 ? 'traveler' : 'travelers'} ${trip.budget !== null ? ` · 💰 ${formatMoney(trip.budget)}` : ''}</p>
      <div class="trip-card-actions"><button class="small-btn" data-action="view" data-id="${escapeHtml(trip.id)}">View itinerary ↗</button><button class="small-btn danger" data-action="delete" data-id="${escapeHtml(trip.id)}">Delete</button></div></div>
    </article>`).join('');
}

startInput.addEventListener('change', () => { endInput.min = startInput.value || today; if (endInput.value && endInput.value < startInput.value) endInput.value = startInput.value; });
form.addEventListener('submit', event => {
  event.preventDefault();
  formError.textContent = '';
  const data = new FormData(form);
  const destination = String(data.get('destination') || '').trim();
  const startDate = String(data.get('startDate') || '');
  const endDate = String(data.get('endDate') || '');
  const travelers = Number(data.get('travelers'));
  const rawBudget = String(data.get('budget') || '').trim();
  const budget = rawBudget === '' ? null : Number(rawBudget);
  const style = String(data.get('travelStyle'));
  if (!destination || !startDate || !endDate) { formError.textContent = 'Please fill in your destination and travel dates.'; return; }
  if (startDate < today || endDate < startDate) { formError.textContent = 'Please choose valid future dates. End date must be on or after start date.'; return; }
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 30 || (budget !== null && (!Number.isFinite(budget) || budget < 0))) { formError.textContent = 'Please enter valid traveler and budget values.'; return; }
  const trip = {id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`, destination, startDate, endDate, travelers, budget, style};
  trips.unshift(trip);
  if (!saveTrips()) { trips.shift(); return; }
  renderTrips();
  form.reset();
  endInput.min = today;
  document.getElementById('trips').scrollIntoView({behavior:'smooth'});
});

tripsList.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const trip = trips.find(item => item.id === button.dataset.id);
  if (!trip) return;
  if (button.dataset.action === 'view') showTrip(trip);
  if (button.dataset.action === 'delete' && confirm(`Delete your trip to ${trip.destination}?`)) {
    const previous = trips;
    trips = trips.filter(item => item.id !== trip.id);
    if (!saveTrips()) trips = previous;
    renderTrips();
  }
});

function showTrip(trip) {
  document.getElementById('dialogTitle').textContent = trip.destination;
  const itinerary = buildItinerary(trip);
  const days = dayCount(trip.startDate, trip.endDate);
  dialogBody.innerHTML = `
    <div class="details-meta"><span>📅 ${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}</span><span>🌍 ${days} days</span><span>👥 ${trip.travelers} travelers</span>${trip.budget !== null ? `<span>💰 ${formatMoney(trip.budget)} total</span>` : ''}</div>
    <section class="detail-section"><h3>Destination weather</h3><div class="weather-box" id="weatherInfo">Checking forecast…</div></section>
    <section class="detail-section"><h3>Your suggested itinerary</h3><p style="font-size:12px;color:#728581">Activity ideas are suggestions, not confirmed bookings or opening hours.</p>${itinerary.map(day => `<div class="day-plan"><strong>Day ${day.day} · ${day.date}</strong><p>✦ ${escapeHtml(day.ideas[0])}<br>✦ ${escapeHtml(day.ideas[1])}</p></div>`).join('')}${days > 30 ? '<p>Showing the first 30 days of your trip.</p>' : ''}</section>
    <div class="dialog-actions"><button class="small-btn" id="downloadTrip">Download itinerary</button><button class="small-btn secondary" id="printTrip">Print</button></div>`;
  dialog.showModal();
  document.getElementById('downloadTrip').addEventListener('click', () => downloadTrip(trip, itinerary));
  document.getElementById('printTrip').addEventListener('click', () => window.print());
  loadWeather(trip);
}

function downloadTrip(trip, itinerary) {
  const lines = [`TRIPMATE — ${trip.destination}`, `${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}`, `Travelers: ${trip.travelers}`, `Budget: ${trip.budget === null ? 'Not set' : formatMoney(trip.budget)}`, '', 'SUGGESTED ITINERARY', ...itinerary.flatMap(day => [`Day ${day.day} (${day.date})`, ...day.ideas.map(idea => `- ${idea}`), '']), '', 'Ideas are suggestions; verify availability locally.'];
  const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `TripMate-${trip.destination.replace(/[^a-z0-9-]/gi,'-')}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function loadWeather(trip) {
  const weatherInfo = document.getElementById('weatherInfo');
  try {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trip.destination)}&count=1&language=en&format=json`);
    if (!locationResponse.ok) throw new Error('Location service unavailable');
    const locations = await locationResponse.json();
    const location = locations.results?.[0];
    if (!location) { weatherInfo.textContent = 'Destination not found in the weather service. Try a major nearby city.'; return; }
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
    if (!response.ok) throw new Error('Forecast unavailable');
    const weather = await response.json();
    if (!weather.current) throw new Error('Forecast unavailable');
    const code = weather.current.weather_code;
    const condition = code === 0 ? 'Clear sky' : code <= 3 ? 'Partly cloudy' : code <= 48 ? 'Foggy' : code <= 67 ? 'Rainy' : code <= 77 ? 'Snowy' : code <= 82 ? 'Rain showers' : code <= 86 ? 'Snow showers' : 'Thunderstorms';
    weatherInfo.textContent = `${location.name}${location.country ? ', ' + location.country : ''}: ${Math.round(weather.current.temperature_2m)}°C · ${condition} · Humidity ${weather.current.relative_humidity_2m}%. This is the current weather, not a forecast for your trip dates.`;
  } catch {
    weatherInfo.textContent = 'Weather is temporarily unavailable. You can still view and download your itinerary.';
  }
}

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
renderTrips();
