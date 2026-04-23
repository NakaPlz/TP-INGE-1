// =========================================================
//  filtros.js — Lista lateral de talleres y filtros de búsqueda
//  Depende de: storage.js (talleres), mapa.js (enfocarTallerEnMapa)
// =========================================================

// ── Render de la lista ────────────────────────────────────

/**
 * Renderiza las cards de talleres en el sidebar.
 * @param {Array} lista - Array de talleres a mostrar.
 */
function renderLista(lista) {
  const contenedor = document.getElementById("lista-talleres");
  const count      = document.getElementById("sidebar-count");

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
    card.setAttribute("role", "listitem");
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

// ── Selección de un taller ────────────────────────────────────────

/**
 * Resalta la card en el sidebar y hace scroll hasta ella.
 * Puede llamarse desde el mapa sin producir un loop.
 * @param {number} tallerId - ID del taller a resaltar.
 */
function resaltarEnLista(tallerId) {
  document.querySelectorAll(".taller-card").forEach(c => c.classList.remove("selected"));

  const card = document.querySelector(`.taller-card[data-id="${tallerId}"]`);
  if (card) {
    card.classList.add("selected");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/**
 * Resalta la card y hace zoom al marcador en el mapa.
 * Llamado cuando el usuario clickea una card de la lista.
 * @param {object} taller - Objeto taller seleccionado.
 */
function seleccionarTaller(taller) {
  resaltarEnLista(taller.id);
  enfocarTallerEnMapa(taller);
}

// ── Filtrado en tiempo real ────────────────────────────────

/**
 * Lee los valores de los inputs de filtro y actualiza la lista.
 * Llamado tanto al escribir en el campo de texto como al cambiar el select.
 */
function filtrarTalleres() {
  const texto = document.getElementById("filtro-texto").value.toLowerCase().trim();
  const rubro = document.getElementById("filtro-rubro").value;

  const resultado = talleres.filter(t => {
    const coincideTexto = !texto ||
      t.nombre.toLowerCase().includes(texto)    ||
      t.actividad.toLowerCase().includes(texto) ||
      t.descripcion.toLowerCase().includes(texto);

    const coincideRubro = !rubro || t.rubro === rubro;

    return coincideTexto && coincideRubro;
  });

  renderLista(resultado);
}

// ── Selector de rubros ────────────────────────────────────

/**
 * Puebla el <select> de rubros con los valores únicos presentes en `talleres`.
 * Conserva la opción "Todos los rubros" al inicio.
 */
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
