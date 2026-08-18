export function CardCadeira({ cadeira }) {
  if (!cadeira) return null;

  return (
    <div
      style={styles.card}
      draggable="true" //torna o elemento arrastável
      onDragStart={(e) => { //quando user começa a arrastar, guarda a cadeira 
        e.dataTransfer.setData("text/plain", cadeira.nome); // salva nome da cadeira
      }}
    >
      <strong style={styles.titulo}>{cadeira.nome}</strong>
      <span style={styles.detalhes}>
        {cadeira.creditos} cr | {cadeira.carga_horaria}h
      </span>
    </div>
  );
}

const styles = {
  card: {
    padding: '0.8rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: '#ffffff'
  },
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