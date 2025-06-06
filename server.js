const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/gerar-imagem", async (req, res) => {
  // Prompt fixo para teste
  const prompt = "Crie uma arte de adesivo redondo com fundo amarelo e tema de floricultura com flores delicadas e logo fictício.";

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
    console.log("🧠 RESPOSTA DA OPENAI:", data);

    if (data.data && data.data[0]?.url) {
      res.json({ url: data.data[0].url });
    } else {
      res.status(500).json({ error: "Erro ao gerar imagem", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro na requisição", details: error.message });
  }
});

app.get("/", (_, res) => res.send("API DALL·E está rodando."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
