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
                <td>${cliente.nome}</td>
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
                            <input type="text" name="cpf" id="cpf">
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
    inputTelefone.value = '+55 ';

    inputTelefone.addEventListener("input", function () {
        let numeros = inputTelefone.value.replace(/\D/g, "");

        if (numeros.startsWith("55")) {
            numeros = numeros.slice(2);
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

        inputTelefone.value = valorFormatado;
    });

    const buttonCadastrarCliente = document.getElementById("cadastrar-button");

    buttonCadastrarCliente.addEventListener('click', function () {
        const inputs = modal.querySelectorAll('input, textarea');

        let formularioValido = true;

        const dadosFormulario = {};

        inputs.forEach(input => {
            const valor = input.value.trim();
            const campo = input.id;
            
            dadosFormulario[campo] = valor;

            let campoInvalido = false;

            if (input.hasAttribute("required") && valor === "") {
                formularioValido = false;
                campoInvalido = true;
            }

            if (campo === "telefone" && valor === "+55") {
                formularioValido = false;
                campoInvalido = true;
            }

            if (campoInvalido) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "";
            }
        });

        if (!formularioValido) {
            sendAlertModal('warning', 'Preencha os campos obrigatórios');

            return;
        }
        
        console.log(dadosFormulario)
        
        fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: dadosFormulario.nome,
                cpf: dadosFormulario.cpf,
                datanasc: dadosFormulario.datanasc,
                numero: dadosFormulario.telefone.replace(/\D/g, ''),
                obs: dadosFormulario.obs,
                logradouro: dadosFormulario.endereco,
                bairro: dadosFormulario.bairro,
                cidade: dadosFormulario.cidade,
                uf: dadosFormulario.uf
            }),
        }).then(resposta => {
            return resposta.json()
        }).then(dados => {
            modal.remove()
            sendAlertModal('sucess', dados.mensagem)
        }).catch(err => {
            sendAlertModal('error', 'Erro ao cadastrar cliente.')
        });
    })

    const fecharModalCadastro = document.getElementById("fechar-modal");
    fecharModalCadastro.addEventListener('click', function () {
        modal.remove()
    })
}   

abrirModalCadastro.addEventListener("click", criarModalCadastro);