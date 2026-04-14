// ── Data ──
async function loadUserData() {
  const {data} = await sb.from('user_data').select('*').eq('user_id', USER.id).single();
  const today = getToday();
  if (data) {
    DATA = {
      data_id:  data.id,
      diet:     data.diet     || {},
      training: data.training || [],
      habits:   data.habits   || {},
      finance:  data.finance  || {expenses: []},
      content:  data.content  || [],
    };
  } else {
    DATA = {data_id: null, diet: {}, training: [], habits: {}, finance: {expenses: []}, content: []};
    await saveData();
  }
  if (!DATA.diet[today])   DATA.diet[today]   = [];
  if (!DATA.habits[today]) DATA.habits[today] = JSON.parse(JSON.stringify(DEFAULT_HABITS));
}

async function saveData() {
  saveDot();
  const payload = {
    user_id:    USER.id,
    diet:       DATA.diet,
    training:   DATA.training,
    habits:     DATA.habits,
    finance:    DATA.finance,
    content:    DATA.content,
    updated_at: new Date().toISOString(),
  };
  if (DATA.data_id) {
    await sb.from('user_data').update(payload).eq('id', DATA.data_id);
  } else {
    const {data} = await sb.from('user_data').insert(payload).select().single();
    if (data) DATA.data_id = data.id;
  }
}

async function saveGoals() {
  USER.goals.calories   = +document.getElementById('qs-cal').value    || 1850;
  USER.goals.protein    = +document.getElementById('qs-pro').value    || 160;
  USER.goals.fat        = +document.getElementById('qs-fat').value    || 65;
  USER.goals.weight     = +document.getElementById('qs-wt').value     || 0;
  USER.goals.goalWeight = +document.getElementById('qs-gwt').value    || 0;
  USER.goals.budget     = +document.getElementById('qs-budget').value || 2000;
  await sb.from('users').update({goals: USER.goals}).eq('id', USER.id);
  saveDot();
  renderAll();
}
