import { useState, useRef, useEffect } from "react";
import { DropdownOptativas } from "./DropdownOptativas";

export function CardCadeira({
  cadeira,
  cadeiraSelecionada,
  setCadeiraSelecionada,
  excesso,
  listaOptativas = [],
  onSelecionarOptativa,
  cadeirasPagas,
  pagarCadeira
}) {
  if (!cadeira) return null;

  const foiPaga = cadeirasPagas.includes(cadeira.nome)

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
      className={`card-cadeira ${statusClass} ${ehOptativa ? "card-optativa-slot" : ""} ${foiPaga ? 'card-paga' : ''}`}
      style={{
        position: 'relative',
        cursor: 'grab', // permite o cursor de arrastar
        zIndex: menuAberto ? 50 : 1
      }}
      draggable={!menuAberto && !foiPaga} // só desativa o arrasto se a listinha estiver aberta
      onClick={() => {
        // se for uma optativa sem cadeira escolhida abre o dropdown
        if (cadeira.nome.startsWith("Optativa")) {
          setMenuAberto((prev) => !prev);
        } else {
          pagarCadeira(cadeira);
        }
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

      {ehOptativa && !cadeira.nome.startsWith("Optativa") && (
        <button
          type="button"
          className="btn-trocar-optativa"
          title="Trocar disciplina optativa"
          onClick={(e) => {
            e.stopPropagation();
            setMenuAberto((prev) => !prev);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw-icon lucide-refresh-ccw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
        <strong className="titulo-cadeira">{cadeira.nome}</strong>
        <span className="badge-subtexto-card">
          {ehOptativa ? "optativa" : "obrigatória"}
        </span>

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