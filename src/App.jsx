import { useEffect, useState } from "react"; // Hooks
import { MAPA_PERIODOS } from "./constants/mapa_periodos";
import { ColunaPeriodo } from "./components/ColunaPeriodo";

function App() {
    const [cadeiras, setCadeiras] = useState([]);

    useEffect(() => {
        // Carrega os dados do PPC
        fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
            .then(resposta => resposta.json()) // Converte a resposta para JSON
            .then(dados => setCadeiras(dados)) // Salva os dados convertidos no estado
            .catch(erro => console.error("Erro ao carregar dados:", erro));
    }, [])

    // Busca os detalhes da cadeira
    function buscarCadeira(nome) {
        const padrao = { nome: nome, creditos: '-', carga_horaria: '-' };
        return cadeiras.find(c => c.nome === nome) || padrao;
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Cadeiras CC</h1>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', overflowX: 'auto', alignItems: 'flex-start' }}>
                {Object.entries(MAPA_PERIODOS).map(([periodo, nomesCadeiras]) => (
                    <ColunaPeriodo
                        key={periodo}
                        numeroPeriodo={periodo}
                        nomesCadeiras={nomesCadeiras}
                        buscarCadeira={buscarCadeira}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;