export default async function buscarUsuario() {
    const resposta = await fetch("/api/me");
    return await resposta.json()
}