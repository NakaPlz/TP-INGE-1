// =========================================================
//  main.js — Punto de entrada de la aplicación
//  Conecta todos los módulos y configura los event listeners.
//  Depende de: TODOS los módulos anteriores.
//
//  Orden de carga de scripts en index.html:
//    datos.js → storage.js → utils.js → mapa.js
//    → filtros.js → inscripcion.js → registro.js → main.js
// =========================================================

// ── Navegación SPA ────────────────────────────────────────

/**
 * Muestra la sección indicada y oculta las demás.
 * Inicializa el mapa la primera vez que se navega a la vista de exploración.
 * @param {string} vistaId - ID de la sección a mostrar.
 */
function mostrarVista(vistaId) {
  const mapaBotonId = {
    "vista-explorar": "btn-explorar",
    "vista-registro":  "btn-registro"
  };

  document.querySelectorAll(".vista").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(vistaId).classList.add("active");

  const btnId = mapaBotonId[vistaId];
  if (btnId) document.getElementById(btnId).classList.add("active");

  // Inicializar el mapa la primera vez / corregir tamaño si ya existe
  if (vistaId === "vista-explorar") {
    if (!mapaInstance) {
      initMapa();
    } else {
      mapaInstance.invalidateSize();
    }
  }
}

// ── Bootstrap ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // Cargar estado inicial desde localStorage
  talleres = cargarTalleres();

  // Navegación entre vistas
  document.getElementById("btn-explorar").addEventListener("click", () => mostrarVista("vista-explorar"));
  document.getElementById("btn-registro").addEventListener("click",  () => mostrarVista("vista-registro"));

  // Filtros de búsqueda
  document.getElementById("filtro-texto").addEventListener("input",  filtrarTalleres);
  document.getElementById("filtro-rubro").addEventListener("change", filtrarTalleres);

  // Controles de estilo del mapa
  document.getElementById("btn-claro").addEventListener("click",  () => cambiarMapa("claro"));
  document.getElementById("btn-oscuro").addEventListener("click", () => cambiarMapa("oscuro"));

  // Modal de inscripción
  document.getElementById("modal-close").addEventListener("click", cerrarModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-overlay")) cerrarModal();
  });
  document.getElementById("btn-confirmar-inscripcion").addEventListener("click", confirmarInscripcion);

  // Wizard de registro — paso 1 → 2
  document.getElementById("btn-siguiente-1").addEventListener("click", () => irPaso(2));
  document.getElementById("btn-volver-2").addEventListener("click",    () => irPaso(1));
  document.getElementById("btn-guardar").addEventListener("click", guardarTaller);

  // Pantalla de éxito del registro
  document.getElementById("btn-nuevo-taller").addEventListener("click", reiniciarFormulario);
  document.getElementById("btn-ir-explorar").addEventListener("click", () => {
    reiniciarFormulario();
    mostrarVista("vista-explorar");
  });

  // Inicializar formulario de registro (poblar ubicaciones, preview logo)
  initFormulario();

  // Inicializar sidebar
  poblarRubros();
  renderLista(talleres);

  // Vista inicial
  mostrarVista("vista-explorar");
});
