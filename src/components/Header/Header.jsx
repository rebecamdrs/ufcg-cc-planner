import "./header.css"

export function Header({ onResetMantendoOptativas, onResetTotal }) {
    return (
        <header className="header-app">
            <div>
                <span className="tag-header">Matriz Curricular</span>
                <h1 className="titulo-principal">Planner CC</h1>
            </div>
            <div className="botoes-header">
                <button
                    className="botao-reset botao-reset-secundario"
                    onClick={onResetMantendoOptativas}
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
                    onClick={onResetTotal}
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
    )
}