// ── Training ──
function renderTraining() {
  const sessions = DATA.training || [];
  const weekAgo  = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = sessions.filter(s => new Date(s.date) >= weekAgo).length;
  document.getElementById('train-week').innerHTML = `${thisWeek} <span class="text-xl text-app-text2 font-normal">sessions this week</span>`;

  let streak = 0, d = new Date();
  while (true) {
    const ds = d.toISOString().slice(0, 10);
    if (sessions.some(s => s.date === ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  document.getElementById('train-streak').textContent = streak;

  const mo = new Date(); mo.setMonth(mo.getMonth() - 1);
  document.getElementById('train-month').textContent = sessions.filter(s => new Date(s.date) >= mo).length;

  if (sessions.length) {
    const last = sessions[sessions.length - 1];
    const diff = Math.floor((new Date() - new Date(last.date + 'T12:00:00')) / 86400000);
    document.getElementById('train-last').textContent = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff + 'd ago';
  }

  document.getElementById('workout-log').innerHTML = sessions.slice().reverse().slice(0, 10).map(s => `
    <div class="bg-app-surface border border-app-border rounded-xl p-4 mb-2.5">
      <div class="flex justify-between items-center mb-1">
        <div class="text-sm font-semibold">${s.type}</div>
        <div class="flex gap-2.5 items-center">
          <span class="text-xs text-app-text3">${s.date} · ${s.duration}min</span>
          <button class="bg-transparent border-none text-app-text3 cursor-pointer text-[13px] px-1 py-0.5 hover:text-white" onclick="deleteWorkout(${s.id})">✕</button>
        </div>
      </div>
      ${s.notes ? `<div class="text-xs text-app-text3">${s.notes}</div>` : ''}
    </div>
  `).join('') || `<div class="text-[13px] text-app-text3 py-4">No workouts yet.</div>`;
}

async function saveWorkout() {
  DATA.training.push({
    id:       Date.now(),
    date:     getToday(),
    type:     document.getElementById('wf-type').value,
    duration: +document.getElementById('wf-dur').value || 60,
    notes:    document.getElementById('wf-notes').value,
  });
  await saveData();
  closeForm('workout-form');
  renderTraining();
}

async function deleteWorkout(id) {
  DATA.training = DATA.training.filter(s => s.id !== id);
  await saveData();
  renderTraining();
}
