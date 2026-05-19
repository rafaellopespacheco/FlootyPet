// FILTER BUTTONS
const filterButtons = document.querySelectorAll('.filter-button');
const filterTodos = document.getElementById('filter-todos');
import { sendAlertModal } from './modal-alert.js';


function toggleFilter(event) {
    const clickedButton = event.currentTarget;
    if (clickedButton == filterTodos) {
        filterButtons.forEach(button => {
            button.classList.remove('filter-active');
        })
        filterTodos.classList.add('filter-active');
        return
    }

    filterTodos.classList.remove('filter-active');
    clickedButton.classList.toggle('filter-active');

    const activeFilters = document.querySelectorAll('.filter-button.filter-active:not(#filter-todos)');

    if (activeFilters.length == 0) {
        filterTodos.classList.add('filter-active');
    }
}

filterButtons.forEach(button => {
    button.addEventListener('click', toggleFilter)
})

// CARREGAR CLIENTES
function formatarTelefone(numero) {
    numero = String(numero).replace(/\D/g, "");

    const ddd = numero.slice(2, 4);
    const primeiraParte = numero.slice(4, 9);
    const segundaParte = numero.slice(9, 13);

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}


fetch('/api/clientes')
    .then(resposta => resposta.json())
    .then(clientes => {
        console.log(clientes);
        const clientesContainer = document.getElementById('clientes');
        
        clientes.forEach(cliente => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><a href="/clientes/${cliente.id}">${cliente.nome}</a></td>
                <td>${formatarTelefone(cliente.numero)}</td>
                <td>Em breve</td>
                <td class="td-acoes">
                <button type="button"><span class="material-symbols-rounded">calendar_add_on</span></button>
                <a href="/clientes/${cliente.id}"><span class="material-symbols-rounded">person</span></a>
                </td>
            `;
            clientesContainer.appendChild(tr);
        })
    })
    .catch(err => {
        console.log(err)
    })

// CADASTRAR CLIENTE

const abrirModalCadastro = document.getElementById("abrir-modal-cadastro");
const fecharModalCadastro = document.getElementById("fechar-modal");

function criarModalCadastro() {
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div class="container-modal-addcliente">
            <div class="modal-addcliente">
                <div class="modal-header">
                    <h2>Cadastrar novo cliente</h2>
                    <button type="button" id="fechar-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="nome">Nome *</label>
                        <input type="text" name="nome" id="nome" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="cpf">CPF</label>
                            <input type="text" name="cpf" id="cpf" maxlength="14">
                        </div>
                        <div class="form-group">
                            <label for="datanasc">Data de nascimento</label>
                            <input type="date" name="datanasc" id="datanasc">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="telefone">Telefone *</label>
                        <input type="tel" name="telefone" id="telefone" required>
                    </div>

                    <div class="form-group">
                        <label for="obs">Observação</label>
                        <textarea name="obs" id="obs"></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="cep">CEP</label>
                            <input type="text" name="cep" id="cep">
                        </div>
                        <div class="form-group">
                            <label for="uf">UF</label>
                            <input type="text" name="uf" id="uf">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="endereco">Endereço</label>
                        <input type="text" name="endereco" id="endereco">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="bairro">Bairro</label>
                            <input type="text" name="bairro" id="bairro">
                        </div>
                        <div class="form-group">
                            <label for="cidade">Cidade</label>
                            <input type="text" name="cidade" id="cidade">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="button" id="cadastrar-button">Cadastrar</button>
                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);

    const inputTelefone = modal.querySelector("#telefone");
    const inputCpf = modal.querySelector("#cpf");
    const inputCep = modal.querySelector("#cep");
    const inputEndereco = modal.querySelector("#endereco");
    const inputBairro = modal.querySelector("#bairro");
    const inputCidade = modal.querySelector("#cidade");
    const inputUf = modal.querySelector("#uf");
    inputTelefone.value = "+55 ";

    let apagandoTelefone = false;

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

    modal.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", function () {
            if (input.style.border === "1px solid red") {
                if (input.id === "telefone") {
                    const numeros = input.value.replace(/\D/g, "");
                    if (numeros.length >= 12) input.style.border = "";
                } else if (input.id === "cpf") {
                    const numeros = input.value.replace(/\D/g, "");
                    if (numeros.length === 0 || validarCPF(numeros))
                        input.style.border = "";
                } else if (input.value.trim() !== "") {
                    input.style.border = "";
                }
            }
        });
    });

    inputCpf.addEventListener("input", function () {
        let valor = inputCpf.value.replace(/\D/g, "");
        valor = valor.slice(0, 11);

        if (valor.length > 9) {
            valor = valor.replace(
                /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
                "$1.$2.$3-$4",
            );
        } else if (valor.length > 6) {
            valor = valor.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        } else if (valor.length > 3) {
            valor = valor.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
        }

        inputCpf.value = valor;
    });

    inputTelefone.addEventListener("keydown", function (e) {
        apagandoTelefone = e.key === "Backspace";
    });

    inputTelefone.addEventListener("input", function () {
        let numeros = inputTelefone.value.replace(/\D/g, "");

        if (numeros.startsWith("55")) {
            numeros = numeros.slice(2);
        }

        if (apagandoTelefone && numeros.length === 0) {
            inputTelefone.value = "+55 ";
            return;
        }

        numeros = numeros.slice(0, 11);

        let valorFormatado = "+55 ";

        if (numeros.length > 0) {
            valorFormatado += `(${numeros.slice(0, 2)}`;

            if (
                numeros.length > 2 ||
                (numeros.length === 2 && !apagandoTelefone)
            ) {
                valorFormatado += ") ";
            }
        }

        if (numeros.length > 2) {
            valorFormatado += numeros.slice(2, 7);
        }

        if (numeros.length > 7) {
            valorFormatado += "-" + numeros.slice(7, 11);
        }

        inputTelefone.value = valorFormatado;
    });

    let ultimoCepBuscado = "";

    inputCep.addEventListener("input", async function () {
        let valor = inputCep.value.replace(/\D/g, "");

        valor = valor.slice(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
        }

        inputCep.value = valor;

        const cep = valor.replace(/\D/g, "");

        if (cep.length !== 8) return;

        if (cep === ultimoCepBuscado) return;

        ultimoCepBuscado = cep;

        try {
            const resposta = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`,
            );

            const dados = await resposta.json();

            if (dados.erro) {
                sendAlertModal("warning", "CEP não encontrado.");

                return;
            }

            inputEndereco.value = dados.logradouro || "";

            inputBairro.value = dados.bairro || "";

            inputCidade.value = dados.localidade || "";

            inputUf.value = dados.uf || "";
        } catch (err) {
            sendAlertModal("error", "Erro ao buscar CEP.");
        }
    });

    const buttonCadastrarCliente = document.getElementById("cadastrar-button");

    buttonCadastrarCliente.addEventListener("click", function () {
        const inputs = modal.querySelectorAll("input, textarea");
        let formularioValido = true;
        const dadosFormulario = {};

        inputs.forEach((input) => {
            const valor = input.value.trim();
            const campo = input.id;

            dadosFormulario[campo] = valor;
            let campoInvalido = false;

            if (input.hasAttribute("required") && valor === "") {
                formularioValido = false;
                campoInvalido = true;
            }

            if (campo === "telefone") {
                const apenasNumeros = valor.replace(/\D/g, "");
                if (apenasNumeros === "55" || apenasNumeros.length < 12) {
                    formularioValido = false;
                    campoInvalido = true;
                }
            }

            if (campo === "cpf" && valor !== "") {
                if (!validarCPF(valor)) {
                    formularioValido = false;
                    campoInvalido = true;
                }
            }

            if (campoInvalido) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "";
            }
        });

        if (!formularioValido) {
            sendAlertModal(
                "warning",
                "Preencha os campos obrigatórios corretamente.",
            );
            return;
        }

        const numeroLimpo = dadosFormulario.telefone.replace(/\D/g, "");
        const cpfLimpo = dadosFormulario.cpf.replace(/\D/g, "");

        fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: dadosFormulario.nome,
                cpf: cpfLimpo,
                datanasc: dadosFormulario.datanasc,
                numero: numeroLimpo,
                obs: dadosFormulario.obs,
                logradouro: dadosFormulario.endereco,
                bairro: dadosFormulario.bairro,
                cidade: dadosFormulario.cidade,
                uf: dadosFormulario.uf,
            }),
        })
            .then((resposta) => {
                return resposta.json();
            })
            .then((dados) => {
                modal.remove();
                sendAlertModal("sucess", dados.mensagem);
            })
            .catch((err) => {
                sendAlertModal("error", "Erro ao cadastrar cliente.");
            });
    });

    const fecharModalCadastro = document.getElementById("fechar-modal");
    fecharModalCadastro.addEventListener("click", function () {
        modal.remove();
    });
}

abrirModalCadastro.addEventListener("click", criarModalCadastro);