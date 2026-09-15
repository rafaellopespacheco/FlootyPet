// =========================
// CONTAINER DOS MODAIS
// =========================

let containerModals = document.querySelector(".container-modals");

if (!containerModals) {
    containerModals = document.createElement("div");
    containerModals.classList.add("container-modals");
    document.body.appendChild(containerModals);
}

// =========================
// STYLE ÚNICO
// =========================

if (!document.querySelector("#confirmacao-modal-style")) {
    const style = document.createElement("style");

    style.id = "confirmacao-modal-style";

    style.innerHTML = `
    
    .container-modals {
        position: fixed;
        inset: 0;
        z-index: 9999;

        pointer-events: none;
    }

    .modal-confirmacao-overlay {
        position: fixed;
        inset: 0;

        background-color: rgba(0,0,0,0.45);

        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Arial, Helvetica, sans-serif;

        animation: fadeIn .15s ease;

        pointer-events: all;
    }

    .modal-confirmacao {
        width: 400px;
        background-color: white;

        border-radius: 12px;

        overflow: hidden;

        box-shadow: 0 15px 35px rgba(0,0,0,0.15);

        animation: aparecer .18s ease;
    }

    .modal-confirmacao-header {
        padding: 20px;
        border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .modal-confirmacao-header h2 {
        color: #151a2d;
        font-size: 1.2em;
    }

    .modal-confirmacao-body {
        padding: 20px;
        color: #555;
        line-height: 1.5;
    }

    .modal-confirmacao-footer {
        padding: 15px 20px;

        display: flex;
        justify-content: flex-end;

        gap: 10px;
    }

    .modal-confirmacao-footer button {
        border: none;
        padding: 12px 18px;

        border-radius: 8px;

        cursor: pointer;

        font-weight: bold;

        transition: .2s;
    }

    .btn-cancelar {
        background-color: #ececec;
        color: #333;
    }

    .btn-cancelar:hover {
        background-color: #dadada;
    }

    .btn-confirmar {
        background-color: #d32f2f;
        color: white;
    }

    .btn-confirmar:hover {
        background-color: #b71c1c;
    }

    @keyframes aparecer {

        from {
            opacity: 0;
            transform: scale(.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }

    }

    @keyframes fadeIn {

        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }

    }

    `;

    document.head.appendChild(style);
}

// =========================
// MODAL
// =========================

export function confirmacaoModal(texto = "") {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");

        overlay.classList.add("modal-confirmacao-overlay");

        overlay.innerHTML = `
        
        <div class="modal-confirmacao">

            <div class="modal-confirmacao-header">
                <h2>Confirmação</h2>
            </div>

            <div class="modal-confirmacao-body">
                <p>${texto}</p>
            </div>

            <div class="modal-confirmacao-footer">
                <button class="btn-cancelar">
                    Não
                </button>

                <button class="btn-confirmar">
                    Sim
                </button>
            </div>

        </div>
        
        `;

        containerModals.appendChild(overlay);

        const btnCancelar = overlay.querySelector(".btn-cancelar");
        const btnConfirmar = overlay.querySelector(".btn-confirmar");

        // =========================
        // CANCELAR
        // =========================

        btnCancelar.addEventListener("click", () => {
            overlay.remove();

            resolve(false);
        });

        // =========================
        // CONFIRMAR
        // =========================

        btnConfirmar.addEventListener("click", () => {
            overlay.remove();

            resolve(true);
        });

        // =========================
        // CLICAR FORA
        // =========================

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.remove();

                resolve(false);
            }
        });
    });
}
