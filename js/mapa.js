// =========================================================
//  mapa.js — Inicialización y control del mapa Leaflet
//  Depende de: storage.js (talleres), inscripcion.js (abrirModalInscripcion)
//  Nota: abrirModalInscripcion se referencia en tiempo de ejecución,
//        no en tiempo de carga, por lo que el orden de script no importa.
// =========================================================

// Estado privado del módulo
let mapaInstance  = null;
let marcadores    = {}; // { [id]: L.Marker }
let tileLayers    = {};
let tipoMapa      = "claro";

// ── Inicialización ────────────────────────────────────────

/**
 * Crea la instancia del mapa y agrega el tile layer inicial.
 * Solo debe llamarse una vez, cuando la vista del mapa es visible.
 */
function initMapa() {
  mapaInstance = L.map("mapa").setView([-34.5220, -58.7010], 14);

  tileLayers = {
    // CartoDB no requiere Referer header → funciona con archivos locales (file://)
    // OpenStreetMap bloqueaba las tiles porque el navegador no envía Referer desde file://
    claro: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "© CartoDB | © OpenStreetMap contributors"
    }),
    oscuro: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© CartoDB | © OpenStreetMap contributors"
    })
  };

  tileLayers.claro.addTo(mapaInstance);
  tipoMapa = "claro";
  document.getElementById("btn-claro").classList.add("active");

  // Mostrar coordenadas en tiempo real mientras el mouse se mueve
  mapaInstance.on("mousemove", (e) => {
    document.getElementById("coords-display").textContent =
      `Lat: ${e.latlng.lat.toFixed(5)}  Lng: ${e.latlng.lng.toFixed(5)}`;
  });

  renderMarcadores();
}

// ── Marcadores ────────────────────────────────────────────

/**
 * Elimina todos los marcadores del mapa y los vuelve a dibujar
 * en base al array global `talleres`.
 */
function renderMarcadores() {
  if (!mapaInstance) return;

  // Limpiar marcadores previos
  Object.values(marcadores).forEach(m => mapaInstance.removeLayer(m));
  marcadores = {};

  talleres.forEach(t => {
    const marker = L.marker([t.lat, t.lng]);

    const logoHtml = t.logo
      ? `<img class="popup-logo" src="${t.logo}" alt="Logo de ${t.nombre}">`
      : "";

    marker.bindPopup(`
      <div class="leaflet-popup-content">
        ${logoHtml}
        <div class="popup-content">
          <div class="popup-nombre">${t.nombre}</div>
          <div class="popup-actividad">🎨 ${t.actividad}</div>
          <div class="popup-descripcion">${t.descripcion}</div>
          <div class="popup-contacto">
            📍 ${t.ubicacionNombre}<br>
            <span>${t.contacto}</span>
          </div>
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

// ── Control de estilo del mapa ────────────────────────────

/**
 * Cambia el tile layer entre modo claro y oscuro.
 * @param {string} tipo - "claro" | "oscuro"
 */
function cambiarMapa(tipo) {
  if (!mapaInstance || tipoMapa === tipo) return;

  mapaInstance.removeLayer(tileLayers[tipoMapa]);
  tileLayers[tipo].addTo(mapaInstance);
  tipoMapa = tipo;

  document.getElementById("btn-claro").classList.toggle("active", tipo === "claro");
  document.getElementById("btn-oscuro").classList.toggle("active", tipo === "oscuro");
}

/**
 * Hace zoom hacia un taller específico y abre su popup.
 * @param {object} taller - Objeto taller con lat/lng e id.
 */
function enfocarTallerEnMapa(taller) {
  if (!mapaInstance || !marcadores[taller.id]) return;
  mapaInstance.setView([taller.lat, taller.lng], 16, { animate: true });
  marcadores[taller.id].openPopup();
}
