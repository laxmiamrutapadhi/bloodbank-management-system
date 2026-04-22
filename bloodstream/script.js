/* ============ THEME ============ */
(function(){
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('click', e => {
    if (e.target.id === 'themeToggle') {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      e.target.textContent = next === 'dark' ? '☀️' : '🌙';
    }
  });
  // set icon on load
  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
    refreshUserBadge();
  });
})();

/* ============ AUTH OVERLAY ============ */
function openAuth(){ document.getElementById('authOverlay')?.classList.remove('hidden'); }
function closeAuth(){ document.getElementById('authOverlay')?.classList.add('hidden'); }
function continueAsGuest(){
  localStorage.setItem('user','Guest');
  closeAuth();
  refreshUserBadge();
}

document.addEventListener('click', e => {
  if (e.target.id === 'openAuth') openAuth();
  if (e.target.classList?.contains('tab')) {
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    e.target.classList.add('active');
    const which = e.target.dataset.tab;
    document.getElementById('loginForm').classList.toggle('hidden', which!=='login');
    document.getElementById('signupForm').classList.toggle('hidden', which!=='signup');
  }
});

function refreshUserBadge(){
  const user = localStorage.getItem('user');
  const badge = document.getElementById('userBadge');
  const loginBtn = document.getElementById('openAuth');
  if (user && badge && loginBtn){
    badge.textContent = '👤 ' + user;
    badge.classList.remove('hidden');
    loginBtn.textContent = 'Logout';
    loginBtn.onclick = () => { localStorage.removeItem('user'); location.reload(); };
  }
}

/* ============ LOGIN ============ */
document.addEventListener('submit', async e => {
  if (e.target.id === 'loginForm') {
    e.preventDefault();
    const msg = document.getElementById('loginMsg');
    msg.textContent = 'Logging in...';
    msg.className = 'auth-msg';
    const fd = new FormData(e.target);
    try {
      const res = await fetch('php/login.php', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username: fd.get('username'),
          password: fd.get('password')
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        msg.textContent = '✓ Welcome ' + data.username;
        msg.className = 'auth-msg success';
        localStorage.setItem('user', data.username);
        setTimeout(()=>{ closeAuth(); refreshUserBadge(); }, 700);
      } else {
        msg.textContent = data.message || 'Login failed';
        msg.className = 'auth-msg error';
      }
    } catch(err) {
      msg.textContent = 'Server error. Is XAMPP running?';
      msg.className = 'auth-msg error';
    }
  }

  /* ============ SIGNUP ============ */
  if (e.target.id === 'signupForm') {
    e.preventDefault();
    const msg = document.getElementById('signupMsg');
    msg.textContent = 'Creating account...';
    msg.className = 'auth-msg';
    const fd = new FormData(e.target);
    try {
      const res = await fetch('php/signup.php', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username: fd.get('username'),
          email: fd.get('email'),
          password: fd.get('password')
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        msg.textContent = '✓ Account created! Please login.';
        msg.className = 'auth-msg success';
        setTimeout(()=>document.querySelector('.tab[data-tab="login"]').click(), 900);
      } else {
        msg.textContent = data.message || 'Signup failed';
        msg.className = 'auth-msg error';
      }
    } catch(err) {
      msg.textContent = 'Server error. Is XAMPP running?';
      msg.className = 'auth-msg error';
    }
  }

  /* ============ DONOR REGISTER ============ */
  if (e.target.id === 'donorForm') {
    e.preventDefault();
    const msg = document.getElementById('donorMsg');
    msg.textContent = 'Saving...';
    msg.className = 'auth-msg';
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('php/add_donor.php', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'success') {
        msg.textContent = '✓ Thank you! You are now a registered donor.';
        msg.className = 'auth-msg success';
        e.target.reset();
      } else {
        msg.textContent = data.message || 'Registration failed';
        msg.className = 'auth-msg error';
      }
    } catch(err) {
      msg.textContent = 'Server error. Is XAMPP running?';
      msg.className = 'auth-msg error';
    }
  }

  /* ============ SEARCH ============ */
  if (e.target.id === 'searchForm') {
    e.preventDefault();
    const fd = new FormData(e.target);
    loadDonors(fd.get('bloodGroup'), fd.get('city'));
  }
});

/* ============ LOAD DONORS ============ */
async function loadDonors(bg='', city=''){
  const list = document.getElementById('donorList');
  if (!list) return;
  list.innerHTML = '<p class="empty">Loading donors...</p>';
  try {
    const params = new URLSearchParams({ bloodGroup: bg||'', city: city||'' });
    const res = await fetch('php/getdonors.php?' + params);
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    const donors = await res.json();
    if (!Array.isArray(donors) || !donors.length) {
      list.innerHTML = '<p class="empty">No donors found. Try a different search.</p>';
      return;
    }
    list.innerHTML = donors.map(d => `
      <div class="donor-card">
        <span class="bg">${d.bloodGroup}</span>
        <h3>${d.fullName}</h3>
        <p>📍 ${d.city}, ${d.state}</p>
        <p>📞 ${d.phone}</p>
        <a class="call" href="tel:${d.phone}">Call now →</a>
      </div>
    `).join('');
  } catch(err) {
    list.innerHTML = '<p class="empty">Server error. Is XAMPP running?</p>';
  }
}
