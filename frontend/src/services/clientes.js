export async function buscarClientes() {
    const response = await fetch("/api/clientes");
    const dados = await response.json();

    return dados;
}

export function formatarTelefone(numero) {
    numero = String(numero).replace(/\D/g, "");

    const ddd = numero.slice(2, 4);
    const primeiraParte = numero.slice(4, 9);
    const segundaParte = numero.slice(9, 13);

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
}