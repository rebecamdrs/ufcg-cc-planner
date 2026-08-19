import { useEffect, useState } from "react"
import { MAPA_PERIODOS } from "./constants/mapa_periodos"
import { ColunaPeriodo } from "./components/ColunaPeriodo"
import "./App.css"
import iconeLixeira from "./assets/icone-lixeira.svg"

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

    // Busca as cadeiras do json do git
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
            .then(resposta => resposta.json())
            .then(dados => setCadeiras(dados))
            .catch(erro => console.error("Erro ao carregar dados:", erro))
    }, [])

    // busca cadeira a partir do nome
    function buscarCadeira(nome) {
        const padrao = { nome: nome, creditos: '-', carga_horaria: '-' }
        return cadeiras.find(c => c.nome === nome) || padrao
    }

    // move cadeira para novo periodo
    function moverCadeira(nomeCadeira, novoPeriodo) {
        const periodoDestino = Number(novoPeriodo);

        setGrade((gradeAtual) => {
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