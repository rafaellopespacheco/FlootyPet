import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner"; // Sonner substituindo o antigo modal-alert

import ModalPet from "../components/ModalCadastroPet"; 
import ConfirmacaoModal from "../components/ConfirmacaoModal"; // Importação do novo modal
import '../styles/info-cliente.css';
import { useNavigate } from "react-router-dom";

// =========================
// FORMATADORES & VALIDATORS
// =========================
function formatarCPF(valor = "") {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 11);
    if (valor.length > 9) {
        return valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        return valor.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (valor.length > 3) {
        return valor.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    }
    return valor;
}

function formatarTelefone(valor = "") {
    let numeros = valor.replace(/\D/g, "");
    if (numeros.startsWith("55")) {
        numeros = numeros.slice(2);
    }
    numeros = numeros.slice(0, 11);
    let formatado = "+55 ";
    if (numeros.length > 0) {
        formatado += `(${numeros.slice(0, 2)}`;
        if (numeros.length >= 2) {
            formatado += ") ";
        }
    }
    if (numeros.length > 2) {
        formatado += numeros.slice(2, 7);
    }
    if (numeros.length > 7) {
        formatado += "-" + numeros.slice(7, 11);
    }
    return formatado;
}

function formatarCEP(valor = "") {
    valor = valor.replace(/\D/g, "");
    valor = valor.slice(0, 8);
    if (valor.length > 5) {
        return valor.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    }
    return valor;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

export default function InfoCliente() {
    const clienteId = window.location.pathname.split("/").pop();

    // Estados de UI
    const [activeTab, setActiveTab] = useState("informacoes");
    const [carregando, setCarregando] = useState(true);
    const [nomeTop, setNomeTop] = useState("Carregando...");
    const [pets, setPets] = useState([]);

    // Estados do Modal do Pet
    const [isModalPetOpen, setIsModalPetOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);

    // Estados do Modal de Confirmação
    const [confirmacao, setConfirmacao] = useState({ isOpen: false, texto: "", resolve: null });

    // Estado do Formulário do Cliente
    const [form, setForm] = useState({
        id: "--",
        nome: "",
        telefone: "+55 ",
        cpf: "",
        datanasc: "",
        cep: "",
        uf: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        obs: ""
    });

    // Função auxiliar que recria o comportamento com Promises em React
    const requisitarConfirmacao = (texto) => {
        return new Promise((resolve) => {
            setConfirmacao({
                isOpen: true,
                texto,
                resolve
            });
        });
    };

    const handleConfirmarAcao = () => {
        if (confirmacao.resolve) confirmacao.resolve(true);
        setConfirmacao({ isOpen: false, texto: "", resolve: null });
    };

    const handleCancelarAcao = () => {
        if (confirmacao.resolve) confirmacao.resolve(false);
        setConfirmacao({ isOpen: false, texto: "", resolve: null });
    };

    // Monitorar inputs e aplicar máscaras
    const handleChange = (e) => {
        const { id, value } = e.target;
        let valorFormatado = value;

        if (id === "cpf") valorFormatado = formatarCPF(value);
        if (id === "telefone") valorFormatado = formatarTelefone(value);
        if (id === "cep") valorFormatado = formatarCEP(value);

        setForm(prev => ({ ...prev, [id]: valorFormatado }));
    };

    // CEP API fetch
    const handleCepBlurAndFetch = async (cepDigitado) => {
        const cep = cepDigitado.replace(/\D/g, "");
        if (cep.length !== 8) return;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                toast.warning("CEP não encontrado.");
                return;
            }

            setForm(prev => ({
                ...prev,
                logradouro: dados.logradouro || "",
                bairro: dados.bairro || "",
                cidade: dados.localidade || "",
                uf: dados.uf || ""
            }));
        } catch {
            toast.error("Erro ao buscar CEP.");
        }
    };

    useEffect(() => {
        if (form.cep.replace(/\D/g, "").length === 8) {
            handleCepBlurAndFetch(form.cep);
        }
    }, [form.cep]);

    const atualizarListaPets = async () => {
        try {
            const resPets = await fetch(`/api/clientes/${clienteId}/pets`);
            const dadosPets = await resPets.json();
            if (dadosPets && !dadosPets.erro) {
                setPets(dadosPets);
            }
        } catch {
            console.error("Erro ao atualizar lista de pets.");
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        async function carregarDados() {
            try {
                const resCliente = await fetch(`/api/clientes/${clienteId}`);
                if (!resCliente.ok) throw new Error();
                const cliente = await resCliente.json();

                setNomeTop(cliente.nome || "Cliente");
                setForm({
                    id: cliente.id,
                    nome: cliente.nome || "",
                    telefone: formatarTelefone(cliente.telefone || ""),
                    cpf: formatarCPF(cliente.cpf || ""),
                    datanasc: cliente.datanasc || "",
                    cep: formatarCEP(cliente.cep || ""),
                    uf: cliente.uf || "",
                    logradouro: cliente.logradouro || "",
                    bairro: cliente.bairro || "",
                    cidade: cliente.cidade || "",
                    obs: cliente.obs || ""
                });

                await atualizarListaPets();

                const urlParams = new URLSearchParams(window.location.search);
                const petEditId = urlParams.get("pet_edit");
                if (petEditId) {
                    handleAbrirModalEdicao(parseInt(petEditId));
                }

            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar dados.");
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [clienteId]);

    // Salvar Cliente
    const handleSalvarCliente = async () => {
        const dados = {
            nome: form.nome.trim(),
            telefone: form.telefone.replace(/\D/g, ""),
            cpf: form.cpf.replace(/\D/g, ""),
            datanasc: form.datanasc,
            cep: form.cep.replace(/\D/g, ""),
            uf: form.uf.trim(),
            logradouro: form.logradouro.trim(),
            bairro: form.bairro.trim(),
            cidade: form.cidade.trim(),
            obs: form.obs.trim(),
        };

        if (!dados.nome) {
            toast.warning("Nome obrigatório.");
            return;
        }

        if (dados.telefone?.length < 12) {
            toast.warning("Telefone inválido.");
            return;
        }

        if (dados.cpf && !validarCPF(dados.cpf)) {
            toast.warning("CPF inválido.");
            return;
        }

        try {
            const resposta = await fetch(`/api/clientes/${clienteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resultado = await resposta.json();
            toast.success(resultado.mensagem || "Cliente atualizado com sucesso!");
            setNomeTop(dados.nome || "Cliente");
        } catch {
            toast.error("Erro ao salvar alterações.");
        }
    };

    // Remover Cliente
    const navigate = useNavigate()
    const handleRemoverCliente = async () => {
        const confirm = await requisitarConfirmacao(
            "Atenção! Você está prestes a remover um cliente do seu sistema, essa ação é irreversível, tem certeza que deseja continuar?"
        );

        if (!confirm) return;

        try {
            await fetch(`/api/clientes/${clienteId}`, { method: "DELETE" });
            toast.success("Cliente deletado com sucesso!");
            navigate("/clientes", {
            replace: true
        })
        } catch {
            toast.error("Erro ao deletar cliente.");
        }
    };

    // Modal Pets
    const handleAbrirModalCadastro = () => {
        setSelectedPetId(null);
        setIsModalPetOpen(true);
    };

    const handleAbrirModalEdicao = (petId) => {
        setSelectedPetId(petId);
        setIsModalPetOpen(true);
    };

    const handleSalvarModalPet = (dados) => {
        toast.success(dados.mensagem || "Pet salvo com sucesso!");
        setIsModalPetOpen(false);
        atualizarListaPets();
    };

    // Excluir Pet
    const handleExcluirPet = async (e, pet) => {
        e.stopPropagation();
        const confirm = await requisitarConfirmacao(
            `Você está prestes a apagar o pet ${pet.nome}, tem certeza que deseja apagar? Essa ação será irreversível.`
        );
        if (!confirm) return;

        try {
            const resposta = await fetch(`/api/clientes/${pet.id}/pets`, { method: "DELETE" });
            const dado = await resposta.json();

            if (dado.erro) {
                return toast.error(dado.erro);
            }

            setPets(prev => prev.filter(p => p.id !== pet.id));
            toast.success(dado.mensagem);
        } catch {
            toast.error("Erro ao excluir o pet.");
        }
    };

    return (
        <div className="cliente-container">
            <div className="tabs">
                <button 
                    className={`tab-button ${activeTab === "informacoes" ? "active" : ""}`} 
                    onClick={() => setActiveTab("informacoes")}
                >
                    Informações
                </button>
                <button 
                    className={`tab-button ${activeTab === "pets" ? "active" : ""}`} 
                    onClick={() => setActiveTab("pets")}
                >
                    Pets
                </button>
            </div>

            {/* Tab: Informações */}
            <div className={`tab-content ${activeTab === "informacoes" ? "active" : ""}`}>
                <div className="cliente-card">
                    <div className="cliente-top">
                        <div>
                            <h2>{nomeTop}</h2>
                            <p className="cliente-id">Cliente #{form.id}</p>
                        </div>
                        <div className="cliente-actions">
                            <button className="button-save" onClick={handleSalvarCliente}>
                                <span className="material-symbols-rounded">save</span>
                                Salvar alterações
                            </button>
                            <button className="button-remove" onClick={handleRemoverCliente}>
                                <span className="material-symbols-rounded">delete</span>
                                Remover
                            </button>
                        </div>
                    </div>
                    
                    <div className="cliente-grid">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" id="nome" value={form.nome} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" id="telefone" value={form.telefone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>CPF</label>
                            <input type="text" id="cpf" value={form.cpf} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Data de nascimento</label>
                            <input type="date" id="datanasc" value={form.datanasc} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>CEP</label>
                            <input type="text" id="cep" value={form.cep} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>UF</label>
                            <input type="text" id="uf" value={form.uf} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>Endereço</label>
                            <input type="text" id="logradouro" value={form.logradouro} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Bairro</label>
                            <input type="text" id="bairro" value={form.bairro} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Cidade</label>
                            <input type="text" id="cidade" value={form.cidade} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>Observação</label>
                            <textarea id="obs" value={form.obs} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab: Pets */}
            <div className={`tab-content ${activeTab === "pets" ? "active" : ""}`}>
                <div className="pets-grid">
                    {pets.map((pet) => (
                        <div 
                            key={pet.id} 
                            className={`pet-card ${pet.sexo === 'fêmea' ? 'card-femea' : 'card-macho'}`}
                        >
                            <div className="pet-card-inner">
                                <div className="pet-avatar-container">
                                    <img 
                                        src={`/assets/icons/${pet.especie === '2' ? 'cat.png' : 'dog.png'}`} 
                                        className="pet-avatar-main" 
                                        alt={pet.nome} 
                                    />
                                    <span className={`pet-gender-badge ${pet.sexo === 'fêmea' ? 'femea' : 'macho'}`}>
                                        {pet.sexo === 'fêmea' ? '🎀' : '👔'}
                                    </span>
                                </div>
                                <div className="pet-details-content">
                                    <div className="pet-title-row">
                                        <h3>{pet.nome}</h3>
                                        <span className="pet-status-pill">{pet.status || 'Ativo'}</span>
                                    </div>
                                    <p className="pet-subtitle-raca">{pet.raca || 'Sem raça definida'}</p>
                                    
                                    <div className="pet-meta-grid">
                                        <span className="pet-meta-item">
                                            <span className="material-symbols-rounded">straighten</span> {pet.porte || '-'}
                                        </span>
                                        <span className="pet-meta-item">
                                            <span className="material-symbols-rounded">pets</span> {pet.tamanhopelo || '-'}
                                        </span>
                                        {pet.peso && (
                                            <span className="pet-meta-item">
                                                <span className="material-symbols-rounded">monitor_weight</span> {pet.peso.toFixed(2).replace('.', ',')} kg
                                            </span>
                                        )}
                                        {pet.cor && (
                                            <span className="pet-meta-item">
                                                <span className="material-symbols-rounded">palette</span> {pet.cor}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {(pet.perfume || pet.enfeites || pet.shampoo) && (
                                        <div className="pet-checklist-summary">
                                            {pet.perfume && <span className="chk-badge" title="Perfume Padrão">🌸 {pet.perfume}</span>}
                                            {pet.enfeites && <span className="chk-badge" title="Enfeites Padrão">🎀 {pet.enfeites}</span>}
                                            {pet.shampoo && <span className="chk-badge" title="Shampoo Padrão">🧼 {pet.shampoo}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="pet-card-actions">
                                    <button 
                                        className="button-icon-edit control-edit" 
                                        title="Editar Pet"
                                        onClick={() => handleAbrirModalEdicao(pet.id)}
                                    >
                                        <span className="material-symbols-rounded">edit</span>
                                    </button>
                                    <button 
                                        className="button-icon-delete control-remove" 
                                        title="Excluir Pet"
                                        onClick={(e) => handleExcluirPet(e, pet)}
                                    >
                                        <span className="material-symbols-rounded">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="button" id="add-pet" onClick={handleAbrirModalCadastro}>
                        <div className="pet-card add-pet-card">
                            <span className="material-symbols-rounded">add_circle</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Modal de Pets do React */}
            {isModalPetOpen && (
                <ModalPet 
                    clienteId={clienteId}
                    petId={selectedPetId}
                    onClose={() => setIsModalPetOpen(false)}
                    onSave={handleSalvarModalPet}
                />
            )}

            {/* Modal de Confirmação do React */}
            {confirmacao.isOpen && (
                <ConfirmacaoModal 
                    texto={confirmacao.texto}
                    onConfirm={handleConfirmarAcao}
                    onCancel={handleCancelarAcao}
                />
            )}
        </div>
    );
}