export function CardCadeira({ cadeira, cadeiraSelecionada, setCadeiraSelecionada, excesso }) {
    if (!cadeira) return null

    // remove acentos, letras maiúsculas e espaços das pontas
    function normalizar(texto) {
        if (!texto) return ""
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    }

    const nomeAtual = normalizar(cadeira.nome)
    const nomeSelecionada = normalizar(cadeiraSelecionada?.nome)

    // verifica se esse card é o que está selecionado (com mouse em cima)
    const isSelecionado = nomeSelecionada && nomeAtual === nomeSelecionada

    // puxa os pre-requisitos da cadeira selecionada
    const listaRequisitos = cadeiraSelecionada?.prerequisitos || []

    // verifica se este card é pre-requisito da cadeira selecionada
    function isPreRequisito() {
        if (!listaRequisitos || listaRequisitos.length === 0) return false

        for (const requisito of listaRequisitos) {
            if (normalizar(requisito) === nomeAtual) return true
        }
        return false;
    }

    function isBloqueada() {
        if (!nomeSelecionada || isSelecionado) return false

        const requisitosAtual = cadeira.prerequisitos || []
        for (const requisito of requisitosAtual) {
            if (normalizar(requisito) === nomeSelecionada) return true
        }
        return false
    }

    // classe condicional
    let statusClass = ""
    let aviso = ""
    if (isSelecionado) {
        statusClass = "card-ativo"
    } else if (isPreRequisito()) {
        statusClass = "card-prerequisito"
        aviso = "Pré-requisito"
    } else if (isBloqueada()) {
        statusClass = "card-bloqueado"
        aviso = "Libera"
    }

    return (
        <div
            className={`card-cadeira ${statusClass}`}
            style={{ position: 'relative' }}
            draggable={true}
            onMouseEnter={() => setCadeiraSelecionada(cadeira)}
            onMouseLeave={() => setCadeiraSelecionada(null)}
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", cadeira.nome);
            }}
        >
            {excesso && (
                <span
                    className="bolinha-alerta"
                    title="Limite de 6 cadeiras por período excedido"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Aviso: ultrapassa limite de 6 cadeiras por período.`);
                    }}
                >
                    !
                </span>
            )}

            {aviso && (
                <span className="aviso-status">
                    {aviso}
                </span>
            )}

            <strong className="titulo-cadeira">{cadeira.nome}</strong>

        </div>
    );
}