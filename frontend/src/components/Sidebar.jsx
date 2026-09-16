import '../styles/sidebar.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar () {

    return (
        <aside className="sidebar">
            <NavLink to="/agenda" className="brandinglink">
                <img
                    src="/assets/branding/logo_white.png"
                    alt="Logo da flooty pet"
                ></img>
            </NavLink>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/agenda" className="link">
                            <span className="material-symbols-rounded">
                                calendar_today
                            </span>
                            Agenda
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clientes" className="link">
                            <span className="material-symbols-rounded">
                                group
                            </span>
                            Clientes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/config" className="link">
                            <span className="material-symbols-rounded">
                                settings
                            </span>
                            Configuração
                        </NavLink>
                    </li>
                    <li>
                        <a href="/old/configuracao" className="link">
                            <span className="material-symbols-rounded">
                                instant_mix
                            </span>
                            Antiga Config
                        </a>
                    </li>
                    <li>
                        <NavLink to="/atualizacoes" className="link">
                            <span className="material-symbols-rounded">
                                update
                            </span>
                            Atualizações
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <p className="creditos">&copy; Direitos reservados. 2026</p>
        </aside>
    );
}