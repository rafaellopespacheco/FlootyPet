import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../styles/login.css';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.erro || 'Não foi possível entrar.');
                return;
            }

            toast.success(data.message || 'Login efetuado com sucesso.');
            navigate('/agenda', { replace: true });
        } catch (error) {
            console.error(error);
            toast.error('Erro inesperado ao tentar entrar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <aside>
                <img
                    src="/assets/login/loginbanner-horizontal2.png"
                    alt="Imagem que fala sobre o sistema e as suas funções."
                    className="imagelogin"
                ></img>
            </aside>
            <main className="mainLogin">
                <form onSubmit={handleSubmit} id="form-login">
                    <h2>Bem-vindoo!</h2>
                    <p>Faça login para acessar o sistema</p>

                    <label htmlFor="email">E-mail</label>
                    <div className="container-input">
                        <input
                            type="email"
                            className="input"
                            name="email"
                            id="email"
                            placeholder="seu@email.com"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <img
                            src="/assets/login/icon_mail.png"
                            alt="simbolo de email"
                            className="iconinput"
                        ></img>
                    </div>

                    <label htmlFor="senha">Senha</label>
                    <div className="container-input">
                        <input
                            type="password"
                            name="senha"
                            id="senha"
                            placeholder="Sua senha"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                        <img
                            src="/assets/login/icon_lock.png"
                            alt="simbolo de email"
                            className="iconinput"
                        ></img>
                    </div>

                    <div className="lembrarlinha">
                        <div>
                            <input
                                type="checkbox"
                                name="lembrar"
                                id="lembrar"
                            ></input>
                            <label htmlFor="lembrar">Lembrar-me</label>
                        </div>

                        <a href="#">Esqueci minha senha</a>
                    </div>
                    <button
                        type="submit"
                        id="submit_form"
                        className="buttonLogin"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                    <div className="ou-container">
                        <div className="linhaou"></div>
                        <span className="textou">OU</span>
                        <div className="linhaou"></div>
                    </div>

                    <button
                        type="button"
                        className="buttonLogin button-outline"
                    >
                        Conhecer sistema
                    </button>
                </form>
            </main>
        </>
    );
}