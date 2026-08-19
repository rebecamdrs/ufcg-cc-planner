export function CardCadeira({ cadeira, cadeiraSelecionada, setCadeiraSelecionada, excesso }) {
    if (!cadeira) return null;

    // remove acentos, letras maiúsculas e espaços das pontas
    function normalizar(texto) {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    const nomeAtual = normalizar(cadeira.nome);
    const nomeSelecionada = normalizar(cadeiraSelecionada?.nome);

    // verifica se esse card é o que está selecionado (com mouse em cima)
    const isSelecionado = nomeSelecionada && nomeAtual === nomeSelecionada;

    // puxa os pre-requisitos da cadeira selecionada
    const listaRequisitos = cadeiraSelecionada?.prerequisitos || [];

    // verifica se este card é pre-requisito da cadeira selecionada
    function isPreRequisito() {
        if (!listaRequisitos || listaRequisitos.length === 0) return false;

        for (const requisito of listaRequisitos) {
            const requisitoLimpo = normalizar(requisito);
            if (requisitoLimpo === nomeAtual) return true;
        }
        return false;
    }

    // classe condicional
    let statusClass = "";
    if (isSelecionado) {
        statusClass = "card-ativo";
    } else if (isPreRequisito()) {
        statusClass = "card-prerequisito";
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
                    title="Limite de 6 cadeiras por período excedido"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Aviso: ultrapassa limite de 6 cadeiras por período.`);
                    }}
                    style={styles.bolinhaAlerta}
                >
                    !
                </span>
            )}

            <strong className="titulo-cadeira">{cadeira.nome}</strong>

            <span style={styles.detalhes}>
                {cadeira.creditos} cr | {cadeira.carga_horaria}h
            </span>
        </div>
    );
}

const styles = {
    detalhes: {
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.2rem',
        display: 'block'
    },
    bolinhaAlerta: {
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        width: '20px',
        height: '20px',
        backgroundColor: '#e53935',
        color: '#ffffff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        userSelect: 'none',
        zIndex: 10
    }
};