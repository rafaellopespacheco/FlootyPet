import { novaAtualizacao } from "../services/atualizacoes";

export default function () {
    return (
        <>
            <style>
                {`
                    .changelog-page {
                        padding: 2rem;
                    }

                    .changelog-form {
                        display: flex;
                        flex-direction: column;
                        gap: .75rem;
                        max-width: 800px;
                    }

                    .changelog-form label {
                        font-weight: 600;
                        color: #333;
                    }

                    .changelog-form input,
                    .changelog-form textarea {
                        padding: .8rem 1rem;
                        border: 1px solid #dcdcdc;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-family: inherit;
                        resize: vertical;
                    }

                    .changelog-form textarea {
                        min-height: 120px;
                    }

                    .changelog-form button {
                        margin-top: .5rem;
                        padding: .9rem;
                        border: none;
                        border-radius: 8px;
                        background: #7c5cfa;
                        color: white;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: .2s;
                    }

                    .changelog-form button:hover {
                        opacity: .9;
                    }

                    .container-radios {
                        display: flex;
                        gap: 15px;
                    }
                `}
            </style>

            <div className="changelog-page">
                <form className="changelog-form" onSubmit={novaAtualizacao}>
                    <label htmlFor="titulo">Título</label>
                    <input type="text" name="titulo" id="titulo" />
                    
                    <div className="container-radios">
                        <label>
                            <input type="radio" name="tipo" value="grande" /> Grande atualização
                        </label>
                        <label>
                            <input type="radio" name="tipo" value="novafeat" /> Nova funcionalidade
                        </label>
                        <label>
                            <input type="radio" name="tipo" value="correcao" /> Correção
                        </label>
                    </div>

                    <label htmlFor="resumo">Resumo</label>
                    <textarea name="resumo" id="resumo"></textarea>

                    <label htmlFor="atualizacoes">Atualizações</label>
                    <textarea
                        name="atualizacoes"
                        id="atualizacoes"
                        placeholder="Uma atualização por linha..."
                    ></textarea>

                    <button type="submit">Nova atualização</button>
                </form>
            </div>
        </>
    );
}
