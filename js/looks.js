// ── Looks ──
function renderLooks() {
  const habits = DATA.habits[currentDate] || DEFAULT_HABITS;
  const done   = habits.filter(h => h.done).length;
  const total  = habits.length;

  document.getElementById('looks-score').textContent = Math.round(done / total * 100) + '%';
  document.getElementById('habits-count').textContent = `${done}/${total} done`;

  ['skin', 'grooming', 'sleep', 'hydration'].forEach((cat, i) => {
    const ch  = habits.filter(h => h.cat === cat);
    const pct = ch.length ? Math.round(ch.filter(h => h.done).length / ch.length * 100) : 0;
    const ids = ['lk-skin', 'lk-groom', 'lk-sleep', 'lk-hydration'];
    const el  = document.getElementById(ids[i]);
    el.textContent  = pct + '%';
    el.style.color  = pct === 100 ? '#00c805' : pct > 50 ? '#f0b429' : '#999';
  });

  document.getElementById('habits-list').innerHTML = habits.map(h => `
    <div class="flex items-center gap-2.5 py-2.5 border-b border-app-border cursor-pointer last:border-b-0" onclick="toggleHabit('${h.id}')">
      <div class="w-[18px] h-[18px] rounded shrink-0 border-[1.5px] flex items-center justify-center text-[11px] transition-all ${h.done ? 'bg-app-green border-app-green text-black' : 'border-app-border2'}">${h.done ? '✓' : ''}</div>
      <span class="text-[13px] ${h.done ? 'text-app-text3 line-through' : ''}">${h.text}</span>
    </div>
  `).join('');
}

async function toggleHabit(id) {
  const h = DATA.habits[currentDate].find(h => h.id === id);
  if (h) h.done = !h.done;
  await saveData();
  renderLooks();
}
