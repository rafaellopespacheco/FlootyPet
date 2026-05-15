const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();

const db = new sqlite3.Database("./dados.db");

db.run(`CREATE TABLE IF NOT EXISTS config(
        id INTEGER PRIMARY KEY,
        nome_empresa TEXT        
)`)

db.run(`CREATE TABLE IF NOT EXISTS login(
    nome TEXT,
    email TEXT,
    senha TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS clientes(
    id INTEGER PRIMARY KEY,
    nome TEXT,
    cpf TEXT,
    datanasc DATE,
    numero TEXT,
    obs TEXT,
    logradouro TEXT,
    bairro TEXT,
    cidade TEXT,
    uf TEXT,
    notificacao INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER,
    nome TEXT,
    datanasc DATE,
    status TEXT,
    especie TEXT,
    raca TEXT,
    porte TEXT,
    tamanhopelo TEXT,
    peso REAL,
    sexo TEXT,
    castrado INTEGER,
    obs TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS agendamentos(
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER,
    pet_id INTEGER,
    data DATE,
    servicos TEXT,
    valor REAL,
    pago REAL,
    status TEXT,
    taxi REAL
)`);

app.use(express.json());

app.use(express.static('public'))

// PAGES

app.get("/clientes/:id", function (req, res) {
    res.sendFile(__dirname + '/view/info-clientes.html')
})


// API

app.get("/api/clientes", function (req, res) {
    db.all(`SELECT * FROM clientes`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

app.get("/api/clientes/:id", function (req, res) {
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

app.post("/api/clientes", function (req, res) {
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

app.get("/api/clientes/:id/pets", function (req, res) {
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

app.post("/api/clientes/:id/pets", function (req, res) {
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
                mensagem: `Erro ao exibir a agenda. ${err}`
            });
        };

        res.json(rows);
    });
});

app.listen(3000, function () {
    console.log("Estou rodando.");
});
