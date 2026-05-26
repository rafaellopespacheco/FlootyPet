import { sendAlertModal } from "/js/modal-alert.js";
import { confirmacaoModal } from "/js/modal-confirmacao.js";

// =========================
// TABS
// =========================

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
        tabButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        tabContents.forEach((content) => {
            content.classList.remove("active");
        });

        button.classList.add("active");

        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// =========================
// INPUTS
// =========================

const inputNome = document.getElementById("nome");
const inputTelefone = document.getElementById("telefone");
const inputCpf = document.getElementById("cpf");
const inputCep = document.getElementById("cep");
const inputEndereco = document.getElementById("logradouro");
const inputBairro = document.getElementById("bairro");
const inputCidade = document.getElementById("cidade");
const inputUf = document.getElementById("uf");
const inputDataNasc = document.getElementById("datanasc");
const inputObs = document.getElementById("obs");

// =========================
// FORMATADORES
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

// =========================
// VALIDAR CPF
// =========================

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

// =========================
// MÁSCARAS
// =========================

inputTelefone.value = "+55 ";

inputCpf.addEventListener("input", function () {
    inputCpf.value = formatarCPF(inputCpf.value);
});

inputTelefone.addEventListener("input", function () {
    inputTelefone.value = formatarTelefone(inputTelefone.value);
});

inputCep.addEventListener("input", async function () {
    inputCep.value = formatarCEP(inputCep.value);

    const cep = inputCep.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        const dados = await resposta.json();

        if (dados.erro) {
            sendAlertModal("warning", "CEP não encontrado.");

            return;
        }

        inputEndereco.value = dados.logradouro || "";

        inputBairro.value = dados.bairro || "";

        inputCidade.value = dados.localidade || "";

        inputUf.value = dados.uf || "";
    } catch {
        sendAlertModal("error", "Erro ao buscar CEP.");
    }
});

// =========================
// PEGAR ID
// =========================

const clienteId = window.location.pathname.split("/").pop();

// =========================
// FETCH CLIENTE
// =========================

async function carregarCliente() {
    try {
        const resposta = await fetch(`/api/clientes/${clienteId}`);

        if (!resposta.ok) {
            throw new Error();
        }

        const cliente = await resposta.json();

        document.getElementById("cliente-nome-top").textContent =
            cliente.nome || "Cliente";

        document.getElementById("cliente-id").textContent =
            `Cliente #${cliente.id}`;

        inputNome.value = cliente.nome || "";
        inputTelefone.value = formatarTelefone(cliente.telefone || "");
        inputCpf.value = formatarCPF(cliente.cpf || "");
        inputDataNasc.value = cliente.datanasc || "";
        inputCep.value = formatarCEP(cliente.cep || "");
        inputUf.value = cliente.uf || "";
        inputEndereco.value = cliente.logradouro || "";
        inputBairro.value = cliente.bairro || "";
        inputCidade.value = cliente.cidade || "";
        inputObs.value = cliente.obs || "";
    } catch (err) {
        console.error(err);

        sendAlertModal("error", "Erro ao carregar cliente.");
    }
}

carregarCliente();

// =========================
// FETCH PET PERFIL DO CLIENTE
// =========================

const petContainer = document.querySelector(".pets-grid");
fetch(`/api/clientes/${clienteId}/pets`)
    .then((resposta) => resposta.json())
    .then((dados) => {
        if (dados && !dados.erro) {
            dados.forEach((pet) => {
                const card = document.createElement("div");
                card.classList.add("pet-card");
                card.classList.add(pet.sexo === 'fêmea' ? 'card-femea' : 'card-macho');
                
                const checklistHtml = (pet.perfume || pet.enfeites || pet.shampoo) 
                    ? `<div class="pet-checklist-summary">
                        ${pet.perfume ? `<span class="chk-badge" title="Perfume Padrão">🌸 ${pet.perfume}</span>` : ''}
                        ${pet.enfeites ? `<span class="chk-badge" title="Enfeites Padrão">🎀 ${pet.enfeites}</span>` : ''}
                        ${pet.shampoo ? `<span class="chk-badge" title="Shampoo Padrão">🧼 ${pet.shampoo}</span>` : ''}
                       </div>`
                    : '';

                card.innerHTML = `
                <div class="pet-card-inner">
                    <div class="pet-avatar-container">
                        <img src="/assets/icons/${pet.especie === '2' ? 'cat.png' : 'dog.png'}" class="pet-avatar-main">
                        <span class="pet-gender-badge ${pet.sexo === 'fêmea' ? 'femea' : 'macho'}">
                            ${pet.sexo === 'fêmea' ? '🎀' : '👔'}
                        </span>
                    </div>
                    <div class="pet-details-content">
                        <div class="pet-title-row">
                            <h3>${pet.nome}</h3>
                            <span class="pet-status-pill">${pet.status || 'Ativo'}</span>
                        </div>
                        <p class="pet-subtitle-raca">${pet.raca || 'Sem raça definida'}</p>
                        
                        <div class="pet-meta-grid">
                            <span class="pet-meta-item"><span class="material-symbols-rounded">straighten</span> ${pet.porte || '-'}</span>
                            <span class="pet-meta-item"><span class="material-symbols-rounded">pets</span> ${pet.tamanhopelo || '-'}</span>
                            ${pet.peso ? `<span class="pet-meta-item"><span class="material-symbols-rounded">monitor_weight</span> ${pet.peso.toFixed(2).replace('.', ',')} kg</span>` : ''}
                            ${pet.cor ? `<span class="pet-meta-item"><span class="material-symbols-rounded">palette</span> ${pet.cor}</span>` : ''}
                        </div>
                        
                        ${checklistHtml}
                    </div>
                    <div class="pet-card-actions">
                        <button class="button-icon-edit control-edit" title="Editar Pet" data-id="${pet.id}">
                            <span class="material-symbols-rounded">edit</span>
                        </button>
                        <button class="button-icon-delete control-remove" title="Excluir Pet" data-id="${pet.id}">
                            <span class="material-symbols-rounded">delete</span>
                        </button>
                    </div>
                </div>`;
                const addPetCard = document.getElementById("add-pet");
                petContainer.insertBefore(card, addPetCard);

                const buttonEdit = card.querySelector(".control-edit");
                const buttonRemove = card.querySelector(".control-remove");

                buttonEdit.addEventListener("click", (e) => {
                    e.stopPropagation();
                    criarModalPet(pet.id);
                });

                buttonRemove.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const confirm = await confirmacaoModal(
                        `Você está prestes a apagar o pet ${pet.nome}, tem certeza que deseja apagar? Essa ação será irreversível.`,
                    );
                    if (!confirm) return;

                    fetch(`/api/clientes/${pet.id}/pets`, { 
                        method: "DELETE",
                    })
                        .then((resposta) => resposta.json())
                        .then((dado) => {
                            if (dado.erro)
                                return sendAlertModal("error", dado.erro);
                            card.remove();
                            sendAlertModal("success", dado.mensagem);
                        });
                });
            });
        }
    });

// =========================
// SALVAR
// =========================

const buttonSalvar = document.getElementById("salvar-cliente");

buttonSalvar.addEventListener("click", async function () {
    const dados = {
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.replace(/\D/g, ""),
        cpf: inputCpf.value.replace(/\D/g, ""),
        datanasc: inputDataNasc.value,
        cep: inputCep.value.replace(/\D/g, ""),
        uf: inputUf.value.trim(),
        logradouro: inputEndereco.value.trim(),
        bairro: inputBairro.value.trim(),
        cidade: inputCidade.value.trim(),
        obs: inputObs.value.trim(),
    };

    if (!dados.nome) {
        sendAlertModal("warning", "Nome obrigatório.");
        return;
    }

    if (dados.telefone?.length < 12) {
        sendAlertModal("warning", "Telefone inválido.");
        return;
    }

    if (dados.cpf && !validarCPF(dados.cpf)) {
        sendAlertModal("warning", "CPF inválido.");
        return;
    }

    try {
        const resposta = await fetch(`/api/clientes/${clienteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();
        sendAlertModal("success", resultado.mensagem || "Cliente atualizado.");
        document.getElementById("cliente-nome-top").textContent =
            dados.nome || "Cliente";
    } catch {
        sendAlertModal("error", "Erro ao salvar alterações.");
    }
});

// =========================
// REMOVER CLIENTE
// =========================

document
    .getElementById("remover-cliente")
    .addEventListener("click", async function () {
        const confirm = await confirmacaoModal(
            "Atenção! Você está prestes a remover um cliente do seu sistema, essa ação é irreversível, tem certeza que deseja continuar?",
        );

        if (!confirm) return;

        fetch(`/api/clientes/${clienteId}`, {
            method: "DELETE",
        });

        window.location.href = "/clientes";
        sendAlertModal("success", "Cliente deletado com sucesso!");
    });

// =========================
// CADASTRAR/EDITAR PET (UNIFICADO)
// =========================

const abrirModalCadastroPet = document.getElementById("add-pet");

async function criarModalPet(petId = null) {
    let racas = [];
    let checklistConfig = [];
    let pet = null;

    try {
        const fetchPromises = [
            fetch("/api/racas"),
            fetch("/api/config/checklist?checklist_tipo=agendado")
        ];
        if (petId) {
            fetchPromises.push(fetch(`/api/pets/${petId}`));
        }

        const responses = await Promise.all(fetchPromises);
        racas = await responses[0].json();
        checklistConfig = await responses[1].json();
        if (petId && responses[2]) {
            pet = await responses[2].json();
        }
    } catch (err) {
        console.error("Erro ao carregar dados para o modal:", err);
    }

    const perfumes = checklistConfig.filter(c => c.categoria === 'perfume');
    const enfeites = checklistConfig.filter(c => c.categoria === 'enfeites');
    const shampoos = checklistConfig.filter(c => c.categoria === 'shampoo');
    const cores = checklistConfig.filter(c => c.categoria === 'cores');

    const modal = document.createElement("div");

    modal.innerHTML = `
        <div class="container-modal-addcliente">
            <div class="modal-addcliente">
                <div class="modal-header">
                    <h2>${pet ? 'Editar pet' : 'Cadastrar novo pet'}</h2>
                    <button type="button" id="fechar-modal">&times;</button>
                </div>
                <div class="modal-body">

                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome">Nome do pet *</label>
                            <input type="text" name="nome" id="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="datanasc">Data de nascimento</label>
                            <input type="date" name="datanasc" id="datanasc">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Espécie *</label>
                            <div class="radio-container-group" id="grupo-especie">
                                <label><input type="radio" name="especie" value="1" required> Cachorro</label>
                                <label><input type="radio" name="especie" value="2" required> Gato</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="raca">Raça *</label>
                            <select name="raca" id="raca" required disabled>
                                <option value="">Selecione a espécie primeiro</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="porte">Porte *</label>
                            <select name="porte" id="porte" required>
                                <option value="">Selecione...</option>
                                <option value="micro">Micro</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="médio">Médio</option>
                                <option value="grande">Grande</option>
                                <option value="gigante">Gigante</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="tamanhopelo">Tamanho do Pelo *</label>
                            <select name="tamanhopelo" id="tamanhopelo" required>
                                <option value="">Selecione...</option>
                                <option value="curto">Curto</option>
                                <option value="médio">Médio</option>
                                <option value="longo">Longo</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="peso">Peso</label>
                            <input type="text" name="peso" id="peso" placeholder="0,00 kg">
                        </div>
                        <div class="form-group">
                            <label for="cor">Cor</label>
                            <select name="cor" id="cor">
                                <option value="">Selecione...</option>
                                ${cores.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Sexo *</label>
                            <div class="radio-container-group" id="grupo-sexo">
                                <label><input type="radio" name="sexo" value="macho" required> Macho</label>
                                <label><input type="radio" name="sexo" value="fêmea" required> Fêmea</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Castrado?</label>
                            <div class="radio-container-group" id="grupo-castrado">
                                <label><input type="radio" name="castrado" value="sim"> Sim</label>
                                <label><input type="radio" name="castrado" value="não"> Não</label>
                            </div>
                        </div>
                    </div>

                    <!-- Checklist de Banho/Tosa Padrão -->
                    <h3 style="margin-top: 15px; margin-bottom: 5px; color: var(--text-color); font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 5px;">Checklist Padrão (Agendamento)</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="perfume">Perfume</label>
                            <select name="perfume" id="perfume">
                                <option value="">Selecione...</option>
                                ${perfumes.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="enfeites">Adicionais (Enfeites)</label>
                            <select name="enfeites" id="enfeites">
                                <option value="">Selecione...</option>
                                ${enfeites.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="shampoo">Shampoo</label>
                            <select name="shampoo" id="shampoo">
                                <option value="">Selecione...</option>
                                ${shampoos.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cuidados_especiais">Cuidados Especiais (Interno)</label>
                            <input type="text" name="cuidados_especiais" id="cuidados_especiais" placeholder="Ex: Cuidado com a orelha direita">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="obs">Observação</label>
                        <textarea name="obs" id="obs" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="button" id="cadastrar-button">${pet ? 'Salvar alterações' : 'Cadastrar pet'}</button>
                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);

    const selectRaca = modal.querySelector("#raca");
    const selectPorte = modal.querySelector("#porte");
    const selectPelo = modal.querySelector("#tamanhopelo");
    const inputPeso = modal.querySelector("#peso");
    const radiosEspecie = modal.querySelectorAll('input[name="especie"]');

    // 1. Alternador de Espécie
    radiosEspecie.forEach((radio) => {
        radio.addEventListener("change", function () {
            const especieSelecionada = parseInt(this.value);
            selectRaca.innerHTML =
                '<option value="">Selecione a raça...</option>';
            selectRaca.disabled = false;

            const racasFiltradas = racas.filter(r => r.especie_id === especieSelecionada);
            racasFiltradas.forEach((raca) => {
                const option = document.createElement("option");
                option.value = raca.id;
                option.textContent = raca.nome;
                selectRaca.appendChild(option);
            });

            // Remove o erro visual se houver ao selecionar
            modal
                .querySelector("#grupo-especie")
                .classList.remove("input-error");
        });
    });

    // Limpeza de erro em tempo real para os outros grupos de rádio
    modal.querySelectorAll(".radio-container-group input").forEach((radio) => {
        radio.addEventListener("change", function () {
            this.closest(".radio-container-group").classList.remove(
                "input-error",
            );
        });
    });

    // 2. Auto-preenchimento por Raça
    selectRaca.addEventListener("change", function () {
        const racaSelecionadaId = parseInt(this.value);

        const racaSelecionada = racas.find(r => r.id === racaSelecionadaId);
        if (racaSelecionada) {
            if (racaSelecionada.tamanho) {
                selectPorte.value = racaSelecionada.tamanho;
                selectPorte.classList.remove("input-error");
            }
            if (racaSelecionada.tamanhopelo) {
                selectPelo.value = racaSelecionada.tamanhopelo;
                selectPelo.classList.remove("input-error");
            }
        }
    });

    // 3. Máscara de Peso com Backspace Funcional
    inputPeso.addEventListener("input", function () {
        let cleanValue = inputPeso.value.replace(/\D/g, "");
        if (cleanValue === "" || cleanValue === "0" || cleanValue === "00") {
            inputPeso.value = "";
            return;
        }
        let numero = (parseInt(cleanValue) / 100).toFixed(2);
        inputPeso.value = `${numero.replace(".", ",")} kg`;
    });

    // Preencher campos se for edição
    if (pet) {
        modal.querySelector("#nome").value = pet.nome || "";
        modal.querySelector("#datanasc").value = pet.datanasc || "";
        
        if (pet.especie) {
            const radioEspecie = modal.querySelector(`input[name="especie"][value="${pet.especie}"]`);
            if (radioEspecie) {
                radioEspecie.checked = true;
                selectRaca.innerHTML = '<option value="">Selecione a raça...</option>';
                selectRaca.disabled = false;
                const racasFiltradas = racas.filter(r => r.especie_id === parseInt(pet.especie));
                racasFiltradas.forEach((raca) => {
                    const option = document.createElement("option");
                    option.value = raca.id;
                    option.textContent = raca.nome;
                    selectRaca.appendChild(option);
                });
            }
        }

        if (pet.raca_id) {
            selectRaca.value = pet.raca_id;
        }
        if (pet.porte) {
            selectPorte.value = pet.porte;
        }
        if (pet.tamanhopelo) {
            selectPelo.value = pet.tamanhopelo;
        }
        if (pet.peso) {
            inputPeso.value = `${pet.peso.toFixed(2).replace(".", ",")} kg`;
        }
        if (pet.sexo) {
            const radioSexo = modal.querySelector(`input[name="sexo"][value="${pet.sexo}"]`);
            if (radioSexo) radioSexo.checked = true;
        }
        if (pet.castrado !== null && pet.castrado !== undefined) {
            const radioCastrado = modal.querySelector(`input[name="castrado"][value="${pet.castrado === 1 ? 'sim' : 'não'}"]`);
            if (radioCastrado) radioCastrado.checked = true;
        }
        modal.querySelector("#perfume").value = pet.perfume || "";
        modal.querySelector("#enfeites").value = pet.enfeites || "";
        modal.querySelector("#shampoo").value = pet.shampoo || "";
        modal.querySelector("#cor").value = pet.cor || "";
        modal.querySelector("#cuidados_especiais").value = pet.cuidados_especiais || "";
        modal.querySelector("#obs").value = pet.obs || "";
    }

    // Remove erro visual ao digitar/mudar campos comuns
    modal
        .querySelectorAll(
            "input[type='text'], input[type='date'], select, textarea",
        )
        .forEach((input) => {
            input.addEventListener("input", function () {
                this.classList.remove("input-error");
            });
            input.addEventListener("change", function () {
                this.classList.remove("input-error");
            });
        });

    // 4. Validação e Envio
    const buttonCadastrarPet = modal.querySelector("#cadastrar-button");
    buttonCadastrarPet.addEventListener("click", function () {
        let formularioValido = true;

        const inputsTexto = modal.querySelectorAll(
            "input[type='text'][required], select[required]",
        );

        // Validação de inputs padrão e selects
        inputsTexto.forEach((input) => {
            if (input.value.trim() === "") {
                input.classList.add("input-error");
                formularioValido = false;
            } else {
                input.classList.remove("input-error");
            }
        });

        // Validação de Radio Groups
        const gruposRadio = ["especie", "sexo"];
        gruposRadio.forEach((grupo) => {
            const checked = modal.querySelector(
                `input[name="${grupo}"]:checked`,
            );
            const containerGrupo = modal.querySelector(`#grupo-${grupo}`);

            if (!checked) {
                containerGrupo.classList.add("input-error");
                formularioValido = false;
            } else {
                containerGrupo.classList.remove("input-error");
            }
        });

        if (!formularioValido) {
            if (typeof sendAlertModal === "function") {
                sendAlertModal(
                    "warning",
                    "Preencha os campos obrigatórios corretamente.",
                );
            } else {
                alert("Preencha todos os campos obrigatórios.");
            }
            return;
        }

        const pesoRaw = modal.querySelector("#peso").value;
        const pesoNumerico = pesoRaw
            ? parseFloat(pesoRaw.replace(" kg", "").replace(",", "."))
            : null;

        const castradoSelecionado = modal.querySelector('input[name="castrado"]:checked');
        const castradoVal = castradoSelecionado
            ? (castradoSelecionado.value === "sim" ? 1 : 0)
            : null;

        const dadosProntos = {
            nome: modal.querySelector("#nome").value.trim(),
            datanasc: modal.querySelector("#datanasc").value,
            especie: modal.querySelector('input[name="especie"]:checked').value,
            raca_id: parseInt(selectRaca.value),
            porte: selectPorte.value,
            tamanhopelo: selectPelo.value,
            peso: pesoNumerico,
            sexo: modal.querySelector('input[name="sexo"]:checked').value,
            castrado: castradoVal,
            obs: modal.querySelector("#obs").value.trim(),
            perfume: modal.querySelector("#perfume").value,
            enfeites: modal.querySelector("#enfeites").value,
            shampoo: modal.querySelector("#shampoo").value,
            cor: modal.querySelector("#cor").value,
            cuidados_especiais: modal.querySelector("#cuidados_especiais").value.trim()
        };

        const url = pet ? `/api/pets/${pet.id}` : `/api/clientes/${clienteId}/pets`;
        const method = pet ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosProntos),
        })
            .then((res) => res.json())
            .then((dados) => {
                modal.remove();
                if (typeof sendAlertModal === "function") {
                    sendAlertModal(
                        "success",
                        dados.mensagem || "Salvo com sucesso!",
                    );
                }
                setTimeout(() => {
                    window.location.href = window.location.pathname;
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
                if (typeof sendAlertModal === "function") {
                    sendAlertModal("error", "Erro ao salvar o pet.");
                }
            });
    });

    modal.querySelector("#fechar-modal").addEventListener("click", function () {
        modal.remove();
        if (window.location.search.includes("pet_edit")) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
        }
    });
}

abrirModalCadastroPet.addEventListener("click", () => criarModalPet());

// Verificar se há parâmetro pet_edit na URL para abrir automaticamente o modal
const urlParams = new URLSearchParams(window.location.search);
const petEditId = urlParams.get("pet_edit");
if (petEditId) {
    criarModalPet(parseInt(petEditId));
}