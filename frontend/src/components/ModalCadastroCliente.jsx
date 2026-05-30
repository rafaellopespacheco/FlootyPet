import '../styles/modalCadastroCliente.css'

export default function ModalCadastroCliente({
    aberto,
    onClose
}) {
    if (!aberto) return null;
    return (
        <>
        
        <div className="container-modal-addcliente">
            <div className="modal-addcliente">
                <div className="modal-header">
                    <h2>Cadastrar novo cliente</h2>
                    <button type="button" id="fechar-modal" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="nome">Nome *</label>
                        <input type="text" name="nome" id="nome" required></input>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" id="cpf" maxLength={14}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="datanasc">Data de nascimento</label>
                            <input type="date" name="datanasc" id="datanasc"></input>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telefone *</label>
                        <input type="tel" name="telefone" id="telefone" required></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="obs">Observação</label>
                        <textarea name="obs" id="obs"></textarea>
                        
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cep">CEP</label>
                            <input type="text" name="cep" id="cep"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="uf">UF</label>
                            <input type="text" name="uf" id="uf"></input>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="numero">Número</label>
                            <input type="text" name="numero" id="numero"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="complemento">Complemento</label>
                            <input type="text" name="complemento" id="complemento"></input>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="endereco">Endereço</label>
                        <input type="text" name="endereco" id="endereco"></input>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="bairro">Bairro</label>
                            <input type="text" name="bairro" id="bairro"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cidade">Cidade</label>
                            <input type="text" name="cidade" id="cidade"></input>
                        </div>
                    </div>

                        <h3 style={{
                            marginTop: "20px",
                            marginBottom: "5px",
                            color: "#444",
                            fontSize: "1.1rem",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "5px"
                            }}>Pets deste Cliente</h3>
                        <div className="pets-list-cadastro" id="pets-list-cadastro" style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginBottom: "15px",
                            marginTop: "5px"
                        }}>
                            <span className="sem-pets-temp" style={{
                                color: "#999",
                                fontStyle: "italic",
                                fontSize: "0.9rem"
                            
                        }}>Nenhum pet adicionado ainda.</span>
                    </div>
                        <button type="button" className="button" id="btn-add-pet-cadastro" style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            alignSelf: "flex-start",
                            backgroundColor: "#f0f0f3",
                            color: "#333",
                            border: "1px solid #ccc",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}>
                        <span className="material-symbols-rounded" style={{fontSize: "18px"}}>add_circle</span> Adicionar Pet
                    </button>
                </div>
                <div className="modal-footer">
                    <button type="button" className="button" id="cadastrar-button">Cadastrar</button>
                </div>
            </div>
            </div>
        </>
    )
}