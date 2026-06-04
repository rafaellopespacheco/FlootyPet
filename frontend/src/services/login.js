// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export async function logoutButton() {
    // let navigate = new useNavigate();
    const response = await fetch("/api/logout")
    const dado = await response.json();
    if (dado.erro) return toast.error(dado.erro)
    toast.success(dado.mensagem);
    window.location.href = "/";
}