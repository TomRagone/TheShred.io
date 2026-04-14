// ── Date helpers ──
function getToday() { return new Date().toISOString().slice(0, 10); }
function fmtDate(d) { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}); }

// ── Password hashing ──
async function hashPass(p) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── DOM helpers ──
function show(id)      { document.getElementById(id).style.display = 'flex'; }
function hide(id)      { document.getElementById(id).style.display = 'none'; }
function showBlock(id) { document.getElementById(id).style.display = 'block'; }

function saveDot() {
  const d = document.getElementById('saveDot');
  d.classList.add('show');
  setTimeout(() => d.classList.remove('show'), 1500);
}
