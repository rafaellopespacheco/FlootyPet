import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "../styles/modalCadastroCliente.css";

export default function ModalCadastroPet({ aberto, onClose, onSave, petData }) {
    const [racas, setRacas] = useState([]);
    const [checklist, setChecklist] = useState({
        cores: [],
        perfumes: [],
        enfeites: [],
        shampoos: []
    });

    const [formData, setFormData] = useState({
        nome: "",
        datanasc: "",
        especie: "",
        raca_id: "",
        porte: "",
        tamanhopelo: "",
        peso: "",
        cor: "",
        sexo: "",
        castrado: "",
        perfume: "",
        enfeites: "",
        shampoo: "",
        cuidados_especiais: "",
        obs: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!aberto) return;

        async function carregarDados() {
            try {
                const [resRacas, resChecklist] = await Promise.all([
                    fetch("/api/racas"),
                    fetch("/api/config/checklist?checklist_tipo=agendado")
                ]);

                if (resRacas.ok && resChecklist.ok) {
                    const dadosRacas = await resRacas.json();
                    const dadosChecklist = await resChecklist.json();

                    setRacas(dadosRacas);
                    setChecklist({
                        cores: dadosChecklist.filter(c => c.categoria === "cores"),
                        perfumes: dadosChecklist.filter(c => c.categoria === "perfume"),
                        enfeites: dadosChecklist.filter(c => c.categoria === "enfeites"),
                        shampoos: dadosChecklist.filter(c => c.categoria === "shampoo")
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar dados do modal de pet:", err);
                toast.error("Erro ao carregar dados do formulário do pet");
            }
        }

        carregarDados();
    }, [aberto]);

    useEffect(() => {
        if (aberto && petData) {
            let castradoVal = "";
            if (petData.castrado === 1 || petData.castrado === "sim" || petData.castrado === true) {
                castradoVal = "sim";
            } else if (petData.castrado === 0 || petData.castrado === "não" || petData.castrado === false) {
                castradoVal = "não";
            }

            setFormData({
                nome: petData.nome || "",
                datanasc: petData.datanasc || "",
                especie: petData.especie ? String(petData.especie) : "",
                raca_id: petData.raca_id ? String(petData.raca_id) : "",
                porte: petData.porte || "",
                tamanhopelo: petData.tamanhopelo || "",
                peso: petData.peso ? `${petData.peso.toFixed(2).replace(".", ",")} kg` : "",
                cor: petData.cor || "",
                sexo: petData.sexo || "",
                castrado: castradoVal,
                perfume: petData.perfume || "",
                enfeites: petData.enfeites || "",
                shampoo: petData.shampoo || "",
                cuidados_especiais: petData.cuidados_especiais || "",
                obs: petData.obs || ""
            });
        } else {
            setFormData({
                nome: "",
                datanasc: "",
                especie: "",
                raca_id: "",
                porte: "",
                tamanhopelo: "",
                peso: "",
                cor: "",
                sexo: "",
                castrado: "",
                perfume: "",
                enfeites: "",
                shampoo: "",
                cuidados_especiais: "",
                obs: ""
            });
        }
        setErrors({});
    }, [aberto, petData]);

    if (!aberto) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleEspecieChange = (value) => {
        setFormData(prev => ({
            ...prev,
            especie: value,
            raca_id: "",
            porte: "",
            tamanhopelo: ""
        }));
        setErrors(prev => ({
            ...prev,
            especie: false,
            raca_id: false
        }));
    };

    const handleRacaChange = (e) => {
        const racaId = e.target.value;
        const racaSelecionada = racas.find(r => r.id === parseInt(racaId));

        setFormData(prev => {
            const update = {
                ...prev,
                raca_id: racaId
            };
            if (racaSelecionada) {
                if (racaSelecionada.tamanho) update.porte = racaSelecionada.tamanho;
                if (racaSelecionada.tamanhopelo) update.tamanhopelo = racaSelecionada.tamanhopelo;
            }
            return update;
        });

        setErrors(prev => ({
            ...prev,
            raca_id: false,
            porte: false,
            tamanhopelo: false
        }));
    };

    const handlePesoChange = (e) => {
        let cleanValue = e.target.value.replace(/\D/g, "");
        if (cleanValue === "" || cleanValue === "0" || cleanValue === "00") {
            setFormData(prev => ({ ...prev, peso: "" }));
            return;
        }
        let numero = (parseInt(cleanValue) / 100).toFixed(2);
        const formatado = `${numero.replace(".", ",")} kg`;

        setFormData(prev => ({ ...prev, peso: formatado }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let formularioValido = true;
        const novosErros = {};

        const obrigatorios = ["nome", "especie", "raca_id", "porte", "tamanhopelo", "sexo"];
        obrigatorios.forEach(campo => {
            if (!formData[campo] || String(formData[campo]).trim() === "") {
                novosErros[campo] = true;
                formularioValido = false;
            }
        });

        if (!formularioValido) {
            setErrors(novosErros);
            toast.warning("Preencha os campos obrigatórios corretamente.");
            return;
        }

        const pesoNumerico = formData.peso
            ? parseFloat(formData.peso.replace(" kg", "").replace(",", "."))
            : null;

        let castradoVal = null;
        if (formData.castrado === "sim") castradoVal = 1;
        if (formData.castrado === "não") castradoVal = 0;

        const racaObj = racas.find(r => r.id === parseInt(formData.raca_id));
        const racaText = racaObj ? racaObj.nome : "";

        const dadosProntos = {
            nome: formData.nome.trim(),
            datanasc: formData.datanasc,
            especie: formData.especie,
            raca_id: parseInt(formData.raca_id),
            raca: racaText,
            porte: formData.porte,
            tamanhopelo: formData.tamanhopelo,
            peso: pesoNumerico,
            sexo: formData.sexo,
            castrado: castradoVal,
            obs: formData.obs.trim(),
            perfume: formData.perfume,
            enfeites: formData.enfeites,
            shampoo: formData.shampoo,
            cor: formData.cor,
            cuidados_especiais: formData.cuidados_especiais.trim()
        };

        if (petData && petData.tempId !== undefined) {
            dadosProntos.tempId = petData.tempId;
        }

        onSave(dadosProntos);
    };

    const racasFiltradas = racas.filter(r => r.especie_id === parseInt(formData.especie));

    return (
        <div className="container-modal-addcliente" style={{ zIndex: 10050 }}>
            <div className="modal-addcliente">
                <div className="modal-header">
                    <h2>{petData ? "Editar pet" : "Cadastrar novo pet"}</h2>
                    <button type="button" id="fechar-modal" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form className="modal-body" onSubmit={handleFormSubmit} id="form-cadastro-pet">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">Nome do pet *</label>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label>Espécie *</label>
                            <div className={`radio-container-group ${errors.especie ? "input-error" : ""}`}>
                                <label>
                                    <input
                                        type="radio"
                                        name="especie"
                                        value="1"
                                        checked={formData.especie === "1"}
                                        onChange={() => handleEspecieChange("1")}
                                    />
                                    Cachorro
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="especie"
                                        value="2"
                                        checked={formData.especie === "2"}
                                        onChange={() => handleEspecieChange("2")}
                                    />
                                    Gato
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="raca_id">Raça *</label>
                            <select
                                name="raca_id"
                                id="raca_id"
                                value={formData.raca_id}
                                onChange={handleRacaChange}
                                disabled={!formData.especie}
                                className={errors.raca_id ? "input-error" : ""}
                                required
                            >
                                <option value="">
                                    {!formData.especie ? "Selecione a espécie primeiro" : "Selecione a raça..."}
                                </option>
                                {racasFiltradas.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="porte">Porte *</label>
                            <select
                                name="porte"
                                id="porte"
                                value={formData.porte}
                                onChange={handleInputChange}
                                className={errors.porte ? "input-error" : ""}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="micro">Micro</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="médio">Médio</option>
                                <option value="grande">Grande</option>
                                <option value="gigante">Gigante</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tamanhopelo">Tamanho do Pelo *</label>
                            <select
                                name="tamanhopelo"
                                id="tamanhopelo"
                                value={formData.tamanhopelo}
                                onChange={handleInputChange}
                                className={errors.tamanhopelo ? "input-error" : ""}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="curto">Curto</option>
                                <option value="médio">Médio</option>
                                <option value="longo">Longo</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="peso">Peso</label>
                            <input
                                type="text"
                                name="peso"
                                id="peso"
                                value={formData.peso}
                                onChange={handlePesoChange}
                                placeholder="0,00 kg"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cor">Cor</label>
                            <select
                                name="cor"
                                id="cor"
                                value={formData.cor}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                {checklist.cores.map(opt => (
                                    <option key={opt.id} value={opt.valor}>
                                        {opt.valor}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Sexo *</label>
                            <div className={`radio-container-group ${errors.sexo ? "input-error" : ""}`}>
                                <label>
                                    <input
                                        type="radio"
                                        name="sexo"
                                        value="macho"
                                        checked={formData.sexo === "macho"}
                                        onChange={() => setFormData(p => ({ ...p, sexo: "macho" }))}
                                    />
                                    Macho
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="sexo"
                                        value="fêmea"
                                        checked={formData.sexo === "fêmea"}
                                        onChange={() => setFormData(p => ({ ...p, sexo: "fêmea" }))}
                                    />
                                    Fêmea
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Castrado?</label>
                            <div className="radio-container-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="castrado"
                                        value="sim"
                                        checked={formData.castrado === "sim"}
                                        onChange={() => setFormData(p => ({ ...p, castrado: "sim" }))}
                                    />
                                    Sim
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="castrado"
                                        value="não"
                                        checked={formData.castrado === "não"}
                                        onChange={() => setFormData(p => ({ ...p, castrado: "não" }))}
                                    />
                                    Não
                                </label>
                            </div>
                        </div>
                    </div>

                    <h3
                        style={{
                            marginTop: "15px",
                            marginBottom: "5px",
                            color: "var(--text-color)",
                            fontSize: "1.1rem",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "5px"
                        }}
                    >
                        Checklist Padrão (Agendamento)
                    </h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="perfume">Perfume</label>
                            <select
                                name="perfume"
                                id="perfume"
                                value={formData.perfume}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                {checklist.perfumes.map(opt => (
                                    <option key={opt.id} value={opt.valor}>
                                        {opt.valor}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="enfeites">Adicionais (Enfeites)</label>
                            <select
                                name="enfeites"
                                id="enfeites"
                                value={formData.enfeites}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                {checklist.enfeites.map(opt => (
                                    <option key={opt.id} value={opt.valor}>
                                        {opt.valor}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="shampoo">Shampoo</label>
                            <select
                                name="shampoo"
                                id="shampoo"
                                value={formData.shampoo}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione...</option>
                                {checklist.shampoos.map(opt => (
                                    <option key={opt.id} value={opt.valor}>
                                        {opt.valor}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cuidados_especiais">Cuidados Especiais (Interno)</label>
                            <input
                                type="text"
                                name="cuidados_especiais"
                                id="cuidados_especiais"
                                value={formData.cuidados_especiais}
                                onChange={handleInputChange}
                                placeholder="Ex: Cuidado com a orelha direita"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="obs">Observação</label>
                        <textarea
                            name="obs"
                            id="obs"
                            rows="3"
                            value={formData.obs}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
                <div className="modal-footer">
                    <button type="submit" form="form-cadastro-pet" className="button" id="cadastrar-button">
                        {petData ? "Salvar alterações" : "Cadastrar pet"}
                    </button>
                </div>
            </div>
        </div>
    );
}