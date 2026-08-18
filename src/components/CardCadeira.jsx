export function CardCadeira({ cadeira }) {
  if (!cadeira) return null;

  return (
    <div
      className="card-cadeira"
      draggable={true}
      onDragStart={(e) => { //quando user começa a arrastar, guarda a cadeira 
        e.dataTransfer.setData("text/plain", cadeira.nome); // salva nome da cadeira
      }}
    >
      <strong style={styles.titulo}>{cadeira.nome}</strong>
    </div>
  );
}

const styles = {
  titulo: {
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '0.3rem'
  }
};