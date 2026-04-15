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

  const macroColor = (val, goal) => {
    const pct = val / goal * 100;
    if (pct >= 100) return '#ff5000';
    if (pct >= 90)  return '#f0b429';
    return '';
  };

  const proGoal   = g.protein || 160;
  const fatGoal   = g.fat     || 65;
  const carbsGoal = g.carbs   || 200;

  const proEl   = document.getElementById('m-pro');
  const fatEl   = document.getElementById('m-fat');
  const carbsEl = document.getElementById('m-carbs');
  proEl.textContent   = t.protein + 'g';
  fatEl.textContent   = t.fat + 'g';
  carbsEl.textContent = t.carbs + 'g';
  proEl.style.color   = macroColor(t.protein, proGoal);
  fatEl.style.color   = macroColor(t.fat,     fatGoal);
  carbsEl.style.color = macroColor(t.carbs,   carbsGoal);

  document.getElementById('m-pro-goal').textContent   = 'goal ' + proGoal + 'g';
  document.getElementById('m-fat-goal').textContent   = 'goal ' + fatGoal + 'g';
  document.getElementById('m-carbs-goal').textContent = 'goal ' + carbsGoal + 'g';
  document.getElementById('m-wt').textContent  = g.weight ? g.weight + 'lb' : '—';
  document.getElementById('m-gwt').textContent = g.goalWeight ? 'goal ' + g.goalWeight + 'lb' : 'set goal';

  const setProg = (id, val, goal, vid, unit, baseColor) => {
    const pct    = Math.min(val / goal * 100, 100);
    const rawPct = val / goal * 100;
    const el     = document.getElementById(id);
    el.style.width      = pct + '%';
    el.style.background = rawPct >= 100 ? '#ff5000' : rawPct >= 90 ? '#f0b429' : baseColor;
    const valEl = document.getElementById(vid);
    valEl.textContent = `${val} / ${goal}${unit}`;
    valEl.style.color = rawPct >= 100 ? '#ff5000' : rawPct >= 90 ? '#f0b429' : '';
  };
  setProg('pc',    t.calories, g.calories || 1850, 'pc-val',   '',  '#00c805');
  setProg('pp',    t.protein,  proGoal,            'pp-val',   'g', '#3d85f5');
  setProg('pf',    t.fat,      fatGoal,            'pf-val',   'g', '#f0b429');
  setProg('pcarb', t.carbs,    carbsGoal,          'pcarb-val','g', '#a855f7');

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
