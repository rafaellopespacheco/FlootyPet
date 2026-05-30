import { useEffect } from 'react';
import '../styles/header.css';
import Profile from './Profile';
import { useLocation } from 'react-router-dom';

export default function () {
    const location = useLocation();

    const titulos = {
        "/agenda": "Agenda",
        "/clientes": "Clientes",
        "/atualizacoes": "Atualizações",
    }
    
    return (
        <header>
            <h1>{titulos[location.pathname]}</h1>
            <div className="mensagens-container">
                <img src="/assets/agenda/icon_mensagem.png" alt="Icone de sino"></img>
            </div>
            <div className="conta-container">
                <Profile />
                <img src="https://s2.glbimg.com/yrFgwzwrwxxpO7pJoejZxwxpRx0=/620x620/smart/e.glbimg.com/og/ed/f/original/2022/03/11/mister_mainer.jpeg" alt=""></img>
            </div>
        </header>
    )
}