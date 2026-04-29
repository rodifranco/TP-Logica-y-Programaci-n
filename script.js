// ============================================================
//  UTILIDADES
// ============================================================

/** Hash simple con SHA-256 (Web Crypto API). Devuelve hex string. */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Lee de localStorage de forma segura */
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

/** Escribe en localStorage de forma segura */
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {
    console.warn('localStorage no disponible:', e);
  }
}

/** Formatea la hora actual como HH:MM */
function horaActual() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
//  REFERENCIAS AL DOM
// ============================================================
const overlay        = document.getElementById('overlay');
const mainContainer  = document.getElementById('mainContainer');
const backgroundImage= document.getElementById('backgroundImage');
const loginBox       = document.getElementById('login');
const registroBox    = document.getElementById('registro');
const adminPanel     = document.getElementById('adminPanel');
const formLogin      = document.getElementById('formLogin');
const formRegistro   = document.getElementById('formRegistro');

// ============================================================
//  CONSTANTES DE SEGURIDAD
// ============================================================
const MAX_INTENTOS    = 5;
const BLOQUEO_SEG     = 30;
const TIMEOUT_SESION  = 15 * 60; // 15 minutos en segundos

// ============================================================
//  1. TRANSICIÓN INICIAL
// ============================================================
overlay.addEventListener('click', () => {
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  backgroundImage.classList.add('blurred');

  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    mainContainer.style.opacity = '1';
  }, 400);
});

// ============================================================
//  2. MOSTRAR / OCULTAR CONTRASEÑA
// ============================================================
function bindTogglePass(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  btn.addEventListener('click', () => {
    const visible = inp.type === 'text';
    inp.type = visible ? 'password' : 'text';
    btn.textContent = visible ? '👁' : '🙈';
  });
}

bindTogglePass('toggleLoginPass',   'loginPass');
bindTogglePass('toggleNewPass',     'newPass');
bindTogglePass('toggleConfirmPass', 'confirmPass');

// ============================================================
//  3. VALIDACIONES DE CAMPO
// ============================================================

/** Marca un campo como válido, inválido o neutro */
function setFieldState(groupId, msgId, state, msg = '') {
  const group = document.getElementById(groupId);
  const msgEl = document.getElementById(msgId);
  if (!group || !msgEl) return;
  group.classList.remove('valid', 'invalid');
  if (state === 'valid')   group.classList.add('valid');
  if (state === 'invalid') group.classList.add('invalid');
  msgEl.textContent = msg;
}

/** Muestra u oculta una alerta */
function setAlert(id, visible, msg = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('hidden', !visible);
  const span = el.querySelector('span:last-child');
  if (span && msg) span.textContent = msg;
}

/** Fortaleza de contraseña: devuelve { score 0-4, label, color } */
function evaluarPassword(pass) {
  let score = 0;
  if (pass.length >= 8)  score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
  if (/\d/.test(pass))   score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const niveles = [
    { label: 'Muy débil', color: '#e74c3c', width: '20%' },
    { label: 'Débil',     color: '#e67e22', width: '40%' },
    { label: 'Regular',   color: '#f1c40f', width: '60%' },
    { label: 'Fuerte',    color: '#27ae60', width: '80%' },
    { label: 'Muy fuerte',color: '#1e8449', width: '100%' },
  ];
  return niveles[Math.min(score, 4)];
}

// Mostrar fortaleza en tiempo real
document.getElementById('newPass').addEventListener('input', function () {
  const val = this.value;
  const strengthEl  = document.getElementById('passStrength');
  const fillEl      = document.getElementById('passStrengthFill');
  const labelEl     = document.getElementById('passStrengthLabel');

  if (val.length === 0) {
    strengthEl.classList.add('hidden');
    return;
  }
  strengthEl.classList.remove('hidden');
  const { label, color, width } = evaluarPassword(val);
  fillEl.style.width = width;
  fillEl.style.backgroundColor = color;
  labelEl.textContent = label;
  labelEl.style.color = color;
});

// ============================================================
//  4. REGISTRO DE NUEVO ADMINISTRADOR
// ============================================================
formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const user    = document.getElementById('newUser').value.trim();
  const pass    = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;

  // Validar usuario
  if (user.length < 3) {
    setFieldState('fieldNewUser', 'msgNewUser', 'invalid', 'El usuario debe tener al menos 3 caracteres.');
    valid = false;
  } else {
    setFieldState('fieldNewUser', 'msgNewUser', 'valid', '');
  }

  // Validar contraseña
  if (pass.length < 8) {
    setFieldState('fieldNewPass', 'msgNewPass', 'invalid', 'La contraseña debe tener al menos 8 caracteres.');
    valid = false;
  } else {
    setFieldState('fieldNewPass', 'msgNewPass', 'valid', '');
  }

  // Validar confirmación
  if (pass !== confirm) {
    setFieldState('fieldConfirmPass', 'msgConfirmPass', 'invalid', 'Las contraseñas no coinciden.');
    valid = false;
  } else if (confirm.length > 0) {
    setFieldState('fieldConfirmPass', 'msgConfirmPass', 'valid', '');
  }

  if (!valid) return;

  const passHash = await hashPassword(pass);
  lsSet('datosAdmin', { usuario: user, passHash, rol: 'admin' });

  // Limpiar el log de actividad anterior al crear nueva cuenta
  lsSet('actividadLog', []);

  setAlert('registroAlert', true);
  setTimeout(() => {
    setAlert('registroAlert', false);
    document.getElementById('formRegistro').reset();
    document.getElementById('passStrength').classList.add('hidden');
    ['fieldNewUser','fieldNewPass','fieldConfirmPass'].forEach(id => {
      document.getElementById(id).classList.remove('valid','invalid');
    });
    registroBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
  }, 2000);
});

// ============================================================
//  5. LOGIN CON PROTECCIÓN DE INTENTOS
// ============================================================

let lockInterval = null;

/** Verifica si la cuenta está bloqueada y cuántos segundos faltan */
function getLockInfo() {
  const lock = lsGet('loginLock');
  if (!lock) return { bloqueado: false, restantes: 0 };
  const restantes = Math.ceil((lock.hasta - Date.now()) / 1000);
  return restantes > 0
    ? { bloqueado: true,  restantes }
    : { bloqueado: false, restantes: 0 };
}

/** Inicia el countdown de bloqueo en la UI */
function iniciarCountdown(segundos) {
  const btn   = document.getElementById('btnLogin');
  const timer = document.getElementById('lockTimer');
  btn.disabled = true;
  setAlert('lockAlert', true);
  setAlert('loginAlert', false);
  timer.textContent = segundos;

  if (lockInterval) clearInterval(lockInterval);
  lockInterval = setInterval(() => {
    segundos--;
    timer.textContent = segundos;
    if (segundos <= 0) {
      clearInterval(lockInterval);
      lockInterval = null;
      btn.disabled = false;
      setAlert('lockAlert', false);
      lsSet('loginIntentos', 0);
      localStorage.removeItem('loginLock');
    }
  }, 1000);
}

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Verificar bloqueo
  const lock = getLockInfo();
  if (lock.bloqueado) {
    iniciarCountdown(lock.restantes);
    return;
  }

  const userIngresa = document.getElementById('loginUser').value.trim();
  const passIngresa = document.getElementById('loginPass').value;

  // Validación básica de campos vacíos
  let valid = true;
  if (!userIngresa) {
    setFieldState('fieldLoginUser', 'msgLoginUser', 'invalid', 'Ingresá tu usuario.');
    valid = false;
  }
  if (!passIngresa) {
    setFieldState('fieldLoginPass', 'msgLoginPass', 'invalid', 'Ingresá tu contraseña.');
    valid = false;
  }
  if (!valid) return;

  // Spinner
  const btnText    = document.getElementById('btnLogin').querySelector('.btn-text');
  const btnSpinner = document.getElementById('loginSpinner');
  btnText.textContent = 'Verificando...';
  btnSpinner.classList.remove('hidden');
  document.getElementById('btnLogin').disabled = true;

  // Simular latencia de red
  await new Promise(r => setTimeout(r, 600));

  const datos = lsGet('datosAdmin');
  const passHash = await hashPassword(passIngresa);

  const exitoso = datos && userIngresa === datos.usuario && passHash === datos.passHash;

  // Restaurar botón
  btnText.textContent = 'Ingresar';
  btnSpinner.classList.add('hidden');
  document.getElementById('btnLogin').disabled = false;

  if (exitoso) {
    // Login exitoso — resetear intentos
    lsSet('loginIntentos', 0);
    localStorage.removeItem('loginLock');
    setFieldState('fieldLoginUser', 'msgLoginUser', '', '');
    setFieldState('fieldLoginPass', 'msgLoginPass', '', '');
    setAlert('loginAlert', false);

    // Actualizar stats
    const stats = lsGet('loginStats') || { sessionesToday: 0, lastLogin: null };
    stats.sessionesToday++;
    stats.lastLogin = horaActual();
    lsSet('loginStats', stats);

    // Registrar en log
    registrarActividad('success', `Inicio de sesión: ${userIngresa}`);

    // Guardar sesión activa y redirigir al campus
    lsSet('sesionActiva', { usuario: datos.usuario, desde: Date.now() });
    window.location.href = 'campus.html';

  } else {
    // Login fallido
    const intentos = (lsGet('loginIntentos') || 0) + 1;
    lsSet('loginIntentos', intentos);
    registrarActividad('warning', `Intento fallido de inicio de sesión`);

    const restantes = MAX_INTENTOS - intentos;

    if (intentos >= MAX_INTENTOS) {
      const hasta = Date.now() + BLOQUEO_SEG * 1000;
      lsSet('loginLock', { hasta });
      setFieldState('fieldLoginUser', 'msgLoginUser', '', '');
      setFieldState('fieldLoginPass', 'msgLoginPass', '', '');
      iniciarCountdown(BLOQUEO_SEG);
    } else {
      setFieldState('fieldLoginUser', 'msgLoginUser', 'invalid', '');
      setFieldState('fieldLoginPass', 'msgLoginPass', 'invalid', '');
      const msg = restantes === 1
        ? `Datos incorrectos. Te queda 1 intento antes del bloqueo.`
        : `Datos incorrectos. Te quedan ${restantes} intentos.`;
      setAlert('loginAlert', true, msg);
    }
  }
});

// ============================================================
//  6. PANEL DE ADMINISTRACIÓN
// ============================================================

let sessionInterval = null;
let sessionSegundos = TIMEOUT_SESION;

function mostrarPanel(username) {
  adminPanel.classList.remove('hidden');
  document.getElementById('adminUsername').textContent = username;

  // Estadísticas
  const stats = lsGet('loginStats') || { sessionesToday: 1, lastLogin: horaActual() };
  document.getElementById('statSessions').textContent = stats.sessionesToday;
  document.getElementById('statLastLogin').textContent = stats.lastLogin || '--';

  // Número de admins registrados
  const admin = lsGet('datosAdmin');
  document.getElementById('statAdmins').textContent = admin ? 1 : 0;

  // Timer de sesión
  sessionSegundos = TIMEOUT_SESION;
  actualizarTimerSesion();
  if (sessionInterval) clearInterval(sessionInterval);
  sessionInterval = setInterval(() => {
    sessionSegundos--;
    actualizarTimerSesion();
    if (sessionSegundos <= 0) {
      clearInterval(sessionInterval);
      cerrarSesion();
    }
  }, 1000);

  // Cargar log de actividad
  renderizarLog();
}

function actualizarTimerSesion() {
  const min = Math.floor(sessionSegundos / 60).toString().padStart(2, '0');
  const seg = (sessionSegundos % 60).toString().padStart(2, '0');
  const el = document.getElementById('sessionTimer');
  if (el) el.textContent = `Expira en ${min}:${seg}`;
}

function registrarActividad(tipo, mensaje) {
  const log = lsGet('actividadLog') || [];
  log.unshift({ tipo, mensaje, hora: horaActual() });
  if (log.length > 20) log.pop(); // Limitar a 20 entradas
  lsSet('actividadLog', log);
}

function renderizarLog() {
  const container = document.getElementById('activityLog');
  const log = lsGet('actividadLog') || [];

  if (log.length === 0) {
    container.innerHTML = '<div class="log-entry"><span style="color:#aaa;font-size:0.82rem;">Sin actividad registrada.</span></div>';
    return;
  }

  container.innerHTML = log.map(entry => `
    <div class="log-entry">
      <span class="log-dot ${entry.tipo}"></span>
      <span>${entry.mensaje}</span>
      <span class="log-time">${entry.hora}</span>
    </div>
  `).join('');
}

/** Muestra mensaje temporal en los accesos rápidos */
function showAdminMsg(texto) {
  const el = document.getElementById('adminActionMsg');
  el.classList.remove('hidden');
  el.innerHTML = `<span class="alert-icon">&#8505;</span> ${texto}`;
  setTimeout(() => el.classList.add('hidden'), 3000);
}

// ============================================================
//  7. CERRAR SESIÓN
// ============================================================

function cerrarSesion() {
  if (sessionInterval) clearInterval(sessionInterval);
  registrarActividad('info', 'Cierre de sesión');

  adminPanel.classList.add('hidden');
  loginBox.classList.remove('hidden');
  backgroundImage.classList.remove('blurred');
  overlay.classList.remove('hidden');
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';
  mainContainer.classList.add('hidden');

  // Limpiar campos
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  setFieldState('fieldLoginUser', 'msgLoginUser', '', '');
  setFieldState('fieldLoginPass', 'msgLoginPass', '', '');
  setAlert('loginAlert', false);
}

document.getElementById('logout').addEventListener('click', cerrarSesion);

// ============================================================
//  8. NAVEGACIÓN ENTRE FORMULARIOS
// ============================================================
document.getElementById('irARegistro').addEventListener('click', () => {
  loginBox.classList.add('hidden');
  registroBox.classList.remove('hidden');
  setAlert('loginAlert', false);
});

document.getElementById('volverLogin').addEventListener('click', () => {
  registroBox.classList.add('hidden');
  loginBox.classList.remove('hidden');
});

// ============================================================
//  9. MODAL OLVIDÉ CONTRASEÑA
// ============================================================
document.getElementById('linkOlvide').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modalOlvide').classList.remove('hidden');
});

document.getElementById('cerrarModal').addEventListener('click', () => {
  document.getElementById('modalOlvide').classList.add('hidden');
});

// Cerrar modal clickeando el fondo
document.getElementById('modalOlvide').addEventListener('click', function (e) {
  if (e.target === this) this.classList.add('hidden');
});

// ============================================================
//  10. INICIALIZACIÓN: verificar si hay bloqueo activo al cargar
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const lock = getLockInfo();
  if (lock.bloqueado) {
    // Si recarga la página con un bloqueo activo, mostrarlo cuando llegue al login
    // (se activa en la transición del overlay, no aquí directamente)
  }
});

// ============================================================
//  11. BOTÓN ACCEDER AL CAMPUS VIRTUAL
// ============================================================
document.getElementById('btnCampusLogin').addEventListener('click', () => {
  const userVal = document.getElementById('loginUser').value.trim();
  const passVal = document.getElementById('loginPass').value;

  if (userVal && passVal) {
    // Si ya hay credenciales cargadas, disparar el submit directamente
    formLogin.requestSubmit();
  } else {
    // Mostrar mensaje orientador y enfocar el primer campo vacío
    const existing = document.getElementById('campusHint');
    if (!existing) {
      const hint = document.createElement('div');
      hint.id = 'campusHint';
      hint.className = 'alert alert-info';
      hint.style.marginBottom = '14px';
      hint.innerHTML = '<span class="alert-icon">&#127979;</span> <span>Iniciá sesión para acceder al Campus Virtual.</span>';
      const form = document.getElementById('formLogin');
      form.insertBefore(hint, form.firstChild);
      setTimeout(() => hint.remove(), 3500);
    }
    const focusTarget = !userVal
      ? document.getElementById('loginUser')
      : document.getElementById('loginPass');
    focusTarget.focus();
  }
});
