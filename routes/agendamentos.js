const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authApi = require("../middlewares/authApi");


router.get("/api/agendamentos", authApi, (req, res) => {
    db.all(`SELECT * FROM agendamentos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: err.message,
            });
        }
        res.json(rows);
    });
});

router.post("/api/agendamentos", authApi, (req, res) => {
    let data = req.body.data;
    let cliente_id = req.body.cliente_id;
    let pet_id = req.body.pet_id;
    let servicos = req.body.servicos;
    let valor = req.body.valor;
    let pago = req.body.pago;
    let status = req.body.status;
    let taxi = req.body.taxi;

    db.run(
        `INSERT INTO agendamentos (cliente_id, pet_id, data, servicos, valor, pago, status, taxi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [cliente_id, pet_id, data, servicos, valor, pago, status, taxi],
        function (err) {
            if (err) {
                return res.status(500).json({
                    erro: `Não foi possível criar o agendamento, erro: ${err.message}`,
                });
            }

            res.json({
                mensagem: `Agendamento para ${data} criado com sucesso.`,
                id: this.lastID,
            });
        },
    );
});

module.exports = router;