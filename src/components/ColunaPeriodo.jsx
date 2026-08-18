import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({numeroPeriodo, nomesCadeiras, buscarCadeira}) {
    return (
        <div className="coluna-periodo">
            <h3 style={styles.titulo}>{numeroPeriodo}º Período</h3>

            <div style={styles.lista}>
                {nomesCadeiras.map((nome, index) => {
                    const cadeira = buscarCadeira(nome);
                    return (
                        <CardCadeira
                            key={index}
                            cadeira={cadeira}
                            periodo={numeroPeriodo}
                        />
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    titulo: {
        fontSize: '1.1rem',
        marginBottom: '0.8rem',
        borderBottom: '2px solid #ddd',
        paddingBottom: '0.4rem'
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    }
};