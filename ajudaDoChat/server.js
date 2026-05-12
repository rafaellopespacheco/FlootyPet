const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database('./dados.db');

db.run(`
CREATE TABLE IF NOT EXISTS usuarios(
   id INTEGER PRIMARY KEY,
   nome TEXT,
   datanasc DATE
)
`)

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/usuarios", function (req, res) {
   db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
      if (err) {
         res.status(500).json({
            erro: "Erro ao buscar usuário"
         })
      }
      res.json(rows)
   });
});

app.post("/usuarios", function (req, res) {
   let nomeRecebido = req.body.nome;
   let dataNascRecebido = req.body.datanasc;

   db.run(`
      INSERT INTO usuarios (
         nome, datanasc
      )
      VALUES (?, ?)
      `, [nomeRecebido, dataNascRecebido], function (err) {
      if (err) {
         return res.status(500).json({
            erro: "Erro ao criar usuário"
         })
      }
      
      res.json({
         mensagem: "Usuário criado com sucesso!",
         usuario: {
            id: this.lastID,
            nome: nomeRecebido,
            datanasc: dataNascRecebido
         }
      });
      }
   );
});

app.listen(3000, function () {
   console.log("API Rodando");
});
