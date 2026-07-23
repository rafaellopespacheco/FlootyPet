import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import "./NotificationCenter.css";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);
  const [modalTodasAberto, setModalTodasAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper para limpar sintaxe Markdown apenas na prévia
  const limparMarkdown = (texto) => {
    if (!texto) return "";
    return texto
      .replace(/#+\s?/g, "") // Remove títulos (#, ##)
      .replace(/[*_~`]/g, "") // Remove negrito, itálico, código (*, _, ~)
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Transforma [link](url) apenas no texto do link
      .trim();
  };

  const buscarNotificacoes = async () => {
    try {
      const response = await fetch("/api/notificacoes");
      if (response.ok) {
        const data = await response.json();
        setNotificacoes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const getIconByTipo = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "manutenção":
        return "build";
      case "atualização":
        return "rocket_launch";
      case "aviso":
      default:
        return "info";
    }
  };

  const temNaoLidas = notificacoes.some((n) => n.lida === 0);

  const handleAbrirNotificacao = async (notificacao) => {
    setNotificacaoSelecionada(notificacao);

    if (notificacao.lida === 0) {
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === notificacao.id ? { ...n, lida: 1 } : n))
      );

      try {
        await fetch(`/api/notificacoes/${notificacao.id}/lida`, {
          method: "PATCH",
        });
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error);
      }
    }
  };

  const handleMarcarTodasLidas = async () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: 1 })));

    try {
      await fetch("/api/notificacoes/marcar-todas-lidas", {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const handleVerTodas = () => {
    setIsOpen(false);
    setModalTodasAberto(true);
  };

  return (
    <div className="mensagens-container">
      {/* Botão Sino */}
      <button
        className="buttonAbrirNotificacao"
        title="Central de Notificações"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-rounded">notifications</span>
        {temNaoLidas && <span className="notification-badge-dot"></span>}
      </button>

      {/* Dropdown Quick View */}
      {isOpen && (
        <div className="notdropdown">
          <div className="dropdown-arrow"></div>

          <div className="notdropdown-header">
            <h4>Notificações</h4>
            {temNaoLidas && (
              <button className="btn-mark-read" onClick={handleMarcarTodasLidas}>
                Marcar como lidas
              </button>
            )}
          </div>

          <div className="notdropdown-body">
            {loading ? (
              <p className="notificacao-empty">Carregando...</p>
            ) : notificacoes.length === 0 ? (
              <p className="notificacao-empty">Nenhuma notificação por enquanto.</p>
            ) : (
              notificacoes.map((notificacao) => (
                <div
                  className={`notification-card ${notificacao.lida === 0 ? "nao-lida" : ""}`}
                  key={notificacao.id}
                  onClick={() => handleAbrirNotificacao(notificacao)}
                >
                  <div className="card-icon-container">
                    <span className={`material-symbols-rounded icon-${notificacao.tipo?.toLowerCase()}`}>
                      {getIconByTipo(notificacao.tipo)}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="card-top">
                      <h3 className="card-title">{notificacao.titulo}</h3>
                      {notificacao.lida === 0 && <span className="unread-dot"></span>}
                    </div>

                    {/* Texto limpo sem sintaxe markdown na prévia */}
                    <p className="card-desc-preview">
                      {limparMarkdown(notificacao.descricao)}
                    </p>

                    <div className="card-meta">
                      <span className={`tipo ${notificacao.tipo?.toLowerCase()}`}>
                        {notificacao.tipo}
                      </span>
                      <span className="card-time">
                        {formatDistanceToNow(new Date(notificacao.created_at.replace(" ", "T")), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notdropdown-footer">
            <button className="btn-view-all" onClick={handleVerTodas}>
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}

      {/* Modal 1: Detalhes da Notificação Selecionada */}
      {notificacaoSelecionada && (
        <div className="modal-overlay" onClick={() => setNotificacaoSelecionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <span className={`material-symbols-rounded icon-${notificacaoSelecionada.tipo?.toLowerCase()}`}>
                  {getIconByTipo(notificacaoSelecionada.tipo)}
                </span>
                <h2>{notificacaoSelecionada.titulo}</h2>
              </div>
              <button className="btn-close-modal" onClick={() => setNotificacaoSelecionada(null)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-meta-info">
                <span className={`tipo ${notificacaoSelecionada.tipo?.toLowerCase()}`}>
                  {notificacaoSelecionada.tipo}
                </span>
                <span>•</span>
                <span className="modal-author">{notificacaoSelecionada.author}</span>
                <span>•</span>
                <span className="modal-date">
                  {formatDistanceToNow(new Date(notificacaoSelecionada.created_at.replace(" ", "T")), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              <div className="modal-description">
                <ReactMarkdown>{notificacaoSelecionada.descricao}</ReactMarkdown>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal-primary" onClick={() => setNotificacaoSelecionada(null)}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Lista Completa ("Ver todas as notificações") */}
      {modalTodasAberto && (
        <div className="modal-overlay" onClick={() => setModalTodasAberto(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Todas as Notificações</h2>
              <button className="btn-close-modal" onClick={() => setModalTodasAberto(false)}>
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="modal-body modal-scrollable-list">
              {notificacoes.length === 0 ? (
                <p className="notificacao-empty">Nenhuma notificação encontrada.</p>
              ) : (
                notificacoes.map((notificacao) => (
                  <div
                    key={notificacao.id}
                    className={`notification-card ${notificacao.lida === 0 ? "nao-lida" : ""}`}
                    onClick={() => {
                      setModalTodasAberto(false);
                      handleAbrirNotificacao(notificacao);
                    }}
                  >
                    <div className="card-icon-container">
                      <span className={`material-symbols-rounded icon-${notificacao.tipo?.toLowerCase()}`}>
                        {getIconByTipo(notificacao.tipo)}
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="card-top">
                        <h3 className="card-title">{notificacao.titulo}</h3>
                        {notificacao.lida === 0 && <span className="unread-dot"></span>}
                      </div>
                      <p className="card-desc-preview">{limparMarkdown(notificacao.descricao)}</p>
                      <div className="card-meta">
                        <span className={`tipo ${notificacao.tipo?.toLowerCase()}`}>
                          {notificacao.tipo}
                        </span>
                        <span className="card-time">
                          {formatDistanceToNow(new Date(notificacao.created_at.replace(" ", "T")), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}