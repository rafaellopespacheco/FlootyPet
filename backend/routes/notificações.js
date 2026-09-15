const express = require("express");
const router = express.Router();
const db = require('../database/db');
const authApi = require("../middlewares/authApi");

// 1. Buscando todas as notificações
router.get("/api/notificacoes", authApi, (req, res) => {
    db.all(`SELECT * FROM notificacoes ORDER BY id DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: "Erro ao procurar as notificações",
            });
        }

        res.json(rows);
    });
});

// 2. Criar uma nova notificação
router.post("/api/notificacoes", authApi, (req, res) => {
    const { titulo, descricao, tipo, author } = req.body;

    if (!titulo || !descricao) {
        return res.status(400).json({
            erro: "Título e descrição são obrigatórios.",
        });
    }

    db.run(
        `INSERT INTO notificacoes (
            titulo,
            descricao,
            tipo,
            author,
            lida,
            created_at
        ) VALUES (?, ?, ?, ?, 0, datetime('now', '-3 hours'))`,
        [
            titulo,
            descricao,
            tipo || "Aviso",
            author || "Equipe Flooty Pet"
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar a notificação",
                });
            }

            res.json({
                mensagem: "Notificação cadastrada com sucesso!",
                id: this.lastID
            });
        }
    );
});

// 3. Marcar UMA notificação específica como lida
router.patch("/api/notificacoes/:id/lida", authApi, (req, res) => {
    const { id } = req.params;

    db.run(
        `UPDATE notificacoes SET lida = 1 WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: "Erro ao atualizar a notificação",
                });
            }

            res.json({
                mensagem: "Notificação marcada como lida!",
            });
        }
    );
});

// 4. Marcar TODAS as notificações como lidas
router.patch("/api/notificacoes/marcar-todas-lidas", authApi, (req, res) => {
    db.run(
        `UPDATE notificacoes SET lida = 1 WHERE lida = 0`,
        (err) => {
            if (err) {
                return res.status(500).json({
                    erro: "Erro ao marcar todas as notificações como lidas",
                });
            }

            res.json({
                mensagem: "Todas as notificações foram marcadas como lidas!",
            });
        }
    );
});

module.exports = router;