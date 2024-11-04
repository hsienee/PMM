const express = require('express');
const axios = require('axios');
const multer = require('multer');
const router = express.Router();

const apiKeyAssemblyAI = '51958c86c9a54af6a4ba1741001ae26c';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const audioTexto = async (id) => {
  const URL = `https://api.assemblyai.com/v2/transcript/${id}`;
  const headers = {
    authorization: apiKeyAssemblyAI,
    'Content-Type': 'application/json',
  };

  while (true) {
    const response = await axios.get(URL, { headers });
    const file = response.data;

    console.log("Estado actual de la transcripción:", file.status);

    if (file.status === 'completed') {
      return file;
    } else if (file.status === 'failed') {
      throw new Error('Error durante la transcripción');
    } else if (file.status === 'error') {
      throw new Error('Transcripción con error');
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); 
  }
};

let pacientes = {};
router.post('/InyeccionDatos', async (req, res) => {
  try {
    const { nombre, apellido, rut } = req.body;
    const idPaciente = `${rut}`;
    pacientes[idPaciente] = { nombre, apellido, rut };
  
    res.status(201).json({ message: 'Datos del paciente recibidos correctamente', idPaciente });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar los datos del paciente' });
  }
});

router.post('/transcripcion', upload.single('audio'), async (req, res) => {
  const { idPaciente } = req.body;

  if (!req.file || !idPaciente) {
    return res.status(400).json({ error: 'falta datos para generar los informes' });
  }
  const paciente = pacientes[idPaciente];
  if (!paciente) {
    return res.status(404).json({ error: 'No se encontraron los datos del paciente' });
  }

  const { buffer, mimetype } = req.file;

  try {
    const respuesta = await axios.post('https://api.assemblyai.com/v2/upload', buffer, {
      headers: {
        authorization: apiKeyAssemblyAI,
        'Content-Type': mimetype,
      }
    });
    const audioURL = respuesta.data.upload_url;
    const datosArchivo = {
      audio_url: audioURL,
      language_code: 'es',
      speaker_labels: true,
    };

    const transcripcion = await axios.post('https://api.assemblyai.com/v2/transcript', datosArchivo, {
      headers: {
        authorization: apiKeyAssemblyAI,
        'Content-Type': 'application/json',
      }
    });
    const estadoTranscripcion = transcripcion.data;
    const textoGenerado = await audioTexto(estadoTranscripcion.id);

    const textoCombinado = textoGenerado.utterances.map(utterance => {
      return `${utterance.speaker}: ${utterance.text}`;
    }).join("\n");
    console.log(textoCombinado)
    const openaiResponse = await axios.post('http://localhost:3000/api/openai/completions', {
        text: textoCombinado
    });

    const roles = openaiResponse.data;
    const textoDialogoConIdentificacion = textoGenerado.utterances.map(utterance => {
        let speaker = roles[utterance.speaker] || utterance.speaker;  
        return `${speaker}: ${utterance.text}`;
    }).join("\n");

    console.log(textoDialogoConIdentificacion)
    const openaicie10 = await axios.post('http://localhost:3000/api/cie/generarcie10', {
        text: textoDialogoConIdentificacion
    });

    const informepaciente = await axios.post('http://localhost:3000/api/paciente/generarinformepaciente', {
        text: textoDialogoConIdentificacion
    });

    const informemedico = await axios.post('http://localhost:3000/api/doctor/informedoctor', {
        text: textoDialogoConIdentificacion
    });



    const fecha = new Date();
    const DatosFinales = {
        ...paciente, 
        informePaciente: informepaciente.data,
        informeMedico: informemedico.data,
        codigoCIE10: openaicie10.data,
        fecha
    };
    
    
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",DatosFinales); 

    try {
      const response = await axios.post('http://localhost:3000/api/EMR/InyeccionDatos', DatosFinales, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      res.status(200).json({ message: 'Datos enviados al sistema de inyección',response : DatosFinales });

    } catch (error) {
      res.status(500).json({ message: 'Error al enviar los datos al segundo backend', error: error.message });
    }

  } catch (error) {
    res.status(500).send('Error en la transcripción o análisis del texto');
  }
});

module.exports = router;
