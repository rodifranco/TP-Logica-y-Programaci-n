// ── Utilidades localStorage ──────────────────────────────
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
function horaActual() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// ── Sesión / header ──────────────────────────────────────
const sesion = lsGet('sesionActiva');
const datos  = lsGet('datosAdmin');
const usuario = sesion ? sesion.usuario : (datos ? datos.usuario : 'Administrador');
document.getElementById('adminUsername').textContent = usuario;

const stats = lsGet('loginStats') || { sessionesToday: 1, lastLogin: horaActual() };
document.getElementById('statSessions').textContent = stats.sessionesToday;
document.getElementById('statLastLogin').textContent = stats.lastLogin || '--';
document.getElementById('statAdmins').textContent = datos ? 1 : 0;

// ── Timer de sesión (15 min) ─────────────────────────────
const TIMEOUT = 15 * 60;
let seg = TIMEOUT;
function actualizarTimer() {
  const min = Math.floor(seg / 60).toString().padStart(2, '0');
  const s   = (seg % 60).toString().padStart(2, '0');
  const el  = document.getElementById('sessionTimer');
  if (el) el.textContent = `Expira en ${min}:${s}`;
}
actualizarTimer();
const iv = setInterval(() => {
  seg--;
  actualizarTimer();
  if (seg <= 0) { clearInterval(iv); cerrarSesion(); }
}, 1000);

// ── Log de actividad ─────────────────────────────────────
function renderizarLog() {
  const container = document.getElementById('activityLog');
  const log = lsGet('actividadLog') || [];
  if (log.length === 0) {
    container.innerHTML = '<div class="log-entry"><span style="color:#aaa;font-size:0.82rem;">Sin actividad registrada.</span></div>';
    return;
  }
  container.innerHTML = log.map(e => `
    <div class="log-entry">
      <span class="log-dot ${e.tipo}"></span>
      <span>${e.mensaje}</span>
      <span class="log-time">${e.hora}</span>
    </div>`).join('');
}
renderizarLog();

// ── Acciones generales ───────────────────────────────────
function showAdminMsg(texto) {
  const el = document.getElementById('adminActionMsg');
  el.classList.remove('hidden');
  el.innerHTML = `<span class="alert-icon">&#8505;</span> ${texto}`;
  setTimeout(() => el.classList.add('hidden'), 3000);
}

// ── Cerrar sesión ────────────────────────────────────────
function cerrarSesion() {
  clearInterval(iv);
  const log = lsGet('actividadLog') || [];
  log.unshift({ tipo: 'info', mensaje: 'Cierre de sesión', hora: horaActual() });
  lsSet('actividadLog', log);
  localStorage.removeItem('sesionActiva');
  window.location.href = 'index.html';
}
document.getElementById('logout').addEventListener('click', cerrarSesion);

// ── Tabs ─────────────────────────────────────────────────
document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════
//  DATOS POR DEFECTO DEL CAMPUS
// ══════════════════════════════════════════════════════════
const defaultMaterias = [
  { id:1, nombre:'Lengua y Literatura', codigo:'LEN · 1er año', docente:'Prof. García, M.',    progreso:72, color:'#1a6a3e' },
  { id:2, nombre:'Historia',            codigo:'HIS · 1er año', docente:'Prof. Rodríguez, C.', progreso:58, color:'#2980b9' },
  { id:3, nombre:'Matemática',          codigo:'MAT · 1er año', docente:'Prof. López, A.',      progreso:45, color:'#e67e22' },
  { id:4, nombre:'Ciencias Naturales',  codigo:'CN · 1er año',  docente:'Prof. Martínez, L.',   progreso:85, color:'#8e44ad' },
  { id:5, nombre:'Educación Física',    codigo:'EF · 1er año',  docente:'Prof. Fernández, R.',  progreso:90, color:'#c0392b' },
  { id:6, nombre:'Educación Artística', codigo:'EA · 1er año',  docente:'Prof. Silva, P.',      progreso:60, color:'#16a085' },
];
const defaultNovedades = [
  { id:1, titulo:'Nuevo material: Análisis literario', desc:'Lengua y Literatura · Unidad 4', fecha:'Hoy',  color:'verde'   },
  { id:2, titulo:'Recordatorio: Entrega TP Historia',  desc:'Vence el viernes 18/4',          fecha:'Hoy',  color:'naranja' },
  { id:3, titulo:'Examen parcial — Matemática',        desc:'Lunes 21/4 · Unidades 1 a 3',    fecha:'Ayer', color:'rojo'    },
  { id:4, titulo:'Actualización de cronograma',        desc:'Semana del 22 al 26 de abril',   fecha:'14/4', color:'azul'    },
];
const defaultAgenda = [
  { id:1, titulo:'Entrega TP Historia', dia:18, mes:'Abr', hora:'23:59 hs' },
  { id:2, titulo:'Parcial Matemática',  dia:21, mes:'Abr', hora:'08:00 hs' },
  { id:3, titulo:'Reunión de padres',   dia:24, mes:'Abr', hora:'18:00 hs' },
  { id:4, titulo:'Acto Patrio',         dia:23, mes:'May', hora:'09:00 hs' },
];
const defaultShortcuts = [
  { id:1, nombre:'Biblioteca',   icono:'📚' },
  { id:2, nombre:'Mensajes',     icono:'💬' },
  { id:3, nombre:'Calificaciones', icono:'📋' },
  { id:4, nombre:'Asistencia',   icono:'✅' },
  { id:5, nombre:'Foros',        icono:'💬' },
  { id:6, nombre:'Descargas',    icono:'📥' },
];
const defaultHero = {
  titulo: 'Tu espacio de aprendizaje institucional',
  desc: 'Accedé a tus materias, actividades y novedades desde un solo lugar. Tu progreso académico actualizado.',
  tag: '🏫 Campus Virtual · Ciclo 2025',
  stat1num: '6', stat1lbl: 'Materias activas',
  stat2num: '3', stat2lbl: 'Entregas pendientes',
  stat3num: '2', stat3lbl: 'Novedades nuevas',
};

// ── Cargar datos ─────────────────────────────────────────
let materias   = lsGet('campusMaterias')   || defaultMaterias;
let novedades  = lsGet('campusNovedades')  || defaultNovedades;
let agenda     = lsGet('campusAgenda')     || defaultAgenda;
let shortcuts  = lsGet('campusShortcuts')  || defaultShortcuts;
let heroData   = lsGet('campusHero')       || defaultHero;

// ── Poblar hero fields ───────────────────────────────────
document.getElementById('heroTitulo').value  = heroData.titulo;
document.getElementById('heroDesc').value    = heroData.desc;
document.getElementById('heroTag').value     = heroData.tag;
document.getElementById('heroStat1Num').value = heroData.stat1num;
document.getElementById('heroStat1Lbl').value = heroData.stat1lbl;
document.getElementById('heroStat2Num').value = heroData.stat2num;
document.getElementById('heroStat2Lbl').value = heroData.stat2lbl;
document.getElementById('heroStat3Num').value = heroData.stat3num;
document.getElementById('heroStat3Lbl').value = heroData.stat3lbl;

// ── Guardar hero ─────────────────────────────────────────
function guardarHero() {
  heroData = {
    titulo:   document.getElementById('heroTitulo').value,
    desc:     document.getElementById('heroDesc').value,
    tag:      document.getElementById('heroTag').value,
    stat1num: document.getElementById('heroStat1Num').value,
    stat1lbl: document.getElementById('heroStat1Lbl').value,
    stat2num: document.getElementById('heroStat2Num').value,
    stat2lbl: document.getElementById('heroStat2Lbl').value,
    stat3num: document.getElementById('heroStat3Num').value,
    stat3lbl: document.getElementById('heroStat3Lbl').value,
  };
  lsSet('campusHero', heroData);
  flashBadge('badgeHero');
  logActividad('success', 'Banner del campus actualizado');
}

// ══════════════════════════════════════════════════════════
//  MATERIAS
// ══════════════════════════════════════════════════════════
function renderMaterias() {
  const tbody = document.getElementById('materiasTableBody');
  if (!materias.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">Sin materias. Agregá una con el botón +</div></td></tr>`;
    return;
  }
  tbody.innerHTML = materias.map((m, i) => `
    <tr>
      <td>
        <div class="materia-nombre-cell">
          <span class="color-dot" style="background:${m.color}"></span>
          <strong>${m.nombre}</strong>
        </div>
      </td>
      <td style="color:#888;font-size:0.8rem;">${m.codigo}</td>
      <td style="font-size:0.82rem;">${m.docente}</td>
      <td>
        <div class="progress-cell">
          <div class="mini-progress">
            <div class="mini-progress-fill" style="width:${m.progreso}%;background:${m.color}"></div>
          </div>
          <span style="font-size:0.75rem;color:#888;">${m.progreso}%</span>
        </div>
      </td>
      <td>
        <button class="btn-edit" onclick="abrirModalMateria(${i})">✏ Editar</button>
        <button class="btn-del"  onclick="eliminarMateria(${i})">✕</button>
      </td>
    </tr>`).join('');
}

let editandoMateriaIdx = null;

function abrirModalMateria(idx) {
  editandoMateriaIdx = idx;
  const modal = document.getElementById('modalMateria');
  if (idx !== null) {
    const m = materias[idx];
    document.getElementById('modalMateriaTitle').textContent = 'Editar materia';
    document.getElementById('mNombre').value   = m.nombre;
    document.getElementById('mCodigo').value   = m.codigo;
    document.getElementById('mDocente').value  = m.docente;
    document.getElementById('mProgreso').value = m.progreso;
    document.getElementById('mColor').value    = m.color;
    document.getElementById('mColorPicker').value = m.color;
  } else {
    document.getElementById('modalMateriaTitle').textContent = 'Nueva materia';
    document.getElementById('mNombre').value   = '';
    document.getElementById('mCodigo').value   = '';
    document.getElementById('mDocente').value  = '';
    document.getElementById('mProgreso').value = '';
    document.getElementById('mColor').value    = '#1a6a3e';
    document.getElementById('mColorPicker').value = '#1a6a3e';
  }
  modal.classList.remove('hidden');
}

// Sincronizar color picker con input texto
document.getElementById('mColorPicker').addEventListener('input', e => {
  document.getElementById('mColor').value = e.target.value;
});
document.getElementById('mColor').addEventListener('input', e => {
  const val = e.target.value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) document.getElementById('mColorPicker').value = val;
});

function guardarMateria() {
  const m = {
    id: editandoMateriaIdx !== null ? materias[editandoMateriaIdx].id : Date.now(),
    nombre:   document.getElementById('mNombre').value.trim(),
    codigo:   document.getElementById('mCodigo').value.trim(),
    docente:  document.getElementById('mDocente').value.trim(),
    progreso: parseInt(document.getElementById('mProgreso').value) || 0,
    color:    document.getElementById('mColor').value.trim() || '#1a6a3e',
  };
  if (!m.nombre) { alert('El nombre de la materia es obligatorio.'); return; }
  if (editandoMateriaIdx !== null) {
    materias[editandoMateriaIdx] = m;
  } else {
    materias.push(m);
  }
  lsSet('campusMaterias', materias);
  renderMaterias();
  cerrarModal('modalMateria');
  flashBadge('badgeMaterias');
  logActividad('success', `Materia "${m.nombre}" ${editandoMateriaIdx !== null ? 'editada' : 'creada'}`);
}

function eliminarMateria(idx) {
  const nombre = materias[idx].nombre;
  if (!confirm(`¿Eliminar la materia "${nombre}"?`)) return;
  materias.splice(idx, 1);
  lsSet('campusMaterias', materias);
  renderMaterias();
  flashBadge('badgeMaterias');
  logActividad('warning', `Materia "${nombre}" eliminada`);
}

// ══════════════════════════════════════════════════════════
//  NOVEDADES
// ══════════════════════════════════════════════════════════
const dotColors = { verde:'#1a6a3e', naranja:'#e67e22', rojo:'#c0392b', azul:'#2980b9' };

function renderNovedades() {
  const list = document.getElementById('novedadesList');
  if (!novedades.length) {
    list.innerHTML = '<div class="empty-state">Sin novedades.</div>';
    return;
  }
  list.innerHTML = novedades.map((n, i) => `
    <div class="novedad-editor-item">
      <span class="novedad-dot-edit" style="background:${dotColors[n.color]||'#999'}"></span>
      <div class="novedad-editor-info">
        <div class="novedad-editor-titulo">${n.titulo}</div>
        <div class="novedad-editor-desc">${n.desc}</div>
      </div>
      <div class="novedad-editor-fecha">${n.fecha}</div>
      <button class="btn-edit" onclick="abrirModalNovedad(${i})">✏</button>
      <button class="btn-del"  onclick="eliminarNovedad(${i})">✕</button>
    </div>`).join('');
}

let editandoNovedadIdx = null;

function abrirModalNovedad(idx) {
  editandoNovedadIdx = idx;
  if (idx !== null) {
    const n = novedades[idx];
    document.getElementById('modalNovedadTitle').textContent = 'Editar novedad';
    document.getElementById('nTitulo').value = n.titulo;
    document.getElementById('nDesc').value   = n.desc;
    document.getElementById('nFecha').value  = n.fecha;
    document.getElementById('nColor').value  = n.color;
  } else {
    document.getElementById('modalNovedadTitle').textContent = 'Nueva novedad';
    document.getElementById('nTitulo').value = '';
    document.getElementById('nDesc').value   = '';
    document.getElementById('nFecha').value  = '';
    document.getElementById('nColor').value  = 'verde';
  }
  document.getElementById('modalNovedad').classList.remove('hidden');
}

function guardarNovedad() {
  const n = {
    id: editandoNovedadIdx !== null ? novedades[editandoNovedadIdx].id : Date.now(),
    titulo: document.getElementById('nTitulo').value.trim(),
    desc:   document.getElementById('nDesc').value.trim(),
    fecha:  document.getElementById('nFecha').value.trim(),
    color:  document.getElementById('nColor').value,
  };
  if (!n.titulo) { alert('El título es obligatorio.'); return; }
  if (editandoNovedadIdx !== null) {
    novedades[editandoNovedadIdx] = n;
  } else {
    novedades.push(n);
  }
  lsSet('campusNovedades', novedades);
  renderNovedades();
  cerrarModal('modalNovedad');
  flashBadge('badgeNovedades');
  logActividad('success', `Novedad "${n.titulo}" ${editandoNovedadIdx !== null ? 'editada' : 'creada'}`);
}

function eliminarNovedad(idx) {
  const titulo = novedades[idx].titulo;
  if (!confirm(`¿Eliminar la novedad "${titulo}"?`)) return;
  novedades.splice(idx, 1);
  lsSet('campusNovedades', novedades);
  renderNovedades();
  flashBadge('badgeNovedades');
  logActividad('warning', `Novedad "${titulo}" eliminada`);
}

// ══════════════════════════════════════════════════════════
//  AGENDA
// ══════════════════════════════════════════════════════════
function renderAgenda() {
  const list = document.getElementById('agendaList');
  if (!agenda.length) {
    list.innerHTML = '<div class="empty-state">Sin eventos en la agenda.</div>';
    return;
  }
  list.innerHTML = agenda.map((a, i) => `
    <div class="agenda-editor-item">
      <div>
        <div class="agenda-dia-badge">${a.dia}</div>
        <div class="agenda-mes-badge">${a.mes}</div>
      </div>
      <div class="agenda-editor-info" style="flex:1;">
        <div class="agenda-editor-titulo">${a.titulo}</div>
        <div class="agenda-editor-hora">🕐 ${a.hora}</div>
      </div>
      <button class="btn-edit" onclick="abrirModalAgenda(${i})">✏</button>
      <button class="btn-del"  onclick="eliminarAgenda(${i})">✕</button>
    </div>`).join('');
}

let editandoAgendaIdx = null;

function abrirModalAgenda(idx) {
  editandoAgendaIdx = idx;
  if (idx !== null) {
    const a = agenda[idx];
    document.getElementById('modalAgendaTitle').textContent = 'Editar evento';
    document.getElementById('aTitulo').value = a.titulo;
    document.getElementById('aDia').value    = a.dia;
    document.getElementById('aMes').value    = a.mes;
    document.getElementById('aHora').value   = a.hora;
  } else {
    document.getElementById('modalAgendaTitle').textContent = 'Nuevo evento';
    document.getElementById('aTitulo').value = '';
    document.getElementById('aDia').value    = '';
    document.getElementById('aMes').value    = '';
    document.getElementById('aHora').value   = '';
  }
  document.getElementById('modalAgenda').classList.remove('hidden');
}

function guardarAgenda() {
  const a = {
    id: editandoAgendaIdx !== null ? agenda[editandoAgendaIdx].id : Date.now(),
    titulo: document.getElementById('aTitulo').value.trim(),
    dia:    parseInt(document.getElementById('aDia').value) || 1,
    mes:    document.getElementById('aMes').value.trim(),
    hora:   document.getElementById('aHora').value.trim(),
  };
  if (!a.titulo) { alert('El título es obligatorio.'); return; }
  if (editandoAgendaIdx !== null) {
    agenda[editandoAgendaIdx] = a;
  } else {
    agenda.push(a);
  }
  lsSet('campusAgenda', agenda);
  renderAgenda();
  cerrarModal('modalAgenda');
  flashBadge('badgeAgenda');
  logActividad('success', `Evento "${a.titulo}" ${editandoAgendaIdx !== null ? 'editado' : 'creado'}`);
}

function eliminarAgenda(idx) {
  const titulo = agenda[idx].titulo;
  if (!confirm(`¿Eliminar el evento "${titulo}"?`)) return;
  agenda.splice(idx, 1);
  lsSet('campusAgenda', agenda);
  renderAgenda();
  flashBadge('badgeAgenda');
  logActividad('warning', `Evento "${titulo}" eliminado`);
}

// ══════════════════════════════════════════════════════════
//  ACCESOS RÁPIDOS
// ══════════════════════════════════════════════════════════
function renderShortcuts() {
  const list = document.getElementById('shortcutsList');
  if (!shortcuts.length) {
    list.innerHTML = '<div class="empty-state">Sin accesos rápidos.</div>';
    return;
  }
  list.innerHTML = shortcuts.map((s, i) => `
    <div class="shortcut-editor-item">
      <span class="shortcut-icon-preview">${s.icono}</span>
      <span>${s.nombre}</span>
      <button class="btn-edit" onclick="abrirModalShortcut(${i})" style="padding:4px 8px;">✏</button>
      <button class="btn-del"  onclick="eliminarShortcut(${i})"   style="padding:4px 8px;">✕</button>
    </div>`).join('');
}

let editandoShortcutIdx = null;

function abrirModalShortcut(idx) {
  editandoShortcutIdx = idx;
  if (idx !== null) {
    const s = shortcuts[idx];
    document.getElementById('modalShortcutTitle').textContent = 'Editar acceso';
    document.getElementById('sNombre').value = s.nombre;
    document.getElementById('sIcono').value  = s.icono;
  } else {
    document.getElementById('modalShortcutTitle').textContent = 'Nuevo acceso rápido';
    document.getElementById('sNombre').value = '';
    document.getElementById('sIcono').value  = '';
  }
  document.getElementById('modalShortcut').classList.remove('hidden');
}

function guardarShortcut() {
  const s = {
    id: editandoShortcutIdx !== null ? shortcuts[editandoShortcutIdx].id : Date.now(),
    nombre: document.getElementById('sNombre').value.trim(),
    icono:  document.getElementById('sIcono').value.trim() || '⚡',
  };
  if (!s.nombre) { alert('El nombre es obligatorio.'); return; }
  if (editandoShortcutIdx !== null) {
    shortcuts[editandoShortcutIdx] = s;
  } else {
    shortcuts.push(s);
  }
  lsSet('campusShortcuts', shortcuts);
  renderShortcuts();
  cerrarModal('modalShortcut');
  flashBadge('badgeShortcuts');
  logActividad('success', `Acceso "${s.nombre}" ${editandoShortcutIdx !== null ? 'editado' : 'creado'}`);
}

function eliminarShortcut(idx) {
  const nombre = shortcuts[idx].nombre;
  if (!confirm(`¿Eliminar el acceso "${nombre}"?`)) return;
  shortcuts.splice(idx, 1);
  lsSet('campusShortcuts', shortcuts);
  renderShortcuts();
  flashBadge('badgeShortcuts');
  logActividad('warning', `Acceso "${nombre}" eliminado`);
}

// ── Helpers modales ──────────────────────────────────────
function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}
// Cerrar al hacer click fuera
document.querySelectorAll('.editor-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
});

// ── Flash badge "Guardado" ───────────────────────────────
function flashBadge(id) {
  const el = document.getElementById(id);
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Log actividad ────────────────────────────────────────
function logActividad(tipo, mensaje) {
  const log = lsGet('actividadLog') || [];
  log.unshift({ tipo, mensaje, hora: horaActual() });
  if (log.length > 30) log.pop();
  lsSet('actividadLog', log);
  renderizarLog();
}

// ── Render inicial ───────────────────────────────────────
renderMaterias();
renderNovedades();
renderAgenda();
renderShortcuts();
