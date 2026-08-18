import { useEffect, useState } from "react";
import { MAPA_PERIODOS } from "./constants/mapa_periodos";
import { ColunaPeriodo } from "./components/ColunaPeriodo";

function App() {
    //cadeiras iniciais
  const [cadeiras, setCadeiras] = useState([]);
  // grade inicial
  const [grade, setGrade] = useState(MAPA_PERIODOS);

  // Busca as cadeiras do json externo oficial do ppc-2023-em-dados do Prof. Dalton Serey, atualizando constantemente
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
      .then(resposta => resposta.json())
      .then(dados => setCadeiras(dados))
      .catch(erro => console.error("Erro ao carregar dados:", erro));
  }, []);

  // busca cadeira a partir do nome, caso nao encontre retorna objeto padrao
  function buscarCadeira(nome) {
    const padrao = { nome: nome, creditos: '-', carga_horaria: '-' };
    return cadeiras.find(c => c.nome === nome) || padrao;
  }

  // move cadeira para novo periodo
  function moverCadeira(nomeCadeira, novoPeriodo) {
    const periodoDestino = Number(novoPeriodo); //transforma periodo destino em numero

    setGrade((gradeAtual) => {
      const novaGrade = {};
      // percorre cada periodo dentro da grade atual:
      for (const p in gradeAtual) {
        //pega periodo, acessa lista de materias, cria nova lista filtrando a cadeira que foi movida
        novaGrade[Number(p)] = gradeAtual[p].filter((n) => n !== nomeCadeira);
      }
      //insere a materia nova no periodo
      if (novaGrade[periodoDestino]) {
        novaGrade[periodoDestino] = [...novaGrade[periodoDestino], nomeCadeira];
      }

      return novaGrade;
    });
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Cadeiras CC</h1>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', overflowX: 'auto', alignItems: 'flex-start' }}>
        {Object.entries(grade).map(([periodo, nomesCadeiras]) => (
          <ColunaPeriodo
            key={periodo}
            numeroPeriodo={Number(periodo)} 
            nomesCadeiras={nomesCadeiras}
            buscarCadeira={buscarCadeira}
            onMoverCadeira={moverCadeira}
          />
        ))}
      </div>
    </div>
  );
}

export default App;