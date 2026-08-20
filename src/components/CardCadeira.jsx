import { useState, useRef, useEffect } from "react";
import { DropdownOptativas } from "./DropdownOptativas";

export function CardCadeira({ 
  cadeira, 
  cadeiraSelecionada, 
  setCadeiraSelecionada, 
  excesso, 
  listaOptativas = [], 
  onSelecionarOptativa 
}) {
  if (!cadeira) return null;

  const [menuAberto, setMenuAberto] = useState(false);
  const dropdownRef = useRef(null);

  // Identifica se é um slot de optativa ou uma matéria optativa já selecionada
  const ehOptativa = 
    cadeira.nome.startsWith("Optativa") || 
    listaOptativas.some((item) => item.nome === cadeira.nome);

  useEffect(() => {
    function handleClickFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    if (menuAberto) {
      document.addEventListener("mousedown", handleClickFora);
    }
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [menuAberto]);

  function normalizar(texto) {
    if (!texto) return "";
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  const nomeAtual = normalizar(cadeira.nome);
  const nomeSelecionada = normalizar(cadeiraSelecionada?.nome);
  const isSelecionado = nomeSelecionada && nomeAtual === nomeSelecionada;
  const listaRequisitos = cadeiraSelecionada?.prerequisitos || [];

  function isPreRequisito() {
    if (!listaRequisitos || listaRequisitos.length === 0) return false;
    for (const requisito of listaRequisitos) {
      if (normalizar(requisito) === nomeAtual) return true;
    }
    return false;
  }

  function isBloqueada() {
    if (!nomeSelecionada || isSelecionado) return false;
    const requisitosAtual = cadeira.prerequisitos || [];
    for (const requisito of requisitosAtual) {
      if (normalizar(requisito) === nomeSelecionada) return true;
    }
    return false;
  }

  let statusClass = "";
  let aviso = "";
  if (isSelecionado) {
    statusClass = "card-ativo";
  } else if (isPreRequisito()) {
    statusClass = "card-prerequisito";
    aviso = "Pré-requisito";
  } else if (isBloqueada()) {
    statusClass = "card-bloqueado";
    aviso = "Libera";
  }

  return (
    <div
  ref={dropdownRef}
  className={`card-cadeira ${statusClass} ${ehOptativa ? "card-optativa-slot" : ""}`}
  style={{ 
    position: 'relative',
    cursor: 'grab', // permite o cursor de arrastar
    zIndex: menuAberto ? 50 : 1
  }}
  draggable={!menuAberto} // só desativa o arrasto se a listinha estiver aberta
  onClick={() => {
    if (ehOptativa) setMenuAberto((prev) => !prev);
  }}
  onMouseEnter={() => !cadeira.nome.startsWith("Optativa") && setCadeiraSelecionada(cadeira)}
  onMouseLeave={() => !cadeira.nome.startsWith("Optativa") && setCadeiraSelecionada(null)}
  onDragStart={(e) => {
    e.dataTransfer.setData("text/plain", cadeira.nome);
  }}
>
      {excesso && (
        <span
          className="bolinha-alerta"
          title="Limite de 6 cadeiras por período excedido"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Aviso: ultrapassa limite de 6 cadeiras por período.`);
          }}
        >
          !
        </span>
      )}

      {aviso && <span className="aviso-status">{aviso}</span>}

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
        <strong className="titulo-cadeira">{cadeira.nome}</strong>
        {ehOptativa && (
          <span
            style={{
              fontSize: "10px",
              color: "#38bdf8",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}
          >
            Optativa
          </span>
        )}
      </div>

      {ehOptativa && menuAberto && (
        <DropdownOptativas
          listaOptativas={listaOptativas}
          onSelecionar={onSelecionarOptativa}
          onClose={() => setMenuAberto(false)}
        />
      )}
    </div>
  );
}