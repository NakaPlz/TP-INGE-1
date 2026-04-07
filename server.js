const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper to read data
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [], workshops: [], enrollments: [] };
    }
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: Get all workshops
app.get('/api/workshops', (req, res) => {
    const data = readData();
    res.json(data.workshops);
});

// API: Create a workshop
app.post('/api/workshops', (req, res) => {
    const { title, description, date, location } = req.body;
    const data = readData();
    const newWorkshop = {
        id: Date.now(),
        title,
        description,
        date,
        location
    };
    data.workshops.push(newWorkshop);
    writeData(data);
    res.status(201).json(newWorkshop);
});

// API: Enroll in a workshop
app.post('/api/enroll', (req, res) => {
    const { workshopId, studentName, studentEmail } = req.body;
    const data = readData();
    const workshop = data.workshops.find(w => w.id == workshopId);
    if (!workshop) return res.status(404).send('Taller no encontrado');

    const enrollment = {
        id: Date.now(),
        workshopId,
        studentName,
        studentEmail
    };
    data.enrollments.push(enrollment);
    writeData(data);
    res.status(201).json(enrollment);
});

// API: Login for creators
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const data = readData();
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Logged in' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
