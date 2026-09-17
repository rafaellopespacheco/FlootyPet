import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

export default function ConfigSidebar() {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <button
                className="config-back-button"
                onClick={() => navigate("/agenda")}
            >
                <span className="material-symbols-rounded">arrow_back</span>
                Voltar para agenda
            </button>

            <div className="config-sidebar-title">
                <div className="config-sidebar-icon">
                    <span className="material-symbols-rounded">settings</span>
                </div>
                <div>
                    <strong>Configuração</strong>
                    <small>Preferências do pet shop</small>
                </div>
            </div>

            <nav>
                <span className="config-sidebar-label">GERAL</span>
                <ul>
                    <li>
                        <NavLink to="/config" end className="link">
                            <span className="material-symbols-rounded">
                                tune
                            </span>
                            Geral
                        </NavLink>
                    </li>
                    <span className="config-sidebar-label">OPERAÇÃO</span>
                    <li>
                        <NavLink to="/config/servicos" className="link">
                            <span className="material-symbols-rounded">
                                content_cut
                            </span>
                            Serviços
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="config-sidebar-footer">
                <span className="material-symbols-rounded">lock</span>
                <span>Somente administradores</span>
            </div>
        </aside>
    );
}
