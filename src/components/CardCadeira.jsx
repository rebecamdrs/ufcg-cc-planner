export function CardCadeira({ cadeira, periodo }) {
    if (!cadeira) return null;

    return (
        <div className="card-cadeira">
            <strong style={styles.titulo}>{cadeira.nome}</strong>
            <span style={styles.detalhes}>
                {cadeira.creditos} cr | {cadeira.carga_horaria}h
            </span>
        </div>
    );
}

const styles = {
    titulo: {
        fontSize: '0.9rem',
        display: 'block',
        marginBottom: '0.3rem'
    },
    detalhes: {
        fontSize: '0.75rem',
        color: '#666'
    }
};