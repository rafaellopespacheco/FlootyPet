// ==============================
//            LOGOUT
// ==============================

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener("click", () => {
    fetch("/api/logout", {
        method: "GET",
    })
        .then((res) => res.json())
        .then((data) => window.location.href = "/");
})

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

// ==============================
//      HEADER INFO DO USER
// ==============================

const nomeDisplay = document.querySelector(".conta-nome")
const emailDisplay = document.querySelector(".conta-email")

if (nomeDisplay && emailDisplay) {
    fetch("/api/me")
        .then(resposta => resposta.json())
        .then(dados => {
            nomeDisplay.textContent = dados.nome;
            emailDisplay.textContent = dados.email;
        })
}