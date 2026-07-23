const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authApi = require("../middlewares/authApi");

// 1. LISTAR AGENDAMENTOS POR DATA
router.get("/api/agenda", authApi, (req, res) => {
  const dataFiltro = req.query.data || new Date().toISOString().split("T")[0];

  // Query compatível usando GROUP_CONCAT
  const query = `
    SELECT 
      a.id,
      a.data,
      a.hora_inicio,
      a.hora_fim,
      a.status,
      a.observacoes,
      c.nome AS cliente_nome,
      c.telefone AS cliente_telefone,
      p.nome AS pet_nome,
      GROUP_CONCAT(s.id || ':' || s.nome || ':' || s.categoria || ':' || ags.valor_cobrado, ';') AS servicos_str
    FROM agendamentos a
    INNER JOIN clientes c ON a.cliente_id = c.id
    INNER JOIN pets p ON a.pet_id = p.id
    LEFT JOIN agendamento_servicos ags ON a.id = ags.agendamento_id
    LEFT JOIN servicos s ON ags.servico_id = s.id
    WHERE a.data = ?
    GROUP BY a.id
    ORDER BY a.hora_inicio ASC
  `;

  db.all(query, [dataFiltro], (err, rows) => {
    if (err) {
      console.error("Erro na consulta da agenda:", err);
      return res.status(500).json({ erro: "Erro ao buscar os agendamentos da agenda." });
    }

    // Trata a string concatenada do GROUP_CONCAT para virar um array de objetos limpo
    const agendamentos = rows.map((row) => {
      let servicos = [];
      
      if (row.servicos_str) {
        servicos = row.servicos_str.split(";").map((item) => {
          const [id, nome, categoria, valor] = item.split(":");
          return {
            id: Number(id),
            nome,
            categoria,
            valor: parseFloat(valor),
          };
        });
      }

      delete row.servicos_str; // Remove a string temporária do retorno

      return {
        ...row,
        servicos,
      };
    });

    res.json(agendamentos);
  });
});

// GET /api/servicos (Listar todos os serviços ativos)
router.get("/api/servicos", authApi, (req, res) => {
  db.all("SELECT * FROM servicos WHERE ativo = 1 ORDER BY nome ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar serviços." });
    }
    res.json(rows);
  });
});

module.exports = router;