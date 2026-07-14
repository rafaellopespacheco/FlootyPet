const express = require("express");
const path = require("path");
const router = express.Router();
const authPage = require("../middlewares/authPage");

router.get("/clientes/:id", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/info-clientes.html"));
});

router.get("/old/configuracao", authPage, (req, res) => {
    res.sendFile(path.join(__dirname, "../view/config.html"));
});

router.get(["/", "/login"], (req, res) => {
    res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

router.use(authPage, (req, res) => {
    res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

module.exports = router;
