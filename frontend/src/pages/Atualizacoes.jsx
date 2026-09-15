import { useEffect, useState } from "react";
import { buscarAtualizacoes } from "../services/atualizacoes";
import '../styles/atualizacoes.css';
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

export default function () {
    const [atualizacoes, setAtualizacoes] = useState([]);

    useEffect(() => {
        async function carregarAtualizacoes() {
            const atualizacao = await buscarAtualizacoes();
            setAtualizacoes(atualizacao)
        }

        carregarAtualizacoes()
    }, []);

    return (
        <div className="container-main">
            <div className="container-changelogs">
                {atualizacoes.map((changelog) => {
                    return (
                        <div className="card-change" key={changelog.id}>
                            <div className="change-header">
                                <h2 className="change-title">{changelog.titulo}</h2>
                                <span className="version">
                                    {changelog.versao}
                                </span>
                            </div>
                            <h3 className="card-date">
                                {new Date(changelog.data).toLocaleString(
                                    "pt-BR",
                                )}
                            </h3>
                            <ReactMarkdown>
                                {changelog.descricao || ""}
                            </ReactMarkdown>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
