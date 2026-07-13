import '../styles/notfound.css'
import '../styles/global.css'
import { NavLink } from 'react-router-dom';

export default function () {
    return (
        <div className="container-notfound">
            <img src="/assets/branding/logo.png" alt="" />
            <h1>Erro 404</h1>
            <h2>
                Página não encontrada, verifique a ortografia, caso acha que
                seja um erro, entre em contato com a equipe de suporte.
            </h2>
            <NavLink to='/clientes' className='button'>Voltar a página inicial</NavLink>
        </div>
    );
}