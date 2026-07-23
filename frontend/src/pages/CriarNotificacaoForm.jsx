import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./CriarNotificacaoForm.css";

export default function CriarNotificacaoForm({ onNotificacaoCriada }) {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "Aviso",
    author: "Equipe Flooty Pet",
    descricao: "",
  });

  const [preview, setPreview] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const response = await fetch("/api/notificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMsg({ type: "success", text: "Notificação lançada com sucesso!" });
        setFormData({
          titulo: "",
          tipo: "Aviso",
          author: "Equipe Flooty Pet",
          descricao: "",
        });
        
        // Callback opcional para recarregar a central de notificações se estiver visível
        if (onNotificacaoCriada) onNotificacaoCriada();
      } else {
        setStatusMsg({ type: "error", text: result.erro || "Erro ao lançar notificação." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Erro de conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-notificacao-container">
      <h3>Lançar Nova Notificação</h3>

      {statusMsg && (
        <div className={`status-alert ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Instabilidade temporária na agenda"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo:</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="Aviso">Aviso</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Atualização">Atualização</option>
            </select>
          </div>

          <div className="form-group">
            <label>Autor:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Ex: Equipe Flooty Pet"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-preview-header">
            <label>Descrição (suporta Markdown):</label>
            <button
              type="button"
              className="btn-toggle-preview"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Editar Textarea" : "Ver Prévia Markdown"}
            </button>
          </div>

          {!preview ? (
            <textarea
              name="descricao"
              rows="6"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Você pode usar Markdown! Ex:&#10;**Atenção:** Teremos uma pausa.&#10;- Item 1&#10;- Item 2"
              required
            />
          ) : (
            <div className="markdown-preview-box">
              <ReactMarkdown>{formData.descricao || "*Nenhum texto informado.*"}</ReactMarkdown>
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit-notificacao" disabled={loading}>
          {loading ? "Enviando..." : "Lançar Notificação"}
        </button>
      </form>
    </div>
  );
}