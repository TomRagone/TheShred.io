// ── AI Coaches ──
function updateDietIntro() {
  const g = USER.goals;
  document.getElementById('diet-intro').textContent = `Hey ${USER.name || USER.username} — I'm your diet coach. You're targeting ${g.calories || 1850} cal and ${g.protein || 160}g protein daily. Ask me anything.`;
}

function getAICtx(cat) {
  const g    = USER.goals || {};
  const n    = USER.name || 'the user';
  const base = `User: ${n}. Weight: ${g.weight || '?'}lb, goal: ${g.goalWeight || '?'}lb. Height: ${g.height || '?'}. Daily targets: ${g.calories || 1850} cal, ${g.protein || 160}g protein, ${g.fat || 65}g fat. Monthly budget: $${g.budget || 2000}. Be direct, specific, encouraging. Max 150 words.`;
  return {
    diet:     `You are ${n}'s personal diet coach. ${base} Give concrete food recommendations focused on hitting protein goals and staying in a calorie deficit.`,
    training: `You are ${n}'s personal training coach. ${base} Recommend specific exercises, sets, reps, splits. Goal: get lean and muscular. Push them hard.`,
    looks:    `You are ${n}'s looksmaxxing coach. ${base} Give specific actionable advice on skincare, grooming, haircare, style. Goal: look like a movie star.`,
    finance:  `You are ${n}'s personal finance coach. ${base} Give smart specific money advice — budgeting, saving, investing. Be practical.`,
    content:  `You are ${n}'s content strategy coach. ${base} Help build a personal brand through LinkedIn, Twitter/X, and other platforms.`,
  }[cat];
}

async function sendAI(cat) {
  const input   = document.getElementById(cat + '-ai-in');
  const msgs    = document.getElementById(cat + '-msgs');
  const btn     = document.getElementById(cat + '-ai-btn');
  const msg     = input.value.trim();
  if (!msg) return;

  msgs.innerHTML += `<div class="bg-app-green-dim border border-app-green rounded-lg px-3.5 py-3 text-[13px] text-app-green self-end max-w-[90%]">${msg}</div>`;
  input.value = ''; btn.disabled = true; btn.textContent = '...';
  msgs.scrollTop = msgs.scrollHeight;

  const thinking = document.createElement('div');
  thinking.className = 'bg-app-surface2 rounded-lg px-3.5 py-3 text-[13px] leading-relaxed text-app-text2 self-start max-w-[90%]';
  thinking.textContent = 'Thinking…';
  msgs.appendChild(thinking);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {'Content-Type': 'application/json'},
      body:    JSON.stringify({model: 'claude-sonnet-4-20250514', max_tokens: 300, system: getAICtx(cat), messages: [{role: 'user', content: msg}]}),
    });
    const d = await r.json();
    thinking.textContent = d.content?.map(b => b.text || '').join('') || 'Something went wrong.';
  } catch(e) {
    thinking.textContent = 'AI unavailable right now.';
  }

  btn.disabled = false; btn.textContent = 'Send';
  msgs.scrollTop = msgs.scrollHeight;
}
