// =========================================================
//  PORTAL DE TALLERES — app.js
//  100% HTML/CSS/JS, sin fetch local, localStorage como DB
// =========================================================

// ── 1. DATOS DE PRUEBA PRECARGADOS ───────────────────────

const TALLERES_INICIALES = [
  {
    id: 1,
    colaborador: { nombre: "Laura Méndez", telefono: "1155234567", mail: "laura@mail.com" },
    nombre: "Taller de Arcilla",
    descripcion: "Aprendé a moldear y crear tus propias figuras de arcilla desde cero. Para todas las edades.",
    actividad: "Cerámica y modelado",
    rubro: "Artesanías",
    contacto: "@taller_arcilla_laura | 1155234567",
    lat: -34.52264,
    lng: -58.70040,
    ubicacionNombre: "Juan M. Gutiérrez 1150",
    logo: null
  },
  {
    id: 2,
    colaborador: { nombre: "Marcos Soria", telefono: "1166345678", mail: "marcos@mail.com" },
    nombre: "Taller de Herrería",
    descripcion: "Construí tus propios objetos metálicos. Técnicas básicas y avanzadas de soldadura y forja.",
    actividad: "Herrería y forja",
    rubro: "Oficios",
    contacto: "1166345678",
    lat: -34.52180,
    lng: -58.70321,
    ubicacionNombre: "José León Suárez 800",
    logo: null
  },
  {
    id: 3,
    colaborador: { nombre: "Ana García", telefono: "1177456789", mail: "ana@mail.com" },
    nombre: "Taller de Jabones Artesanales",
    descripcion: "Creá tus propios jabones naturales con ingredientes ecológicos. Incluye fragancias y colores.",
    actividad: "Jabonería artesanal",
    rubro: "Cosmética Natural",
    contacto: "@jabones_ana",
    lat: -34.52405,
    lng: -58.69850,
    ubicacionNombre: "Verdi 920",
    logo: null
  },
  {
    id: 4,
    colaborador: { nombre: "Carlos Benitez", telefono: "1188567890", mail: "carlos@mail.com" },
    nombre: "Taller de Sahumerios",
    descripcion: "Elaborá los mejores sahumerios y varillas de incienso con hierbas y resinas naturales.",
    actividad: "Aromaterapia y sahumerios",
    rubro: "Bienestar",
    contacto: "1188567890 | @sahumerios_cb",
    lat: -34.52330,
    lng: -58.70200,
    ubicacionNombre: "Centro Cultural (sede)",
    logo: null
  },
  {
    id: 5,
    colaborador: { nombre: "Valeria Torres", telefono: "1199678901", mail: "valeria@mail.com" },
    nombre: "Taller de Pintura",
    descripcion: "Explorá distintas técnicas: acrílico, acuarela, óleo. Grupos reducidos, nivel inicial y avanzado.",
    actividad: "Pintura y dibujo",
    rubro: "Arte",
    contacto: "@pintura_con_vale | valtorres@mail.com",
    lat: -34.52050,
    lng: -58.69980,
    ubicacionNombre: "Plaza J.M. Gutiérrez",
    logo: null
  }
];

// Ubicaciones predefinidas para el formulario
const UBICACIONES = [
  { id: "ubi-centro",   nombre: "Centro Cultural (sede)",   dir: "Av. Principal S/N, Los Polvorines",           lat: -34.5230, lng: -58.7020 },
  { id: "ubi-plaza",    nombre: "Plaza J.M. Gutiérrez",     dir: "Plaza Juan María Gutiérrez, Los Polvorines",  lat: -34.5205, lng: -58.6998 },
  { id: "ubi-ruta",     nombre: "Ruta 202 / J.M. Gutiérrez",dir: "Ruta 202 y Juan M. Gutiérrez, Los Polvorines",lat: -34.5233, lng: -58.7020 },
  { id: "ubi-suarez",   nombre: "José León Suárez 800",     dir: "José León Suárez 800, Los Polvorines",        lat: -34.5218, lng: -58.7032 },
  { id: "ubi-verdi",    nombre: "Verdi 920",                dir: "Verdi 920, Los Polvorines",                   lat: -34.5240, lng: -58.6985 },
  { id: "ubi-gutierrez",nombre: "Juan M. Gutiérrez 1150",   dir: "Juan María Gutiérrez 1150, Los Polvorines",   lat: -34.5226, lng: -58.7004 }
];

// ── 2. LOCAL STORAGE ──────────────────────────────────────

const LS_TALLERES      = "talleres_v1";
const LS_INSCRIPCIONES = "inscripciones_v1";

function cargarTalleres() {
  const raw = localStorage.getItem(LS_TALLERES);
  if (!raw) {
    // Primera vez: inicializar con datos de prueba
    guardarTalleres(TALLERES_INICIALES);
    return [...TALLERES_INICIALES];
  }
  return JSON.parse(raw);
}

function guardarTalleres(lista) {
  localStorage.setItem(LS_TALLERES, JSON.stringify(lista));
}

function cargarInscripciones() {
  const raw = localStorage.getItem(LS_INSCRIPCIONES);
  return raw ? JSON.parse(raw) : [];
}

function guardarInscripciones(lista) {
  localStorage.setItem(LS_INSCRIPCIONES, JSON.stringify(lista));
}

function nextId(lista) {
  return lista.length > 0 ? Math.max(...lista.map(t => t.id)) + 1 : 1;
}

// ── 3. ESTADO GLOBAL ──────────────────────────────────────

let talleres = cargarTalleres();
let marcadores = {}; // id → marker leaflet
let mapaInstance = null;
let tileLayers = {};
let tipoMapa = "claro";
let tallerEnModal = null;  // taller seleccionado para inscripción
let logoBase64 = null;
let pasoActual = 1;
let datosColaborador = {};

// ── 4. NAVEGACIÓN SPA ─────────────────────────────────────

function mostrarVista(id) {
  document.querySelectorAll(".vista").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(id).classList.add("active");
  const btnMap = { "vista-explorar": "btn-explorar", "vista-registro": "btn-registro" };
  const btn = document.getElementById(btnMap[id]);
  if (btn) btn.classList.add("active");

  // Inicializar mapa al mostrarlo por primera vez
  if (id === "vista-explorar" && !mapaInstance) {
    initMapa();
  } else if (id === "vista-explorar" && mapaInstance) {
    mapaInstance.invalidateSize();
  }
}

// ── 5. MAPA LEAFLET ───────────────────────────────────────

function initMapa() {
  mapaInstance = L.map("mapa").setView([-34.5220, -58.7010], 14);

  tileLayers = {
    claro: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }),
    oscuro: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© CartoDB"
    })
  };

  tileLayers.claro.addTo(mapaInstance);
  tipoMapa = "claro";
  document.getElementById("btn-claro").classList.add("active");

  // Coordenadas en tiempo real
  mapaInstance.on("mousemove", (e) => {
    document.getElementById("coords-display").textContent =
      `Lat: ${e.latlng.lat.toFixed(5)}  Lng: ${e.latlng.lng.toFixed(5)}`;
  });

  renderMarcadores();
}

function renderMarcadores() {
  if (!mapaInstance) return;

  // Limpiar marcadores existentes
  Object.values(marcadores).forEach(m => mapaInstance.removeLayer(m));
  marcadores = {};

  talleres.forEach(t => {
    const marker = L.marker([t.lat, t.lng]);

    const logoHtml = t.logo
      ? `<img class="popup-logo" src="${t.logo}" alt="Logo">`
      : "";

    marker.bindPopup(`
      <div class="leaflet-popup-content">
        ${logoHtml}
        <div class="popup-content">
          <div class="popup-nombre">${t.nombre}</div>
          <div class="popup-actividad">🎨 ${t.actividad}</div>
          <div class="popup-descripcion">${t.descripcion}</div>
          <div class="popup-contacto">📍 ${t.ubicacionNombre}<br><span>${t.contacto}</span></div>
          <button class="btn-inscribirse" onclick="abrirModalInscripcion(${t.id})">
            ✋ Inscribirse al taller
          </button>
        </div>
      </div>
    `, { maxWidth: 280 });

    marker.addTo(mapaInstance);
    marcadores[t.id] = marker;
  });
}

function cambiarMapa(tipo) {
  if (!mapaInstance || tipoMapa === tipo) return;
  mapaInstance.removeLayer(tileLayers[tipoMapa]);
  tileLayers[tipo].addTo(mapaInstance);
  tipoMapa = tipo;

  document.getElementById("btn-claro").classList.toggle("active", tipo === "claro");
  document.getElementById("btn-oscuro").classList.toggle("active", tipo === "oscuro");
}

// ── 6. SIDEBAR / LISTA DE TALLERES ───────────────────────

function renderLista(lista) {
  const contenedor = document.getElementById("lista-talleres");
  const count = document.getElementById("sidebar-count");

  count.textContent = `${lista.length} taller${lista.length !== 1 ? "es" : ""}`;

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="sin-resultados">
        <div style="font-size:32px;margin-bottom:8px">🔍</div>
        <div>No se encontraron talleres</div>
      </div>`;
    return;
  }

  contenedor.innerHTML = "";
  lista.forEach(t => {
    const card = document.createElement("div");
    card.className = "taller-card";
    card.dataset.id = t.id;
    card.innerHTML = `
      <div class="taller-card-nombre">${t.nombre}</div>
      <div class="taller-card-actividad">🎨 ${t.actividad}</div>
      <div class="taller-card-descripcion">${t.descripcion}</div>
      <span class="badge-rubro">${t.rubro}</span>
    `;
    card.addEventListener("click", () => seleccionarTaller(t));
    contenedor.appendChild(card);
  });
}

function seleccionarTaller(t) {
  // Resaltar card
  document.querySelectorAll(".taller-card").forEach(c => c.classList.remove("selected"));
  const card = document.querySelector(`.taller-card[data-id="${t.id}"]`);
  if (card) card.classList.add("selected");

  // Navegar a marcador
  if (mapaInstance && marcadores[t.id]) {
    mapaInstance.setView([t.lat, t.lng], 16, { animate: true });
    marcadores[t.id].openPopup();
  }
}

function filtrarTalleres() {
  const texto = document.getElementById("filtro-texto").value.toLowerCase().trim();
  const rubro = document.getElementById("filtro-rubro").value;

  const filtrados = talleres.filter(t => {
    const matchTexto = !texto ||
      t.nombre.toLowerCase().includes(texto) ||
      t.actividad.toLowerCase().includes(texto) ||
      t.descripcion.toLowerCase().includes(texto);
    const matchRubro = !rubro || t.rubro === rubro;
    return matchTexto && matchRubro;
  });

  renderLista(filtrados);
}

function poblarRubros() {
  const select = document.getElementById("filtro-rubro");
  const rubros = [...new Set(talleres.map(t => t.rubro))].sort();
  select.innerHTML = `<option value="">Todos los rubros</option>`;
  rubros.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  });
}

// ── 7. MODAL DE INSCRIPCIÓN ───────────────────────────────

function abrirModalInscripcion(tallerId) {
  tallerEnModal = talleres.find(t => t.id === tallerId);
  if (!tallerEnModal) return;

  document.getElementById("modal-title").textContent = `Inscribirse a: ${tallerEnModal.nombre}`;
  document.getElementById("modal-subtitle").textContent = `${tallerEnModal.actividad} · ${tallerEnModal.ubicacionNombre}`;
  document.getElementById("modal-nombre-visitante").value = "";
  document.getElementById("modal-mail-visitante").value = "";

  // Limpiar errores previos
  document.querySelectorAll("#modal-box .campo-form input").forEach(i => i.classList.remove("error"));
  document.querySelectorAll("#modal-box .field-error").forEach(e => e.remove());

  document.getElementById("modal-overlay").classList.add("open");
}

function cerrarModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  tallerEnModal = null;
}

function confirmarInscripcion() {
  const nombre = document.getElementById("modal-nombre-visitante").value.trim();
  const mail   = document.getElementById("modal-mail-visitante").value.trim();

  // Limpiar errores previos
  document.querySelectorAll("#modal-box .campo-form input").forEach(i => i.classList.remove("error"));
  document.querySelectorAll("#modal-box .field-error").forEach(e => e.remove());

  let valido = true;

  if (!nombre) {
    marcarError("modal-nombre-visitante", "El nombre es requerido.");
    valido = false;
  }
  if (!mail || !mail.includes("@")) {
    marcarError("modal-mail-visitante", "Ingresá un mail válido.");
    valido = false;
  }

  if (!valido) return;

  const inscripciones = cargarInscripciones();
  inscripciones.push({
    id: nextId(inscripciones),
    tallerId: tallerEnModal.id,
    tallerNombre: tallerEnModal.nombre,
    nombre,
    mail,
    fecha: new Date().toISOString()
  });
  guardarInscripciones(inscripciones);

  cerrarModal();
  mostrarToast(`✅ ¡Te inscribiste en "${tallerEnModal.nombre}"!`, "success");
}

// ── 8. FORMULARIO DE REGISTRO ─────────────────────────────

function initFormulario() {
  // Poblar ubicaciones
  const grid = document.getElementById("ubicaciones-grid");
  grid.innerHTML = "";
  UBICACIONES.forEach((u, i) => {
    const label = document.createElement("label");
    label.className = "ubicacion-opcion";
    label.innerHTML = `
      <input type="radio" name="ubicacion" value="${u.id}" ${i === 0 ? "checked" : ""}>
      <div class="ubicacion-opcion-info">
        <div class="nombre-lugar">📍 ${u.nombre}</div>
        <div class="dir-lugar">${u.dir}</div>
      </div>
    `;
    grid.appendChild(label);
  });

  // Preview logo
  document.getElementById("campo-logo").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      logoBase64 = ev.target.result;
      const preview = document.getElementById("logo-preview");
      preview.src = logoBase64;
      preview.style.display = "block";
      document.getElementById("logo-filename").textContent = file.name;
    };
    reader.readAsDataURL(file);
  });
}

function irPaso(numero) {
  if (numero === 2) {
    // Validar paso 1
    const campos = [
      { id: "campo-nombre-colab", msg: "El nombre es requerido." },
      { id: "campo-telefono",     msg: "El teléfono es requerido." },
      { id: "campo-mail-colab",   msg: "Ingresá un mail válido.",  check: v => v.includes("@") }
    ];
    let ok = true;
    campos.forEach(c => {
      const input = document.getElementById(c.id);
      const val = input.value.trim();
      const valido = val && (!c.check || c.check(val));
      if (!valido) {
        input.classList.add("error");
        ok = false;
        mostrarErrorCampo(input, c.msg);
      } else {
        input.classList.remove("error");
        borrarErrorCampo(input);
      }
    });
    if (!ok) return;

    datosColaborador = {
      nombre:   document.getElementById("campo-nombre-colab").value.trim(),
      telefono: document.getElementById("campo-telefono").value.trim(),
      mail:     document.getElementById("campo-mail-colab").value.trim()
    };
  }

  pasoActual = numero;
  document.querySelectorAll(".form-card").forEach(f => f.classList.remove("active"));
  document.getElementById(`paso-${numero}`).classList.add("active");
  actualizarPasos(numero);
  document.getElementById("vista-registro").scrollTo({ top: 0, behavior: "smooth" });
}

function actualizarPasos(actual) {
  document.querySelectorAll(".paso-indicador").forEach((el, idx) => {
    const num = idx + 1;
    el.classList.remove("activo", "completado");
    if (num < actual) el.classList.add("completado");
    else if (num === actual) el.classList.add("activo");
  });
}

function guardarTaller() {
  // Validar paso 2
  const campos = [
    { id: "campo-nombre-taller", msg: "El nombre del taller es requerido." },
    { id: "campo-actividad",     msg: "La actividad es requerida." },
    { id: "campo-rubro",         msg: "El rubro es requerido." }
  ];
  let ok = true;
  campos.forEach(c => {
    const input = document.getElementById(c.id);
    if (!input.value.trim()) {
      input.classList.add("error");
      mostrarErrorCampo(input, c.msg);
      ok = false;
    } else {
      input.classList.remove("error");
      borrarErrorCampo(input);
    }
  });
  if (!ok) return;

  // Obtener ubicación seleccionada
  const ubiId = document.querySelector('input[name="ubicacion"]:checked')?.value;
  const ubi = UBICACIONES.find(u => u.id === ubiId) || UBICACIONES[0];

  const nuevos = cargarTalleres();
  const nuevo = {
    id: nextId(nuevos),
    colaborador: datosColaborador,
    nombre:         document.getElementById("campo-nombre-taller").value.trim(),
    descripcion:    document.getElementById("campo-descripcion").value.trim(),
    actividad:      document.getElementById("campo-actividad").value.trim(),
    rubro:          document.getElementById("campo-rubro").value.trim(),
    contacto:       document.getElementById("campo-contacto").value.trim(),
    lat:            ubi.lat,
    lng:            ubi.lng,
    ubicacionNombre: ubi.nombre,
    logo:           logoBase64
  };

  nuevos.push(nuevo);
  guardarTalleres(nuevos);
  talleres = nuevos;

  // Actualizar mapa y lista
  renderMarcadores();
  poblarRubros();
  filtrarTalleres();

  // Mostrar éxito
  document.getElementById("registro-container").style.display = "none";
  document.getElementById("registro-exito").style.display = "block";
}

function reiniciarFormulario() {
  // Limpiar campos
  ["campo-nombre-colab","campo-telefono","campo-mail-colab",
   "campo-nombre-taller","campo-descripcion","campo-actividad",
   "campo-rubro","campo-contacto"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  logoBase64 = null;
  datosColaborador = {};
  pasoActual = 1;
  const preview = document.getElementById("logo-preview");
  preview.src = "";
  preview.style.display = "none";
  document.getElementById("logo-filename").textContent = "Seleccionar imagen";

  document.getElementById("registro-exito").style.display = "none";
  document.getElementById("registro-container").style.display = "block";

  irPaso(1);
}

// ── 9. HELPERS ────────────────────────────────────────────

function marcarError(inputId, msg) {
  const input = document.getElementById(inputId);
  input.classList.add("error");
  mostrarErrorCampo(input, msg);
}

function mostrarErrorCampo(input, msg) {
  borrarErrorCampo(input);
  const span = document.createElement("div");
  span.className = "field-error";
  span.textContent = msg;
  input.parentElement.appendChild(span);
}

function borrarErrorCampo(input) {
  const err = input.parentElement.querySelector(".field-error");
  if (err) err.remove();
}

let toastTimer = null;
function mostrarToast(msg, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.querySelector(".toast-icon").textContent = tipo === "success" ? "✅" : "ℹ️";
  toast.querySelector(".toast-msg").textContent = msg;
  toast.className = `${tipo} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ── 10. INICIALIZACIÓN ────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Navegación
  document.getElementById("btn-explorar").addEventListener("click", () => mostrarVista("vista-explorar"));
  document.getElementById("btn-registro").addEventListener("click", () => mostrarVista("vista-registro"));

  // Filtros
  document.getElementById("filtro-texto").addEventListener("input", filtrarTalleres);
  document.getElementById("filtro-rubro").addEventListener("change", filtrarTalleres);

  // Modo de mapa
  document.getElementById("btn-claro").addEventListener("click", () => cambiarMapa("claro"));
  document.getElementById("btn-oscuro").addEventListener("click", () => cambiarMapa("oscuro"));

  // Modal inscripción
  document.getElementById("modal-close").addEventListener("click", cerrarModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-overlay")) cerrarModal();
  });
  document.getElementById("btn-confirmar-inscripcion").addEventListener("click", confirmarInscripcion);

  // Formulario de registro — pasos
  document.getElementById("btn-siguiente-1").addEventListener("click", () => irPaso(2));
  document.getElementById("btn-volver-2").addEventListener("click", () => irPaso(1));
  document.getElementById("btn-guardar").addEventListener("click", guardarTaller);
  document.getElementById("btn-nuevo-taller").addEventListener("click", reiniciarFormulario);
  document.getElementById("btn-ir-explorar").addEventListener("click", () => {
    reiniciarFormulario();
    mostrarVista("vista-explorar");
  });

  // Init
  initFormulario();
  poblarRubros();
  renderLista(talleres);

  // Vista inicial
  mostrarVista("vista-explorar");
});
