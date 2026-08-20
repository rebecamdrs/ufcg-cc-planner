import { useEffect, useState, useMemo } from "react"
import { MAPA_PERIODOS } from "./constants/mapa_periodos"
import { ColunaPeriodo } from "./components/ColunaPeriodo"
import "./App.css"
import toast, { Toaster } from 'react-hot-toast'

export default function App() {
    const [cadeiras, setCadeiras] = useState([])

    // inicializa a grade vendo se tem alguma no localStorage antes
    const [grade, setGrade] = useState(() => {
        const gradeSalva = localStorage.getItem("grade_planejada")
        return gradeSalva ? JSON.parse(gradeSalva) : MAPA_PERIODOS
    })

    // efeito que é ativado sempre q a grade mudar
    useEffect(() => {
        localStorage.setItem("grade_planejada", JSON.stringify(grade)); // guarda a grade no storage
    }, [grade])

    /** RESET TOTAL */
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

                if (cadeirasPagasNoPeriodo.length === 0) {
                    return
                }

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


    /** RESTAURAR MANTENDO OPTATIVAS E PAGAS */
    function resetarMantendoOptativas() {
        if (!confirm('Deseja restaurar a matriz mantendo suas optativas e cadeiras pagas?')) return

        setGrade((gradeAtual) => {
            const novaGrade = {}
            const cadeirasJaAdicionadas = new Set()
            const cadeirasPagasSet = new Set(cadeirasPagas)

            // Mapeia em qual período cada cadeira PAGA se encontra atualmente
            const mapaPeriodosPagas = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                const listaCadeiras = cadeiras || []
                listaCadeiras.forEach((c) => {
                    if (cadeirasPagasSet.has(c)) {
                        mapaPeriodosPagas[c] = periodo
                    }
                })
            })

            // Mapeia optativas customizadas por PERÍODO específico (para não ir para o 1º slot disponível)
            const optativasPorPeriodo = {}
            Object.entries(gradeAtual || {}).forEach(([periodo, cadeiras]) => {
                optativasPorPeriodo[periodo] = []
                const listaCadeiras = cadeiras || []
                listaCadeiras.forEach((c) => {
                    const ehPadrao = Object.values(MAPA_PERIODOS).flat().includes(c)
                    if (!ehPadrao && !cadeirasPagasSet.has(c)) {
                        optativasPorPeriodo[periodo].push(c)
                    }
                })
            })

            // add uma cadeira somente se nao estiver na grade
            function adicionarCadeira(periodo, cadeira) {
                if (!cadeira || cadeirasJaAdicionadas.has(cadeira)) return

                // se for um periodo extra, cria o array apenas ao adicionar a cadeira
                if (!novaGrade[periodo]) {
                    novaGrade[periodo] = []
                }

                novaGrade[periodo].push(cadeira)
                cadeirasJaAdicionadas.add(cadeira)
            }

            // refaz os periodos da matriz padrao
            Object.entries(MAPA_PERIODOS).forEach(([periodo, cadeirasPadrao]) => {
                novaGrade[periodo] = []
                const optativasDoPeriodo = optativasPorPeriodo[periodo] || []
                let idxOptativaLocal = 0

                cadeirasPadrao.forEach((cadeiraPadrao) => {
                    // se a cadeira padrao estiver paga e foi movida para outro periodo, libera o slot original
                    const periodoOndeEstaPaga = mapaPeriodosPagas[cadeiraPadrao]
                    if (periodoOndeEstaPaga && periodoOndeEstaPaga !== periodo) {
                        return
                    }

                    // se a cadeira padrao estiver paga, ela sera adicionada depois
                    // no periodo onde esta atualmente
                    if (cadeirasPagasSet.has(cadeiraPadrao)) {
                        return
                    }

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

    // guarda a cadeira que o mouse ta em cima
    const [cadeiraSelecionada, setCadeiraSelecionada] = useState(null)

    const dispararToastErro = (mensagem) => {
        toast.custom((t) => (
            <div className={`toast-custom-card ${t.visible ? 'toast-entrar' : 'toast-sair'}`}>
                <div className="toast-icone-wrapper">
                    <svg className="toast-svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="toast-conteudo">
                    <span className="toast-titulo">ATENÇÃO</span>
                    <span className="toast-mensagem">{mensagem}</span>
                </div>
            </div>
        ), { id: 'erro-movimentacao', duration: 4000 });
    }

    const dispararToastAlerta = (mensagem) => {
        toast.custom((t) => (
            <div className={`toast-custom-card toast-alerta ${t.visible ? 'toast-entrar' : 'toast-sair'}`}>
                <div className="toast-icone-wrapper">
                    <svg
                        className="toast-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                </div>
                <div className="toast-conteudo">
                    <span className="toast-titulo">AVISO</span>
                    <span className="toast-mensagem">{mensagem}</span>
                </div>
            </div>
        ), { id: 'alerta-requisito', duration: 4000 });
    }

    // Busca as cadeiras do json do git
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
            .then(resposta => resposta.json())
            .then(dados => setCadeiras(dados))
            .catch(erro => console.error("Erro ao carregar dados:", erro))
    }, [])

    // busca cadeira a partir do nome
    function buscarCadeira(nome) {
        if (!nome) return null;

        if (nome.startsWith("Atividades Complementares")) {
            return { nome: nome, creditos: 0, carga_horaria: 120 };
        }
        if (nome.startsWith("Optativa")) {
            return { nome: nome, creditos: 4, carga_horaria: 60 };
        }

        const padrao = { nome: nome, creditos: '-', carga_horaria: '-' };
        return cadeiras.find((c) => c.nome === nome) || padrao;
    }

    const [cadeirasPagas, setCadeirasPagas] = useState(() => {
        const salvas = localStorage.getItem('cadeirasPagas')
        return salvas ? JSON.parse(salvas) : []
    })

    useEffect(() => {
        localStorage.setItem('cadeirasPagas', JSON.stringify(cadeirasPagas))
    }, [cadeirasPagas])

    // atualiza a lista de cadeiras pagas
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
            dispararToastAlerta('Pré-Requisitos não foram atendidos.')
            return listaAnterior
        })
    }

    /* verofica se uma cadeira está liberada para pagar */
    function isLiberada(cadeira, pagas) {
        const requisitos = cadeira.prerequisitos || []
        if (requisitos.length === 0) return true

        // Para cada pré-requisito, busca o objeto da disciplina para pegar o nome
        return requisitos.every((req) => {
            const objReq = cadeiras.find((c) => c.codigo === req || c.nome === req)
            const nomeReq = objReq ? objReq.nome : req
            return pagas.includes(nomeReq)
        })
    }

    const listaOptativasDisponiveis = useMemo(() => {
        const nomesObrigatorias = new Set(
            Object.values(MAPA_PERIODOS)
                .flat()
                .filter((n) => !n.startsWith("Optativa") && !n.startsWith("Atividades"))
        );
        return cadeiras.filter((c) => !nomesObrigatorias.has(c.nome));
    }, [cadeiras]);

    function handleTrocarOptativa(periodoNum, indexItem, nomeEscolhido, nomeOriginal) {
        setGrade((prev) => {
            const novoPeriodo = [...prev[periodoNum]];
            const nomePadraoOriginal = MAPA_PERIODOS[periodoNum]?.[indexItem] || nomeOriginal;

            novoPeriodo[indexItem] = nomeEscolhido || nomePadraoOriginal;
            return { ...prev, [periodoNum]: novoPeriodo };
        });
    }

    // move cadeira para novo periodo
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

    return (
        <div className="container-principal">
            <Toaster position="top-right" reverseOrder={false} />

            <header className="header-app">
                <div>
                    <span className="tag-header">Matriz Curricular</span>
                    <h1 className="titulo-principal">Planner CC</h1>
                </div>
                <div className="botoes-header">
                    <button
                        className="botao-reset botao-reset-secundario"
                        onClick={resetarMantendoOptativas}
                        title="Restaura a grade padrão mantendo suas escolhas de optativas e cadeiras pagas"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icone-botao lucide lucide-rotate-ccw"
                        >
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        <span>Restaurar</span>
                    </button>

                    <button
                        className="botao-reset"
                        onClick={resetarGrade}
                        title="Restaura a matriz original (suas cadeiras pagas continuarão salvas)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icone-botao lucide lucide-trash"
                        >
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Reset Total</span>
                    </button>
                </div>
            </header>

            <div className="container-periodos">
                {Object.entries(grade).map(([periodo, nomesCadeiras]) => (
                    <ColunaPeriodo
                        key={periodo}
                        numeroPeriodo={Number(periodo)}
                        nomesCadeiras={nomesCadeiras}
                        buscarCadeira={buscarCadeira}
                        onMoverCadeira={moverCadeira}
                        cadeiraSelecionada={cadeiraSelecionada}
                        setCadeiraSelecionada={setCadeiraSelecionada}
                        listaOptativas={listaOptativasDisponiveis}
                        onTrocarOptativa={handleTrocarOptativa}
                        cadeirasPagas={cadeirasPagas}
                        pagarCadeira={pagarCadeira}
                    />
                ))}

                {Object.keys(grade).length < 14 && (
                    <div
                        className="zona-novo-periodo"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const nomeCadeira = e.dataTransfer.getData("text/plain");
                            if (nomeCadeira) {
                                const periodosOcupados = Object.entries(grade).filter(([_, lista]) => lista.length > 0).length;
                                const proximoPeriodo = Math.max(periodosOcupados + 1, 1);
                                moverCadeira(nomeCadeira, proximoPeriodo);
                            }
                        }}
                    >
                        <div className="conteudo-zona-novo">
                            <strong>+ Novo período</strong>
                            <p className="subtexto-zona">Arraste uma cadeira para criar.</p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="rodape-autores">
                Criado por{' '}
                <a href="https://github.com/rebecamdrs" target="_blank" rel="noopener noreferrer">
                    Rebeca Medeiros
                </a>{' '}
                e{' '}
                <a href="https://github.com/roanmotta" target="_blank" rel="noopener noreferrer">
                    Roan Motta
                </a>
            </footer>
        </div>
    )
}