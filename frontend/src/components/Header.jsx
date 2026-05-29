import { useEffect } from 'react';
import '../styles/header.css';

export default function () {
    
    return (
        <header>
            <h1>Agenda</h1>
            <div class="mensagens-container">
                <img src="/assets/agenda/icon_mensagem.png" alt="Icone de sino"></img>
            </div>
            <div class="conta-container">
                <div>
                    <p class="conta-nome"></p>
                    <p class="conta-email"></p>
                </div>
                <img src="https://s2.glbimg.com/yrFgwzwrwxxpO7pJoejZxwxpRx0=/620x620/smart/e.glbimg.com/og/ed/f/original/2022/03/11/mister_mainer.jpeg" alt=""></img>
            </div>
        </header>
    )
}