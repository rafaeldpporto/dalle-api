const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/gerar-imagem", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await response.json();
    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: "URL de imagem não encontrada", details: data });
    }

    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.buffer();
    const base64Image = buffer.toString("base64");
    const mimeType = imageResponse.headers.get("content-type");

    res.json({ base64: `data:${mimeType};base64,${base64Image}` });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar ou converter imagem", details: error.message });
  }
});

app.get("/", (_, res) => res.send("API DALL·E com base64 rodando."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
