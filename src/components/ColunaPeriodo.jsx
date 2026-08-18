import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({ numeroPeriodo, nomesCadeiras = [], buscarCadeira, onMoverCadeira }) {
  return (
    <div className="coluna-periodo"
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