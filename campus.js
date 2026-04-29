// ── Utilidades localStorage ──────────────────────────────
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── Guardia de sesión ────────────────────────────────────
// Si no hay sesión activa, redirigir al login inmediatamente.
(function verificarSesion() {
  const sesion = lsGet('sesionActiva');
  if (!sesion || !sesion.usuario) {
    window.location.replace('index.html');
  }
})();

// ── Sesión ───────────────────────────────────────────────
const sesion = lsGet('sesionActiva');
if (sesion && sesion.usuario) {
  document.getElementById('headerUser').textContent = sesion.usuario;
}

// ── Toast ────────────────────────────────────────────────
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toastEl');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ── Cerrar sesión ────────────────────────────────────────
document.getElementById('btnSalir').addEventListener('click', () => {
  localStorage.removeItem('sesionActiva');
  window.location.href = 'index.html';
});

// ══════════════════════════════════════════════════════════
//  DATOS POR DEFECTO
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
  { id:1, nombre:'Biblioteca',     icono:'📚' },
  { id:2, nombre:'Mensajes',       icono:'💬' },
  { id:3, nombre:'Calificaciones', icono:'📋' },
  { id:4, nombre:'Asistencia',     icono:'✅' },
  { id:5, nombre:'Foros',          icono:'💬' },
  { id:6, nombre:'Descargas',      icono:'📥' },
];
const defaultHero = {
  titulo: 'Tu espacio de aprendizaje institucional',
  desc: 'Accedé a tus materias, actividades y novedades desde un solo lugar. Tu progreso académico actualizado.',
  tag: '🏫 Campus Virtual · Ciclo 2025',
  stat1num: '6', stat1lbl: 'Materias activas',
  stat2num: '3', stat2lbl: 'Entregas pendientes',
  stat3num: '2', stat3lbl: 'Novedades nuevas',
};

// Eventos del calendario por defecto (ISO 8601: YYYY-MM-DD)
const defaultCalEventos = [
  { id:1,  titulo:'Entrega TP Historia',        desc:'Historia · 1er año',            fecha:'2025-04-18', hora:'23:59', cat:'entrega'  },
  { id:2,  titulo:'Parcial Matemática',          desc:'Unidades 1 a 3',                fecha:'2025-04-21', hora:'08:00', cat:'examen'   },
  { id:3,  titulo:'Reunión de padres',           desc:'Auditorio central',             fecha:'2025-04-24', hora:'18:00', cat:'evento'   },
  { id:4,  titulo:'Acto Patrio 25 de Mayo',      desc:'Patio central · Uniforme de gala', fecha:'2025-05-23', hora:'09:00', cat:'evento' },
  { id:5,  titulo:'Examen Lengua y Literatura',  desc:'Unidad 4 · Análisis literario', fecha:'2025-05-07', hora:'08:00', cat:'examen'   },
  { id:6,  titulo:'Feria de Ciencias',           desc:'Salón de actos',                fecha:'2025-05-15', hora:'10:00', cat:'evento'   },
  { id:7,  titulo:'Feriado — Día del Trabajador',desc:'Asueto nacional',               fecha:'2025-05-01', hora:'',     cat:'feriado'  },
  { id:8,  titulo:'Entrega TP Ciencias Naturales',desc:'Trabajos prácticos grupales', fecha:'2025-05-12', hora:'23:59', cat:'entrega'  },
  { id:9,  titulo:'Receso invernal',             desc:'Sin clases',                    fecha:'2025-07-07', hora:'',     cat:'feriado'  },
  { id:10, titulo:'Parcial de Historia',         desc:'Período colonial',              fecha:'2025-06-04', hora:'08:00', cat:'examen'   },
  { id:11, titulo:'Día del libro',               desc:'Actividades especiales',        fecha:'2025-04-23', hora:'',     cat:'evento'   },
  { id:12, titulo:'Entrega TP Matemática',       desc:'Álgebra · Unidad 2',           fecha:'2025-06-13', hora:'23:59', cat:'entrega'  },
];

// ── Cargar datos ─────────────────────────────────────────
const materias   = lsGet('campusMaterias')   || defaultMaterias;
const novedades  = lsGet('campusNovedades')  || defaultNovedades;
const agenda     = lsGet('campusAgenda')     || defaultAgenda;
const shortcuts  = lsGet('campusShortcuts')  || defaultShortcuts;
const heroData   = lsGet('campusHero')       || defaultHero;
let   calEventos = lsGet('campusCalendario') || defaultCalEventos;

// ══════════════════════════════════════════════════════════
//  RENDERIZAR HERO
// ══════════════════════════════════════════════════════════
(function renderHero() {
  const h = heroData;
  const tag    = document.querySelector('.hero-tag');
  const titulo = document.querySelector('.hero-content h2');
  const desc   = document.querySelector('.hero-content > p');
  const stats  = document.querySelectorAll('.hero-stat');
  if (tag)   tag.textContent    = h.tag;
  if (titulo) titulo.textContent = h.titulo;
  if (desc)  desc.textContent   = h.desc;
  if (stats[0]) { stats[0].querySelector('.num').textContent = h.stat1num; stats[0].querySelector('.lbl').textContent = h.stat1lbl; }
  if (stats[1]) { stats[1].querySelector('.num').textContent = h.stat2num; stats[1].querySelector('.lbl').textContent = h.stat2lbl; }
  if (stats[2]) { stats[2].querySelector('.num').textContent = h.stat3num; stats[2].querySelector('.lbl').textContent = h.stat3lbl; }
})();

// ══════════════════════════════════════════════════════════
//  RENDERIZAR MATERIAS
// ══════════════════════════════════════════════════════════
(function renderMaterias() {
  const grid = document.querySelector('.materias-grid');
  if (!grid) return;
  grid.innerHTML = materias.map(m => `
    <a class="materia-card" href="#" onclick="toast('Abriendo ${m.nombre.replace(/'/g,"\\'")}...'); return false;">
      <div class="materia-color" style="background:${m.color};"></div>
      <div class="materia-body">
        <div class="materia-code">${m.codigo}</div>
        <div class="materia-name">${m.nombre}</div>
        <div class="materia-docente">${m.docente}</div>
        <div class="materia-footer">
          <div class="materia-progreso">
            <div class="materia-progreso-fill" style="width:${m.progreso}%;background:${m.color}"></div>
          </div>
          <span class="materia-pct">${m.progreso}%</span>
        </div>
      </div>
    </a>`).join('');
})();

// ══════════════════════════════════════════════════════════
//  RENDERIZAR NOVEDADES
// ══════════════════════════════════════════════════════════
(function renderNovedades() {
  const list = document.querySelector('.novedades-list');
  if (!list) return;
  list.innerHTML = novedades.map(n => `
    <div class="novedad-item" onclick="toast('${n.titulo.replace(/'/g,"\\'")}')">
      <span class="novedad-dot ${n.color || 'azul'}"></span>
      <div class="novedad-content">
        <div class="novedad-titulo">${n.titulo}</div>
        <div class="novedad-desc">${n.desc}</div>
      </div>
      <div class="novedad-fecha">${n.fecha}</div>
    </div>`).join('');
})();

// ══════════════════════════════════════════════════════════
//  RENDERIZAR AGENDA
// ══════════════════════════════════════════════════════════
(function renderAgenda() {
  const grid = document.querySelector('.agenda-grid');
  if (!grid) return;
  grid.innerHTML = agenda.map(a => `
    <div class="agenda-card" onclick="toast('${a.titulo.replace(/'/g,"\\'")}')">
      <div class="agenda-fecha">
        <div class="agenda-dia">${a.dia}</div>
        <div class="agenda-mes">${a.mes}</div>
      </div>
      <div class="agenda-info">
        <div class="agenda-titulo">${a.titulo}</div>
        <div class="agenda-hora">🕐 ${a.hora}</div>
      </div>
    </div>`).join('');
})();

// ══════════════════════════════════════════════════════════
//  RENDERIZAR ACCESOS RÁPIDOS
// ══════════════════════════════════════════════════════════
(function renderShortcuts() {
  const grid = document.querySelector('.shortcuts-grid');
  if (!grid) return;
  grid.innerHTML = shortcuts.map(s => `
    <div class="shortcut-card" onclick="toast('${s.nombre.replace(/'/g,"\\'")} — próximamente')">
      <span class="shortcut-icon">${s.icono}</span>
      <span>${s.nombre}</span>
    </div>`).join('');
})();

// ══════════════════════════════════════════════════════════
//  CALENDARIO
// ══════════════════════════════════════════════════════════

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

let calAnio  = new Date().getFullYear();
let calMes   = new Date().getMonth(); // 0-indexed
let modoEdicion = false;
let editandoEvId = null;
let calFechaClickeada = null;

// ── Cambiar mes ──────────────────────────────────────────
function cambiarMes(delta) {
  calMes += delta;
  if (calMes > 11) { calMes = 0; calAnio++; }
  if (calMes < 0)  { calMes = 11; calAnio--; }
  renderCalendario();
}

// ── Toggle modo edición ───────────────────────────────────
function toggleModoEdicion() {
  modoEdicion = !modoEdicion;
  const btn = document.getElementById('btnEditarCalendario');
  const footer = document.querySelector('.calendario-footer');
  if (modoEdicion) {
    btn.textContent = '✓ Salir de edición';
    btn.classList.add('activo');
    footer.classList.add('modo-edicion-activa');
    toast('Modo edición activo — Hacé click en un día para agregar un evento');
  } else {
    btn.innerHTML = '&#9998; Editar calendario';
    btn.classList.remove('activo');
    footer.classList.remove('modo-edicion-activa');
    toast('Edición finalizada');
  }
  renderCalendario();
}

// ── Render principal del calendario ──────────────────────
function renderCalendario() {
  // Etiqueta del mes (navegación)
  document.getElementById('calMesLabel').textContent = `${MESES_ES[calMes]} ${calAnio}`;
  document.getElementById('calEventosTitulo').textContent = `Eventos de ${MESES_ES[calMes]}`;

  // Cabecera estilo impreso
  const nomEl = document.getElementById('calMesNombre');
  const anioEl = document.getElementById('calMesAnio');
  if (nomEl)  nomEl.textContent  = MESES_ES[calMes].toLowerCase();
  if (anioEl) anioEl.textContent = calAnio;

  const hoy  = new Date();
  const primerDia = new Date(calAnio, calMes, 1).getDay(); // 0=Dom
  const diasEnMes = new Date(calAnio, calMes + 1, 0).getDate();

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  // Celdas del mes anterior
  const mesAnteriorDias = new Date(calAnio, calMes, 0).getDate();
  let colIdx = 0; // columna actual (0=Dom … 6=Sáb)
  for (let i = primerDia - 1; i >= 0; i--) {
    const d = mesAnteriorDias - i;
    const m = calMes - 1 < 0 ? 11 : calMes - 1;
    const a = calMes - 1 < 0 ? calAnio - 1 : calAnio;
    grid.appendChild(crearCelda(d, m, a, true, false, colIdx++));
  }

  // Celdas del mes actual
  for (let d = 1; d <= diasEnMes; d++) {
    const esHoy = d === hoy.getDate() && calMes === hoy.getMonth() && calAnio === hoy.getFullYear();
    grid.appendChild(crearCelda(d, calMes, calAnio, false, esHoy, colIdx % 7));
    colIdx++;
  }

  // Celdas del mes siguiente (completar grid a múltiplo de 7)
  const total = primerDia + diasEnMes;
  const resto = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= resto; d++) {
    const m = calMes + 1 > 11 ? 0 : calMes + 1;
    const a = calMes + 1 > 11 ? calAnio + 1 : calAnio;
    grid.appendChild(crearCelda(d, m, a, true, false, colIdx % 7));
    colIdx++;
  }

  // Lista de eventos del mes actual
  renderEventosMes();
}

// ── Crear celda de día ────────────────────────────────────
function crearCelda(dia, mes, anio, otroMes, esHoy, colIdx) {
  const COL_CLASES = ['dom','lun','mar','mie','jue','vie','sab'];
  const cell = document.createElement('div');
  cell.className = 'cal-dia' + (otroMes ? ' otro-mes' : '') + (esHoy ? ' hoy' : '') + (modoEdicion ? ' modo-edicion' : '');

  const numEl = document.createElement('div');
  numEl.className = 'cal-dia-num';
  // Color por día de semana (Dom=rojo, Sáb=rojo claro)
  if (!otroMes && colIdx !== undefined) {
    numEl.classList.add('col-' + COL_CLASES[colIdx % 7]);
  }
  numEl.textContent = dia;
  cell.appendChild(numEl);

  // Eventos de este día
  const fechaStr = `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  const evsDia = calEventos.filter(e => e.fecha === fechaStr);

  const MAX_CHIPS = 2;
  evsDia.slice(0, MAX_CHIPS).forEach(ev => {
    const chip = document.createElement('span');
    chip.className = `cal-evento-chip cat-${ev.cat}`;
    chip.textContent = ev.titulo;
    chip.title = ev.titulo + (ev.desc ? ' — ' + ev.desc : '') + (ev.hora ? ' · ' + ev.hora : '');
    if (modoEdicion) {
      chip.onclick = (e) => { e.stopPropagation(); abrirModalEditar(ev.id); };
    } else {
      chip.onclick = (e) => { e.stopPropagation(); toast(ev.titulo + (ev.hora ? ' — ' + ev.hora : '')); };
    }
    cell.appendChild(chip);
  });

  if (evsDia.length > MAX_CHIPS) {
    const mas = document.createElement('div');
    mas.className = 'cal-mas-eventos';
    mas.textContent = `+${evsDia.length - MAX_CHIPS} más`;
    mas.onclick = (e) => { e.stopPropagation(); toast(`${evsDia.length} eventos el día ${dia}`); };
    cell.appendChild(mas);
  }

  // Click en celda: abrir modal de nuevo evento (solo en modo edición)
  if (modoEdicion) {
    cell.addEventListener('click', () => {
      calFechaClickeada = fechaStr;
      abrirModalNuevo(fechaStr);
    });
  }

  return cell;
}

// ── Lista de eventos del mes ──────────────────────────────
function renderEventosMes() {
  const lista = document.getElementById('calEventosLista');
  const evsMes = calEventos
    .filter(e => {
      const [a, m] = e.fecha.split('-').map(Number);
      return a === calAnio && m === calMes + 1;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (!evsMes.length) {
    lista.innerHTML = '<div class="cal-eventos-vacio">Sin eventos registrados este mes.</div>';
    return;
  }

  lista.innerHTML = evsMes.map(ev => {
    const [, , dd] = ev.fecha.split('-');
    const mes = MESES_CORTO[calMes];
    return `
      <div class="cal-evento-card">
        <div class="cal-evento-card-fecha">
          <div class="cal-evento-card-dia" style="color:var(--cat-${ev.cat})">${parseInt(dd)}</div>
          <div class="cal-evento-card-mes">${mes}</div>
        </div>
        <div class="cal-evento-card-info">
          <div class="cal-evento-card-titulo">${ev.titulo}</div>
          ${ev.desc ? `<div class="cal-evento-card-desc">${ev.desc}</div>` : ''}
          ${ev.hora ? `<div class="cal-evento-card-hora">🕐 ${ev.hora}</div>` : ''}
        </div>
        <div class="cal-evento-card-actions">
          <button class="cal-ev-btn edit" title="Editar" onclick="abrirModalEditar(${ev.id})">✏</button>
          <button class="cal-ev-btn del"  title="Eliminar" onclick="eliminarEvento(${ev.id})">✕</button>
        </div>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════
//  MODAL EVENTOS
// ══════════════════════════════════════════════════════════

let catSeleccionada = 'examen';

// Selector de categoría
document.querySelectorAll('.cal-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cal-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    catSeleccionada = btn.dataset.cat;
  });
});

function abrirModalNuevo(fechaPreset) {
  editandoEvId = null;
  document.getElementById('calModalTitle').textContent = 'Nuevo evento';
  document.getElementById('calEvTitulo').value = '';
  document.getElementById('calEvDesc').value   = '';
  document.getElementById('calEvFecha').value  = fechaPreset || '';
  document.getElementById('calEvHora').value   = '';
  seleccionarCat('examen');
  document.getElementById('calModal').classList.remove('hidden');
}

function abrirModalEditar(id) {
  const ev = calEventos.find(e => e.id === id);
  if (!ev) return;
  editandoEvId = id;
  document.getElementById('calModalTitle').textContent = 'Editar evento';
  document.getElementById('calEvTitulo').value = ev.titulo;
  document.getElementById('calEvDesc').value   = ev.desc || '';
  document.getElementById('calEvFecha').value  = ev.fecha;
  document.getElementById('calEvHora').value   = ev.hora || '';
  seleccionarCat(ev.cat);
  document.getElementById('calModal').classList.remove('hidden');
}

function seleccionarCat(cat) {
  catSeleccionada = cat;
  document.querySelectorAll('.cal-cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
}

function cerrarCalModal() {
  document.getElementById('calModal').classList.add('hidden');
  editandoEvId = null;
  calFechaClickeada = null;
}

// Cerrar al click en el overlay (fuera del modal)
document.getElementById('calModal').addEventListener('click', e => {
  if (e.target.id === 'calModal') cerrarCalModal();
});

// Cerrar con tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarCalModal();
});

// Garantizar que el modal esté cerrado al cargar
document.getElementById('calModal').classList.add('hidden');

function guardarEvento() {
  const titulo = document.getElementById('calEvTitulo').value.trim();
  const fecha  = document.getElementById('calEvFecha').value;
  if (!titulo) { toast('El título es obligatorio'); return; }
  if (!fecha)  { toast('La fecha es obligatoria'); return; }

  const ev = {
    id:     editandoEvId !== null ? editandoEvId : Date.now(),
    titulo,
    desc:   document.getElementById('calEvDesc').value.trim(),
    fecha,
    hora:   document.getElementById('calEvHora').value,
    cat:    catSeleccionada,
  };

  if (editandoEvId !== null) {
    const idx = calEventos.findIndex(e => e.id === editandoEvId);
    if (idx !== -1) calEventos[idx] = ev;
  } else {
    calEventos.push(ev);
  }

  lsSet('campusCalendario', calEventos);
  cerrarCalModal();
  renderCalendario();
  toast(editandoEvId ? 'Evento actualizado ✓' : 'Evento agregado ✓');
}

function eliminarEvento(id) {
  const ev = calEventos.find(e => e.id === id);
  if (!ev) return;
  if (!confirm(`¿Eliminar el evento "${ev.titulo}"?`)) return;
  calEventos = calEventos.filter(e => e.id !== id);
  lsSet('campusCalendario', calEventos);
  renderCalendario();
  toast('Evento eliminado');
}

// ── Iniciar calendario en el mes actual ──────────────────
renderCalendario();

// ── Scroll a secciones ───────────────────────────────────
function scrollToEventos() {
  document.querySelector('.calendario-section').scrollIntoView({ behavior: 'smooth' });
}
function scrollToNovedades() {
  const el = document.getElementById('seccion-novedades');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════
//  PANEL DE MATERIAS
// ══════════════════════════════════════════════════════════
let carrerasPanelAbierto = false;

function toggleCarreras() {
  const panel    = document.getElementById('carrerasPanel');
  const btnNav   = document.getElementById('btnCarreras');
  const backdrop = document.getElementById('carrerasBackdrop');
  carrerasPanelAbierto = !carrerasPanelAbierto;

  if (carrerasPanelAbierto) {
    // Posicionar justo bajo el header (altura real en caso de wrap)
    const headerH = document.querySelector('.campus-header').offsetHeight;
    panel.style.top = headerH + 'px';

    panel.classList.add('abierto');
    panel.setAttribute('aria-hidden', 'false');
    btnNav.classList.add('carreras-activo');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden'; // evita scroll del fondo
  } else {
    panel.classList.remove('abierto');
    panel.setAttribute('aria-hidden', 'true');
    btnNav.classList.remove('carreras-activo');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

function switchAnio(num) {
  // Tabs
  document.querySelectorAll('.anio-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.anio-tab[data-anio="${num}"]`).classList.add('active');
  // Contenidos
  document.querySelectorAll('.anio-contenido').forEach(c => c.classList.remove('active'));
  document.getElementById(`anio-${num}`).classList.add('active');
}
function seleccionarMateria(li) {
  const nombre = li.textContent.trim();

  // Quitar selección previa en todas las materias
  document.querySelectorAll('.materia-item').forEach(m => m.classList.remove('seleccionada'));
  li.classList.add('seleccionada');

  // Toast y cierre del panel
  setTimeout(() => {
    toggleCarreras();
    toast('📖 ' + nombre);
  }, 220);
}
