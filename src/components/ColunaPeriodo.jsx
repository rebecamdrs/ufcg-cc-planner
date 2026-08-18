import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({ numeroPeriodo, nomesCadeiras, buscarCadeira }) {
    return (
        <div style={styles.coluna}>
            <h3 style={styles.titulo}>{numeroPeriodo}º Período</h3>

            <div style={styles.lista}>
                {nomesCadeiras.map((nome, index) => {
                    const cadeira = buscarCadeira(nome);
                    return <CardCadeira key={index} cadeira={cadeira} />;
                })}
            </div>
        </div>
    );
}

const styles = {
    coluna: {
        minWidth: '240px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    titulo: {
        margin: 0,
        borderBottom: '2px solid #ddd',
        paddingBottom: '0.5rem'
    },
    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    }
};