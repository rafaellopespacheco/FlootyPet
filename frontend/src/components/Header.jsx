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
    
    function getTitulo() {
        if (titulos[location.pathname]) {
            return titulos[location.pathname];
        }

        if (location.pathname.startsWith("/clientes/")) {
            return "Informações do cliente";
        }

        return "Flooty Pet";
    }

    return (
        <header>
            <h1>{getTitulo()}</h1>
            <div className="mensagens-container">
                <button className='buttonAbrirNotificacao' title='Central de Notificações' onClick={handleAbrirNotificacao}>
                    <span className="material-symbols-rounded">notifications</span>
                </button>
            </div>
            <Profile />
        </header>
    );
}