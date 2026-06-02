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
        `INSERT INTO changelogs (
            titulo,
            versao,
            resumo,
            descricao,
            data
        ) VALUES ( ?, ?, ?, ?, datetime('now', '-3 hours'))`,
        [
            req.body.titulo,
            req.body.versao,
            req.body.resumo,
            JSON.stringify(req.body.descricao)
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

router.post("/api/ultimaversao", authApi, (req, res) => {
    db.get(
        `
        SELECT versao
        FROM changelogs
        ORDER BY id DESC
        LIMIT 1
    `,
        (err, row) => {
            if (err) return res.status(500).json({ erro: "Erro ao buscar a última versão" });
            let novaVersao;
            const versaoAtual = row?.versao || "0.0.0";

            const [major, minor, patch] = versaoAtual.split(".").map(Number);
            
            if (req.body.tipo === "grande") {
                novaVersao = `${major + 1}.0.0`
            } else if (req.body.tipo === "novafeat") {
                novaVersao = `${major}.${minor + 1}.0`
            } else if (req.body.tipo === "correcao") {
                novaVersao = `${major}.${minor}.${patch + 1}`
            } else {
                return res.status(400).json({
                    erro: "Tipo de atualização inválida"
                })
            }

            res.json({
                versao: novaVersao
            });
        },
    );
});

module.exports = router;