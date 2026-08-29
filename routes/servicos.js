const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authApi = require('../middlewares/authApi')

router.get("/api/servicos", authApi, (req, res) => {
  db.all("SELECT * FROM servicos WHERE ativo = 1 ORDER BY nome ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar serviços." });
    }
    res.json(rows);
  });
});

module.exports = router;