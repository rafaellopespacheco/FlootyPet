const express = require('express');
const authApi = require('../middlewares/authApi');
const router = express.Router();

router.get("/api/me", authApi, (req, res) => {
    res.json({
        nome: req.session.nome,
        email: req.session.email
    })
})

module.exports = router;