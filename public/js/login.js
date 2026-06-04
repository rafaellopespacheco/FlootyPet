const form = document.getElementById('form-login');
import { sendAlertModal } from "./modal-alert.js";

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const email = document.getElementById('email');
    const password = document.getElementById('senha');

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.erro) {
                sendAlertModal('error', dados.erro)
            } else {
                window.location.href = "/clientes";
            }

        })
    
})