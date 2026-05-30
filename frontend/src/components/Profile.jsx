import { useEffect, useState } from "react";
import buscarUsuario from "../services/profile";

export default function Profile() {
    const [usuario, setUsuario] = useState(null);
    useEffect(() => {
        async function carregar() {
            const dados = await buscarUsuario();
            setUsuario(dados)
        }

        carregar()
    }, [])
    return (
        <div>
            <p className="conta-nome">{usuario?.nome}</p>
            <p className="conta-email">{usuario?.email}</p>
        </div>
    );
}