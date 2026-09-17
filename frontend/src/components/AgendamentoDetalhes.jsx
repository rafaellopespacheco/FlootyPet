import { useState } from "react";
import { toast } from "sonner";

const statusAgenda = [
    "Agendado",
    "Confirmado",
    "Em atendimento",
    "Finalizado",
    "Cancelado",
];

export default function AgendamentoDetalhes({ item, onClose, onUpdated }) {
    const [salvando, setSalvando] = useState(false);

    async function atualizar(url, body) {
        setSalvando(true);
        try {
            const resposta = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const dados = await resposta.json();
            if (!resposta.ok) throw new Error(dados.erro);
            onUpdated({ ...item, ...body });
            toast.success("Atualização salva.");
        } catch (error) {
            toast.error(error.message || "Não foi possível salvar.");
        } finally {
            setSalvando(false);
        }
    }

    const endereco = [
        item.cliente_logradouro,
        item.cliente_numero,
        item.cliente_bairro,
        item.cliente_cidade,
        item.cliente_uf,
    ]
        .filter(Boolean)
        .join(", ");
    const subtotal = (item.servicos || []).reduce(
        (total, servico) => total + Number(servico.valor || 0),
        0,
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="agendamento-detalhes"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="detalhes-header">
                    <div>
                        <span className="detalhes-kicker">
                            AGENDAMENTO #{item.id}
                        </span>
                        <h2>{item.pet_nome}</h2>
                        <p>
                            {item.pet_raca || "Raça não informada"} ·{" "}
                            {item.pet_especie || "Pet"}
                        </p>
                    </div>
                    <button
                        className="btn-close-modal"
                        type="button"
                        onClick={onClose}
                    >
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div className="detalhes-grid">
                    <section>
                        <h3>Cliente</h3>
                        <strong>{item.cliente_nome}</strong>
                        <p>{item.cliente_telefone}</p>
                        <p>{endereco || "Endereço não informado"}</p>
                        <a
                            href={`/clientes/${item.cliente_id}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Abrir cadastro do pet{" "}
                            <span className="material-symbols-rounded">
                                open_in_new
                            </span>
                        </a>
                    </section>
                    <section>
                        <h3>Atendimento</h3>
                        <p>
                            <b>Data:</b> {item.data}
                        </p>
                        <p>
                            <b>Horário:</b> {item.hora_inicio} às{" "}
                            {item.hora_fim}
                        </p>
                        <label>
                            Status
                            <select
                                disabled={salvando}
                                value={item.status || "Agendado"}
                                onChange={(event) =>
                                    atualizar(`/api/agenda/${item.id}/status`, {
                                        status: event.target.value,
                                    })
                                }
                            >
                                {statusAgenda.map((status) => (
                                    <option key={status}>{status}</option>
                                ))}
                            </select>
                        </label>
                    </section>
                    <section>
                        <h3>Serviços e fatura</h3>
                        {(item.servicos || []).map((servico) => (
                            <div className="detalhe-servico" key={servico.id}>
                                <span>{servico.nome}</span>
                                <b>R$ {Number(servico.valor).toFixed(2)}</b>
                            </div>
                        ))}
                        <div className="detalhe-fatura">
                            <span>Subtotal</span>
                            <b>R$ {subtotal.toFixed(2)}</b>
                            <span>Desconto</span>
                            <b>- R$ {Number(item.desconto || 0).toFixed(2)}</b>
                            {item.taxi_dog ? (
                                <>
                                    <span>Taxi Dog</span>
                                    <b>
                                        + R${" "}
                                        {Number(item.valor_taxi || 0).toFixed(
                                            2,
                                        )}
                                    </b>
                                </>
                            ) : null}
                            <strong>Total</strong>
                            <strong>
                                R$ {Number(item.valor_total || 0).toFixed(2)}
                            </strong>
                        </div>
                        <label>
                            Status do pagamento
                            <select
                                disabled={salvando}
                                value={item.status_pagamento || "Pendente"}
                                onChange={(event) =>
                                    atualizar(
                                        `/api/agenda/${item.id}/pagamento`,
                                        {
                                            status_pagamento:
                                                event.target.value,
                                        },
                                    )
                                }
                            >
                                <option>Pendente</option>
                                <option>Parcial</option>
                                <option>Pago</option>
                            </select>
                        </label>
                    </section>
                </div>
            </div>
        </div>
    );
}
