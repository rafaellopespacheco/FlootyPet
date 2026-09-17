const express = require("express");
const authApi = require("../middlewares/authApi");
const router = express.Router();

router.get("/api/me", authApi, (req, res) => {
    res.json({
        nome: req.session.nome,
        email: req.session.email,
    });
});

router.put("/api/me", authApi, (req, res) => {
    const nome = String(req.body.nome || "").trim();
    if (!nome) {
        return res.status(400).json({ erro: "O nome é obrigatório." });
    }

    const db = require("../database/db");
    db.run(
        "UPDATE users SET name = ? WHERE id = ?",
        [nome, req.session.userId],
        function (err) {
            if (err)
                return res
                    .status(500)
                    .json({ erro: "Não foi possível atualizar o perfil." });
            if (!this.changes)
                return res
                    .status(404)
                    .json({ erro: "Usuário não encontrado." });
            req.session.nome = nome;
            req.session.save((sessionError) => {
                if (sessionError)
                    return res
                        .status(500)
                        .json({ erro: "Não foi possível atualizar a sessão." });
                res.json({
                    nome,
                    email: req.session.email,
                    mensagem: "Perfil atualizado com sucesso.",
                });
            });
        },
    );
});

module.exports = router;
