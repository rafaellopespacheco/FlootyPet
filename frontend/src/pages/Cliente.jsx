import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/global.css";
import "../styles/clientes.css";
import { buscarClientes, formatarTelefone } from "../services/clientes";

export default function () {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        async function carregarClientes() {
            const dados = await buscarClientes();
            setClientes(dados);
        }

        carregarClientes();
    });

    return (
        <>
            <div classNameName="container-main">
                <div className="header-clientes">
                    <div className="clientes-filter">
                        <span className="material-symbols-rounded">search</span>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Buscar"
                        ></input>
                        <button
                            className="filter-button filter-active"
                            id="filter-todos"
                        >
                            Todos
                        </button>
                        <button className="filter-button" id="filter-clientes">
                            Cliente
                        </button>
                        <button className="filter-button" id="filter-pets">
                            Pet
                        </button>
                        <button className="filter-button" id="filter-telefone">
                            Telefone
                        </button>
                        <button className="filter-button" id="filter-cpf">
                            CPF
                        </button>
                    </div>
                    <button
                        type="button"
                        className="button"
                        id="abrir-modal-cadastro"
                    >
                        <span className="material-symbols-rounded">
                            person_add
                        </span>{" "}
                        Cadastrar Cliente
                    </button>
                </div>
                <div className="container-clientes">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Pets</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="clientes">
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>
                                        <a href={`/clientes/${cliente.id}`}>
                                            {cliente.nome}
                                        </a>
                                    </td>
                                    <td>
                                        {formatarTelefone(cliente.telefone)}
                                    </td>
                                    <td>
                                        <div className="pet-list-container">
                                            {cliente.pets.length === 0 && (
                                                <span className="sem-pets">
                                                    Sem pets
                                                </span>
                                            )}

                                            {cliente.pets.map((pet) => (
                                                <div className="pet-item-list">
                                                    <a
                                                        href={`/clientes/${cliente.id}?pet_edit=${pet.id}`}
                                                        className="pet-item-link"
                                                        title={`Editar ${pet.nome}`}
                                                    >
                                                        <div className="pet-avatar-wrapper">
                                                            <img
                                                                src={`/assets/icons/${pet.especie === "2" ? "cat.png" : "dog.png"}`}
                                                                className="pet-avatar-img"
                                                            ></img>
                                                            <span
                                                                className={`pet-badge-gender ${pet.sexo === "fêmea" ? "femea" : "macho"}`}
                                                            >
                                                                {pet.sexo ===
                                                                "fêmea"
                                                                    ? "🎀"
                                                                    : "👔"}
                                                            </span>
                                                        </div>
                                                        <span className="pet-name-list">
                                                            {pet.nome}
                                                        </span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="td-acoes">
                                        <button type="button">
                                            <span className="material-symbols-rounded">
                                                calendar_add_on
                                            </span>
                                        </button>
                                        <a href={`/clientes/${cliente.id}`}>
                                            <span className="material-symbols-rounded">
                                                person
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
