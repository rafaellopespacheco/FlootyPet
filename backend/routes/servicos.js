const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authApi = require("../middlewares/authApi");

const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });

const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
    });

const validarServico = (servico) => {
    const preco = Number(servico.preco_padrao);
    const duracao = Number(servico.duracao);
    if (
        !String(servico.nome || "").trim() ||
        !Number.isFinite(preco) ||
        preco < 0 ||
        !Number.isInteger(duracao) ||
        duracao < 1
    ) {
        throw new Error("Confira o nome, preço e duração do serviço.");
    }
    return {
        nome: String(servico.nome).trim(),
        categoria: String(servico.categoria || "outros").trim(),
        preco,
        duracao,
        ativo: servico.ativo === false ? 0 : 1,
    };
};

router.get("/api/servicos", authApi, (req, res) => {
    const racaId = Number(req.query.raca_id);
    const params = Number.isInteger(racaId) && racaId > 0 ? [racaId] : [];
    const regra = params.length
        ? "LEFT JOIN servico_racas sr ON sr.servico_id = s.id AND sr.raca_id = ?"
        : "";
    const valores = params.length
        ? "COALESCE(sr.preco, s.preco_padrao) AS preco_padrao, COALESCE(sr.duracao, s.duracao) AS duracao"
        : "s.preco_padrao, s.duracao";

    db.all(
        `SELECT s.id, s.nome, s.categoria, ${valores}, s.ativo
            FROM servicos s ${regra}
            WHERE s.ativo = 1 ORDER BY s.nome ASC`,
        params,
        (err, rows) => {
            if (err)
                return res
                    .status(500)
                    .json({ erro: "Erro ao buscar serviços." });
            res.json(rows);
        },
    );
});

router.get("/api/servicos/config", authApi, async (req, res) => {
    try {
        const rows = await all(`
            SELECT s.id, s.nome, s.categoria, s.preco_padrao, s.duracao, s.ativo,
                   sr.grupo, sr.raca_id, sr.preco, sr.duracao AS duracao_raca,
                   r.nome AS raca_nome, r.especie_id
            FROM servicos s
            LEFT JOIN servico_racas sr ON sr.servico_id = s.id
            LEFT JOIN racas r ON r.id = sr.raca_id
            ORDER BY s.ativo DESC, s.nome ASC, sr.grupo ASC, r.nome ASC`);

        const servicos = [];
        const porId = new Map();
        const grupos = new Map();
        rows.forEach((row) => {
            if (!porId.has(row.id)) {
                const servico = {
                    id: row.id,
                    nome: row.nome,
                    categoria: row.categoria,
                    preco_padrao: row.preco_padrao,
                    duracao: row.duracao,
                    ativo: row.ativo,
                    regras: [],
                };
                porId.set(row.id, servico);
                servicos.push(servico);
            }
            if (!row.raca_id) return;
            const grupo =
                row.grupo && row.grupo !== "Regra por raça"
                    ? row.grupo
                    : `Regra ${Number(row.preco).toFixed(2)} · ${row.duracao_raca} min`;
            const chave = `${row.id}:${grupo}`;
            if (!grupos.has(chave)) {
                const regra = {
                    id: chave,
                    nome: grupo,
                    preco: row.preco,
                    duracao: row.duracao_raca,
                    racas: [],
                };
                grupos.set(chave, regra);
                porId.get(row.id).regras.push(regra);
            }
            grupos
                .get(chave)
                .racas.push({
                    id: row.raca_id,
                    nome: row.raca_nome,
                    especie_id: row.especie_id,
                });
        });
        res.json(servicos);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao carregar a configuração dos serviços.",
        });
    }
});

router.post("/api/servicos", authApi, async (req, res) => {
    try {
        const dados = validarServico(req.body);
        const resultado = await run(
            `INSERT INTO servicos (nome, categoria, preco_padrao, duracao, ativo) VALUES (?, ?, ?, ?, 1)`,
            [dados.nome, dados.categoria, dados.preco, dados.duracao],
        );
        res.status(201).json({ id: resultado.lastID, ...dados, regras: [] });
    } catch (error) {
        res.status(400).json({
            erro: error.message || "Não foi possível criar o serviço.",
        });
    }
});

router.put("/api/servicos/config", authApi, async (req, res) => {
    const servicos = Array.isArray(req.body.servicos) ? req.body.servicos : [];
    if (!servicos.length)
        return res.status(400).json({ erro: "Nenhum serviço foi enviado." });

    try {
        await run("BEGIN TRANSACTION");
        for (const servico of servicos) {
            const dados = validarServico(servico);
            const atualizado = await run(
                `UPDATE servicos SET nome = ?, categoria = ?, preco_padrao = ?, duracao = ?, ativo = ? WHERE id = ?`,
                [
                    dados.nome,
                    dados.categoria,
                    dados.preco,
                    dados.duracao,
                    dados.ativo,
                    servico.id,
                ],
            );
            if (atualizado.changes !== 1)
                throw new Error("Serviço não encontrado.");

            await run("DELETE FROM servico_racas WHERE servico_id = ?", [
                servico.id,
            ]);
            for (const regra of Array.isArray(servico.regras)
                ? servico.regras
                : []) {
                const preco = Number(regra.preco);
                const duracao = Number(regra.duracao);
                const racas = Array.isArray(regra.racas) ? regra.racas : [];
                if (
                    !String(regra.nome || "").trim() ||
                    !Number.isFinite(preco) ||
                    preco < 0 ||
                    !Number.isInteger(duracao) ||
                    duracao < 1
                ) {
                    throw new Error(
                        "Confira nome, preço e duração das regras.",
                    );
                }
                for (const racaId of racas) {
                    await run(
                        `INSERT INTO servico_racas (servico_id, raca_id, grupo, preco, duracao) VALUES (?, ?, ?, ?, ?)`,
                        [
                            servico.id,
                            Number(racaId),
                            String(regra.nome).trim(),
                            preco,
                            duracao,
                        ],
                    );
                }
            }
        }
        await run("COMMIT");
        res.json({ mensagem: "Serviços salvos com sucesso." });
    } catch (error) {
        try {
            await run("ROLLBACK");
        } catch (_) {
            /* transação já pode ter sido encerrada */
        }
        res.status(400).json({
            erro: error.message || "Não foi possível salvar os serviços.",
        });
    }
});

router.delete("/api/servicos/:id", authApi, async (req, res) => {
    try {
        const resultado = await run(
            "UPDATE servicos SET ativo = 0 WHERE id = ?",
            [req.params.id],
        );
        if (!resultado.changes)
            return res.status(404).json({ erro: "Serviço não encontrado." });
        res.json({
            mensagem:
                "Serviço arquivado. O histórico de agendamentos foi preservado.",
        });
    } catch (error) {
        res.status(500).json({ erro: "Não foi possível arquivar o serviço." });
    }
});

module.exports = router;
