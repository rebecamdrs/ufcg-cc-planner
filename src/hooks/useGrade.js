import { useEffect, useState } from "react"
import { MAPA_PERIODOS } from "../constants/mapa_periodos"
import { COREQUISITOS_PADRAO } from "../utils/sanitizarCadeiras.js"

export function useGrade({ cadeiras, cadeirasPagas, buscarCadeira, dispararToastErro }) {
    // inicializa a grade vendo se tem alguma no localStorage antes
    const [grade, setGrade] = useState(() => {
        const gradeSalva = localStorage.getItem("grade_planejada")
        return gradeSalva ? JSON.parse(gradeSalva) : MAPA_PERIODOS
    })

    // efeito que é ativado sempre q a grade mudar
    useEffect(() => {
        localStorage.setItem("grade_planejada", JSON.stringify(grade)) // guarda a grade no storage
    }, [grade])

    /** Faz o reset total da grade e volta para a original (do PPC);
     * Mantém as cadeiras pagas.*/
    function resetarGrade() {
        setGrade((gradeAtual) => {
            const novaGrade = {}
            const cadeirasPagasSet = new Set(cadeirasPagas)

            // Mapeia em qual período cada cadeira PAGA se encontra atualmente na grade do usuário
            const mapaPeriodosPagas = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeirasLista]) => {
                (cadeirasLista || []).forEach((c) => {
                    if (cadeirasPagasSet.has(c)) {
                        mapaPeriodosPagas[c] = periodo
                    }
                })
            })

            // cria os periodos da matriz padrão vazios
            Object.keys(MAPA_PERIODOS).forEach((periodo) => {
                novaGrade[periodo] = []
            })

            // add as cadeiras padrao menos as pagas
            Object.entries(MAPA_PERIODOS).forEach(([periodo, cadeirasPadrao]) => {
                cadeirasPadrao.forEach((cadeira) => {
                    // Se a cadeira for paga e foi movida para outro período, não insere no período original
                    const periodoOndeEstaPaga = mapaPeriodosPagas[cadeira]
                    if (periodoOndeEstaPaga && periodoOndeEstaPaga !== periodo) {
                        return
                    }

                    if (!cadeirasPagasSet.has(cadeira)) {
                        novaGrade[periodo].push(cadeira)
                    }
                })
            })

            // poe as cadeiras pagas de volta no periodo onde estao atualmente
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeirasLista]) => {
                const cadeirasPagasNoPeriodo = (cadeirasLista || []).filter((cadeira) =>
                    cadeirasPagasSet.has(cadeira)
                )

                if (cadeirasPagasNoPeriodo.length === 0) return

                // se for um periodo extra
                if (!novaGrade[periodo]) {
                    novaGrade[periodo] = []
                }

                cadeirasPagasNoPeriodo.forEach((c) => {
                    if (!novaGrade[periodo].includes(c)) {
                        novaGrade[periodo].push(c)
                    }
                })
            })

            return novaGrade
        })
    }

    /** Faz o reset mantendo as optativas selecionadas;
     * Mantém as cadeiras pagas.*/
    function resetarMantendoOptativas() {
        setGrade((gradeAtual) => {
            const novaGrade = {}
            const cadeirasJaAdicionadas = new Set()
            const cadeirasPagasSet = new Set(cadeirasPagas)

            // mapeia em qual período cada cadeira paga ta atualmente
            const mapaPeriodosPagas = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeirasLista]) => {
                const listaCadeiras = cadeirasLista || []
                listaCadeiras.forEach((c) => {
                    if (cadeirasPagasSet.has(c)) {
                        mapaPeriodosPagas[c] = periodo
                    }
                })
            })

            // mapeia optativas selecionadas apenas para o periodo onde foram colocadas
            const optativasCustomPorPeriodo = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeirasLista]) => {
                optativasCustomPorPeriodo[periodo] = []
                const listaCadeiras = cadeirasLista || []
                listaCadeiras.forEach((c) => {
                    const ehPadrao = Object.values(MAPA_PERIODOS).flat().includes(c)
                    // se nn for cadeira padrao da matriz (optativa escolhida pelo usuário) e não estiver paga
                    if (!ehPadrao && !cadeirasPagasSet.has(c)) {
                        optativasCustomPorPeriodo[periodo].push(c)
                    }
                })
            })

            // add uma cadeira somente se nao estiver na grade
            function adicionarCadeira(periodo, cadeira) {
                if (!cadeira || cadeirasJaAdicionadas.has(cadeira)) return

                // se for um periodo extra cria o array apenas ao adicionar a cadeira
                if (!novaGrade[periodo]) {
                    novaGrade[periodo] = []
                }

                novaGrade[periodo].push(cadeira)
                cadeirasJaAdicionadas.add(cadeira)
            }

            // refaz os periodos da matriz padrao
            Object.entries(MAPA_PERIODOS).forEach(([periodo, cadeirasPadrao]) => {
                novaGrade[periodo] = []
                const optativasDoPeriodo = optativasCustomPorPeriodo[periodo] || []
                let idxOptativaLocal = 0

                cadeirasPadrao.forEach((cadeiraPadrao) => {
                    // se a cadeira padrao estiver paga e foi movida para outro periodo libera o slot original
                    const periodoOndeEstaPaga = mapaPeriodosPagas[cadeiraPadrao]
                    if (periodoOndeEstaPaga && periodoOndeEstaPaga !== periodo) return

                    // se a cadeira padrao estiver paga, ela sera adicionada depois
                    if (cadeirasPagasSet.has(cadeiraPadrao)) return

                    // mantem a optativa escolhida pelo user NO MESMO PERÍODO
                    if (cadeiraPadrao.startsWith('Optativa')) {
                        if (idxOptativaLocal < optativasDoPeriodo.length) {
                            const optativaCustom = optativasDoPeriodo[idxOptativaLocal]
                            idxOptativaLocal++
                            adicionarCadeira(periodo, optativaCustom)
                            cadeirasJaAdicionadas.add(cadeiraPadrao)
                            return
                        }
                    }

                    adicionarCadeira(periodo, cadeiraPadrao)
                })
            })

            // mantem cadeiras pagas que tao em periodos extras
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeirasLista]) => {
                const listaCadeiras = cadeirasLista || []
                listaCadeiras.forEach((cadeira) => {
                    if (cadeirasPagasSet.has(cadeira)) {
                        adicionarCadeira(periodo, cadeira)
                    }
                })
            })

            return novaGrade
        })
    }

    function handleTrocarOptativa(periodoNum, indexItem, nomeEscolhido, nomeOriginal) {
        setGrade((prev) => {
            const novoPeriodo = [...prev[periodoNum]]
            const nomePadraoOriginal = MAPA_PERIODOS[periodoNum]?.[indexItem] || nomeOriginal

            novoPeriodo[indexItem] = nomeEscolhido || nomePadraoOriginal
            return { ...prev, [periodoNum]: novoPeriodo }
        })
    }

    /** Move cadeira (e seus co-requisitos vinculados) para novo período */
    function moverCadeira(nomeCadeira, novoPeriodo) {
        if (!nomeCadeira) return
        const periodoDestino = Number(novoPeriodo)

        // Se tiver co-requisito padrão cadastrado, movimenta ambos juntos
        const parceiros = COREQUISITOS_PADRAO?.[nomeCadeira] || []
        const grupoAMover = [nomeCadeira, ...parceiros]

        setGrade((gradeAtual) => {
            // 1. Validação de pré-requisitos para todas as cadeiras do grupo
            for (const cadeiraAtual of grupoAMover) {
                const objAtual = buscarCadeira(cadeiraAtual) || {}
                const preRequisitos = objAtual.prerequisitos || []

                for (const requisito of preRequisitos) {
                    // ignora vínculo entre elas
                    if (grupoAMover.includes(requisito)) continue

                    const objReq = cadeiras.find((c) => c.codigo === requisito || c.nome === requisito)
                    const nomeReq = objReq ? objReq.nome : requisito
                    const periodoReq = Object.keys(gradeAtual).find((p) => gradeAtual[p]?.includes(nomeReq))

                    if (periodoReq !== undefined && Number(periodoReq) >= periodoDestino) {
                        dispararToastErro(`Não é possível mover: ${cadeiraAtual} depende de ${nomeReq}.`)
                        return gradeAtual
                    }
                }
            }

            // 2. Validação de pós-requisitos (cadeiras que dependem de alguma do grupo)
            for (const p in gradeAtual) {
                const numPeriodo = Number(p)

                for (const cadeiraNaGrade of gradeAtual[p]) {
                    if (grupoAMover.includes(cadeiraNaGrade)) continue

                    const reqsDaCadeira = buscarCadeira(cadeiraNaGrade)?.prerequisitos || []

                    for (const cadeiraAtual of grupoAMover) {
                        const objCadeiraAtual = buscarCadeira(cadeiraAtual) || {}
                        const ehDependente =
                            reqsDaCadeira.includes(cadeiraAtual) ||
                            (objCadeiraAtual.codigo && reqsDaCadeira.includes(objCadeiraAtual.codigo))

                        if (ehDependente && numPeriodo <= periodoDestino) {
                            dispararToastErro(
                                `Não é possível mover: ${cadeiraNaGrade} depende de ${cadeiraAtual}.`
                            )
                            return gradeAtual
                        }
                    }
                }
            }

            // 3. Monta o rascunho removendo o grupo dos períodos antigos
            const rascunho = {}
            for (const p in gradeAtual) {
                rascunho[Number(p)] = (gradeAtual[p] || []).filter((n) => !grupoAMover.includes(n))
            }

            // 4. Adiciona o grupo no período de destino
            if (!rascunho[periodoDestino]) {
                rascunho[periodoDestino] = []
            }
            grupoAMover.forEach((nome) => {
                rascunho[periodoDestino].push(nome)
            })

            // 5. Reorganiza e ajusta tamanho da grade
            const periodosComMaterias = Object.keys(rascunho)
                .map(Number)
                .filter((p) => rascunho[p].length > 0)
                .sort((a, b) => a - b)
            const totalPeriodos = Math.max(9, periodosComMaterias.length)
            const limitePeriodos = Math.min(totalPeriodos, 14)

            const novaGrade = {}
            for (let i = 1; i <= limitePeriodos; i++) {
                novaGrade[i] = []
            }
            periodosComMaterias.forEach((p, index) => {
                const novoIndice = index + 1
                if (novoIndice <= 14) {
                    novaGrade[novoIndice] = rascunho[p]
                }
            })

            return novaGrade
        })
    }

    return { grade, resetarGrade, resetarMantendoOptativas, handleTrocarOptativa, moverCadeira }
}