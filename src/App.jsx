import { useEffect, useState } from "react"; // Hooks

function App() {
    const [cadeiras, setCadeiras] = useState([]);

    useEffect(() => {
        // Carrega os dados do PPC
        fetch('https://raw.githubusercontent.com/daltonserey/ppc-2023-em-dados/master/dados/disciplinas.json')
            .then(resposta => resposta.json()) // Converte a resposta para JSON
            .then(dados => setCadeiras(dados)) // Salva os dados convertidos no estado
    }, [])

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Cadeiras CC</h1>
            <p>Total de cadeiras carregadas: {cadeiras.length}</p>

            <ul>
                {cadeiras.map((cadeira) => (
                    <li key={cadeira.id || cadeira.codigo}>
                        {cadeira.nome}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;