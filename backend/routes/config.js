const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authApi = require('../middlewares/authApi');

// Listar opções de checklist
router.get("/api/config/checklist", authApi, (req, res) => {
    const checklist_tipo = req.query.checklist_tipo || 'agendado';
    db.all(
        `SELECT * FROM config_checklist WHERE checklist_tipo = ?`,
        [checklist_tipo],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            res.json(rows);
        }
    );
});

// Adicionar opção ao checklist
router.post("/api/config/checklist", authApi, (req, res) => {
    const { checklist_tipo, categoria, valor } = req.body;
    if (!categoria || !valor) {
        return res.status(400).json({ erro: "Categoria e valor são obrigatórios." });
    }

    const tipo = checklist_tipo || 'agendado';

    db.run(
        `INSERT INTO config_checklist (checklist_tipo, categoria, valor) VALUES (?, ?, ?)`,
        [tipo, categoria, valor],
        function (err) {
            if (err) {
                return res.status(500).json({ erro: `Erro ao adicionar item de checklist: ${err.message}` });
            }
            res.json({
                mensagem: "Opção adicionada com sucesso.",
                id: this.lastID
            });
        }
    );
});

// Remover opção do checklist
router.delete("/api/config/checklist/:id", authApi, (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM config_checklist WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ erro: `Erro ao remover item de checklist: ${err.message}` });
        }
        res.json({ mensagem: "Opção removida com sucesso." });
    });
});

module.exports = router;
