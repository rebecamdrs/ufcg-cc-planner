import toast from 'react-hot-toast'

export function useToasts() {
    /**
     * Exibe um toast de erro customizado na tela.
     * Utilizado para bloquear ações inválidas (ex: mover cadeira violando pré-requisitos).
     */
    function dispararToastErro(mensagem) {
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
        ), { id: 'erro-movimentacao', duration: 4000 })
    }

    /**
     * Exibe um toast de aviso na tela.
     * Utilizado para sinalizar impedimentos do usuário (ex: tentar pagar cadeira sem requisitos).
     */
    function dispararToastAlerta(mensagem) {
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
        ), { id: 'alerta-requisito', duration: 4000 })
    }

    return { dispararToastErro, dispararToastAlerta }
}