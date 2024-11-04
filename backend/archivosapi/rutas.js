const express = require('express');
const apiTexto = require('./AudioTexto');  
const openai = require('./ApiOpenai');     
const cie10 = require('./OpenAiCie10');    
const informepaciente = require('./OpenAiPaciente'); 
const informedoctor = require('./OpenAiDoctor');  
const EMR = require('./EMR'); 
const router = express.Router();

// Definir todas las rutas y routers
router.use('/texto', apiTexto);
router.use('/openai', openai);
router.use('/cie', cie10);
router.use('/paciente', informepaciente);
router.use('/doctor', informedoctor);
router.use('/EMR', EMR);

module.exports = router;
