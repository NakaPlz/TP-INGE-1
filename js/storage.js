// =========================================================
//  storage.js — Estado global y operaciones localStorage
//  Depende de: datos.js (TALLERES_INICIALES)
// =========================================================

const LS_TALLERES      = "talleres_v1";
const LS_INSCRIPCIONES = "inscripciones_v1";

// Estado compartido por todos los módulos
let talleres = [];

function cargarTalleres() {
  const raw = localStorage.getItem(LS_TALLERES);
  if (!raw) {
    // Primera vez: cargar datos de prueba
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

// Genera un ID autoincremental a partir de cualquier lista
function nextId(lista) {
  return lista.length > 0 ? Math.max(...lista.map(item => item.id)) + 1 : 1;
}
