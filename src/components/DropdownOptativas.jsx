import { useState } from "react";

export function DropdownOptativas({ listaOptativas = [], onSelecionar, onClose }) {
  const [busca, setBusca] = useState("");

  const listaFiltrada = listaOptativas.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        width: "100%",
        minWidth: "220px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
        border: "1px solid #e2e8f0",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        zIndex: 100
      }}
    >
      <input
        type="text"
        placeholder="Buscar optativa..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          fontSize: "12px",
          outline: "none",
          boxSizing: "border-box"
        }}
        autoFocus
      />

      <div style={{ maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {listaFiltrada.map((item) => (
          <button
            key={item.nome}
            onClick={() => {
              onSelecionar(item.nome);
              onClose();
            }}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              fontSize: "11px",
              textAlign: "left",
              color: "#334155"
            }}
          >
            {item.nome}
          </button>
        ))}

        {listaFiltrada.length === 0 && (
          <div style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", padding: "8px" }}>
            Nenhuma encontrada
          </div>
        )}
      </div>

      <button
        onClick={() => {
          onSelecionar(null);
          onClose();
        }}
        style={{
          background: "none",
          border: "none",
          color: "#ef4444",
          fontSize: "11px",
          cursor: "pointer",
          textAlign: "center",
          paddingTop: "4px",
          borderTop: "1px solid #f1f5f9"
        }}
      >
        Limpar
      </button>
    </div>
  );
}