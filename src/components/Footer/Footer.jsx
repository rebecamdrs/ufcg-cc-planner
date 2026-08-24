import { useState } from "react"
import "./footer.css"

export function Footer() {
    const [modalAberto, setModalAberto] = useState(false)

    return (
        <>
            <footer className="rodape-wrapper">
                <button
                    type="button"
                    className="rodape-aviso-btn"
                    onClick={() => setModalAberto(true)}
                >
                    <span className="aviso-icone">ⓘ</span>
                    <span>Site não oficial</span>
                </button>
                <div className="rodape-autores">
                    <span>Criado por</span>
                    <a href="https://github.com/rebecamdrs" target="_blank" rel="noopener noreferrer">
                        Rebeca Medeiros
                    </a>
                    <span>e</span>
                    <a href="https://github.com/roanmotta" target="_blank" rel="noopener noreferrer">
                        Roan Motta
                    </a>
                    <a
                        href="https://github.com/rebecamdrs/ufcg-cc-planner"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                        title="Ver repositório no GitHub"
                    >
                        <svg height="15" width="15" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                    </a>
                </div>
            </footer>
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-aviso" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-aviso-topo">
                            <span className="modal-alerta-icon">⚠️</span>
                            <h3>Aviso Importante</h3>
                        </div>
                        <p>
    Este é um <strong>site não oficial</strong> desenvolvido por alunos e <strong>não substitui a{' '}
    <a 
        href="https://cgcc.ufcg.edu.br/pre-matricula/" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        pré-matrícula
    </a></strong> nem os sistemas oficiais da UFCG.
</p>
<p>
    As informações e pré-requisitos podem sofrer alterações ou estarem desatualizadas. Em caso de dúvidas, consulte o{' '}
    <a 
        href="https://sigaa.ufcg.edu.br/" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        SIGAA
    </a>, o{' '}
    <a 
        href="https://github.com/daltonserey/ppc-2023-em-dados" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        Plano de Curso oficial (PPC)
    </a>{' '}
    ou procure a <strong>Coordenação do Curso</strong>.
</p>
                        <button
                            type="button"
                            className="modal-fechar-btn"
                            onClick={() => setModalAberto(false)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}