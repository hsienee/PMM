const express = require('express');
const axios = require('axios');
const router = express.Router();

const emrUrl = 'https://falp-communicator-stage-6a792ae7d738.herokuapp.com/ia/emr'; 
const emrAuthToken = 'Bearer jf8d73g8s7d8g7d8';

router.post('/InyeccionDatos', async (req, res) => {
  const DatosFinales = req.body; 
  try {
    const Response = await axios.post(`https://falp-communicator-stage-6a792ae7d738.herokuapp.com/ia/emr`, DatosFinales, {
      headers: {
        'Authorization': emrAuthToken, 
        'Content-Type': 'application/json'
      }
    });
    if (Response.status==200){
      console.log("Datos inyectados correctamente en el EMR:", Response.data);
      res.status(200).json({ message: "Datos inyectados correctamente en el EMR", data: Response.data });
    }
    else {
      console.log("error inyeccion datos pacientes")
      res.status(500).json({ error: "Error al inyectar los datos en el EMR" });
    }
    
    

    
  } catch (error) {
    console.error("Error al inyectar los datos en el EMR:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al inyectar los datos en el EMR" });
  }
});

module.exports = router;
