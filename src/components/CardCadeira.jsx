export function CardCadeira({ cadeira, cadeiraSelecionada, setCadeiraSelecionada }) {
    if (!cadeira) return null;

    // remove acentos, letras maiúsculas e espaços das pontas
    function normalizar(texto) {
        if (!texto) return ""
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    }

    const nomeAtual = normalizar(cadeira.nome);
    const nomeSelecionada = normalizar(cadeiraSelecionada?.nome);

    // verifica se esse card é o que esta selecionado (com mouse)
    const isSelecionado = nomeSelecionada && nomeAtual === nomeSelecionada

    // puxa os pre requisitos da cadeira selecionada
    const listaRequisitos = cadeiraSelecionada?.prerequisitos || [];

    // verifica se sse card é pre requisito da cadeira selecionada
    function isPreRequisito() {
        if (!listaRequisitos || listaRequisitos.length === 0) return false

        for (const requisito of listaRequisitos) {
            const requisitoLimpo = normalizar(requisito);
            if (requisitoLimpo === nomeAtual) return true
        }
        return false
    }

    // classe condicional
    let statusClass = ""
    if (isSelecionado) {
        statusClass = "card-ativo"
    } else if (isPreRequisito()) {
        statusClass = "card-prerequisito"
    }

    return (
        <div
            className={`card-cadeira ${statusClass}`}
            draggable={true}
            onMouseEnter={() => setCadeiraSelecionada(cadeira)}
            onMouseLeave={() => setCadeiraSelecionada(null)}
            onDragStart={(e) => { //quando user começa a arrastar, guarda a cadeira 
                e.dataTransfer.setData("text/plain", cadeira.nome); // salva nome da cadeira
            }}
        >
            <strong className="titulo-cadeira">{cadeira.nome}</strong>
        </div>
    )
}