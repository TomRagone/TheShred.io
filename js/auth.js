// ── Auth ──
function switchTab(t) {
  document.getElementById('si-form').style.display = t === 'si' ? 'block' : 'none';
  document.getElementById('su-form').style.display = t === 'su' ? 'block' : 'none';
  document.getElementById('tab-si').classList.toggle('active', t === 'si');
  document.getElementById('tab-su').classList.toggle('active', t === 'su');
}

async function signIn() {
  const username = document.getElementById('si-user').value.trim().toLowerCase();
  const pass     = document.getElementById('si-pass').value;
  const err      = document.getElementById('si-err');
  if (!username || !pass) { err.textContent = 'Fill all fields.'; return; }
  const btn = document.getElementById('si-btn');
  btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    const hash = await hashPass(pass);
    const {data, error} = await sb.from('users').select('*').eq('username', username).eq('password_hash', hash).single();
    if (error || !data) { err.textContent = 'Username or password incorrect.'; btn.disabled = false; btn.textContent = 'Sign In'; return; }
    USER = {id: data.id, username: data.username, name: data.name, goals: data.goals || {}};
    localStorage.setItem('shred-session', JSON.stringify({id: data.id, username: data.username}));
    await loadUserData();
    if (!USER.goals.calories) { showSetup(); } else { startApp(); }
  } catch(e) { err.textContent = 'Error signing in. Try again.'; btn.disabled = false; btn.textContent = 'Sign In'; }
}

async function signUp() {
  const name     = document.getElementById('su-name').value.trim();
  const username = document.getElementById('su-user').value.trim().toLowerCase();
  const pass     = document.getElementById('su-pass').value;
  const err      = document.getElementById('su-err');
  if (!name || !username || !pass) { err.textContent = 'Fill all fields.'; return; }
  if (pass.length < 4) { err.textContent = 'Password must be 4+ characters.'; return; }
  const btn = document.getElementById('su-btn');
  btn.disabled = true; btn.textContent = 'Creating…';
  try {
    const hash = await hashPass(pass);
    const {data, error} = await sb.from('users').insert({username, password_hash: hash, name, goals: {}}).select().single();
    if (error) {
      err.textContent = error.code === '23505' ? 'Username already taken.' : 'Error creating account.';
      btn.disabled = false; btn.textContent = 'Create Account'; return;
    }
    USER = {id: data.id, username: data.username, name: data.name, goals: {}};
    localStorage.setItem('shred-session', JSON.stringify({id: data.id, username: data.username}));
    await loadUserData();
    showSetup();
  } catch(e) { err.textContent = 'Error. Try again.'; btn.disabled = false; btn.textContent = 'Create Account'; }
}

async function signOut() {
  localStorage.removeItem('shred-session');
  USER = null; DATA = null;
  hide('app'); hide('setup-screen');
  show('auth-screen');
  document.getElementById('si-user').value = '';
  document.getElementById('si-pass').value = '';
  document.getElementById('si-err').textContent = '';
}
