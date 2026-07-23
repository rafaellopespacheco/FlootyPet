import { useEffect, useState } from "react";
import { toast } from "sonner";
import "./Agenda.css";

export default function Agenda() {
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Novo Agendamento
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [step, setStep] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);

  // Form State & Busca
  const [buscaCliente, setBuscaCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [agendamentoData, setAgendamentoData] = useState({
    data: new Date().toISOString().split("T")[0],
    hora_inicio: "09:00",
    hora_fim: "10:00",
    observacoes: "",
  });

  // Busca Agendamentos do dia
  const carregarAgenda = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agenda?data=${data}`);
      if (response.ok) {
        const dados = await response.json();
        setAgendamentos(dados);
      } else {
        toast.error("Erro ao carregar a agenda.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgenda(dataSelecionada);
  }, [dataSelecionada]);

  // Carrega Clientes, Pets e Serviços ao abrir o Modal
  const handleAbrirModalNovo = async () => {
    setModalNovoAberto(true);
    setStep(1);
    resetForm();

    try {
      const [resClientes, resServicos] = await Promise.all([
        fetch("/api/clientes"),
        fetch("/api/servicos"),
      ]);

      if (resClientes.ok) setClientes(await resClientes.json());
      if (resServicos.ok) setListaServicos(await resServicos.json());
    } catch (error) {
      toast.error("Erro ao carregar dados de clientes/serviços.");
    }
  };

  const resetForm = () => {
    setBuscaCliente("");
    setClienteSelecionado(null);
    setPetSelecionado(null);
    setServicosSelecionados([]);
    setAgendamentoData({
      data: dataSelecionada,
      hora_inicio: "09:00",
      hora_fim: "10:00",
      observacoes: "",
    });
  };

  // Filtro de Clientes/Pets em tempo real
  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = buscaCliente.toLowerCase();
    const bateuNomeCliente = cliente.nome?.toLowerCase().includes(termo);
    const bateuTelefone = cliente.telefone?.includes(termo);
    const bateuNomePet = cliente.pets?.some((p) =>
      p.nome?.toLowerCase().includes(termo)
    );

    return bateuNomeCliente || bateuTelefone || bateuNomePet;
  });

  const handleSelectCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setPetSelecionado(null);
  };

  const handleSelectPet = (pet, clientePai) => {
    setPetSelecionado(pet);
    setClienteSelecionado(clientePai);
    setStep(2); // Avança direto para a escolha de serviços
  };

  const handleToggleServico = (servico) => {
    const jaExiste = servicosSelecionados.find((s) => s.servico_id === servico.id);
    if (jaExiste) {
      setServicosSelecionados(servicosSelecionados.filter((s) => s.servico_id !== servico.id));
    } else {
      setServicosSelecionados([
        ...servicosSelecionados,
        {
          servico_id: servico.id,
          nome: servico.nome,
          valor_cobrado: servico.preco_padrao,
        },
      ]);
    }
  };

  const handleSalvarAgendamento = async () => {
    const payload = {
      cliente_id: clienteSelecionado.id,
      pet_id: petSelecionado.id,
      data: agendamentoData.data,
      hora_inicio: agendamentoData.hora_inicio,
      hora_fim: agendamentoData.hora_fim,
      observacoes: agendamentoData.observacoes,
      servicos: servicosSelecionados,
    };

    try {
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Agendamento realizado com sucesso!");
        setModalNovoAberto(false);
        carregarAgenda(dataSelecionada);
      } else {
        const err = await response.json();
        toast.error(err.erro || "Falha ao criar agendamento.");
      }
    } catch (error) {
      toast.error("Erro de conexão ao salvar.");
    }
  };

  const valorTotalServicos = servicosSelecionados.reduce(
    (acc, s) => acc + parseFloat(s.valor_cobrado || 0),
    0
  );

  return (
    <div className="agenda-wrapper">
      {/* Topo da Agenda */}
      <div className="agenda-header-bar">
        <h2>Agenda de Atendimentos</h2>
        <div className="header-actions">
          <div className="filtro-data">
            <label htmlFor="data-agenda">Data:</label>
            <input
              id="data-agenda"
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
          <button className="btn-novo-agendamento" onClick={handleAbrirModalNovo}>
            <span className="material-symbols-rounded">add</span> Novo Agendamento
          </button>
        </div>
      </div>

      {/* Cards da Agenda */}
      <div className="container-main">
        {loading ? (
          <p className="agenda-empty">Carregando agendamentos...</p>
        ) : agendamentos.length === 0 ? (
          <p className="agenda-empty">Nenhum agendamento para esta data.</p>
        ) : (
          agendamentos.map((item) => (
            <div className={`agenda-card ${item.status?.toLowerCase() || 'agendado'}`} key={item.id}>
              <div className="card-header">
                <span className={`status ${item.status?.toLowerCase()}`}>{item.status}</span>
                <span className="horario">{item.hora_inicio} - {item.hora_fim}</span>
              </div>
              <div className="pet-info">
                <img src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" alt="Pet" />
                <div>
                  <h3>{item.pet_nome}</h3>
                  <p>{item.cliente_nome}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE NOVO AGENDAMENTO */}
      {modalNovoAberto && (
        <div className="modal-overlay" onClick={() => setModalNovoAberto(false)}>
          <div className="modal-content modal-agendamento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Novo Agendamento</h3>
              <button className="btn-close-modal" onClick={() => setModalNovoAberto(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="stepper-bar">
              <span className={`step-item ${step >= 1 ? "active" : ""}`}>1. Pet/Tutor</span>
              <span className={`step-item ${step >= 2 ? "active" : ""}`}>2. Serviços</span>
              <span className={`step-item ${step >= 3 ? "active" : ""}`}>3. Data e Hora</span>
              <span className={`step-item ${step >= 4 ? "active" : ""}`}>4. Confirmação</span>
            </div>

            <div className="modal-body step-body">
              {/* ETAPA 1: PESQUISAR E SELECIONAR */}
              {step === 1 && (
                <div className="step-content">
                  <h4>Selecione o Cliente ou Pet</h4>

                  <div className="search-input-container">
                    <span className="material-symbols-rounded icon-search">search</span>
                    <input
                      type="text"
                      placeholder="Buscar por cliente, telefone ou nome do pet..."
                      value={buscaCliente}
                      onChange={(e) => setBuscaCliente(e.target.value)}
                      autoFocus
                    />
                    {buscaCliente && (
                      <button className="btn-clear-search" onClick={() => setBuscaCliente("")}>
                        <span className="material-symbols-rounded">close</span>
                      </button>
                    )}
                  </div>

                  <div className="busca-clientes-list">
                    {clientesFiltrados.length === 0 ? (
                      <p className="no-results-text">
                        Nenhum cliente ou pet encontrado para "{buscaCliente}".
                      </p>
                    ) : (
                      clientesFiltrados.slice(0, 10).map((cliente) => (
                        <div key={cliente.id} className="cliente-box-item">
                          <div
                            className={`cliente-header-item ${
                              clienteSelecionado?.id === cliente.id ? "selected" : ""
                            }`}
                            onClick={() => handleSelectCliente(cliente)}
                          >
                            <div>
                              <strong>{cliente.nome}</strong>
                              <span className="cliente-phone-badge">{cliente.telefone}</span>
                            </div>
                          </div>

                          <div className="pets-sublist">
                            {cliente.pets?.map((pet) => (
                              <button
                                key={pet.id}
                                className={`btn-pet-chip ${
                                  petSelecionado?.id === pet.id ? "active" : ""
                                }`}
                                onClick={() => handleSelectPet(pet, cliente)}
                              >
                                🐾 {pet.nome} <small>({pet.especie || "Pet"})</small>
                              </button>
                            ))}
                            {(!cliente.pets || cliente.pets.length === 0) && (
                              <span className="no-pets-text">Nenhum pet cadastrado.</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ETAPA 2: SERVIÇOS */}
              {step === 2 && (
                <div className="step-content">
                  <h4>Escolha os Serviços para {petSelecionado?.nome}</h4>
                  <div className="servicos-selection-list">
                    {listaServicos.map((servico) => {
                      const selecionado = servicosSelecionados.some((s) => s.servico_id === servico.id);
                      return (
                        <div
                          key={servico.id}
                          className={`servico-card-item ${selecionado ? "selected" : ""}`}
                          onClick={() => handleToggleServico(servico)}
                        >
                          <div>
                            <strong>{servico.nome}</strong>
                            <small>{servico.duracao} min</small>
                          </div>
                          <span className="preco">R$ {servico.preco_padrao.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-bar">
                    Total: <strong>R$ {valorTotalServicos.toFixed(2)}</strong>
                  </div>
                </div>
              )}

              {/* ETAPA 3: DATA E HORA */}
              {step === 3 && (
                <div className="step-content">
                  <h4>Data e Horário do Atendimento</h4>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Data:</label>
                      <input
                        type="date"
                        value={agendamentoData.data}
                        onChange={(e) => setAgendamentoData({ ...agendamentoData, data: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Hora Início:</label>
                      <input
                        type="time"
                        value={agendamentoData.hora_inicio}
                        onChange={(e) => setAgendamentoData({ ...agendamentoData, hora_inicio: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Hora Fim:</label>
                      <input
                        type="time"
                        value={agendamentoData.hora_fim}
                        onChange={(e) => setAgendamentoData({ ...agendamentoData, hora_fim: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observações:</label>
                    <textarea
                      rows="3"
                      placeholder="Ex: Cuidados especiais, alergias..."
                      value={agendamentoData.observacoes}
                      onChange={(e) => setAgendamentoData({ ...agendamentoData, observacoes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 4: RESUMO */}
              {step === 4 && (
                <div className="step-content resumo-box">
                  <h4>Confirmação do Agendamento</h4>
                  <div className="resumo-item">
                    <span>Tutor:</span> <strong>{clienteSelecionado?.nome}</strong>
                  </div>
                  <div className="resumo-item">
                    <span>Pet:</span> <strong>{petSelecionado?.nome}</strong>
                  </div>
                  <div className="resumo-item">
                    <span>Data/Hora:</span> <strong>{agendamentoData.data} das {agendamentoData.hora_inicio} às {agendamentoData.hora_fim}</strong>
                  </div>
                  <div className="resumo-item">
                    <span>Serviços:</span>
                    <ul>
                      {servicosSelecionados.map((s) => (
                        <li key={s.servico_id}>{s.nome} - R$ {parseFloat(s.valor_cobrado).toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resumo-item total">
                    <span>Valor Total:</span> <strong>R$ {valorTotalServicos.toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer footer-stepper">
              {step > 1 && (
                <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                  Voltar
                </button>
              )}

              {step < 4 ? (
                <button
                  className="btn-modal-primary"
                  disabled={
                    (step === 1 && !petSelecionado) ||
                    (step === 2 && servicosSelecionados.length === 0)
                  }
                  onClick={() => setStep(step + 1)}
                >
                  Próximo Passo
                </button>
              ) : (
                <button className="btn-modal-primary btn-confirm" onClick={handleSalvarAgendamento}>
                  Confirmar e Agendar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}