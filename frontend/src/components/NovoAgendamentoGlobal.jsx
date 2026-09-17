import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import "../pages/Agenda.css";
import ModalCadastroCliente from "./ModalCadastroCliente";

const hoje = () => new Date().toISOString().split("T")[0];

export default function NovoAgendamentoGlobal() {
    const [aberto, setAberto] = useState(false);
    const [etapa, setEtapa] = useState(1);
    const [clientes, setClientes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [busca, setBusca] = useState("");
    const [cliente, setCliente] = useState(null);
    const [pet, setPet] = useState(null);
    const [selecionados, setSelecionados] = useState([]);
    const [dados, setDados] = useState({
        data: hoje(),
        hora_inicio: "09:00",
        hora_fim: "10:00",
        observacoes: "",
        desconto: "0",
        taxi_dog: false,
        valor_taxi: "0",
    });
    const [salvando, setSalvando] = useState(false);
    const [cadastroAberto, setCadastroAberto] = useState(false);

    useEffect(() => {
        const abrir = async () => {
            setAberto(true);
            setEtapa(1);
            setCliente(null);
            setPet(null);
            setSelecionados([]);
            setBusca("");
            setDados({
                data: hoje(),
                hora_inicio: "09:00",
                hora_fim: "10:00",
                observacoes: "",
                desconto: "0",
                taxi_dog: false,
                valor_taxi: "0",
            });
            try {
                const resposta = await fetch("/api/clientes");
                if (!resposta.ok) throw new Error();
                setClientes(await resposta.json());
            } catch (_) {
                toast.error("Não foi possível carregar os clientes.");
            }
        };
        window.addEventListener("flooty:novo-agendamento", abrir);
        return () =>
            window.removeEventListener("flooty:novo-agendamento", abrir);
    }, []);

    const filtrados = useMemo(
        () =>
            clientes
                .filter((item) => {
                    const termo = busca.toLowerCase();
                    return (
                        item.nome?.toLowerCase().includes(termo) ||
                        item.telefone?.includes(termo) ||
                        item.pets?.some((itemPet) =>
                            itemPet.nome?.toLowerCase().includes(termo),
                        )
                    );
                })
                .slice(0, 12),
        [clientes, busca],
    );

    async function selecionarPet(itemPet, tutor) {
        setPet(itemPet);
        setCliente(tutor);
        try {
            const resposta = await fetch(
                `/api/servicos${itemPet.raca_id ? `?raca_id=${itemPet.raca_id}` : ""}`,
            );
            if (!resposta.ok) throw new Error();
            setServicos(await resposta.json());
            setEtapa(2);
        } catch (_) {
            toast.error("Não foi possível carregar os serviços.");
        }
    }

    async function clienteCadastrado(novoCliente, acao) {
        const resposta = await fetch("/api/clientes");
        const lista = resposta.ok ? await resposta.json() : [];
        setClientes(lista);
        setCadastroAberto(false);
        const clienteAtual =
            lista.find((item) => item.id === novoCliente.id) || novoCliente;
        setCliente(clienteAtual);
        setBusca(clienteAtual.nome || "");
        if (acao === "cadastrar-agendar" && clienteAtual.pets?.length === 1) {
            await selecionarPet(clienteAtual.pets[0], clienteAtual);
        } else if (acao === "cadastrar-agendar") {
            toast.success(
                "Cliente cadastrado. Selecione o pet para continuar o agendamento.",
            );
        } else toast.success("Cliente cadastrado com sucesso.");
    }

    function alternarServico(servico) {
        setSelecionados((atuais) =>
            atuais.some((item) => item.servico_id === servico.id)
                ? atuais.filter((item) => item.servico_id !== servico.id)
                : [
                      ...atuais,
                      {
                          servico_id: servico.id,
                          nome: servico.nome,
                          valor_cobrado: servico.preco_padrao,
                          duracao: servico.duracao,
                      },
                  ],
        );
    }

    function ajustarServico(servicoId, campo, valor) {
        setSelecionados((atuais) =>
            atuais.map((item) =>
                item.servico_id === servicoId
                    ? { ...item, [campo]: valor }
                    : item,
            ),
        );
    }

    async function confirmar() {
        setSalvando(true);
        try {
            const resposta = await fetch("/api/agenda", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cliente_id: cliente.id,
                    pet_id: pet.id,
                    ...dados,
                    servicos: selecionados,
                }),
            });
            const resultado = await resposta.json();
            if (!resposta.ok) throw new Error(resultado.erro);
            toast.success("Agendamento realizado com sucesso!");
            setAberto(false);
            window.dispatchEvent(new Event("flooty:agenda-atualizada"));
        } catch (error) {
            toast.error(
                error.message || "Não foi possível salvar o agendamento.",
            );
        } finally {
            setSalvando(false);
        }
    }

    if (!aberto) return null;
    const subtotal = selecionados.reduce(
        (soma, item) => soma + Number(item.valor_cobrado || 0),
        0,
    );
    const desconto = Math.min(
        subtotal,
        Math.max(0, Number(dados.desconto) || 0),
    );
    const taxi = dados.taxi_dog
        ? Math.max(0, Number(dados.valor_taxi) || 0)
        : 0;
    const total = Math.max(0, subtotal - desconto + taxi);
    return (
        <>
            <div className="modal-overlay" onClick={() => setAberto(false)}>
                <div
                    className="modal-content modal-agendamento global-agendamento"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="modal-header">
                        <div>
                            <h3>Novo agendamento</h3>
                            <small>
                                {cliente?.nome || "Selecione o tutor e o pet"}
                            </small>
                        </div>
                        <button
                            className="btn-close-modal"
                            type="button"
                            onClick={() => setAberto(false)}
                        >
                            <span className="material-symbols-rounded">
                                close
                            </span>
                        </button>
                    </div>
                    <div className="stepper-bar">
                        {[
                            "Tutor e pet",
                            "Serviços",
                            "Data e hora",
                            "Revisão",
                        ].map((titulo, index) => (
                            <span
                                className={`step-item ${etapa >= index + 1 ? "active" : ""}`}
                                key={titulo}
                            >
                                {index + 1}. {titulo}
                            </span>
                        ))}
                    </div>
                    <div className="modal-body step-body">
                        {etapa === 1 && (
                            <div className="step-content">
                                <h4>Quem será atendido?</h4>
                                <div className="search-input-container">
                                    <span className="material-symbols-rounded icon-search">
                                        search
                                    </span>
                                    <input
                                        autoFocus
                                        placeholder="Buscar tutor, telefone ou pet"
                                        value={busca}
                                        onChange={(event) =>
                                            setBusca(event.target.value)
                                        }
                                    />
                                </div>
                                <div className="cadastro-cliente-actions">
                                    <button
                                        type="button"
                                        className="btn-cadastro-inline"
                                        onClick={() => setCadastroAberto(true)}
                                    >
                                        <span className="material-symbols-rounded">
                                            person_add
                                        </span>
                                        Cadastrar novo cliente
                                    </button>
                                    <span>
                                        ou selecione um cliente já cadastrado
                                    </span>
                                </div>
                                <div className="busca-clientes-list">
                                    {filtrados.map((tutor) => (
                                        <div
                                            className="cliente-box-item"
                                            key={tutor.id}
                                        >
                                            <strong>{tutor.nome}</strong>
                                            <span className="cliente-phone-badge">
                                                {tutor.telefone}
                                            </span>
                                            <div className="pets-sublist">
                                                {(tutor.pets || []).map(
                                                    (itemPet) => (
                                                        <button
                                                            className="btn-pet-chip"
                                                            type="button"
                                                            key={itemPet.id}
                                                            onClick={() =>
                                                                selecionarPet(
                                                                    itemPet,
                                                                    tutor,
                                                                )
                                                            }
                                                        >
                                                            🐾 {itemPet.nome}{" "}
                                                            <small>
                                                                {itemPet.especie ||
                                                                    "Pet"}
                                                            </small>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {etapa === 2 && (
                            <div className="step-content">
                                <h4>Quais serviços serão realizados?</h4>
                                <div className="servicos-selection-list">
                                    {servicos.map((servico) => {
                                        const selecionado = selecionados.find(
                                            (item) =>
                                                item.servico_id === servico.id,
                                        );
                                        return (
                                            <div
                                                key={servico.id}
                                                className={`servico-card-item ${selecionado ? "selected" : ""}`}
                                            >
                                                <button
                                                    className="servico-select-button"
                                                    type="button"
                                                    onClick={() =>
                                                        alternarServico(servico)
                                                    }
                                                >
                                                    <span className="servico-check">
                                                        {selecionado ? "✓" : ""}
                                                    </span>
                                                    <span>
                                                        <strong>
                                                            {servico.nome}
                                                        </strong>
                                                        <small>
                                                            {servico.duracao}{" "}
                                                            min · R${" "}
                                                            {Number(
                                                                servico.preco_padrao,
                                                            ).toFixed(2)}
                                                        </small>
                                                    </span>
                                                </button>
                                                {selecionado && (
                                                    <div className="servico-ajustes">
                                                        <label>
                                                            Valor
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    selecionado.valor_cobrado
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    ajustarServico(
                                                                        servico.id,
                                                                        "valor_cobrado",
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                        <label>
                                                            Minutos
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                step="1"
                                                                value={
                                                                    selecionado.duracao
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    ajustarServico(
                                                                        servico.id,
                                                                        "duracao",
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="total-bar">
                                    <span>
                                        {selecionados.length} serviço(s)
                                        selecionado(s)
                                    </span>
                                    <strong>
                                        Subtotal: R$ {subtotal.toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        )}
                        {etapa === 3 && (
                            <div className="step-content">
                                <h4>Quando será o atendimento?</h4>
                                <div className="form-grid-2">
                                    <label className="form-group">
                                        Data
                                        <input
                                            type="date"
                                            value={dados.data}
                                            onChange={(event) =>
                                                setDados({
                                                    ...dados,
                                                    data: event.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                    <label className="form-group">
                                        Início
                                        <input
                                            type="time"
                                            value={dados.hora_inicio}
                                            onChange={(event) =>
                                                setDados({
                                                    ...dados,
                                                    hora_inicio:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                    <label className="form-group">
                                        Fim
                                        <input
                                            type="time"
                                            value={dados.hora_fim}
                                            onChange={(event) =>
                                                setDados({
                                                    ...dados,
                                                    hora_fim:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                </div>
                                <label className="form-group">
                                    Observações
                                    <textarea
                                        rows="3"
                                        value={dados.observacoes}
                                        onChange={(event) =>
                                            setDados({
                                                ...dados,
                                                observacoes: event.target.value,
                                            })
                                        }
                                    />
                                </label>
                                <div className="cobranca-grid">
                                    <label className="form-group">
                                        Desconto (R$)
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={dados.desconto}
                                            onChange={(event) =>
                                                setDados({
                                                    ...dados,
                                                    desconto:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                    <label className="taxi-toggle">
                                        <input
                                            type="checkbox"
                                            checked={dados.taxi_dog}
                                            onChange={(event) =>
                                                setDados({
                                                    ...dados,
                                                    taxi_dog:
                                                        event.target.checked,
                                                })
                                            }
                                        />
                                        <span>
                                            <strong>Adicionar Taxi Dog</strong>
                                            <small>Transporte do pet</small>
                                        </span>
                                    </label>
                                    {dados.taxi_dog && (
                                        <label className="form-group">
                                            Valor do Taxi Dog
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={dados.valor_taxi}
                                                onChange={(event) =>
                                                    setDados({
                                                        ...dados,
                                                        valor_taxi:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}
                        {etapa === 4 && (
                            <div className="step-content resumo-box">
                                <h4>Confira antes de confirmar</h4>
                                <div className="resumo-item">
                                    <span>Tutor</span>
                                    <strong>{cliente?.nome}</strong>
                                </div>
                                <div className="resumo-item">
                                    <span>Pet</span>
                                    <strong>{pet?.nome}</strong>
                                </div>
                                <div className="resumo-item">
                                    <span>Quando</span>
                                    <strong>
                                        {dados.data} · {dados.hora_inicio} às{" "}
                                        {dados.hora_fim}
                                    </strong>
                                </div>
                                <div className="resumo-item">
                                    <span>Subtotal</span>
                                    <strong>R$ {subtotal.toFixed(2)}</strong>
                                </div>
                                <div className="resumo-item">
                                    <span>Desconto</span>
                                    <strong>- R$ {desconto.toFixed(2)}</strong>
                                </div>
                                {dados.taxi_dog && (
                                    <div className="resumo-item">
                                        <span>Taxi Dog</span>
                                        <strong>+ R$ {taxi.toFixed(2)}</strong>
                                    </div>
                                )}
                                <div className="resumo-item resumo-total-final">
                                    <span>Total</span>
                                    <strong>R$ {total.toFixed(2)}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer footer-stepper">
                        {etapa > 1 && (
                            <button
                                className="btn-secondary"
                                type="button"
                                onClick={() => setEtapa(etapa - 1)}
                            >
                                Voltar
                            </button>
                        )}
                        {etapa < 4 ? (
                            <button
                                className="btn-modal-primary"
                                type="button"
                                disabled={etapa === 2 && !selecionados.length}
                                onClick={() => setEtapa(etapa + 1)}
                            >
                                Continuar
                            </button>
                        ) : (
                            <button
                                className="btn-modal-primary btn-confirm"
                                type="button"
                                disabled={salvando}
                                onClick={confirmar}
                            >
                                {salvando
                                    ? "Salvando..."
                                    : "Confirmar agendamento"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <ModalCadastroCliente
                aberto={cadastroAberto}
                onClose={() => setCadastroAberto(false)}
                onSuccess={clienteCadastrado}
            />
        </>
    );
}
