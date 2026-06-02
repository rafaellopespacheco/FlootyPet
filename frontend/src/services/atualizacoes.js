import { toast } from "sonner";

export async function buscarAtualizacoes() {
    const resposta = await fetch("/api/atualizacoes");
    const dados = await resposta.json();
    return dados;
}

export async function novaAtualizacao(e) {
    try {
        e.preventDefault();
        const formData = new FormData(e.target);
        const descricaoList = formData.get("atualizacoes").split('\n').filter(item => item.trim()) || []

        const responseUltimaVersao = await fetch("/api/ultimaversao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tipo: formData.get("tipo"),
            }),
        });

        const novaVersao = await responseUltimaVersao.json()

        const response = await fetch("/api/atualizacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                titulo: formData.get("titulo"),
                versao: novaVersao.versao,
                resumo: formData.get("resumo"),
                descricao: descricaoList,
            }),
        });
        const dado = await response.json();
        toast.success(dado.mensagem);
    } catch (err) {
        toast.error("Erro ao enviar a changelog");
        console.log(err);
    }
}
