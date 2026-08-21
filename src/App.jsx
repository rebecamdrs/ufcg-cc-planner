import { useState } from "react"
import { Toaster } from 'react-hot-toast'

import { Header } from "./components/Header/Header"
import { ColunaPeriodo } from "./components/ColunaPeriodo/ColunaPeriodo"
import { NovoPeriodo } from "./components/NovoPeriodo/NovoPeriodo"
import { Footer } from "./components/Footer/Footer"

import { useCadeiras } from "./hooks/useCadeiras.js"
import { useCadeirasPagas } from "./hooks/useCadeirasPagas.js"
import { useGrade } from "./hooks/useGrade.js"
import { useToasts } from "./hooks/useToasts.jsx"
import "./App.css"

export default function App() {

    // guarda a cadeira que o mouse ta em cima
    const [cadeiraSelecionada, setCadeiraSelecionada] = useState(null)

    const { dispararToastErro, dispararToastAlerta } = useToasts()
    const { cadeiras, buscarCadeira, listaOptativasDisponiveis } = useCadeiras()

    const { cadeirasPagas, pagarCadeira, limparCadeirasPagas } = useCadeirasPagas(
        cadeiras,
        () => dispararToastAlerta('Pré-Requisitos não foram atendidos.')
    )

    const { grade, resetarGrade, resetarMantendoOptativas, handleTrocarOptativa, moverCadeira } = useGrade({ cadeiras, cadeirasPagas, buscarCadeira, dispararToastErro })

    const handleResetTotal = () => {
        limparCadeirasPagas()
        resetarGrade()
    }

    return (
        <div className="container-principal">
            <Toaster position="top-right" reverseOrder={false} />

            <Header
                onResetMantendoOptativas={resetarMantendoOptativas}
                onResetTotal={handleResetTotal}
            />

            <div className="container-periodos">
                {Object.entries(grade).map(([periodo, nomesCadeiras]) => (
                    <ColunaPeriodo
                        key={periodo}
                        numeroPeriodo={Number(periodo)}
                        nomesCadeiras={nomesCadeiras}
                        buscarCadeira={buscarCadeira}
                        onMoverCadeira={moverCadeira}
                        cadeiraSelecionada={cadeiraSelecionada}
                        setCadeiraSelecionada={setCadeiraSelecionada}
                        listaOptativas={listaOptativasDisponiveis}
                        onTrocarOptativa={handleTrocarOptativa}
                        cadeirasPagas={cadeirasPagas}
                        pagarCadeira={pagarCadeira}
                    />
                ))}

                <NovoPeriodo grade={grade} onMoverCadeira={moverCadeira} />
            </div>

            <Footer />
        </div>
    )
}