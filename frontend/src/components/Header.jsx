import "../styles/header.css";
import Profile from "./Profile";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import NotificationCenter from "./NotificationCenter";

export default function () {
    const location = useLocation();

    const titulos = {
        "/agenda": "Agenda",
        "/clientes": "Clientes",
        "/atualizacoes": "Atualizações",
        "/config": "Configurações",
    };

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
            <button
                className="header-new-appointment"
                type="button"
                aria-label="Novo agendamento"
                title="Novo agendamento"
                onClick={() =>
                    window.dispatchEvent(new Event("flooty:novo-agendamento"))
                }
            >
                <span className="material-symbols-rounded">
                    calendar_add_on
                </span>
            </button>
            <NotificationCenter />
            <Profile />
        </header>
    );
}
