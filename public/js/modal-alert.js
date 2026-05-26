let containerAlert = document.querySelector('.container-alerts');

if (!containerAlert) {
    containerAlert = document.createElement('div');
    containerAlert.classList.add('container-alerts');
    document.body.appendChild(containerAlert);
}


export function sendAlertModal(tipo, text = '') {
    const iconsFontsGoogle = document.createElement("link");
    iconsFontsGoogle.rel = "stylesheet";
    iconsFontsGoogle.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";

    document.head.appendChild(iconsFontsGoogle);

    const icons = {
        error: "cancel",
        success: "check_circle",
        warning: "error",
    };

    const style = document.createElement("style");
    style.innerHTML = `
* {
    margin: 0;
}

.container-alerts {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 9999;
}

.material-symbols-rounded {
    font-variation-settings: 'FILL' 1;
}

.container-modal-alert {
    opacity: 1;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #d32f2f;
    min-width: 300px;
    font-size: 1.2em;
    border-radius: 10px;
    color: #ffffff;
    overflow: hidden;
    transition: opacity .2s;
}

.container-modal-alert.success {
    background-color: #2e7d32;   
}

.container-modal-alert.warning {
    background-color: #ed6c02; 
}

.alert-main {
    padding: 15px;
    display: flex;
    gap: 10px;
    align-items: center;
}

@keyframes cooldown {
    from { width: 100%; }
    to { width: 0%; }
}

.alert-cooldown {
    width: 100%;
    height: 7px;
    background-color: #9a0007;
    animation: cooldown 5s linear forwards;
}

.alert-cooldown.success {
    background-color: #145a1f;
}

.alert-cooldown.warning {
    background-color: #b45300;
}`;
    document.head.appendChild(style);

    const notificacao = document.createElement("div");
    notificacao.classList.add("container-modal-alert", tipo);
    notificacao.innerHTML = `
        <div class="alert-main">
            <span class="material-symbols-rounded">${icons[tipo]}</span><p>${text}</p>
        </div>
        <div class="alert-cooldown ${tipo}"></div>`;

    containerAlert.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.opacity = 0;
        setTimeout(() => {
            notificacao.remove();
        }, 200);
    }, 5000);
}
