const express = require("express");
const { OpenAI } = require("openai");
const router = express.Router();

const openai = new OpenAI({
    apiKey: 'sk-vfEKCXmx8bw_0dg_UVNu63Ic8hxJg2k3Z1Cs8d5HiOT3BlbkFJyweY0jl7CZLI3wgWiNlqNf_pD3V35hdveziEsKTjUA',
});

router.post("/informedoctor", async (req, res) => {

    const prompt = `A continuación, se te proporcionará un diálogo entre un paciente, un doctor y/o un acompañante. 
    Tu tarea es generar un informe médico dirigido exclusivamente al médico. El informe debe estar compuesto por
    un solo párrafo que incluya los síntomas, diagnóstico y tratamiento del paciente.
    Los síntomas deben extraerse del diálogo del paciente y/o acompañante, resumidos en términos médicos y evitando 
    cualquier detalle subjetivo. El diagnóstico y el tratamiento deben tomarse únicamente de los diálogos del médico, 
    utilizando terminología técnica y sin explicaciones largas o detalles adicionales. Evita descripciones innecesarias 
    sobre los procedimientos. No es necesario detallar los tratamientos o diagnósticos, ya que el médico está familiarizado 
    con cada uno.${req.body.text}`;



    const fecha = new Date();

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: prompt },
            ],
            max_tokens: 1000,
            temperature: 0,
        });

        const InformeDoctor =response.choices[0].message.content;
        

        res.json(InformeDoctor);
    } catch (error) {
        console.log("Error generando el informe:", error.message);
        res.status(500).json({ error: 'Error generando el informe' });
    }
});

module.exports = router;
