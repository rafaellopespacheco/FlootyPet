import { useEffect, useState } from "react";

export default function Configuracao() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarServicos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/servicos");
      if (response.ok) {
        const dados = await response.json();
        setServicos(dados);
      } else {
        console.error("Erro ao carregar serviços na API.");
      }
    } catch (error) {
      console.error("Erro de conexão com o servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <div className="configuracao-wrapper">
      <h1>Configuração</h1>
      <p>Em desenvolvimento</p>

      <div className="servicos-crud">
        {loading ? (
          <p>Carregando serviços...</p>
        ) : (
          <ul>
            {servicos.map((servico) => (
              <li key={servico.id}>
                <strong>{servico.nome}</strong> - R${" "}
                {Number(servico.preco_padrao || 0).toFixed(2)} ({servico.duracao} min)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}