const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authApi = require("../middlewares/authApi");

// 1. LISTAR AGENDAMENTOS POR DATA
router.get("/api/agenda", authApi, (req, res) => {
  // Ajuste de data local (fallback seguro para fuso horário de Brasília)
  const hojeLocal = new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-");
  const dataFiltro = req.query.data || hojeLocal;

  // Query ajustada com DATE() e LEFT JOINs
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
    LEFT JOIN clientes c ON a.cliente_id = c.id
    LEFT JOIN pets p ON a.pet_id = p.id
    LEFT JOIN agendamento_servicos ags ON a.id = ags.agendamento_id
    LEFT JOIN servicos s ON ags.servico_id = s.id
    WHERE DATE(a.data) = DATE(?)
    GROUP BY a.id
    ORDER BY a.hora_inicio ASC
  `;

  db.all(query, [dataFiltro], (err, rows) => {
    if (err) {
      console.error("Erro na consulta da agenda:", err);
      return res.status(500).json({ erro: "Erro ao buscar os agendamentos da agenda." });
    }

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

      delete row.servicos_str;

      return {
        ...row,
        servicos,
      };
    });

    res.json(agendamentos);
  });
});

// 2. CRIAR NOVO AGENDAMENTO
router.post("/api/agenda", authApi, (req, res) => {
  const { cliente_id, pet_id, data, hora_inicio, hora_fim, observacoes, servicos } = req.body;

  // Validação básica dos campos obrigatórios
  if (!cliente_id || !pet_id || !data || !hora_inicio || !hora_fim) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  // 1. Insere o agendamento principal
  const sqlAgendamento = `
    INSERT INTO agendamentos (cliente_id, pet_id, data, hora_inicio, hora_fim, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sqlAgendamento,
    [cliente_id, pet_id, data, hora_inicio, hora_fim, observacoes || ""],
    function (err) {
      if (err) {
        console.error("Erro ao salvar agendamento:", err);
        return res.status(500).json({ erro: "Erro ao criar agendamento no banco." });
      }

      const agendamentoId = this.lastID;

      // 2. Se houver serviços vinculados, insere na tabela pivot agendamento_servicos
      if (servicos && servicos.length > 0) {
        const sqlServico = `
          INSERT INTO agendamento_servicos (agendamento_id, servico_id, valor_cobrado)
          VALUES (?, ?, ?)
        `;

        // Prepara e executa cada inserção de serviço
        const stmt = db.prepare(sqlServico);
        servicos.forEach((s) => {
          stmt.run([agendamentoId, s.servico_id, s.valor_cobrado]);
        });
        stmt.finalize();
      }

      return res.status(201).json({
        mensagem: "Agendamento criado com sucesso!",
        id: agendamentoId,
      });
    }
  );
});


module.exports = router;