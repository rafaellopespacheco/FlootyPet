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
        dados.forEach((pet) => {
            const card = document.createElement("div");
            card.classList.add("pet-card");
            card.innerHTML = `
            <div class="pet-header">
                <img src="/assets/icons/dog.png">
                <div>
                    <h3>${pet.nome}</h3>
                    <p>${pet.raca}</p>
                </div>
            </div>
            <div class="pet-main">
                <div class="pet-badge">
                    ${pet.sexo}
                </div>
                <div class="pet-control">   
                    <button class="button control-button control-edit" data-id="${pet.id}">Editar</button>
                    <button class="button control-button control-remove" data-id="${pet.id}">Remover</button>
                </div>
            </div>`;
            const addPetCard = document.getElementById("add-pet");
            petContainer.insertBefore(card, addPetCard);

            card.addEventListener("click", () => {
                const controlContainer = card.querySelector(".pet-control");
                controlContainer.classList.add("active");
            });

            const buttonEdit = card.querySelector(".control-edit");
            const buttonRemove = card.querySelector(".control-remove");

            buttonRemove.addEventListener("click", async () => {
                const confirm = await confirmacaoModal(
                    `Você está prestes a apagar o pet ${pet.nome}, tem certeza que deseja apagar? Essa ação será irreversível.`,
                );
                if (!confirm) return;

                fetch(`/api/clientes/${clienteId}/pets`, {
                    method: "DELETE",
                })
                    .then((resposta) => resposta.json())
                    .then((dado) => {
                        if (dado.erro)
                            return sendAlertModal("error", dado.erro);
                        card.remove();
                        sendAlertModal("sucess", dado.mensagem);
                    });
            });
        });
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
        sendAlertModal("sucess", resultado.mensagem || "Cliente atualizado.");
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
        sendAlertModal("sucess", "Cliente deletado com sucesso!");
    });

// =========================
// CADASTRAR PET
// =========================

const abrirModalCadastroPet = document.getElementById("add-pet");
const fecharModalCadastroPet = document.getElementById("fechar-modal");

async function criarModalCadastroPet() {
    let racas = [];
    try {
        const resposta = await fetch("/api/racas");
        racas = await resposta.json();
    } catch (err) {
        console.error("Erro ao buscar raças da API:", err);
    }

    const modal = document.createElement("div");

    modal.innerHTML = `
        <div class="container-modal-addcliente">
            <div class="modal-addcliente">
                <div class="modal-header">
                    <h2>Cadastrar novo pet</h2>
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
                            <label for="peso">Peso *</label>
                            <input type="text" name="peso" id="peso" placeholder="0,00 kg" required>
                        </div>
                        <div class="form-group">
                            <label>Sexo *</label>
                            <div class="radio-container-group" id="grupo-sexo">
                                <label><input type="radio" name="sexo" value="macho" required> Macho</label>
                                <label><input type="radio" name="sexo" value="fêmea" required> Fêmea</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Castrado? *</label>
                            <div class="radio-container-group" id="grupo-castrado">
                                <label><input type="radio" name="castrado" value="sim" required> Sim</label>
                                <label><input type="radio" name="castrado" value="não" required> Não</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="obs">Observação</label>
                        <textarea name="obs" id="obs" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="button" id="cadastrar-button">Cadastrar pet</button>
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
    let apagandoPeso = false;
    inputPeso.addEventListener("keydown", function (e) {
        apagandoPeso = e.key === "Backspace";
    });

    inputPeso.addEventListener("input", function () {
        let valor = inputPeso.value.replace(/\D/g, "");
        if (apagandoPeso && (valor.length === 0 || valor === "0")) {
            inputPeso.value = "";
            return;
        }
        if (valor === "") return;
        let numero = (parseInt(valor) / 100).toFixed(2);
        inputPeso.value = `${numero.replace(".", ",")} kg`;
    });

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
    const buttonCadastrarPet = document.getElementById("cadastrar-button");
    buttonCadastrarPet.addEventListener("click", function () {
        let formularioValido = true;

        const inputsTexto = modal.querySelectorAll(
            "input[type='text'], input[type='date'], select",
        );

        // Validação de inputs padrão e selects
        inputsTexto.forEach((input) => {
            if (input.hasAttribute("required") && input.value.trim() === "") {
                input.classList.add("input-error");
                formularioValido = false;
            } else {
                input.classList.remove("input-error");
            }
        });

        // Validação Inteligente dos Radio Groups Customizados
        const gruposRadio = ["especie", "sexo", "castrado"];
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

        // Fluxo de envio caso esteja tudo OK
        const pesoRaw = modal.querySelector("#peso").value;
        const pesoNumerico = parseFloat(
            pesoRaw.replace(" kg", "").replace(",", "."),
        );

        const dadosProntos = {
            nome: modal.querySelector("#nome").value.trim(),
            datanasc: modal.querySelector("#datanasc").value,
            especie: modal.querySelector('input[name="especie"]:checked').value,
            raca_id: parseInt(selectRaca.value),
            porte: selectPorte.value,
            tamanhopelo: selectPelo.value,
            peso: pesoNumerico,
            sexo: modal.querySelector('input[name="sexo"]:checked').value,
            castrado:
                modal.querySelector('input[name="castrado"]:checked').value ===
                "sim",
            obs: modal.querySelector("#obs").value.trim(),
        };

        fetch(`/api/clientes/${clienteId}/pets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosProntos),
        })
            .then((res) => res.json())
            .then((dados) => {
                modal.remove();
                if (typeof sendAlertModal === "function") {
                    sendAlertModal(
                        "sucess",
                        dados.mensagem || "Pet cadastrado com sucesso!",
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                if (typeof sendAlertModal === "function") {
                    sendAlertModal("error", "Erro ao cadastrar o pet.");
                }
            });
    });

    modal.querySelector("#fechar-modal").addEventListener("click", function () {
        modal.remove();
    });
}

abrirModalCadastroPet.addEventListener("click", criarModalCadastroPet);