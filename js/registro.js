// =========================================================
//  registro.js — Formulario wizard para registrar un taller
//  Depende de: datos.js (UBICACIONES)
//              storage.js (talleres, cargarTalleres, guardarTalleres, nextId)
//              utils.js (mostrarToast, mostrarErrorCampo, borrarErrorCampo)
//              mapa.js (renderMarcadores)
//              filtros.js (poblarRubros, filtrarTalleres)
// =========================================================

// Estado del formulario
let logoBase64       = null;
let pasoActual       = 1;
let datosColaborador = {};

// ── Inicialización ────────────────────────────────────────

/**
 * Genera dinámicamente las opciones de ubicación y configura
 * el listener del input de logo. Llamar una vez al inicio.
 */
function initFormulario() {
  _poblarUbicaciones();
  _initLogoPreview();
}

function _poblarUbicaciones() {
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
}

function _initLogoPreview() {
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

// ── Navegación entre pasos ────────────────────────────────

/**
 * Avanza o retrocede entre los pasos del wizard.
 * Al avanzar al paso 2, valida primero los campos del paso 1.
 * @param {number} numero - Número del paso al que se quiere ir (1 o 2).
 */
function irPaso(numero) {
  if (numero === 2 && !_validarPaso1()) return;

  pasoActual = numero;
  document.querySelectorAll(".form-card").forEach(f => f.classList.remove("active"));
  document.getElementById(`paso-${numero}`).classList.add("active");
  _actualizarIndicadorPasos(numero);
  document.getElementById("vista-registro").scrollTo({ top: 0, behavior: "smooth" });
}

function _actualizarIndicadorPasos(actual) {
  document.querySelectorAll(".paso-indicador").forEach((el, idx) => {
    const num = idx + 1;
    el.classList.remove("activo", "completado");
    if (num < actual)      el.classList.add("completado");
    else if (num === actual) el.classList.add("activo");
  });
}

// ── Validaciones ──────────────────────────────────────────

function _validarPaso1() {
  const campos = [
    { id: "campo-nombre-colab", msg: "El nombre es requerido." },
    { id: "campo-telefono",     msg: "El teléfono es requerido." },
    { id: "campo-mail-colab",   msg: "Ingresá un mail válido.", check: v => v.includes("@") }
  ];

  let valido = true;

  campos.forEach(c => {
    const input = document.getElementById(c.id);
    const val   = input.value.trim();
    const ok    = val && (!c.check || c.check(val));

    if (!ok) {
      input.classList.add("error");
      mostrarErrorCampo(input, c.msg);
      valido = false;
    } else {
      input.classList.remove("error");
      borrarErrorCampo(input);
    }
  });

  if (valido) {
    // Guardar datos del colaborador para usarlos al guardar el taller
    datosColaborador = {
      nombre:   document.getElementById("campo-nombre-colab").value.trim(),
      telefono: document.getElementById("campo-telefono").value.trim(),
      mail:     document.getElementById("campo-mail-colab").value.trim()
    };
  }

  return valido;
}

function _validarPaso2() {
  const campos = [
    { id: "campo-nombre-taller", msg: "El nombre del taller es requerido." },
    { id: "campo-actividad",     msg: "La actividad es requerida." },
    { id: "campo-rubro",         msg: "El rubro es requerido." }
  ];

  let valido = true;

  campos.forEach(c => {
    const input = document.getElementById(c.id);
    if (!input.value.trim()) {
      input.classList.add("error");
      mostrarErrorCampo(input, c.msg);
      valido = false;
    } else {
      input.classList.remove("error");
      borrarErrorCampo(input);
    }
  });

  return valido;
}

// ── Guardado del taller ───────────────────────────────────

/**
 * Valida el paso 2, construye el objeto taller y lo persiste
 * en localStorage. Luego actualiza el mapa y la lista del sidebar.
 */
function guardarTaller() {
  if (!_validarPaso2()) return;

  const ubiId = document.querySelector('input[name="ubicacion"]:checked')?.value;
  const ubi   = UBICACIONES.find(u => u.id === ubiId) || UBICACIONES[0];

  const listaActual = cargarTalleres();

  const nuevoTaller = {
    id:              nextId(listaActual),
    colaborador:     datosColaborador,
    nombre:          document.getElementById("campo-nombre-taller").value.trim(),
    descripcion:     document.getElementById("campo-descripcion").value.trim(),
    actividad:       document.getElementById("campo-actividad").value.trim(),
    rubro:           document.getElementById("campo-rubro").value.trim(),
    contacto:        document.getElementById("campo-contacto").value.trim(),
    lat:             ubi.lat,
    lng:             ubi.lng,
    ubicacionNombre: ubi.nombre,
    logo:            logoBase64
  };

  listaActual.push(nuevoTaller);
  guardarTalleres(listaActual);

  // Sincronizar el array global con el nuevo estado
  talleres = listaActual;

  // Refrescar mapa y sidebar
  renderMarcadores();
  poblarRubros();
  filtrarTalleres();

  // Mostrar pantalla de éxito
  document.getElementById("registro-container").style.display = "none";
  document.getElementById("registro-exito").style.display     = "block";
}

// ── Reinicio del formulario ───────────────────────────────

/**
 * Limpia todos los campos y vuelve al paso 1, listo para un nuevo registro.
 */
function reiniciarFormulario() {
  const ids = [
    "campo-nombre-colab", "campo-telefono", "campo-mail-colab",
    "campo-nombre-taller", "campo-descripcion", "campo-actividad",
    "campo-rubro", "campo-contacto"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ""; el.classList.remove("error"); }
  });

  logoBase64       = null;
  datosColaborador = {};
  pasoActual       = 1;

  const preview = document.getElementById("logo-preview");
  preview.src          = "";
  preview.style.display = "none";

  document.getElementById("logo-filename").textContent = "Seleccionar imagen";
  document.getElementById("registro-exito").style.display     = "none";
  document.getElementById("registro-container").style.display = "block";

  irPaso(1);
}
