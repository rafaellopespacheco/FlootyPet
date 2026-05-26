import { sendAlertModal } from "/js/modal-alert.js";

/**
 * Abre o modal de cadastro/edição de pet.
 * @param {Object} params
 * @param {number|string|null} params.petId - ID do pet existente no banco (para edição no perfil)
 * @param {Object|null} params.petData - Objeto com dados do pet temporário (para edição em memória)
 * @param {number|string|null} params.clienteId - ID do cliente se for salvar diretamente na API
 * @param {Function} params.onSave - Callback executada após salvar com sucesso: (dadosRetornados) => void
 */
export async function abrirModalPet({ petId = null, petData = null, clienteId = null, onSave }) {
    let racas = [];
    let checklistConfig = [];
    let pet = petData || null;

    try {
        const fetchPromises = [
            fetch("/api/racas"),
            fetch("/api/config/checklist?checklist_tipo=agendado")
        ];
        if (petId) {
            fetchPromises.push(fetch(`/api/pets/${petId}`));
        }

        const responses = await Promise.all(fetchPromises);
        racas = await responses[0].json();
        checklistConfig = await responses[1].json();
        if (petId && responses[2]) {
            pet = await responses[2].json();
        }
    } catch (err) {
        console.error("Erro ao carregar dados para o modal de pet:", err);
    }

    const perfumes = checklistConfig.filter(c => c.categoria === 'perfume');
    const enfeites = checklistConfig.filter(c => c.categoria === 'enfeites');
    const shampoos = checklistConfig.filter(c => c.categoria === 'shampoo');
    const cores = checklistConfig.filter(c => c.categoria === 'cores');

    const modal = document.createElement("div");

    modal.innerHTML = `
        <div class="container-modal-addcliente">
            <div class="modal-addcliente">
                <div class="modal-header">
                    <h2>${pet ? 'Editar pet' : 'Cadastrar novo pet'}</h2>
                    <button type="button" id="fechar-modal">&times;</button>
                </div>
                <div class="modal-body">

                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome">Nome do pet *</label>
                            <input type="text" name="nome" id="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="datanasc">Data de nascimento</label>
                            <input type="date" name="datanasc" id="datanasc">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Espécie *</label>
                            <div class="radio-container-group" id="grupo-especie">
                                <label><input type="radio" name="especie" value="1" required> Cachorro</label>
                                <label><input type="radio" name="especie" value="2" required> Gato</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="raca">Raça *</label>
                            <select name="raca" id="raca" required disabled>
                                <option value="">Selecione a espécie primeiro</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="porte">Porte *</label>
                            <select name="porte" id="porte" required>
                                <option value="">Selecione...</option>
                                <option value="micro">Micro</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="médio">Médio</option>
                                <option value="grande">Grande</option>
                                <option value="gigante">Gigante</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="tamanhopelo">Tamanho do Pelo *</label>
                            <select name="tamanhopelo" id="tamanhopelo" required>
                                <option value="">Selecione...</option>
                                <option value="curto">Curto</option>
                                <option value="médio">Médio</option>
                                <option value="longo">Longo</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="peso">Peso</label>
                            <input type="text" name="peso" id="peso" placeholder="0,00 kg">
                        </div>
                        <div class="form-group">
                            <label for="cor">Cor</label>
                            <select name="cor" id="cor">
                                <option value="">Selecione...</option>
                                ${cores.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Sexo *</label>
                            <div class="radio-container-group" id="grupo-sexo">
                                <label><input type="radio" name="sexo" value="macho" required> Macho</label>
                                <label><input type="radio" name="sexo" value="fêmea" required> Fêmea</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Castrado?</label>
                            <div class="radio-container-group" id="grupo-castrado">
                                <label><input type="radio" name="castrado" value="sim"> Sim</label>
                                <label><input type="radio" name="castrado" value="não"> Não</label>
                            </div>
                        </div>
                    </div>

                    <!-- Checklist de Banho/Tosa Padrão -->
                    <h3 style="margin-top: 15px; margin-bottom: 5px; color: var(--text-color); font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 5px;">Checklist Padrão (Agendamento)</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="perfume">Perfume</label>
                            <select name="perfume" id="perfume">
                                <option value="">Selecione...</option>
                                ${perfumes.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="enfeites">Adicionais (Enfeites)</label>
                            <select name="enfeites" id="enfeites">
                                <option value="">Selecione...</option>
                                ${enfeites.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="shampoo">Shampoo</label>
                            <select name="shampoo" id="shampoo">
                                <option value="">Selecione...</option>
                                ${shampoos.map(opt => `<option value="${opt.valor}">${opt.valor}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cuidados_especiais">Cuidados Especiais (Interno)</label>
                            <input type="text" name="cuidados_especiais" id="cuidados_especiais" placeholder="Ex: Cuidado com a orelha direita">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="obs">Observação</label>
                        <textarea name="obs" id="obs" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="button" id="cadastrar-button">${pet ? 'Salvar alterações' : 'Cadastrar pet'}</button>
                </div>
            </div>
        </div>`;

    document.body.appendChild(modal);

    const selectRaca = modal.querySelector("#raca");
    const selectPorte = modal.querySelector("#porte");
    const selectPelo = modal.querySelector("#tamanhopelo");
    const inputPeso = modal.querySelector("#peso");
    const radiosEspecie = modal.querySelectorAll('input[name="especie"]');

    // 1. Alternador de Espécie
    radiosEspecie.forEach((radio) => {
        radio.addEventListener("change", function () {
            const especieSelecionada = parseInt(this.value);
            selectRaca.innerHTML = '<option value="">Selecione a raça...</option>';
            selectRaca.disabled = false;

            const racasFiltradas = racas.filter(r => r.especie_id === especieSelecionada);
            racasFiltradas.forEach((raca) => {
                const option = document.createElement("option");
                option.value = raca.id;
                option.textContent = raca.nome;
                selectRaca.appendChild(option);
            });

            modal.querySelector("#grupo-especie").classList.remove("input-error");
        });
    });

    // Limpeza de erro em tempo real
    modal.querySelectorAll(".radio-container-group input").forEach((radio) => {
        radio.addEventListener("change", function () {
            this.closest(".radio-container-group").classList.remove("input-error");
        });
    });

    // 2. Auto-preenchimento por Raça
    selectRaca.addEventListener("change", function () {
        const racaSelecionadaId = parseInt(this.value);
        const racaSelecionada = racas.find(r => r.id === racaSelecionadaId);
        if (racaSelecionada) {
            if (racaSelecionada.tamanho) {
                selectPorte.value = racaSelecionada.tamanho;
                selectPorte.classList.remove("input-error");
            }
            if (racaSelecionada.tamanhopelo) {
                selectPelo.value = racaSelecionada.tamanhopelo;
                selectPelo.classList.remove("input-error");
            }
        }
    });

    // 3. Máscara de Peso com Backspace Funcional
    inputPeso.addEventListener("input", function () {
        let cleanValue = inputPeso.value.replace(/\D/g, "");
        if (cleanValue === "" || cleanValue === "0" || cleanValue === "00") {
            inputPeso.value = "";
            return;
        }
        let numero = (parseInt(cleanValue) / 100).toFixed(2);
        inputPeso.value = `${numero.replace(".", ",")} kg`;
    });

    // Preencher campos se for edição (banco ou memória)
    if (pet) {
        modal.querySelector("#nome").value = pet.nome || "";
        modal.querySelector("#datanasc").value = pet.datanasc || "";
        
        if (pet.especie) {
            const radioEspecie = modal.querySelector(`input[name="especie"][value="${pet.especie}"]`);
            if (radioEspecie) {
                radioEspecie.checked = true;
                selectRaca.innerHTML = '<option value="">Selecione a raça...</option>';
                selectRaca.disabled = false;
                const racasFiltradas = racas.filter(r => r.especie_id === parseInt(pet.especie));
                racasFiltradas.forEach((raca) => {
                    const option = document.createElement("option");
                    option.value = raca.id;
                    option.textContent = raca.nome;
                    selectRaca.appendChild(option);
                });
            }
        }

        if (pet.raca_id) {
            selectRaca.value = pet.raca_id;
        }
        if (pet.porte) {
            selectPorte.value = pet.porte;
        }
        if (pet.tamanhopelo) {
            selectPelo.value = pet.tamanhopelo;
        }
        if (pet.peso) {
            inputPeso.value = `${pet.peso.toFixed(2).replace(".", ",")} kg`;
        }
        if (pet.sexo) {
            const radioSexo = modal.querySelector(`input[name="sexo"][value="${pet.sexo}"]`);
            if (radioSexo) radioSexo.checked = true;
        }
        if (pet.castrado !== null && pet.castrado !== undefined) {
            const valCastrado = (pet.castrado === 1 || pet.castrado === 'sim' || pet.castrado === true) ? 'sim' : 'não';
            const radioCastrado = modal.querySelector(`input[name="castrado"][value="${valCastrado}"]`);
            if (radioCastrado) radioCastrado.checked = true;
        }
        modal.querySelector("#perfume").value = pet.perfume || "";
        modal.querySelector("#enfeites").value = pet.enfeites || "";
        modal.querySelector("#shampoo").value = pet.shampoo || "";
        modal.querySelector("#cor").value = pet.cor || "";
        modal.querySelector("#cuidados_especiais").value = pet.cuidados_especiais || "";
        modal.querySelector("#obs").value = pet.obs || "";
    }

    // Remove erro visual ao interagir
    modal.querySelectorAll("input[type='text'], input[type='date'], select, textarea").forEach((input) => {
        input.addEventListener("input", function () { this.classList.remove("input-error"); });
        input.addEventListener("change", function () { this.classList.remove("input-error"); });
    });

    // 4. Validação e Envio
    const buttonCadastrarPet = modal.querySelector("#cadastrar-button");
    buttonCadastrarPet.addEventListener("click", function () {
        let formularioValido = true;

        const inputsTexto = modal.querySelectorAll("input[type='text'][required], select[required]");
        inputsTexto.forEach((input) => {
            if (input.value.trim() === "") {
                input.classList.add("input-error");
                formularioValido = false;
            } else {
                input.classList.remove("input-error");
            }
        });

        const gruposRadio = ["especie", "sexo"];
        gruposRadio.forEach((grupo) => {
            const checked = modal.querySelector(`input[name="${grupo}"]:checked`);
            const containerGrupo = modal.querySelector(`#grupo-${grupo}`);

            if (!checked) {
                containerGrupo.classList.add("input-error");
                formularioValido = false;
            } else {
                containerGrupo.classList.remove("input-error");
            }
        });

        if (!formularioValido) {
            sendAlertModal("warning", "Preencha os campos obrigatórios corretamente.");
            return;
        }

        const pesoRaw = modal.querySelector("#peso").value;
        const pesoNumerico = pesoRaw
            ? parseFloat(pesoRaw.replace(" kg", "").replace(",", "."))
            : null;

        const castradoSelecionado = modal.querySelector('input[name="castrado"]:checked');
        const castradoVal = castradoSelecionado
            ? (castradoSelecionado.value === "sim" ? 1 : 0)
            : null;

        const specValue = modal.querySelector('input[name="especie"]:checked').value;
        const racaValueId = parseInt(selectRaca.value);
        const racaText = selectRaca.options[selectRaca.selectedIndex]?.text || '';

        const dadosProntos = {
            nome: modal.querySelector("#nome").value.trim(),
            datanasc: modal.querySelector("#datanasc").value,
            especie: specValue,
            raca_id: racaValueId,
            raca: racaText, // para exibir na prévia sem precisar de outro fetch
            porte: selectPorte.value,
            tamanhopelo: selectPelo.value,
            peso: pesoNumerico,
            sexo: modal.querySelector('input[name="sexo"]:checked').value,
            castrado: castradoVal,
            obs: modal.querySelector("#obs").value.trim(),
            perfume: modal.querySelector("#perfume").value,
            enfeites: modal.querySelector("#enfeites").value,
            shampoo: modal.querySelector("#shampoo").value,
            cor: modal.querySelector("#cor").value,
            cuidados_especiais: modal.querySelector("#cuidados_especiais").value.trim()
        };

        // Se passamos petData com tempId, mantém no objeto retornado
        if (petData && petData.tempId !== undefined) {
            dadosProntos.tempId = petData.tempId;
        }

        // Determinar se vamos salvar via API ou retornar localmente
        if (clienteId || petId) {
            const url = petId ? `/api/pets/${petId}` : `/api/clientes/${clienteId}/pets`;
            const method = petId ? "PUT" : "POST";

            fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosProntos),
            })
                .then((res) => res.json())
                .then((dados) => {
                    modal.remove();
                    if (onSave) onSave(dados);
                })
                .catch((err) => {
                    console.error(err);
                    sendAlertModal("error", "Erro ao salvar o pet.");
                });
        } else {
            // Apenas retorna os dados para controle local (ex: cadastro de cliente)
            modal.remove();
            if (onSave) onSave(dadosProntos);
        }
    });

    modal.querySelector("#fechar-modal").addEventListener("click", function () {
        modal.remove();
        if (window.location.search.includes("pet_edit")) {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
        }
    });
}
