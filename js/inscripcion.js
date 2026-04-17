// =========================================================
//  inscripcion.js — Modal de inscripción de visitantes
//  Depende de: storage.js (talleres, cargarInscripciones, guardarInscripciones, nextId)
//              utils.js (marcarError, mostrarToast)
// =========================================================

// Taller seleccionado mientras el modal está abierto
let tallerEnModal = null;

// ── Apertura del modal ────────────────────────────────────

/**
 * Abre el modal de inscripción para el taller indicado.
 * Esta función es llamada desde el HTML generado en los popups del mapa,
 * por lo que debe estar disponible en el scope global.
 *
 * @param {number} tallerId - ID del taller al que el usuario desea inscribirse.
 */
function abrirModalInscripcion(tallerId) {
  tallerEnModal = talleres.find(t => t.id === tallerId);
  if (!tallerEnModal) return;

  // Cargar datos del taller en el modal
  document.getElementById("modal-title").textContent    = `Inscribirse a: ${tallerEnModal.nombre}`;
  document.getElementById("modal-subtitle").textContent = `${tallerEnModal.actividad} · ${tallerEnModal.ubicacionNombre}`;

  // Limpiar campos y errores previos
  document.getElementById("modal-nombre-visitante").value = "";
  document.getElementById("modal-mail-visitante").value   = "";
  _limpiarErroresModal();

  document.getElementById("modal-overlay").classList.add("open");
}

// ── Cierre del modal ──────────────────────────────────────

/**
 * Cierra el modal y limpia el taller en memoria.
 */
function cerrarModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  tallerEnModal = null;
}

// ── Confirmación de inscripción ───────────────────────────

/**
 * Valida los datos del formulario del modal y guarda la inscripción
 * en localStorage si son correctos.
 */
function confirmarInscripcion() {
  const nombre = document.getElementById("modal-nombre-visitante").value.trim();
  const mail   = document.getElementById("modal-mail-visitante").value.trim();

  _limpiarErroresModal();

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
    id:           nextId(inscripciones),
    tallerId:     tallerEnModal.id,
    tallerNombre: tallerEnModal.nombre,
    nombre,
    mail,
    fecha: new Date().toISOString()
  });
  guardarInscripciones(inscripciones);

  cerrarModal();
  mostrarToast(`✅ ¡Te inscribiste en "${tallerEnModal.nombre}"!`, "success");
}

// ── Helpers privados ──────────────────────────────────────

function _limpiarErroresModal() {
  document.querySelectorAll("#modal-box .campo-form input").forEach(i => {
    i.classList.remove("error");
    borrarErrorCampo(i);
  });
}
