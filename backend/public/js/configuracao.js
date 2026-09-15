import { sendAlertModal } from "/js/modal-alert.js";
import { confirmacaoModal } from "/js/modal-confirmacao.js";

// =========================
// TABS NAVIGATION
// =========================
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// =========================
// GESTÃO DE CHECKLIST
// =========================
const listPerfume = document.getElementById("list-perfume");
const listEnfeites = document.getElementById("list-enfeites");
const listShampoo = document.getElementById("list-shampoo");
const listCores = document.getElementById("list-cores");

const inputPerfume = document.getElementById("new-perfume");
const inputEnfeite = document.getElementById("new-enfeite");
const inputShampoo = document.getElementById("new-shampoo");
const inputCor = document.getElementById("new-cor");

const btnAddPerfume = document.getElementById("btn-add-perfume");
const btnAddEnfeite = document.getElementById("btn-add-enfeite");
const btnAddShampoo = document.getElementById("btn-add-shampoo");
const btnAddCor = document.getElementById("btn-add-cor");

async function carregarChecklists() {
    try {
        const resposta = await fetch("/api/config/checklist?checklist_tipo=agendado");
        const itens = await resposta.json();

        // Limpar listas
        listPerfume.innerHTML = "";
        listEnfeites.innerHTML = "";
        listShampoo.innerHTML = "";
        listCores.innerHTML = "";

        itens.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.valor}</span>
                <button type="button" class="btn-delete-option" data-id="${item.id}">
                    <span class="material-symbols-rounded">delete</span>
                </button>
            `;

            // Vincular evento de exclusão
            li.querySelector(".btn-delete-option").addEventListener("click", async () => {
                const confirm = await confirmacaoModal(`Tem certeza que deseja remover a opção "${item.valor}"?`);
                if (!confirm) return;

                try {
                    const resDelete = await fetch(`/api/config/checklist/${item.id}`, { method: "DELETE" });
                    const resJson = await resDelete.json();
                    if (resDelete.ok) {
                        sendAlertModal("success", resJson.mensagem || "Removido com sucesso!");
                        carregarChecklists();
                    } else {
                        sendAlertModal("error", resJson.erro || "Erro ao remover.");
                    }
                } catch {
                    sendAlertModal("error", "Erro de conexão com o servidor.");
                }
            });

            if (item.categoria === "perfume") {
                listPerfume.appendChild(li);
            } else if (item.categoria === "enfeites") {
                listEnfeites.appendChild(li);
            } else if (item.categoria === "shampoo") {
                listShampoo.appendChild(li);
            } else if (item.categoria === "cores") {
                listCores.appendChild(li);
            }
        });
    } catch (err) {
        console.error("Erro ao carregar checklist:", err);
    }
}

async function adicionarOpcaoChecklist(categoria, valor, inputElement) {
    const val = valor.trim();
    if (!val) {
        sendAlertModal("warning", "O valor não pode ser vazio.");
        return;
    }

    try {
        const resposta = await fetch("/api/config/checklist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                checklist_tipo: "agendado",
                categoria: categoria,
                valor: val
            })
        });

        const dados = await resposta.json();
        if (resposta.ok) {
            sendAlertModal("success", dados.mensagem || "Opção adicionada com sucesso!");
            inputElement.value = "";
            carregarChecklists();
        } else {
            sendAlertModal("error", dados.erro || "Erro ao cadastrar.");
        }
    } catch {
        sendAlertModal("error", "Erro ao conectar com o servidor.");
    }
}

btnAddPerfume.addEventListener("click", () => adicionarOpcaoChecklist("perfume", inputPerfume.value, inputPerfume));
btnAddEnfeite.addEventListener("click", () => adicionarOpcaoChecklist("enfeites", inputEnfeite.value, inputEnfeite));
btnAddShampoo.addEventListener("click", () => adicionarOpcaoChecklist("shampoo", inputShampoo.value, inputShampoo));
btnAddCor.addEventListener("click", () => adicionarOpcaoChecklist("cores", inputCor.value, inputCor));

// Permitir adicionar apertando Enter no input
[inputPerfume, inputEnfeite, inputShampoo, inputCor].forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if (input === inputPerfume) btnAddPerfume.click();
            if (input === inputEnfeite) btnAddEnfeite.click();
            if (input === inputShampoo) btnAddShampoo.click();
            if (input === inputCor) btnAddCor.click();
        }
    });
});

// =========================
// GESTÃO DE RAÇAS
// =========================
const formAddRaca = document.getElementById("form-add-raca");
const racaListBody = document.getElementById("raca-list-body");
const filterRacaEspecie = document.getElementById("filter-raca-especie");

let todasRacas = [];

async function carregarRacas() {
    try {
        const resposta = await fetch("/api/racas");
        todasRacas = await resposta.json();
        renderizarRacas();
    } catch (err) {
        console.error("Erro ao carregar raças:", err);
    }
}

function renderizarRacas() {
    racaListBody.innerHTML = "";
    const especieFiltro = filterRacaEspecie.value;

    const filtradas = todasRacas.filter(raca => {
        if (!especieFiltro) return true;
        return raca.especie_id === parseInt(especieFiltro);
    });

    filtradas.forEach((raca) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${raca.nome}</strong></td>
            <td>${raca.especie_id === 1 ? 'Cachorro' : 'Gato'}</td>
            <td>${raca.tamanho || '<span style="color:#aaa;">-</span>'}</td>
            <td>${raca.tamanhopelo || '<span style="color:#aaa;">-</span>'}</td>
            <td>
                <button type="button" class="btn-delete-option btn-delete-raca" data-id="${raca.id}">
                    <span class="material-symbols-rounded">delete</span>
                </button>
            </td>
        `;

        tr.querySelector(".btn-delete-raca").addEventListener("click", async () => {
            const confirm = await confirmacaoModal(`Tem certeza que deseja excluir a raça "${raca.nome}"?`);
            if (!confirm) return;

            try {
                const resDelete = await fetch(`/api/racas/${raca.id}`, { method: "DELETE" });
                const resJson = await resDelete.json();
                if (resDelete.ok) {
                    sendAlertModal("success", resJson.mensagem || "Raça excluída.");
                    carregarRacas();
                } else {
                    sendAlertModal("error", resJson.erro || "Erro ao excluir.");
                }
            } catch {
                sendAlertModal("error", "Erro ao conectar com o servidor.");
            }
        });

        racaListBody.appendChild(tr);
    });
}

filterRacaEspecie.addEventListener("change", renderizarRacas);

formAddRaca.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("raca-nome").value.trim();
    const especie_id = parseInt(formAddRaca.querySelector('input[name="raca-especie"]:checked').value);
    const tamanho = document.getElementById("raca-tamanho").value;
    const tamanhopelo = document.getElementById("raca-pelo").value;

    if (!nome) {
        sendAlertModal("warning", "O nome da raça é obrigatório.");
        return;
    }

    try {
        const resposta = await fetch("/api/racas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, especie_id, tamanho, tamanhopelo })
        });

        const dados = await resposta.json();
        if (resposta.ok) {
            sendAlertModal("success", dados.mensagem || "Raça criada com sucesso!");
            formAddRaca.reset();
            carregarRacas();
        } else {
            sendAlertModal("error", dados.erro || "Erro ao cadastrar raça.");
        }
    } catch {
        sendAlertModal("error", "Erro de rede ao conectar com o servidor.");
    }
});

// =========================
// INICIALIZAÇÃO
// =========================
carregarChecklists();
carregarRacas();
