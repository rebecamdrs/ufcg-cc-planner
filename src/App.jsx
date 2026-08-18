import { useEffect, useState } from "react"; // Hooks
import { MAPA_PERIODOS } from "./constants/mapa_periodos";
import { ColunaPeriodo } from "./components/ColunaPeriodo";
import "./App.css";

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
        <div className="container-principal">
            <h1>Cadeiras CC</h1>

            <div className="container-periodos" >
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