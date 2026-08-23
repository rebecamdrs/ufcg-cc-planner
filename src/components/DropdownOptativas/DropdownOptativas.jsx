import { useState } from "react"
import "./dropdown.css"

export function DropdownOptativas({
  listaOptativas: rawOptativas = [],
  optativasEscolhidas = [],
  valorAtual = null,
  onSelecionar,
  onClose
}) {
  const [busca, setBusca] = useState("")

  // Remove duplicatas de nomes
  const listaSemDuplicatas = rawOptativas.filter(
    (item, index, self) => index === self.findIndex((t) => t.nome === item.nome)
  )

  // Oculta optativas já escolhidas em outros cards
  const listaDisponiveis = listaSemDuplicatas.filter((item) => {
    const jaEscolhida = optativasEscolhidas.includes(item.nome)
    const ehAEscolhaDesteCard = item.nome === valorAtual
    return !jaEscolhida || ehAEscolhaDesteCard
  })

  const listaFiltrada = listaDisponiveis.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="dropdown-container" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Buscar optativa..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="dropdown-input"
        autoFocus
      />

      <div className="dropdown-list">
        {listaFiltrada.map((item) => (
          <button
            key={item.nome}
            onClick={() => {
              onSelecionar(item.nome)
              onClose()
            }}
            className="dropdown-item"
          >
            {item.nome}
          </button>
        ))}

        {listaFiltrada.length === 0 && (
          <div className="dropdown-empty">
            Nenhuma optativa disponível
          </div>
        )}
      </div>

      <button
        onClick={() => {
          onSelecionar(null)
          onClose()
        }}
        className="dropdown-clear-btn"
      >
        Limpar
      </button>
    </div>
  )
}