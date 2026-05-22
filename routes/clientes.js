const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authApi = require('../middlewares/authApi');


router.get("/api/clientes", authApi, (req, res) => {
    db.all(`SELECT * FROM clientes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

router.post("/api/clientes", authApi, function (req, res) {
    let nome = req.body.nome;
    let cpf = req.body.cpf;
    let datanasc = req.body.datanasc;
    let telefone = req.body.telefone;
    let obs = req.body.obs;
    let cep = req.body.cep;
    let numero = req.body.numero;
    let complemento = req.body.complemento;
    let logradouro = req.body.logradouro;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let uf = req.body.uf;
    let notificacao = req.body.notificacao ?? 1;

    if (!nome || !telefone) return res.status(400).json({ erro: "Você precisa preencher os campos obrigatórios" })

    db.run(
        `
        INSERT INTO clientes (nome, cpf, datanasc, telefone, obs, cep, logradouro, numero, complemento, bairro, cidade, uf, notificacao)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nome,
            cpf,
            datanasc,
            telefone,
            obs,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            notificacao
        ],
        function (err) {
            if (err) return res.status(500).json({ erro: "Erro ao cadastrar um novo cliente." })
            res.json({
                mensagem: "Cliente cadastrado com sucesso.",
                nome: nome,
                telefone: telefone,
                id: this.lastID
            });
        },
    );
});

router.get("/api/clientes/:id", authApi, (req, res) => {
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

router.put("/api/clientes/:id", authApi, (req, res) => {
    let id = req.params.id;
    let nome = req.body.nome;
    let telefone = req.body.telefone;
    if (!nome || !telefone) {
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
        SET nome = ?, cpf = ?, datanasc = ?, telefone = ?, obs = ?, cep = ?, logradouro = ?, bairro = ?, cidade = ?, uf = ?, notificacao = ?
        WHERE id = ?  
    `,
        [
            nome,
            cpf,
            datanasc,
            telefone,
            obs,
            cep,
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

router.delete("/api/clientes/:id", authApi, (req, res) => {
    let id = req.params.id;
    db.run(`DELETE FROM clientes WHERE id = ?`, [id], (err) => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro ao deletar usuário'
            })
        }

        res.json({
            mensagem: 'Usuário deletado com sucesso',
            linhasAfetadas: this.changes
        })
    })
})

router.get("/api/clientes/:id/pets", authApi, (req, res) => {
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

router.post("/api/clientes/:id/pets", authApi, (req, res) => {
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

router.delete("/api/clientes/:id/pets", authApi, (req, res) => {
    db.run(`DELETE FROM pets WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ erro: "Erro ao apagar pet." })
        res.json({ mensagem: "Pet apagado com sucesso!" })
    })
})

module.exports = router;