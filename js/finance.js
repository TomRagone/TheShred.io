// ── Finance ──
function renderFinance() {
  const g        = USER.goals;
  const expenses = DATA.finance?.expenses || [];
  const budget   = g.budget || 2000;
  const month    = new Date().toISOString().slice(0, 7);
  const spent    = expenses.filter(e => e.date?.startsWith(month)).reduce((a, e) => a + (e.amount || 0), 0);
  const rem      = budget - spent;

  const remEl = document.getElementById('fin-remaining');
  remEl.textContent = '$' + Math.abs(rem).toLocaleString();
  remEl.className   = 'text-5xl font-bold tracking-tighter leading-none ' + (rem < 0 ? 'text-app-red' : 'text-app-green');
  document.getElementById('fin-sub').textContent    = `$${spent.toLocaleString()} spent of $${budget.toLocaleString()} this month`;
  document.getElementById('fin-spent').textContent  = '$' + spent.toLocaleString();
  document.getElementById('fin-budget').textContent = '$' + budget.toLocaleString();
  document.getElementById('fin-saved').textContent  = '$' + Math.max(rem, 0).toLocaleString();
  document.getElementById('qs-budget').value        = budget;

  document.getElementById('expense-log').innerHTML = expenses.slice().reverse().slice(0, 20).map(e => `
    <div class="flex items-center justify-between py-3 border-b border-app-border last:border-b-0">
      <div>
        <div class="text-[13px] font-medium">${e.name}</div>
        <div class="text-xs text-app-text3">${e.category} · ${e.date}</div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="text-sm font-semibold text-app-red">-$${e.amount}</span>
        <button class="bg-transparent border-none text-app-text3 cursor-pointer text-[13px] px-1 py-0.5 hover:text-white" onclick="deleteExpense(${e.id})">✕</button>
      </div>
    </div>
  `).join('') || `<div class="text-[13px] text-app-text3 py-4">No expenses yet.</div>`;
}

async function saveExpense() {
  const name = document.getElementById('ef-name').value.trim();
  const amt  = +document.getElementById('ef-amt').value || 0;
  if (!name || !amt) return;
  if (!DATA.finance) DATA.finance = {expenses: []};
  DATA.finance.expenses.push({
    id:       Date.now(),
    name,
    category: document.getElementById('ef-cat').value,
    amount:   amt,
    date:     getToday(),
  });
  await saveData();
  closeForm('expense-form');
  renderFinance();
}

async function deleteExpense(id) {
  DATA.finance.expenses = DATA.finance.expenses.filter(e => e.id !== id);
  await saveData();
  renderFinance();
}
