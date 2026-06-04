import '../styles/login.css'

export default function () {
    return (
        <>
        
            <aside>
                <img src="/assets/login/loginbanner-horizontal2.png" alt="Imagem que fala sobre o sistema e as suas funções." className='imagelogin'></img>
            </aside>
            <main className='mainLogin'>
                <form method="post" id="form-login">
                    <h2>Bem-vindo!</h2>
                    <p>Faça login para acessar o sistema</p>

                    <label htmlFor="email">E-mail</label>
                    <div className="container-input">
                        <input type="email" className="input" name="email" id="email" placeholder="seu@email.com" required></input>
                        <img src="/assets/login/icon_mail.png" alt="simbolo de email" className="iconinput"></img>
                    </div>

                    <label htmlFor="senha">Senha</label>
                    <div className="container-input">
                        <input type="password" name="senha" id="senha" placeholder="Sua senha" required></input>
                        <img src="/assets/login/icon_lock.png" alt="simbolo de email" className="iconinput"></img>
                    </div>

                    <div className="lembrarlinha">
                        <div>
                            <input type="checkbox" name="lembrar" id="lembrar"></input>
                            <label htmlFor="lembrar">Lembrar-me</label>
                        </div>

                        <a href="#">Esqueci minha senha</a>
                    </div>
                    <button type="submit" id="submit_form" className="buttonLogin">Entrar</button>

                    <div className="ou-container">
                        <div className="linhaou"></div>
                        <span className="textou">OU</span>
                        <div className="linhaou"></div>
                    </div>

                    <button type="button" className="buttonLogin button-outline">Conhecer sistema</button>
                </form>
            </main>
      </>
    )
}