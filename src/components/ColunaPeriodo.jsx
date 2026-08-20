import { CardCadeira } from "./CardCadeira";

export function ColunaPeriodo({
  numeroPeriodo,
  nomesCadeiras = [],
  buscarCadeira,
  onMoverCadeira,
  cadeiraSelecionada,
  setCadeiraSelecionada,
  listaOptativas,
  onTrocarOptativa,
  cadeirasPagas,
  pagarCadeira
}) {

  const cadeirasColuna = nomesCadeiras
    .map((nome) => buscarCadeira(nome))
    .filter(Boolean);

  const totalCadeiras = nomesCadeiras.length;

  return (
    <div className="coluna-periodo-wrapper">

      <div className="header-periodo-top">
        <h2 className="titulo-periodo">{numeroPeriodo}° Período</h2>
        <span className="contagem-cadeiras">{totalCadeiras} cad</span>
      </div>

      <div
        className="coluna-periodo"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const nomeCadeira = e.dataTransfer.getData("text/plain");
          if (onMoverCadeira && nomeCadeira) {
            onMoverCadeira(nomeCadeira, numeroPeriodo);
          }
        }}
      >
        {cadeirasColuna.map((cadeira, index) => (
          <CardCadeira
            key={cadeira.nome || index}
            cadeira={cadeira}
            excesso={index >= 6}
            cadeiraSelecionada={cadeiraSelecionada}
            setCadeiraSelecionada={setCadeiraSelecionada}
            listaOptativas={listaOptativas}
            onSelecionarOptativa={(nomeEscolhido) =>
              onTrocarOptativa(numeroPeriodo, index, nomeEscolhido, cadeira.nome)
            }
            cadeirasPagas={cadeirasPagas}
            pagarCadeira={pagarCadeira}
          />
        ))}
      </div>

    </div>
  );
}