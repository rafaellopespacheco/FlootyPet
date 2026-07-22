import { useEffect, useState } from "react";
import buscarUsuario from "../services/profile";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ModalPerfilUser from "./ModalPerfilUser";

export default function Profile() {
    const navigate = useNavigate();

    async function logoutButton() {
        const response = await fetch("/api/logout");
        const dado = await response.json();

        if (dado.erro) {
            toast.error(dado.erro);
            return;
        }
        toast.warning(dado.message)
        navigate("/", {
            replace: true
        })
        
    }

    const [usuario, setUsuario] = useState(null);
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    useEffect(() => {
        async function carregar() {
            const dados = await buscarUsuario();
            setUsuario(dados)
        }

        carregar()
    }, [])

    const ref = useRef();
    useEffect(() => {
        const handleClick = (e) => {
            if(!ref.current?.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    }, [])

    return (
        <>
            <div className="conta-container" ref={ref}>
                <button onClick={() => setOpen(!open)}>
                    <div>
                        <p className="conta-nome">{usuario?.nome}</p>
                        <p className="conta-email">{usuario?.email}</p>
                    </div>

                    <img src="https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg" alt=""></img>
                </button>
                {open && (
                    <div className="dropdown">
                        <button onClick={() => {
                            setOpen(false)
                            setOpenProfile(true)
                        }}><span className="material-symbols-rounded">account_circle</span> Meu Perfil</button>
                        <button disabled><span className="material-symbols-rounded">settings</span> Configuração</button>
                        <hr />
                        <button onClick={logoutButton}><span className="material-symbols-rounded">logout</span> Sair</button>
                    </div>
                )}
            </div>
            {openProfile && (
                <ModalPerfilUser 
                    onClose={() => {setOpenProfile(false)}}
                />
            )}
        </>
    );
}