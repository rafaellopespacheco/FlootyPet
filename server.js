const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();

const db = require('./database/db')

app.use(express.json());

app.use(express.static("public"));

require('./database/init')

// PAGES
app.use(require('./routes/pages'))
app.use(require('./routes/clientes'))

app.get("/api/agendamentos", function (req, res) {
    db.all(`SELECT * FROM agendamentos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: err.message,
            });
        }
        res.json(rows);
    });
});

app.post("/api/agendamentos", function (req, res) {
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

app.get('/api/agenda', function (req, res) {
    db.all(`SELECT * FROM agendamentos
            WHERE data = ?`, [req.body.data], (err, rows) => {
        if (err) {
            return res.status(500).json({
                mensagem: `Erro ao exibir a agenda.`
            });
        };

        res.json(rows);
    });
});

app.get('/api/atualizacoes', (req, res) => {
    db.all(`SELECT * FROM changelogs`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                erro: `Erro ao procurar os changelogs`
            })
        }

        res.json(rows);
    })   
})

app.post('/api/atualizacoes', (req, res) => {
    db.run(`INSERT INTO changelogs ( titulo, versao, resumo, descricao, data )
            VALUES ( ?, ?, ?, ?, ?)`,
        [
        req.body.titulo,
        req.body.versao,
        req.body.resumo,
        JSON.stringify(req.body.descricao),
        req.body.data
        ], err => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro ao cadastrar uma changelog'
            })
        }

        res.json({
            mensagem: 'Changelog cadastrada com sucesso!'
        })
    })
})

app.listen(3000, () => {
    console.log("Estou rodando.");
});
