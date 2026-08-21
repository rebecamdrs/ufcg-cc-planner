import './modal-confirmacao.css'

export function ModalConfirmacao({ isOpen, titulo, mensagem, onConfirm, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icone-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h3 className="modal-titulo">{titulo}</h3>
        <p className="modal-mensagem">{mensagem}</p>
        <div className="modal-acoes">
          <button className="btn-modal-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-modal-confirmar" onClick={() => { onConfirm(); onClose(); }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}