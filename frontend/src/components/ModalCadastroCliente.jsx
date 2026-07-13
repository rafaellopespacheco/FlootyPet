import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ModalCadastroPet from "./ModalCadastroPet";
import "../styles/modalCadastroCliente.css";

export default function ModalCadastroCliente({ aberto, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        datanasc: "",
        telefone: "+55 ",
        obs: "",
        cep: "",
        uf: "",
        numero: "",
        complemento: "",
        endereco: "",
        bairro: "",
        cidade: ""
    });

    const [petsAdicionados, setPetsAdicionados] = useState([]);
    const [petModalAberto, setPetModalAberto] = useState(false);
    const [editingPetIndex, setEditingPetIndex] = useState(null);
    const [errors, setErrors] = useState({});

    // Resetar estado quando o modal abre/fecha
    useEffect(() => {
        if (aberto) {
            setFormData({
                nome: "",
                cpf: "",
                datanasc: "",
                telefone: "+55 ",
                obs: "",
                cep: "",
                uf: "",
                numero: "",
                complemento: "",
                endereco: "",
                bairro: "",
                cidade: ""
            });
            setPetsAdicionados([]);
            setErrors({});
        }
    }, [aberto]);

    if (!aberto) return null;

    // Função de validação de CPF
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    // Máscara de CPF
    const handleCpfChange = (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.slice(0, 11);

        if (valor.length > 9) {
            valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
        } else if (valor.length > 6) {
            valor = valor.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        } else if (valor.length > 3) {
            valor = valor.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
        }

        setFormData(prev => ({ ...prev, cpf: valor }));
        if (errors.cpf) {
            setErrors(prev => ({ ...prev, cpf: false }));
        }
    };

    // Máscara de Telefone
    const handleTelefoneChange = (e) => {
        let value = e.target.value;
        let numeros = value.replace(/\D/g, "");

        if (numeros.startsWith("55")) {
            numeros = numeros.slice(2);
        }

        // Se o usuário apagar tudo, mantém o prefixo
        if (value.length < 4) {
            setFormData(prev => ({ ...prev, telefone: "+55 " }));
            return;
        }

        numeros = numeros.slice(0, 11);

        let valorFormatado = "+55 ";
        if (numeros.length > 0) {
            valorFormatado += `(${numeros.slice(0, 2)}`;
            if (numeros.length >= 2) {
                valorFormatado += ") ";
            }
        }
        if (numeros.length > 2) {
            valorFormatado += numeros.slice(2, 7);
        }
        if (numeros.length > 7) {
            valorFormatado += "-" + numeros.slice(7, 11);
        }

        setFormData(prev => ({ ...prev, telefone: valorFormatado }));
        if (errors.telefone) {
            setErrors(prev => ({ ...prev, telefone: false }));
        }
    };

    // Máscara de CEP e Busca de Endereço via ViaCEP
    const handleCepChange = async (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = valor.slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
        }

        setFormData(prev => ({ ...prev, cep: valor }));

        const cepPuro = valor.replace(/\D/g, "");
        if (cepPuro.length === 8) {
            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cepPuro}/json/`);
                const dados = await resposta.json();

                if (dados.erro) {
                    toast.warning("CEP não encontrado.");
                    return;
                }

                setFormData(prev => ({
                    ...prev,
                    endereco: dados.logradouro || "",
                    bairro: dados.bairro || "",
                    cidade: dados.localidade || "",
                    uf: dados.uf || ""
                }));
            } catch (err) {
                toast.error("Erro ao buscar CEP.");
            }
        }
    };

    // Salvar pet temporário vindo do modal de pet
    const handleSavePet = (dadosPet) => {
        if (editingPetIndex !== null) {
            // Edição
            setPetsAdicionados(prev => {
                const novos = [...prev];
                novos[editingPetIndex] = dadosPet;
                return novos;
            });
        } else {
            // Cadastro
            setPetsAdicionados(prev => [...prev, dadosPet]);
        }
        setPetModalAberto(false);
        setEditingPetIndex(null);
    };

    // Abrir modal de pet para edição
    const handleEditPetClick = (index) => {
        setEditingPetIndex(index);
        setPetModalAberto(true);
    };

    // Remover pet temporário da lista
    const handleRemovePetClick = (index) => {
        setPetsAdicionados(prev => prev.filter((_, i) => i !== index));
    };

    // Validação e Envio de Cliente e seus Pets
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let formularioValido = true;
        const novosErros = {};

        // Validar Nome
        if (!formData.nome.trim()) {
            novosErros.nome = true;
            formularioValido = false;
        }

        // Validar Telefone
        const telefoneNumeros = formData.telefone.replace(/\D/g, "");
        if (telefoneNumeros === "55" || telefoneNumeros.length < 12) {
            novosErros.telefone = true;
            formularioValido = false;
        }

        // Validar CPF
        const cpfNumeros = formData.cpf.replace(/\D/g, "");
        if (cpfNumeros !== "" && !validarCPF(cpfNumeros)) {
            novosErros.cpf = true;
            formularioValido = false;
        }

        if (!formularioValido) {
            setErrors(novosErros);
            toast.warning("Preencha os campos obrigatórios corretamente.");
            return;
        }

        try {
            const response = await fetch("/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: formData.nome.trim(),
                    cpf: cpfNumeros,
                    datanasc: formData.datanasc,
                    telefone: telefoneNumeros,
                    obs: formData.obs,
                    cep: formData.cep.replace(/\D/g, ""),
                    numero: formData.numero,
                    complemento: formData.complemento,
                    logradouro: formData.endereco,
                    bairro: formData.bairro,
                    cidade: formData.cidade,
                    uf: formData.uf
                })
            });

            const dadosCliente = await response.json();

            if (dadosCliente.erro) {
                throw new Error(dadosCliente.erro);
            }

            const clienteId = dadosCliente.id;

            // Se existirem pets, salvá-los sequencialmente
            if (petsAdicionados.length > 0) {
                const petPromises = petsAdicionados.map(pet => {
                    return fetch(`/api/clientes/${clienteId}/pets`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            nome: pet.nome,
                            datanasc: pet.datanasc,
                            especie: pet.especie,
                            raca_id: pet.raca_id,
                            porte: pet.porte,
                            tamanhopelo: pet.tamanhopelo,
                            peso: pet.peso,
                            sexo: pet.sexo,
                            castrado: pet.castrado,
                            obs: pet.obs,
                            perfume: pet.perfume,
                            enfeites: pet.enfeites,
                            shampoo: pet.shampoo,
                            cor: pet.cor,
                            cuidados_especiais: pet.cuidados_especiais
                        })
                    }).then(r => r.json());
                });

                await Promise.all(petPromises);
            }

            toast.success("Cliente cadastrado com sucesso!");
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Erro ao cadastrar cliente.");
        }
    };

    return (
        <>
            <div className="container-modal-addcliente">
                <div className="modal-addcliente">
                    <div className="modal-header">
                        <h2>Cadastrar novo cliente</h2>
                        <button type="button" id="fechar-modal" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <form className="modal-body" onSubmit={handleFormSubmit} id="form-cadastro-cliente">
                        <div className="form-group">
                            <label htmlFor="nome">Nome *</label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                className={errors.nome ? "input-error" : ""}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cpf">CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    id="cpf"
                                    value={formData.cpf}
                                    onChange={handleCpfChange}
                                    maxLength={14}
                                    className={errors.cpf ? "input-error" : ""}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="datanasc">Data de nascimento</label>
                                <input
                                    type="date"
                                    name="datanasc"
                                    id="datanasc"
                                    value={formData.datanasc}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefone">Telefone *</label>
                            <input
                                type="tel"
                                name="telefone"
                                id="telefone"
                                value={formData.telefone}
                                onChange={handleTelefoneChange}
                                className={errors.telefone ? "input-error" : ""}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="obs">Observação</label>
                            <textarea
                                name="obs"
                                id="obs"
                                value={formData.obs}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cep">CEP</label>
                                <input
                                    type="text"
                                    name="cep"
                                    id="cep"
                                    value={formData.cep}
                                    onChange={handleCepChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="uf">UF</label>
                                <input
                                    type="text"
                                    name="uf"
                                    id="uf"
                                    value={formData.uf}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="numero">Número</label>
                                <input
                                    type="text"
                                    name="numero"
                                    id="numero"
                                    value={formData.numero}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="complemento">Complemento</label>
                                <input
                                    type="text"
                                    name="complemento"
                                    id="complemento"
                                    value={formData.complemento}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="endereco">Endereço</label>
                            <input
                                type="text"
                                name="endereco"
                                id="endereco"
                                value={formData.endereco}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bairro">Bairro</label>
                                <input
                                    type="text"
                                    name="bairro"
                                    id="bairro"
                                    value={formData.bairro}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    id="cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <h3
                            style={{
                                marginTop: "20px",
                                marginBottom: "5px",
                                color: "#444",
                                fontSize: "1.1rem",
                                borderBottom: "1px solid #eee",
                                paddingBottom: "5px"
                            }}
                        >
                            Pets deste Cliente
                        </h3>
                        <div
                            className="pets-list-cadastro"
                            id="pets-list-cadastro"
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                marginBottom: "15px",
                                marginTop: "5px"
                            }}
                        >
                            {petsAdicionados.length === 0 ? (
                                <span
                                    className="sem-pets-temp"
                                    style={{
                                        color: "#999",
                                        fontStyle: "italic",
                                        fontSize: "0.9rem"
                                    }}
                                >
                                    Nenhum pet adicionado ainda.
                                </span>
                            ) : (
                                petsAdicionados.map((pet, index) => (
                                    <div className="pet-temp-card" key={index}>
                                        <div className="pet-temp-avatar-wrapper">
                                            <img
                                                src={`/assets/icons/${pet.especie === "2" ? "cat.png" : "dog.png"}`}
                                                className="pet-temp-avatar-img"
                                                alt="Avatar pet"
                                            />
                                            <span
                                                className={`pet-temp-badge-gender ${
                                                    pet.sexo === "fêmea" ? "femea" : "macho"
                                                }`}
                                            >
                                                {pet.sexo === "fêmea" ? "🎀" : "👔"}
                                            </span>
                                        </div>
                                        <div className="pet-temp-info">
                                            <span className="pet-temp-name">{pet.nome}</span>
                                            <span className="pet-temp-raca">{pet.raca || "Sem raça definida"}</span>
                                        </div>
                                        <div className="pet-temp-actions">
                                            <button
                                                type="button"
                                                className="btn-edit-temp"
                                                title="Editar Pet"
                                                onClick={() => handleEditPetClick(index)}
                                            >
                                                <span className="material-symbols-rounded">edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-delete-temp"
                                                title="Remover Pet"
                                                onClick={() => handleRemovePetClick(index)}
                                            >
                                                <span className="material-symbols-rounded">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            type="button"
                            className="button"
                            id="btn-add-pet-cadastro"
                            onClick={() => {
                                setEditingPetIndex(null);
                                setPetModalAberto(true);
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                alignSelf: "flex-start",
                                backgroundColor: "#f0f0f3",
                                color: "#333",
                                border: "1px solid #ccc",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
                                add_circle
                            </span>{" "}
                            Adicionar Pet
                        </button>
                    </form>
                    <div className="modal-footer">
                        <button type="submit" form="form-cadastro-cliente" className="button" id="cadastrar-button">
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de cadastro/edição de Pet */}
            <ModalCadastroPet
                aberto={petModalAberto}
                onClose={() => {
                    setPetModalAberto(false);
                    setEditingPetIndex(null);
                }}
                onSave={handleSavePet}
                petData={editingPetIndex !== null ? petsAdicionados[editingPetIndex] : null}
            />
        </>
    );
}