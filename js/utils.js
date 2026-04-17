// =========================================================
//  utils.js — Funciones auxiliares reutilizables
//  Sin dependencias externas.
// =========================================================

// ── Toast de notificaciones ───────────────────────────────

let _toastTimer = null;

/**
 * Muestra una notificación flotante temporal.
 * @param {string} msg   - Texto del mensaje.
 * @param {string} tipo  - "success" | "info"
 */
function mostrarToast(msg, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.querySelector(".toast-icon").textContent = tipo === "success" ? "✅" : "ℹ️";
  toast.querySelector(".toast-msg").textContent = msg;
  toast.className = `${tipo} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ── Validación de formularios ─────────────────────────────

/**
 * Marca un input como inválido y muestra un mensaje de error debajo.
 * @param {string} inputId - ID del elemento input.
 * @param {string} msg     - Mensaje de error a mostrar.
 */
function marcarError(inputId, msg) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add("error");
  mostrarErrorCampo(input, msg);
}

/**
 * Inserta un mensaje de error debajo del input dado.
 * Elimina primero cualquier error previo.
 */
function mostrarErrorCampo(input, msg) {
  borrarErrorCampo(input);
  const span = document.createElement("div");
  span.className = "field-error";
  span.textContent = msg;
  input.parentElement.appendChild(span);
}

/**
 * Elimina el mensaje de error asociado a un input.
 */
function borrarErrorCampo(input) {
  const err = input.parentElement.querySelector(".field-error");
  if (err) err.remove();
}
