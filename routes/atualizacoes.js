const express = require("express");
const router = express.Router();
const db = require('../database/db');
const authApi = require("../middlewares/authApi");

router.get("/api/atualizacoes", authApi, (req, res) => {
    db.all(`SELECT * FROM changelogs
        ORDER BY id DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: `Erro ao procurar os changelogs`,
            });
        }

        res.json(rows);
    });
});

router.post("/api/atualizacoes", authApi, (req, res) => {
    db.run(
        `INSERT INTO changelogs ( titulo, versao, resumo, descricao, data )
            VALUES ( ?, ?, ?, ?, ?)`,
        [
            req.body.titulo,
            req.body.versao,
            req.body.resumo,
            JSON.stringify(req.body.descricao),
            req.body.data,
        ],
        (err) => {
            if (err) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar uma changelog",
                });
            }

            res.json({
                mensagem: "Changelog cadastrada com sucesso!",
            });
        },
    );
});

module.exports = router;