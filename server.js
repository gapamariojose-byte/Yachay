const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

console.log(
    process.env.GITHUB_TOKEN
        ? "✅ Token cargado"
        : "❌ No se encontró el token"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.send("🧠 Yachay Backend funcionando correctamente.");

});

// Ruta del chat
app.post("/chat", async (req, res) => {

    try {

        const pregunta = req.body.message;

        console.log("Pregunta:", pregunta);

        const client = ModelClient(

            "https://models.github.ai/inference",

            new AzureKeyCredential(process.env.GITHUB_TOKEN)

        );

        const response = await client.path("/chat/completions").post({

            body: {

                model: "openai/gpt-4.1-nano",

                messages: [

                   {
        role: "system",
        content: `
Eres Yachay, un guía virtual especializado en los saberes ancestrales de Tungurahua.

Responde siempre en español.

Sé amable, claro y didáctico.

Si no sabes una respuesta, dilo honestamente.

No menciones que eres ChatGPT ni OpenAI.
`
    },

    {
        role: "user",
        content: pregunta
    }


                ],

                temperature: 1,

                top_p: 1

            }

        });

        if (isUnexpected(response)) {

            throw response.body.error;

        }

        res.json({

            answer: response.body.choices[0].message.content

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            answer: error.message

        });

    }

});


const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Servidor iniciado en http://localhost:${PORT}`);

});