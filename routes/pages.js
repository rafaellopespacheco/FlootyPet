const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/agenda", function (req, res) {
    res.sendFile(path.join(__dirname, "/../view/agenda.html"));
});

router.get("/clientes", function (req, res) {
    res.sendFile(path.join(__dirname, "../view/clientes.html"));
});

router.get("/atualizacoes", function (req, res) {
    res.sendFile(path.join(__dirname, "../view/atualizacoes.html"));
});

router.get("/clientes/:id", function (req, res) {
    res.sendFile(path.join(__dirname, "../view/info-clientes.html"));
});

module.exports = router;
