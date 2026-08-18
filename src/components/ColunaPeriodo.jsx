import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({ numeroPeriodo, nomesCadeiras = [], buscarCadeira, onMoverCadeira }) {

  // Busca todas as cadeiras da coluna para calcular os créditos
  const cadeirasColuna = nomesCadeiras
    .map((nome) => buscarCadeira(nome))
    .filter(Boolean);

  const totalCadeiras = nomesCadeiras.length;

  return (
    <div className="coluna-periodo-wrapper">

      <div className="header-periodo-top">
        <h2 className="titulo-periodo">{numeroPeriodo}° Período</h2>
        <span className="contagem-disciplinas">{totalCadeiras} cadeiras</span>
      </div>

      <div
        className="coluna-periodo"
        onDragOver={(e) => e.preventDefault()} //quando arrastado sobre, permite o drop (previne padrao)
        onDrop={(e) => {
          e.preventDefault(); //quando dropado, mesma coisa
          const nomeCadeira = e.dataTransfer.getData("text/plain"); //salva nome da cadeira
          if (onMoverCadeira && nomeCadeira) { //se func existir e nome da cadeira existir, move para o periodo
            onMoverCadeira(nomeCadeira, numeroPeriodo);
          }
        }}
      >
        {cadeirasColuna.map((cadeira) => (
          <CardCadeira key={cadeira.nome || cadeira.id} cadeira={cadeira} />
        ))}
      </div>
      
    </div>
  );
}