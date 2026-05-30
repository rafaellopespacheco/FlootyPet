import '../styles/sidebar.css';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function () {
    return (
        <aside className='sidebar'>
            <img src='/assets/branding/logo_white.png' alt='Logo da flooty pet'></img>
            <nav>
                <ul>
                    <li><Link to='/agenda' className='link'><span className='material-symbols-rounded'>calendar_today</span>Agenda</Link></li>
                    <li><Link to='/clientes' className='link'><span className='material-symbols-rounded'>group</span>Clientes</Link></li>
                    <li><button className='link desativado' onClick={() => toast.warning("Em desenvolvimento.")}><span className='material-symbols-rounded'>home</span>Hospedagem</button></li>
                    <li><button className='link desativado' onClick={() => toast.warning("Em desenvolvimento.")}><span className='material-symbols-rounded'>deployed_code</span>Pacotes</button></li>
                    <li><button className='link desativado' onClick={() => toast.warning("Em desenvolvimento.")}><span className='material-symbols-rounded'>document_search</span>Relatórios</button></li>
                    <li><button className='link desativado' onClick={() => toast.warning("Em desenvolvimento.")}><span className='material-symbols-rounded'>account_balance</span>Financeiro</button></li>
                    <li><button className='link desativado' onClick={() => toast.warning("Em desenvolvimento.")}><span className='material-symbols-rounded'>package_2</span>Estoque</button></li>
                    <li><a href='/configuracao' className='link'><span className='material-symbols-rounded'>settings</span>Configuração</a></li>
                    <li><Link to='/atualizacoes' className='link'><span className='material-symbols-rounded'>update</span>Atualizações</Link></li>
                </ul>
            </nav>
            <button type='button' className='link' id='logout'><span className='material-symbols-rounded'>logout</span>Sair</button>
            <p className='creditos'>&copy; Direitos reservados. 2026</p>
        </aside>
    )
}