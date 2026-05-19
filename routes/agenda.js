const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get("/api/agenda", function (req, res) {
    db.all(
        `SELECT * FROM agendamentos
            WHERE data = ?`,
        [req.body.data],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    mensagem: `Erro ao exibir a agenda.`,
                });
            }

            res.json(rows);
        },
    );
});

module.exports = router;