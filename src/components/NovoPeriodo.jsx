export function ZonaNovoPeriodo({ grade, onMoverCadeira }) {
    if (Object.keys(grade).length >= 14) return null

    function handleDrop(e) {
        e.preventDefault()
        const nomeCadeira = e.dataTransfer.getData("text/plain")
        if (nomeCadeira) {
            const periodosOcupados = Object.entries(grade).filter(([_, lista]) => lista.length > 0).length
            const proximoPeriodo = Math.max(periodosOcupados + 1, 1)
            onMoverCadeira(nomeCadeira, proximoPeriodo)
        }
    }

    return (
        <div
            className="zona-novo-periodo"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div className="conteudo-zona-novo">
                <strong>+ Novo período</strong>
                <p className="subtexto-zona">Arraste uma cadeira para criar.</p>
            </div>
        </div>
    )
}