// ── Diet ──
function renderDiet() {
  const g   = USER.goals;
  const log = DATA.diet[currentDate] || [];
  const t   = log.reduce((a, i) => ({
    calories: a.calories + (i.calories || 0),
    protein:  a.protein  + (i.protein  || 0),
    fat:      a.fat      + (i.fat      || 0),
    carbs:    a.carbs    + (i.carbs    || 0),
  }), {calories: 0, protein: 0, fat: 0, carbs: 0});

  const rem   = g.calories - t.calories;
  const remEl = document.getElementById('diet-remaining');
  remEl.textContent = Math.abs(rem).toLocaleString();
  remEl.className   = 'text-5xl font-bold tracking-tighter leading-none ' + (rem < 0 ? 'text-app-red' : rem < 300 ? '' : 'text-app-green');
  document.getElementById('diet-sub').textContent = `${rem < 0 ? 'over goal' : 'remaining'} · ${t.calories.toLocaleString()} / ${(g.calories || 1850).toLocaleString()} eaten`;

  document.getElementById('m-pro').textContent       = t.protein + 'g';
  document.getElementById('m-fat').textContent       = t.fat + 'g';
  document.getElementById('m-carbs').textContent     = t.carbs + 'g';
  document.getElementById('m-pro-goal').textContent  = 'goal ' + (g.protein || 160) + 'g';
  document.getElementById('m-fat-goal').textContent  = 'goal ' + (g.fat || 65) + 'g';
  document.getElementById('m-wt').textContent        = g.weight ? g.weight + 'lb' : '—';
  document.getElementById('m-gwt').textContent       = g.goalWeight ? 'goal ' + g.goalWeight + 'lb' : 'set goal';

  const setProg = (id, val, goal, vid, unit) => {
    const pct = Math.min(val / goal * 100, 100);
    const el  = document.getElementById(id);
    el.style.width      = pct + '%';
    el.style.background = pct >= 100 ? '#ff5000' : (id === 'pc' ? '#00c805' : id === 'pp' ? '#3d85f5' : '#f0b429');
    document.getElementById(vid).textContent = `${val} / ${goal}${unit}`;
  };
  setProg('pc', t.calories, g.calories || 1850, 'pc-val', '');
  setProg('pp', t.protein,  g.protein  || 160,  'pp-val', 'g');
  setProg('pf', t.fat,      g.fat      || 65,   'pf-val', 'g');

  const grouped = {};
  MEALS.forEach(m => grouped[m] = []);
  log.forEach(i => { if (grouped[i.meal]) grouped[i.meal].push(i); });

  let html = '';
  MEALS.forEach(meal => {
    const items = grouped[meal];
    const mCal  = items.reduce((a, i) => a + i.calories, 0);
    html += `<div class="flex items-center gap-2 py-2.5 pb-2 border-b border-app-border">
      <div class="w-1.5 h-1.5 rounded-full" style="background:${MEAL_COLORS[meal]}"></div>
      <span class="text-[11px] font-bold tracking-widest uppercase" style="color:${MEAL_COLORS[meal]}">${meal}</span>
      <span class="text-[11px] text-app-text3 ml-auto">${mCal > 0 ? mCal + ' cal' : ''}</span>
    </div>`;
    if (!items.length) html += `<div class="text-xs text-app-text3 py-2 pb-2.5">Nothing logged</div>`;
    items.forEach(item => {
      html += `<div class="flex items-center justify-between py-3 border-b border-app-border last:border-b-0">
        <div class="flex-1">
          <div class="text-[13px] font-medium">${item.name}</div>
          <div class="text-[11px] text-app-text3 mt-0.5">P ${item.protein}g · F ${item.fat}g · C ${item.carbs}g</div>
        </div>
        <span class="text-[13px] font-semibold text-app-green mr-2.5">${item.calories}</span>
        <button class="bg-transparent border-none text-app-text3 cursor-pointer text-[13px] px-1 py-0.5 hover:text-white" onclick="deleteFood(${item.id})">✕</button>
      </div>`;
    });
  });
  document.getElementById('food-log').innerHTML = html;
}

async function saveFood() {
  const name = document.getElementById('ff-name').value.trim();
  const cal  = +document.getElementById('ff-cal').value || 0;
  if (!name || !cal) return;
  if (!DATA.diet[currentDate]) DATA.diet[currentDate] = [];
  DATA.diet[currentDate].push({
    id:       Date.now(),
    name,
    meal:     document.getElementById('ff-meal').value,
    calories: cal,
    protein:  +document.getElementById('ff-pro').value  || 0,
    fat:      +document.getElementById('ff-fat').value  || 0,
    carbs:    +document.getElementById('ff-carb').value || 0,
  });
  await saveData();
  closeForm('food-form');
  renderDiet();
}

async function deleteFood(id) {
  DATA.diet[currentDate] = DATA.diet[currentDate].filter(i => i.id !== id);
  await saveData();
  renderDiet();
}
