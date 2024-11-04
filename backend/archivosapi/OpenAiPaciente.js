const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
    apiKey: 'sk-vfEKCXmx8bw_0dg_UVNu63Ic8hxJg2k3Z1Cs8d5HiOT3BlbkFJyweY0jl7CZLI3wgWiNlqNf_pD3V35hdveziEsKTjUA',
});

router.post('/generarinformepaciente', async (req, res) => {
    const prompt = `Genera un informe médico basado en la conversación entre el paciente, el médico y el acompañante.
    El informe debe estar destinado al paciente, por lo que debe ser claro y comprensible.
    Sigue esta estructura:
    Síntomas: Describe los síntomas mencionados en la conversación de manera sencilla.
    Diagnóstico: Indica el diagnóstico con los términos médicos adecuados, pero asegúrate de explicar cualquier término técnico entre paréntesis. Por ejemplo, si mencionas “quimioterapia”, aclara entre paréntesis que es un tratamiento con medicamentos para destruir células cancerosas.
    Tratamiento: Explica claramente los tratamientos indicados. Cada tratamiento debe incluir su nombre y una breve explicación entre paréntesis si es un término técnico o no es fácil de entender.
    Información adicional: Solo incluye información adicional si es relevante y no repite lo ya mencionado. Si el paciente o el acompañante hicieron preguntas importantes, puedes incluir las respuestas aquí. Si no hay información importante adicional, omite esta sección.
    Evita repetir información ya mencionada en los síntomas, diagnóstico o tratamiento en la sección de información adicional.
    Usa un lenguaje accesible y evita tecnicismos innecesarios que puedan dificultar la comprensión del informe.
    Siempre explica los términos técnicos para que el paciente los entienda (por ejemplo, si mencionas una resonancia magnética, añade que es una prueba que usa imanes y ondas de radio para ver dentro del cuerpo).
    El informe debe comenzar con "Síntomas:" y seguir de forma clara y ordenada.
    ${req.body.text}`
    ;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: prompt },
            ],
            max_tokens: 2048,
            temperature: 0,
        });

        const informeGenerado = response.choices[0].message.content.trim();
        res.json(informeGenerado);
       

    } catch (error) {
        console.error("Error generando el informe:", error.message);
        res.status(500).json({ error: 'Error generando el informe' });
    }
});

module.exports = router;
