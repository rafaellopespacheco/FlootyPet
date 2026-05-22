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
    .then(resposta => resposta.json())
    .then(dados => {
        dados.forEach(pet => {
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
            })

            const buttonEdit = card.querySelector(".control-edit");
            const buttonRemove = card.querySelector(".control-remove");
        
            buttonRemove.addEventListener("click", async () => {
                const confirm = await confirmacaoModal(`Você está prestes a apagar o pet ${pet.nome}, tem certeza que deseja apagar? Essa ação será irreversível.`)
                if (!confirm) return

                fetch(`/api/clientes/${clienteId}/pets`, {
                    method: "DELETE"
                })
                    .then(resposta => resposta.json())
                    .then(dado => {
                        if (dado.erro) return sendAlertModal("error", dado.erro);
                        card.remove()
                        sendAlertModal("sucess", dado.mensagem)
                })
            })
        })

        
})

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

document.getElementById("remover-cliente").addEventListener("click", async function () {
    const confirm = await confirmacaoModal(
        "Atenção! Você está prestes a remover um cliente do seu sistema, essa ação é irreversível, tem certeza que deseja continuar?",
    );

    if (!confirm) return;

    fetch(`/api/clientes/${clienteId}`, {
        method: 'DELETE'
    })

    window.location.href = "/clientes";
    sendAlertModal('sucess', 'Cliente deletado com sucesso!')
});
