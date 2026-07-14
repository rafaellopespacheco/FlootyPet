import React from "react";

export default function ConfirmacaoModal({ texto, onConfirm, onCancel }) {
    return (
        <div 
            className="modal-confirmacao-overlay" 
            onClick={onCancel}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Arial, Helvetica, sans-serif",
                zIndex: 9999,
                pointerEvents: "all"
            }}
        >
            <div 
                className="modal-confirmacao" 
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "400px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
                }}
            >
                <div className="modal-confirmacao-header" style={{ padding: "20px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    <h2 style={{ color: "#151a2d", fontSize: "1.2em", margin: 0 }}>Confirmação</h2>
                </div>

                <div className="modal-confirmacao-body" style={{ padding: "20px", color: "#555", lineHeight: "1.5" }}>
                    <p style={{ margin: 0 }}>{texto}</p>
                </div>

                <div className="modal-confirmacao-footer" style={{ padding: "15px 20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button 
                        className="btn-cancelar" 
                        onClick={onCancel}
                        style={{
                            border: "none",
                            padding: "12px 18px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            backgroundColor: "#ececec",
                            color: "#333"
                        }}
                    >
                        Não
                    </button>
                    <button 
                        className="btn-confirmar" 
                        onClick={onConfirm}
                        style={{
                            border: "none",
                            padding: "12px 18px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            backgroundColor: "#d32f2f",
                            color: "white"
                        }}
                    >
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
}