export function CardCadeira({ cadeira, excesso }) {
  if (!cadeira) return null;

  return (
    <div
      className="card-cadeira"
      style={styles.card}
      draggable="true" //torna o elemento arrastável
      onDragStart={(e) => { //quando user começa a arrastar, guarda a cadeira 
        e.dataTransfer.setData("text/plain", cadeira.nome); // salva nome da cadeira
      }}
    >
        {excesso && (
        <span
          title="Limite de 6 cadeiras por período excedido"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Aviso: ultrapaasa limite de 6 cadeiras por período.`);
          }}
          style={styles.bolinhaAlerta}
        >
          !
        </span>
      )}
      <strong style={styles.titulo}>
       {cadeira.nome}
      </strong>
      <span style={styles.detalhes}>
        {cadeira.creditos} cr | {cadeira.carga_horaria}h
      </span>
    </div>
  );
}

const styles = {
    card: {
    position: 'relative'
    },
  titulo: {
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '0.3rem'
  },
  detalhes: {
    fontSize: '0.75rem',
    color: '#666'
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
    userSelect: 'none'
}
};