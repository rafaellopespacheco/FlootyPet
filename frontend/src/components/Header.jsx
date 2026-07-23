import { useEffect } from 'react';
import '../styles/header.css';
import Profile from './Profile';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import NotificationCenter from './NotificationCenter';

export default function () {
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
            <NotificationCenter />
            <Profile />
        </header>
    );
}