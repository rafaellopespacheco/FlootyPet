import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buscarAtualizacoes } from "../services/atualizacoes";
import '../styles/atualizacoes.css';
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
            <Link to={"/addatualizacoes"}>Nova Changelog</Link>
            <div className="container-changelogs">
                {atualizacoes.map((changelog) => {
                    let descricao = []
                    try {
                        descricao = JSON.parse(changelog.descricao)
                    } catch {
                        descricao = []
                    }
                    return (
                    
                        <div className="card-change" key={changelog.id}>
                            <div className="change-header">
                                <h2>{changelog.titulo}</h2>
                                <span className="version">{changelog.versao}</span>
                            </div>
                            <h3>{new Date(changelog.data).toLocaleString("pt-BR")}</h3>
                            <p>{changelog.resumo}</p>
                            <ul className="lista">
                                {descricao.map(dado => (
                                    <li>{dado}</li>
                                ))}
                            </ul>
                        </div>

                    )
                })}
            </div>
        </div>
    );
}
