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
                    <a href="/clientes/${cliente.id}"></a>
                    <button type="button"><span class="material-symbols-rounded">calendar_add_on</span></button>
                    <button type="button"><span class="material-symbols-rounded">person</span></button>
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
                        <label for="nome">Nome</label>
                        <input type="text" name="nome" id="nome">
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
                        <label for="telefone">Telefone</label>
                        <input type="tel" name="telefone" id="telefone">
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
    const buttonCadastrarCliente = document.getElementById("cadastrar-button");
    buttonCadastrarCliente.addEventListener('click', function () {
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const datanasc = document.getElementById('datanasc').value;
        const telefone = document.getElementById('telefone').value;
        const obs = document.getElementById('obs').value;
        const cep = document.getElementById('cep').value;
        const uf = document.getElementById('uf').value;
        const endereco = document.getElementById('endereco').value;
        const bairro = document.getElementById('bairro').value;
        const cidade = document.getElementById('cidade').value;
        
        fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                datanasc: datanasc,
                numero: telefone,
                obs: obs,
                logradouro: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf
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