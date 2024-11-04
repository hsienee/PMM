const express =require('express');
const OpenAI= require('openai');
const router = express.Router();

const openai=new OpenAI({
    apiKey : 'sk-vfEKCXmx8bw_0dg_UVNu63Ic8hxJg2k3Z1Cs8d5HiOT3BlbkFJyweY0jl7CZLI3wgWiNlqNf_pD3V35hdveziEsKTjUA',  
});
router.post('/generarcie10', async (req, res) => {
    const prompt = `Tu tarea es identificar los códigos CIE-10 correspondientes a las enfermedades 
                    mencionadas en el diálogo. Ten en cuenta que, en muchos casos, los diálogos no 
                    mencionan de forma exacta los nombres o códigos CIE-10, por lo que deberás identificar 
                    términos o descripciones similares que correspondan a los códigos CIE-10.
                    Devuélveme únicamente los códigos CIE-10 en el siguiente formato, sin explicaciones 
                    ni texto adicional:
                    {
                        "Código CIE-10": "Nombre de la enfermedad"
                    }

                    Aquí está el diálogo:
                    ${req.body.text}
                    `;
                    ;

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
            res.json(response.choices[0].message.content );
        } else {
            console.error("Formato de respuesta inesperado", response);
            res.status(500).json({ error: 'Formato de respuesta inesperado de OpenAI' });
        }

    } catch (error) {
        console.error('Error generando CIE-10:', error.message);
        res.status(500).json({ error: 'Error generando CIE-10' });
    }
});


module.exports = router;

