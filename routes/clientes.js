const express = require('express');
const router = express.Router();
const db = require('../database/db');


router.get("/api/clientes", function (req, res) {
    db.all(`SELECT * FROM clientes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

router.post("/api/clientes", function (req, res) {
    let nome = req.body.nome;
    let cpf = req.body.cpf;
    let datanasc = req.body.datanasc;
    let numero = req.body.numero;
    let obs = req.body.obs;
    let logradouro = req.body.logradouro;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let uf = req.body.uf;
    let notificacao = req.body.notificacao ?? 1;

    db.run(
        `
        INSERT INTO clientes (nome, cpf, datanasc, numero, obs, logradouro, bairro, cidade, uf, notificacao)
        VALUES(?, ?, ?, ?, ?,? , ?, ?, ?, ?)`,
        [
            nome,
            cpf,
            datanasc,
            numero,
            obs,
            logradouro,
            bairro,
            cidade,
            uf,
            notificacao,
        ],
        function (err) {
            res.json({
                mensagem: "Cliente cadastrado com sucesso.",
                id: this.lastID,
            });
        },
    );
});

router.get("/api/clientes/:id", function (req, res) {
    db.get(
        `
        SELECT * FROM clientes
        WHERE id = ?`,
        [req.params.id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message,
                });
            }
            if (!rows) {
                return res.status(404).json({
                    erro: "Este usuário não existe.",
                });
            }

            res.json(rows);
        },
    );
});

router.put("/api/clientes/:id", function (req, res) {
    let id = req.params.id;
    let nome = req.body.nome;
    let numero = req.body.numero;
    if (!nome || !numero) {
        return res.status(400).json({
            erro: `Preencha os campos obrigatórios.`,
        });
    }
    let cpf = req.body.cpf;
    let datanasc = req.body.datanasc;
    let cep = req.body.cep;
    let uf = req.body.uf;
    let logradouro = req.body.logradouro;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let notificacao = req.body.notificacao;
    let obs = req.body.obs;

    db.run(
        `
        UPDATE clientes
        SET nome = ?, cpf = ?, datanasc = ?, numero = ?, obs = ?, logradouro = ?, bairro = ?, cidade = ?, uf = ?, notificacao = ?
        WHERE id = ?  
    `,
        [
            nome,
            cpf,
            datanasc,
            numero,
            obs,
            logradouro,
            bairro,
            cidade,
            uf,
            notificacao,
            id,
        ],
        (err) => {
            if (err) {
                return res.status(400).json({
                    erro: `Falha ao atualizar o cliente.`,
                });
            }

            res.json({
                mensagem: "Usuário atualizado com sucesso.",
            });
        },
    );
});

router.get("/api/clientes/:id/pets", function (req, res) {
    let id = req.params.id;
    db.all(
        `
        SELECT * FROM pets
        WHERE cliente_id = ?`,
        [id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    erro: `Erro ao buscar pets do cliente. ${err.message}`,
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    erro: "Nenhum pet encontrado para esse cliente.",
                });
            }

            res.json(rows);
        },
    );
});

router.post("/api/clientes/:id/pets", function (req, res) {
    let cliente_id = req.params.id;
    db.get(
        `SELECT * FROM clientes
            WHERE id = ?`,
        [cliente_id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message,
                });
            }
            if (!rows) {
                return res.status(404).json({
                    erro: "Este cliente não existe.",
                });
            }

            let nome = req.body.nome;
            let datanasc = req.body.datanasc;
            let status = req.body.status;
            let especie = req.body.especie;
            let raca = req.body.raca;
            let porte = req.body.porte;
            let tamanhopelo = req.body.tamanhopelo;
            let peso = req.body.peso;
            let sexo = req.body.sexo;
            let castrado = req.body.castrado;
            let obs = req.body.obs;

            db.run(
                `
        INSERT INTO pets (cliente_id, nome, datanasc, status, especie, raca, porte, tamanhopelo, peso, sexo, castrado, obs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    cliente_id,
                    nome,
                    datanasc,
                    status,
                    especie,
                    raca,
                    porte,
                    tamanhopelo,
                    peso,
                    sexo,
                    castrado,
                    obs,
                ],
                function (err) {
                    if (err) {
                        return res.status(500).json({
                            erro: `Erro ao cadastrar um pet. ${err.message}`,
                        });
                    }

                    res.json({
                        mensagem: "Pet criado com sucesso.",
                        id: this.lastID,
                    });
                },
            );
        },
    );
});

module.exports = router;