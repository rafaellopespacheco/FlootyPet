const express = require("express");
const path = require("path");
const router = express.Router();
const authPage = require("../middlewares/authPage");


router.get("/", function (req, res) {
    if (req.session.userId) {
        return res.redirect("/agenda")
    }
    res.sendFile(path.join(__dirname, "/../view/index.html"));
});

router.get("/agenda", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "/../view/agenda.html"));
});

router.use("/v2", express.static(path.join(__dirname, "../frontend/dist")));

router.use("/v2", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


router.get("/clientes", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/clientes.html"));
});

router.get("/atualizacoes", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/atualizacoes.html"));
});

router.get("/clientes/:id", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/info-clientes.html"));
});

router.get("/configuracao", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/config.html"));
});

module.exports = router;
