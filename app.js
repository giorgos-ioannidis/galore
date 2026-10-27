/* Αντίγραφο τιμοκαταλόγου & ωραρίου (20/10/2026): φαίνεται αμέσως και αντικαθίσταται από τη βάση όταν υπάρχει σύνδεση. */
const SNAPSHOT = {"cats": [{"id": 5, "name": "Μανικιούρ", "order_number": 1}, {"id": 6, "name": "Νύχια", "order_number": 2}, {"id": 7, "name": "Πεντικιούρ", "order_number": 3}, {"id": 8, "name": "Βλεφαρίδες & Φρύδια", "order_number": 4}], "svcs": [{"id": 32, "category_id": 5, "order_number": 1, "name": "Μανικιούρ εξπρές", "price": 7, "duration_minutes": 20, "description": "Βαφή χωρίς περιποίηση.", "is_active": true}, {"id": 33, "category_id": 5, "order_number": 2, "name": "Μανικιούρ απλό & μανό", "price": 12, "duration_minutes": 40, "description": "Απλή βαφή και περιποίηση.", "is_active": true}, {"id": 34, "category_id": 6, "order_number": 1, "name": "Ημιμόνιμο απλό", "price": 18, "duration_minutes": 60, "description": "", "is_active": true}, {"id": 35, "category_id": 6, "order_number": 2, "name": "Ενισχυμένο ημιμόνιμο", "price": 23, "duration_minutes": 75, "description": "", "is_active": true}, {"id": 36, "category_id": 6, "order_number": 3, "name": "Ενίσχυση φυσικού νυχιού με Acrygel", "price": 25, "duration_minutes": 90, "description": "Τιμή από 25€.", "is_active": true}, {"id": 37, "category_id": 6, "order_number": 4, "name": "Επιμήκυνση με Acrygel", "price": 30, "duration_minutes": 120, "description": "Τιμή από 30€.", "is_active": true}, {"id": 38, "category_id": 6, "order_number": 5, "name": "Επανατοποθέτηση Acrygel", "price": 30, "duration_minutes": 90, "description": "", "is_active": true}, {"id": 39, "category_id": 6, "order_number": 6, "name": "Nail Art", "price": 2, "duration_minutes": 15, "description": "Strass, γραμμικό, glitter. Τιμή από 2€.", "is_active": true}, {"id": 40, "category_id": 6, "order_number": 7, "name": "Baby Boomer / Γαλλικό", "price": 3, "duration_minutes": 15, "description": "", "is_active": true}, {"id": 41, "category_id": 6, "order_number": 8, "name": "Αφαίρεση ημιμόνιμου", "price": 5, "duration_minutes": 30, "description": "Με περιποίηση.", "is_active": true}, {"id": 42, "category_id": 6, "order_number": 9, "name": "Αφαίρεση Acrygel", "price": 10, "duration_minutes": 45, "description": "Με περιποίηση.", "is_active": true}, {"id": 43, "category_id": 7, "order_number": 1, "name": "Πεντικιούρ απλό", "price": 15, "duration_minutes": 45, "description": "", "is_active": true}, {"id": 44, "category_id": 7, "order_number": 2, "name": "Πεντικιούρ απλό & απλό βερνίκι", "price": 18, "duration_minutes": 50, "description": "", "is_active": true}, {"id": 45, "category_id": 7, "order_number": 3, "name": "Πεντικιούρ & ημιμόνιμο", "price": 23, "duration_minutes": 70, "description": "", "is_active": true}, {"id": 46, "category_id": 7, "order_number": 4, "name": "Ημιμόνιμο ποδιών", "price": 15, "duration_minutes": 45, "description": "", "is_active": true}, {"id": 47, "category_id": 8, "order_number": 1, "name": "Lash Lift", "price": 25, "duration_minutes": 45, "description": "", "is_active": true}, {"id": 48, "category_id": 8, "order_number": 2, "name": "Brow Lamination", "price": 25, "duration_minutes": 45, "description": "", "is_active": true}, {"id": 50, "category_id": 8, "order_number": 4, "name": "Henna", "price": 0, "duration_minutes": 30, "description": "Τιμή κατόπιν επικοινωνίας.", "is_active": true}], "hours": [{"weekday": 1, "open_time": "09:00:00", "close_time": "19:00:00"}, {"weekday": 2, "open_time": "09:00:00", "close_time": "19:00:00"}, {"weekday": 3, "open_time": "09:00:00", "close_time": "19:00:00"}, {"weekday": 4, "open_time": "09:00:00", "close_time": "19:00:00"}, {"weekday": 5, "open_time": "09:00:00", "close_time": "19:00:00"}]};
const db = (window.supabase && window.supabase.createClient) ? supabase.createClient(
  'https://osmarccznvpmfwkhyynu.supabase.co',
  'sb_publishable_YbzvUYpwaN6r3vM3a9JAAg_k-1XYLXT'
) : null;

const DAY_NAMES = ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'];
const DISPLAY_ORDER = [1,2,3,4,5,6,0];

let CATEGORIES = [];
let SERVICES = [];
let HOURS = {};

function euro(n){ const v = Number(n); return (v % 1 === 0 ? String(v) : v.toFixed(2).replace('.', ',')) + '€'; }
const cleanDesc = d => String(d || '').replace(/\s*τιμή\s+(από|κατόπιν)[^.]*\.?/ig, '').trim();
function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function priceText(s){
  if (!Number(s.price)) return 'Κατόπιν επικοινωνίας';
  return (/τιμή\s+από/i.test(s.description || '') ? 'από ' : '') + euro(s.price);
}
function localISO(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
const toMin = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };

/* Google κριτικές: ζωντανά από Places API όταν μπει κλειδί (περιορισμένο στο domain του site). */
const GOOGLE_PLACES_KEY = '';
const PLACE_ID = 'ChIJ6wC-TDG3rhQR4SmuVWcEX_U';
async function loadGoogleReviews(){
  if (!GOOGLE_PLACES_KEY) return;
  try {
    const r = await fetch('https://places.googleapis.com/v1/places/' + PLACE_ID + '?languageCode=el', {
      headers: { 'X-Goog-Api-Key': GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' } });
    if (!r.ok) return;
    const p = await r.json();
    const count = Number(p.userRatingCount) || 0;
    if (!count) return;
    const stars = n => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(n), 10 - Math.round(n));
    const label = `★ ${Number(p.rating).toFixed(1).replace('.', ',')} (${count} ${count === 1 ? 'κριτική' : 'κριτικές'} στο Google)`;
    document.getElementById('revSummary').textContent = label;
    document.getElementById('revSummary').hidden = false;
    document.getElementById('sideRating').textContent = label;
    const list = (p.reviews || []).filter(v => v.text && v.text.text).slice(0, 5);
    if (list.length){
      document.getElementById('revList').innerHTML = list.map(v => `<div class="rev-card"><div class="st">${stars(v.rating)}</div><p>${esc(v.text.text)}</p><p class="who">${esc((v.authorAttribution || {}).displayName || '')}${v.relativePublishTimeDescription ? ' · ' + esc(v.relativePublishTimeDescription) : ''}</p></div>`).join('');
      document.getElementById('revList').hidden = false;
      document.getElementById('revEmpty').hidden = true;
    }
    document.getElementById('revCredit').hidden = false;
  } catch (e) {}
}
function timeLabel(t){ return t.slice(0,5); }

function sortServices(list, cats){
  const co = {}; cats.forEach(c => { co[c.id] = c.order_number; });
  return list.slice().sort((a, b) => (co[a.category_id] - co[b.category_id]) || (a.order_number - b.order_number));
}
function applyData(cats, svcs, hrs){
  CATEGORIES = cats.slice().sort((a, b) => a.order_number - b.order_number);
  SERVICES = sortServices(svcs.filter(x => x.is_active !== false), CATEGORIES);
  HOURS = {};
  hrs.forEach(h => { if (h && h.open_time && h.close_time && toMin(h.close_time) > toMin(h.open_time)) HOURS[h.weekday] = h; });
  renderTabs();
  renderServiceList('all');
  renderHours();
  renderStatusBadge();
  const dlg = document.getElementById('bookingDialog');
  if (dlg && dlg.open && booking.step === 1) { renderBkTabs('all'); syncCombo(); renderBkServiceList('all'); }
}
async function loadData(){
  applyData(SNAPSHOT.cats, SNAPSHOT.svcs, SNAPSHOT.hours);
  if (!db) return;
  try {
    const [c, sv, h] = await Promise.all([
      db.from('service_categories').select('*').order('order_number'),
      db.from('services').select('*').eq('is_active', true).order('order_number'),
      db.from('business_hours').select('*'),
    ]);
    if (c.error || sv.error || h.error || !(c.data || []).length || !(sv.data || []).length) return;
    applyData(c.data, sv.data, h.data || []);
  } catch (e) { /* μένει το αντίγραφο */ }
}

function renderTabs(){
  const el = document.getElementById('serviceTabs');
  const all = [{ id: 'all', name: 'Όλα' }, ...CATEGORIES];
  el.innerHTML = all.map(c => `<button type="button" class="tab${c.id==='all'?' active':''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
  el.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    el.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderServiceList(btn.dataset.cat);
  }));
}

function renderServiceList(catFilter){
  const el = document.getElementById('serviceList');
  const list = catFilter === 'all' ? SERVICES : SERVICES.filter(s => String(s.category_id) === String(catFilter));
  el.innerHTML = list.map(s => `
    <div class="service-row">
      <div class="service-info">
        <h3>${esc(s.name)}</h3>
        ${cleanDesc(s.description) ? `<details><summary>Περισσότερα ⌄</summary><p>${esc(cleanDesc(s.description))}</p></details>` : ''}
        <div class="service-meta">◷ ${s.duration_minutes} λεπτά &nbsp; <b>${priceText(s)}</b></div>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="openBooking(${s.id})">📅 Κράτηση</button>
    </div>
  `).join('');
}

function renderHours(){
  const el = document.getElementById('hoursList');
  el.innerHTML = DISPLAY_ORDER.map(day => {
    const h = HOURS[day];
    return `<li><span>${DAY_NAMES[day]}</span><b>${h ? timeLabel(h.open_time) + ' – ' + timeLabel(h.close_time) : 'Κλειστά'}</b></li>`;
  }).join('');
}

function renderStatusBadge(){
  const el = document.getElementById('statusBadge');
  const now = new Date();
  const today = HOURS[now.getDay()];
  const hhmm = now.getHours() * 60 + now.getMinutes();
  if (today) {
    const [oh, om] = today.open_time.split(':').map(Number);
    const [ch, cm] = today.close_time.split(':').map(Number);
    if (hhmm >= oh * 60 + om && hhmm < ch * 60 + cm) {
      el.textContent = `Ανοιχτά · κλείνει ${timeLabel(today.close_time)}`;
      return;
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const h = HOURS[d.getDay()];
    if (h) {
      const label = i === 1 ? 'αύριο' : DAY_NAMES[d.getDay()];
      el.textContent = `Κλειστά · ανοίγει ${label} ${timeLabel(h.open_time)}`;
      return;
    }
  }
  el.textContent = 'Κλειστά';
}

let booking = { step: 1, ids: [], service: null, date: '', time: '' };

/* Πολλαπλές υπηρεσίες σε ένα ραντεβού: αφαιρέσεις πρώτα, μετά οι κύριες, στο τέλος τα διακοσμητικά. */
const isRemoval = s => /^αφαίρεση/i.test(s.name);
const isDecor = s => /nail art|baby boomer|γαλλικό/i.test(s.name);
const addonServices = () => SERVICES.filter(s => isRemoval(s) || isDecor(s)).sort((a, b) => rank(a) - rank(b));
const rank = s => isRemoval(s) ? 0 : isDecor(s) ? 2 : 1;
/* Αυστηρός έλεγχος email: λατινικοί χαρακτήρες, ένα @, πραγματικό domain με κατάληξη (.gr, .com κ.λπ.). */
function isValidEmail(e){
  if (!e || e.length > 254) return false;
  const re = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
  if (!re.test(e)) return false;
  const [local, domain] = e.split('@');
  if (/\.\./.test(local) || /\.\./.test(domain)) return false;
  const typos = { 'gmial.com':1, 'gmai.com':1, 'gamil.com':1, 'gmail.co':1, 'gmail.gr':1, 'hotmial.com':1, 'yaho.com':1, 'outlok.com':1 };
  return !typos[domain.toLowerCase()];
}
function fmtDur(m){ const h = Math.floor(m / 60), r = m % 60; return h ? `${h}ω${r ? ' ' + r + "'" : ''}` : `${r}'`; }
function pickedServices(){
  const catOrder = {}; CATEGORIES.forEach(c => { catOrder[c.id] = c.order_number; });
  return booking.ids.map(id => SERVICES.find(s => s.id === id)).filter(Boolean)
    .sort((a, b) => rank(a) - rank(b) || (catOrder[a.category_id] - catOrder[b.category_id]) || (a.order_number - b.order_number));
}
function syncCombo(){
  const list = pickedServices();
  if (!list.length) { booking.service = null; booking.mainId = null; booking.extraIds = []; return; }
  const main = list.slice().sort((a, b) => (rank(a) === 1 ? 0 : 1) - (rank(b) === 1 ? 0 : 1) || b.duration_minutes - a.duration_minutes)[0];
  booking.mainId = main.id;
  booking.extraIds = list.filter(s => s.id !== main.id).map(s => s.id);
  booking.service = {
    id: main.id,
    list,
    name: list.map(s => s.name).join(' + '),
    duration_minutes: list.reduce((t, s) => t + (Number(s.duration_minutes) || 0), 0) || 30,
    price: list.reduce((t, s) => t + (Number(s.price) || 0), 0),
    from: list.some(s => /τιμή\s+από/i.test(s.description || '')),
    onRequest: list.some(s => !Number(s.price)),
  };
}
function comboPrice(c){
  if (!c) return '';
  if (!c.price) return 'Κατόπιν επικοινωνίας';
  return (c.from ? 'από ' : '') + euro(c.price) + (c.onRequest ? ' + κατόπιν επικοινωνίας' : '');
}
function renderBkTotal(){
  const el = document.getElementById('bkTotal');
  const c = booking.service;
  el.hidden = !c;
  if (c) {
    el.innerHTML = `<div class="picked">${c.list.map(x => `<span class="pick-chip">${esc(x.name)}<button type="button" class="pick-x" data-id="${x.id}" aria-label="Αφαίρεση: ${esc(x.name)}">×</button></span>`).join('')}</div><span>◷ ${fmtDur(c.duration_minutes)}</span><b>${comboPrice(c)}</b>`;
    el.querySelectorAll('.pick-x').forEach(b => b.addEventListener('click', () => togglePick(Number(b.dataset.id), false)));
  }
  const ad = document.getElementById('bkAddons');
  const nailCats = CATEGORIES.filter(k => /νύχ|μανικ|πεντικ/i.test(k.name)).map(k => String(k.id));
  const nailPicked = c && c.list.some(s => nailCats.includes(String(s.category_id)) && rank(s) === 1);
  const avail = addonServices().filter(s => !booking.ids.includes(s.id));
  ad.hidden = !nailPicked || !avail.length;
  if (!ad.hidden) {
    ad.innerHTML = '<span class="lbl">Θέλετε να προσθέσετε;</span>' + avail.map(s => `<button type="button" class="addon" data-id="${s.id}">+ ${esc(s.name)} · ${priceText(s)}</button>`).join('');
    ad.querySelectorAll('.addon').forEach(b => b.addEventListener('click', () => togglePick(Number(b.dataset.id), true)));
  }
}
function togglePick(id, on){
  booking.ids = on ? [...new Set([...booking.ids, id])] : booking.ids.filter(x => x !== id);
  booking.time = '';
  syncCombo();
  const box = document.querySelector(`#bkServiceList input[value="${id}"]`);
  if (box) box.checked = on;
  renderBkTotal();
  showError('');
}

window.openBooking = function(serviceId){
  booking = { step: 1, ids: serviceId ? [serviceId] : [], service: null, date: '', time: '' };
  syncCombo();
  renderBkTabs('all');
  renderBkServiceList('all');
  goToStep(1);
  document.getElementById('bookingDialog').showModal();
};

function renderBkTabs(active){
  const el = document.getElementById('bkTabs');
  const all = [{ id: 'all', name: 'Όλα' }, ...CATEGORIES];
  el.innerHTML = all.map(c => `<button type="button" class="tab${String(c.id)===String(active)?' active':''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
  el.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    renderBkTabs(btn.dataset.cat);
    renderBkServiceList(btn.dataset.cat);
  }));
}

function renderBkServiceList(catFilter){
  const list = catFilter === 'all' ? SERVICES : SERVICES.filter(s => String(s.category_id) === String(catFilter));
  const el = document.getElementById('bkServiceList');
  el.innerHTML = list.map(s => `
    <label class="service-pick">
      <input type="checkbox" name="bkService" value="${s.id}" ${booking.ids.includes(s.id) ? 'checked' : ''}>
      <span>${esc(s.name)}</span>
      <span class="service-pick-meta">◷ ${s.duration_minutes}' · ${priceText(s)}</span>
    </label>
  `).join('');
  el.querySelectorAll('input[name=bkService]').forEach(r => r.addEventListener('change', () => togglePick(Number(r.value), r.checked)));
  renderBkTotal();
}

function goToStep(n){
  booking.step = n;
  document.querySelectorAll('.booking-panel').forEach(p => p.hidden = Number(p.dataset.panel) !== n);
  document.querySelectorAll('#bookingSteps .step').forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
  document.getElementById('bookingSteps').style.display = n === 5 ? 'none' : 'flex';
  document.getElementById('bkBack').style.visibility = (n <= 1 || n === 5) ? 'hidden' : 'visible';
  const nextBtn = document.getElementById('bkNext');
  nextBtn.textContent = n === 4 ? 'Κράτηση' : (n === 5 ? 'Κλείσιμο' : 'Επόμενο');
  showError('');
  if (n === 2) { renderDays(); renderSlots(); }
  if (n === 4) renderSummary();
}

function showError(msg){
  const el = document.getElementById('bkError');
  el.textContent = msg;
  el.hidden = !msg;
}

/* Πιασμένες ώρες από το Google Calendar (μέσω Apps Script). Αν δεν απαντήσει σε 6", συνεχίζουμε μόνο με τη βάση. */
const CALENDAR_BUSY_URL = 'https://script.google.com/macros/s/AKfycbxVNS-e4T1zUdua7bPqS5WBDGoyhOx-ZIs6TCo1PQpKV4sArYeRamsNuWDwCVg3kz_M/exec';
async function fetchCalendarBusy(dateISO){
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
    const r = await fetch(CALENDAR_BUSY_URL + '?date=' + encodeURIComponent(dateISO), { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) return [];
    const j = await r.json();
    return (j.busy || []).filter(x => Array.isArray(x) && x.length === 2).map(x => [Number(x[0]), Number(x[1])]);
  } catch (e) { return []; }
}
const DAY_SHORT = ['Κυρ','Δευ','Τρι','Τετ','Πεμ','Παρ','Σαβ'];
const MON_SHORT = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ'];
function renderDays(){
  const wrap = document.getElementById('bkDays');
  const input = document.getElementById('bkDate');
  const days = [];
  const d0 = new Date(); d0.setHours(0,0,0,0);
  for (let i = 0; i < 28; i += 1) { const d = new Date(d0); d.setDate(d0.getDate() + i); days.push(d); }
  if (!input.value) { const first = days.find(d => HOURS[d.getDay()]); if (first) input.value = localISO(first); }
  wrap.innerHTML = days.map(d => {
    const iso = localISO(d), open = !!HOURS[d.getDay()];
    return `<button type="button" class="day${input.value === iso ? ' active' : ''}" data-d="${iso}" ${open ? '' : 'disabled'} aria-selected="${input.value === iso}" aria-label="${DAY_NAMES[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}${open ? '' : ', κλειστά'}"><span class="dw">${DAY_SHORT[d.getDay()]}</span><span class="dn">${d.getDate()}</span><span class="dm">${MON_SHORT[d.getMonth()]}</span></button>`;
  }).join('');
  wrap.querySelectorAll('.day:not([disabled])').forEach(b => b.addEventListener('click', () => {
    input.value = b.dataset.d; booking.time = '';
    wrap.querySelectorAll('.day').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-selected', x === b); });
    renderSlots();
  }));
  const act = wrap.querySelector('.day.active'); if (act) act.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
async function renderSlots(){
  const dateInput = document.getElementById('bkDate');
  const todayISO = localISO(new Date());
  dateInput.min = todayISO;
  const el = document.getElementById('bkSlots');
  if (!dateInput.value) { el.innerHTML = ''; return; }
  if (dateInput.value < todayISO) { el.innerHTML = '<p class="empty-slots">Η ημερομηνία έχει περάσει.</p>'; return; }
  const d = new Date(dateInput.value + 'T00:00:00');
  document.getElementById('bkDayLabel').textContent = '· ' + DAY_NAMES[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1);
  const hrs = HOURS[d.getDay()];
  if (!hrs) { el.innerHTML = '<p class="empty-slots">Κλειστά αυτή την ημέρα.</p>'; return; }
  const dur = booking.service ? Number(booking.service.duration_minutes) || 30 : 30;

  el.innerHTML = '<p class="empty-slots">Έλεγχος διαθεσιμότητας…</p>';
  let taken = [], error = null;
  if (db) { try { const res = await db
    .from('public_booking_slots')
    .select('booking_time, service_id, total_minutes')
    .eq('booking_date', dateInput.value); taken = res.data || []; error = res.error; } catch (e) { error = e; } }
  else { error = 'offline'; }
  document.getElementById('bkSlotNote').hidden = !error;
  document.getElementById('bkSlotNote').textContent = error ? 'Οι ώρες βγαίνουν από το ωράριο. Η Μαρίζα θα επιβεβαιώσει τηλεφωνικά ότι η ώρα είναι ελεύθερη.' : '';
  const busy = (taken || []).map(t => {
    const sv = SERVICES.find(x => x.id === t.service_id);
    const st = toMin(t.booking_time);
    return [st, st + (Number(t.total_minutes) || (sv ? Number(sv.duration_minutes) || 30 : 30))];
  });

  busy.push(...await fetchCalendarBusy(dateInput.value));
  if (dateInput.value !== document.getElementById('bkDate').value) return;
  const open = toMin(hrs.open_time), close = toMin(hrs.close_time);
  let earliest = open;
  if (dateInput.value === todayISO) { const n = new Date(); earliest = Math.max(open, n.getHours() * 60 + n.getMinutes() + 60); }
  // Υποψήφιες ώρες: κάθε μισάωρο, συν όσες κολλάνε ακριβώς πριν ή μετά από πιασμένο ραντεβού (για να μη μένουν κενά).
  const fmt = m => String(Math.floor(m/60)).padStart(2,'0') + ':' + String(m%60).padStart(2,'0');
  const cand = new Set();
  for (let cur = open; cur + dur <= close; cur += 30) cand.add(cur);
  busy.forEach(([a, b]) => { if (b >= open && b + dur <= close) cand.add(b); if (a - dur >= open && a <= close) cand.add(a - dur); });
  const slots = [...cand].sort((a, b) => a - b)
    .filter(cur => cur >= earliest && !busy.some(([a, b]) => cur < b && cur + dur > a))
    .map(fmt);
  booking.timeEnd = '';
  if (booking.time && !slots.includes(booking.time)) booking.time = '';
  if (!slots.length) { el.innerHTML = '<p class="empty-slots">Δεν υπάρχουν διαθέσιμες ώρες αυτή την ημέρα.</p>'; return; }
  el.innerHTML = slots.map(t => `<button type="button" class="slot${booking.time===t?' active':''}" data-t="${t}" data-e="${fmt(toMin(t) + dur)}" aria-label="${t} έως ${fmt(toMin(t) + dur)}">${t}<small>έως ${fmt(toMin(t) + dur)}</small></button>`).join('');
  if (booking.time) booking.timeEnd = fmt(toMin(booking.time) + dur);
  el.querySelectorAll('.slot').forEach(b => b.addEventListener('click', () => {
    booking.time = b.dataset.t; booking.timeEnd = b.dataset.e;
    el.querySelectorAll('.slot').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  }));
}
document.getElementById('bkDate').addEventListener('change', renderSlots);
document.getElementById('bkEmail').addEventListener('blur', e => {
  const v = e.target.value.trim();
  const ok = !v || isValidEmail(v);
  e.target.toggleAttribute('aria-invalid', !ok);
  if (!ok) showError('Το email δεν είναι σωστό. Γράψτε το ολόκληρο με λατινικούς χαρακτήρες, π.χ. maria@gmail.com.'); else if (booking.step === 3) showError('');
});

function renderSummary(){
  const s = booking.service;
  document.getElementById('bkSummary').innerHTML = `
    <p><b>${s && s.list.length > 1 ? 'Υπηρεσίες' : 'Υπηρεσία'}:</b></p>
    <ul class="sum-list">${s ? s.list.map(x => `<li>${esc(x.name)} · ${x.duration_minutes}' · ${priceText(x)}</li>`).join('') : '<li>—</li>'}</ul>
    <p><b>Ημερομηνία:</b> ${booking.date || '—'}</p>
    <p><b>Ώρα:</b> ${booking.time ? booking.time + (booking.timeEnd ? ' – ' + booking.timeEnd : '') + (s ? ` (${fmtDur(s.duration_minutes)})` : '') : '—'}</p>
    <p><b>Πελάτης:</b> ${esc(booking.first || '')} ${esc(booking.last || '')}</p>
    <p><b>Email:</b> ${esc(booking.email || '—')}</p>
    <p><b>Τηλέφωνο:</b> ${esc(booking.phone || '—')}</p>
    ${s ? `<p class="summary-price"><b>Σύνολο:</b> ${comboPrice(s)}</p>` : ''}
  `;
}

document.getElementById('bkNext').addEventListener('click', async () => {
  const n = booking.step;
  if (n === 1) {
    if (!booking.service) return showError('Επιλέξτε τουλάχιστον μία υπηρεσία.');
  }
  if (n === 2) {
    booking.date = document.getElementById('bkDate').value;
    if (!booking.date || !booking.time) return showError('Επιλέξτε ημερομηνία και ώρα.');
  }
  if (n === 3) {
    const v = id => document.getElementById(id).value.trim();
    booking.first = v('bkFirst'); booking.last = v('bkLast'); booking.email = v('bkEmail'); booking.phone = v('bkPhone'); booking.note = v('bkNote');
    ['bkFirst','bkLast','bkPhone','bkEmail'].forEach(id => document.getElementById(id).removeAttribute('aria-invalid'));
    const bad = (id, msg) => { const f = document.getElementById(id); f.setAttribute('aria-invalid', 'true'); f.focus(); return showError(msg); };
    if (!booking.first) return bad('bkFirst', 'Συμπληρώστε το όνομά σας.');
    if (!booking.last) return bad('bkLast', 'Συμπληρώστε το επώνυμό σας.');
    if (!booking.phone && !booking.email) { document.getElementById('bkEmail').setAttribute('aria-invalid', 'true'); return bad('bkPhone', 'Συμπληρώστε τηλέφωνο ή email, για να μπορέσουμε να επιβεβαιώσουμε το ραντεβού.'); }
    if (booking.phone) {
      const d = booking.phone.replace(/[\s\-().]/g, '').replace(/^(\+30|0030)/, '');
      if (!/^(69\d{8}|2\d{9})$/.test(d)) return bad('bkPhone', 'Το τηλέφωνο δεν φαίνεται σωστό. Γράψτε 10 ψηφία, π.χ. 69XXXXXXXX.');
      booking.phone = d;
    }
    if (booking.email) {
      booking.email = booking.email.toLowerCase();
      if (!isValidEmail(booking.email)) return bad('bkEmail', 'Το email δεν είναι σωστό. Γράψτε το ολόκληρο με λατινικούς χαρακτήρες, π.χ. maria@gmail.com.');
    }
  }
  if (n === 4) {
    document.getElementById('bkNext').disabled = true;
    let error = 'offline';
    if (db) { try { ({ error } = await db.from('bookings').insert({
      service_id: booking.mainId,
      extra_service_ids: booking.extraIds,
      first_name: booking.first,
      last_name: booking.last,
      email: booking.email,
      phone: booking.phone,
      note: booking.note || '',
      booking_date: booking.date,
      booking_time: booking.time,
    })); } catch (e) { error = e; } }
    document.getElementById('bkNext').disabled = false;
    if (error && /slot_taken|slot_outside|slot_closed/.test(String(error.message || ''))) {
      booking.time = ''; goToStep(2);
      return showError('Αυτή η ώρα μόλις κλείστηκε ή δεν χωράει το ραντεβού. Διαλέξτε άλλη ώρα.');
    }
    if (error) {
      const msg = `Γεια σας, θα ήθελα ραντεβού: ${booking.service.name}, ${booking.date} στις ${booking.time}. ${booking.first} ${booking.last}, ${booking.phone}`;
      const el = document.getElementById('bkError');
      el.innerHTML = `Δεν μπορέσαμε να στείλουμε την κράτηση online αυτή τη στιγμή. <a href="tel:+306908532535" style="color:inherit;font-weight:700">Καλέστε στο 690 853 2535</a> ή <a href="sms:+306908532535?&body=${encodeURIComponent(msg)}" style="color:inherit;font-weight:700">στείλτε SMS με τα στοιχεία</a>.`;
      el.hidden = false;
      return;
    }
    const how = booking.phone ? `θα σας πάρει τηλέφωνο στο ${booking.phone}` : `θα σας στείλει email στο ${booking.email}`;
    document.getElementById('bkThanks').textContent = `Η κράτησή σας καταχωρήθηκε. Η Μαρίζα ${how} για επιβεβαίωση. Αν δεν μπορείτε να έρθετε, ενημερώστε τη στο 690 853 2535.`;
    goToStep(5);
    return;
  }
  if (n === 5) { document.getElementById('bookingDialog').close(); return; }
  goToStep(n + 1);
});

document.getElementById('bkBack').addEventListener('click', () => {
  if (booking.step > 1 && booking.step < 5) goToStep(booking.step - 1);
});
document.getElementById('dialogClose').addEventListener('click', () => document.getElementById('bookingDialog').close());
document.getElementById('bookingDialog').addEventListener('click', (e) => {
  if (e.target.id === 'bookingDialog') document.getElementById('bookingDialog').close();
});
document.getElementById('bookingForm').addEventListener('submit', e => e.preventDefault());

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

loadData();
loadGoogleReviews();
