export default async function () {
    const resposta = await fetch("/api/atualizacoes");
    const dados = await resposta.json();
    return dados;
}