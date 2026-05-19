const container = document.querySelector(".container-changelogs");

fetch("/api/atualizacoes")
    .then((resposta) => resposta.json())
    .then((dado) => {
        const titulo = document.querySelector('h1');
        titulo.textContent = 'Atualizações';
        if (dado === []) {
            titulo.textContent = 'Não há atualizações registradas.'
        }
        dado.forEach((changelog) => {
            const card = document.createElement("div");
            card.classList.add("card-change");
            card.innerHTML = `
            <div class="change-header">
                <h2>${changelog.titulo}</h2>
                <span class="version">${changelog.versao}</span>
            </div>
            <h3>${changelog.data?.split('-').reverse().join('/') || ''}</h3>
            <p>${changelog.resumo}</p>
            <ul class="lista"></ul>`;

            const containerLista = card.querySelector(".lista");
            let descricao = [];

            try {
                descricao = JSON.parse(changelog.descricao);
            } catch {
                descricao = [];
            }
            descricao.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                containerLista.appendChild(li);
            })

            container.appendChild(card);
        });
    })
    .catch((err) => {
        console.log(err);
    });