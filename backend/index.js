const express = require('express');
const cors = require('cors');
const path = require('path');
const rutas = require('./archivosapi/rutas'); 

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/Archivosdeaudio', express.static(path.join(__dirname, 'Archivosdeaudio')));

app.use('/api', rutas);
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
