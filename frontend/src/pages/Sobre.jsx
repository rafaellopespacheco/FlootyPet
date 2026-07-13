import { NavLink } from "react-router-dom";
import "../styles/sobre.css";

export default function Sobre() {
    return (
        <div className="container-sobre">
            <section className="hero">
                <img
                    src="/assets/branding/logo.png"
                    alt="Logo Flooty Pet"
                    className="hero-logo"
                />

                <h1>Conheça o Flooty Pet</h1>

                <p>
                    O Flooty Pet é um sistema desenvolvido para facilitar a
                    gestão de pet shops, oferecendo uma plataforma moderna,
                    intuitiva e eficiente para organizar clientes, pets e
                    agendamentos em um único lugar.
                </p>
            </section>

            <section className="cards">
                <div className="card">
                    <span className="material-symbols-rounded">
                        calendar_today
                    </span>

                    <h2>Agenda</h2>

                    <p>
                        Organize atendimentos, banhos, tosas e demais serviços
                        de forma simples.
                    </p>
                </div>

                <div className="card">
                    <span className="material-symbols-rounded">group</span>

                    <h2>Clientes</h2>

                    <p>
                        Cadastre tutores e tenha acesso rápido às informações
                        sempre que precisar.
                    </p>
                </div>

                <div className="card">
                    <span className="material-symbols-rounded">pets</span>

                    <h2>Cadastro de Pets</h2>

                    <p>
                        Histórico, observações e informações importantes de cada
                        animal.
                    </p>
                </div>

                <div className="card">
                    <span className="material-symbols-rounded">update</span>

                    <h2>Atualizações</h2>

                    <p>
                        Novos recursos e melhorias constantes para acompanhar o
                        crescimento do seu negócio.
                    </p>
                </div>
            </section>

            <section className="creditossistema">
                <h2>Desenvolvido por Rafael Lopes</h2>

                <p>
                    O Flooty Pet foi desenvolvido com foco em desempenho,
                    simplicidade e uma boa experiência de uso, buscando atender
                    às necessidades reais de pet shops de todos os portes.
                </p>

                <div className="acoes">
                    <a
                        href="https://rafaellopespacheco.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                    >
                        Conhecer Portfólio
                    </a>

                    <NavLink to="/" className="button button-outline">
                        Voltar ao Login
                    </NavLink>
                </div>

                <span className="copyright">
                    © 2026 Flooty Pet • Todos os direitos reservados.
                </span>
            </section>
        </div>
    );
}
