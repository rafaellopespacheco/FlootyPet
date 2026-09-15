const express = require("express");
const router = express.Router();
const authApi = require("../middlewares/authApi");


router.get("/api/atualizacoes", authApi, async (req, res) => {
  try {
    const resposta = await fetch(
      "https://api.github.com/repos/rafaellopespacheco/FlootyPet/releases"
    );

    if (!resposta.ok) {
      throw new Error("Erro ao buscar releases do GitHub.");
    }

    const releases = await resposta.json();

    const atualizacoes = releases.map((release) => ({
      id: release.id,
      versao: release.tag_name,
      titulo: release.name,
      descricao: release.body,
      data: release.published_at,
      link: release.html_url
    }));

    res.json(atualizacoes);
  } catch (error) {
    console.error("Erro ao buscar atualizações:", error);
    res.status(500).json({
      erro: "Não foi possível carregar as atualizações."
    });
  }
});


module.exports = router;