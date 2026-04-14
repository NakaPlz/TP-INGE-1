import { map } from './instanciar_mapa.js';
import { capaMarcadores } from './filtrar_cursos.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const tilesClaro = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    const tilesOscuro = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
    });

    const tilesTactico = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap'
    });

    tilesClaro.addTo(map);

    const container = document.getElementById('tamanio_de_mapa');

    document.getElementById('btn_claro').addEventListener('click', () => {
        
        map.eachLayer(layer => {
            if (layer !== capaMarcadores) map.removeLayer(layer);
        });
        container.classList.remove('tactico');
        tilesClaro.addTo(map);
    });

    document.getElementById('btn_oscuro').addEventListener('click', () => {
        map.eachLayer(layer => {
            if (layer !== capaMarcadores) map.removeLayer(layer);
        });
        container.classList.remove('tactico');
        tilesOscuro.addTo(map);
    });

    map.on('mousemove', function(e) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        document.getElementById("coords").innerHTML = `Lat: ${lat}, Lng: ${lng}`;
    });

});