import { useEffect, useState, useMemo } from "react"
import { MAPA_PERIODOS } from "./constants/mapa_periodos"
import { ColunaPeriodo } from "./components/ColunaPeriodo"
import "./App.css"
import iconeLixeira from "./assets/icone-lixeira.svg"
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

    function resetarGrade() {
        if (confirm("Deseja restaurar a matriz curricular padrão?")) {
            setGrade(MAPA_PERIODOS)
        }
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

    const [cadeirasPagas, setCadeirasPagas] = useState([])

    // atualiza a lista de cadeiras pagas
    function pagarCadeira(nomeCadeira) {
        setCadeirasPagas((listaAnterior) => {
            // se a cadeira ja esta na lista, remove (desmarca)
            if (cadeirasPagas.includes(nomeCadeira)) {
                return listaAnterior.filter((nome) => nome !== nomeCadeira)
            }
            // se nao estiver, adiciona no final da lista (marca)
            return [...listaAnterior, nomeCadeira]
        })
    }

    /* verofica se uma cadeira está liberada para pagar */
    function isLiberada(cadeira, cadeirasPagas) {
        const requisitos = cadeira.prerequisitos || []
        // se  não tem pré-requisitos, está liberada
        if (requisitos.length === 0) return true

        // fica liberada se todos os requisitos estiverem na lista de pagas
        for (const requisito of requisitos) {
            if (!cadeirasPagas.includes(requisito)) {
                return false
            }
        }
        return true
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
                <button className="botao-reset" onClick={resetarGrade}>
                    <img src={iconeLixeira} alt="Resetar" className="icone-lixeira" />
                    <span>Resetar Grade</span>
                </button>
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