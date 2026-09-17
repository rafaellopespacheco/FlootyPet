import { useEffect, useState } from "react";
import { toast } from "sonner";
import "../styles/config-servicos.css";

const servicoVazio = { nome: "", categoria: "", preco_padrao: "", duracao: "" };
const regraVazia = { nome: "", preco: "", duracao: "", racas: [] };

export default function ConfigServicos() {
    const [servicos, setServicos] = useState([]);
    const [racas, setRacas] = useState([]);
    const [novo, setNovo] = useState(servicoVazio);
    const [rascunho, setRascunho] = useState(regraVazia);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [aberto, setAberto] = useState(null);

    async function carregarDados() {
        setLoading(true);
        try {
            const [servicosResponse, racasResponse] = await Promise.all([
                fetch("/api/servicos/config"),
                fetch("/api/racas"),
            ]);
            if (!servicosResponse.ok || !racasResponse.ok) throw new Error();
            setServicos(await servicosResponse.json());
            setRacas(await racasResponse.json());
        } catch (_) {
            toast.error("Não foi possível carregar os serviços.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function atualizarServico(id, campo, valor) {
        setServicos((atuais) =>
            atuais.map((servico) =>
                servico.id === id ? { ...servico, [campo]: valor } : servico,
            ),
        );
    }

    function atualizarRegra(servicoId, regraId, campo, valor) {
        setServicos((atuais) =>
            atuais.map((servico) =>
                servico.id === servicoId
                    ? {
                          ...servico,
                          regras: servico.regras.map((regra) =>
                              regra.id === regraId
                                  ? { ...regra, [campo]: valor }
                                  : regra,
                          ),
                      }
                    : servico,
            ),
        );
    }

    function alternarRaca(regraId, racaId) {
        setServicos((atuais) =>
            atuais.map((servico) => ({
                ...servico,
                regras: servico.regras.map((regra) =>
                    regra.id === regraId
                        ? {
                              ...regra,
                              racas: regra.racas.some(
                                  (raca) => raca.id === racaId,
                              )
                                  ? regra.racas.filter(
                                        (raca) => raca.id !== racaId,
                                    )
                                  : [
                                        ...regra.racas,
                                        racas.find(
                                            (raca) => raca.id === racaId,
                                        ),
                                    ],
                          }
                        : regra,
                ),
            })),
        );
    }

    function adicionarRegra(servicoId) {
        if (
            !rascunho.nome ||
            !rascunho.preco ||
            !rascunho.duracao ||
            !rascunho.racas.length
        ) {
            toast.error(
                "Informe nome, valores e pelo menos uma raça para a regra.",
            );
            return;
        }
        setServicos((atuais) =>
            atuais.map((servico) =>
                servico.id === servicoId
                    ? {
                          ...servico,
                          regras: [
                              ...servico.regras,
                              { ...rascunho, id: `nova-${Date.now()}` },
                          ],
                      }
                    : servico,
            ),
        );
        setRascunho(regraVazia);
    }

    function removerRegra(servicoId, regraId) {
        setServicos((atuais) =>
            atuais.map((servico) =>
                servico.id === servicoId
                    ? {
                          ...servico,
                          regras: servico.regras.filter(
                              (regra) => regra.id !== regraId,
                          ),
                      }
                    : servico,
            ),
        );
    }

    async function criarServico(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/servicos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novo),
            });
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.erro);
            setServicos((atuais) => [...atuais, resultado]);
            setNovo(servicoVazio);
            setAberto(resultado.id);
            toast.success("Serviço criado com sucesso.");
        } catch (error) {
            toast.error(error.message || "Não foi possível criar o serviço.");
        }
    }

    async function arquivarServico(servico) {
        if (
            !window.confirm(
                `Arquivar o serviço "${servico.nome}"? Ele continuará no histórico, mas não aparecerá em novos agendamentos.`,
            )
        )
            return;
        try {
            const response = await fetch(`/api/servicos/${servico.id}`, {
                method: "DELETE",
            });
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.erro);
            setServicos((atuais) =>
                atuais.map((item) =>
                    item.id === servico.id ? { ...item, ativo: 0 } : item,
                ),
            );
            toast.success(resultado.mensagem);
        } catch (error) {
            toast.error(
                error.message || "Não foi possível arquivar o serviço.",
            );
        }
    }

    async function salvar() {
        setSalvando(true);
        try {
            const response = await fetch("/api/servicos/config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ servicos }),
            });
            const resultado = await response.json();
            if (!response.ok) throw new Error(resultado.erro);
            toast.success(resultado.mensagem);
            await carregarDados();
        } catch (error) {
            toast.error(
                error.message || "Não foi possível salvar os serviços.",
            );
        } finally {
            setSalvando(false);
        }
    }

    if (loading)
        return (
            <div className="config-servicos-page">
                <p>Carregando serviços...</p>
            </div>
        );

    return (
        <div className="config-servicos-page">
            <div className="servicos-intro">
                <div>
                    <h2>Serviços e valores</h2>
                    <p>
                        Crie serviços, defina o padrão e agrupe raças com o
                        mesmo preço e duração.
                    </p>
                </div>
                <button
                    className="button"
                    type="button"
                    onClick={salvar}
                    disabled={salvando}
                >
                    <span className="material-symbols-rounded">save</span>
                    {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>

            <form className="novo-servico-card" onSubmit={criarServico}>
                <div className="novo-servico-titulo">
                    <span className="material-symbols-rounded">add_circle</span>
                    <div>
                        <h3>Novo serviço</h3>
                        <p>
                            Cadastre um serviço sem apagar registros anteriores.
                        </p>
                    </div>
                </div>
                <input
                    placeholder="Nome do serviço"
                    value={novo.nome}
                    onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
                    required
                />
                <input
                    placeholder="Categoria"
                    value={novo.categoria}
                    onChange={(e) =>
                        setNovo({ ...novo, categoria: e.target.value })
                    }
                    required
                />
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Preço padrão"
                    value={novo.preco_padrao}
                    onChange={(e) =>
                        setNovo({ ...novo, preco_padrao: e.target.value })
                    }
                    required
                />
                <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Duração em minutos"
                    value={novo.duracao}
                    onChange={(e) =>
                        setNovo({ ...novo, duracao: e.target.value })
                    }
                    required
                />
                <button className="button" type="submit">
                    <span className="material-symbols-rounded">add</span>Criar
                    serviço
                </button>
            </form>

            <div className="servicos-lista">
                {servicos.map((servico) => {
                    const estaAberto = aberto === servico.id;
                    return (
                        <section
                            className={`servico-config-card ${!servico.ativo ? "servico-arquivado" : ""}`}
                            key={servico.id}
                        >
                            <button
                                className="servico-card-header"
                                type="button"
                                onClick={() =>
                                    setAberto(estaAberto ? null : servico.id)
                                }
                            >
                                <span className="material-symbols-rounded">
                                    {estaAberto ? "expand_less" : "expand_more"}
                                </span>
                                <span className="servico-nome">
                                    {servico.nome}
                                </span>
                                <span className="servico-categoria">
                                    {servico.categoria}
                                </span>
                                {!servico.ativo && (
                                    <span className="servico-status">
                                        Arquivado
                                    </span>
                                )}
                                <span className="servico-resumo">
                                    R$ {Number(servico.preco_padrao).toFixed(2)}{" "}
                                    · {servico.duracao} min
                                </span>
                            </button>
                            {estaAberto && (
                                <div className="servico-card-body">
                                    <div className="servico-padrao">
                                        <h3>Valor padrão</h3>
                                        <label>
                                            Nome
                                            <input
                                                value={servico.nome}
                                                onChange={(e) =>
                                                    atualizarServico(
                                                        servico.id,
                                                        "nome",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                        <label>
                                            Categoria
                                            <input
                                                value={servico.categoria}
                                                onChange={(e) =>
                                                    atualizarServico(
                                                        servico.id,
                                                        "categoria",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                        <label>
                                            Preço (R$)
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={servico.preco_padrao}
                                                onChange={(e) =>
                                                    atualizarServico(
                                                        servico.id,
                                                        "preco_padrao",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                        <label>
                                            Duração (min)
                                            <input
                                                type="number"
                                                min="1"
                                                value={servico.duracao}
                                                onChange={(e) =>
                                                    atualizarServico(
                                                        servico.id,
                                                        "duracao",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                        {servico.ativo && (
                                            <button
                                                className="button button-danger"
                                                type="button"
                                                onClick={() =>
                                                    arquivarServico(servico)
                                                }
                                            >
                                                <span className="material-symbols-rounded">
                                                    archive
                                                </span>
                                                Arquivar serviço
                                            </button>
                                        )}
                                    </div>
                                    <div className="regras-racas">
                                        <div className="regras-heading">
                                            <div>
                                                <h3>
                                                    Regras por grupo de raças
                                                </h3>
                                                <p>
                                                    Uma regra atende várias
                                                    raças com o mesmo preço e
                                                    duração.
                                                </p>
                                            </div>
                                        </div>
                                        {servico.regras.map((regra) => (
                                            <div
                                                className="regra-grupo"
                                                key={regra.id}
                                            >
                                                <div className="regra-grupo-topo">
                                                    <input
                                                        value={regra.nome}
                                                        onChange={(e) =>
                                                            atualizarRegra(
                                                                servico.id,
                                                                regra.id,
                                                                "nome",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="icon-button danger"
                                                        type="button"
                                                        title="Remover regra"
                                                        onClick={() =>
                                                            removerRegra(
                                                                servico.id,
                                                                regra.id,
                                                            )
                                                        }
                                                    >
                                                        <span className="material-symbols-rounded">
                                                            delete
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="racas-chips">
                                                    {regra.racas.map((raca) => (
                                                        <button
                                                            type="button"
                                                            className="raca-chip"
                                                            key={raca.id}
                                                            onClick={() =>
                                                                alternarRaca(
                                                                    regra.id,
                                                                    raca.id,
                                                                )
                                                            }
                                                        >
                                                            {raca.nome}
                                                            <span className="material-symbols-rounded">
                                                                close
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="regra-campos">
                                                    <label>
                                                        Preço (R$)
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={regra.preco}
                                                            onChange={(e) =>
                                                                atualizarRegra(
                                                                    servico.id,
                                                                    regra.id,
                                                                    "preco",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </label>
                                                    <label>
                                                        Duração (min)
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                regra.duracao
                                                            }
                                                            onChange={(e) =>
                                                                atualizarRegra(
                                                                    servico.id,
                                                                    regra.id,
                                                                    "duracao",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </label>
                                                    <label className="raca-select">
                                                        Adicionar raça
                                                        <select
                                                            value=""
                                                            onChange={(e) =>
                                                                e.target
                                                                    .value &&
                                                                alternarRaca(
                                                                    regra.id,
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Selecionar
                                                                raça...
                                                            </option>
                                                            {racas
                                                                .filter(
                                                                    (raca) =>
                                                                        !regra.racas.some(
                                                                            (
                                                                                item,
                                                                            ) =>
                                                                                item.id ===
                                                                                raca.id,
                                                                        ),
                                                                )
                                                                .map((raca) => (
                                                                    <option
                                                                        value={
                                                                            raca.id
                                                                        }
                                                                        key={
                                                                            raca.id
                                                                        }
                                                                    >
                                                                        {
                                                                            raca.nome
                                                                        }
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="nova-regra">
                                            <h4>Adicionar regra</h4>
                                            <div className="regra-campos">
                                                <label>
                                                    Nome do grupo
                                                    <input
                                                        placeholder="Ex.: Pets grandes"
                                                        value={rascunho.nome}
                                                        onChange={(e) =>
                                                            setRascunho({
                                                                ...rascunho,
                                                                nome: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                                <label>
                                                    Preço (R$)
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={rascunho.preco}
                                                        onChange={(e) =>
                                                            setRascunho({
                                                                ...rascunho,
                                                                preco: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                                <label>
                                                    Duração (min)
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={rascunho.duracao}
                                                        onChange={(e) =>
                                                            setRascunho({
                                                                ...rascunho,
                                                                duracao:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </label>
                                                <label className="raca-select">
                                                    Selecionar raça
                                                    <select
                                                        value=""
                                                        onChange={(e) =>
                                                            e.target.value &&
                                                            setRascunho({
                                                                ...rascunho,
                                                                racas: [
                                                                    ...rascunho.racas,
                                                                    racas.find(
                                                                        (
                                                                            raca,
                                                                        ) =>
                                                                            raca.id ===
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                    ),
                                                                ],
                                                            })
                                                        }
                                                    >
                                                        <option value="">
                                                            Selecionar raça...
                                                        </option>
                                                        {racas
                                                            .filter(
                                                                (raca) =>
                                                                    !rascunho.racas.some(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item.id ===
                                                                            raca.id,
                                                                    ),
                                                            )
                                                            .map((raca) => (
                                                                <option
                                                                    value={
                                                                        raca.id
                                                                    }
                                                                    key={
                                                                        raca.id
                                                                    }
                                                                >
                                                                    {raca.nome}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </label>
                                            </div>
                                            <div className="racas-chips">
                                                {rascunho.racas.map((raca) => (
                                                    <button
                                                        type="button"
                                                        className="raca-chip"
                                                        key={raca.id}
                                                        onClick={() =>
                                                            setRascunho({
                                                                ...rascunho,
                                                                racas: rascunho.racas.filter(
                                                                    (item) =>
                                                                        item.id !==
                                                                        raca.id,
                                                                ),
                                                            })
                                                        }
                                                    >
                                                        {raca.nome}
                                                        <span className="material-symbols-rounded">
                                                            close
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                className="button button-small"
                                                type="button"
                                                onClick={() =>
                                                    adicionarRegra(servico.id)
                                                }
                                            >
                                                <span className="material-symbols-rounded">
                                                    add
                                                </span>
                                                Adicionar regra
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
