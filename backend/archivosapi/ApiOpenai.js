const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: 'sk-vfEKCXmx8bw_0dg_UVNu63Ic8hxJg2k3Z1Cs8d5HiOT3BlbkFJyweY0jl7CZLI3wgWiNlqNf_pD3V35hdveziEsKTjUA',  

});


router.post('/completions', async (req, res) => {
  const prompt = `
  A continuación, tienes un diálogo entre varias personas identificadas con etiquetas como "A", "B", etc. Tu tarea es devolver un diccionario JSON donde las claves sean estas etiquetas de hablantes y los valores representen sus roles, identificados como "Paciente", "Doctor" o "Acompañante".
  Para determinar el rol de cada hablante, ten en cuenta los siguientes criterios:

  1. Un hablante que utiliza con frecuencia la primera persona (por ejemplo, "yo", "me", "mi") probablemente sea el Paciente.
  2. Un hablante que se expresa de manera más formal y en tercera persona (por ejemplo, "el paciente", "el tratamiento") es probablemente el Doctor.
  3. Es importante que analices cuidadosamente el diálogo para asignar correctamente los roles de Paciente, Doctor y Acompañante a cada hablante, analice de forma correcta 
  4. Ademas debes tener en cuenta que solo existe un paciente en la conversacion , el paciente puede llevar uno o dos cliente pero solo existe un paciente 
  Ejemplo:
  {
    "A": "Doctor",
    "B": "Paciente"
  }

  Aquí te dejo el diagolo generado el diálogo:

  ${req.body.text}

  Devuelve el diccionario JSON con los roles de los hablantes.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', 
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0,
    });

    if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
      const textResponse = response.choices[0].message.content.trim();

      let roles;
      try {
        roles = JSON.parse(textResponse);
        res.json(roles);
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError.message);
        return res.status(500).json({ error: 'Error al parsear JSON de OpenAI' });
      }
    } else {
      console.error("Formato de respuesta inesperado", response);
      res.status(500).json({ error: 'Formato de respuesta inesperado de OpenAI' });
    }
  } catch (error) {
    console.error('Error al enviar la solicitud a OpenAI:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
