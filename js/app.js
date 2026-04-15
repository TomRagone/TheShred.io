// ── Setup ──
function showSetup() {
  hide('auth-screen');
  hide('app');
  document.getElementById('setup-screen').style.display = 'flex';
}

async function completeSetup() {
  const cal = +document.getElementById('sp-calories').value  || 1850;
  const pro = +document.getElementById('sp-protein').value   || 160;
  const fat = +document.getElementById('sp-fat').value       || 65;
  const wt  = +document.getElementById('sp-weight').value    || 0;
  const gwt = +document.getElementById('sp-goalweight').value || 0;
  const bud = +document.getElementById('sp-budget').value    || 2000;
  const ht  = document.getElementById('sp-height').value     || '';
  if (!cal) { document.getElementById('sp-err').textContent = 'Enter your calorie goal.'; return; }
  const btn = document.getElementById('sp-btn');
  btn.disabled = true; btn.textContent = 'Saving…';
  USER.goals = {calories: cal, protein: pro, fat: fat, weight: wt, goalWeight: gwt, budget: bud, height: ht};
  await sb.from('users').update({goals: USER.goals}).eq('id', USER.id);
  startApp();
}

// ── App ──
function startApp() {
  hide('auth-screen');
  document.getElementById('setup-screen').style.display = 'none';
  showBlock('app');
  document.getElementById('nav-user').textContent = USER.name || USER.username;
  loadQuickSettings();
  updateDietIntro();
  renderAll();
}

function loadQuickSettings() {
  const g = USER.goals;
  document.getElementById('qs-cal').value    = g.calories   || 1850;
  document.getElementById('qs-pro').value    = g.protein    || 160;
  document.getElementById('qs-fat').value    = g.fat        || 65;
  document.getElementById('qs-carbs').value  = g.carbs      || 200;
  document.getElementById('qs-wt').value     = g.weight     || '';
  document.getElementById('qs-gwt').value    = g.goalWeight || '';
  document.getElementById('qs-budget').value = g.budget     || 2000;
}

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  renderAll();
}

function renderAll() {
  if (!DATA || !USER) return;
  renderDiet();
  renderTraining();
  renderLooks();
  renderFinance();
  renderContent();
}

// ── Date Nav ──
function shiftDate(d) {
  const dt = new Date(currentDate + 'T12:00:00');
  dt.setDate(dt.getDate() + d);
  const nd = dt.toISOString().slice(0, 10);
  if (nd > getToday()) return;
  currentDate = nd;
  const today = getToday();
  if (!DATA.diet[currentDate])   DATA.diet[currentDate]   = [];
  if (!DATA.habits[currentDate]) DATA.habits[currentDate] = JSON.parse(JSON.stringify(DEFAULT_HABITS));
  document.getElementById('diet-date-label').textContent    = currentDate === today ? 'Today' : fmtDate(currentDate);
  document.getElementById('diet-next-btn').disabled         = currentDate >= today;
  renderDiet();
  renderLooks();
}

// ── Forms ──
function openForm(id)  { document.getElementById(id).classList.add('open'); }
function closeForm(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.form-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});

// ── Init ──
(async function init() {
  try {
    const session = JSON.parse(localStorage.getItem('shred-session') || 'null');
    if (session) {
      const {data} = await sb.from('users').select('*').eq('id', session.id).single();
      if (data) {
        USER = {id: data.id, username: data.username, name: data.name, goals: data.goals || {}};
        await loadUserData();
        hide('loading');
        if (!USER.goals.calories) { showSetup(); } else { startApp(); }
        return;
      }
    }
  } catch(e) {}
  hide('loading');
  show('auth-screen');
})();
