import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import "../styles/config.css";

const estadoInicial = {
    nome_empresa: "",
    cnpj: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
};

export default function Configuracao() {
    const [dados, setDados] = useState(estadoInicial);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function carregarConfiguracao() {
            try {
                const resposta = await fetch("/api/config/empresa");
                if (!resposta.ok)
                    throw new Error("Falha ao buscar configuração");
                setDados({ ...estadoInicial, ...(await resposta.json()) });
            } catch (error) {
                toast.error("Não foi possível carregar os dados da empresa.");
            } finally {
                setCarregando(false);
            }
        }

        carregarConfiguracao();
    }, []);

    function atualizarCampo(event) {
        const { name, value } = event.target;
        setDados((atual) => ({ ...atual, [name]: value }));
    }

    async function salvar(event) {
        event.preventDefault();
        setSalvando(true);

        try {
            const resposta = await fetch("/api/config/empresa", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            const resultado = await resposta.json();
            if (!resposta.ok) throw new Error(resultado.erro);
            setDados({ ...estadoInicial, ...resultado.dados });
            toast.success(resultado.mensagem);
        } catch (error) {
            toast.error(
                error.message || "Não foi possível salvar a configuração.",
            );
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <div className="config-page">
                <p className="config-status">Carregando configuração...</p>
            </div>
        );
    }

    return (
        <div className="config-page">
            <div className="config-intro">
                <span className="material-symbols-rounded">storefront</span>
                <div>
                    <h2>Dados da empresa</h2>
                    <p>
                        Essas informações identificam o seu pet shop no sistema.
                    </p>
                </div>
                <NavLink
                    className="config-secondary-link"
                    to="/config/servicos"
                >
                    <span className="material-symbols-rounded">sell</span>
                    Configurar serviços
                </NavLink>
            </div>

            <form className="config-form" onSubmit={salvar}>
                <section className="config-section">
                    <div className="config-section-heading">
                        <span className="material-symbols-rounded">
                            business
                        </span>
                        <div>
                            <h3>Informações principais</h3>
                            <p>Cadastre os dados básicos do negócio.</p>
                        </div>
                    </div>
                    <div className="config-fields config-fields-main">
                        <label>
                            Nome da empresa
                            <input
                                name="nome_empresa"
                                value={dados.nome_empresa}
                                onChange={atualizarCampo}
                                required
                            />
                        </label>
                        <label>
                            CNPJ
                            <input
                                name="cnpj"
                                value={dados.cnpj}
                                onChange={atualizarCampo}
                                placeholder="00.000.000/0000-00"
                            />
                        </label>
                    </div>
                </section>

                <section className="config-section">
                    <div className="config-section-heading">
                        <span className="material-symbols-rounded">
                            location_on
                        </span>
                        <div>
                            <h3>Endereço</h3>
                            <p>Localização e dados para contato presencial.</p>
                        </div>
                    </div>
                    <div className="config-fields">
                        <label className="field-small">
                            CEP
                            <input
                                name="cep"
                                value={dados.cep}
                                onChange={atualizarCampo}
                                placeholder="00000-000"
                            />
                        </label>
                        <label className="field-wide">
                            Logradouro
                            <input
                                name="logradouro"
                                value={dados.logradouro}
                                onChange={atualizarCampo}
                            />
                        </label>
                        <label className="field-small">
                            Número
                            <input
                                name="numero"
                                value={dados.numero}
                                onChange={atualizarCampo}
                            />
                        </label>
                        <label>
                            Complemento
                            <input
                                name="complemento"
                                value={dados.complemento}
                                onChange={atualizarCampo}
                            />
                        </label>
                        <label>
                            Bairro
                            <input
                                name="bairro"
                                value={dados.bairro}
                                onChange={atualizarCampo}
                            />
                        </label>
                        <label className="field-wide">
                            Cidade
                            <input
                                name="cidade"
                                value={dados.cidade}
                                onChange={atualizarCampo}
                            />
                        </label>
                        <label className="field-small">
                            UF
                            <input
                                name="uf"
                                maxLength="2"
                                value={dados.uf}
                                onChange={atualizarCampo}
                            />
                        </label>
                    </div>
                </section>

                <div className="config-actions">
                    <button
                        className="button"
                        type="submit"
                        disabled={salvando}
                    >
                        <span className="material-symbols-rounded">save</span>
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}
