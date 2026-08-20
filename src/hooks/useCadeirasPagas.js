import { useEffect, useState } from "react"
import { isLiberada } from "../utils/cadeirasHelpers"

export function useCadeirasPagas(cadeiras, onErroPreRequisito) {
    const [cadeirasPagas, setCadeirasPagas] = useState(() => {
        const salvas = localStorage.getItem('cadeirasPagas')
        return salvas ? JSON.parse(salvas) : []
    })

    useEffect(() => {
        localStorage.setItem('cadeirasPagas', JSON.stringify(cadeirasPagas))
    }, [cadeirasPagas])

    /** Atualiza a lista de cadeiras pagas */
    function pagarCadeira(cadeira) {
        const nomeCadeira = cadeira.nome
        setCadeirasPagas((listaAnterior) => {
            // se a cadeira ja esta na lista, remove (desmarca)
            if (cadeirasPagas.includes(nomeCadeira)) {
                return listaAnterior.filter((nome) => nome !== nomeCadeira)
            }
            // se nao estiver, verifica se ta liberada e adiciona no final da lista (marca)
            if (isLiberada(cadeira, listaAnterior)) {
                return [...listaAnterior, nomeCadeira]
            }
            onErroPreRequisito?.() // '?.' // só chama se erro existir
            return listaAnterior
        })
    }

    return { cadeirasPagas, pagarCadeira }
}