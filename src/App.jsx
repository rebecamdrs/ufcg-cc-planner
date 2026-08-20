import { useState } from "react"
import { Toaster } from 'react-hot-toast'

import { Header } from "./components/Header"
import { ColunaPeriodo } from "./components/ColunaPeriodo"
import { NovoPeriodo } from "./components/NovoPeriodo"
import { Footer } from "./components/Footer"

import { useCadeiras } from "./hooks/useCadeiras"
import { useCadeirasPagas } from "./hooks/useCadeirasPagas"
import { useGrade } from "./hooks/useGrade"
import { useToasts } from "./hooks/useToasts"
import "./App.css"

export default function App() {

    // guarda a cadeira que o mouse ta em cima
    const [cadeiraSelecionada, setCadeiraSelecionada] = useState(null)

    const { dispararToastErro, dispararToastAlerta } = useToasts()
    const { cadeiras, buscarCadeira, listaOptativasDisponiveis } = useCadeiras()

    const { cadeirasPagas, pagarCadeira } = useCadeirasPagas(cadeiras, () => dispararToastAlerta('Pré-Requisitos não foram atendidos.'))

    const { grade, resetarGrade, resetarMantendoOptativas, handleTrocarOptativa, moverCadeira } = useGrade({ cadeiras, cadeirasPagas, buscarCadeira, dispararToastErro })

    return (
        <div className="container-principal">
            <Toaster position="top-right" reverseOrder={false} />

            <Header
                onResetMantendoOptativas={resetarMantendoOptativas}
                onResetTotal={resetarGrade}
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