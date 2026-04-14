import { map } from './instanciar_mapa.js';

const tabla = document.getElementById("tabla_de_informacion");
const inputFiltroPorNombre = document.getElementById("filtroNombre");
export const capaMarcadores = L.layerGroup().addTo(map);


let cursos = [];

//cargar datos_falsos.json
fetch('datos_falsos.json')
    .then(res => res.json())
    .then(data => {
        cursos = data;
        renderCursos(cursos);
    })
    .catch(err => console.error("Error cargando cursos:", err));

//render de los cursos
function renderCursos(lista) {
    tabla.innerHTML = "";
    lista.forEach(item => {
        const div = document.createElement("div");
        div.className = "letraBlanca fondoGrisOscuro vertical margen2 padding2 radius fondoBlancoHover letraNegraHover";
        div.innerHTML = `
            <b>${item.nombre}</b><br>
            <span>${item.descripcion}</span><br>
            <span>${item.direccion}</span>
        `;
        tabla.appendChild(div);

        div.addEventListener('click', () => {
            capaMarcadores.clearLayers();
            L.marker([item.lat, item.lng])
                .addTo(capaMarcadores)
                .bindPopup(`<b>${item.nombre}</b><br>${item.descripcion}`)
                .openPopup();
            map.setView([item.lat, item.lng], 16);
        });
    });
}


inputFiltroPorNombre.addEventListener('input', () => {
    const termino = inputFiltroPorNombre.value.toLowerCase();
    const filtrados = cursos.filter(curso => curso.nombre.toLowerCase().includes(termino));
    renderCursos(filtrados);
});