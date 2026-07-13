import { useEffect } from 'react';
import '../styles/header.css';
import Profile from './Profile';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function () {
    function handleAbrirNotificacao() {
        toast.warning("A Central de Notificação está sendo desenvolvida.")
    }
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
                <button className='buttonAbrirNotificacao' title='Central de Notificações' onClick={handleAbrirNotificacao}>
                    <span class="material-symbols-rounded">notifications</span>
                </button>
            </div>
            <div className="conta-container">
                <Profile />
                <img
                    src="https://s2.glbimg.com/yrFgwzwrwxxpO7pJoejZxwxpRx0=/620x620/smart/e.glbimg.com/og/ed/f/original/2022/03/11/mister_mainer.jpeg"
                    alt=""
                ></img>
            </div>
        </header>
    );
}