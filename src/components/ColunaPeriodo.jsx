import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({ numeroPeriodo, nomesCadeiras = [], buscarCadeira, onMoverCadeira }) {
  return (
    <div
      style={styles.coluna}
      onDragOver={(e) => e.preventDefault()} //quando arrastado sobre, permite o drop (previne padrao)
      onDrop={(e) => {
        e.preventDefault(); //quando dropado, mesma coisa
        const nomeCadeira = e.dataTransfer.getData("text/plain"); //salva nome da cadeira
        if (onMoverCadeira && nomeCadeira) { //se func existir e nome da cadeira existir, move para o periodo
          onMoverCadeira(nomeCadeira, numeroPeriodo); 
        }
      }}
    >
      <h3 style={styles.titulo}>{numeroPeriodo}º Período</h3>

      <div style={styles.lista} onDragOver={(e) => e.preventDefault()} // permite o drop na lista
        > 
        {nomesCadeiras.map((nome) => {
          const cadeira = buscarCadeira(nome); //localiza cadeira
          return <CardCadeira key={nome} cadeira={cadeira} />; //retorna objeto de card cadeira
        })}
      </div>
    </div>
  );
}

const styles = {
  coluna: {
    minWidth: '215px',
    minHeight: '80vh',
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