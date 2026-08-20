import { useEffect, useMemo, useState } from "react"
import { MAPA_PERIODOS } from "../constants/mapa_periodos"
import { sanitizarCadeiras } from "../utils/cadeirasHelpers"

export function useCadeiras() {
    const [cadeiras, setCadeiras] = useState([])

    // busca as cadeiras do json do git
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
            .then((resposta) => resposta.json())
            .then((dados) => {
                const dadosTratados = sanitizarCadeiras(dados)
                setCadeiras(dadosTratados)
            })
            .catch((erro) => console.error("Erro ao carregar dados:", erro))
    }, [])

    /** Busca cadeira a partir do nome */
    function buscarCadeira(nome) {
        if (!nome) return null;

        if (nome.startsWith("Atividades Complementares")) {
            return { nome: nome, creditos: 0, carga_horaria: 120 }
        }
        if (nome.startsWith("Optativa")) {
            return { nome: nome, creditos: 4, carga_horaria: 60 }
        }

        const padrao = { nome: nome, creditos: '-', carga_horaria: '-' }
        return cadeiras.find((c) => c.nome === nome) || padrao
    }

    const listaOptativasDisponiveis = useMemo(() => {
        const nomesObrigatorias = new Set(
            Object.values(MAPA_PERIODOS).flat().filter((n) => !n.startsWith("Optativa") && !n.startsWith("Atividades"))
        )
        return cadeiras.filter((c) => !nomesObrigatorias.has(c.nome))
    }, [cadeiras])

    return { cadeiras, buscarCadeira, listaOptativasDisponiveis }
}