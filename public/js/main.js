async function loadWorkshops() {
    const list = document.getElementById('workshop-list');
    if (!list) return;

    try {
        const res = await fetch('/api/workshops');
        const workshops = await res.json();
        list.innerHTML = '';

        workshops.forEach(ws => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${ws.title}</h3>
                <p>${ws.description}</p>
                <div class="meta">
                    <span>📅 ${ws.date}</span>
                    <span>📍 ${ws.location}</span>
                </div>
                <button class="btn btn-primary" onclick="openEnrollModal('${ws.id}', '${ws.title}')" style="width: 100%;">Inscribirme</button>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        console.error('Error cargando talleres:', err);
    }
}

function openEnrollModal(id, title) {
    document.getElementById('enroll-workshop-id').value = id;
    document.getElementById('modal-title').innerText = `Inscribirse a: ${title}`;
    document.getElementById('enroll-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('enroll-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('enroll-modal');
    if (event.target == modal) {
        closeModal();
    }
}
