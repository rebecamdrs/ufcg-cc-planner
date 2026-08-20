import { useEffect, useState } from "react"
import { MAPA_PERIODOS } from "../constants/mapa_periodos"

export function useGrade({ cadeiras, cadeirasPagas, buscarCadeira, dispararToastErro }) {
    // inicializa a grade vendo se tem alguma no localStorage antes
    const [grade, setGrade] = useState(() => {
        const gradeSalva = localStorage.getItem("grade_planejada")
        return gradeSalva ? JSON.parse(gradeSalva) : MAPA_PERIODOS
    })

    // efeito que é ativado sempre q a grade mudar
    useEffect(() => {
        localStorage.setItem("grade_planejada", JSON.stringify(grade)); // guarda a grade no storage
    }, [grade])

    /** Faz o reset total da grade e volta para a original (do PPC);
     * Mantém as cadeiras pagas.*/
    function resetarGrade() {
        if (!confirm('Deseja restaurar a matriz padrão? (Suas cadeiras pagas continuarão nos períodos atuais)')) return

        setGrade((gradeAtual) => {
            const novaGrade = {}
            const cadeirasPagasSet = new Set(cadeirasPagas)

            // Mapeia em qual período cada cadeira PAGA se encontra atualmente na grade do usuário
            const mapaPeriodosPagas = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                (cadeiras || []).forEach((c) => {
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
            Object.entries(MAPA_PERIODOS).forEach(([periodo, cadeiras]) => {
                cadeiras.forEach((cadeira) => {
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
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                const cadeirasPagasNoPeriodo = (cadeiras || []).filter((cadeira) =>
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
        if (!confirm('Deseja restaurar a matriz mantendo suas optativas e cadeiras pagas?')) return

        setGrade((gradeAtual) => {
            const novaGrade = {}
            const cadeirasJaAdicionadas = new Set()
            const cadeirasPagasSet = new Set(cadeirasPagas)

            // mapeia em qual período cada cadeira paga ta atualmente
            const mapaPeriodosPagas = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                const listaCadeiras = cadeiras || []
                listaCadeiras.forEach((c) => {
                    if (cadeirasPagasSet.has(c)) {
                        mapaPeriodosPagas[c] = periodo
                    }
                })
            })

            // mapeia optativas selecionadas apenas para o periodo onde foram colocadas
            const optativasCustomPorPeriodo = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                optativasCustomPorPeriodo[periodo] = []
                const listaCadeiras = cadeiras || []
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
                    // no periodo onde esta atualmente
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
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                const listaCadeiras = cadeiras || []
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

    /** Move cadeira para novo período */
    function moverCadeira(nomeCadeira, novoPeriodo) {
        const periodoDestino = Number(novoPeriodo);
        const preRequisitos = buscarCadeira(nomeCadeira).prerequisitos || []

        setGrade((gradeAtual) => {
            // valida os pre requisistos
            for (const requisitos of preRequisitos) {
                const objReq = cadeiras.find((c) => c.codigo === requisitos || c.nome === requisitos)
                const nomeReq = objReq ? objReq.nome : requisitos

                // encontra o periodo do pre requisito
                const periodoReq = Object.keys(gradeAtual).find((p) => gradeAtual[p].includes(nomeReq))

                // se o periodo ta no mesmo periodo ou em um anterior ao destino
                if (periodoReq !== undefined && Number(periodoReq) >= periodoDestino) {
                    dispararToastErro('Essa cadeira não pode ser movida para antes dos seus pré-requisitos.')
                    return gradeAtual
                }
            }

            // valida os pos requisitos (bloqueadas)
            for (const p in gradeAtual) {
                const numPeriodo = Number(p)

                for (const cadeira of gradeAtual[p]) {
                    if (cadeira === nomeCadeira) continue

                    const reqsDaCadeira = buscarCadeira(cadeira).prerequisitos || []
                    const objCadeiraSendoMovida = buscarCadeira(nomeCadeira)

                    // verifica se a cadeira atual exige a cadeira sendo movida 
                    const ehDependente = reqsDaCadeira.includes(nomeCadeira) || (objCadeiraSendoMovida.codigo && reqsDaCadeira.includes(objCadeiraSendoMovida.codigo))

                    if (ehDependente && numPeriodo <= periodoDestino) {
                        dispararToastErro('Essa cadeira não pode ser movida para para depois das cadeiras que dependem dela.')
                        return gradeAtual
                    }
                }
            }

            const rascunho = {};
            for (const p in gradeAtual) {
                rascunho[Number(p)] = gradeAtual[p].filter((n) => n !== nomeCadeira);
            }

            if (!rascunho[periodoDestino]) {
                rascunho[periodoDestino] = [];
            }
            rascunho[periodoDestino].push(nomeCadeira);

            const periodosComMaterias = Object.keys(rascunho)
                .map(Number)
                .filter((p) => rascunho[p].length > 0)
                .sort((a, b) => a - b);
            const totalPeriodos = Math.max(9, periodosComMaterias.length);
            const limitePeriodos = Math.min(totalPeriodos, 14);

            const novaGrade = {};

            for (let i = 1; i <= limitePeriodos; i++) {
                novaGrade[i] = [];
            }
            periodosComMaterias.forEach((p, index) => {
                const novoIndice = index + 1;
                if (novoIndice <= 14) {
                    novaGrade[novoIndice] = rascunho[p];
                }
            });
            return novaGrade;
        });
    }

    return { grade, resetarGrade, resetarMantendoOptativas, handleTrocarOptativa, moverCadeira }
}