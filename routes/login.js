const express = require("express");
const session = require('express-session');
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");

router.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro ao procurar o usuário'
            })
        }
        if (!user) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })
        }

        bcrypt.compare(password, user.password_hash, (erro, result) => {
            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao fazer o login.'
                })
            };
            
            if (!result) {
                return res.status(401).json({
                    erro: "Senha incorreta!"
                })
            };

            req.session.userId = user.id;
            req.session.nome = user.name;
            req.session.email = user.email;
            req.session.role = user.role;

            res.json({
                message: 'Login efetuado com sucesso.',
                email: user.email
            })
        })
    })
});

router.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Deslogado com sucesso' })
    })
})

module.exports = router;
