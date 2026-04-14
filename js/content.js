// ── Content ──
function renderContent() {
  const items = DATA.content || [];
  document.getElementById('con-count').textContent = items.length;
  document.getElementById('con-ideas').textContent = items.filter(c => c.status === 'Idea').length;
  document.getElementById('con-prog').textContent  = items.filter(c => c.status === 'In Progress').length;
  document.getElementById('con-done').textContent  = items.filter(c => c.status === 'Published').length;

  const statusBadge = {'Idea': 'bg-app-gold-dim text-app-gold', 'In Progress': 'bg-app-blue-dim text-app-blue', 'Published': 'bg-app-green-dim text-app-green'};
  const statusDot   = {'Idea': '#f0b429', 'In Progress': '#3d85f5', 'Published': '#00c805'};

  document.getElementById('content-board').innerHTML = items.slice().reverse().map(c => `
    <div class="bg-app-surface border border-app-border rounded-xl p-4 mb-2.5 flex items-start gap-3">
      <div class="w-2 h-2 rounded-full mt-1 shrink-0" style="background:${statusDot[c.status]}"></div>
      <div class="flex-1">
        <div class="text-[13px] font-semibold mb-0.5">${c.title}</div>
        <div class="text-[11px] text-app-text3">${c.platform}</div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase ${statusBadge[c.status]}">${c.status}</span>
        <button class="bg-transparent border-none text-app-text3 cursor-pointer text-[13px] px-1 py-0.5 hover:text-white" onclick="deleteContent(${c.id})">✕</button>
      </div>
    </div>
  `).join('') || `<div class="text-[13px] text-app-text3 py-4">No content yet.</div>`;
}

async function saveContent() {
  const title = document.getElementById('cf-title').value.trim();
  if (!title) return;
  if (!DATA.content) DATA.content = [];
  DATA.content.push({
    id:       Date.now(),
    title,
    platform: document.getElementById('cf-platform').value,
    status:   document.getElementById('cf-status').value,
    date:     getToday(),
  });
  await saveData();
  closeForm('content-form');
  renderContent();
}

async function deleteContent(id) {
  DATA.content = DATA.content.filter(c => c.id !== id);
  await saveData();
  renderContent();
}
