import "./header.css"
import { ModalConfirmacao } from '../ModalConfirmacao/ModalConfirmacao'
import { useState } from 'react'

export function Header({ onResetMantendoOptativas, onResetTotal }) {

    // Estados para controlar a exibição dos modais
    const [modalResetTotalAberto, setModalResetTotalAberto] = useState(false)
    const [modalResetOptativasAberto, setModalResetOptativasAberto] = useState(false)

    // Handlers que executam a ação e fecham o modal correspondente
    const handleConfirmarOptativas = () => {
        onResetMantendoOptativas()
        setModalResetOptativasAberto(false)
    }

    const handleConfirmarTotal = () => {
        onResetTotal()
        setModalResetTotalAberto(false)
    }

    return (
        <header className="header-app">
            <div>
                <span className="tag-header">Matriz Curricular</span>
                <h1 className="titulo-principal">Planner CC</h1>
            </div>
            <div className="botoes-header">
                <button
                    className="botao-reset botao-reset-secundario"
                    onClick={() => setModalResetOptativasAberto(true)}
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
                    onClick={() => setModalResetTotalAberto(true)}
                    title="Restaura a matriz original"
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

            <ModalConfirmacao
                isOpen={modalResetOptativasAberto}
                titulo="Restaurar Matriz?"
                mensagem="Esta ação restaurará a matriz para o estado inicial padrão, mantendo suas optativas selecionadas e cadeiras pagas."
                onClose={() => setModalResetOptativasAberto(false)}
                onConfirm={handleConfirmarOptativas}
            />

            <ModalConfirmacao
                isOpen={modalResetTotalAberto}
                titulo="Reset Total?"
                mensagem="Esta ação apagará as alterações e voltará a matriz original."
                onClose={() => setModalResetTotalAberto(false)}
                onConfirm={handleConfirmarTotal}
            />
        </header>
    )
}