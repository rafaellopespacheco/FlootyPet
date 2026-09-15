const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authApi = require('../middlewares/authApi');

// Listar raças
router.get("/api/racas", authApi, (req, res) => {
    const especie_id = req.query.especie_id;
    let query = `SELECT * FROM racas`;
    const params = [];
    if (especie_id) {
        query += ` WHERE especie_id = ?`;
        params.push(especie_id);
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

// Cadastrar nova raça
router.post("/api/racas", authApi, (req, res) => {
    const { nome, especie_id, tamanho, tamanhopelo } = req.body;
    if (!nome || !especie_id) {
        return res.status(400).json({ erro: "Nome e espécie são obrigatórios." });
    }

    db.run(
        `INSERT INTO racas (nome, especie_id, tamanho, tamanhopelo) VALUES (?, ?, ?, ?)`,
        [nome, especie_id, tamanho, tamanhopelo],
        function (err) {
            if (err) {
                return res.status(500).json({ erro: `Erro ao cadastrar raça: ${err.message}` });
            }
            res.json({
                mensagem: "Raça cadastrada com sucesso.",
                id: this.lastID
            });
        }
    );
});

// Remover raça
router.delete("/api/racas/:id", authApi, (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM racas WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ erro: `Erro ao remover raça: ${err.message}` });
        }
        res.json({ mensagem: "Raça removida com sucesso." });
    });
});

module.exports = router;
