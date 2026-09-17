const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authApi = require("../middlewares/authApi");

const camposEmpresa = [
    "nome_empresa",
    "cnpj",
    "cep",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "uf",
];

// Buscar configuracoes gerais da empresa
router.get("/api/config/empresa", authApi, (req, res) => {
    db.get(
        `SELECT ${camposEmpresa.join(", ")} FROM config WHERE id = 1`,
        [],
        (err, row) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        erro: "Erro ao buscar as configurações da empresa.",
                    });
            }
            res.json(
                row ||
                    Object.fromEntries(
                        camposEmpresa.map((campo) => [campo, ""]),
                    ),
            );
        },
    );
});

// Salvar configuracoes gerais da empresa
router.put("/api/config/empresa", authApi, (req, res) => {
    const dados = Object.fromEntries(
        camposEmpresa.map((campo) => [
            campo,
            String(req.body[campo] ?? "").trim(),
        ]),
    );

    if (!dados.nome_empresa) {
        return res
            .status(400)
            .json({ erro: "O nome da empresa é obrigatório." });
    }

    db.run(
        `INSERT INTO config (id, ${camposEmpresa.join(", ")})
         VALUES (1, ${camposEmpresa.map(() => "?").join(", ")})
         ON CONFLICT(id) DO UPDATE SET ${camposEmpresa.map((campo) => `${campo} = excluded.${campo}`).join(", ")}`,
        camposEmpresa.map((campo) => dados[campo]),
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        erro: "Erro ao salvar as configurações da empresa.",
                    });
            }
            res.json({ mensagem: "Configurações salvas com sucesso.", dados });
        },
    );
});

// Listar opções de checklist
router.get("/api/config/checklist", authApi, (req, res) => {
    const checklist_tipo = req.query.checklist_tipo || "agendado";
    db.all(
        `SELECT * FROM config_checklist WHERE checklist_tipo = ?`,
        [checklist_tipo],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            res.json(rows);
        },
    );
});

// Adicionar opção ao checklist
router.post("/api/config/checklist", authApi, (req, res) => {
    const { checklist_tipo, categoria, valor } = req.body;
    if (!categoria || !valor) {
        return res
            .status(400)
            .json({ erro: "Categoria e valor são obrigatórios." });
    }

    const tipo = checklist_tipo || "agendado";

    db.run(
        `INSERT INTO config_checklist (checklist_tipo, categoria, valor) VALUES (?, ?, ?)`,
        [tipo, categoria, valor],
        function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({
                        erro: `Erro ao adicionar item de checklist: ${err.message}`,
                    });
            }
            res.json({
                mensagem: "Opção adicionada com sucesso.",
                id: this.lastID,
            });
        },
    );
});

// Remover opção do checklist
router.delete("/api/config/checklist/:id", authApi, (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM config_checklist WHERE id = ?`, [id], function (err) {
        if (err) {
            return res
                .status(500)
                .json({
                    erro: `Erro ao remover item de checklist: ${err.message}`,
                });
        }
        res.json({ mensagem: "Opção removida com sucesso." });
    });
});

module.exports = router;
